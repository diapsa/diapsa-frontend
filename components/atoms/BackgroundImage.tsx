import Image from "next/image";

interface BackgroundImageProps {
  src: string;
  alt: string;
  overlayOpacity?: number; // 0-1, donde 0 = sin overlay, 1 = completamente oscuro
  priority?: boolean;
  objectFit?: "cover" | "contain";
  zIndex?: "z-0" | "-z-10";
}

export default function BackgroundImage({
  src,
  alt,
  overlayOpacity = 0,
  priority = false,
  objectFit = "cover",
  zIndex = "z-0",
}: BackgroundImageProps) {
  return (
    <div className={`absolute inset-0 ${zIndex}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-${objectFit}`}
        priority={priority}
      />
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        />
      )}
    </div>
  );
}
