(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainDLinkageR996Loaded)return;RANDOM_EVENTS._domainDLinkageR996Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"d996_npc_story_echo_v1",phase:"street",icon:"💬",title:"朋友的往事",
story:"你和这位老朋友聊起了过去的事，让你对这个熟悉的人有了全新的认识。",
triggers:{minDay:20,interval:55,maxRepeats:4,excludeFlags:["_d996NpcStoryCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d996NpcStoryCd)return false;if(!st.relationships)return false;var _h=0;for(var _id in st.relationships){if(st.relationships[_id]&&st.relationships[_id].met&&(st.relationships[_id].affinity||0)>=30)_h++}return _h>=1&&st.player.day>=20;},
probability:0.04,repeatable:true,
choices:[
{text:"💬 认真倾听",hint:"心智+5,魅力+2,置_d996StoryListener",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d996NpcStoryCd=true;st.flags._d996StoryListener=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+5);st.player.charm=Math.min(100,(st.player.charm||50)+2)}if(typeof StateManager!=="undefined")StateManager.addMessage("💬 倾听了朋友往事——心智+5,魅力+2。","success");}},
{text:"😅 下次再说",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d996NpcStoryCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 下次再说。心智+3。","info");}}
]},
{id:"d996_invest_intel_v1",phase:"street",icon:"📰",title:"朋友带来的投资消息",
story:"你和朋友聊天时，无意中听到了一条投资消息。",
triggers:{minDay:30,interval:65,maxRepeats:3,excludeFlags:["_d996InvestIntelCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d996InvestIntelCd)return false;if(!st.relationships)return false;var _m=0;for(var _id2 in st.relationships){if(st.relationships[_id2]&&st.relationships[_id2].met)_m++}return _m>=2&&st.player.day>=30;},
probability:0.04,repeatable:true,
choices:[
{text:"📰 打听详情",hint:"智力+4,会计XP+4,置_d996IntelNetwork",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d996InvestIntelCd=true;st.flags._d996IntelNetwork=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+4);gx("accounting",4);if(typeof StateManager!=="undefined")StateManager.addMessage("📰 打听了投资消息——智力+4,会计XP+4。","success");}},
{text:"😅 不太可靠",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d996InvestIntelCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 不太可靠。心智+3。","info");}}
]},
{id:"d996_social_health_v1",phase:"street",icon:"❤️",title:"友情是最好的良药",
story:"你最近心情不太好，但朋友注意到了你的状态。",
triggers:{minDay:8,interval:40,maxRepeats:5,excludeFlags:["_d996SocialHealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._d996SocialHealthCd)return false;if(!st.relationships)return false;var _m2=0;for(var _id3 in st.relationships){if(st.relationships[_id3]&&st.relationships[_id3].met){_m2++;break}}if(_m2<1)return false;var _h2=(st.needs&&st.needs.happiness)||50;var _men=(st.player&&st.player.mental)||50;return(_h2<65||_men<60)&&st.player.day>=8;},
probability:0.05,repeatable:true,
choices:[
{text:"❤️ 接受关心",hint:"心情+5,心智+4,置_d996SocialHealed",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d996SocialHealthCd=true;st.flags._d996SocialHealed=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+4);if(typeof StateManager!=="undefined")StateManager.addMessage("❤️ 朋友的关心让你好多了——心情+5,心智+4。","success");}},
{text:"😅 想一个人待着",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._d996SocialHealthCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 想一个人待着。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
