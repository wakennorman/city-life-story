(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainELinkageR1013Loaded)return;RANDOM_EVENTS._domainELinkageR1013Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"e1013_invest_story_v1",phase:"street",icon:"💰",title:"投资路上的故事",
story:"你翻看投资记录，每一笔交易背后都有一个故事。",
triggers:{minDay:20,interval:50,maxRepeats:4,excludeFlags:["_e1013InvestStoryCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1013InvestStoryCd)return false;if(!st.investment)return false;return((st.investment.totalInvested||0)+(st.investment.totalStockInvested||0))>=500&&st.player.day>=20;},
probability:0.04,repeatable:true,
choices:[
{text:"💰 回顾投资历程",hint:"心智+3,会计XP+3,置_e1013Investor",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1013InvestStoryCd=true;st.flags._e1013Investor=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);gx("accounting",3);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 回顾了投资历程——心智+3,会计XP+3。","success");}},
{text:"😅 过去了",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1013InvestStoryCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 过去了。心智+3。","info");}}
]},
{id:"e1013_skill_invest_v1",phase:"street",icon:"📚",title:"盈利了，投资自己",
story:"投资赚了钱，你思考怎么用这笔钱创造更大的价值。",
triggers:{minDay:15,interval:40,maxRepeats:4,excludeFlags:["_e1013SkillInvestCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1013SkillInvestCd)return false;if(!st.investment)return false;return((st.investment.totalProfit||0)+(st.investment.totalStockProfit||0))>=200&&st.player.day>=15;},
probability:0.04,repeatable:true,
choices:[
{text:"📚 投资自己学技能",hint:"智力+2,管理XP+3,置_e1013SelfInvestor",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1013SkillInvestCd=true;st.flags._e1013SelfInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+2);gx("management",3);if(typeof StateManager!=="undefined")StateManager.addMessage("📚 投资自己学技能——智力+2,管理XP+3。","success");}},
{text:"😅 享受生活",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1013SkillInvestCd=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 享受生活。心情+5。","info");}}
]},
{id:"e1013_social_circle_v1",phase:"street",icon:"🤝",title:"投资成功，朋友圈扩大",
story:"你的投资眼光在朋友圈里传开了，连以前不太熟的人都来请教。",
triggers:{minDay:25,interval:60,maxRepeats:3,excludeFlags:["_e1013SocialCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._e1013SocialCd)return false;if(!st.relationships||!st.investment)return false;return((st.investment.totalProfit||0)+(st.investment.totalStockProfit||0))>=1000&&st.player.day>=25;},
probability:0.04,repeatable:true,
choices:[
{text:"🤝 分享投资心得",hint:"魅力+2,好感+2,置_e1013Social",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1013SocialCd=true;st.flags._e1013Social=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||50)+2);if(st.relationships&&typeof applyAffinityChange==="function"){var _ids=[];for(var _id in st.relationships){if(st.relationships[_id]&&st.relationships[_id].met)_ids.push(_id)}if(_ids.length>0){var _p=typeof Random!=="undefined"?Random.int(0,_ids.length-1):0;applyAffinityChange(st,_ids[_p],2,"投资心得")}}if(typeof StateManager!=="undefined")StateManager.addMessage("🤝 分享了投资心得——魅力+2。","success");}},
{text:"😅 低调",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._e1013SocialCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 低调。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
