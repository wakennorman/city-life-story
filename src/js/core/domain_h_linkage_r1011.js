/**
 * 域H(Phase2/公司) 联动增强 R1011 — H→A企业数据资产v17 / H→B公司传奇叙事v17 / H→G创始人健康v17
 * 新增: H→C公司→职业成长(技能提升反哺职场路径) / H→F公司仪表盘UI增强
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR1011Loaded)return;RANDOM_EVENTS._domainHLinkageR1011Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// H→A: 企业数据资产 v17 — 当公司估值突破10亿时，数据驱动决策成为竞争优势
{id:"h1011_corporate_data_v17",phase:"corporate",icon:"📊",title:"数据驱动，决胜千里",story:"公司估值突破十亿大关，财务报表越来越复杂。CFO建议引入专业的数据分析团队，用数据驱动决策。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1011DataDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return(st.startup.company.valuation||0)>=1000000000&&st.player.day>=1000},
probability:0.06,repeatable:false,
choices:[{text:"📊 组建数据分析团队",hint:"智力+45,管理XP+55,置_h1011DataTeam",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1011DataDone=true;st.flags._h1011DataTeam=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+45);gx("management",55);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+45,管理XP+55。数据团队已就位，决策效率大幅提升！","success")}},
{text:"💼 相信直觉，少量投入",hint:"智力+15,管理XP+20",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1011DataDone=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+15);gx("management",20);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 智力+15,管理XP+20。虽然没全盘数据化，但关键指标已经心中有数。","info")}}]},

// H→B: 公司传奇叙事 v17 — 公司IPO后，创始人的故事被媒体报道
{id:"h1011_corporate_legend_v17",phase:"corporate",icon:"🏆",title:"创始人故事，传遍全城",story:"你的创业故事被本地媒体刊登了！从街头打拼到公司上市的传奇经历，感动了无数读者。采访邀请纷至沓来。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1011LegendDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return Array.isArray(st.startup.company.fundingRounds)&&st.startup.company.fundingRounds.length>=9&&st.player.day>=700},
probability:0.09,repeatable:false,
choices:[{text:"🏆 接受采访，分享经验",hint:"名气+45,心智+35,置_h1011MediaExposure",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1011LegendDone=true;st.flags._h1011MediaExposure=true;if(st.player){st.player.fame=Math.min(100,(st.player.fame||0)+45);st.player.mental=Math.min(100,(st.player.mental||50)+35)}if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 名气+45,心智+35。采访大获成功，更多人知道了你的故事！","success")}},
{text:"😊 低调回应，专注事业",hint:"心智+42",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1011LegendDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+42);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+42。你选择低调，专注于把公司做得更好。","success")}}]},

// H→G: 创始人健康 v17 — 公司上市后，高强度工作让健康亮起红灯
{id:"h1011_founder_health_v17",phase:"corporate",icon:"💪",title:"创始人健康，是公司最大的资产",story:"最近三个月，你每天的睡眠时间不足5小时。体检报告显示多项指标异常，医生强烈建议你休息。但公司正处于关键扩张期。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1011HealthDone)return false;if(st.player.phase!=="corporate")return false;return(st.status?st.status.health:100)<1.5&&st.player.day>=600},
probability:0.12,repeatable:false,
choices:[{text:"💪 强制休息，放权给团队",hint:"健康+85,KPI-2,置_h1011Delegate",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1011HealthDone=true;st.flags._h1011Delegate=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+85);if(st.player&&st.player.corporate)st.player.corporate.kpi=Math.max(0,(st.player.corporate.kpi||0)-2);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 健康+85,KPI-2。你学会了放权，团队反而更有活力！","success")}},
{text:"🔥 再坚持一下，不能停下",hint:"健康-65,KPI+65,置_h1011Burnout",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1011HealthDone=true;st.flags._h1011Burnout=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-65);if(st.player&&st.player.corporate)st.player.corporate.kpi=Math.min(150,(st.player.corporate.kpi||0)+65);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-65,KPI+65。身体在抗议，但公司业绩上去了...","warning")}}]},

// H→C: 公司→职业成长 — 公司培训体系提升员工技能，反哺职业路径
{id:"h1011_corp_to_career",phase:"corporate",icon:"📚",title:"内部培训，技能升级",story:"公司决定建立内部培训体系，定期邀请行业专家来做分享。作为管理者，你也有机会参与这些课程。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1011TrainingDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return(st.startup.company.valuation||0)>=300000000&&st.player.day>=400},
probability:0.08,repeatable:false,
choices:[{text:"📚 参加全部管理课程",hint:"管理XP+60,智力+25,职业技能提升,置_h1011MgmtTrained",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1011TrainingDone=true;st.flags._h1011MgmtTrained=true;gx("management",60);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);if(st.player&&st.player.corporate)st.player.corporate.ability=Math.min(100,(st.player.corporate.ability||0)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("📚 管理XP+60,智力+25,能力+8。培训让你受益匪浅！","success")}},
{text:"🎯 只参加技术分享会",hint:"技能XP+40,能力+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1011TrainingDone=true;if(st.player&&st.player.corporate)st.player.corporate.ability=Math.min(100,(st.player.corporate.ability||0)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("🎯 技术分享会很有收获，但管理课程都错过了。","info")}}]},

// H→F: 公司→UI增强 — 董事会压力等级可视化提醒
{id:"h1011_board_pressure_alert",phase:"corporate",icon:"🔔",title:"董事会压力警报",story:"季度董事会即将召开，但本季度的KPI完成情况不太理想。助理提醒你：几个董事最近态度有些微妙。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1011BoardAlertDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return(st.startup.company.boardPressureLevel||0)>=3&&st.player.day>=500},
probability:0.15,repeatable:false,
choices:[{text:"📋 提前准备，汇报补救方案",hint:"管理XP+50,董事会信任+10,置_h1011BoardPrepared",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1011BoardAlertDone=true;st.flags._h1011BoardPrepared=true;gx("management",50);if(st.startup&&st.startup.company){st.startup.company.shareholderTrust=Math.min(100,(st.startup.company.shareholderTrust||50)+10);st.startup.company.boardPressureLevel=Math.max(0,(st.startup.company.boardPressureLevel||0)-1)}if(typeof StateManager!=="undefined")StateManager.addMessage("📋 管理XP+50,股东信任+10,董事会压力-1。周密的准备赢得了董事们的信任。","success")}},
{text:"😤 硬着头皮上",hint:"董事会压力+1,心智-5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1011BoardAlertDone=true;if(st.player)st.player.mental=Math.max(0,(st.player.mental||50)-5);if(st.startup&&st.startup.company)st.startup.company.boardPressureLevel=Math.min(4,(st.startup.company.boardPressureLevel||0)+1);if(typeof StateManager!=="undefined")StateManager.addMessage("😤 董事会上被严厉质询，压力更大了。","danger")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();