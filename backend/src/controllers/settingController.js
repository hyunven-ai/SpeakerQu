import prisma from '../utils/prisma.js';

// Default configuration if database is empty
const DEFAULT_SETTING = {
  nomorWhatsapp: '6281234567890',
  templatePesan: 'Halo, saya tertarik dengan *{nama}*\nHarga: {harga}\nApakah masih tersedia?',
  seoTitle: 'SpeakerQu - Jual Speaker Premium Direct WhatsApp',
  seoDescription: 'Toko online speaker premium terbaik. Dapatkan kualitas audio tingkat tinggi, pesan mudah langsung via WhatsApp.',
  seoKeywords: 'speaker, bluetooth, partybox, soundbar, audio premium',
  customScript: '',
  enableWhatsapp: true
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
  const { nomorWhatsapp, templatePesan, seoTitle, seoDescription, seoKeywords, customScript, enableWhatsapp } = req.body;

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
      enableWhatsapp: enableWhatsapp !== undefined ? Boolean(enableWhatsapp) : true
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
