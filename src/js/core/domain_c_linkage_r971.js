/**
 * 域C(职业/成长) 联动增强 R971 — C→G职业健康平衡 / C→E技能投资回报 / C→D职业社交圈
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR971Loaded)return;RANDOM_EVENTS._domainCLinkageR971Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. C→G: 职业健康平衡 — 长期工作疲劳积累
{id:"c971_work_fatigue",phase:"street",icon:"💊",title:"身体的警告",
story:"你最近总是觉得很累，早上起床像没睡一样。\n\n工作的时候注意力不集中，记忆力下降，连脾气都变差了。\n\n你查了一下——这些症状叫「职业倦怠」。不是病，但比病更可怕。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c971FatigueDone)return false;if(!st.needs||!st.status)return false;return(st.needs.fatigue||0)>=70&&st.player.day>=100},
probability:0.05,repeatable:false,
choices:[{text:"💊 给自己放个假",hint:"健康+25,疲劳-30,心情+20,系统标记劳逸结合",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c971FatigueDone=true;st.flags._c971Rest=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+25);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-30);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+20)}if(typeof StateManager!=="undefined")StateManager.addMessage("💊 健康+25,疲劳-30,心情+20。休息是为了走更远的路。","success")}},
{text:"🔥 再坚持一下",hint:"健康-10,疲劳+10,系统标记工作狂",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c971FatigueDone=true;st.flags._c971Workaholic2=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-10);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-10,疲劳+10。你选择了坚持——但身体的承受能力是有限的。","warning")}}]},
// 2. C→E: 技能投资回报 — 技能提升带来经济收益
{id:"c971_skill_income",phase:"street",icon:"📈",title:"技能就是金钱",
story:"你算了一笔账——学技能之前和之后，收入变化有多大。\n\n结果连你自己都吃了一惊。\n\n以前靠体力赚钱，一天累死累活也就几百块。现在靠技能赚钱，同样的时间，收入翻了不止一倍。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c971SkillIncomeDone)return false;if(!st.skills)return false;var _maxLv=0;for(var _sk in st.skills){if(st.skills[_sk]&&st.skills[_sk].level>_maxLv)_maxLv=st.skills[_sk].level}return _maxLv>=40&&st.player.day>=250},
probability:0.04,repeatable:false,
choices:[{text:"📈 继续深耕高价值技能",hint:"智力+28,会计XP+35,系统标记技能变现",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c971SkillIncomeDone=true;st.flags._c971SkillMonetize=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+28,会计XP+35。技能是性价比最高的投资——没有之一。","success")}},
{text:"😅 够花了就行",hint:"现金+10000,系统标记知足常乐",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c971SkillIncomeDone=true;st.flags._c971Content2=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+10000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+10000。知足常乐——但技能永远不嫌多。","info")}}]},
// 3. C→D: 职业社交圈 — 技能提升拓展社交圈
{id:"c971_skill_social",phase:"street",icon:"👥",title:"技能圈层",
story:"你发现随着技能提升，身边的朋友也在变化。\n\n以前聊的是哪家饭馆便宜、哪个工地招人。现在聊的是行业趋势、技术选型、副业机会。\n\n你的技能水平，决定了你的社交圈层。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c971SkillSocialDone)return false;if(!st.skills)return false;var _total=0;for(var _sk in st.skills){if(st.skills[_sk])_total+=st.skills[_sk].level||0}return _total>=50&&st.player.day>=180},
probability:0.04,repeatable:false,
choices:[{text:"👥 加入高技能社交圈",hint:"魅力+22,社交XP+35,系统标记技能圈层",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c971SkillSocialDone=true;st.flags._c971SkillCircle=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+22);gx("social",35);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+22,社交XP+35。你的圈子在升级——技能是最好的社交名片。","success")}},
{text:"😅 还是老友舒服",hint:"心情+15,系统标记念旧",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c971SkillSocialDone=true;st.flags._c971OldFriends2=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+15);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+15。老朋友懂你——但新朋友能带你看到更大的世界。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();