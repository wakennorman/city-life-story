/**
 * 域C(职业/成长) 联动增强 R732b (第四轮循环收尾·本窗口自动化)
 * 桥接（职业/成长 作为触发源，跨域兑现）：
 *   C→G  c732b_burnout_pivot   职业倦怠拐点 → 消费 真实职业状态+心理/精力字段(stress/fatigue/happiness)
 *   C→A  c732b_salary_leverage 薪资杠杆 → 消费 管理技能+职业稳定性 → 持久调薪(currentJob.salary)+即时现金
 *   C→B  c732b_mentor_echo     晋升回声 → 消费 真实晋升计数(_careerPromotionCount)+职业路径名 → 叙事回报
 *
 * 注：本文件正确以 st.career.currentJob（CAREER_PATHS 真实职业系统）为门控，
 * 而非 st.employment（街头零工系统）——前者才是"职业/成长"域的本体，确保联动对职业线玩家真实触发。
 * 所有 apply 防御：st/flags 守卫、addSkillXp try/catch、StateManager 存在性检查。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR732bLoaded) return;
  RANDOM_EVENTS._domainCLinkageR732bLoaded = true;

  // 安全读取职业路径名（C域本体）
  function _careerPathName(st) {
    var cj = st && st.career && st.career.currentJob;
    if (!cj) return "当前职业";
    return cj.pathName || (cj.path ? "职业路径" : "当前职业");
  }
  // 安全读写 personalGrowth.health.mental.stress（R649b 双形态安全）
  function _mentalStress(st) {
    var pg = (st && st.personalGrowth) || {};
    var h = pg.health || {};
    var m = h.mental || {};
    return typeof m.stress === "number" ? m.stress : 0;
  }
  function _decMentalStress(st, delta) {
    st.personalGrowth = st.personalGrowth || {};
    st.personalGrowth.health = st.personalGrowth.health || {};
    st.personalGrowth.health.mental = st.personalGrowth.health.mental || {};
    var cur = typeof st.personalGrowth.health.mental.stress === "number"
      ? st.personalGrowth.health.mental.stress : 0;
    st.personalGrowth.health.mental.stress = Math.max(0, cur - delta);
  }

  var EVENTS = [
    {
      id: "c732b_burnout_pivot", phase: "street", _isChainEvent: false, icon: "🧯",
      title: "职业倦怠的拐点",
      story: "日复一日的职业奔跑让你喘不过气，是时候停下来看看自己了。",
      triggers: { minDay: 150, interval: 120, maxRepeats: 2, excludeFlags: ["_c732bBurnoutDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c732bBurnoutDone) return false;
        var cj = st.career && st.career.currentJob;
        if (!cj) return false; // 仅职业线玩家触发（C域本体）
        var happy = st.needs ? (st.needs.happiness || 50) : 50;
        var fatigue = st.needs ? (st.needs.fatigue || 0) : 0;
        var stress = _mentalStress(st);
        // 低幸福感 或 高疲劳/高压力 任一成立即视为倦怠信号
        return happy < 35 || fatigue > 60 || stress > 50;
      },
      choices: [
        {
          text: "🧘 主动调休，找回生活", hint: "心情+10,疲劳-12,心理压力-25",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c732bBurnoutDone = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 12);
            }
            _decMentalStress(st, 25); // [PLACEHOLDER: 压力削减量 25]
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧯 '工作是为了更好地生活。' 你给自己放了几天假，心情+10，疲劳-12，心理压力明显缓解。", "success");
            }
          }
        },
        {
          text: "⚡ 咬牙冲刺一波", hint: "现金+[PLACEHOLDER 800],但疲劳+8,心情-3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c732bBurnoutDone = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 800; // [PLACEHOLDER: 冲刺奖金 800]
            if (st.needs) {
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("⚡ 你接下了一个紧急性项目，赚到¥800，但人更累了。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var fatigue = st.needs && st.needs.fatigue ? Math.round(st.needs.fatigue) : 0;
        var stress = Math.round(_mentalStress(st));
        return "在「" + _careerPathName(st) + "」上奔跑的第" + (st.player ? st.player.day : "?") +
          "天，疲劳" + fatigue + "、心理压力" + stress + "——'再这样下去，会垮的。'";
      }
    },
    {
      id: "c732b_salary_leverage", phase: "street", _isChainEvent: false, icon: "💰",
      title: "薪资杠杆谈判",
      story: "你在职场站稳了脚跟，是时候让收入匹配你的价值了。",
      triggers: { minDay: 200, interval: 160, maxRepeats: 2, excludeFlags: ["_c732bNegotiated"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c732bNegotiated) return false;
        var cj = st.career && st.career.currentJob;
        if (!cj) return false; // 仅职业线玩家
        var mgmt = (st.skills && st.skills.management && st.skills.management.level) || 0;
        return mgmt >= 40 && st.player && st.player.day >= 200; // [PLACEHOLDER: 管理阈值 40]
      },
      choices: [
        {
          text: "🤝 凭管理经验争取加薪", hint: "月薪持久+[PLACEHOLDER 600],现金+[PLACEHOLDER 1000]",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c732bNegotiated = true;
            var cj = st.career && st.career.currentJob;
            if (cj) {
              cj.salary = Math.max(0, (cj.salary || 0) + 600); // [PLACEHOLDER: 持久月薪增幅 600]
            }
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1000; // [PLACEHOLDER: 即时签约金 1000]
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你用管理经验谈下了加薪：月薪永久+¥600，并拿到¥1000签约奖金。", "success");
            }
          }
        },
        {
          text: "📈 暂不谈薪，积累筹码", hint: "管理XP+8,置_c732bLeverageLater",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c732bNegotiated = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch (e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '时机未到，先让自己更值钱。' 管理XP+8。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var mgmt = (st.skills && st.skills.management && st.skills.management.level) || 0;
        return "管理技能Lv." + mgmt + "的你在「" + _careerPathName(st) +
          "」已站稳脚跟——'是时候让收入匹配价值了。'";
      }
    },
    {
      id: "c732b_mentor_echo", phase: "street", _isChainEvent: false, icon: "🌟",
      title: "晋升之后的回声",
      story: "你登上新职级的那一刻，曾经的引路人为你鼓起了掌。",
      triggers: { minDay: 180, interval: 150, maxRepeats: 2, excludeFlags: ["_c732bMentorEcho"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c732bMentorEcho) return false;
        var cj = st.career && st.career.currentJob;
        if (!cj) return false; // 仅职业线玩家
        var promos = (st.flags && st.flags._careerPromotionCount) || 0;
        return promos >= 1; // 真实晋升计数（career_dev.js:3270 写入）
      },
      choices: [
        {
          text: "🌟 回看来时路，心生感激", hint: "心智+6,魅力+3,置_c732bMentorEcho",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c732bMentorEcho = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌟 '当初那个手足无措的新人，已经成了能独当一面的人。' 心智+6，魅力+3。", "success");
            }
          }
        },
        {
          text: "🎯 把经验传给后来者", hint: "社交XP+6,置_c732bMentorPaysForward",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c732bMentorEcho = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch (e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 你开始带新人，把走过的坑都告诉他们。社交XP+6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var lvl = (st.career && st.career.currentJob && st.career.currentJob.levelName) || "新职级";
        return "在「" + _careerPathName(st) + "」晋升为「" + lvl +
          "」后，曾经的引路人发来消息：'看到你成长，真好。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
