/**
 * [全系统自洽修复] 域B R410 联动增强（3项）
 * 背景：R410 修复了 part2~8 共132处死字段（player.health.*→personalGrowth.health.*），
 *       stress 写入自此真正生效。本文件为其补齐"消费端"叙事闭环。
 * 1. b410_stress_boilover  B→G：全库首个 stress 阈值消费事件（高压爆发，健康/心智代价）
 * 2. b410_bookworm_return  B→C：激活死字段 learning.booksRead（写入+技能回报闭环）
 * 3. b410_confide_pressure B→D：高压时向 met 好友倾诉（applyAffinityChange 正规入口）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;

  function getStress(st) {
    return st.personalGrowth &&
      st.personalGrowth.health &&
      st.personalGrowth.health.mental
      ? st.personalGrowth.health.mental.stress || 0
      : 0;
  }
  function addStress(st, delta) {
    if (
      st.personalGrowth &&
      st.personalGrowth.health &&
      st.personalGrowth.health.mental
    ) {
      var m = st.personalGrowth.health.mental;
      m.stress = Math.max(0, Math.min(100, (m.stress || 0) + delta));
    }
  }
  // 找一位已见面且好感达标的 NPC（沿用 r388 遍历范式，守 rel.met）
  function pickMetFriend(st, minAff) {
    if (!st.relationships) return null;
    var best = null,
      bestAff = -1;
    for (var id in st.relationships) {
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff && (r.affinity || 0) > bestAff) {
        best = id;
        bestAff = r.affinity || 0;
      }
    }
    return best;
  }
  function npcName(st, id) {
    if (typeof getNpcDisplayName === "function") return getNpcDisplayName(id);
    return (st.relationships[id] && st.relationships[id].name) || id;
  }
  function changeAffinity(st, npcId, delta, reason) {
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, delta, reason);
    } else if (st.relationships && st.relationships[npcId]) {
      var r = st.relationships[npcId];
      r.affinity = Math.max(-100, Math.min(100, (r.affinity || 0) + delta));
    }
  }

  var _events = [
    {
      // B→G：全库首个 stress 阈值消费事件。修复前 stress 永远是 0，本事件不可能出现；
      // 修复后各 part 事件累积的压力终于有了"爆发"出口，形成机制叙事闭环。
      id: "b410_stress_boilover",
      phase: "street",
      icon: "\uD83C\uDF0B",
      title: "\u7EF7\u4E0D\u4F4F\u4E86",
      story:
        "\u8FD9\u6BB5\u65F6\u95F4\u7684\u4E8B\u60C5\u4E00\u4EF6\u63A5\u7740\u4E00\u4EF6\uFF0C\u4F60\u4E00\u76F4\u544A\u8BC9\u81EA\u5DF1\u300C\u625B\u4E00\u625B\u5C31\u8FC7\u53BB\u4E86\u300D\u3002\u4ECA\u5929\u665A\u4E0A\uFF0C\u4E00\u4EF6\u5FAE\u4E0D\u8DB3\u9053\u7684\u5C0F\u4E8B\u2014\u2014\u65B9\u4FBF\u9762\u6CA1\u6709\u53C9\u5B50\u2014\u2014\u7A81\u7136\u8BA9\u4F60\u9F3B\u5B50\u4E00\u9178\u3002\n\n\u4F60\u5750\u5728\u5E8A\u6CBF\u4E0A\uFF0C\u80F8\u53E3\u53D1\u95F7\uFF0C\u624B\u5FAE\u5FAE\u53D1\u6296\u3002\u538B\u529B\u8FD9\u4E1C\u897F\u4E0D\u4F1A\u51ED\u7A7A\u6D88\u5931\uFF0C\u5B83\u53EA\u662F\u4E00\u76F4\u5728\u627E\u51FA\u53E3\u3002",
      triggers: { minDay: 15, excludeFlags: ["_b410StressBoiloverSeen"] },
      conditions: function (st) {
        if (!st.personalGrowth) return false;
        return getStress(st) >= 60; // [PLACEHOLDER] 高压阈值
      },
      probability: 0.1,
      choices: [
        {
          text: "\uD83C\uDFC3 \u51FA\u53BB\u72C2\u8DD1\u5230\u6DCB\u6F13\u5C3D\u81F4",
          hint: "\u91CA\u653E\u538B\u529B\uFF0C\u4F46\u5F88\u7D2F",
          apply: function (st) {
            st.flags._b410StressBoiloverSeen = true;
            addStress(st, -25);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            StateManager.addMessage(
              "\uD83C\uDFC3 \u4F60\u6CBF\u7740\u6CB3\u5824\u8DD1\u5230\u53CC\u817F\u53D1\u8F6F\u3002\u98CE\u5439\u5E72\u6C57\u6C34\u7684\u65F6\u5019\uFF0C\u90A3\u80A1\u90C1\u7ED3\u4E5F\u88AB\u5E26\u8D70\u4E86\u5927\u534A\u3002\u538B\u529B-25\u3002",
              "success"
            );
          },
        },
        {
          text: "\uD83C\uDF7A \u7528\u5403\u559D\u9EBB\u75F9\u81EA\u5DF1",
          hint: "\u82B1\u94B1\uFF0C\u6CBB\u6807\u4E0D\u6CBB\u672C",
          apply: function (st) {
            st.flags._b410StressBoiloverSeen = true;
            var cost = Math.min(st.resources.cash || 0, Random.int(60, 150)); // [PLACEHOLDER]
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
            addStress(st, -10);
            st.status.health = Math.max(0, (st.status.health || 50) - 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            StateManager.addMessage(
              "\uD83C\uDF7A \u70E7\u70E4\u52A0\u51B0\u5564\uFF0C\u82B1\u4E86\u00A5" +
                cost +
                "\u3002\u5F53\u665A\u786E\u5B9E\u75DB\u5FEB\uFF0C\u4F46\u51CC\u6668\u4E09\u70B9\u9192\u6765\uFF0C\u90A3\u4E9B\u4E8B\u8FD8\u5728\u539F\u5730\u7B49\u4F60\u3002",
              "info"
            );
          },
        },
        {
          text: "\uD83E\uDDF1 \u786C\u625B\uFF0C\u7EE7\u7EED\u5E72\u6D3B",
          hint: "\u538B\u529B\u7EE7\u7EED\u7D2F\u79EF",
          apply: function (st) {
            st.flags._b410StressBoiloverSeen = true;
            addStress(st, 8);
            st.player.mental = Math.max(0, (st.player.mental || 0) - 5);
            st.status.health = Math.max(0, (st.status.health || 50) - 2);
            StateManager.addMessage(
              "\uD83E\uDDF1 \u4F60\u628A\u60C5\u7EEA\u585E\u56DE\u80F8\u53E3\uFF0C\u7B2C\u4E8C\u5929\u7167\u5E38\u51FA\u95E8\u3002\u53EA\u662F\u955C\u5B50\u91CC\u7684\u4EBA\uFF0C\u773C\u795E\u6BD4\u4E0A\u4E2A\u6708\u66F4\u6DE1\u4E86\u3002",
              "warning"
            );
          },
        },
      ],
    },
    {
      // B→C：激活 state.js 定义但全库零 writer/consumer 的死字段 learning.booksRead。
      // 本事件既是首个 writer 也是首个 consumer（选项2按已读量给递增回报），职业成长闭环。
      id: "b410_bookworm_return",
      phase: "street",
      icon: "\uD83D\uDCDA",
      title: "\u65E7\u4E66\u644A\u7684\u610F\u5916\u6536\u83B7",
      story:
        "\u6536\u644A\u524D\u7684\u65E7\u4E66\u644A\u524D\uFF0C\u8001\u677F\u6B63\u628A\u4E00\u6467\u4E66\u6309\u65A4\u5904\u7406\u3002\u4F60\u968F\u624B\u7FFB\u5F00\u4E00\u672C\u300A\u628A\u65F6\u95F4\u5F53\u4F5C\u670B\u53CB\u300B\uFF0C\u6247\u9875\u91CC\u5939\u7740\u524D\u4E3B\u4EBA\u7684\u7B14\u8BB0\uFF1A\u300C\u7B2C\u4E09\u904D\u91CD\u8BFB\u3002\u300D\n\n\u5341\u5757\u94B1\u4E09\u672C\uFF0C\u8001\u677F\u61D2\u5F97\u79F0\u3002\u4F60\u7A81\u7136\u610F\u8BC6\u5230\uFF0C\u8FD9\u53EF\u80FD\u662F\u57CE\u5E02\u91CC\u6700\u4FBF\u5B9C\u7684\u7FFB\u8EAB\u673A\u4F1A\u3002",
      triggers: { minDay: 8, excludeFlags: ["_b410BookwormSeen"] },
      conditions: function (st) {
        if (!st.resources || (st.resources.cash || 0) < 10) return false;
        return true;
      },
      probability: 0.06,
      choices: [
        {
          text: "\uD83D\uDCB0 \u82B110\u5757\u4E70\u4E09\u672C\uFF0C\u8BA4\u771F\u8BFB\u5B8C",
          hint: "booksRead+3\uFF0C\u6280\u80FD\u6210\u957F",
          apply: function (st) {
            st.flags._b410BookwormSeen = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10);
            if (st.personalGrowth && st.personalGrowth.learning) {
              st.personalGrowth.learning.booksRead =
                (st.personalGrowth.learning.booksRead || 0) + 3;
            }
            if (st.skills && st.skills.english)
              st.skills.english.xp = (st.skills.english.xp || 0) + Random.int(10, 20); // [PLACEHOLDER]
            st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + 1);
            addStress(st, -5);
            StateManager.addMessage(
              "\uD83D\uDCDA \u4E09\u672C\u65E7\u4E66\u82B1\u4E86\u4F60\u4E24\u5468\u7684\u788E\u7247\u65F6\u95F4\u3002\u6700\u4FBF\u5B9C\u7684\u6295\u8D44\uFF0C\u5F80\u5F80\u56DE\u62A5\u6700\u6162\u4E5F\u6700\u7A33\u3002",
              "success"
            );
          },
        },
        {
          text: "\uD83E\uDDE0 \u76D8\u70B9\u81EA\u5DF1\u8BFB\u8FC7\u7684\u4E66",
          hint: "\u8BFB\u4E66\u8D8A\u591A\uFF0C\u9886\u609F\u8D8A\u6DF1",
          apply: function (st) {
            st.flags._b410BookwormSeen = true;
            var books =
              st.personalGrowth && st.personalGrowth.learning
                ? st.personalGrowth.learning.booksRead || 0
                : 0;
            var gain = Math.min(5, 1 + Math.floor(books / 2)); // [PLACEHOLDER] 已读越多领悟越多
            st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + gain);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
            StateManager.addMessage(
              "\uD83E\uDDE0 \u4F60\u5DF2\u8BFB\u8FC7" +
                books +
                "\u672C\u4E66\u3002\u6709\u4E9B\u53E5\u5B50\u5F53\u65F6\u4E0D\u61C2\uFF0C\u73B0\u5728\u60F3\u8D77\u6765\u5168\u662F\u751F\u6D3B\u3002\u667A\u529B+" +
                gain +
                "\u3002",
              "info"
            );
          },
        },
        {
          text: "\uD83D\uDEB6 \u770B\u770B\u5C31\u8D70",
          hint: "\u4E0D\u82B1\u94B1",
          apply: function (st) {
            st.flags._b410BookwormSeen = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 1);
            StateManager.addMessage(
              "\uD83D\uDEB6 \u4F60\u628A\u4E66\u653E\u56DE\u644A\u4E0A\u3002\u8001\u677F\u5934\u4E5F\u6CA1\u62AC\uFF1A\u300C\u4E66\u548C\u4EBA\u4E00\u6837\uFF0C\u90FD\u8981\u7B49\u6709\u7F18\u4EBA\u3002\u300D",
              "info"
            );
          },
        },
      ],
    },
    {
      // B→D：高压时向已见面(met)高好感 NPC 倾诉，applyAffinityChange 正规入口。
      // conditions 同时要求 stress 与 met 好友，全 false 时事件不出现——叙事依然自洽。
      id: "b410_confide_pressure",
      phase: "street",
      icon: "\u260E\uFE0F",
      title: "\u6DF1\u591C\u7684\u4E00\u901A\u7535\u8BDD",
      story:
        "\u538B\u529B\u5927\u5230\u7761\u4E0D\u7740\u7684\u591C\u91CC\uFF0C\u4F60\u7FFB\u7740\u901A\u8BAF\u5F55\uFF0C\u624B\u6307\u505C\u5728\u4E00\u4E2A\u540D\u5B57\u4E0A\u3002\n\n\u6253\uFF0C\u8FD8\u662F\u4E0D\u6253\uFF1F\u6C42\u52A9\u4E0D\u662F\u793A\u5F31\uFF0C\u4F46\u4F60\u603B\u89C9\u5F97\u6B20\u4EBA\u60C5\u3002",
      triggers: { minDay: 20, excludeFlags: ["_b410ConfideSeen"] },
      conditions: function (st) {
        if (getStress(st) < 40) return false; // [PLACEHOLDER] 中高压才触发
        return pickMetFriend(st, 30) !== null;
      },
      probability: 0.08,
      choices: [
        {
          text: "\uD83D\uDCDE \u62E8\u51FA\u53BB\uFF0C\u8BF4\u51FA\u6765",
          hint: "\u538B\u529B\u5927\u964D\uFF0C\u5173\u7CFB\u66F4\u8FD1",
          apply: function (st) {
            st.flags._b410ConfideSeen = true;
            var fid = pickMetFriend(st, 30);
            addStress(st, -20);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);
            if (fid) {
              changeAffinity(st, fid, 4, "\u6DF1\u591C\u503E\u8BC9");
              StateManager.addMessage(
                "\uD83D\uDCDE " +
                  npcName(st, fid) +
                  "\u542C\u4F60\u8BF4\u5230\u51CC\u6668\u4E00\u70B9\uFF0C\u6700\u540E\u8BF4\uFF1A\u300C\u6709\u4E8B\u522B\u81EA\u5DF1\u625B\u7740\u3002\u300D\u6302\u65AD\u7535\u8BDD\uFF0C\u4F60\u89C9\u5F97\u80F8\u53E3\u677E\u4E86\u3002",
                "success"
              );
            }
          },
        },
        {
          text: "\uD83D\uDCF1 \u53D1\u4E86\u6761\u6D88\u606F\u53C8\u5220\u6389",
          hint: "\u5FC3\u610F\u5230\u4E86\uFF0C\u8BDD\u6CA1\u51FA\u53E3",
          apply: function (st) {
            st.flags._b410ConfideSeen = true;
            addStress(st, -5);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
            StateManager.addMessage(
              "\uD83D\uDCF1 \u6253\u4E86\u4E00\u5927\u6BB5\u53C8\u9010\u5B57\u5220\u6389\u3002\u867D\u7136\u6CA1\u53D1\u51FA\u53BB\uFF0C\u4F46\u628A\u5FC3\u4E8B\u5199\u4E00\u904D\uFF0C\u672C\u8EAB\u4E5F\u7B97\u4E00\u79CD\u6574\u7406\u3002",
              "info"
            );
          },
        },
        {
          text: "\uD83C\uDF19 \u5173\u673A\u7761\u89C9",
          hint: "\u72EC\u81EA\u6D88\u5316",
          apply: function (st) {
            st.flags._b410ConfideSeen = true;
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
            addStress(st, 3);
            StateManager.addMessage(
              "\uD83C\uDF19 \u4F60\u628A\u624B\u673A\u6263\u5728\u5E8A\u5934\u3002\u6709\u4E9B\u591C\u665A\u53EA\u80FD\u81EA\u5DF1\u719A\uFF0C\u719A\u8FC7\u53BB\u5C31\u662F\u65B0\u7684\u4E00\u5929\u3002",
              "warning"
            );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < _events.length; i++) RANDOM_EVENTS.push(_events[i]);
})();
