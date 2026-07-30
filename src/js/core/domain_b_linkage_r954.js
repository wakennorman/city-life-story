/**
 * 域B(事件/叙事) 联动增强 R954 — B→G失败中成长 / B→E危机财务智慧 / B→C职业转型
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR954Loaded)return;RANDOM_EVENTS._domainBLinkageR954Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. B→G: 失败中成长 — 经历多次挫折后触发韧性成长
{id:"b954_resilience",phase:"street",icon:"🌱",title:"伤痕，是勋章",
story:"你坐在出租屋的窗前，回想这些年走过的路。\n\n被骗过、被坑过、被背叛过——但你一次都没倒下。\n\n每一次你以为自己撑不住了，第二天太阳还是会照常升起。你比想象中更坚强。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b954ResilienceDone)return false;var _eh=st.flags._eventHistory||[];var _neg=0;for(var _i=0;_i<_eh.length;_i++){if(_eh[_i]&&_eh[_i].type==="negative")_neg++}return _neg>=15&&st.player.day>=200},
probability:0.04,repeatable:false,
choices:[{text:"🌱 感谢那些经历",hint:"心智+40,系统标记坚韧不拔",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b954ResilienceDone=true;st.flags._b954Tenacious=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+40);if(typeof StateManager!=="undefined")StateManager.addMessage("🌱 心智+40。那些杀不死你的，终将使你更强大。","success")}},
{text:"😔 不想再回忆了",hint:"心智+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b954ResilienceDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。","info")}}]},
// 2. B→E: 经济智慧 — 经历经济波动后触发财务智慧
{id:"b954_financial_wisdom",phase:"street",icon:"💡",title:"钱教我的事",
story:"你整理了过去几年的收支记录，发现了一个扎心的事实。\n\n那些你以为「必须花」的钱，其实大半都可以省下来。那些你犹豫没买的投资品，后来都涨了。\n\n钱不是靠省出来的，但乱花钱一定存不住。这个简单的道理，你用了好几年才真正理解。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b954FinWisdomDone)return false;return st.player.day>=300&&(st.resources.totalEarned||0)>=500000},
probability:0.03,repeatable:false,
choices:[{text:"💡 建立个人理财体系",hint:"智力+28,会计XP+35,系统标记理财达人",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b954FinWisdomDone=true;st.flags._b954FinMaster=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("accounting",35);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 智力+28,会计XP+35。你建立了自己的理财体系——钱开始为你工作。","success")}},
{text:"😅 钱够花就行",hint:"心情+15,系统标记知足常乐",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b954FinWisdomDone=true;st.flags._b954Content=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+15);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+15。知足常乐也是一种智慧。","info")}}]},
// 3. B→C: 职业灵感 — 偶然事件触发职业转型思考
{id:"b954_career_awakening",phase:"street",icon:"✨",title:"觉醒时刻",
story:"你参加了一场行业分享会，台上的演讲者和你有着相似的背景。\n\n「五年前我和你们一样，在街头迷茫。后来我发现了自己的天赋——每个人都有自己擅长的事，关键是找到它。」\n\n他的话像一束光照进了你的心里。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b954CareerAwakeDone)return false;return st.player.day>=150&&(st.player.intelligence||20)>=50&&st.player.phase==="street"},
probability:0.03,repeatable:false,
choices:[{text:"✨ 开始探索自己的天赋",hint:"智力+22,社交XP+30,系统标记天赋探索者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b954CareerAwakeDone=true;st.flags._b954TalentSeeker=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+22);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("✨ 智力+22,社交XP+30。你开始探索自己的天赋——每个人都有自己的闪光点。","success")}},
{text:"😅 我没什么天赋",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b954CareerAwakeDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();