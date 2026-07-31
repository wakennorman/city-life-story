/**
// [全系统自洽修复] 域B R1016b 修复:IIFE缺少函数体闭合花括号x1
 * 域F(UI/UX) 联动增强 R958 — F→A数据可视化 / F→B事件记忆墙 / F→E财务仪表盘
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainFLinkageR958Loaded)return;RANDOM_EVENTS._domainFLinkageR958Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. F→A: 数据可视化 — 价格数据积累到一定程度，触发数据洞察
{id:"f958_price_map",phase:"street",icon:"🗺️",title:"价格地图",
story:"你打开城市地图，上面标注着各个区域的价格水平。\n\n「贫民区的东西最便宜，但质量也最差。商业区的品质好，但价格翻倍。批发市场在城郊，运费和时间成本要算进去。」\n\n你第一次从全局视角看到了这座城市的经济格局。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f958PriceMapDone)return false;var _ph=st.flags._priceIndexHistory||[];return _ph.length>=30&&st.player.day>=150},
probability:0.04,repeatable:false,
choices:[{text:"🗺️ 用价格地图规划采购",hint:"智力+28,会计XP+35,系统标记价格地图",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f958PriceMapDone=true;st.flags._f958PriceMapper=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("🗺️ 智力+28,会计XP+35。你绘制了城市的价格地图——信息就是金钱。","success")}},
{text:"😅 太复杂了",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f958PriceMapDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
// 2. F→B: 事件记忆墙 — 回顾人生重要事件
{id:"f958_life_timeline",phase:"street",icon:"📜",title:"人生时间线",
story:"你俯瞰自己的人生时间线，那些重要的节点清晰可见。\n\n「第1天:来到这座城市。第60天:找到了第一份工作。第180天:还清了债务。第365天:第一次有了存款。」\n\n每一个节点都在告诉你——你正在往前走。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f958TimelineDone)return false;var _eh=st.flags._eventHistory||[];return _eh.length>=40&&st.player.day>=300},
probability:0.03,repeatable:false,
choices:[{text:"📜 整理人生时间线",hint:"心智+35,魅力+22,系统标记时间线",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f958TimelineDone=true;st.flags._f958TimelineKeeper=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+35);st.player.charm=Math.min(100,(st.player.charm||20)+22)}if(typeof StateManager!=="undefined")StateManager.addMessage("📜 心智+35,魅力+22。每一步都算数——你的人生时间线越来越精彩。","success")}},
{text:"😔 继续往前走",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f958TimelineDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+5。","info")}}]},
// 3. F→E: 财务仪表盘 — 财务自由阶段性目标
{id:"f958_wealth_milestone",phase:"street",icon:"🏆",title:"财务自由之路",
story:"你打开财务面板，看着自己的资产数字。\n\n"+(function(){try{var _s=typeof StateManager!=="undefined"?StateManager.getState():null;if(_s&&_s.resources){var _c=_s.resources.cash||0,_b=_s.resources.bankBalance||0,_e=_s.resources.totalEarned||0;return "现金: ¥"+Math.floor(_c).toLocaleString()+"\n存款: ¥"+Math.floor(_b).toLocaleString()+"\n终身收入: ¥"+Math.floor(_e).toLocaleString()}return""}catch(e){return""}})()+"\n\n你离财务自由还有多远？也许没有想象中那么远。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._f958WealthMilestoneDone)return false;if(!st.resources)return false;return(st.resources.totalEarned||0)>=2000000&&st.player.day>=500},
probability:0.03,repeatable:false,
choices:[{text:"🏆 制定财务自由路线图",hint:"智力+30,会计XP+40,系统标记财务自由",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f958WealthMilestoneDone=true;st.flags._f958FinFree=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+30);gx("accounting",40);if(typeof StateManager!=="undefined")StateManager.addMessage("🏆 智力+30,会计XP+40。财务自由不是终点——它是你实现梦想的起点。","success")}},
{text:"😅 继续攒钱",hint:"现金+15000,系统标记攒钱中",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._f958WealthMilestoneDone=true;st.flags._f958Saver3=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+15000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+15000。继续攒钱——但别忘了，钱是工具，不是目的。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();