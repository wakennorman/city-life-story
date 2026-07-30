/**
 * 域E(经济/投资) 联动增强 R852
 * 全系统优化·Domain E 第七十二轮循环
 * E→A 投资数据沉淀v11 / E→B 投资故事叙事v11 / E→G 财富健康v11
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR852Loaded) return;
  RANDOM_EVENTS._domainELinkageR852Loaded = true;
  function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
  var EVENTS=[
    {id:"e852_invest_data_v11",phase:"street",icon:"📊",title:"交易记录，是一座数据金矿",story:"你翻了翻交易记录——买入、卖出、盈亏、持仓……这些看似枯燥的数字，实际上记录了你的每一次决策和结果。",
      conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e852InvestDataDone)return false;if(!st.investment)return false;var _log=st.investment.tradeLog||[];return _log.length>=70&&st.player.day>=400},
      probability:0.05,repeatable:false,
      choices:[
        {text:"📊 分析我的交易数据",hint:"智力+28,会计XP+32,置_e852InvestDataAsset",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e852InvestDataDone=true;st.flags._e852InvestDataAsset=true;var _log=st.investment.tradeLog||[],_w=0,_t=_log.length;for(var _i=0;_i<_t;_i++){if((_log[_i].pnl||0)>0)_w++}st.flags._e852TradeWinRate=_t>0?Math.round(_w/_t*100):0;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",32);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 交易数据分析完成。胜率:"+(st.flags._e852TradeWinRate||0)+"%。智力+28,会计XP+32。","success")}},
        {text:"😅 交易记录没什么好看的",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e852InvestDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 交易记录没什么好看的。心智+5。","info")}}
      ]},
    {id:"e852_invest_story_v11",phase:"street",icon:"📖",title:"这笔交易，值得记一辈子",story:"你盯着账户里的数字——这一笔，赚/亏了你平时几个月的工资。",
      conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e852InvestStoryDone)return false;if(!st.investment)return false;var _log=st.investment.tradeLog||[];for(var _i=0;_i<_log.length;_i++){var _pnl=_log[_i].pnl||0;if(_pnl>=35000||_pnl<=-25000)return true}var _tp=st.investment._totalInvestmentProfit||0;return _tp>=150000||_tp<=-80000},
      probability:0.06,repeatable:false,
      choices:[
        {text:"📖 记录这笔交易的故事",hint:"心智+28,魅力+22,置_e852InvestStory",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e852InvestStoryDone=true;st.flags._e852InvestStory=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+28);st.player.charm=Math.min(100,(st.player.charm||50)+22)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 这笔交易的故事，值得记一辈子。心智+28,魅力+22。","success")}},
        {text:"😊 过去就过去了",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e852InvestStoryDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 过去就过去了。心情+5。","info")}}
      ]},
    {id:"e852_wealth_health_v11",phase:"street",icon:"💚",title:"财富健康，生命才有质量",story:"你算了算——总资产突破了七十万。",
      conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e852WealthHealthDone)return false;if(!st.resources)return false;return((st.resources.cash||0)+(st.resources.bankBalance||0))>=700000},
      probability:0.06,repeatable:false,
      choices:[
        {text:"💚 评估财富健康度",hint:"心智+28,会计XP+32,置_e852WealthHealthy",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e852WealthHealthDone=true;st.flags._e852WealthHealthy=true;var _d=(st.resources.villageDebt||0)+(st.resources.fineDebt||0)+(st.resources.bankDebt||0);var _a=(st.resources.cash||0)+(st.resources.bankBalance||0);st.flags._e852DebtToAssetRatio=_a>0?Math.round(_d/_a*100)/100:0;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+28);gx("accounting",32);if(typeof StateManager!=="undefined")StateManager.addMessage("💚 财富健康度评估完成——心智+28,会计XP+32。","success")}},
        {text:"😅 有钱就行",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e852WealthHealthDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 有钱就行。心智+3。","info")}}
      ]}
  ];
  for(var i=0;i<EVENTS.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===EVENTS[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(EVENTS[i])}
})();