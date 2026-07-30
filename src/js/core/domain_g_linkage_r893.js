/**
 * 域G(核心机制/生命周期) 联动增强 R893 — G→A人生数据v29 / G→D人生社交v27 / G→E财富健康v18
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR893Loaded)return;RANDOM_EVENTS._domainGLinkageR893Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"g893_life_data_v29",phase:"street",icon:"📊",title:"人生数据，映照来路",story:"你翻开自己的生存记录。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g893LifeDataDone)return false;return st.player.day>=950&&st.status&&st.needs},
probability:0.05,repeatable:false,
choices:[{text:"📈 分析人生轨迹",hint:"智力+42,心智+40,置_g893Analyst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g893LifeDataDone=true;st.flags._g893Analyst=true;if(st.status&&st.needs){var h=st.status.health||100,hp=st.needs.happiness||50;st.flags._g893QualityScore=Math.min(100,Math.round(h*0.6+hp*0.4))}if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+42);st.player.mental=Math.min(100,(st.player.mental||50)+40)}if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+42,心智+40。","success")}},
{text:"🎯 设定新的人生目标",hint:"心智+40,置_g893GoalSetter",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g893LifeDataDone=true;st.flags._g893GoalSetter=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+40);if(typeof StateManager!=="undefined")StateManager.addMessage("🎯 心智+40。","info")}}]},
{id:"g893_life_social_v27",phase:"street",icon:"🎉",title:"人生节点，与友同庆",story:"每当你走到人生的重要节点，总有一些朋友在你身边。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g893LifeSocialDone)return false;if(!st.relationships)return false;var _age=st.player.age||18;if(_age<95)return false;var _f=0;for(var _id in st.relationships){var _r=st.relationships[_id];if(_r&&_r.met&&(_r.affinity||0)>=60)_f++}return _f>=25},
probability:0.06,repeatable:false,
choices:[{text:"🎉 感谢朋友的陪伴",hint:"心情+65,社交XP+50,置_g893FriendCompanion",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g893LifeSocialDone=true;st.flags._g893FriendCompanion=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+65);gx("social",50);if(typeof StateManager!=="undefined")StateManager.addMessage("🎉 心情+65,社交XP+50。","success")}},
{text:"😊 自己走也挺好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g893LifeSocialDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+5。","info")}}]},
{id:"g893_wealth_health_v18",phase:"street",icon:"💰",title:"财富传承，人生智慧",story:"你坐在桌前，看着自己的资产清单。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g893WealthHealthDone)return false;if(!st.resources)return false;var _age=st.player.age||18;if(_age<95)return false;var _t=(st.resources.cash||0)+(st.resources.bankBalance||0);if(st.investment){var h=st.investment.stockHoldings||[],m=st.investment.stockMarket||{};for(var i=0;i<h.length;i++){var hh=h[i],mm=m[hh.symbol];if(mm&&isFinite(mm.price)&&isFinite(hh.shares))_t+=mm.price*hh.shares}}return _t>=15000000},
probability:0.06,repeatable:false,
choices:[{text:"💰 规划财富传承",hint:"会计XP+65,智力+40,置_g893WealthReady",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g893WealthHealthDone=true;st.flags._g893WealthReady=true;gx("accounting",65);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+40);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 会计XP+65,智力+40。","success")}},
{text:"😅 维持现状就好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g893WealthHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
