import { CITY_SERVICE_ACTIONS } from "../data/cityServices";
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
