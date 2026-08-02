/**
 * 域E(经济/投资) 联动增强 R1021 — E→B投资故事叙事 / E→C技能投资回报 / E→D投资者社交圈
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR1021Loaded)return;RANDOM_EVENTS._domainELinkageR1021Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. E→B: 投资故事叙事—第一笔投资的感悟
{id:"e1021_first_invest",phase:"street",icon:"📈",title:"第一笔投资",
story:"你终于鼓起勇气，做了人生第一笔投资。\n\n看着账户里的数字变化，你的心情也跟着起伏。\n\n你开始理解——投资不只是数字游戏，更是对自己判断力的考验。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1021FirstInvestCd)return false;var _inv=st.investment;if(!_inv||!_inv.stockHoldings||!_inv.stockHoldings.length)return false;return st.player.day>=30&&st.player.day%90===0},
probability:0.06,repeatable:true,
choices:[
{text:"📈 记录投资心得",hint:"会计XP+15,智力+5,置_e1021InvestDiary",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1021FirstInvestCd=true;st.flags._e1021InvestDiary=true;gx("accounting",15);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 会计XP+15,智力+5。记录投资心得——经验是最好的老师。","success")}},
{text:"📊 研究投资标的",hint:"会计XP+10,置_e1021ResearchHabit",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1021FirstInvestCd=true;st.flags._e1021ResearchHabit=true;gx("accounting",10);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 会计XP+10。研究——投资中最重要的事。","info")}},
{text:"😅 放着看看",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1021FirstInvestCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。耐心——投资中最稀缺的品质。","info")}}
]},
// 2. E→C: 技能投资回报—财务知识带来投资信心
{id:"e1021_finance_skill",phase:"street",icon:"📚",title:"知识就是财富",
story:"你发现自从学了会计知识后，看财务报表不再像看天书了。\n\n你能看懂公司的盈利能力、负债水平、现金流状况。\n\n这些知识让你在投资时更有底气——你知道自己在买什么，而不是跟风炒作。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1021FinanceSkillCd)return false;var _sk=st.skills&&st.skills.accounting;if(!_sk||_sk.level<15)return false;return st.player.day>=45&&st.player.day%90===0},
probability:0.06,repeatable:true,
choices:[
{text:"📚 继续学习财务知识",hint:"会计XP+20,智力+5,置_e1021FinLiterate",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1021FinanceSkillCd=true;st.flags._e1021FinLiterate=true;gx("accounting",20);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("📚 会计XP+20,智力+5。财务知识是投资的基础——你正在打好地基。","success")}},
{text:"💡 用知识分析一只股票",hint:"会计XP+10,心智+5,置_e1021FundamentalAnalysis",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1021FinanceSkillCd=true;st.flags._e1021FundamentalAnalysis=true;gx("accounting",10);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 会计XP+10,心智+5。用知识分析——你正在从投机者变成投资者。","info")}}
]},
// 3. E→D: 投资者社交圈—找到投资同好
{id:"e1021_invest_circle",phase:"street",icon:"🤝",title:"投资同好会",
story:"你在网上发现了一个本地的投资交流群。\n\n群里的人来自各行各业，但都有一个共同爱好——研究投资。\n\n大家分享观点、讨论行情、互相提醒风险。\n\n你找到了组织——在投资这条路上，你不再是一个人。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1021InvestCircleCd)return false;var _inv=st.investment;if(!_inv||!_inv.stockHoldings||!_inv.stockHoldings.length)return false;return st.player.day>=60&&st.player.day%90===0},
probability:0.05,repeatable:true,
choices:[
{text:"🤝 积极参与交流",hint:"社交XP+12,会计XP+8,置_e1021ActiveInvestor",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1021InvestCircleCd=true;st.flags._e1021ActiveInvestor=true;gx("social",12);gx("accounting",8);if(typeof StateManager!=="undefined")StateManager.addMessage("🤝 社交XP+12,会计XP+8。交流中收获的不仅是知识，还有朋友。","success")}},
{text:"📝 默默学习",hint:"会计XP+10,置_e1021QuietLearner",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1021InvestCircleCd=true;st.flags._e1021QuietLearner=true;gx("accounting",10);if(typeof StateManager!=="undefined")StateManager.addMessage("📝 会计XP+10。先观察再发言——沉默中学习。","info")}},
{text:"😅 不太感兴趣",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1021InvestCircleCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。投资是孤独的——有时候一个人更好。","info")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();