(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR998Loaded)return;RANDOM_EVENTS._domainFLinkageR998Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f998_price_trend_v1",phase:"street",icon:"📊",title:"价格周期洞察",
story:"你盯着价格走势图，发现了一些规律。市场总是在涨涨跌跌中循环。",
triggers:{minDay:15,interval:40,maxRepeats:5,excludeFlags:["_f998PriceTrendCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f998PriceTrendCd)return false;if(!st.trade)return false;return(st.trade.totalTrades||0)>=1&&st.player.day>=15;},
probability:0.04,repeatable:true,
choices:[
{text:"📊 分析价格周期",hint:"智力+3,销售XP+3,置_f998PriceAnalyst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f998PriceTrendCd=true;st.flags._f998PriceAnalyst=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);gx("sales",3);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 分析了价格周期——智力+3,销售XP+3。","success");}},
{text:"😅 随缘买卖",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f998PriceTrendCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 随缘买卖。心智+3。","info");}}
]},
{id:"f998_life_milestone_v1",phase:"street",icon:"📖",title:"人生故事墙",
story:"你翻看记录，那些高光时刻和低谷瞬间都历历在目。",
triggers:{minDay:25,interval:60,maxRepeats:4,excludeFlags:["_f998MilestoneCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f998MilestoneCd)return false;return(st.flags._eventHistory&&st.flags._eventHistory.length>=3)&&st.player.day>=25;},
probability:0.04,repeatable:true,
choices:[
{text:"📖 回顾人生故事",hint:"心智+4,魅力+2,置_f998LifeStoryteller",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f998MilestoneCd=true;st.flags._f998LifeStoryteller=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+4);st.player.charm=Math.min(100,(st.player.charm||50)+2)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 回顾了人生故事——心智+4,魅力+2。","success");}},
{text:"😅 向前看",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f998MilestoneCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 向前看。心智+3。","info");}}
]},
{id:"f998_wealth_dashboard_v1",phase:"street",icon:"💰",title:"财富仪表盘",
story:"你打开自己的财务记录，收入、支出、储蓄、投资——一张清晰的财富全景图。",
triggers:{minDay:20,interval:50,maxRepeats:4,excludeFlags:["_f998WealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f998WealthCd)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=300&&st.player.day>=20;},
probability:0.04,repeatable:true,
choices:[
{text:"💰 查看财富全景",hint:"心智+4,会计XP+4,置_f998WealthWise",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f998WealthCd=true;st.flags._f998WealthWise=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+4);gx("accounting",4);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 查看了财富全景——心智+4,会计XP+4。","success");}},
{text:"😅 够用就行",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f998WealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 够用就行。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
