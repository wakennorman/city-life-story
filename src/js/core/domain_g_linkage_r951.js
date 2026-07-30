(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR951Loaded)return;RANDOM_EVENTS._domainGLinkageR951Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"g951_life_data_reflect_v1",phase:"street",icon:"📊",title:"时间记录，数据沉淀",
story:"日子一天天过去，你积累的数据越来越多。翻看这些记录，你能看到自己走过的路。",
triggers:{minDay:45,interval:45,maxRepeats:12,excludeFlags:["_g951DataReflectCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g951DataReflectCd)return false;return st.player.day>=45&&st.player.day%45===0;},
probability:0.03,repeatable:true,
choices:[
{text:"📊 查看成长数据",hint:"心智+8,会计XP+10,置_g951DataAware",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g951DataReflectCd=true;st.flags._g951DataAware=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);gx("accounting",10);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 查看了成长数据——心智+8,会计XP+10。","success");}},
{text:"😅 继续前进",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g951DataReflectCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 继续前进。心智+3。","info");}}
]},
{id:"g951_life_chapter_v1",phase:"street",icon:"📖",title:"人生新篇章",
story:"你意识到自己走过了人生的一段重要旅程。回头看看，那些曾经觉得过不去的坎，现在都成了谈资。",
triggers:{minDay:75,interval:160,maxRepeats:3,excludeFlags:["_g951LifeChapterCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g951LifeChapterCd)return false;var _d=st.player.day||0;return(_d===75||_d===160||_d===365)&&!st.flags["_g951Chapter_"+_d];},
probability:0.06,repeatable:true,
choices:[
{text:"📖 写下感悟",hint:"心智+15,魅力+6,置_g951Writer",apply:function(st){if(!st)return;st.flags=st.flags||{};var _d=(st.player&&st.player.day)||0;st.flags._g951LifeChapterCd=true;st.flags["_g951Chapter_"+_d]=true;st.flags._g951Writer=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+15);st.player.charm=Math.min(100,(st.player.charm||50)+6)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 写下了感悟——心智+15,魅力+6。","success");}},
{text:"😅 继续赶路",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};var _d2=(st.player&&st.player.day)||0;st.flags._g951LifeChapterCd=true;st.flags["_g951Chapter_"+_d2]=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 继续赶路。心智+5。","info");}}
]},
{id:"g951_social_milestone_v1",phase:"street",icon:"🎂",title:"时间沉淀的友谊",
story:"你在这座城市待得越久，身边的人也在慢慢变化。时间是最好的过滤器。",
triggers:{minDay:35,interval:80,maxRepeats:5,excludeFlags:["_g951SocialMilestoneCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g951SocialMilestoneCd)return false;if(!st.relationships)return false;var _m=0;for(var _id in st.relationships){if(st.relationships[_id]&&st.relationships[_id].met)_m++}return _m>=2&&st.player.day>=35;},
probability:0.04,repeatable:true,
choices:[
{text:"🎂 和老朋友聚聚",hint:"心情+10,魅力+5,好感+3,置_g951SocialTies",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g951SocialMilestoneCd=true;st.flags._g951SocialTies=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(st.player)st.player.charm=Math.min(100,(st.player.charm||50)+5);if(st.relationships&&typeof applyAffinityChange==="function"){var _ids=[];for(var _id2 in st.relationships){if(st.relationships[_id2]&&st.relationships[_id2].met)_ids.push(_id2)}if(_ids.length>0){var _p=typeof Random!=="undefined"?Random.int(0,_ids.length-1):0;applyAffinityChange(st,_ids[_p],3,"时间沉淀友谊")}}if(typeof StateManager!=="undefined")StateManager.addMessage("🎂 和老朋友聚了聚——心情+10,魅力+5。","success");}},
{text:"😅 各自忙",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g951SocialMilestoneCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 各自忙。心智+3。","info");}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
