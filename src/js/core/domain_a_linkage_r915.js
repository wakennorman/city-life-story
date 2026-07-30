/**
 * 域A(数据/数值平衡) 联动增强 R915 — A→B价格波动叙事v29 / A→G经济健康度v28 / A→C技能市场需求v28
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR915Loaded)return;RANDOM_EVENTS._domainALinkageR915Loaded=true;
var E=[
{id:"a915_price_story_v29",phase:"street",icon:"📈",title:"价格波动的秘密",story:"你注意到最近市场上的商品价格波动越来越频繁。\n\n「猪肉涨了15%，鸡蛋涨了8%，但电子产品在降价。」\n\n你开始意识到，这些价格波动背后是经济周期的脉搏。看懂价格，就是看懂经济。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a915PriceStoryDone)return false;if(!st.market||!st.player)return false;return st.player.day>=300},
probability:0.06,repeatable:false,
choices:[{text:"📈 研究价格波动规律",hint:"智力+20,会计XP+25,系统标记价格观察者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a915PriceStoryDone=true;st.flags._a915PriceObserver=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);if(typeof addSkillXp==="function"){try{addSkillXp("accounting",25)}catch(e){}}if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+20,会计XP+25。价格波动规律洞察！","success")}},
{text:"😅 随它涨跌",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a915PriceStoryDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"a915_economy_health_v28",phase:"street",icon:"💊",title:"经济健康度诊断",story:"你像做体检一样分析了自己的经济状况。\n\n「收入来源单一、储蓄率偏低、负债率可控——你的财务体检报告显示，需要优化收入结构。」\n\n问题很清楚：你太依赖单一收入来源了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a915EconomyHealthDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0)>=10000)&&st.player.day>=250},
probability:0.06,repeatable:false,
choices:[{text:"💊 优化财务结构",hint:"智力+18,心智+18,系统标记财务健康意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a915EconomyHealthDone=true;st.flags._a915FinanceHealthAwareness=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+18);st.player.mental=Math.min(100,(st.player.mental||50)+18)}if(typeof StateManager!=="undefined")StateManager.addMessage("💊 智力+18,心智+18。财务健康意识建立！","success")}},
{text:"😅 够用就行",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a915EconomyHealthDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+5。","info")}}]},
{id:"a915_skill_market_v28",phase:"street",icon:"🎯",title:"技能市场需求报告",story:"你分析了招聘市场上的技能需求变化。\n\n「编程需求同比增长40%，但会计需求在下降。复合型技能人才的薪资溢价高达35%。」\n\n这些数据告诉你：该学什么、不该学什么。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a915SkillMarketDone)return false;if(!st.skills)return false;return st.player.day>=350},
probability:0.05,repeatable:false,
choices:[{text:"🎯 根据市场需求调整学习方向",hint:"智力+22,系统标记技能市场洞察",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a915SkillMarketDone=true;st.flags._a915SkillMarketInsight=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);if(typeof StateManager!=="undefined")StateManager.addMessage("🎯 智力+22。技能市场洞察力提升！","success")}},
{text:"😅 学自己喜欢的",hint:"心情+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a915SkillMarketDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+8。兴趣是最好的老师。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();