import type { Metadata } from 'next';
import ProductsPageClient from '../../components/organisms/ProductsPageClient';

export const metadata: Metadata = {
  title: 'Productos para Mantenimiento Predictivo Industrial',
  description:
    'Cámaras termográficas, analizadores de vibraciones y equipos de detección de gas, con la asesoría de especialistas que los usan a diario en planta.',
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

export default function ProductsPage() {
  return <ProductsPageClient />;
}
