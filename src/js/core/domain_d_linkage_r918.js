/**
 * 域D(NPC/社交) 联动增强 R918 — D→A社交资本数据v19 / D→E社交投资情报v18 / D→G社交健康恢复v18
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR918Loaded)return;RANDOM_EVENTS._domainDLinkageR918Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"d918_social_capital_v19",phase:"street",icon:"🤝",title:"社交资本变现",story:"你的朋友圈里有一个人脉广泛的朋友，他今天给你带来了一个消息。\n\n「我认识一个老板，正在找人合作一个项目。我觉得你很适合。」\n\n这就是社交资本最直接的变现方式——不是直接要钱，而是机会。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d918SocialCapitalDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){if(st.relationships[_ni]&&(st.relationships[_ni].affinity||0)>=60)_hc++}return _hc>=10&&st.player.day>=400},
probability:0.06,repeatable:false,
choices:[{text:"🤝 抓住这个机会",hint:"心智+28,社交XP+45,系统标记社交资本变现者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d918SocialCapitalDone=true;st.flags._d918SocialCapitalizer=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+28);gx("social",45);if(typeof StateManager!=="undefined")StateManager.addMessage("🤝 心智+28,社交XP+45。社交资本变现能力提升！","success")}},
{text:"😅 先了解一下再说",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d918SocialCapitalDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"d918_social_invest_v18",phase:"street",icon:"💡",title:"社交圈里的投资机会",story:"你在一次朋友聚会上，无意中听到一个投资机会。\n\n「听说城东要建一个新的商业中心，周边的房价肯定会涨。」\n\n这种在公开市场永远找不到的信息，恰恰是最有价值的。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d918SocialInvestDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){if(st.relationships[_ni]&&(st.relationships[_ni].affinity||0)>=70)_hc++}return _hc>=6&&st.player.day>=450},
probability:0.05,repeatable:false,
choices:[{text:"💡 重视这个信息",hint:"智力+25,会计XP+38,系统标记社交信息投资者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d918SocialInvestDone=true;st.flags._d918SocialInfoInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",38);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 智力+25,会计XP+38。社交信息投资能力提升！","success")}},
{text:"😅 听听就好",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d918SocialInvestDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
{id:"d918_social_health_v18",phase:"street",icon:"💚",title:"社交支持系统",story:"你今天遇到了一件烦心事，心情很低落。\n\n你拿起手机，翻到通讯录，发现有几个朋友已经很久没联系了。\n\n研究显示，拥有强大社交支持系统的人，在面对压力时恢复速度快50%。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d918SocialHealthDone)return false;if(!st.needs)return false;return(st.needs.happiness||50)<=15&&(st.status&&st.status.health||100)<=35&&st.player.day>=250},
probability:0.08,repeatable:false,
choices:[{text:"💚 主动联系老朋友",hint:"心情+45,健康+28,心智+22,系统标记社交支持意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d918SocialHealthDone=true;st.flags._d918SocialSupport=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+45);if(st.status)st.status.health=Math.min(100,(st.status.health||50)+28);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+22);if(typeof StateManager!=="undefined")StateManager.addMessage("💚 心情+45,健康+28,心智+22。社交支持系统激活！","success")}},
{text:"😔 一个人抗过去",hint:"心智+5,疲劳+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d918SocialHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+5。一个人扛，也是一种坚强。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();