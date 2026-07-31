/**
 * 域G(核心机制/生命周期) 联动增强 R999 — G→A生命周期数据 / G→B人生章节叙事 / G→D社交里程碑
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR999Loaded)return;RANDOM_EVENTS._domainGLinkageR999Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. G→A: 生命周期数据—长期数据回顾
{id:"g999_life_account",phase:"street",icon:"📊",title:"人生账本",
story:"你打开了自己的人生账本，上面记录着这些年所有的收支和成长。\n\n每一笔收入背后，都有一个努力的故事。每一次技能提升背后，都有无数个熬夜的夜晚。\n\n这个账本不仅是财务记录，更是你的人生编年史——它证明了你没有虚度光阴。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g999AccountDone)return false;return st.player.day>=350&&(st.player.age||20)>=30},
probability:0.03,repeatable:false,
choices:[{text:"📊 继续书写人生账本",hint:"智力+30,心智+30,系统标记人生账本",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g999AccountDone=true;st.flags._g999LifeAccount=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+30);st.player.mental=Math.min(100,(st.player.mental||50)+30)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+30,心智+30。你的人生账本越来越厚——每一页都值得认真书写。","success")}},
{text:"😅 活在当下",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g999AccountDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. G→B: 人生章节—回顾人生重要转折
{id:"g999_life_meaning",phase:"street",icon:"📖",title:"人生的意义",
story":"你开始思考一个深刻的问题:人生的意义是什么？\n\n是为了赚钱吗？是为了成功吗？是为了让别人看得起吗？\n\n你想了很久，然后得到了一个答案:人生的意义不在于你拥有什么，而在于你成为了什么样的人。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g999MeaningDone)return false;return st.player.day>=500&&(st.flags._lifeMilestones||[]).length>=5},
probability:0.03,repeatable:false,
choices:[{text:"📖 写下人生意义",hint:"心智+38,魅力+22,系统标记人生意义",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g999MeaningDone=true;st.flags._g999MeaningFound=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+38);st.player.charm=Math.min(100,(st.player.charm||20)+22)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+38,魅力+22。人生的意义不在于拥有什么——而在于你成为了什么样的人。","success")}},
{text:"😔 想不明白",hint:"心智+10,系统标记思考者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g999MeaningDone=true;st.flags._g999Thinker=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。有些问题没有标准答案——但思考本身就有意义。","info")}}]},
// 3. G→D: 社交里程碑—年龄增长带来社交圈变化
{id:"g999_social_depth",phase:"street",icon:"👥",title:"社交的深度",
story:"你发现真正好的关系，不需要刻意维护。\n\n那些需要你小心翼翼维系的，根本不是真朋友。真朋友是即使很久不联系，见面了还能像昨天刚见过一样。\n\n你开始把精力从「认识更多人」转移到「珍惜已经有的人」上。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g999DepthDone)return false;if(!st.relationships)return false;return(st.player.age||20)>=28&&st.player.day>=200},
probability:0.04,repeatable:false,
choices:[{text:"👥 珍惜深度关系",hint:"心情+30,社交XP+32,系统标记社交深度",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g999DepthDone=true;st.flags._g999DeepSocial=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+30);gx("social",32);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 心情+30,社交XP+32。真正的朋友不需要多——几个深度的关系，胜过一百个浅层的人脉。","success")}},
{text:"😔 独处也挺好",hint:"心智+10,系统标记内省者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g999DepthDone=true;st.flags._g999Introspect=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。独处不是孤独——是和自己对话。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();