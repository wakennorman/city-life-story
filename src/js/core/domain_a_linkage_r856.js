/**
 * 域A(数据/数值平衡) 联动增强 R856 — A→B价格波动叙事v22 / A→G经济健康度v21 / A→C技能市场需求v21
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR856Loaded)return;RANDOM_EVENTS._domainALinkageR856Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"a856_price_narrative_v22",phase:"street",icon:"📈",title:"市场低语，机会暗藏",story:"最近市场价格波动带着一种奇特的规律——你隐约觉得，市场在向你传递某种信号。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a856PriceNarrDone)return false;return(st.flags._priceVolatilityCount||0)>=22&&st.player.day>=500},
probability:0.05,repeatable:false,
choices:[{text:"📈 深入研究市场规律",hint:"智力+30,心智+28,置_a856MarketSense",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a856PriceNarrDone=true;st.flags._a856MarketSense=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+30);st.player.mental=Math.min(100,(st.player.mental||50)+28)}if(typeof StateManager!=="undefined")StateManager.addMessage("📈 你开始深入研究市场规律——智力+30,心智+28。","success")}},
{text:"😅 市场太复杂了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a856PriceNarrDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 市场太复杂了。心智+5。","info")}}]},
{id:"a856_econ_health_v21",phase:"street",icon:"💚",title:"经济健康，生活从容",story:"你算了算——总资产突破了九十万。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a856EconHealthDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=900000},
probability:0.06,repeatable:false,
choices:[{text:"💚 评估经济健康度",hint:"心智+30,会计XP+38,置_a856EconHealthy",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a856EconHealthDone=true;st.flags._a856EconHealthy=true;var _d=(st.resources.villageDebt||0)+(st.resources.fineDebt||0)+(st.resources.bankDebt||0);var _a=(st.resources.cash||0)+(st.resources.bankBalance||0);st.flags._a856DebtToAssetRatio=_a>0?Math.round(_d/_a*100)/100:0;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+30);gx("accounting",38);if(typeof StateManager!=="undefined")StateManager.addMessage("💚 经济健康度评估完成——心智+30,会计XP+38。","success")}},
{text:"😅 有钱就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a856EconHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 有钱就行。心智+5。","info")}}]},
{id:"a856_skill_demand_v21",phase:"street",icon:"📈",title:"技能溢价，市场认可",story:"你打开求职市场——发现自己的技能水平已经远超同龄人。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a856SkillDemandDone)return false;if(!st.skills)return false;var _c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>=85)_c++}return _c>=6},
probability:0.05,repeatable:false,
choices:[{text:"📈 用技能溢价兑换机会",hint:"会计XP+35,智力+28,置_a856SkillMonetizer",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a856SkillDemandDone=true;st.flags._a856SkillMonetizer=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 你用技能溢价兑换到更好的机会——智力+28,会计XP+35。","success")}},
{text:"😅 慢慢来",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a856SkillDemandDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 慢慢来。心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();