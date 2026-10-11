const API_BASE = "https://inub-api.instanusantara-creative-2db.workers.dev";

let todayData = null;
let fridayData = null;

async function loadToday() {
  const r = await fetch(API_BASE + "/api/today");
  if (!r.ok) throw new Error("API error");

  todayData = await r.json();

  document.getElementById("code").textContent = todayData.code;
  document.getElementById("hashtag").textContent = todayData.hashtag;
  document.getElementById("date").textContent = `${todayData.date} · WIB`;

  const stats = await fetch(API_BASE + "/api/stats").then(x => x.json());
  document.getElementById("used").textContent = stats.daily_used;
  document.getElementById("remaining").textContent = stats.daily_remaining;

  const fridayResponse = await fetch(API_BASE + "/api/friday");
  if (fridayResponse.ok) {
    fridayData = await fridayResponse.json();
  }

  updateFridayDisplay();
}

function updateFridayDisplay() {
  const fridayElement = document.getElementById("friday");
  if (!fridayElement) return;

  if (fridayData && fridayData.active) {
    fridayElement.textContent = fridayData.hashtag;
    fridayElement.style.display = "block";
  } else {
    fridayElement.textContent = "";
    fridayElement.style.display = "none";
  }
}

function updateCountdown() {
  const countdownEl = document.getElementById("countdown");
  if (!countdownEl) return;

  const now = new Date();
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).formatToParts(now);

  const get = t => Number(p.find(x => x.type === t).value);
  const left = 86400 - (get("hour") * 3600 + get("minute") * 60 + get("second"));

  const h = String(Math.floor(left / 3600)).padStart(2, "0");
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");

  countdownEl.textContent = `Berganti dalam ${h}:${m}:${s}`;
}

async function loadHistory() {
  try {
    const r = await fetch(API_BASE + "/api/history");
    if (!r.ok) throw new Error("API history error");

    const data = await r.json();
    const tbody = document.getElementById("history-table");
    
    if (tbody && data.daily) {
      tbody.innerHTML = data.daily.map(item => `
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">${item.active_date}</td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">${item.hashtag}</td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-weight: bold; font-size: 1.1em;">${item.code}</td>
        </tr>
      `).join("");
    }
  } catch (e) {
    console.error("Gagal memuat history:", e);
    const tbody = document.getElementById("history-table");
    if (tbody) tbody.innerHTML = `<tr><td colspan="3">Gagal memuat data riwayat.</td></tr>`;
  }
}

// LOGIKA PEMISAH HALAMAN (ROUTING SEDERHANA)
const copyBtn = document.getElementById("copy");

if (copyBtn) {
  // --- JIKA BERADA DI HALAMAN INDEX (UTAMA) ---
  copyBtn.addEventListener("click", async () => {
    if (!todayData) return;

    let text = `Persiapan Persiapan\n\nInstanusantara Upload Bersama\n(INUB) Today\n\n@INSTANUSANTARA\n#instanusantara\n${todayData.hashtag}`;

    if (fridayData && fridayData.active) {
      text += `\n${fridayData.hashtag}`;
    }

    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "COPIED ✓";
    setTimeout(() => {
      copyBtn.textContent = "COPY FULL INUB";
    }, 1500);
  });

  loadToday().catch(e => {
    document.getElementById("hashtag").textContent = "API belum dikonfigurasi.";
    console.error(e);
  });

  setInterval(updateCountdown, 1000);
  updateCountdown();

} else {
  // --- JIKA BERADA DI HALAMAN HISTORY ---
  loadHistory();
}
