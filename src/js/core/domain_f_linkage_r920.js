/**
 * 域F(UI/UX) 联动增强 R920 — F→A数据可视化v22 / F→B事件记忆墙v22 / F→E财务仪表盘v22
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR920Loaded)return;RANDOM_EVENTS._domainFLinkageR920Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"f920_data_viz_v22",phase:"street",icon:"📊",title:"数据中的生活智慧",story:"你花了一个下午整理自己的游戏数据，发现了许多有趣的规律。\n\n「你的工作效率在上午最高，下午明显下降。周末的心情指数比工作日高30%。」\n\n数据告诉你：你比自己想象的更了解自己，也比自己想象的更不了解自己。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f920DataVizDone)return false;var _dh=st.dailyHistory||[];return _dh.length>=90&&st.player.day>=400},
probability:0.06,repeatable:false,
choices:[{text:"📊 用数据优化生活节奏",hint:"智力+25,心智+20,系统标记数据化生活",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f920DataVizDone=true;st.flags._f920DataLife=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);st.player.mental=Math.min(100,(st.player.mental||50)+20)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+25,心智+20。数据化生活意识建立！","success")}},
{text:"😅 随心所欲更好",hint:"心情+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f920DataVizDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+8。","info")}}]},
{id:"f920_memory_wall_v22",phase:"street",icon:"🖼️",title:"人生照片墙",story:"你翻看手机相册，那些被遗忘的记忆扑面而来。\n\n「第一份工作的工牌、第一次加薪的截图、和朋友们聚餐的合影……」\n\n每一张照片都是一个故事。你突然意识到，这些平凡的瞬间，才是生活的真谛。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f920MemoryWallDone)return false;var _eh=st.eventHistory||[];return _eh.length>=40&&st.player.day>=500},
probability:0.06,repeatable:false,
choices:[{text:"🖼️ 制作人生回忆相册",hint:"心智+22,心情+30,系统标记记忆珍藏者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f920MemoryWallDone=true;st.flags._f920MemoryKeeper=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+22);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+30);if(typeof StateManager!=="undefined")StateManager.addMessage("🖼️ 心智+22,心情+30。记忆是最珍贵的财富！","success")}},
{text:"😅 过去就让它过去",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f920MemoryWallDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"f920_finance_dash_v22",phase:"street",icon:"💰",title:"财务仪表盘洞察",story:"你的财务仪表盘上显示了一个令人震惊的数字。\n\n「你的被动收入已经覆盖了日常开支的60%。距离财务自由还有最后一段距离。」\n\n可视化让抽象的财务目标变得具体而清晰。你比任何时候都更清楚自己的财务状况。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f920FinanceDashDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0)>=100000)&&st.player.day>=450},
probability:0.06,repeatable:false,
choices:[{text:"💰 优化财务目标",hint:"智力+22,会计XP+40,系统标记财务可视化",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f920FinanceDashDone=true;st.flags._f920FinanceVisualizer=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("accounting",40);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 智力+22,会计XP+40。财务可视化能力提升！","success")}},
{text:"😅 数字看着头疼",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f920FinanceDashDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();