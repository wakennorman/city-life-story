/**
 * 域C(职业/成长) 联动增强 R995 — C→G职业健康平衡 / C→E技能投资回报 / C→D职业社交圈
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR995Loaded)return;RANDOM_EVENTS._domainCLinkageR995Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. C→G: 职业健康平衡 — 长期工作压力积累
{id:"c995_burnout",phase:"street",icon:"💊",title:"燃烧殆尽",
story":"你感觉自己像一根快燃尽的蜡烛。\n\n每天醒来都觉得累，工作的时候提不起劲，下班后只想躺着。\n\n你以前热爱的工作，现在变成了负担。这不是懒惰——这是职业倦怠。你需要的不是更多的工作，而是更好的生活。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c995BurnoutDone)return false;if(!st.needs||!st.status)return false;return(st.needs.fatigue||0)>=55&&st.player.day>=60},
probability:0.05,repeatable:false,
choices:[{text:"💊 调整生活节奏",hint:"健康+30,疲劳-30,心情+25,系统标记生活平衡",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c995BurnoutDone=true;st.flags._c995LifeBalance=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+30);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-30);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25)}if(typeof StateManager!=="undefined")StateManager.addMessage("💊 健康+30,疲劳-30,心情+25。你学会了调整节奏——生活不是只有工作。","success")}},
{text:"🔥 再拼一把",hint:"健康-10,疲劳+15,系统标记追逐者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c995BurnoutDone=true;st.flags._c995Chaser=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-10);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+15);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-10,疲劳+15。你选择了继续拼——但别忘了，身体是革命的本钱。","warning")}}]},
// 2. C→E: 技能投资回报 — 技能提升带来经济收益
{id:"c995_skill_upside",phase:"street",icon:"📈",title:"技能的上限",
story":"你发现了一个有趣的现象:技能的提升空间，决定了你的收入上限。\n\n体力劳动的技能上限很低，做几年就到顶了。但脑力劳动的上限很高——你还在不断进步。\n\n这就是为什么有的人越老越值钱，有的人越老越焦虑。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c995SkillUpsideDone)return false;if(!st.skills)return false;var _maxLv=0;for(var _sk in st.skills){if(st.skills[_sk]&&st.skills[_sk].level>_maxLv)_maxLv=st.skills[_sk].level}return _maxLv>=25&&st.player.day>=150},
probability:0.04,repeatable:false,
choices:[{text:"📈 提升技能上限",hint:"智力+25,会计XP+30,系统标记技能上限",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c995SkillUpsideDone=true;st.flags._c995SkillUp=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+30。技能的上限就是你的收入上限——永远不要停止学习。","success")}},
{text:"😅 够用就行",hint:"现金+8000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c995SkillUpsideDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+8000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+8000。","info")}}]},
// 3. C→D: 职业社交圈 — 技能提升带来社交圈变化
{id:"c995_skill_tribe",phase:"street",icon:"👥",title:"技能的部落",
story":"你发现掌握一项技能，就像加入了一个部落。\n\n会修车的人，有修车人的圈子。会编程的人，有编程人的圈子。\n\n技能是你的通行证——它让你进入一个以前进不去的世界，认识一群以前接触不到的人。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c995TribeDone)return false;if(!st.skills)return false;var _total=0;for(var _sk in st.skills){if(st.skills[_sk])_total+=st.skills[_sk].level||0}return _total>=30&&st.player.day>=100},
probability:0.04,repeatable:false,
choices:[{text:"👥 加入技能部落",hint:"魅力+20,社交XP+30,系统标记技能部落",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c995TribeDone=true;st.flags._c995TribeJoin=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+20);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+20,社交XP+30。技能是你的通行证——它为你打开了一扇新世界的大门。","success")}},
{text:"😅 独自行走",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c995TribeDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();