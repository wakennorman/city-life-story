(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR963Loaded)return;RANDOM_EVENTS._domainCLinkageR963Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"c963_health_balance_v1",phase:"street",icon:"🏥",title:"工作与健康的平衡",
story:"你最近工作压力不小，身体开始发出警告。颈椎酸痛、睡眠下降——该休息了。",
triggers:{minDay:15,interval:60,maxRepeats:5,excludeFlags:["_c963HealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c963HealthCd)return false;var _f=(st.needs&&st.needs.fatigue)||0;var _j=st.career&&st.career.currentJob;return(_f>=50||(st.flags._workStreak||0)>=2)&&_j&&st.player.day>=15;},
probability:0.04,repeatable:true,
choices:[
{text:"🏥 调整作息",hint:"疲劳-12,健康+3,置_c963Health",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c963HealthCd=true;st.flags._c963Health=true;if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-12);if(st.player)st.player.health=Math.min(100,(st.player.health||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("🏥 调整了作息——疲劳-12,健康+3。","success");}},
{text:"💪 再坚持",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c963HealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 再坚持。心智+3。","info");}}
]},
{id:"c963_skill_invest_v1",phase:"street",icon:"📈",title:"技能驱动投资",
story:"你在工作中积累的专业技能，不知不觉也提升了投资判断力。",
triggers:{minDay:50,interval:80,maxRepeats:3,excludeFlags:["_c963SkillInvestCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c963SkillInvestCd)return false;if(!st.skills)return false;var _m=0;for(var _s in st.skills){var _l=st.skills[_s];if(_l&&(_l.level||0)>_m)_m=_l.level||0}return _m>=25&&st.player.day>=50;},
probability:0.04,repeatable:true,
choices:[
{text:"📈 用技能指导投资",hint:"智力+5,会计XP+8,置_c963SkillInvestor",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c963SkillInvestCd=true;st.flags._c963SkillInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);gx("accounting",8);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 用技能指导了投资——智力+5,会计XP+8。","success");}},
{text:"😅 太复杂",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c963SkillInvestCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 太复杂。心智+3。","info");}}
]},
{id:"c963_social_circle_v1",phase:"street",icon:"👥",title:"职业人脉",
story:"你在职场上的发展让你接触到了更多优秀的人。社交圈在不知不觉中扩大。",
triggers:{minDay:40,interval:90,maxRepeats:4,excludeFlags:["_c963SocialCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c963SocialCd)return false;if(!st.career||!st.career.currentJob)return false;var _d=st.player.day-(st.career.currentJob.startedDay||0);return(_d>=15||(st.career.totalWorkDays||0)>=60)&&st.player.day>=40;},
probability:0.04,repeatable:true,
choices:[
{text:"👥 拓展人脉",hint:"魅力+4,管理XP+6,置_c963Network",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c963SocialCd=true;st.flags._c963Network=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||50)+4);gx("management",6);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 拓展了人脉——魅力+4,管理XP+6。","success");}},
{text:"😅 专注工作",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c963SocialCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 专注工作。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
