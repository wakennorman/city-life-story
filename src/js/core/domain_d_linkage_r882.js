/**
 * 域D(NPC/社交) 联动增强 R882 — D→A社交资本数据v14 / D→E社交投资情报v13 / D→G社交健康恢复v13
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR882Loaded)return;RANDOM_EVENTS._domainDLinkageR882Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
function pn(st){if(!st||!st.relationships)return null;var ids=[];for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)ids.push(k)}return ids.length>0?ids[Random.int(0,ids.length-1)]:null}
function sa(st,nid,amt,reason){if(typeof applyAffinityChange==="function"){try{applyAffinityChange(st,nid,amt,reason)}catch(e){}}}
var E=[
{id:"d882_social_capital_v14",phase:"street",icon:"📊",title:"你的社交圈，是一张价值网",story:"你翻了翻通讯录。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d882SocialCapitalDone)return false;if(!st.relationships)return false;var _m=0;for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)_m++}return _m>=22&&st.player.day>=500},
probability:0.05,repeatable:false,
choices:[{text:"📊 量化社交资本价值",hint:"心智+38,社交XP+42,置_d882SocialCapital",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d882SocialCapitalDone=true;st.flags._d882SocialCapital=true;var _m=0,_h=0;for(var k in st.relationships){var r=st.relationships[k];if(r&&r.met){_m++;if((r.affinity||0)>=60)_h++}}st.flags._d882SocialNetworkSize=_m;st.flags._d882HighAffinityCount=_h;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+38);gx("social",42);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 心智+38,社交XP+42。","success")}},
{text:"😊 朋友不是用来算的",hint:"心情+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d882SocialCapitalDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心情+10。","info")}}]},
{id:"d882_invest_tip_v13",phase:"street",icon:"💬",title:"朋友一句话，投资新思路",story:"你和一个老友聊天时。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d882InvestTipDone)return false;if(!st.relationships)return false;var _m=0;for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)_m++}return _m>=18&&st.player.day>=500},
probability:0.06,repeatable:false,
choices:[{text:"💬 认真记下这个线索",hint:"智力+35,会计XP+38,置_d882InvestTip",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d882InvestTipDone=true;st.flags._d882InvestTip=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+35);gx("accounting",38);st.flags._d882InvestmentHint=true;if(typeof StateManager!=="undefined")StateManager.addMessage("💬 智力+35,会计XP+38。","success")}},
{text:"😅 听过就算了",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d882InvestTipDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
{id:"d882_social_health_v13",phase:"street",icon:"🎉",title:"好友聚会，治愈身心",story:"你最近太累了。一个老朋友打来电话。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d882SocialHealthDone)return false;if(!st.relationships||!st.needs)return false;return(st.needs.fatigue||0)>=85&&(st.needs.happiness||50)<=5&&st.player.day>=350},
probability:0.07,repeatable:false,
choices:[{text:"🎉 赴约，好好放松一下",hint:"疲劳-45,心情+38,健康+22,置_d882SocialHealed",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d882SocialHealthDone=true;st.flags._d882SocialHealed=true;if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-45);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+38)}if(st.status)st.status.health=Math.min(100,(st.status.health||50)+22);var nid=pn(st);if(nid)sa(st,nid,3,"聚会放松");if(typeof StateManager!=="undefined")StateManager.addMessage("🎉 疲劳-45,心情+38,健康+22。","success")}},
{text:"😅 下次吧",hint:"疲劳+5,心情-5,置_d882SocialSkip",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d882SocialHealthDone=true;st.flags._d882SocialSkip=true;if(st.needs){st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+5);st.needs.happiness=Math.max(0,(st.needs.happiness||50)-5)}if(typeof StateManager!=="undefined")StateManager.addMessage("😅 下次吧。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
