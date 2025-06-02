import { Question } from './types';

export const GAME_TITLE: string = "Uji Pengetahuan CT Scan";
export const QUESTIONS_PER_GAME: number = 10;
export const TIME_PER_QUESTION: number = 30; // seconds
export const POINTS_PER_CORRECT_ANSWER: number = 10;
export const ADMIN_CODE: string = "admin123"; // Simple admin code for settings access

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