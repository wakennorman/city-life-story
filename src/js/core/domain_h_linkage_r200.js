/*
 * 城市浮生记 — 域H（Phase2/公司）联动增强事件 · R200
 * 全系统优化 loop R200 · 联动增强 3项（3 corporate，与 R193 同型）
 *
 * 设计约束：
 *  - IIFE 注入 RANDOM_EVENTS，显式 phase:"corporate"（events_core:379 按 phase 过滤，无 phase 即死事件）
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]
 *
 * 本轮主题：把职场社交暗线（导师等级/政治风险/同事僵局）包装成玩家可感知的抉择，
 *   补齐历轮域H未覆盖的跨域方向 H→B(叙事层) / H→G(生命周期心智)；
 *   并复活死函数 decreaseColleagueRelationship（全库零调用方）、
 *   首次消费死数据 mentorship.level（每日+0.5 但此前无任何 gameplay 读取）。
 *   历轮已用 H→D(R13/R21/R193 NPC好感) / H→E(R13/R193) / H→C(全部) / H→A(R21)，本轮刻意避开。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainH_linkage_r200) return;
  RANDOM_EVENTS._domainH_linkage_r200 = true;

  // ---- 本地助手（全||防御） ----
  function colleaguesR200(st) {
    return (
      (st &&
        st.corporate &&
        st.corporate.colleagues &&
        st.corporate.colleagues.network) ||
      []
    );
  }
  function mentorshipR200(st) {
    return (
      (st && st.corporate && st.corporate.colleagues
        ? st.corporate.colleagues.mentorship
        : null) || null
    );
  }
  function corpSelfR200(st) {
    return (st && st.player && st.player.corporate) || null;
  }

  // ====== 联动1: H→B 导师的压箱底心得（首次消费死数据 mentorship.level） ======
  // [联动意图] mentorship.level 由 tickColleagueRelationships 每日+0.5（80→100），
  //   但全库此前无任何 gameplay 消费（仅 render.js 展示）——师徒羁绊涨了个寂寞。
  //   本事件以 level≥90 为门槛：相处日久，导师才交底，把数值成长兑现成叙事回报。
  RANDOM_EVENTS.push({
    id: "corp_r200_mentor_wisdom",
    phase: "corporate",
    icon: "📜",
    title: "导师的压箱底",
    story: function (st) {
      var m = mentorshipR200(st);
      var name = (m && m.mentorName) || "导师";
      return (
        "加班到深夜，" + name + "泡了两杯茶，把你叫到工位旁。\n\n" +
        "「这行干了这么多年，有些东西我没写进任何文档。」他压低声音，" +
        "从抽屉里翻出一本卷了边的笔记本，「看你跟我这么久了，这些……你拿去。」\n\n" +
        "那是他踩过的所有坑、得罪不起的人、和几条真正值钱的判断。"
      );
    },
    conditions: function (st) {
      var m = mentorshipR200(st);
      return !!(
        st &&
        st.player &&
        m &&
        typeof m.level === "number" &&
        m.level >= 90 && // [PLACEHOLDER] 拜师后约20天羁绊养成
        (!st.flags || !st.flags._mentorWisdomSeen)
      );
    },
    probability: 0.08, // [PLACEHOLDER]
    repeatable: false,
    choices: [
      {
        text: "📜 郑重收下，逐页研读",
        hint: "能力+[PLACEHOLDER] · 心智+[PLACEHOLDER]",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._mentorWisdomSeen = true;
          var pc = corpSelfR200(st);
          if (pc)
            pc.ability = Math.max(0, Math.min(100, (pc.ability || 0) + 6)); // [PLACEHOLDER]
          if (st.player)
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "📜 前人栽树，后人乘凉。导师的心得让你少走了三年弯路。能力+6，心智+4。",
              "success"
            );
        },
      },
      {
        text: "🍵 心领了，但路要自己走",
        hint: "心智+[PLACEHOLDER]",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._mentorWisdomSeen = true;
          if (st.player)
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🍵 你谢过导师，却只翻了几页——你想撞自己的南墙。这份倔强也是一种清醒。心智+5。",
              "info"
            );
        },
      },
    ],
  });

  // ====== 联动2: H→G 政治漩涡中的自省（risk 数值包装成生命周期叙事） ======
  // [联动意图] player.corporate.risk 高企时只有数值后果、无玩家主动纾解的叙事出口；
  //   本事件在 risk≥60 时给出「急流勇退 / 继续豪赌」的抉择，把风险管理变成可感知的
  //   人生节点（H→G 心智/生活方式联动）。
  RANDOM_EVENTS.push({
    id: "corp_r200_politics_toll",
    phase: "corporate",
    icon: "🌊",
    title: "漩涡边缘",
    story: function (st) {
      var pc = corpSelfR200(st);
      var risk = (pc && pc.risk) || 0;
      return (
        "最近办公室的空气不太对劲。你在几场斗争里露了脸，也上了一些人的名单。\n\n" +
        "茶水间有人见了你欲言又止；周报里你的名字被圈了又划掉。风险值已经爬到 " +
        risk + "。\n\n" +
        "深夜回家的地铁上，你盯着车窗里自己的倒影：这局，是收手，还是继续？"
      );
    },
    conditions: function (st) {
      var pc = corpSelfR200(st);
      return !!(
        st &&
        st.player &&
        pc &&
        (pc.risk || 0) >= 60 && // [PLACEHOLDER]
        (!st.flags || !st.flags._politicsTollCooldown ||
          (st.player.day || 0) - st.flags._politicsTollCooldown >= 60) // [PLACEHOLDER] 60天冷却
      );
    },
    probability: 0.06, // [PLACEHOLDER]
    repeatable: true,
    choices: [
      {
        text: "🛶 急流勇退，低调做事",
        hint: "风险-[PLACEHOLDER] · 心智+[PLACEHOLDER]",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._politicsTollCooldown = (st.player && st.player.day) || 0;
          var pc = corpSelfR200(st);
          if (pc) pc.risk = Math.max(0, (pc.risk || 0) - 10); // [PLACEHOLDER]
          if (st.player)
            st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🛶 你退出了几个小圈子，把精力放回业务。水面渐渐平静。风险-10，心智+4。",
              "success"
            );
        },
      },
      {
        text: "🎲 富贵险中求，继续下注",
        hint: "向上管理+[PLACEHOLDER] · 风险+[PLACEHOLDER]",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._politicsTollCooldown = (st.player && st.player.day) || 0;
          var pc = corpSelfR200(st);
          if (pc) {
            pc.upwardMgmt = Math.max(
              0,
              Math.min(100, (pc.upwardMgmt || 0) + 5)
            ); // [PLACEHOLDER]
            pc.risk = Math.max(0, Math.min(100, (pc.risk || 0) + 5)); // [PLACEHOLDER]
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🎲 你选择留在牌桌上。筹码更高了，退路更少了。向上管理+5，风险+5。",
              "warning"
            );
        },
      },
    ],
  });

  // ====== 联动3: H→D(同事僵局) 破冰还是切割（复活死函数 decreaseColleagueRelationship） ======
  // [联动意图] 同事关系跌破40后只有被动衰减、无玩家主动处理僵局的出口；
  //   本事件给出「花钱破冰 / 礼貌切割」抉择——切割分支复活全库零调用方的
  //   decreaseColleagueRelationship（关系明降+降级播报），让"关系变冷"第一次
  //   成为玩家的主动选择而非静默数值。
  RANDOM_EVENTS.push({
    id: "corp_r200_colleague_thaw",
    phase: "corporate",
    icon: "🧊",
    title: "走廊里的尴尬",
    story: function (st) {
      var cols = colleaguesR200(st);
      var cold = null;
      for (var i = 0; i < cols.length; i++) {
        if ((cols[i].relationship || 0) < 40) {
          cold = cols[i];
          break;
        }
      }
      var name = (cold && cold.name) || "那位同事";
      return (
        "你和" + name + "在走廊撞了个正着。两人都顿了一下，谁也没先开口。\n\n" +
        "自从上次的事之后，你们的关系就凉了下来。同一个项目组，抬头不见低头见，" +
        "这样僵着，迟早出问题。\n\n" +
        "要不要主动破个冰？还是干脆把界限划清楚？"
      );
    },
    conditions: function (st) {
      if (!st || !st.player) return false;
      var cols = colleaguesR200(st);
      var hasCold = false;
      for (var i = 0; i < cols.length; i++) {
        if ((cols[i].relationship || 0) < 40) {
          hasCold = true;
          break;
        }
      }
      return !!(
        hasCold &&
        (st.resources ? true : false) &&
        (!st.flags || !st.flags._colleagueThawCooldown ||
          (st.player.day || 0) - st.flags._colleagueThawCooldown >= 45) // [PLACEHOLDER] 45天冷却
      );
    },
    probability: 0.05, // [PLACEHOLDER]
    repeatable: true,
    choices: [
      {
        text: "☕ 请喝咖啡，把话说开",
        hint: "现金-[PLACEHOLDER] · 同事关系+[PLACEHOLDER]",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._colleagueThawCooldown = (st.player && st.player.day) || 0;
          var cols = colleaguesR200(st);
          var cold = null;
          for (var i = 0; i < cols.length; i++) {
            if ((cols[i].relationship || 0) < 40) {
              cold = cols[i];
              break;
            }
          }
          if (!cold) return;
          if (st.resources)
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 60); // [PLACEHOLDER]
          if (typeof increaseColleagueRelationship === "function") {
            increaseColleagueRelationship(st, cold.id, 8, "主动破冰把话说开"); // [PLACEHOLDER]
          } else {
            cold.relationship = Math.min(100, (cold.relationship || 0) + 8);
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "☕ 一杯咖啡的功夫，误会解开了大半。成年人的和解，往往就差一个先开口的人。",
              "success"
            );
        },
      },
      {
        text: "🧊 保持礼貌，划清界限",
        hint: "同事关系-[PLACEHOLDER] · 心智+[PLACEHOLDER]",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._colleagueThawCooldown = (st.player && st.player.day) || 0;
          var cols = colleaguesR200(st);
          var cold = null;
          for (var i = 0; i < cols.length; i++) {
            if ((cols[i].relationship || 0) < 40) {
              cold = cols[i];
              break;
            }
          }
          if (!cold) return;
          // [全系统自洽修复] 域H 修复:复活死函数 decreaseColleagueRelationship
          //（workplace_social.js:320，全库此前零调用方——关系下降从无主动出口）
          if (typeof decreaseColleagueRelationship === "function") {
            decreaseColleagueRelationship(st, cold.id, 5, "礼貌但明确地划清界限"); // [PLACEHOLDER]
          } else {
            cold.relationship = Math.max(0, (cold.relationship || 0) - 5);
          }
          if (st.player)
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🧊 不是所有关系都值得修复。你把精力留给值得的人——这也是职场的清醒。心智+3。",
              "info"
            );
        },
      },
    ],
  });
})();
