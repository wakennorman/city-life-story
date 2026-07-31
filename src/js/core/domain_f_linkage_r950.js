/**
// [全系统自洽修复] 域B R1016b 修复:IIFE缺少函数体闭合花括号x1
 * 域F(UI/UX) 联动增强 R950 — F→A数据可视化 / F→B事件记忆墙 / F→E财务仪表盘
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR950Loaded)return;RANDOM_EVENTS._domainFLinkageR950Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. F→A: 数据可视化 — 价格数据积累到一定程度，触发数据洞察
{id:"f950_price_insight",phase:"street",icon:"📊",title:"数字会说话",
story:"你打开价格记录，发现了一个明显的周期规律。\n\n「每月的第一周物价最低，第三周最高。周一生鲜最便宜，周末最贵。」\n\n你以前只是凭感觉买东西，现在有了数据，一切都变得清晰起来。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f950PriceInsightDone)return false;var _ph=st.flags._priceIndexHistory||[];return _ph.length>=25&&st.player.day>=120},
probability:0.04,repeatable:false,
choices:[{text:"📊 用数据优化购物计划",hint:"智力+25,会计XP+30,系统标记精打细算者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f950PriceInsightDone=true;st.flags._f950SmartShopper=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+25,会计XP+30。用数据优化购物——省钱就是赚钱。","success")}},
{text:"😅 太麻烦了",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f950PriceInsightDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. F→B: 事件记忆墙 — 回顾人生重要事件时，触发情感共鸣
{id:"f950_life_story_wall",phase:"street",icon:"📖",title:"你的人生故事书",
story:"你坐在窗前，回想自己在这座城市里经历的一切。\n\n从刚来时的迷茫不安，到现在的从容应对；从一个人孤军奋战，到有了可以依靠的朋友。\n\n如果把你的人生写成书，一定很精彩。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f950StoryWallDone)return false;var _eh=st.flags._eventHistory||[];return _eh.length>=30&&st.player.day>=250},
probability:0.03,repeatable:false,
choices:[{text:"📖 写下自己的故事",hint:"心智+30,魅力+20,系统标记人生作者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f950StoryWallDone=true;st.flags._f950LifeAuthor=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+30);st.player.charm=Math.min(100,(st.player.charm||20)+20)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+30,魅力+20。你的人生故事，值得被写下来。","success")}},
{text:"😔 故事还在继续",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f950StoryWallDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+5。","info")}}]},
// 3. F→E: 财务仪表盘 — 查看总资产时，触发财务自由思考
{id:"f950_wealth_summary",phase:"street",icon:"💎",title:"财富的真相",
story:"你整理了所有资产，第一次有了完整的财务视图。\n\n"+(function(){try{var _s=typeof StateManager!=="undefined"?StateManager.getState():null;if(_s&&_s.resources){var _c=_s.resources.cash||0,_b=_s.resources.bankBalance||0,_d=_s.resources.debt||0;return "现金: ¥"+Math.floor(_c).toLocaleString()+" | 存款: ¥"+Math.floor(_b).toLocaleString()+" | 负债: ¥"+Math.floor(_d).toLocaleString()+"\n净资产: ¥"+Math.floor(_c+_b-_d).toLocaleString()}return""}catch(e){return""}})()+"\n\n你第一次清楚地知道——自己到底值多少钱。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f950WealthSummaryDone)return false;if(!st.resources)return false;var _t=(st.resources.cash||0)+(st.resources.bankBalance||0)-(st.resources.debt||0);return _t>=1000000&&st.player.day>=400},
probability:0.04,repeatable:false,
choices:[{text:"💎 制定财富增长计划",hint:"智力+28,会计XP+38,系统标记百万富翁",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f950WealthSummaryDone=true;st.flags._f950MillionairePlan=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",38);if(typeof StateManager!=="undefined")StateManager.addMessage("💎 智力+28,会计XP+38。百万富翁只是开始——真正的财富是持续增长的能力。","success")}},
{text:"😅 继续努力",hint:"现金+10000,系统标记攒钱中",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f950WealthSummaryDone=true;st.flags._f950Saver2=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+10000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+10000。继续努力——财富自由需要时间。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();