(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR980Loaded)return;RANDOM_EVENTS._domainDLinkageR980Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"d980_npc_story_echo_v1",phase:"street",icon:"💬",title:"朋友的往事",
story:"你和这位老朋友聊起了过去的事。他讲起年轻时的经历，让你对这个熟悉的人有了全新的认识。",
triggers:{minDay:25,interval:70,maxRepeats:4,excludeFlags:["_d980NpcStoryCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d980NpcStoryCd)return false;if(!st.relationships)return false;var _h=0;for(var _id in st.relationships){if(st.relationships[_id]&&st.relationships[_id].met&&(st.relationships[_id].affinity||0)>=40)_h++}return _h>=1&&st.player.day>=25;},
probability:0.04,repeatable:true,
choices:[
{text:"💬 认真倾听",hint:"心智+6,魅力+3,置_d980StoryListener",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d980NpcStoryCd=true;st.flags._d980StoryListener=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+6);st.player.charm=Math.min(100,(st.player.charm||50)+3)}if(typeof StateManager!=="undefined")StateManager.addMessage("💬 倾听了朋友往事——心智+6,魅力+3。","success");}},
{text:"😅 下次再说",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d980NpcStoryCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 下次再说。心智+3。","info");}}
]},
{id:"d980_invest_intel_v1",phase:"street",icon:"📰",title:"朋友带来的投资消息",
story:"你和朋友聊天时，无意中听到了一条投资消息。",
triggers:{minDay:40,interval:80,maxRepeats:3,excludeFlags:["_d980InvestIntelCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d980InvestIntelCd)return false;if(!st.relationships)return false;var _m=0;for(var _id2 in st.relationships){if(st.relationships[_id2]&&st.relationships[_id2].met)_m++}return _m>=2&&st.player.day>=40;},
probability:0.04,repeatable:true,
choices:[
{text:"📰 打听详情",hint:"智力+5,会计XP+6,置_d980IntelNetwork",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d980InvestIntelCd=true;st.flags._d980IntelNetwork=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);gx("accounting",6);if(typeof StateManager!=="undefined")StateManager.addMessage("📰 打听了投资消息——智力+5,会计XP+6。","success");}},
{text:"😅 不太可靠",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d980InvestIntelCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 不太可靠。心智+3。","info");}}
]},
{id:"d980_social_health_v1",phase:"street",icon:"❤️",title:"友情是最好的良药",
story:"你最近心情不太好，但朋友注意到了你的状态。有时候一句关心的话就能让人好起来。",
triggers:{minDay:12,interval:50,maxRepeats:5,excludeFlags:["_d980SocialHealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d980SocialHealthCd)return false;if(!st.relationships)return false;var _m2=0;for(var _id3 in st.relationships){if(st.relationships[_id3]&&st.relationships[_id3].met){_m2++;break}}if(_m2<1)return false;var _h2=(st.needs&&st.needs.happiness)||50;var _men=(st.player&&st.player.mental)||50;return(_h2<55||_men<50)&&st.player.day>=12;},
probability:0.05,repeatable:true,
choices:[
{text:"❤️ 接受关心",hint:"心情+8,心智+5,置_d980SocialHealed",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d980SocialHealthCd=true;st.flags._d980SocialHealed=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("❤️ 朋友的关心让你好多了——心情+8,心智+5。","success");}},
{text:"😅 想一个人待着",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d980SocialHealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 想一个人待着。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
