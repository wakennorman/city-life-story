/**
 * 域D(NPC/社交) 联动增强 R940 — D→B NPC事件回响 / D→E社交投资情报 / D→G社交健康恢复
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 *  - done-flag 防重复。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR940Loaded)return;RANDOM_EVENTS._domainDLinkageR940Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. D→B: NPC事件回响 — 老朋友提起玩家过去的事件，触发回忆
{id:"d940_npc_memory_echo",phase:"street",icon:"💬",title:"老朋友的回忆",
story:"你正在街边吃面，一个老朋友碰巧路过，坐下来和你聊了起来。\n\n「还记得咱们刚认识那会儿吗？那时候你还在……哎，这些年你变化真大。」\n\n他提起的那些事，有些你都快忘了。但被老友提起，像是翻开了一本旧相册。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d940MemoryEchoDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=40)_hc++}return _hc>=3&&st.player.day>=120},
probability:0.05,repeatable:false,
choices:[{text:"💬 和老朋友叙旧",hint:"心情+20,社交XP+25,系统标记珍视友情",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d940MemoryEchoDone=true;st.flags._d940TreasureFriendship=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+20);gx("social",25);if(typeof StateManager!=="undefined")StateManager.addMessage("💬 心情+20,社交XP+25。老朋友是时间的礼物。","success")}},
{text:"😅 匆匆告别",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d940MemoryEchoDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. D→E: 社交投资情报 — 朋友聚会时听到投资机会
{id:"d940_social_invest_tip",phase:"street",icon:"📈",title:"饭局上的机会",
story:"朋友聚会，几杯酒下肚，话匣子就打开了。\n\n「我表弟在证券公司上班，说最近有个新股……哎，不过风险也挺大的。」\n\n你竖起耳朵听着，心里盘算着要不要跟进。这种饭局上的信息，有时候比专业分析还准。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d940InvestTipDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=30)_hc++}return _hc>=2&&st.player.day>=100&&(st.resources.cash||0)>=20000},
probability:0.04,repeatable:false,
choices:[{text:"📈 认真研究一下这个信息",hint:"智力+18,会计XP+25,系统标记社交情报员",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d940InvestTipDone=true;st.flags._d940SocialIntel=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+18);gx("accounting",25);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+18,会计XP+25。社交场合的信息有时比研究报表更有价值。","success")}},
{text:"😅 听听就好，别当真",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d940InvestTipDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 3. D→G: 社交健康恢复 — 朋友关心玩家的健康，提醒休息
{id:"d940_friend_health_care",phase:"street",icon:"💚",title:"朋友的关心",
story:"你最近太累了，连自己都没注意到眼里的血丝和疲惫的声音。\n\n但朋友注意到了。\n\n「你最近是不是没睡好？脸色很差。别太拼了，身体要紧。」\n\n她递过来一瓶水，眼神里是真切的担心。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d940FriendCareDone)return false;if(!st.relationships||!st.status)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=50)_hc++}return _hc>=2&&(st.status.health||100)<=40&&st.player.day>=50},
probability:0.06,repeatable:false,
choices:[{text:"💚 接受朋友的关心，早点休息",hint:"健康+25,疲劳-20,心情+15,系统标记朋友关怀",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d940FriendCareDone=true;st.flags._d940FriendCared=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+25);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-20);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+15)}if(typeof StateManager!=="undefined")StateManager.addMessage("💚 健康+25,疲劳-20,心情+15。有人关心的感觉真好。","success")}},
{text:"😤 没事，我还能扛",hint:"健康-5,系统标记硬撑",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d940FriendCareDone=true;st.flags._d940ToughItOut=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-5);if(typeof StateManager!=="undefined")StateManager.addMessage("😤 健康-5。你选择了硬撑——但朋友眼中的担忧不是假的。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();