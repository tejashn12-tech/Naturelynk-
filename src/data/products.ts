import { ProductCategory } from '../types';

export const categories: ProductCategory[] = [
  {
    id: 'coffee',
    name: 'Coffee (Arabica & Robusta)',
    tagline: 'Single-origin estate coffees from the Western Ghats of Karnataka (Kodagu, Chikmagalur & Hassan) processed under strict Indian Coffee Board grading standards.',
    heroImage: '/images/products/coffee-hero.jpg',
    types: [
      {
        id: 'coffee-plantation-aaa',
        name: 'Plantation AAA',
        shortDescription: 'Washed Arabica, largest screen size (Screen 19+). Apex export grade with pristine bean cleanliness, delicate acidity, and full body.',
        image: '/images/products/coffee-plantation-aaa.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Plantation AAA' },
          { label: 'Screen Size', value: 'Screen 19 (7.50 mm)' },
          { label: 'Moisture', value: '10.0% – 12.0%' },
          { label: 'Processing', value: 'Fully Washed' }
        ]
      },
      {
        id: 'coffee-plantation-aa',
        name: 'Plantation AA',
        shortDescription: 'Washed Arabica, large bold bean with balanced acidity, citrus undertones, and uniform bean consistency for specialty roasters.',
        image: '/images/products/coffee-plantation-aa.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Plantation AA' },
          { label: 'Screen Size', value: 'Screen 18 (7.10 mm)' },
          { label: 'Moisture', value: '10.0% – 12.5%' },
          { label: 'Processing', value: 'Fully Washed' }
        ]
      },
      {
        id: 'coffee-plantation-a',
        name: 'Plantation A',
        shortDescription: 'Washed Arabica, the gold-standard benchmark Indian export grade delivering bright flavor notes, clean cup profile, and reliable crema.',
        image: '/images/products/coffee-plantation-a.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Plantation A' },
          { label: 'Screen Size', value: 'Screen 17 (6.65 mm)' },
          { label: 'Moisture', value: '10.5% – 12.5%' },
          { label: 'Processing', value: 'Fully Washed' }
        ]
      },
      {
        id: 'coffee-plantation-pb',
        name: 'Plantation PB (Peaberry)',
        shortDescription: 'Washed Arabica, naturally fused oval single-seed bean with concentrated sugars, dense cell structure, and intense aroma.',
        image: '/images/products/coffee-plantation-pb.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Plantation PB' },
          { label: 'Screen Size', value: 'Round Hole (4.75 mm)' },
          { label: 'Moisture', value: '10.0% – 12.0%' },
          { label: 'Processing', value: 'Fully Washed' }
        ]
      },
      {
        id: 'coffee-cherry-ab',
        name: 'Cherry AB',
        shortDescription: 'Natural / dry-processed Arabica & Robusta, sun-dried on raised estate patios for heavy body, winey fruit notes, and rich sweetness.',
        image: '/images/products/coffee-cherry-ab.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Cherry AB' },
          { label: 'Screen Size', value: 'Screen 17 (6.65 mm)' },
          { label: 'Moisture', value: '11.0% – 12.5%' },
          { label: 'Processing', value: 'Natural (Sun-Dried)' }
        ]
      },
      {
        id: 'coffee-parchment-aa',
        name: 'Parchment AA',
        shortDescription: 'Washed high-elevation Robusta, bold bean size with deep chocolate notes, zero bitterness, and prized thick espresso crema.',
        image: '/images/products/coffee-parchment-aa.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Parchment AA' },
          { label: 'Screen Size', value: 'Screen 18 (7.10 mm)' },
          { label: 'Moisture', value: '10.5% – 12.0%' },
          { label: 'Processing', value: 'Washed' }
        ]
      },
      {
        id: 'coffee-cherry-c',
        name: 'Cherry C',
        shortDescription: 'Natural dry-processed Robusta, commercial and blending workhorse grade offering intense body and high solubility for blends.',
        image: '/images/products/coffee-cherry-c.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1521302200778-33500795e128?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Cherry C' },
          { label: 'Screen Size', value: 'Screen 14 (5.50 mm)' },
          { label: 'Moisture', value: '11.5% – 13.0%' },
          { label: 'Processing', value: 'Natural (Dry)' }
        ]
      }
    ]
  },
  {
    id: 'pepper',
    name: 'Pepper (Malabar Coast)',
    tagline: 'King of Spices sourced directly from the biodiversity belt of the Malabar Coast & Western Ghats, graded by bulk density and berry caliber.',
    heroImage: '/images/products/pepper-hero.jpg',
    types: [
      {
        id: 'pepper-tgseb',
        name: 'Tellicherry Garbled Special Extra Bold (TGSEB)',
        shortDescription: 'Apex grade of Indian black pepper (4.75mm+). Sun-matured berries boasting complex cedar woodiness and potent piperine heat.',
        image: '/images/products/pepper-tgseb.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'TGSEB' },
          { label: 'Bulk Density', value: '600 – 620 g/L' },
          { label: 'Moisture', value: '≤ 11.0%' },
          { label: 'Piperine', value: '4.8% – 5.5%' },
          { label: 'Essential Oil', value: '3.0% – 3.8%' }
        ]
      },
      {
        id: 'pepper-tgeb',
        name: 'Tellicherry Garbled Extra Bold (TGEB)',
        shortDescription: 'Select large bold berries prized worldwide for gourmet culinary finish, rich color uniformity, and high essential oil content.',
        image: '/images/products/pepper-tgeb.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'TGEB' },
          { label: 'Bulk Density', value: '575 – 590 g/L' },
          { label: 'Moisture', value: '≤ 11.5%' },
          { label: 'Piperine', value: '4.5% – 5.2%' },
          { label: 'Essential Oil', value: '2.8% – 3.4%' }
        ]
      },
      {
        id: 'pepper-mg1',
        name: 'Malabar Garbled MG1',
        shortDescription: 'Top garbled black pepper grade with high density, uniform dark wrinkling, and pungent peppery bite for international packing.',
        image: '/images/products/pepper-mg1.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'MG1' },
          { label: 'Bulk Density', value: '550 – 570 g/L' },
          { label: 'Moisture', value: '≤ 12.0%' },
          { label: 'Piperine', value: '4.2% – 4.8%' },
          { label: 'Essential Oil', value: '2.5% – 3.0%' }
        ]
      },
      {
        id: 'pepper-mg2',
        name: 'Malabar Garbled MG2',
        shortDescription: 'Standard export trade grade offering reliable oleoresin extraction value and pungent flavor profile for commercial spice manufacturing.',
        image: '/images/products/pepper-mg2.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'MG2' },
          { label: 'Bulk Density', value: '500 – 530 g/L' },
          { label: 'Moisture', value: '≤ 12.5%' },
          { label: 'Piperine', value: '4.0% – 4.5%' },
          { label: 'Essential Oil', value: '2.0% – 2.5%' }
        ]
      },
      {
        id: 'pepper-panniyur',
        name: 'Panniyur Variety',
        shortDescription: 'Karnataka & Kerala celebrated cultivar with elongated fruiting spikes, high individual berry weight, and bright pungent snap.',
        image: '/images/products/pepper-panniyur.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Panniyur-1' },
          { label: 'Bulk Density', value: '560 – 580 g/L' },
          { label: 'Moisture', value: '≤ 11.5%' },
          { label: 'Piperine', value: '4.6% – 5.3%' },
          { label: 'Essential Oil', value: '2.7% – 3.2%' }
        ]
      },
      {
        id: 'pepper-karimunda',
        name: 'Karimunda Variety',
        shortDescription: 'Heirloom high-yield South Indian variety renowned for deep black berry skin, compact clusters, and high essential oil retention.',
        image: '/images/products/pepper-karimunda.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Karimunda Heirloom' },
          { label: 'Bulk Density', value: '580 – 600 g/L' },
          { label: 'Moisture', value: '≤ 11.0%' },
          { label: 'Piperine', value: '4.7% – 5.4%' },
          { label: 'Essential Oil', value: '2.9% – 3.5%' }
        ]
      },
      {
        id: 'pepper-white',
        name: 'White Pepper (Double Washed)',
        shortDescription: 'Ripe red berries, water-retted to gently strip outer skin. Clean ivory spheres with subtle earthy heat and elegant finish.',
        image: '/images/products/pepper-white.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Double Washed White' },
          { label: 'Bulk Density', value: '600 – 630 g/L' },
          { label: 'Moisture', value: '≤ 12.0%' },
          { label: 'Piperine', value: '4.0% – 4.6%' },
          { label: 'Essential Oil', value: '2.0% – 2.5%' }
        ]
      },
      {
        id: 'pepper-green',
        name: 'Green Pepper (Dehydrated & Freeze-Dried)',
        shortDescription: 'Tender fresh green peppercorns preserved immediately after harvest to retain crisp botanical freshness and bright vegetal heat.',
        image: '/images/products/pepper-green.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Grade Code', value: 'Freeze-Dried Green' },
          { label: 'Bulk Density', value: '420 – 460 g/L' },
          { label: 'Moisture', value: '≤ 8.0%' },
          { label: 'Piperine', value: '3.8% – 4.2%' },
          { label: 'Essential Oil', value: '2.2% – 2.8%' }
        ]
      }
    ]
  },
  {
    id: 'cardamom',
    name: 'Cardamom (Western Ghats)',
    tagline: 'Queen of Spices: whole green capsules hand-harvested from mist-shrouded rainforest slopes, graded strictly by pod diameter (Alleppey system).',
    heroImage: '/images/products/cardamom-hero.jpg',
    types: [
      {
        id: 'cardamom-ageb',
        name: 'Alleppey Green Extra Bold (AGEB)',
        shortDescription: '8mm+ pod diameter, deep emerald green hue, fully filled with aromatic black seeds. The apex global luxury grade.',
        image: '/images/products/cardamom-ageb.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Pod Size', value: '8.0 mm+' },
          { label: 'Essential Oil', value: '8.0% – 9.5%' },
          { label: 'Moisture', value: '9.0% – 10.5%' }
        ]
      },
      {
        id: 'cardamom-agb',
        name: 'Alleppey Green Bold (AGB)',
        shortDescription: '7–8mm diameter pods, the premier commercial export benchmark for Middle Eastern kahwa and European confectionery.',
        image: '/images/products/cardamom-agb.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Pod Size', value: '7.0 mm – 8.0 mm' },
          { label: 'Essential Oil', value: '7.0% – 8.2%' },
          { label: 'Moisture', value: '9.5% – 11.0%' }
        ]
      },
      {
        id: 'cardamom-ags',
        name: 'Alleppey Green Superior (AGS)',
        shortDescription: '6–7mm pods delivering vibrant eucalyptus-menthol bouquet, uniform color retention, and high value-to-weight export ratio.',
        image: '/images/products/cardamom-ags.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Pod Size', value: '6.0 mm – 7.0 mm' },
          { label: 'Essential Oil', value: '6.5% – 7.5%' },
          { label: 'Moisture', value: '10.0% – 11.5%' }
        ]
      },
      {
        id: 'cardamom-ags1',
        name: 'AGS-1 Grade',
        shortDescription: '5.5–6mm pods with consistent seed development, tailored for premium tea blends, spice extracts, and bakery essences.',
        image: '/images/products/cardamom-ags1.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Pod Size', value: '5.5 mm – 6.0 mm' },
          { label: 'Essential Oil', value: '5.5% – 6.5%' },
          { label: 'Moisture', value: '10.0% – 12.0%' }
        ]
      },
      {
        id: 'cardamom-malabar',
        name: 'Malabar Variety',
        shortDescription: 'Indigenous Western Ghats ecotype with prostrate panicles, high cineole & terpinyl acetate content, and round pale green pods.',
        image: '/images/products/cardamom-malabar.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Pod Size', value: '6.5 mm – 7.5 mm' },
          { label: 'Essential Oil', value: '7.2% – 8.0%' },
          { label: 'Moisture', value: '9.5% – 11.0%' }
        ]
      },
      {
        id: 'cardamom-mysore',
        name: 'Mysore Variety',
        shortDescription: 'High-elevation erect variety featuring bold, ribbed capsules with outstanding emerald coloration and sweet floral undertones.',
        image: '/images/products/cardamom-mysore.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Pod Size', value: '7.0 mm – 8.2 mm' },
          { label: 'Essential Oil', value: '7.5% – 8.5%' },
          { label: 'Moisture', value: '9.0% – 10.5%' }
        ]
      },
      {
        id: 'cardamom-vazhukka',
        name: 'Vazhukka Variety',
        shortDescription: 'Naturally balanced hybrid combining Mysore bold capsule caliber with Malabar essential oil richness and uniform maturity.',
        image: '/images/products/cardamom-vazhukka.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Pod Size', value: '7.0 mm – 8.0 mm' },
          { label: 'Essential Oil', value: '7.0% – 8.0%' },
          { label: 'Moisture', value: '9.5% – 11.0%' }
        ]
      }
    ]
  },
  {
    id: 'turmeric',
    name: 'Turmeric (Golden Spice)',
    tagline: 'High-curcumin farm-cured rhizomes and polished fingers cultivated in fertile regional soils across Karnataka, Tamil Nadu, and Telangana.',
    heroImage: '/images/products/turmeric-hero.jpg',
    types: [
      {
        id: 'turmeric-salem-finger',
        name: 'Salem Finger',
        shortDescription: 'Slender, luminous golden yellow fingers with clean skin, fine aroma, and high consumer table presentation value.',
        image: '/images/products/turmeric-salem-finger.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Curcumin Content', value: '4.5% – 5.5%' },
          { label: 'Moisture', value: '≤ 10.0%' },
          { label: 'Origin Region', value: 'Salem, Tamil Nadu' }
        ]
      },
      {
        id: 'turmeric-erode-finger',
        name: 'Erode Finger',
        shortDescription: 'Deep orange-yellow polished fingers celebrated for robust earthy aroma and balanced oleoresin extraction yields.',
        image: '/images/products/turmeric-erode-finger.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Curcumin Content', value: '3.5% – 4.5%' },
          { label: 'Moisture', value: '≤ 10.5%' },
          { label: 'Origin Region', value: 'Erode, Tamil Nadu' }
        ]
      },
      {
        id: 'turmeric-nizamabad-bulb',
        name: 'Nizamabad Bulb',
        shortDescription: 'Dense, rounded mother rhizomes offering concentrated coloring matter and maximum yield for industrial grinding.',
        image: '/images/products/turmeric-nizamabad-bulb.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Curcumin Content', value: '3.0% – 4.0%' },
          { label: 'Moisture', value: '≤ 11.0%' },
          { label: 'Origin Region', value: 'Nizamabad, Telangana' }
        ]
      },
      {
        id: 'turmeric-alleppey-finger',
        name: 'Alleppey Finger',
        shortDescription: 'World-renowned dark reddish-yellow finger grade prized by pharmaceutical and supplement extractors for peak natural curcumin.',
        image: '/images/products/turmeric-alleppey-finger.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Curcumin Content', value: '5.5% – 6.5%' },
          { label: 'Moisture', value: '≤ 9.5%' },
          { label: 'Origin Region', value: 'Alleppey, Kerala' }
        ]
      },
      {
        id: 'turmeric-double-polished',
        name: 'Double Polished Finger',
        shortDescription: 'Mechanically cleaned and buffed whole fingers free of rootlets, delivering exceptional shelf appeal and purity.',
        image: '/images/products/turmeric-double-polished.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Curcumin Content', value: '4.0% – 5.0%' },
          { label: 'Moisture', value: '≤ 10.0%' },
          { label: 'Origin Region', value: 'Karnataka / South India' }
        ]
      },
      {
        id: 'turmeric-bulb-commercial',
        name: 'Turmeric Bulbs (Commercial Grade)',
        shortDescription: 'Whole sun-cured bulbs with natural essential oils and heavy substance, well-suited for curry powders and oleoresin distillation.',
        image: '/images/products/turmeric-bulb-commercial.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
        specs: [
          { label: 'Curcumin Content', value: '2.8% – 3.8%' },
          { label: 'Moisture', value: '≤ 11.0%' },
          { label: 'Origin Region', value: 'South India' }
        ]
      }
    ]
  }
];
