
// DATA CSV TAMU

const defaultCSV = `id,nama_tamu,instansi,kategori,no_whatsapp
1,"mega",SMKN 6 KOTA TANGERANG SELATAN,Siswi,6281931340850
2,"Dinda Nur Rahma, S.Pd.",SMKN 6 KOTA TANGERANG SELATAN,Guru,6282260060509
3,Syifa Syalsa Nabilla Hasan,SMKN 6 KOTA TANGERANG SELATAN,Siswi,62882459218
4,Mega Lestari Dwi Saputera,SMKN 6 KOTA TANGERANG SELATAN,Siswi,6281931340850
5,"Muhamad Ramdani",SMKN 6 KOTA TANGERANG SELATAN,Siswa,6289678782563
6,Prof. Hendra Wijaya,Universitas Bina Nusantara (BINUS),Universitas,6281144556677
7,Nadia Putri,Alumni Angkatan 2023 - UI/UX Designer,Alumni,6289633445566`;

// MENGAMBIL ELEMEN HTML

const csvFile = document.getElementById("csvFile");
const guestTable = document.getElementById("guestTable");
const statusText = document.getElementById("status");

let guests = [];

// MEMBACA FORMAT CSV

function parseCSV(text) {
    const rows = [];
    let row = [];
    let value = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const next = text[i + 1];

        if (char === '"' && insideQuotes && next === '"') {
            value += '"';
            i++;
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
            row.push(value.trim());
            value = "";
        } else if ((char === "\n" || char === "\r") && !insideQuotes) {
            if (char === "\r" && next === "\n") i++;

            row.push(value.trim());

            if (row.some(item => item !== "")) {
                rows.push(row);
            }

            row = [];
            value = "";
        } else {
            value += char;
        }
    }

    row.push(value.trim());

    if (row.some(item => item !== "")) {
        rows.push(row);
    }

    return rows;
}

// MEMPROSES DATA CSV

function processCSV(text) {
    const data = parseCSV(text);

    const headers = data[0].map(header =>
        header.replace(/^\uFEFF/, "").trim()
    );

    guests = data.slice(1).map(row => {
        const guest = {};

        headers.forEach((header, index) => {
            guest[header] = row[index] || "";
        });

        return guest;
    });

    renderGuests();

    statusText.textContent =
        guests.length + " data tamu berhasil dimuat!";
}

// MENAMPILKAN DAFTAR TAMU

function renderGuests() {
    guestTable.innerHTML = "";

    guests.forEach((guest, index) => {
        guestTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${guest.nama_tamu}</td>
                <td>${guest.instansi}</td>
                <td>${guest.kategori}</td>
                <td>${guest.no_whatsapp}</td>
                <td>
                    <button onclick="sendWhatsApp(${index})">
                        Kirim
                    </button>
                </td>
            </tr>
        `;
    });
}

// MEMBUAT LINK WHATSAPP

function sendWhatsApp(index) {
    const guest = guests[index];

    let phone = guest.no_whatsapp.replace(/\D/g, "");

    if (phone.startsWith("0")) {
        phone = "62" + phone.substring(1);
    }

    if (!phone.startsWith("62") || phone.length < 10) {
        alert("Nomor WhatsApp tidak valid!");
        return;
    }

    const invitationUrl = new URL(
        "index.html",
        window.location.href
    );

    invitationUrl.searchParams.set(
        "nama",
        guest.nama_tamu
    );

    const message =
        `Halo ${guest.nama_tamu}, kami mengundang Anda ke pernikahan Sanemi & Kanae.\n\n` +
        `Silakan buka undangan berikut:\n${invitationUrl.href}`;

    const whatsappUrl =
        "https://wa.me/" + phone +
        "?text=" + encodeURIComponent(message);

    window.open(whatsappUrl, "_blank");
}

// UPLOAD CSV OPSIONAL

csvFile.addEventListener("change", function(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            processCSV(e.target.result);
        } catch (error) {
            statusText.textContent =
                "Gagal membaca CSV: " + error.message;
        }
    };

    reader.readAsText(file);
});

// MENAMPILKAN DATA OTOMATIS

processCSV(defaultCSV);
