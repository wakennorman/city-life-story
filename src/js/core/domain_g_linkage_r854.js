/**
 * 域G(核心机制/生命周期) 联动增强 R854 — G→A人生数据v24 / G→D人生社交v22 / G→E财富健康v13
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR854Loaded)return;RANDOM_EVENTS._domainGLinkageR854Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"g854_life_data_v24",phase:"street",icon:"📊",title:"人生数据，映照来路",story:"你翻开自己的生存记录——每一天的喜怒哀乐，都变成了数据。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g854LifeDataDone)return false;return st.player.day>=700&&st.status&&st.needs},
probability:0.05,repeatable:false,
choices:[{text:"📈 分析人生轨迹",hint:"智力+30,心智+28,置_g854Analyst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g854LifeDataDone=true;st.flags._g854Analyst=true;if(st.status&&st.needs){var h=st.status.health||100,hp=st.needs.happiness||50;st.flags._g854QualityScore=Math.min(100,Math.round(h*0.6+hp*0.4))}if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+30);st.player.mental=Math.min(100,(st.player.mental||50)+28)}if(typeof StateManager!=="undefined")StateManager.addMessage("📈 '数据是过去的见证,也是未来的指引。' 智力+30,心智+28。","success")}},
{text:"🎯 设定新的人生目标",hint:"心智+28,置_g854GoalSetter",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g854LifeDataDone=true;st.flags._g854GoalSetter=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+28);if(typeof StateManager!=="undefined")StateManager.addMessage("🎯 '有目标,人生才有方向。' 心智+28。","info")}}]},
{id:"g854_life_social_v22",phase:"street",icon:"🎉",title:"人生节点，与友同庆",story:"你发现——每当你走到人生的一个重要节点，总有一些朋友在你身边。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g854LifeSocialDone)return false;if(!st.relationships)return false;var _age=st.player.age||18;if(_age<70)return false;var _f=0;for(var _id in st.relationships){var _r=st.relationships[_id];if(_r&&_r.met&&(_r.affinity||0)>=60)_f++}return _f>=15},
probability:0.06,repeatable:false,
choices:[{text:"🎉 感谢朋友的陪伴",hint:"心情+40,社交XP+35,置_g854FriendCompanion",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g854LifeSocialDone=true;st.flags._g854FriendCompanion=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+40);gx("social",35);if(typeof StateManager!=="undefined")StateManager.addMessage("🎉 感谢朋友的陪伴——心情+40,社交XP+35。","success")}},
{text:"😊 自己走也挺好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g854LifeSocialDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 自己走也挺好。心智+5。","info")}}]},
{id:"g854_wealth_health_v13",phase:"street",icon:"💰",title:"财富传承，人生智慧",story:"你坐在桌前，看着自己的资产清单。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g854WealthHealthDone)return false;if(!st.resources)return false;var _age=st.player.age||18;if(_age<70)return false;var _t=(st.resources.cash||0)+(st.resources.bankBalance||0);if(st.investment){var h=st.investment.stockHoldings||[],m=st.investment.stockMarket||{};for(var i=0;i<h.length;i++){var hh=h[i],mm=m[hh.symbol];if(mm&&isFinite(mm.price)&&isFinite(hh.shares))_t+=mm.price*hh.shares}}return _t>=2000000},
probability:0.06,repeatable:false,
choices:[{text:"💰 规划财富传承",hint:"会计XP+40,智力+28,置_g854WealthReady",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g854WealthHealthDone=true;st.flags._g854WealthReady=true;gx("accounting",40);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 你规划了财富传承方案——会计XP+40,智力+28。","success")}},
{text:"😅 维持现状就好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g854WealthHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 维持现状就好。心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();