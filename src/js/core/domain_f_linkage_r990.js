(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR990Loaded)return;RANDOM_EVENTS._domainFLinkageR990Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f990_price_trend_v1",phase:"street",icon:"📊",title:"价格周期洞察",
story:"你盯着价格走势图，发现了一些规律。市场总是在涨涨跌跌中循环。",
triggers:{minDay:18,interval:45,maxRepeats:5,excludeFlags:["_f990PriceTrendCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f990PriceTrendCd)return false;if(!st.trade)return false;return(st.trade.totalTrades||0)>=2&&st.player.day>=18;},
probability:0.04,repeatable:true,
choices:[
{text:"📊 分析价格周期",hint:"智力+3,销售XP+4,置_f990PriceAnalyst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f990PriceTrendCd=true;st.flags._f990PriceAnalyst=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);gx("sales",4);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 分析了价格周期——智力+3,销售XP+4。","success");}},
{text:"😅 随缘买卖",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f990PriceTrendCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 随缘买卖。心智+3。","info");}}
]},
{id:"f990_life_milestone_v1",phase:"street",icon:"📖",title:"人生故事墙",
story:"你翻看记录，那些高光时刻和低谷瞬间都历历在目。",
triggers:{minDay:30,interval:70,maxRepeats:4,excludeFlags:["_f990MilestoneCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f990MilestoneCd)return false;return(st.flags._eventHistory&&st.flags._eventHistory.length>=4)&&st.player.day>=30;},
probability:0.04,repeatable:true,
choices:[
{text:"📖 回顾人生故事",hint:"心智+5,魅力+2,置_f990LifeStoryteller",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f990MilestoneCd=true;st.flags._f990LifeStoryteller=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+5);st.player.charm=Math.min(100,(st.player.charm||50)+2)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 回顾了人生故事——心智+5,魅力+2。","success");}},
{text:"😅 向前看",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f990MilestoneCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 向前看。心智+3。","info");}}
]},
{id:"f990_wealth_dashboard_v1",phase:"street",icon:"💰",title:"财富仪表盘",
story:"你打开自己的财务记录，收入、支出、储蓄、投资——一张清晰的财富全景图。",
triggers:{minDay:25,interval:55,maxRepeats:4,excludeFlags:["_f990WealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f990WealthCd)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=400&&st.player.day>=25;},
probability:0.04,repeatable:true,
choices:[
{text:"💰 查看财富全景",hint:"心智+4,会计XP+5,置_f990WealthWise",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f990WealthCd=true;st.flags._f990WealthWise=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+4);gx("accounting",5);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 查看了财富全景——心智+4,会计XP+5。","success");}},
{text:"😅 够用就行",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f990WealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 够用就行。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
