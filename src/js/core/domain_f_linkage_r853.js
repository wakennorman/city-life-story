/**
 * 域F(UI/UX) 联动增强 R853 — F→A数据可视化v13 / F→B事件记忆墙v13 / F→E财务仪表盘v13
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR853Loaded)return;RANDOM_EVENTS._domainFLinkageR853Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f853_data_viz_v13",phase:"street",icon:"📊",title:"数据可视化，洞察先机",story:"你盯着各种数据面板——价格走势、资产分布、技能雷达……这些图表把枯燥的数字变成了直观的图形。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f853DataVizDone)return false;return st.player.day>=200},
probability:0.05,repeatable:false,
choices:[{text:"📊 深入分析可视化数据",hint:"智力+28,会计XP+35,置_f853DataVizInsight",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f853DataVizDone=true;st.flags._f853DataVizInsight=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 数据可视化分析完成——智力+28,会计XP+35。","success")}},
{text:"📝 简单记下关键数字",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f853DataVizDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("📝 记下了几个关键数字。心智+8。","info")}}]},
{id:"f853_event_memory_v13",phase:"street",icon:"📖",title:"记忆墙，人生回放",story:"你在事件日志里翻看过去的记录。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f853EventMemoryDone)return false;return st.player.day>=350},
probability:0.06,repeatable:false,
choices:[{text:"📖 翻阅记忆墙，写下感悟",hint:"心智+30,魅力+24,置_f853EventMemory",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f853EventMemoryDone=true;st.flags._f853EventMemory=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+30);st.player.charm=Math.min(100,(st.player.charm||50)+24)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 记忆墙上每一行字,都是你走过的路。心智+30,魅力+24。","success")}},
{text:"😊 回味一下就好",hint:"心情+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f853EventMemoryDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 过去的就让它过去吧。心情+10。","info")}}]},
{id:"f853_finance_dashboard_v13",phase:"street",icon:"💰",title:"财务仪表盘，看清钱袋子",story:"你打开财务仪表盘——收入、支出、储蓄、投资……一张图看清你所有的钱。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f853FinanceDashboardDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=150000&&st.player.day>=180},
probability:0.06,repeatable:false,
choices:[{text:"💰 深度分析财务数据",hint:"会计XP+38,智力+26,置_f853FinanceDashboard",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f853FinanceDashboardDone=true;st.flags._f853FinanceDashboard=true;if(st.resources){var inc=st.flags._dailyIncome||0,exp=st.flags._dailyExpense||0;st.flags._f853SaveRatio=(inc>0&&isFinite(inc)&&isFinite(exp))?Math.round((1-exp/inc)*100):0}gx("accounting",38);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+26);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 财务仪表盘分析完成——储蓄率约"+(st.flags._f853SaveRatio||0)+"%。会计XP+38,智力+26。","success")}},
{text:"😅 知道有钱就行",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f853FinanceDashboardDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 有钱就行。心情+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();