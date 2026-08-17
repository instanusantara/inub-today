const API_BASE="https://REPLACE-WITH-YOUR-WORKER.workers.dev";
let todayData=null;
async function loadToday(){const r=await fetch(API_BASE+"/api/today");if(!r.ok)throw new Error("API error");todayData=await r.json();
document.getElementById("code").textContent=todayData.code;
document.getElementById("hashtag").textContent=todayData.hashtag;
document.getElementById("date").textContent=`${todayData.date} · WIB`;
const stats=await fetch(API_BASE+"/api/stats").then(x=>x.json());
document.getElementById("used").textContent=stats.used;document.getElementById("remaining").textContent=stats.remaining;}
function updateCountdown(){const now=new Date();const p=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Jakarta",hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"}).formatToParts(now);
const get=t=>Number(p.find(x=>x.type===t).value);const left=86400-(get("hour")*3600+get("minute")*60+get("second"));
const h=String(Math.floor(left/3600)).padStart(2,"0"),m=String(Math.floor((left%3600)/60)).padStart(2,"0"),s=String(left%60).padStart(2,"0");
document.getElementById("countdown").textContent=`Berganti dalam ${h}:${m}:${s}`;}
document.getElementById("copy")?.addEventListener("click",async()=>{if(!todayData)return;
await navigator.clipboard.writeText(`INUB Today

@INSTANUSANTARA
#instanusantara
${todayData.hashtag}`);
document.getElementById("copy").textContent="COPIED ✓";setTimeout(()=>document.getElementById("copy").textContent="COPY FULL INUB",1500);});
loadToday().catch(e=>{document.getElementById("hashtag").textContent="API belum dikonfigurasi.";console.error(e);});
setInterval(updateCountdown,1000);updateCountdown();
