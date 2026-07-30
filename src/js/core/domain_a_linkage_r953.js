(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR953Loaded)return;RANDOM_EVENTS._domainALinkageR953Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"a953_market_sentiment_v1",phase:"street",icon:"📊",title:"市场情绪波动",
story:"你注意到最近市场情绪有些异常。摊贩们议论纷纷，空气中弥漫着不安。",
triggers:{minDay:20,interval:70,maxRepeats:5,excludeFlags:["_a953SentimentCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a953SentimentCd)return false;if(!st.flags)return false;return(Math.abs(st.flags._cumulativeInflation||0)>0.05||(st.flags._priceVolatilityCount||0)>=2)&&st.player.day>=20;},
probability:0.04,repeatable:true,
choices:[
{text:"📊 分析市场情绪",hint:"智力+8,销售XP+10,置_a953SentimentAware",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a953SentimentCd=true;st.flags._a953SentimentAware=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+8);gx("sales",10);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 分析了市场情绪——智力+8,销售XP+10。","success");}},
{text:"😅 照常做事",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a953SentimentCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 照常做事。心智+3。","info");}}
]},
{id:"a953_econ_health_v1",phase:"street",icon:"💚",title:"经济基础决定生活",
story:"你算了算收支状况。物价、收入、负债——这些数字直接影响生活质量。",
triggers:{minDay:35,interval:70,maxRepeats:5,excludeFlags:["_a953EconHealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a953EconHealthCd)return false;if(!st.flags||!st.resources)return false;return(Math.abs(st.flags._cumulativeInflation||0)>0.06||(st.resources.cash||0)<200)&&st.player.day>=35;},
probability:0.04,repeatable:true,
choices:[
{text:"💚 评估经济健康",hint:"心智+8,会计XP+10,置_a953EconHealth",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a953EconHealthCd=true;st.flags._a953EconHealth=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);gx("accounting",10);if(typeof StateManager!=="undefined")StateManager.addMessage("💚 评估了经济健康——心智+8,会计XP+10。","success");}},
{text:"😅 走一步看一步",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a953EconHealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 走一步看一步。心智+3。","info");}}
]},
{id:"a953_inflation_invest_v1",phase:"street",icon:"📈",title:"通胀觉醒",
story:"物价持续上涨，你意识到现金放在手里会越来越不值钱。",
triggers:{minDay:45,interval:90,maxRepeats:3,excludeFlags:["_a953InflationInvestCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a953InflationInvestCd)return false;if(!st.flags)return false;return(st.flags._cumulativeInflation||0)>0.10&&st.player.day>=45;},
probability:0.04,repeatable:true,
choices:[
{text:"📈 学习投资抗通胀",hint:"智力+10,会计XP+12,置_a953InflationInvestor",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a953InflationInvestCd=true;st.flags._a953InflationInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+10);gx("accounting",12);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 学习了投资抗通胀——智力+10,会计XP+12。","success");}},
{text:"😅 现金为王",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a953InflationInvestCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金为王。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
