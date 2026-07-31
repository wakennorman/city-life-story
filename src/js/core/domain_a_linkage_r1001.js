/**
 * 域A(数据/数值平衡) 联动增强 R1001 — A→B市场趋势 / A→G经济健康 / A→E投资觉醒
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR1001Loaded)return;RANDOM_EVENTS._domainALinkageR1001Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. A→B: 市场趋势 — 价格数据积累触发趋势洞察
{id:"a1001_market_trend",phase:"street",icon:"📈",title:"趋势的力量",
story:"你研究了近期的价格走势，发现了一个明显的趋势。\n\n「每次政策调整后，市场都会有一波波动。那些提前布局的人，都在波动中赚到了钱。」\n\n你开始明白:在市场上赚钱，靠的不是运气，是对趋势的判断。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a1001TrendDone)return false;if(!st.trade)return false;return(st.flags._priceVolatilityCount||0)>=3&&st.player.day>=35},
probability:0.04,repeatable:false,
choices:[{text:"📈 学习判断趋势",hint:"智力+25,销售XP+28,系统标记趋势判断",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1001TrendDone=true;st.flags._a1001TrendJudge=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("sales",28);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,销售XP+28。趋势是你的朋友——学会判断趋势，就掌握了市场的密码。","success")}},
{text:"😅 随波逐流",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1001TrendDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. A→G: 经济健康 — 长期通胀影响生活质量
{id:"a1001_econ_quality",phase:"street",icon:"💊",title:"生活的质量",
story:"你开始关注一个以前从未注意过的指标:生活质量。\n\n收入在涨，但支出涨得更快。资产在增加，但负债也在增加。\n\n你意识到:真正的财富不是你赚了多少，而是你在扣除生活成本后，还剩下多少自由。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a1001EconQualityDone)return false;return st.player.day>=100&&(st.flags._cumulativeInflation||0)>0.04},
probability:0.04,repeatable:false,
choices:[{text:"💊 提升生活质量",hint:"心智+25,会计XP+30,系统标记生活质量",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1001EconQualityDone=true;st.flags._a1001LifeQuality=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("💊 心智+25,会计XP+30。生活质量不是用钱衡量的——是用自由衡量的。","success")}},
{text:"😅 得过且过",hint:"现金-1500,系统标记将就",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1001EconQualityDone=true;st.flags._a1001Settle=true;if(st.resources)st.resources.cash=Math.max(0,(st.resources.cash||0)-1500);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金-1500。将就着过——但生活不应该只是将就。","warning")}}]},
// 3. A→E: 投资觉醒 — 持续通胀触发投资思考
{id:"a1001_invest_begin",phase:"street",icon:"📈",title:"投资的第一步",
story:"你终于下定决心，开始学习投资。\n\n「种一棵树最好的时间是十年前，其次是现在。」\n\n你打开理财APP，虽然还有很多不懂的地方，但你不再害怕了。因为你知道:每个人的投资之路，都是从第一步开始的。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a1001InvestBeginDone)return false;if(!st.resources)return false;return(st.flags._cumulativeInflation||0)>0.07&&(st.resources.bankBalance||0)>=8000&&st.player.day>=80},
probability:0.04,repeatable:false,
choices:[{text:"📈 迈出投资第一步",hint:"智力+28,会计XP+35,系统标记投资入门",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1001InvestBeginDone=true;st.flags._a1001InvBegin=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+28,会计XP+35。你迈出了投资的第一步——最好的开始就是现在。","success")}},
{text:"😅 再等等",hint:"心智+5,系统标记等待者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1001InvestBeginDone=true;st.flags._a1001Waiter=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。再等等——但机会不等人。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();