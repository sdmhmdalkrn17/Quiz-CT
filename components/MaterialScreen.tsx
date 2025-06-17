import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Home, Search, Bookmark, Menu, X } from 'lucide-react';

interface Material {
  id: number;
  title: string;
  content: string;
  category: string;
}

interface MaterialScreenProps {
  onNavigateBack: () => void;
}

const materialData: Material[] = [
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
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(materialData);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setSidebarOpen(false);
  };

  const toggleBookmark = (materialId: number) => {
    const newBookmarks = bookmarks.includes(materialId)
      ? bookmarks.filter(id => id !== materialId)
      : [...bookmarks, materialId];
    
    setBookmarks(newBookmarks);
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
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center space-x-2 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-medium">Kembali</span>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 md:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-sky-400/20 to-teal-400/20 rounded-xl border border-sky-400/30">
                <BookOpen className="w-6 h-6 text-sky-400" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 via-teal-400 to-sky-300 bg-clip-text text-transparent">
                Materi CT Scan
              </h1>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-sky-400 transition-colors" />
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400/50 outline-none transition-all w-32 md:w-48 placeholder-white/40"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 pb-32">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Table of Contents */}
          <div className={`lg:col-span-1 ${
            sidebarOpen 
              ? 'fixed inset-y-0 left-0 z-50 w-80 transform translate-x-0 md:hidden' 
              : 'hidden lg:block'
          }`}>
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sticky top-4 h-fit max-h-[calc(100vh-2rem)] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-4 md:block">
                <h3 className="text-lg font-semibold text-sky-400 flex items-center space-x-2">
                  <Menu className="w-5 h-5" />
                  <span>Daftar Materi</span>
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg md:hidden transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-96 pr-2">
                {filteredMaterials.map((material, index) => (
                  <button
                    key={material.id}
                    onClick={() => goToSlide(index)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 hover:bg-white/10 group ${
                      currentSlide === index 
                        ? 'bg-gradient-to-r from-sky-500/20 to-teal-500/20 border border-sky-400/30 text-sky-300 shadow-lg' 
                        : 'text-white/70 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <div className="text-xs text-white/50 mb-1 font-medium">{material.category}</div>
                        <div className="text-sm font-medium line-clamp-2 group-hover:text-white transition-colors">{material.title}</div>
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
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                {/* Material Header */}
                <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 p-6 border-b border-slate-600/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="text-sm text-sky-400 mb-2 font-medium flex items-center space-x-2">
                        <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                        <span>{currentMaterial.category}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                        {currentMaterial.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => toggleBookmark(currentMaterial.id)}
                      className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0 ${
                        bookmarks.includes(currentMaterial.id)
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                          : 'bg-white/5 text-white/50 hover:text-white border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Bookmark className={`w-6 h-6 ${bookmarks.includes(currentMaterial.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Material Content */}
                <div className="p-6 min-h-[400px]">
                  <div className="prose prose-invert max-w-none">
                    {currentMaterial.content.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <h4 key={index} className="text-xl font-semibold text-sky-300 mt-8 mb-4 flex items-center space-x-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-sky-400 to-teal-400 rounded-full"></div>
                            <span>{paragraph.replace(/\*\*/g, '')}</span>
                          </h4>
                        );
                      }
                      return (
                        <p key={index} className="text-white/80 leading-relaxed mb-6 text-base">
                          {paragraph.split('**').map((part, partIndex) => 
                            partIndex % 2 === 1 ? (
                              <strong key={partIndex} className="text-white font-semibold bg-sky-500/10 px-1 py-0.5 rounded">
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
              </div>
            ) : (
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                <Search className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white/70 mb-2">Tidak ada hasil</h3>
                <p className="text-white/50">Coba gunakan kata kunci yang berbeda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-50">
        <div className="max-w-6xl mx-auto">
          {/* Progress Info */}
          <div className="flex items-center justify-between text-sm text-white/60 mb-3">
            <span className="font-medium">Progress</span>
            <span className="font-mono">
              {currentSlide + 1}/{filteredMaterials.length} • {Math.round(((currentSlide + 1) / filteredMaterials.length) * 100)}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 via-teal-500 to-sky-400 h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${((currentSlide + 1) / filteredMaterials.length) * 100}%` }}
            ></div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevSlide}
              disabled={filteredMaterials.length <= 1}
              className="flex items-center justify-center w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all duration-200 hover:scale-105 group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:text-sky-400 transition-colors" />
            </button>

            {/* Slide Indicators */}
            <div className="flex items-center space-x-2 max-w-xs overflow-hidden">
              {filteredMaterials.slice(0, 10).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 hover:scale-125 ${
                    currentSlide === index 
                      ? 'bg-sky-400 shadow-lg shadow-sky-400/50' 
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
              {filteredMaterials.length > 10 && (
                <span className="text-white/40 text-xs px-1">...</span>
              )}
            </div>

            <button
              onClick={nextSlide}
              disabled={filteredMaterials.length <= 1}
              className="flex items-center justify-center w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all duration-200 hover:scale-105 group"
            >
              <ChevronRight className="w-6 h-6 group-hover:text-sky-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialScreen;