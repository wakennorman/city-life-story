import { CITY_SERVICE_ACTIONS } from "../data/cityServices";
import { CONTENT_CATALOG_SUMMARY, DATA_CATALOGS } from "../data";
import { buildHealthRows } from "../debug/healthCheck";

export function renderHealthPanel(): HTMLElement {
  const section = document.createElement("section");
  section.className = "app-panel";
  section.innerHTML = `
    <h2>架构健康</h2>
    <div class="health-list">
      ${buildHealthRows()
        .map(
          (row) => `
            <div class="health-row">
              <strong>${row.name}</strong>
              <span data-status="${row.status}">${row.status}</span>
              <p>${row.detail}</p>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
  return section;
}

export function renderCityServicesPanel(): HTMLElement {
  const section = document.createElement("section");
  section.className = "app-panel";
  section.innerHTML = `
    <h2>第一批数据化玩法</h2>
    <div class="service-list">
      ${CITY_SERVICE_ACTIONS.map(
        (action) => `
          <article class="service-item">
            <div>
              <span class="service-icon">${action.icon}</span>
              <strong>${action.title}</strong>
              <small>${action.category}</small>
            </div>
            <p>${action.brief}</p>
            <dl>
              <dt>入口</dt><dd>${action.locationIds.join(" / ")}</dd>
              <dt>成本</dt><dd>¥${action.cost} · ${action.apCost} AP</dd>
              <dt>状态变化</dt><dd>${action.stateEffects.join("；")}</dd>
              <dt>后续反馈</dt><dd>${action.followUps.join("；")}</dd>
            </dl>
          </article>
        `,
      ).join("")}
    </div>
  `;
  return section;
}

export function renderContentCatalogPanel(): HTMLElement {
  const section = document.createElement("section");
  section.className = "app-panel";
  section.innerHTML = `
    <h2>TypeScript 内容目录</h2>
    <p>
      已填充 ${CONTENT_CATALOG_SUMMARY.filledCatalogs}/${CONTENT_CATALOG_SUMMARY.totalCatalogs} 个目录，
      共 ${CONTENT_CATALOG_SUMMARY.totalRecords} 条类型化内容。
    </p>
    <div class="health-list">
      ${DATA_CATALOGS.map(
        (catalog) => `
          <div class="health-row">
            <strong>${catalog.name}</strong>
            <span data-status="${catalog.count > 0 ? "ready" : "empty"}">${catalog.count} 条</span>
            <p>${catalog.description}（${catalog.bridgeStatus}）</p>
          </div>
        `,
      ).join("")}
    </div>
  `;
  return section;
}
