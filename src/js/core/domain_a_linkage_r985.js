/**
 * 域A(数据/数值平衡) 联动增强 R985 — A→B市场情绪叙事 / A→G经济健康度 / A→E通胀投资觉醒
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainALinkageR985Loaded)return;RANDOM_EVENTS._domainALinkageR985Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. A→B: 市场情绪叙事 — 价格波动触发市场情绪故事
{id:"a985_market_feel",phase:"street",icon:"📰",title:"市场的温度",
// [全系统自洽修复] 域B R1016b 修复:story 键名残缺引号导致整文件 SyntaxError
story:"你走在菜市场里，感受到了一种微妙的氛围。\n\n今天买菜的人比往常多了不少，而且每个人都在往篮子里多塞东西。\n\n你问了一下菜贩才知道——听说要涨价了，大家都在囤货。市场情绪这东西，有时候比数据更真实。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a985MarketFeelDone)return false;if(!st.trade)return false;return(st.flags._priceVolatilityCount||0)>=3&&st.player.day>=40},
probability:0.04,repeatable:false,
choices:[{text:"📰 理性分析市场情绪",hint:"智力+22,销售XP+25,系统标记市场感知者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a985MarketFeelDone=true;st.flags._a985MarketFeeler=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("sales",25);if(typeof StateManager!=="undefined")StateManager.addMessage("📰 智力+22,销售XP+25。你学会了感知市场情绪——冷清时买入，狂热时卖出。","success")}},
{text:"😅 跟风囤货",hint:"现金-2000,系统标记从众者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a985MarketFeelDone=true;st.flags._a985Follower2=true;if(st.resources)st.resources.cash=Math.max(0,(st.resources.cash||0)-2000);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金-2000。你跟着人群囤货——但市场情绪不总是对的。","warning")}}]},
// 2. A→G: 经济健康度 — 长期通胀影响生活成本
{id:"a985_living_pressure",phase:"street",icon:"💊",title:"生活的压力",
// [全系统自洽修复] 域B R1016b 修复:story 键名残缺引号导致整文件 SyntaxError
story:"你掏出手机，打开记账软件，发现这个月的支出又超了。\n\n房租涨了200，水电涨了50，连楼下早餐店的豆浆都涨了5毛。\n\n每一项涨得都不多，但加起来——你的工资却一分没涨。你开始认真思考:是该涨工资了，还是该换城市了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a985LivingPressureDone)return false;return st.player.day>=100&&(st.flags._cumulativeInflation||0)>0.05},
probability:0.04,repeatable:false,
choices:[{text:"💊 精打细算，努力增收",hint:"心智+25,会计XP+28,系统标记抗压者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a985LivingPressureDone=true;st.flags._a985PressureFighter=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);gx("accounting",28);if(typeof StateManager!=="undefined")StateManager.addMessage("💊 心智+25,会计XP+28。生活压力是最好的动力——它逼着你变得更强。","success")}},
{text:"😅 得过且过",hint:"现金-1500,系统标记躺平",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a985LivingPressureDone=true;st.flags._a985LayFlat=true;if(st.resources)st.resources.cash=Math.max(0,(st.resources.cash||0)-1500);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金-1500。得过且过——但生活不会因为你躺平就放过你。","warning")}}]},
// 3. A→E: 通胀投资觉醒 — 持续通胀触发投资思考
{id:"a985_invest_mindset",phase:"street",icon:"📈",title:"投资思维",
story:"你发现了一个残酷的事实:靠死工资永远追不上通胀。\n\n你算了一笔账:一个月薪8000的人，如果每年涨薪5%，十年后月薪约13000。但如果通胀每年5%，购买力根本没变。\n\n你需要的不是涨工资，而是建立投资思维——让钱为你工作。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._a985InvestMindsetDone)return false;if(!st.resources)return false;return(st.flags._cumulativeInflation||0)>0.08&&(st.resources.bankBalance||0)>=10000&&st.player.day>=90},
probability:0.04,repeatable:false,
choices:[{text:"📈 建立投资思维",hint:"智力+28,会计XP+32,系统标记投资思维",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a985InvestMindsetDone=true;st.flags._a985InvestMindset=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",32);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+28,会计XP+32。你建立了投资思维——不再为钱工作，而是让钱为你工作。","success")}},
{text:"😅 存银行最安全",hint:"心智+8,系统标记保守派",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._a985InvestMindsetDone=true;st.flags._a985Conservative4=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。安全第一——但通胀不会因为你的保守而停下脚步。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();