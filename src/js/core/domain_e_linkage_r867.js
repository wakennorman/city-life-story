/**
 * 域E(经济/投资) 联动增强 R867 — E→A投资数据沉淀v13 / E→B投资故事叙事v13 / E→G财富健康v13
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR867Loaded)return;RANDOM_EVENTS._domainELinkageR867Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"e867_invest_data_v13",phase:"street",icon:"📊",title:"交易记录，是一座数据金矿",story:"你翻了翻交易记录。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e867InvestDataDone)return false;if(!st.investment)return false;return(st.investment.tradeLog||[]).length>=90&&st.player.day>=500},
probability:0.05,repeatable:false,
choices:[{text:"📊 分析我的交易数据",hint:"智力+32,会计XP+38,置_e867InvestDataAsset",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e867InvestDataDone=true;st.flags._e867InvestDataAsset=true;var _log=st.investment.tradeLog||[];var _w=0,_t=_log.length;for(var _i=0;_i<_t;_i++){if((_log[_i].pnl||0)>0)_w++}st.flags._e867TradeWinRate=_t>0?Math.round(_w/_t*100):0;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+32);gx("accounting",38);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+32,会计XP+38。","success")}},
{text:"😅 交易记录没什么好看的",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e867InvestDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"e867_invest_story_v13",phase:"street",icon:"📖",title:"这笔交易，值得记一辈子",story:"你盯着账户里的数字。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e867InvestStoryDone)return false;if(!st.investment)return false;var _log=st.investment.tradeLog||[];for(var _i=0;_i<_log.length;_i++){var _pnl=_log[_i].pnl||0;if(_pnl>=50000||_pnl<=-35000)return true}return(st.investment._totalInvestmentProfit||0)>=250000||(st.investment._totalInvestmentProfit||0)<=-120000},
probability:0.06,repeatable:false,
choices:[{text:"📖 记录这笔交易的故事",hint:"心智+32,魅力+26,置_e867InvestStory",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e867InvestStoryDone=true;st.flags._e867InvestStory=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+32);st.player.charm=Math.min(100,(st.player.charm||50)+26)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+32,魅力+26。","success")}},
{text:"😊 过去就过去了",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e867InvestStoryDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心情+5。","info")}}]},
{id:"e867_wealth_health_v13",phase:"street",icon:"💚",title:"财富健康，生命才有质量",story:"你算了算——总资产突破了一百万。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e867WealthHealthDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=1000000},
probability:0.06,repeatable:false,
choices:[{text:"💚 评估财富健康度",hint:"心智+32,会计XP+38,置_e867WealthHealthy",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e867WealthHealthDone=true;st.flags._e867WealthHealthy=true;var _d=(st.resources.villageDebt||0)+(st.resources.fineDebt||0)+(st.resources.bankDebt||0);var _a=(st.resources.cash||0)+(st.resources.bankBalance||0);st.flags._e867DebtToAssetRatio=_a>0?Math.round(_d/_a*100)/100:0;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+32);gx("accounting",38);if(typeof StateManager!=="undefined")StateManager.addMessage("💚 心智+32,会计XP+38。","success")}},
{text:"😅 有钱就行",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e867WealthHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();