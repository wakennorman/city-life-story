/**
 * 域F(UI/UX) 联动增强 R876 — F→A数据可视化v16 / F→B事件记忆墙v16 / F→E财务仪表盘v16
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR876Loaded)return;RANDOM_EVENTS._domainFLinkageR876Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f876_data_viz_v16",phase:"street",icon:"📊",title:"数据可视化，洞察先机",story:"你盯着各种数据面板。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f876DataVizDone)return false;return st.player.day>=350},
probability:0.05,repeatable:false,
choices:[{text:"📊 深入分析可视化数据",hint:"智力+35,会计XP+42,置_f876DataVizInsight",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f876DataVizDone=true;st.flags._f876DataVizInsight=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+35);gx("accounting",42);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+35,会计XP+42。","success")}},
{text:"📝 简单记下关键数字",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f876DataVizDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("📝 心智+8。","info")}}]},
{id:"f876_event_memory_v16",phase:"street",icon:"📖",title:"记忆墙，人生回放",story:"你在事件日志里翻看过去的记录。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f876EventMemoryDone)return false;return st.player.day>=500},
probability:0.06,repeatable:false,
choices:[{text:"📖 翻阅记忆墙，写下感悟",hint:"心智+38,魅力+30,置_f876EventMemory",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f876EventMemoryDone=true;st.flags._f876EventMemory=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+38);st.player.charm=Math.min(100,(st.player.charm||50)+30)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+38,魅力+30。","success")}},
{text:"😊 回味一下就好",hint:"心情+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f876EventMemoryDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心情+10。","info")}}]},
{id:"f876_finance_dashboard_v16",phase:"street",icon:"💰",title:"财务仪表盘，看清钱袋子",story:"你打开财务仪表盘。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f876FinanceDashboardDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=300000&&st.player.day>=300},
probability:0.06,repeatable:false,
choices:[{text:"💰 深度分析财务数据",hint:"会计XP+45,智力+32,置_f876FinanceDashboard",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f876FinanceDashboardDone=true;st.flags._f876FinanceDashboard=true;if(st.resources){var inc=st.flags._dailyIncome||0,exp=st.flags._dailyExpense||0;st.flags._f876SaveRatio=(inc>0&&isFinite(inc)&&isFinite(exp))?Math.round((1-exp/inc)*100):0}gx("accounting",45);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+32);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 会计XP+45,智力+32。","success")}},
{text:"😅 知道有钱就行",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f876FinanceDashboardDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
