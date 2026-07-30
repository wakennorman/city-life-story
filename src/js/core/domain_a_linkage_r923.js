/**
 * 域A(数据/数值平衡) 联动增强 R923 — A→B价格波动叙事v30 / A→G经济健康度v29 / A→C技能市场需求v29
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR923Loaded)return;RANDOM_EVENTS._domainALinkageR923Loaded=true;
var E=[
{id:"a923_price_story_v30",phase:"street",icon:"📈",title:"通货膨胀的痕迹",story:"你注意到菜市场的价格标签又换了。\n\n「猪肉比去年贵了20%，鸡蛋涨了12%，但蔬菜因为季节原因反而便宜了。」\n\n卖菜的大妈叹了口气：「什么都涨，就是工资不涨。」\n\n你开始认真思考:在这个通胀的时代，如何让钱不贬值？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a923PriceStoryDone)return false;return st.player.day>=350},
probability:0.06,repeatable:false,
choices:[{text:"📈 研究通胀应对策略",hint:"智力+22,会计XP+28,系统标记通胀意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a923PriceStoryDone=true;st.flags._a923InflationAware=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);if(typeof addSkillXp==="function"){try{addSkillXp("accounting",28)}catch(e){}}if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+22,会计XP+28。通胀应对意识建立！","success")}},
{text:"😅 省着点花就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a923PriceStoryDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"a923_economy_health_v29",phase:"street",icon:"💊",title:"经济健康度体检",story:"你对自己的财务状况进行全面体检。\n\n「收入结构:100%主动收入。储蓄率:15%。负债率:20%。应急资金:够用3个月。」\n\n报告显示你的财务韧性还有提升空间——特别是收入来源过于单一这个风险点。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a923EconomyHealthDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0)>=20000)&&st.player.day>=300},
probability:0.06,repeatable:false,
choices:[{text:"💊 制定财务改善计划",hint:"智力+20,心智+20,系统标记财务健康管理",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a923EconomyHealthDone=true;st.flags._a923FinanceHealthPlan=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);st.player.mental=Math.min(100,(st.player.mental||50)+20)}if(typeof StateManager!=="undefined")StateManager.addMessage("💊 智力+20,心智+20。财务健康管理计划启动！","success")}},
{text:"😅 够用就行",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a923EconomyHealthDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+5。","info")}}]},
{id:"a923_skill_market_v29",phase:"street",icon:"🎯",title:"技能市场新趋势",story:"你浏览了最新的招聘平台数据，发现了一个明显的趋势。\n\n「复合型技能人才的薪资溢价已经达到50%。单一技能人才的竞争越来越激烈。」\n\n你看着自己的技能面板——是时候考虑扩展技能组合了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a923SkillMarketDone)return false;if(!st.skills)return false;return st.player.day>=400},
probability:0.05,repeatable:false,
choices:[{text:"🎯 制定复合技能发展计划",hint:"智力+25,系统标记复合技能意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a923SkillMarketDone=true;st.flags._a923CompoundSkillAwareness=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);if(typeof StateManager!=="undefined")StateManager.addMessage("🎯 智力+25。复合技能发展意识建立！","success")}},
{text:"😅 专精一门就够了",hint:"心情+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a923SkillMarketDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();