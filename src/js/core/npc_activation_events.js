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

  // ===== 小陈（xiaochen）外卖骑手 — 首次登场 =====
  RANDOM_EVENTS.push({
    id: "npc_xiaochen_first_meet",
    phase: "street",
    icon: "🏍️",
    title: "暴雨中送餐的小陈",
    story: "暴雨如注，你钻到便利店门口躲雨。一个穿荧光绿冲锋衣的年轻人也冲进来，手里拎着外卖袋，一边甩头盔上的水一边叹气：\n\n「哎，这天气，还有六个单要送……」\n\n他嘴上是抱怨，手上却没停，麻利地翻看手机规划路线。他自我介绍了下，说自己叫小陈，干这行三年了。",
    conditions: function (st) {
      return (st && st.player && st.player.day >= 8 && (!st.relationships || !st.relationships.xiaochen || !st.relationships.xiaochen.met));
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "🏍️ 帮他跑一单，推着车一起出发",
        hint: "结识小陈，好感+10",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.xiaochen) st.relationships.xiaochen = { affinity: 0, met: true };
          st.relationships.xiaochen.met = true;
          st.relationships.xiaochen.affinity = Math.min(100, (st.relationships.xiaochen.affinity || 0) + 10);
          if (st.resources) st.resources.cash += 30;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.flags) st.flags._xiaochenMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🏍️ 你套上雨衣，跟小陈在暴雨里跑了一单。他请你喝了杯热奶茶，还分了¥30跑腿费。结识小陈，好感+10。", "success");
        },
      },
      {
        text: "🙂 天冷，请他喝了杯热饮",
        hint: "结识小陈，好感+6",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.xiaochen) st.relationships.xiaochen = { affinity: 0, met: true };
          st.relationships.xiaochen.met = true;
          st.relationships.xiaochen.affinity = Math.min(100, (st.relationships.xiaochen.affinity || 0) + 6);
          if (st.flags) st.flags._xiaochenMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🙂 小陈接过热饮，咧嘴笑了：「暖和了！兄弟，我叫小陈，这片区跑外卖的，有需要找我就行。」结识小陈，好感+6。", "info");
        },
      },
    ],
  });

  // ===== 赵师傅（master_zhao）修车师傅 — 首次登场 =====
  RANDOM_EVENTS.push({
    id: "npc_master_zhao_first_meet",
    phase: "street",
    icon: "🔧",
    title: "工业区修车铺的赵师傅",
    story: "你路过工业区一家修车铺，一个满手油污的中年男人正对着一辆破面包车皱眉。看到你走近，他抬头喊了一声：\n\n「小伙子，搭把手？帮我扶一下这个发动机盖，一个人真费劲。」\n\n他一边干活一边聊起来，说自己是赵师傅，干这行二十年了。",
    conditions: function (st) {
      return (st && st.player && st.player.day >= 12 && (!st.relationships || !st.relationships.master_zhao || !st.relationships.master_zhao.met));
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🔧 搭把手帮他扶一下",
        hint: "结识赵师傅，好感+10",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.master_zhao) st.relationships.master_zhao = { affinity: 0, met: true };
          st.relationships.master_zhao.met = true;
          st.relationships.master_zhao.affinity = Math.min(100, (st.relationships.master_zhao.affinity || 0) + 10);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (st.flags) st.flags._masterZhaoMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🔧 你帮着扶了十几分钟，赵师傅麻利地修好了。他拍拍你的肩膀：「小伙子不错，以后修车找我，给你打折。」结识赵师傅，好感+10，心情+4。", "success");
        },
      },
      {
        text: "🙂 在旁边看了一会儿，聊了几句",
        hint: "结识赵师傅，好感+5",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.master_zhao) st.relationships.master_zhao = { affinity: 0, met: true };
          st.relationships.master_zhao.met = true;
          st.relationships.master_zhao.affinity = Math.min(100, (st.relationships.master_zhao.affinity || 0) + 5);
          if (st.flags) st.flags._masterZhaoMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🙂 赵师傅边修车边跟你唠了几句，说现在的车跟二十年前完全不一样了。结识赵师傅，好感+5。", "info");
        },
      },
    ],
  });

  // ===== 小丽（xiaoli）网红主播 — 首次登场 =====
  RANDOM_EVENTS.push({
    id: "npc_xiaoli_first_meet",
    phase: "street",
    icon: "📱",
    title: "科技园的小丽主播",
    story: "科技园咖啡厅里，一个妆容精致的女孩正在自拍直播，手机支架、补光灯一应俱全。她关掉直播后，疲惫地趴在桌上，看到你坐旁边，苦笑了一下：\n\n「做主播好累啊……今天嗓子都哑了。你是附近上班的？」\n\n她自我介绍了下，说自己叫小丽，在这边做短视频和直播。",
    conditions: function (st) {
      return (st && st.player && st.player.day >= 15 && (!st.relationships || !st.relationships.xiaoli || !st.relationships.xiaoli.met));
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "☕ 请她喝杯咖啡，聊聊直播行业",
        hint: "结识小丽，好感+8",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.xiaoli) st.relationships.xiaoli = { affinity: 0, met: true };
          st.relationships.xiaoli.met = true;
          st.relationships.xiaoli.affinity = Math.min(100, (st.relationships.xiaoli.affinity || 0) + 8);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.flags) st.flags._xiaoliMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("☕ 你们聊了一个小时，小丽讲了做内容的各种门道。结识小丽，好感+8，心情+3。", "success");
        },
      },
      {
        text: "🙂 简单打了个招呼",
        hint: "结识小丽，好感+4",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.xiaoli) st.relationships.xiaoli = { affinity: 0, met: true };
          st.relationships.xiaoli.met = true;
          st.relationships.xiaoli.affinity = Math.min(100, (st.relationships.xiaoli.affinity || 0) + 4);
          if (st.flags) st.flags._xiaoliMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🙂 小丽点点头，继续看自己的数据后台。结识小丽，好感+4。", "info");
        },
      },
    ],
  });

  // ===== 王医生（dr_wang）医院医生 — 首次登场 =====
  RANDOM_EVENTS.push({
    id: "npc_dr_wang_first_meet",
    phase: "street",
    icon: "🩺",
    title: "医院里的王医生",
    story: "你因为身体不适去医院挂了个号。坐诊的是位五十出头的医生，白大褂洗得发白，胸前口袋插着两支笔和一个旧听诊器。他看完你的检查单，抬头看了你一眼：\n\n「年轻人，你这个指标不太好看啊。长期熬夜还是饮食不规律？」\n\n他语气不算严厉，但带着不容敷衍的认真。胸牌上写着：王建国，内科。",
    conditions: function (st) {
      return (st && st.player && st.player.day >= 5 && (!st.relationships || !st.relationships.dr_wang || !st.relationships.dr_wang.met));
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🩺 认真回答，感谢医生的关心",
        hint: "结识王医生，好感+12",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.dr_wang) st.relationships.dr_wang = { affinity: 0, met: true };
          st.relationships.dr_wang.met = true;
          st.relationships.dr_wang.affinity = Math.min(100, (st.relationships.dr_wang.affinity || 0) + 12);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.flags) st.flags._drWangMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🩺 王医生认真听了你的情况，给你开了药，还列了一张作息表。你感觉被认真对待了。结识王医生，好感+12，心情+3。", "success");
        },
      },
      {
        text: "🙂 礼貌回应，拿了药方就走",
        hint: "结识王医生，好感+5",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.dr_wang) st.relationships.dr_wang = { affinity: 0, met: true };
          st.relationships.dr_wang.met = true;
          st.relationships.dr_wang.affinity = Math.min(100, (st.relationships.dr_wang.affinity || 0) + 5);
          if (st.flags) st.flags._drWangMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🙂 王医生点点头，继续写下一份病历。结识王医生，好感+5。", "info");
        },
      },
    ],
  });

  // ===== 赵姐（zhaojie）房产中介 — 首次登场 =====
  RANDOM_EVENTS.push({
    id: "npc_zhaojie_first_meet",
    phase: "street",
    icon: "🏠",
    title: "商业区的赵姐中介",
    story: "你经过商业区一家房产中介门店，一个穿职业装的干练女人正站在店门口打电话，语气利落：\n\n「对，那套两居室今天下午就可以看……租金还能谈，我跟房东熟。」\n\n她挂了电话，看到你站在门口打量，笑着说：「租房还是买房？来找赵姐就对了，这一片我熟。」",
    conditions: function (st) {
      return (st && st.player && st.player.day >= 10 && (!st.relationships || !st.relationships.zhaojie || !st.relationships.zhaojie.met));
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "🏠 进去聊聊，问问租房行情",
        hint: "结识赵姐，好感+8",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.zhaojie) st.relationships.zhaojie = { affinity: 0, met: true };
          st.relationships.zhaojie.met = true;
          st.relationships.zhaojie.affinity = Math.min(100, (st.relationships.zhaojie.affinity || 0) + 8);
          if (st.flags) st.flags._zhaojieMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🏠 赵姐给你倒了一杯茶，详细讲了这片区的房租行情。认识了一个靠谱的中介，以后租房不抓瞎了。结识赵姐，好感+8。", "success");
        },
      },
      {
        text: "📱 先加个微信，改天再聊",
        hint: "结识赵姐，好感+4",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.zhaojie) st.relationships.zhaojie = { affinity: 0, met: true };
          st.relationships.zhaojie.met = true;
          st.relationships.zhaojie.affinity = Math.min(100, (st.relationships.zhaojie.affinity || 0) + 4);
          if (st.flags) st.flags._zhaojieMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("📱 赵姐笑着加了你的微信：「有需要随时找我，姐给你最实在的报价。」结识赵姐，好感+4。", "info");
        },
      },
    ],
  });

  // ===== 陈师傅（chef_chen）大厨 — A类:有定义/有矩阵/有下游事件，但无 first_meet → 永久 dormant =====
  // 修复原则与 auntie_lin/chen_ge/ajie 一致：补登场闸门(!met)，解锁烹饪技能线+节日对话+好感奖励后续
  RANDOM_EVENTS.push({
    id: "npc_chef_chen_first_meet",
    phase: "street",
    icon: "🍳",
    title: "商业区的陈师傅",
    story:
      "商业区的小餐馆里，一个围着油腻围裙的中年男人正颠勺炒菜，火舌蹿起半米高。他看见你探头，用锅铲指了指：「饿了吧？尝尝我新研制的葱爆牛肉！」\n\n" +
      "一盘热菜摆到你面前，牛肉嫩滑、葱香扑鼻。他擦擦手问：「看你天天跑来跑去，不如学门手艺？做菜这行，饿不着。」",
    conditions: function (st) {
      // [全系统自洽修复] 域D A类#4: chef_chen 从未被任何路径 met → 本条解除 dormant
      return (
        st &&
        st.player &&
        st.player.day >= 10 &&
        (!st.relationships ||
          !st.relationships.chef_chen ||
          !st.relationships.chef_chen.met)
      );
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "🍳 给他打下手，学两招",
        hint: "结识陈师傅，好感+12，烹饪XP+20",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.chef_chen) {
            st.relationships.chef_chen = { affinity: 0, met: true };
          }
          st.relationships.chef_chen.met = true;
          st.relationships.chef_chen.affinity = Math.min(
            100,
            (st.relationships.chef_chen.affinity || 0) + 12, // [PLACEHOLDER] 好感
          );
          // 烹饪技能XP奖励（鼓励玩家走进厨师职业路径 C→C联动）
          if (st.skills && st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 20; // [PLACEHOLDER] 技能XP
          }
          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); // [PLACEHOLDER] 心情
          if (st.flags) {
            st.flags._chefChenMetDay = st.player.day;
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🍳 陈师傅把锅铲递给你：「手腕发力，火候看 color。」你初步体验了烹饪的魅力！结识陈师傅，好感+12，烹饪XP+20。",
              "success",
            );
        },
      },
      {
        text: "🍜 吃完就走，说声谢谢",
        hint: "结识陈师傅，好感+5",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.chef_chen) {
            st.relationships.chef_chen = { affinity: 0, met: true };
          }
          st.relationships.chef_chen.met = true;
          st.relationships.chef_chen.affinity = Math.min(
            100,
            (st.relationships.chef_chen.affinity || 0) + 5, // [PLACEHOLDER] 好感
          );
          if (st.flags) st.flags._chefChenMetDay = st.player.day;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🍜 陈师傅点点头：「年轻人有礼貌，常来吃啊。」结识陈师傅，好感+5。",
              "info",
            );
        },
      },
    ],
  });
})();
