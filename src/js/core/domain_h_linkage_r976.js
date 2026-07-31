(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR976Loaded)return;RANDOM_EVENTS._domainHLinkageR976Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"h976_corp_data_v1",phase:"corporate",icon:"📊",title:"企业数据资产",
story:"你翻开公司的运营报表，客户数据、成本结构、市场趋势——这些数字背后藏着企业的命脉。",
triggers:{minDay:80,interval:100,maxRepeats:4,excludeFlags:["_h976CorpDataCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h976CorpDataCd)return false;if(!st.corporate||!st.corporate.active)return false;return st.player.day>=80;},
probability:0.04,repeatable:true,
choices:[
{text:"📊 分析企业数据",hint:"管理XP+8,智力+4,置_h976DataDriven",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h976CorpDataCd=true;st.flags._h976DataDriven=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+4);gx("management",8);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 分析了企业数据——管理XP+8,智力+4。","success");}},
{text:"😅 凭直觉经营",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h976CorpDataCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 凭直觉经营。心智+3。","info");}}
]},
{id:"h976_corp_legend_v1",phase:"corporate",icon:"📖",title:"公司传奇叙事",
story:"你的公司在市场上已经有了自己的故事。从创立到现在的稳步发展，每一步都值得铭记。",
triggers:{minDay:110,interval:130,maxRepeats:3,excludeFlags:["_h976CorpLegendCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h976CorpLegendCd)return false;if(!st.corporate||!st.corporate.active)return false;return st.player.day>=110;},
probability:0.04,repeatable:true,
choices:[
{text:"📖 记录公司发展史",hint:"心智+8,魅力+3,置_h976Legend",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h976CorpLegendCd=true;st.flags._h976Legend=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+8);st.player.charm=Math.min(100,(st.player.charm||50)+3)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 记录了公司发展史——心智+8,魅力+3。","success");}},
{text:"😅 专注当下",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h976CorpLegendCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 专注当下。心智+3。","info");}}
]},
{id:"h976_founder_health_v1",phase:"corporate",icon:"🏥",title:"创始人健康管理",
story:"作为公司创始人，你的健康直接关系到公司的未来。身体是革命的本钱。",
triggers:{minDay:50,interval:90,maxRepeats:5,excludeFlags:["_h976FounderHealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h976FounderHealthCd)return false;if(!st.corporate||!st.corporate.active)return false;return st.player.day>=50;},
probability:0.04,repeatable:true,
choices:[
{text:"🏥 关注健康管理",hint:"健康+4,疲劳-8,置_h976HealthWise",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h976FounderHealthCd=true;st.flags._h976HealthWise=true;if(st.player)st.player.health=Math.min(100,(st.player.health||50)+4);if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-8);if(typeof StateManager!=="undefined")StateManager.addMessage("🏥 关注了健康管理——健康+4,疲劳-8。","success");}},
{text:"💪 再拼一拼",hint:"心智+4",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h976FounderHealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+4);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 再拼一拼。心智+4。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
