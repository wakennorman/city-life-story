/**
 * 域D(NPC/社交) 联动增强 R910 — D→A社交资本数据v18 / D→E社交投资情报v17 / D→G社交健康恢复v17
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR910Loaded)return;RANDOM_EVENTS._domainDLinkageR910Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"d910_social_capital_v18",phase:"street",icon:"🤝",title:"社交资本，无形财富",story:"你的朋友圈越来越广了。\n\n「在成年人的世界里，社交资本比银行存款更抗风险。」——一位事业有成的长辈这样告诉你。\n\n你看着通讯录里那些名字——有些是患难之交，有些是利益关联，有些是纯粹的欣赏。每一段关系，都是一笔隐形的资产。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d910SocialCapitalDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){if(st.relationships[_ni]&&(st.relationships[_ni].affinity||0)>=60)_hc++}return _hc>=8&&st.player.day>=350},
probability:0.06,repeatable:false,
choices:[{text:"📊 盘点社交资本",hint:"心智+25,社交XP+40,系统标记社交资本意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d910SocialCapitalDone=true;st.flags._d910SocialCapitalAwareness=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);gx("social",40);if(typeof StateManager!=="undefined")StateManager.addMessage("🤝 心智+25,社交XP+40。社交资本意识建立！","success")}},
{text:"😅 顺其自然就好",hint:"心情+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d910SocialCapitalDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+8。随缘也是种智慧。","info")}}]},
{id:"d910_social_invest_v17",phase:"street",icon:"💡",title:"人脉投资情报",story:"你在和朋友的闲聊中，听到了一个投资机会。\n\n「我表哥在科技园上班，说他们公司最近在搞一个内部项目，员工可以优先认购。」\n\n这种非公开信息，往往比公开市场的分析更有价值。这大概就是人脉的另一种回报。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d910SocialInvestDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){if(st.relationships[_ni]&&(st.relationships[_ni].affinity||0)>=70)_hc++}return _hc>=5&&st.player.day>=400},
probability:0.05,repeatable:false,
choices:[{text:"💡 认真听取投资情报",hint:"智力+22,会计XP+35,系统标记信息敏感型投资者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d910SocialInvestDone=true;st.flags._d910SocialInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 智力+22,会计XP+35。人脉即信息,信息即财富！","success")}},
{text:"😅 听听就好",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d910SocialInvestDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
{id:"d910_social_health_v17",phase:"street",icon:"💚",title:"社交治愈力",story:"这一天你心情不太好。\n\n你翻着手机通讯录，发现有几个朋友已经很久没联系了。\n\n心理学研究表明：良好的社交关系是抵抗压力和疾病的最强保护因素之一。也许今天，你该约个朋友出来聊聊。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d910SocialHealthDone)return false;if(!st.needs)return false;return(st.needs.happiness||50)<=20&&(st.status&&st.status.health||100)<=40&&st.player.day>=200},
probability:0.08,repeatable:false,
choices:[{text:"💚 约朋友出来聊聊",hint:"心情+40,健康+25,心智+20,系统标记社交疗愈",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d910SocialHealthDone=true;st.flags._d910SocialHealing=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+40);if(st.status)st.status.health=Math.min(100,(st.status.health||50)+25);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+20);if(typeof StateManager!=="undefined")StateManager.addMessage("💚 心情+40,健康+25,心智+20。朋友是最好的良药！","success")}},
{text:"😔 一个人静静",hint:"心智+5,疲劳+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d910SocialHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+5。独处也是充电。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();