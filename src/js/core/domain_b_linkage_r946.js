/**
 * 域B(事件/叙事) 联动增强 R946 — B→G事件韧性成长 / B→E事件经济智慧 / B→C事件职业灵感
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 *  - done-flag 防重复。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR946Loaded)return;RANDOM_EVENTS._domainBLinkageR946Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. B→G: 事件韧性成长 — 经历多次失败后，触发韧性成长
{id:"b946_resilience_growth",phase:"street",icon:"🌱",title:"失败是成功之母",
story:"你算了算，这已经是你第N次失败了。\n\n找工作被拒、做生意亏本、投资踩雷——你甚至开始怀疑自己是不是做啥啥不行。\n\n但你发现一个规律:每次失败后，你学到的东西都比成功时多。这些教训，正在悄悄地改变你。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b946ResilienceDone)return false;var _eh=st.flags._eventHistory||[];var _neg=0;for(var _i=0;_i<_eh.length;_i++){if(_eh[_i]&&_eh[_i].type==="negative")_neg++}return _neg>=10&&st.player.day>=150},
probability:0.05,repeatable:false,
choices:[{text:"🌱 从失败中总结经验",hint:"心智+35,系统标记失败中成长",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b946ResilienceDone=true;st.flags._b946GrowFromFailure=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+35);if(typeof StateManager!=="undefined")StateManager.addMessage("🌱 心智+35。失败不是终点——它是通往成功的必经之路。","success")}},
{text:"😔 太难受了，不想了",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b946ResilienceDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+8。","info")}}]},
// 2. B→E: 事件经济智慧 — 经历经济危机后，触发财务反思
{id:"b946_econ_crisis_reflect",phase:"street",icon:"💡",title:"危机中的智慧",
story:"你经历过最穷的时候，兜里只剩几块钱，连一碗面都吃不起。\n\n那时候你学会了:钱不是省出来的，但乱花一定存不住。\n\n现在你有了些积蓄，但那段经历让你永远记得——任何时候都要留一笔救命钱。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b946EconReflectDone)return false;return st.player.day>=250&&(st.resources.totalEarned||0)>=300000},
probability:0.04,repeatable:false,
choices:[{text:"💡 建立应急基金",hint:"智力+22,会计XP+32,系统标记应急基金",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b946EconReflectDone=true;st.flags._b946EmergencyFund=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("accounting",32);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 智力+22,会计XP+32。你建立了应急基金——安全感来自准备。","success")}},
{text:"😅 活在当下",hint:"心情+10,系统标记及时行乐",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b946EconReflectDone=true;st.flags._b946CarpeDiem=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+10。活在当下也是一种态度。","info")}}]},
// 3. B→C: 事件职业灵感 — 偶然事件触发职业转型思考
{id:"b946_career_pivot",phase:"street",icon:"🔄",title:"人生岔路口",
story:"你偶然看到了一篇报道，讲的是一个和你经历相似的人，通过转行实现了人生逆袭。\n\n你盯着手机屏幕发呆——你现在的工作虽然稳定，但天花板就在眼前。\n\n也许，改变并没有想象中那么可怕。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b946CareerPivotDone)return false;return st.player.day>=180&&st.player.phase==="street"&&(st.player.age||20)>=25&&(st.player.age||20)<=35},
probability:0.04,repeatable:false,
choices:[{text:"🔄 开始学习新技能",hint:"智力+20,管理XP+25,系统标记职业转型者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b946CareerPivotDone=true;st.flags._b946CareerChanger=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);gx("management",25);if(typeof StateManager!=="undefined")StateManager.addMessage("🔄 智力+20,管理XP+25。你决定学习新技能——改变永远不晚。","success")}},
{text:"😅 稳定最重要",hint:"心智+8,系统标记求稳",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b946CareerPivotDone=true;st.flags._b946Stability=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。稳定也是一种选择。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();