/**
 * 域H(Phase2/公司) 联动增强 R894 — H→A企业数据资产v17 / H→B公司传奇叙事v17 / H→G创始人健康v17
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR894Loaded)return;RANDOM_EVENTS._domainHLinkageR894Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"h894_corporate_data_v17",phase:"corporate",icon:"📊",title:"公司数据，是决策的基石",story:"你翻开公司的季度报表。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h894CorpDataDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return(st.startup.company.valuation||0)>=1000000000&&st.player.day>=1000},
probability:0.07,repeatable:false,
choices:[{text:"📊 建立数据驱动的决策体系",hint:"智力+42,管理XP+52,置_h894DataDriven",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h894CorpDataDone=true;st.flags._h894DataDriven=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+42);gx("management",52);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+42,管理XP+52。","success")}},
{text:"💼 凭直觉就够了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h894CorpDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 心智+5。","info")}}]},
{id:"h894_corporate_legend_v17",phase:"corporate",icon:"🏆",title:"公司传奇，城市为你侧目",story:"消息传开了——你的公司成了行业标杆。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h894LegendDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return Array.isArray(st.startup.company.fundingRounds)&&st.startup.company.fundingRounds.length>=8},
probability:0.1,repeatable:false,
choices:[{text:"🏆 谦虚回应，继续前行",hint:"名气+42,心智+40,置_h894CityLegend",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h894LegendDone=true;st.flags._h894CityLegend=true;if(st.player){st.player.fame=Math.min(100,(st.player.fame||0)+42);st.player.mental=Math.min(100,(st.player.mental||50)+40)}if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 名气+42,心智+40。","success")}},
{text:"😊 只是开始，路还长",hint:"心智+42",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h894LegendDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+42);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+42。","success")}}]},
{id:"h894_founder_health_v17",phase:"corporate",icon:"💪",title:"创始人健康，是公司最大的资产",story:"你连续高强度工作了一个月。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h894FounderHealthDone)return false;if(st.player.phase!=="corporate")return false;return(st.status?st.status.health:100)<1&&st.player.day>=600},
probability:0.12,repeatable:false,
choices:[{text:"💪 调整节奏，健康第一",hint:"健康+100,KPI-1,置_h894HealthFirst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h894FounderHealthDone=true;st.flags._h894HealthFirst=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+100);if(st.player&&st.player.corporate)st.player.corporate.kpi=Math.max(0,(st.player.corporate.kpi||0)-1);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 健康+100,KPI-1。","success")}},
{text:"🔥 再拼一把",hint:"健康-80,KPI+70,置_h894BurnoutRisk",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h894FounderHealthDone=true;st.flags._h894BurnoutRisk=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-80);if(st.player&&st.player.corporate)st.player.corporate.kpi=Math.min(150,(st.player.corporate.kpi||0)+70);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-80,KPI+70。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
