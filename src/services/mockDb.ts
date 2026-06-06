export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchaser: boolean;
  likes: number;
}

export interface QnA {
  id: string;
  question: string;
  answer: string;
  date: string;
  votes: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  ratingCount: number;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  reviews: Review[];
  qna: QnA[];
  description: string;
  longDescription: string;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFlashSale: boolean;
  isAiRecommended: boolean;
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  videoUrl?: string;
  returnPolicy: string;
  deliveryDays: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
  featured?: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  description: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  comment: string;
  rating: number;
}

// Concrete Handcrafted Premium Products
const premiumProducts: Product[] = [
  {
    id: "p1",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Electronics",
    subcategory: "Smartphones",
    price: 999,
    originalPrice: 1099,
    discountPercentage: 9,
    rating: 4.8,
    ratingCount: 1520,
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      "Display": "6.1-inch Super Retina XDR OLED, 120Hz",
      "Processor": "A17 Pro chip, 6-core GPU",
      "Camera": "48MP Main | 12MP Ultra Wide | 12MP Telephoto",
      "Battery": "Up to 23 hours video playback",
      "Weight": "187g",
      "Material": "Titanium design, Ceramic Shield front"
    },
    reviews: [
      {
        id: "r1",
        userName: "Sarah Jenkins",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        rating: 5,
        date: "2026-05-15",
        title: "Stunning build quality!",
        comment: "The titanium finish feels incredible. Extremely fast performance and the cameras are phenomenal.",
        verifiedPurchaser: true,
        likes: 42
      },
      {
        id: "r2",
        userName: "David K.",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        rating: 4,
        date: "2026-05-20",
        title: "Great phone, battery life is average",
        comment: "Excellent screen and build. A17 Pro is blazing fast. Battery life gets me through the day but could be better.",
        verifiedPurchaser: true,
        likes: 12
      }
    ],
    qna: [
      {
        id: "q1",
        question: "Does it come with a charger in the box?",
        answer: "No, it only includes a USB-C charging cable. You will need to purchase a power adapter separately.",
        date: "2026-04-10",
        votes: 15
      }
    ],
    description: "Experience the next level of mobile technology with the iPhone 15 Pro, featuring a robust titanium chassis, A17 Pro chip, and a pro-level camera system.",
    longDescription: "iPhone 15 Pro is the first iPhone to feature an aerospace‑grade titanium design, using the same alloy that spacecraft use for missions to Mars. Titanium has one of the best strength‑to‑weight ratios of any metal, making these our lightest Pro models ever. The A17 Pro chip is an entirely new class of iPhone chip that delivers our best graphics performance by far. Mobile games will look and feel immersive, with incredibly detailed environments and more realistic characters.",
    isTrending: true,
    isNewArrival: false,
    isBestSeller: true,
    isFlashSale: false,
    isAiRecommended: true,
    availabilityStatus: "In Stock",
    returnPolicy: "30-day return policy, items must be in original packaging.",
    deliveryDays: 2
  },
  {
    id: "p2",
    name: "Air Max 270 SE",
    brand: "Nike",
    category: "Footwear",
    subcategory: "Running Shoes",
    price: 150,
    originalPrice: 170,
    discountPercentage: 11,
    rating: 4.6,
    ratingCount: 840,
    stock: 4,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      "Material": "Mesh and synthetic upper",
      "Cushioning": "Max Air 270 unit",
      "Midsole": "Dual-density foam",
      "Fit": "Bootie construction",
      "Weight": "310g (Size 9)"
    },
    reviews: [
      {
        id: "r3",
        userName: "Marcus V.",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        rating: 5,
        date: "2026-05-01",
        title: "Like walking on clouds",
        comment: "Extremely comfortable for all-day wear. The large Air bubble in the heel provides excellent support.",
        verifiedPurchaser: true,
        likes: 28
      }
    ],
    qna: [
      {
        id: "q2",
        question: "Are these true to size?",
        answer: "Yes, they fit true to size. If you have extremely wide feet, we recommend going up half a size.",
        date: "2026-04-18",
        votes: 8
      }
    ],
    description: "The Nike Air Max 270 delivers unmatched style and comfort with a massive Air unit wrapping around the heel.",
    longDescription: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors. The woven and synthetic fabric on the upper provides a lightweight fit and airy feel.",
    isTrending: true,
    isNewArrival: true,
    isBestSeller: false,
    isFlashSale: true,
    isAiRecommended: true,
    availabilityStatus: "Low Stock",
    returnPolicy: "14-day free returns on unworn shoes.",
    deliveryDays: 3
  },
  {
    id: "p3",
    name: "WH-1000XM5 Headphones",
    brand: "Sony",
    category: "Electronics",
    subcategory: "Headphones",
    price: 348,
    originalPrice: 399,
    discountPercentage: 12,
    rating: 4.7,
    ratingCount: 2150,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      "Driver Unit": "30mm dome type",
      "Frequency Response": "4Hz - 40,000Hz",
      "Bluetooth": "Version 5.2",
      "Battery Life": "Up to 30 hours (ANC ON) | Up to 38 hours (ANC OFF)",
      "Charging Time": "Approx. 3.5 hours (Quick charge supported)"
    },
    reviews: [
      {
        id: "r4",
        userName: "Elena R.",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        rating: 5,
        date: "2026-05-10",
        title: "Best ANC on the market!",
        comment: "Noise cancelling is absolute magic. It blocks out train and engine noise completely. Sound quality is crystal clear.",
        verifiedPurchaser: true,
        likes: 54
      }
    ],
    qna: [
      {
        id: "q3",
        question: "Can they connect to two devices simultaneously?",
        answer: "Yes, they support Multipoint connection, allowing you to connect to a laptop and smartphone at the same time.",
        date: "2026-05-02",
        votes: 31
      }
    ],
    description: "Industry-leading noise canceling over-ear headphones with premium sound quality, smart features, and comfort.",
    longDescription: "The WH-1000XM5 headphones rewrite the rules of distraction-free listening. Two processors control 8 microphones for unprecedented noise canceling and exceptional call quality. With a newly developed driver, DSEE Extreme, and High-Resolution Audio support, the WH-1000XM5 headphones provide breathtaking sound quality.",
    isTrending: false,
    isNewArrival: false,
    isBestSeller: true,
    isFlashSale: false,
    isAiRecommended: true,
    availabilityStatus: "In Stock",
    returnPolicy: "30-day returns, packaging must be intact.",
    deliveryDays: 1
  },
  {
    id: "p4",
    name: "MacBook Pro 14\" M3",
    brand: "Apple",
    category: "Electronics",
    subcategory: "Laptops",
    price: 1599,
    originalPrice: 1799,
    discountPercentage: 11,
    rating: 4.9,
    ratingCount: 610,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      "Chip": "Apple M3 Chip with 8-core CPU and 10-core GPU",
      "Memory": "8GB Unified Memory",
      "Storage": "512GB Solid State Drive",
      "Display": "14.2-inch Liquid Retina XDR",
      "Ports": "HDMI, SDXC card slot, MagSafe 3, two Thunderbolt / USB 4 ports"
    },
    reviews: [
      {
        id: "r5",
        userName: "Michael Chen",
        userAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
        rating: 5,
        date: "2026-05-22",
        title: "A monster of a laptop",
        comment: "The battery life is unbelievable—lasts me 18+ hours. The screen is bright, colorful, and smooth. Worth every penny.",
        verifiedPurchaser: true,
        likes: 19
      }
    ],
    qna: [
      {
        id: "q4",
        question: "Can it support dual external monitors?",
        answer: "Yes! With the M3 chip, it supports up to two external displays when the laptop lid is closed.",
        date: "2026-05-05",
        votes: 14
      }
    ],
    description: "MacBook Pro 14-inch with M3 chip, delivering speed, efficiency, and epic battery life for creative pros.",
    longDescription: "The 14-inch MacBook Pro blasts forward with M3, an incredibly advanced chip that brings serious speed and capability. With industry-leading battery life—up to 22 hours—and a beautiful Liquid Retina XDR display, it's a pro laptop without equal.",
    isTrending: true,
    isNewArrival: false,
    isBestSeller: true,
    isFlashSale: false,
    isAiRecommended: false,
    availabilityStatus: "In Stock",
    returnPolicy: "30-day return policy, Apple standard warranty applies.",
    deliveryDays: 2
  },
  {
    id: "p5",
    name: "Premium Sportswear Hoodie",
    brand: "Nike",
    category: "Apparel",
    subcategory: "Hoodies",
    price: 85,
    originalPrice: 100,
    discountPercentage: 15,
    rating: 4.5,
    ratingCount: 340,
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800"
    ],
    specs: {
      "Material": "80% Cotton / 20% Polyester",
      "Care Instructions": "Machine wash cold, tumble dry low",
      "Fit": "Standard fit for a relaxed, easy feel"
    },
    reviews: [
      {
        id: "r6",
        userName: "Chloe Bennet",
        userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
        rating: 4,
        date: "2026-04-20",
        title: "Very cozy, size runs a bit large",
        comment: "Excellent fleece lining. Keeps me super warm in 45-degree weather. Suggest ordering a size down if you like a fitted look.",
        verifiedPurchaser: true,
        likes: 9
      }
    ],
    qna: [],
    description: "Cozy fleece pullover hoodie featuring the classic Swoosh brand mark and an adjustable drawstring hood.",
    longDescription: "Made from a premium heavyweight blend of cotton and polyester, the Nike Sportswear Hoodie provides long-lasting comfort and warmth. A kangaroo pocket gives you quick access to keys or phone, while the rib-knit cuffs seal out the cold.",
    isTrending: false,
    isNewArrival: true,
    isBestSeller: false,
    isFlashSale: false,
    isAiRecommended: true,
    availabilityStatus: "In Stock",
    returnPolicy: "30-day standard apparel exchange or return.",
    deliveryDays: 4
  }
];

// Generate categories
export const categories: Category[] = [
  { id: "c_electronics", name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=300", itemCount: 35, featured: true },
  { id: "c_footwear", name: "Footwear", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=300", itemCount: 28, featured: true },
  { id: "c_apparel", name: "Apparel", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=300", itemCount: 42, featured: true },
  { id: "c_accessories", name: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300", itemCount: 22 },
  { id: "c_home", name: "Home & Living", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300", itemCount: 18 }
];

// Brands list
export const brands: Brand[] = [
  { id: "b_apple", name: "Apple", logo: "🍎", category: "Electronics" },
  { id: "b_nike", name: "Nike", logo: "✔️", category: "Footwear" },
  { id: "b_sony", name: "Sony", logo: "🔊", category: "Electronics" },
  { id: "b_adidas", name: "Adidas", logo: "👟", category: "Footwear" },
  { id: "b_zara", name: "Zara", logo: "👗", category: "Apparel" }
];

// Testimonials
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Jessica Albright",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    role: "Verified Customer",
    comment: "Buynora has changed the way I shop online. The glassmorphic design and smooth page transitions make it feel incredibly premium. Deliveries are lightning fast!",
    rating: 5
  },
  {
    id: "t2",
    name: "Robert Downey",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    role: "Tech Enthusiast",
    comment: "The voice search is surprisingly accurate, and the checkout flow is seamless. Definitely inspired by the absolute best designs in the industry.",
    rating: 5
  },
  {
    id: "t3",
    name: "Aisha Patel",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    role: "Designer",
    comment: "Stunning aesthetic options! The Dark Mode looks absolutely gorgeous with the glass cards. Recommend to everyone.",
    rating: 5
  }
];

// Coupons database
export const coupons: Coupon[] = [
  { code: "WELCOME10", discountType: "percentage", value: 10, minOrderValue: 50, description: "10% OFF on orders above $50" },
  { code: "SAVE20", discountType: "percentage", value: 20, minOrderValue: 150, description: "20% OFF on orders above $150" },
  { code: "FREESHIP", discountType: "fixed", value: 15, minOrderValue: 100, description: "Flat $15 off shipping costs on orders above $100" },
  { code: "BIGNORA30", discountType: "percentage", value: 30, minOrderValue: 300, description: "30% OFF on grand orders above $300" }
];

// Generate remaining 100+ products programmatically
const categoriesList = ["Electronics", "Footwear", "Apparel", "Accessories", "Home & Living"];
const subcategoriesMap: Record<string, string[]> = {
  "Electronics": ["Smartphones", "Laptops", "Headphones", "Smartwatches", "Speakers"],
  "Footwear": ["Running Shoes", "Sneakers", "Sandals", "Boots"],
  "Apparel": ["Hoodies", "T-Shirts", "Jackets", "Jeans", "Activewear"],
  "Accessories": ["Backpacks", "Sunglasses", "Wallets", "Watches"],
  "Home & Living": ["Smart Lighting", "Coffee Makers", "Diffusers", "Shelving"]
};

const brandMap: Record<string, string[]> = {
  "Electronics": ["Apple", "Sony", "Samsung", "Bose", "Xiaomi"],
  "Footwear": ["Nike", "Adidas", "Puma", "Reebok", "New Balance"],
  "Apparel": ["Nike", "Zara", "H&M", "Under Armour", "Levis"],
  "Accessories": ["Fossil", "Ray-Ban", "Herschel", "Samsonite"],
  "Home & Living": ["Philips", "Nespresso", "Ikea", "Dyson"]
};

const imageMap: Record<string, string[]> = {
  "Smartphones": [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=500"
  ],
  "Laptops": [
    "https://images.unsplash.com/photo-1496181130204-7552cc14ac1b?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=500"
  ],
  "Headphones": [
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=500"
  ],
  "Smartwatches": [
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=500"
  ],
  "Speakers": [
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=500"
  ],
  "Running Shoes": [
    "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=500"
  ],
  "Sneakers": [
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-152596622245b-55d045842880?auto=format&fit=crop&q=80&w=500"
  ],
  "Hoodies": [
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=500"
  ],
  "T-Shirts": [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=500"
  ],
  "Jackets": [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=500"
  ],
  "Backpacks": [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500"
  ],
  "Sunglasses": [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=500"
  ],
  "Watches": [
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=500"
  ],
  "Smart Lighting": [
    "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=500"
  ],
  "Coffee Makers": [
    "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&q=80&w=500"
  ]
};

const defaultImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=500"
];

// Generate mock items up to 105 total products
export const products: Product[] = [...premiumProducts];

for (let i = 1; i <= 100; i++) {
  const category = categoriesList[i % categoriesList.length];
  const subcategories = subcategoriesMap[category];
  const subcategory = subcategories[i % subcategories.length];
  
  const brandsArr = brandMap[category];
  const brand = brandsArr[i % brandsArr.length];
  
  const images = imageMap[subcategory] || defaultImages;
  
  const discountPercentage = Math.floor((i % 7) * 5) + 5; // 5% to 35%
  const originalPrice = Math.floor((i % 10 + 1) * 35) + 15;
  const price = Math.round(originalPrice * (1 - discountPercentage / 100));
  
  const rating = parseFloat((4.0 + (i % 11) * 0.1).toFixed(1));
  const ratingCount = Math.floor((i % 25 + 1) * 12) + 5;
  
  const isTrending = i % 8 === 0;
  const isNewArrival = i % 6 === 0;
  const isBestSeller = i % 10 === 0;
  const isFlashSale = i % 9 === 0;
  const isAiRecommended = i % 7 === 0;
  
  const stock = i % 5 === 0 ? 0 : (i % 4 === 0 ? 3 : Math.floor((i % 15) + 8));
  const availabilityStatus = stock === 0 ? 'Out of Stock' : (stock < 5 ? 'Low Stock' : 'In Stock');
  
  products.push({
    id: `gen_p${i}`,
    name: `${brand} Comfort ${subcategory} v${i}`,
    brand,
    category,
    subcategory,
    price,
    originalPrice,
    discountPercentage,
    rating,
    ratingCount,
    stock,
    images: images.map(img => `${img}&sig=${i}`),
    specs: {
      "Model Year": "2026",
      "Material Composition": "Premium blended fibers",
      "Warranty": "1-Year Global Manufacturer Warranty",
      "Origin": "Designed in California, assembled globally"
    },
    reviews: [
      {
        id: `gen_r_${i}_1`,
        userName: `User_${i}`,
        userAvatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&sig=${i}`,
        rating: Math.round(rating),
        date: "2026-05-01",
        title: "Very satisfied",
        comment: `Excellent product for this price point. Fast shipping and items arrived exactly as described.`,
        verifiedPurchaser: true,
        likes: i % 5
      }
    ],
    qna: [
      {
        id: `gen_q_${i}_1`,
        question: "Is this water resistant?",
        answer: "It has standard splash resistance, but we do not recommend submerging it in water.",
        date: "2026-04-20",
        votes: i % 3
      }
    ],
    description: `A beautifully crafted premium ${subcategory} from ${brand}. Combining modern aesthetics with extreme daily practicality.`,
    longDescription: `Introducing the brand-new ${brand} ${subcategory}. Designed for high performance and engineered to meet the highest sustainability and design standards. Made with first-grade materials for ultimate durability and longevity. Complete with original manufacturer warranty card in packaging box.`,
    isTrending,
    isNewArrival,
    isBestSeller,
    isFlashSale,
    isAiRecommended,
    availabilityStatus,
    returnPolicy: "30-day hassle-free return policy, conditions apply.",
    deliveryDays: (i % 3) + 2
  });
}
