import prisma from '../utils/prisma.js';

// Helper to generate URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');      // Replace multiple - with single -
};

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { nama: 'asc' }
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Gagal mengambil data kategori.' });
  }
};

export const createCategory = async (req, res) => {
  const { nama, deskripsi } = req.body;

  if (!nama) {
    return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
  }

  try {
    let slug = slugify(nama);
    
    // Ensure slug uniqueness
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const category = await prisma.category.create({
      data: {
        nama,
        slug,
        deskripsi
      }
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ message: 'Gagal menambahkan kategori.' });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi } = req.body;

  if (!nama) {
    return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
  }

  try {
    const checkCategory = await prisma.category.findUnique({ where: { id } });
    if (!checkCategory) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    let slug = checkCategory.slug;
    if (nama !== checkCategory.nama) {
      slug = slugify(nama);
      const existing = await prisma.category.findFirst({
        where: { slug, NOT: { id } }
      });
      if (existing) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        nama,
        slug,
        deskripsi
      }
    });

    return res.status(200).json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ message: 'Gagal memperbarui kategori.' });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const checkCategory = await prisma.category.findUnique({ where: { id } });
    if (!checkCategory) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    await prisma.category.delete({
      where: { id }
    });

    return res.status(200).json({ message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ message: 'Gagal menghapus kategori.' });
  }
};
