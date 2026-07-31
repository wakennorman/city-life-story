/**
 * 域B(事件/叙事) 联动增强 R962 — B→G伤痕即勋章 / B→E理财体系 / B→C天赋探索
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR962Loaded)return;RANDOM_EVENTS._domainBLinkageR962Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// [全系统自洽修复] 域B R1016b 修复:story": 键名多余引号→整文件SyntaxError,IIFE永不执行(3事件死)且阻断全站build
// 1. B→G: 伤痕即勋章 — 经历多次挫折后触发韧性成长
{id:"b962_scar_to_star",phase:"street",icon:"⭐",title:"伤疤是勇士的勋章",
story:"你站在这座城市的最高处，俯瞰万家灯火。\n\n每一盏灯下，都有一个故事。而你的故事，比别人多了几道伤疤。\n\n但正是这些伤疤，让你成为了今天的自己——更坚韧、更清醒、更懂得珍惜。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b962ScarDone)return false;var _eh=st.flags._eventHistory||[];var _neg=0;for(var _i=0;_i<_eh.length;_i++){if(_eh[_i]&&_eh[_i].type==="negative")_neg++}return _neg>=20&&st.player.day>=300},
probability:0.03,repeatable:false,
choices:[{text:"⭐ 拥抱自己的伤疤",hint:"心智+45,系统标记浴火重生",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b962ScarDone=true;st.flags._b962Phoenix=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+45);if(typeof StateManager!=="undefined")StateManager.addMessage("⭐ 心智+45。那些伤疤，是你最荣耀的勋章。","success")}},
{text:"😔 不想再提了",hint:"心智+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b962ScarDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。","info")}}]},
// 2. B→E: 理财体系 — 经历经济波动后触发财务智慧
{id:"b962_econ_mastery",phase:"street",icon:"💡",title:"经济周期中的生存法则",
story:"你经历了这座城市的经济起伏——从繁荣到萧条，再到复苏。\n\n你学会了在经济好的时候多存钱，不好的时候少花钱。学会了在别人贪婪时恐惧，在别人恐惧时贪婪。\n\n这些课本上学不到的智慧，是这座城市教给你的。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b962EconMasteryDone)return false;return st.player.day>=400&&(st.resources.totalEarned||0)>=800000},
probability:0.03,repeatable:false,
choices:[{text:"💡 总结经济周期经验",hint:"智力+30,会计XP+40,系统标记经济周期大师",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b962EconMasteryDone=true;st.flags._b962CycleMaster=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+30);gx("accounting",40);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 智力+30,会计XP+40。你掌握了经济周期的规律——胜券在握。","success")}},
{text:"😅 随波逐流",hint:"现金+10000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b962EconMasteryDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+10000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+10000。","info")}}]},
// 3. B→C: 天赋探索 — 偶然事件触发职业转型思考
{id:"b962_talent_unlock",phase:"street",icon:"🔑",title:"天赋解锁",
story:"你无意中发现自己在某件事上特别有天赋。\n\n这件事不是别人告诉你的，而是你在无数次尝试中自己发现的——当你做这件事的时候，你感觉不到时间的流逝。\n\n这就是你的天赋所在。找到它，你就找到了人生的方向。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b962TalentUnlockDone)return false;return st.player.day>=200&&(st.player.intelligence||20)>=60&&st.player.phase==="street"},
probability:0.03,repeatable:false,
choices:[{text:"🔑 全力发展天赋",hint:"智力+25,技能XP+50,系统标记天赋觉醒",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b962TalentUnlockDone=true;st.flags._b962TalentAwake=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);var _skills=Object.keys(st.skills||{});if(_skills.length>0){var _sk=_skills[Random.int(0,_skills.length-1)];gx(_sk,50)}if(typeof StateManager!=="undefined")StateManager.addMessage("🔑 智力+25。你找到了自己的天赋——人生从此不同。","success")}},
{text:"😅 天赋不能当饭吃",hint:"现金+5000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b962TalentUnlockDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+5000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+5000。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();