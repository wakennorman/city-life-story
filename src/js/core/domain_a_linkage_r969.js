/**
 * 域A(数据/数值平衡) 联动增强 R969 — A→B市场情绪叙事 / A→G经济健康度 / A→E通胀投资觉醒
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR969Loaded)return;RANDOM_EVENTS._domainALinkageR969Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. A→B: 市场情绪叙事 — 价格波动触发市场情绪故事
{id:"a969_market_mood",phase:"street",icon:"📰",title:"市场在说什么",
story:"你走在街上，听到周围人都在议论同一件事——物价又涨了。\n\n「听说下个月还要涨，赶紧多囤点吧。」\n\n市场情绪像传染病，恐慌和贪婪都在人群中蔓延。你站在中间，试图分辨哪些是真信息，哪些是噪音。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a969MarketMoodDone)return false;if(!st.trade)return false;return(st.flags._priceVolatilityCount||0)>=3&&st.player.day>=60},
probability:0.04,repeatable:false,
choices:[{text:"📰 理性分析市场情绪",hint:"智力+20,销售XP+25,系统标记市场理性者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a969MarketMoodDone=true;st.flags._a969Rational=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);gx("sales",25);if(typeof StateManager!=="undefined")StateManager.addMessage("📰 智力+20,销售XP+25。在市场恐慌时保持理性——这才是真正的智慧。","success")}},
{text:"😅 跟风买点",hint:"现金-2000,系统标记从众者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a969MarketMoodDone=true;st.flags._a969Follower=true;if(st.resources)st.resources.cash=Math.max(0,(st.resources.cash||0)-2000);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金-2000。你跟着人群买了——但人群往往是错的。","warning")}}]},
// 2. A→G: 经济健康度 — 长期通胀影响生活成本
{id:"a969_living_cost",phase:"street",icon:"💊",title:"生活的成本",
story":"你算了算这个月的开销，比上个月又多了。\n\n房租涨了、菜价涨了、连公交都涨价了。但工资没涨。\n\n你开始理解为什么老一辈总说「钱越来越不经花了」——通胀就像温水煮青蛙，等你发现的时候，已经晚了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a969LivingCostDone)return false;return st.player.day>=150&&(st.flags._cumulativeInflation||0)>0.05},
probability:0.04,repeatable:false,
choices:[{text:"💊 调整消费结构，对抗通胀",hint:"心智+22,会计XP+28,系统标记抗通胀者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a969LivingCostDone=true;st.flags._a969AntiInflation=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+22);gx("accounting",28);if(typeof StateManager!=="undefined")StateManager.addMessage("💊 心智+22,会计XP+28。通胀不可怕——可怕的是你不知道如何应对。","success")}},
{text:"😅 该花还是得花",hint:"现金-3000,系统标记消费主义",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a969LivingCostDone=true;st.flags._a969Consumer=true;if(st.resources)st.resources.cash=Math.max(0,(st.resources.cash||0)-3000);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金-3000。该花还是得花——但通胀不会等你。","warning")}}]},
// 3. A→E: 通胀投资觉醒 — 持续通胀触发投资思考
{id:"a969_invest_awakening",phase:"street",icon:"📈",title:"存钱还是投资",
story:"你看着银行账户里的存款，利息少得可怜。\n\n活期利率0.3%，通胀率5%——你的钱每年实际贬值4.7%。\n\n存银行，就是在亏钱。但不存银行，又能放哪？你第一次认真思考这个问题。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a969InvestAwakeDone)return false;if(!st.resources)return false;return(st.flags._cumulativeInflation||0)>0.08&&(st.resources.bankBalance||0)>=10000&&st.player.day>=120},
probability:0.04,repeatable:false,
choices:[{text:"📈 学习投资理财",hint:"智力+25,会计XP+30,系统标记投资者觉醒",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a969InvestAwakeDone=true;st.flags._a969Investor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+30。你决定不再让钱躺在银行贬值——投资是唯一的出路。","success")}},
{text:"😅 存银行安心",hint:"心智+8,系统标记保守派",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a969InvestAwakeDone=true;st.flags._a969Conservative2=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。安全第一——但通胀会慢慢吃掉你的存款。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();