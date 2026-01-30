/**
 * Product Types
 * Based on API documentation from cms.grupodiapsa.com.mx
 */

/**
 * Product category
 */
export interface ProductCategory {
  id: number;
  slug: string;
  name: string;
}

/**
 * Product subcategory
 */
export interface ProductSubcategory {
  id: number;
  slug: string;
  name: string;
}

/**
 * Product brand
 */
export interface ProductBrand {
  id: number;
  slug: string;
  name: string;
  logo?: string;
}

/**
 * Product series
 */
export interface ProductSeries {
  id: number;
  slug: string;
  name: string;
}

/**
 * Featured specification (shown in product cards)
 */
export interface FeaturedSpec {
  label: string;
  value: string;
  unit: string;
}

/**
 * Specification item
 */
export interface SpecificationItem {
  label: string;
  value: string;
  unit: string;
  featured: boolean;
}

/**
 * Specification group
 */
export interface SpecificationGroup {
  group: string;
  items: SpecificationItem[];
}

/**
 * Product image
 */
export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  type: 'main' | 'gallery';
}

/**
 * Product document
 */
export interface ProductDocument {
  id: number;
  type: 'manual' | 'datasheet' | 'brochure' | 'other';
  name: string;
  url: string;
  language: string;
}

/**
 * Product SEO metadata
 */
export interface ProductSEO {
  title: string;
  description: string;
}

/**
 * Product summary (for listings)
 */
export interface Product {
  id: number;
  slug: string;
  model: string;
  name: string;
  short_description: string;
  availability_status: string;
  featured: boolean;
  is_new: boolean;
  main_image: string | null;
  category: ProductCategory;
  brand: ProductBrand;
  featured_specs: FeaturedSpec[];
}

/**
 * Related product (simplified)
 */
export interface RelatedProduct {
  id: number;
  slug: string;
  model: string;
  name: string;
  short_description: string;
  main_image: string | null;
  brand: ProductBrand;
}

/**
 * Product detail (complete information)
 */
export interface ProductDetail {
  id: number;
  slug: string;
  model: string;
  name: string;
  short_description: string;
  description: string;
  availability_status: string;
  featured: boolean;
  is_new: boolean;
  category: ProductCategory;
  subcategory: ProductSubcategory | null;
  brand: ProductBrand;
  series: ProductSeries | null;
  images: ProductImage[];
  specifications: SpecificationGroup[];
  documents: ProductDocument[];
  related_products: RelatedProduct[];
  seo: ProductSEO;
}

/**
 * Product filters for API requests
 */
export interface ProductFilters {
  category?: string;
  brand?: string;
  series?: string;
  per_page?: number;
  page?: number;
}

/**
 * Product search parameters
 */
export interface ProductSearchParams {
  q: string;
  per_page?: number;
  page?: number;
}
