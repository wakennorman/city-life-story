#!/usr/bin/env python3
"""Proxy: converts Anthropic format (Claude Code) -> OpenAI format (FreeModel)"""

import http.server, json, urllib.request, sys, signal

TARGET = "https://api.freemodel.dev/v1"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8099
API_KEY = ""



class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "proxy running"}).encode())

    def do_POST(self):
        global API_KEY
        body_bytes = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        
        # Get API key
        api_key = self.headers.get("x-api-key", "")
        if not api_key:
            self.send_error(401, "Missing x-api-key")
            return
        
        # Parse Anthropic request
        try:
            anthro = json.loads(body_bytes)
        except:
            self.send_error(400, "Invalid JSON")
            return
        
        model = anthro.get("model", "claude-sonnet-4-6")
        max_tokens = anthro.get("max_tokens", 4096)
        
        # Convert messages: extract system prompt, convert to OpenAI format
        messages = anthro.get("messages", [])
        system_msg = None
        openai_messages = []
        
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "system":
                system_msg = content
            else:
                openai_messages.append({"role": role, "content": content})
        
        # Build OpenAI request
        openai_body = {
            "model": model,
            "messages": openai_messages,
            "max_tokens": max_tokens,
            "stream": False
        }
        if system_msg:
            openai_body["messages"] = [{"role": "system", "content": system_msg}] + openai_messages
        
        # Forward to FreeModel
        url = TARGET + "/chat/completions"
        req = urllib.request.Request(url, data=json.dumps(openai_body).encode())
        req.add_header("Authorization", f"Bearer {api_key}")
        req.add_header("Content-Type", "application/json")
        
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                openai_resp = json.loads(resp.read())
        except urllib.error.HTTPError as e:
            err = e.read().decode()
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(err.encode())
            return
        
        # Convert OpenAI response back to Anthropic format
        choice = openai_resp.get("choices", [{}])[0]
        content = choice.get("message", {}).get("content", "")
        
        # Check for usage
        usage = openai_resp.get("usage", {})
        anthro_resp = {
            "id": f"msg_{openai_resp.get('id', 'proxy')}",
            "type": "message",
            "role": "assistant",
            "content": [{"type": "text", "text": content}],
            "model": model,
            "usage": {
                "input_tokens": usage.get("prompt_tokens", 0),
                "output_tokens": usage.get("completion_tokens", 0)
            }
        }
        
        resp_body = json.dumps(anthro_resp).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("anthropic-version", "2023-06-01")
        self.end_headers()
        self.wfile.write(resp_body)
    
    def log_message(self, format, *args):
        pass

server = http.server.HTTPServer(("127.0.0.1", PORT), ProxyHandler)
print(f"Proxy running: http://127.0.0.1:{PORT} (Anthropic -> OpenAI -> FreeModel)")
signal.signal(signal.SIGINT, lambda s, f: sys.exit(0))
server.serve_forever()
