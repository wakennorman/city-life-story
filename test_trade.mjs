import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
const errorLog = [];

page.on("console", (msg) => {
  if (msg.type() === "error") {
    errorLog.push({ type: "console_error", text: msg.text() });
  }
});
page.on("pageerror", (err) => {
  errorLog.push({ type: "page_error", text: err.message });
});

await page.goto("http://localhost:8080/dist/index.html", {
  waitUntil: "networkidle0",
  timeout: 30000,
});

await new Promise((r) => setTimeout(r, 3000));

// Initialize game state directly
const result = await page.evaluate(() => {
  try {
    // First call init() if it exists to set up StateManager
    if (typeof init === "function") {
      init();
      console.log("init() called");
    }
    return "done";
  } catch (e) {
    return "error: " + e.message;
  }
});
console.log("Init result:", result);

await new Promise((r) => setTimeout(r, 500));

// Now try starting the game
const startResult = await page.evaluate(() => {
  try {
    if (typeof startClassicGame === "function") {
      startClassicGame();
      return "startClassicGame called";
    } else if (typeof startNewGame === "function") {
      startNewGame();
      return "startNewGame called";
    }
    return "no start function found";
  } catch (e) {
    return "error: " + e.message;
  }
});
console.log("Start result:", startResult);

await new Promise((r) => setTimeout(r, 2000));

// Check game state
const stateInfo = await page.evaluate(() => {
  try {
    const s = StateManager.getState();
    if (!s) return { error: "null state" };
    return {
      initialized: true,
      day: s.player?.day,
      loc: s.trade?.currentLocation,
      cash: s.resources?.cash,
      goodsCount: typeof GOODS !== "undefined" ? GOODS.length : "undefined",
    };
  } catch (e) {
    return { error: e.message };
  }
});
console.log("State info:", JSON.stringify(stateInfo));

// Click trade tab
const tradeBtn = await page.$('button[data-tab="trade"]');
if (tradeBtn) {
  const visible = await tradeBtn.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden";
  });
  console.log("Trade button visible:", visible);
  if (visible) {
    await tradeBtn.evaluate((el) => el.click());
    console.log("Clicked trade tab");
  }
} else {
  console.log("Trade button not found");
}

await new Promise((r) => setTimeout(r, 1500));

// Get content
const text = await page.$eval("#content-area", (el) => el.innerText);
console.log("\n=== Content Area Text (first 1200) ===");
console.log(text.substring(0, 1200));

// Check for goods
const cards = await page.$$("#trade-market-grid .action-card");
console.log("\n=== Goods cards found:", cards.length);

const hasGrid = (await page.$("#trade-market-grid")) !== null;
console.log("Trade market grid exists:", hasGrid);

// Check error log
console.log("\n=== Page Errors ===");
for (const err of errorLog) {
  console.log(`[${err.type}] ${err.text.substring(0, 300)}`);
}

await browser.close();
