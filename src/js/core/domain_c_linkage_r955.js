/**
 * 域C(职业/成长) 联动增强 R955 — C→G职业健康平衡 / C→E技能投资回报 / C→D职业社交圈
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR955Loaded)return;RANDOM_EVENTS._domainCLinkageR955Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. C→G: 职业健康平衡 — 长期高压工作导致健康问题
{id:"c955_career_health",phase:"street",icon:"💊",title:"职业病的代价",
story:"你最近总是腰酸背痛，眼睛干涩，有时候还会莫名其妙地头痛。\n\n你以为只是累了，休息一下就好。但身体不会骗你——长期的高强度工作正在一点点透支你的健康。\n\n你开始思考:要不要放慢脚步？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c955HealthDone)return false;if(!st.status)return false;return st.player.day>=120&&(st.status.health||100)<=50&&(st.player.physique||20)<=40},
probability:0.05,repeatable:false,
choices:[{text:"💊 调整工作节奏，注重健康",hint:"健康+35,疲劳-25,系统标记健康第一",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c955HealthDone=true;st.flags._c955HealthFirst=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+35);if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-25);if(typeof StateManager!=="undefined")StateManager.addMessage("💊 健康+35,疲劳-25。身体是革命的本钱——你开始学会休息。","success")}},
{text:"🔥 趁年轻多拼一拼",hint:"现金+5000,健康-10,系统标记拼命三郎",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c955HealthDone=true;st.flags._c955WorkHard=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+5000;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-10);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 现金+5000,健康-10。年轻就是资本——但资本也有用完的一天。","warning")}}]},
// 2. C→E: 技能投资回报 — 技能提升后带来经济收益
{id:"c955_skill_roi",phase:"street",icon:"📈",title:"技能变现",
story:"你学了大半年的新技能，终于开始产生回报了。\n\n以前只能做普通工作，现在能接一些技术活了。以前看不懂的报表，现在能分析出门道了。\n\n你算了一笔账——学技能投入的时间和金钱，已经通过更高的收入赚回来了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c955SkillRoiDone)return false;if(!st.skills)return false;var _maxLv=0;for(var _sk in st.skills){if(st.skills[_sk]&&st.skills[_sk].level>_maxLv)_maxLv=st.skills[_sk].level}return _maxLv>=30&&st.player.day>=200},
probability:0.04,repeatable:false,
choices:[{text:"📈 继续投资技能提升",hint:"智力+25,会计XP+30,系统标记技能投资者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c955SkillRoiDone=true;st.flags._c955SkillInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+30。技能是唯一不会贬值的东西——继续投资自己。","success")}},
{text:"😅 够用就行",hint:"现金+8000,系统标记知足",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c955SkillRoiDone=true;st.flags._c955GoodEnough=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+8000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+8000。够用就行——但学无止境。","info")}}]},
// 3. C→D: 职业社交圈 — 职业发展带来社交圈变化
{id:"c955_career_social",phase:"street",icon:"👥",title:"圈子的力量",
story:"你发现自己的社交圈在悄然变化。\n\n以前一起喝酒吹牛的朋友渐渐淡了，取而代之的是行业交流会上认识的新朋友。他们聊的是行业趋势、技术方向、创业机会。\n\n你意识到:你的圈子，就是你的未来。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c955SocialDone)return false;return st.player.day>=150&&(st.player.fame||0)>=20&&(st.skills.coding.level||0)+(st.skills.management.level||0)+(st.skills.sales.level||0)>=30},
probability:0.04,repeatable:false,
choices:[{text:"👥 拓展高质量的社交圈",hint:"魅力+20,社交XP+35,系统标记社交达人",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c955SocialDone=true;st.flags._c955Networker=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+20);gx("social",35);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+20,社交XP+35。你的圈子在升级——你也在升级。","success")}},
{text:"😅 还是老友最舒服",hint:"心情+15,系统标记念旧",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c955SocialDone=true;st.flags._c955OldFriends=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+15);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+15。老朋友最懂你——但新朋友能带你看到更大的世界。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();