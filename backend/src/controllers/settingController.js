import prisma from '../utils/prisma.js';

// Default configuration if database is empty
const DEFAULT_SETTING = {
  nomorWhatsapp: '6281234567890',
  templatePesan: 'Halo, saya tertarik dengan *{nama}*\nHarga: {harga}\nApakah masih tersedia?',
  seoTitle: 'SpeakerQu - Jual Speaker Premium Direct WhatsApp',
  seoDescription: 'Toko online speaker premium terbaik. Dapatkan kualitas audio tingkat tinggi, pesan mudah langsung via WhatsApp.',
  seoKeywords: 'speaker, bluetooth, partybox, soundbar, audio premium',
  customScript: '',
  enableWhatsapp: true,
  alamat: 'TM HARCO GLODOK,lantai 6 blok AOF no 16\nJln Hayam Wuruk,kel.mangga besar,kec taman sari,jakarta barat - 11180',
  mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8624103138865!2d106.81741517457788!3d-6.149174093837887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f7435f3dfd95%3A0xe54c15dfbb4927a4!2sHarco%20Glodok!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid'
};

export const getSettings = async (req, res) => {
  try {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      // Return default (but do not create yet in read-only to avoid side effects)
      setting = {
        id: 'default',
        ...DEFAULT_SETTING
      };
    }
    return res.status(200).json(setting);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ message: 'Gagal mengambil pengaturan toko.' });
  }
};

export const updateSettings = async (req, res) => {
  const { nomorWhatsapp, templatePesan, seoTitle, seoDescription, seoKeywords, customScript, enableWhatsapp, alamat, mapLink } = req.body;

  if (!nomorWhatsapp || !templatePesan) {
    return res.status(400).json({ message: 'Nomor WhatsApp dan template pesan wajib diisi.' });
  }

  try {
    let setting = await prisma.setting.findFirst();
    
    const settingsData = {
      nomorWhatsapp: nomorWhatsapp.trim(),
      templatePesan: templatePesan,
      seoTitle: seoTitle ? seoTitle.trim() : null,
      seoDescription: seoDescription ? seoDescription.trim() : null,
      seoKeywords: seoKeywords ? seoKeywords.trim() : null,
      customScript: customScript ? customScript.trim() : null,
      enableWhatsapp: enableWhatsapp !== undefined ? Boolean(enableWhatsapp) : true,
      alamat: alamat ? alamat.trim() : null,
      mapLink: mapLink ? mapLink.trim() : null
    };

    if (setting) {
      setting = await prisma.setting.update({
        where: { id: setting.id },
        data: settingsData
      });
    } else {
      setting = await prisma.setting.create({
        data: settingsData
      });
    }

    return res.status(200).json(setting);
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ message: 'Gagal memperbarui pengaturan toko.' });
  }
};
