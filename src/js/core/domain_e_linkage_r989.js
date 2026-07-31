/**
 * 域E(经济/投资) 联动增强 R989 — E→B投资故事叙事 / E→C技能投资回报 / E→D投资者社交圈
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR989Loaded)return;RANDOM_EVENTS._domainELinkageR989Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. E→B: 投资故事 — 投资经历触发叙事
{id:"e989_invest_lesson",phase:"street",icon:"📖",title:"投资第一课",
// [全系统自洽修复] 域B R1016b 修复:story 键名残缺引号导致整文件 SyntaxError
story:"你还记得自己第一次投资时的情景吗？\n\n那时候你什么都不懂，听别人说哪个好就买哪个。涨了开心，跌了慌张。\n\n现在回想起来，那笔钱亏得值——它买来了一个教训:永远不要投资自己不懂的东西。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e989LessonDone)return false;if(!st.investment)return false;return st.player.day>=200&&(st.investment.stockHoldings||[]).length>=2},
probability:0.04,repeatable:false,
choices:[{text:"📖 总结投资经验",hint:"心智+25,会计XP+30,系统标记投资经验",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e989LessonDone=true;st.flags._e989InvLesson=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+25,会计XP+30。经验是最好的老师——尤其是犯错的那些。","success")}},
{text:"😅 不堪回首",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e989LessonDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. E→C: 技能投资回报 — 投资知识带来收益
{id:"e989_skill_invest",phase:"street",icon:"📈",title:"学习曲线",
story:"你发现学习投资知识的过程，本身就是一笔财富。\n\n从看不懂K线，到能分析财报；从听消息买股票，到有自己的投资体系。\n\n你投入的时间、精力、甚至亏掉的钱，都在以另一种方式回报你——你变得更聪明了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e989SkillInvestDone)return false;return st.player.day>=180&&(st.skills.accounting.level||0)>=20},
probability:0.04,repeatable:false,
choices:[{text:"📈 继续学习投资",hint:"智力+25,会计XP+35,系统标记学习曲线",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e989SkillInvestDone=true;st.flags._e989LearnCurve=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+35。学习曲线没有尽头——但每一步都算数。","success")}},
{text:"😅 够用了",hint:"现金+8000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e989SkillInvestDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+8000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+8000。","info")}}]},
// 3. E→D: 投资者社交圈 — 投资带来社交圈变化
{id:"e989_invest_circle",phase:"street",icon:"👥",title:"投资圈的人",
// [全系统自洽修复] 域B R1016b 修复:story 键名残缺引号导致整文件 SyntaxError
story:"你参加了一个投资沙龙，发现这里的人和你平时接触的不太一样。\n\n他们聊的不是工资和物价，而是资产配置、风险收益比、周期理论。\n\n你意识到:不同的圈子，决定了不同的信息层级。信息层级，决定了你的认知天花板。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e989CircleDone)return false;return st.player.day>=120&&(st.resources.cash||0)>=20000},
probability:0.03,repeatable:false,
choices:[{text:"👥 融入投资圈",hint:"魅力+20,社交XP+32,系统标记投资圈人脉",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e989CircleDone=true;st.flags._e989InvCircle2=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+20);gx("social",32);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+20,社交XP+32。你的圈子决定了你的认知——投资圈让你看到了更大的世界。","success")}},
{text:"😅 独来独往",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e989CircleDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();