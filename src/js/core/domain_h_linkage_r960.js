/**
 * 域H(Phase2/公司) 联动增强 R960 — H→A企业数据资产 / H→B公司传奇叙事 / H→G创始人健康
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR960Loaded)return;RANDOM_EVENTS._domainHLinkageR960Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. H→A: 企业数据资产 — 公司运营数据积累到一定程度，为战略决策提供依据
{id:"h960_data_platform",phase:"corporate",icon:"📊",title:"数据中台",
story:"公司业务越做越大，数据分散在各个部门，谁也说不清全貌。\n\n你决定建立一个统一的数据平台——把销售、运营、财务数据全部打通。\n\n这个决定将在未来三年内，为公司节省30%的运营成本。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h960DataPlatformDone)return false;if(!st.corporate)return false;var _ph=st.corporate.perfHistory||[];return _ph.length>=18&&st.player.day>=950},
probability:0.04,repeatable:false,
choices:[{text:"📊 建立数据中台",hint:"智力+32,管理XP+45,系统标记数据中台",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h960DataPlatformDone=true;st.flags._h960DataPlatform=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+32);gx("management",45);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+32,管理XP+45。数据中台建立——信息孤岛从此打通。","success")}},
{text:"😅 各部门各自为政",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h960DataPlatformDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. H→B: 公司传奇叙事 — 公司成为行业标杆
{id:"h960_corp_legend",phase:"corporate",icon:"📖",title:"创业者的圣经",
story:"你的创业故事被收录进商学院案例库，成为MBA课堂上的教材。\n\n「从零到一:一家中国科技公司的逆袭之路」\n\n你在课堂上旁听，看到一个学生认真分析你当年的决策——那些你当时觉得理所当然的选择，在别人看来充满了智慧和勇气。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h960CorpLegendDone)return false;var _st=st.startup||{};var _co=_st.company||{};if(!_co.name)return false;return(_co.valuation||0)>=30000000&&st.player.day>=1100&&_st.status==="running"},
probability:0.03,repeatable:false,
choices:[{text:"📖 将经验传承给新一代创业者",hint:"名气+35,心智+28,管理XP+40,系统标记创业导师",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h960CorpLegendDone=true;st.flags._h960Mentor=true;if(st.player){st.player.fame=Math.min(100,(st.player.fame||0)+35);st.player.mental=Math.min(100,(st.player.mental||50)+28)}gx("management",40);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 名气+35,心智+28,管理XP+40。你的经验正在激励下一代创业者。","success")}},
{text:"😌 低调前行",hint:"智力+28",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h960CorpLegendDone=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);if(typeof StateManager!=="undefined")StateManager.addMessage("😌 智力+28。真正的传奇不在于被多少人知道——而在于改变了多少人的生活。","info")}}]},
// 3. H→G: 创始人健康 — 长期高压工作导致健康问题
{id:"h960_founder_wellness",phase:"corporate",icon:"🧘",title:"身心的平衡",
story":"你终于意识到，创业不是百米冲刺，而是马拉松。\n\n连续多年的高强度工作，让你的身体和心灵都到了极限。\n\n你开始学习冥想、规律作息、定期体检——不是为了活得更久，而是为了在这条路上走得更远。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h960WellnessDone)return false;if(!st.status||!st.needs)return false;var _st=st.startup||{};return(st.status.health||100)<=30&&st.player.day>=600&&_st.status==="running"},
probability:0.05,repeatable:false,
choices:[{text:"🧘 建立健康管理体系",hint:"健康+45,疲劳-35,心情+30,系统标记健康管理",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h960WellnessDone=true;st.flags._h960WellnessPlan=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+45);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-35);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+30)}if(typeof StateManager!=="undefined")StateManager.addMessage("🧘 健康+45,疲劳-35,心情+30。你学会了平衡——健康才是最大的财富。","success")}},
{text:"🔥 再拼几年",hint:"健康-15,系统标记拼命三郎",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h960WellnessDone=true;st.flags._h960Grinder=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-15);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-15。你选择了再拼几年——但身体不会说谎。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();