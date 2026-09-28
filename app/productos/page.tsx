import type { Metadata } from 'next';
import PaginaProductos from '@/components/organisms/PaginaProductos';
import { getProducts } from '@/lib/api/products';
import { getBrands } from '@/lib/api/categories';

export const metadata: Metadata = {
  title: 'Productos para Mantenimiento Predictivo Industrial',
  description:
    'Cámaras acústicas HERTZINNO, sensores de vibración inalámbricos KCF y cámaras termográficas HIKMICRO, con la asesoría de especialistas que los usan a diario en planta.',
  keywords: [
    'productos mantenimiento predictivo',
    'equipos industriales',
    'monitoreo de condición',
    'cámaras de termografía',
    'analisis de vibraciones',
    'termografía industrial',
    'Grupo DIAPSA',
  ],
  alternates: {
    canonical: '/productos',
  },
  openGraph: {
    title: 'Productos para Mantenimiento Predictivo | Grupo DIAPSA',
    description:
      'Explora equipos y soluciones industriales para mantenimiento predictivo, monitoreo de condición y confiabilidad de activos.',
    url: '/productos',
    type: 'website',
  },
};

// Se regenera cada hora: los productos y las marcas vienen del CMS.
export const revalidate = 3600;

export default async function ProductsPage() {
  // El CMS no debe tumbar la página: si falla, el catálogo dice que no está
  // disponible y lo demás carga igual.
  const [productos, marcas] = await Promise.all([
    getProducts({ per_page: 100 })
      .then((r) => r.data ?? [])
      .catch((error) => {
        console.error('[productos] No se pudo cargar el catálogo:', error);
        return [];
      }),
    getBrands().catch((error) => {
      console.error('[productos] No se pudieron cargar las marcas:', error);
      return [];
    }),
  ]);
  return <PaginaProductos productos={productos} marcas={marcas} />;
}
