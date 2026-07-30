/**
 * 域F(UI/UX) 联动增强 R942 — F→A数据可视化 / F→B事件记忆墙 / F→E财务仪表盘
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 *  - done-flag 防重复。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR942Loaded)return;RANDOM_EVENTS._domainFLinkageR942Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. F→A: 数据可视化 — 价格趋势积累到一定量后，触发数据洞察
{id:"f942_price_trend_insight",phase:"street",icon:"📈",title:"数字背后的故事",
story:"你翻看近期的价格记录，发现了一个有趣的现象。\n\n「每次下雨后第二天，蔬菜价格都会涨一波。节假日之前，日用品价格会提前三天开始攀升。」\n\n这些规律一直存在，只是你以前没有用数据去看。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f942TrendInsightDone)return false;var _ph=st.flags._priceIndexHistory||[];return _ph.length>=20&&st.player.day>=100},
probability:0.05,repeatable:false,
choices:[{text:"📈 建立价格预测模型",hint:"智力+22,会计XP+28,系统标记价格预测者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f942TrendInsightDone=true;st.flags._f942PricePredictor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("accounting",28);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+22,会计XP+28。你用数据预测价格——规律一旦掌握，就能预见未来。","success")}},
{text:"😅 规律太复杂了",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f942TrendInsightDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. F→B: 事件记忆墙 — 回顾人生重要事件时，触发情感共鸣
{id:"f942_life_milestone_review",phase:"street",icon:"🏆",title:"那些重要的日子",
story:"你翻看游戏里的成就记录，那些里程碑像路标一样标注着你的成长。\n\n「第一次赚到¥1000、第一次找到工作、第一次帮了别人……」\n\n每一个成就背后，都有一个故事。你忽然意识到，这些看似普通的瞬间，才是人生真正的财富。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f942MilestoneReviewDone)return false;if(!st.flags._lifeMilestones)return false;return st.flags._lifeMilestones.length>=5&&st.player.day>=180},
probability:0.04,repeatable:false,
choices:[{text:"🏆 整理人生成就清单",hint:"心智+28,魅力+18,系统标记成就收藏家",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f942MilestoneReviewDone=true;st.flags._f942AchievementCollector=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+28);st.player.charm=Math.min(100,(st.player.charm||20)+18)}if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 心智+28,魅力+18。你的人生成就清单越来越长——每一步都算数。","success")}},
{text:"😔 往事如烟",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f942MilestoneReviewDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+5。","info")}}]},
// 3. F→E: 财务仪表盘 — 查看总资产时，触发财务自由思考
{id:"f942_wealth_dashboard",phase:"street",icon:"💎",title:"财富的里程碑",
story:"你打开资产总览，数字让你有些恍惚。\n\n"+(function(){try{var _s=typeof StateManager!=="undefined"?StateManager.getState():null;if(_s&&_s.resources){var _c=_s.resources.cash||0,_b=_s.resources.bankBalance||0;return "现金: ¥"+Math.floor(_c).toLocaleString()+"\n存款: ¥"+Math.floor(_b).toLocaleString()+"\n总资产: ¥"+Math.floor(_c+_b).toLocaleString()}return""}catch(e){return""})()+"\n\n你想起刚来这座城市时兜里只有¥300。现在，你开始思考——多少钱才算真正的财务自由？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f942WealthDashDone)return false;if(!st.resources)return false;var _t=(st.resources.cash||0)+(st.resources.bankBalance||0);return _t>=500000&&st.player.day>=300},
probability:0.05,repeatable:false,
choices:[{text:"💎 制定财务自由计划",hint:"智力+25,会计XP+35,系统标记财务自由计划",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f942WealthDashDone=true;st.flags._f942FinFreedomPlan=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("💎 智力+25,会计XP+35。你制定了财务自由计划——目标清晰，脚步坚定。","success")}},
{text:"😅 继续攒钱",hint:"现金+8000,系统标记攒钱机器",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f942WealthDashDone=true;st.flags._f942Saver=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+8000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+8000。你继续攒钱——但钱是工具，不是目的。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();