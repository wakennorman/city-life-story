/**
 * 域G(核心机制/生命周期) 联动增强 R631
 * 选题：daily_pipeline/needs 三大生存里程碑 flag 全库零消费(写-only)，本轮全部打通首消费：
 *   G→E  g631_rock_bottom_wisdom   谷底翻身的财务觉悟 → 首消费 flags._everBroke(daily_pipeline.js:620 现金归零时写入)
 *   G→D  g631_street_night_memory  露宿记忆与陌生人 → 首消费 flags._everHomeless(daily_pipeline.js:338 housing.tier==0 时写入)
 *   G→C  g631_hunger_never_again   饥饿的教训 → 首消费 flags._everStarved(needs.js:64 hunger<=0 时写入)
 * 设计：峰终定律——把玩家经历过的"最低谷"在翻身后回放为叙事峰值；损失厌恶——用曾经的失去驱动当下的防御性决策。
 * 铁律自查：全 || 防御；无 NPC 引用(泛化路人,不触 rel.met)；skills 真实键(cooking/accounting/social)；
 *   现金写 resources.cash / 存款 resources.bankBalance / 心智 player.mental / 幸福 needs.happiness / 健康 status.health。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR631Loaded) return;
  RANDOM_EVENTS._domainGLinkageR631Loaded = true;

  var EVENTS = [
    // ====== G→E: 谷底翻身的财务觉悟(首消费 _everBroke) ======
    {
      id: "g631_rock_bottom_wisdom", phase: "street", _isChainEvent: false, icon: "💸",
      title: "谷底翻身",
      story: "你想起那个钱包空空的日子——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 1, excludeFlags: ["_g631RockBottomDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._everBroke) return false;
        if (st.flags._g631RockBottomDone) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 3000;
      },
      choices: [
        { text: "🏦 建一笔应急基金", hint: "现金-1000,存款+1000,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g631RockBottomDone = true;
          if (st.resources && (st.resources.cash || 0) >= 1000) {
            st.resources.cash -= 1000;
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 1000;
            st.flags._g631EmergencyFund = true;
          }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏦 '再也不想过身无分文的日子。' 你存下一笔不动的钱,心里踏实多了。存款+¥1000,心智+3。", "success");
        }},
        { text: "📒 从今天起记账", hint: "会计XP+6,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g631RockBottomDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch (e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📒 你翻开一个新本子,把每一笔开销都记下来。'钱要花在明处。' 会计XP+6,心智+2。", "success");
        }},
        { text: "🍻 好了伤疤忘了疼", hint: "幸福+3,现金-100", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g631RockBottomDone = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍻 '人生嘛,过去了就过去了。' 你请自己吃了顿好的。幸福+3,现金-100。", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st && st.resources && st.resources.cash) || 0;
        return "曾经现金归零的滋味,你到现在还记得。如今口袋里躺着¥" + cash + ",你站在银行门口,忽然明白了什么叫'手里有粮,心里不慌'。";
      }
    },

    // ====== G→D: 露宿记忆与陌生人(首消费 _everHomeless) ======
    {
      id: "g631_street_night_memory", phase: "street", _isChainEvent: false, icon: "🌃",
      title: "桥洞下的身影",
      story: "下班路上,你在天桥下看到一个蜷缩的身影——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 1, excludeFlags: ["_g631StreetNightDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._everHomeless) return false;
        if (st.flags._g631StreetNightDone) return false;
        var tier = (st.housing && st.housing.tier) || 0;
        return tier >= 1;
      },
      choices: [
        { text: "🍱 买份热饭送过去", hint: "现金-30,幸福+4,社交XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g631StreetNightDone = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch (e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍱 你递过去一份还冒着热气的盒饭。对方愣了一下,低声说了句谢谢。你想起了曾经的自己。幸福+4,社交XP+4,现金-30。", "success");
        }},
        { text: "📋 告诉他救助站的位置", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g631StreetNightDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 你把救助站的地址写在纸条上递给他。'那里至少有张床。' 这话你当年也听人说过。心智+3。", "success");
        }},
        { text: "🚶 快步走过", hint: "心智-2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g631StreetNightDone = true;
          if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚶 你低下头快步走过,身后的城市灯火通明。夜里你有点睡不着。心智-2。", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var days = (st && st.flags && st.flags._homelessDays) || 0;
        return "你也曾在这座城市里无处可睡" + (days > 0 ? "(整整" + days + "天)" : "") + "。如今你有了自己的屋檐,而桥洞下的那个身影,像极了当年的你。";
      }
    },

    // ====== G→C: 饥饿的教训(首消费 _everStarved) ======
    {
      id: "g631_hunger_never_again", phase: "street", _isChainEvent: false, icon: "🍚",
      title: "饥饿的教训",
      story: "路过一家餐馆,饭菜香味飘出来,你想起了那段饿肚子的日子——{desc}",
      triggers: { minDay: 20, interval: 90, maxRepeats: 1, excludeFlags: ["_g631HungerLessonDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._everStarved) return false;
        if (st.flags._g631HungerLessonDone) return false;
        var hunger = (st.needs && st.needs.hunger);
        return typeof hunger === "number" && hunger >= 50;
      },
      choices: [
        { text: "👨‍🍳 学做饭,把胃握在自己手里", hint: "厨艺XP+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g631HungerLessonDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("cooking", 8); } catch (e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("👨‍🍳 '会做饭的人,饿不死。' 你开始认真研究怎么用最少的钱做出一顿像样的饭。厨艺XP+8。", "success");
        }},
        { text: "🛒 囤一点应急干粮", hint: "现金-100,饥饿+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g631HungerLessonDone = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
          if (st.needs) st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛒 你买了一箱泡面和几袋压缩饼干塞进柜子。'柜子里有粮,睡觉都香。' 饥饿+5,现金-100。", "success");
        }},
        { text: "😌 感慨一下,继续走路", hint: "幸福+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g631HungerLessonDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '能吃饱饭的日子,就是好日子。' 你笑了笑,脚步轻快了些。幸福+2。", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你曾经饿到胃里发疼,连一碗泡面都要犹豫半天。现在你站在餐馆门口,闻着饭菜香,忽然很感激如今能按时吃上热饭的自己。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
