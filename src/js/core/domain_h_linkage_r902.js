/**
 * 域H(Phase2/公司) 联动增强 R902 — H→A企业数据资产v18 / H→B公司传奇叙事v18 / H→G创始人健康v18
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR902Loaded)return;RANDOM_EVENTS._domainHLinkageR902Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"h902_corporate_data_v18",phase:"corporate",icon:"📊",title:"公司数据，是决策的基石",story:"你翻开公司的季度报表。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h902CorpDataDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return(st.startup.company.valuation||0)>=2000000000&&st.player.day>=1100},
probability:0.07,repeatable:false,
choices:[{text:"📊 建立数据驱动的决策体系",hint:"智力+45,管理XP+55,置_h902DataDriven",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h902CorpDataDone=true;st.flags._h902DataDriven=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+45);gx("management",55);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+45,管理XP+55。","success")}},
{text:"💼 凭直觉就够了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h902CorpDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 心智+5。","info")}}]},
{id:"h902_corporate_legend_v18",phase:"corporate",icon:"🏆",title:"公司传奇，城市为你侧目",story:"消息传开了——你的公司成了行业标杆。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h902LegendDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return Array.isArray(st.startup.company.fundingRounds)&&st.startup.company.fundingRounds.length>=9},
probability:0.1,repeatable:false,
choices:[{text:"🏆 谦虚回应，继续前行",hint:"名气+45,心智+42,置_h902CityLegend",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h902LegendDone=true;st.flags._h902CityLegend=true;if(st.player){st.player.fame=Math.min(100,(st.player.fame||0)+45);st.player.mental=Math.min(100,(st.player.mental||50)+42)}if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 名气+45,心智+42。","success")}},
{text:"😊 只是开始，路还长",hint:"心智+45",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h902LegendDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+45);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+45。","success")}}]},
{id:"h902_founder_health_v18",phase:"corporate",icon:"💪",title:"创始人健康，是公司最大的资产",story:"你连续高强度工作了一个月。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h902FounderHealthDone)return false;if(st.player.phase!=="corporate")return false;return(st.status?st.status.health:100)<1&&st.player.day>=700},
probability:0.12,repeatable:false,
choices:[{text:"💪 调整节奏，健康第一",hint:"健康+120,KPI-1,置_h902HealthFirst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h902FounderHealthDone=true;st.flags._h902HealthFirst=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+120);if(st.player&&st.player.corporate)st.player.corporate.kpi=Math.max(0,(st.player.corporate.kpi||0)-1);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 健康+120,KPI-1。","success")}},
{text:"🔥 再拼一把",hint:"健康-100,KPI+80,置_h902BurnoutRisk",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h902FounderHealthDone=true;st.flags._h902BurnoutRisk=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-100);if(st.player&&st.player.corporate)st.player.corporate.kpi=Math.min(150,(st.player.corporate.kpi||0)+80);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-100,KPI+80。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
