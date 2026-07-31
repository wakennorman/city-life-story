/**
 * 域F(UI/UX) 联动增强 R1014 — F→A数据可视化 / F→B事件记忆墙 / F→E财务仪表盘
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR1014Loaded)return;RANDOM_EVENTS._domainFLinkageR1014Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. F→A: 数据可视化 — 价格数据积累触发洞察
{id:"f1014_price_cycle",phase:"street",icon:"📊",title:"价格的秘密",
story:"你盯着价格走势图，发现了一个之前没注意到的秘密。\n\n「每次价格跌到谷底后，都会有一波反弹。每次涨到高峰后，都会有一波回调。」\n\n这不是什么高深的理论，只是最简单的市场规律——但你以前从没认真看过。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f1014CycleDone)return false;var _ph=st.flags._priceIndexHistory||[];return _ph.length>=20&&st.player.day>=100},
probability:0.04,repeatable:false,
choices:[{text:"📊 掌握价格周期",hint:"智力+25,会计XP+28,系统标记价格周期",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1014CycleDone=true;st.flags._f1014CycleMaster=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",28);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+25,会计XP+28。你掌握了价格周期——低买高卖不再是一句空话。","success")}},
{text:"😅 太复杂了",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1014CycleDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. F→B: 事件记忆墙 — 回顾人生重要事件
{id:"f1014_memory_path",phase:"street",icon:"📖",title:"记忆的小径",
story:"你走在记忆的小径上，两旁的每一棵树都代表着一个重要的时刻。\n\n那棵大树是你第一次成功时的喜悦，那棵歪脖子树是你低谷时的挣扎，那棵正在生长的小树是正在发生的现在。\n\n每一条路，都是你走过的路。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f1014PathDone)return false;var _eh=st.flags._eventHistory||[];return _eh.length>=25&&st.player.day>=200},
probability:0.03,repeatable:false,
choices:[{text:"📖 回顾记忆小径",hint:"心智+30,魅力+18,系统标记记忆小径",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1014PathDone=true;st.flags._f1014MemoryPath=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+30);st.player.charm=Math.min(100,(st.player.charm||20)+18)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+30,魅力+18。每一条路，都是你走过的路——每一步都算数。","success")}},
{text:"😔 继续往前走",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1014PathDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+5。","info")}}]},
// 3. F→E: 财务仪表盘 — 总资产达到一定规模
{id:"f1014_wealth_overview",phase:"street",icon:"💎",title:"财富全景",
story:"你打开财务总览，第一次对自己的资产有了完整的认识。\n\n"+(function(){try{var _s=typeof StateManager!=="undefined"?StateManager.getState():null;if(_s&&_s.resources){var _c=_s.resources.cash||0,_b=_s.resources.bankBalance||0,_e=_s.resources.totalEarned||0;return "现金: ¥"+Math.floor(_c).toLocaleString()+"\n存款: ¥"+Math.floor(_b).toLocaleString()+"\n终身收入: ¥"+Math.floor(_e).toLocaleString()}return""}catch(e){return""})()+"\n\n你不再只是看数字——你看到了这些数字背后，是自己这些年的努力和成长。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f1014OverviewDone)return false;if(!st.resources)return false;return(st.resources.totalEarned||0)>=500000&&st.player.day>=300},
probability:0.04,repeatable:false,
choices:[{text:"💎 规划下一步",hint:"智力+25,会计XP+35,系统标记财富全景",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1014OverviewDone=true;st.flags._f1014Overview=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("💎 智力+25,会计XP+35。你看到了财富的全景——数字背后是努力和成长。","success")}},
{text:"😅 继续努力",hint:"现金+10000,系统标记持续努力",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1014OverviewDone=true;st.flags._f1014KeepGoing=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+10000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+10000。继续努力——每一步都算数。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();