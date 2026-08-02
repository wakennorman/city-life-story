/**
 * 域F(UI/UX) 联动增强 R1022 — F→A价格周期可视化 / F→B人生故事墙 / F→E财富仪表盘
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR1022Loaded)return;RANDOM_EVENTS._domainFLinkageR1022Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. F→A: 价格周期可视化—价格波动提醒
{id:"f1022_price_alert",phase:"street",icon:"📉",title:"价格波动提醒",
story:"你打开手机上的价格追踪应用，发现最近有些商品的价格波动很大。\n\n系统自动标记了几个异常价格——\n\n有的商品比平均价低了20%，有的却贵了30%。\n\n数据告诉你：机会来了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f1022PriceAlertCd)return false;if(!st.trade||!st.trade.goodsPrices)return false;return st.player.day>=30&&st.player.day%60===0},
probability:0.06,repeatable:true,
choices:[
{text:"📉 查看价格详情",hint:"会计XP+10,智力+3,置_f1022PriceWatcher",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1022PriceAlertCd=true;st.flags._f1022PriceWatcher=true;gx("accounting",10);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("📉 会计XP+10,智力+3。价格波动中藏着机会——你学会了用数据发现价值。","success")}},
{text:"💡 根据价格调整采购",hint:"销售XP+8,置_f1022PriceStrategist",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1022PriceAlertCd=true;st.flags._f1022PriceStrategist=true;gx("sales",8);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 销售XP+8。低买高卖——你开始用数据指导行动。","info")}},
{text:"😅 先收藏",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1022PriceAlertCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。信息先收藏——机会留给有准备的人。","info")}}
]},
// 2. F→B: 人生故事墙—年度回忆
{id:"f1022_year_memory",phase:"street",icon:"📖",title:"年度回忆",
story:"你翻看着这一年的经历——\n\n那些艰难的日子，那些意外的惊喜，那些让你成长的时刻。\n\n每一件事都在你的人生故事中留下了印记。\n\n你忽然觉得，这一年虽然辛苦，但很值得。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f1022YearMemoryCd)return false;return st.player.day>=180&&st.player.day%180===0},
probability:0.10,repeatable:true,
choices:[
{text:"📖 写下年度总结",hint:"心智+10,魅力+5,置_f1022Writer",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1022YearMemoryCd=true;st.flags._f1022Writer=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+10);st.player.charm=Math.min(100,(st.player.charm||50)+5)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+10,魅力+5。记录下这一年的故事——你的人生值得被记住。","success")}},
{text:"📊 看看成长数据",hint:"心智+8,会计XP+5,置_f1022DataReview",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1022YearMemoryCd=true;st.flags._f1022DataReview=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);gx("accounting",5);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 心智+8,会计XP+5。数据不会说谎——你确实在成长。","info")}}
]},
// 3. F→E: 财富仪表盘—资产配置提醒
{id:"f1022_wealth_dash",phase:"street",icon:"💰",title:"资产配置提醒",
story:"你打开财富仪表盘，清晰地看到了自己的资产分布。\n\n现金、存款、投资——每一项都一目了然。\n\n你发现大部分钱都躺在银行里吃低利息，而投资占比很小。\n\n仪表盘提示你：也许该重新考虑一下资产配置了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f1022WealthDashCd)return false;var _cash=(st.resources&&st.resources.cash)||0;var _bank=(st.resources&&st.resources.bankBalance)||0;return _cash+_bank>=10000&&st.player.day>=60&&st.player.day%90===0},
probability:0.06,repeatable:true,
choices:[
{text:"💰 考虑增加投资比例",hint:"会计XP+12,智力+5,置_f1022InvestorMindset",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1022WealthDashCd=true;st.flags._f1022InvestorMindset=true;gx("accounting",12);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 会计XP+12,智力+5。资产配置是投资中最重要的事——你开始思考了。","success")}},
{text:"🏦 去银行咨询理财",hint:"会计XP+8,置_f1022BankAdvisor",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1022WealthDashCd=true;st.flags._f1022BankAdvisor=true;gx("accounting",8);if(typeof StateManager!=="undefined")StateManager.addMessage("🏦 会计XP+8。专业建议值得参考——但决策还得自己做。","info")}},
{text:"😅 存着也挺好",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f1022WealthDashCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。保守不是错——但通胀会慢慢侵蚀你的财富。","warning")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();