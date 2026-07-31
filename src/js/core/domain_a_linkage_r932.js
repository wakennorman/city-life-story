/**
// [全系统自洽修复] 域B R1016b 修复:字符串内嵌未转义双引号
 * 域A(数据/数值平衡) 联动增强 R932 — A→B市场情绪叙事 / A→G经济健康度 / A→E通胀投资觉醒
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 *  - done-flag 防重复。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR932Loaded)return;RANDOM_EVENTS._domainALinkageR932Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. A→B: 市场情绪叙事 — 极端价格波动触发市场情绪故事，影响玩家对市场的认知
{id:"a932_market_sentiment",phase:"street",icon:"📰",title:"市场情绪波动",
story:"最近市场上的气氛有些不对劲。\n\n卖菜的大婶说进货价涨了三成，收废品的老王抱怨铜价跌了快一半。\n\n你站在市场中间，听着周围的议论声——每个人都在猜测下一步会怎样。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a932SentimentDone)return false;if(!st.trade)return false;var _pv=st.flags._priceVolatilityCount||0;return _pv>=8&&st.player.day>=90},
probability:0.05,repeatable:false,
choices:[{text:"📰 收集各方信息，判断市场走向",hint:"智力+18,销售XP+25,系统标记市场洞察者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a932SentimentDone=true;st.flags._a932MarketWatcher=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+18);gx("sales",25);if(typeof StateManager!=="undefined")StateManager.addMessage("📰 智力+18,销售XP+25。你对市场的敏感度提升了！","success")}},
{text:"😅 不管那么多，照常做买卖",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a932SentimentDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. A→G: 经济健康度 — 长期通胀/通缩影响玩家日常生活质量
{id:"a932_econ_health_life",phase:"street",icon:"💊",title:"经济的呼吸",
story:"你站在超市货架前，默默比较着两个品牌的价格。\n\n这半年来，同样的东西越来越贵了——工资没涨多少，但生活成本却在悄悄攀升。\n\n你开始理解为什么老一辈总说“钱不值钱了”。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a932EconHealthDone)return false;var _inf=Math.abs(st.flags._cumulativeInflation||0);return _inf>0.08&&st.player.day>=120},
probability:0.06,repeatable:false,
choices:[{text:"💊 精打细算，降低生活成本",hint:"心智+20,会计XP+30,系统标记精打细算者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a932EconHealthDone=true;st.flags._a932Thrifty=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+20);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("💊 心智+20,会计XP+30。你学会了精打细算——这是通货膨胀时代最重要的生存技能。","success")}},
{text:"😔 赚钱更重要，不在意这点开销",hint:"现金+3000,系统标记消费主义",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a932EconHealthDone=true;st.flags._a932Consumerist=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+3000;if(typeof StateManager!=="undefined")StateManager.addMessage("😔 现金+3000。你选择用更多钱来解决问题——但这不是长久之计。","warning")}}]},
// 3. A→E: 通胀投资觉醒 — 持续通胀触发对投资理财的思考
{id:"a932_inflation_invest_awake",phase:"street",icon:"📈",title:"通胀下的觉醒",
story:"你盯着银行账户里那点可怜的利息。\n\n¥"+(function(){try{var _s=typeof StateManager!=="undefined"?StateManager.getState():null;if(_s&&_s.resources){var _b=_s.resources.bankBalance||0;return Math.floor(_b).toLocaleString()}return"?"}catch(e){return"?"}})()+"存在银行，年利率跑不过通胀——实际上，你的钱每天都在贬值。\n\n你第一次认真思考：也许该学学理财了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a932InvestAwakeDone)return false;if(!st.resources)return false;var _inf=st.flags._cumulativeInflation||0;return _inf>0.1&&(st.resources.bankBalance||0)>=20000&&st.player.day>=150},
probability:0.05,repeatable:false,
choices:[{text:"📈 学习投资理财",hint:"智力+25,会计XP+35,系统标记投资者觉醒",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a932InvestAwakeDone=true;st.flags._a932InvestorAwake=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+35。投资意识觉醒——你决定不再让钱躺在银行贬值。","success")}},
{text:"😅 继续存着，安全第一",hint:"心智+5,系统标记保守派",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a932InvestAwakeDone=true;st.flags._a932Conservative=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。安全第一，但通胀会慢慢吃掉你的存款。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();