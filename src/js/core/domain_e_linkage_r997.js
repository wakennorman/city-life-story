/**
 * 域E(经济/投资) 联动增强 R997 — E→B投资故事叙事 / E→C技能投资回报 / E→D投资者社交圈
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR997Loaded)return;RANDOM_EVENTS._domainELinkageR997Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. E→B: 投资故事 — 投资经历触发叙事
{id:"e997_invest_mistake",phase:"street",icon:"📖",title:"那些年交过的学费",
story:"你坐在电脑前，翻看着自己过去的交易记录。\n\n那些追涨杀跌的操作、那些听消息买的股票、那些亏了就不敢看的账户——现在看起来又好笑又心疼。\n\n但你并不后悔，因为你知道:那些亏掉的钱，都是学费。它们教会了你敬畏市场。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e997MistakeDone)return false;if(!st.investment)return false;return st.player.day>=250&&(st.investment.stockHoldings||[]).length>=3},
probability:0.03,repeatable:false,
choices:[{text:"📖 总结教训，建立纪律",hint:"心智+28,会计XP+32,系统标记投资纪律",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e997MistakeDone=true;st.flags._e997InvDiscipline=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+28);gx("accounting",32);if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+28,会计XP+32。交过的学费不会白费——你建立了自己的投资纪律。","success")}},
{text:"😅 不堪回首",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e997MistakeDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. E→C: 技能投资回报 — 投资知识带来收益
{id:"e997_invest_skill",phase:"street",icon:"📈",title:"投资技能树",
story":"你发现投资能力就像一棵技能树。\n\n从最基础的会计知识，到进阶的财报分析，再到高级的资产配置——每一点进步，都让你在市场中多一分胜算。\n\n投资不是赌博，是一项技能。既然是技能，就可以通过学习和练习来提升。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e997SkillDone)return false;return st.player.day>=200&&(st.skills.accounting.level||0)>=22},
probability:0.04,repeatable:false,
choices:[{text:"📈 点亮投资技能树",hint:"智力+28,会计XP+35,系统标记投资技能树",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e997SkillDone=true;st.flags._e997SkillTreeInv=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+28,会计XP+35。你的投资技能树在成长——每一分学习都不会白费。","success")}},
{text:"😅 够用了",hint:"现金+10000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e997SkillDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+10000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+10000。","info")}}]},
// 3. E→D: 投资者社交圈 — 投资带来社交圈变化
{id:"e997_invest_tribe",phase:"street",icon:"👥",title:"投资者的部落",
story":"你参加了一个投资社群，发现这里的人都有一个共同点。\n\n他们不抱怨市场、不骂庄家、不幻想一夜暴富。他们只做一件事:学习、思考、执行。\n\n你终于找到了自己的部落——一群和你一样，相信理性投资的人。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e997TribeDone)return false;return st.player.day>=150&&(st.resources.cash||0)>=25000},
probability:0.03,repeatable:false,
choices:[{text:"👥 融入投资部落",hint:"魅力+22,社交XP+35,系统标记投资部落",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e997TribeDone=true;st.flags._e997InvTribe=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+22);gx("social",35);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+22,社交XP+35。你找到了自己的部落——和优秀的人在一起，你也会变得优秀。","success")}},
{text:"😅 独来独往",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e997TribeDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();