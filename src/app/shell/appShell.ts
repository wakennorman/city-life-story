import {
  renderCityServicesPanel,
  renderContentCatalogPanel,
  renderHealthPanel,
} from "../ui/panels";

export function resolveLegacyEntryUrl(): string {
  return window.location.pathname.includes("/dist-webapp/")
    ? "../src/index.html"
    : "/src/index.html";
}

function resolveArchitecturePlanUrl(): string {
  return window.location.pathname.includes("/dist-webapp/")
    ? "../memory/webapp_architecture_plan.md"
    : "/memory/webapp_architecture_plan.md";
}

export function mountAppShell(root: HTMLElement): void {
  root.innerHTML = "";

  const legacyUrl = resolveLegacyEntryUrl();
  const architecturePlanUrl = resolveArchitecturePlanUrl();

  const app = document.createElement("main");
  app.className = "webapp-shell webapp-debug-shell";
  app.innerHTML = `
    <header class="webapp-header">
      <div>
        <h1>城市浮生记 Web App 开发调试面板</h1>
        <p>仅在显式使用 ?debug=1 时显示。玩家默认入口会直接进入旧游戏，保持原比例、原字体和原流程。</p>
      </div>
      <nav>
        <a href="${legacyUrl}">进入玩家入口</a>
        <a href="${architecturePlanUrl}" target="_blank" rel="noreferrer">架构方案</a>
      </nav>
    </header>
    <section class="legacy-frame-wrap">
      <iframe title="城市浮生记 legacy runtime" src="${legacyUrl}"></iframe>
    </section>
  `;

  app.appendChild(renderHealthPanel());
  app.appendChild(renderContentCatalogPanel());
  app.appendChild(renderCityServicesPanel());
  root.appendChild(app);
}
