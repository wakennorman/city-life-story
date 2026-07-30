/**
 * 域G(核心机制/生命周期) 联动增强 R901 — G→A人生数据v30 / G→D人生社交v28 / G→E财富健康v19
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR901Loaded)return;RANDOM_EVENTS._domainGLinkageR901Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"g901_life_data_v30",phase:"street",icon:"📊",title:"人生数据，映照来路",story:"你翻开自己的生存记录。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g901LifeDataDone)return false;return st.player.day>=1000&&st.status&&st.needs},
probability:0.05,repeatable:false,
choices:[{text:"📈 分析人生轨迹",hint:"智力+45,心智+42,置_g901Analyst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g901LifeDataDone=true;st.flags._g901Analyst=true;if(st.status&&st.needs){var h=st.status.health||100,hp=st.needs.happiness||50;st.flags._g901QualityScore=Math.min(100,Math.round(h*0.6+hp*0.4))}if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+45);st.player.mental=Math.min(100,(st.player.mental||50)+42)}if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+45,心智+42。","success")}},
{text:"🎯 设定新的人生目标",hint:"心智+42,置_g901GoalSetter",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g901LifeDataDone=true;st.flags._g901GoalSetter=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+42);if(typeof StateManager!=="undefined")StateManager.addMessage("🎯 心智+42。","info")}}]},
{id:"g901_life_social_v28",phase:"street",icon:"🎉",title:"人生节点，与友同庆",story:"每当你走到人生的重要节点，总有一些朋友在你身边。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g901LifeSocialDone)return false;if(!st.relationships)return false;var _age=st.player.age||18;if(_age<100)return false;var _f=0;for(var _id in st.relationships){var _r=st.relationships[_id];if(_r&&_r.met&&(_r.affinity||0)>=60)_f++}return _f>=30},
probability:0.06,repeatable:false,
choices:[{text:"🎉 感谢朋友的陪伴",hint:"心情+70,社交XP+55,置_g901FriendCompanion",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g901LifeSocialDone=true;st.flags._g901FriendCompanion=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+70);gx("social",55);if(typeof StateManager!=="undefined")StateManager.addMessage("🎉 心情+70,社交XP+55。","success")}},
{text:"😊 自己走也挺好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g901LifeSocialDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+5。","info")}}]},
{id:"g901_wealth_health_v19",phase:"street",icon:"💰",title:"财富传承，人生智慧",story:"你坐在桌前，看着自己的资产清单。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g901WealthHealthDone)return false;if(!st.resources)return false;var _age=st.player.age||18;if(_age<100)return false;var _t=(st.resources.cash||0)+(st.resources.bankBalance||0);if(st.investment){var h=st.investment.stockHoldings||[],m=st.investment.stockMarket||{};for(var i=0;i<h.length;i++){var hh=h[i],mm=m[hh.symbol];if(mm&&isFinite(mm.price)&&isFinite(hh.shares))_t+=mm.price*hh.shares}}return _t>=20000000},
probability:0.06,repeatable:false,
choices:[{text:"💰 规划财富传承",hint:"会计XP+70,智力+42,置_g901WealthReady",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g901WealthHealthDone=true;st.flags._g901WealthReady=true;gx("accounting",70);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+42);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 会计XP+70,智力+42。","success")}},
{text:"😅 维持现状就好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g901WealthHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
