/**
 * 域H(Phase2/公司) 联动增强 R914 — H→A企业数据资产v19 / H→B公司传奇叙事v19 / H→G创始人健康v19
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR914Loaded)return;RANDOM_EVENTS._domainHLinkageR914Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"h914_enterprise_data_v19",phase:"corporate",icon:"📊",title:"企业数据资产",story:"你打开公司的经营数据面板，发现过去几个季度的数据已经积累成了一座金矿。\n\n「营收曲线、团队规模、客户满意度——这些数据不仅记录了过去，更预示着未来。」\n\n你开始意识到，数据本身就是公司最值钱的资产之一。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h914EnterpriseDataDone)return false;if(!st.corporate)return false;var _ph=st.corporate.perfHistory||[];return _ph.length>=8&&st.player.day>=600&&st.corporate.active},
probability:0.06,repeatable:false,
choices:[{text:"📊 深度分析企业数据",hint:"智力+25,管理XP+35,系统标记数据驱动型企业",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h914EnterpriseDataDone=true;st.flags._h914DataDrivenEnterprise=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("management",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+25,管理XP+35。数据驱动型企业思维建立！","success")}},
{text:"😅 凭经验就够了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h914EnterpriseDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"h914_company_saga_v19",phase:"corporate",icon:"📖",title:"公司传奇故事",story:"你的公司在行业内已经小有名气。\n\n「从三个人挤在出租屋里写代码，到现在拥有自己的办公室——这段经历本身就是最好的品牌故事。」\n\n一家媒体联系你，想采访你们的创业故事。这不仅是一次宣传，更是一次对公司历史的梳理。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h914CompanySagaDone)return false;var _st=st.startup||{};var _co=_st.company||{};return(_co.valuation||0)>=5000000&&st.player.day>=700&&_st.status==="running"},
probability:0.06,repeatable:false,
choices:[{text:"📖 接受采访，讲述公司故事",hint:"心智+20,名气+15,系统标记企业叙事者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h914CompanySagaDone=true;st.flags._h914CompanyStoryTeller=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+20);st.player.fame=Math.min(100,(st.player.fame||0)+15)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+20,名气+15。公司故事传播开来！","success")}},
{text:"😅 低调发展",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h914CompanySagaDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"h914_founder_health_v19",phase:"corporate",icon:"💪",title:"创始人健康危机",story:"连续几个月的超负荷工作，你的身体终于发出了警告。\n\n「创业是一场马拉松，不是百米冲刺。」——投资人的话在耳边回响。\n\n你看着镜子里的自己——眼袋、黑眼圈、发际线后移。公司正在上升期，但你的身体在走下坡路。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h914FounderHealthDone)return false;if(!st.status||!st.needs)return false;var _st=st.startup||{};return(st.status.health||100)<=30&&(st.needs.fatigue||0)>=80&&st.player.day>=500&&_st.status==="running"},
probability:0.08,repeatable:false,
choices:[{text:"💪 放权休息，健康第一",hint:"健康+40,疲劳-40,心情+20,系统标记创始人健康意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h914FounderHealthDone=true;st.flags._h914FounderHealthAwareness=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+40);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-40);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+20)}if(typeof StateManager!=="undefined")StateManager.addMessage("💪 健康+40,疲劳-40,心情+20。身体是创业的本钱！","success")}},
{text:"🔥 再拼一把，上市就好了",hint:"健康-15,疲劳+20,系统标记过劳创始人",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h914FounderHealthDone=true;st.flags._h914OverworkedFounder=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-15);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+20);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-15,疲劳+20。创业路上，健康不能透支。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();