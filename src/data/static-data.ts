export const staticServices = [
  {
    _id: 'svc-1',
    title: 'Residential Interiors',
    description: 'Custom-designed homes that blend luxury with comfort. We create living spaces that reflect your personality and lifestyle.',
    content: 'From concept to completion, our residential interior design service covers every aspect of your home. We create spaces that are both beautiful and functional. Our team works closely with you to understand your vision and bring it to life with meticulous attention to detail.',
    icon: 'Home',
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: 'svc-2',
    title: 'Commercial Interiors',
    description: 'Professional spaces that enhance productivity and brand identity. From offices to retail, we design for success.',
    content: 'Our commercial interior design solutions transform workplaces into inspiring environments that boost productivity and reflect your brand identity. We design offices, retail spaces, restaurants, and more.',
    icon: 'Building2',
    displayOrder: 2,
    isActive: true,
  },
  {
    _id: 'svc-3',
    title: 'Modular Kitchens',
    description: 'Functional and stylish kitchens designed for modern living. Premium materials and smart layouts for the heart of your home.',
    content: 'We design and install custom modular kitchens that combine aesthetics with functionality. Premium materials, smart storage solutions, and ergonomic designs ensure your kitchen is both beautiful and practical.',
    icon: 'CookingPot',
    displayOrder: 3,
    isActive: true,
  },
  {
    _id: 'svc-4',
    title: 'Renovation Services',
    description: 'Transform your existing space with our renovation expertise. We breathe new life into old spaces.',
    content: 'Our renovation services cover everything from minor updates to complete transformations. We work with your existing layout to create a fresh new look while minimizing disruption to your daily life.',
    icon: 'Hammer',
    displayOrder: 4,
    isActive: true,
  },
];

export const staticProjects = [
  {
    _id: 'proj-1',
    title: 'Modern Villa',
    slug: 'modern-villa',
    description: 'A stunning modern villa that blends contemporary design with warm, inviting spaces. Every room has been carefully curated to create a harmonious living experience.',
    content: 'A stunning modern villa that blends contemporary design with warm, inviting spaces. Every room has been carefully curated to create a harmonious living experience. The open-plan living area features floor-to-ceiling windows that flood the space with natural light, while the carefully selected materials and textures add depth and warmth.',
    category: 'Residential',
    categories: ['Residential'],
    location: 'Bangalore',
    area: '4500 sq ft',
    budget: '₹85L',
    duration: '6 months',
    clientName: 'Mr. & Mrs. Sharma',
    completionDate: '2024-06-15',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=60',
    featuredImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=60',
    featured: true,
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=60',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=60',
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600&q=60',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=60',
    ],
  },
  {
    _id: 'proj-2',
    title: 'Luxury Apartment',
    slug: 'luxury-apartment',
    description: 'A sophisticated apartment design that maximizes space while maintaining elegance and comfort throughout.',
    content: 'A sophisticated apartment design that maximizes space while maintaining elegance and comfort throughout. The design incorporates smart storage solutions and multi-functional furniture to make the most of every square foot.',
    category: 'Residential',
    categories: ['Residential'],
    location: 'Mumbai',
    area: '2200 sq ft',
    budget: '₹45L',
    duration: '4 months',
    clientName: 'Ms. Priya Patel',
    completionDate: '2024-03-20',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=60',
    featuredImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=60',
    featured: true,
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=60',
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600&q=60',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=60',
    ],
  },
  {
    _id: 'proj-3',
    title: 'Corporate Office',
    slug: 'corporate-office',
    description: 'A modern office space designed to foster collaboration, creativity, and productivity.',
    content: 'A modern office space designed to foster collaboration, creativity, and productivity. The open-plan layout with dedicated quiet zones, collaboration areas, and breakout spaces creates a dynamic work environment.',
    category: 'Commercial',
    categories: ['Commercial'],
    location: 'Bangalore',
    area: '12000 sq ft',
    budget: '₹2.5Cr',
    duration: '8 months',
    clientName: 'TechCorp Solutions',
    completionDate: '2024-01-10',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=60',
    featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=60',
    featured: true,
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=60',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=60',
    ],
  },
  {
    _id: 'proj-4',
    title: 'Restaurant Design',
    slug: 'restaurant-design',
    description: 'An atmospheric restaurant interior that combines warm lighting with contemporary design elements.',
    content: 'An atmospheric restaurant interior that combines warm lighting with contemporary design elements. The space features a carefully curated ambiance that enhances the dining experience.',
    category: 'Commercial',
    categories: ['Commercial'],
    location: 'Delhi',
    area: '3500 sq ft',
    budget: '₹1.2Cr',
    duration: '5 months',
    clientName: 'Spice Garden Hospitality',
    completionDate: '2023-11-30',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=60',
    featuredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=60',
    featured: false,
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=60',
    ],
  },
  {
    _id: 'proj-5',
    title: 'Modular Kitchen',
    slug: 'modular-kitchen',
    description: 'A state-of-the-art modular kitchen with smart storage, premium finishes, and ergonomic design.',
    content: 'A state-of-the-art modular kitchen with smart storage, premium finishes, and ergonomic design. Every element is designed for both beauty and functionality.',
    category: 'Kitchen',
    categories: ['Kitchen'],
    location: 'Hyderabad',
    area: '250 sq ft',
    budget: '₹12L',
    duration: '6 weeks',
    clientName: 'Mr. Rajesh Kumar',
    completionDate: '2024-08-05',
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=60',
    featuredImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=60',
    featured: false,
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=60',
    ],
  },
  {
    _id: 'proj-6',
    title: 'Penthouse Suite',
    slug: 'penthouse-suite',
    description: 'An exclusive penthouse with panoramic views, featuring premium materials and bespoke furnishings.',
    content: 'An exclusive penthouse with panoramic views, featuring premium materials and bespoke furnishings. Every detail has been meticulously crafted to create the ultimate luxury living experience.',
    category: 'Residential',
    categories: ['Residential'],
    location: 'Bangalore',
    area: '6000 sq ft',
    budget: '₹1.8Cr',
    duration: '10 months',
    clientName: 'Mr. Arjun Mehta',
    completionDate: '2024-09-01',
    coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=60',
    featuredImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=60',
    featured: true,
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=60',
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600&q=60',
    ],
  },
];

export const staticTestimonials = [
  {
    _id: 'test-1',
    clientName: 'Ananya Sharma',
    clientTitle: 'Homeowner',
    company: '',
    content: 'AkInteriors transformed our home into a stunning living space. Their attention to detail and understanding of our aesthetic preferences made the entire process seamless. We absolutely love every corner of our new home!',
    rating: 5,
    isActive: true,
    displayOrder: 1,
  },
  {
    _id: 'test-2',
    clientName: 'Vikram Patel',
    clientTitle: 'CEO',
    company: 'TechCorp Solutions',
    content: 'They designed our new office and the result exceeded our expectations. The team understood our brand culture and translated it perfectly into the workspace. Our employees love the new environment.',
    rating: 5,
    isActive: true,
    displayOrder: 2,
  },
  {
    _id: 'test-3',
    clientName: 'Priya & Rahul Mehta',
    clientTitle: 'Homeowners',
    company: '',
    content: 'From the initial consultation to the final reveal, the experience was exceptional. Our modular kitchen is not just beautiful but incredibly functional. Highly recommend their services!',
    rating: 5,
    isActive: true,
    displayOrder: 3,
  },
  {
    _id: 'test-4',
    clientName: 'Neha Gupta',
    clientTitle: 'Restaurant Owner',
    company: 'Spice Garden',
    content: 'Our restaurant interior has received so many compliments from customers. The ambiance they created perfectly matches our brand identity. Professional, creative, and reliable team.',
    rating: 4,
    isActive: true,
    displayOrder: 4,
  },
  {
    _id: 'test-5',
    clientName: 'Dr. Suresh Kumar',
    clientTitle: 'Homeowner',
    company: '',
    content: 'We hired AkInteriors for a complete home renovation. They managed everything from design to execution with utmost professionalism. The project was completed on time and within budget.',
    rating: 5,
    isActive: true,
    displayOrder: 5,
  },
];

export const staticTeamMembers = [
  {
    _id: 'team-1',
    name: 'Arun Kumar',
    role: 'Founder & Principal Designer',
    bio: 'With over 20 years of experience in interior design, Arun leads the creative vision at AkInteriors.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=350&q=60',
    isActive: true,
    displayOrder: 1,
    socialLinks: { linkedin: '#', twitter: '#', instagram: '#' },
  },
  {
    _id: 'team-2',
    name: 'Shweta Reddy',
    role: 'Senior Interior Designer',
    bio: 'Shweta specializes in residential interiors with a passion for creating warm, inviting spaces.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=350&q=60',
    isActive: true,
    displayOrder: 2,
    socialLinks: { linkedin: '#', twitter: '#', instagram: '#' },
  },
  {
    _id: 'team-3',
    name: 'Ravi Deshmukh',
    role: 'Project Manager',
    bio: 'Ravi ensures every project is delivered on time, within budget, and to the highest quality standards.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&q=60',
    isActive: true,
    displayOrder: 3,
    socialLinks: { linkedin: '#', twitter: '#', instagram: '#' },
  },
  {
    _id: 'team-4',
    name: 'Kavita Singh',
    role: 'Junior Designer',
    bio: 'Kavita brings fresh perspectives and creative energy to every project she works on.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=350&q=60',
    isActive: true,
    displayOrder: 4,
    socialLinks: { linkedin: '#', twitter: '#', instagram: '#' },
  },
];

export const staticFAQs = [
  {
    _id: 'faq-1',
    question: 'What is the typical timeline for a residential interior design project?',
    answer: 'The timeline varies based on the scope of work. A typical apartment design takes 3-4 months, while a full home or villa project can take 6-8 months. We provide a detailed timeline during the initial consultation.',
    order: 1,
    isActive: true,
  },
  {
    _id: 'faq-2',
    question: 'How much does interior design cost?',
    answer: 'Our design fees are based on the project scope and complexity. We offer different packages to suit various budgets. During the free consultation, we provide a detailed quotation with complete transparency.',
    order: 2,
    isActive: true,
  },
  {
    _id: 'faq-3',
    question: 'Do you handle both design and execution?',
    answer: 'Yes, we offer end-to-end services from concept to completion. Our team manages everything including design, procurement, project management, and installation.',
    order: 3,
    isActive: true,
  },
  {
    _id: 'faq-4',
    question: 'Can I work with you if I already have a property under construction?',
    answer: 'Absolutely! We regularly collaborate with architects and builders to ensure seamless integration of interior design with the architectural plans. Early involvement is recommended for best results.',
    order: 4,
    isActive: true,
  },
  {
    _id: 'faq-5',
    question: 'Do you offer consultation services if I just need design advice?',
    answer: 'Yes, we offer design consultation services for clients who need expert advice. This includes space planning, material selection, color consultation, and furniture recommendations.',
    order: 5,
    isActive: true,
  },
  {
    _id: 'faq-6',
    question: 'What areas do you serve?',
    answer: 'We are based in Bangalore and serve clients across Karnataka. For premium projects, we also work in Mumbai, Hyderabad, Chennai, and Delhi. Contact us to discuss your location.',
    order: 6,
    isActive: true,
  },
];

export const staticBlogPosts = [
  {
    _id: 'blog-1',
    title: 'Top Interior Design Trends for 2024',
    slug: 'top-interior-design-trends-2024',
    excerpt: 'Discover the hottest interior design trends of 2024, from biophilic design to bold color palettes.',
    content: `The world of interior design is constantly evolving, and 2024 brings exciting new trends that blend sustainability with luxury.

**Sustainable Luxury**
One of the biggest trends is sustainable luxury — using eco-friendly materials without compromising on aesthetics. Think reclaimed wood, natural stone, organic textiles, and energy-efficient lighting.

**Warm Neutrals**
Move over, cool grays. Warm neutrals like terracotta, sand, and warm beige are taking center stage.

**Biophilic Design**
Connecting with nature through design continues to be a major trend. Indoor plants, natural light, and organic materials create spaces that promote wellbeing.`,
    category: 'Interior Design',
    tags: ['trends', 'design', '2024'],
    author: 'AkInteriors Team',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=60',
    featuredImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=60',
    publishedAt: '2024-12-15',
    status: 'published',
  },
  {
    _id: 'blog-2',
    title: 'How to Choose the Perfect Color Palette for Your Home',
    slug: 'choose-perfect-color-palette-home',
    excerpt: 'A comprehensive guide to selecting colors that reflect your personality and create the desired ambiance.',
    content: `Choosing the right color palette is one of the most important decisions in interior design.

**Understand Color Psychology**
Colors evoke emotions. Blue promotes calmness, yellow brings energy, green creates balance, and neutral tones offer sophistication.

**Consider Lighting**
Natural and artificial lighting significantly affects how colors appear. Test samples at different times of the day.

**Start with a Focal Point**
Let a piece of art, a rug, or your favorite furniture item guide your color choices.`,
    category: 'Tips & Guides',
    tags: ['color', 'palette', 'home'],
    author: 'Shweta Reddy',
    coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=60',
    featuredImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=60',
    publishedAt: '2024-11-28',
    status: 'published',
  },
  {
    _id: 'blog-3',
    title: 'Maximizing Small Spaces: Smart Design Solutions',
    slug: 'maximizing-small-spaces',
    excerpt: 'Creative ideas to make the most of compact living spaces without compromising on style.',
    content: `Living in a small space doesn't mean sacrificing style or comfort.

**Multi-Functional Furniture**
Invest in furniture that serves multiple purposes — ottomans with storage, sofa-cum-beds, and wall-mounted desks.

**Mirrors and Lighting**
Strategic use of mirrors can make a room feel twice as large. Layered lighting creates depth and ambiance.

**Vertical Storage**
Use wall space effectively with floating shelves, tall cabinets, and wall-mounted organizers.`,
    category: 'Tips & Guides',
    tags: ['small spaces', 'storage', 'design'],
    author: 'Kavita Singh',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=60',
    featuredImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=60',
    publishedAt: '2024-11-10',
    status: 'published',
  },
];

export const staticHomepage = {
  sections: [
    {
      type: 'hero',
      slides: [
        {
          image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=60',
          imageLg: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1920&q=80',
          headline: 'Transforming Spaces Into Timeless Experiences',
          subheadline: 'Luxury Interior Design Solutions For Modern Living',
          ctaText: 'View Projects',
          ctaLink: '/projects',
        },
        {
          image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=60',
          imageLg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
          headline: 'Crafting Dreams Into Reality',
          subheadline: 'Bespoke Interior Design Services Tailored To Your Vision',
          ctaText: 'Get Free Quote',
          ctaLink: '/contact',
        },
        {
          image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=60',
          imageLg: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1920&q=80',
          headline: 'Where Elegance Meets Functionality',
          subheadline: 'Premium Design Solutions For Residential & Commercial Spaces',
          ctaText: 'Our Services',
          ctaLink: '/services',
        },
      ],
      stats: [
        { value: 500, suffix: '+', label: 'Projects Delivered' },
        { value: 16, suffix: '+', label: 'Years Experience' },
        { value: 25, suffix: '+', label: 'Expert Designers' },
        { value: 98, suffix: '%', label: 'Client Satisfaction' },
      ],
    },
    {
      type: 'about',
      heading: 'Crafting Extraordinary Spaces Since 2009',
      content: 'Founded in 2009, AkInteriors has grown from a small design studio into one of India\'s most respected interior design firms. Our journey has been defined by a relentless pursuit of excellence and a passion for creating spaces that transform lives.\nWith a team of 25+ talented designers, architects, and craftsmen, we have delivered over 500 projects across residential, commercial, and hospitality sectors.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=60',
    },
    {
      type: 'why-choose-us',
      items: [
        { icon: 'Star', title: 'Award-Winning Design', description: 'Recognized nationally for innovative and exceptional interior design solutions.' },
        { icon: 'Gem', title: 'Premium Quality', description: 'We use only the finest materials and work with trusted craftsmen and suppliers.' },
        { icon: 'Eye', title: 'Attention to Detail', description: 'Every element, from lighting to textures, is thoughtfully curated for perfection.' },
        { icon: 'Clock', title: 'Timely Delivery', description: 'We respect your time and ensure every project is completed on schedule.' },
        { icon: 'Monitor', title: '3D Visualization', description: 'See your space come to life with photorealistic 3D renders before execution.' },
        { icon: 'CheckCircle2', title: 'End-to-End Service', description: 'From concept to completion, we handle everything so you can relax.' },
      ],
    },
    {
      type: 'process',
      steps: [
        { step: 1, title: 'Consultation', description: 'We begin with a detailed discussion to understand your vision, requirements, and budget.' },
        { step: 2, title: 'Design Concept', description: 'Our team creates mood boards, layouts, and 3D visualizations for your approval.' },
        { step: 3, title: 'Planning & Procurement', description: 'We source materials, finalize timelines, and coordinate with all stakeholders.' },
        { step: 4, title: 'Execution', description: 'Our skilled team brings the design to life with meticulous craftsmanship.' },
        { step: 5, title: 'Handover', description: 'We conduct a final walkthrough, address any touches, and hand over your dream space.' },
      ],
    },
  ],
};

export const staticNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const staticBranding = {
  siteName: 'AkInteriors',
  logo: '',
};

export const staticFooter = {
  description: 'Transforming spaces into timeless experiences. We create luxury interiors that reflect your personality and elevate your lifestyle.',
  quickLinks: staticNavLinks,
  serviceLinks: [
    { label: 'Residential Interiors', href: '/services' },
    { label: 'Commercial Interiors', href: '/services' },
    { label: 'Modular Kitchens', href: '/services' },
    { label: 'Renovation', href: '/services' },
  ],
  newsletterTitle: 'Subscribe to our newsletter',
  copyright: 'AkInteriors. All rights reserved.',
};

export const staticSocialLinks = {
  links: [
    { platform: 'Facebook', url: '#', icon: 'Globe' },
    { platform: 'Instagram', url: '#', icon: 'Camera' },
    { platform: 'LinkedIn', url: '#', icon: 'Briefcase' },
    { platform: 'YouTube', url: '#', icon: 'Play' },
  ],
};

export const staticSEOSettings = {
  metaTitle: 'AkInteriors | Luxury Interior Design Agency',
  metaDescription: 'Transforming spaces into timeless experiences. Premium interior design solutions for residential and commercial spaces in Bangalore.',
  keywords: ['interior design', 'luxury interiors', 'home interiors', 'commercial interiors', 'Bangalore interior designers'],
  ogImage: '/og-image.jpg',
};

export const staticNavigation = {
  links: staticNavLinks,
  ctaText: 'Get Free Quote',
  ctaLink: '/contact',
};

export const staticContactPage = {
  heading: 'Get In Touch',
  subtitle: 'Let\'s discuss how we can transform your space.',
  branches: [
    {
      isPrimary: true,
      name: 'Bangalore Studio',
      email: 'info@akinteriors.com',
      phone: '+91 99999 99999',
      address: '123 Design Street, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      zip: '560001',
      workingHours: 'Mon-Sat: 10:00 AM - 7:00 PM',
    },
  ],
};

export const staticAboutPage = {
  heading: 'About AkInteriors',
  subtitle: 'Crafting exceptional spaces that inspire, delight, and endure.',
  image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=60',
  content: 'Founded in 2009, AkInteriors has grown from a small design studio into one of India\'s most respected interior design firms. Our journey has been defined by a relentless pursuit of excellence and a passion for creating spaces that transform lives.\nWith a team of 25+ talented designers, architects, and craftsmen, we have delivered over 500 projects across residential, commercial, and hospitality sectors. Our work has been featured in leading design publications and recognized with numerous industry awards.\nAt the heart of our philosophy is the belief that great design is not just about aesthetics — it\'s about understanding people, their lifestyles, and their aspirations.',
  highlights: [
    { icon: 'Award', label: 'Excellence', description: 'We strive for perfection in every project.' },
    { icon: 'Target', label: 'Innovation', description: 'We embrace new ideas and cutting-edge designs.' },
    { icon: 'Users', label: 'Collaboration', description: 'We work closely with clients to bring visions to life.' },
    { icon: 'Eye', label: 'Integrity', description: 'We maintain transparency in all our dealings.' },
  ],
  stats: [
    { value: '500+', label: 'Projects Delivered' },
    { value: '16+', label: 'Years of Experience' },
    { value: '25+', label: 'Team Members' },
    { value: '98%', label: 'Client Satisfaction' },
  ],
  valuesHeading: 'Our Values',
  valuesSubtitle: 'What We Stand For',
  timelineHeading: 'Our Journey',
  timelineSubtitle: 'Milestones & Achievements',
  timeline: [
    { year: '2009', event: 'AkInteriors founded in Bangalore with a vision to transform interior design.' },
    { year: '2012', event: 'Expanded team and completed 100th project milestone.' },
    { year: '2015', event: 'Won "Best Interior Design Firm" award at National Design Awards.' },
    { year: '2018', event: 'Opened second studio and launched commercial interiors division.' },
    { year: '2021', event: 'Crossed 500 projects and expanded into 4 new cities.' },
    { year: '2024', event: 'Recognized among Top 10 Interior Design firms in India.' },
  ],
};

export const staticSettings = {
  logo: '',
  favicon: '',
  siteName: 'AkInteriors',
  tagline: 'Luxury Interior Design Agency',
  email: 'info@akinteriors.com',
  phone: '+91 99999 99999',
  address: '123 Design Street, Indiranagar, Bangalore',
  socialLinks: {
    facebook: '#',
    instagram: '#',
    linkedin: '#',
    youtube: '#',
    pinterest: '#',
  },
  heroTitle: 'Transforming Spaces Into Timeless Experiences',
  heroSubtitle: 'Luxury Interior Design Solutions For Modern Living',
  aboutContent: 'Founded in 2009, AkInteriors has grown from a small design studio into one of India\'s most respected interior design firms.',
  seoSettings: {
    title: 'AkInteriors | Luxury Interior Design Agency',
    description: 'Premium interior design solutions for residential and commercial spaces.',
    keywords: 'interior design, luxury interiors',
  },
  whatsappNumber: '+919999999999',
};

export const staticDashboardStats = {
  totalProjects: 6,
  publishedProjects: 6,
  totalServices: 4,
  totalInquiries: 0,
  unreadInquiries: 0,
  totalTestimonials: 5,
  totalFAQs: 6,
  totalImages: 0,
};

export const staticImages: {
  _id: string;
  url: string;
  alt: string;
  category: string;
  isActive: boolean;
  displayOrder: number;
  isBranding: boolean;
  section: string;
}[] = [];

export const staticAdminData = {
  projects: staticProjects,
  services: staticServices,
  teamMembers: staticTeamMembers,
  testimonials: staticTestimonials,
  faqs: staticFAQs,
  blogPosts: staticBlogPosts,
  inquiries: [],
};
