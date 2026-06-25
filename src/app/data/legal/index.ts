export type LegalCaseCategory =
  | "labor"
  | "civil"
  | "criminal"
  | "administrative";

export interface LegalStage {
  name: string;
  duration: number;
  actions: string[];
}

export interface LegalOutcome {
  condition: string;
  result: string;
  effects: Array<{ target: string; op: string; value: number }>;
  fine?: number;
  jailDays?: number;
}

export interface LegalCase {
  id: string;
  name: string;
  icon: string;
  category: LegalCaseCategory;
  triggerCondition: string;
  stages: LegalStage[];
  outcomes: LegalOutcome[];
  lawyerDifficulty: number;
  defaultJudgment: string;
}

const COMMON_STAGES: LegalStage[] = [
  {
    name: "立案",
    duration: 2,
    actions: ["整理身份材料", "确认管辖地", "缴纳受理费用"],
  },
  {
    name: "证据",
    duration: 4,
    actions: ["提交合同/票据", "补充聊天记录", "申请调取流水"],
  },
  {
    name: "审理",
    duration: 3,
    actions: ["参加庭审", "陈述事实", "律师质证"],
  },
  {
    name: "判决",
    duration: 1,
    actions: ["领取判决书", "申请执行", "记录信用后果"],
  },
];

export const LEGAL_CASES: LegalCase[] = [
  {
    id: "labor_dispute",
    name: "劳动纠纷",
    icon: "⚖️",
    category: "labor",
    triggerCondition: "欠薪、违法解除、工伤赔偿或未签劳动合同。",
    stages: COMMON_STAGES,
    outcomes: [
      {
        condition: "证据充分且做过劳动争议预检",
        result: "胜诉，获得欠薪和补偿。",
        effects: [
          { target: "resources.cash", op: "add", value: 12000 },
          { target: "legal.caseConfidence", op: "add", value: 4 },
        ],
      },
      {
        condition: "证据不足",
        result: "调解结案，只拿回部分工资。",
        effects: [{ target: "resources.cash", op: "add", value: 3000 }],
      },
    ],
    lawyerDifficulty: 3,
    defaultJudgment: "双方接受调解，公司补发部分工资。",
  },
  {
    id: "contract_dispute",
    name: "合同纠纷",
    icon: "📄",
    category: "civil",
    triggerCondition: "兼职、供货、租房或创业合作合同被对方违约。",
    stages: COMMON_STAGES,
    outcomes: [
      {
        condition: "合同文本完整且有付款流水",
        result: "判令对方支付违约金。",
        effects: [
          { target: "resources.cash", op: "add", value: 20000 },
          { target: "player.intelligence", op: "add", value: 1 },
        ],
      },
      {
        condition: "口头约定或证据散乱",
        result: "法院支持少量实际损失。",
        effects: [{ target: "resources.cash", op: "add", value: 5000 }],
      },
    ],
    lawyerDifficulty: 5,
    defaultJudgment: "部分支持诉求，双方各承担一部分成本。",
  },
  {
    id: "neighborhood_dispute",
    name: "邻里纠纷",
    icon: "🏠",
    category: "civil",
    triggerCondition: "漏水、噪音、占用公共空间或物业维修迟延。",
    stages: [
      {
        name: "调解",
        duration: 2,
        actions: ["社区调解", "拍照留证", "确认损失范围"],
      },
      ...COMMON_STAGES.slice(1),
    ],
    outcomes: [
      {
        condition: "有照片和维修票据",
        result: "对方赔偿维修费，邻里关系略有下降。",
        effects: [
          { target: "resources.cash", op: "add", value: 1800 },
          { target: "needs.happiness", op: "add", value: -2 },
        ],
      },
    ],
    lawyerDifficulty: 2,
    defaultJudgment: "社区调解后各退一步，问题得到修复。",
  },
  {
    id: "debt_recovery",
    name: "债务追讨",
    icon: "💰",
    category: "civil",
    triggerCondition: "熟人借钱、供货赊账或合作垫款长期不还。",
    stages: COMMON_STAGES,
    outcomes: [
      {
        condition: "借条和转账记录完整",
        result: "胜诉并进入执行阶段。",
        effects: [
          { target: "resources.cash", op: "add", value: 18000 },
          { target: "legal.totalLegalWon", op: "add", value: 18000 },
        ],
      },
      {
        condition: "对方无可执行财产",
        result: "赢了判决，但回款缓慢。",
        effects: [{ target: "flags._pendingExecution", op: "add", value: 1 }],
      },
    ],
    lawyerDifficulty: 4,
    defaultJudgment: "法院支持债权，但执行取决于对方资产。",
  },
  {
    id: "medical_bill_dispute",
    name: "医疗账单争议",
    icon: "🧾",
    category: "administrative",
    triggerCondition: "医保报销比例异常、重复收费或商业保险拒赔。",
    stages: [
      {
        name: "复核",
        duration: 2,
        actions: ["收集票据", "申请医保窗口复核", "提交病历摘要"],
      },
      {
        name: "申诉",
        duration: 4,
        actions: ["提交平台申诉", "联系医院医保办", "保留沟通记录"],
      },
      {
        name: "裁定",
        duration: 2,
        actions: ["等待复核结论", "确认退费金额"],
      },
    ],
    outcomes: [
      {
        condition: "医疗票据齐全且做过医保复核",
        result: "追回部分报销差额。",
        effects: [
          { target: "resources.cash", op: "add", value: 1600 },
          { target: "medical.costAwareness", op: "add", value: 1 },
        ],
      },
    ],
    lawyerDifficulty: 3,
    defaultJudgment: "医院重新核算部分项目，退回少量费用。",
  },
  {
    id: "food_safety_case",
    name: "食品安全举报",
    icon: "🍢",
    category: "administrative",
    triggerCondition: "摆摊或消费过程中发现疑似过期、地沟油或无证经营。",
    stages: [
      {
        name: "举报",
        duration: 1,
        actions: ["保留照片", "记录摊位位置", "提交举报"],
      },
      {
        name: "调查",
        duration: 5,
        actions: ["配合询问", "等待监管部门抽检", "避免网络造谣"],
      },
      {
        name: "处理",
        duration: 2,
        actions: ["查看处理结果", "申请消费赔付"],
      },
    ],
    outcomes: [
      {
        condition: "证据真实且未夸大传播",
        result: "监管部门处罚商家，你获得小额赔付。",
        effects: [
          { target: "player.fame", op: "add", value: 2 },
          { target: "resources.cash", op: "add", value: 500 },
        ],
      },
      {
        condition: "恶意夸大或证据不足",
        result: "举报不成立，可能影响名声。",
        effects: [{ target: "player.fame", op: "add", value: -2 }],
        fine: 200,
      },
    ],
    lawyerDifficulty: 2,
    defaultJudgment: "监管部门记录线索，提醒双方规范经营。",
  },
  {
    id: "minor_public_order_case",
    name: "治安处罚",
    icon: "🚨",
    category: "criminal",
    triggerCondition: "多次违法、斗殴、盗窃或扰乱公共秩序。",
    stages: [
      {
        name: "询问",
        duration: 1,
        actions: ["说明情况", "联系家属", "保留执法记录"],
      },
      {
        name: "处罚",
        duration: 2,
        actions: ["缴纳罚款", "接受训诫", "记录案底风险"],
      },
    ],
    outcomes: [
      {
        condition: "初犯且情节轻微",
        result: "警告或小额罚款。",
        effects: [
          { target: "resources.cash", op: "add", value: -500 },
          { target: "player.fame", op: "add", value: -3 },
        ],
        fine: 500,
      },
      {
        condition: "多次违法",
        result: "留下不良记录，影响部分岗位。",
        effects: [
          { target: "flags._criminalRecord", op: "set", value: 1 },
          { target: "needs.happiness", op: "add", value: -10 },
        ],
        jailDays: 3,
      },
    ],
    lawyerDifficulty: 6,
    defaultJudgment: "接受训诫并缴纳罚款，短期内求职受影响。",
  },
];

export const LEGAL_CATALOG_STATUS = {
  migrated: LEGAL_CASES.length,
  legacySource: "src/js/core/legal.js",
  nextStep:
    "新增案件继续写入 LEGAL_CASES，并由法律面板或 bridge 注册到旧入口。",
} as const;
