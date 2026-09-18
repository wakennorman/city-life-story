/**
 * 把 .bat 转成 CRLF + 去 BOM。
 *
 * 为什么必须做：cmd.exe 按行解析批处理，LF-only 的文件在部分场景下
 * （尤其 if/for 块内）会被解析错；带 BOM 则会让首行的 @echo off 变成
 * 乱码指令而直接抛错。PowerShell / Node 写的文件默认是 UTF-8 无 BOM + LF，
 * 所以每次写完 bat 都要过这一步。
 *
 * 用法: node tools/fix-bat-eol.cjs <file.bat> [file2.bat ...]
 */
const fs = require('fs');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('用法: node tools/fix-bat-eol.cjs <file.bat> [...]');
  process.exit(1);
}

for (const f of files) {
  const buf = fs.readFileSync(f);
  let s = buf.toString('utf8');
  const hadBom = s.charCodeAt(0) === 0xfeff;
  if (hadBom) s = s.slice(1);
  const hadCrlf = /\r\n/.test(s);
  s = s.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  fs.writeFileSync(f, Buffer.from(s, 'utf8'));   // 不写 BOM
  console.log(`${f}  BOM:${hadBom ? '已移除' : '无'}  CRLF:${hadCrlf ? '原本就是' : '已转换'}  ${buf.length}→${Buffer.byteLength(s)} 字节`);
}
