/**
 * 域H(Phase2/公司) 联动增强 R936 — H→A企业数据资产 / H→B公司传奇叙事 / H→G创始人健康
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 *  - done-flag 防重复。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR936Loaded)return;RANDOM_EVENTS._domainHLinkageR936Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. H→A: 企业数据资产 — 公司运营数据积累到一定程度，成为核心竞争力
{id:"h936_enterprise_data_asset",phase:"corporate",icon:"💾",title:"数据即资产",
story:"你翻看了公司三年的运营数据。\n\n「客户复购率、产品生命周期、季节性波动——这些数据越看越有价值。」\n\nCFO 发来一条消息:有家投资机构想买你们的行业数据授权。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h936DataAssetDone)return false;if(!st.corporate)return false;var _ph=st.corporate.perfHistory||[];return _ph.length>=12&&st.player.day>=700},
probability:0.05,repeatable:false,
choices:[{text:"💾 建立数据资产运营体系",hint:"智力+25,管理XP+35,系统标记数据资产运营",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h936DataAssetDone=true;st.flags._h936DataAssetOperator=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("management",35);if(typeof StateManager!=="undefined")StateManager.addMessage("💾 智力+25,管理XP+35。数据资产运营体系建立！","success")}},
{text:"😅 数据就是数据",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h936DataAssetDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. H→B: 公司传奇叙事 — 公司从濒临倒闭到成功转型，成为行业传奇
{id:"h936_corp_turnaround",phase:"corporate",icon:"🦅",title:"浴火重生",
story:"所有人都以为你们撑不过那个冬天。\n\n客户流失、资金链断裂、核心团队出走——最惨的时候，账上只剩¥3万，下个月工资都发不出。\n\n但你没放弃。你带着留下的几个人，硬是熬了过来。现在，你们的故事在行业内传为佳话。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h936TurnaroundDone)return false;var _st=st.startup||{};var _co=_st.company||{};if(!_co.name)return false;var _v=_co.valuation||0;return _v>=3000000&&_v<=15000000&&st.player.day>=500&&_st.status==="running"},
probability:0.04,repeatable:false,
choices:[{text:"🦅 接受行业媒体专访",hint:"名气+22,心智+18,管理XP+25,系统标记浴火重生",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h936TurnaroundDone=true;st.flags._h936Phoenix=true;if(st.player){st.player.fame=Math.min(100,(st.player.fame||0)+22);st.player.mental=Math.min(100,(st.player.mental||50)+18)}gx("management",25);if(typeof StateManager!=="undefined")StateManager.addMessage("🦅 名气+22,心智+18,管理XP+25。你的浴火重生故事激励了无数创业者！","success")}},
{text:"😌 默默做事，让产品说话",hint:"智力+20,系统标记务实派",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h936TurnaroundDone=true;st.flags._h936Pragmatist=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);if(typeof StateManager!=="undefined")StateManager.addMessage("😌 智力+20。你选择用产品说话——沉默是最大的力量。","info")}}]},
// 3. H→G: 创始人健康 — 长期高压工作导致健康严重透支
{id:"h936_founder_health_crisis",phase:"corporate",icon:"🚑",title:"健康的警报",
story:"凌晨三点，你从公司出来，在路边蹲着等出租车。\n\n胸口一阵闷痛——你以为是胃病，但这次不一样。\n\n你掏出手机，犹豫要不要打120。手机屏幕上的时间显示:3:17 AM。你已经连续工作了87天，没有一天休息。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h936HealthCrisisDone)return false;if(!st.status||!st.needs)return false;var _st=st.startup||{};return(st.status.health||100)<=20&&(st.needs.fatigue||0)>=90&&st.player.day>=450&&_st.status==="running"},
probability:0.06,repeatable:false,
choices:[{text:"🚑 立即去医院",hint:"健康+60,疲劳-50,心情+25,系统标记健康觉醒",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h936HealthCrisisDone=true;st.flags._h936HealthAwake=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+60);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-50);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25)}if(typeof StateManager!=="undefined")StateManager.addMessage("🚑 健康+60,疲劳-50,心情+25。医生的诊断书让你清醒——没有健康，一切都是零。","success")}},
{text:"🔥 扛过去，公司不能停",hint:"健康-25,系统标记不要命创始人",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h936HealthCrisisDone=true;st.flags._h936RecklessFounder=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-25);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-25。你选择了继续——但身体不会永远给你机会。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();