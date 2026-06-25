export type EventTriggerType = "random" | "chain" | "timed" | "location";
export type EffectOperation = "add" | "set" | "mul";

export interface GameEventEffect {
  target: string;
  op: EffectOperation;
  value: number;
}

export interface GameEventChoice {
  id: string;
  text: string;
  hint: string;
  effects: GameEventEffect[];
  requirement?: { field: string; min?: number; max?: number };
}

export interface GameEvent {
  id: string;
  name: string;
  icon: string;
  description: string;
  trigger: {
    type: EventTriggerType;
    dayMin: number;
    dayMax?: number;
    weight: number;
    prerequisites?: string[];
    location?: string;
  };
  choices: GameEventChoice[];
  narrativeBefore: string;
  narrativeAfter: (choiceId: string) => string;
  followUp?: string;
  tags: string[];
}

function pickNarrative(
  choiceId: string,
  narratives: Record<string, string>,
  fallback: string,
): string {
  return narratives[choiceId] ?? fallback;
}

export const EVENTS: GameEvent[] = [
  {
    id: "webapp_rent_arrears_notice",
    name: "房租催缴单",
    icon: "🏚️",
    description: "房东把一张红色催缴单塞进门缝，月底之前必须给答复。",
    trigger: {
      type: "random",
      dayMin: 12,
      weight: 16,
      prerequisites: ["resources.cash < 1200"],
      location: "slum",
    },
    choices: [
      {
        id: "negotiate",
        text: "找房东商量宽限",
        hint: "花时间沟通，可能换来几天缓冲",
        effects: [
          { target: "player.charm", op: "add", value: 1 },
          { target: "needs.happiness", op: "add", value: -3 },
        ],
      },
      {
        id: "pay_partial",
        text: "先交一部分",
        hint: "现金压力变大，但房东态度缓和",
        requirement: { field: "resources.cash", min: 300 },
        effects: [
          { target: "resources.cash", op: "add", value: -300 },
          { target: "flags._rentTrust", op: "add", value: 1 },
        ],
      },
      {
        id: "ignore",
        text: "先拖着",
        hint: "保住现金，但后续风险上升",
        effects: [
          { target: "flags._rentArrears", op: "add", value: 1 },
          { target: "needs.happiness", op: "add", value: -8 },
        ],
      },
    ],
    narrativeBefore: "催缴单上的字很短，却让整间屋子都显得更窄。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          negotiate: "房东嘴上不耐烦，最后还是给了你几天时间。",
          pay_partial: "你把零钱凑成一沓，至少今晚能睡得踏实一点。",
          ignore: "你把单子压在杯子下面，心里知道这事不会自己消失。",
        },
        "这张催缴单被你收进了抽屉。",
      ),
    tags: ["housing", "survival", "street", "pressure"],
  },
  {
    id: "webapp_factory_overtime_choice",
    name: "临时加班名额",
    icon: "🏭",
    description: "主管问谁愿意留下来赶一批急单，钱不多，但今天就结。",
    trigger: {
      type: "location",
      dayMin: 8,
      weight: 14,
      location: "factoryZone",
    },
    choices: [
      {
        id: "accept",
        text: "留下加班",
        hint: "换现金，也换疲劳",
        effects: [
          { target: "resources.cash", op: "add", value: 140 },
          { target: "needs.fatigue", op: "add", value: 18 },
          { target: "skills.electrician.xp", op: "add", value: 2 },
        ],
      },
      {
        id: "decline",
        text: "婉拒回去休息",
        hint: "少赚一点，保住状态",
        effects: [
          { target: "needs.fatigue", op: "add", value: -8 },
          { target: "needs.happiness", op: "add", value: 2 },
        ],
      },
    ],
    narrativeBefore: "机器还在响，工位上的人却都在看主管手里的名单。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          accept: "你把最后一箱货码好时，天已经黑透。",
          decline: "你第一次觉得，能按时下班也是一种收入。",
        },
        "工厂的灯光从窗户里漏出来。",
      ),
    tags: ["factory", "work", "fatigue", "cash"],
  },
  {
    id: "webapp_platform_account_ban",
    name: "平台账号警告",
    icon: "📱",
    description: "兼职平台提示你近期接单异常，继续违规可能封号。",
    trigger: {
      type: "random",
      dayMin: 35,
      weight: 10,
      prerequisites: ["flags._sideHustleOrders > 5"],
    },
    choices: [
      {
        id: "appeal",
        text: "提交申诉材料",
        hint: "耗费精力，降低封号风险",
        effects: [
          { target: "player.actionPoints", op: "add", value: -2 },
          { target: "flags._platformTrust", op: "add", value: 1 },
        ],
      },
      {
        id: "ignore",
        text: "继续冲单",
        hint: "短期多赚，长期不稳",
        effects: [
          { target: "resources.cash", op: "add", value: 90 },
          { target: "flags._platformRisk", op: "add", value: 1 },
        ],
      },
    ],
    narrativeBefore: "手机震了一下，系统通知比催债短信还冷。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          appeal: "你把截图和说明一张张传上去，至少留了条后路。",
          ignore: "今晚的单很多，你暂时不想看那条警告。",
        },
        "平台的规则写得很细，人却只能匆忙决定。",
      ),
    tags: ["platform", "side_hustle", "risk"],
  },
  {
    id: "webapp_medical_bill_argument",
    name: "账单窗口争执",
    icon: "🧾",
    description: "医院收费窗口前有人因为医保报销比例吵了起来。",
    trigger: {
      type: "location",
      dayMin: 20,
      weight: 13,
      location: "hospital",
    },
    choices: [
      {
        id: "ask_policy",
        text: "顺便咨询自己的医保",
        hint: "获得账单意识",
        effects: [
          { target: "medical.costAwareness", op: "add", value: 1 },
          { target: "needs.happiness", op: "add", value: 1 },
        ],
      },
      {
        id: "help_translate",
        text: "帮老人看清条目",
        hint: "花时间帮忙，换一点名声",
        effects: [
          { target: "player.fame", op: "add", value: 2 },
          { target: "player.actionPoints", op: "add", value: -1 },
        ],
      },
    ],
    narrativeBefore: "收费单像一串看不懂的数字，围观的人都沉默了一会儿。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          ask_policy: "窗口工作人员讲得很快，但你终于知道哪些票据要留。",
          help_translate: "老人连声道谢，你突然理解了账单背后的焦虑。",
        },
        "账单被打印机吐出来，生活继续往前推。",
      ),
    tags: ["medical", "insurance", "hospital"],
  },
  {
    id: "webapp_neighbor_pipe_leak",
    name: "邻居水管漏水",
    icon: "🚰",
    description: "楼上水管漏了，天花板慢慢洇出一圈灰色水痕。",
    trigger: {
      type: "random",
      dayMin: 25,
      weight: 12,
      location: "slum",
    },
    choices: [
      {
        id: "fix_together",
        text: "带工具一起修",
        hint: "维修经验和邻里关系",
        requirement: { field: "skills.repair.level", min: 5 },
        effects: [
          { target: "skills.repair.xp", op: "add", value: 8 },
          { target: "flags._neighborTrust", op: "add", value: 1 },
        ],
      },
      {
        id: "call_landlord",
        text: "叫房东处理",
        hint: "省心，但可能拖延",
        effects: [
          { target: "needs.happiness", op: "add", value: -2 },
          { target: "flags._landlordRepairCalled", op: "add", value: 1 },
        ],
      },
    ],
    narrativeBefore: "盆接住了水，却接不住你对这间屋子的疲惫。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          fix_together: "你们折腾半天，总算把漏点堵住了。",
          call_landlord: "房东说马上来，电话挂断后走廊又安静下来。",
        },
        "水声一点点变小。",
      ),
    tags: ["housing", "repair", "neighbor"],
  },
  {
    id: "webapp_credit_card_call",
    name: "信用卡推销电话",
    icon: "💳",
    description: "银行客服说你有机会申请一张额度不低的信用卡。",
    trigger: {
      type: "random",
      dayMin: 45,
      weight: 9,
      prerequisites: ["flags._creditChecked"],
    },
    choices: [
      {
        id: "learn_terms",
        text: "问清年费和利息",
        hint: "金融意识提升",
        effects: [
          { target: "player.intelligence", op: "add", value: 1 },
          { target: "flags._creditKnowledge", op: "add", value: 1 },
        ],
      },
      {
        id: "apply_now",
        text: "立刻申请",
        hint: "获得额度，但诱惑也变多",
        effects: [
          { target: "flags._creditCardLimit", op: "add", value: 3000 },
          { target: "needs.happiness", op: "add", value: 2 },
        ],
      },
    ],
    narrativeBefore: "电话那头的声音很专业，像在把未来收入提前递给你。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          learn_terms: "你记下几个关键词，决定不让自己被额度牵着走。",
          apply_now: "申请通过的短信很快来了，快乐和风险一起到账。",
        },
        "电话挂断，屏幕上还亮着银行号码。",
      ),
    tags: ["finance", "credit", "bank"],
  },
  {
    id: "webapp_subway_help_elder",
    name: "地铁口的老人",
    icon: "🚇",
    description: "一位老人站在闸机前，不知道怎么用手机刷码。",
    trigger: {
      type: "location",
      dayMin: 6,
      weight: 18,
      location: "commercialDist",
    },
    choices: [
      {
        id: "help",
        text: "停下来帮忙",
        hint: "花一点时间，获得小小善意",
        effects: [
          { target: "player.fame", op: "add", value: 1 },
          { target: "needs.happiness", op: "add", value: 4 },
          { target: "player.actionPoints", op: "add", value: -1 },
        ],
      },
      {
        id: "walk_by",
        text: "赶时间离开",
        hint: "不耽误行程",
        effects: [{ target: "needs.happiness", op: "add", value: -1 }],
      },
    ],
    narrativeBefore: "人流从你身边擦过去，老人攥着手机显得有点窘迫。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          help: "闸机亮起绿灯时，老人笑着对你点了点头。",
          walk_by: "你挤进人流，心里仍然浮着那个迟疑的背影。",
        },
        "地铁口又恢复了它惯常的拥挤。",
      ),
    tags: ["morality", "city", "transport"],
  },
  {
    id: "webapp_food_safety_complaint",
    name: "小摊食安投诉",
    icon: "🍢",
    description: "你听见有人说附近小摊用的油有问题，摊主急得脸色发白。",
    trigger: {
      type: "location",
      dayMin: 30,
      weight: 11,
      location: "commercialDist",
    },
    choices: [
      {
        id: "report",
        text: "向市场监管投诉",
        hint: "维护规则，可能影响摊主",
        effects: [
          { target: "player.fame", op: "add", value: 2 },
          { target: "flags._foodSafetyReports", op: "add", value: 1 },
        ],
      },
      {
        id: "warn_vendor",
        text: "私下提醒摊主",
        hint: "留情面，但需要承担不确定性",
        effects: [
          { target: "player.charm", op: "add", value: 1 },
          { target: "flags._vendorWarnings", op: "add", value: 1 },
        ],
      },
    ],
    narrativeBefore: "一口热油能养活一个摊位，也可能毁掉几个人的信任。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          report: "监管人员记下了线索，你知道这不一定讨喜，但必要。",
          warn_vendor: "摊主沉默了一会儿，把油桶搬到了你看不见的地方。",
        },
        "油锅继续响着，香味里混着犹疑。",
      ),
    tags: ["food", "law", "morality", "vending"],
  },
  {
    id: "webapp_layoff_rumor",
    name: "裁员传闻",
    icon: "📉",
    description: "茶水间里有人说公司要缩编，名单可能本周就出来。",
    trigger: {
      type: "random",
      dayMin: 90,
      weight: 10,
      prerequisites: ["phase === 'corporate'"],
    },
    choices: [
      {
        id: "update_resume",
        text: "更新简历",
        hint: "准备后路",
        effects: [
          { target: "player.intelligence", op: "add", value: 1 },
          { target: "flags._resumeReady", op: "set", value: 1 },
        ],
      },
      {
        id: "work_harder",
        text: "主动揽活",
        hint: "增加绩效，也增加压力",
        effects: [
          { target: "player.performance", op: "add", value: 3 },
          { target: "needs.fatigue", op: "add", value: 12 },
        ],
      },
    ],
    narrativeBefore: "传闻没有署名，却像一阵冷风吹进每个工位。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          update_resume: "你把项目经历重新写了一遍，像给自己留下一条出口。",
          work_harder: "你接下了额外任务，电脑屏幕亮到深夜。",
        },
        "茶水间很快又只剩咖啡机的声音。",
      ),
    tags: ["corporate", "career", "risk"],
  },
  {
    id: "webapp_found_shared_bike",
    name: "坏掉的共享单车",
    icon: "🚲",
    description: "路边一辆共享单车链条掉了，挡在盲道边。",
    trigger: {
      type: "random",
      dayMin: 5,
      weight: 15,
    },
    choices: [
      {
        id: "repair",
        text: "顺手修好推开",
        hint: "维修经验，城市熟悉度",
        effects: [
          { target: "skills.repair.xp", op: "add", value: 4 },
          { target: "travel.localFamiliarity", op: "add", value: 1 },
        ],
      },
      {
        id: "move_only",
        text: "只把车挪到一边",
        hint: "快速解决挡路",
        effects: [{ target: "needs.happiness", op: "add", value: 1 }],
      },
    ],
    narrativeBefore: "车轮歪着，像城市日常里一处没人认领的小麻烦。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          repair: "链条重新咬住齿轮，你拍了拍手上的黑油。",
          move_only: "至少盲道空出来了，你继续赶路。",
        },
        "街角恢复了通行。",
      ),
    tags: ["city", "repair", "transport"],
  },
  {
    id: "webapp_live_stream_collab",
    name: "临时直播搭档",
    icon: "🎥",
    description: "小丽缺一个帮忙试吃的搭档，问你愿不愿意露脸。",
    trigger: {
      type: "location",
      dayMin: 40,
      weight: 10,
      location: "techPark",
      prerequisites: ["npc.xiao_li.affinity >= 30"],
    },
    choices: [
      {
        id: "join",
        text: "参与直播",
        hint: "涨名气，也有社交压力",
        effects: [
          { target: "player.fame", op: "add", value: 4 },
          { target: "needs.fatigue", op: "add", value: 8 },
          { target: "skills.charm.xp", op: "add", value: 5 },
        ],
      },
      {
        id: "behind_camera",
        text: "只帮忙拿设备",
        hint: "低调帮忙",
        effects: [
          { target: "skills.repair.xp", op: "add", value: 2 },
          { target: "flags._helpedStreamSetup", op: "add", value: 1 },
        ],
      },
    ],
    narrativeBefore: "补光灯一亮，连路边的风都像被收进了镜头。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          join: "弹幕刷得很快，你第一次理解什么叫被看见。",
          behind_camera: "你把线理顺，小丽冲镜头外比了个感谢的手势。",
        },
        "直播结束后，手机还在微微发烫。",
      ),
    tags: ["npc", "social", "content", "techPark"],
  },
  {
    id: "webapp_community_volunteer",
    name: "社区志愿者招募",
    icon: "🤝",
    description: "居委会招人帮忙发通知、登记老人需求，报酬不高。",
    trigger: {
      type: "timed",
      dayMin: 60,
      weight: 8,
      location: "gov_office",
    },
    choices: [
      {
        id: "volunteer",
        text: "参加半天志愿服务",
        hint: "提升社会信用和道德感",
        effects: [
          { target: "player.fame", op: "add", value: 2 },
          { target: "flags._communityService", op: "add", value: 1 },
          { target: "needs.happiness", op: "add", value: 5 },
        ],
      },
      {
        id: "ask_paid",
        text: "问有没有补贴岗位",
        hint: "争取实际收入",
        effects: [
          { target: "resources.cash", op: "add", value: 60 },
          { target: "player.charm", op: "add", value: 1 },
        ],
      },
    ],
    narrativeBefore: "公告栏上的纸被胶带贴得皱皱巴巴，却写着很多人的需求。",
    narrativeAfter: (choiceId) =>
      pickNarrative(
        choiceId,
        {
          volunteer: "你跑了几栋楼，累，但觉得自己和这座城市靠近了一点。",
          ask_paid: "工作人员给你安排了登记补贴岗，事情现实但不难看。",
        },
        "社区办公室里有人给你倒了杯温水。",
      ),
    tags: ["community", "gov", "social_credit"],
  },
];

export const EVENT_CATALOG_STATUS = {
  migrated: EVENTS.length,
  legacySource:
    "src/js/core/events_core.js + events_street.js + events_corp.js",
  nextStep:
    "新增事件继续进入 src/app/data/events，再由 bridge 分批接入 legacy。",
} as const;
