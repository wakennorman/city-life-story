const fs = require("fs");
const p = "D:\\Claude Code+DeepSeekV4\\city-life-story\\CLAUDE.md";
let data = fs.readFileSync(p);
const crlf = Buffer.from("\r\n");
const lf = Buffer.from("\n");
const nl = data.includes(crlf) ? crlf : lf;
const row = Buffer.from(
  "| R1018b | 2026-07-31 | A 数据/数值平衡（git log重算recency·八域深审最陈旧A=R1009·b后缀避让并行） | " +
    "A类1项：①job_milestone_events.js 18处职业里程碑奖励写入 state.flags._jobMultipliers 死路径（全库零读取），" +
    "而 main.js 4处读者读活路径 state._jobMultipliers → 废品回收+10%/+35%、摆摊+10% 等永久收入增幅×1.05~×1.4 此前全部静默失效" +
    "→全库52处 state.flags._jobMultipliers → state._jobMultipliers 批量迁移重连，死路径0引用/活路径52引用，老张废品×1.35、跑腿×1.1 等承诺真正生效 | " +
    "联动2(domain_a_linkage_events_r1018b.js：a1018b_econ_health A→E 经济健康度报告·_econHealth首消费·数据觉醒vs守成/" +
    "a1018b_waste_recycling_handoff A→E/G 老周带话承包权·_wasteRecyclingReady首消费·¥3000接手写活路径×1.35+老周好感+8) |",
  "utf8"
);
const endsWith = (buf, tail) => buf.length >= tail.length && buf.subarray(buf.length - tail.length).equals(tail);
if (!endsWith(data, nl)) data = Buffer.concat([data, nl]);
data = Buffer.concat([data, row, nl]);
fs.writeFileSync(p, data);
console.log("appended, newline=", JSON.stringify(nl.toString()));
