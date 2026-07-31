(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR978Loaded)return;RANDOM_EVENTS._domainBLinkageR978Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"b978_resilience_growth_v1",phase:"street",icon:"🌱",title:"风雨过后，心智更坚",
story:"回头看看这些日子——你经历了不少糟心事。但每次跌到谷底，你都爬了起来，而且站得更稳。",
triggers:{minDay:50,interval:100,maxRepeats:3,excludeFlags:["_b978ResilienceCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b978ResilienceCd)return false;var _neg=st.flags._negativeEventStreak||0;return _neg>=2&&st.player.day>=50;},
probability:0.04,repeatable:true,
choices:[
{text:"🌱 反思成长",hint:"心智+8,体质+3,置_b978Resilience",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b978ResilienceCd=true;st.flags._b978Resilience=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+8);st.player.physique=Math.min(100,(st.player.physique||50)+3)}if(typeof StateManager!=="undefined")StateManager.addMessage("🌱 反思了经历——心智+8,体质+3。","success");}},
{text:"😅 不想回忆",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b978ResilienceCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 不想回忆。心智+3。","info");}}
]},
{id:"b978_econ_wisdom_v1",phase:"street",icon:"💡",title:"从事件中学会投资",
story:"你经历了这么多次市场波动，渐渐摸出了一些规律。",
triggers:{minDay:40,interval:90,maxRepeats:3,excludeFlags:["_b978EconWisdomCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b978EconWisdomCd)return false;var _c=0;if(st.flags._eventHistory&&Array.isArray(st.flags._eventHistory))_c=st.flags._eventHistory.length;return _c>=3&&st.player.day>=40;},
probability:0.04,repeatable:true,
choices:[
{text:"💡 总结市场规律",hint:"智力+6,会计XP+8,置_b978EconWisdom",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b978EconWisdomCd=true;st.flags._b978EconWisdom=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+6);gx("accounting",8);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 总结了市场规律——智力+6,会计XP+8。","success");}},
{text:"😅 太复杂",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b978EconWisdomCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 太复杂。心智+3。","info");}}
]},
{id:"b978_career_inspiration_v1",phase:"street",icon:"💼",title:"事件中的职业启示",
story:"你经历了一些与工作相关的事件，每次都在你心里留下了一点痕迹。",
triggers:{minDay:35,interval:80,maxRepeats:3,excludeFlags:["_b978CareerInspCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b978CareerInspCd)return false;var _cj=st.career&&st.career.currentJob;return _cj&&st.player.day>=35;},
probability:0.04,repeatable:true,
choices:[
{text:"💼 探索职业新方向",hint:"智力+5,管理XP+6,置_b978CareerInsp",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b978CareerInspCd=true;st.flags._b978CareerInsp=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);gx("management",6);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 获得了职业启示——智力+5,管理XP+6。","success");}},
{text:"😅 做好眼前事",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b978CareerInspCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 做好眼前事。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
