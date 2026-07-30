/**
 * 域A(数据/数值平衡) 联动增强 R895 — A→B价格波动叙事v27 / A→G经济健康度v26 / A→C技能市场需求v26
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR895Loaded)return;RANDOM_EVENTS._domainALinkageR895Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"a895_price_narrative_v27",phase:"street",icon:"📈",title:"市场低语，机会暗藏",story:"最近市场价格波动带着一种奇特的规律。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a895PriceNarrDone)return false;return(st.flags._priceVolatilityCount||0)>=40&&st.player.day>=750},
probability:0.05,repeatable:false,
choices:[{text:"📈 深入研究市场规律",hint:"智力+42,心智+40,置_a895MarketSense",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a895PriceNarrDone=true;st.flags._a895MarketSense=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+42);st.player.mental=Math.min(100,(st.player.mental||50)+40)}if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+42,心智+40。","success")}},
{text:"😅 市场太复杂了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a895PriceNarrDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"a895_econ_health_v26",phase:"street",icon:"💚",title:"经济健康，生活从容",story:"你算了算——总资产突破了三百万。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a895EconHealthDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=3000000},
probability:0.06,repeatable:false,
choices:[{text:"💚 评估经济健康度",hint:"心智+42,会计XP+50,置_a895EconHealthy",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a895EconHealthDone=true;st.flags._a895EconHealthy=true;var _d=(st.resources.villageDebt||0)+(st.resources.fineDebt||0)+(st.resources.bankDebt||0);var _a=(st.resources.cash||0)+(st.resources.bankBalance||0);st.flags._a895DebtToAssetRatio=_a>0?Math.round(_d/_a*100)/100:0;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+42);gx("accounting",50);if(typeof StateManager!=="undefined")StateManager.addMessage("💚 心智+42,会计XP+50。","success")}},
{text:"😅 有钱就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a895EconHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"a895_skill_demand_v26",phase:"street",icon:"📈",title:"技能溢价，市场认可",story:"你打开求职市场。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a895SkillDemandDone)return false;if(!st.skills)return false;var _c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>=100)_c++}return _c>=8},
probability:0.05,repeatable:false,
choices:[{text:"📈 用技能溢价兑换机会",hint:"会计XP+48,智力+40,置_a895SkillMonetizer",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a895SkillDemandDone=true;st.flags._a895SkillMonetizer=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+40);gx("accounting",48);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+40,会计XP+48。","success")}},
{text:"😅 慢慢来",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a895SkillDemandDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
