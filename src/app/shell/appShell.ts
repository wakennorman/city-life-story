import { renderCityServicesPanel, renderHealthPanel } from "../ui/panels";

export function mountAppShell(root: HTMLElement): void {
  root.innerHTML = "";

  const app = document.createElement("main");
  app.className = "webapp-shell";
  app.innerHTML = `
    <header class="webapp-header">
      <div>
        <h1>城市浮生记 Web App 架构壳</h1>
        <p>第一阶段采用桥接式迁移：旧游戏继续可玩，新架构开始承载类型、数据、存档边界和调试面板。</p>
      </div>
      <nav>
        <a href="/src/index.html" target="_blank" rel="noreferrer">打开旧游戏入口</a>
        <a href="/memory/webapp_architecture_plan.md" target="_blank" rel="noreferrer">架构方案</a>
      </nav>
    </header>
    <section class="legacy-frame-wrap">
      <iframe title="城市浮生记 legacy runtime" src="/src/index.html"></iframe>
    </section>
  `;

  app.appendChild(renderHealthPanel());
  app.appendChild(renderCityServicesPanel());
  root.appendChild(app);
}
