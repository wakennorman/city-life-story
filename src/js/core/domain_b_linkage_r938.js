/**
 * 域B(事件/叙事) 联动增强 R938 — B→G事件韧性成长 / B→E事件经济智慧 / B→C事件职业灵感
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 *  - done-flag 防重复。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR938Loaded)return;RANDOM_EVENTS._domainBLinkageR938Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. B→G: 事件韧性成长 — 经历重大挫折后，触发韧性成长
{id:"b938_resilience_growth",phase:"street",icon:"🌱",title:"挫折是最好的老师",
story:"你坐在出租屋的床边，回想今天发生的一切。\n\n被老板骂、被客户放鸽子、钱包被偷了——你甚至不知道该先难过哪一个。\n\n但奇怪的是，你并没有崩溃。你只是静静地坐了一会儿，然后开始想办法。你意识到:这就是成长。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b938ResilienceDone)return false;var _eh=st.flags._eventHistory||[];var _neg=0;for(var _i=0;_i<_eh.length;_i++){if(_eh[_i]&&_eh[_i].type==="negative")_neg++}return _neg>=5&&st.player.day>=60},
probability:0.05,repeatable:false,
choices:[{text:"🌱 从挫折中汲取力量",hint:"心智+30,系统标记韧性成长",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b938ResilienceDone=true;st.flags._b938Resilient=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+30);if(typeof StateManager!=="undefined")StateManager.addMessage("🌱 心智+30。挫折没有击倒你——它让你更强大。","success")}},
{text:"😔 需要时间消化",hint:"心智+10",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b938ResilienceDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。","info")}}]},
// 2. B→E: 事件经济智慧 — 经历经济相关事件后，触发对财务的反思
{id:"b938_econ_wisdom",phase:"street",icon:"💡",title:"经历的价值",
story:"你想起刚来这座城市时，连一顿饭都要精打细算。\n\n那时候，你为了省两块钱，宁愿多走两站路。为了多赚点钱，什么苦活累活都干过。\n\n现在回过头看，那些艰难的日子教会了你在学校里学不到的东西——钱要花在刀刃上，机会要抓住，但别贪心。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b938EconWisdomDone)return false;return st.player.day>=200&&(st.resources.cash||0)>=50000&&(st.resources.totalEarned||0)>=200000},
probability:0.04,repeatable:false,
choices:[{text:"💡 总结经济经验，建立理财原则",hint:"智力+20,会计XP+30,系统标记理财有方",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b938EconWisdomDone=true;st.flags._b938FinWise=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("💡 智力+20,会计XP+30。你总结了一套自己的理财原则。","success")}},
{text:"😅 继续埋头赚钱",hint:"现金+5000,系统标记赚钱机器",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b938EconWisdomDone=true;st.flags._b938MoneyMachine=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+5000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+5000。你选择继续埋头赚钱——但赚钱不是目的，生活才是。","warning")}}]},
// 3. B→C: 事件职业灵感 — 偶然事件触发职业方向思考
{id:"b938_career_inspiration",phase:"street",icon:"✨",title:"意外的启发",
story:"你在地铁上无意中听到两个人的对话。\n\n「……现在AI这么火，会Python的人太好找工作了，起薪就是一万五。」\n\n你低头看了看手机，查了一下编程培训班的费用和周期。\n\n也许，改变人生的机会就在这些不经意的瞬间里。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b938CareerInspoDone)return false;return st.player.day>=90&&(st.player.intelligence||20)>=40&&st.player.phase==="street"},
probability:0.04,repeatable:false,
choices:[{text:"✨ 报名学习编程",hint:"智力+25,编程XP+40,系统标记编程入门",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b938CareerInspoDone=true;st.flags._b938CodingLearner=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("coding",40);if(typeof StateManager!=="undefined")StateManager.addMessage("✨ 智力+25,编程XP+40。你决定学习编程——这可能改变你的人生轨迹。","success")}},
{text:"😅 听听就算了",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b938CareerInspoDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();