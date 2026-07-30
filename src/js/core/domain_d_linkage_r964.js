/**
 * 域D(NPC/社交) 联动增强 R964 — D→B朋友圈回忆 / D→E朋友投资情报 / D→G朋友关心
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR964Loaded)return;RANDOM_EVENTS._domainDLinkageR964Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. D→B: 朋友圈回忆 — 翻看朋友圈看到老友动态
{id:"d964_friend_circle",phase:"street",icon:"💬",title:"朋友圈里的旧时光",
story:"你刷着朋友圈，看到老友发了一张照片。\n\n那是几年前你们一起拍的合影——那时候大家都很年轻，眼里有光，心里有梦。\n\n你在下面评论了一个「哈哈」，心里却有点酸酸的。时间过得真快。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d964FriendCircleDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=30)_hc++}return _hc>=2&&st.player.day>=80},
probability:0.04,repeatable:false,
choices:[{text:"💬 约老友出来聚聚",hint:"心情+22,社交XP+20,系统标记珍惜友情",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d964FriendCircleDone=true;st.flags._d964TreasureFriends=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+22);gx("social",20);if(typeof StateManager!=="undefined")StateManager.addMessage("💬 心情+22,社交XP+20。朋友是要常联系的——别让时间冲淡了情谊。","success")}},
{text:"😅 点了个赞",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d964FriendCircleDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. D→E: 朋友投资情报 — 朋友分享投资心得
{id:"d964_friend_invest_share",phase:"street",icon:"📈",title:"投资圈子里的人",
story:"你认识了一个在投资圈混了多年的朋友，他愿意带你入门。\n\n「投资最重要的不是技术，是心态。我见过太多人，技术很好但心态崩了，最后亏得一塌糊涂。」\n\n他的话让你意识到，投资是一场心理战。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d964InvestShareDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=35)_hc++}return _hc>=2&&st.player.day>=150&&(st.resources.cash||0)>=20000},
probability:0.03,repeatable:false,
choices:[{text:"📈 跟朋友学习投资心态",hint:"智力+22,会计XP+28,系统标记投资心态",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d964InvestShareDone=true;st.flags._d964InvestMindset=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("accounting",28);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+22,会计XP+28。投资首先是心态——你学会了控制情绪。","success")}},
{text:"😅 太深奥了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d964InvestShareDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 3. D→G: 朋友关心 — 朋友发现玩家状态不对
{id:"d964_friend_care",phase:"street",icon:"💚",title:"朋友的第六感",
story:"你已经一个人扛了很久了。\n\n你以为自己藏得很好，但朋友还是察觉到了异常。\n\n「你最近瘦了很多。我买了你爱吃的，晚上来我家吃饭吧。」\n\n没有追问，没有说教，只是一句简单的邀请——却让你差点落泪。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d964FriendCareDone)return false;if(!st.relationships||!st.status||!st.needs)return false;var _hc=0;for(var _ni in st.relationships){var _r=st.relationships[_ni];if(_r&&_r.met&&(_r.affinity||0)>=55)_hc++}return _hc>=1&&((st.status.health||100)<=45||(st.needs.happiness||50)<=30)&&st.player.day>=50},
probability:0.05,repeatable:false,
choices:[{text:"💚 接受邀请，好好放松",hint:"健康+20,心情+35,疲劳-20,系统标记友情治愈",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d964FriendCareDone=true;st.flags._d964FriendHeal=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+20);if(st.needs){st.needs.happiness=Math.min(100,(st.needs.happiness||50)+35);st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-20)}if(typeof StateManager!=="undefined")StateManager.addMessage("💚 健康+20,心情+35,疲劳-20。有人在乎的感觉，是这城市里最温暖的事。","success")}},
{text:"😤 我没事，不用管我",hint:"健康-5,系统标记拒绝帮助",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d964FriendCareDone=true;st.flags._d964RejectCare=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-5);if(typeof StateManager!=="undefined")StateManager.addMessage("😤 健康-5。你拒绝了关心——但一个人扛，真的不累吗？","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();