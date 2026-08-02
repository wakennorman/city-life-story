/**
 * 域H(Phase2/公司) 联动增强 R1024 — H→A经营数据洞察 / H→B公司传奇叙事 / H→G创始人健康管理
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR1024Loaded)return;RANDOM_EVENTS._domainHLinkageR1024Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. H→A: 经营数据洞察—季度财报分析
{id:"h1024_quarter_report",phase:"corporate",icon:"📊",title:"季度财报分析",
story:"季度结束了，你翻开公司的财务报表。\n\n营收、成本、利润、现金流——每一个数字都在讲述着这段时间的经营故事。\n\n你发现了一个规律：每当团队士气高的时候，业绩也会跟着好。\n\n数据不只是数据，而是团队状态的晴雨表。",
triggers:{minDay:90,interval:90,maxRepeats:10,excludeFlags:["_h1024QuarterReportCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1024QuarterReportCd)return false;return st.player.phase==="corporate"&&st.corporate&&st.corporate.rank&&st.player.day%90===0},
probability:0.06,repeatable:true,
choices:[
{text:"📊 深入分析财报",hint:"会计XP+20,管理XP+15,智力+5,置_h1024FinAnalyst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1024QuarterReportCd=true;st.flags._h1024FinAnalyst=true;gx("accounting",20);gx("management",15);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 会计XP+20,管理XP+15,智力+5。财报是企业的体检报告——你学会了读懂它。","success")}},
{text:"📈 关注营收增长点",hint:"管理XP+10,置_h1024RevenueDriver",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1024QuarterReportCd=true;st.flags._h1024RevenueDriver=true;gx("management",10);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 管理XP+10。关注增长——企业不增长就是在衰退。","info")}},
{text:"😅 相信团队",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1024QuarterReportCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。用人不疑——团队是你最大的资产。","info")}}
]},
// 2. H→B: 公司传奇叙事—行业口碑
{id:"h1024_industry_reputation",phase:"corporate",icon:"🏆",title:"行业口碑",
story:"你的公司在行业里渐渐有了名气。\n\n客户说你们靠谱，同行说你们专业，猎头开始挖你们的人。\n\n你意识到——公司做大了，就不再只是你一个人的事了。\n\n你肩上扛着团队的期望，客户的信任，行业的关注。",
triggers:{minDay:180,interval:180,maxRepeats:5,excludeFlags:["_h1024IndustryRepCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1024IndustryRepCd)return false;return st.player.phase==="corporate"&&st.corporate&&st.corporate.rank&&st.player.day%180===0},
probability:0.07,repeatable:true,
choices:[
{text:"🏆 打造行业影响力",hint:"管理XP+20,魅力+5,置_h1024IndustryLeader",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1024IndustryRepCd=true;st.flags._h1024IndustryLeader=true;gx("management",20);if(st.player)st.player.charm=Math.min(100,(st.player.charm||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 管理XP+20,魅力+5。影响力是企业的无形资产——你正在建立自己的行业地位。","success")}},
{text:"🤝 维护客户关系",hint:"管理XP+10,社交XP+8,置_h1024ClientFocused",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1024IndustryRepCd=true;st.flags._h1024ClientFocused=true;gx("management",10);gx("social",8);if(typeof StateManager!=="undefined")StateManager.addMessage("🤝 管理XP+10,社交XP+8。客户是企业的衣食父母——维护好关系就是维护好生意。","info")}}
]},
// 3. H→G: 创始人健康管理—平衡工作与生活
{id:"h1024_founder_balance",phase:"corporate",icon:"⚖️",title:"工作与生活的平衡",
story:"你连续加班了无数个日夜，终于把公司带上了正轨。\n\n但你发现，镜子里的自己变得陌生了——黑眼圈、白发、疲惫的眼神。\n\n你开始思考——如果把自己累垮了，公司做得再好又有什么意义？\n\n健康不是成功的代价，而是成功的基础。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1024FounderBalanceCd)return false;var _startup=st.startup;if(!_startup||!_startup.status||_startup.status==="none"||_startup.status==="exited")return false;var _health=st.status&&st.status.health;return _health!==undefined&&_health<70&&st.player.day>=120&&st.player.day%90===0},
probability:0.08,repeatable:true,
choices:[
{text:"⚖️ 调整工作节奏",hint:"健康+20,疲劳-20,置_h1024BalancedFounder",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1024FounderBalanceCd=true;st.flags._h1024BalancedFounder=true;if(st.status)st.status.health=Math.min(100,(st.status.health||80)+20);if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-20);if(typeof StateManager!=="undefined")StateManager.addMessage("⚖️ 健康+20,疲劳-20。学会了放慢脚步——好的领导者懂得管理自己的能量。","success")}},
{text:"🏋️ 开始健身计划",hint:"健康+15,体质+3,置_h1024FitFounder",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1024FounderBalanceCd=true;st.flags._h1024FitFounder=true;if(st.status)st.status.health=Math.min(100,(st.status.health||80)+15);if(st.player)st.player.physique=Math.min(100,(st.player.physique||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("🏋️ 健康+15,体质+3。身体是革命的本钱——创业者更要善待自己。","info")}},
{text:"😅 等公司稳定再说",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1024FounderBalanceCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。等公司稳定再说——但什么时候才能真正稳定呢？","warning")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();