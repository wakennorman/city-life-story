/**
 * 域G(核心机制/生命周期) 联动增强 R975 — G→A生命周期数据 / G→B人生章节叙事 / G→D社交里程碑
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR975Loaded)return;RANDOM_EVENTS._domainGLinkageR975Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. G→A: 生命周期数据—年龄增长触发数据回顾
{id:"g975_life_data",phase:"street",icon:"📊",title:"时间的痕迹",
story:"你看着镜子里的自己，发现岁月在脸上留下了痕迹。\n\n但你没有焦虑——因为你知道，每一道皱纹背后都有一个故事，每一根白发都是成长的代价。\n\n你打开手机里的记账软件，这些年攒下的不只是钱，还有智慧和从容。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g975LifeDataDone)return false;return(st.player.age||20)>=30&&st.player.day>=250},
probability:0.04,repeatable:false,
choices:[{text:"📊 记录人生数据",hint:"智力+25,心智+25,系统标记人生记录",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g975LifeDataDone=true;st.flags._g975LifeRecorder=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);st.player.mental=Math.min(100,(st.player.mental||50)+25)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+25,心智+25。你开始记录人生数据——每一刻都值得被记住。","success")}},
{text:"😅 活在当下",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g975LifeDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. G→B: 人生章节—回顾人生重要转折
{id:"g975_life_chapter",phase:"street",icon:"📖",title:"人生的转折点",
story:"你的人生中有几个重要的转折点。\n\n每一个选择，都把你带到了今天的位置。如果当初选了另一条路，你现在会在哪里？\n\n但你没有后悔——因为你知道，无论走哪条路，都会有风景，也都会有遗憾。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g975ChapterDone)return false;return st.player.day>=350&&(st.flags._lifeMilestones||[]).length>=3},
probability:0.03,repeatable:false,
choices:[{text:"📖 回顾人生转折",hint:"心智+30,魅力+18,系统标记人生回顾",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g975ChapterDone=true;st.flags._g975ChapterReview=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+30);st.player.charm=Math.min(100,(st.player.charm||20)+18)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+30,魅力+18。每一个选择都塑造了今天的你——这就是人生。","success")}},
{text:"😔 往事不可追",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g975ChapterDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+8。","info")}}]},
// 3. G→D: 社交里程碑—年龄增长带来社交圈变化
{id:"g975_social_milestone",phase:"street",icon:"👥",title:"朋友是一面镜子",
story:"你发现随着年龄增长，身边的朋友越来越少了。\n\n但留下的那些，都是真正懂你的人。\n\n他们会在你得意时泼冷水，在你失意时陪你喝酒，在你迷茫时给你指路。朋友不是越多越好，而是越真越好。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g975SocialMilestoneDone)return false;if(!st.relationships)return false;return(st.player.age||20)>=30&&st.player.day>=200},
probability:0.04,repeatable:false,
choices:[{text:"👥 珍惜真朋友",hint:"心情+28,社交XP+30,系统标记真朋友",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g975SocialMilestoneDone=true;st.flags._g975TrueFriends=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+28);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 心情+28,社交XP+30。朋友是一面镜子——他们让你看到真实的自己。","success")}},
{text:"😔 朋友越来越少",hint:"心智+10,系统标记孤独感",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g975SocialMilestoneDone=true;st.flags._g975Lonely2=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。朋友变少了，但留下的都是真的。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();