/**
 * 域C(职业/成长) 联动增强 R619
 * 桥接：
 *   C→D  c619_crossroads_whisper  职业十字路口的耳语 → 消费 state.relationships+state.skills 数据,
 *     成长→"朋友看见你的变化"社交回响
 *   C→E  c619_expertise_dividend  专业技能变现 → 消费 state.skills+state.resources 数据,
 *     成长→"一技之长换真金白银"经济回响
 *   C→G  c619_skill_milestone_life  技能里程碑的人生节点 → 消费 state.skills+state.player+state.flags 数据,
 *     成长→"学有所成"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR619Loaded) return;
  RANDOM_EVENTS._domainCLinkageR619Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR619(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  // 辅助：获取最高等级真实技能键
  function topSkillKeyR619(st) {
    var skills = st.skills || {};
    var best = null, bestLv = -1;
    var realKeys = ["cooking","repair","coding","english","driving","sales","management","accounting","electrician","welding","medicine","social"];
    for (var i = 0; i < realKeys.length; i++) {
      var lv = skills[realKeys[i]] && typeof skills[realKeys[i]].level === "number" ? skills[realKeys[i]].level : 0;
      if (lv > bestLv) { bestLv = lv; best = realKeys[i]; }
    }
    return { key: best, level: bestLv };
  }

  var EVENTS = [
    {
      id: "c619_crossroads_whisper", phase: "street", _isChainEvent: false, icon: "🛤️",
      title: "职业十字路口的耳语",
      story: "你的变化被身边的朋友看在眼里——{desc}",
      triggers: { minDay: 90, interval: 150, maxRepeats: 2, excludeFlags: ["_c619CrossroadsCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c619CrossroadsCooldown) return false;
        var top = topSkillKeyR619(st);
        var met = metNpcsR619(st);
        return top.level >= 30 && met.length >= 1;
      },
      choices: [
        { text: "🤝 分享心得", hint: "好感+5,社交XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c619CrossroadsCooldown = true;
          var met = metNpcsR619(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "分享成长心得"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '我这些日子有点感悟,跟你说说。' 你把成长心得分享给朋友,彼此都受益。好感+5,社交XP+4。", "success");
        }},
        { text: "🤫 低调前行", hint: "心智+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c619CrossroadsCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '低调做人,高调做事。' 你选择默默前行。心智+3,心情+2。", "success");
        }},
        { text: "🎯 请教对方", hint: "好感+3,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c619CrossroadsCooldown = true;
          var met = metNpcsR619(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "虚心请教"); } catch(e) {}
          }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '你比我见多识广,给我指指路。' 你虚心请教,对方很受用。好感+3,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var top = topSkillKeyR619(st);
        var met = metNpcsR619(st);
        var npcName = met.length > 0 ? met[0].name : "老朋友";
        var skillNames = { cooking:"厨艺", repair:"修理", coding:"编程", english:"英语", driving:"驾驶", sales:"销售", management:"管理", accounting:"会计", electrician:"电工", welding:"焊接", medicine:"医术", social:"社交" };
        var skillName = skillNames[top.key] || top.key;
        return "你的" + skillName + "已经小有所成(Lv." + top.level + ")," + npcName + "看在眼里——'你最近进步不小啊,有什么打算?' 你站在职业的十字路口。";
      }
    },
    {
      id: "c619_expertise_dividend", phase: "street", _isChainEvent: false, icon: "💎",
      title: "专业技能变现",
      story: "一技之长终于换来了真金白银——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_c619DividendCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c619DividendCooldown) return false;
        var top = topSkillKeyR619(st);
        return top.level >= 20;
      },
      choices: [
        { text: "💰 接私活赚外快", hint: "现金+1500,最高技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c619DividendCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1500;
          var top = topSkillKeyR619(st);
          if (top.key && typeof addSkillXp === "function") { try { addSkillXp(top.key, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '手艺就是本钱。' 你接了个私活,赚到¥1500,技能也精进了。现金+1500,技能XP+3。", "success");
        }},
        { text: "📚 投资自己进修", hint: "现金-800,最高技能XP+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c619DividendCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 800);
          var top = topSkillKeyR619(st);
          if (top.key && typeof addSkillXp === "function") { try { addSkillXp(top.key, 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '磨刀不误砍柴工。' 你花钱进修,技能突飞猛进。现金-¥800,技能XP+8。", "success");
        }},
        { text: "🏦 存起来备不时之需", hint: "现金+1500,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c619DividendCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1500;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏦 '手中有粮,心中不慌。' 你把赚的钱存好,心里踏实。现金+1500,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var top = topSkillKeyR619(st);
        var skillNames = { cooking:"厨艺", repair:"修理", coding:"编程", english:"英语", driving:"驾驶", sales:"销售", management:"管理", accounting:"会计", electrician:"电工", welding:"焊接", medicine:"医术", social:"社交" };
        var skillName = skillNames[top.key] || top.key;
        return "你的" + skillName + "已经小有所成(Lv." + top.level + "),有人愿意为你的技能买单——'一技之长,处处可变现。' 你打算怎么用这笔收入?";
      }
    },
    {
      id: "c619_skill_milestone_life", phase: "street", _isChainEvent: false, icon: "🏔️",
      title: "技能里程碑的人生节点",
      story: "当一门手艺练到某个境界,你看世界的方式也变了——{desc}",
      triggers: { minDay: 120, interval: 200, maxRepeats: 1, excludeFlags: ["_c619MilestoneDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c619MilestoneDone) return false;
        var top = topSkillKeyR619(st);
        return top.level >= 50;
      },
      choices: [
        { text: "🎉 庆祝突破", hint: "心情+10,置_c619MilestoneCelebrated", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c619MilestoneDone = true;
          st.flags._c619MilestoneCelebrated = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 'Lv.50! 这一路走来不容易。' 你为自己的突破庆祝。心情+10。", "success");
        }},
        { text: "📖 写下感悟", hint: "智力+3,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c619MilestoneDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '把走过的路记下来,给后来的自己看。' 你写下成长感悟。智力+3,心智+5。", "success");
        }},
        { text: "🚀 向更高峰进发", hint: "心智+8,置_c619HigherPeak", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c619MilestoneDone = true;
          st.flags._c619HigherPeak = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '这才哪到哪,继续往上走。' 你目光投向更高处。心智+8。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var top = topSkillKeyR619(st);
        var skillNames = { cooking:"厨艺", repair:"修理", coding:"编程", english:"英语", driving:"驾驶", sales:"销售", management:"管理", accounting:"会计", electrician:"电工", welding:"焊接", medicine:"医术", social:"社交" };
        var skillName = skillNames[top.key] || top.key;
        return "你的" + skillName + "突破了Lv.50——'当一门手艺练到深处,看世界的眼光都不一样了。' 这一刻值得被记住。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
