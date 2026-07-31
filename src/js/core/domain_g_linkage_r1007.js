/**
 * 域G(核心机制/生命周期) 联动增强 R1007 — G→A生命周期数据 / G→B人生章节叙事 / G→D社交里程碑
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR1007Loaded)return;RANDOM_EVENTS._domainGLinkageR1007Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. G→A: 生命周期数据—长期数据回顾
{id:"g1007_life_harvest",phase:"street",icon:"📊",title:"人生的收获",
story:"你翻开这些年积累的数据，看到了自己成长的轨迹。\n\n从最初的一无所有，到现在的有所积累；从最初的迷茫无助，到现在的从容坚定。\n\n数据不会说谎——这些年，你确实在一步一步往前走。每一步都算数。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1007HarvestDone)return false;return st.player.day>=300&&(st.player.age||20)>=28},
probability:0.03,repeatable:false,
choices:[{text:"📊 盘点人生收获",hint:"智力+28,心智+28,系统标记人生收获",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1007HarvestDone=true;st.flags._g1007Harvest=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);st.player.mental=Math.min(100,(st.player.mental||50)+28)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+28,心智+28。你盘点人生的收获——每一步都算数。","success")}},
{text:"😅 继续前行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1007HarvestDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. G→B: 人生章节—回顾人生重要转折
{id:"g1007_life_peace",phase:"street",icon:"📖",title:"与自己和解",
story:"你终于学会了和自己和解。\n\n不再为过去的错误自责，不再为未来的不确定焦虑。\n\n你接受了自己的不完美，也接受了自己的局限性。你明白了:人生不是一场完美的演出，而是一段真实的旅程。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1007PeaceDone)return false;return st.player.day>=400&&(st.player.age||20)>=35},
probability:0.03,repeatable:false,
choices:[{text:"📖 与自己和解",hint:"心智+35,魅力+20,系统标记内心平和",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1007PeaceDone=true;st.flags._g1007InnerPeace=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+35);st.player.charm=Math.min(100,(st.player.charm||20)+20)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+35,魅力+20。与自己和解——接受不完美，才是真正的完美。","success")}},
{text:"😔 还在路上",hint:"心智+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1007PeaceDone=true;st.flags._g1007OnWay=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。与自己和解是一生的课题——你已经在路上。","info")}}]},
// 3. G→D: 社交里程碑—社交圈的变化
{id:"g1007_social_circle",phase:"street",icon:"👥",title:"社交圈的沉淀",
// [全系统自洽修复] 域B R1016b 修复:story 键名残缺引号导致整文件 SyntaxError
story:"你发现经过时间的沉淀，身边的社交圈越来越清晰了。\n\n那些酒肉朋友渐渐淡出了你的生活，留下的是那些真正关心你的人。\n\n你不再为了社交而社交，而是把时间和精力留给那些值得的人。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1007CircleDone)return false;if(!st.relationships)return false;return(st.player.age||20)>=30&&st.player.day>=250},
probability:0.04,repeatable:false,
choices:[{text:"👥 珍惜沉淀的友情",hint:"心情+28,社交XP+30,系统标记友情沉淀",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1007CircleDone=true;st.flags._g1007CirclePure=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+28);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 心情+28,社交XP+30。时间会沉淀最真的友情——留下的都是值得珍惜的。","success")}},
{text:"😔 独处也好",hint:"心智+10,系统标记享受独处",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1007CircleDone=true;st.flags._g1007SoloEnjoy=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。独处是一种能力——享受独处的人，从不孤独。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();