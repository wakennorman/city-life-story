/**
 * 域C(职业/成长) 联动增强 R979 — C→G职业健康平衡 / C→E技能投资回报 / C→D职业社交圈
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR979Loaded)return;RANDOM_EVENTS._domainCLinkageR979Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. C→G: 职业健康平衡 — 长期工作压力积累
{id:"c979_work_stress",phase:"street",icon:"💊",title:"压力的重量",
story:"你最近总是睡不好，梦里都在处理工作的事。\n\n早上醒来比睡前还累，吃饭没胃口，对什么都提不起兴趣。\n\n你查了一下——这些是慢性压力的典型症状。你的身体在告诉你:该停下来喘口气了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c979StressDone)return false;if(!st.needs||!st.status)return false;return(st.needs.fatigue||0)>=65&&st.player.day>=80},
probability:0.05,repeatable:false,
choices:[{text:"💊 给自己放个假",hint:"健康+28,疲劳-25,心情+22,系统标记减压",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c979StressDone=true;st.flags._c979DeStress=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+28);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-25);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+22)}if(typeof StateManager!=="undefined")StateManager.addMessage("💊 健康+28,疲劳-25,心情+22。你学会了休息——压力不是敌人，忽视压力才是。","success")}},
{text:"🔥 咬牙坚持",hint:"健康-8,疲劳+15,系统标记硬撑者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c979StressDone=true;st.flags._c979Gritter=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-8);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+15);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-8,疲劳+15。你选择了咬牙坚持——但身体的承受能力是有限的。","warning")}}]},
// 2. C→E: 技能投资回报 — 技能提升带来经济收益
{id:"c979_skill_value",phase:"street",icon:"📈",title:"技能的价值",
// [全系统自洽修复] 域B R1016b 修复:story 键名残缺引号导致整文件 SyntaxError
story:"你算了一笔账——那些你花在学习和提升上的时间，到底值不值。\n\n结果让你很欣慰:每一分投入，都以更高的收入回报了你。\n\n技能不是成本，是投资。而且是这个世界上唯一稳赚不赔的投资。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c979SkillValueDone)return false;if(!st.skills)return false;var _maxLv=0;for(var _sk in st.skills){if(st.skills[_sk]&&st.skills[_sk].level>_maxLv)_maxLv=st.skills[_sk].level}return _maxLv>=35&&st.player.day>=200},
probability:0.04,repeatable:false,
choices:[{text:"📈 继续投资技能",hint:"智力+25,会计XP+32,系统标记技能投资者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c979SkillValueDone=true;st.flags._c979SkillInvestor2=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",32);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+32。技能是唯一不会贬值的资产——继续投资自己。","success")}},
{text:"😅 够用了",hint:"现金+8000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c979SkillValueDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+8000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+8000。","info")}}]},
// 3. C→D: 职业社交圈 — 技能提升带来社交圈变化
{id:"c979_skill_circle",phase:"street",icon:"👥",title:"技能圈层",
story:"你发现随着技能提升，身边的人也在悄悄变化。\n\n以前和你一起发牢骚的人渐渐淡了，取而代之的是那些能给你建议、启发你的人。\n\n你的水平，决定了你身边人的水平。你身边人的水平，又反过来决定了你的上限。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c979SkillCircleDone)return false;if(!st.skills)return false;var _total=0;for(var _sk in st.skills){if(st.skills[_sk])_total+=st.skills[_sk].level||0}return _total>=40&&st.player.day>=150},
probability:0.04,repeatable:false,
choices:[{text:"👥 提升圈层",hint:"魅力+20,社交XP+32,系统标记圈层升级",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c979SkillCircleDone=true;st.flags._c979CircleUpgrade=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+20);gx("social",32);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+20,社交XP+32。你的圈层在升级——你正在成为更好的自己。","success")}},
{text:"😅 独善其身",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c979SkillCircleDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();