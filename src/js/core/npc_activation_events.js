/*
 * 城市浮生记 — 域D（NPC/社交）A类缺陷修复·沉睡NPC激活
 * v3.117 · loop R26 全系统优化·Domain D（NPC/社交）主审第二轮
 *
 * 【A类缺陷】auntie_lin(林阿姨) / chen_ge(陈哥) / ajie(阿杰) 三人在 npcs.js 有定义、
 * 在 NPC_RELATION_MATRIX 有条目、且各自有下游事件(secret_recipe / connections / side_project)
 * 强依赖 st.relationships.X.met，但全代码无任何路径把 met 设 true
 * （cross_system_events.js 的 NPC 登场系列只覆盖了 uncle_chen_bank/sister_wu/brother_huang/
 *  dr_wang/master_zhao/xiaoli 六人）。结果：三人永久 dormant，其下游内容永不触发 →
 * 典型的「定义存在但永远不会出场」A类缺陷。
 *
 * 【修复】为三人各补一个 npc_X_first_meet 登场事件，严格沿用 cross_system_events.js 中
 * 已验证的 6 个登场事件样板（RANDOM_EVENTS.push + phase:"street" + conditions 要求 !met
 *  + 选项 apply 内 met=true + 好感 clamp + 人设 flag + StateManager 播报）。
 * 激活后，三人的下游事件（met+好感阈值）即可正常触发。
 *
 * 设计约束（与 R11–R17 loop 各 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 9800+ 行的 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎按 e.phase 过滤（street/corporate），三人均 street 阶段角色，故 phase:"street"。
 *  - conditions 仅靠 !met 拦截（不锁地点），确保玩家渡过 day 阈值后必能结识，真正解除 dormant。
 *  - repeatable:false + !met 双保险，结识后不再重复触发。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._npcActivationLoaded) return;
  RANDOM_EVENTS._npcActivationLoaded = true;

  // ===== 林阿姨（auntie_lin）菜市场摊主 — 唤醒 secret_recipe 下游 =====
  RANDOM_EVENTS.push({
    id: "npc_auntie_lin_first_meet",
    phase: "street",
    icon: "🥬",
    title: "菜市场的林阿姨",
    story:
      "你在菜市场挑菜，一个嗓门洪亮的摊主大姐冲你招手：「小伙子/姑娘，来看看我这几把青菜，今早刚到的，水灵得很！\n\n" +
      "她利落地捆菜、过秤，顺口问你：「刚来城里吧？住哪儿啊？菜市场这地方，门道多着呢。」",
    conditions: function (st) {
      // [全系统自洽修复] 域D 修复:林阿姨从未被任何路径 met → 本条补登场闸门(!met)
      return (
        st &&
        st.player &&
        st.player.day >= 10 &&
        (!st.relationships ||
          !st.relationships.auntie_lin ||
          !st.relationships.auntie_lin.met)
      );
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "🥬 帮她搬两筐菜再走",
        hint: "结识林阿姨，好感+10",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.auntie_lin) {
            st.relationships.auntie_lin = { affinity: 0, met: true };
          }
          st.relationships.auntie_lin.met = true;
          st.relationships.auntie_lin.affinity = Math.min(
            100,
            (st.relationships.auntie_lin.affinity || 0) + 10,
          );
          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); // [PLACEHOLDER] 心情
          if (st.flags) st.flags._auntieLinMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🥬 林阿姨塞给你一把小葱：「拿去！年轻人接地气，以后买菜找我，给你留好的。」结识林阿姨，好感+10，心情+3。",
              "success",
            );
        },
      },
      {
        text: "🛒 买把菜，聊两句",
        hint: "结识林阿姨，好感+5",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.auntie_lin) {
            st.relationships.auntie_lin = { affinity: 0, met: true };
          }
          st.relationships.auntie_lin.met = true;
          st.relationships.auntie_lin.affinity = Math.min(
            100,
            (st.relationships.auntie_lin.affinity || 0) + 5,
          );
          if (st.flags) st.flags._auntieLinMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🛒 林阿姨笑着多抓了把香菜：「算你福利。常来啊！」结识林阿姨，好感+5。",
              "info",
            );
        },
      },
    ],
  });

  // ===== 陈哥（chen_ge）情报贩子 — 唤醒 connections 下游 =====
  RANDOM_EVENTS.push({
    id: "npc_chen_ge_first_meet",
    phase: "street",
    icon: "🕶️",
    title: "商业区的陈哥",
    story:
      "商业区天桥下，一个穿得利落的中年男人斜倚栏杆，朝你递来一张没有抬头只有电话的名片：\n\n" +
      "「陈哥。这城里什么事我都略知一二。找工作、找门路、避坑——记住这个人脉，说不定哪天用得上。」\n\n" +
      "他笑得意味深长，不像摊主那般热络，却莫名让人记住。",
    conditions: function (st) {
      // [全系统自洽修复] 域D 修复:陈哥从未被任何路径 met → 本条补登场闸门(!met)
      return (
        st &&
        st.player &&
        st.player.day >= 15 &&
        (!st.relationships ||
          !st.relationships.chen_ge ||
          !st.relationships.chen_ge.met)
      );
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤝 接下名片，听听门道",
        hint: "结识陈哥，好感+8",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.chen_ge) {
            st.relationships.chen_ge = { affinity: 0, met: true };
          }
          st.relationships.chen_ge.met = true;
          st.relationships.chen_ge.affinity = Math.min(
            100,
            (st.relationships.chen_ge.affinity || 0) + 8,
          );
          if (st.player)
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 10) + 1,
            ); // [PLACEHOLDER] 心智
          if (st.flags) st.flags._chenGeMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🤝 陈哥压低声音：「城里水浑，多个明白人总没错。」结识陈哥，好感+8，智力+1。",
              "success",
            );
        },
      },
      {
        text: "🙂 婉拒，不多纠缠",
        hint: "结识陈哥，好感+3",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.chen_ge) {
            st.relationships.chen_ge = { affinity: 0, met: true };
          }
          st.relationships.chen_ge.met = true;
          st.relationships.chen_ge.affinity = Math.min(
            100,
            (st.relationships.chen_ge.affinity || 0) + 3,
          );
          if (st.flags) st.flags._chenGeMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🙂 你摆摆手。陈哥也不恼，把名片收回：「随缘。」结识陈哥，好感+3。",
              "info",
            );
        },
      },
    ],
  });

  // ===== 阿杰（ajie）老同学 — 唤醒 side_project 下游 =====
  RANDOM_EVENTS.push({
    id: "npc_ajie_first_meet",
    phase: "street",
    icon: "📱",
    title: "街头偶遇的老同学阿杰",
    story:
      "你在街头等人，一个身影凑上来，盯着你看了两秒突然乐了：\n\n" +
      "「哎——我没认错吧？咱俩小学同过桌啊！我是阿杰！这么多年没联系，你也在城里混？」\n\n" +
      "他比你精神些，手机壳亮得反光，话里带着点说不清的兴奋。",
    conditions: function (st) {
      // [全系统自洽修复] 域D 修复:阿杰从未被任何路径 met → 本条补登场闸门(!met)
      return (
        st &&
        st.player &&
        st.player.day >= 20 &&
        (!st.relationships ||
          !st.relationships.ajie ||
          !st.relationships.ajie.met)
      );
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "📱 叙旧，加回联系方式",
        hint: "结识阿杰，好感+10",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.ajie) {
            st.relationships.ajie = { affinity: 0, met: true };
          }
          st.relationships.ajie.met = true;
          st.relationships.ajie.affinity = Math.min(
            100,
            (st.relationships.ajie.affinity || 0) + 10,
          );
          if (st.flags) st.flags._ajieMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "📱 你和阿杰加了微信。他拍着你肩膀：「改天聚！我最近搞的买卖，说不定能带你赚一笔。」结识阿杰，好感+10。",
              "success",
            );
        },
      },
      {
        text: "👋 匆匆打个招呼",
        hint: "结识阿杰，好感+4",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.ajie) {
            st.relationships.ajie = { affinity: 0, met: true };
          }
          st.relationships.ajie.met = true;
          st.relationships.ajie.affinity = Math.min(
            100,
            (st.relationships.ajie.affinity || 0) + 4,
          );
          if (st.flags) st.flags._ajieMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "👋 你急着走，和阿杰草草寒暄。他笑着挥手：「行，回头聊！」结识阿杰，好感+4。",
              "info",
            );
        },
      },
    ],
  });
})();
