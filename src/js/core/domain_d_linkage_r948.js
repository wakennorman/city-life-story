/**
 * 域D(NPC/社交) 联动增强 R948 — D→B NPC事件回响 / D→E社交投资情报 / D→G社交健康恢复
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR948Loaded)return;RANDOM_EVENTS._domainDLinkageR948Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. D→B: NPC事件回响 — 老朋友提起共同经历，触发回忆
{id:"d948_friend_reminisce",phase:"street",icon:"💬",title:"那些年，我们一起经历的事",
story:"老朋友约你喝茶，聊着聊着就说起了从前。\n\n「还记得那次你差点被坑吗？要不是我刚好路过……」\n\n你们哈哈大笑，那些当时觉得天大的事，现在都成了下酒的笑谈。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d948ReminisceDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=50)_hc++}return _hc>=2&&st.player.day>=150},
probability:0.04,repeatable:false,
choices:[{text:"💬 和老朋友一起回忆",hint:"心情+25,社交XP+20,系统标记念旧",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d948ReminisceDone=true;st.flags._d948Nostalgic=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25);gx("social",20);if(typeof StateManager!=="undefined")StateManager.addMessage("💬 心情+25,社交XP+20。多年后还能一起笑谈往事，这就是朋友的意义。","success")}},
{text:"😅 往事不提",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d948ReminisceDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. D→E: 社交投资情报 — 朋友介绍投资机会
{id:"d948_friend_invest_intro",phase:"street",icon:"📈",title:"朋友的推荐",
story:"一个做生意的朋友找到你，说有个项目想拉你入伙。\n\n「这个赛道我盯了半年了，就差一个靠谱的合伙人。你懂行，我出资源，咱们五五开。」\n\n你心动了，但创业有风险，投资需谨慎。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d948InvestIntroDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=40)_hc++}return _hc>=3&&st.player.day>=200&&(st.resources.cash||0)>=50000},
probability:0.03,repeatable:false,
choices:[{text:"📈 认真评估项目",hint:"智力+25,管理XP+30,系统标记创业合伙人",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d948InvestIntroDone=true;st.flags._d948BizPartner=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("management",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,管理XP+30。你认真评估了项目——靠谱的合伙人和靠谱的项目一样重要。","success")}},
{text:"😅 婉拒，专心做自己的事",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d948InvestIntroDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]},
// 3. D→G: 社交健康恢复 — 朋友发现玩家状态不对，主动关心
{id:"d948_friend_intervene",phase:"street",icon:"💚",title:"朋友的直觉",
story:"你觉得自己掩饰得很好，但朋友还是看出了不对劲。\n\n「你最近不太对劲。别嘴硬，我认识你这么多年了，你瞒不过我。」\n\n她坐下来，给你倒了杯茶，什么也没问，就陪着你坐了一会儿。有时候，最好的关心就是陪伴。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d948FriendInterveneDone)return false;if(!st.relationships||!st.status)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=60)_hc++}return _hc>=1&&(st.status.health||100)<=35&&st.player.day>=80},
probability:0.05,repeatable:false,
choices:[{text:"💚 接受朋友的关心",hint:"健康+30,心情+25,疲劳-15,系统标记被朋友治愈",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d948FriendInterveneDone=true;st.flags._d948HealedByFriend=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+30);if(st.needs){st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25);st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-15)}if(typeof StateManager!=="undefined")StateManager.addMessage("💚 健康+30,心情+25,疲劳-15。真正的朋友，是你不用说话也能懂你的人。","success")}},
{text:"😤 我没事，不用管我",hint:"健康-5,系统标记拒绝帮助",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d948FriendInterveneDone=true;st.flags._d948RejectHelp=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-5);if(typeof StateManager!=="undefined")StateManager.addMessage("😤 健康-5。你拒绝了帮助——但一个人扛，真的比较强吗？","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();