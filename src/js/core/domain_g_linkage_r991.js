/**
 * 域G(核心机制/生命周期) 联动增强 R991 — G→A生命周期数据 / G→B人生章节叙事 / G→D社交里程碑
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR991Loaded)return;RANDOM_EVENTS._domainGLinkageR991Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. G→A: 生命周期数据—年龄增长触发数据回顾
{id:"g991_life_legacy",phase:"street",icon:"📊",title:"人生的数据遗产",
story:"你翻看着这些年的记录，发现了一个惊人的事实。\n\n你的人生轨迹，就是一堆数据构成的:每天的收入支出、每一次技能提升、每一段人际关系的起伏。\n\n这些数据不仅是回忆，更是你留给这个世界的遗产。它们证明你曾经认真活过。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g991LegacyDone)return false;return(st.player.age||20)>=35&&st.player.day>=300},
probability:0.03,repeatable:false,
choices:[{text:"📊 整理人生数据遗产",hint:"智力+28,心智+28,系统标记数据遗产",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g991LegacyDone=true;st.flags._g991DataLegacy=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);st.player.mental=Math.min(100,(st.player.mental||50)+28)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+28,心智+28。你的人生数据就是你的遗产——每一笔都值得被铭记。","success")}},
{text:"😅 活在当下",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g991LegacyDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. G→B: 人生章节—回顾人生重要转折
{id:"g991_life_reflect",phase:"street",icon:"📖",title:"人生的回响",
story:"你静静地坐在窗前，回想这些年走过的路。\n\n有些选择现在看起来是对的，有些是错的——但无论对错，它们都是你人生的一部分。\n\n你不再后悔任何事，因为你知道:正是那些所谓的「错误」，把你带到了今天的位置。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g991ReflectDone)return false;return st.player.day>=400&&(st.flags._lifeMilestones||[]).length>=4},
probability:0.03,repeatable:false,
choices:[{text:"📖 写下人生感悟",hint:"心智+35,魅力+20,系统标记人生回响",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g991ReflectDone=true;st.flags._g991LifeReflect=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+35);st.player.charm=Math.min(100,(st.player.charm||20)+20)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+35,魅力+20。人生没有白走的路——每一步都算数。","success")}},
{text:"😔 往事如烟",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g991ReflectDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+8。","info")}}]},
// 3. G→D: 社交里程碑—年龄增长带来社交圈变化
{id:"g991_social_wisdom",phase:"street",icon:"👥",title:"社交的智慧",
// [全系统自洽修复] 域B R1016b 修复:story 键名残缺引号导致整文件 SyntaxError
story:"你发现随着年龄增长，自己对社交的理解越来越深刻了。\n\n年轻时觉得朋友多就是本事，现在觉得能维持一段长久的关系才是本事。\n\n真正的朋友不需要天天联系，但你需要的时候，他们一定在。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g991SocialWisdomDone)return false;if(!st.relationships)return false;return(st.player.age||20)>=30&&st.player.day>=250},
probability:0.04,repeatable:false,
choices:[{text:"👥 经营长久的关系",hint:"心情+28,社交XP+30,系统标记社交智慧",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g991SocialWisdomDone=true;st.flags._g991SocialWise=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+28);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 心情+28,社交XP+30。真正的朋友不需要多——几个真心的，胜过一百个泛泛之交。","success")}},
{text:"😔 独处也挺好",hint:"心智+10,系统标记享受独处",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g991SocialWisdomDone=true;st.flags._g991SoloWise=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。独处是一种能力——不是所有人都能和自己好好相处。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();