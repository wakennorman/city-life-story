#!/usr/bin/env python3
"""
SiliconFlow proxy: translates Anthropic Messages API ↔ OpenAI Chat Completions API
so Claude Code can use api.siliconflow.cn (OpenAI-only endpoint).

Usage:  python proxy-siliconflow.py [port]
Default port: 8090
"""

import http.server
import json
import sys
import signal
import urllib.request
import urllib.error

TARGET = "https://api.siliconflow.cn/v1"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8090


def anthropic_to_openai(body):
    """Convert Anthropic Messages API request -> OpenAI Chat Completions request."""
    messages = []

    # Extract system prompt
    system_text = None
    system = body.pop("system", None)
    if system:
        if isinstance(system, list):
            texts = []
            for c in system:
                if isinstance(c, dict):
                    if c.get("type") == "text":
                        texts.append(c.get("text", ""))
                    elif c.get("type") == "thinking":
                        texts.append(f"[thinking]{c.get('thinking', '')}[/thinking]")
            system_text = "\n".join(texts)
        else:
            system_text = system

    # Convert each message
    for msg in body.get("messages", []):
        role = msg["role"]
        content = msg.get("content", "")

        # ── system role ──
        if role == "system":
            if isinstance(content, list):
                texts = [c["text"] for c in content if isinstance(c, dict) and c.get("type") == "text"]
                content = "\n".join(texts)
            system_text = (system_text + "\n" + content) if system_text else content
            continue

        # ── user role with tool_result blocks ──
        if role == "user" and isinstance(content, list):
            for block in content:
                if not isinstance(block, dict):
                    continue
                if block.get("type") == "tool_result":
                    # Convert each tool_result to a tool-role message
                    tool_content = _extract_text(block.get("content", ""))
                    messages.append({
                        "role": "tool",
                        "tool_call_id": block.get("tool_use_id", ""),
                        "content": tool_content,
                    })
                elif block.get("type") == "text":
                    messages.append({"role": "user", "content": block.get("text", "")})
            continue

        # ── assistant role with tool_use blocks ──
        if role == "assistant" and isinstance(content, list):
            text_parts = []
            tool_calls = []
            for block in content:
                if not isinstance(block, dict):
                    continue
                t = block.get("type", "")
                if t == "text":
                    text_parts.append(block.get("text", ""))
                elif t == "thinking":
                    text_parts.append(f"[thinking]{block.get('thinking', '')}[/thinking]")
                elif t == "tool_use":
                    tool_calls.append({
                        "id": block.get("id", f"call_{len(tool_calls)}"),
                        "type": "function",
                        "function": {
                            "name": block.get("name", ""),
                            "arguments": json.dumps(block.get("input", {})),
                        },
                    })
            if tool_calls:
                oai_msg = {"role": "assistant", "content": "\n".join(text_parts) if text_parts else None}
                oai_msg["tool_calls"] = tool_calls
                messages.append(oai_msg)
            elif text_parts:
                messages.append({"role": "assistant", "content": "\n".join(text_parts)})
            continue

        # ── plain content: convert blocks to string ──
        if isinstance(content, list):
            texts = []
            for c in content:
                if isinstance(c, dict):
                    if c.get("type") == "text":
                        texts.append(c.get("text", ""))
                    elif c.get("type") == "thinking":
                        texts.append(f"[thinking]{c.get('thinking', '')}[/thinking]")
            content = "\n".join(texts)
        messages.append({"role": role, "content": content})

    model = body.get("model", "deepseek-v4-flash")

    oai_body = {
        "model": model,
        "messages": messages,
        "max_tokens": body.get("max_tokens", 4096),
        "stream": body.get("stream", False),
    }

    # ── System prompt ──
    if system_text:
        messages.insert(0, {"role": "system", "content": system_text})

    # ── Tools conversion: Anthropic -> OpenAI function calling ──
    tools = body.get("tools")
    if tools:
        oai_tools = []
        for tool in tools:
            if not isinstance(tool, dict):
                continue
            oai_tools.append({
                "type": "function",
                "function": {
                    "name": tool.get("name", ""),
                    "description": tool.get("description", ""),
                    "parameters": tool.get("input_schema", {}),
                },
            })
        oai_body["tools"] = oai_tools

    # ── Tool choice conversion ──
    tool_choice = body.get("tool_choice")
    if tool_choice:
        if isinstance(tool_choice, dict):
            tc_type = tool_choice.get("type", "auto")
            if tc_type == "auto":
                oai_body["tool_choice"] = "auto"
            elif tc_type == "any":
                # OpenAI "required" ≈ Anthropic "any"
                oai_body["tool_choice"] = "required"
            elif tc_type == "tool":
                tool_name = tool_choice.get("name", "")
                oai_body["tool_choice"] = {"type": "function", "function": {"name": tool_name}}
            else:
                oai_body["tool_choice"] = "auto"

    # Optional params
    for k in ("temperature", "top_p", "stop"):
        if k in body:
            oai_body[k] = body[k]

    return oai_body


def _extract_text(content):
    """Extract plain text from a string, list of blocks, or None."""
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        texts = []
        for c in content:
            if isinstance(c, dict) and c.get("type") == "text":
                texts.append(c.get("text", ""))
        return "\n".join(texts)
    return str(content)


def _map_stop_reason(finish_reason):
    mapping = {
        "stop": "end_turn",
        "length": "max_tokens",
        "content_filter": "content_filter",
        "tool_calls": "tool_use",
    }
    return mapping.get(finish_reason, "end_turn")


def openai_to_anthropic(oai_resp, model):
    """Convert OpenAI Chat Completions response -> Anthropic Messages API response."""
    choice = (oai_resp.get("choices") or [{}])[0]
    msg = choice.get("message", {})
    content_blocks = []

    # Reasoning content (DeepSeek-style)
    reasoning = msg.get("reasoning_content") or msg.get("reasoning")
    text = msg.get("content") or ""

    # Tool calls
    tool_calls = msg.get("tool_calls")

    if reasoning and text:
        content_blocks.append({"type": "thinking", "thinking": reasoning})
        content_blocks.append({"type": "text", "text": text})
    elif reasoning and not text and not tool_calls:
        content_blocks.append({"type": "text", "text": reasoning})
    elif reasoning and not text and tool_calls:
        # Reasoning model thought first, then made tool calls
        content_blocks.append({"type": "thinking", "thinking": reasoning})
        for tc in tool_calls:
            content_blocks.append({
                "type": "tool_use",
                "id": tc.get("id", ""),
                "name": tc.get("function", {}).get("name", ""),
                "input": _parse_json_safe(tc.get("function", {}).get("arguments", "{}")),
            })
    elif text:
        content_blocks.append({"type": "text", "text": text})
        if tool_calls:
            for tc in tool_calls:
                content_blocks.append({
                    "type": "tool_use",
                    "id": tc.get("id", ""),
                    "name": tc.get("function", {}).get("name", ""),
                    "input": _parse_json_safe(tc.get("function", {}).get("arguments", "{}")),
                })
    elif tool_calls:
        # Only tool calls, no text
        content_blocks.append({"type": "text", "text": ""})
        for tc in tool_calls:
            content_blocks.append({
                "type": "tool_use",
                "id": tc.get("id", ""),
                "name": tc.get("function", {}).get("name", ""),
                "input": _parse_json_safe(tc.get("function", {}).get("arguments", "{}")),
            })

    usage = oai_resp.get("usage", {})
    anthropic_usage = {
        "input_tokens": usage.get("prompt_tokens", 0),
        "output_tokens": usage.get("completion_tokens", 0),
    }

    return {
        "id": oai_resp.get("id", "msg_sensenova"),
        "type": "message",
        "role": "assistant",
        "model": model,
        "content": content_blocks,
        "stop_reason": _map_stop_reason(choice.get("finish_reason")),
        "usage": anthropic_usage,
    }


def _parse_json_safe(s):
    """Parse JSON string, returning {} on failure."""
    try:
        return json.loads(s) if s else {}
    except (json.JSONDecodeError, TypeError):
        return {}


class ProxyHandler(http.server.BaseHTTPRequestHandler):
    """HTTP proxy handler: receives Anthropic API -> converts -> forwards to SiliconFlow."""
    protocol_version = "HTTP/1.0"   # force connection close after every request
    close_connection = True

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "proxy running"}).encode())
        self.wfile.flush()

    def do_POST(self):
        body_bytes = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        api_key = self.headers.get("x-api-key", "")

        if not api_key:
            # Also check Authorization: Bearer
            auth = self.headers.get("Authorization", "")
            if auth.startswith("Bearer "):
                api_key = auth[len("Bearer "):]

        if not api_key:
            self._send_error(401, "Missing x-api-key or Authorization: Bearer header")
            return

        try:
            an_body = json.loads(body_bytes)
        except json.JSONDecodeError as e:
            self._send_error(400, f"Invalid JSON: {e}")
            return

        is_stream = an_body.get("stream", False)
        model = an_body.get("model", "deepseek-v4-flash")
        oai_body = anthropic_to_openai(an_body)

        req_body = json.dumps(oai_body).encode()
        url = f"{TARGET}/chat/completions"
        req = urllib.request.Request(url, data=req_body)
        req.add_header("Content-Type", "application/json")
        req.add_header("Authorization", f"Bearer {api_key}")

        try:
            resp = urllib.request.urlopen(req, timeout=120)
        except urllib.error.HTTPError as e:
            error_body = e.read()
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            try:
                err_data = json.loads(error_body)
                anthropic_err = {
                    "error": {
                        "type": "api_error",
                        "message": str(err_data),
                    }
                }
                self.wfile.write(json.dumps(anthropic_err).encode())
            except Exception:
                self.wfile.write(error_body)
            return
        except Exception as e:
            self._send_error(502, f"Upstream error: {e}")
            return

        if is_stream:
            self._handle_streaming(resp, model)
        else:
            self._handle_non_streaming(resp, model)

    def _handle_non_streaming(self, resp, model):
        data = resp.read()
        try:
            oai_resp = json.loads(data)
            an_resp = openai_to_anthropic(oai_resp, model)
            body = json.dumps(an_resp).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            self._send_error(502, f"Response conversion error: {e}")

    def _handle_streaming(self, resp, model):
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Accel-Buffering", "no")
        self.end_headers()

        # State machine for Anthropic SSE content block lifecycle.
        block_index = -1
        block_type = None     # "thinking", "text", or "tool_use"
        # Accumulated partial arguments for each tool_call by OpenAI index
        tool_call_states = {}   # {openai_idx: {"id": ..., "name": ..., "args": ""}}

        try:
            buffer = b""
            done = False
            while not done:
                chunk = resp.read(4096)
                if not chunk:
                    break
                buffer += chunk
                while b"\n" in buffer:
                    line, buffer = buffer.split(b"\n", 1)
                    line = line.decode("utf-8", errors="replace").strip()
                    if not line or line.startswith(":"):
                        continue
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str.strip() == "[DONE]":
                            done = True
                            break
                        try:
                            oai_data = json.loads(data_str)
                            if not oai_data.get("choices"):
                                continue
                            block_index, block_type, tool_call_states = self._stream_process_chunk(
                                oai_data, model, block_index, block_type, tool_call_states
                            )
                        except json.JSONDecodeError:
                            pass
                if b"[DONE]" in buffer:
                    done = True
                    break
        except (BrokenPipeError, ConnectionResetError):
            return
        except Exception as e:
            print(f"Stream error: {e}", flush=True)
        finally:
            resp.close()

        # Close any open block
        if block_index >= 0:
            self._write_sse("content_block_stop", {
                "type": "content_block_stop", "index": block_index,
            })

        # Final message_stop
        try:
            self.wfile.write(
                f"event: message_stop\ndata: {json.dumps({'type': 'message_stop'})}\n\n".encode()
            )
            self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _stream_process_chunk(self, oai_data, model, block_index, block_type, tool_call_states):
        """Process one OpenAI streaming chunk, managing the block lifecycle.

        Now handles tool_calls in streaming: when tool_calls arrive they get their own
        content_block (type tool_use) with input_json_delta for streaming arguments.

        Returns (block_index, block_type, tool_call_states) after processing.
        """
        choice = oai_data["choices"][0]
        delta = choice.get("delta", {})
        finish_reason = choice.get("finish_reason")

        # ── message_start ──
        if delta.get("role") == "assistant":
            self._write_sse("message_start", {
                "type": "message_start",
                "message": {
                    "id": oai_data.get("id", "msg_sensenova"),
                    "type": "message", "role": "assistant",
                    "content": [], "model": model,
                    "stop_reason": None,
                    "usage": {"input_tokens": 0, "output_tokens": 0},
                },
            })

        # ── reasoning_content → thinking block ──
        reasoning = delta.get("reasoning_content")
        if reasoning:
            if block_index < 0 or block_type != "thinking":
                if block_index >= 0:
                    self._write_sse("content_block_stop", {
                        "type": "content_block_stop", "index": block_index,
                    })
                block_index += 1
                block_type = "thinking"
                self._write_sse("content_block_start", {
                    "type": "content_block_start", "index": block_index,
                    "content_block": {"type": "thinking", "thinking": ""},
                })
            self._write_sse("content_block_delta", {
                "type": "content_block_delta", "index": block_index,
                "delta": {"type": "thinking_delta", "thinking": reasoning},
            })

        # ── reasoning (no reasoning_content) → text block ──
        reasoning_alt = delta.get("reasoning")
        if reasoning_alt and not reasoning:
            if block_index < 0 or block_type != "text":
                if block_index >= 0:
                    self._write_sse("content_block_stop", {
                        "type": "content_block_stop", "index": block_index,
                    })
                block_index += 1
                block_type = "text"
                self._write_sse("content_block_start", {
                    "type": "content_block_start", "index": block_index,
                    "content_block": {"type": "text", "text": ""},
                })
            self._write_sse("content_block_delta", {
                "type": "content_block_delta", "index": block_index,
                "delta": {"type": "text_delta", "text": reasoning_alt},
            })

        # ── content → text block ──
        content = delta.get("content")
        if content is not None:
            text = content
            if text:
                if block_index < 0 or block_type != "text":
                    if block_index >= 0:
                        self._write_sse("content_block_stop", {
                            "type": "content_block_stop", "index": block_index,
                        })
                    block_index += 1
                    block_type = "text"
                    self._write_sse("content_block_start", {
                        "type": "content_block_start", "index": block_index,
                        "content_block": {"type": "text", "text": ""},
                    })
                self._write_sse("content_block_delta", {
                    "type": "content_block_delta", "index": block_index,
                    "delta": {"type": "text_delta", "text": text},
                })

        # ── tool_calls → tool_use blocks ──
        tool_calls_delta = delta.get("tool_calls")
        if tool_calls_delta:
            for tc_delta in tool_calls_delta:
                oai_idx = tc_delta.get("index", 0)
                tc_id = tc_delta.get("id")
                tc_function = tc_delta.get("function", {})
                tc_name = tc_function.get("name")
                tc_args = tc_function.get("arguments", "")

                is_new_call = oai_idx not in tool_call_states
                if is_new_call:
                    tool_call_states[oai_idx] = {"id": tc_id or "", "name": tc_name or "", "args": ""}

                state = tool_call_states[oai_idx]

                # Update id/name if provided (first chunk)
                if tc_id:
                    state["id"] = tc_id
                if tc_name:
                    state["name"] = tc_name
                if tc_args:
                    state["args"] += tc_args

                # Emit content_block_start for new tool calls
                if is_new_call:
                    # Close current block if any
                    if block_index >= 0:
                        self._write_sse("content_block_stop", {
                            "type": "content_block_stop", "index": block_index,
                        })
                    block_index += 1
                    block_type = "tool_use"
                    self._write_sse("content_block_start", {
                        "type": "content_block_start", "index": block_index,
                        "content_block": {
                            "type": "tool_use",
                            "id": state["id"],
                            "name": state["name"],
                            "input": {},
                        },
                    })

                # Emit delta for new partial arguments
                if tc_args:
                    self._write_sse("content_block_delta", {
                        "type": "content_block_delta", "index": block_index,
                        "delta": {"type": "input_json_delta", "partial_json": tc_args},
                    })

        # ── finish_reason → close blocks, emit message_delta ──
        if finish_reason:
            if block_index >= 0:
                self._write_sse("content_block_stop", {
                    "type": "content_block_stop", "index": block_index,
                })
                block_index = -1
                block_type = None
            self._write_sse("message_delta", {
                "type": "message_delta",
                "delta": {
                    "stop_reason": _map_stop_reason(finish_reason),
                    "stop_sequence": None,
                },
                "usage": {"output_tokens": 0},
            })
            # Reset tool states for next turn
            tool_call_states = {}

        return block_index, block_type, tool_call_states

    def _write_sse(self, event, data):
        try:
            self.wfile.write(f"event: {event}\ndata: {json.dumps(data)}\n\n".encode())
            self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _send_error(self, code, message):
        body = json.dumps({
            "error": {"type": "api_error", "message": message}
        }).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass  # Quiet


if __name__ == "__main__":
    import socket, socketserver

    class ProxyServer(socketserver.ThreadingTCPServer):
        allow_reuse_address = True
        # Force close socket after each request (HTTP/1.0 semantics)
        def close_request(self, request):
            try:
                request.shutdown(socket.SHUT_WR)
            except OSError:
                pass
            super().close_request(request)

    server = ProxyServer(("127.0.0.1", PORT), ProxyHandler)
    print(f"Proxy running on http://127.0.0.1:{PORT} -> {TARGET}", flush=True)
    signal.signal(signal.SIGINT, lambda s, f: sys.exit(0))
    server.serve_forever()
