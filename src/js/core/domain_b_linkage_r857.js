/**
 * 域B(事件/叙事) 联动增强 R857 — B→A事件数据遗产v10 / B→D事件友谊深化v10 / B→G事件人生影响v10
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR857Loaded)return;RANDOM_EVENTS._domainBLinkageR857Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
function pn(st){if(!st||!st.relationships)return null;var ids=[];for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)ids.push(k)}return ids.length>0?ids[Random.int(0,ids.length-1)]:null}
function nn(id){if(typeof getNpcDisplayName==="function"){try{return getNpcDisplayName(id)||"老友"}catch(e){return"老友"}}return"老友"}
var E=[
{id:"b857_event_data_v10",phase:"street",icon:"📊",title:"事件数据，是经验的沉淀",story:"你翻看过去发生的事件记录——每一个事件都是一次经验。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b857EventDataDone)return false;return st.player.day>=350},
probability:0.05,repeatable:false,
choices:[{text:"📊 分析事件数据沉淀",hint:"智力+28,心智+28,置_b857EventData",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b857EventDataDone=true;st.flags._b857EventData=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);st.player.mental=Math.min(100,(st.player.mental||50)+28)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 事件数据分析完成——智力+28,心智+28。","success")}},
{text:"😊 过去的就让它过去",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b857EventDataDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 过去的就让它过去。心情+5。","info")}}]},
{id:"b857_event_friendship_v10",phase:"street",icon:"🤝",title:"共同经历，友谊更深",story:"你和朋友聊起过去一起经历的那些事。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b857EventFriendshipDone)return false;return pn(st)!==null&&st.player.day>=250},
probability:0.06,repeatable:false,
choices:[{text:"🤝 回忆共同的经历",hint:"好感+6,心情+22,社交XP+28,置_b857Friendship",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b857EventFriendshipDone=true;st.flags._b857Friendship=true;var nid=pn(st);if(nid&&typeof applyAffinityChange==="function"){try{applyAffinityChange(st,nid,6,"共同经历回忆")}catch(e){}}if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+22);gx("social",28);if(typeof StateManager!=="undefined"){var name=nid?nn(nid):"老友";StateManager.addMessage("🤝 你和"+name+"回忆了过去的经历——好感+6,心情+22,社交XP+28。","success")}}},
{text:"😊 珍惜当下就好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b857EventFriendshipDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 珍惜当下就好。心智+5。","info")}}]},
{id:"b857_event_life_v10",phase:"street",icon:"🌱",title:"经历，是最好的老师",story:"夜深人静，你回想起这一路走来的经历。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b857EventLifeDone)return false;return st.player.day>=400},
probability:0.05,repeatable:false,
choices:[{text:"🌱 从经历中汲取智慧",hint:"心智+30,魅力+24,置_b857LifeWisdom",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b857EventLifeDone=true;st.flags._b857LifeWisdom=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+30);st.player.charm=Math.min(100,(st.player.charm||50)+24)}if(typeof StateManager!=="undefined")StateManager.addMessage("🌱 你从经历中汲取了智慧——心智+30,魅力+24。","success")}},
{text:"😊 睡一觉，明天再说",hint:"疲劳-10,心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b857EventLifeDone=true;if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-10);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5)}if(typeof StateManager!=="undefined")StateManager.addMessage("😊 睡一觉，明天再说。疲劳-10,心情+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();