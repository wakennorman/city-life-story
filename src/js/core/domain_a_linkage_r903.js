/**
 * 域A(数据/数值平衡) 联动增强 R903 — A→B价格波动叙事v28 / A→G经济健康度v27 / A→C技能市场需求v27
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR903Loaded)return;RANDOM_EVENTS._domainALinkageR903Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"a903_price_narrative_v28",phase:"street",icon:"📈",title:"市场低语，机会暗藏",story:"最近市场价格波动带着一种奇特的规律。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a903PriceNarrDone)return false;return(st.flags._priceVolatilityCount||0)>=45&&st.player.day>=800},
probability:0.05,repeatable:false,
choices:[{text:"📈 深入研究市场规律",hint:"智力+45,心智+42,置_a903MarketSense",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a903PriceNarrDone=true;st.flags._a903MarketSense=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+45);st.player.mental=Math.min(100,(st.player.mental||50)+42)}if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+45,心智+42。","success")}},
{text:"😅 市场太复杂了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a903PriceNarrDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"a903_econ_health_v27",phase:"street",icon:"💚",title:"经济健康，生活从容",story:"你算了算——总资产突破了五百万。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a903EconHealthDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=5000000},
probability:0.06,repeatable:false,
choices:[{text:"💚 评估经济健康度",hint:"心智+45,会计XP+52,置_a903EconHealthy",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a903EconHealthDone=true;st.flags._a903EconHealthy=true;var _d=(st.resources.villageDebt||0)+(st.resources.fineDebt||0)+(st.resources.bankDebt||0);var _a=(st.resources.cash||0)+(st.resources.bankBalance||0);st.flags._a903DebtToAssetRatio=_a>0?Math.round(_d/_a*100)/100:0;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+45);gx("accounting",52);if(typeof StateManager!=="undefined")StateManager.addMessage("💚 心智+45,会计XP+52。","success")}},
{text:"😅 有钱就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a903EconHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"a903_skill_demand_v27",phase:"street",icon:"📈",title:"技能溢价，市场认可",story:"你打开求职市场。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a903SkillDemandDone)return false;if(!st.skills)return false;var _c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>=100)_c++}return _c>=10},
probability:0.05,repeatable:false,
choices:[{text:"📈 用技能溢价兑换机会",hint:"会计XP+50,智力+42,置_a903SkillMonetizer",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a903SkillDemandDone=true;st.flags._a903SkillMonetizer=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+42);gx("accounting",50);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+42,会计XP+50。","success")}},
{text:"😅 慢慢来",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a903SkillDemandDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
