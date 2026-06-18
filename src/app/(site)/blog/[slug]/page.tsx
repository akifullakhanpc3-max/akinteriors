import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const post = {
  title: 'Top Interior Design Trends for 2024',
  content: `The world of interior design is constantly evolving, and 2024 brings exciting new trends that blend sustainability with luxury. From biophilic design elements that bring nature indoors to bold color choices that make a statement, this year's trends are all about creating spaces that feel both personal and purposeful.

  **Sustainable Luxury**
  
  One of the biggest trends is sustainable luxury — using eco-friendly materials without compromising on aesthetics. Think reclaimed wood, natural stone, organic textiles, and energy-efficient lighting that add character while reducing environmental impact.
  
  **Warm Neutrals**
  
  Move over, cool grays. Warm neutrals like terracotta, sand, and warm beige are taking center stage. These colors create a cozy, inviting atmosphere that feels both sophisticated and comfortable.
  
  **Multi-Functional Spaces**
  
  With more people working from home, multi-functional spaces have become essential. Smart furniture solutions, sliding partitions, and modular designs allow rooms to adapt to different needs throughout the day.
  
  **Statement Ceilings**
  
  While accent walls have been popular for years, 2024 is all about statement ceilings. From intricate patterns to bold colors and textured finishes, the fifth wall is getting the attention it deserves.
  
  **Biophilic Design**
  
  Connecting with nature through design continues to be a major trend. Indoor plants, natural light, organic materials, and nature-inspired patterns create spaces that promote wellbeing and tranquility.`,
  category: 'Interior Design',
  image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=60',
  date: 'Dec 15, 2024',
  author: 'AkInteriors Team',
};

export default function BlogDetailPage() {
  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-[#C8A97E] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <article>
          <div className="relative h-[400px] rounded-3xl overflow-hidden mb-8">
            <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
          </div>

          <Badge variant="default" className="mb-4">{post.category}</Badge>
          <h1 className="text-4xl font-bold text-[#111827] mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
          </div>

          <Separator className="mb-8" />

          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
