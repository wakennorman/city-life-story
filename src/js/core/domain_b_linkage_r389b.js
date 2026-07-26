/**
 * [全系统自洽修复] 域B R389(新号) 联动增强: Phase1→Phase2过渡叙事事件
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  var _events = [
    {
      id: "first_corporate_day",
      phase: "corporate",
      icon: "\uD83C\uDF22",
      title: "\u4F60\u7684\u7B2C\u4E00\u4EFD\u516C\u53F8\u5DE5\u4F5C",
      story: "\u4F60\u7A7F\u4E0A\u552F\u4E00\u4E00\u4EF6\u50CF\u6837\u7684\u886C\u8863\uFF0C\u7B2C\u4E00\u6B21\u4EE5\u300C\u516C\u53F8\u804C\u5458\u300D\u7684\u8EAB\u4EFD\u8D70\u8FDB\u8FD9\u680B\u5199\u5B57\u697C\u3002\u7535\u68AF\u91CC\u7684\u663E\u793A\u5C4F\u8DF3\u52A8\u7740\u697C\u5C42\u6570\u5B57\uFF0C\u524D\u53F0\u5C0F\u59D1\u95EE\u4F60\u627E\u8C01\u2014\u2014\u8FD9\u79CD\u573A\u666F\uFF0C\u4E09\u5E74\u524D\u4F60\u8FD8\u5728\u8857\u5934\u5E2E\u4EBA\u642C\u7BB1\u5B50\u3002\n\n\u5DE5\u724C\u6302\u5728\u4F60\u81F8\u524D\uFF0C\u6C89\u7538\u7538\u7684\u3002\u8FD9\u4E0D\u662F\u8857\u5934\u7684\u65E5\u7ED3\u5DE5\u8D44\u4E86\uFF0C\u8FD9\u662F\u4E00\u4E2A\u771F\u6B63\u7684\u300C\u5DE5\u4F5C\u300D\u3002",
      triggers: { minDay: 60, excludeFlags: ["_firstCorporatDaySeen"], employment: "any" },
      conditions: function (st) { if (!st.player || !st.player.corporate) return false; if ((st.player.corporate || {}).daysInJob < 1) return true; return false; },
      probability: 0.08,
      choices: [
        { text: "\uD83D\uDCDD \u8BA4\u771F\u8BB0\u4E0B\u6BCF\u4E2A\u7EC6\u8282", hint: "\u5B66\u4E60\u671F", apply: function (st) { st.flags._firstCorporatDaySeen = true; var c=(st.player&&st.player.corporate)?st.player.corporate:{}; c.kpi=Math.min(150,(c.kpi||0)+3); c.upwardMgmt=Math.min(100,(c.upwardMgmt||0)+2); st.skills.coding.xp=(st.skills.coding.xp||0)+Random.int(10,20); st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+10); st.needs.happiness=Math.min(100,(st.needs.happiness||0)+5); StateManager.addMessage("\uD83D\uDCDD \u4F60\u628A\u5DE5\u4F4D\u3001\u6D41\u7A0B\u3001\u6BCF\u4E2A\u4EBA\u59D3\u4EC0\u4E48\u90FD\u8BB0\u5728\u5FC3\u91CC\u3002\u867D\u7136\u7D2F\uFF0C\u4F46\u6B65\u6B65\u90FD\u8D70\u5F97\u5F88\u624E\u5B9E\u3002","success"); }},
        { text: "\uD83D\uDD00 \u5148\u89C2\u5BDF\uFF0C\u4E0D\u6025\u8868\u73B0", hint: "\u8C28\u614E", apply: function (st) { st.flags._firstCorporatDaySeen = true; st.player.intelligence=Math.min(100,(st.player.intelligence||0)+1); st.player.mental=Math.min(100,(st.player.mental||0)+3); st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+5); StateManager.addMessage("\uD83D\uDD00 \u4F60\u5148\u82B1\u4E86\u4E00\u4E0A\u5348\u770B\u522B\u4EBA\u600E\u4E48\u5E72\u6D3B\u3002\u89C2\u5BDF\u867D\u6162\uFF0C\u4F46\u4F60\u5B66\u5230\u4E86\u4E0D\u5C11\u804C\u573A\u6F5C\u89C4\u5219\u3002","info"); }},
        { text: "\u{1F630} \u89C9\u5F97\u81EA\u5DF1\u641E\u4E0D\u5B9A", hint: "\u7126\u8651", apply: function (st) { st.flags._firstCorporatDaySeen=true; st.needs.happiness=Math.max(0,(st.needs.happiness||0)-5); st.player.mental=Math.max(0,(st.player.mental||0)-3); st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+8); StateManager.addMessage("\u{1F630} \u7B2C\u4E00\u5929\u5C31\u624B\u8DB3\u65E0\u63AA\u3002\u770B\u7740\u540C\u4E8B\u4EEC\u719F\u7EC3\u5730\u6253\u5B57\u804A\u5929\uFF0C\u4F60\u7A81\u7136\u89C9\u5F97\u81EA\u5DF1\u53EF\u80FD\u9009\u9519\u4E86\u8DEF\u3002","warning"); }}
      ],
    },
    {
      id: "street_experience_echo",
      phase: "corporate",
      icon: "\u{1F4A1}",
      title: "\u8857\u5934\u6559\u4F1A\u4F60\u7684\u4E8B\u6D3E\u4E0A\u7528\u573A\u4E86",
      story: "\u4ECA\u5929\u516C\u53F8\u51FA\u4E86\u4E2A\u96BE\u9898\uFF1A\u4E00\u4E2A\u5BA2\u6237\u9879\u76EE\u8981\u5728\u5730\u63A8\u4E00\u5468\u5185\u7B7E\u4E0B\u6765\uFF0C\u56E2\u961F\u91CC\u51E0\u4E2A\u767D\u9886\u5927\u5B66\u751F\u4E00\u7B79\u832B\u832B\u3002\n\n\u4F60\u7A81\u7136\u60F3\u8D77\u81EA\u5DF1\u5728\u6279\u53D1\u5E02\u573A\u6446\u5730\u3001\u8DDF\u57CE\u7BA1\u5468\u65CB\u3001\u5728\u5DE5\u5730\u627E\u4EBA\u5E72\u6D3B\u7684\u7ECF\u9A8C\u2014\u2014\u8FD9\u4E9B\u90FD\u662F\u8857\u5934\u78E8\u51FA\u6765\u7684\u3002",
      triggers: { minDay: 90, excludeFlags: ["_streetEchoSeen"], employment: "any" },
      conditions: function (st) { if (!st.career||!st.career.currentJob) return false; if (!st.stats||!st.stats.actionFreq) return false; var e=(st.stats.actionFreq["manual_labor_construction"]||0)+(st.stats.actionFreq["food_stall"]||0)+(st.stats.actionFreq["street_vending"]||0)+(st.stats.actionFreq["scavenging"]||0); if(e<10)return false; return true; },
      probability: 0.04,
      choices: [
        { text: "\uD83D\uDDA4 \u4E3B\u52A8\u8BF7\u7F28\u53BB\u5730\u63A8", hint: "\u53D1\u6325\u8857\u5934\u7ECF\u9A8C", apply: function (st) { st.flags._streetEchoSeen=true; var c=(st.player&&st.player.corporate)?st.player.corporate:{}; c.kpi=Math.min(150,(c.kpi||0)+8); c.popularity=Math.min(100,(c.popularity||0)+6); if(st.skills&&st.skills.sales) st.skills.sales.xp=(st.skills.sales.xp||0)+Random.int(15,25); st.resources.cash=(st.resources.cash||0)+Random.int(500,1500); st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+15); st.needs.happiness=Math.min(100,(st.needs.happiness||0)+8); StateManager.addMessage("\uD83D\uDDA4 \u4F60\u5728\u6279\u53D1\u5E02\u573A\u7EC3\u5C31\u7684\u561F\u76AE\u5B50\u548C\u8138\u76AE\u5B50\u6D3E\u4E0A\u5927\u7528\u573A\u4E86\uFF01\u7B7E\u4E863\u5355\uFF0CKPI+8\uFF0C\u73B0\u91D1+\u00A51000\u3002\u540C\u4E8B\u4EEC\u7528\u65B0\u773C\u5149\u770B\u4F60\u3002","success"); }},
        { text: "\uD83E\uDD1D \u6559\u540C\u4E8B\u4E00\u4E9B\u8857\u5934\u65B9\u6CD5", hint: "\u5206\u4EAB\u7ECF\u9A8C", apply: function (st) { st.flags._streetEchoSeen=true; var c=(st.player&&st.player.corporate)?st.player.corporate:{}; c.popularity=Math.min(100,(c.popularity||0)+8); c.upwardMgmt=Math.min(100,(c.upwardMgmt||0)+4); st.player.social=Math.min(100,(st.player.social||0)+2); st.needs.happiness=Math.min(100,(st.needs.happiness||0)+5); StateManager.addMessage("\uD83E\uDD1D \u4F60\u628A\u6446\u5730\u65F6\u7684\u5FC3\u5F97\u6574\u7406\u4E86\u4E00\u4E0B\u6559\u7ED9\u540C\u4E8B\u3002\u5927\u5BB6\u542C\u5B8C\u76F4\u547C\u5185\u884C\uFF0C\u4F60\u7B2C\u4E00\u6B21\u89C9\u5F97\u300C\u8BFB\u8FC7\u7684\u90A3\u4E9B\u82E6\u6CA1\u767D\u5403\u300D\u3002","success"); }},
        { text: "\uD83D\uDE45 \u8BA9\u5927\u5B66\u751F\u81EA\u5DF1\u641E\u5B9A", hint: "\u5404\u5FD9\u5404\u7684", apply: function (st) { st.flags._streetEchoSeen=true; st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+5); StateManager.addMessage("\uD83D\uDE45 \u4F60\u51B3\u5B9A\u4E0D\u53C2\u4E0E\u3002\u5404\u6709\u5404\u4EBA\u7684\u96BE\u5904\uFF0C\u4F60\u53C8\u4E0D\u662F\u96F7\u950B\u3002\u4F46\u4E8B\u540E\u60F3\u60F3\uFF0C\u4E5F\u8BB8\u5E2E\u4E00\u628A\u4E5F\u80FD\u8D60\u70B9\u4EBA\u8109\u3002","info"); }}
      ],
    },
  ];
  for (var i=0;i<_events.length;i++) { RANDOM_EVENTS.push(_events[i]); }
})();
