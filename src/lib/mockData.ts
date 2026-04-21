// Mock data approximating TheLook eCommerce dataset filtered by products.brand
// Represents materialized views surfaced by the backend.

export const CURRENT_BRAND = "Calvin Klein";
export const CURRENT_RETAILER = "TheLook";
export const LAST_REFRESH = "Hoy · 09:14 UTC";

export const fmtNumber = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
export const fmtPct = (n: number, digits = 1) => `${n.toFixed(digits)}%`;

// mvSalesByBrandPeriod
export const salesTrend = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 18000 + Math.sin(i / 3) * 4200 + i * 320;
  const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * 1800;
  const revenue = Math.max(8000, Math.round(base + noise));
  const orders = Math.round(revenue / 86 + (Math.sin(i) * 8));
  return {
    date: `2025-04-${String(day).padStart(2, "0")}`,
    label: `${day}`,
    revenue,
    orders,
    units: Math.round(orders * 1.7),
    prev: Math.round(revenue * (0.82 + Math.sin(i / 4) * 0.08)),
  };
});

export const salesByCategory = [
  { category: "Outerwear & Coats", revenue: 184_320, units: 1420, orders: 980, growth: 12.4 },
  { category: "Jeans", revenue: 152_780, units: 2210, orders: 1640, growth: 6.1 },
  { category: "Tops & Tees", revenue: 121_540, units: 3180, orders: 2090, growth: -2.3 },
  { category: "Sweaters", revenue: 98_220, units: 1140, orders: 880, growth: 18.7 },
  { category: "Active", revenue: 76_910, units: 1320, orders: 940, growth: 4.2 },
  { category: "Accessories", revenue: 41_280, units: 1860, orders: 1310, growth: -5.6 },
];

export const productsPerformance = [
  { name: "Slim-Fit Wool Coat", category: "Outerwear & Coats", revenue: 48_320, units: 184, avgPrice: 262, sellThrough: 0.71 },
  { name: "High-Rise Slim Jean", category: "Jeans", revenue: 41_180, units: 612, avgPrice: 67, sellThrough: 0.84 },
  { name: "Cashmere Crew Sweater", category: "Sweaters", revenue: 36_940, units: 218, avgPrice: 169, sellThrough: 0.62 },
  { name: "Cotton Logo Tee", category: "Tops & Tees", revenue: 28_410, units: 1180, avgPrice: 24, sellThrough: 0.91 },
  { name: "Performance Leggings", category: "Active", revenue: 26_120, units: 478, avgPrice: 54, sellThrough: 0.78 },
  { name: "Leather Belt", category: "Accessories", revenue: 12_840, units: 384, avgPrice: 33, sellThrough: 0.41 },
  { name: "Quilted Bomber", category: "Outerwear & Coats", revenue: 22_910, units: 142, avgPrice: 161, sellThrough: 0.38 },
];

// mvAudienceProfile
export const audienceGender = [
  { name: "Femenino", value: 58 },
  { name: "Masculino", value: 39 },
  { name: "Otro / N/D", value: 3 },
];

export const audienceAge = [
  { range: "18-24", value: 14 },
  { range: "25-34", value: 32 },
  { range: "35-44", value: 26 },
  { range: "45-54", value: 17 },
  { range: "55-64", value: 8 },
  { range: "65+", value: 3 },
];

export const audienceStates = [
  { state: "California", customers: 4820 },
  { state: "Texas", customers: 3110 },
  { state: "New York", customers: 2890 },
  { state: "Florida", customers: 2440 },
  { state: "Illinois", customers: 1720 },
  { state: "Washington", customers: 1380 },
  { state: "Massachusetts", customers: 1120 },
];

// mvTrafficFunnel
export const trafficFunnel = [
  { source: "Organic Search", visits: 184_200, productViews: 92_400, addToCart: 21_320, purchases: 6_120 },
  { source: "Email", visits: 64_300, productViews: 41_800, addToCart: 13_220, purchases: 4_640 },
  { source: "Paid Search", visits: 58_900, productViews: 28_440, addToCart: 6_880, purchases: 1_980 },
  { source: "Social", visits: 47_120, productViews: 19_320, addToCart: 4_140, purchases: 980 },
  { source: "Direct", visits: 38_400, productViews: 24_180, addToCart: 7_220, purchases: 2_640 },
];

// mvCatalogQuality
export const catalogProducts = [
  { id: "P-10421", name: "Slim-Fit Wool Coat — Charcoal", category: "Outerwear & Coats", price: 289, cost: 132, score: 92, sellThrough: 0.71, status: "Óptimo", missing: [] as string[] },
  { id: "P-10422", name: "Coat Premium", category: "Outerwear & Coats", price: 0, cost: 144, score: 41, sellThrough: 0.22, status: "Crítico", missing: ["precio", "descripción"] },
  { id: "P-10510", name: "High-Rise Slim Jean — Indigo", category: "Jeans", price: 79, cost: 28, score: 88, sellThrough: 0.84, status: "Óptimo", missing: [] },
  { id: "P-10511", name: "Jean Producto", category: "Jeans", price: 65, cost: 26, score: 38, sellThrough: 0.18, status: "Crítico", missing: ["nombre", "categoría"] },
  { id: "P-10620", name: "Cashmere Crew Sweater", category: "Sweaters", price: 189, cost: 72, score: 84, sellThrough: 0.62, status: "Bueno", missing: [] },
  { id: "P-10621", name: "Sweater Item v2", category: "Sweaters", price: 99, cost: 41, score: 52, sellThrough: 0.28, status: "Mejorable", missing: ["descripción"] },
  { id: "P-10733", name: "Cotton Logo Tee", category: "Tops & Tees", price: 28, cost: 7, score: 95, sellThrough: 0.91, status: "Óptimo", missing: [] },
  { id: "P-10780", name: "T-Shirt Cotton", category: "Tops & Tees", price: 22, cost: 6, score: 47, sellThrough: 0.31, status: "Mejorable", missing: ["nombre", "descripción"] },
  { id: "P-10810", name: "Performance Leggings", category: "Active", price: 64, cost: 19, score: 81, sellThrough: 0.78, status: "Bueno", missing: [] },
  { id: "P-10920", name: "Leather Belt — Brown", category: "Accessories", price: 39, cost: 11, score: 58, sellThrough: 0.41, status: "Mejorable", missing: ["SKU"] },
];

// mvCompetitivePosition
export const competitivePosition = [
  { category: "Outerwear & Coats", brandRevenue: 184_320, marketRevenue: 1_420_900, sharePct: 12.97, brandAvgPrice: 246, benchmarkAvgPrice: 218, growthVsBench: 4.2 },
  { category: "Jeans", brandRevenue: 152_780, marketRevenue: 2_010_400, sharePct: 7.6, brandAvgPrice: 71, benchmarkAvgPrice: 68, growthVsBench: -1.1 },
  { category: "Tops & Tees", brandRevenue: 121_540, marketRevenue: 3_180_200, sharePct: 3.82, brandAvgPrice: 27, benchmarkAvgPrice: 24, growthVsBench: -2.8 },
  { category: "Sweaters", brandRevenue: 98_220, marketRevenue: 880_300, sharePct: 11.16, brandAvgPrice: 162, benchmarkAvgPrice: 138, growthVsBench: 6.4 },
  { category: "Active", brandRevenue: 76_910, marketRevenue: 1_540_600, sharePct: 4.99, brandAvgPrice: 58, benchmarkAvgPrice: 62, growthVsBench: 1.8 },
  { category: "Accessories", brandRevenue: 41_280, marketRevenue: 1_220_800, sharePct: 3.38, brandAvgPrice: 35, benchmarkAvgPrice: 41, growthVsBench: -3.2 },
];

// mvSegmentBase — saved segments
export const savedSegments = [
  { id: "S-001", name: "VIP Outerwear", size: 4_220, criteria: "Outerwear · ≥3 órdenes · ticket > $180", aov: 264, updated: "hace 2 días" },
  { id: "S-002", name: "Jeans Repeaters CA/TX", size: 7_840, criteria: "Jeans · ≥2 órdenes · CA o TX", aov: 132, updated: "hace 5 días" },
  { id: "S-003", name: "Lapsed High-Value", size: 3_120, criteria: "Sin compras 90d · LTV > $400", aov: 0, updated: "hace 1 semana" },
];

export const aiSegmentSuggestions = [
  {
    name: "Coat Premium Loyalists",
    reason:
      "Compradores recurrentes de Outerwear con ticket promedio sobre $220 en CA, NY y MA. Concentran 18% del revenue de la categoría con sólo 4% de la base.",
    logic: "category = Outerwear & Coats AND orders ≥ 2 AND avg_order_value > 220 AND state IN (CA, NY, MA)",
    size: 1_980,
    potential: "Alto",
    aov: 251,
  },
  {
    name: "Cross-sell Jeans → Sweaters",
    reason:
      "Compradores que adquirieron Jeans en los últimos 60 días y nunca compraron Sweaters; categoría con +18.7% de crecimiento mes a mes.",
    logic: "purchased(Jeans, 60d) AND NOT purchased(Sweaters, all_time)",
    size: 6_410,
    potential: "Medio-Alto",
    aov: 118,
  },
  {
    name: "Reactivación 90d — Alto Valor",
    reason:
      "Clientes con LTV mayor a $400 sin compras en los últimos 90 días. Mayoría llegó vía Email en su primera orden.",
    logic: "ltv > 400 AND days_since_last_order > 90 AND first_traffic_source = email",
    size: 2_340,
    potential: "Alto",
    aov: 184,
  },
];

export const aiCatalogSuggestions = [
  {
    productId: "P-10422",
    currentName: "Coat Premium",
    suggestedName: "Abrigo de lana premium — Corte slim, color carbón",
    suggestedDescription:
      "Abrigo estructurado en mezcla de lana 80%, corte slim que estiliza la silueta. Forro interior satinado y botonadura cruzada. Ideal para uso diario y eventos formales en clima frío.",
    suggestedCategory: "Outerwear & Coats › Abrigos formales",
    reason:
      "Falta precio y descripción; nombre genérico reduce match en búsqueda. Productos comparables tienen 3.2× más conversión con ficha completa.",
  },
  {
    productId: "P-10511",
    currentName: "Jean Producto",
    suggestedName: "Jean tiro alto slim — Lavado índigo",
    suggestedDescription:
      "Denim 11oz con elasticidad 2%. Tiro alto que favorece la silueta y bota recta. Disponible en lavado índigo clásico, ideal para uso casual y de oficina.",
    suggestedCategory: "Jeans › Tiro alto",
    reason:
      "Nombre y categoría incompletos; sell-through 18%. Productos similares con ficha completa logran sell-through promedio de 64%.",
  },
  {
    productId: "P-10780",
    currentName: "T-Shirt Cotton",
    suggestedName: "Camiseta básica de algodón pima — Cuello redondo",
    suggestedDescription:
      "Camiseta unisex en algodón pima 100%, peso medio (180gsm), cuello redondo reforzado. Acabado pre-lavado para reducir encogimiento.",
    suggestedCategory: "Tops & Tees › Básicos",
    reason:
      "Descripción ausente y nombre genérico. La categoría 'Tops & Tees' muestra alta sensibilidad a la calidad del nombre del producto en SEO interno del retailer.",
  },
];

// Executive insights (rule-based, optionally AI-narrated)
export const execInsights = [
  {
    type: "positive" as const,
    title: "Sweaters acelera",
    body: "+18.7% revenue vs período anterior. La categoría también muestra share creciente vs benchmark (+6.4 pts).",
  },
  {
    type: "warning" as const,
    title: "Catálogo: 14 productos críticos",
    body: "12% del catálogo activo tiene quality score < 50. Concentrado en Outerwear y Jeans.",
  },
  {
    type: "info" as const,
    title: "Concentración de revenue",
    body: "Outerwear y Jeans suman 47% del revenue del período. Riesgo de dependencia categórica.",
  },
  {
    type: "positive" as const,
    title: "Oportunidad audiencia",
    body: "Segmento 'Coat Premium Loyalists' (1.98K compradores) explica 18% del revenue de Outerwear.",
  },
];

// brand options shown in topbar selector
export const brandOptions = ["Calvin Klein", "Levi's", "Nike", "Adidas", "Lacoste"];
