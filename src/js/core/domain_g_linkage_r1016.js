/**
 * 域G(核心机制/生命周期) 联动增强 R1016 — G→A人生数据v23 / G→B人生章节叙事v23 / G→D社交里程碑v23 / G→E财富人生v23
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR1016Loaded)return;RANDOM_EVENTS._domainGLinkageR1016Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// G→A: 人生数据 — 年龄增长带来的人生经验反思
{id:"g1016_age_wisdom",phase:"street",icon:"🎂",title:"岁月的馈赠",story:"今天是你在这个城市的第365天。你坐在出租屋里，回想这一年的经历——从最初的茫然无措，到现在的游刃有余。时间真的能改变一个人。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1016YearDone)return false;return st.player&&st.player.day>=365&&st.player.day%365===0},
probability:0.15,repeatable:false,
choices:[{text:"🎂 写日记记录这一年的成长",hint:"智力+15,心智+12,置_g1016YearDiary",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1016YearDone=true;st.flags._g1016YearDiary=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+15);st.player.mental=Math.min(100,(st.player.mental||50)+12)}if(typeof StateManager!=="undefined")StateManager.addMessage("🎂 智力+15,心智+12。你写下了一年的感悟，文字是时间的见证者。","success")}},
{text:"📱 发个朋友圈感慨一下",hint:"名气+10,社交XP+20",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1016YearDone=true;if(st.player)st.player.fame=Math.min(100,(st.player.fame||0)+10);gx("social",20);if(typeof StateManager!=="undefined")StateManager.addMessage("📱 名气+10,社交XP+20。朋友们纷纷点赞留言，你感受到了温暖。","success")}}]},

// G→B: 人生章节叙事 — 重大人生转折点
{id:"g1016_life_chapter_turn",phase:"street",icon:"📖",title:"人生的十字路口",story:"你站在天桥上，看着桥下车水马龙。这座城市每天都在变化，你也在变。你突然意识到，自己正站在人生的一个转折点上。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1016ChapterDone)return false;return st.player&&st.player.day>=730&&(st.player.day%365===0)},
probability:0.2,repeatable:false,
choices:[{text:"📖 回顾过去，展望未来",hint:"心智+20,智力+10,置_g1016ChapterReflect",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1016ChapterDone=true;st.flags._g1016ChapterReflect=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+20);st.player.intelligence=Math.min(100,(st.player.intelligence||50)+10)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+20,智力+10。你回顾了这两年的旅程，对自己的未来更加清晰。","success")}},
{text:"🚶 继续往前走，不回头",hint:"心智+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1016ChapterDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("🚶 心智+10。你深吸一口气，继续向前走。过去已去，未来可期。","info")}}]},

// G→D: 社交里程碑 — 年长后社交圈自然变化
{id:"g1016_social_circle_shift",phase:"street",icon:"🔄",title:"朋友圈的变迁",story:"你发现最近联系的朋友越来越少，但留下来的都是真正知心的。年龄越大，越明白朋友不在多，而在真。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1016SocialShiftDone)return false;return st.player&&st.player.day>=500&&(st.player.age||20)>=30},
probability:0.06,repeatable:false,
choices:[{text:"🔄 主动联系老朋友",hint:"社交XP+35,心情+10,置_g1016Reconnected",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1016SocialShiftDone=true;st.flags._g1016Reconnected=true;gx("social",35);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("🔄 社交XP+35,心情+10。你给几个老朋友打了电话，聊得很开心。","success")}},
{text:"😊 珍惜眼前人",hint:"心智+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1016SocialShiftDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+10。你决定珍惜还在身边的人，用心经营每一段关系。","info")}}]},

// G→E: 财富人生 — 年龄增长带来的财富观念变化
{id:"g1016_wealth_perspective",phase:"street",icon:"💭",title:"钱的意义",story:"刚来这座城市的时候，你觉得钱就是一切。现在你明白了，钱很重要，但有些东西比钱更重要。你开始思考财富的真正意义。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1016WealthPerspectiveDone)return false;return st.player&&st.player.day>=600&&(st.player.age||20)>=35&&st.resources&&((st.resources.cash||0)+(st.resources.bankBalance||0))>=100000},
probability:0.05,repeatable:false,
choices:[{text:"💭 重新规划人生目标",hint:"心智+15,理财XP+30,置_g1016NewGoals",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1016WealthPerspectiveDone=true;st.flags._g1016NewGoals=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+15);gx("finance",30);if(typeof StateManager!=="undefined")StateManager.addMessage("💭 心智+15,理财XP+30。你重新审视了人生的优先级，钱是工具，不是目的。","success")}},
{text:"💰 继续攒钱，未雨绸缪",hint:"理财XP+20",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1016WealthPerspectiveDone=true;gx("finance",20);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 理财XP+20。你决定继续积累财富，为未来做更充分的准备。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();