import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with dozens of dummy products...');

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
  await prisma.setting.create({
    data: {
      nomorWhatsapp: '6281234567890',
      templatePesan: 'Halo, saya tertarik dengan speaker *{nama}*\nHarga: {harga}\nApakah produk ini masih tersedia?',
    },
  });
  console.log('- Shop settings initialized');

  // 5. Create Expanded Products list (Dozen of dummy items)
  const productsData = [
    // --- PORTABLE BLUETOOTH CATEGORY ---
    {
      nama: 'JBL Flip 6',
      slug: 'jbl-flip-6',
      deskripsi: 'JBL Flip 6 menghadirkan suara JBL Original Pro Sound yang bertenaga dengan kejernihan luar biasa berkat sistem speaker 2 arah yang dioptimalkan.',
      spesifikasi: JSON.stringify({
        'Daya Output': '20W RMS (Woofer) + 10W RMS (Tweeter)',
        'Baterai': 'Hingga 12 Jam',
        'Bluetooth': 'V5.1',
        'Tahan Air': 'IP67 Waterproof & Dustproof',
        'Fitur': 'JBL PartyBoost, Desain Eco-friendly'
      }),
      harga: 1899000,
      stok: 15,
      isActive: true,
      categoryId: catBluetooth.id,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'Bose SoundLink Flex',
      slug: 'bose-soundlink-flex',
      deskripsi: 'Speaker outdoor portabel dengan teknologi PositionIQ untuk menyesuaikan orientasi suara secara otomatis. Suara jernih dan bass mendalam.',
      spesifikasi: JSON.stringify({
        'Daya Output': '20W',
        'Daya Tahan Baterai': 'Hingga 12 Jam',
        'Versi Bluetooth': '4.2',
        'Tahan Air': 'IP67 Waterproof & Dustproof',
        'Fitur': 'Mengapung di Air, PositionIQ, Mikrofon Terintegrasi'
      }),
      harga: 2899000,
      stok: 12,
      isActive: true,
      categoryId: catBluetooth.id,
      imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'Marshall Emberton II',
      slug: 'marshall-emberton-ii',
      deskripsi: 'Emberton II menghadirkan suara yang kaya, jernih, dan keras, persis seperti yang diinginkan oleh seniman pembuatnya. Nikmati suara 360 derajat absolut dengan True Stereophonic.',
      spesifikasi: JSON.stringify({
        'Daya Output': '2 x 10W Class D Amplifier',
        'Baterai': 'Hingga 30 Jam',
        'Bluetooth': 'V5.1',
        'Tahan Air': 'IP67 Waterproof',
        'Fitur': 'True Stereophonic, Stack Mode, Marshall App Support'
      }),
      harga: 2999000,
      stok: 8,
      isActive: true,
      categoryId: catBluetooth.id,
      imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'Sony SRS-XB100',
      slug: 'sony-srs-xb100',
      deskripsi: 'Speaker ultra-portabel super ringkas dengan daya suara Extra Bass. Menghadirkan suara surround yang dinamis dan jernih dalam bodi mini.',
      spesifikasi: JSON.stringify({
        'Baterai': 'Hingga 16 Jam',
        'Bluetooth': 'V5.3 Fast Pair',
        'Tahan Air': 'IP67 Waterproof',
        'Fitur': 'Extra Bass, Sound Diffusion Processor, Mikrofon Echo Cancelling'
      }),
      harga: 799000,
      stok: 25,
      isActive: true,
      categoryId: catBluetooth.id,
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'JBL Clip 4',
      slug: 'jbl-clip-4',
      deskripsi: 'Gantungkan di tas Anda dan mulailah berpetualang. JBL Clip 4 menghadirkan JBL Pro Sound yang kaya dalam bentuk oval ultra-portabel yang keren.',
      spesifikasi: JSON.stringify({
        'Daya Output': '5W RMS',
        'Baterai': 'Hingga 10 Jam',
        'Bluetooth': 'V5.1',
        'Tahan Air': 'IP67 Waterproof',
        'Fitur': 'Integrated Carabiner Clip, Desain Bold & Trendy'
      }),
      harga: 999000,
      stok: 20,
      isActive: true,
      categoryId: catBluetooth.id,
      imageUrl: 'https://images.unsplash.com/photo-1628202926206-c63a34b1618f?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'Anker Soundcore Motion+',
      slug: 'anker-soundcore-motion-plus',
      deskripsi: 'Motion+ dilengkapi dengan audio Hi-Res yang menakjubkan yang diperkuat oleh Qualcomm aptX untuk reproduksi musik tanpa penurunan kualitas.',
      spesifikasi: JSON.stringify({
        'Daya Output': '30W RMS',
        'Baterai': 'Hingga 12 Jam',
        'Bluetooth': 'V5.0 dengan aptX',
        'Tahan Air': 'IPX7 Waterproof',
        'Fitur': 'Hi-Res Audio, Ultra-Wide Frequency Range, Custom EQ via App'
      }),
      harga: 1599000,
      stok: 14,
      isActive: true,
      categoryId: catBluetooth.id,
      imageUrl: 'https://images.unsplash.com/photo-1589256469067-ea99122bb5a5?auto=format&fit=crop&w=600&q=80'
    },

    // --- PARTYBOX & KARAOKE CATEGORY ---
    {
      nama: 'JBL PartyBox 310',
      slug: 'jbl-partybox-310',
      deskripsi: 'JBL PartyBox 310 adalah mesin pesta portabel yang tangguh dengan suara JBL Pro Sound yang menggelegar dan pertunjukan lampu visual dinamis yang menakjubkan.',
      spesifikasi: JSON.stringify({
        'Daya Output': '240W RMS',
        'Daya Tahan Baterai': 'Hingga 18 Jam',
        'Versi Bluetooth': '5.1',
        'Tahan Air': 'IPX4 Splashproof',
        'Fitur': 'Input Gitar & Mic, Efek Suara Karaoke, Roda & Handle Teleskopik'
      }),
      harga: 8999000,
      stok: 5,
      isActive: true,
      categoryId: catParty.id,
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'JBL PartyBox 110',
      slug: 'jbl-partybox-110',
      deskripsi: 'Bawa dimensi baru ke pesta Anda dengan pencahayaan LED dinamis yang disinkronkan dengan suara JBL Original Pro Sound yang kuat.',
      spesifikasi: JSON.stringify({
        'Daya Output': '160W RMS',
        'Baterai': 'Hingga 12 Jam',
        'Bluetooth': 'V5.1',
        'Tahan Air': 'IPX4 Splashproof',
        'Fitur': 'Input Mic & Gitar, Pertunjukan Lampu RGB Dinamis, Kontrol via App'
      }),
      harga: 5899000,
      stok: 6,
      isActive: true,
      categoryId: catParty.id,
      imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'Sony SRS-XV800',
      slug: 'sony-srs-xv800',
      deskripsi: 'Speaker pesta nirkabel XV800 dirancang khusus untuk membanjiri pesta Anda dengan suara yang megah berkat fitur Omni-directional Party Sound.',
      spesifikasi: JSON.stringify({
        'Baterai': 'Hingga 25 Jam',
        'Bluetooth': 'V5.2 Fast Pair',
        'Tahan Air': 'IPX4 Splashproof',
        'Fitur': 'Omni-directional Party Sound, TV Sound Booster, Input Karaoke & Gitar, Roda Bawaan'
      }),
      harga: 9499000,
      stok: 4,
      isActive: true,
      categoryId: catParty.id,
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'Marshall Woburn III',
      slug: 'marshall-woburn-iii',
      deskripsi: 'Sebagai speaker rumah terbesar di lini produk Marshall, Woburn III menghasilkan suara panggung konser yang megah dan mendominasi seluruh ruangan.',
      spesifikasi: JSON.stringify({
        'Daya Output': '150W total (Class D Amplifiers)',
        'Koneksi': 'HDMI ARC, RCA, 3.5mm Aux, Bluetooth',
        'Bluetooth': 'V5.2 LE Audio Ready',
        'Fitur': 'Dynamic Loudness, Penyetelan Akustik Tiga Arah, Desain Vintage Premium'
      }),
      harga: 9999000,
      stok: 3,
      isActive: true,
      categoryId: catParty.id,
      imageUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'JBL PartyBox Encore',
      slug: 'jbl-partybox-encore',
      deskripsi: 'Speaker pesta portabel JBL PartyBox Encore memberi Anda kesenangan karaoke tanpa henti selama 10 jam. Dilengkapi 2 mikrofon nirkabel digital.',
      spesifikasi: JSON.stringify({
        'Daya Output': '100W RMS',
        'Baterai': 'Hingga 10 Jam',
        'Tahan Air': 'IPX4 Splashproof',
        'Mikrofon': '2x Wireless Digital Mics Terintegrasi',
        'Fitur': 'Lampu RGB Sinkron Suara, True Wireless Stereo'
      }),
      harga: 4399000,
      stok: 10,
      isActive: true,
      categoryId: catParty.id,
      imageUrl: 'https://images.unsplash.com/photo-1543791187-df79641836cd?auto=format&fit=crop&w=600&q=80'
    },

    // --- HOME THEATER & SOUNDBAR CATEGORY ---
    {
      nama: 'Sony HT-S100F Soundbar',
      slug: 'sony-ht-s100f-soundbar',
      deskripsi: 'Soundbar 2 channel berdesain ringkas dengan speaker Bass Reflex untuk meningkatkan kualitas audio TV Anda. Koneksi mudah via HDMI ARC.',
      spesifikasi: JSON.stringify({
        'Daya Output': '120W',
        'Konektivitas': 'HDMI ARC, Optical, Bluetooth, USB',
        'Channel': '2.0 ch',
        'Dimensi': '900 x 64 x 88 mm',
        'Fitur': 'S-Force Front Surround, Bass Reflex'
      }),
      harga: 1699000,
      stok: 0, // Habis stok untuk testing badge stok habis
      isActive: true,
      categoryId: catSoundbar.id,
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'Sonos Beam Gen 2',
      slug: 'sonos-beam-gen-2',
      deskripsi: 'Soundbar pintar berukuran ringkas untuk TV, musik, dan game. Nikmati suara spasial 3D dengan Dolby Atmos yang memukau.',
      spesifikasi: JSON.stringify({
        'Konektivitas': 'HDMI eARC, Wi-Fi, Apple AirPlay 2',
        'Asisten Suara': 'Amazon Alexa & Google Assistant Ready',
        'Audio': 'Dolby Atmos, Trueplay Tuning Technology',
        'Fitur': 'Koneksi multi-room Sonos, Speech Enhancement untuk dialog jernih'
      }),
      harga: 8999000,
      stok: 7,
      isActive: true,
      categoryId: catSoundbar.id,
      imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'JBL Bar 500',
      slug: 'jbl-bar-500',
      deskripsi: 'Hidupkan film dan musik Anda dengan suara surround MultiBeam 3D yang megah dan bass yang mendebarkan dari subwoofer nirkabel 10 inci.',
      spesifikasi: JSON.stringify({
        'Daya Output': '590W Total System Power',
        'Subwoofer': '10" Wireless Subwoofer',
        'Konektivitas': 'HDMI eARC dengan 4K Dolby Vision Pass-through, Wi-Fi, AirPlay',
        'Fitur': 'Dolby Atmos, MultiBeam Surround Sound, PureVoice Dialogue Technology'
      }),
      harga: 7999000,
      stok: 6,
      isActive: true,
      categoryId: catSoundbar.id,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'Samsung HW-Q600C',
      slug: 'samsung-hw-q600c',
      deskripsi: 'Soundbar 3.1.2 channel premium yang menghadirkan suara surround spasial Dolby Atmos dan DTS:X berpadu indah dengan teknologi Q-Symphony TV Samsung Anda.',
      spesifikasi: JSON.stringify({
        'Daya Output': '360W',
        'Channel': '3.1.2 ch dengan Up-firing Speakers',
        'Konektivitas': 'HDMI eARC, Bluetooth, Optical',
        'Fitur': 'Dolby Atmos, DTS:X, Q-Symphony, Tap Sound'
      }),
      harga: 4899000,
      stok: 11,
      isActive: true,
      categoryId: catSoundbar.id,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'Bose Smart Soundbar 600',
      slug: 'bose-smart-soundbar-600',
      deskripsi: 'Soundbar pintar yang sangat imersif dilengkapi Dolby Atmos dan teknologi eksklusif Bose TrueSpace untuk menghadirkan audio luar biasa di TV berukuran ringkas.',
      spesifikasi: JSON.stringify({
        'Konektivitas': 'HDMI eARC, Wi-Fi, Bluetooth, Spotify Connect, AirPlay 2',
        'Asisten Suara': 'Amazon Alexa Built-in',
        'Fitur': 'Bose TrueSpace, Dolby Atmos, SimpleSync untuk koneksi headphone Bose'
      }),
      harga: 8499000,
      stok: 5,
      isActive: true,
      categoryId: catSoundbar.id,
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80'
    },
    {
      nama: 'Sony HT-S40R 5.1ch',
      slug: 'sony-ht-s40r-5-1ch',
      deskripsi: 'Nikmati audio bioskop sejati di ruang tamu Anda dengan soundbar 5.1 channel berdaya 600W yang dilengkapi speaker belakang nirkabel.',
      spesifikasi: JSON.stringify({
        'Daya Output': '600W total',
        'Channel': '5.1 ch (Soundbar + Subwoofer + Wireless Rear Speakers)',
        'Konektivitas': 'HDMI ARC, Optical, Analog, Bluetooth',
        'Fitur': 'Dolby Digital, Wireless Amplifier untuk speaker belakang'
      }),
      harga: 4299000,
      stok: 9,
      isActive: true,
      categoryId: catSoundbar.id,
      imageUrl: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Insert products
  for (const product of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        nama: product.nama,
        slug: product.slug,
        deskripsi: product.deskripsi,
        spesifikasi: product.spesifikasi,
        harga: product.harga,
        stok: product.stok,
        isActive: product.isActive,
        categoryId: product.categoryId,
        images: {
          create: [
            { url: product.imageUrl, urutan: 0 }
          ]
        }
      }
    });
    console.log(`- Product created: "${createdProduct.nama}"`);
  }

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
