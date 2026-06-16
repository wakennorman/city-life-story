/**
 * NPC 定义 — 街头生活中遇到的各色人物
 */

/**
 * NPC好感阈值奖励设计（参考Stardew Valley Heart Events）：
 * 30好感=熟人：解锁特殊对话+小福利
 * 60好感=好友：解锁独家资源/折扣
 * 80好感=挚友：解锁稀有机会/重要帮助
 */
const NPCS = [
  {
    id: "aunt_wang",
    name: "王大婶",
    role: "房东",
    location: "slum",
    desc: "城中村的房东，说话嗓门大但心地不坏。偶尔会介绍些零活。",
    talkLines: [
      "小伙子，这个月房租该交了啊！",
      "看你挺勤快的，工地上缺人要不要去试试？",
      "年轻人要有志气，别一辈子收废品。",
    ],
    giftPrefers: ["fruits", "daily_use"],
    // 好感阈值奖励
    affinityRewards: [
      {
        threshold: 30,
        id: "aunt_wang_30",
        desc: "王大婶开始偶尔带你一份饭（每天吃饭省¥3）",
        effect: function (st) {
          st.flags.auntWangMeal = true;
          StateManager.addMessage(
            "💕 王大婶：「你是个好孩子，以后你来我家蹭饭！」好感到30，每天多带一份饭给你。",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "aunt_wang_60",
        desc: "王大婶为你降租¥50/天",
        effect: function (st) {
          st.flags.auntWangRentDiscount = true;
          StateManager.addMessage(
            "💕 王大婶悄悄说：「你帮了我不少，房租就按250算吧，别告诉别人。」",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "aunt_wang_80",
        desc: "王大婶介绍可靠工作，每月额外收入",
        effect: function (st) {
          const bonus = 500 + Math.floor(Math.random() * 300);
          st.resources.cash += bonus;
          st.resources.totalEarned += bonus;
          StateManager.addMessage(
            "❤️ 王大婶：「我侄子开了家公司，特别推荐了你，给了你¥" +
              bonus +
              " 的介绍奖金！」",
            "success",
          );
        },
      },
    ],
  },
  {
    id: "boss_li",
    name: "李工头",
    role: "包工头",
    location: "construction",
    desc: "建筑工地的包工头，手上活多。关系好了会给好活。",
    talkLines: ["今天活多，加紧干！", "小心点，安全第一。", "干得好有奖金。"],
    giftPrefers: ["cigarettes", "beer"],
    affinityRewards: [
      {
        threshold: 30,
        id: "boss_li_30",
        desc: "李工头开始安排你做技术活（工资+20%）",
        effect: function (st) {
          st.flags.bossLiSkillJob = true;
          StateManager.addMessage(
            "💕 李工头：「你这小伙子踏实，以后跟着我干技术活，工钱多给你两成。」",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "boss_li_60",
        desc: "李工头借给你¥500应急（无息）",
        effect: function (st) {
          st.resources.cash += 500;
          st.flags.bossLiLoan = true;
          StateManager.addMessage(
            "💕 李工头拍着你肩膀：「手头紧？先拿500，不急还。」",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "boss_li_80",
        desc: "李工头推荐你去正规工程队，解锁更高收入工作",
        effect: function (st) {
          st.flags.bossLiReferred = true;
          StateManager.addMessage(
            "❤️ 李工头：「我认识个正规工程队的老板，把你推荐过去了，工资是这里两倍！」",
            "success",
          );
        },
      },
    ],
  },
  {
    id: "sister_zhang",
    name: "张姐",
    role: "中介",
    location: "commercialDist",
    desc: "人力资源中介，认识各行各业的人。帮她跑腿可以提升关系。",
    talkLines: [
      "我这边有几个好工作，你要不要看看？",
      "做服务业态度最重要。",
      "多考几个证，好工作不愁。",
    ],
    giftPrefers: ["clothing", "snacks"],
    affinityRewards: [
      {
        threshold: 30,
        id: "sister_zhang_30",
        desc: "张姐透露内部招聘信息",
        effect: function (st) {
          const bonus = 200 + Math.floor(Math.random() * 300);
          st.resources.cash += bonus;
          st.resources.totalEarned += bonus;
          StateManager.addMessage(
            "💕 张姐悄悄发来一个内推机会，接了个短单赚了 ¥" + bonus + "。",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "sister_zhang_60",
        desc: "张姐帮你免费考证书辅导资料",
        effect: function (st) {
          var skills = Object.keys(st.skills);
          skills.forEach(function (k) {
            st.skills[k].xp += 50;
          });
          StateManager.addMessage(
            "💕 张姐送了你一套证书备考资料，所有技能XP+50！",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "sister_zhang_80",
        desc: "张姐帮你内推进入初级职场（加速进入P5）",
        effect: function (st) {
          st.flags.zhangReferred = true;
          StateManager.addMessage(
            "❤️ 张姐：「我认识个猎头，帮你递了简历，面试机会来了！进职场的路近了。」",
            "success",
          );
        },
      },
    ],
  },
  {
    id: "old_zhou",
    name: "老周",
    role: "收废品老人",
    location: "slum",
    desc: "在城中村收了几十年废品的老前辈。知道废品行情的门道。",
    talkLines: [
      "废金属最近涨了，赶紧多收点。",
      "收废品虽然脏，但也是一门生意经。",
      "年轻人脑子活，学学怎么挑好货。",
    ],
    giftPrefers: ["beer", "instant_noodles"],
    affinityRewards: [
      {
        threshold: 30,
        id: "old_zhou_30",
        desc: "老周分享废品行情密报（每日收废品+¥15）",
        effect: function (st) {
          st.flags.oldZhouTips = true;
          StateManager.addMessage(
            "💕 老周：「我告诉你，最近钢铁价格要涨，多囤点废铁。」废品回收效率大增！",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "old_zhou_60",
        desc: "老周借给你一辆三轮车（扩大废品回收范围）",
        effect: function (st) {
          st.flags.oldZhouTricycle = true;
          StateManager.addMessage(
            "💕 老周把他的旧三轮车借给你，收废品的范围广了，效率提升！",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "old_zhou_80",
        desc: "老周把废品站关系介绍给你（解锁高价收购渠道）",
        effect: function (st) {
          st.flags.oldZhouChannel = true;
          StateManager.addMessage(
            "❤️ 老周：「我干了三十年了，以后废品直接走我的渠道，价格比外面高三成。」",
            "success",
          );
        },
      },
    ],
  },
  {
    id: "xiao_mei",
    name: "小美",
    role: "大学生",
    location: "school",
    desc: "大学城的贫困生，周末做家教赚生活费。",
    talkLines: [
      "你知道哪里还有家教的机会吗？",
      "我英语还不错，可以教初中生。",
      "毕业后想去大厂，得先积累经验。",
    ],
    giftPrefers: ["fruits", "snacks"],
    affinityRewards: [
      {
        threshold: 30,
        id: "xiao_mei_30",
        desc: "小美每周分享一道英语/编程练习题（+XP）",
        effect: function (st) {
          st.skills.english.xp += 60;
          st.skills.coding.xp += 60;
          StateManager.addMessage(
            "💕 小美每周给你发习题，英语和编程XP各+60！学习不孤单了。",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "xiao_mei_60",
        desc: "小美介绍图书馆内部学习资源（训练效率+30%）",
        effect: function (st) {
          st.flags.xiaomeiLibrary = true;
          StateManager.addMessage(
            "💕 小美给了你图书馆的内部学习账号，自习效率大增！",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "xiao_mei_80",
        desc: "小美帮你联系大厂实习机会",
        effect: function (st) {
          st.flags.xiaomeiInternship = true;
          StateManager.addMessage(
            "❤️ 小美：「我室友在字节做了实习，我把你推荐给她了，有机会进大厂了！」",
            "success",
          );
        },
      },
    ],
  },
  {
    id: "chef_chen",
    name: "陈师傅",
    role: "大厨",
    location: "commercialDist",
    desc: "商业区小有名气的厨师，手艺了得。想学烹饪可以找他。",
    talkLines: [
      "做菜讲究火候，做人讲究分寸。",
      "来尝尝我新研制的配方。",
      "你有点天分，要不要学两手？",
    ],
    giftPrefers: ["beer", "vegetables"],
    affinityRewards: [
      {
        threshold: 30,
        id: "chef_chen_30",
        desc: "陈师傅教你一道菜（烹饪XP+80）",
        effect: function (st) {
          st.skills.cooking.xp += 80;
          StateManager.addMessage(
            "💕 陈师傅手把手教了你一道特色菜，烹饪XP+80！",
            "success",
          );
        },
      },
      {
        threshold: 60,
        id: "chef_chen_60",
        desc: "陈师傅让你做帮厨打下手（每次+¥50+烹饪XP）",
        effect: function (st) {
          st.flags.chefChenAssistant = true;
          st.resources.cash += 50;
          st.skills.cooking.xp += 40;
          StateManager.addMessage(
            "💕 陈师傅：「你来帮我打下手吧，一次50块，还能学手艺。」",
            "success",
          );
        },
      },
      {
        threshold: 80,
        id: "chef_chen_80",
        desc: "陈师傅传授独门秘方（吃饭费用永久-20%）",
        effect: function (st) {
          st.flags.chefChenRecipe = true;
          StateManager.addMessage(
            "❤️ 陈师傅拿出了压箱底的食谱：「这是我师父传给我的，今天传给你。」自己做饭省20%。",
            "success",
          );
        },
      },
    ],
  },
];

/** 获取NPC */
function getNpcById(npcId) {
  return NPCS.find((n) => n.id === npcId) || null;
}

/** 获取当前地点的NPC */
function getNpcsAtLocation(locKey) {
  return NPCS.filter((n) => n.location === locKey);
}

/** 获取好感度描述 */
function getAffinityLabel(affinity) {
  if (affinity >= 80) return "❤️ 挚友";
  if (affinity >= 60) return "😊 好友";
  if (affinity >= 30) return "🙂 熟人";
  if (affinity >= 0) return "👤 初识";
  if (affinity >= -30) return "😐 冷淡";
  return "😠 厌恶";
}
