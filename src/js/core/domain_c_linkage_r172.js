/**
 * 域C(职业/成长) 联动增强 R172
 * 方向:
 *  - career_senior_burnout_choice  (C→G 核心机制叙事包装): 高职级职场内卷的叙事化抉择
 *  - career_year_end_bonus          (C→E 职业-经济联动): 高职级稳定职业→年终奖→激活经济系统
 * 范式: IIFE + RANDOM_EVENTS 全局注入; phase:"street"; gameOver 闸门; conditions 全字段防御;
 *       apply 裹 try/catch + StateManager.addMessage。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (window.__domain_c_linkage_r172_loaded) return;
  window.__domain_c_linkage_r172_loaded = true;

  function safeMsg(st, text, type) {
    try {
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage(text, type || "info");
      }
    } catch (e) {
      /* 静默 */
    }
  }

  var DOMAIN_C_R172_EVENTS = [
    // ---- C→G: 职业内卷的叙事化包装(核心机制无叙事→加叙事层) ----
    {
      id: "career_senior_burnout_choice",
      title: "山顶的风与喘息",
      icon: "⛰️",
      desc:
        "你站到了职级的某个台阶上——title 好听，代价是越来越密的会议、越来越晚的灯。" +
        "身体在抗议，账单却在笑。\n\n这一程，你想怎么走？",
      phase: "street",
      triggers: { minDay: 200 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.gameOver) return false; // gameOver 闸门
        if (!st.career || !st.career.currentJob) return false;
        var id = st.career.currentJob.id || "";
        // 仅高职级(senior/lead/manager/principal/director/headteacher)触发
        if (!/_(senior|lead|manager|principal|director|headteacher)$/.test(id)) return false;
        // 心智已临界则不再叠加压力(防御)
        if (typeof st.player.mental === "number" && st.player.mental <= 15) return false;
        return true;
      },
      choices: [
        {
          text: "咬牙再冲一把",
          hint: "争取晋升，但透支身心",
          apply: function (st) {
            try {
              if (st.player) {
                st.player.mental = Math.max(0, (st.player.mental || 50) - 8); // [PLACEHOLDER] 透支
                st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 4);
              }
              if (st.flags) st.flags._careerPush = true;
              if (st.resources) st.resources.cash = (st.resources.cash || 0) + 5000; // [PLACEHOLDER] 加班费
              safeMsg(st, "你接下了更重的担子。加班费+¥5000，但身心透支——心智-8、幸福-4。", "warning");
            } catch (e) {
              /* 静默 */
            }
          },
        },
        {
          text: "保重身心，节奏放慢",
          hint: "回归生活，晋升暂缓",
          apply: function (st) {
            try {
              if (st.player) {
                st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
                st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
              }
              if (st.flags) st.flags._careerBalance = true;
              safeMsg(st, "你把节奏慢了下来。心智+6、幸福+8，晋升可以再等等。", "success");
            } catch (e) {
              /* 静默 */
            }
          },
        },
      ],
    },

    // ---- C→E: 职业-经济联动(职业收益与经济脱钩→职业收益反哺经济) ----
    {
      id: "career_year_end_bonus",
      title: "年终的回响",
      icon: "🧧",
      desc:
        "一年到头，HR 把信封推到你面前。数字不小——它既是你这一年的代价，也是明年撬动生活的杠杆。\n\n" +
        "这笔钱，你打算怎么用？",
      phase: "street",
      triggers: { minDay: 330 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.gameOver) return false; // gameOver 闸门
        if (!st.career || !st.career.currentJob) return false;
        var job = st.career.currentJob;
        // 仅高职级稳定职业(薪资门槛)可领可观年终奖
        if (typeof job.salary !== "number" || job.salary < 15000) return false; // [PLACEHOLDER] 薪资门槛
        // 同年只发放一次(防御: 按游戏年去重)
        var yr = Math.floor((st.player.day || 0) / 360);
        if (st.flags && st.flags["_careerYEBonus_" + yr]) return false;
        return true;
      },
      choices: [
        {
          text: "存为投资启动金",
          hint: "现金落袋，撬动经济系统",
          apply: function (st) {
            try {
              var job = st.career.currentJob;
              var bonus = Math.round((job.salary || 0) * 2); // [PLACEHOLDER] 约2个月薪资
              if (st.resources) st.resources.cash = (st.resources.cash || 0) + bonus;
              if (st.skills) { try { addSkillXp("management", 2); } catch (e) {} } // [全系统自洽修复] 域G R599 修复:st.skills.management 是{level,xp}对象，对象+2→Math.min=NaN 摧毁技能→改走 addSkillXp
              if (st.flags) {
                var yr = Math.floor((st.player.day || 0) / 360);
                st.flags["_careerYEBonus_" + yr] = true;
                st.flags._careerInvestEdge = true; // 职业→经济联动标记
              }
              safeMsg(
                st,
                "年终奖 ¥" + bonus + " 落袋，成为你投资账户的启动金。管理+2，职业-经济联动已激活。",
                "success",
              );
            } catch (e) {
              /* 静默 */
            }
          },
        },
        {
          text: "犒劳辛苦一年的自己",
          hint: "消费换幸福，现金略少",
          apply: function (st) {
            try {
              var job = st.career.currentJob;
              var bonus = Math.round((job.salary || 0) * 1); // [PLACEHOLDER] 1个月薪资
              if (st.resources) st.resources.cash = (st.resources.cash || 0) + bonus;
              if (st.player) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
              if (st.flags) {
                var yr = Math.floor((st.player.day || 0) / 360);
                st.flags["_careerYEBonus_" + yr] = true;
              }
              safeMsg(st, "你给自己放了个小假。幸福+12，现金+¥" + bonus + "。", "success");
            } catch (e) {
              /* 静默 */
            }
          },
        },
      ],
    },
  ];

  for (var i = 0; i < DOMAIN_C_R172_EVENTS.length; i++) {
    RANDOM_EVENTS.push(DOMAIN_C_R172_EVENTS[i]);
  }
})();
