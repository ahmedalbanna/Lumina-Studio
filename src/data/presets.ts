import { HeadshotStyle, AttireOption } from '../types';

export const ASSET_PATHS = {
  sampleSelfie: '/src/assets/images/sample_selfie_1791690870368.jpg',
  corporateGrey: '/src/assets/images/headshot_corporate_grey_1791690881541.jpg',
  techOffice: '/src/assets/images/headshot_tech_office_1791690892153.jpg',
  outdoorLight: '/src/assets/images/headshot_outdoor_light_1791690902478.jpg',
  studioHero: '/src/assets/images/studio_hero_cover_1791690912086.jpg',
};

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate-grey',
    name: 'Corporate Grey Backdrop',
    category: 'Corporate',
    description: 'Timeless studio portrait with a textured slate grey mottled backdrop and crisp softbox key lighting.',
    lighting: '85mm f/2.8 studio lighting with soft fill and rim hair light',
    backgroundDescription: 'Seamless textured slate neutral studio backdrop',
    imageThumbnail: ASSET_PATHS.corporateGrey,
    tags: ['Fortune 500', 'Finance', 'Legal', 'Executive'],
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech Office',
    category: 'Tech',
    description: 'Sleek, sunlit architectural open-plan glass headquarters with lush indoor greenery and creamy bokeh.',
    lighting: 'Bright natural ambient light blended with clean studio key light',
    backgroundDescription: 'Contemporary open glass atrium with warm indoor plants',
    imageThumbnail: ASSET_PATHS.techOffice,
    tags: ['Tech Lead', 'Startup Founder', 'Product', 'VC'],
  },
  {
    id: 'outdoor-natural',
    name: 'Outdoor Natural Light',
    category: 'Natural',
    description: 'Golden hour outdoor portrait with warm natural backlighting and lush botanical bokeh.',
    lighting: 'Warm golden hour rim light with soft flattering bounce fill',
    backgroundDescription: 'Lush park greenery with gentle sun flare',
    imageThumbnail: ASSET_PATHS.outdoorLight,
    tags: ['Approachable', 'Consultant', 'Speaker', 'Creative'],
  },
  {
    id: 'executive-penthouse',
    name: 'Executive Penthouse',
    category: 'Corporate',
    description: 'Corner high-rise executive suite overlooking a metropolitan city skyline at dusk.',
    lighting: 'Cinematic interior architectural ambient glow with soft key',
    backgroundDescription: 'Panoramic glass skyline with city dusk horizon',
    imageThumbnail: ASSET_PATHS.corporateGrey, // styled fallback
    tags: ['C-Suite', 'Board Member', 'Enterprise', 'Global'],
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    category: 'Creative',
    description: 'Minimalist designer studio with sculpted architectural shadows and warm terracotta tones.',
    lighting: 'Soft directional window light with artistic contrast',
    backgroundDescription: 'Warm ivory and terracotta arch geometry',
    imageThumbnail: ASSET_PATHS.techOffice, // styled fallback
    tags: ['Design', 'Brand', 'Architect', 'Media'],
  },
  {
    id: 'bw-editorial',
    name: 'Black & White Editorial',
    category: 'Editorial',
    description: 'Timeless chiaroscuro monochrome portraiture with rich velvety contrast and fine grain.',
    lighting: 'Classic Hollywood Rembrandt key lighting',
    backgroundDescription: 'Deep charcoal gradient backdrop',
    imageThumbnail: ASSET_PATHS.corporateGrey, // styled fallback
    tags: ['Author', 'Journalist', 'Keynote', 'Editorial'],
  },
  {
    id: 'academic-library',
    name: 'Academic Heritage Library',
    category: 'Editorial',
    description: 'Distinguished mahogany paneling and blurred antique leather book bindings.',
    lighting: 'Warm tungsten reading lamp glow with soft portrait fill',
    backgroundDescription: 'Warm heritage library bookshelves in soft focus',
    imageThumbnail: ASSET_PATHS.outdoorLight, // styled fallback
    tags: ['Professor', 'Researcher', 'Doctor', 'Historian'],
  },
  {
    id: 'warm-cafe',
    name: 'Cozy Workspace / Loft',
    category: 'Creative',
    description: 'Exposed brick, polished brass fixtures, and relaxed warm artisanal ambiance.',
    lighting: 'Warm diffused coffeehouse interior illumination',
    backgroundDescription: 'Warm brick loft with bokeh string lights',
    imageThumbnail: ASSET_PATHS.techOffice, // styled fallback
    tags: ['Freelancer', 'Coach', 'Writer', 'Remote Work'],
  },
];

export const ATTIRE_OPTIONS: AttireOption[] = [
  {
    id: 'navy-suit',
    name: 'Tailored Navy/Charcoal Suit',
    description: 'Classic wool blazer with crisp collared dress shirt/blouse',
  },
  {
    id: 'smart-blazer',
    name: 'Smart Casual Blazer',
    description: 'Unstructured dark blazer over premium neutral tee or knit',
  },
  {
    id: 'tech-minimalist',
    name: 'Tech Minimalist Mock-Neck',
    description: 'Black or charcoal fine merino mock-neck, modern aesthetic',
  },
  {
    id: 'executive-formal',
    name: 'Formal Executive Silk & Lapel',
    description: 'High-contrast luxury business tailoring and crisp details',
  },
  {
    id: 'casual-buttondown',
    name: 'Oxford Button-Down',
    description: 'Smart casual light blue or white Oxford shirt with open collar',
  },
  {
    id: 'keep-attire',
    name: 'Elevate Existing Outfit',
    description: 'Professionalized studio grade rendition of your current clothing',
  },
];

export const EXPRESSION_OPTIONS = [
  { id: 'warm', label: 'Warm & Approachable', desc: 'Friendly authentic smile, welcoming LinkedIn presence' },
  { id: 'confident', label: 'Confident & Executive', desc: 'Calm authoritative gaze, subtle composed smile' },
  { id: 'visionary', label: 'Visionary & Contemplative', desc: 'Slight 3/4 angle, focused intellectual look' },
];

export const EDIT_SUGGESTIONS = [
  'Change suit color to charcoal grey',
  'Add stylish thin gold-frame glasses',
  'Make smile slightly warmer and more natural',
  'Add soft golden hour rim light around hair',
  'Change background to blurred modern library',
  'Switch attire to dark tailored blazer over black tee',
  'Adjust lighting to softer high-key studio glow',
  'Make the background bokeh slightly softer',
];
