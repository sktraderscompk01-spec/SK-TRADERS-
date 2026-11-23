export interface StoreSettingsData {
  id: number;
  storeName: string;
  storeTagline: string;
  logoUrl: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  whatsappNumber: string;
  supportEmail: string;
  supportPhone: string;
  storeAddress: string;
  currencySymbol: string;
  freeShippingThreshold: string;
  shippingFee: string;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  bankIban: string;
  jazzCashNumber: string;
  jazzCashTitle: string;
  easyPaisaNumber: string;
  easyPaisaTitle: string;
  paymentInstructions: string;
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
  aboutTitle: string;
  aboutStory: string;
  deliveryInfo: string;
  returnPolicy: string;
  adminUsername: string;
}

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
}

export interface ProductData {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: string;
  shortDescription: string;
  description: string;
  details: string;
  originalPrice: string;
  discountedPrice: string | null;
  stockCount: number;
  inStock: boolean;
  imageUrl: string;
  galleryImages: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isSpecialOffer: boolean;
  rating: string;
  reviewCount: number;
  volumeOrWeight: string;
}

export interface PromotionalBannerData {
  id: number;
  title: string;
  subtitle: string;
  badgeText: string;
  discountCode: string | null;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  isActive: boolean;
}

export interface CartItem {
  product: ProductData;
  quantity: number;
}

export interface OrderItemData {
  productId: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  imageUrl: string;
  category: string;
  sku?: string;
}

export interface OrderData {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  city: string;
  orderNotes: string;
  paymentMethod: string;
  paymentReference: string;
  items: OrderItemData[];
  subtotal: string;
  shippingFee: string;
  totalAmount: string;
  status: string;
  whatsappDispatched: boolean;
  createdAt: string;
}

export interface ReviewData {
  id: number;
  productId: number | null;
  productName: string;
  customerName: string;
  customerLocation: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export function cleanWhatsAppDigits(raw: string): string {
  const digits = (raw || "").replace(/[^0-9]/g, "");
  return digits || "923001234567";
}

export function getEffectivePrice(product: ProductData): number {
  const orig = parseFloat(product.originalPrice) || 0;
  const disc = product.discountedPrice ? parseFloat(product.discountedPrice) : 0;
  if (disc > 0 && disc < orig) {
    return disc;
  }
  return orig;
}

export function getDiscountPercentage(product: ProductData): number {
  const orig = parseFloat(product.originalPrice) || 0;
  const disc = product.discountedPrice ? parseFloat(product.discountedPrice) : 0;
  if (disc > 0 && disc < orig) {
    return Math.round(((orig - disc) / orig) * 100);
  }
  return 0;
}

export function buildSingleProductWhatsAppUrl(params: {
  whatsappNumber: string;
  storeName: string;
  product: ProductData;
  quantity: number;
  currencySymbol: string;
  siteOrigin?: string;
}): string {
  const {
    whatsappNumber,
    storeName,
    product,
    quantity,
    currencySymbol,
    siteOrigin = typeof window !== "undefined" ? window.location.origin : "",
  } = params;

  const unitPrice = getEffectivePrice(product);
  const total = (unitPrice * quantity).toFixed(2);
  const productLink = `${siteOrigin}/?product=${encodeURIComponent(product.slug)}`;

  const lines = [
    `✨ *New Direct Order Inquiry — ${storeName}* ✨`,
    ``,
    `Hello! I would like to order the following cosmetics item:`,
    `• *Product:* ${product.name}`,
    `• *Category:* ${product.category} (${product.sku})`,
    `• *Unit Price:* ${currencySymbol}${unitPrice.toFixed(2)}${
      product.discountedPrice &&
      parseFloat(product.discountedPrice) < parseFloat(product.originalPrice)
        ? ` (Original: ${currencySymbol}${parseFloat(product.originalPrice).toFixed(2)})`
        : ""
    }`,
    `• *Quantity:* ${quantity}`,
    `• *Estimated Total:* ${currencySymbol}${total}`,
    `• *Product Link:* ${productLink}`,
    ``,
    `Please confirm availability and share delivery dispatch details. Thank you!`,
  ];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${cleanWhatsAppDigits(whatsappNumber)}?text=${text}`;
}

export function buildCheckoutOrderWhatsAppUrl(params: {
  whatsappNumber: string;
  storeName: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  paymentMethod: string;
  paymentReference?: string;
  orderNotes?: string;
  items: OrderItemData[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  currencySymbol: string;
}): string {
  const {
    whatsappNumber,
    storeName,
    orderNumber,
    customerName,
    customerPhone,
    deliveryAddress,
    city,
    paymentMethod,
    paymentReference,
    orderNotes,
    items,
    subtotal,
    shippingFee,
    totalAmount,
    currencySymbol,
  } = params;

  const itemLines = items.map(
    (item, idx) =>
      `${idx + 1}. *${item.name}* (${item.category})\n   Qty: ${item.quantity} × ${currencySymbol}${item.price.toFixed(2)} = *${currencySymbol}${(item.price * item.quantity).toFixed(2)}*`
  );

  const lines = [
    `🛍️ *OFFICIAL ORDER CONFIRMATION — ${storeName}* 🛍️`,
    `*Order Reference:* #${orderNumber}`,
    `────────────────────────`,
    `*Customer Details:*`,
    `• *Name:* ${customerName}`,
    `• *Phone:* ${customerPhone}`,
    `• *City:* ${city}`,
    `• *Delivery Address:* ${deliveryAddress}`,
    `• *Payment Method:* ${paymentMethod}${
      paymentReference ? ` (Ref: ${paymentReference})` : ""
    }`,
    orderNotes ? `• *Special Note:* ${orderNotes}` : "",
    `────────────────────────`,
    `*Ordered Cosmetics Items:*`,
    ...itemLines,
    `────────────────────────`,
    `• *Subtotal:* ${currencySymbol}${subtotal.toFixed(2)}`,
    `• *Delivery Fee:* ${
      shippingFee === 0 ? "COMPLIMENTARY (FREE)" : `${currencySymbol}${shippingFee.toFixed(2)}`
    }`,
    `✨ *GRAND TOTAL: ${currencySymbol}${totalAmount.toFixed(2)}* ✨`,
    ``,
    `Please confirm my order #${orderNumber}. Thank you!`,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${cleanWhatsAppDigits(whatsappNumber)}?text=${text}`;
}

export function buildGeneralConciergeWhatsAppUrl(
  whatsappNumber: string,
  storeName: string
): string {
  const text = encodeURIComponent(
    `Hello ${storeName} Beauty Concierge! ✨ I have a question regarding your cosmetics collection and would love personalized assistance.`
  );
  return `https://wa.me/${cleanWhatsAppDigits(whatsappNumber)}?text=${text}`;
}
