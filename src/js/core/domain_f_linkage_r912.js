/**
 * 域F(UI/UX) 联动增强 R912 — F→A数据可视化v21 / F→B事件记忆墙v21 / F→E财务仪表盘v21
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR912Loaded)return;RANDOM_EVENTS._domainFLinkageR912Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f912_data_viz_v21",phase:"street",icon:"📊",title:"数据的可视化力量",story:"你尝试用图表整理自己的游戏数据，发现了一些有趣的规律。\n\n「你的收入曲线在第三个月有一个明显的跃升，对应的是你从街头摆摊转到固定工作的时间点。」\n\n可视化让隐形的信息变得一目了然。你开始理解为什么数据驱动决策如此重要。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f912DataVizDone)return false;var _dh=st.dailyHistory||[];return _dh.length>=60&&st.player.day>=300},
probability:0.06,repeatable:false,
choices:[{text:"📊 深入学习数据可视化",hint:"智力+22,会计XP+30,系统标记数据可视化意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f912DataVizDone=true;st.flags._f912DataVizAwareness=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+22,会计XP+30。数据可视化思维建立！","success")}},
{text:"😅 太复杂了，看不懂",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f912DataVizDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// [全系统自洽修复] 域B R1016b 修复:story": 键名残缺引号→整文件SyntaxError,IIFE永不执行且阻断全站build
{id:"f912_memory_wall_v21",phase:"street",icon:"🖼️",title:"记忆墙上的故事",story:"你翻看自己记录的日记，那些曾经经历的画面浮现在眼前。\n\n「第一天来到这座城市，口袋里只有200块。现在，你有了朋友、工作和属于自己的一席之地。」\n\n每一段经历都是你人生故事的一页。有些让你笑，有些让你哭，但都是你。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f912MemoryWallDone)return false;var _eh=st.eventHistory||[];return _eh.length>=30&&st.player.day>=400},
probability:0.06,repeatable:false,
choices:[{text:"🖼️ 整理记忆墙",hint:"心智+20,心情+25,系统标记记忆整理者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f912MemoryWallDone=true;st.flags._f912MemoryCurator=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+20);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25);if(typeof StateManager!=="undefined")StateManager.addMessage("🖼️ 心智+20,心情+25。回忆也是一种力量！","success")}},
{text:"😅 往事不堪回首",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f912MemoryWallDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"f912_finance_dash_v21",phase:"street",icon:"💰",title:"财务仪表盘",story:"你打开自己的财务仪表盘，资产、负债、收入、支出一目了然。\n\n「理财的第一步不是赚更多，而是清楚地知道自己每一分钱去了哪里。」\n\n看着那些数据，你对未来有了更清晰的规划。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f912FinanceDashDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0)>=50000)&&st.player.day>=350},
probability:0.06,repeatable:false,
choices:[{text:"💰 仔细分析财务状况",hint:"智力+20,会计XP+35,系统标记财务可视化意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f912FinanceDashDone=true;st.flags._f912FinanceDashboard=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 智力+20,会计XP+35。财务可视化意识建立！","success")}},
{text:"😅 数字看着头疼",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f912FinanceDashDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();