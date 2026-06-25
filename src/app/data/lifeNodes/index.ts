/**
 * 人生节点数据目录（TypeScript 版）
 *
 * 定义 4 个核心人生节点：高考、大学、35 岁危机、退休。
 * 新的人生节点优先写在这里，再通过 bridge 注册到 legacy runtime。
 *
 * 参考设计：BitLife 人生阶段 / 中国式家长节点 / 大多数困境选择
 */

export interface LifeNodeChoice {
  id: string;
  text: string;
  hint: string;
  effects: Array<{
    target: string;
    op: "add" | "set" | "mul";
    value: number;
  }>;
  cost?: number;
}

export interface LifeNode {
  id: string;
  name: string;
  icon: string;
  description: string;
  triggerDay: number;
  triggerInterval?: "once" | "monthly";
  requirements?: Array<{
    field: string;
    min?: number;
    max?: number;
  }>;
  choices: LifeNodeChoice[];
  narrativeBefore: string;
  narrativeAfter: (choiceId: string) => string;
}

export const LIFE_NODES: LifeNode[] = [
  {
    id: "gaokao",
    name: "高考",
    icon: "📝",
    description: "人生第一次大考，决定你能否进入大学。",
    triggerDay: 30,
    triggerInterval: "once",
    requirements: [{ field: "player.intelligence", min: 20 }],
    choices: [
      {
        id: "gaokao_study",
        text: "全力以赴备考",
        hint: "智力+5、编程/修理 XP 各+50，但压力山大",
        effects: [
          { target: "player.intelligence", op: "add", value: 5 },
          { target: "skills.coding.level", op: "add", value: 1 },
          { target: "skills.repair.level", op: "add", value: 1 },
          { target: "player.mental", op: "add", value: -3 },
        ],
      },
      {
        id: "gaokao_balanced",
        text: "正常发挥就好",
        hint: "稳定发挥，属性+2，压力适中",
        effects: [
          { target: "player.intelligence", op: "add", value: 2 },
          { target: "player.mental", op: "add", value: -1 },
        ],
      },
      {
        id: "gaokao_skip",
        text: "放弃高考",
        hint: "自由发展，但失去大学机会",
        effects: [
          { target: "player.mental", op: "add", value: 2 },
          { target: "player.fame", op: "add", value: -2 },
        ],
      },
    ],
    narrativeBefore:
      "明天就是高考的日子。这是改变命运的机会，还是另一场形式主义的煎熬？",
    narrativeAfter: (choiceId) => {
      const results: Record<string, string> = {
        gaokao_study: "你的努力没有白费，虽然疲惫，但你知道自己做到了最好。",
        gaokao_balanced: "发挥正常，没有惊喜也没有遗憾。你的人生，才刚刚开始。",
        gaokao_skip:
          "你选择了另一条路。不是每个人都有相同的轨迹，你知道自己要什么。",
      };
      return results[choiceId] || "高考结束了，你走向人生的下一站。";
    },
  },
  {
    id: "university",
    name: "上大学",
    icon: "🎓",
    description: "大学生活，是深造还是混日子？",
    triggerDay: 90,
    triggerInterval: "once",
    requirements: [
      { field: "player.intelligence", min: 25 },
      { field: "flags._gaokaoDone", min: 1 },
    ],
    choices: [
      {
        id: "uni_coding",
        text: "学编程",
        hint: "编程技能+3，科技行业入行更容易",
        effects: [{ target: "skills.coding.level", op: "add", value: 3 }],
      },
      {
        id: "uni_repair",
        text: "学维修技术",
        hint: "修理技能+3，手工类工作加成",
        effects: [{ target: "skills.repair.level", op: "add", value: 3 }],
      },
      {
        id: "uni_charm",
        text: "发展社交圈",
        hint: "魅力+5，NPC 初始好感+5",
        effects: [
          { target: "player.charm", op: "add", value: 5 },
          { target: "player.mental", op: "add", value: 2 },
        ],
      },
      {
        id: "uni_business",
        text: "尝试做生意",
        hint: "销售技能+2，开局现金+¥2000",
        effects: [
          { target: "skills.sales.level", op: "add", value: 2 },
          { target: "resources.cash", op: "add", value: 2000 },
        ],
      },
    ],
    narrativeBefore: "你收到了大学录取通知书。这四年，你打算怎么过？",
    narrativeAfter: (choiceId) => {
      const results: Record<string, string> = {
        uni_coding: "你沉浸在代码的世界里，虽然孤独但充实。",
        uni_repair: "你花了很多时间在实验室，动手能力越来越强。",
        uni_charm: "你认识了一群朋友，大学四年是你最快乐的时光。",
        uni_business: "你开始倒卖二手货，虽然赚的不多但积累了经验。",
      };
      return results[choiceId] || "大学时光转瞬即逝。";
    },
  },
  {
    id: "midlife_crisis",
    name: "35 岁危机",
    icon: "⚡",
    description: "人到中年，身体和事业都在发出信号。",
    triggerDay: 180,
    triggerInterval: "monthly",
    choices: [
      {
        id: "crisis_career",
        text: "拼事业",
        hint: "职业加速但健康损耗",
        effects: [
          { target: "skills.management.level", op: "add", value: 2 },
          { target: "player.health", op: "add", value: -5 },
          { target: "resources.cash", op: "add", value: 5000 },
        ],
      },
      {
        id: "crisis_exam",
        text: "考公/考证",
        hint: "稳定路线，智力+3",
        effects: [
          { target: "player.intelligence", op: "add", value: 3 },
          { target: "player.mental", op: "add", value: 2 },
        ],
      },
      {
        id: "crisis_lieflat",
        text: "躺平",
        hint: "保健康求心安，但收入停滞",
        effects: [
          { target: "player.health", op: "add", value: 5 },
          { target: "player.mental", op: "add", value: 3 },
          { target: "resources.cash", op: "add", value: -2000 },
        ],
      },
      {
        id: "crisis_startup",
        text: "创业",
        hint: "高风险高回报，需要启动资金",
        effects: [
          { target: "player.charm", op: "add", value: 2 },
          { target: "player.mental", op: "add", value: -3 },
          { target: "resources.cash", op: "add", value: -10000 },
        ],
      },
    ],
    narrativeBefore:
      "三十而立，三十五而惑。你发现自己不再年轻，未来却依然模糊。",
    narrativeAfter: (choiceId) => {
      const results: Record<string, string> = {
        crisis_career: "你加倍投入工作，用健康换取事业上的突破。",
        crisis_exam: "你开始复习备考，知识让你感到踏实。",
        crisis_lieflat: "你决定放过自己，人生不止一种活法。",
        crisis_startup: "你拿出积蓄，准备搏一把。",
      };
      return results[choiceId] || "三十五岁，你做出一个重要的选择。";
    },
  },
  {
    id: "retirement",
    name: "退休",
    icon: "🏖️",
    description: "漫长职业生涯的终点，晚年生活的起点。",
    triggerDay: 365,
    triggerInterval: "once",
    requirements: [{ field: "player.age", min: 60 }],
    choices: [
      {
        id: "retire_travel",
        text: "环游世界",
        hint: "消耗积蓄换取幸福回忆",
        cost: 50000,
        effects: [
          { target: "player.mental", op: "add", value: 20 },
          { target: "resources.cash", op: "add", value: -50000 },
        ],
      },
      {
        id: "retire_family",
        text: "享受天伦之乐",
        hint: "家庭幸福，身心健康",
        effects: [
          { target: "player.health", op: "add", value: 10 },
          { target: "player.mental", op: "add", value: 15 },
        ],
      },
      {
        id: "retire_mentor",
        text: "发挥余热",
        hint: "做顾问/带徒弟，保持社会联系",
        effects: [
          { target: "player.fame", op: "add", value: 5 },
          { target: "player.mental", op: "add", value: 10 },
          { target: "resources.cash", op: "add", value: 10000 },
        ],
      },
    ],
    narrativeBefore: "终于到了退休的年纪。这一生，你还有什么想做的事？",
    narrativeAfter: (choiceId) => {
      const results: Record<string, string> = {
        retire_travel: "你背起行囊，去看看年轻时没机会看的风景。",
        retire_family: "儿孙绕膝，这一生的奔波都是为了这一刻的安宁。",
        retire_mentor: "你把自己的经验传授给年轻人，找到了新的价值。",
      };
      return results[choiceId] || "退休生活，是另一种人生的开始。";
    },
  },
];

export function getLifeNodeById(id: string): LifeNode | undefined {
  return LIFE_NODES.find((n) => n.id === id);
}

export function getLifeNodesByDay(day: number): LifeNode[] {
  return LIFE_NODES.filter((n) => {
    if (n.triggerInterval === "once" && n.triggerDay === day) return true;
    if (
      n.triggerInterval === "monthly" &&
      day >= n.triggerDay &&
      day % 30 === 0
    )
      return true;
    return false;
  });
}
