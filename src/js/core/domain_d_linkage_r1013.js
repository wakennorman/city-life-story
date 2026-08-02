/**
 * 域D(NPC/社交) 联动增强 R1013 — D→B NPC事件回响v23 / D→E社交投资情报v23 / D→G社交健康恢复v23 / D→A社交价格情报v23
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR1013Loaded)return;RANDOM_EVENTS._domainDLinkageR1013Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// D→B: NPC事件回响 — 高好感NPC主动分享人生故事
{id:"d1013_npc_life_story",phase:"street",icon:"📖",title:"老友的往事",story:"在街角的老茶馆，你偶遇了一位许久未见的老朋友。他拉着你坐下，聊起了他年轻时的故事。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d1013LifeStoryDone)return false;if(!st.relationships)return false;var _hc=0;for(var _k in st.relationships){if(st.relationships[_k]&&st.relationships[_k].met&&(st.relationships[_k].affinity||0)>=70)_hc++}return _hc>=2&&st.player.day>=200},
probability:0.06,repeatable:false,
choices:[{text:"📖 认真倾听，分享自己的经历",hint:"心智+10,社交XP+30,好感+3,置_d1013SharedStory",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1013LifeStoryDone=true;st.flags._d1013SharedStory=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);gx("social",30);for(var _rk in st.relationships){if(st.relationships[_rk]&&st.relationships[_rk].met&&(st.relationships[_rk].affinity||0)>=70)st.relationships[_rk].affinity=Math.min(100,(st.relationships[_rk].affinity||0)+3)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+10,社交XP+30,好友好感+3。真诚的交流让你们的友谊更加深厚。","success")}},
{text:"😊 静静聆听，不时点头",hint:"心智+8,社交XP+15",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1013LifeStoryDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);gx("social",15);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+8,社交XP+15。有时候，最好的陪伴就是倾听。","info")}}]},

// D→E: 社交投资情报 — NPC朋友透露投资机会
{id:"d1013_social_invest_tip",phase:"street",icon:"💡",title:"朋友的内部消息",story:"一个在金融公司上班的朋友私下告诉你，他们公司最近在推一个内部理财产品，年化收益比市面上高不少。但名额有限，只有员工推荐才能参与。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d1013InvestTipDone)return false;if(!st.relationships)return false;var _hc=0;for(var _k in st.relationships){if(st.relationships[_k]&&st.relationships[_k].met&&(st.relationships[_k].affinity||0)>=60)_hc++}return _hc>=3&&st.player.day>=300},
probability:0.05,repeatable:false,
choices:[{text:"💡 投资¥5000试试",hint:"收益+20%~50%,置_d1013InvestParticipated",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1013InvestTipDone=true;st.flags._d1013InvestParticipated=true;st.resources=st.resources||{};var _invest=5000;if((st.resources.cash||0)>=_invest){st.resources.cash=Math.max(0,(st.resources.cash||0)-_invest);var _return=Random.chance(0.7)?_invest*Random.int(12,25)/10:_invest*0.5;st.resources.cash=(st.resources.cash||0)+Math.round(_return);var _profit=Math.round(_return-_invest);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 投资回报:¥"+_profit.toLocaleString()+" ("+(_profit>=0?"+":"")+Math.round((_return/_invest-1)*100)+"%)！","success")}else{if(typeof StateManager!=="undefined")StateManager.addMessage("💡 现金不足¥5000，错过了这个机会。","warning")}}},
{text:"🤔 先了解清楚再说",hint:"智力+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1013InvestTipDone=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("🤔 智力+5。你决定先研究一下这个产品的风险再决定。","info")}}]},

// D→G: 社交健康恢复 — 朋友探望生病玩家
{id:"d1013_friend_visit_sick",phase:"street",icon:"🤒",title:"朋友的探望",story:"你病倒在床上，迷迷糊糊中听到有人敲门。打开门，发现是几个朋友提着水果和粥来看你了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d1013SickVisitDone)return false;if(!st.relationships)return false;if(!st.status)return false;if((st.status.health||100)>30)return false;var _hc=0;for(var _k in st.relationships){if(st.relationships[_k]&&st.relationships[_k].met&&(st.relationships[_k].affinity||0)>=40)_hc++}return _hc>=2&&st.player.day>=100},
probability:0.08,repeatable:false,
choices:[{text:"🤒 感动地接受照料",hint:"健康+35,心情+25,置_d1013WellCared",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1013SickVisitDone=true;st.flags._d1013WellCared=true;if(!st.status)st.status={};st.status.health=Math.min(100,(st.status.health||50)+35);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25);if(typeof StateManager!=="undefined")StateManager.addMessage("🤒 健康+35,心情+25。朋友的关心比药还管用！","success")}},
{text:"😤 说自己没事，让他们回去",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1013SickVisitDone=true;st.flags._d1013ToughAlone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😤 心智+5。你不想让朋友担心，独自扛过了这场病。","info")}}]},

// D→A: 社交价格情报 — NPC朋友告知哪里买东西便宜
{id:"d1013_npc_price_tip",phase:"street",icon:"🏷️",title:"朋友的省钱秘笈",story:"朋友神秘兮兮地告诉你，城东新开了一家批发市场，同样的东西比超市便宜不少。他还给了你一张优惠券。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d1013PriceTipDone)return false;if(!st.relationships)return false;var _hc=0;for(var _k in st.relationships){if(st.relationships[_k]&&st.relationships[_k].met&&(st.relationships[_k].affinity||0)>=40)_hc++}return _hc>=1&&st.player.day>=150},
probability:0.07,repeatable:false,
choices:[{text:"🏷️ 去看看，省点是点",hint:"现金+2000,智力+3,置_d1013UsedPriceTip",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1013PriceTipDone=true;st.flags._d1013UsedPriceTip=true;st.resources=st.resources||{};st.resources.cash=(st.resources.cash||0)+2000;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("🏷️ 现金+2000,智力+3。批发市场的东西确实便宜不少！","success")}},
{text:"😊 记下地址，以后再说",hint:"智力+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d1013PriceTipDone=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 智力+3。你记下了地址，以后需要采购的时候再去。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();