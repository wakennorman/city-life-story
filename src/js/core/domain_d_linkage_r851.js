/**
 * 域D(NPC/社交) 联动增强 R851
 * 全系统优化·Domain D 第六十六轮循环
 * D→A 社交资本数据v10 / D→E 社交投资情报v9 / D→G 社交健康恢复v9
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR851Loaded) return;
  RANDOM_EVENTS._domainDLinkageR851Loaded = true;
  function gx(key,amt){if(typeof addSkillXp==="function"){try{addSkillXp(key,amt)}catch(e){}}}
  function pn(st){if(!st||!st.relationships)return null;var ids=[];for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)ids.push(k)}return ids.length>0?ids[Random.int(0,ids.length-1)]:null}
  function nn(id){if(typeof getNpcDisplayName==="function"){try{return getNpcDisplayName(id)||"老友"}catch(e){return"老友"}}return"老友"}
  function sa(st,nid,amt,reason){if(typeof applyAffinityChange==="function"){try{applyAffinityChange(st,nid,amt,reason)}catch(e){}}}
  var EVENTS=[
    {id:"d851_social_capital_v10",phase:"street",icon:"📊",title:"你的社交圈，是一张价值网",story:"你翻了翻通讯录——不知不觉已经认识了这么多人。每个名字背后，都是一段故事。",
      conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d851SocialCapitalDone)return false;if(!st.relationships)return false;var _m=0;for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)_m++}return _m>=14&&st.player.day>=300},
      probability:0.05,repeatable:false,
      choices:[
        {text:"📊 量化社交资本价值",hint:"心智+28,社交XP+32,置_d851SocialCapital",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d851SocialCapitalDone=true;st.flags._d851SocialCapital=true;var _m=0,_h=0;for(var k in st.relationships){var r=st.relationships[k];if(r&&r.met){_m++;if((r.affinity||0)>=60)_h++}}st.flags._d851SocialNetworkSize=_m;st.flags._d851HighAffinityCount=_h;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+28);gx("social",32);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 社交资本量化完成——认识"+_m+"人,深交"+_h+"人。心智+28,社交XP+32。","success")}},
        {text:"😊 朋友不是用来算的",hint:"心情+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d851SocialCapitalDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 朋友不是用来算的。心情+10。","info")}}
      ]},
    {id:"d851_invest_tip_v9",phase:"street",icon:"💬",title:"朋友一句话，投资新思路",story:"你和一个老友聊天时，他无意中提起最近某个行业很火。说者无心，听者有意。",
      conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d851InvestTipDone)return false;if(!st.relationships)return false;var _m=0;for(var k in st.relationships){if(st.relationships[k]&&st.relationships[k].met)_m++}return _m>=10&&st.player.day>=300},
      probability:0.06,repeatable:false,
      choices:[
        {text:"💬 认真记下这个线索",hint:"智力+26,会计XP+28,置_d851InvestTip",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d851InvestTipDone=true;st.flags._d851InvestTip=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+26);gx("accounting",28);st.flags._d851InvestmentHint=true;if(typeof StateManager!=="undefined")StateManager.addMessage("💬 你认真记下了朋友的投资线索——智力+26,会计XP+28。","success")}},
        {text:"😅 听过就算了",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d851InvestTipDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 听过就算了。心智+3。","info")}}
      ]},
    {id:"d851_social_health_v9",phase:"street",icon:"🎉",title:"好友聚会，治愈身心",story:"你最近太累了。一个老朋友打来电话，约你周末聚聚。",
      conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d851SocialHealthDone)return false;if(!st.relationships||!st.needs)return false;return(st.needs.fatigue||0)>=65&&(st.needs.happiness||50)<=25&&st.player.day>=180},
      probability:0.07,repeatable:false,
      choices:[
        {text:"🎉 赴约，好好放松一下",hint:"疲劳-28,心情+25,健康+14,置_d851SocialHealed",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d851SocialHealthDone=true;st.flags._d851SocialHealed=true;if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-28);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25)}if(st.status)st.status.health=Math.min(100,(st.status.health||50)+14);var nid=pn(st);if(nid)sa(st,nid,3,"聚会放松");if(typeof StateManager!=="undefined")StateManager.addMessage("🎉 聚会很愉快——疲劳-28,心情+25,健康+14。","success")}},
        {text:"😅 下次吧",hint:"疲劳+5,心情-5,置_d851SocialSkip",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d851SocialHealthDone=true;st.flags._d851SocialSkip=true;if(st.needs){st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+5);st.needs.happiness=Math.max(0,(st.needs.happiness||50)-5)}if(typeof StateManager!=="undefined")StateManager.addMessage("😅 下次吧。工作永远做不完。","warning")}}
      ]}
  ];
  for(var i=0;i<EVENTS.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===EVENTS[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(EVENTS[i])}
})();