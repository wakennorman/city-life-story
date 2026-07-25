/*
 * 城市浮生记 — 域A（数据/数值平衡）联动增强事件 · R242
 * loop R242 全系统优化·Domain A 数据/数值平衡 → 跨域桥接（A→B / A→C / A→H）
 *
 * 背景：域A 已在 R14/R22/R189/R197 覆盖 A→D/A→C/A→E/A→G/A→F/A→H。
 * 本轮 A类修复接通了三证书（cooking_cert/repair_cert/sales_cert）的
 * XpBonus/JobIncomeBonus 死效果键（_certSkillXpBonus/_certJobIncomeBonus），
 * 三个事件均为本轮新机制的首个叙事消费者，形成"写入→消费"闭环：
 *  - A→B（叙事）：持证涨薪的市井佳话 —— 历轮域A唯一未用方向，首补 A→B。
 *  - A→C（职业/成长）：证书学习圈 —— 消费 _certSkillXpBonus，对被加成技能再投入。
 *  - A→H（Phase2/公司）：简历上的硬证书 —— 证书数量为晋升背书（corporate 阶段）。
 * id 前缀 a242_ 与 a197_/data_/data2_/data_a_r189_ 既有前缀均不冲突。
 *
 * 设计约束（与历轮各域 linkage 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS（非 ES import），避免改主库既有事件文件。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），故显式设 phase（2 street + 1 corporate）。
 *  - 里程碑/去重用 st.flags._xxxCooldown（conditions 与 apply 双重拦截）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR242Loaded) return;
  RANDOM_EVENTS._domainALinkageR242Loaded = true;

  // 防御辅助：取本轮证书收入加成映射中最高的一项（无则 null）
  function topCertIncomeBonusR242(st) {
    try {
      var m = st && st.flags && st.flags._certJobIncomeBonus;
      if (!m) return null;
      var bestKey = null;
      var bestVal = 0;
      for (var k in m) {
        if (Object.prototype.hasOwnProperty.call(m, k) && (m[k] || 0) > bestVal) {
          bestVal = m[k];
          bestKey = k;
        }
      }
      return bestKey ? { key: bestKey, val: bestVal } : null;
    } catch (e) {
      return null;
    }
  }

  var SKILL_CN_R242 = { cooking: "厨艺", repair: "维修", sales: "销售" };

  var A_EVENTS_R242 = [
    // ===== A→B：持证涨薪的市井佳话 ↔ 事件/叙事（历轮域A首补 A→B 方向；首个叙事消费 _certJobIncomeBonus） =====
    {
      id: "a242_cert_word_of_mouth",
      title: "「人家可是有证的」",
      desc: "巷口闲聊，有街坊提起你：干一样的活，你挣得比别人多两成——「人家可是有证的，正经考出来的」。这话传来传去，倒成了半条街的谈资。你听见时没吭声，心里却踏实：那几百块报名费、熬夜背的题，都变成了实打实的行情。",
      phase: "street",
      triggers: { minDay: 40 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._a242CertTaleCooldown) return false;
        // 门控：本轮接通的证书收入加成已生效（考取过三证书之一）
        return !!topCertIncomeBonusR242(st);
      },
      choices: [
        {
          text: "笑着应下，继续把活干漂亮",
          apply: function (st) {
            var top = topCertIncomeBonusR242(st);
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 3); // [PLACEHOLDER] 名声
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER] 心智
            }
            if (st.needs)
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 0) + 4,
              ); // [PLACEHOLDER] 心情
            if (st.flags) {
              st.flags._a242CertTaleCooldown = true;
              st.flags._certReputationSeen = true; // 持证口碑 flag（B域后续叙事可消费）
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "📜 " +
                  (top ? SKILL_CN_R242[top.key] || "手艺" : "手艺") +
                  "的证书，成了街坊嘴里的行情。",
                "good",
              );
          },
        },
        {
          text: "摆摆手：「证是死的，手艺是活的」",
          apply: function (st) {
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (st.flags) st.flags._a242CertTaleCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== A→C：证书学习圈 ↔ 职业/成长（消费 _certSkillXpBonus：被加成的技能再投入，滚雪球） =====
    {
      id: "a242_cert_study_circle",
      title: "培训班同学拉的学习群",
      desc: "考证时认识的几个同学建了个群，平日里各忙各的，偶尔有人抛出个实操难题，群里能聊到半夜。你跟着拆解了一道，忽然发现：有证书打底，再学新东西，比当初快多了。",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._a242StudyCircleCooldown) return false;
        // 门控：本轮接通的证书XP加成已生效
        var m = st.flags && st.flags._certSkillXpBonus;
        if (!m) return false;
        for (var k in m) {
          if (Object.prototype.hasOwnProperty.call(m, k) && (m[k] || 0) > 0)
            return true;
        }
        return false;
      },
      choices: [
        {
          text: "认真拆题，把心得记进小本子",
          apply: function (st) {
            // C域桥接：对被证书加成的技能再投入（addSkillXp 内部会乘 _certSkillXpBonus，闭环生效）
            var m = (st.flags && st.flags._certSkillXpBonus) || {};
            var key = null;
            for (var k in m) {
              if (
                Object.prototype.hasOwnProperty.call(m, k) &&
                (m[k] || 0) > 0
              ) {
                key = k;
                break;
              }
            }
            if (key && typeof addSkillXp === "function")
              addSkillXp(key, 8); // [PLACEHOLDER] 技能XP（含证书加成乘区）
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER] 心智
            if (st.flags) st.flags._a242StudyCircleCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "📚 证书打了底，学新东西快了不少。",
                "good",
              );
          },
        },
        {
          text: "潜水看看就好",
          apply: function (st) {
            if (st.needs)
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 0) + 1,
              );
            if (st.flags) st.flags._a242StudyCircleCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== A→H：简历上的硬证书 ↔ Phase2/公司（证书数据资产为职场晋升背书） =====
    {
      id: "a242_cert_resume_weight",
      title: "简历上那几行「硬货」",
      desc: "内部竞聘的材料交上去，HR 翻到你的证书栏，多看了两眼。会后主管私下说：「能力大家都有，但白纸黑字的资质，在名单往上报的时候，就是比一句『他挺能干』有分量。」",
      phase: "corporate",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._a242ResumeWeightCooldown) return false;
        // 门控：至少持有2张证书 + 在职（career.currentJob 或 corporate.company 任一，均可 undefined 须防御）
        var certCount =
          (st.certificates && st.certificates.length) || 0;
        if (certCount < 2) return false;
        var employed =
          (st.career && st.career.currentJob) ||
          (st.corporate && st.corporate.company);
        return !!employed;
      },
      choices: [
        {
          text: "把资质栏再补充完整，认真争取",
          apply: function (st) {
            if (typeof addSkillXp === "function")
              addSkillXp("management", 6); // [PLACEHOLDER] 管理XP
            if (st.resources)
              st.resources.cash = (st.resources.cash || 0) + 600; // [PLACEHOLDER] 资质津贴
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER] 心智
            if (st.flags) {
              st.flags._a242ResumeWeightCooldown = true;
              st.flags._certCareerLeverage = true; // 证书职场杠杆 flag（H域后续事件可消费）
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🗂️ 一纸证书，在名单上替你说了话。",
                "good",
              );
          },
        },
        {
          text: "顺其自然，凭日常表现说话",
          apply: function (st) {
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (st.flags) st.flags._a242ResumeWeightCooldown = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < A_EVENTS_R242.length; i++) {
    RANDOM_EVENTS.push(A_EVENTS_R242[i]);
  }
})();
