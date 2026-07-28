/**
 * 域B(事件/叙事) 联动增强 R722b（本窗口自动化轮，b后缀避让并行R722域A在途）
 * 选题依据（写-only flag 首消费闭环）：
 *   B→H  b722b_gratitude_echo   感谢信的回响 —— _gratitudeLetterSent(events_street_survival.js:3853
 *        R586生成以来全库唯一写入、零读取)跨阶段首读：Phase1告别街头时写的感谢信,在Phase2公司阶段收到回音。
 *        跨阶段继承叙事闭环(Phase1积累→Phase2兑现),峰终定律:把玩家早期善意变成后期情感峰值。
 *   B→C/E b722b_pattern_dividend 模式红利 —— _b714PatternAnalyst/_b714Storyteller(并行R715刚写入,
 *        写-only)首读：事件模式分析能力兑现为理财/社交实际收益。禀赋效应:玩家自选的身份标签产生持续回报。
 *   B→G  b722b_resilience_proof 韧性的考验 —— _b714Resilient/_b714Mindful(并行R715写-only)首读：
 *        健康低谷时叙事韧性兑现为恢复加成。损失厌恶缓冲:低健康期给予玩家自主感而非纯惩罚。
 * 防御：全部 || 守卫；NPC引用一律 rel && rel.met(域D铁律)；好感走 applyAffinityChange；
 *       显名走 getNpcDisplayName；健康读写 st.status.health(真实字段)；幸福 st.needs.happiness。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR722bLoaded) return;
  RANDOM_EVENTS._domainBLinkageR722bLoaded = true;

  var GRATEFUL_NPCS = ["aunt_wang", "boss_li", "old_zhou"];

  function metGratefulNpcs(st) {
    var out = [];
    if (!st || !st.relationships) return out;
    for (var i = 0; i < GRATEFUL_NPCS.length; i++) {
      var rel = st.relationships[GRATEFUL_NPCS[i]];
      if (rel && rel.met) out.push(GRATEFUL_NPCS[i]);
    }
    return out;
  }

  function npcName(nid) {
    if (typeof getNpcDisplayName === "function") {
      try { var n = getNpcDisplayName(nid); if (n) return n; } catch (e) {}
    }
    return "老朋友";
  }

  var EVENTS = [
    // ============ 1. B→H 感谢信的回响（跨阶段继承, corporate） ============
    {
      id: "b722b_gratitude_echo", phase: "corporate", _isChainEvent: false, icon: "💌",
      title: "感谢信的回响",
      story: "一封来自过去的信,穿过岁月找到了现在的你。",
      triggers: { minDay: 200, maxRepeats: 1, excludeFlags: ["_b722bGratitudeEcho"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._gratitudeLetterSent) return false; // 写过感谢信才有回响
        if (st.flags._b722bGratitudeEcho) return false;
        return metGratefulNpcs(st).length > 0; // 铁律: 至少一位met的受谢NPC
      },
      choices: [
        {
          text: "🤝 登门拜访,当面道谢", hint: "受谢旧识好感+8,心情+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b722bGratitudeEcho = true;
            var mets = metGratefulNpcs(st);
            for (var i = 0; i < mets.length; i++) {
              if (typeof applyAffinityChange === "function") {
                try { applyAffinityChange(st, mets[i], 8, "感谢信的回响·登门道谢"); } catch (e) {}
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💌 你带着当年的感谢信登门拜访。" + npcName(mets[0]) + "看着信纸笑了：'没想到你还留着这个。' 旧识好感+8,心情+8。", "success");
            }
          }
        },
        {
          text: "💰 匿名回馈一笔'感恩基金'", hint: "现金-2000,道德+5,心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b722bGratitudeEcho = true;
            st.flags._b722bAnonymousGiver = true;
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
            if (st.player) {
              st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你以'一个曾被帮助过的人'名义,给社区捐了¥2,000。善意完成了它的循环。道德+5,心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var mets = metGratefulNpcs(st);
        var who = mets.length > 0 ? npcName(mets[0]) : "一位旧识";
        return "秘书递来一封手写信。拆开一看,竟是" + who + "托人转交的——'当年你留下的那封感谢信,我一直收在抽屉里。看到你现在的样子,真为你高兴。'你想起告别街头的那个清晨,想起那些在你最难的日子里伸过手的人。";
      }
    },

    // ============ 2. B→C/E 模式红利（R715写-only flag首读, street） ============
    {
      id: "b722b_pattern_dividend", phase: "street", _isChainEvent: false, icon: "🧩",
      title: "模式红利",
      story: "你对事件模式的洞察,开始产生实际回报。",
      triggers: { minDay: 140, interval: 160, maxRepeats: 2, excludeFlags: ["_b722bPatternCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags) return false;
        if (st.flags._b722bPatternCd) return false;
        return !!(st.flags._b714PatternAnalyst || st.flags._b714Storyteller); // R715身份标签首消费
      },
      choices: [
        {
          text: "📊 用模式洞察优化开支", hint: "现金+600,会计XP+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b722bPatternCd = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 600;
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch (e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 你按记录的消费模式砍掉了三笔重复开销,月底多出¥600。'数据不说谎。' 会计XP+5。", "success");
            }
          }
        },
        {
          text: "🎙️ 把人生故事讲给街坊听", hint: "社交XP+7,心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b722bPatternCd = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 7); } catch (e) {} }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎙️ 巷口的傍晚,你把这些年的经历讲成了故事,听的人越围越多。'讲故事的人,永远不缺朋友。' 社交XP+7,心情+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var isAnalyst = st.flags && st.flags._b714PatternAnalyst;
        return isAnalyst
          ? "翻看这几个月记下的事件笔记,你发现了一个规律：开销的峰值总跟着情绪低谷走。这个发现,也许值点钱。"
          : "你记录的人生故事越攒越厚。街坊们开始好奇——那个总在写东西的人,到底经历过什么？";
      }
    },

    // ============ 3. B→G 韧性的考验（R715写-only flag首读, street, 低健康窗口） ============
    {
      id: "b722b_resilience_proof", phase: "street", _isChainEvent: false, icon: "🌱",
      title: "韧性的考验",
      story: "生病的日子,才知道内心的力量有多真。",
      triggers: { minDay: 90, interval: 130, maxRepeats: 3, excludeFlags: ["_b722bResilienceCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags) return false;
        if (st.flags._b722bResilienceCd) return false;
        if (!(st.flags._b714Resilient || st.flags._b714Mindful)) return false; // R715韧性身份首消费
        var hp = st.status && typeof st.status.health === "number" ? st.status.health : 100;
        return hp < 60; // 低健康窗口才触发,韧性在考验中兑现
      },
      choices: [
        {
          text: "🌱 靠韧性硬扛,规律作息自愈", hint: "健康+6,心智+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b722bResilienceCd = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 6);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌱 你按正念练习的节奏调整作息,身体一点点回暖。'挫折教过你的,身体都记得。' 健康+6,心智+4。", "success");
            }
          }
        },
        {
          text: "🏥 及时就医,不逞强", hint: "现金-300,健康+9",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b722bResilienceCd = true;
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 9);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏥 真正的韧性不是硬扛,是知道什么时候该求助。花¥300看了医生,健康+9。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var hp = st.status && typeof st.status.health === "number" ? Math.round(st.status.health) : 0;
        var isMindful = st.flags && st.flags._b714Mindful;
        return "健康跌到" + hp + ",身体在报警。" + (isMindful
          ? "你想起正念反思时对自己说过的话——'心稳住了,身体才有得救。'"
          : "你想起那些从挫折里爬起来的日子——'这一次,也一样能过去。'");
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
