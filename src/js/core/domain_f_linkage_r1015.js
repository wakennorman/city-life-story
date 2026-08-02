/**
 * 域F(UI/UX) 联动增强 R1015 — F→A价格周期洞察v23 / F→B人生故事墙v23 / F→E财富仪表盘v23 / F→G健康趋势追踪v23
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR1015Loaded)return;RANDOM_EVENTS._domainFLinkageR1015Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// F→A: 价格周期洞察 — 记录商品价格波动生成可视化报告
{id:"f1015_price_cycle_report",phase:"street",icon:"📊",title:"价格波动报告",story:"你打开手机上的记账APP，发现系统自动生成了本周的物价波动报告。蔬菜价格比上周涨了12%，但日用品价格基本持平。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f1015PriceReportDone)return false;return st.player&&st.player.day>=90&&st.trade&&st.trade._lastPrices},
probability:0.07,repeatable:false,
choices:[{text:"📊 仔细研究价格规律",hint:"智力+10,经商经验+30,置_f1015PriceAnalysis",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1015PriceReportDone=true;st.flags._f1015PriceAnalysis=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+10);gx("business",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+10,经商经验+30。你发现每周三菜价最低，周日最贵。","success")}},
{text:"📱 扫一眼就关掉了",hint:"智力+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1015PriceReportDone=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("📱 智力+3。你大概扫了一眼，心里有个数就行。","info")}}]},

// F→B: 人生故事墙 — 重大事件自动生成回忆卡片
{id:"f1015_life_story_wall",phase:"street",icon:"📖",title:"时光回廊",story:"你翻看手机相册，看到去年今天的照片。那时候你还在为生计发愁，现在已经稳定多了。系统提示你可以创建一个「人生故事墙」，记录这一路走来的点滴。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f1015StoryWallDone)return false;return st.player&&st.player.day>=365&&(st.flags&&st.flags._storyCount>=5)},
probability:0.05,repeatable:false,
choices:[{text:"📖 创建故事墙，记录成长",hint:"心智+15,社交XP+25,置_f1015StoryWallCreated",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1015StoryWallDone=true;st.flags._f1015StoryWallCreated=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+15);gx("social",25);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+15,社交XP+25。你创建了人生故事墙，每一段经历都是成长的印记。","success")}},
{text:"📱 继续往前走，不看过去",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1015StoryWallDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("📱 心智+5。你收起手机，目光坚定地看向前方。","info")}}]},

// F→E: 财富仪表盘 — 资产配置可视化
{id:"f1015_wealth_dashboard",phase:"street",icon:"💰",title:"财富仪表盘",story:"银行APP推出了新的资产洞察功能，可以直观地看到你的资产配置比例：现金、投资、房产各占多少，以及每月的收支趋势图。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f1015WealthDashDone)return false;return st.player&&st.player.day>=200&&st.resources&&((st.resources.cash||0)+(st.resources.bankBalance||0))>=50000},
probability:0.06,repeatable:false,
choices:[{text:"💰 优化资产配置",hint:"理财XP+40,智力+8,置_f1015AssetOptimized",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1015WealthDashDone=true;st.flags._f1015AssetOptimized=true;gx("finance",40);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 理财XP+40,智力+8。你调整了资产配置，让钱更有效率地生钱。","success")}},
{text:"👀 看看就好，不急着动",hint:"智力+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1015WealthDashDone=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("👀 智力+3。你对目前的资产状况有了更清晰的了解。","info")}}]},

// F→G: 健康趋势追踪 — 可视化健康变化趋势
{id:"f1015_health_trend",phase:"street",icon:"💚",title:"健康趋势报告",story:"你的健康手环生成了本周的健康报告。数据显示你最近一周的睡眠质量下降了15%，但步数比上周增加了20%。系统建议你调整作息。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f1015HealthTrendDone)return false;return st.player&&st.player.day>=150&&st.status&&st.status.health&&st.status.health<60},
probability:0.1,repeatable:false,
choices:[{text:"💚 认真调整作息",hint:"健康+20,疲劳-15,置_f1015HealthAdjusted",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1015HealthTrendDone=true;st.flags._f1015HealthAdjusted=true;if(!st.status)st.status={};st.status.health=Math.min(100,(st.status.health||50)+20);if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-15);if(typeof StateManager!=="undefined")StateManager.addMessage("💚 健康+20,疲劳-15。你开始早睡早起，身体感觉好多了。","success")}},
{text:"📱 再看看，不着急",hint:"健康+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1015HealthTrendDone=true;if(!st.status)st.status={};st.status.health=Math.min(100,(st.status.health||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("📱 健康+3。你看了眼报告，觉得问题不大，继续忙碌。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();