/**
 * 域G(核心机制/生命周期) 联动增强 R1015 — G→A生命周期数据 / G→B人生章节叙事 / G→D社交沉淀
 * 修复: 增强事件条件，降低触发门槛，提高可玩性
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR1015Loaded)return;RANDOM_EVENTS._domainGLinkageR1015Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. G→A: 生命周期数据—月度财务复盘
{id:"g1015_finance_review",phase:"street",icon:"📊",title:"月度财务复盘",
story:"你坐下来，翻看这个月的收支记录。\n\n每一笔收入都带着汗水，每一笔支出都写着生活。\n\n你开始意识到——管理好现金流，比多赚钱更重要。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1015FinanceReview)return false;var _d=(st.player.day||0);return _d>=30&&_d%30===0&&st.resources&&st.resources.cash!==undefined},
probability:0.08,repeatable:false,
choices:[
{text:"📊 分析收支结构",hint:"会计XP+15,智力+5,置_g1015FinanceAware",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1015FinanceReview=true;st.flags._g1015FinanceAware=true;gx("accounting",15);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 会计XP+15,智力+5。你开始用数据眼光看待自己的财务状况。","success")}},
{text:"💰 设个存钱目标",hint:"心智+5,置_g1015SaveGoal",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1015FinanceReview=true;st.flags._g1015SaveGoal=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 心智+5。有了目标，钱就有了方向。","info")}},
{text:"😅 先顾眼前",hint:"心情+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1015FinanceReview=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+5。活在当下也是一种智慧。","info")}}
]},
// 2. G→B: 人生感悟—时间留下的痕迹
{id:"g1015_time_imprint",phase:"street",icon:"⏳",title:"时间留下的痕迹",
story:"你忽然意识到，来这座城市已经很久了。\n\n当初那个连路都找不到的自己，现在已经能闭着眼走遍大街小巷。\n\n时间改变了这座城市，也改变了你。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1015TimeImprint)return false;var _d=(st.player.day||0);return(_d===60||_d===120||_d===250||_d===500||_d===750)},
probability:0.10,repeatable:false,
choices:[
{text:"📖 写下这段感悟",hint:"心智+8,魅力+3,置_g1015Writer",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1015TimeImprint=true;st.flags._g1015Writer=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+8);st.player.charm=Math.min(100,(st.player.charm||50)+3)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+8,魅力+3。文字记录下了此刻的心情。","success")}},
{text:"😊 默默感受",hint:"心智+6",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1015TimeImprint=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+6);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+6。有些感受，只在心里流淌。","info")}}
]},
// 3. G→D: 社交沉淀—与老友叙旧
{id:"g1015_old_friend",phase:"street",icon:"☕",title:"与老友叙旧",
story:"你收到了一个老朋友的消息——你们已经很久没见了。\n\n约在街角那家老茶馆见面，聊起各自的生活。\n\n有些朋友，即使很久不见，见面时依然如故。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1015OldFriend)return false;if(!st.relationships)return false;var _d=(st.player.day||0);if(_d<60)return false;var _met=0;for(var _id in st.relationships){if(st.relationships[_id]&&st.relationships[_id].met)_met++}return _met>=2&&_d%45===0},
probability:0.07,repeatable:false,
choices:[
{text:"☕ 赴约叙旧",hint:"心情+12,社交XP+10,好感+3,置_g1015SocialTies",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1015OldFriend=true;st.flags._g1015SocialTies=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+12);gx("social",10);if(st.relationships&&typeof applyAffinityChange==="function"){var _ids=[];for(var _id2 in st.relationships){if(st.relationships[_id2]&&st.relationships[_id2].met)_ids.push(_id2)}if(_ids.length>0){var _p=typeof Random!=="undefined"?Random.int(0,_ids.length-1):0;applyAffinityChange(st,_ids[_p],3,"老友叙旧")}}if(typeof StateManager!=="undefined")StateManager.addMessage("☕ 心情+12,社交XP+10。老友相见，说不完的话题。","success")}},
{text:"😅 改天吧",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1015OldFriend=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。改天——有时是最大的谎言。","info")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();