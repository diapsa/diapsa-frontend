// Tipo flexible para especificaciones - puede contener cualquier propiedad
export interface CameraSpecs {
  [key: string]: string | number | boolean | null | undefined;
}

// Interfaz específica para las specs comunes que conocemos
export interface CommonCameraSpecs extends CameraSpecs {
  modelo?: string;
  resolucion?: string;
  superIR?: boolean;
  superFocus?: boolean;
  enfoque?: string;
  anguloVision?: string;
  // Otras propiedades específicas pueden agregarse aquí
  // pero no son obligatorias gracias a la herencia de CameraSpecs
}

export interface Camera {
  id: string;
  slug: string;
  modelo: string;
  descripcion?: string;
  specs: CommonCameraSpecs;
  brochure?: string;
  fichaTecnica?: string;
  images?: string[];
}

export interface CameraSerie {
  id: string;
  title: string;
  serie: string;
  description: string;
  images: string[];
  cameras: Camera[];
}

export interface CamerasData {
  series: CameraSerie[];
}
