/**
 * 域A(数据/数值平衡) 联动增强 R1009 — A→B市场趋势 / A→G经济健康 / A→E投资觉醒
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR1009Loaded)return;RANDOM_EVENTS._domainALinkageR1009Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. A→B: 市场趋势 — 价格波动触发市场洞察
{id:"a1009_market_eye",phase:"street",icon:"📈",title:"市场的眼睛",
// [全系统自洽修复] 域B R1016b 修复:story 键名残缺引号导致整文件 SyntaxError
story:"你开始用不同的眼光看市场了。\n\n以前你看到的是价格，现在你看到的是供需、情绪、周期。\n\n你发现市场就像一面镜子——它反映的是所有人的贪婪和恐惧。而你要做的，就是在别人贪婪时保持冷静，在别人恐惧时保持勇气。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a1009EyeDone)return false;if(!st.trade)return false;return(st.flags._priceVolatilityCount||0)>=3&&st.player.day>=30},
probability:0.04,repeatable:false,
choices:[{text:"📈 培养市场眼光",hint:"智力+25,销售XP+28,系统标记市场眼光",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1009EyeDone=true;st.flags._a1009MarketEye=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("sales",28);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,销售XP+28。你开始用不一样的眼光看市场——看到的不再是价格，而是规律。","success")}},
{text:"😅 随缘吧",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1009EyeDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. A→G: 经济健康 — 生活成本与收入
{id:"a1009_living_balance",phase:"street",icon:"💊",title:"生活的平衡",
story:"你坐下来认真算了一笔账。\n\n收入减去支出，剩下的才是你真正拥有的。\n\n你发现很多人都在犯同一个错误:只关注赚了多少，不关注留了多少。真正的财富，不是你赚了多少钱，而是你留下了多少钱。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a1009BalanceDone)return false;return st.player.day>=90&&(st.flags._cumulativeInflation||0)>0.04},
probability:0.04,repeatable:false,
choices:[{text:"💊 关注储蓄率",hint:"心智+25,会计XP+30,系统标记储蓄意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1009BalanceDone=true;st.flags._a1009SaveRate=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("💊 心智+25,会计XP+30。真正的财富不是你赚了多少，而是你留下了多少。","success")}},
{text:"😅 今朝有酒今朝醉",hint:"现金-1500,系统标记月光族",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1009BalanceDone=true;st.flags._a1009Moonlight=true;if(st.resources)st.resources.cash=Math.max(0,(st.resources.cash||0)-1500);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金-1500。今朝有酒今朝醉——但明天呢？","warning")}}]},
// 3. A→E: 投资觉醒 — 通胀触发投资思考
{id:"a1009_invest_urge",phase:"street",icon:"📈",title:"投资的原动力",
story:"你终于明白了投资的真正意义。\n\n投资不是为了暴富，而是为了不让自己的钱贬值。\n\n通胀是确定的，但你的应对方式是可以选择的。你可以选择被动地接受贬值，也可以选择主动地让钱生钱。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a1009UrgeDone)return false;if(!st.resources)return false;return(st.flags._cumulativeInflation||0)>0.06&&(st.resources.bankBalance||0)>=5000&&st.player.day>=70},
probability:0.04,repeatable:false,
choices:[{text:"📈 开始投资",hint:"智力+28,会计XP+32,系统标记投资原动力",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1009UrgeDone=true;st.flags._a1009InvUrge=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",32);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+28,会计XP+32。投资不是为了暴富——而是为了不让自己的钱贬值。","success")}},
{text:"😅 存银行安心",hint:"心智+5,系统标记保守派",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1009UrgeDone=true;st.flags._a1009Safe=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。存银行安心——但通胀不会因为你的安心而停下。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();