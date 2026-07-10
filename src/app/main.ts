import "./ui/app.css";
import { mountAppShell, resolveLegacyEntryUrl } from "./shell/appShell";

const root = document.getElementById("webapp-root");

if (!root) {
  throw new Error("Missing #webapp-root mount point");
}

function shouldShowDebugShell(): boolean {
  const params = new URLSearchParams(window.location.search);
  return (
    params.get("debug") === "1" ||
    params.get("mode") === "debug" ||
    window.location.hash === "#debug"
  );
}

function redirectToPlayerEntry(target: HTMLElement): void {
  const legacyUrl = resolveLegacyEntryUrl();
  target.className = "player-redirect";
  target.innerHTML = `
    <main>
      <h1>正在进入城市浮生记</h1>
      <p>如果页面没有自动跳转，请使用玩家入口继续游戏。</p>
      <a href="${legacyUrl}">打开玩家入口</a>
    </main>
  `;
  window.location.replace(legacyUrl);
}

if (shouldShowDebugShell()) {
  mountAppShell(root);
} else {
  redirectToPlayerEntry(root);
}
