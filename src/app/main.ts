import "./ui/app.css";
import { mountAppShell } from "./shell/appShell";

const root = document.getElementById("webapp-root");

if (!root) {
  throw new Error("Missing #webapp-root mount point");
}

mountAppShell(root);
