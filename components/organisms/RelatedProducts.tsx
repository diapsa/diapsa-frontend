import React from "react";
import Image from "next/image";
import Link from "next/link";

interface RelatedProduct {
  name: string;
  description: string;
  image: string;
  link: string;
}

interface RelatedProductsProps {
  title: string;
  subtitle: string;
  items: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  title,
  subtitle,
  items,
}) => {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center mb-12 py-20">
          <h2 className="text-3xl lg:text-6xl font-bold text-primary mb-4">
            {title}
          </h2>
          
          {/* Decorative Separator */}
          <div className="w-24 h-1.5 bg-linear-to-r from-secondary to-amber-400 mx-auto rounded-full mb-4" />
          
          <p className="text-base lg:text-4xl text-gray-600 max-w-7xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 max-w-7xl mx-auto">
          {items.map((product, index) => (
            <Link
              key={index}
              href={product.link}
              className="group block"
            >
              <div className="flex flex-col items-center space-y-4 max-w-64 mx-auto">
                {/* Image */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white shadow-md group-hover:shadow-lg transition-all duration-300 border-2 border-transparent group-hover:border-secondary">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:brightness-110 transition-all duration-300"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2 text-center w-full">
                  <h3 className="text-lg font-semibold text-primary group-hover:text-secondary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
