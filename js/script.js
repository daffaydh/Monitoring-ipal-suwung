async function fetchData() {
  try {
    const response = await fetch(
      "https://api.thingspeak.com/channels/2971776/feeds/last"
    );
    const data = await response.json();

    // Format angka hanya 1 desimal
    const field1 = data.field1 ? parseFloat(data.field1).toFixed(1) : "N/A";
    const field2 = data.field2 ? parseFloat(data.field2).toFixed(0) : "N/A";
    const field3 = data.field3 ? parseFloat(data.field3).toFixed(1) : "N/A";
    const field4 = data.field4 ? parseFloat(data.field4).toFixed(0) : "N/A";

    // Tampilkan field 1–4
    document.getElementById("field1").textContent = field1;
    document.getElementById("field2").textContent = field2;
    document.getElementById("field3").textContent = field3;
    document.getElementById("field4").textContent = field4;

    // Status PH berdasarkan field1
    const statusPH = document.getElementById("statusPH");
    const shortStatus = document.getElementById("statusPHShort");
    const ggwp = document.getElementById("ggwp");

    let status = "-";
    let bgColor = "bg-gray-400";

    const phValue = parseFloat(field1);

    if (!isNaN(phValue)) {
      if (phValue < 7) {
        status = "ASAM";
        bgColor = "bg-red-500";
      } else if (phValue === 7) {
        status = "NETRAL";
        bgColor = "bg-green-500";
      } else {
        status = "BASA";
        bgColor = "bg-blue-500";
      }
    }

    statusPH.textContent = status;
    if (shortStatus) shortStatus.textContent = status;

    // Update class latar belakang ggwp
    ggwp.className =
      "mt-4 text-white text-sm rounded-b-[20px] pb-2 font-semibold rou px-3 py-1 flex justify-between  " +
      bgColor;

    // TURBIDITY
    const turbidityValue = parseFloat(field2);
    const turbidityStatus = document.getElementById("statusTurbidity");
    const shortTurbidity = document.getElementById("statusTurbidityShort");
    const turbidityBox = document.getElementById("turbidityBox");

    let turbidityText = "-";
    let turbidityColor = "bg-gray-400";

    if (!isNaN(turbidityValue)) {
      if (turbidityValue >= 1 && turbidityValue <= 5) {
        turbidityText = "JERNIH";
        turbidityColor = "bg-green-500";
      } else if (turbidityValue >= 6 && turbidityValue <= 25) {
        turbidityText = "AGAK KERUH";
        turbidityColor = "bg-yellow-500";
      } else if (turbidityValue >= 26 && turbidityValue <= 50) {
        turbidityText = "AIR KERUH";
        turbidityColor = "bg-orange-500";
      } else if (turbidityValue >= 51 && turbidityValue <= 1500) {
        turbidityText = "AIR KERUH (LIMBAH)";
        turbidityColor = "bg-red-700";
      }
    }

    if (turbidityStatus) turbidityStatus.textContent = turbidityText;
    if (shortTurbidity) shortTurbidity.textContent = turbidityText;

    // Update class latar belakang turbidityBox
    if (turbidityBox) {
      turbidityBox.className =
        "mt-4 text-white text-sm rounded-b-[20px] pb-2 font-semibold rou px-3 py-1 flex justify-between " +
        turbidityColor;
    }

    // Format waktu WIB
    const nowUTC = new Date();
    const witaDate = new Date(nowUTC.getTime());
    const formattedDate = witaDate.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Makassar", // WITA time zone
    });

    document.getElementById(
      "timestamp"
    ).textContent = `LAST UPDATE = ${formattedDate} WITA`;
    document.getElementById(
      "timestamp2"
    ).textContent = `LAST UPDATE = ${formattedDate} WITA`;
    document.getElementById(
      "timestamp3"
    ).textContent = `LAST UPDATE = ${formattedDate} WITA`;
    document.getElementById(
      "timestamp4"
    ).textContent = `LAST UPDATE = ${formattedDate} WITA`;

    console.log("Waktu terakhir update:", formattedDate);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
}

// Ambil data pertama kali dan perbarui tiap 30 detik
fetchData();
setInterval(fetchData, 30000);

// ⏰ Tambahan: Tampilkan tanggal & jam lokal secara real-time
function formatTwoDigits(num) {
  return num < 10 ? "0" + num : num;
}

function updateLocalTime() {
  const nowUTC = new Date();
  const nowWITA = new Date(nowUTC.getTime() ); // Tambah 8 jam

  // Format tanggal: 29 Mei 2025
  const tanggalOptions = { day: "2-digit", month: "long", year: "numeric" };
  const tanggal = nowWITA.toLocaleDateString("id-ID", tanggalOptions);

  // Format jam: HH:MM:SS
  const jam = `${formatTwoDigits(nowWITA.getHours())}:${formatTwoDigits(
    nowWITA.getMinutes()
  )}:${formatTwoDigits(nowWITA.getSeconds())} WITA`;

  // Tampilkan ke elemen HTML
  const tanggalElement = document.getElementById("waktu");
  const jamElement = document.getElementById("jam");

  if (tanggalElement) tanggalElement.textContent = tanggal;
  if (jamElement) jamElement.textContent = jam;
}

updateLocalTime();
setInterval(updateLocalTime, 1000);
