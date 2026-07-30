(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR966Loaded)return;RANDOM_EVENTS._domainFLinkageR966Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f966_price_trend_v1",phase:"street",icon:"📊",title:"价格周期洞察",
story:"你盯着价格走势图，发现了一些规律。市场总是在涨涨跌跌中循环，而你要做的就是在低谷买入、高峰卖出。",
triggers:{minDay:30,interval:60,maxRepeats:5,excludeFlags:["_f966PriceTrendCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f966PriceTrendCd)return false;if(!st.trade)return false;return(st.trade.totalTrades||0)>=5&&st.player.day>=30;},
probability:0.04,repeatable:true,
choices:[
{text:"📊 分析价格周期",hint:"智力+6,销售XP+8,置_f966PriceAnalyst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f966PriceTrendCd=true;st.flags._f966PriceAnalyst=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+6);gx("sales",8);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 分析了价格周期——智力+6,销售XP+8。","success");}},
{text:"😅 随缘买卖",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f966PriceTrendCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 随缘买卖。心智+3。","info");}}
]},
{id:"f966_life_milestone_v1",phase:"street",icon:"📖",title:"人生故事墙",
story:"你翻看这些日子的记录，那些高光时刻和低谷瞬间都历历在目。每一段经历都是人生的注脚。",
triggers:{minDay:50,interval:100,maxRepeats:4,excludeFlags:["_f966MilestoneCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f966MilestoneCd)return false;return(st.flags._eventHistory&&st.flags._eventHistory.length>=10)&&st.player.day>=50;},
probability:0.04,repeatable:true,
choices:[
{text:"📖 回顾人生故事",hint:"心智+10,魅力+4,置_f966LifeStoryteller",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f966MilestoneCd=true;st.flags._f966LifeStoryteller=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+10);st.player.charm=Math.min(100,(st.player.charm||50)+4)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 回顾了人生故事——心智+10,魅力+4。","success");}},
{text:"😅 向前看",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f966MilestoneCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 向前看。心智+3。","info");}}
]},
{id:"f966_wealth_dashboard_v1",phase:"street",icon:"💰",title:"财富仪表盘",
story:"你打开自己的财务记录，收入、支出、储蓄、投资——一张清晰的财富全景图呈现在眼前。",
triggers:{minDay:40,interval:80,maxRepeats:4,excludeFlags:["_f966WealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f966WealthCd)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=1000&&st.player.day>=40;},
probability:0.04,repeatable:true,
choices:[
{text:"💰 查看财富全景",hint:"心智+8,会计XP+10,置_f966WealthWise",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f966WealthCd=true;st.flags._f966WealthWise=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);gx("accounting",10);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 查看了财富全景——心智+8,会计XP+10。","success");}},
{text:"😅 够用就行",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f966WealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 够用就行。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
