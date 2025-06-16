import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Home, Search, Bookmark } from 'lucide-react';

interface MaterialScreenProps {
  onNavigateBack: () => void;
}

// Data materi dari dokumen
const materialData = [
  {
    id: 1,
    title: "Definisi dan Sejarah CT Scan",
    content: `CT Scan adalah singkatan dari Computed Tomography Scan. Ini merupakan sebuah prosedur pencitraan medis yang menggunakan sinar-X dan pemrosesan komputer untuk membuat gambar cross-sectional atau irisan tubuh yang detail.

Teknologi ini merevolusi diagnostik medis dengan memberikan pandangan yang jauh lebih rinci tentang struktur internal dibandingkan dengan rontgen konvensional.

Penemu CT Scan adalah Godfrey Hounsfield, yang kemudian menerima penghargaan Nobel atas penemuannya ini. Kontribusinya sangat signifikan dalam bidang pencitraan medis.`,
    category: "Pengantar"
  },
  {
    id: 2,
    title: "Prinsip Fisika CT Scan",
    content: `Prinsip dasar CT Scan melibatkan penggunaan radiasi pengion, yaitu Sinar-X. Sinar-X ini dipancarkan dari tabung sinar-X yang berputar mengelilingi pasien.

Setelah menembus tubuh pasien, sinar-X yang telah dilemahkan akan ditangkap oleh detektor. Tingkat penyerapan sinar-X bervariasi tergantung pada densitas dan komposisi jaringan yang dilewatinya.

Informasi tentang penyerapan ini kemudian digunakan untuk membangun gambar detail struktur internal tubuh.`,
    category: "Prinsip Dasar"
  },
  {
    id: 3,
    title: "Komponen Utama Alat CT Scan",
    content: `Sistem CT Scan terdiri dari beberapa komponen inti:

**Gantry**: Bagian besar berbentuk cincin yang merupakan rumah bagi tabung Sinar-X dan larik detektor, keduanya berputar mengelilingi pasien selama pemindaian.

**Slip Rings**: Memungkinkan transmisi listrik secara kontinu dan kemampuan gantry untuk berputar tanpa terganggu oleh kabel.

**Meja Pemeriksaan**: Platform untuk memposisikan pasien secara akurat, umumnya terbuat dari Fiber karbon karena sifatnya yang ringan dan tidak menyerap sinar-X.

**Detektor**: Menerima sinar-X setelah melewati tubuh dan mengubahnya menjadi sinyal listrik.

**Sistem Akuisisi Data (DAS)**: Mengubah sinyal analog menjadi data digital.

**Injektor**: Alat untuk menyuntikkan media kontras secara otomatis dengan kecepatan dan volume yang presisi.`,
    category: "Komponen"
  },
  {
    id: 4,
    title: "Persiapan Pasien",
    content: `Sebelum menjalani CT Scan, terutama untuk pemeriksaan tertentu seperti CT Scan abdomen, persiapan pasien sangat penting.

**Pemeriksaan Laboratorium**: 
Untuk CT Scan abdomen, pemeriksaan Creatinin dan ureum perlu dilakukan untuk memastikan fungsi ginjal pasien dalam kondisi baik sebelum pemberian media kontras.

Hal ini penting karena media kontras diekskresikan melalui ginjal, sehingga fungsi ginjal yang baik diperlukan untuk mencegah komplikasi.`,
    category: "Prosedur"
  },
  {
    id: 5,
    title: "Posisi Pasien",
    content: `Posisi pasien sangat krusial untuk mendapatkan gambar yang akurat dan meminimalkan artefak gerakan.

**CT Scan Kepala**: 
Posisi pasien yang umum adalah Supine (telentang), dengan kepala masuk gantry terlebih dahulu.

**Posisi Standar**: 
Secara umum, posisi standar pasien saat CT Scan adalah Supine atau terlentang.

**Fiksasi**: 
Instrumen yang digunakan untuk menjaga posisi pasien tetap stabil selama pemindaian dan mencegah gerakan yang dapat menyebabkan artefak.`,
    category: "Prosedur"
  },
  {
    id: 6,
    title: "Penggunaan Media Kontras",
    content: `Media kontras seringkali digunakan dalam CT Scan untuk meningkatkan visualisasi struktur internal tubuh.

**Iodin**: Bahan utama dalam media kontras CT karena kemampuannya dalam menyerap sinar-X secara efektif.

**Kontras Intravena**: Jenis kontras yang dosisnya disesuaikan dengan berat badan pasien.

**Bolus Injection**: Teknik injeksi kontras dengan kecepatan tinggi yang memberikan kontras secara cepat untuk pencitraan vaskular.

**Delay Time**: Waktu tunda yang diperlukan untuk menunggu penyebaran kontras ke area yang diminati sebelum pemindaian dimulai.`,
    category: "Prosedur"
  },
  {
    id: 7,
    title: "Parameter Pencitraan",
    content: `Beberapa parameter teknis sangat penting dalam CT Scan untuk mengontrol kualitas dan karakteristik gambar:

**Slice Thickness**: Parameter yang menentukan ketebalan irisan gambar yang dihasilkan. Mempengaruhi detail gambar dan cakupan area yang di-scan.

**Pitch**: Rasio antara pergerakan meja pasien dengan rotasi gantry, menunjukkan hubungan antara kecepatan meja dan rotasi gantry. Penting dalam pemindaian heliks/spiral.

**Rotation Time**: Waktu yang diperlukan gantry untuk menyelesaikan satu putaran penuh.`,
    category: "Parameter"
  },
  {
    id: 8,
    title: "Densitas Jaringan dan Hounsfield Unit",
    content: `Dalam CT Scan, densitas jaringan diukur menggunakan skala numerik yang disebut Hounsfield Unit (HU).

Skala ini menggambarkan densitas radiografi berdasarkan atenuasi sinar-X oleh jaringan. Dengan skala ini, berbagai jenis jaringan dapat dibedakan.

**Tulang**: Memiliki densitas tertinggi dalam CT Scan karena menyerap sinar-X lebih banyak, sehingga tampak paling putih pada gambar.

**Udara**: Memiliki densitas terendah, sehingga tampak paling hitam pada citra CT.

Pemahaman tentang HU sangat penting untuk interpretasi gambar CT yang akurat.`,
    category: "Interpretasi"
  },
  {
    id: 9,
    title: "Teknik Visualisasi dan Rekonstruksi",
    content: `Untuk mengoptimalkan tampilan gambar CT Scan, digunakan berbagai teknik:

**Windowing**: Proses penyesuaian kontras dan kecerahan gambar untuk menonjolkan jenis jaringan tertentu.

**CT Angiography (CTA)**: Teknik untuk visualisasi 3D pembuluh darah dengan media kontras intravena.

**Volume Rendering (VR)**: Teknik rekonstruksi citra 3D pada CT Scan.

**MPR (Multiplanar Reconstruction)**: Memungkinkan tampilan irisan dari berbagai sudut (axial, coronal, sagittal).

**MinIP & MIP**: MinIP untuk struktur densitas rendah, MIP untuk struktur densitas tinggi.

**SSD (Shaded Surface Display)**: Proyeksi 3D untuk visualisasi permukaan anatomi tubuh.`,
    category: "Interpretasi"
  },
  {
    id: 10,
    title: "Artefak dan Kualitas Gambar",
    content: `Kualitas gambar CT Scan dapat dipengaruhi oleh berbagai artefak:

**Beam Hardening**: Disebabkan oleh atenuasi preferensial sinar-X energi rendah saat melewati objek padat. Dapat menyebabkan garis-garis gelap atau pita pada gambar.

**Motion Artifact**: Terjadi akibat pasien bergerak selama pemindaian.

**Blooming**: Artefak yang muncul akibat kontras tinggi, terjadi karena peningkatan kontras ekstrem dalam gambar CT.

Pemahaman tentang artefak ini penting untuk interpretasi yang akurat dan upaya pencegahan.`,
    category: "Kualitas"
  },
  {
    id: 11,
    title: "Aplikasi Klinis CT Scan",
    content: `CT Scan memiliki banyak aplikasi klinis yang luas:

**Keunggulan vs MRI**: 
Waktu pemeriksaan yang lebih cepat dan lebih baik untuk trauma akut, menjadikannya pilihan vital dalam situasi darurat.

**CT Scan Kepala**: 
Paling sering digunakan untuk mendeteksi stroke, terutama perdarahan akut, karena kecepatannya dalam memberikan hasil.

**Trauma**: 
Sangat efektif untuk evaluasi cepat pasien trauma dengan hasil yang akurat dan cepat.`,
    category: "Aplikasi"
  },
  {
    id: 12,
    title: "Keamanan Pasien dan Proteksi Radiasi",
    content: `Keamanan pasien adalah prioritas utama dalam setiap prosedur medis yang melibatkan radiasi:

**Prinsip ALARA**: As Low As Reasonably Achievable - bertujuan meminimalkan dosis radiasi tanpa mengorbankan kualitas diagnostik.

**CTDI**: Computed Tomography Dose Index - singkatan pengukuran dosis dalam CT Scan.

**Kontraindikasi**: 
Ibu hamil merupakan kontraindikasi utama karena potensi bahaya radiasi pada janin.

**Low Dose CT**: 
Jenis CT Scan yang menggunakan dosis radiasi lebih rendah untuk mengurangi risiko paparan.

**Catatan Penting**: 
Infeksi bakteri BUKAN merupakan risiko potensial dari CT Scan karena prosedur ini umumnya non-invasif.`,
    category: "Keamanan"
  },
  {
    id: 13,
    title: "FOV (Field of View)",
    content: `FOV merupakan singkatan dari Field of View, yang secara sederhana dapat diartikan sebagai area pemindaian dalam CT.

FOV mengacu pada area tubuh yang dicakup atau dilihat dalam pemindaian oleh detektor. Pengaturan FOV sangat penting karena menentukan seberapa besar bagian tubuh pasien yang akan di-scan dan divisualisasikan dalam gambar.

**FOV Kecil**: 
Menghasilkan resolusi gambar yang lebih tinggi untuk area spesifik.

**FOV Besar**: 
Mencakup area anatomi yang lebih luas namun dengan resolusi yang mungkin sedikit berkurang.

Pemilihan FOV yang tepat disesuaikan dengan tujuan klinis pemeriksaan untuk memastikan informasi diagnostik yang optimal.`,
    category: "Teknologi Lanjutan"
  },
  {
    id: 14,
    title: "Multi-slice CT (MSCT)",
    content: `Sejak penemuannya oleh Godfrey Hounsfield, teknologi CT Scan terus mengalami perkembangan pesat.

**Evolusi Teknologi**: 
Salah satu inovasi paling signifikan adalah Multi-slice CT (MSCT).

**Sebelum MSCT**: 
CT scanner hanya mampu mengakuisisi satu irisan per rotasi tabung sinar-X.

**Dengan MSCT**: 
Memungkinkan penggunaan banyak irisan (atau baris detektor) secara simultan dalam satu rotasi gantry.

**Keunggulan**: 
- Mempercepat proses pencitraan secara drastis
- Memungkinkan pemindaian area tubuh lebih luas dalam waktu singkat
- Sangat bermanfaat untuk pasien yang sulit menahan napas
- Ideal untuk pemeriksaan pada anak-anak
- Sangat penting dalam situasi gawat darurat (trauma dan stroke)
- Memungkinkan rekonstruksi gambar 3D yang lebih detail

**Generasi CT Scan ke-7**: 
MSCT (Multi Slice Computed Tomography) dikenal sebagai generasi ke-7 dari teknologi CT Scan.`,
    category: "Teknologi Lanjutan"
  }
];

const MaterialScreen: React.FC<MaterialScreenProps> = ({ onNavigateBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState(materialData);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('materialBookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Filter materials based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMaterials(materialData);
    } else {
      const filtered = materialData.filter(
        material =>
          material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMaterials(filtered);
      setCurrentSlide(0);
    }
  }, [searchTerm]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % filteredMaterials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + filteredMaterials.length) % filteredMaterials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleBookmark = (materialId: number) => {
    const newBookmarks = bookmarks.includes(materialId)
      ? bookmarks.filter(id => id !== materialId)
      : [...bookmarks, materialId];
    
    setBookmarks(newBookmarks);
    localStorage.setItem('materialBookmarks', JSON.stringify(newBookmarks));
  };

  const currentMaterial = filteredMaterials[currentSlide];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [filteredMaterials.length]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors flex items-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Kembali</span>
            </button>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-sky-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
                Materi CT Scan
              </h1>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Cari materi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 text-sky-400">Daftar Materi</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMaterials.map((material, index) => (
                  <button
                    key={material.id}
                    onClick={() => goToSlide(index)}
                    className={`w-full text-left p-3 rounded-xl transition-all hover:bg-white/10 ${
                      currentSlide === index 
                        ? 'bg-sky-500/20 border border-sky-500/30 text-sky-300' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <div className="text-xs text-white/50 mb-1">{material.category}</div>
                        <div className="text-sm font-medium">{material.title}</div>
                      </div>
                      {bookmarks.includes(material.id) && (
                        <Bookmark className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {filteredMaterials.length > 0 ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                {/* Material Header */}
                <div className="bg-gradient-to-r from-sky-500/20 to-teal-500/20 p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-sky-300 mb-2">{currentMaterial.category}</div>
                      <h2 className="text-2xl font-bold text-white">{currentMaterial.title}</h2>
                    </div>
                    <button
                      onClick={() => toggleBookmark(currentMaterial.id)}
                      className={`p-3 rounded-xl transition-all hover:scale-110 ${
                        bookmarks.includes(currentMaterial.id)
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-6 h-6 ${bookmarks.includes(currentMaterial.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Material Content */}
                <div className="p-6">
                  <div className="prose prose-invert max-w-none">
                    {currentMaterial.content.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <h4 key={index} className="text-lg font-semibold text-sky-300 mt-6 mb-3">
                            {paragraph.replace(/\*\*/g, '')}
                          </h4>
                        );
                      }
                      return (
                        <p key={index} className="text-white/80 leading-relaxed mb-4">
                          {paragraph.split('**').map((part, partIndex) => 
                            partIndex % 2 === 1 ? (
                              <strong key={partIndex} className="text-white font-semibold">
                                {part}
                              </strong>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation */}
                <div className="border-t border-white/10 p-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={prevSlide}
                      disabled={filteredMaterials.length <= 1}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Sebelumnya</span>
                    </button>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-white/60">
                        {currentSlide + 1} dari {filteredMaterials.length}
                      </span>
                      <div className="flex space-x-1">
                        {filteredMaterials.slice(0, 10).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              currentSlide === index ? 'bg-sky-400' : 'bg-white/20 hover:bg-white/40'
                            }`}
                          />
                        ))}
                        {filteredMaterials.length > 10 && (
                          <span className="text-white/40 text-xs">...</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={nextSlide}
                      disabled={filteredMaterials.length <= 1}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white/70 mb-2">Tidak ada hasil</h3>
                <p className="text-white/50">Coba gunakan kata kunci yang berbeda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between text-sm text-white/60 mb-2">
            <span>Progress Membaca</span>
            <span>{Math.round(((currentSlide + 1) / filteredMaterials.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-sky-500 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / filteredMaterials.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialScreen;