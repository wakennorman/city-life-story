/**
 * 域H(Phase2/公司) 联动增强 R818 (第十三轮循环)
 * 桥接：
 *   H→A  h818_corp_data_v12 经营数据v12 → 消费 company 运营数据
 *   H→B  h818_corp_legend_v13 公司传奇v13 → 消费 startup 估值+里程碑
 *   H→G  h818_founder_health_v12 创始人健康v12 → 消费 公司压力+健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR818Loaded) return;
  RANDOM_EVENTS._domainHLinkageR818Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  var EVENTS = [
    {
      id: "h818_corp_data_v12", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营数据洞察",
      story: "公司的运营数据正在揭示经营真相——数据驱动决策,才能走得更远。",
      triggers: { minDay: 700, interval: 800, maxRepeats: 3, excludeFlags: ["_h818DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h818DataCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 700;
      },
      text: function (st) {
        if (!st) return null;
        var company = st.startup && st.startup.company;
        if (!company) return "公司的运营数据正在揭示经营真相。";
        var rev = isFinite(company.revenue) ? Math.round(company.revenue) : 0;
        var emp = (company.employees && company.employees.length) || 0;
        return "月度营收¥" + rev.toLocaleString() + ",团队" + emp + "人——'数据驱动决策,才能走得更远。'";
      },
      choices: [
        {
          text: "📈 分析财务数据", hint: "管理XP+30,会计XP+20,置_h818Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h818DataCd = true;
            st.flags._h818Analyst = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 30); } catch(e) {} }
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 20); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '数据不会说谎,但需要正确解读。' 管理XP+30,会计XP+20。", "success");
            }
          }
        },
        {
          text: "🎯 优化运营策略", hint: "管理XP+35,置_h818Strategist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h818DataCd = true;
            st.flags._h818Strategist = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 35); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '好的策略,来自对数据的深刻理解。' 管理XP+35。", "info");
            }
          }
        }
      ]
    },
    {
      id: "h818_corp_legend_v13", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司传奇",
      story: "你的公司正在书写属于自己的传奇故事——每一个里程碑,都值得被铭记。",
      triggers: { minDay: 800, interval: 900, maxRepeats: 3, excludeFlags: ["_h818LegendCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h818LegendCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 800;
      },
      text: function (st) {
        if (!st) return null;
        var company = st.startup && st.startup.company;
        if (!company) return "你的公司正在书写属于自己的传奇故事。";
        var val = isFinite(company.valuation) ? Math.round(company.valuation) : 0;
        return "公司估值¥" + val.toLocaleString() + "——'每一个里程碑,都值得被铭记。'";
      },
      choices: [
        {
          text: "📜 记录公司历史", hint: "心智+25,魅力+20,置_h818Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h818LegendCd = true;
            st.flags._h818Chronicler = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 20);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 '创业的每一步,都值得被铭记。' 心智+25,魅力+20。", "success");
            }
          }
        },
        {
          text: "📢 分享创业故事", hint: "社交XP+25,置_h818Storyteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h818LegendCd = true;
            st.flags._h818Storyteller = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 25); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📢 '故事比数字更有感染力。' 社交XP+25。", "info");
            }
          }
        }
      ]
    },
    {
      id: "h818_founder_health_v12", phase: "corporate", _isChainEvent: false, icon: "💚",
      title: "创始人健康管理",
      story: "创业是一场马拉松,不是短跑——身体健康,才是最大的资产。",
      triggers: { minDay: 600, interval: 700, maxRepeats: 4, excludeFlags: ["_h818HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h818HealthCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 600 && st.status && st.needs;
      },
      text: function (st) {
        if (!st) return null;
        var health = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100;
        var fatigue = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0;
        return "健康" + health + "%,疲劳" + fatigue + "——'创业是马拉松,健康才是最大的资产。'";
      },
      choices: [
        {
          text: "🏃 坚持锻炼", hint: "健康+20,疲劳-20,置_h818Fitness",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h818HealthCd = true;
            st.flags._h818Fitness = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 20);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 '身体是革命的本钱。' 健康+20,疲劳-20。", "success");
            }
          }
        },
        {
          text: "🧘 减压调节", hint: "疲劳-25,心情+20,置_h818DeStress",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h818HealthCd = true;
            st.flags._h818DeStress = true;
            if (st.needs) {
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 25);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '创业再忙,也要记得照顾自己。' 疲劳-25,心情+20。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();