// 分支加成 TS 规范源 ↔ 正在运行的 vanilla 双向比对
// 用 esbuild 打包转译 TS 端口(含其依赖的叶子函数), 同时用 vm 加载 vanilla 运行时,
// 对 7 个 getBranch* 函数在「无天赋」与「有天赋」两种运行态下逐项比对, 任一偏差即判不等价。
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const esbuild = require("esbuild");

const EPS = 1e-9;
let pass = 0;
let fail = 0;

function check(actual, expected, label) {
  if (Math.abs(actual - expected) <= EPS) {
    pass++;
  } else {
    fail++;
    console.error(`✘ ${label}\n    TS=${actual}  vanilla=${expected}  Δ=${actual - expected}`);
  }
}

// ===== 1) TS 规范源端口 (bundle 会一并打入 ./skillBonuses 叶子函数) =====
const tsEntry = path.join(
  __dirname,
  "../src/app/core/skills/branchBonuses.ts"
);
const out = esbuild.buildSync({
  entryPoints: [tsEntry],
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
});
const tmpFile = path.join(os.tmpdir(), "cls_branch_" + Date.now() + ".cjs");
fs.writeFileSync(tmpFile, out.outputFiles[0].text);
const ts = require(tmpFile);
fs.unlinkSync(tmpFile);

// ===== 2) vanilla 运行时端口 (vm 加载 skill_bonuses.js) =====
const vanillaPath = path.join(
  __dirname,
  "../src/js/phase1/skill_bonuses.js"
);
function loadVanilla(talentEffects) {
  const sandbox = {};
  if (talentEffects) sandbox.getTalentNodeEffects = talentEffects;
  const code = fs.readFileSync(vanillaPath, "utf8");
  vm.runInNewContext(code, sandbox);
  return sandbox;
}

// 天赋 mock (vanilla 全局 getTalentNodeEffects 与 TS 注入 talentEffects 使用同一对象形态)
const TALENT = (state) => ({
  foodCostReduction: 0.05,
  extraApReduction: 3,
  extraDiscount: 0.02,
  extraPremium: 0.03,
});

const LEVELS = [0, 1, 3, 5, 8, 10];

// ===== 3) 无天赋运行态: TS(talentEffects=undefined) ↔ vanilla(无全局) =====
const vNo = loadVanilla(null);
for (const lvl of LEVELS) {
  // cooking
  check(
    ts.getBranchCookingDiscount({ skills: { cooking: { level: lvl } } }),
    vNo.getBranchCookingDiscount({ skills: { cooking: { level: lvl } } }),
    `no-talent cooking lvl=${lvl} (no branch)`
  );
  check(
    ts.getBranchCookingDiscount({
      skills: { cooking: { level: lvl } },
      skillBranches: { cooking: "home_chef" },
    }),
    vNo.getBranchCookingDiscount({
      skills: { cooking: { level: lvl } },
      skillBranches: { cooking: "home_chef" },
    }),
    `no-talent cooking lvl=${lvl} (home_chef)`
  );
  // travel
  check(
    ts.getBranchTravelApReduction({ skills: { driving: { level: lvl } } }),
    vNo.getBranchTravelApReduction({ skills: { driving: { level: lvl } } }),
    `no-talent travel lvl=${lvl} (no branch)`
  );
  check(
    ts.getBranchTravelApReduction({
      skills: { driving: { level: lvl } },
      skillBranches: { driving: "passenger_transport" },
    }),
    vNo.getBranchTravelApReduction({
      skills: { driving: { level: lvl } },
      skillBranches: { driving: "passenger_transport" },
    }),
    `no-talent travel lvl=${lvl} (passenger_transport)`
  );
  // tutoring
  check(
    ts.getBranchTutoringBonus({
      skills: { english: { level: lvl } },
      skillBranches: { english: "business_english" },
    }),
    vNo.getBranchTutoringBonus({
      skills: { english: { level: lvl } },
      skillBranches: { english: "business_english" },
    }),
    `no-talent tutoring lvl=${lvl} (business_english)`
  );
  // factory
  check(
    ts.getBranchFactoryBonus({
      skills: { electrician: { level: lvl } },
      skillBranches: { electrician: "industrial_electric" },
    }),
    vNo.getBranchFactoryBonus({
      skills: { electrician: { level: lvl } },
      skillBranches: { electrician: "industrial_electric" },
    }),
    `no-talent factory lvl=${lvl} (industrial_electric)`
  );
  // construction
  check(
    ts.getBranchConstructionBonus({
      skills: { welding: { level: lvl } },
      skillBranches: { welding: "structural_welding" },
    }),
    vNo.getBranchConstructionBonus({
      skills: { welding: { level: lvl } },
      skillBranches: { welding: "structural_welding" },
    }),
    `no-talent construction lvl=${lvl} (structural_welding)`
  );
  // sales discount
  check(
    ts.getBranchSalesDiscount({
      skills: { sales: { level: lvl } },
      skillBranches: { sales: "store_sales" },
    }),
    vNo.getBranchSalesDiscount({
      skills: { sales: { level: lvl } },
      skillBranches: { sales: "store_sales" },
    }),
    `no-talent salesDiscount lvl=${lvl} (store_sales)`
  );
  // sales premium
  check(
    ts.getBranchSalesPremium({
      skills: { sales: { level: lvl } },
      skillBranches: { sales: "biz_negotiation" },
    }),
    vNo.getBranchSalesPremium({
      skills: { sales: { level: lvl } },
      skillBranches: { sales: "biz_negotiation" },
    }),
    `no-talent salesPremium lvl=${lvl} (biz_negotiation)`
  );
}

// ===== 4) 有天赋运行态: TS(talentEffects=TALENT) ↔ vanilla(全局 TALENT) =====
const vYes = loadVanilla(TALENT);
for (const lvl of LEVELS) {
  check(
    ts.getBranchCookingDiscount(
      {
        skills: { cooking: { level: lvl } },
        skillBranches: { cooking: "home_chef" },
      },
      TALENT
    ),
    vYes.getBranchCookingDiscount({
      skills: { cooking: { level: lvl } },
      skillBranches: { cooking: "home_chef" },
    }),
    `talent cooking lvl=${lvl} (home_chef)`
  );
  check(
    ts.getBranchTravelApReduction(
      {
        skills: { driving: { level: lvl } },
        skillBranches: { driving: "passenger_transport" },
      },
      TALENT
    ),
    vYes.getBranchTravelApReduction({
      skills: { driving: { level: lvl } },
      skillBranches: { driving: "passenger_transport" },
    }),
    `talent travel lvl=${lvl} (passenger_transport)`
  );
  check(
    ts.getBranchSalesDiscount(
      {
        skills: { sales: { level: lvl } },
        skillBranches: { sales: "store_sales" },
      },
      TALENT
    ),
    vYes.getBranchSalesDiscount({
      skills: { sales: { level: lvl } },
      skillBranches: { sales: "store_sales" },
    }),
    `talent salesDiscount lvl=${lvl} (store_sales)`
  );
  check(
    ts.getBranchSalesPremium(
      {
        skills: { sales: { level: lvl } },
        skillBranches: { sales: "biz_negotiation" },
      },
      TALENT
    ),
    vYes.getBranchSalesPremium({
      skills: { sales: { level: lvl } },
      skillBranches: { sales: "biz_negotiation" },
    }),
    `talent salesPremium lvl=${lvl} (biz_negotiation)`
  );
}

// ===== 5) 错误分支应回退 base =====
for (const lvl of [0, 5]) {
  check(
    ts.getBranchCookingDiscount({
      skills: { cooking: { level: lvl } },
      skillBranches: { cooking: "wrong_branch" },
    }),
    vNo.getBranchCookingDiscount({
      skills: { cooking: { level: lvl } },
      skillBranches: { cooking: "wrong_branch" },
    }),
    `wrong-branch cooking lvl=${lvl} -> base`
  );
  check(
    ts.getBranchFactoryBonus({
      skills: { electrician: { level: lvl } },
      skillBranches: { electrician: "wrong_branch" },
    }),
    vNo.getBranchFactoryBonus({
      skills: { electrician: { level: lvl } },
      skillBranches: { electrician: "wrong_branch" },
    }),
    `wrong-branch factory lvl=${lvl} -> base`
  );
}

console.log(`branchBonuses 双向比对: ${pass} 通过 / ${fail} 失败`);
if (fail > 0) {
  console.error(`\n✘ TS 端口与 vanilla 运行时存在 ${fail} 处不等价, 请核查。`);
  process.exit(1);
}
console.log("✔ TS 规范源与 vanilla 运行时逐字节等价 (无天赋 + 有天赋两种运行态)");
