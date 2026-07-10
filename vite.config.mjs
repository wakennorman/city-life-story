export default {
  base: "./",
  publicDir: "src/images",
  server: {
    host: "127.0.0.1",
    port: 5173,
    // 允许访问 src/ 下的静态文件
    fs: { allow: ["."] },
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
  },
  build: {
    outDir: "dist-webapp",
    emptyOutDir: true,
    sourcemap: true,
  },
};
