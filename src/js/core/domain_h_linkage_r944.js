/**
 * 域H(Phase2/公司) 联动增强 R944 — H→A企业数据资产 / H→B公司传奇叙事 / H→G创始人健康
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 *  - done-flag 防重复。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR944Loaded)return;RANDOM_EVENTS._domainHLinkageR944Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. H→A: 企业数据资产 — 公司运营数据积累到一定程度，为战略决策提供依据
{id:"h944_data_strategy",phase:"corporate",icon:"📊",title:"数据驱动战略",
story:"董事会会议上，你展示了公司的数据分析报告。\n\n「我们过去三年的客户留存率曲线、产品生命周期、以及市场渗透率——这些数据告诉我们，下一步应该往哪里走。」\n\n投资人们频频点头——数据比任何华丽的PPT都有说服力。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h944DataStrategyDone)return false;if(!st.corporate)return false;var _ph=st.corporate.perfHistory||[];return _ph.length>=14&&st.player.day>=800},
probability:0.05,repeatable:false,
choices:[{text:"📊 建立数据驱动战略体系",hint:"智力+28,管理XP+40,系统标记数据战略家",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h944DataStrategyDone=true;st.flags._h944DataStrategist=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("management",40);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+28,管理XP+40。数据驱动战略体系建立！","success")}},
{text:"😅 经验比数据重要",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h944DataStrategyDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. H→B: 公司传奇叙事 — 公司从初创到行业标杆的完整故事
{id:"h944_industry_legend",phase:"corporate",icon:"🏆",title:"行业标杆",
story:"你收到了行业峰会的邀请函——主办方想请你做主题演讲。\n\n「从地下车库到行业前三，贵公司的成长历程堪称传奇。」\n\n你看着邀请函上那行字，想起了这些年熬过的每一个夜、做过的每一个艰难决定。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h944LegendDone)return false;var _st=st.startup||{};var _co=_st.company||{};if(!_co.name)return false;return(_co.valuation||0)>=10000000&&st.player.day>=800&&_st.status==="running"},
probability:0.04,repeatable:false,
choices:[{text:"🏆 受邀做主题演讲",hint:"名气+25,心智+20,管理XP+30,系统标记行业标杆",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h944LegendDone=true;st.flags._h944IndustryLeader=true;if(st.player){st.player.fame=Math.min(100,(st.player.fame||0)+25);st.player.mental=Math.min(100,(st.player.mental||50)+20)}gx("management",30);if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 名气+25,心智+20,管理XP+30。你的故事激励了无数创业者！","success")}},
{text:"😌 婉拒，专注产品",hint:"智力+22,系统标记深耕产品",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h944LegendDone=true;st.flags._h944ProductDeep=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);if(typeof StateManager!=="undefined")StateManager.addMessage("😌 智力+22。你选择继续深耕产品——真正的传奇不需要演讲台。","info")}}]},
// 3. H→G: 创始人健康 — 事业巅峰期健康亮起红灯
{id:"h944_founder_burnout",phase:"corporate",icon:"🔥",title:"燃烧的尽头",
story:"你站在办公室的落地窗前，看着城市的天际线。\n\n公司上市在即，所有人都盯着你。但你最近越来越频繁地失眠，心跳总是不规律，连咖啡都喝不出味道了。\n\n你拥有了一切，却开始怀疑——这一切值得吗？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h944BurnoutDone)return false;if(!st.status||!st.needs)return false;var _st=st.startup||{};return(st.status.health||100)<=25&&(st.needs.happiness||50)<=30&&st.player.day>=600&&_st.status==="running"},
probability:0.06,repeatable:false,
choices:[{text:"🔥 放权，找回生活",hint:"健康+40,心情+40,疲劳-30,系统标记生活平衡者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h944BurnoutDone=true;st.flags._h944LifeBalance=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+40);if(st.needs){st.needs.happiness=Math.min(100,(st.needs.happiness||50)+40);st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-30)}if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康+40,心情+40,疲劳-30。你学会了放权——生活不是只有工作。","success")}},
{text:"💪 再坚持一下，上市后就好了",hint:"健康-15,系统标记过劳创始人",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h944BurnoutDone=true;st.flags._h944Overworked3=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-15);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 健康-15。你选择了再坚持——但身体不会永远等你。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();