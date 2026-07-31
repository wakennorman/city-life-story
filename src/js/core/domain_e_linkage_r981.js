/**
 * 域E(经济/投资) 联动增强 R981 — E→B投资故事叙事 / E→C技能投资回报 / E→D投资者社交圈
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR981Loaded)return;RANDOM_EVENTS._domainELinkageR981Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. E→B: 投资故事 — 投资经历触发叙事
{id:"e981_invest_journey",phase:"street",icon:"📖",title:"投资修行",
story:"你回顾自己这些年的投资经历，就像读一本精彩的书。\n\n有高潮——抓到了一只翻倍股，兴奋得睡不着觉。有低谷——市场暴跌，账面亏损惨重，怀疑人生。\n\n但正是这些经历，让你从一个追涨杀跌的散户，变成了一个成熟的投资者。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e981JourneyDone)return false;if(!st.investment)return false;return st.player.day>=300&&(st.investment.stockHoldings||[]).length>=5},
probability:0.03,repeatable:false,
choices:[{text:"📖 记录投资成长",hint:"心智+28,会计XP+35,系统标记投资修行",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e981JourneyDone=true;st.flags._e981InvJourney=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+28);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+28,会计XP+35。投资是一场修行——你正在成为更好的自己。","success")}},
{text:"😅 不堪回首",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e981JourneyDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. E→C: 技能投资回报 — 投资知识带来收益
{id:"e981_invest_knowledge",phase:"street",icon:"📈",title:"知识就是财富",
story":"你发现那些花在学习投资上的时间，都变成了实实在在的回报。\n\n以前看不懂K线图，现在能分析趋势了。以前听消息买股票，现在有自己的判断体系了。\n\n知识不会辜负你——它只是需要时间发酵。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e981KnowledgeDone)return false;return st.player.day>=200&&(st.skills.accounting.level||0)>=25},
probability:0.04,repeatable:false,
choices:[{text:"📈 继续学习投资",hint:"智力+28,会计XP+38,系统标记知识投资",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e981KnowledgeDone=true;st.flags._e981KnowledgeInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",38);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+28,会计XP+38。知识是最好的投资——它永远不会贬值。","success")}},
{text:"😅 够用了",hint:"现金+10000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e981KnowledgeDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+10000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+10000。","info")}}]},
// 3. E→D: 投资者社交圈 — 投资带来社交圈变化
{id:"e981_invest_network",phase:"street",icon:"👥",title:"投资者的圈子",
story":"你参加了一个投资俱乐部，里面的人来自各行各业。\n\n有退休教师、程序员、小老板、甚至还有外卖骑手——但他们都有一个共同点:对投资充满热情。\n\n在这里，身份不重要，重要的是你的投资逻辑和独立思考能力。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e981NetworkDone)return false;return st.player.day>=150&&(st.resources.cash||0)>=30000},
probability:0.03,repeatable:false,
choices:[{text:"👥 加入投资俱乐部",hint:"魅力+22,社交XP+35,系统标记投资俱乐部",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e981NetworkDone=true;st.flags._e981InvClub=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+22);gx("social",35);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+22,社交XP+35。你加入了投资俱乐部——圈子对了，赚钱就对了。","success")}},
{text:"😅 独来独往",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e981NetworkDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();