(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR974Loaded)return;RANDOM_EVENTS._domainFLinkageR974Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f974_price_trend_v1",phase:"street",icon:"📊",title:"价格周期洞察",
story:"你盯着价格走势图，发现了一些规律。市场总是在涨涨跌跌中循环。",
triggers:{minDay:25,interval:55,maxRepeats:5,excludeFlags:["_f974PriceTrendCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f974PriceTrendCd)return false;if(!st.trade)return false;return(st.trade.totalTrades||0)>=3&&st.player.day>=25;},
probability:0.04,repeatable:true,
choices:[
{text:"📊 分析价格周期",hint:"智力+5,销售XP+6,置_f974PriceAnalyst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f974PriceTrendCd=true;st.flags._f974PriceAnalyst=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);gx("sales",6);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 分析了价格周期——智力+5,销售XP+6。","success");}},
{text:"😅 随缘买卖",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f974PriceTrendCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 随缘买卖。心智+3。","info");}}
]},
{id:"f974_life_milestone_v1",phase:"street",icon:"📖",title:"人生故事墙",
story:"你翻看记录，那些高光时刻和低谷瞬间都历历在目。",
triggers:{minDay:40,interval:90,maxRepeats:4,excludeFlags:["_f974MilestoneCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f974MilestoneCd)return false;return(st.flags._eventHistory&&st.flags._eventHistory.length>=8)&&st.player.day>=40;},
probability:0.04,repeatable:true,
choices:[
{text:"📖 回顾人生故事",hint:"心智+8,魅力+3,置_f974LifeStoryteller",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f974MilestoneCd=true;st.flags._f974LifeStoryteller=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+8);st.player.charm=Math.min(100,(st.player.charm||50)+3)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 回顾了人生故事——心智+8,魅力+3。","success");}},
{text:"😅 向前看",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f974MilestoneCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 向前看。心智+3。","info");}}
]},
{id:"f974_wealth_dashboard_v1",phase:"street",icon:"💰",title:"财富仪表盘",
story:"你打开自己的财务记录，收入、支出、储蓄、投资——一张清晰的财富全景图。",
triggers:{minDay:35,interval:70,maxRepeats:4,excludeFlags:["_f974WealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f974WealthCd)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=800&&st.player.day>=35;},
probability:0.04,repeatable:true,
choices:[
{text:"💰 查看财富全景",hint:"心智+6,会计XP+8,置_f974WealthWise",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f974WealthCd=true;st.flags._f974WealthWise=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+6);gx("accounting",8);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 查看了财富全景——心智+6,会计XP+8。","success");}},
{text:"😅 够用就行",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f974WealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 够用就行。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
