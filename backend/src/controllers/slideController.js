import prisma from '../utils/prisma.js';

const DEFAULT_SLIDES = [
  {
    badge: 'PRO AUDIO • GARANSI RESMI 1 TAHUN',
    titlePrefix: 'Dentuman Bass Dahsyat,',
    titleGradient: 'Kualitas Audio Profesional',
    subtitle: 'Speaker aktif BareTone 12" & 15" bertenaga hingga 1000W RMS. Pilihan utama panggung live, rental audio, aula, dan tempat ibadah dengan garansi resmi 1 tahun distributor.',
    imageUrl: 'https://speaker.gambarku.my.id/img-1788250544272-608283718.webp',
    imageAlt: 'BareTone MAX15DX Professional Active Speaker',
    priceTag: 'Mulai Rp 2.450.000',
    highlightBadge: 'Terlaris untuk Panggung & Aula',
    categorySlug: 'speaker-aktif-baretone',
    waMessage: 'Halo Nurseha Audio, saya tertarik dengan Speaker Aktif BareTone 15 Inch. Boleh minta info stok dan harga terbaiknya?',
    accentColor: 'blue',
    label: '01. Baretone Pro',
    specs: JSON.stringify([
      { label: '1000W Peak', sub: 'Daya Output Maksimal' },
      { label: '15" Pro Woofer', sub: 'Dentuman Bass Dalam' },
      { label: 'Titanium Driver', sub: 'Treble Jernih Bersih' },
      { label: 'Garansi 1 Tahun', sub: 'Resmi Distributor' }
    ]),
    urutan: 0,
    isActive: true
  },
  {
    badge: 'SOLUSI BISNIS • SIAP PAKAI PLUG & PLAY',
    titlePrefix: 'Tata Suara Cafe & Karaoke,',
    titleGradient: 'Jernih Merata & Anti-Feedback',
    subtitle: 'Paket sound system lengkap 4 - 8 speaker passive SoundBest & amplifier mixer Bluetooth. Suara vokal jernih dan background music merata tanpa distorsi mendengung.',
    imageUrl: 'https://speaker.gambarku.my.id/img-1788170467043-476385281.webp',
    imageAlt: 'Paket Sound System Cafe Restoran SoundBest',
    priceTag: 'Paket Lengkap Siap Pakai',
    highlightBadge: 'Pilihan 75+ Cafe & Restoran',
    categorySlug: 'sound-system-cafe',
    waMessage: 'Halo Nurseha Audio, saya ingin konsultasi paket sound system untuk cafe/restoran. Boleh dibantu rekomendasinya?',
    accentColor: 'indigo',
    label: '02. Paket Cafe & Karaoke',
    specs: JSON.stringify([
      { label: 'Paket 4-8 Unit', sub: 'Komplit Siap Colok' },
      { label: 'Mixer Bluetooth', sub: 'Putar Lagu dari HP' },
      { label: 'Anti-Feedback', sub: 'Vokal Jernih Bersih' },
      { label: 'Free Konsultasi', sub: 'Setting Akustik Ruang' }
    ]),
    urutan: 1,
    isActive: true
  },
  {
    badge: 'PORTABLE WIRELESS • DUAL MIC UHF',
    titlePrefix: 'Bawa Pesta Musik Kemanapun,',
    titleGradient: 'Baterai Awet Tanpa Ribet Kabel',
    subtitle: 'Speaker trolley BareTone dengan baterai tahan hingga 8-12 jam, sepasang mic wireless UHF anti-interferensi, dan roda koper kokoh untuk arisan, pengajian, senam, maupun outdoor.',
    imageUrl: 'https://speaker.gambarku.my.id/img-1787560144373-300118574.webp',
    imageAlt: 'BareTone 12 BWR Portable Wireless Trolley Speaker',
    priceTag: 'Mulai Rp 1.999.000',
    highlightBadge: 'Paling Praktis untuk Indoor & Outdoor',
    categorySlug: 'portable-bluetooth',
    waMessage: 'Halo Nurseha Audio, saya tertarik dengan speaker portable trolley BareTone dengan 2 mic wireless. Apakah stoknya ready?',
    accentColor: 'cyan',
    label: '03. Portable Trolley',
    specs: JSON.stringify([
      { label: 'Aki Kering 12V', sub: 'Baterai Hingga 12 Jam' },
      { label: '2 Mic Wireless', sub: 'UHF Frekuensi Stabil' },
      { label: 'Roda & Handle', sub: 'Trolley Praktis Dibawa' },
      { label: 'TWS Bluetooth 5.3', sub: 'Stereo Pairing' }
    ]),
    urutan: 2,
    isActive: true
  }
];

// Helper to auto seed if database is empty
const ensureDefaultSlides = async () => {
  const count = await prisma.heroSlide.count();
  if (count === 0) {
    for (const slide of DEFAULT_SLIDES) {
      await prisma.heroSlide.create({ data: slide });
    }
  }
};

export const getPublicSlides = async (req, res) => {
  try {
    await ensureDefaultSlides();
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { urutan: 'asc' }
    });

    const parsedSlides = slides.map(s => {
      let parsedSpecs = [];
      if (s.specs) {
        try {
          parsedSpecs = typeof s.specs === 'string' ? JSON.parse(s.specs) : s.specs;
        } catch (e) {
          parsedSpecs = [];
        }
      }
      return {
        ...s,
        specs: parsedSpecs
      };
    });

    return res.status(200).json(parsedSlides);
  } catch (error) {
    console.error('Error fetching public slides:', error);
    return res.status(500).json({ message: 'Gagal memuat data hero slide.' });
  }
};

export const getAdminSlides = async (req, res) => {
  try {
    await ensureDefaultSlides();
    const slides = await prisma.heroSlide.findMany({
      orderBy: { urutan: 'asc' }
    });

    const parsedSlides = slides.map(s => {
      let parsedSpecs = [];
      if (s.specs) {
        try {
          parsedSpecs = typeof s.specs === 'string' ? JSON.parse(s.specs) : s.specs;
        } catch (e) {
          parsedSpecs = [];
        }
      }
      return {
        ...s,
        specs: parsedSpecs
      };
    });

    return res.status(200).json(parsedSlides);
  } catch (error) {
    console.error('Error fetching admin slides:', error);
    return res.status(500).json({ message: 'Gagal mengambil daftar slide admin.' });
  }
};

export const createSlide = async (req, res) => {
  const {
    badge,
    titlePrefix,
    titleGradient,
    subtitle,
    imageUrl,
    imageAlt,
    priceTag,
    highlightBadge,
    categorySlug,
    waMessage,
    specs,
    accentColor,
    label,
    isActive
  } = req.body;

  if (!titlePrefix || !titleGradient || !imageUrl) {
    return res.status(400).json({ message: 'Judul dan URL gambar wajib diisi.' });
  }

  try {
    const totalCount = await prisma.heroSlide.count();

    const newSlide = await prisma.heroSlide.create({
      data: {
        badge: badge?.trim() || 'PRO AUDIO • GARANSI RESMI',
        titlePrefix: titlePrefix.trim(),
        titleGradient: titleGradient.trim(),
        subtitle: subtitle?.trim() || '',
        imageUrl: imageUrl.trim(),
        imageAlt: imageAlt?.trim() || null,
        priceTag: priceTag?.trim() || null,
        highlightBadge: highlightBadge?.trim() || null,
        categorySlug: categorySlug?.trim() || null,
        waMessage: waMessage?.trim() || null,
        specs: specs ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : null,
        accentColor: accentColor?.trim() || 'blue',
        label: label?.trim() || `Slide ${totalCount + 1}`,
        urutan: totalCount,
        isActive: isActive !== undefined ? Boolean(isActive) : true
      }
    });

    return res.status(201).json(newSlide);
  } catch (error) {
    console.error('Error creating slide:', error);
    return res.status(500).json({ message: 'Gagal membuat slide baru.' });
  }
};

export const updateSlide = async (req, res) => {
  const { id } = req.params;
  const {
    badge,
    titlePrefix,
    titleGradient,
    subtitle,
    imageUrl,
    imageAlt,
    priceTag,
    highlightBadge,
    categorySlug,
    waMessage,
    specs,
    accentColor,
    label,
    urutan,
    isActive
  } = req.body;

  try {
    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Slide tidak ditemukan.' });
    }

    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data: {
        badge: badge !== undefined ? badge.trim() : existing.badge,
        titlePrefix: titlePrefix !== undefined ? titlePrefix.trim() : existing.titlePrefix,
        titleGradient: titleGradient !== undefined ? titleGradient.trim() : existing.titleGradient,
        subtitle: subtitle !== undefined ? subtitle.trim() : existing.subtitle,
        imageUrl: imageUrl !== undefined ? imageUrl.trim() : existing.imageUrl,
        imageAlt: imageAlt !== undefined ? imageAlt?.trim() : existing.imageAlt,
        priceTag: priceTag !== undefined ? priceTag?.trim() : existing.priceTag,
        highlightBadge: highlightBadge !== undefined ? highlightBadge?.trim() : existing.highlightBadge,
        categorySlug: categorySlug !== undefined ? categorySlug?.trim() : existing.categorySlug,
        waMessage: waMessage !== undefined ? waMessage?.trim() : existing.waMessage,
        specs: specs !== undefined ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : existing.specs,
        accentColor: accentColor !== undefined ? accentColor?.trim() : existing.accentColor,
        label: label !== undefined ? label?.trim() : existing.label,
        urutan: urutan !== undefined ? Number(urutan) : existing.urutan,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive
      }
    });

    return res.status(200).json(updatedSlide);
  } catch (error) {
    console.error('Error updating slide:', error);
    return res.status(500).json({ message: 'Gagal memperbarui data slide.' });
  }
};

export const deleteSlide = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Slide tidak ditemukan.' });
    }

    await prisma.heroSlide.delete({ where: { id } });
    return res.status(200).json({ message: 'Slide berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return res.status(500).json({ message: 'Gagal menghapus slide.' });
  }
};

export const reorderSlides = async (req, res) => {
  const { orders } = req.body; // Array of { id, urutan }

  if (!Array.isArray(orders)) {
    return res.status(400).json({ message: 'Format data urutan tidak valid.' });
  }

  try {
    for (const item of orders) {
      await prisma.heroSlide.update({
        where: { id: item.id },
        data: { urutan: Number(item.urutan) }
      });
    }

    return res.status(200).json({ message: 'Urutan slide berhasil diperbarui.' });
  } catch (error) {
    console.error('Error reordering slides:', error);
    return res.status(500).json({ message: 'Gagal memperbarui urutan slide.' });
  }
};
