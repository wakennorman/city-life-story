/**
 * 域F(UI/UX) 联动增强 R884 — F→A数据可视化v17 / F→B事件记忆墙v17 / F→E财务仪表盘v17
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR884Loaded)return;RANDOM_EVENTS._domainFLinkageR884Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f884_data_viz_v17",phase:"street",icon:"📊",title:"数据可视化，洞察先机",story:"你盯着各种数据面板。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f884DataVizDone)return false;return st.player.day>=400},
probability:0.05,repeatable:false,
choices:[{text:"📊 深入分析可视化数据",hint:"智力+38,会计XP+45,置_f884DataVizInsight",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f884DataVizDone=true;st.flags._f884DataVizInsight=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+38);gx("accounting",45);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+38,会计XP+45。","success")}},
{text:"📝 简单记下关键数字",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f884DataVizDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("📝 心智+8。","info")}}]},
{id:"f884_event_memory_v17",phase:"street",icon:"📖",title:"记忆墙，人生回放",story:"你在事件日志里翻看过去的记录。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f884EventMemoryDone)return false;return st.player.day>=550},
probability:0.06,repeatable:false,
choices:[{text:"📖 翻阅记忆墙，写下感悟",hint:"心智+40,魅力+32,置_f884EventMemory",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f884EventMemoryDone=true;st.flags._f884EventMemory=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+40);st.player.charm=Math.min(100,(st.player.charm||50)+32)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+40,魅力+32。","success")}},
{text:"😊 回味一下就好",hint:"心情+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f884EventMemoryDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心情+10。","info")}}]},
{id:"f884_finance_dashboard_v17",phase:"street",icon:"💰",title:"财务仪表盘，看清钱袋子",story:"你打开财务仪表盘。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f884FinanceDashboardDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=500000&&st.player.day>=350},
probability:0.06,repeatable:false,
choices:[{text:"💰 深度分析财务数据",hint:"会计XP+48,智力+35,置_f884FinanceDashboard",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f884FinanceDashboardDone=true;st.flags._f884FinanceDashboard=true;if(st.resources){var inc=st.flags._dailyIncome||0,exp=st.flags._dailyExpense||0;st.flags._f884SaveRatio=(inc>0&&isFinite(inc)&&isFinite(exp))?Math.round((1-exp/inc)*100):0}gx("accounting",48);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+35);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 会计XP+48,智力+35。","success")}},
{text:"😅 知道有钱就行",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f884FinanceDashboardDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
