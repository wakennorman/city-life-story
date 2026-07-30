/**
 * 域E(经济/投资) 联动增强 R883 — E→A投资数据沉淀v15 / E→B投资故事叙事v15 / E→G财富健康v15
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR883Loaded)return;RANDOM_EVENTS._domainELinkageR883Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"e883_invest_data_v15",phase:"street",icon:"📊",title:"交易记录，是一座数据金矿",story:"你翻了翻交易记录。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e883InvestDataDone)return false;if(!st.investment)return false;return(st.investment.tradeLog||[]).length>=120&&st.player.day>=600},
probability:0.05,repeatable:false,
choices:[{text:"📊 分析我的交易数据",hint:"智力+38,会计XP+42,置_e883InvestDataAsset",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e883InvestDataDone=true;st.flags._e883InvestDataAsset=true;var _log=st.investment.tradeLog||[];var _w=0,_t=_log.length;for(var _i=0;_i<_t;_i++){if((_log[_i].pnl||0)>0)_w++}st.flags._e883TradeWinRate=_t>0?Math.round(_w/_t*100):0;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+38);gx("accounting",42);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+38,会计XP+42。","success")}},
{text:"😅 交易记录没什么好看的",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e883InvestDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"e883_invest_story_v15",phase:"street",icon:"📖",title:"这笔交易，值得记一辈子",story:"你盯着账户里的数字。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e883InvestStoryDone)return false;if(!st.investment)return false;var _log=st.investment.tradeLog||[];for(var _i=0;_i<_log.length;_i++){var _pnl=_log[_i].pnl||0;if(_pnl>=80000||_pnl<=-50000)return true}return(st.investment._totalInvestmentProfit||0)>=400000||(st.investment._totalInvestmentProfit||0)<=-200000},
probability:0.06,repeatable:false,
choices:[{text:"📖 记录这笔交易的故事",hint:"心智+38,魅力+30,置_e883InvestStory",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e883InvestStoryDone=true;st.flags._e883InvestStory=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+38);st.player.charm=Math.min(100,(st.player.charm||50)+30)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+38,魅力+30。","success")}},
{text:"😊 过去就过去了",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e883InvestStoryDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心情+5。","info")}}]},
{id:"e883_wealth_health_v15",phase:"street",icon:"💚",title:"财富健康，生命才有质量",story:"你算了算——总资产突破了两百万。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e883WealthHealthDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=2000000},
probability:0.06,repeatable:false,
choices:[{text:"💚 评估财富健康度",hint:"心智+38,会计XP+42,置_e883WealthHealthy",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e883WealthHealthDone=true;st.flags._e883WealthHealthy=true;var _d=(st.resources.villageDebt||0)+(st.resources.fineDebt||0)+(st.resources.bankDebt||0);var _a=(st.resources.cash||0)+(st.resources.bankBalance||0);st.flags._e883DebtToAssetRatio=_a>0?Math.round(_d/_a*100)/100:0;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+38);gx("accounting",42);if(typeof StateManager!=="undefined")StateManager.addMessage("💚 心智+38,会计XP+42。","success")}},
{text:"😅 有钱就行",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e883WealthHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
