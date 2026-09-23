import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const children = [
  spawn(npmCommand, ["run", "dev:server"], { stdio: "inherit", shell: process.platform === "win32" }),
  spawn(npmCommand, ["run", "dev"], { stdio: "inherit", shell: process.platform === "win32" }),
];

let shuttingDown = false;
const shutdown = () => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) child.kill("SIGINT");
};

for (const signal of ["SIGINT", "SIGTERM", "exit"]) {
  process.on(signal, shutdown);
}

for (const child of children) {
  child.on("exit", (code) => {
    if (!shuttingDown && code !== 0) {
      shutdown();
      process.exitCode = code ?? 1;
    }
  });
}
