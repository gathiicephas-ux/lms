/**
 * Brand Constants - The Cephas Effect™
 * Use these EVERYWHERE — never hardcode differently
 */

export const BRAND = {
  name: 'The Cephas Effect™',
  programme: 'Corporate Authority Programme™',
  framework: 'ACTIVATE™',
  tagline: 'Authority that converts.',
  website: 'https://www.thecephaseffect.co.ke',
  email: 'hello@thecephaseffect.co.ke',
  phone: '+254 739 040 400',
  whatsapp: '0728702369',
  guarantee: '10 qualified inbound conversations in 90 days or we continue at no additional cost.',

  tiers: {
    foundation: {
      id: 'foundation',
      name: 'Foundation',
      price: 185000,
      teamSize: 5,
      currency: 'KES',
      stripePriceId: 'price_foundation_kes',
    },
    authority: {
      id: 'authority',
      name: 'Authority',
      price: 345000,
      teamSize: 10,
      currency: 'KES',
      stripePriceId: 'price_authority_kes',
    },
    domination: {
      id: 'domination',
      name: 'Domination',
      price: 580000,
      teamSize: 20,
      currency: 'KES',
      stripePriceId: 'price_domination_kes',
    },
  },

  colors: {
    navy: '#0A1628',
    navy2: '#0F2040',
    gold: '#C9A84C',
    gold2: '#E8C96A',
    cream: '#F5F0E8',
    muted: '#7A7060',
    error: '#DC2626',
    success: '#16A34A',
    warning: '#EA580C',
  },

  fonts: {
    display: "'Cormorant Garamond', serif", // For headings
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", // For body
  },

  admin: {
    email: 'gathiicephas@gmail.com',
    password: 'busysignal12', // Should be changed on first login
  },

  modules: {
    count: 8,
    names: [
      'Authority Fundamentals',
      'Personal Brand Mastery',
      'Thought Leadership',
      'Media & Visibility',
      'Sales Conversion',
      'Relationship Building',
      'Growth Acceleration',
      'Lifetime Authority',
    ],
  },

  activities: {
    maxRetakes: 3,
    passingScore: 70,
    certificateRequirement: 100, // Must pass all 8 modules
  },

  pricing: {
    stripeTestMode: process.env.NODE_ENV !== 'production',
    currencies: ['KES', 'USD'],
  },
} as const;

/**
 * Module Details - Fully detailed for each of the 8 modules
 */
export const MODULES = {
  authority_fundamentals: {
    id: 1,
    slug: 'authority-fundamentals',
    title: 'Authority Fundamentals',
    order: 1,
    icon: '🎯',
    lessons: 6,
    quizzes: 1,
    duration: '8 hours',
    description: 'Master the foundations of personal authority and the ACTIVATE™ Framework',
  },
  personal_brand: {
    id: 2,
    slug: 'personal-brand-mastery',
    title: 'Personal Brand Mastery',
    order: 2,
    icon: '⭐',
    lessons: 7,
    quizzes: 1,
    duration: '10 hours',
    description: 'Build a compelling personal brand that attracts your ideal clients',
  },
  thought_leadership: {
    id: 3,
    slug: 'thought-leadership',
    title: 'Thought Leadership',
    order: 3,
    icon: '💡',
    lessons: 6,
    quizzes: 1,
    duration: '9 hours',
    description: 'Establish yourself as a thought leader in your industry',
  },
  media_visibility: {
    id: 4,
    slug: 'media-visibility',
    title: 'Media & Visibility',
    order: 4,
    icon: '📢',
    lessons: 7,
    quizzes: 1,
    duration: '10 hours',
    description: 'Master media strategy and maximize your public visibility',
  },
  sales_conversion: {
    id: 5,
    slug: 'sales-conversion',
    title: 'Sales Conversion',
    order: 5,
    icon: '💰',
    lessons: 8,
    quizzes: 1,
    duration: '11 hours',
    description: 'Convert prospects into paying clients with authority-based sales',
  },
  relationship_building: {
    id: 6,
    slug: 'relationship-building',
    title: 'Relationship Building',
    order: 6,
    icon: '🤝',
    lessons: 6,
    quizzes: 1,
    duration: '9 hours',
    description: 'Build authentic relationships that lead to long-term business',
  },
  growth_acceleration: {
    id: 7,
    slug: 'growth-acceleration',
    title: 'Growth Acceleration',
    order: 7,
    icon: '🚀',
    lessons: 7,
    quizzes: 1,
    duration: '10 hours',
    description: 'Scale your authority and business exponentially',
  },
  lifetime_authority: {
    id: 8,
    slug: 'lifetime-authority',
    title: 'Lifetime Authority',
    order: 8,
    icon: '👑',
    lessons: 7,
    quizzes: 1,
    duration: '10 hours',
    description: 'Build a legacy of authority and impact',
  },
} as const;
