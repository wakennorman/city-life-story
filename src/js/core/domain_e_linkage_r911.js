/**
 * 域E(经济/投资) 联动增强 R911 — E→A投资数据沉淀v19 / E→B投资故事叙事v19 / E→G财富健康v19
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR911Loaded)return;RANDOM_EVENTS._domainELinkageR911Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"e911_invest_data_v19",phase:"street",icon:"📈",title:"投资数据沉淀",story:"你打开自己的投资记录，发现过去一年的交易数据已经累积成了一座金矿。\n\n「每一笔交易都是一次实验，每一次盈亏都是一次学习。」\n\n这些数据背后，藏着你的投资模式和常见的错误。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e911InvestDataDone)return false;if(!st.investment)return false;var _th=st.investment.tradeHistory||[];var _ph=st.investment.portfolioHistory||[];return _th.length>=30&&_ph.length>=12&&st.player.day>=500},
probability:0.06,repeatable:false,
choices:[{text:"📊 深度分析投资数据",hint:"智力+28,会计XP+40,系统标记数据驱动型投资者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e911InvestDataDone=true;st.flags._e911DataDrivenInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",40);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+28,会计XP+40。数据驱动投资思维建立！","success")}},
{text:"😅 看看就好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e911InvestDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"e911_invest_story_v19",phase:"street",icon:"📖",title:"投资故事",story:"你在投资社区分享了自己的投资经历，没想到引起了热烈讨论。\n\n「你的经历太真实了，和我当年一模一样！」\n\n有人从你的错误中吸取了教训，有人从你的成功中获得了启发。你发现，分享故事本身就是一种财富。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e911InvestStoryDone)return false;if(!st.investment)return false;var _th=st.investment.tradeHistory||[];var _to=0;for(var _ei=0;_ei<_th.length;_ei++){if(_th[_ei]&&_th[_ei].profit)_to+=_th[_ei].profit}return Math.abs(_to)>=50000&&st.player.day>=600},
probability:0.06,repeatable:false,
choices:[{text:"📖 认真分享投资故事",hint:"心智+20,社交XP+30,系统标记投资叙事者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e911InvestStoryDone=true;st.flags._e911StoryTeller=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+20);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+20,社交XP+30。你的故事启发了更多人！","success")}},
{text:"😅 低调点好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e911InvestStoryDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"e911_wealth_health_v19",phase:"street",icon:"💰",title:"财富与健康",story:"你看着银行账户里的数字，又看了看最近的体检报告。\n\n「财富是数字，健康是分母。」——一个老投资者的忠告在耳边回响。\n\n钱再多，如果身体垮了，一切都是零。也许是时候重新审视财富和健康的天平了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e911WealthHealthDone)return false;if(!st.resources||!st.status)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0)>=200000)&&(st.status.health||100)<=50&&st.player.day>=700},
probability:0.07,repeatable:false,
choices:[{text:"💰 调整生活节奏，投资健康",hint:"健康+35,心情+25,疲劳-20,系统标记健康财富平衡",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e911WealthHealthDone=true;st.flags._e911HealthWealthBalance=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+35);if(st.needs){st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25);st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-20)}if(typeof StateManager!=="undefined")StateManager.addMessage("💰 健康+35,心情+25,疲劳-20。健康才是最大的财富！","success")}},
{text:"🔥 先赚钱，健康以后再说",hint:"疲劳+20,健康-10,现金+5000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e911WealthHealthDone=true;st.flags._e911WorkOverHealth=true;if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+20);if(st.status)st.status.health=Math.max(0,(st.status.health||50)-10);if(st.resources)st.resources.cash=(st.resources.cash||0)+5000;if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 现金+5000,但疲劳+20,健康-10。透支健康换来的财富值得吗？","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();