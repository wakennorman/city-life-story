/**
 * 域D(NPC/社交) 联动增强 R757b — 新NPC好感承诺兑现层
 * 设计（峰终定律+禀赋效应+互惠原则）：
 *   D→C  d757b_laochen_community_intro  消费 _laoChenCommunityHelp（R440老陈60好感承诺，此前全库零读取）→ 社区讲座技能成长
 *   D→E  d757b_xiaowei_discount_meal    消费 _xiaoWeiDiscount（R442小薇60好感承诺，此前全库零读取）→ 夜市半价用餐经济兑现
 *   D→C  d757b_laochen_mentor_guidance  消费 _laoChenMentorship（老陈80好感人生导师flag，此前零读取）→ 导师职业指点
 * 防御：met铁律(rel&&rel.met) / done-flag防重 / ||守卫 / applyAffinityChange四参 / getNpcDisplayName兜底 / 显式phase:"street"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR757bLoaded) return;
  RANDOM_EVENTS._domainDLinkageR757bLoaded = true;

  function _npcName(id, fallback) {
    if (typeof getNpcDisplayName === "function") {
      try { var n = getNpcDisplayName(id); if (n) return n; } catch (e) {}
    }
    return fallback;
  }
  function _metRel(st, id) {
    var rel = st && st.relationships ? st.relationships[id] : null;
    return !!(rel && rel.met);
  }

  var EVENTS = [
    {
      id: "d757b_laochen_community_intro",
      phase: "street",
      icon: "🏘️",
      title: "社区中心的免费讲座",
      story: "路过社区中心，你想起老陈说过这里的资源随便用。公告栏上贴着本周免费讲座：《职场沟通的艺术》。",
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._laoChenCommunityHelp) return false;
        if (st.flags._d757bLectureDone) return false;
        return _metRel(st, "lao_chen");
      },
      choices: [
        {
          text: "📚 进去听讲座",
          hint: "管理XP+10, 社交XP+8, 心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d757bLectureDone = true;
            if (typeof addSkillXp === "function") {
              try { addSkillXp("management", 10); addSkillXp("social", 8); } catch (e) {}
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, "lao_chen", 2, "使用社区资源"); } catch (e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 讲座很实用。散场时" + _npcName("lao_chen", "老陈") + "冲你点头：「常来。」管理XP+10，社交XP+8，心智+3。", "success");
            }
          },
        },
        {
          text: "🚶 下次再说",
          hint: "无变化，机会保留",
          apply: function (st) {
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚶 你记下了讲座时间，改天再来。", "info");
            }
          },
        },
      ],
    },
    {
      id: "d757b_xiaowei_discount_meal",
      phase: "street",
      icon: "🍢",
      title: "小薇摊位的老友价",
      story: "夜市烟火气正浓，小薇远远就朝你招手：「老规矩，给你打折！」烤串的香味让你走不动路。",
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._xiaoWeiDiscount) return false;
        if (st.flags._d757bDiscountMealCd) return false;
        if (!st.resources || (st.resources.cash || 0) < 15) return false;
        return _metRel(st, "xiao_wei");
      },
      choices: [
        {
          text: "🍢 来一顿半价烧烤",
          hint: "现金-15(原价30), 饱腹+25, 心情+6",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d757bDiscountMealCd = true;
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 15);
            if (st.needs) {
              st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 25);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);
            }
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, "xiao_wei", 2, "照顾生意"); } catch (e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🍢 " + _npcName("xiao_wei", "小薇") + "多送了你一串：「老朋友嘛！」半价15元吃到撑，饱腹+25，心情+6。", "success");
            }
          },
        },
        {
          text: "💰 按原价付，支持她生意",
          hint: "现金-30, 饱腹+25, 小薇好感+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d757bDiscountMealCd = true;
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
            if (st.needs) st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 25);
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, "xiao_wei", 4, "拒收折扣支持生意"); } catch (e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你坚持付了全款。" + _npcName("xiao_wei", "小薇") + "愣了一下，笑得很真：「你这人，真讲究。」好感+4。", "success");
            }
          },
        },
      ],
    },
    {
      id: "d757b_laochen_mentor_guidance",
      phase: "street",
      icon: "🧭",
      title: "人生导师的深谈",
      story: "傍晚的公园，老陈坐在长椅上冲你招手：「来，坐。我看你最近的状态，有几句话想跟你说。」",
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._laoChenMentorship) return false;
        if (st.flags._d757bMentorTalkDone) return false;
        return _metRel(st, "lao_chen");
      },
      choices: [
        {
          text: "🧭 认真请教职业方向",
          hint: "管理XP+15, 心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d757bMentorTalkDone = true;
            if (typeof addSkillXp === "function") {
              try { addSkillXp("management", 15); } catch (e) {}
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, "lao_chen", 3, "深谈请教"); } catch (e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧭 " + _npcName("lao_chen", "老陈") + "：「路要自己走，但方向可以借别人的眼。」一席话让你豁然开朗。管理XP+15，心智+5。", "success");
            }
          },
        },
        {
          text: "😅 聊聊家常就好",
          hint: "心情+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d757bMentorTalkDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 你们聊了会儿家常，夕阳把两个人的影子拉得很长。心情+4。", "info");
            }
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
