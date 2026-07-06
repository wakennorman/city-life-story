/**
 * NPC 定义 — 街头生活中遇到的各色人物
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
  },
  {
    id: "boss_li",
    name: "李工头",
    role: "包工头",
    location: "construction",
    desc: "建筑工地的包工头，手上活多。关系好了会给好活。",
    talkLines: ["今天活多，加紧干！", "小心点，安全第一。", "干得好有奖金。"],
    giftPrefers: ["cigarettes", "beer"],
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

// ====== NPC 在场隐性加成系统 ======

/**
 * NPC 好感度对应的加成效果定义
 * 每个 NPC 在玩家到达其所在地点时，根据好感度提供不同等级加成
 *
 * bonusType:
 *   - jobIncome: 工作收入加成（百分比）
 *   - priceDiscount: 该地点买卖价格优惠（百分比）
 *   - skillXp: 特定技能经验加成（百分比）
 *   - apEfficiency: AP消耗减少（绝对值）
 *   - extraEvent: 触发额外事件
 */
const NPC_BONUSES = {
  aunt_wang: {
    // 王大婶（城中村）— 房东+包租婆人脉
    thresholds: [
      {
        min: 60,
        jobIncome: 0.25,
        apEfficiency: 2,
        desc: "王大婶把你当自家晚辈，常给你留好活",
      },
      { min: 30, jobIncome: 0.12, desc: "王大婶人脉广，偶尔帮你介绍点外快" },
    ],
  },
  boss_li: {
    // 李工头（建筑工地）— 包工头
    thresholds: [
      {
        min: 60,
        jobIncome: 0.3,
        priceDiscount: 0.05,
        desc: "李工头当你是心腹，好活都留给你",
      },
      { min: 30, jobIncome: 0.15, desc: "李工头对你印象不错，工钱给得爽快" },
    ],
  },
  sister_zhang: {
    // 张姐（商业区）— 中介
    thresholds: [
      {
        min: 60,
        jobIncome: 0.2,
        priceDiscount: 0.08,
        apEfficiency: 2,
        desc: "张姐帮你打点关系，走到哪都方便",
      },
      {
        min: 30,
        jobIncome: 0.1,
        priceDiscount: 0.04,
        desc: "张姐给你介绍了几个熟客",
      },
    ],
  },
  old_zhou: {
    // 老周（城中村）— 废品前辈
    thresholds: [
      {
        min: 60,
        jobIncome: 0.2,
        priceDiscount: 0.1,
        skillXp: "repair",
        desc: "老周把几十年的看家本领都教你了",
      },
      {
        min: 30,
        jobIncome: 0.1,
        priceDiscount: 0.05,
        desc: "老周指点你哪些废品更值钱",
      },
    ],
  },
  xiao_mei: {
    // 小美（大学城）— 大学生
    thresholds: [
      {
        min: 60,
        jobIncome: 0.15,
        skillXp: "english",
        desc: "小美的同学们都来找你当家教",
      },
      { min: 30, jobIncome: 0.08, desc: "小美帮你介绍了几个家教学生" },
    ],
  },
  chef_chen: {
    // 陈师傅（商业区）— 大厨
    thresholds: [
      {
        min: 60,
        jobIncome: 0.25,
        skillXp: "cooking",
        desc: "陈师傅收你当半个徒弟，烹饪突飞猛进",
      },
      { min: 30, jobIncome: 0.12, desc: "陈师傅偶尔指点你几手" },
    ],
  },
};

/**
 * 获取当前地点 NPC 对指定操作类型的总加成倍率
 * @param {Object} state - 游戏状态
 * @param {string} actionType - 'jobIncome' | 'priceDiscount' | 'apEfficiency' | 'skillXp'
 * @param {string} [skillKey] - 如果actionType是skillXp，传入技能名
 * @returns {{ bonus: number, descs: string[] }} - 总加成值和描述列表
 */
function getNpcPresenceBonus(state, actionType, skillKey) {
  const locKey = state.trade.currentLocation;
  const npcsHere = getNpcsAtLocation(locKey);
  let totalBonus = 0;
  const descs = [];

  for (const npc of npcsHere) {
    const npcBonusDef = NPC_BONUSES[npc.id];
    if (!npcBonusDef) continue;

    const rel = state.relationships[npc.id];
    const affinity = rel ? rel.affinity : 0;

    // 找到该NPC对玩家的最高好感度阈值（>= affinity 的最高档）
    let bestThreshold = null;
    for (const t of npcBonusDef.thresholds) {
      if (affinity >= t.min) {
        if (!bestThreshold || t.min > bestThreshold.min) {
          bestThreshold = t;
        }
      }
    }
    if (!bestThreshold) continue;

    // 检查指定操作类型是否有加成
    if (actionType === "skillXp" && skillKey) {
      if (bestThreshold.skillXp === skillKey) {
        totalBonus += bestThreshold[actionType] || 0;
        descs.push(bestThreshold.desc);
      }
    } else if (bestThreshold[actionType]) {
      totalBonus += bestThreshold[actionType] || 0;
      descs.push(bestThreshold.desc);
    }
  }

  return { bonus: totalBonus, descs };
}

/**
 * 获取当前地点所有可见的 NPC 加成描述（供 UI 展示）
 */
function getNpcPresenceSummary(state) {
  const locKey = state.trade.currentLocation;
  const npcsHere = getNpcsAtLocation(locKey);
  const lines = [];

  for (const npc of npcsHere) {
    const npcBonusDef = NPC_BONUSES[npc.id];
    if (!npcBonusDef) continue;

    const rel = state.relationships[npc.id];
    if (!rel || !rel.met) continue;

    const affinity = rel.affinity;
    let bestThreshold = null;
    for (const t of npcBonusDef.thresholds) {
      if (affinity >= t.min) {
        if (!bestThreshold || t.min > bestThreshold.min) {
          bestThreshold = t;
        }
      }
    }
    if (!bestThreshold) continue;

    const parts = [];
    if (bestThreshold.jobIncome)
      parts.push(`收入+${Math.round(bestThreshold.jobIncome * 100)}%`);
    if (bestThreshold.priceDiscount)
      parts.push(`折扣${Math.round(bestThreshold.priceDiscount * 100)}%`);
    if (bestThreshold.apEfficiency)
      parts.push(`AP-${bestThreshold.apEfficiency}`);
    if (bestThreshold.skillXp) parts.push(`${bestThreshold.skillXp}经验+`);

    lines.push({
      npcName: npc.name,
      npcRole: npc.role,
      emoji: getAffinityEmoji(affinity),
      bonusDesc: parts.join(" "),
      flavor: bestThreshold.desc,
    });
  }

  return lines;
}

/** 好感度emoji */
function getAffinityEmoji(affinity) {
  if (affinity >= 80) return "❤️";
  if (affinity >= 60) return "😊";
  if (affinity >= 30) return "👍";
  if (affinity >= 0) return "👤";
  if (affinity >= -30) return "😐";
  return "😠";
}
