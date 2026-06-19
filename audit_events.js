// 事件上下文关联度审计脚本
// 扫描 events.js 中所有事件，检查故事文字中提到的关键场景与条件是否匹配

const fs = require("fs");
const content = fs.readFileSync("js/core/events.js", "utf-8");

// 提取所有事件
const eventRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?^  \},/gm;
const events = [];
let match;

while ((match = eventRegex.exec(content)) !== null) {
  const eventText = match[0];
  const id = match[1];

  // 提取 phase
  const phaseMatch = eventText.match(/phase:\s*"(\w+)"/);
  const phase = phaseMatch ? phaseMatch[1] : null;

  // 提取 conditions
  const hasConditions = /conditions:\s*function/.test(eventText);
  const conditionsText = hasConditions
    ? eventText.match(/conditions:\s*function[\s\S]*?^\s*\}/m)?.[0] || ""
    : null;

  // 提取 story/description
  const storyMatch = eventText.match(
    /(?:story|description):\s*"([^"]*(?:\\.[^"]*)*)"/,
  );
  const story = storyMatch
    ? storyMatch[1].replace(/\\n/g, " ").replace(/\\"/g, '"')
    : "";

  events.push({ id, phase, hasConditions, story, conditionsText });
}

// 定义上下文关键词及其需要的条件检查
const contextRules = [
  {
    keywords: ["宿舍", "室友", "合租"],
    need: "housing.tier >= 1",
    category: "住房",
  },
  {
    keywords: ["房东", "房租", "涨租", "租房"],
    need: "housing.tier >= 1",
    category: "住房",
  },
  { keywords: ["单间"], need: "housing.tier >= 2", category: "住房" },
  { keywords: ["一居室", "公寓"], need: "housing.tier >= 3", category: "住房" },
  {
    keywords: ["公司", "老板", "同事", "领导", "VP", "Leader", "HR"],
    need: 'phase === "corporate" && corporate.company',
    category: "职场",
  },
  {
    keywords: ["股票", "投资", "持仓", "持股", "买入", "卖出"],
    need: "investment.stockHoldings.length > 0",
    category: "投资",
  },
  {
    keywords: ["房产", "买房", "卖房", "房贷"],
    need: "investment.properties.length > 0",
    category: "投资",
  },
  {
    keywords: ["债务", "欠款", "欠钱", "利息"],
    need: "resources.debt > 0",
    category: "经济",
  },
  {
    keywords: ["村长", "村里", "老家"],
    need: "resources.villageDebt > 0",
    category: "经济",
  },
  {
    keywords: ["技能书", "考证", "上夜校"],
    need: "skills[某技能].level >= X",
    category: "技能",
  },
];

// 检查每个事件
let issues = 0;
events.forEach((e) => {
  if (!e.phase || e.phase === "street") {
    contextRules.forEach((rule) => {
      const hasKeyword = rule.keywords.some((kw) => e.story.includes(kw));
      const hasCondition =
        e.conditionsText &&
        rule.need
          .split(" ")
          .every(
            (token) =>
              e.conditionsText.includes(token) ||
              e.conditionsText.includes(token.split(".")[0]),
          );

      if (hasKeyword && !hasCondition) {
        console.log(
          `⚠️  ${e.id}: 故事提到"${rule.keywords.find((kw) => e.story.includes(kw))}"，但条件缺少 "${rule.need}" (${rule.category})`,
        );
        console.log(`   故事: ${e.story.substring(0, 80)}...`);
        issues++;
      }
    });
  }
});

console.log(
  `\n共检查 ${events.length} 个事件，发现 ${issues} 个潜在上下文问题`,
);
