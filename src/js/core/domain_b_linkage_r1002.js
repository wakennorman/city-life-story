(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR1002Loaded)return;RANDOM_EVENTS._domainBLinkageR1002Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"b1002_resilience_growth_v1",phase:"street",icon:"🌱",title:"风雨过后，心智更坚",
story:"回头看看这些日子——你经历了不少糟心事。但每次跌到谷底，你都爬了起来。",
triggers:{minDay:35,interval:70,maxRepeats:3,excludeFlags:["_b1002ResilienceCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b1002ResilienceCd)return false;var _neg=st.flags._negativeEventStreak||0;return _neg>=1&&st.player.day>=35;},
probability:0.04,repeatable:true,
choices:[
{text:"🌱 反思成长",hint:"心智+4,体质+2,置_b1002Resilience",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1002ResilienceCd=true;st.flags._b1002Resilience=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+4);st.player.physique=Math.min(100,(st.player.physique||50)+2)}if(typeof StateManager!=="undefined")StateManager.addMessage("🌱 反思了经历——心智+4,体质+2。","success");}},
{text:"😅 不想回忆",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1002ResilienceCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 不想回忆。心智+3。","info");}}
]},
{id:"b1002_econ_wisdom_v1",phase:"street",icon:"💡",title:"从事件中学会投资",
story:"你经历了这么多次市场波动，渐渐摸出了一些规律。",
triggers:{minDay:25,interval:60,maxRepeats:3,excludeFlags:["_b1002EconWisdomCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b1002EconWisdomCd)return false;var _c=0;if(st.flags._eventHistory&&Array.isArray(st.flags._eventHistory))_c=st.flags._eventHistory.length;return _c>=2&&st.player.day>=25;},
probability:0.04,repeatable:true,
choices:[
{text:"💡 总结市场规律",hint:"智力+3,会计XP+4,置_b1002EconWisdom",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1002EconWisdomCd=true;st.flags._b1002EconWisdom=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);gx("accounting",4);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 总结了市场规律——智力+3,会计XP+4。","success");}},
{text:"😅 太复杂",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1002EconWisdomCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 太复杂。心智+3。","info");}}
]},
{id:"b1002_career_inspiration_v1",phase:"street",icon:"💼",title:"事件中的职业启示",
story:"你经历了一些与工作相关的事件，每次都在你心里留下了一点痕迹。",
triggers:{minDay:20,interval:50,maxRepeats:3,excludeFlags:["_b1002CareerInspCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b1002CareerInspCd)return false;var _cj=st.career&&st.career.currentJob;return _cj&&st.player.day>=20;},
probability:0.04,repeatable:true,
choices:[
{text:"💼 探索职业新方向",hint:"智力+3,管理XP+3,置_b1002CareerInsp",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1002CareerInspCd=true;st.flags._b1002CareerInsp=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);gx("management",3);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 获得了职业启示——智力+3,管理XP+3。","success");}},
{text:"😅 做好眼前事",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1002CareerInspCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 做好眼前事。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
