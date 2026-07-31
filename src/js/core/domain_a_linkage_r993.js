/**
 * 域A(数据/数值平衡) 联动增强 R993 — A→B市场情绪叙事 / A→G经济健康度 / A→E通胀投资觉醒
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR993Loaded)return;RANDOM_EVENTS._domainALinkageR993Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. A→B: 市场情绪叙事 — 价格波动触发市场情绪故事
{id:"a993_market_rhythm",phase:"street",icon:"📰",title:"市场的节奏",
story":"你渐渐摸清了市场的节奏。\n\n每周一价格最低，周五最高。月初供货充足，月末供不应求。雨季蔬菜贵，晴天海鲜便宜。\n\n这些规律一直存在，只是以前你从没注意过。当你开始用数据看世界，一切都变得有迹可循。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a993RhythmDone)return false;if(!st.trade)return false;return(st.flags._priceVolatilityCount||0)>=5&&st.player.day>=50},
probability:0.04,repeatable:false,
choices:[{text:"📰 掌握市场节奏",hint:"智力+25,销售XP+28,系统标记市场节奏",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a993RhythmDone=true;st.flags._a993MarketRhythm=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("sales",28);if(typeof StateManager!=="undefined")StateManager.addMessage("📰 智力+25,销售XP+28。你掌握了市场的节奏——低买高卖不再是一句空话。","success")}},
{text:"😅 随缘买卖",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a993RhythmDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. A→G: 经济健康度 — 长期通胀影响生活成本
{id:"a993_econ_strain",phase:"street",icon:"💊",title:"经济的压力",
story":"你仔细核算了最近三个月的收支情况，发现了一个趋势。\n\n收入增长的速度，远远赶不上支出增长的速度。\n\n这不是因为你乱花钱，而是因为生活成本在全面上涨——房租、食品、交通，每一项都在涨。你意识到，必须做出改变了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a993EconStrainDone)return false;return st.player.day>=130&&(st.flags._cumulativeInflation||0)>0.06},
probability:0.04,repeatable:false,
choices:[{text:"💊 开源节流，提升收入",hint:"心智+28,会计XP+30,系统标记开源节流",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a993EconStrainDone=true;st.flags._a993EconFighter=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+28);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("💊 心智+28,会计XP+30。开源节流不是口号——是生存的智慧。","success")}},
{text:"😅 得过且过",hint:"现金-2000,系统标记随波逐流",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a993EconStrainDone=true;st.flags._a993Drift=true;if(st.resources)st.resources.cash=Math.max(0,(st.resources.cash||0)-2000);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金-2000。随波逐流——但生活不会因为你不在乎就对你温柔。","warning")}}]},
// 3. A→E: 通胀投资觉醒 — 持续通胀触发投资思考
{id:"a993_invest_call",phase:"street",icon:"📈",title:"投资的时代",
story:"你终于明白了一个道理:在这个时代，单纯靠存钱是行不通的。\n\n"+(function(){try{var _s=typeof StateManager!=="undefined"?StateManager.getState():null;if(_s&&_s.resources&&_s.flags){var _b=_s.resources.bankBalance||0;var _inf=Math.round((_s.flags._cumulativeInflation||0)*100);return "银行存款: ¥"+Math.floor(_b).toLocaleString()+"\n累计通胀: "+_inf+"%\n购买力损失: 约¥"+Math.floor(_b*_inf/100).toLocaleString()}return""}catch(e){return""})()+"\n\n你不能再等了。通胀不会等你准备好了才来。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a993InvestCallDone)return false;if(!st.resources)return false;return(st.flags._cumulativeInflation||0)>0.08&&(st.resources.bankBalance||0)>=20000&&st.player.day>=120},
probability:0.04,repeatable:false,
choices:[{text:"📈 开始投资之旅",hint:"智力+30,会计XP+35,系统标记投资出发",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a993InvestCallDone=true;st.flags._a993InvStart=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+30);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+30,会计XP+35。你开始了投资之旅——最好的时机是十年前，其次是现在。","success")}},
{text:"😅 再等等看",hint:"心智+5,系统标记观望者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a993InvestCallDone=true;st.flags._a993Watcher=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。再等等——但通胀不会等你。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();