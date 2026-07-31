/**
 * 域C(职业/成长) 联动增强 R987 — C→G职业健康平衡 / C→E技能投资回报 / C→D职业社交圈
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR987Loaded)return;RANDOM_EVENTS._domainCLinkageR987Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. C→G: 职业健康平衡 — 长期工作压力积累
{id:"c987_overwork",phase:"street",icon:"💊",title:"过劳的代价",
story:"你已经连续工作了很久，久到记不清上次休息是什么时候。\n\n身体开始出现各种小毛病:头痛、胃痛、腰酸背痛。\n\n你以为是年纪大了，其实是身体在提醒你——你不是机器，你需要休息。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c987OverworkDone)return false;if(!st.needs||!st.status)return false;return(st.needs.fatigue||0)>=60&&st.player.day>=70},
probability:0.05,repeatable:false,
choices:[{text:"💊 好好休息一天",hint:"健康+30,疲劳-28,心情+20,系统标记劳逸结合",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c987OverworkDone=true;st.flags._c987RestWell=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+30);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-28);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+20)}if(typeof StateManager!=="undefined")StateManager.addMessage("💊 健康+30,疲劳-28,心情+20。休息不是偷懒——是为了走更远的路。","success")}},
{text:"🔥 再扛一扛",hint:"健康-10,疲劳+15,系统标记硬撑者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c987OverworkDone=true;st.flags._c987Overworker=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-10);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+15);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-10,疲劳+15。你选择了硬撑——但身体不会永远配合你。","warning")}}]},
// 2. C→E: 技能投资回报 — 技能提升带来经济收益
{id:"c987_skill_worth",phase:"street",icon:"📈",title:"技能的价值",
story":"你发现了一个规律:每次技能提升后，收入都会跟着涨。\n\n这不是巧合——技能和收入之间，存在着正相关。\n\n你掌握了一项稀缺技能，就等于掌握了一个定价权。这就是为什么有些人靠一门手艺吃一辈子饭。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c987SkillWorthDone)return false;if(!st.skills)return false;var _maxLv=0;for(var _sk in st.skills){if(st.skills[_sk]&&st.skills[_sk].level>_maxLv)_maxLv=st.skills[_sk].level}return _maxLv>=30&&st.player.day>=180},
probability:0.04,repeatable:false,
choices:[{text:"📈 深耕高价值技能",hint:"智力+25,会计XP+30,系统标记技能深耕",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c987SkillWorthDone=true;st.flags._c987SkillDeep=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+30。技能是铁饭碗——真正的铁饭碗不是在一个地方吃一辈子，而是到哪里都有饭吃。","success")}},
{text:"😅 够用就行",hint:"现金+8000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c987SkillWorthDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+8000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+8000。","info")}}]},
// 3. C→D: 职业社交圈 — 技能提升带来社交圈变化
{id:"c987_skill_network",phase:"street",icon:"👥",title:"技能圈层",
story:"你发现一个有趣的现象:当你技能提升到一定程度后，身边人的水平也在提升。\n\n以前你身边都是和你差不多的人，现在你开始接触到行业里的大牛了。\n\n他们愿意和你交流，不是因为你好相处，而是因为你有他们认可的价值。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c987SkillNetworkDone)return false;if(!st.skills)return false;var _total=0;for(var _sk in st.skills){if(st.skills[_sk])_total+=st.skills[_sk].level||0}return _total>=35&&st.player.day>=120},
probability:0.04,repeatable:false,
choices:[{text:"👥 拓展高质量人脉",hint:"魅力+22,社交XP+30,系统标记高质量人脉",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c987SkillNetworkDone=true;st.flags._c987HighNetwork=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+22);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+22,社交XP+30。你的价值决定了你的人脉——人脉的本质是价值交换。","success")}},
{text:"😅 独来独往",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c987SkillNetworkDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();