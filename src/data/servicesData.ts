import { ServiceCategory } from '../types';

export const OFFICIAL_SERVICES: ServiceCategory[] = [
  {
    id: 'hair-services',
    name: 'Hair Services',
    showcaseGroup: 'Hair & Styling',
    description: 'Customized haircuts, expert hair styling, creative coloring, and professional hair care tailored to your preferences.',
    tag: 'Hair Care',
    highlights: ['Haircut & Trimming', 'Hair Coloring', 'Blowdry & Styling', 'Texture Treatments']
  },
  {
    id: 'facial',
    name: 'Facial',
    showcaseGroup: 'Facial & Skincare',
    description: 'Nourishing facial treatments designed to cleanse, rejuvenate, and hydrate your skin in a serene environment.',
    tag: 'Skincare',
    highlights: ['Deep Cleansing', 'Hydration Care', 'Skin Radiance', 'Relaxing Massage']
  },
  {
    id: 'cleanup',
    name: 'Cleanup',
    showcaseGroup: 'Facial & Skincare',
    description: 'Essential skin cleanup routines targeting pores, impurities, and daily skin refresh for a clear, fresh look.',
    tag: 'Skincare',
    highlights: ['Pore Cleansing', 'Gentle Exfoliation', 'Skin Soothing']
  },
  {
    id: 'hair-spa',
    name: 'Hair Spa',
    showcaseGroup: 'Hair Spa',
    description: 'Deep conditioning and intensive scalp therapy to nourish hair follicles and provide deep relaxation.',
    tag: 'Therapy',
    highlights: ['Scalp Nourishment', 'Steam Infusion', 'Relaxing Head Massage']
  },
  {
    id: 'nail-services',
    name: 'Nail Services',
    showcaseGroup: 'Nails & Hand Care',
    description: 'Precision nail shaping, buffing, cuticle care, and professional nail art polish finishes.',
    tag: 'Nails',
    highlights: ['Nail Art & Gel', 'Shaping & Buffing', 'Long-lasting Polish']
  },
  {
    id: 'manicure-pedicure',
    name: 'Manicure & Pedicure',
    showcaseGroup: 'Nails & Hand Care',
    description: 'Complete hands and feet pampering rituals with gentle soaking, exfoliation, massage, and nail care.',
    tag: 'Hand & Feet',
    highlights: ['Soothing Foot Soak', 'Hand Scrub & Massage', 'Cuticle Perfection']
  },
  {
    id: 'threading',
    name: 'Threading',
    showcaseGroup: 'Threading & Waxing',
    description: 'Gentle, precise eyebrow shaping and facial hair threading using gentle, hygienic cotton thread techniques.',
    tag: 'Grooming',
    highlights: ['Eyebrow Shaping', 'Upper Lip', 'Full Face Threading']
  },
  {
    id: 'rica-waxing',
    name: 'Rica Waxing',
    showcaseGroup: 'Threading & Waxing',
    description: 'Premium Italian liposoluble Rica waxing for gentle hair removal suitable for sensitive skin types.',
    tag: 'Gentle Wax',
    highlights: ['Liposoluble Wax', 'Gentle on Skin', 'Smooth Finish']
  },
  {
    id: 'hair-reduction',
    name: 'Hair Reduction Treatment',
    showcaseGroup: 'Hair Services',
    description: 'Targeted smoothing and hair volume management solutions to maintain silky, manageable hair.',
    tag: 'Specialist',
    highlights: ['Frizz Control', 'Deep Conditioning', 'Smooth Finish']
  },
  {
    id: 'bridal-package',
    name: 'Bridal Package',
    showcaseGroup: 'Makeup & Bridal',
    description: 'Comprehensive bridal beauty preparation including pre-bridal skincare, customized makeup, hair styling, and draping.',
    tag: 'Bridal',
    highlights: ['Pre-Bridal Rituals', 'Bridal Makeover', 'Hair Styling & Draping']
  },
  {
    id: 'sider-package',
    name: 'Sider Package',
    showcaseGroup: 'Makeup & Bridal',
    description: 'Curated styling and beauty packages for bridesmaids, family members, and attendees for festive occasions.',
    tag: 'Events',
    highlights: ['Party Makeup', 'Festive Hairstyles', 'Saree & Dupatta Draping']
  }
];

export interface ShowcaseCardData {
  id: string;
  categoryName: string;
  targetServiceId: string;
  description: string;
  iconName: string;
  features: string[];
}

export const SHOWCASE_CARDS: ShowcaseCardData[] = [
  {
    id: 'hair-styling',
    categoryName: 'Hair & Styling',
    targetServiceId: 'hair-services',
    description: 'Expert haircuts, creative styling, coloring, and tailored haircare routines designed to bring out your natural texture.',
    iconName: 'Scissors',
    features: ['Precision Cuts', 'Coloring & Highlights', 'Blowouts & Styling']
  },
  {
    id: 'facial-skincare',
    categoryName: 'Facial & Skincare',
    targetServiceId: 'facial',
    description: 'Therapeutic facials and clarifying cleanups to soothe, brighten, and restore your skin’s vitality in comfort.',
    iconName: 'Sparkles',
    features: ['Hydrating Facials', 'Gentle Cleanups', 'Botanical Serums']
  },
  {
    id: 'nails-handcare',
    categoryName: 'Nails & Hand Care',
    targetServiceId: 'manicure-pedicure',
    description: 'Pampering manicure and pedicure rituals, alongside meticulous nail art and polish for immaculate hands and feet.',
    iconName: 'HeartHandshake',
    features: ['Spa Pedicure', 'Nourishing Manicure', 'Custom Nail Design']
  },
  {
    id: 'threading-waxing',
    categoryName: 'Threading & Waxing',
    targetServiceId: 'rica-waxing',
    description: 'Precision eyebrow definition and gentle Rica liposoluble waxing for soft, smooth, irritation-free grooming.',
    iconName: 'Feather',
    features: ['Eyebrow Architecture', 'Rica Liposoluble Wax', 'Hygienic Technique']
  },
  {
    id: 'hair-spa',
    categoryName: 'Hair Spa',
    targetServiceId: 'hair-spa',
    description: 'Restorative scalp and deep fiber treatments that relieve tension, strengthen strands, and revive shine.',
    iconName: 'Droplets',
    features: ['Deep Conditioning', 'Scalp Massage', 'Steam Therapy']
  },
  {
    id: 'makeup-bridal',
    categoryName: 'Makeup & Bridal',
    targetServiceId: 'bridal-package',
    description: 'Full bridal consultations, bespoke makeover packages, and sider styling for memorable celebrations.',
    iconName: 'Crown',
    features: ['Bespoke Bridal Looks', 'Sider Packages', 'Pre-Wedding Care']
  }
];

export const EXPERIENCE_ASPECTS = [
  { id: 'hospitality', label: 'Warm Hospitality' },
  { id: 'hygiene', label: 'Impeccable Hygiene' },
  { id: 'consultation', label: 'Expert Consultation' },
  { id: 'ambiance', label: 'Relaxing Ambiance' },
  { id: 'timeliness', label: 'Punctual Service' },
];

export const SALON_INFO = {
  name: 'Apple Beauty Salon',
  tagline: 'Your Experience. Your Story.',
  sinceYear: '1996',
  address: 'Shop No. 8/7, Radhe Signature, Near Sahjanand City, Kudasan, Gandhinagar, Gujarat 382419, India.',
  phone: '+91 7984654149',
  phoneDisplay: '+91 79846 54149',
  hours: '10:00 AM – 8:30 PM daily (subject to confirmation)',
  websiteUrl: 'https://www.applebeautysalon.in/',
  servicesUrl: 'https://www.applebeautysalon.in/services',
  googleReviewUrl: 'https://g.page/r/CfqPqR1K8nwbEBM/review',
  locationBrief: 'Kudasan, Gandhinagar, Gujarat',
};
