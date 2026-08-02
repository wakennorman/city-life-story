/**
 * 域D(NPC/社交) 联动增强 R1020 — D→B NPC事件回响 / D→E社交投资情报 / D→G社交健康恢复
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR1020Loaded)return;RANDOM_EVENTS._domainDLinkageR1020Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. D→B: NPC事件回响—老友的意外消息
{id:"d1020_friend_news",phase:"street",icon:"📬",title:"老友的意外消息",
story:"你收到了一个很久没联系的朋友的消息。\n\n他说他最近换工作了，搬到了另一个城市，开始了新的生活。\n\n你忽然想起——这座城市里，每个人都有自己的故事，而你有幸成为了一些人故事里的配角。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d1020FriendNewsCd)return false;if(!st.relationships)return false;var _met=0;for(var _id in st.relationships){if(st.relationships[_id]&&st.relationships[_id].met)_met++}return _met>=2&&st.player.day>=30&&st.player.day%75===0},
probability:0.06,repeatable:true,
choices:[
{text:"📬 回复问候近况",hint:"心情+8,好感+2,社交XP+5,置_d1020StayConnected",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1020FriendNewsCd=true;st.flags._d1020StayConnected=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);gx("social",5);if(st.relationships&&typeof applyAffinityChange==="function"){var _ids=[];for(var _id2 in st.relationships){if(st.relationships[_id2]&&st.relationships[_id2].met)_ids.push(_id2)}if(_ids.length>0){var _p=typeof Random!=="undefined"?Random.int(0,_ids.length-1):0;applyAffinityChange(st,_ids[_p],2,"老友问候")}}if(typeof StateManager!=="undefined")StateManager.addMessage("📬 心情+8,社交XP+5。保持联系——友情需要经营。","success")}},
{text:"😅 下次再回",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1020FriendNewsCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。下次再回——但下次是什么时候呢？","warning")}}
]},
// 2. D→E: 社交投资情报—朋友的投资建议
{id:"d1020_invest_tip",phase:"street",icon:"💡",title:"朋友的投资建议",
story:"一个在金融行业工作的朋友约你吃饭，聊起了最近的市场行情。\n\n「最近XX板块不错，我身边好几个朋友都赚了。」\n\n「不过投资有风险，你得先了解清楚再入场。」\n\n信息就是金钱——但前提是你能分辨哪些信息值得相信。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d1020InvestTipCd)return false;if(!st.relationships)return false;var _high=0;for(var _id in st.relationships){if(st.relationships[_id]&&(st.relationships[_id].affinity||0)>=40)_high++}return _high>=1&&st.player.day>=60&&st.player.day%90===0},
probability:0.05,repeatable:true,
choices:[
{text:"💡 认真听取建议",hint:"会计XP+12,智力+5,置_d1020InvestMinded",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1020InvestTipCd=true;st.flags._d1020InvestMinded=true;gx("accounting",12);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 会计XP+12,智力+5。好的投资建议是财富的敲门砖——但最终决策还得靠自己。","success")}},
{text:"📝 记录下这条信息",hint:"会计XP+5,置_d1020InfoCollector",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1020InvestTipCd=true;st.flags._d1020InfoCollector=true;gx("accounting",5);if(typeof StateManager!=="undefined")StateManager.addMessage("📝 会计XP+5。信息就是财富——但要用对地方。","info")}},
{text:"😅 听听就好",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1020InvestTipCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。不盲从——也是一种智慧。","info")}}
]},
// 3. D→G: 社交健康恢复—朋友的关心
{id:"d1020_friend_care",phase:"street",icon:"💝",title:"朋友的关心",
story:"你最近状态不太好，一个细心的朋友注意到了。\n\n「你最近是不是太累了？要不要一起出去走走？」\n\n「别一个人硬撑着，有事跟我说。」\n\n有时候，一句简单的关心，就能让人重新振作起来。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d1020FriendCareCd)return false;if(!st.relationships||!st.status)return false;var _close=0;for(var _id in st.relationships){if(st.relationships[_id]&&(st.relationships[_id].affinity||0)>=50)_close++}return _close>=1&&st.status.health<50&&st.player.day>=30&&st.player.day%60===0},
probability:0.08,repeatable:true,
choices:[
{text:"💝 接受朋友的关心",hint:"健康+15,心情+15,置_d1020Grateful",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1020FriendCareCd=true;st.flags._d1020Grateful=true;if(st.status)st.status.health=Math.min(100,(st.status.health||80)+15);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+15);if(typeof StateManager!=="undefined")StateManager.addMessage("💝 健康+15,心情+15。有人关心的感觉真好——你并不孤单。","success")}},
{text:"😊 约朋友一起吃饭",hint:"健康+8,心情+10,好感+2,置_d1020SocialEater",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1020FriendCareCd=true;st.flags._d1020SocialEater=true;if(st.status)st.status.health=Math.min(100,(st.status.health||80)+8);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(st.relationships&&typeof applyAffinityChange==="function"){var _ids=[];for(var _id2 in st.relationships){if(st.relationships[_id2]&&(st.relationships[_id2].affinity||0)>=50)_ids.push(_id2)}if(_ids.length>0){var _p=typeof Random!=="undefined"?Random.int(0,_ids.length-1):0;applyAffinityChange(st,_ids[_p],2,"朋友聚餐")}}if(typeof StateManager!=="undefined")StateManager.addMessage("😊 健康+8,心情+10。一起吃饭——最简单的治愈方式。","success")}},
{text:"😔 想一个人待着",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1020FriendCareCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+5。独处也是一种治愈——但别太久。","info")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();