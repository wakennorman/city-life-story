/**
 * 域B(事件/叙事) 联动增强 R916 — B→A事件数据遗产v17 / B→D事件友谊深化v17 / B→G事件人生影响v17
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR916Loaded)return;RANDOM_EVENTS._domainBLinkageR916Loaded=true;
var E=[
{id:"b916_event_data_v17",phase:"street",icon:"📊",title:"事件的数据价值",story:"你回顾这段时间经历的大大小小事件，发现每一件事都在你的人生数据中留下了痕迹。\n\n「每一次选择、每一次意外、每一次转折——这些事件构成了你的人生轨迹。」\n\n你开始意识到，记录和分析这些事件，能帮你更好地预测未来。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b916EventDataDone)return false;var _eh=st.eventHistory||[];return _eh.length>=20&&st.player.day>=300},
probability:0.06,repeatable:false,
choices:[{text:"📊 分析事件数据模式",hint:"智力+20,心智+15,系统标记事件数据分析师",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b916EventDataDone=true;st.flags._b916EventAnalyst=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);st.player.mental=Math.min(100,(st.player.mental||50)+15)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+20,心智+15。事件数据分析能力提升！","success")}},
{text:"😅 过去就过去了",hint:"心情+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b916EventDataDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+8。","info")}}]},
{id:"b916_event_friendship_v17",phase:"street",icon:"🤝",title:"事件中的友谊",story:"你发现，那些一起经历过风浪的朋友，关系变得更加牢固。\n\n「真正的友谊不是在顺境中建立的，而是在逆境中检验的。」\n\n一次困难时期的帮助，比一百次酒桌上的碰杯更有价值。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b916EventFriendshipDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){if(st.relationships[_ni]&&(st.relationships[_ni].affinity||0)>=50)_hc++}return _hc>=3&&st.player.day>=250},
probability:0.06,repeatable:false,
choices:[{text:"🤝 珍惜共患难的朋友",hint:"心智+18,社交XP+30,系统标记患难之交",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b916EventFriendshipDone=true;st.flags._b916TrueFriendship=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+18);if(typeof addSkillXp==="function"){try{addSkillXp("social",30)}catch(e){}}if(typeof StateManager!=="undefined")StateManager.addMessage("🤝 心智+18,社交XP+30。患难见真情！","success")}},
{text:"😅 一个人挺好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b916EventFriendshipDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"b916_event_life_impact_v17",phase:"street",icon:"💫",title:"事件如何塑造人生",story:"你回想那些改变你人生轨迹的关键事件。\n\n「如果那天你没有去那个工地，如果那天你没有接那个电话，你的人生会完全不同。」\n\n每个看似偶然的事件，都在悄然改变着你的人生方向。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b916EventLifeImpactDone)return false;return st.player.day>=400},
probability:0.05,repeatable:false,
choices:[{text:"💫 反思关键事件的影响",hint:"心智+22,心情+15,系统标记人生反思者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b916EventLifeImpactDone=true;st.flags._b916LifeReflector=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+22);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+15);if(typeof StateManager!=="undefined")StateManager.addMessage("💫 心智+22,心情+15。人生反思的智慧！","success")}},
{text:"😅 向前看",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b916EventLifeImpactDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();