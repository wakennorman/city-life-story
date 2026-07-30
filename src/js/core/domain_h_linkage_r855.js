/**
 * 域H(Phase2/公司) 联动增强 R855 — H→A企业数据资产v12 / H→B公司传奇叙事v12 / H→G创始人健康v12
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR855Loaded)return;RANDOM_EVENTS._domainHLinkageR855Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"h855_corporate_data_v12",phase:"corporate",icon:"📊",title:"公司数据，是决策的基石",story:"你翻开公司的季度报表——营收增长、成本控制、团队效率、客户留存……",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h855CorpDataDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return(st.startup.company.valuation||0)>=150000000&&st.player.day>=600},
probability:0.07,repeatable:false,
choices:[{text:"📊 建立数据驱动的决策体系",hint:"智力+30,管理XP+40,置_h855DataDriven",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h855CorpDataDone=true;st.flags._h855DataDriven=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+30);gx("management",40);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 数据驱动的决策体系建立——智力+30,管理XP+40。","success")}},
{text:"💼 凭直觉就够了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h855CorpDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 凭直觉就够了。心智+5。","info")}}]},
{id:"h855_corporate_legend_v12",phase:"corporate",icon:"🏆",title:"公司传奇，城市为你侧目",story:"消息传开了——你的公司成了行业标杆。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h855LegendDone)return false;if(st.player.phase!=="corporate"||!st.startup||!st.startup.company)return false;return Array.isArray(st.startup.company.fundingRounds)&&st.startup.company.fundingRounds.length>=6},
probability:0.1,repeatable:false,
choices:[{text:"🏆 谦虚回应，继续前行",hint:"名气+30,心智+28,置_h855CityLegend",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h855LegendDone=true;st.flags._h855CityLegend=true;if(st.player){st.player.fame=Math.min(100,(st.player.fame||0)+30);st.player.mental=Math.min(100,(st.player.mental||50)+28)}if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 你的公司成了这座城市的创业传奇——名气+30,心智+28。","success")}},
{text:"😊 只是开始，路还长",hint:"心智+30",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h855LegendDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+30);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 你告诉自己：这只是开始。心智+30。","success")}}]},
{id:"h855_founder_health_v12",phase:"corporate",icon:"💪",title:"创始人健康，是公司最大的资产",story:"你连续高强度工作了一个月。身体的警告信号越来越明显。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h855FounderHealthDone)return false;if(st.player.phase!=="corporate")return false;return(st.status?st.status.health:100)<10&&st.player.day>=250},
probability:0.12,repeatable:false,
choices:[{text:"💪 调整节奏，健康第一",hint:"健康+50,KPI-5,置_h855HealthFirst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h855FounderHealthDone=true;st.flags._h855HealthFirst=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+50);if(st.player&&st.player.corporate)st.player.corporate.kpi=Math.max(0,(st.player.corporate.kpi||0)-5);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 你调整了生活节奏——健康+50,KPI-5。身体是创业的本钱。","success")}},
{text:"🔥 再拼一把",hint:"健康-30,KPI+40,置_h855BurnoutRisk",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h855FounderHealthDone=true;st.flags._h855BurnoutRisk=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-30);if(st.player&&st.player.corporate)st.player.corporate.kpi=Math.min(150,(st.player.corporate.kpi||0)+40);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 你选择再拼一把——健康-30,KPI+40。注意身体！","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();