/**
 * 域G(核心机制/生命周期) 联动增强 R611
 * 桥接：
 *   G→D  g611_life_stage_social  人生阶段社交 → 消费 state.player.day+state.relationships 数据,
 *     生命周期→"不同人生阶段的不同社交需求"的社交回响
 *   G→E  g611_seasonal_economy  季节经济影响 → 消费 state.player.day+state.resources 数据,
 *     生命周期→"季节变化影响经济选择"的经济回响
 *   G→C  g611_health_skill_synergy  健康技能协同 → 消费 state.status+state.skills 数据,
 *     生命周期→"健康状态影响技能效率"的职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR611Loaded) return;
  RANDOM_EVENTS._domainGLinkageR611Loaded = true;

  // 辅助：获取当前季节
  function getSeasonR611(st) {
    var day = (st.player && st.player.day) || 1;
    var doy = ((day - 1) % 365) + 1;
    if (doy <= 90) return { name: "spring", label: "春天", icon: "🌸" };
    if (doy <= 181) return { name: "summer", label: "夏天", icon: "🌻" };
    if (doy <= 273) return { name: "autumn", label: "秋天", icon: "🍂" };
    return { name: "winter", label: "冬天", icon: "❄️" };
  }

  var EVENTS = [
    // ====== G→D: 人生阶段社交 ======
    {
      id: "g611_life_stage_social", phase: "street", _isChainEvent: false, icon: "👥",
      title: "人生阶段",
      story: "你突然意识到,自己已经不再是当初那个刚来城市的毛头小子了——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 3, excludeFlags: ["_g611LifeStageCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g611LifeStageCooldown) return false;
        return (st.player && st.player.day >= 90);
      },
      choices: [
        { text: "🤝 联系老朋友叙旧", hint: "好感+5,心情+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g611LifeStageCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          // 找到最早结识的NPC
          var earliest = null, earliestDay = 99999;
          var rels = st.relationships || {};
          for (var k in rels) {
            if (rels[k] && rels[k].met && (rels[k]._firstMetDay || 0) < earliestDay) {
              earliestDay = rels[k]._firstMetDay || 0;
              earliest = k;
            }
          }
          if (earliest && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, earliest, 5, "叙旧"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 '还记得咱们刚认识的时候吗?' 和老朋友回忆过去,感慨万千。好感+5,心情+5,心智+2。", "success");
        }},
        { text: "📝 写日记记录感悟", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g611LifeStageCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 你翻开日记本,写下这些日子的感悟。'这座城市见证了我的成长。' 心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var day = st.player.day || 0;
        var years = Math.floor(day / 365);
        var months = Math.floor((day % 365) / 30);
        return "来到这座城市已经" + (years > 0 ? years + "年零" : "") + months + "个月了。你看着镜子里的自己,和刚来时判若两人。曾经的稚嫩,如今变成了沉稳。";
      }
    },

    // ====== G→E: 季节经济影响 ======
    {
      id: "g611_seasonal_economy", phase: "street", _isChainEvent: false, icon: "🌤️",
      title: "季节经济",
      story: "季节的变化影响着这座城市的每一个角落——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 10, excludeFlags: ["_g611SeasonalEconomyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g611SeasonalEconomyCooldown) return false;
        return true;
      },
      choices: [
        { text: "📈 抓住季节商机", hint: "收入+¥500-1500,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g611SeasonalEconomyCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          var season = getSeasonR611(st);
          var earn = 0;
          if (season.name === "summer") earn = 500 + Random.int(0, 1000); // 夏天卖冰饮
          else if (season.name === "winter") earn = 600 + Random.int(0, 900); // 冬天卖暖宝宝
          else earn = 300 + Random.int(0, 700); // 春秋
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + earn;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌤️ " + season.icon + "到了" + season.label + ",你抓住了季节性商机,赚了¥" + earn.toLocaleString() + "! 智力+3。", "success");
        }},
        { text: "💰 调整消费计划", hint: "现金+¥300,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g611SeasonalEconomyCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 300;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌤️ 季节变换,你调整了消费计划,省下了一笔钱。现金+¥300,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var season = getSeasonR611(st);
        return season.icon + " " + season.label + "来了。街上的行人都换上了应季的衣裳,商店的橱窗也换了陈列。这座城市的脉搏,随着季节跳动着。";
      }
    },

    // ====== G→C: 健康技能协同 ======
    {
      id: "g611_health_skill_synergy", phase: "street", _isChainEvent: false, icon: "🧠",
      title: "身体状态",
      story: "你发现自己的身体状态直接影响了工作效率——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 10, excludeFlags: ["_g611HealthSkillCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g611HealthSkillCooldown) return false;
        return true;
      },
      choices: [
        { text: "🏋️ 锻炼身体提升状态", hint: "健康+8,疲劳+10,体质XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g611HealthSkillCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 8);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          // [全系统自洽修复] 域G R631 修复: addSkillXp("strength") 假技能键(真实12键无strength)→XP静默丢弃,hint"体质XP+5"承诺落空；改写真实形象维度 personalGrowth.image.fitness(同R599/R621修复先例)
          if (st.personalGrowth && st.personalGrowth.image) {
            st.personalGrowth.image.fitness = Math.min(100, (st.personalGrowth.image.fitness || 30) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧠 '身体是革命的本钱!' 你出了一身汗,感觉整个人都精神了。健康+8,体质XP+5,疲劳+10。", "success");
        }},
        { text: "🧘 调整作息时间", hint: "健康+5,疲劳-10,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g611HealthSkillCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧠 你决定早睡早起,不再熬夜。几天下来,精神好了很多。健康+5,疲劳-10,心智+2。", "success");
        }},
        { text: "💊 买点保健品", hint: "健康+3,现金-200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g611HealthSkillCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧠 你买了一些维生素和保健品。'养生要趁早啊。' 健康+3,现金-200。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        var msg = "你的身体状态:健康值" + health + ",疲劳度" + fatigue + "。";
        if (health < 50) msg += "最近总觉得力不从心,工作效率也下降了。";
        else if (fatigue > 70) msg += "累得不行,脑子都不转了。";
        else msg += "状态不错,继续保持!";
        return msg;
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();