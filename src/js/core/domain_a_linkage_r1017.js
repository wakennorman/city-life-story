/**
 * 域A(数据/数值平衡) 联动增强 R1017 — A→B价格波动叙事 / A→G经济健康度 / A→E通胀投资觉醒 / A→C技能市场需求
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR1017Loaded)return;RANDOM_EVENTS._domainALinkageR1017Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. A→B: 价格波动叙事—市场温度计
{id:"a1017_market_temp",phase:"street",icon:"🌡️",title:"市场温度计",
story:"你注意到最近市场上的商品价格有些异常波动。\n\n有些东西突然贵了，有些东西便宜得离谱。\n\n街坊们都在议论——有人在囤货，有人在抛售。",
triggers:{minDay:15,interval:45,maxRepeats:12,excludeFlags:["_a1017MarketTempCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a1017MarketTempCd)return false;return st.player.day>=15&&st.player.day%45===0&&st.trade&&st.trade.goodsPrices},
probability:0.06,repeatable:true,
choices:[
{text:"📊 记录价格变化",hint:"会计XP+12,智力+3,置_a1017PriceTracker",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1017MarketTempCd=true;st.flags._a1017PriceTracker=true;gx("accounting",12);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 会计XP+12,智力+3。记录价格变化——数据就是财富的密码。","success")}},
{text:"💡 寻找套利机会",hint:"销售XP+8,置_a1017ArbitrageAware",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1017MarketTempCd=true;st.flags._a1017ArbitrageAware=true;gx("sales",8);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 销售XP+8。低买高卖——最朴素的商业智慧。","info")}},
{text:"😅 随它去",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1017MarketTempCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。不为价格波动所动——也是一种定力。","info")}}
]},
// 2. A→G: 经济健康度—生活成本感知
{id:"a1017_cost_living",phase:"street",icon:"💸",title:"生活成本账",
story:"你算了算这个月的开销——房租、吃饭、交通、日用品...\n\n每一笔都不大，加起来却不少。\n\n你开始理解为什么有人说——在这座城市，活着就很贵了。",
triggers:{minDay:30,interval:60,maxRepeats:8,excludeFlags:["_a1017CostLivingCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a1017CostLivingCd)return false;return st.player.day>=30&&st.player.day%60===0&&st.resources&&st.resources.cash!==undefined},
probability:0.07,repeatable:true,
choices:[
{text:"📝 制定省钱计划",hint:"会计XP+10,心智+5,置_a1017BudgetPlanner",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1017CostLivingCd=true;st.flags._a1017BudgetPlanner=true;gx("accounting",10);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("📝 会计XP+10,心智+5。省钱不是抠门——是把钱花在刀刃上。","success")}},
{text:"💪 想办法多赚钱",hint:"心智+5,置_a1017EarnMore",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1017CostLivingCd=true;st.flags._a1017EarnMore=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 心智+5。开源永远比节流更有效——但两者都重要。","info")}}
]},
// 3. A→E: 通胀投资觉醒—货币贬值感知
{id:"a1017_inflation_awake",phase:"street",icon:"📈",title:"钱的贬值速度",
story:"你发现口袋里的钱越来越不经花了。\n\n同样的100块，去年能买不少东西，现在却只够吃两顿饭。\n\n你开始意识到——把钱存着不动，其实每天都在贬值。",
triggers:{minDay:90,interval:90,maxRepeats:6,excludeFlags:["_a1017InflationAwakeCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a1017InflationAwakeCd)return false;return st.player.day>=90&&st.player.day%90===0&&(st.resources.cash||0)+(st.resources.bankBalance||0)>=5000},
probability:0.08,repeatable:true,
choices:[
{text:"📈 了解投资渠道",hint:"会计XP+15,智力+5,置_a1017InvestAware",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1017InflationAwakeCd=true;st.flags._a1017InvestAware=true;gx("accounting",15);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 会计XP+15,智力+5。你不理财，财不理你——是时候让钱生钱了。","success")}},
{text:"🏦 去银行咨询",hint:"会计XP+8,置_a1017BankAware",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1017InflationAwakeCd=true;st.flags._a1017BankAware=true;gx("accounting",8);if(typeof StateManager!=="undefined")StateManager.addMessage("🏦 会计XP+8。银行存款利息虽然不高，但总比放在床底下强。","info")}},
{text:"😅 该花就花",hint:"心情+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a1017InflationAwakeCd=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+10。及时行乐——钱不花就不是自己的。","info")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();