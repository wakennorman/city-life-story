/**
 * 域H(Phase2/公司) 联动增强 R1016 — H→A企业数据资产 / H→B公司传奇叙事 / H→G创始人健康
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR1016Loaded)return;RANDOM_EVENTS._domainHLinkageR1016Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. H→A: 企业数据资产—经营数据复盘
{id:"h1016_corp_data_review",phase:"corporate",icon:"📊",title:"经营数据复盘",
story:"你翻看公司的季度报表，数据清晰地展示了这段时间的经营状况。\n\n营收增长、团队规模、现金流——这些数字背后，是你每一天的决策和努力。\n\n看懂数据，才能做好决策。",
triggers:{minDay:60,interval:90,maxRepeats:10,excludeFlags:["_h1016CorpDataReviewCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1016CorpDataReviewCd)return false;return st.player.phase==="corporate"&&st.corporate&&st.corporate.rank&&st.player.day%90===0},
probability:0.06,repeatable:true,
choices:[
{text:"📊 深入分析数据",hint:"会计XP+20,管理XP+15,置_h1016DataDriven",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1016CorpDataReviewCd=true;st.flags._h1016DataDriven=true;gx("accounting",20);gx("management",15);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 会计XP+20,管理XP+15。数据驱动决策——你正在成为更出色的经营者。","success")}},
{text:"📈 关注营收趋势",hint:"会计XP+10,置_h1016RevenueFocus",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1016CorpDataReviewCd=true;st.flags._h1016RevenueFocus=true;gx("accounting",10);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 会计XP+10。关注营收——企业最核心的晴雨表。","info")}},
{text:"😅 相信直觉",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1016CorpDataReviewCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。有些决策，靠的是直觉和勇气。","info")}}
]},
// 2. H→B: 公司传奇叙事—团队里程碑
{id:"h1016_team_milestone",phase:"corporate",icon:"🏆",title:"团队里程碑",
story:"你的团队完成了一个重要项目，客户非常满意。\n\n团队成员们围在一起庆祝，每个人脸上都带着笑容。\n\n你忽然意识到——真正的成就不是你一个人走多远，而是你能带着多少人一起走。",
triggers:{minDay:90,interval:120,maxRepeats:5,excludeFlags:["_h1016TeamMilestoneCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1016TeamMilestoneCd)return false;var _phase=st.player.phase||"";if(_phase!=="corporate")return false;var _team=st.corporate&&st.corporate.team;return _team&&Array.isArray(_team)&&_team.length>=2&&st.player.day%120===0},
probability:0.07,repeatable:true,
choices:[
{text:"🏆 庆祝团队成就",hint:"管理XP+20,心情+15,士气+5,置_h1016TeamBuilder",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1016TeamMilestoneCd=true;st.flags._h1016TeamBuilder=true;gx("management",20);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+15);if(st.corporate&&st.corporate.team){for(var _ti=0;_ti<st.corporate.team.length;_ti++){var _tm=st.corporate.team[_ti];if(_tm)_tm.loyalty=Math.min(100,(_tm.loyalty||50)+5)}}if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 管理XP+20,心情+15。团队士气高涨——你们是一支真正的队伍。","success")}},
{text:"📋 复盘总结经验",hint:"管理XP+15,智力+5,置_h1016ProcessOriented",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1016TeamMilestoneCd=true;st.flags._h1016ProcessOriented=true;gx("management",15);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("📋 管理XP+15,智力+5。复盘是最好的学习——把经验变成流程。","info")}}
]},
// 3. H→G: 创始人健康—创业者的身体警报
{id:"h1016_founder_health",phase:"corporate",icon:"💊",title:"创业者的身体警报",
story:"连续加班、熬夜、不规律饮食——你发现自己的身体开始发出警报信号。\n\n创业是一场马拉松，不是百米冲刺。\n\n照顾好自己，才是对公司和团队最大的负责。",
triggers:{minDay:120,interval:90,maxRepeats:8,excludeFlags:["_h1016FounderHealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1016FounderHealthCd)return false;var _startup=st.startup;if(!_startup||!_startup.status||_startup.status==="none"||_startup.status==="exited")return false;var _health=st.status&&st.status.health;return _health!==undefined&&_health<60&&st.player.day%90===0},
probability:0.08,repeatable:true,
choices:[
{text:"💊 去看医生做检查",hint:"健康+25,疲劳-10,置_h1016HealthAware",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1016FounderHealthCd=true;st.flags._h1016HealthAware=true;if(st.status)st.status.health=Math.min(100,(st.status.health||80)+25);if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-10);if(st.resources)st.resources.cash=Math.max(0,(st.resources.cash||0)-200);if(typeof StateManager!=="undefined")StateManager.addMessage("💊 健康+25,疲劳-10。花¥200做了全面体检——身体是革命的本钱。","success")}},
{text:"🧘 调整工作节奏",hint:"健康+10,疲劳-15,置_h1016Balanced",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1016FounderHealthCd=true;st.flags._h1016Balanced=true;if(st.status)st.status.health=Math.min(100,(st.status.health||80)+10);if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-15);if(typeof StateManager!=="undefined")StateManager.addMessage("🧘 健康+10,疲劳-15。学会了放慢脚步——慢下来才能走得更远。","info")}},
{text:"😅 没事，继续干",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1016FounderHealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。你选择硬扛——但身体不会永远配合你的意志。","warning")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();