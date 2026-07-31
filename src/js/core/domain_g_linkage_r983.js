/**
 * 域G(核心机制/生命周期) 联动增强 R983 — G→A生命周期数据 / G→B人生章节叙事 / G→D社交里程碑
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR983Loaded)return;RANDOM_EVENTS._domainGLinkageR983Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. G→A: 生命周期数据—年龄增长触发数据回顾
{id:"g983_life_data",phase:"street",icon:"📊",title:"岁月的馈赠",
story:"你打开手机备忘录，上面记录着这些年来的点点滴滴。\n\n「25岁:第一次独立租房。30岁:攒到了第一个10万。35岁:终于有了自己的家。」\n\n每一个里程碑背后，都是无数个努力的日夜。你忽然觉得，这些年没有白过。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g983LifeDataDone)return false;return(st.player.age||20)>=28&&st.player.day>=200},
probability:0.04,repeatable:false,
choices:[{text:"📊 继续书写人生数据",hint:"智力+25,心智+28,系统标记岁月记录者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g983LifeDataDone=true;st.flags._g983LifeRecorder=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);st.player.mental=Math.min(100,(st.player.mental||50)+28)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+25,心智+28。岁月不会辜负认真生活的人——你所有的努力都在数据里。","success")}},
{text:"😅 过好当下就够了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g983LifeDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. G→B: 人生章节—回顾人生重要转折
{id:"g983_life_chapter",phase:"street",icon:"📖",title:"人生的篇章",
story:"你坐在窗前，回想这些年经历的一切。\n\n那些曾经让你痛不欲生的挫折，现在看都是成长的阶梯。那些曾经让你欣喜若狂的成就，现在看只是路上的风景。\n\n人生就是一本书，翻过这一页，才能看到下一页。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g983ChapterDone)return false;return st.player.day>=300&&(st.flags._lifeMilestones||[]).length>=2},
probability:0.03,repeatable:false,
choices:[{text:"📖 写下人生感悟",hint:"心智+32,魅力+18,系统标记人生感悟",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g983ChapterDone=true;st.flags._g983LifeWisdom=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+32);st.player.charm=Math.min(100,(st.player.charm||20)+18)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+32,魅力+18。你的人生感悟——每一页都值得被认真对待。","success")}},
{text:"😔 继续前行",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g983ChapterDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+8。","info")}}]},
// 3. G→D: 社交里程碑—年龄增长带来社交圈变化
{id:"g983_social_ring",phase:"street",icon:"👥",title:"社交圈的进化",
// [全系统自洽修复] 域B R1016b 修复:story 键名残缺引号导致整文件 SyntaxError
story:"你发现自己的社交圈在悄悄变化。\n\n以前喜欢热闹，哪里人多往哪去。现在更喜欢和三五知己小聚，聊一些有深度的话题。\n\n这不是变得孤僻了，而是你开始懂得——高质量的独处，胜过低质量的社交。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g983SocialRingDone)return false;if(!st.relationships)return false;return(st.player.age||20)>=28&&st.player.day>=180},
probability:0.04,repeatable:false,
choices:[{text:"👥 享受高质量社交",hint:"心情+25,社交XP+28,系统标记高质量社交",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g983SocialRingDone=true;st.flags._g983QualitySocial=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25);gx("social",28);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 心情+25,社交XP+28。高质量的社交，胜过一百个泛泛之交。","success")}},
{text:"😔 独处也挺好",hint:"心智+10,系统标记享受独处",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g983SocialRingDone=true;st.flags._g983Solo=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。独处不是孤独——是和自己对话。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();