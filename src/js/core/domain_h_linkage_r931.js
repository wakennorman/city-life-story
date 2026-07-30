/**
 * 域H(Phase2/公司) 联动增强 R931 — H→A企业数据洞察 / H→B公司传奇叙事 / H→G创始人健康管理
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 *  - done-flag 防重复。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR931Loaded)return;RANDOM_EVENTS._domainHLinkageR931Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. H→A: 企业数据洞察 — 公司运营到一定规模后，数据驱动决策成为核心竞争力
{id:"h931_enterprise_intel",phase:"corporate",icon:"🔍",title:"数据驱动决策",
story:"会议室里，运营总监摊开了这一季度的数据报表。\n\n「用户留存率上升了12%，但获客成本也在同步增长——」\n\n你盯着数字，忽然意识到：数据不是用来报告的，是用来决策的。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h931IntelDone)return false;if(!st.corporate)return false;var _ph=st.corporate.perfHistory||[];return _ph.length>=8&&st.player.day>=500},
probability:0.05,repeatable:false,
choices:[{text:"🔍 建立数据驱动的决策体系",hint:"智力+25,会计XP+35,系统标记数据驱动决策",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h931IntelDone=true;st.flags._h931DataDriven=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("🔍 智力+25,会计XP+35。数据驱动决策能力提升！","success")}},
{text:"😅 凭经验就够了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h931IntelDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. H→B: 公司传奇叙事 — 公司经历重大危机后成功转型，成为行业传奇故事
{id:"h931_corp_legend",phase:"corporate",icon:"📖",title:"危机即转机",
story:"六个月前，公司差点倒闭。\n\n现金流断裂、核心团队离职、客户大规模流失——那段时间你每天都在想，明天还能不能撑下去。\n\n但现在，你们挺过来了。行业内的人开始谈论你们的故事。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h931LegendDone)return false;var _st=st.startup||{};var _co=_st.company||{};if(!_co.name)return false;var _v=_co.valuation||0;return _v>=5000000&&_v<=20000000&&st.player.day>=600&&_st.status==="running"},
probability:0.05,repeatable:false,
choices:[{text:"📖 接受采访，分享创业故事",hint:"名气+20,心智+15,管理XP+30,系统标记创业明星",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h931LegendDone=true;st.flags._h931EntrepreneurStar=true;if(st.player){st.player.fame=Math.min(100,(st.player.fame||0)+20);st.player.mental=Math.min(100,(st.player.mental||50)+15)}gx("management",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 名气+20,心智+15,管理XP+30。你的创业故事激励了很多人！","success")}},
{text:"😌 低调前行，专注产品",hint:"智力+18,系统标记专注产品",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h931LegendDone=true;st.flags._h931ProductFocus=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+18);if(typeof StateManager!=="undefined")StateManager.addMessage("😌 智力+18。你选择用产品说话。","info")}}]},
// 3. H→G: 创始人健康管理 — 长期高压工作导致健康亮红灯，必须做出选择
{id:"h931_founder_health",phase:"corporate",icon:"🏥",title:"身体是革命的本钱",
story:"凌晨两点，你还在办公室。\n\n这是连续第45天工作超过12小时。\n\n你站起来想去倒杯水，忽然一阵眩晕——你扶住桌沿，看着屏幕上跳动的财务报表，第一次产生了动摇。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h931HealthDone)return false;if(!st.status||!st.needs)return false;var _st=st.startup||{};return(st.status.health||100)<=30&&(st.needs.fatigue||0)>=80&&st.player.day>=400&&_st.status==="running"},
probability:0.07,repeatable:false,
choices:[{text:"🏥 强制休假一周",hint:"健康+50,疲劳-50,心情+30,系统标记健康优先",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h931HealthDone=true;st.flags._h931HealthFirst=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+50);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-50);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+30)}if(typeof StateManager!=="undefined")StateManager.addMessage("🏥 健康+50,疲劳-50,心情+30。没有什么比健康更重要。","success")}},
{text:"🔥 咬牙坚持，公司不能停",hint:"健康-15,疲劳+20,系统标记工作狂",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h931HealthDone=true;st.flags._h931Workaholic=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-15);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+20);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-15,疲劳+20。你选择了坚持，但身体不会永远等你。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();