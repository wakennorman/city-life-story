(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR982Loaded)return;RANDOM_EVENTS._domainFLinkageR982Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f982_price_trend_v1",phase:"street",icon:"📊",title:"价格周期洞察",
story:"你盯着价格走势图，发现了一些规律。市场总是在涨涨跌跌中循环。",
triggers:{minDay:20,interval:50,maxRepeats:5,excludeFlags:["_f982PriceTrendCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f982PriceTrendCd)return false;if(!st.trade)return false;return(st.trade.totalTrades||0)>=2&&st.player.day>=20;},
probability:0.04,repeatable:true,
choices:[
{text:"📊 分析价格周期",hint:"智力+4,销售XP+5,置_f982PriceAnalyst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f982PriceTrendCd=true;st.flags._f982PriceAnalyst=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+4);gx("sales",5);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 分析了价格周期——智力+4,销售XP+5。","success");}},
{text:"😅 随缘买卖",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f982PriceTrendCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 随缘买卖。心智+3。","info");}}
]},
{id:"f982_life_milestone_v1",phase:"street",icon:"📖",title:"人生故事墙",
story:"你翻看记录，那些高光时刻和低谷瞬间都历历在目。",
triggers:{minDay:35,interval:80,maxRepeats:4,excludeFlags:["_f982MilestoneCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f982MilestoneCd)return false;return(st.flags._eventHistory&&st.flags._eventHistory.length>=5)&&st.player.day>=35;},
probability:0.04,repeatable:true,
choices:[
{text:"📖 回顾人生故事",hint:"心智+6,魅力+3,置_f982LifeStoryteller",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f982MilestoneCd=true;st.flags._f982LifeStoryteller=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+6);st.player.charm=Math.min(100,(st.player.charm||50)+3)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 回顾了人生故事——心智+6,魅力+3。","success");}},
{text:"😅 向前看",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f982MilestoneCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 向前看。心智+3。","info");}}
]},
{id:"f982_wealth_dashboard_v1",phase:"street",icon:"💰",title:"财富仪表盘",
story:"你打开自己的财务记录，收入、支出、储蓄、投资——一张清晰的财富全景图。",
triggers:{minDay:30,interval:60,maxRepeats:4,excludeFlags:["_f982WealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f982WealthCd)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=500&&st.player.day>=30;},
probability:0.04,repeatable:true,
choices:[
{text:"💰 查看财富全景",hint:"心智+5,会计XP+6,置_f982WealthWise",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f982WealthCd=true;st.flags._f982WealthWise=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);gx("accounting",6);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 查看了财富全景——心智+5,会计XP+6。","success");}},
{text:"😅 够用就行",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f982WealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 够用就行。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
