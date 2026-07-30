/**
 * 域B(事件/叙事) 联动增强 R924 — B→A事件数据遗产v18 / B→D事件友谊深化v18 / B→G事件人生影响v18
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR924Loaded)return;RANDOM_EVENTS._domainBLinkageR924Loaded=true;
var E=[
{id:"b924_event_data_v18",phase:"street",icon:"📊",title:"事件的数据价值",story:"你统计了自己这段时间经历的所有事件，发现了一个有趣的模式。\n\n「你遇到的好事和坏事比例大约是6:4。但那些最糟糕的时刻，恰恰是你成长最快的时刻。」\n\n数据告诉你：逆境不是敌人，而是最好的老师。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b924EventDataDone)return false;var _eh=st.eventHistory||[];return _eh.length>=25&&st.player.day>=350},
probability:0.06,repeatable:false,
choices:[{text:"📊 从事件数据中学习",hint:"智力+22,心智+18,系统标记事件学习者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b924EventDataDone=true;st.flags._b924EventLearner=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);st.player.mental=Math.min(100,(st.player.mental||50)+18)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+22,心智+18。从事件中学习的能力提升！","success")}},
{text:"😅 过去就过去了",hint:"心情+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b924EventDataDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+8。","info")}}]},
{id:"b924_event_friendship_v18",phase:"street",icon:"🤝",title:"共同经历的力量",story:"你和一位老朋友聊起了过去的经历，那些共同经历过的风雨让你们的友谊更加深厚。\n\n「记得那次我们一起……吗?」\n\n话还没说完，两人都笑了。有些回忆，只属于你们。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b924EventFriendshipDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){if(st.relationships[_ni]&&(st.relationships[_ni].affinity||0)>=50)_hc++}return _hc>=4&&st.player.day>=300},
probability:0.06,repeatable:false,
choices:[{text:"🤝 珍惜这份友谊",hint:"心智+20,社交XP+35,系统标记友谊珍惜者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b924EventFriendshipDone=true;st.flags._b924FriendshipValuer=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+20);if(typeof addSkillXp==="function"){try{addSkillXp("social",35)}catch(e){}}if(typeof StateManager!=="undefined")StateManager.addMessage("🤝 心智+20,社交XP+35。友谊是人生最宝贵的财富！","success")}},
{text:"😅 君子之交淡如水",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b924EventFriendshipDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"b924_event_life_impact_v18",phase:"street",icon:"💫",title:"改变人生的那一件事",story:"每个人的人生中，都有那么一件事，改变了所有的轨迹。\n\n「如果那天你没有登上那趟列车，你的人生会完全不同。」\n\n你回想自己人生中的关键时刻——那些看似偶然的事件，其实都是必然的选择。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b924EventLifeImpactDone)return false;return st.player.day>=450},
probability:0.05,repeatable:false,
choices:[{text:"💫 感恩那些改变你的人和事",hint:"心智+25,心情+18,系统标记人生感恩者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b924EventLifeImpactDone=true;st.flags._b924GratefulPerson=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+18);if(typeof StateManager!=="undefined")StateManager.addMessage("💫 心智+25,心情+18。感恩之心让生活更美好！","success")}},
{text:"😅 向前看",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b924EventLifeImpactDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();