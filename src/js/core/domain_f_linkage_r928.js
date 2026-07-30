/**
 * 域F(UI/UX) 联动增强 R928 — F→A数据可视化v23 / F→B事件记忆墙v23 / F→E财务仪表盘v23
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR928Loaded)return;RANDOM_EVENTS._domainFLinkageR928Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f928_data_viz_v23",phase:"street",icon:"📊",title:"数据可视化洞察",story:"你尝试用不同的方式展示自己的数据，发现了一些隐藏的模式。\n\n「你的消费数据呈现明显的周期性波动——每周末支出增加40%，每月初支出减少30%。」\n\n可视化不只是让数据好看，而是让数据说话。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f928DataVizDone)return false;var _dh=st.dailyHistory||[];return _dh.length>=100&&st.player.day>=450},
probability:0.06,repeatable:false,
choices:[{text:"📊 用可视化优化消费习惯",hint:"智力+26,心智+22,系统标记数据可视化优化",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f928DataVizDone=true;st.flags._f928DataVizOptimizer=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+26);st.player.mental=Math.min(100,(st.player.mental||50)+22)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+26,心智+22。数据可视化优化能力提升！","success")}},
{text:"😅 随心所欲更好",hint:"心情+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f928DataVizDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+8。","info")}}]},
{id:"f928_memory_wall_v23",phase:"street",icon:"🖼️",title:"记忆墙上的故事",story:"你意外翻到了一张老照片，那些尘封的记忆瞬间涌上心头。\n\n「照片里的人，有些还在联系，有些已经消失在茫茫人海。」\n\n每一张照片都是一段往事，每一段往事都塑造了今天的你。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f928MemoryWallDone)return false;var _eh=st.eventHistory||[];return _eh.length>=50&&st.player.day>=550},
probability:0.06,repeatable:false,
choices:[{text:"🖼️ 整理人生回忆",hint:"心智+24,心情+32,系统标记人生回忆整理",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f928MemoryWallDone=true;st.flags._f928MemoryOrganizer=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+24);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+32);if(typeof StateManager!=="undefined")StateManager.addMessage("🖼️ 心智+24,心情+32。回忆是最好的礼物！","success")}},
{text:"😅 往事如烟",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f928MemoryWallDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"f928_finance_dash_v23",phase:"street",icon:"💰",title:"财务仪表盘",story:"你打开财务仪表盘，发现了一个令人振奋的消息。\n\n「你的被动收入已经可以覆盖日常开支的80%。距离完全财务自由只有一步之遥。」\n\n看着那条稳步上升的曲线，你意识到——这些年所有的努力，都在这里得到了回报。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f928FinanceDashDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0)>=150000)&&st.player.day>=500},
probability:0.06,repeatable:false,
choices:[{text:"💰 制定财务自由时间表",hint:"智力+24,会计XP+42,系统标记财务自由规划",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f928FinanceDashDone=true;st.flags._f928FreedomPlanner=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+24);gx("accounting",42);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 智力+24,会计XP+42。财务自由规划启动！","success")}},
{text:"😅 数字看着头疼",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f928FinanceDashDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();