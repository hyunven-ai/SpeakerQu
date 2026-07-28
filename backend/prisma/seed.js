import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data
  await prisma.whatsappClick.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.admin.deleteMany({});

  // 2. Create Default Admin
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  const admin = await prisma.admin.create({
    data: {
      username: adminUsername,
      password: hashedPassword,
    },
  });
  console.log(`- Admin created: username is "${admin.username}"`);

  // 3. Create Default Categories
  const catBluetooth = await prisma.category.create({
    data: {
      nama: 'Portable Bluetooth',
      slug: 'portable-bluetooth',
      deskripsi: 'Speaker nirkabel berukuran ringkas dengan baterai tahan lama untuk dibawa bepergian.',
    },
  });

  const catParty = await prisma.category.create({
    data: {
      nama: 'Partybox & Karaoke',
      slug: 'partybox-karaoke',
      deskripsi: 'Speaker berukuran besar dengan daya suara ekstra kuat, lampu RGB, dan input mic.',
    },
  });

  const catSoundbar = await prisma.category.create({
    data: {
      nama: 'Home Theater & Soundbar',
      slug: 'home-theater-soundbar',
      deskripsi: 'Speaker audio berkualitas bioskop untuk ruang keluarga dan Smart TV Anda.',
    },
  });

  console.log('- Categories created');

  // 4. Create Default Store Settings
  const setting = await prisma.setting.create({
    data: {
      nomorWhatsapp: '6281234567890',
      templatePesan: 'Halo, saya tertarik dengan speaker *{nama}*\nHarga: {harga}\nApakah produk ini masih tersedia?',
    },
  });
  console.log('- Shop settings initialized');

  // 5. Create Default Products
  const p1 = await prisma.product.create({
    data: {
      nama: 'JBL PartyBox 310',
      slug: 'jbl-partybox-310',
      deskripsi: 'JBL PartyBox 310 adalah mesin pesta portabel yang tangguh dengan suara JBL Pro Sound yang menggelegar dan pertunjukan lampu visual dinamis yang menakjubkan.',
      spesifikasi: JSON.stringify({
        'Daya Output': '240W RMS',
        'Daya Tahan Baterai': 'Hingga 18 Jam',
        'Versi Bluetooth': '5.1',
        'Tahan Air': 'IPX4 Splashproof',
        'Fitur Tambahan': 'Input Gitar & Mic, Efek Suara Karaoke, Roda & Handle Teleskopik'
      }),
      harga: 8999000,
      stok: 5,
      isActive: true,
      categoryId: catParty.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80', urutan: 0 },
          { url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80', urutan: 1 }
        ]
      }
    }
  });

  const p2 = await prisma.product.create({
    data: {
      nama: 'Bose SoundLink Flex',
      slug: 'bose-soundlink-flex',
      deskripsi: 'Speaker outdoor portabel dengan teknologi PositionIQ untuk menyesuaikan orientasi suara secara otomatis. Suara jernih dan bass mendalam.',
      spesifikasi: JSON.stringify({
        'Daya Output': '20W',
        'Daya Tahan Baterai': 'Hingga 12 Jam',
        'Versi Bluetooth': '4.2',
        'Tahan Air': 'IP67 Waterproof & Dustproof',
        'Fitur Tambahan': 'Mengapung di Air, PositionIQ, Mikrofon Terintegrasi'
      }),
      harga: 2899000,
      stok: 12,
      isActive: true,
      categoryId: catBluetooth.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=80', urutan: 0 }
        ]
      }
    }
  });

  const p3 = await prisma.product.create({
    data: {
      nama: 'Sony HT-S100F Soundbar',
      slug: 'sony-ht-s100f-soundbar',
      deskripsi: 'Soundbar 2 channel berdesain ringkas dengan speaker Bass Reflex untuk meningkatkan kualitas audio TV Anda. Koneksi mudah via HDMI ARC.',
      spesifikasi: JSON.stringify({
        'Daya Output': '120W',
        'Konektivitas': 'HDMI ARC, Optical, Bluetooth, USB',
        'Channel': '2.0 ch',
        'Dimensi': '900 x 64 x 88 mm',
        'Fitur Tambahan': 'S-Force Front Surround, Bass Reflex'
      }),
      harga: 1699000,
      stok: 0, // Habis stok untuk testing badge stok habis
      isActive: true,
      categoryId: catSoundbar.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80', urutan: 0 }
        ]
      }
    }
  });

  console.log('- Sample products created');
  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
