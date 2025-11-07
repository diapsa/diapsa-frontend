import Image from "next/image";
import Button from "@/components/atoms/Button";
import blogData from "@/data/blog.json";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  slug: string;
}

export default function BlogSection() {
  const posts: BlogPost[] = blogData.posts;

  return (
    <section className="w-full bg-primary py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            NOTICIAS Y BLOG
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Mantente actualizado con las últimas tendencias en mantenimiento
            predictivo y casos de éxito de la industria
          </p>
        </div>

        {/* Grid de posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Imagen */}
              <div className="relative w-full h-56 bg-gray-200">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                {/* Badge de categoría */}
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                {/* Fecha */}
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(post.date).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                {/* Título */}
                <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* CTA */}
                <Button
                  variant="primary"
                  ghost
                  className="w-full justify-center"
                >
                  Leer más
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* CTA para ver más */}
        <div className="text-center mt-12">
          <Button variant="secondary" className="px-8 py-3">
            Ver todas las noticias
          </Button>
        </div>
      </div>
    </section>
  );
}
