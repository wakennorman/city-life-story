(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR947Loaded)return;RANDOM_EVENTS._domainCLinkageR947Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"c947_health_balance_v1",phase:"street",icon:"🏥",title:"工作与健康的平衡",
story:"你最近工作压力不小，身体开始发出警告。颈椎酸痛、睡眠下降——该休息了。",
triggers:{minDay:20,interval:70,maxRepeats:5,excludeFlags:["_c947HealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c947HealthCd)return false;var _f=(st.needs&&st.needs.fatigue)||0;var _j=st.career&&st.career.currentJob;return(_f>=55||(st.flags._workStreak||0)>=3)&&_j&&st.player.day>=20;},
probability:0.04,repeatable:true,
choices:[
{text:"🏥 调整作息",hint:"疲劳-15,健康+5,置_c947Health",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c947HealthCd=true;st.flags._c947Health=true;if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-15);if(st.player)st.player.health=Math.min(100,(st.player.health||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("🏥 调整了作息——疲劳-15,健康+5。","success");}},
{text:"💪 再坚持",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c947HealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 再坚持。心智+5。","info");}}
]},
{id:"c947_skill_invest_v1",phase:"street",icon:"📈",title:"技能驱动投资",
story:"你在工作中积累的专业技能，不知不觉也提升了投资判断力。",
triggers:{minDay:60,interval:90,maxRepeats:3,excludeFlags:["_c947SkillInvestCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c947SkillInvestCd)return false;if(!st.skills)return false;var _m=0;for(var _s in st.skills){var _l=st.skills[_s];if(_l&&(_l.level||0)>_m)_m=_l.level||0}return _m>=30&&st.player.day>=60;},
probability:0.04,repeatable:true,
choices:[
{text:"📈 用技能指导投资",hint:"智力+10,会计XP+12,置_c947SkillInvestor",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c947SkillInvestCd=true;st.flags._c947SkillInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+10);gx("accounting",12);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 用技能指导了投资——智力+10,会计XP+12。","success");}},
{text:"😅 太复杂",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c947SkillInvestCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 太复杂。心智+3。","info");}}
]},
{id:"c947_social_circle_v1",phase:"street",icon:"👥",title:"职业人脉",
story:"你在职场上的发展让你接触到了更多优秀的人。社交圈在不知不觉中扩大。",
triggers:{minDay:45,interval:100,maxRepeats:4,excludeFlags:["_c947SocialCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c947SocialCd)return false;if(!st.career||!st.career.currentJob)return false;var _d=st.player.day-(st.career.currentJob.startedDay||0);return(_d>=20||(st.career.totalWorkDays||0)>=80)&&st.player.day>=45;},
probability:0.04,repeatable:true,
choices:[
{text:"👥 拓展人脉",hint:"魅力+6,管理XP+10,置_c947Network",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c947SocialCd=true;st.flags._c947Network=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||50)+6);gx("management",10);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 拓展了人脉——魅力+6,管理XP+10。","success");}},
{text:"😅 专注工作",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c947SocialCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 专注工作。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
