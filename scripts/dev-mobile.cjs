const { spawn, execSync } = require("child_process");
const path = require("path");
const os = require("os");

// ADB path'ini bul
const adbPath = process.env.ANDROID_HOME
  ? path.join(process.env.ANDROID_HOME, "platform-tools", "adb")
  : path.join(
      os.homedir(),
      "AppData",
      "Local",
      "Android",
      "Sdk",
      "platform-tools",
      "adb.exe",
    );

function run(cmd, opts = {}) {
  return spawn(cmd, { shell: true, ...opts });
}

console.log("\n=> Vite dev server baslatiliyor...\n");

const vite = run(`npx vite --host`, { stdio: "pipe" });

let actualPort = null;
let viteOutput = "";

vite.stdout.on("data", (data) => {
  const text = data.toString();
  process.stdout.write(data);
  if (!actualPort) {
    viteOutput += text;
    const clean = viteOutput.replace(/\x1b\[[0-9;]*m/g, "");
    const match = clean.match(/Local:\s+http:\/\/localhost:(\d+)/);
    if (match) {
      actualPort = parseInt(match[1], 10);
    }
  }
});
vite.stderr.pipe(process.stderr);

function waitForVitePort(callback) {
  const check = () => {
    if (actualPort) {
      callback(actualPort);
    } else {
      setTimeout(check, 300);
    }
  };
  check();
}

waitForVitePort((port) => {
  const url = `http://localhost:${port}`;
  console.log(`\n=> Vite hazir! (port: ${port})`);

  // Bağlı cihazları listele
  console.log("=> Bagli cihazlar kontrol ediliyor...\n");
  try {
    const devices = execSync(`"${adbPath}" devices`, { encoding: "utf8" });
    console.log(devices);

    // Fiziksel cihazı bul (emulator değil)
    const lines = devices
      .split("\n")
      .filter((line) => line.includes("\tdevice"));
    const physicalDevice = lines.find((line) => !line.includes("emulator"));

    let deviceId = "";
    if (physicalDevice) {
      deviceId = physicalDevice.split("\t")[0];
      console.log(`=> Fiziksel cihaz secildi: ${deviceId}\n`);
    } else if (lines.length > 0) {
      deviceId = lines[0].split("\t")[0];
      console.log(`=> Cihaz secildi: ${deviceId}\n`);
    } else {
      throw new Error("Cihaz bulunamadi!");
    }

    // USB uzerinden port forwarding
    console.log(`=> ADB reverse port forwarding: ${port}...\n`);
    execSync(`"${adbPath}" -s ${deviceId} reverse tcp:${port} tcp:${port}`, {
      stdio: "inherit",
    });

    // Backend port forwarding (3000)
    console.log(`=> ADB reverse port forwarding: 3000 (backend)...\n`);
    execSync(`"${adbPath}" -s ${deviceId} reverse tcp:3000 tcp:3000`, {
      stdio: "inherit",
    });

    // Device ID'yi global'e kaydet
    global.selectedDeviceId = deviceId;
  } catch (err) {
    console.error(
      "adb reverse basarisiz! Telefon USB ile bagli ve USB debugging acik mi?",
    );
    console.error(`ADB path: ${adbPath}`);
    console.error(err.message);
    vite.kill();
    process.exit(1);
  }

  console.log("\n=> Capacitor sync baslatiliyor...\n");

  const sync = run("npx cap sync android", {
    stdio: "inherit",
    env: { ...process.env, LIVE_RELOAD: url },
  });

  sync.on("close", (code) => {
    if (code !== 0) {
      console.error("cap sync basarisiz!");
      vite.kill();
      process.exit(1);
    }

    console.log("\n=> Telefona yukleniyor...\n");

    const capRun = run("npx cap run android", {
      stdio: "inherit",
      env: { ...process.env, LIVE_RELOAD: url },
    });

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
});

process.on("SIGINT", () => {
  try {
    const deviceId = global.selectedDeviceId || "";
    if (deviceId && actualPort) {
      execSync(`"${adbPath}" -s ${deviceId} reverse --remove tcp:${actualPort}`);
      execSync(`"${adbPath}" -s ${deviceId} reverse --remove tcp:3000`);
    }
  } catch {}
  vite.kill();
  process.exit();
});
