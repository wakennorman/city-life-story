/**
 * 域E(经济/投资) 联动增强 R1005 — E→B投资故事 / E→C技能投资 / E→D投资者社交
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR1005Loaded)return;RANDOM_EVENTS._domainELinkageR1005Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. E→B: 投资故事 — 投资经历触发叙事
{id:"e1005_invest_growth",phase:"street",icon:"📖",title:"投资者的成长",
story:"你回顾自己的投资历程，发现了一个变化。\n\n以前你关注的是「哪只股票会涨」，现在你关注的是「我的投资策略是否合理」。\n\n从关注结果到关注过程，从关注短期到关注长期——这就是投资者的成长。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1005GrowthDone)return false;if(!st.investment)return false;return st.player.day>=200&&(st.investment.stockHoldings||[]).length>=2},
probability:0.03,repeatable:false,
choices:[{text:"📖 记录投资成长",hint:"心智+25,会计XP+30,系统标记投资成长",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1005GrowthDone=true;st.flags._e1005InvGrowth=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+25,会计XP+30。从关注结果到关注过程——这是投资者的成长。","success")}},
{text:"😅 还在路上",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1005GrowthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. E→C: 技能投资 — 投资知识带来收益
{id:"e1005_invest_knowledge",phase:"street",icon:"📈",title:"知识的价值",
story:"你发现那些花在学习投资上的时间，都变成了实实在在的回报。\n\n以前看不懂的财务指标，现在能分析了。以前听不懂的经济术语，现在能理解了。\n\n知识不会贬值——它只会随着时间的推移，变得越来越值钱。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1005KnowledgeDone)return false;return st.player.day>=150&&(st.skills.accounting.level||0)>=15},
probability:0.04,repeatable:false,
choices:[{text:"📈 继续学习投资",hint:"智力+25,会计XP+32,系统标记知识价值",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1005KnowledgeDone=true;st.flags._e1005KnowledgeValue=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",32);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+32。知识是唯一不会贬值的资产——继续投资自己。","success")}},
{text:"😅 够用了",hint:"现金+8000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1005KnowledgeDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+8000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+8000。","info")}}]},
// 3. E→D: 投资者社交 — 投资带来社交圈变化
{id:"e1005_invest_peer",phase:"street",icon:"👥",title:"投资者的同行者",
story:"你发现投资路上，最重要的是同行者。\n\n一个人研究容易钻牛角尖，一个人决策容易受情绪影响。\n\n有一群志同道合的朋友，可以在你迷茫时给你建议，在你冲动时拉你一把。投资路上，同行者比指路者更重要。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1005PeerDone)return false;return st.player.day>=120&&(st.resources.cash||0)>=15000},
probability:0.03,repeatable:false,
choices:[{text:"👥 寻找投资同行者",hint:"魅力+20,社交XP+30,系统标记投资同行",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1005PeerDone=true;st.flags._e1005InvPeer=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+20);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+20,社交XP+30。投资路上，同行者比指路者更重要。","success")}},
{text:"😅 独来独往",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1005PeerDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();