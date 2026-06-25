import { renderCityServicesPanel, renderHealthPanel } from "../ui/panels";

export function mountAppShell(root: HTMLElement): void {
  root.innerHTML = "";

  const builtFromRepo = window.location.pathname.includes("/dist-webapp/");
  const legacyUrl = builtFromRepo ? "../src/index.html" : "/src/index.html";
  const architecturePlanUrl = builtFromRepo
    ? "../memory/webapp_architecture_plan.md"
    : "/memory/webapp_architecture_plan.md";

  const app = document.createElement("main");
  app.className = "webapp-shell";
  app.innerHTML = `
    <header class="webapp-header">
      <div>
        <h1>城市浮生记 Web App 架构壳</h1>
        <p>第一阶段采用桥接式迁移：旧游戏继续可玩，新架构开始承载类型、数据、存档边界和调试面板。</p>
      </div>
      <nav>
        <a href="${legacyUrl}" target="_blank" rel="noreferrer">打开旧游戏入口</a>
        <a href="${architecturePlanUrl}" target="_blank" rel="noreferrer">架构方案</a>
      </nav>
    </header>
    <section class="legacy-frame-wrap">
      <iframe title="城市浮生记 legacy runtime" src="${legacyUrl}"></iframe>
    </section>
  `;

  app.appendChild(renderHealthPanel());
  app.appendChild(renderCityServicesPanel());
  root.appendChild(app);
}
