/**
 * 域E(经济/投资) 联动增强 R927 — E→A投资数据沉淀v20 / E→B投资故事叙事v20 / E→G财富健康v20
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR927Loaded)return;RANDOM_EVENTS._domainELinkageR927Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"e927_invest_data_v20",phase:"street",icon:"📈",title:"投资数据的智慧",story:"你回顾自己的投资记录，发现了一个规律。\n\n「冲动交易的平均回报率只有3%，而经过分析的投资回报率达到15%。」\n\n数据告诉你一个残酷的事实：你的直觉没有你想象中那么准。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e927InvestDataDone)return false;if(!st.investment)return false;var _th=st.investment.tradeHistory||[];var _ph=st.investment.portfolioHistory||[];return _th.length>=35&&_ph.length>=15&&st.player.day>=550},
probability:0.06,repeatable:false,
choices:[{text:"📊 建立投资决策系统",hint:"智力+30,会计XP+45,系统标记投资决策系统",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e927InvestDataDone=true;st.flags._e927InvestDecisionSystem=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+30);gx("accounting",45);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+30,会计XP+45。投资决策系统建立！","success")}},
{text:"😅 相信直觉",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e927InvestDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"e927_invest_story_v20",phase:"street",icon:"📖",title:"投资故事的力量",story:"你在社交媒体上分享了自己的投资经历，意外地收到了很多人的私信。\n\n「你的经历让我少亏了20万。」\n\n你发现，分享真实的投资故事，比任何投资建议都更有价值。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e927InvestStoryDone)return false;if(!st.investment)return false;var _th=st.investment.tradeHistory||[];var _to=0;for(var _ei=0;_ei<_th.length;_ei++){if(_th[_ei]&&_th[_ei].profit)_to+=_th[_ei].profit}return Math.abs(_to)>=80000&&st.player.day>=650},
probability:0.06,repeatable:false,
choices:[{text:"📖 持续分享投资心得",hint:"心智+22,社交XP+35,系统标记投资分享者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e927InvestStoryDone=true;st.flags._e927InvestSharer=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+22);gx("social",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+22,社交XP+35。分享让投资更有意义！","success")}},
{text:"😅 低调点好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e927InvestStoryDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"e927_wealth_health_v20",phase:"street",icon:"💰",title:"财富自由的定义",story:"你终于达到了自己设定的财务目标。\n\n但奇怪的是，你并没有想象中那么快乐。\n\n「财富自由不是拥有花不完的钱，而是拥有选择的权利。」\n\n你开始思考:有了钱之后，真正想要的是什么？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e927WealthHealthDone)return false;if(!st.resources||!st.status)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0)>=300000)&&(st.status.health||100)<=45&&st.player.day>=750},
probability:0.07,repeatable:false,
choices:[{text:"💰 重新定义人生目标",hint:"健康+38,心情+28,疲劳-25,系统标记人生目标重新定义",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e927WealthHealthDone=true;st.flags._e927LifeGoalRedefine=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+38);if(st.needs){st.needs.happiness=Math.min(100,(st.needs.happiness||50)+28);st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-25)}if(typeof StateManager!=="undefined")StateManager.addMessage("💰 健康+38,心情+28,疲劳-25。人生新篇章开启！","success")}},
{text:"🔥 继续赚钱，永不停歇",hint:"疲劳+25,健康-12,现金+8000,系统标记永不满足",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e927WealthHealthDone=true;st.flags._e927NeverSatisfied=true;if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+25);if(st.status)st.status.health=Math.max(0,(st.status.health||50)-12);if(st.resources)st.resources.cash=(st.resources.cash||0)+8000;if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 现金+8000,但疲劳+25,健康-12。钱不是一切。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();