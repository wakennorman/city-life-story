/**
 * 域B(事件/叙事) 联动增强 R1010 — B→G事件韧性 / B→E经济智慧 / B→C职业灵感
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR1010Loaded)return;RANDOM_EVENTS._domainBLinkageR1010Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. B→G: 事件韧性 — 经历挫折后成长
{id:"b1010_storm",phase:"street",icon:"🌱",title:"风暴后的平静",
story:"你经历了一场人生的风暴。\n\n那些你以为过不去的坎，现在回头看，不过是一段经历。\n\n你发现了一个道理:风暴本身不可怕，可怕的是在风暴中失去方向。而你有方向，所以你不会迷路。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b1010StormDone)return false;var _eh=st.flags._eventHistory||[];var _neg=0;for(var _i=0;_i<_eh.length;_i++){if(_eh[_i]&&_eh[_i].type==="negative")_neg++}return _neg>=8&&st.player.day>=100},
probability:0.04,repeatable:false,
choices:[{text:"🌱 从风暴中成长",hint:"心智+30,系统标记风暴成长",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1010StormDone=true;st.flags._b1010StormGrown=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+30);if(typeof StateManager!=="undefined")StateManager.addMessage("🌱 心智+30。风暴过后，你发现自己比想象中更坚强。","success")}},
{text:"😔 只想休息",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1010StormDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+8。","info")}}]},
// 2. B→E: 经济智慧 — 经济事件触发反思
{id:"b1010_money_lesson",phase:"street",icon:"💡",title:"钱教我的事",
story:"你想起自己曾经因为不懂理财，吃过不少亏。\n\n但正是那些亏，让你学会了珍惜每一分钱，学会了规划未来。\n\n经验是最好的老师，虽然学费贵了点。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b1010LessonDone)return false;return st.player.day>=200&&(st.resources.totalEarned||0)>=150000},
probability:0.03,repeatable:false,
choices:[{text:"💡 总结理财经验",hint:"智力+22,会计XP+30,系统标记理财经验",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1010LessonDone=true;st.flags._b1010MoneyWise=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 智力+22,会计XP+30。经验是最好的老师——虽然学费贵了点。","success")}},
{text:"😅 过去的事",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1010LessonDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 3. B→C: 职业灵感 — 事件触发职业思考
{id:"b1010_career_spark",phase:"street",icon:"✨",title:"灵感的火花",
story:"你偶然看到了一个纪录片，讲的是一个普通人如何通过自己的努力改变命运。\n\n故事的主人公和你的起点差不多，但他做到了。\n\n你心里有一团火被点燃了——别人能做到的，你为什么不能？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b1010SparkDone)return false;return st.player.day>=120&&(st.player.intelligence||20)>=35},
probability:0.04,repeatable:false,
choices:[{text:"✨ 追随内心的火花",hint:"智力+20,技能XP+30,系统标记灵感火花",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1010SparkDone=true;st.flags._b1010Spark=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);var _skills=Object.keys(st.skills||{});if(_skills.length>0){var _sk=_skills[Random.int(0,_skills.length-1)];gx(_sk,30)}if(typeof StateManager!=="undefined")StateManager.addMessage("✨ 智力+20。灵感的火花被点燃了——你决定不再等待。","success")}},
{text:"😅 想想而已",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1010SparkDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();