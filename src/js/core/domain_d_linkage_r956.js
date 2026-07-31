/**
 * 域D(NPC/社交) 联动增强 R956 — D→B朋友回忆 / D→E朋友投资介绍 / D→G朋友关心
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR956Loaded)return;RANDOM_EVENTS._domainDLinkageR956Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. D→B: 朋友回忆 — 老朋友提起共同经历，触发回忆
{id:"d956_old_friend_story",phase:"street",icon:"💬",title:"那些年，一起走过的路",
// [全系统自洽修复] 域B R1016b 修复:story 键名残缺引号导致整文件 SyntaxError
story:"你收到一条老友的消息:「嘿，还记得咱们当年在工地搬砖的日子吗？」\n\n你笑了。那时候你们俩一天干十二个小时，晚上蹲在路边吃盒饭，还互相打气说总有一天会出头。\n\n现在你们都有了各自的生活，但那段日子永远刻在记忆里。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d956OldFriendDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=40)_hc++}return _hc>=2&&st.player.day>=100},
probability:0.04,repeatable:false,
choices:[{text:"💬 和老友叙旧",hint:"心情+20,社交XP+25,系统标记老友记",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d956OldFriendDone=true;st.flags._d956OldFriendship=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+20);gx("social",25);if(typeof StateManager!=="undefined")StateManager.addMessage("💬 心情+20,社交XP+25。一起吃苦的朋友，是一辈子的财富。","success")}},
{text:"😅 匆匆回了一句",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d956OldFriendDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. D→E: 朋友投资情报 — 朋友介绍投资机会
{id:"d956_friend_invest_tip",phase:"street",icon:"📈",title:"朋友的内部消息",
story:"你在饭局上认识了一个做金融的朋友，聊得挺投缘。\n\n「最近有个机会，我一般不跟外人说——但我觉得你靠谱。」\n\n他压低声音说了一个投资机会，你听完心里有数了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d956InvestTipDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=30)_hc++}return _hc>=3&&st.player.day>=180&&(st.resources.cash||0)>=30000},
probability:0.03,repeatable:false,
choices:[{text:"📈 认真研究机会",hint:"智力+25,会计XP+30,系统标记投资嗅觉",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d956InvestTipDone=true;st.flags._d956InvestSense=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+30。信息就是金钱——你学会了辨别机会。","success")}},
{text:"😅 风险太大，算了",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d956InvestTipDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]},
// 3. D→G: 朋友关心 — 朋友发现玩家状态不对，主动关心
{id:"d956_friend_checkin",phase:"street",icon:"💚",title:"朋友的直觉",
story:"你最近状态很差，但你以为自己掩饰得很好。\n\n直到朋友发来一条消息:「你最近还好吗？感觉你不太对劲。」\n\n你盯着手机屏幕，鼻子突然有点酸。原来真的有人在乎你。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d956CheckinDone)return false;if(!st.relationships||!st.status)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=50)_hc++}return _hc>=1&&(st.status.health||100)<=40&&st.player.day>=60},
probability:0.05,repeatable:false,
choices:[{text:"💚 向朋友倾诉",hint:"健康+25,心情+30,疲劳-15,系统标记被治愈",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d956CheckinDone=true;st.flags._d956Healed=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+25);if(st.needs){st.needs.happiness=Math.min(100,(st.needs.happiness||50)+30);st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-15)}if(typeof StateManager!=="undefined")StateManager.addMessage("💚 健康+25,心情+30,疲劳-15。有人在乎的感觉，真好。","success")}},
{text:"😤 我没事",hint:"健康-5,系统标记独自硬撑",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d956CheckinDone=true;st.flags._d956Alone=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-5);if(typeof StateManager!=="undefined")StateManager.addMessage("😤 健康-5。你选择了独自硬撑——但有些路，不必一个人走。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();