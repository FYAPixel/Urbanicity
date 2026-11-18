/**
 * URBANICITY - PETA WILAYAH INDONESIA
 * Dibuat dengan Leaflet.js & EMSIFA Indonesian Regional API
 * Proyek Siswa IDN Boarding School Solo
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. PENGATURAN PETA & PEMBATASAN WILAYAH (BOUNDS)
    // -------------------------------------------------------------
    // Koordinat batas kepulauan Indonesia agar peta tidak bergeser ke luar negeri
    const batasBaratSelatan = L.latLng(-11.5, 94.5);
    const batasTimurUtara = L.latLng(6.5, 141.5);
    const batasIndonesia = L.latLngBounds(batasBaratSelatan, batasTimurUtara);

    const map = L.map('map', {
        center: [-2.5489, 118.0149], // Titik tengah Indonesia
        zoom: 5,
        minZoom: 4,
        maxZoom: 12,
        maxBounds: batasIndonesia,
        maxBoundsViscosity: 1.0,      // Menahan peta agar tetap di dalam batas Indonesia
        scrollWheelZoom: true
    });

    // Layer peta OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | Data: EMSIFA API'
    }).addTo(map);

    // Refresh ukuran peta agar tile tidak abu-abu saat awal dibuka
    setTimeout(() => map.invalidateSize(), 250);
    window.addEventListener('resize', () => map.invalidateSize());

    // -------------------------------------------------------------
    // 2. DATA REFERENSI LENGKAP 38 PROVINSI INDONESIA
    // -------------------------------------------------------------
    // Digunakan sebagai pelengkap koordinat dan data wilayah
    const DATA_PROVINSI = {
        '11': { lat: 4.6951, lng: 96.7494, capital: 'Banda Aceh', population: 5510000, area: 57956 },
        '12': { lat: 2.1154, lng: 99.5451, capital: 'Medan', population: 15386640, area: 72981 },
        '13': { lat: -0.7399, lng: 100.8000, capital: 'Padang', population: 5757200, area: 42013 },
        '14': { lat: 0.2933, lng: 101.7068, capital: 'Pekanbaru', population: 6614400, area: 87024 },
        '15': { lat: -1.4852, lng: 102.4381, capital: 'Jambi', population: 3677400, area: 50058 },
        '16': { lat: -3.3194, lng: 104.9147, capital: 'Palembang', population: 8832000, area: 91592 },
        '17': { lat: -3.5778, lng: 102.3464, capital: 'Bengkulu', population: 2060100, area: 19919 },
        '18': { lat: -4.5586, lng: 105.4068, capital: 'Bandar Lampung', population: 9314000, area: 34624 },
        '19': { lat: -2.7411, lng: 106.4406, capital: 'Pangkalpinang', population: 1517500, area: 16424 },
        '21': { lat: 3.9457, lng: 108.1429, capital: 'Tanjungpinang', population: 2154000, area: 8202 },
        '31': { lat: -6.2088, lng: 106.8456, capital: 'Jakarta Pusat', population: 10672100, area: 664 },
        '32': { lat: -6.9175, lng: 107.6191, capital: 'Bandung', population: 49405800, area: 35378 },
        '33': { lat: -7.1510, lng: 110.1403, capital: 'Semarang', population: 37540900, area: 32801 },
        '34': { lat: -7.7956, lng: 110.3695, capital: 'Yogyakarta', population: 3762200, area: 3133 },
        '35': { lat: -7.5361, lng: 112.2384, capital: 'Surabaya', population: 41144000, area: 47800 },
        '36': { lat: -6.4058, lng: 106.0640, capital: 'Serang', population: 12252000, area: 9663 },
        '51': { lat: -8.4095, lng: 115.1889, capital: 'Denpasar', population: 4414400, area: 5780 },
        '52': { lat: -8.6529, lng: 117.3616, capital: 'Mataram', population: 5473700, area: 18572 },
        '53': { lat: -8.6574, lng: 121.0794, capital: 'Kupang', population: 5541400, area: 48718 },
        '61': { lat: -0.0263, lng: 109.3425, capital: 'Pontianak', population: 5541400, area: 147307 },
        '62': { lat: -1.6815, lng: 113.3824, capital: 'Palangka Raya', population: 2773700, area: 153565 },
        '63': { lat: -3.0926, lng: 115.2838, capital: 'Banjarbaru', population: 4182100, area: 38744 },
        '64': { lat: 0.5387, lng: 116.4194, capital: 'Samarinda', population: 3941800, area: 129067 },
        '65': { lat: 3.0731, lng: 116.0414, capital: 'Tanjung Selor', population: 746200, area: 75468 },
        '71': { lat: 0.6247, lng: 123.9750, capital: 'Manado', population: 2681500, area: 13852 },
        '72': { lat: -1.4300, lng: 121.4456, capital: 'Palu', population: 3121700, area: 61841 },
        '73': { lat: -3.6687, lng: 119.9741, capital: 'Makassar', population: 9312000, area: 46717 },
        '74': { lat: -4.1449, lng: 122.1746, capital: 'Kendari', population: 2755600, area: 38068 },
        '75': { lat: 0.6999, lng: 122.4467, capital: 'Gorontalo', population: 1212800, area: 11257 },
        '76': { lat: -2.8441, lng: 119.2321, capital: 'Mamuju', population: 1458600, area: 16787 },
        '81': { lat: -3.2385, lng: 130.1453, capital: 'Ambon', population: 1895000, area: 46914 },
        '82': { lat: 1.5709, lng: 127.8088, capital: 'Sofifi', population: 1337000, area: 31982 },
        '91': { lat: -4.2699, lng: 138.0804, capital: 'Jayapura', population: 1047100, area: 81049 },
        '92': { lat: -1.3361, lng: 133.1747, capital: 'Manokwari', population: 569600, area: 64137 },
        '93': { lat: -7.0000, lng: 139.5000, capital: 'Merauke', population: 522200, area: 127280 },
        '94': { lat: -3.8000, lng: 136.5000, capital: 'Nabire', population: 1452800, area: 66130 },
        '95': { lat: -4.1000, lng: 139.0000, capital: 'Wamena', population: 1430500, area: 52200 },
        '96': { lat: -0.8750, lng: 131.2500, capital: 'Sorong', population: 621900, area: 39167 }
    };

    // Format angka standar Indonesia (contoh: 10.672.100)
    const formatAngka = (num) => {
        if (!num) return '-';
        return Number(num).toLocaleString('id-ID');
    };

    // -------------------------------------------------------------
    // 3. IKON MARKER BERGAYA GLOW MINIMALIS
    // -------------------------------------------------------------
    const buatIkonMarker = () => {
        return L.divIcon({
            className: 'custom-map-marker-container',
            html: '<div class="custom-map-marker" title="Lokasi Provinsi"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -12]
        });
    };

    let daftarProvinsi = [];
    const petaMarker = new Map();

    // Elemen DOM Panel Data
    const regionsGrid = document.getElementById('regionsGrid');
    const regionCount = document.getElementById('regionCount');
    const regionSearch = document.getElementById('regionSearch');

    // -------------------------------------------------------------
    // 4. MENGAMBIL DATA DARI EMSIFA REGIONAL API
    // -------------------------------------------------------------
    const EMSIFA_URL_UTAMA = 'https://www.emsifa.com/api-wilayah-indonesia/v2/provinces.json';
    const EMSIFA_URL_CADANGAN = 'https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json';

    async function ambilDataProvinsi() {
        if (regionsGrid) {
            regionsGrid.innerHTML = `
                <div class="panel-loading">
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <p>Menghubungkan ke EMSIFA API & memuat data provinsi...</p>
                </div>
            `;
        }

        let dataMentah = null;

        // Coba endpoint utama EMSIFA v2
        try {
            const respon = await fetch(EMSIFA_URL_UTAMA);
            if (!respon.ok) throw new Error(`Status HTTP: ${respon.status}`);
            const hasilJson = await respon.json();
            dataMentah = Array.isArray(hasilJson) ? hasilJson : (hasilJson.data || []);
        } catch (errUtama) {
            console.warn("Koneksi EMSIFA v2 gagal, mencoba endpoint cadangan...", errUtama);
            try {
                const responCadangan = await fetch(EMSIFA_URL_CADANGAN);
                if (!responCadangan.ok) throw new Error(`Status HTTP cadangan: ${responCadangan.status}`);
                const hasilCadangan = await responCadangan.json();
                dataMentah = Array.isArray(hasilCadangan) ? hasilCadangan : (hasilCadangan.data || []);
            } catch (errCadangan) {
                console.warn("Menggunakan data referensi lokal provinsi.", errCadangan);
                // Cadangan lokal jika sedang offline
                dataMentah = Object.keys(DATA_PROVINSI).map(id => ({
                    id: id,
                    name: getNamaProvinsi(id)
                }));
            }
        }

        // Olah data API dan satukan dengan data referensi
        daftarProvinsi = (dataMentah || []).map(item => {
            const referensi = DATA_PROVINSI[item.id] || {};
            return {
                id: item.id,
                name: (item.name || getNamaProvinsi(item.id)).toUpperCase(),
                capital: item.capital || referensi.capital || 'Ibu Kota Provinsi',
                lat: Number(item.lat || item.latitude || referensi.lat || 0),
                lng: Number(item.lng || item.longitude || referensi.lng || 0),
                population: item.population || referensi.population || 0,
                area: item.area || referensi.area || 0
            };
        }).filter(p => p.lat !== 0 && p.lng !== 0);

        // Update jumlah wilayah di badge
        if (regionCount) {
            regionCount.textContent = `${daftarProvinsi.length} Provinsi`;
        }

        // Tampilkan marker di peta dan kartu di panel bawah
        pasangMarkerPeta(daftarProvinsi);
        tampilkanDaftarKartu(daftarProvinsi);
    }

    function getNamaProvinsi(id) {
        const daftarNama = {
            '11': 'ACEH', '12': 'SUMATERA UTARA', '13': 'SUMATERA BARAT', '14': 'RIAU', '15': 'JAMBI',
            '16': 'SUMATERA SELATAN', '17': 'BENGKULU', '18': 'LAMPUNG', '19': 'KEPULAUAN BANGKA BELITUNG',
            '21': 'KEPULAUAN RIAU', '31': 'DKI JAKARTA', '32': 'JAWA BARAT', '33': 'JAWA TENGAH',
            '34': 'DAERAH ISTIMEWA YOGYAKARTA', '35': 'JAWA TIMUR', '36': 'BANTEN', '51': 'BALI',
            '52': 'NUSA TENGGARA BARAT', '53': 'NUSA TENGGARA TIMUR', '61': 'KALIMANTAN BARAT',
            '62': 'KALIMANTAN TENGAH', '63': 'KALIMANTAN SELATAN', '64': 'KALIMANTAN TIMUR',
            '65': 'KALIMANTAN UTARA', '71': 'SULAWESI UTARA', '72': 'SULAWESI TENGAH',
            '73': 'SULAWESI SELATAN', '74': 'SULAWESI TENGGARA', '75': 'GORONTALO', '76': 'SULAWESI BARAT',
            '81': 'MALUKU', '82': 'MALUKU UTARA', '91': 'PAPUA', '92': 'PAPUA BARAT',
            '93': 'PAPUA SELATAN', '94': 'PAPUA TENGAH', '95': 'PAPUA PEGUNUNGAN', '96': 'PAPUA BARAT DAYA'
        };
        return daftarNama[id] || `PROVINSI ${id}`;
    }

    // -------------------------------------------------------------
    // 5. RENDER MARKER & POPUP PETA
    // -------------------------------------------------------------
    function pasangMarkerPeta(data) {
        petaMarker.forEach(({ marker }) => map.removeLayer(marker));
        petaMarker.clear();

        data.forEach(prov => {
            const marker = L.marker([prov.lat, prov.lng], {
                icon: buatIkonMarker()
            }).addTo(map);

            const isiPopup = `
                <div class="custom-popup-content">
                    <div class="popup-tag">DATA WILAYAH INDONESIA</div>
                    <h4 class="popup-title">${prov.name}</h4>
                    <div class="popup-grid">
                        <div class="popup-item">
                            <span class="popup-label">Ibu Kota:</span>
                            <span class="popup-value">${prov.capital}</span>
                        </div>
                        <div class="popup-item">
                            <span class="popup-label">Kode Wilayah:</span>
                            <span class="popup-value">#${prov.id}</span>
                        </div>
                        <div class="popup-item">
                            <span class="popup-label">Populasi:</span>
                            <span class="popup-value">${formatAngka(prov.population)} jiwa</span>
                        </div>
                        <div class="popup-item">
                            <span class="popup-label">Luas Wilayah:</span>
                            <span class="popup-value">${formatAngka(prov.area)} km²</span>
                        </div>
                    </div>
                    <button type="button" class="popup-action-btn" data-prov-id="${prov.id}">
                        <span>Buka di Daftar Kartu</span>
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                </div>
            `;

            marker.bindPopup(isiPopup, {
                maxWidth: 290,
                className: 'custom-leaflet-popup'
            });

            marker.on('popupopen', () => {
                sorotKartu(prov.id);
            });

            petaMarker.set(prov.id, { marker, prov });
        });
    }

    // Tombol di dalam popup untuk mengarahkan ke kartu
    document.addEventListener('click', (e) => {
        const tombol = e.target.closest('.popup-action-btn');
        if (tombol) {
            const id = tombol.getAttribute('data-prov-id');
            fokusKartuById(id);
        }
    });

    // -------------------------------------------------------------
    // 6. PANEL DATA DI BAWAH PETA
    // -------------------------------------------------------------
    function tampilkanDaftarKartu(data) {
        if (!regionsGrid) return;

        if (data.length === 0) {
            regionsGrid.innerHTML = `
                <div class="panel-empty">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p>Tidak ada provinsi atau ibu kota yang cocok dengan kata kunci tersebut.</p>
                </div>
            `;
            return;
        }

        regionsGrid.innerHTML = data.map(prov => `
            <div class="region-card" id="card-${prov.id}" data-id="${prov.id}">
                <div class="region-card-header">
                    <span class="region-code-badge">Kode #${prov.id}</span>
                    <h4 class="region-card-name">${prov.name}</h4>
                </div>
                <div class="region-card-body">
                    <div class="region-stat-row">
                        <span class="stat-title"><i class="fa-solid fa-landmark"></i> Ibu Kota:</span>
                        <span class="stat-val">${prov.capital}</span>
                    </div>
                    <div class="region-stat-row">
                        <span class="stat-title"><i class="fa-solid fa-users"></i> Penduduk:</span>
                        <span class="stat-val">${formatAngka(prov.population)}</span>
                    </div>
                    <div class="region-stat-row">
                        <span class="stat-title"><i class="fa-solid fa-chart-area"></i> Luas Wilayah:</span>
                        <span class="stat-val">${formatAngka(prov.area)} km²</span>
                    </div>
                    <div class="region-stat-row">
                        <span class="stat-title"><i class="fa-solid fa-location-dot"></i> Koordinat:</span>
                        <span class="stat-val">${prov.lat.toFixed(2)}°, ${prov.lng.toFixed(2)}°</span>
                    </div>
                </div>
                <div class="region-card-footer">
                    <span>Lihat di Peta</span>
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </div>
            </div>
        `).join('');

        // Event klik pada kartu untuk zoom peta ke lokasi provinsi
        regionsGrid.querySelectorAll('.region-card').forEach(kartu => {
            kartu.addEventListener('click', () => {
                const id = kartu.getAttribute('data-id');
                arahkanPetaKeProvinsi(id);
            });
        });
    }

    // Arahkan kamera peta dan buka popup provinsi yang dipilih
    function arahkanPetaKeProvinsi(id) {
        const item = petaMarker.get(id);
        if (!item) return;

        map.flyTo([item.prov.lat, item.prov.lng], 7, {
            duration: 1.2
        });

        setTimeout(() => {
            item.marker.openPopup();
        }, 1250);

        sorotKartu(id);

        // Jika layar terlalu jauh ke bawah, gulir sedikit ke atas ke arah peta
        const elemenPeta = document.getElementById('map');
        if (elemenPeta && window.scrollY > elemenPeta.offsetTop + 450) {
            elemenPeta.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Sorot border kartu yang sedang aktif
    function sorotKartu(id) {
        document.querySelectorAll('.region-card').forEach(c => c.classList.remove('active-card'));
        const kartuAktif = document.getElementById(`card-${id}`);
        if (kartuAktif) {
            kartuAktif.classList.add('active-card');
        }
    }

    // Gulir panel ke kartu yang dipilih dari popup
    function fokusKartuById(id) {
        const kartu = document.getElementById(`card-${id}`);
        if (kartu) {
            sorotKartu(id);
            kartu.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Fitur pencarian instan (nama provinsi, ibu kota, atau kode)
    if (regionSearch) {
        regionSearch.addEventListener('input', (e) => {
            const kataKunci = e.target.value.toLowerCase().trim();
            const hasilFilter = daftarProvinsi.filter(p => 
                p.name.toLowerCase().includes(kataKunci) ||
                p.capital.toLowerCase().includes(kataKunci) ||
                p.id.includes(kataKunci)
            );

            if (regionCount) {
                regionCount.textContent = `${hasilFilter.length} dari ${daftarProvinsi.length} Provinsi`;
            }

            tampilkanDaftarKartu(hasilFilter);
        });
    }

    // Jalankan pengambilan data pertama kali
    ambilDataProvinsi();

    // -------------------------------------------------------------
    // 7. ACTIVE NAV LINK KETIKA MENGGULIR HALAMAN
    // -------------------------------------------------------------
    const bagian = document.querySelectorAll('section[id]');
    const tautanNav = document.querySelectorAll('.nav-link');

    const updateNavAktif = () => {
        const posisiGulir = window.scrollY + 200;

        bagian.forEach(sec => {
            const atas = sec.offsetTop;
            const tinggi = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (posisiGulir >= atas && posisiGulir < atas + tinggi) {
                tautanNav.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateNavAktif, { passive: true });
    updateNavAktif();
});
