// Array produk sembako (nama, harga dalam Rupiah)
const produk = [
    { nama: "Beras", harga: 12000 },
    { nama: "Gula", harga: 15000 },
    { nama: "Minyak Goreng", harga: 20000 },
    { nama: "Telur", harga: 25000 },
    { nama: "Tepung", harga: 10000 },
    { nama: "Susu", harga: 18000 }
];

// Keranjang belanja (array objek: {nama, harga, jumlah})
let keranjang = [];

// Fungsi untuk format Rupiah
function formatRupiah(angka) {
    return angka.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

// Fungsi untuk render daftar produk
function renderProduk() {
    const produkList = document.getElementById('produk-list');
    produkList.innerHTML = '';
    produk.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${item.nama}</h3>
            <p>${formatRupiah(item.harga)}</p>
            <button onclick="tambahKeKeranjang('${item.nama}', ${item.harga})">Tambah ke Keranjang</button>
        `;
        produkList.appendChild(card);
    });
}

// Fungsi untuk tambah ke keranjang
function tambahKeKeranjang(nama, harga) {
    const existingItem = keranjang.find(item => item.nama === nama);
    if (existingItem) {
        existingItem.jumlah += 1;
    } else {
        keranjang.push({ nama, harga, jumlah: 1 });
    }
    updateKeranjang();
}

// Fungsi untuk update tampilan keranjang
function updateKeranjang() {
    const keranjangList = document.getElementById('keranjang-list');
    keranjangList.innerHTML = '';
    keranjang.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        const subtotal = item.harga * item.jumlah;
        itemDiv.innerHTML = `
            <span>${item.nama} (${formatRupiah(item.harga)})</span>
            <div>
                <button onclick="ubahJumlah(${index}, -1)">-</button>
                <span>${item.jumlah}</span>
                <button onclick="ubahJumlah(${index}, 1)">+</button>
                <button onclick="hapusItem(${index})">Hapus</button>
            </div>
            <span>Subtotal: ${formatRupiah(subtotal)}</span>
        `;
        keranjangList.appendChild(itemDiv);
    });
    hitungTotal();
}

// Fungsi untuk ubah jumlah item
function ubahJumlah(index, delta) {
    keranjang[index].jumlah += delta;
    if (keranjang[index].jumlah <= 0) {
        keranjang.splice(index, 1);
    }
    updateKeranjang();
}

// Fungsi untuk hapus item
function hapusItem(index) {
    keranjang.splice(index, 1);
    updateKeranjang();
}

// Fungsi untuk hitung total
function hitungTotal() {
    const total = keranjang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
    document.getElementById('total').textContent = formatRupiah(total);
    return total;
}

// Fungsi untuk hitung kembalian
function hitungKembalian() {
    const total = hitungTotal();
    const uangBayar = parseInt(document.getElementById('uang-bayar').value) || 0;
    const kembalianDiv = document.getElementById('kembalian');
    
    if (uangBayar < total) {
        kembalianDiv.textContent = 'Uang kurang! Tambahkan uang yang cukup.';
        kembalianDiv.style.color = 'red';
    } else {
        const kembalian = uangBayar - total;
        kembalianDiv.textContent = `Kembalian: ${formatRupiah(kembalian)}`;
        kembalianDiv.style.color = 'green';
    }
}

// Fungsi untuk reset transaksi
function resetTransaksi() {
    keranjang = [];
    document.getElementById('uang-bayar').value = '';
    document.getElementById('kembalian').textContent = '';
    updateKeranjang();
}

// Event listeners
document.getElementById('hitung-kembalian').addEventListener('click', hitungKembalian);
document.getElementById('reset-transaksi').addEventListener('click', resetTransaksi);

// Inisialisasi
renderProduk();
updateKeranjang();
