/**
 * 域H(Phase2/公司) 联动增强 R952 — H→A企业数据资产 / H→B公司传奇叙事 / H→G创始人健康
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR952Loaded)return;RANDOM_EVENTS._domainHLinkageR952Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. H→A: 企业数据资产 — 公司运营数据积累到一定程度，为战略决策提供依据
{id:"h952_data_analytics",phase:"corporate",icon:"📊",title:"数据分析的力量",
story:"你参加了行业大数据峰会，发现竞争对手都在用数据驱动决策。\n\n「你们的客户数据、销售数据、运营数据——这些不是冰冷的数字，是金矿。」\n\n你决定回公司后全面升级数据系统。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h952DataAnalyticsDone)return false;if(!st.corporate)return false;var _ph=st.corporate.perfHistory||[];return _ph.length>=16&&st.player.day>=900},
probability:0.04,repeatable:false,
choices:[{text:"📊 全面升级数据系统",hint:"智力+30,管理XP+45,系统标记数据驱动",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h952DataAnalyticsDone=true;st.flags._h952DataDriven=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+30);gx("management",45);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+30,管理XP+45。数据驱动决策——你看到了数字背后的真相。","success")}},
{text:"😅 现有系统够用了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h952DataAnalyticsDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. H→B: 公司传奇叙事 — 公司成为行业标杆，故事被传颂
{id:"h952_corp_legacy_story",phase:"corporate",icon:"📖",title:"传承的故事",
story:"公司成立十周年，你写了一封给全体员工的信。\n\n「十年前，我们只有三个人、一间办公室和一个不切实际的梦想。十年后，我们有了上千名员工、遍布全国的客户，以及一个正在改变行业的产品。」\n\n这封信被传到网上，点击量突破了百万。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h952LegacyStoryDone)return false;var _st=st.startup||{};var _co=_st.company||{};if(!_co.name)return false;return(_co.valuation||0)>=20000000&&st.player.day>=1000&&_st.status==="running"},
probability:0.03,repeatable:false,
choices:[{text:"📖 将公司故事整理成书",hint:"名气+30,心智+25,管理XP+35,系统标记企业传承者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h952LegacyStoryDone=true;st.flags._h952LegacyWriter=true;if(st.player){st.player.fame=Math.min(100,(st.player.fame||0)+30);st.player.mental=Math.min(100,(st.player.mental||50)+25)}gx("management",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 名气+30,心智+25,管理XP+35。你的故事将成为行业的经典。","success")}},
{text:"😌 让产品说话",hint:"智力+25",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h952LegacyStoryDone=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);if(typeof StateManager!=="undefined")StateManager.addMessage("😌 智力+25。真正的传奇不需要文字——产品就是最好的故事。","info")}}]},
// 3. H→G: 创始人健康 — 长期高压工作导致健康严重透支
{id:"h952_founder_health_crisis",phase:"corporate",icon:"🏥",title:"健康的代价",
story:"体检报告出来了，各项指标亮起红灯。\n\n医生看着报告，沉默了一会儿才开口：「你这不是工作，是在自杀。」\n\n你愣住了。你知道自己很拼，但从来没想过会这么严重。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h952HealthCrisisDone)return false;if(!st.status||!st.needs)return false;var _st=st.startup||{};return(st.status.health||100)<=15&&st.player.day>=500&&_st.status==="running"},
probability:0.05,repeatable:false,
choices:[{text:"🏥 立即调整生活方式",hint:"健康+50,疲劳-40,心情+30,系统标记健康觉醒",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h952HealthCrisisDone=true;st.flags._h952HealthAwake2=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+50);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-40);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+30)}if(typeof StateManager!=="undefined")StateManager.addMessage("🏥 健康+50,疲劳-40,心情+30。医生的诊断书让你猛醒——没有健康，一切都是零。","success")}},
{text:"🔥 公司离不开我",hint:"健康-20,系统标记工作狂",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h952HealthCrisisDone=true;st.flags._h952Workaholic2=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-20);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-20。你选择了继续——但体检报告上的红灯不会自己熄灭。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();