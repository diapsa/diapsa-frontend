/**
 * Category Types
 * Based on API documentation
 */

export interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  level: number;
  products_count: number;
  children?: Category[];
  parent?: {
    id: number;
    slug: string;
    name: string;
  };
  seo?: {
    title: string;
    description: string;
  };
}

export interface Brand {
  id: number;
  slug: string;
  name: string;
  logo?: string;
  website?: string;
  products_count: number;
  series?: Series[];
}

export interface Series {
  id: number;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  brand: {
    id: number;
    slug: string;
    name: string;
  };
  category: {
    id: number;
    slug: string;
    name: string;
  };
  products_count: number;
}
