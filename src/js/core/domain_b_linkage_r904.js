/**
 * 域B(事件/叙事) 联动增强 R904 — B→A事件数据遗产v16 / B→D事件友谊深化v16 / B→G事件人生影响v16
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR904Loaded)return;RANDOM_EVENTS._domainBLinkageR904Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
function pn(st){if(!st||!st.relationships)return null;var ids=[];for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)ids.push(k)}return ids.length>0?ids[Random.int(0,ids.length-1)]:null}
var E=[
{id:"b904_event_data_v16",phase:"street",icon:"📊",title:"事件数据，是经验的沉淀",story:"你翻看过去发生的事件记录。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b904EventDataDone)return false;return st.player.day>=650},
probability:0.05,repeatable:false,
choices:[{text:"📊 分析事件数据沉淀",hint:"智力+42,心智+42,置_b904EventData",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b904EventDataDone=true;st.flags._b904EventData=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+42);st.player.mental=Math.min(100,(st.player.mental||50)+42)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+42,心智+42。","success")}},
{text:"😊 过去的就让它过去",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b904EventDataDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心情+5。","info")}}]},
{id:"b904_event_friendship_v16",phase:"street",icon:"🤝",title:"共同经历，友谊更深",story:"你和朋友聊起过去一起经历的那些事。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b904EventFriendshipDone)return false;return pn(st)!==null&&st.player.day>=550},
probability:0.06,repeatable:false,
choices:[{text:"🤝 回忆共同的经历",hint:"好感+6,心情+38,社交XP+42,置_b904Friendship",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b904EventFriendshipDone=true;st.flags._b904Friendship=true;var nid=pn(st);if(nid&&typeof applyAffinityChange==="function"){try{applyAffinityChange(st,nid,6,"共同经历回忆")}catch(e){}}if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+38);gx("social",42);if(typeof StateManager!=="undefined")StateManager.addMessage("🤝 好感+6,心情+38,社交XP+42。","success")}},
{text:"😊 珍惜当下就好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b904EventFriendshipDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+5。","info")}}]},
{id:"b904_event_life_v16",phase:"street",icon:"🌱",title:"经历，是最好的老师",story:"夜深人静，你回想起这一路走来的经历。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b904EventLifeDone)return false;return st.player.day>=700},
probability:0.05,repeatable:false,
choices:[{text:"🌱 从经历中汲取智慧",hint:"心智+45,魅力+38,置_b904LifeWisdom",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b904EventLifeDone=true;st.flags._b904LifeWisdom=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+45);st.player.charm=Math.min(100,(st.player.charm||50)+38)}if(typeof StateManager!=="undefined")StateManager.addMessage("🌱 心智+45,魅力+38。","success")}},
{text:"😊 睡一觉",hint:"疲劳-10,心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b904EventLifeDone=true;if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-10);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5)}if(typeof StateManager!=="undefined")StateManager.addMessage("😊 疲劳-10,心情+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
