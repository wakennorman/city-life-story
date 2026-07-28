/**
 * 域B(事件/叙事) 联动增强 R659
 * 桥接：
 *   B→H  b659_company_origin_story  公司起源故事 → 消费 state.flags+state.startup 数据,
 *     事件→"公司创始故事"的叙事回响
 *   B→C  b659_event_skill_inspiration  事件技能灵感 → 消费 state.flags+state.skills 数据,
 *     事件→"偶发事件激发技能"的职业回响
 *   B→A  b659_festival_price_insight  节日价格洞察 → 消费 state.player.day+state.resources 数据,
 *     事件→"节日消费中的价格规律"的数值回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR659Loaded) return;
  RANDOM_EVENTS._domainBLinkageR659Loaded = true;

  var EVENTS = [
    // ====== B→H: 公司起源故事 ======
    {
      id: "b659_company_origin_story", phase: "corporate", _isChainEvent: false, icon: "🏢",
      title: "创业初心",
      story: "你回想起当初为什么要创办这家公司——{desc}",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_b659OriginStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b659OriginStoryCooldown) return false;
        return st.startup && st.startup.company;
      },
      choices: [
        { text: "📝 写下创业故事", hint: "心智+5,名气+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b659OriginStoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏢 你写下了公司的创业故事。'不忘初心,方得始终。' 心智+5,名气+5。", "success");
        }},
        { text: "🗣️ 讲给团队听", hint: "团队士气+8,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b659OriginStoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.startup && st.startup.company) {
            st.startup.company.morale = Math.min(100, (st.startup.company.morale || 50) + 8);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏢 你把创业故事讲给团队听,大家都很感动。'原来我们公司是这样开始的!' 团队士气+8,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.startup || !st.startup.company) return null;
        var name = st.startup.company.name || "你的公司";
        return "你看着" + name + "的LOGO,想起了创办它的那一天。'那时候什么都没有,只有一腔热血。' 你还记得当初的梦想吗?";
      }
    },

    // ====== B→C: 事件技能灵感 ======
    {
      id: "b659_event_skill_inspiration", phase: "street", _isChainEvent: false, icon: "💡",
      title: "技能灵感",
      story: "一件小事让你学到了新技能——{desc}",
      triggers: { minDay: 10, interval: 45, maxRepeats: 12, excludeFlags: ["_b659SkillInspirationCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b659SkillInspirationCooldown) return false;
        return true;
      },
      choices: [
        { text: "🔧 动手试试", hint: "随机技能XP+8,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b659SkillInspirationCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          var allSkills = ["cooking", "repair", "sales", "coding", "accounting", "medicine", "education", "art", "electrician", "welding", "agility", "strength", "social"];
          if (typeof Random !== "undefined" && typeof addSkillXp === "function") {
            try { addSkillXp(Random.fromArray(allSkills), 8); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '原来这么简单!' 你学会了一个新技巧。随机技能XP+8,智力+2。", "success");
        }},
        { text: "📖 记下来以后学", hint: "智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b659SkillInspirationCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 你把这个技巧记在了手机备忘录里。'以后有空再研究。' 智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在路边看到一个人在修自行车,手法娴熟。'原来内胎破了可以这样补!' 你学到了一个新技能。";
      }
    },

    // ====== B→A: 节日价格洞察 ======
    {
      id: "b659_festival_price_insight", phase: "street", _isChainEvent: false, icon: "🎄",
      title: "节日经济",
      story: "节日临近,你发现很多东西都在涨价——{desc}",
      triggers: { minDay: 15, interval: 60, maxRepeats: 10, excludeFlags: ["_b659FestivalPriceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b659FestivalPriceCooldown) return false;
        return true;
      },
      choices: [
        { text: "📦 提前采购", hint: "省下¥300-800,现金-500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b659FestivalPriceCooldown = true;
          var saved = 300 + Random.int(0, 500);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          if (st.flags) st.flags._festivalPrep = (st.flags._festivalPrep || 0) + 1;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎄 你赶在节前囤好了东西。'节前买,省一半!' 现金-500,省下了¥" + saved.toLocaleString() + "。", "success");
        }},
        { text: "📈 研究节日行情", hint: "智力+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b659FestivalPriceCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎄 你研究了近几年节日期间的价格走势。'每年节前一周开始涨价,节后回落。' 智力+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "快过节了,街上到处是促销广告。但你发现,所谓的'打折'之后,价格反而比平时高了。'节日经济,原来是这样玩的。' 你开始思考背后的规律。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();