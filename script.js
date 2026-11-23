// Koneksi Supabase
const supabaseUrl = "https://dzgcbcjatidlbirmfbup.supabase.co";
const supabaseKey = "sb_publishable_zj14pU4I668USqK-mCcX1A_BcWGT5wl";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// Form RSVP
const form = document.getElementById("rsvpForm");
const result = document.getElementById("result");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const attending = document.getElementById("attending").value;
    const letter = document.getElementById("letter").value.trim();

    result.textContent = "Mengirim RSVP...";

    const { error } = await db
        .from("rsvp")
        .insert({
            name: name,
            attending: attending,
            letter: letter
        });

    if (error) {
        console.error("Supabase error:", error);
        result.textContent = "Gagal: " + error.message;
    } else {
        result.textContent = "RSVP berhasil dikirim!";
        form.reset();
    }
});

const music = document.getElementById("music");
const playBtn = document.getElementById("playBtn");

playBtn.addEventListener("click", function() {
    if (music.paused) {
        music.play();
        playBtn.textContent = "⏸";
    } else {
        music.pause();
        playBtn.textContent = "▶";
    }
});


function copyRekening() {
    const nomor = document.getElementById("rekening").textContent;

    navigator.clipboard.writeText(nomor).then(() => {
        document.getElementById("copyMessage").textContent =
            "Nomor rekening berhasil disalin!";
    });
}

function copyRekening2() {
    const nomor = document.getElementById("rekening2").textContent;

    navigator.clipboard.writeText(nomor).then(() => {
        document.getElementById("copyMessage2").textContent =
            "Nomor rekening berhasil disalin!";
    });
}


// COUNTDOWN WEDDING

const weddingDate = new Date(
    "2026-12-14T17:00:00+09:00"
).getTime();

const countdown = setInterval(function() {

    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
        clearInterval(countdown);

        document.querySelector(".countdown-container").innerHTML =
            "<h2>Happy Wedding Sanemi & Kanae! ♡</h2>";

        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;

}, 1000);
