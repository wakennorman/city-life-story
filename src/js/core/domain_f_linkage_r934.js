/**
 * 域F(UI/UX) 联动增强 R934 — F→A数据可视化 / F→B事件记忆墙 / F→E财务仪表盘
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 *  - done-flag 防重复。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR934Loaded)return;RANDOM_EVENTS._domainFLinkageR934Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. F→A: 数据可视化 — 玩家查看价格趋势数据时，触发数据洞察
{id:"f934_price_visualization",phase:"street",icon:"📊",title:"数据会说故事",
story:"你盯着屏幕上的价格趋势图，忽然看出了门道。\n\n「每次价格跌到谷底后三天内必反弹——规律太明显了，以前怎么没注意到？」\n\n你拖拽图表上的时间范围，不同时间段呈现出截然不同的市场面貌。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f934PriceVizDone)return false;if(!st.trade)return false;var _ph=st.flags._priceIndexHistory||[];return _ph.length>=15&&st.player.day>=80},
probability:0.05,repeatable:false,
choices:[{text:"📊 学习用图表分析市场",hint:"智力+20,会计XP+25,系统标记数据可视化",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f934PriceVizDone=true;st.flags._f934DataVizMaster=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);gx("accounting",25);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+20,会计XP+25。你学会了用图表看市场——数据可视化让规律一目了然。","success")}},
{text:"😅 数字太多了，头晕",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f934PriceVizDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. F→B: 事件记忆墙 — 玩家回顾历史事件时，触发对过往经历的感悟
{id:"f934_event_memory_wall",phase:"street",icon:"📸",title:"记忆的墙面",
story:"你翻看手机里记录的那些重要事件——\n\n「第30天：第一次找到稳定工作。第120天：还清了村长的债。第200天：第一次帮了陌生人。」\n\n这些瞬间像照片一样贴在记忆的墙面上，每一张都记录着你的成长。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f934MemoryWallDone)return false;var _eh=st.flags._eventHistory||[];return _eh.length>=20&&st.player.day>=150},
probability:0.04,repeatable:false,
choices:[{text:"📸 整理人生大事记",hint:"心智+25,魅力+15,系统标记人生记录者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f934MemoryWallDone=true;st.flags._f934LifeChronicler=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+25);st.player.charm=Math.min(100,(st.player.charm||20)+15)}if(typeof StateManager!=="undefined")StateManager.addMessage("📸 心智+25,魅力+15。你的人生故事值得被记录。","success")}},
{text:"😔 过去就让它过去吧",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f934MemoryWallDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+5。","info")}}]},
// 3. F→E: 财务仪表盘 — 玩家查看财务状况时，触发对资产配置的思考
{id:"f934_finance_dashboard",phase:"street",icon:"💹",title:"财务仪表盘",
story:"你打开财务面板，各项数据一目了然。\n\n现金: ¥"+(function(){try{var _s=typeof StateManager!=="undefined"?StateManager.getState():null;if(_s&&_s.resources)return Math.floor(_s.resources.cash||0).toLocaleString();return"?"}catch(e){return"?"}})()+" | 存款: ¥"+(function(){try{var _s2=typeof StateManager!=="undefined"?StateManager.getState():null;if(_s2&&_s2.resources)return Math.floor(_s2.resources.bankBalance||0).toLocaleString();return"?"}catch(e){return"?"}})()+"\n\n你第一次对自己的财务状况有了全局视图——钱花在哪、赚了多少、还有多少负债，清清楚楚。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f934FinanceDashDone)return false;if(!st.resources)return false;var _t=(st.resources.cash||0)+(st.resources.bankBalance||0);return _t>=100000&&st.player.day>=200},
probability:0.05,repeatable:false,
choices:[{text:"💹 建立个人财务仪表盘",hint:"智力+22,会计XP+30,系统标记财务管家",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f934FinanceDashDone=true;st.flags._f934FinanceSteward=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("💹 智力+22,会计XP+30。财务管家模式启动——你清楚每一分钱的去向。","success")}},
{text:"😅 大概知道就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f934FinanceDashDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();