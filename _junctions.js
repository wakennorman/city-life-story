const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const base = "C:\\Users\\陈恒稳";
const canonical = path.join(
  base,
  ".claude-sensenova-ds4f",
  "projects",
  "D--Claude-Code-DeepSeekV4",
  "memory",
);

const dirs = fs
  .readdirSync(base)
  .filter((d) => d.startsWith(".claude-") && d !== ".claude-sensenova-ds4f");

let ok = 0,
  fail = 0,
  skip = 0;
for (const dir of dirs) {
  const memDir = path.join(
    base,
    dir,
    "projects",
    "D--Claude-Code-DeepSeekV4",
    "memory",
  );
  const projDir = path.join(base, dir, "projects", "D--Claude-Code-DeepSeekV4");

  try {
    if (fs.existsSync(memDir)) {
      const stat = fs.lstatSync(memDir);
      if (stat.isSymbolicLink()) {
        skip++;
        continue;
      }
      fs.rmSync(memDir, { recursive: true, force: true });
    }

    if (!fs.existsSync(projDir)) {
      fs.mkdirSync(projDir, { recursive: true });
    }

    execSync('cmd /c mklink /J "' + memDir + '" "' + canonical + '"', {
      encoding: "utf8",
    });
    ok++;
  } catch (e) {
    fail++;
  }
}

console.log("OK=" + ok + " SKIP=" + skip + " FAIL=" + fail);
