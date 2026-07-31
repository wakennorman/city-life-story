/**
 * 域E(经济/投资) 联动增强 R973 — E→B投资故事叙事 / E→C技能投资回报 / E→D投资者社交圈
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR973Loaded)return;RANDOM_EVENTS._domainELinkageR973Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. E→B: 投资故事 — 投资成功/失败触发叙事
{id:"e973_invest_story",phase:"street",icon:"📖",title:"投资就像人生",
story:"你看着账户里的盈亏数字，想起了第一次投资时的自己。\n\n那时候什么都不懂，听人说哪个好就买哪个，亏了就不敢再看账户。\n\n现在你明白了——投资和人生一样，重要的不是一次输赢，而是长期活下去。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e973InvestStoryDone)return false;if(!st.investment)return false;var _h=st.investment.stockHoldings||[];return _h.length>=3&&st.player.day>=200},
probability:0.04,repeatable:false,
choices:[{text:"📖 总结投资心得",hint:"心智+25,会计XP+30,系统标记投资心得",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e973InvestStoryDone=true;st.flags._e973InvWisdom=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+25,会计XP+30。你总结了自己的投资心得——经验是最好的老师。","success")}},
{text:"😅 过去的就过去了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e973InvestStoryDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. E→C: 技能投资回报 — 投资技能提升带来收益
{id:"e973_invest_skill",phase:"street",icon:"📈",title:"投资自己是最好的投资",
story:"你算了算自己在学习投资知识上投入的时间和金钱。\n\n买书、上课、付费咨询——这些花了不少钱。\n\n但正是因为这些投入，你才能在市场波动中保持冷静，在别人恐慌时找到机会。投资自己的回报率，远超任何理财产品。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e973InvestSkillDone)return false;return st.player.day>=250&&(st.skills.accounting.level||0)>=20},
probability:0.04,repeatable:false,
choices:[{text:"📈 继续深入学习投资",hint:"智力+28,会计XP+35,系统标记投资学习",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e973InvestSkillDone=true;st.flags._e973InvLearner=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+28,会计XP+35。投资自己——这是回报率最高的投资。","success")}},
{text:"😅 够用了",hint:"现金+8000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e973InvestSkillDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+8000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+8000。","info")}}]},
// 3. E→D: 投资者社交圈 — 投资带来社交圈变化
{id:"e973_invest_social",phase:"street",icon:"👥",title:"投资圈的人脉",
story:"你参加了一个投资交流活动，认识了不少有意思的人。\n\n有做了十年股票的老股民，有专注数字货币的年轻极客，还有靠房产投资实现财务自由的中年人。\n\n每个人都有自己的投资哲学，你从他们身上学到了很多。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e973InvestSocialDone)return false;if(!st.relationships)return false;return st.player.day>=180&&(st.resources.cash||0)>=50000},
probability:0.03,repeatable:false,
choices:[{text:"👥 拓展投资圈人脉",hint:"魅力+20,社交XP+30,系统标记投资圈",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e973InvestSocialDone=true;st.flags._e973InvCircle=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+20);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+20,社交XP+30。你的投资圈人脉在扩大——信息就是金钱。","success")}},
{text:"😅 独来独往",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e973InvestSocialDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();