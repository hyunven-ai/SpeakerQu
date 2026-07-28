import prisma from '../utils/prisma.js';

export const trackWhatsappClick = async (req, res) => {
  const { productId, productIds, deviceType, referrer } = req.body;

  if (!productId && (!productIds || !Array.isArray(productIds) || productIds.length === 0)) {
    return res.status(400).json({ message: 'Product ID atau Product IDs wajib disertakan.' });
  }

  try {
    const idsToTrack = productIds && Array.isArray(productIds) ? productIds : [productId];
    
    const trackingPromises = idsToTrack.map(async (id) => {
      const product = await prisma.product.findUnique({ where: { id } });
      if (product) {
        return prisma.whatsappClick.create({
          data: {
            productId: id,
            deviceType: deviceType || 'unknown',
            referrer: referrer || null
          }
        });
      }
      return null;
    });

    const results = await Promise.all(trackingPromises);
    const trackedCount = results.filter(r => r !== null).length;

    return res.status(201).json({ message: `Berhasil merekam ${trackedCount} data analitik.`, successCount: trackedCount });
  } catch (error) {
    console.error('Error tracking WhatsApp click:', error);
    return res.status(500).json({ message: 'Gagal merekam data analitik.' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();
    const activeProducts = await prisma.product.count({ where: { isActive: true } });
    const totalCategories = await prisma.category.count();
    
    // Get top products sorted by WhatsApp click count
    const topProductsRaw = await prisma.whatsappClick.groupBy({
      by: ['productId'],
      _count: {
        productId: true
      },
      orderBy: {
        _count: {
          productId: 'desc'
        }
      },
      take: 5
    });

    // Hydrate top products with details
    const topProducts = await Promise.all(
      topProductsRaw.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            images: {
              take: 1,
              orderBy: { urutan: 'asc' }
            }
          }
        });
        return {
          product,
          clickCount: item._count.productId
        };
      })
    );

    // Filter out null products in case any product got deleted in database between query execution
    const filteredTopProducts = topProducts.filter(item => item.product !== null);

    return res.status(200).json({
      stats: {
        totalProducts,
        activeProducts,
        totalCategories
      },
      topProducts: filteredTopProducts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ message: 'Gagal memuat statistik dashboard.' });
  }
};
