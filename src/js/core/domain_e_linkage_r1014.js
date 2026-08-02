/**
 * 域E(经济/投资) 联动增强 R1014 — E→B投资故事叙事v23 / E→G财富健康v23 / E→D投资者社交圈v23 / E→F投资仪表盘v23
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR1014Loaded)return;RANDOM_EVENTS._domainELinkageR1014Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// E→B: 投资故事叙事 — 牛市中的"股神"幻觉
{id:"e1014_bull_market_illusion",phase:"street",icon:"📈",title:"牛市的诱惑",story:"最近股市一路飘红，你身边的朋友都在讨论股票。茶余饭后，到处都是「这次不一样」的论调。你的账户也浮盈了不少。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1014BullDone)return false;if(!st.investment)return false;var _inv=st.investment;var _totalPL=0;if(_inv.stockHoldings){for(var _i=0;_i<_inv.stockHoldings.length;_i++){var _h=_inv.stockHoldings[_i];var _m=_inv.stockMarket&&_inv.stockMarket[_h.symbol];if(_m&&_h.buyPrice&&_h.shares)_totalPL+=(_m.price-_h.buyPrice)*_h.shares}}return _totalPL>10000&&st.player.day>=200},
probability:0.06,repeatable:false,
choices:[{text:"📈 落袋为安，先卖一半",hint:"现金+5000,智力+8,置_e1014TakeProfit",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1014BullDone=true;st.flags._e1014TakeProfit=true;st.resources=st.resources||{};st.resources.cash=(st.resources.cash||0)+5000;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 现金+5000,智力+8。落袋为安，你卖出了一半仓位锁定利润。","success")}},
{text:"🔥 牛市不言顶，继续持有",hint:"智力+5,置_e1014HoldThrough",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1014BullDone=true;st.flags._e1014HoldThrough=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 智力+5。你决定继续持有，相信还能涨。","info")}}]},

// E→G: 财富健康 — 投资亏损导致失眠/健康下降
{id:"e1014_loss_insomnia",phase:"street",icon:"😰",title:"亏损的代价",story:"你盯着账户里的数字，比昨天又少了一截。躺在床上翻来覆去睡不着，脑子里全是K线图。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1014InsomniaDone)return false;if(!st.investment)return false;var _inv=st.investment;var _totalLoss=0;if(_inv.stockHoldings){for(var _i=0;_i<_inv.stockHoldings.length;_i++){var _h=_inv.stockHoldings[_i];var _m=_inv.stockMarket&&_inv.stockMarket[_h.symbol];if(_m&&_h.buyPrice&&_h.shares)_totalLoss+=(_h.buyPrice-_m.price)*_h.shares}}return _totalLoss>5000&&st.player.day>=150},
probability:0.08,repeatable:false,
choices:[{text:"😰 关掉软件，去睡觉",hint:"健康+15,疲劳-10,置_e1014SleepWell",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1014InsomniaDone=true;st.flags._e1014SleepWell=true;if(!st.status)st.status={};st.status.health=Math.min(100,(st.status.health||50)+15);if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-10);if(typeof StateManager!=="undefined")StateManager.addMessage("😰 健康+15,疲劳-10。你关掉手机，深呼吸，告诉自己明天会更好。","success")}},
{text:"📱 继续盯盘，睡不着",hint:"健康-10,疲劳+10,智力+3,置_e1014NightTrade",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1014InsomniaDone=true;st.flags._e1014NightTrade=true;if(!st.status)st.status={};st.status.health=Math.max(0,(st.status.health||50)-10);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+10);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("📱 健康-10,疲劳+10,智力+3。你研究了半夜的K线图，眼睛都快瞎了。","warning")}}]},

// E→D: 投资者社交圈 — 投资成功后被朋友请教
{id:"e1014_investor_social_cred",phase:"street",icon:"🏆",title:"投资达人的光环",story:"最近你的投资战绩在朋友圈里传开了。几个朋友约你吃饭，想请教投资经验。你感受到了被追捧的感觉。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1014SocialCredDone)return false;if(!st.investment)return false;var _totalProfit=st.investment._totalInvestmentProfit||0;return _totalProfit>20000&&st.player.day>=300},
probability:0.05,repeatable:false,
choices:[{text:"🏆 分享经验，建立人脉",hint:"名气+15,社交XP+40,管理XP+25,置_e1014SharedWisdom",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1014SocialCredDone=true;st.flags._e1014SharedWisdom=true;if(st.player)st.player.fame=Math.min(100,(st.player.fame||0)+15);gx("social",40);gx("management",25);if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 名气+15,社交XP+40,管理XP+25。你的分享让朋友们受益匪浅，人脉圈又扩大了。","success")}},
{text:"🤫 低调一点，财不外露",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1014SocialCredDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("🤫 心智+8。你谦虚地说自己只是运气好。低调是投资的第一课。","info")}}]},

// E→F: 投资仪表盘 — 资产突破里程碑时UI提醒
{id:"e1014_asset_milestone_alert",phase:"street",icon:"💰",title:"资产里程碑",story:"你的投资总资产突破了¥100,000！从最初的几千块到现在的规模，每一步都走得不容易。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1014MilestoneDone)return false;if(!st.investment)return false;var _tv=0;var _inv=st.investment;if(_inv.stockHoldings){for(var _i=0;_i<_inv.stockHoldings.length;_i++){var _h=_inv.stockHoldings[_i];var _m=_inv.stockMarket&&_inv.stockMarket[_h.symbol];if(_m)_tv+=_m.price*_h.shares}}if(_inv.btcHoldings)_tv+=(_inv.btcPrice||0)*_inv.btcHoldings;return _tv>=100000&&st.player.day>=250},
probability:0.1,repeatable:false,
choices:[{text:"💰 复盘投资历程，规划下一步",hint:"智力+12,管理XP+30,置_e1014MilestoneReached",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1014MilestoneDone=true;st.flags._e1014MilestoneReached=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+12);gx("management",30);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 智力+12,管理XP+30。你复盘了投资历程，对未来的方向更加清晰了。","success")}},
{text:"🎉 庆祝一下，犒劳自己",hint:"心情+15,疲劳-5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1014MilestoneDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+15);if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-5);if(typeof StateManager!=="undefined")StateManager.addMessage("🎉 心情+15,疲劳-5。你决定好好犒劳自己一下，明天继续努力！","success")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();