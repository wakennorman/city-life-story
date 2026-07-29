const manifest = require('./tests/lib/script_manifest.cjs');
const srcDir = manifest.resolveSrcDir();
const scripts = manifest.getScriptManifest();
console.log("Total scripts:", scripts.length);
const r826 = scripts.filter(s => s.indexOf("r826") >= 0);
console.log("r826:", r826);
const r851 = scripts.filter(s => s.indexOf("domain_f_linkage_r851") >= 0);
console.log("r851 (sanity):", r851);
