export interface Breadcrumb {
  label: string;
  link: string;
}

export interface ServiceHeader {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
}

export interface ServiceContent {
  title: string | null;
  subtitle: string | null;
  image: string | null;
  items: ContentItem[];
}

export interface RelatedProduct {
  name: string;
  description: string;
  image: string;
  link: string;
}

export interface RelatedProducts {
  title: string;
  subtitle: string;
  items: RelatedProduct[];
}

export interface Servicio {
  id: string;
  slug: string;
  type: string;
  breadcrumbs: Breadcrumb[];
  header: ServiceHeader;
  content: ServiceContent;
  relatedProducts: RelatedProducts;
}
