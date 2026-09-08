import { 
  Headphones, 
  Sliders, 
  PartyPopper, 
  Music, 
  Wrench, 
  Radio, 
  Volume2, 
  ShieldCheck 
} from 'lucide-react';

export const SERVICES_LIST = [
  {
    id: 'audio-consultation',
    title: 'Audio Consultation',
    icon: Headphones,
    category: 'Konsultasi',
    shortDesc: 'Konsultasi gratis penentuan spesifikasi watt dan konfigurasi speaker yang sesuai dengan kebutuhan dan budget Anda.',
    description: 'Kami membantu Anda menganalisis denah ruangan, kebutuhan daya listrik, dan tujuan penggunaan perangkat tata suara sebelum Anda memutuskan membeli.',
    benefits: [
      'Gratis tanpa biaya komitmen awal',
      'Rekomendasi disesuaikan dengan anggaran Anda',
      'Penjelasan teknis yang mudah dipahami orang awam',
      'Dukungan konsultasi langsung via WhatsApp'
    ],
    targetUsers: 'Pemilik cafe, pengurus masjid/aula, panitia acara, hingga pengguna rumahan.',
    ctaText: 'Konsultasi Sekarang'
  },
  {
    id: 'system-recommendation',
    title: 'Audio System Recommendation',
    icon: Sliders,
    category: 'Perencanaan',
    shortDesc: 'Paket bundling perangkat audio komplit (speaker, mixer, mic, kabel) yang sudah teruji kompatibilitasnya.',
    description: 'Menghindari risiko ketidakcocokan impedansi (ohm) atau watt amplifier yang kekecilan/kebesaran. Kami merancang paket terintegrasi siap colok.',
    benefits: [
      'Kompatibilitas perangkat 100% terjamin',
      'Harga paket lebih hemat dibanding beli satuan',
      'Kabel dan konektor bermutu tinggi disertakan',
      'Panduan pengoperasian langkah-demi-langkah'
    ],
    targetUsers: 'Cafe, restoran, studio senam, ruang rapat kantor, dan tempat ibadah.',
    ctaText: 'Minta Rekomendasi'
  },
  {
    id: 'event-audio-setup',
    title: 'Event Audio Setup',
    icon: PartyPopper,
    category: 'Event & Acara',
    shortDesc: 'Setting tata suara untuk acara indoor maupun outdoor, pentas musik, arisan akbar, dan perayaan keluarga.',
    description: 'Dukungan konfigurasi tata suara lapangan dengan cakupan suara merata dan vokal jernih bebas distorsi untuk memastikan pesan acara Anda tersampaikan.',
    benefits: [
      'Cakupan suara merata hingga ratusan peserta',
      'Penataan kabel rapi dan aman dari lalu lintas orang',
      'Penyetelan equalizer sesuai karakteristik lokasi',
      'Uji coba suara (soundcheck) menyeluruh sebelum acara'
    ],
    targetUsers: 'Panitia wedding, event organizer, pengajian akbar, dan senam massal.',
    ctaText: 'Booking Setup Event'
  },
  {
    id: 'karaoke-setup',
    title: 'Karaoke System Setup',
    icon: Music,
    category: 'Hiburan',
    shortDesc: 'Paket hiburan karaoke keluarga dan ruang VIP dengan efek echo halus dan vokal tebal.',
    description: 'Menciptakan ruang karaoke idaman di rumah Anda. Menggabungkan speaker vokal jernih, subwoofer bergetar empuk, dan mic wireless anti-storing.',
    benefits: [
      'Efek vokal tebal dan mudah dinyanyikan',
      'Koneksi mudah ke Smart TV, tablet, atau YouTube',
      'Dua microphone wireless UHF include koper',
      'Setting bass empuk yang ramah tetangga'
    ],
    targetUsers: 'Keluarga, ruang hiburan vila, VIP lounge resto.',
    ctaText: 'Setup Karaoke'
  },
  {
    id: 'speaker-installation',
    title: 'Speaker Installation & Mounting',
    icon: Wrench,
    category: 'Instalasi Fisik',
    shortDesc: 'Pemasangan bracket dinding, plafon, dan penataan kabel audio tanam yang rapi dan aman.',
    description: 'Layanan pemasangan fisik speaker satelit cafe atau soundbar dinding dengan perhitungan sudut pancar suara (dispersion angle) optimal.',
    benefits: [
      'Bracket kokoh bersertifikasi standar keamanan',
      'Jalur kabel tersembunyi (conduit/ducting rapi)',
      'Sudut tembak suara tepat mengenai area pendengar',
      'Estetika interior ruangan tetap terjaga elegan'
    ],
    targetUsers: 'Interior cafe, ruko, restoran, ruang meeting, dan klinik.',
    ctaText: 'Jadwalkan Instalasi'
  },
  {
    id: 'wireless-mic-setup',
    title: 'Wireless Microphone Setup',
    icon: Radio,
    category: 'Konfigurasi Frekuensi',
    shortDesc: 'Scanning dan sinkronisasi frekuensi multi-mic UHF bebas benturan sinyal antar ruangan.',
    description: 'Solusi bagi gedung yang menggunakan banyak microphone wireless bersamaan tanpa takut suara mic sebelah bocor atau putus-putus.',
    benefits: [
      'Sinkronisasi frekuensi otomatis via Infrared',
      'Bebas interferensi sinyal radio dan seluler',
      'Antena booster untuk jangkauan sinyal 50+ meter',
      'Baterai hemat daya dengan daya tahan tinggi'
    ],
    targetUsers: 'Tempat ibadah, aula pertemuan, ruang seminar, dan panggung live.',
    ctaText: 'Setup Mic Wireless'
  },
  {
    id: 'room-acoustic-consultation',
    title: 'Room Acoustic Consultation',
    icon: Volume2,
    category: 'Akustik Ruang',
    shortDesc: 'Konsultasi reduksi gema dan pantulan dinding kaca/beton untuk kejelasan artikulasi ucapan.',
    description: 'Membantu mengatasi ruangan bergema yang membuat ucapan penceramah atau pembicara tidak terdengar jelas meskipun volume speaker sudah maksimal.',
    benefits: [
      'Analisis titik pantul suara dominan',
      'Rekomendasi penempatan panel peredam / diffuser',
      'Meningkatkan Speech Transmission Index (STI)',
      'Solusi hemat biaya tanpa renovasi besar-besaran'
    ],
    targetUsers: 'Masjid, gereja, ruang rapat berlantai marmer, dan auditorium.',
    ctaText: 'Konsultasi Akustik'
  },
  {
    id: 'audio-maintenance',
    title: 'Audio Equipment Maintenance & Sparepart',
    icon: ShieldCheck,
    category: 'Purna Jual',
    shortDesc: 'Pengecekan berkala, penggantian aki kering speaker, spul mic, dan servis modul amplifier.',
    description: 'Layanan purna jual resmi untuk memastikan aset perangkat audio Anda selalu prima dan siap digunakan kapan saja.',
    benefits: [
      'Ketersediaan suku cadang resmi distributor',
      'Penggantian aki 12V bergaransi',
      'Pembersihan debu dan potensi karat pada fader mixer',
      'Garansi pengerjaan servis resmi'
    ],
    targetUsers: 'Semua pelanggan Nurseha Audio dan pengguna speaker profesional.',
    ctaText: 'Hubungi Servis'
  }
];
