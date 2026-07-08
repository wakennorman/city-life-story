import https from "https";

const data = JSON.stringify({
  model: "agnes-2.0-flash",
  max_tokens: 10,
  messages: [{ role: "user", content: "hi" }],
});

const req = https.request(
  "https://apihub.agnes-ai.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer sk-hO5WSjdwEF9DgywtiBU1vDUGTJNU7uz2zPqgktyQbMVxBK0y",
      "Content-Length": data.length,
    },
  },
  (res) => {
    console.log("Status:", res.statusCode);
    console.log("Headers:", JSON.stringify(res.headers, null, 2));
    let body = "";
    res.on("data", (c) => (body += c));
    res.on("end", () => {
      console.log("Body:", body.substring(0, 500));
    });
  },
);

req.on("error", (e) => console.error("Error:", e.message));
req.write(data);
req.end();
