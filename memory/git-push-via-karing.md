---
name: git-push-via-karing
description: Windows git-bash 与 cmd.exe 推送 GitHub 的行为差异 + Karing 代理端口扫描法 + 根治方案（SSH）
metadata:
  type: feedback
---

# git push 在 git-bash 失败、在 cmd 成功 — 诊断 + 根治

> 2026-07-02 城市浮生记开发时踩的坑。

## 现象

- 从 Claude Code 的 git-bash 跑 `git push origin main`：失败 `Recv failure: Connection was reset` 或 `Failed to connect to github.com port 443 after 21060 ms: Could not connect`
- 用户手动在 cmd.exe 跑同一条命令：成功 `b009fa3..0a97ff6  main -> main`

## 根因

**MSYS2 (git-bash) 沙盒不继承系统级 TUN 代理；cmd.exe 吃得到 Karing 的透明劫持。`

.cmd (Windows CMD):

- Git 使用 Windows 原生 HTTP 栈 (WinHTTP + schannel)
- Karing 工作在**系统层 TUN 模式** 或注册了**系统代理**，cmd 完整吃得到
- 即使 `set https_proxy=` 清空显式变量，系统层劫持仍在

.bash (MSYS2 git-bash):

- Git 使用 OpenSSL/schannel 直连外网（不受 TUN 系统层劫持覆盖）
- 从系统层看出去，git 发的包因为是 MSYS2 套接字，不被 Karing 识别为系统流量 → 直连 GitHub → 中国大陆 IP 连 GitHub → RST
- 必须透**过代理端口（HTTP CONNECT）** 转发

.尝试HTTP代理（部分成功）:

```
git config --global http.proxy http://127.0.0.1:3065
git config --global https.proxy http://127.0.0.1:3065
```

- 找到代理端口方法：`netstat -ano | findstr LISTEN | findstr 127.0.0.1`，多端口的 PID（PID 24012 一身占 5 口 3057/3065/3066/3067/51072）多为 Karing 类多路复用工具
- 测试：`curl -s --proxy http://127.0.0.1:<port> -o /dev/null -w "%{http_code}" https://api.github.com`
- 测得 3065 返回 HTTP 200 → 这是代理

**但 HTTP 代理一样 `Recv failure: Connection was reset`！**

```
verbose log:
  <= HTTP/1.1 200 Connection established   ← CONNECT 隧道建起来
      (+ 5 秒沉默)
  == Info: Recv failure: Connection was reset
  == Info: schannel: failed to receive handshake, SSL/TLS connection failed  ← TLS 握手被砍
```

原因：Karing 透明代理（TUN）= L3/L4 包转发（干净），但 Karing HTTP CONNECT 代理（3065 端口）=L7 应用层劫持，需要重新签 TLS 证书；git-bash 内 schannel/CA 不认 → 5 秒后 RST。

（`curl --proxy` 能通是因为 curl 默认跳过了一些严格的 CA 校验，或者 OpenSSL 的 CA 跟 schannel 不同）

## 根治方案：SSH

HTTPS 代理这条路在 git-bash + Karing 下不稳（透明 TUN 它不吃、CONNECT 代理它 TLS 不信）。唯一稳的：走 SSH：

1. cmd 上生成：`ssh-keygen -t ed25519 -C "<邮箱>"`（一路回车，默认位置 `C:\Users\陈恒稳\.ssh\id_ed25519`）
2. 拷贝公钥：`type C:\Users\陈恒稳\.ssh\id_ed25519.pub` → 贴到 GitHub Settings → SSH and GPG keys → 粘贴 → Save
3. git-bash 测试：`ssh -T git@github.com`，返回 `Hi wakennorman! ... success` 即通
4. 切换 remote：`git remote set-url origin git@github.com:wakennorman/city-life-story.git`
5. 以后 git push 直接 `git push origin main` — SSH 走 Karing 系统层 TUN，同样被透明劫持转发，跟 cmd 的 HTTPS 走法一样稳

## 必须记的反模式

1. **不要依赖 `git config --global http.proxy` 配 MSYS2** — 即使端口配对，TLS 握手仍然会 RST
2. **不要在自己的 env 层降 `http.sslVerify=false`** — 那是把警告压下去，连接照样 RST
3. **让 git 走 Karing TUN 的唯一正路是 SSH**

## Why

中国大陆 IP 直连 GitHub = RST。必须经过某种代理。git-bash (MSYS2) 沙盒外发到 Karing 系统层 TUN 时存在"边界不覆盖"bug。cmd 层不存在这个问题（系统是它自己的）。所以 bash 必须显式走应用层代理或 SSH。

## How to apply

以后遇到 `git push origin main` 在 Claude Code 的 git-bash 下无脑失败、用户 cmd 能推：

1. 立即按上面第 1–4 步走 SSH
2. 不再试 `git config http.proxy`
3. 推成功后，再沉淀这个记忆

关联：[[版本一致性铁律]] | [[待迁移内容清单]]
