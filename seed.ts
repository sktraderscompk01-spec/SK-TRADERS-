import { db, pool } from "@/db";
import {
  storeSettings,
  categories,
  products,
  promotionalBanners,
  orders,
  reviews,
} from "@/db/schema";
import { count } from "drizzle-orm";

let initialized = false;

export async function ensureSeeded() {
  if (initialized) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        id SERIAL PRIMARY KEY,
        store_name TEXT NOT NULL DEFAULT 'MAISON ÉCLAT',
        store_tagline TEXT NOT NULL DEFAULT 'Haute Cosmétique & Botanical Skincare • Paris',
        logo_url TEXT DEFAULT '',
        hero_badge TEXT NOT NULL DEFAULT 'L''ÉDITION ROSE OR • NEW COLLECTION',
        hero_title TEXT NOT NULL DEFAULT 'Luminous Botanical Luxury for Modern Skin',
        hero_subtitle TEXT NOT NULL DEFAULT 'Formulated in our Parisian laboratory with cold-pressed Damask rose, 24K bio-available gold peptides, and pure silk amino acids for weightless radiance.',
        hero_image_url TEXT NOT NULL DEFAULT '/images/hero-cosmetics.jpg',
        whatsapp_number TEXT NOT NULL DEFAULT '+923001234567',
        support_email TEXT NOT NULL DEFAULT 'concierge@maisoneclat.com',
        support_phone TEXT NOT NULL DEFAULT '+92 300 1234567',
        store_address TEXT NOT NULL DEFAULT '24 Rue du Faubourg Saint-Honoré, Paris & Gulberg III Luxury Galleria',
        currency_symbol TEXT NOT NULL DEFAULT '$',
        free_shipping_threshold NUMERIC(10, 2) NOT NULL DEFAULT 120.00,
        shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 12.00,
        bank_name TEXT NOT NULL DEFAULT 'Standard Chartered / Meezan Premier Bank',
        bank_account_title TEXT NOT NULL DEFAULT 'MAISON ECLAT COSMETICS PVT LTD',
        bank_account_number TEXT NOT NULL DEFAULT '0102-8849201-77',
        bank_iban TEXT NOT NULL DEFAULT 'PK36SCBL0000001028849201',
        jazz_cash_number TEXT NOT NULL DEFAULT '0300-1234567',
        jazz_cash_title TEXT NOT NULL DEFAULT 'Maison Éclat Official',
        easy_paisa_number TEXT NOT NULL DEFAULT '0345-9876543',
        easy_paisa_title TEXT NOT NULL DEFAULT 'Maison Éclat Official',
        payment_instructions TEXT NOT NULL DEFAULT 'For Bank Transfer, JazzCash, or EasyPaisa orders, please transfer the exact order total to the account details above and share your payment screenshot on our official WhatsApp right after clicking Confirm Order via WhatsApp. Cash on Delivery (COD) is also available nationwide.',
        instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com/maisoneclat.beaute',
        instagram_handle TEXT NOT NULL DEFAULT '@maisoneclat.beaute',
        facebook_url TEXT NOT NULL DEFAULT 'https://facebook.com/maisoneclat.beaute',
        about_title TEXT NOT NULL DEFAULT 'Where Parisian Botanical Science Meets Pure Sensorial Artistry',
        about_story TEXT NOT NULL DEFAULT 'Founded with a devotion to clean, high-performance luxury, Maison Éclat blends rare botanical cellular extracts with modern dermatological science. Every serum, velvet lip pigment, and artisanal Eau de Parfum is cruelty-free, paraben-free, and sustainably housed in recyclable frosted glass and brushed champagne gold vessels.',
        delivery_info TEXT NOT NULL DEFAULT 'Complimentary luxury gift-wrapped express shipping on all orders over $120. Standard nationwide & international courier dispatch within 24 hours. Every order includes two complimentary luxury sample vials in a signature silk pouch.',
        return_policy TEXT NOT NULL DEFAULT 'We stand behind our formulations with a 14-Day Radiance Guarantee. Unopened or gently tested products eligible for exchange or store credit within 14 days of delivery. Damaged items in transit are replaced immediately free of charge.',
        admin_username TEXT NOT NULL DEFAULT 'admin',
        admin_password TEXT NOT NULL DEFAULT 'admin123',
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        sku TEXT NOT NULL,
        category TEXT NOT NULL,
        short_description TEXT NOT NULL,
        description TEXT NOT NULL,
        details TEXT NOT NULL,
        original_price NUMERIC(10, 2) NOT NULL,
        discounted_price NUMERIC(10, 2),
        stock_count INTEGER NOT NULL DEFAULT 25,
        in_stock BOOLEAN NOT NULL DEFAULT TRUE,
        image_url TEXT NOT NULL,
        gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
        is_featured BOOLEAN NOT NULL DEFAULT FALSE,
        is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
        is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
        is_special_offer BOOLEAN NOT NULL DEFAULT FALSE,
        rating NUMERIC(3, 2) NOT NULL DEFAULT 4.90,
        review_count INTEGER NOT NULL DEFAULT 24,
        volume_or_weight TEXT NOT NULL DEFAULT '50 ml / 1.7 fl. oz.',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS promotional_banners (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        badge_text TEXT NOT NULL DEFAULT 'LIMITED TIME PRIVILEGE',
        discount_code TEXT DEFAULT 'ECLAT20',
        cta_text TEXT NOT NULL DEFAULT 'Shop The Edit',
        cta_link TEXT NOT NULL DEFAULT '#catalog',
        image_url TEXT NOT NULL DEFAULT '/images/editorial-story.jpg',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT DEFAULT '',
        delivery_address TEXT NOT NULL,
        city TEXT NOT NULL DEFAULT '',
        order_notes TEXT DEFAULT '',
        payment_method TEXT NOT NULL DEFAULT 'Bank Transfer',
        payment_reference TEXT DEFAULT '',
        items JSONB NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        total_amount NUMERIC(10, 2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        whatsapp_dispatched BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER,
        product_name TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_location TEXT NOT NULL DEFAULT 'Paris, France',
        rating INTEGER NOT NULL DEFAULT 5,
        title TEXT NOT NULL,
        comment TEXT NOT NULL,
        verified_purchase BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT DEFAULT '',
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const [{ value: settingsCount }] = await db
      .select({ value: count() })
      .from(storeSettings);
    if (settingsCount === 0) {
      await db.insert(storeSettings).values({
        storeName: "MAISON ÉCLAT",
        storeTagline: "Haute Cosmétique & Botanical Skincare • Paris",
        logoUrl: "",
        heroBadge: "L'ÉDITION ROSE OR • NEW COLLECTION",
        heroTitle: "Luminous Botanical Luxury for Modern Skin",
        heroSubtitle:
          "Formulated in our Parisian laboratory with cold-pressed Damask rose, 24K bio-available gold peptides, and pure silk amino acids for weightless radiance.",
        heroImageUrl: "/images/hero-cosmetics.jpg",
        whatsappNumber: "+923001234567",
        supportEmail: "concierge@maisoneclat.com",
        supportPhone: "+92 300 1234567",
        storeAddress:
          "24 Rue du Faubourg Saint-Honoré, Paris & Gulberg III Luxury Galleria",
        currencySymbol: "$",
        freeShippingThreshold: "120.00",
        shippingFee: "12.00",
        bankName: "Standard Chartered / Meezan Premier Bank",
        bankAccountTitle: "MAISON ECLAT COSMETICS PVT LTD",
        bankAccountNumber: "0102-8849201-77",
        bankIban: "PK36SCBL0000001028849201",
        jazzCashNumber: "0300-1234567",
        jazzCashTitle: "Maison Éclat Official",
        easyPaisaNumber: "0345-9876543",
        easyPaisaTitle: "Maison Éclat Official",
        paymentInstructions:
          "For Bank Transfer, JazzCash, or EasyPaisa orders, please transfer the exact order total to the account details above and share your payment screenshot on our official WhatsApp right after clicking 'Confirm Order via WhatsApp'. Cash on Delivery (COD) is also available nationwide.",
        instagramUrl: "https://instagram.com/maisoneclat.beaute",
        instagramHandle: "@maisoneclat.beaute",
        facebookUrl: "https://facebook.com/maisoneclat.beaute",
      });
    }

    const [{ value: categoryCount }] = await db
      .select({ value: count() })
      .from(categories);
    if (categoryCount === 0) {
      await db.insert(categories).values([
        {
          name: "Skincare",
          slug: "skincare",
          description: "Cellular serums, golden elixirs & deep barrier creams",
          imageUrl: "/images/product-serum.jpg",
          displayOrder: 1,
        },
        {
          name: "Makeup",
          slug: "makeup",
          description: "Luminous silk foundations, blush & champagne highlighters",
          imageUrl: "/images/product-foundation.jpg",
          displayOrder: 2,
        },
        {
          name: "Lipsticks",
          slug: "lipsticks",
          description: "Couture velvet matte & satin-balm lip pigments",
          imageUrl: "/images/product-lipstick.jpg",
          displayOrder: 3,
        },
        {
          name: "Perfumes",
          slug: "perfumes",
          description: "Artisanal French Extraits & Eau de Parfum",
          imageUrl: "/images/product-perfume.jpg",
          displayOrder: 4,
        },
        {
          name: "Face Wash",
          slug: "face-wash",
          description: "pH-balanced botanical micellar gels & foaming cleansers",
          imageUrl: "/images/product-facewash.jpg",
          displayOrder: 5,
        },
        {
          name: "Beauty Products",
          slug: "beauty-products",
          description: "Dewy setting mists, pearl sleeping masks & radiance treatments",
          imageUrl: "/images/product-beauty.jpg",
          displayOrder: 6,
        },
        {
          name: "Hair Care",
          slug: "hair-care",
          description: "Pure Moroccan argan elixirs & silk keratin masques",
          imageUrl: "/images/product-haircare.jpg",
          displayOrder: 7,
        },
        {
          name: "Accessories",
          slug: "accessories",
          description: "Vegan artisan kabuki brushes & Rose Quartz Gua Sha tools",
          imageUrl: "/images/product-accessories.jpg",
          displayOrder: 8,
        },
      ]);
    }

    const [{ value: productCount }] = await db
      .select({ value: count() })
      .from(products);
    if (productCount === 0) {
      await db.insert(products).values([
        {
          name: "L'Or de Rose 24K Cellular Radiance Serum",
          slug: "lor-de-rose-24k-cellular-radiance-serum",
          sku: "ECL-SKN-001",
          category: "Skincare",
          shortDescription:
            "Bio-fermented Damask rose stem cells suspended with 24K gold peptides and triple-weight hyaluronic acid.",
          description:
            "Our iconic #1 bestselling elixir delivers instant glass-skin luminosity while visibly firming fine lines over 14 days. Cold-pressed Rosa Damascena oil micro-pearls burst on contact with skin, fusing botanical moisture with clinical-grade niacinamide and tri-peptides.",
          details:
            "Key Actives: Rosa Damascena Cellular Extract (12%), 24K Colloidal Gold Peptides, Multi-Molecular Hyaluronic Acid, Squalane.\nHow to Use: Warm 3–4 drops between fingertips and press gently into damp face and neck morning and night.\nSkin Types: All skin types, including sensitive and rosacea-prone.",
          originalPrice: "98.00",
          discountedPrice: "78.00",
          stockCount: 42,
          inStock: true,
          imageUrl: "/images/product-serum.jpg",
          galleryImages: [
            "/images/product-serum.jpg",
            "/images/hero-cosmetics.jpg",
          ],
          isFeatured: true,
          isBestSeller: true,
          isNewArrival: false,
          isSpecialOffer: true,
          rating: "4.98",
          reviewCount: 164,
          volumeOrWeight: "30 ml / 1.0 fl. oz.",
        },
        {
          name: "Rouge Velours Couture Matte Lipstick — 04 Rose Impérial",
          slug: "rouge-velours-couture-matte-lipstick-rose-imperial",
          sku: "ECL-LIP-004",
          category: "Lipsticks",
          shortDescription:
            "Weightless Cashmere-Matte couture lip color infused with French camellia oil and hyaluronic spheres.",
          description:
            "Housed in a refillable brushed champagne-gold fluted metal case, Rouge Velours glides on like molten silk and sets to a plush, non-drying blurred-velvet finish that lasts up to 12 hours without feathering.",
          details:
            "Shade: 04 Rose Impérial (Warm Neutral Rosewood Pink).\nKey Ingredients: Organic Camellia Japonica Seed Oil, Shea Butter Unsaponifiables, Hyaluronic Filling Spheres.\nFinish: Plush Cashmere Matte • Cruelty-Free & Vegan.",
          originalPrice: "48.00",
          discountedPrice: "39.00",
          stockCount: 68,
          inStock: true,
          imageUrl: "/images/product-lipstick.jpg",
          galleryImages: [
            "/images/product-lipstick.jpg",
            "/images/hero-cosmetics.jpg",
          ],
          isFeatured: true,
          isBestSeller: true,
          isNewArrival: true,
          isSpecialOffer: false,
          rating: "4.95",
          reviewCount: 129,
          volumeOrWeight: "3.8 g / 0.13 oz.",
        },
        {
          name: "Fleur d'Ambre & Soie Eau de Parfum",
          slug: "fleur-dambre-et-soie-eau-de-parfum",
          sku: "ECL-PRF-001",
          category: "Perfumes",
          shortDescription:
            "An intoxicating Parisian trail of Grasse May Rose, sun-warmed white amber, Madagascar vanilla bean, and cashmere musk.",
          description:
            "Composed by master perfumers in Grasse using 28% pure parfum concentration. Opens with sparkling Calabrian bergamot and pink peppercorn before melting into a sensual heart of Turkish rose absolute, jasmine sambac, and golden amber.",
          details:
            "Top Notes: Bergamot, Pink Pepper, White Peach.\nHeart Notes: Grasse Centifolia Rose, Jasmine Sambac, Iris Butter.\nBase Notes: White Amber, Cashmere Wood, Madagascar Vanilla, Skin Musk.\nLongevity: 10–14 Hours.",
          originalPrice: "165.00",
          discountedPrice: "135.00",
          stockCount: 19,
          inStock: true,
          imageUrl: "/images/product-perfume.jpg",
          galleryImages: [
            "/images/product-perfume.jpg",
            "/images/editorial-story.jpg",
          ],
          isFeatured: true,
          isBestSeller: true,
          isNewArrival: false,
          isSpecialOffer: true,
          rating: "4.97",
          reviewCount: 92,
          volumeOrWeight: "100 ml / 3.4 fl. oz.",
        },
        {
          name: "Teint Lumière Silk Serum Foundation SPF 30",
          slug: "teint-lumiere-silk-serum-foundation",
          sku: "ECL-MKP-001",
          category: "Makeup",
          shortDescription:
            "82% skincare-base foundation delivering buildable second-skin coverage and a soft-focus lit-from-within glow.",
          description:
            "Formulated with light-diffusing rose quartz micro-prisms and botanical squalane, Teint Lumière blurs pores and redness seamlessly without settling into fine lines. Breathable, humidity-resistant, and enriched with mineral SPF 30.",
          details:
            "Coverage: Medium Buildable • Finish: Natural Satin Radiance.\nKey Actives: 5% Niacinamide, Plant Squalane, Rosehip Seed Extract.\nNon-comedogenic, fragrance-free, dermatologist-tested.",
          originalPrice: "68.00",
          discountedPrice: "56.00",
          stockCount: 54,
          inStock: true,
          imageUrl: "/images/product-foundation.jpg",
          galleryImages: [
            "/images/product-foundation.jpg",
            "/images/hero-cosmetics.jpg",
          ],
          isFeatured: true,
          isBestSeller: false,
          isNewArrival: true,
          isSpecialOffer: false,
          rating: "4.92",
          reviewCount: 78,
          volumeOrWeight: "30 ml / 1.0 fl. oz.",
        },
        {
          name: "Gelée de Camélia Purifying Botanical Face Wash",
          slug: "gelee-de-camelia-purifying-face-wash",
          sku: "ECL-FCW-001",
          category: "Face Wash",
          shortDescription:
            "Sulfate-free rosewater & white camellia cloud cleanser that melts away waterproof makeup while respecting skin's pH 5.5 barrier.",
          description:
            "A silky botanical gel that transforms into a cushiony micro-foam upon contact with water. Infused with organic French rose hydrosol, chamomile, and pro-vitamin B5 to leave skin baby-soft, calm, and thoroughly purified without tightness.",
          details:
            "Key Ingredients: Organic Rosa Centifolia Hydrosol, White Camellia Extract, Panthenol (Vitamin B5), Oat Amino Acids.\nFree From: SLS/SLES, Parabens, Synthetic Dyes, Drying Alcohols.",
          originalPrice: "44.00",
          discountedPrice: "36.00",
          stockCount: 80,
          inStock: true,
          imageUrl: "/images/product-facewash.jpg",
          galleryImages: ["/images/product-facewash.jpg"],
          isFeatured: false,
          isBestSeller: true,
          isNewArrival: false,
          isSpecialOffer: true,
          rating: "4.94",
          reviewCount: 112,
          volumeOrWeight: "150 ml / 5.0 fl. oz.",
        },
        {
          name: "Élixir d'Argan & Kératine Impériale Hair Oil",
          slug: "elixir-dargan-et-keratine-hair-oil",
          sku: "ECL-HRC-001",
          category: "Hair Care",
          shortDescription:
            "Cold-pressed Moroccan argan, abyssinian oil & biomimetic silk proteins for mirror-like shine and 450°F heat protection.",
          description:
            "Instantly seals split ends, tames frizz for 72 hours, and infuses strands with our signature delicate rose-amber veil. Ultra-lightweight dry oil absorbs rapidly without weighing down fine hair.",
          details:
            "Key Actives: Cold-Pressed Argania Spinosa Kernel Oil, Hydrolyzed Silk Keratin, Vitamin E Tocopherol.\nUse on damp hair before blow-drying or smoothed over dry ends for glass-hair brilliance.",
          originalPrice: "62.00",
          discountedPrice: "49.00",
          stockCount: 37,
          inStock: true,
          imageUrl: "/images/product-haircare.jpg",
          galleryImages: ["/images/product-haircare.jpg"],
          isFeatured: false,
          isBestSeller: false,
          isNewArrival: true,
          isSpecialOffer: true,
          rating: "4.91",
          reviewCount: 64,
          volumeOrWeight: "75 ml / 2.5 fl. oz.",
        },
        {
          name: "Brume Nacrée Rose-Gold Illuminating Setting Mist",
          slug: "brume-nacree-rose-gold-setting-mist",
          sku: "ECL-BTY-001",
          category: "Beauty Products",
          shortDescription:
            "Micro-fine champagne pearl hydrating mist that locks makeup in place for 16 hours while imparting a dewy glass-skin sheen.",
          description:
            "Shake to awaken a mesmerizing swirl of pearlescent rose-gold minerals, electrolyte birch sap, and snow mushroom extract. Use as a priming mist, setting spray, or midday radiance refresher.",
          details:
            "Key Actives: Tremella Fuciformis (Snow Mushroom), Damask Rose Water, Champagne Mica Micro-Pearls.\nAlcohol-free formula prevents makeup caking or oxidation.",
          originalPrice: "52.00",
          discountedPrice: "42.00",
          stockCount: 45,
          inStock: true,
          imageUrl: "/images/product-beauty.jpg",
          galleryImages: ["/images/product-beauty.jpg"],
          isFeatured: true,
          isBestSeller: false,
          isNewArrival: true,
          isSpecialOffer: false,
          rating: "4.96",
          reviewCount: 83,
          volumeOrWeight: "100 ml / 3.4 fl. oz.",
        },
        {
          name: "L'Atelier Rose Quartz Gua Sha & Artisan Brush Ritual Set",
          slug: "latelier-rose-quartz-gua-sha-and-brush-set",
          sku: "ECL-ACC-001",
          category: "Accessories",
          shortDescription:
            "Five hand-sculpted vegan Cashmere-Taklon brushes in 18K champagne-gold ferrules paired with a Brazilian Rose Quartz Gua Sha.",
          description:
            "Designed in collaboration with Parisian runway makeup artists. Ultra-dense synthetic bristles mimic natural squirrel hair for streak-free cream and powder blending, accompanied by a hand-carved cooling rose quartz stone for lymphatic sculpting.",
          details:
            "Includes: Foundation Buffing Brush, Angled Cheek Sculptor, Setting Powder Dome, Eye Blender, Lip Precision Brush, Grade-A Brazilian Rose Quartz Gua Sha, and Silk Travel Clutch.",
          originalPrice: "115.00",
          discountedPrice: "89.00",
          stockCount: 28,
          inStock: true,
          imageUrl: "/images/product-accessories.jpg",
          galleryImages: ["/images/product-accessories.jpg"],
          isFeatured: true,
          isBestSeller: true,
          isNewArrival: false,
          isSpecialOffer: true,
          rating: "4.99",
          reviewCount: 141,
          volumeOrWeight: "6-Piece Couture Set",
        },
        {
          name: "Palette Soleil Champagne Highlighter & Silk Blush Duo",
          slug: "palette-soleil-champagne-highlighter-blush-duo",
          sku: "ECL-MKP-002",
          category: "Makeup",
          shortDescription:
            "Baked gel-powder cheek wardrobe pairing a soft petal-pink silk blush with a molten champagne-gold luminizer.",
          description:
            "Our slurry-baked formula begins as a liquid cream and is slow-baked on terracotta tiles for 24 hours, creating an ultra-buttery weightless powder that melts into cheekbones without emphasizing texture.",
          details:
            "Shades: Rose Pétale (Soft Warm Pink) + Or Champagne (Gilded Pearl).\nEncased in a mirrored brushed gold compact with magnetic closure.",
          originalPrice: "64.00",
          discountedPrice: "54.00",
          stockCount: 33,
          inStock: true,
          imageUrl: "/images/product-foundation.jpg",
          galleryImages: ["/images/product-foundation.jpg"],
          isFeatured: false,
          isBestSeller: true,
          isNewArrival: true,
          isSpecialOffer: false,
          rating: "4.93",
          reviewCount: 57,
          volumeOrWeight: "10 g / 0.35 oz.",
        },
        {
          name: "Baume de Nuit Perle Impériale Overnight Glow Mask",
          slug: "baume-de-nuit-perle-imperiale-mask",
          sku: "ECL-BTY-002",
          category: "Beauty Products",
          shortDescription:
            "Whipped ceramide & freshwater pearl amino acid sleeping mask for visibly plumped, rested morning skin.",
          description:
            "Works in synergy with skin's nocturnal repair cycle. Bio-identical ceramides NP, AP, and EOP rebuild the moisture barrier while gentle polyhydroxy acids (PHA) resurface dullness overnight.",
          details:
            "Includes a weighted gold-plated application spatula.\nKey Actives: Triple Ceramide Complex, Pearl Conchiolin Protein, 4% Gluconolactone PHA, Centella Asiatica.",
          originalPrice: "86.00",
          discountedPrice: "69.00",
          stockCount: 22,
          inStock: true,
          imageUrl: "/images/product-beauty.jpg",
          galleryImages: ["/images/product-beauty.jpg"],
          isFeatured: false,
          isBestSeller: false,
          isNewArrival: true,
          isSpecialOffer: true,
          rating: "4.95",
          reviewCount: 49,
          volumeOrWeight: "50 ml / 1.7 fl. oz.",
        },
        {
          name: "Baume Lèvres Satin — 01 Nude Cachemire",
          slug: "baume-levres-satin-nude-cachemire",
          sku: "ECL-LIP-002",
          category: "Lipsticks",
          shortDescription:
            "Tinted plumping peptide lip fondant delivering mirror-gloss cushion and 24-hour botanical hydration.",
          description:
            "Part treatment, part couture color. Tripeptide-1 visibly boosts lip fullness while wild mango butter and sweet almond oil cocoon dry lips in a universally flattering warm Parisian rose-nude.",
          details:
            "Shade: 01 Nude Cachemire (Warm Caramel Rose Nude).\nKey Ingredients: Palmitoyl Tripeptide-1, Wild Mango Butter, Rosehip Oil.",
          originalPrice: "42.00",
          discountedPrice: null,
          stockCount: 61,
          inStock: true,
          imageUrl: "/images/product-lipstick.jpg",
          galleryImages: ["/images/product-lipstick.jpg"],
          isFeatured: false,
          isBestSeller: false,
          isNewArrival: true,
          isSpecialOffer: false,
          rating: "4.89",
          reviewCount: 44,
          volumeOrWeight: "3.5 g / 0.12 oz.",
        },
        {
          name: "Masque Capillaire Soie Royale Deep Repair Hair Masque",
          slug: "masque-capillaire-soie-royale-hair-masque",
          sku: "ECL-HRC-002",
          category: "Hair Care",
          shortDescription:
            "Intensive weekly couture hair treatment that reconstructs damaged bonds in 5 minutes.",
          description:
            "Rich cashmere-cream texture enriched with hydrolyzed silk, cold-pressed camellia oil, and biotin repairs color-treated and heat-styled hair from cortex to cuticle.",
          details:
            "Safe for keratin-treated and color-treated hair. Delicately scented with our signature Rose & White Amber accord.",
          originalPrice: "58.00",
          discountedPrice: "46.00",
          stockCount: 30,
          inStock: true,
          imageUrl: "/images/product-haircare.jpg",
          galleryImages: ["/images/product-haircare.jpg"],
          isFeatured: false,
          isBestSeller: false,
          isNewArrival: false,
          isSpecialOffer: true,
          rating: "4.90",
          reviewCount: 38,
          volumeOrWeight: "200 ml / 6.7 fl. oz.",
        },
      ]);
    }

    const [{ value: bannerCount }] = await db
      .select({ value: count() })
      .from(promotionalBanners);
    if (bannerCount === 0) {
      await db.insert(promotionalBanners).values([
        {
          title: "The Parisian Rose-Or Gift Suite — Up to 25% Off",
          subtitle:
            "Experience our award-winning 24K Cellular Serum, Couture Velvet Lipsticks & French Eau de Parfum with complimentary luxury gift wrapping and express WhatsApp concierge checkout.",
          badgeText: "SEASONAL ATELIER PRIVILEGE",
          discountCode: "ROSEOR25",
          ctaText: "Explore Special Offers",
          ctaLink: "#special-offers",
          imageUrl: "/images/editorial-story.jpg",
          isActive: true,
        },
      ]);
    }

    const [{ value: reviewCount }] = await db
      .select({ value: count() })
      .from(reviews);
    if (reviewCount === 0) {
      await db.insert(reviews).values([
        {
          productId: 1,
          productName: "L'Or de Rose 24K Cellular Radiance Serum",
          customerName: "Camille Laurent",
          customerLocation: "Paris, France",
          rating: 5,
          title: "Unmatched Glass-Skin Glow Within One Week",
          comment:
            "I have tried every luxury serum from Place Vendôme boutiques, and L'Or de Rose truly outperforms them all. My skin drinks it in immediately and looks luminous even without foundation.",
          verifiedPurchase: true,
        },
        {
          productId: 2,
          productName: "Rouge Velours Couture Matte Lipstick — 04 Rose Impérial",
          customerName: "Ayesha Sikandar",
          customerLocation: "Lahore, Pakistan",
          rating: 5,
          title: "The Most Flattering Rosewood Shade & Instant WhatsApp Delivery!",
          comment:
            "Ordered directly via WhatsApp and paid through Meezan Bank transfer. Received my parcel in a gorgeous silk-ribbon box the very next afternoon. The lipstick case feels like solid jewelry!",
          verifiedPurchase: true,
        },
        {
          productId: 3,
          productName: "Fleur d'Ambre & Soie Eau de Parfum",
          customerName: "Sophia Al-Mansoor",
          customerLocation: "Dubai, UAE",
          rating: 5,
          title: "Compliments Everywhere I Walk",
          comment:
            "A breathtaking blend of fresh Damask rose and warm golden amber that lingers on silk scarves for days. Packaging and bottle weight are pure haute parfumerie.",
          verifiedPurchase: true,
        },
        {
          productId: 8,
          productName: "L'Atelier Rose Quartz Gua Sha & Artisan Brush Ritual Set",
          customerName: "Zara Ahmed",
          customerLocation: "Karachi, Pakistan",
          rating: 5,
          title: "Cloud-Soft Brushes & Genuine Cooling Rose Quartz",
          comment:
            "Zero shedding and blends my serum foundation in seconds. The Gua Sha stone is heavy, authentic Brazilian rose quartz. Worth every single penny.",
          verifiedPurchase: true,
        },
      ]);
    }

    const [{ value: orderCount }] = await db
      .select({ value: count() })
      .from(orders);
    if (orderCount === 0) {
      await db.insert(orders).values([
        {
          orderNumber: "ECL-90412",
          customerName: "Mahnoor Tariq",
          customerPhone: "+92 321 4459821",
          customerEmail: "mahnoor.t@example.com",
          deliveryAddress: "House 48-B, Main Boulevard, Phase 6 DHA",
          city: "Lahore",
          orderNotes: "Please include a gift note: Happy Anniversary!",
          paymentMethod: "Bank Transfer",
          paymentReference: "SCBL-TXN-88412",
          items: [
            {
              productId: 1,
              name: "L'Or de Rose 24K Cellular Radiance Serum",
              price: 78,
              originalPrice: 98,
              quantity: 1,
              imageUrl: "/images/product-serum.jpg",
              category: "Skincare",
              sku: "ECL-SKN-001",
            },
            {
              productId: 2,
              name: "Rouge Velours Couture Matte Lipstick — 04 Rose Impérial",
              price: 39,
              originalPrice: 48,
              quantity: 1,
              imageUrl: "/images/product-lipstick.jpg",
              category: "Lipsticks",
              sku: "ECL-LIP-004",
            },
          ],
          subtotal: "117.00",
          shippingFee: "12.00",
          totalAmount: "129.00",
          status: "Confirmed",
          whatsappDispatched: true,
        },
        {
          orderNumber: "ECL-90418",
          customerName: "Elena Rostova",
          customerPhone: "+92 300 8821940",
          customerEmail: "elena.r@example.com",
          deliveryAddress: "Apartment 14C, Clifton Block 4, Sea View Road",
          city: "Karachi",
          orderNotes: "Call before arrival at reception.",
          paymentMethod: "JazzCash",
          paymentReference: "JC-9920144",
          items: [
            {
              productId: 3,
              name: "Fleur d'Ambre & Soie Eau de Parfum",
              price: 135,
              originalPrice: 165,
              quantity: 1,
              imageUrl: "/images/product-perfume.jpg",
              category: "Perfumes",
              sku: "ECL-PRF-001",
            },
          ],
          subtotal: "135.00",
          shippingFee: "0.00",
          totalAmount: "135.00",
          status: "Pending",
          whatsappDispatched: true,
        },
      ]);
    }

    initialized = true;
  } catch (error) {
    console.error("Database initialization/seed error:", error);
  }
}
