// Curated high quality product images for retail, apparel, food, and supplies
const PRODUCT_IMAGE_MAP: Record<string, string> = {
  // Ropa y Moda
  "camisa": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=160&auto=format&fit=crop&q=80",
  "hugo boss": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=160&auto=format&fit=crop&q=80",
  "boss": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=160&auto=format&fit=crop&q=80",
  "camiseta": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=160&auto=format&fit=crop&q=80",
  "pantalon": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=160&auto=format&fit=crop&q=80",
  "jean": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=160&auto=format&fit=crop&q=80",
  "chaqueta": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=160&auto=format&fit=crop&q=80",
  "hoodie": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=160&auto=format&fit=crop&q=80",
  "buzo": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=160&auto=format&fit=crop&q=80",
  "gorra": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=160&auto=format&fit=crop&q=80",
  "sombrero": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=160&auto=format&fit=crop&q=80",
  "zapato": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&auto=format&fit=crop&q=80",
  "tenis": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&auto=format&fit=crop&q=80",
  "nike": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&auto=format&fit=crop&q=80",
  "adidas": "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=160&auto=format&fit=crop&q=80",
  "reloj": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160&auto=format&fit=crop&q=80",
  "bolso": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=160&auto=format&fit=crop&q=80",
  "cartera": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=160&auto=format&fit=crop&q=80",
  "mochila": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=160&auto=format&fit=crop&q=80",
  "gafas": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=160&auto=format&fit=crop&q=80",
  
  // Insumos, Confección y Textiles
  "hilo": "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=160&auto=format&fit=crop&q=80",
  "telas": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=160&auto=format&fit=crop&q=80",
  "tela": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=160&auto=format&fit=crop&q=80",
  "estampado": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=160&auto=format&fit=crop&q=80",
  "boton": "https://images.unsplash.com/photo-1584556812952-905ffd02b110?w=160&auto=format&fit=crop&q=80",
  "cierre": "https://images.unsplash.com/photo-1584556812952-905ffd02b110?w=160&auto=format&fit=crop&q=80",
  "lana": "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=160&auto=format&fit=crop&q=80",
  
  // Alimentos, Insumos y Bebidas
  "cafe": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=160&auto=format&fit=crop&q=80",
  "carne": "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=160&auto=format&fit=crop&q=80",
  "sal": "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=160&auto=format&fit=crop&q=80",
  "chimichurri": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=160&auto=format&fit=crop&q=80",
  "salsa": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=160&auto=format&fit=crop&q=80",
  "hamburguesa": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=160&auto=format&fit=crop&q=80",
  "pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=160&auto=format&fit=crop&q=80",
  "cerveza": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=160&auto=format&fit=crop&q=80",
  "gaseosa": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=160&auto=format&fit=crop&q=80",
  "agua": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=160&auto=format&fit=crop&q=80",
  "jugo": "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=160&auto=format&fit=crop&q=80",
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=160&auto=format&fit=crop&q=80",
];

export function getProductImageUrl(name: string): string {
  if (!name) return DEFAULT_IMAGES[0];
  const lower = name.toLowerCase().trim();

  for (const [key, url] of Object.entries(PRODUCT_IMAGE_MAP)) {
    if (lower.includes(key)) {
      return url;
    }
  }

  // Consistent hash for any unmapped product to assign a stylish realistic photo
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash << 5) - hash + lower.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DEFAULT_IMAGES.length;
  return DEFAULT_IMAGES[index];
}
