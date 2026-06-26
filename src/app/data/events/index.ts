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

  // ── 第二批扩充事件（2026-06-27）──────────────────────────────

  {
    id: "webapp_temp_agency_call",
    name: "劳务中介来电",
    icon: "📞",
    description: "一家劳务中介说有批临时搬运工名额，日结，但要现在确认。",
    trigger: {
      type: "random",
      dayMin: 5,
      weight: 14,
      prerequisites: ["resources.cash < 500"],
    },
    choices: [
      {
        id: "accept",
        text: "立刻答应去",
        hint: "体力换现金，今天就到手",
        effects: [
          { target: "resources.cash", op: "add", value: 180 },
          { target: "needs.fatigue", op: "add", value: 22 },
          { target: "player.physique", op: "add", value: 1 },
        ],
      },
      {
        id: "ask_details",
        text: "先问清楚再决定",
        hint: "避免陷阱，但可能错过名额",
        effects: [
          { target: "player.intelligence", op: "add", value: 1 },
          { target: "needs.happiness", op: "add", value: 1 },
        ],
      },
      {
        id: "decline",
        text: "拒绝，另找出路",
        hint: "保存体力，坚持找更合适的工作",
        effects: [
          { target: "needs.fatigue", op: "add", value: -5 },
        ],
      },
    ],
    narrativeBefore: "号码是陌生的，语气却很熟练，像是每天打出几十个这样的电话。",
    narrativeAfter: (choiceId) =>
      pickNarrative(choiceId, {
        accept: "下午的货很重，但钱打进来的那一刻什么都值了。",
        ask_details: "对方沉默了一秒，然后挂了电话。你记下了号码，以后再说。",
        decline: "你没接这个活。城市里总会有下一个电话。",
      }, "电话里的嗡嗡声消失在街道噪音里。"),
    tags: ["labor", "cash", "survival", "street"],
  },

  {
    id: "webapp_power_outage_night",
    name: "突然停电",
    icon: "🕯️",
    description: "晚上八点，整栋楼忽然断电，你手机还剩 12% 的电。",
    trigger: {
      type: "random",
      dayMin: 18,
      weight: 11,
      location: "slum",
    },
    choices: [
      {
        id: "go_out",
        text: "出去便利店充电坐一会儿",
        hint: "花小钱，维持手机续航",
        effects: [
          { target: "resources.cash", op: "add", value: -15 },
          { target: "needs.happiness", op: "add", value: 3 },
          { target: "player.actionPoints", op: "add", value: -1 },
        ],
      },
      {
        id: "sleep_early",
        text: "干脆早点睡觉",
        hint: "省电省钱，恢复体力",
        effects: [
          { target: "needs.fatigue", op: "add", value: -15 },
          { target: "needs.happiness", op: "add", value: -2 },
        ],
      },
      {
        id: "check_breaker",
        text: "去走廊检查空开",
        hint: "维修技能有用",
        requirement: { field: "skills.repair.level", min: 3 },
        effects: [
          { target: "skills.repair.xp", op: "add", value: 6 },
          { target: "needs.happiness", op: "add", value: 8 },
        ],
      },
    ],
    narrativeBefore: "黑暗来得毫无预告，手机屏幕是房间里唯一的光。",
    narrativeAfter: (choiceId) =>
      pickNarrative(choiceId, {
        go_out: "便利店的灯很亮，店员没有催你，你在那里坐到了电来。",
        sleep_early: "黑暗里你很快睡着，梦里不需要电。",
        check_breaker: "跳闸了。你把闸合上，灯一个接一个重新亮了起来。",
      }, "停电带来短暂的安静，城市忘了它自己。"),
    tags: ["housing", "survival", "repair", "night"],
  },

  {
    id: "webapp_payday_loan_ad",
    name: "借贷广告诱惑",
    icon: "💸",
    description: "手机弹出一条贷款广告：「最快5分钟到账，最高5万，免息3天。」",
    trigger: {
      type: "random",
      dayMin: 10,
      weight: 13,
      prerequisites: ["resources.cash < 300"],
    },
    choices: [
      {
        id: "research_terms",
        text: "点开看看利率条款",
        hint: "了解风险，提升金融意识",
        effects: [
          { target: "player.intelligence", op: "add", value: 2 },
          { target: "flags._loanRiskAware", op: "add", value: 1 },
        ],
      },
      {
        id: "apply_small",
        text: "借一点度过难关（¥500）",
        hint: "解燃眉之急，但利息日积月累",
        effects: [
          { target: "resources.cash", op: "add", value: 500 },
          { target: "resources.debt", op: "add", value: 600 },
          { target: "needs.happiness", op: "add", value: -5 },
        ],
      },
      {
        id: "close_ad",
        text: "关掉广告",
        hint: "拒绝高息借贷，坚持硬撑",
        effects: [
          { target: "player.morality", op: "add", value: 1 },
        ],
      },
    ],
    narrativeBefore: "屏幕上的数字很大，字体鲜红，像是专门为穷人设计的颜色。",
    narrativeAfter: (choiceId) =>
      pickNarrative(choiceId, {
        research_terms: "年化利率 36%——你把计算器关掉，把广告也关掉了。",
        apply_small: "到账短信来了，钱是解药，但剂量算错了就是毒。",
        close_ad: "你划掉广告，继续数自己还剩多少现金。",
      }, "广告消失了，穷的感觉没有。"),
    tags: ["finance", "debt", "survival", "decision"],
  },

  {
    id: "webapp_workplace_conflict",
    name: "办公室摩擦",
    icon: "😤",
    description: "同事在会议上把你的方案说成了自己的，老板似乎也信了。",
    trigger: {
      type: "random",
      dayMin: 60,
      weight: 12,
      prerequisites: ["phase === 'corporate'"],
    },
    choices: [
      {
        id: "confront_private",
        text: "私下找同事谈清楚",
        hint: "直接沟通，考验情商",
        effects: [
          { target: "player.charm", op: "add", value: 2 },
          { target: "player.corporate.popularity", op: "add", value: 3 },
        ],
      },
      {
        id: "raise_in_meeting",
        text: "下次会议当场澄清",
        hint: "维护权益，有风险也有收获",
        effects: [
          { target: "player.corporate.kpi", op: "add", value: 5 },
          { target: "player.corporate.risk", op: "add", value: 5 },
        ],
      },
      {
        id: "let_it_go",
        text: "算了，留条后路",
        hint: "忍一时，避免正面冲突",
        effects: [
          { target: "needs.happiness", op: "add", value: -10 },
          { target: "flags._workplaceGrievance", op: "add", value: 1 },
        ],
      },
    ],
    narrativeBefore: "PPT 里你的名字不见了，却还留着你的逻辑和你的例子。",
    narrativeAfter: (choiceId) =>
      pickNarrative(choiceId, {
        confront_private: "他承认了，说是「误会」。你知道这种误会不会只有一次。",
        raise_in_meeting: "老板看了看你，重新翻了翻文件。沉默比掌声更重要。",
        let_it_go: "你把委屈按进肚子里，告诉自己这不是最后一仗。",
      }, "会议室的玻璃门透明，人心却不是。"),
    tags: ["corporate", "conflict", "career", "social"],
  },

  {
    id: "webapp_heatwave_survival",
    name: "高温预警",
    icon: "☀️",
    description: "气温升到 38 度，城中村没有空调，身体开始抗议。",
    trigger: {
      type: "random",
      dayMin: 30,
      weight: 10,
      location: "slum",
    },
    choices: [
      {
        id: "buy_fan",
        text: "买台电风扇（¥80）",
        hint: "投入小钱，改善居住条件",
        effects: [
          { target: "resources.cash", op: "add", value: -80 },
          { target: "needs.fatigue", op: "add", value: -10 },
          { target: "flags._hasFan", op: "set", value: 1 },
        ],
      },
      {
        id: "go_library",
        text: "去图书馆蹭空调",
        hint: "免费避暑，还能学点东西",
        effects: [
          { target: "player.intelligence", op: "add", value: 1 },
          { target: "needs.fatigue", op: "add", value: -8 },
          { target: "player.actionPoints", op: "add", value: -1 },
        ],
      },
      {
        id: "endure",
        text: "硬撑，省钱优先",
        hint: "健康受损，但现金没动",
        effects: [
          { target: "needs.fatigue", op: "add", value: 15 },
          { target: "status.health", op: "add", value: -5 },
        ],
      },
    ],
    narrativeBefore: "城市把所有的热都留在这条街上，没有风，只有湿热的停滞。",
    narrativeAfter: (choiceId) =>
      pickNarrative(choiceId, {
        buy_fan: "风扇转着，能睡了，虽然还是热，但能睡了。",
        go_library: "图书馆的冷气均匀，书页翻起来都是凉的。",
        endure: "夜里你出了一身汗，早上起来头有点晕。",
      }, "高温天气对不同的人是不同的事。"),
    tags: ["weather", "survival", "housing", "health"],
  },

  {
    id: "webapp_skill_sharing_chance",
    name: "技能换资源",
    icon: "🔧",
    description: "邻居的锁坏了，他说如果你能修，就请你吃顿饭。",
    trigger: {
      type: "random",
      dayMin: 20,
      weight: 13,
      location: "slum",
    },
    choices: [
      {
        id: "fix_lock",
        text: "动手修锁",
        hint: "维修经验 + 邻里关系",
        requirement: { field: "skills.repair.level", min: 2 },
        effects: [
          { target: "skills.repair.xp", op: "add", value: 10 },
          { target: "flags._neighborTrust", op: "add", value: 2 },
          { target: "needs.happiness", op: "add", value: 6 },
        ],
      },
      {
        id: "call_locksmith",
        text: "帮他联系开锁师傅",
        hint: "没技能也能帮上忙",
        effects: [
          { target: "player.charm", op: "add", value: 1 },
          { target: "flags._neighborTrust", op: "add", value: 1 },
        ],
      },
      {
        id: "decline",
        text: "不擅长，婉拒",
        hint: "保持距离",
        effects: [
          { target: "needs.happiness", op: "add", value: -2 },
        ],
      },
    ],
    narrativeBefore: "邻居的门半开着，他拿着断掉的锁芯，表情很无助。",
    narrativeAfter: (choiceId) =>
      pickNarrative(choiceId, {
        fix_lock: "门锁好了，他端出一碗红烧肉。吃饭的时候没人说话，都觉得够了。",
        call_locksmith: "师傅很快来了，邻居说：「下次有事还找你。」",
        decline: "你说不会，他点了点头，转身打电话。",
      }, "有时候技能是比钱更直接的语言。"),
    tags: ["neighbor", "repair", "social", "slum"],
  },

  {
    id: "webapp_night_market_vendor",
    name: "夜市摊位机会",
    icon: "🌙",
    description: "夜市管理员说有个摊位今晚空出来了，押金 ¥200，当天结算。",
    trigger: {
      type: "random",
      dayMin: 25,
      weight: 9,
      prerequisites: ["resources.cash >= 200"],
    },
    choices: [
      {
        id: "rent_stall",
        text: "租下摊位试试",
        hint: "投入押金，可能有收益",
        effects: [
          { target: "resources.cash", op: "add", value: -200 },
          { target: "flags._nightMarketVendor", op: "add", value: 1 },
          { target: "player.charm", op: "add", value: 2 },
        ],
      },
      {
        id: "observe_first",
        text: "先观察今晚的人流",
        hint: "积累情报，下次更有把握",
        effects: [
          { target: "player.intelligence", op: "add", value: 1 },
          { target: "flags._nightMarketScouted", op: "add", value: 1 },
        ],
      },
    ],
    narrativeBefore: "夜市的灯亮起来，每个摊位都是一个人的全部。",
    narrativeAfter: (choiceId) =>
      pickNarrative(choiceId, {
        rent_stall: "你把东西摆出来，第一声吆喝很小，后来越来越响。",
        observe_first: "你在人群里走了一圈，记住了哪种摊位排队最长。",
      }, "夜市是城市最诚实的经济课。"),
    tags: ["trade", "side_hustle", "night", "cash"],
  },
];

export const EVENT_CATALOG_STATUS = {
  migrated: EVENTS.length,
  legacySource:
    "src/js/core/events_core.js + events_street.js + events_corp.js",
  nextStep:
    "新增事件继续进入 src/app/data/events，再由 bridge 分批接入 legacy。",
} as const;
