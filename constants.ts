import { Question } from './types';

export const GAME_TITLE: string = "Uji Pengetahuan CT Scan";
export const QUESTIONS_PER_GAME: number = 10;
export const TIME_PER_QUESTION: number = 30; // seconds
export const POINTS_PER_CORRECT_ANSWER: number = 10;
export const ADMIN_CODE: string = "admin123"; // Simple admin code for settings access
export const POINTS_FULL: number = 10;
export const POINTS_PARTIAL: number = 5;
export const TIME_THRESHOLD_FULL_POINTS: number = 20;

// Initial set of questions if local storage is empty
export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Apa kepanjangan dari CT Scan?',
    options: [
      { id: 'a', text: 'Computed Tomography Scan' },
      { id: 'b', text: 'Computerized Technical Scan' },
      { id: 'c', text: 'Cellular Transmission Scan' },
      { id: 'd', text: 'Critical Test Scan' },
    ],
    correctOptionId: 'a',
    explanation: 'CT Scan adalah singkatan dari Computed Tomography Scan, sebuah prosedur pencitraan medis yang menggunakan sinar-X dan pemrosesan komputer untuk membuat gambar cross-sectional (irisan) tubuh.',
    category: 'Dasar CT Scan'
  },
  {
    id: 'q2',
    text: 'Manakah jenis radiasi yang digunakan dalam CT Scan?',
    options: [
      { id: 'a', text: 'Sinar Alfa' },
      { id: 'b', text: 'Sinar Beta' },
      { id: 'c', text: 'Sinar X' },
      { id: 'd', text: 'Sinar Gamma' },
    ],
    correctOptionId: 'c',
    explanation: 'CT Scan menggunakan Sinar-X untuk menghasilkan gambar diagnostik. Sinar-X adalah bentuk radiasi elektromagnetik.',
    category: 'Prinsip Fisika'
  },
  {
    id: 'q3',
    text: 'Apa fungsi utama media kontras dalam pemeriksaan CT Scan?',
    options: [
      { id: 'a', text: 'Mengurangi dosis radiasi' },
      { id: 'b', text: 'Meningkatkan kualitas gambar organ tertentu' },
      { id: 'c', text: 'Mempercepat proses scanning' },
      { id: 'd', text: 'Membuat pasien lebih nyaman' },
    ],
    correctOptionId: 'b',
    explanation: 'Media kontras digunakan untuk meningkatkan visualisasi struktur internal tubuh, seperti pembuluh darah atau organ, sehingga lebih mudah dideteksi atau didiagnosis.',
    category: 'Prosedur Klinis'
  },
  {
    id: 'q4',
    text: 'Istilah "Hounsfield Unit" (HU) dalam CT Scan mengacu pada?',
    options: [
      { id: 'a', text: 'Kecepatan putaran tabung Sinar-X' },
      { id: 'b', text: 'Ukuran pixel gambar' },
      { id: 'c', text: 'Skala kuantitatif densitas radiografi' },
      { id: 'd', text: 'Dosis radiasi yang diterima pasien' },
    ],
    correctOptionId: 'c',
    explanation: 'Hounsfield Unit (HU) adalah skala numerik yang digunakan untuk menggambarkan densitas jaringan pada gambar CT Scan, berdasarkan atenuasi sinar-X.',
    category: 'Interpretasi Gambar'
  },
  {
    id: 'q5',
    text: 'Manakah dari berikut ini yang BUKAN merupakan risiko potensial dari CT Scan?',
    options: [
      { id: 'a', text: 'Paparan radiasi pengion' },
      { id: 'b', text: 'Reaksi alergi terhadap media kontras' },
      { id: 'c', text: 'Infeksi bakteri akibat prosedur' },
      { id: 'd', text: 'Kerusakan ginjal akibat media kontras (pada pasien tertentu)' },
    ],
    correctOptionId: 'c',
    explanation: 'CT Scan adalah prosedur non-invasif dan umumnya tidak menyebabkan infeksi bakteri. Risiko lain seperti paparan radiasi dan reaksi kontras adalah pertimbangan penting.',
    category: 'Keamanan Pasien'
  },
  {
    id: 'q6',
    text: 'Apa yang dimaksud dengan "windowing" dalam konteks CT Scan?',
    options: [
      { id: 'a', text: 'Proses kalibrasi alat CT Scan' },
      { id: 'b', text: 'Teknik untuk mengurangi artefak gambar' },
      { id: 'c', text: 'Penyesuaian kontras dan kecerahan gambar untuk menonjolkan jaringan tertentu' },
      { id: 'd', text: 'Ukuran area tubuh yang di-scan' },
    ],
    correctOptionId: 'c',
    explanation: 'Windowing (window width dan window level) adalah proses penyesuaian rentang nilai HU yang ditampilkan pada gambar CT untuk mengoptimalkan visualisasi berbagai jenis jaringan (misalnya, tulang, paru-paru, jaringan lunak).',
    category: 'Interpretasi Gambar'
  },
  {
    id: 'q7',
    text: 'Teknik CT Scan yang memungkinkan visualisasi 3D pembuluh darah disebut?',
    options: [
      { id: 'a', text: 'CT Fluoroscopy' },
      { id: 'b', text: 'CT Angiography (CTA)' },
      { id: 'c', text: 'CT Colonography' },
      { id: 'd', text: 'CT Perfusion' },
    ],
    correctOptionId: 'b',
    explanation: 'CT Angiography (CTA) adalah teknik khusus CT Scan yang menggunakan media kontras intravena untuk menghasilkan gambar detail pembuluh darah dan dapat direkonstruksi menjadi tampilan 3D.',
    category: 'Teknik Khusus'
  },
  {
    id: 'q8',
    text: 'Prinsip ALARA dalam proteksi radiasi CT Scan berarti?',
    options: [
      { id: 'a', text: 'All Levels Are Radiologically Acceptable' },
      { id: 'b', text: 'As Low As Reasonably Achievable' },
      { id: 'c', text: 'Always Limit All Radiation Access' },
      { id: 'd', text: 'Administer Low Amounts of Radioactive Agents' },
    ],
    correctOptionId: 'b',
    explanation: 'ALARA (As Low As Reasonably Achievable) adalah prinsip fundamental dalam proteksi radiasi, yang bertujuan untuk meminimalkan dosis radiasi pada pasien dan staf tanpa mengorbankan kualitas diagnostik.',
    category: 'Keamanan Pasien'
  },
  {
    id: 'q9',
    text: 'Artefak "beam hardening" pada CT Scan disebabkan oleh?',
    options:
    [
      { id: 'a', text: 'Gerakan pasien selama scan' },
      { id: 'b', text: 'Atenuasi preferensial sinar-X energi rendah saat melewati objek padat' },
      { id: 'c', text: 'Kegagalan detektor pada gantry' },
      { id: 'd', text: 'Penggunaan media kontras yang berlebihan' },
    ],
    correctOptionId: 'b',
    explanation: 'Artefak beam hardening terjadi karena sinar-X polikromatik menjadi "lebih keras" (energi rata-rata meningkat) saat melewati objek, karena foton energi rendah lebih mudah diserap. Ini dapat menyebabkan garis-garis gelap atau pita pada gambar.',
    category: 'Artefak & Kualitas Gambar'
  },
  {
    id: 'q10',
    text: 'Untuk pemeriksaan CT Scan kepala, posisi pasien yang umum adalah?',
    options: [
      { id: 'a', text: 'Supine (telentang), kepala masuk gantry terlebih dahulu' },
      { id: 'b', text: 'Prone (tengkurap), kaki masuk gantry terlebih dahulu' },
      { id: 'c', text: 'Lateral decubitus (berbaring miring)' },
      { id: 'd', text: 'Berdiri tegak menghadap gantry' },
    ],
    correctOptionId: 'a',
    explanation: 'Posisi standar untuk CT Scan kepala adalah pasien berbaring telentang (supine) di atas meja pemeriksaan, dengan kepala diposisikan dengan hati-hati di dalam gantry (lubang scanner).',
    category: 'Prosedur Klinis'
  },
   {
    id: 'q11',
    text: 'Apa fungsi dari gantry dalam sistem CT Scan?',
    options: [
      { id: 'a', text: 'Mengontrol komputer dan pemrosesan gambar' },
      { id: 'b', text: 'Menampung tabung Sinar-X dan detektor yang berputar' },
      { id: 'c', text: 'Tempat tidur pasien bergerak masuk dan keluar' },
      { id: 'd', text: 'Menampilkan gambar hasil scan kepada operator' },
    ],
    correctOptionId: 'b',
    explanation: 'Gantry adalah bagian besar berbentuk cincin dari scanner CT yang menampung tabung Sinar-X, larik detektor, dan sistem akuisisi data (DAS), yang semuanya berputar mengelilingi pasien.',
    category: 'Komponen Alat'
  },
  {
    id: 'q12',
    text: 'Manakah yang merupakan keunggulan CT Scan dibandingkan MRI dalam beberapa kasus?',
    options: [
      { id: 'a', text: 'Tidak menggunakan radiasi pengion' },
      { id: 'b', text: 'Lebih baik dalam visualisasi jaringan lunak detail' },
      { id: 'c', text: 'Waktu pemeriksaan lebih cepat dan lebih baik untuk trauma akut' },
      { id: 'd', text: 'Lebih aman untuk pasien dengan implan logam tertentu' },
    ],
    correctOptionId: 'c',
    explanation: 'CT Scan umumnya lebih cepat daripada MRI, menjadikannya pilihan yang baik untuk situasi darurat atau trauma. Meskipun MRI unggul dalam detail jaringan lunak, CT lebih cepat dan seringkali lebih tersedia.',
    category: 'Perbandingan Modalitas'
  },
  {
  id: "q13",
  text: "Bagian dari CT Scan yang digunakan untuk memposisikan pasien selama pemeriksaan adalah?",
  options: [
    { id: "a", text: "Detektor" },
    { id: "b", text: "Gantry" },
    { id: "c", text: "Slip ring" },
    { id: "d", text: "Meja pemeriksaan" }
  ],
  correctOptionId: "d",
  explanation: "Meja pemeriksaan digunakan untuk memposisikan pasien secara tepat selama proses CT Scan.",
  category: "Komponen CT Scan"
  },
  {
    id: "q14",
    text: "Apa bahan utama meja pemeriksaan CT Scan?",
    options: [
      { id: "a", text: "Aluminium" },
      { id: "b", text: "Plastik" },
      { id: "c", text: "Fiber karbon" },
      { id: "d", text: "Besi" }
    ],
    correctOptionId: "c",
    explanation: "Fiber karbon digunakan karena ringan dan tidak menyerap sinar-X.",
    category: "Komponen CT Scan"
  },
  {
    id: "q15",
    text: "Posisi pasien saat melakukan pemeriksaan CT Scan adalah?",
    options: [
      { id: "a", text: "Prone" },
      { id: "b", text: "Lateral" },
      { id: "c", text: "Upright" },
      { id: "d", text: "Supine" }
    ],
    correctOptionId: "d",
    explanation: "Supine atau terlentang adalah posisi standar pasien saat CT Scan.",
    category: "Prosedur CT Scan"
  },
  {
    id: "q16",
    text: "Komponen penting yang memungkinkan gantry berputar tanpa terganggu kabel adalah?",
    options: [
      { id: "a", text: "Gantry" },
      { id: "b", text: "Slip rings" },
      { id: "c", text: "DAS" },
      { id: "d", text: "Detektor" }
    ],
    correctOptionId: "b",
    explanation: "Slip rings memungkinkan transmisi listrik tanpa kabel, memungkinkan gantry terus berputar.",
    category: "Komponen CT Scan"
  },
  {
    id: "q17",
    text: "Jenis kontras pada CT Scan yang disesuaikan dengan berat badan pasien adalah?",
    options: [
      { id: "a", text: "Oral" },
      { id: "b", text: "Rektal" },
      { id: "c", text: "Intravena" },
      { id: "d", text: "Gas" }
    ],
    correctOptionId: "c",
    explanation: "Kontras intravena diberikan berdasarkan berat badan untuk dosis yang tepat.",
    category: "Kontras CT Scan"
  },
  {
    id: "q18",
    text: "Pemeriksaan laboratorium yang perlu dilakukan sebelum CT Scan abdomen adalah?",
    options: [
      { id: "a", text: "Hemoglobin dan leukosit" },
      { id: "b", text: "Glukosa dan kolesterol" },
      { id: "c", text: "Creatinin dan ureum" },
      { id: "d", text: "SGOT dan SGPT" }
    ],
    correctOptionId: "c",
    explanation: "Creatinin dan ureum diperiksa untuk memastikan fungsi ginjal pasien sebelum pemberian kontras.",
    category: "Persiapan Pemeriksaan"
  },
  {
    id: "q19",
    text: "Komponen CT Scan yang menerima sinar-X setelah melewati tubuh pasien adalah?",
    options: [
      { id: "a", text: "Tabung sinar-X" },
      { id: "b", text: "Detektor" },
      { id: "c", text: "Gantry" },
      { id: "d", text: "Slip rings" }
    ],
    correctOptionId: "b",
    explanation: "Detektor mengubah sinar-X yang melewati tubuh menjadi sinyal untuk pemrosesan.",
    category: "Komponen CT Scan"
  },
  {
    id: "q20",
    text: "Sistem pada CT Scan yang mengubah data analog menjadi digital adalah?",
    options: [
      { id: "a", text: "Gantry" },
      { id: "b", text: "FOV" },
      { id: "c", text: "DAS" },
      { id: "d", text: "Pitch" }
    ],
    correctOptionId: "c",
    explanation: "DAS (Data Acquisition System) mengubah sinyal dari detektor menjadi bentuk digital.",
    category: "Komponen CT Scan"
  },
  {
    id: "q21",
    text: "Apa bahan utama dalam media kontras yang digunakan pada CT Scan?",
    options: [
      { id: "a", text: "Barium" },
      { id: "b", text: "Iodin" },
      { id: "c", text: "Gas CO2" },
      { id: "d", text: "Klorin" }
    ],
    correctOptionId: "b",
    explanation: "Iodin adalah bahan utama media kontras pada CT karena kemampuan penyerapannya terhadap sinar-X.",
    category: "Kontras CT Scan"
  },
  {
    id: "q22",
    text: "Teknik CT Scan yang menggunakan banyak irisan disebut?",
    options: [
      { id: "a", text: "VR" },
      { id: "b", text: "MIP" },
      { id: "c", text: "Multi slice" },
      { id: "d", text: "SSD" }
    ],
    correctOptionId: "c",
    explanation: "Multi slice CT menggunakan banyak irisan dalam satu rotasi untuk mempercepat pencitraan.",
    category: "Teknik CT Scan"
  },
  {
    id: "q23",
    text: "Siapakah penemu CT-Scan?",
    options: [
      { id: "a", text: "Roentgen" },
      { id: "b", text: "Hounsfield" },
      { id: "c", text: "Tesla" },
      { id: "d", text: "Marie Curie" }
    ],
    correctOptionId: "b",
    explanation: "Godfrey Hounsfield adalah penemu CT Scan dan menerima Nobel atas temuannya.",
    category: "Sejarah CT Scan"
  },
  {
    id: "q24",
    text: "Singkatan dari area pemindaian dalam CT adalah?",
    options: [
      { id: "a", text: "ROI" },
      { id: "b", text: "FOV" },
      { id: "c", text: "DAS" },
      { id: "d", text: "CTDI" }
    ],
    correctOptionId: "b",
    explanation: "FOV (Field of View) adalah area tubuh yang dicakup dalam pemindaian.",
    category: "Istilah Teknis"
  },
  {
    id: "q25",
    text: "CT Scan kepala paling sering digunakan untuk mendeteksi kondisi apa?",
    options: [
      { id: "a", text: "Tumor" },
      { id: "b", text: "Fraktur" },
      { id: "c", text: "Stroke" },
      { id: "d", text: "Migrain" }
    ],
    correctOptionId: "c",
    explanation: "CT kepala cepat mendeteksi stroke terutama perdarahan akut.",
    category: "Aplikasi Klinis"
  },
  {
    id: "q26",
    text: "Teknik rekonstruksi citra 3D pada CT Scan disebut?",
    options: [
      { id: "a", text: "MinIP" },
      { id: "b", text: "VR" },
      { id: "c", text: "MPR" },
      { id: "d", text: "SSD" }
    ],
    correctOptionId: "b",
    explanation: "Volume Rendering (VR) digunakan untuk membuat tampilan 3D dari data CT.",
    category: "Teknik Citra"
  },
  {
    id: "q27",
    text: "Apa nama alat yang digunakan untuk menyuntikkan kontras secara otomatis?",
    options: [
      { id: "a", text: "Infus manual" },
      { id: "b", text: "Pump" },
      { id: "c", text: "Injector" },
      { id: "d", text: "Syringe" }
    ],
    correctOptionId: "c",
    explanation: "Injector memberikan kontras dengan kecepatan dan volume yang dikontrol otomatis.",
    category: "Peralatan CT"
  },
  {
    id: "q28",
    text: "Parameter yang menentukan ketebalan irisan dalam pencitraan CT adalah?",
    options: [
      { id: "a", text: "FOV" },
      { id: "b", text: "Slice thickness" },
      { id: "c", text: "Pitch" },
      { id: "d", text: "Rotation time" }
    ],
    correctOptionId: "b",
    explanation: "Slice thickness menentukan seberapa tebal setiap potongan citra CT.",
    category: "Parameter Pencitraan"
  },
  {
    id: "q29",
    text: "Rasio antara pergerakan meja dengan rotasi gantry disebut?",
    options: [
      { id: "a", text: "Pitch" },
      { id: "b", text: "FOV" },
      { id: "c", text: "SSD" },
      { id: "d", text: "DAS" }
    ],
    correctOptionId: "a",
    explanation: "Pitch menunjukkan hubungan antara kecepatan meja dan rotasi gantry.",
    category: "Parameter Pencitraan"
  },
  {
    id: "q30",
    text: "Waktu satu putaran penuh gantry disebut?",
    options: [
      { id: "a", text: "Scan time" },
      { id: "b", text: "Rotation time" },
      { id: "c", text: "Exposure time" },
      { id: "d", text: "Delay time" }
    ],
    correctOptionId: "b",
    explanation: "Rotation time adalah waktu yang diperlukan gantry untuk berputar satu kali penuh.",
    category: "Parameter Pencitraan"
  },
  {
    id: "q31",
    text: "Teknik proyeksi untuk menampilkan struktur densitas rendah adalah?",
    options: [
      { id: "a", text: "MIP" },
      { id: "b", text: "MinIP" },
      { id: "c", text: "VR" },
      { id: "d", text: "SSD" }
    ],
    correctOptionId: "b",
    explanation: "MinIP (Minimum Intensity Projection) menyorot area dengan densitas rendah seperti saluran napas.",
    category: "Teknik Citra"
  },
  {
    id: "q32",
    text: "Jenis artefak yang terjadi akibat pasien bergerak saat pemindaian disebut?",
    options: [
      { id: "a", text: "Blooming" },
      { id: "b", text: "Beam hardening" },
      { id: "c", text: "Motion" },
      { id: "d", text: "Noise" }
    ],
    correctOptionId: "c",
    explanation: "Motion artifact disebabkan oleh pergerakan pasien selama pemeriksaan.",
    category: "Artefak"
  },
  {
    id: "q33",
    text: "Artefak akibat penyerapan sinar rendah oleh struktur padat disebut?",
    options: [
      { id: "a", text: "Blooming" },
      { id: "b", text: "Beam hardening" },
      { id: "c", text: "Motion" },
      { id: "d", text: "Streak" }
    ],
    correctOptionId: "b",
    explanation: "Beam hardening terjadi akibat penyerapan sinar lebih besar pada jaringan padat seperti tulang.",
    category: "Artefak"
  },
  {
    id: "q34",
    text: "Tampilan citra dalam bidang axial, coronal, dan sagittal disebut?",
    options: [
      { id: "a", text: "MinIP" },
      { id: "b", text: "MIP" },
      { id: "c", text: "MPR" },
      { id: "d", text: "SSD" }
    ],
    correctOptionId: "c",
    explanation: "MPR (Multiplanar Reconstruction) memungkinkan tampilan irisan dari berbagai sudut.",
    category: "Teknik Citra"
  },
  {
    id: "q35",
    text: "Metode proyeksi untuk menampilkan struktur dengan densitas tinggi seperti pembuluh darah adalah?",
    options: [
      { id: "a", text: "MIP" },
      { id: "b", text: "MinIP" },
      { id: "c", text: "VR" },
      { id: "d", text: "SSD" }
    ],
    correctOptionId: "a",
    explanation: "MIP (Maximum Intensity Projection) menyorot struktur densitas tinggi seperti vaskular.",
    category: "Teknik Citra"
  },
  {
    id: "q36",
    text: "Singkatan pengukuran dosis dalam CT Scan adalah?",
    options: [
      { id: "a", text: "DAS" },
      { id: "b", text: "CTDI" },
      { id: "c", text: "FOV" },
      { id: "d", text: "ROI" }
    ],
    correctOptionId: "b",
    explanation: "CTDI (Computed Tomography Dose Index) mengukur paparan dosis dalam CT.",
    category: "Dosis Radiasi"
  },
  {
    id: "q37",
    text: "Artefak yang muncul akibat kontras tinggi disebut?",
    options: [
      { id: "a", text: "Motion" },
      { id: "b", text: "Blooming" },
      { id: "c", text: "Beam hardening" },
      { id: "d", text: "Streak" }
    ],
    correctOptionId: "b",
    explanation: "Blooming terjadi karena peningkatan kontras ekstrem dalam gambar CT.",
    category: "Artefak"
  },
  {
    id: "q38",
    text: "Organ dengan densitas tertinggi dalam CT Scan adalah?",
    options: [
      { id: "a", text: "Otak" },
      { id: "b", text: "Paru-paru" },
      { id: "c", text: "Tulang" },
      { id: "d", text: "Hati" }
    ],
    correctOptionId: "c",
    explanation: "Tulang menyerap sinar-X lebih banyak dan tampak paling putih pada CT.",
    category: "Anatomi CT"
  },
  {
    id: "q39",
    text: "Organ dengan densitas terendah dalam CT Scan adalah?",
    options: [
      { id: "a", text: "Lemak" },
      { id: "b", text: "Otak" },
      { id: "c", text: "Udara" },
      { id: "d", text: "Otot" }
    ],
    correctOptionId: "c",
    explanation: "Udara memiliki densitas paling rendah, tampak paling hitam pada CT.",
    category: "Anatomi CT"
  },
  {
    id: "q40",
    text: "Teknik injeksi kontras dengan kecepatan tinggi disebut?",
    options: [
      { id: "a", text: "Manual injection" },
      { id: "b", text: "Bolus" },
      { id: "c", text: "Continuous" },
      { id: "d", text: "Delayed" }
    ],
    correctOptionId: "b",
    explanation: "Bolus injection memberikan kontras cepat untuk pencitraan vaskular.",
    category: "Kontras CT"
  },
  {
    id: "q41",
    text: "Proyeksi 3D yang menampilkan permukaan anatomi tubuh disebut?",
    options: [
      { id: "a", text: "VR" },
      { id: "b", text: "SSD" },
      { id: "c", text: "MIP" },
      { id: "d", text: "MinIP" }
    ],
    correctOptionId: "b",
    explanation: "SSD (Shaded Surface Display) menampilkan struktur permukaan seperti tulang.",
    category: "Teknik Citra"
  },
  {
    id: "q42",
    text: "Waktu tunda setelah injeksi kontras disebut?",
    options: [
      { id: "a", text: "Exposure" },
      { id: "b", text: "Delay" },
      { id: "c", text: "Injection time" },
      { id: "d", text: "Rotation time" }
    ],
    correctOptionId: "b",
    explanation: "Delay digunakan untuk menunggu penyebaran kontras sebelum pemindaian.",
    category: "Protokol CT"
  },
  {
    id: "q43",
    text: "Kontraindikasi utama pemeriksaan CT Scan adalah?",
    options: [
      { id: "a", text: "Anak-anak" },
      { id: "b", text: "Lansia" },
      { id: "c", text: "Ibu hamil" },
      { id: "d", text: "Atlet" }
    ],
    correctOptionId: "c",
    explanation: "CT Scan sebaiknya dihindari pada ibu hamil karena melibatkan radiasi.",
    category: "Keamanan"
  },
  {
    id: "q44",
    text: "CT Scan generasi ke-7 dikenal dengan singkatan?",
    options: [
      { id: "a", text: "CTDI" },
      { id: "b", text: "FOV" },
      { id: "c", text: "MSCT" },
      { id: "d", text: "SSD" }
    ],
    correctOptionId: "c",
    explanation: "Generasi ke-7 CT Scan adalah MSCT (Multi Slice Computed Tomography).",
    category: "Teknologi CT"
  },
  {
    id: "q45",
    text: "Jenis CT Scan yang menggunakan dosis radiasi lebih rendah disebut?",
    options: [
      { id: "a", text: "Fast CT" },
      { id: "b", text: "Low Dose CT" },
      { id: "c", text: "Dynamic CT" },
      { id: "d", text: "High Res CT" }
    ],
    correctOptionId: "b",
    explanation: "Low Dose CT digunakan untuk mengurangi risiko paparan radiasi.",
    category: "Dosis Radiasi"
  },
  {
    id: "q46",
    text: "Instrumen yang digunakan untuk menjaga posisi pasien agar stabil saat CT Scan adalah?",
    options: [
      { id: "a", text: "Tabung X-ray" },
      { id: "b", text: "Fixator" },
      { id: "c", text: "Fiksasi" },
      { id: "d", text: "Injector" }
    ],
    correctOptionId: "c",
    explanation: "Fiksasi penting untuk mencegah gerakan yang menyebabkan artefak.",
    category: "Prosedur Pemeriksaan"
  }
];

export function shuffleArray<T,>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}