#!/usr/bin/env python3
"""Proxy: converts x-api-key (Claude Code) -> Bearer (LongCat), supports SSE streaming."""

import http.server
import http.client
import json
import sys
import signal

TARGET_HOST = "api.longcat.chat"
TARGET_PATH = "/anthropic"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8087


def extract_api_key(headers):
    """Try multiple auth methods to extract the API key."""
    # Method 1: x-api-key (standard Anthropic SDK)
    key = headers.get("x-api-key", "")
    if key:
        print(f"    auth: x-api-key ({key[:12]}...)", flush=True)
        return key

    # Method 2: Authorization: Bearer
    auth = headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        key = auth[len("Bearer "):]
        print(f"    auth: Authorization Bearer ({key[:12]}...)", flush=True)
        return key

    print(f"    auth: NOT FOUND (x-api-key={headers.get('x-api-key','<none>')!r}, Authorization={headers.get('Authorization','<none>')!r})", flush=True)
    return ""


class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "proxy running", "target": f"https://{TARGET_HOST}{TARGET_PATH}"}).encode())

    def do_POST(self):
        # Read request body
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        # Log request
        path = self.path
        body_preview = body[:200].decode("utf-8", errors="replace")
        print(f"\n>>> {path} | CL={content_length}", flush=True)
        print(f"    body: {body_preview}...", flush=True)

        # Extract API key from various auth methods
        api_key = extract_api_key(self.headers)
        if not api_key:
            print("!!! No API key found in request headers", flush=True)
            # Log all headers for debugging
            print(f"    All headers: {dict(self.headers)}", flush=True)
            self.send_error(401, "Missing authentication (x-api-key or Authorization: Bearer)")
            return

        # Determine if this is a streaming request
        try:
            req_body = json.loads(body) if body else {}
            is_stream = req_body.get("stream", False)
            print(f"    stream={is_stream}, model={req_body.get('model','?')}", flush=True)
        except json.JSONDecodeError as e:
            print(f"!!! JSON parse error: {e}", flush=True)
            self.send_error(400, f"Invalid JSON: {e}")
            return

        # Forward to LongCat
        upstream_path = TARGET_PATH + path
        print(f"    -> https://{TARGET_HOST}{upstream_path}", flush=True)

        try:
            conn = http.client.HTTPSConnection(TARGET_HOST, timeout=60)
            conn.request(
                "POST",
                upstream_path,
                body=body,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "anthropic-version": self.headers.get("anthropic-version", "2023-06-01"),
                },
            )
            resp = conn.getresponse()
            print(f"    <- status={resp.status} {resp.reason}", flush=True)
            # Log response headers
            resp_headers = dict(resp.getheaders())
            print(f"    <- response headers: {json.dumps(resp_headers, indent=2)}", flush=True)
        except Exception as e:
            print(f"!!! Upstream connection error: {e}", flush=True)
            self.send_error(502, f"Upstream error: {e}")
            return

        # Forward status and response headers (filter out hop-by-hop headers)
        self.send_response(resp.status)
        hop_by_hop = {"transfer-encoding", "connection", "content-encoding", "content-length"}
        for key, val in resp.getheaders():
            if key.lower() not in hop_by_hop:
                self.send_header(key, val)

        # Handle streaming vs non-streaming response
        if is_stream and resp.status == 200:
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.send_header("Transfer-Encoding", "chunked")
        else:
            # For non-streaming or error responses, preserve content-length
            for key, val in resp.getheaders():
                if key.lower() == "content-length":
                    self.send_header(key, val)
        self.end_headers()

        # If upstream returned an error, forward the error body
        if resp.status != 200:
            error_body = resp.read()
            self.wfile.write(error_body)
            self.wfile.flush()
            conn.close()
            print(f"    !! Non-200 response forwarded ({len(error_body)} bytes)", flush=True)
            return

        # Stream the response chunk by chunk
        try:
            total = 0
            while True:
                chunk = resp.read(4096)
                if not chunk:
                    break
                total += len(chunk)
                if is_stream:
                    self.wfile.write(f"{len(chunk):x}\r\n".encode())
                    self.wfile.write(chunk)
                    self.wfile.write(b"\r\n")
                else:
                    self.wfile.write(chunk)
                self.wfile.flush()
            if is_stream:
                self.wfile.write(b"0\r\n\r\n")
                self.wfile.flush()
            print(f"    <<< finished ({total} bytes streamed)", flush=True)
        except (BrokenPipeError, ConnectionResetError):
            print("    !!! Client disconnected mid-stream", flush=True)
        except Exception as e:
            print(f"    !!! Stream error: {e}", flush=True)
        finally:
            conn.close()

    def log_message(self, format, *args):
        msg = format % args
        print(f"[{self.address_string()}] {msg}", flush=True)


if __name__ == "__main__":
    server = http.server.HTTPServer(("127.0.0.1", PORT), ProxyHandler)
    print(f"Proxy running on http://127.0.0.1:{PORT} -> https://{TARGET_HOST}{TARGET_PATH}", flush=True)
    signal.signal(signal.SIGINT, lambda s, f: sys.exit(0))
    server.serve_forever()
