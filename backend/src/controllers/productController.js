import prisma from '../utils/prisma.js';
import { deleteImageFile } from '../utils/imageCleaner.js';

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

export const getProducts = async (req, res) => {
  const { search, category, admin } = req.query;

  try {
    const where = {};
    
    // Non-admin can only see active products
    if (admin !== 'true') {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { deskripsi: { contains: search } }
      ];
    }

    if (category) {
      // Find category by slug or id
      const cat = await prisma.category.findFirst({
        where: {
          OR: [
            { id: category },
            { slug: category }
          ]
        }
      });
      if (cat) {
        where.categoryId = cat.id;
      } else {
        // If category query exists but category not found, return empty array
        return res.status(200).json([]);
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { urutan: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Gagal mengambil data produk.' });
  }
};

export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { urutan: 'asc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return res.status(500).json({ message: 'Gagal mengambil detail produk.' });
  }
};

export const createProduct = async (req, res) => {
  const { nama, deskripsi, spesifikasi, harga, stok, isActive, categoryId, images } = req.body;

  if (!nama || !harga) {
    return res.status(400).json({ message: 'Nama dan harga produk wajib diisi.' });
  }

  try {
    let slug = slugify(nama);
    
    // Ensure slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Process images if any (should be array of objects with url and urutan)
    const productImages = images && Array.isArray(images) 
      ? images.map((img, index) => ({
          url: img.url,
          urutan: img.urutan !== undefined ? img.urutan : index
        }))
      : [];

    const product = await prisma.product.create({
      data: {
        nama,
        slug,
        deskripsi,
        spesifikasi, // JSON string
        harga: parseInt(harga),
        stok: parseInt(stok || 0),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        categoryId: categoryId || null,
        images: {
          create: productImages
        }
      },
      include: {
        images: true,
        category: true
      }
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Gagal menambahkan produk.' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi, spesifikasi, harga, stok, isActive, categoryId, images } = req.body;

  if (!nama || !harga) {
    return res.status(400).json({ message: 'Nama dan harga produk wajib diisi.' });
  }

  try {
    const checkProduct = await prisma.product.findUnique({ 
      where: { id },
      include: { images: true }
    });
    
    if (!checkProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    let slug = checkProduct.slug;
    if (nama !== checkProduct.nama) {
      slug = slugify(nama);
      const existing = await prisma.product.findFirst({
        where: { slug, NOT: { id } }
      });
      if (existing) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    // Handle image updates
    // In our simplified logic: if 'images' array is supplied, we will synchronize.
    // We identify deleted images, call cleanup on files, delete them from DB, and add/update new ones.
    if (images && Array.isArray(images)) {
      const incomingUrls = images.map(img => img.url);
      
      // Identify images to delete
      const toDelete = checkProduct.images.filter(existingImg => !incomingUrls.includes(existingImg.url));
      
      // Delete file physically
      toDelete.forEach(img => deleteImageFile(img.url));
      
      // Delete from database
      if (toDelete.length > 0) {
        await prisma.productImage.deleteMany({
          where: {
            id: { in: toDelete.map(img => img.id) }
          }
        });
      }

      // Add or update incoming images
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const existingImg = checkProduct.images.find(e => e.url === img.url);
        
        if (existingImg) {
          // Update order
          await prisma.productImage.update({
            where: { id: existingImg.id },
            data: { urutan: img.urutan !== undefined ? img.urutan : i }
          });
        } else {
          // Create new image association
          await prisma.productImage.create({
            data: {
              url: img.url,
              urutan: img.urutan !== undefined ? img.urutan : i,
              productId: id
            }
          });
        }
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        nama,
        slug,
        deskripsi,
        spesifikasi,
        harga: parseInt(harga),
        stok: parseInt(stok || 0),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        categoryId: categoryId || null
      },
      include: {
        images: {
          orderBy: { urutan: 'asc' }
        },
        category: true
      }
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Gagal memperbarui produk.' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    // Physical clean up of files
    product.images.forEach(img => {
      deleteImageFile(img.url);
    });

    // Delete product (this will cascade delete ProductImage & WhatsappClick records in DB)
    await prisma.product.delete({
      where: { id }
    });

    return res.status(200).json({ message: 'Produk berhasil dihapus beserta gambarnya.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Gagal menghapus produk.' });
  }
};
