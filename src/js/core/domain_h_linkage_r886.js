/**
 * 域H(Phase2/公司) 联动增强 R886 — H→A企业数据资产v16 / H→B公司传奇叙事v16 / H→G创始人健康v16
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR886Loaded)return;RANDOM_EVENTS._domainHLinkageR886Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"h886_corporate_data_v16",phase:"corporate",icon:"📊",title:"公司数据，是决策的基石",story:"你翻开公司的季度报表。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h886CorpDataDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return(st.startup.company.valuation||0)>=800000000&&st.player.day>=900},
probability:0.07,repeatable:false,
choices:[{text:"📊 建立数据驱动的决策体系",hint:"智力+40,管理XP+50,置_h886DataDriven",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h886CorpDataDone=true;st.flags._h886DataDriven=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+40);gx("management",50);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+40,管理XP+50。","success")}},
{text:"💼 凭直觉就够了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h886CorpDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 心智+5。","info")}}]},
{id:"h886_corporate_legend_v16",phase:"corporate",icon:"🏆",title:"公司传奇，城市为你侧目",story:"消息传开了——你的公司成了行业标杆。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h886LegendDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return Array.isArray(st.startup.company.fundingRounds)&&st.startup.company.fundingRounds.length>=8},
probability:0.1,repeatable:false,
choices:[{text:"🏆 谦虚回应，继续前行",hint:"名气+40,心智+38,置_h886CityLegend",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h886LegendDone=true;st.flags._h886CityLegend=true;if(st.player){st.player.fame=Math.min(100,(st.player.fame||0)+40);st.player.mental=Math.min(100,(st.player.mental||50)+38)}if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 名气+40,心智+38。","success")}},
{text:"😊 只是开始，路还长",hint:"心智+40",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h886LegendDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+40);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+40。","success")}}]},
{id:"h886_founder_health_v16",phase:"corporate",icon:"💪",title:"创始人健康，是公司最大的资产",story:"你连续高强度工作了一个月。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h886FounderHealthDone)return false;if(st.player.phase!=="corporate")return false;return(st.status?st.status.health:100)<2&&st.player.day>=500},
probability:0.12,repeatable:false,
choices:[{text:"💪 调整节奏，健康第一",hint:"健康+80,KPI-1,置_h886HealthFirst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h886FounderHealthDone=true;st.flags._h886HealthFirst=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+80);if(st.player&&st.player.corporate)st.player.corporate.kpi=Math.max(0,(st.player.corporate.kpi||0)-1);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 健康+80,KPI-1。","success")}},
{text:"🔥 再拼一把",hint:"健康-60,KPI+60,置_h886BurnoutRisk",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h886FounderHealthDone=true;st.flags._h886BurnoutRisk=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-60);if(st.player&&st.player.corporate)st.player.corporate.kpi=Math.min(150,(st.player.corporate.kpi||0)+60);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-60,KPI+60。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
