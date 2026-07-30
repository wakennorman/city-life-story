/**
 * 域D(NPC/社交) 联动增强 R890 — D→A社交资本数据v15 / D→E社交投资情报v14 / D→G社交健康恢复v14
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR890Loaded)return;RANDOM_EVENTS._domainDLinkageR890Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
function pn(st){if(!st||!st.relationships)return null;var ids=[];for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)ids.push(k)}return ids.length>0?ids[Random.int(0,ids.length-1)]:null}
function sa(st,nid,amt,reason){if(typeof applyAffinityChange==="function"){try{applyAffinityChange(st,nid,amt,reason)}catch(e){}}}
var E=[
{id:"d890_social_capital_v15",phase:"street",icon:"📊",title:"你的社交圈，是一张价值网",story:"你翻了翻通讯录。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d890SocialCapitalDone)return false;if(!st.relationships)return false;var _m=0;for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)_m++}return _m>=25&&st.player.day>=550},
probability:0.05,repeatable:false,
choices:[{text:"📊 量化社交资本价值",hint:"心智+40,社交XP+45,置_d890SocialCapital",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d890SocialCapitalDone=true;st.flags._d890SocialCapital=true;var _m=0,_h=0;for(var k in st.relationships){var r=st.relationships[k];if(r&&r.met){_m++;if((r.affinity||0)>=60)_h++}}st.flags._d890SocialNetworkSize=_m;st.flags._d890HighAffinityCount=_h;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+40);gx("social",45);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 心智+40,社交XP+45。","success")}},
{text:"😊 朋友不是用来算的",hint:"心情+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d890SocialCapitalDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心情+10。","info")}}]},
{id:"d890_invest_tip_v14",phase:"street",icon:"💬",title:"朋友一句话，投资新思路",story:"你和一个老友聊天时。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d890InvestTipDone)return false;if(!st.relationships)return false;var _m=0;for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)_m++}return _m>=20&&st.player.day>=550},
probability:0.06,repeatable:false,
choices:[{text:"💬 认真记下这个线索",hint:"智力+38,会计XP+40,置_d890InvestTip",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d890InvestTipDone=true;st.flags._d890InvestTip=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+38);gx("accounting",40);st.flags._d890InvestmentHint=true;if(typeof StateManager!=="undefined")StateManager.addMessage("💬 智力+38,会计XP+40。","success")}},
{text:"😅 听过就算了",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d890InvestTipDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
{id:"d890_social_health_v14",phase:"street",icon:"🎉",title:"好友聚会，治愈身心",story:"你最近太累了。一个老朋友打来电话。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d890SocialHealthDone)return false;if(!st.relationships||!st.needs)return false;return(st.needs.fatigue||0)>=90&&(st.needs.happiness||50)<=3&&st.player.day>=400},
probability:0.07,repeatable:false,
choices:[{text:"🎉 赴约，好好放松一下",hint:"疲劳-50,心情+40,健康+25,置_d890SocialHealed",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d890SocialHealthDone=true;st.flags._d890SocialHealed=true;if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-50);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+40)}if(st.status)st.status.health=Math.min(100,(st.status.health||50)+25);var nid=pn(st);if(nid)sa(st,nid,3,"聚会放松");if(typeof StateManager!=="undefined")StateManager.addMessage("🎉 疲劳-50,心情+40,健康+25。","success")}},
{text:"😅 下次吧",hint:"疲劳+5,心情-5,置_d890SocialSkip",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d890SocialHealthDone=true;st.flags._d890SocialSkip=true;if(st.needs){st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+5);st.needs.happiness=Math.max(0,(st.needs.happiness||50)-5)}if(typeof StateManager!=="undefined")StateManager.addMessage("😅 下次吧。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
