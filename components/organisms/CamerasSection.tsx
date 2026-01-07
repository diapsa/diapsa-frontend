import Image from "next/image";
import type { CameraSerie, Camera } from "@/types/camara";
import camerasData from "@/data/camaras.json";

interface CameraTableProps {
  serie: CameraSerie;
}

// Componente para renderizar dinámicamente las specs
function CameraSpecsRow({ camera }: { camera: Camera }) {
  const { specs } = camera;
  
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {camera.modelo}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {specs.resolucion || "-"}
      </td>
      <td className="px-4 py-3 text-center">
        {specs.superIR ? (
          <span className="text-secondary text-xl">✓</span>
        ) : (
          <span className="text-gray-300">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        {specs.superFocus ? (
          <span className="text-secondary text-xl">✓</span>
        ) : (
          <span className="text-gray-300">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {specs.enfoque || "-"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {specs.anguloVision || "-"}
      </td>
    </tr>
  );
}

function CameraTable({ serie }: CameraTableProps) {
  return (
    <div className="space-y-8">
      {/* Header de la serie */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">
          {serie.title}
        </h2>
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {serie.description}
        </p>
      </div>

      {/* Tabla de cámaras */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Modelo
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Resolución
              </th>
              <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                Super IR
              </th>
              <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                Super Focus
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Enfoque
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Ángulo de Visión (HFOV x VFOV)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {serie.cameras.map((camera) => (
              <CameraSpecsRow key={camera.id} camera={camera} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Separador decorativo */}
      <div className="w-full h-3 bg-gradient-to-r from-transparent via-secondary to-transparent" />
    </div>
  );
}

export default function CamerasSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl space-y-16">
        {camerasData.series.map((serie) => (
          <CameraTable key={serie.id} serie={serie} />
        ))}
      </div>
    </section>
  );
}
