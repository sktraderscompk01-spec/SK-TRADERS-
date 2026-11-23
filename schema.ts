import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  imageUrl: string;
  category: string;
  sku?: string;
}

export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").notNull().default("MAISON ÉCLAT"),
  storeTagline: text("store_tagline")
    .notNull()
    .default("Haute Cosmétique & Botanical Skincare • Paris"),
  logoUrl: text("logo_url").default(""),
  heroBadge: text("hero_badge")
    .notNull()
    .default("L'ÉDITION ROSE OR • NEW COLLECTION"),
  heroTitle: text("hero_title")
    .notNull()
    .default("Luminous Botanical Luxury for Modern Skin"),
  heroSubtitle: text("hero_subtitle")
    .notNull()
    .default(
      "Formulated in our Parisian laboratory with cold-pressed Damask rose, 24K bio-available gold peptides, and pure silk amino acids for weightless radiance."
    ),
  heroImageUrl: text("hero_image_url")
    .notNull()
    .default("/images/hero-cosmetics.jpg"),
  whatsappNumber: text("whatsapp_number").notNull().default("+923001234567"),
  supportEmail: text("support_email")
    .notNull()
    .default("concierge@maisoneclat.com"),
  supportPhone: text("support_phone").notNull().default("+92 300 1234567"),
  storeAddress: text("store_address")
    .notNull()
    .default("24 Rue du Faubourg Saint-Honoré, Paris & Gulberg III Luxury Galleria"),
  currencySymbol: text("currency_symbol").notNull().default("$"),
  freeShippingThreshold: numeric("free_shipping_threshold", {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default("120.00"),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 })
    .notNull()
    .default("12.00"),
  bankName: text("bank_name")
    .notNull()
    .default("Standard Chartered / Meezan Premier Bank"),
  bankAccountTitle: text("bank_account_title")
    .notNull()
    .default("MAISON ECLAT COSMETICS PVT LTD"),
  bankAccountNumber: text("bank_account_number")
    .notNull()
    .default("0102-8849201-77"),
  bankIban: text("bank_iban")
    .notNull()
    .default("PK36SCBL0000001028849201"),
  jazzCashNumber: text("jazz_cash_number").notNull().default("0300-1234567"),
  jazzCashTitle: text("jazz_cash_title")
    .notNull()
    .default("Maison Éclat Official"),
  easyPaisaNumber: text("easy_paisa_number").notNull().default("0345-9876543"),
  easyPaisaTitle: text("easy_paisa_title")
    .notNull()
    .default("Maison Éclat Official"),
  paymentInstructions: text("payment_instructions")
    .notNull()
    .default(
      "For Bank Transfer, JazzCash, or EasyPaisa orders, please transfer the exact order total to the account details above and share your payment screenshot on our official WhatsApp right after clicking 'Confirm Order via WhatsApp'. Cash on Delivery (COD) is also available nationwide."
    ),
  instagramUrl: text("instagram_url")
    .notNull()
    .default("https://instagram.com/maisoneclat.beaute"),
  instagramHandle: text("instagram_handle")
    .notNull()
    .default("@maisoneclat.beaute"),
  facebookUrl: text("facebook_url")
    .notNull()
    .default("https://facebook.com/maisoneclat.beaute"),
  aboutTitle: text("about_title")
    .notNull()
    .default("Where Parisian Botanical Science Meets Pure Sensorial Artistry"),
  aboutStory: text("about_story")
    .notNull()
    .default(
      "Founded with a devotion to clean, high-performance luxury, Maison Éclat blends rare botanical cellular extracts with modern dermatological science. Every serum, velvet lip pigment, and artisanal Eau de Parfum is cruelty-free, paraben-free, and sustainably housed in recyclable frosted glass and brushed champagne gold vessels."
    ),
  deliveryInfo: text("delivery_info")
    .notNull()
    .default(
      "Complimentary luxury gift-wrapped express shipping on all orders over $120. Standard nationwide & international courier dispatch within 24 hours. Every order includes two complimentary luxury sample vials in a signature silk pouch."
    ),
  returnPolicy: text("return_policy")
    .notNull()
    .default(
      "We stand behind our formulations with a 14-Day Radiance Guarantee. Unopened or gently tested products eligible for exchange or store credit within 14 days of delivery. Damaged items in transit are replaced immediately free of charge."
    ),
  adminUsername: text("admin_username").notNull().default("admin"),
  adminPassword: text("admin_password").notNull().default("admin123"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sku: text("sku").notNull(),
  category: text("category").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  details: text("details").notNull(),
  originalPrice: numeric("original_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  discountedPrice: numeric("discounted_price", {
    precision: 10,
    scale: 2,
  }),
  stockCount: integer("stock_count").notNull().default(25),
  inStock: boolean("in_stock").notNull().default(true),
  imageUrl: text("image_url").notNull(),
  galleryImages: jsonb("gallery_images").$type<string[]>().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  isBestSeller: boolean("is_best_seller").notNull().default(false),
  isNewArrival: boolean("is_new_arrival").notNull().default(false),
  isSpecialOffer: boolean("is_special_offer").notNull().default(false),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("4.90"),
  reviewCount: integer("review_count").notNull().default(24),
  volumeOrWeight: text("volume_or_weight").notNull().default("50 ml / 1.7 fl. oz."),
  createdAt: timestamp("created_at").defaultNow(),
});

export const promotionalBanners = pgTable("promotional_banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  badgeText: text("badge_text").notNull().default("LIMITED TIME PRIVILEGE"),
  discountCode: text("discount_code").default("ECLAT20"),
  ctaText: text("cta_text").notNull().default("Shop The Edit"),
  ctaLink: text("cta_link").notNull().default("#catalog"),
  imageUrl: text("image_url")
    .notNull()
    .default("/images/editorial-story.jpg"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").default(""),
  deliveryAddress: text("delivery_address").notNull(),
  city: text("city").notNull().default(""),
  orderNotes: text("order_notes").default(""),
  paymentMethod: text("payment_method").notNull().default("Bank Transfer"),
  paymentReference: text("payment_reference").default(""),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("Pending"),
  whatsappDispatched: boolean("whatsapp_dispatched").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
  productName: text("product_name").notNull(),
  customerName: text("customer_name").notNull(),
  customerLocation: text("customer_location").notNull().default("Paris, France"),
  rating: integer("rating").notNull().default(5),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  verifiedPurchase: boolean("verified_purchase").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").default(""),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
