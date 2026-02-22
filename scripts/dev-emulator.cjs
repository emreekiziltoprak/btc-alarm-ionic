const { spawn } = require("child_process");
const http = require("http");
const os = require("os");

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

function run(cmd, opts = {}) {
  return spawn(cmd, { shell: true, ...opts });
}

function waitForServer(url, callback) {
  const check = () => {
    http.get(url, () => callback()).on("error", () => setTimeout(check, 500));
  };
  check();
}

const LOCAL_IP = getLocalIp();
const API_PORT = 3000;
const API_URL = `http://${LOCAL_IP}:${API_PORT}`;

console.log(`\n=> Local IP: ${LOCAL_IP}`);
console.log(`=> API URL: ${API_URL}\n`);

console.log("=> Vite dev server baslatiliyor...\n");

let actualPort = null;
const vite = run(`npx vite --host ${LOCAL_IP}`, { stdio: "pipe" });

vite.stdout.on("data", (data) => {
  const output = data.toString();
  process.stdout.write(output);

  // ANSI renk kodlarini temizleyip port numarasini al
  const clean = output.replace(/\u001b\[[0-9;]*m/g, "");
  const portMatch = clean.match(/Network:\s+https?:\/\/[^:]+:(\d+)/);
  if (portMatch && !actualPort) {
    actualPort = parseInt(portMatch[1]);
    console.log(`\n=> Vite ${actualPort} portunda basladi!`);
    startCapacitor(actualPort);
  }
});

vite.stderr.on("data", (data) => {
  const output = data.toString();
  process.stderr.write(output);

  const clean = output.replace(/\u001b\[[0-9;]*m/g, "");
  const portMatch = clean.match(/Network:\s+https?:\/\/[^:]+:(\d+)/);
  if (portMatch && !actualPort) {
    actualPort = parseInt(portMatch[1]);
    console.log(`\n=> Vite ${actualPort} portunda basladi!`);
    startCapacitor(actualPort);
  }
});

function startCapacitor(port) {
  console.log("\n=> Capacitor sync baslatiliyor...\n");

  const sync = run("npx cap sync android", { stdio: "inherit" });

  sync.on("close", (code) => {
    if (code !== 0) {
      console.error("cap sync basarisiz!");
      vite.kill();
      process.exit(1);
    }

    console.log("\n=> Emulatorde uygulama calistiriliyor (live reload)...\n");

    const capRun = run(
      `npx cap run android --live-reload --host ${LOCAL_IP} --port ${port}`,
      {
        stdio: "inherit",
      },
    );

    capRun.on("close", (runCode) => {
      if (runCode !== 0) {
        console.error("cap run basarisiz!");
        vite.kill();
        process.exit(1);
      }
      console.log("\n=> Uygulama yuklendi! Hot reload aktif.");
      console.log("=> Durdurmak icin Ctrl+C\n");
    });
  });
}

process.on("SIGINT", () => {
  vite.kill();
  process.exit();
});
