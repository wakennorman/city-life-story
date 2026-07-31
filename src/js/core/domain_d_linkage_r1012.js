/**
 * 域D(NPC/社交) 联动增强 R1012 — D→B朋友回忆 / D→E投资情报 / D→G朋友关心
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR1012Loaded)return;RANDOM_EVENTS._domainDLinkageR1012Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. D→B: 朋友回忆 — 老朋友提起共同经历
{id:"d1012_friend_talk",phase:"street",icon:"💬",title:"老友记",
story:"你收到一条老友的消息，简简单单几个字:「最近怎么样？」\n\n你看着这条消息，忽然有些恍惚。你们已经很久没见了，但这条消息让你觉得，距离并没有改变什么。\n\n真正的朋友，不需要天天联系，但你需要的时候，他们一定在。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d1012TalkDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=35)_hc++}return _hc>=2&&st.player.day>=80},
probability:0.04,repeatable:false,
choices:[{text:"💬 和老友叙旧",hint:"心情+22,社交XP+20,系统标记老友记",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1012TalkDone=true;st.flags._d1012OldFriend=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+22);gx("social",20);if(typeof StateManager!=="undefined")StateManager.addMessage("💬 心情+22,社交XP+20。真正的朋友不需要天天联系——但你需要的时候，他们一定在。","success")}},
{text:"😅 回了一句",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1012TalkDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. D→E: 投资情报 — 朋友分享投资机会
{id:"d1012_friend_tip",phase:"street",icon:"📈",title:"朋友的推荐",
story:"一个做投资的朋友神秘兮兮地找到你。\n\n「最近有个机会，我一般不跟外人说——但你不一样。」\n\n他压低声音说了几句，你听完心里有数了。不管跟不跟，至少说明你在他眼里是个靠谱的人。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d1012TipDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=30)_hc++}return _hc>=2&&st.player.day>=120&&(st.resources.cash||0)>=15000},
probability:0.03,repeatable:false,
choices:[{text:"📈 认真研究一下",hint:"智力+22,会计XP+28,系统标记投资嗅觉",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1012TipDone=true;st.flags._d1012InvestSense=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("accounting",28);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+22,会计XP+28。信息就是金钱——你学会了辨别机会。","success")}},
{text:"😅 听听就好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1012TipDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 3. D→G: 朋友关心 — 朋友发现状态不对
{id:"d1012_friend_care",phase:"street",icon:"💚",title:"朋友的关心",
story:"你最近状态不太好，但你谁也没说。\n\n然而朋友还是看出来了——不是因为你说了什么，而是因为你没说什么。\n\n「你最近话变少了，走，我请你去吃火锅。」\n\n有时候，最好的关心就是什么都不问，直接带你去吃好吃的。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d1012CareDone)return false;if(!st.relationships||!st.status)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=45)_hc++}return _hc>=1&&(st.status.health||100)<=40&&st.player.day>=60},
probability:0.05,repeatable:false,
choices:[{text:"💚 接受朋友的关心",hint:"健康+25,心情+30,疲劳-15,系统标记友情治愈",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1012CareDone=true;st.flags._d1012Healed2=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+25);if(st.needs){st.needs.happiness=Math.min(100,(st.needs.happiness||50)+30);st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-15)}if(typeof StateManager!=="undefined")StateManager.addMessage("💚 健康+25,心情+30,疲劳-15。真正的朋友，是你不说话他也懂你的人。","success")}},
{text:"😤 我没事",hint:"健康-5,系统标记拒绝帮助",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1012CareDone=true;st.flags._d1012Alone2=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-5);if(typeof StateManager!=="undefined")StateManager.addMessage("😤 健康-5。你拒绝了关心——但有些路，不必一个人走。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();