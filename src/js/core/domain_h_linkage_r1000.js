(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR1000Loaded)return;RANDOM_EVENTS._domainHLinkageR1000Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"h1000_corp_data_v1",phase:"corporate",icon:"📊",title:"企业数据资产",
story:"你翻开公司的运营报表，客户数据、成本结构、市场趋势——这些数字背后藏着企业的命脉。",
triggers:{minDay:55,interval:70,maxRepeats:4,excludeFlags:["_h1000CorpDataCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1000CorpDataCd)return false;if(!st.corporate||!st.corporate.active)return false;return st.player.day>=55;},
probability:0.04,repeatable:true,
choices:[
{text:"📊 分析企业数据",hint:"管理XP+4,智力+2,置_h1000DataDriven",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1000CorpDataCd=true;st.flags._h1000DataDriven=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+2);gx("management",4);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 分析了企业数据——管理XP+4,智力+2。","success");}},
{text:"😅 凭直觉经营",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1000CorpDataCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 凭直觉经营。心智+3。","info");}}
]},
{id:"h1000_corp_legend_v1",phase:"corporate",icon:"📖",title:"公司传奇叙事",
story:"你的公司在市场上已经有了自己的故事。从创立到现在的稳步发展，每一步都值得铭记。",
triggers:{minDay:80,interval:100,maxRepeats:3,excludeFlags:["_h1000CorpLegendCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1000CorpLegendCd)return false;if(!st.corporate||!st.corporate.active)return false;return st.player.day>=80;},
probability:0.04,repeatable:true,
choices:[
{text:"📖 记录公司发展史",hint:"心智+4,魅力+2,置_h1000Legend",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1000CorpLegendCd=true;st.flags._h1000Legend=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+4);st.player.charm=Math.min(100,(st.player.charm||50)+2)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 记录了公司发展史——心智+4,魅力+2。","success");}},
{text:"😅 专注当下",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1000CorpLegendCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 专注当下。心智+3。","info");}}
]},
{id:"h1000_founder_health_v1",phase:"corporate",icon:"🏥",title:"创始人健康管理",
story:"作为公司创始人，你的健康直接关系到公司的未来。身体是革命的本钱。",
triggers:{minDay:35,interval:60,maxRepeats:5,excludeFlags:["_h1000FounderHealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h1000FounderHealthCd)return false;if(!st.corporate||!st.corporate.active)return false;return st.player.day>=35;},
probability:0.04,repeatable:true,
choices:[
{text:"🏥 关注健康管理",hint:"健康+2,疲劳-4,置_h1000HealthWise",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1000FounderHealthCd=true;st.flags._h1000HealthWise=true;if(st.player)st.player.health=Math.min(100,(st.player.health||50)+2);if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-4);if(typeof StateManager!=="undefined")StateManager.addMessage("🏥 关注了健康管理——健康+2,疲劳-4。","success");}},
{text:"💪 再拼一拼",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h1000FounderHealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 再拼一拼。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
