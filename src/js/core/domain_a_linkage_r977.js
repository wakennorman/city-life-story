/**
 * 域A(数据/数值平衡) 联动增强 R977 — A→B市场情绪叙事 / A→G经济健康度 / A→E通胀投资觉醒
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR977Loaded)return;RANDOM_EVENTS._domainALinkageR977Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. A→B: 市场情绪叙事 — 价格波动触发市场情绪故事
{id:"a977_market_whisper",phase:"street",icon:"📰",title:"市场的低语",
story":"你在市场里听到了一些窃窃私语。\n\n「听说最近查得严，好多货都进不来。」「我认识一个人，他有特殊渠道——但价格要贵三成。」\n\n市场上的信息真真假假，你需要分辨哪些是机会，哪些是陷阱。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a977MarketWhisperDone)return false;if(!st.trade)return false;return(st.flags._priceVolatilityCount||0)>=4&&st.player.day>=45},
probability:0.04,repeatable:false,
choices:[{text:"📰 多方求证，辨别真伪",hint:"智力+22,销售XP+25,系统标记信息辨别者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a977MarketWhisperDone=true;st.flags._a977InfoDiscerner=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("sales",25);if(typeof StateManager!=="undefined")StateManager.addMessage("📰 智力+22,销售XP+25。在信息爆炸的时代，辨别真伪是最珍贵的技能。","success")}},
{text:"😅 听风就是雨",hint:"现金-1500,系统标记盲从者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a977MarketWhisperDone=true;st.flags._a977BlindFollower=true;if(st.resources)st.resources.cash=Math.max(0,(st.resources.cash||0)-1500);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金-1500。你轻信了谣言——市场不会同情盲从者。","warning")}}]},
// 2. A→G: 经济健康度 — 长期通胀影响生活成本
{id:"a977_econ_health",phase:"street",icon:"💊",title:"经济的呼吸",
story:"你站在超市里，看着价格标签，心里默默计算。\n\n「这包米上个月才35，现在42了。鸡蛋从5毛涨到了8毛。」\n\n你叹了口气。通胀就像空气，你看不见它，但每一次呼吸都能感受到它的存在。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a977EconHealthDone)return false;return st.player.day>=120&&(st.flags._cumulativeInflation||0)>0.06},
probability:0.04,repeatable:false,
choices:[{text:"💊 精打细算，对抗通胀",hint:"心智+25,会计XP+30,系统标记精打细算",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a977EconHealthDone=true;st.flags._a977Thrifty2=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("💊 心智+25,会计XP+30。精打细算不是抠门——是对抗通胀的生存智慧。","success")}},
{text:"😅 该花还得花",hint:"现金-2000,系统标记不在乎",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a977EconHealthDone=true;st.flags._a977Spender=true;if(st.resources)st.resources.cash=Math.max(0,(st.resources.cash||0)-2000);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金-2000。该花还得花——但通胀不会因为你的不在乎而停下。","warning")}}]},
// 3. A→E: 通胀投资觉醒 — 持续通胀触发投资思考
{id:"a977_invest_awake",phase:"street",icon:"📈",title:"通胀下的觉醒",
story:"你算了一笔账，结果让你坐不住了。\n\n"+(function(){try{var _s=typeof StateManager!=="undefined"?StateManager.getState():null;if(_s&&_s.resources){var _b=_s.resources.bankBalance||0;return "银行存款: ¥"+Math.floor(_b).toLocaleString()+"\n年利率: 0.3%\n通胀率: "+(Math.round((_s.flags._cumulativeInflation||0)*100))+"%\n每年实际贬值: ¥"+Math.floor(_b*0.047).toLocaleString()}return""}catch(e){return""})()+"\n\n你不能再假装没看见了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a977InvestAwakeDone)return false;if(!st.resources)return false;return(st.flags._cumulativeInflation||0)>0.08&&(st.resources.bankBalance||0)>=15000&&st.player.day>=100},
probability:0.04,repeatable:false,
choices:[{text:"📈 开始学习投资",hint:"智力+28,会计XP+35,系统标记投资觉醒",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a977InvestAwakeDone=true;st.flags._a977InvAwake2=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+28,会计XP+35。通胀是最好的老师——它教会你，钱必须工作。","success")}},
{text:"😅 存银行最安全",hint:"心智+8,系统标记保守派",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a977InvestAwakeDone=true;st.flags._a977Conservative3=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。安全第一——但安全有时是最大的风险。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();