import prisma from '../utils/prisma.js';

const DEFAULT_CONTACTS = [
  {
    type: 'address',
    title: 'Alamat Toko Fisik',
    value: 'TM HARCO GLODOK,lantai 6 blok AOF no 16\nJln Hayam Wuruk,kel.mangga besar,kec taman sari,jakarta barat - 11180',
    subtext: 'TM Harco Glodok Lantai 6 Blok AOF No. 16',
    icon: 'MapPin',
    link: 'https://maps.google.com/?q=TM+Harco+Glodok',
    urutan: 0,
    isActive: true
  },
  {
    type: 'whatsapp',
    title: 'Nomor WhatsApp Resmi',
    value: '+6287777835864',
    subtext: 'Respon cepat setiap hari',
    icon: 'MessageCircle',
    link: 'https://wa.me/6287777835864',
    urutan: 1,
    isActive: true
  },
  {
    type: 'hours',
    title: 'Jam Operasional',
    value: 'Senin - Minggu: 09.00 - 21.00 WIB',
    subtext: 'Buka setiap hari termasuk hari libur nasional',
    icon: 'Clock',
    link: '',
    urutan: 2,
    isActive: true
  },
  {
    type: 'email',
    title: 'Email Resmi',
    value: 'info@nursehaaudio.com',
    subtext: 'Untuk penawaran proyek & pengadaan instansi',
    icon: 'Mail',
    link: 'mailto:info@nursehaaudio.com',
    urutan: 3,
    isActive: true
  }
];

// Seed default contacts if table is empty
const ensureDefaultContacts = async () => {
  const count = await prisma.contactInfo.count();
  if (count === 0) {
    for (const item of DEFAULT_CONTACTS) {
      await prisma.contactInfo.create({
        data: item
      });
    }
  }
};

export const getPublicContacts = async (req, res) => {
  try {
    await ensureDefaultContacts();

    const contacts = await prisma.contactInfo.findMany({
      where: { isActive: true },
      orderBy: { urutan: 'asc' }
    });

    return res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching public contacts:', error);
    return res.status(500).json({ message: 'Gagal mengambil data kontak showroom.' });
  }
};

export const getAdminContacts = async (req, res) => {
  try {
    await ensureDefaultContacts();

    const contacts = await prisma.contactInfo.findMany({
      orderBy: { urutan: 'asc' }
    });

    return res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching admin contacts:', error);
    return res.status(500).json({ message: 'Gagal mengambil data kontak admin.' });
  }
};

export const createContact = async (req, res) => {
  const { type, title, value, subtext, icon, link, urutan, isActive } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Judul / label kontak wajib diisi.' });
  }
  if (!value || !value.trim()) {
    return res.status(400).json({ message: 'Isi informasi kontak wajib diisi.' });
  }

  try {
    let orderNum = urutan !== undefined ? Number(urutan) : 0;
    if (isNaN(orderNum)) {
      const maxOrder = await prisma.contactInfo.aggregate({
        _max: { urutan: true }
      });
      orderNum = (maxOrder._max.urutan ?? -1) + 1;
    }

    const newContact = await prisma.contactInfo.create({
      data: {
        type: type ? type.trim() : 'custom',
        title: title.trim(),
        value: value.trim(),
        subtext: subtext ? subtext.trim() : null,
        icon: icon ? icon.trim() : 'MapPin',
        link: link ? link.trim() : null,
        urutan: orderNum,
        isActive: isActive !== undefined ? Boolean(isActive) : true
      }
    });

    return res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return res.status(500).json({ message: 'Gagal menambahkan data kontak.' });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { type, title, value, subtext, icon, link, urutan, isActive } = req.body;

  try {
    const existing = await prisma.contactInfo.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Item kontak tidak ditemukan.' });
    }

    const updateData = {};
    if (type !== undefined) updateData.type = type.trim();
    if (title !== undefined) updateData.title = title.trim();
    if (value !== undefined) updateData.value = value.trim();
    if (subtext !== undefined) updateData.subtext = subtext ? subtext.trim() : null;
    if (icon !== undefined) updateData.icon = icon ? icon.trim() : null;
    if (link !== undefined) updateData.link = link ? link.trim() : null;
    if (urutan !== undefined) updateData.urutan = Number(urutan);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await prisma.contactInfo.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating contact:', error);
    return res.status(500).json({ message: 'Gagal memperbarui data kontak.' });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.contactInfo.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Item kontak tidak ditemukan.' });
    }

    await prisma.contactInfo.delete({ where: { id } });
    return res.status(200).json({ message: 'Item kontak berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({ message: 'Gagal menghapus item kontak.' });
  }
};

export const reorderContacts = async (req, res) => {
  const { orders } = req.body; // Array of { id, urutan }

  if (!Array.isArray(orders)) {
    return res.status(400).json({ message: 'Format urutan tidak valid.' });
  }

  try {
    for (const item of orders) {
      await prisma.contactInfo.update({
        where: { id: item.id },
        data: { urutan: Number(item.urutan) }
      });
    }

    return res.status(200).json({ message: 'Urutan kontak berhasil diperbarui.' });
  } catch (error) {
    console.error('Error reordering contacts:', error);
    return res.status(500).json({ message: 'Gagal memperbarui urutan kontak.' });
  }
};
