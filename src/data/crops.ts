import { GrowthProgress } from '../types/farm';

export interface FarmCrop {
  id: string;
  name: string;
  botanicalName: string;
  category: 'rare-heirloom' | 'greens-brassicas' | 'roots-tubers' | 'herbs-berries';
  categoryLabel: string;
  categoryColor: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
  };
  harvestSeason: string;
  daysToMaturity: string;
  brixSweetness: string;
  flavorProfile: string;
  soilCompanion: string;
  story: string;
  harvestMethod: string;
  culinaryUse: string;
  image: string;
  tags: string[];
  growthProgress: GrowthProgress;
}

export const FARM_CROPS: FarmCrop[] = [
  {
    id: 'crop-romanesco',
    name: 'Fractal Romanesco Cauliflower',
    botanicalName: 'Brassica oleracea var. botrytis',
    category: 'rare-heirloom',
    categoryLabel: 'Rare Heirloom',
    categoryColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600',
    },
    harvestSeason: 'Autumn & Early Winter',
    daysToMaturity: '85–95 Days',
    brixSweetness: '6.5° Brix (Mild & Nutty)',
    flavorProfile: 'Crisp, hazelnut-sweet, tender and never sulfurous',
    soilCompanion: 'Planted alongside borage and nasturtiums to naturally deter flea beetles and cabbage loopers',
    story: 'Preserved by Italian monks since the 16th century, each floret is an exquisite natural logarithmic Fibonacci spiral. We harvest at dawn before morning dew evaporates.',
    harvestMethod: 'Hand-cut with curved harvest knife preserving protective wrapper leaves',
    culinaryUse: 'Whole oven-roasted with aged black garlic, steamed with sea salt, or broken raw into autumn salads',
    image: '/src/assets/images/rare_produce_harvest_1792425694317.jpg',
    tags: ['Fibonacci Fractal', 'High Vitamin C', 'Italian Heritage', 'Rare Heirloom'],
    growthProgress: {
      percentage: 88,
      currentDay: 79,
      totalDays: 90,
      currentStage: 'Floret Spiral Formation',
      stageNumber: 3,
      daysUntilHarvest: 11,
      statusText: 'Rapid Maturation',
      stages: [
        { name: 'Seed Germination & Tray Start', dayRange: 'Days 1–18', completed: true, current: false },
        { name: 'Vegetative Canopy & Leaf Frame', dayRange: 'Days 19–50', completed: true, current: false },
        { name: 'Fibonacci Floret Spiraling', dayRange: 'Days 51–80', completed: false, current: true },
        { name: 'Peak Dawn Harvest Readiness', dayRange: 'Days 81–90', completed: false, current: false }
      ]
    }
  },
  {
    id: 'crop-rainbow-chard',
    name: 'Bright Lights Rainbow Swiss Chard',
    botanicalName: 'Beta vulgaris subsp. vulgaris',
    category: 'greens-brassicas',
    categoryLabel: 'Fresh Greens',
    categoryColor: {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      badgeBg: 'bg-rose-600',
    },
    harvestSeason: 'Spring through Late Frost',
    daysToMaturity: '55–60 Days',
    brixSweetness: '5.2° Brix (Earth & Mineral)',
    flavorProfile: 'Crisp succulent stalks with tender, iron-rich savoyed green leaves',
    soilCompanion: 'Grown with bush beans which naturally fix atmospheric nitrogen into the root rhizosphere',
    story: 'Our rainbow chard rows display glowing ruby, golden canary, and vivid tangerine stalks. Fed exclusively with aerated worm casting teas from our farmstead vermiculture beds.',
    harvestMethod: 'Cut-and-come-again outer stalk harvesting, leaving heart intact for continuous regrowth',
    culinaryUse: 'Stalks braised in white wine & butter; leaves wilted into rustic farm frittatas and grain bowls',
    image: '/src/assets/images/vibrant_crops_patch_1792426298694.jpg',
    tags: ['Mineral Rich', 'Cut-and-Come-Again', 'High Antioxidant', 'Rainbow Stems'],
    growthProgress: {
      percentage: 95,
      currentDay: 55,
      totalDays: 58,
      currentStage: 'Succulent Stalk Maturation',
      stageNumber: 4,
      daysUntilHarvest: 3,
      statusText: 'Harvest Ready',
      stages: [
        { name: 'Direct Furrow Seeding', dayRange: 'Days 1–10', completed: true, current: false },
        { name: 'Color Pigmentation & Leafing', dayRange: 'Days 11–28', completed: true, current: false },
        { name: 'Stalk & Midrib Expansion', dayRange: 'Days 29–48', completed: true, current: false },
        { name: 'Continuous Leaf Harvest', dayRange: 'Days 49–58', completed: false, current: true }
      ]
    }
  },
  {
    id: 'crop-purple-fingerlings',
    name: 'Purple Majesty Heritage Fingerling',
    botanicalName: 'Solanum tuberosum (Purple Andean)',
    category: 'roots-tubers',
    categoryLabel: 'Heirloom Roots',
    categoryColor: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
      badgeBg: 'bg-purple-600',
    },
    harvestSeason: 'Late Summer & Autumn',
    daysToMaturity: '90–100 Days',
    brixSweetness: '4.8° Brix (Earthy Buttery)',
    flavorProfile: 'Dense, velvety waxy texture with rich nutty earthiness',
    soilCompanion: 'Deep mulch of clean timothy grass hay and horse manure compost; interplanted with horseradish',
    story: 'Derived from ancient high-altitude Andean landraces. Its intense violet color permeates the entire flesh and contains 4× the antioxidant power of standard white potatoes.',
    harvestMethod: 'Gently hand-forked from loose raised sandy loam beds to avoid skin bruising',
    culinaryUse: 'Halved and roasted crisp with fresh rosemary and sea salt, or steamed for vibrant violet potato salads',
    image: '/src/assets/images/rare_produce_harvest_1792425694317.jpg',
    tags: ['Anthocyanin Violet', 'Andean Heritage', 'Low Glycemic', 'Waxy Roasting'],
    growthProgress: {
      percentage: 82,
      currentDay: 78,
      totalDays: 95,
      currentStage: 'Tuber Bulking & Anthocyanin Shift',
      stageNumber: 3,
      daysUntilHarvest: 17,
      statusText: 'Rapid Maturation',
      stages: [
        { name: 'Seed Chitting & Sprouting', dayRange: 'Days 1–14', completed: true, current: false },
        { name: 'Vine Canopy & Blossom Bloom', dayRange: 'Days 15–50', completed: true, current: false },
        { name: 'Subterranean Tuber Bulking', dayRange: 'Days 51–80', completed: false, current: true },
        { name: 'Skin Setting & Fork Harvest', dayRange: 'Days 81–95', completed: false, current: false }
      ]
    }
  },
  {
    id: 'crop-chioggia-beets',
    name: 'Chioggia Candy-Stripe Beets',
    botanicalName: 'Beta vulgaris var. conditiva',
    category: 'roots-tubers',
    categoryLabel: 'Heirloom Roots',
    categoryColor: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      badgeBg: 'bg-amber-600',
    },
    harvestSeason: 'Autumn & Winter Cellar',
    daysToMaturity: '55–65 Days',
    brixSweetness: '9.2° Brix (Naturally Sweet)',
    flavorProfile: 'Mild, honey-sweet, crisp without earthy soil bitterness',
    soilCompanion: 'Onions and baby chives that confuse flying pests while enriching root sweetness',
    story: 'Introduced near Venice in the 1840s. Slicing reveals concentric bullseye rings of vivid crimson and porcelain white that brighten every culinary presentation.',
    harvestMethod: 'Hand-pulled at 2-3 inch diameter when tender and tops are still vibrant',
    culinaryUse: 'Shaved paper-thin with a mandoline for raw carpaccio drizzled with raw honey and goat cheese',
    image: '/src/assets/images/rare_produce_harvest_1792425694317.jpg',
    tags: ['Candy Bullseye', 'Venetian Heirloom', 'Super Sweet', 'No Bleeding'],
    growthProgress: {
      percentage: 92,
      currentDay: 57,
      totalDays: 62,
      currentStage: 'Root Swelling & Ring Definition',
      stageNumber: 4,
      daysUntilHarvest: 5,
      statusText: 'Ready for Pick',
      stages: [
        { name: 'Germination & Thinning', dayRange: 'Days 1–12', completed: true, current: false },
        { name: 'Foliage & Taproot Expansion', dayRange: 'Days 13–35', completed: true, current: false },
        { name: 'Concentric Ring Definition', dayRange: 'Days 36–52', completed: true, current: false },
        { name: 'Tender Bulb Pulling Window', dayRange: 'Days 53–62', completed: false, current: true }
      ]
    }
  },
  {
    id: 'crop-lemon-drop-chili',
    name: 'Peruvian Lemon Drop Hot Pepper',
    botanicalName: 'Capsicum baccatum',
    category: 'rare-heirloom',
    categoryLabel: 'Rare Heirloom',
    categoryColor: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      badgeBg: 'bg-yellow-600',
    },
    harvestSeason: 'Late Summer through October',
    daysToMaturity: '100 Days',
    brixSweetness: '30,000–50,000 Scoville',
    flavorProfile: 'Clean explosive citrus aroma followed by bright, electric heat',
    soilCompanion: 'Sweet basil and marigolds beneath solar greenhouse drip emitters',
    story: 'A prized seasoning pepper native to Peru. The plants are prolific producers of pointed canary-yellow pods that smell of crushed lemongrass.',
    harvestMethod: 'Hand-clipped with stems attached when skin turns deep golden yellow',
    culinaryUse: 'Finely minced in citrus ceviche, infused into farmstead chili oils, or solar-dried into yellow pepper flakes',
    image: '/src/assets/images/vibrant_crops_patch_1792426298694.jpg',
    tags: ['Citrus Heat', 'Peruvian Landrace', 'Solar Dried', 'Bright Flavor'],
    growthProgress: {
      percentage: 76,
      currentDay: 76,
      totalDays: 100,
      currentStage: 'Pod Color Shift (Green to Canary Yellow)',
      stageNumber: 3,
      daysUntilHarvest: 24,
      statusText: 'Rapid Maturation',
      stages: [
        { name: 'Nursery Heat Germination', dayRange: 'Days 1–20', completed: true, current: false },
        { name: 'Canopy & Star Flower Bloom', dayRange: 'Days 21–55', completed: true, current: false },
        { name: 'Green Pod Setting & Lengthening', dayRange: 'Days 56–78', completed: false, current: true },
        { name: 'Full Citrus Sun-Ripening', dayRange: 'Days 79–100', completed: false, current: false }
      ]
    }
  },
  {
    id: 'crop-tuscan-kale',
    name: 'Dinosaur Lacinato Cavolo Nero',
    botanicalName: 'Brassica oleracea var. palmifolia',
    category: 'greens-brassicas',
    categoryLabel: 'Fresh Greens',
    categoryColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-700',
    },
    harvestSeason: 'Autumn through Hard Frost',
    daysToMaturity: '65 Days',
    brixSweetness: '6.8° Brix (Frost Sweetened)',
    flavorProfile: 'Deep, savory, dark chocolate and mineral notes',
    soilCompanion: 'Mint and chamomile planted on furrow borders to repel cabbage moth butterflies',
    story: 'Cultivated in Tuscany since the 18th century. Known for deeply embossed, blue-green strappy leaves that become remarkably sweet after the first autumn frost.',
    harvestMethod: 'Stripped from the bottom stalk upwards in early morning when crisp',
    culinaryUse: 'The irreplaceable soul of hearty ribollita vegetable stew, or massaged with lemon oil for crunchy raw salads',
    image: '/src/assets/images/vibrant_crops_patch_1792426298694.jpg',
    tags: ['Frost Sweetened', 'Tuscan Heirloom', 'Antioxidant Powerhouse', 'Deep Emerald'],
    growthProgress: {
      percentage: 90,
      currentDay: 58,
      totalDays: 65,
      currentStage: 'Frost Pre-Sugar Accumulation',
      stageNumber: 4,
      daysUntilHarvest: 7,
      statusText: 'Ready for Pick',
      stages: [
        { name: 'Seedling Emergence', dayRange: 'Days 1–12', completed: true, current: false },
        { name: 'Embossed Leaf Crinkling', dayRange: 'Days 13–35', completed: true, current: false },
        { name: 'Stalk Elevation & Thickening', dayRange: 'Days 36–52', completed: true, current: false },
        { name: 'Cold Morning Leaf Stripping', dayRange: 'Days 53–65', completed: false, current: true }
      ]
    }
  },
  {
    id: 'crop-black-spanish-radish',
    name: 'Nero Tondo Black Spanish Winter Radish',
    botanicalName: 'Raphanus sativus var. niger',
    category: 'roots-tubers',
    categoryLabel: 'Heirloom Roots',
    categoryColor: {
      bg: 'bg-slate-50',
      text: 'text-slate-800',
      border: 'border-slate-300',
      badgeBg: 'bg-slate-800',
    },
    harvestSeason: 'October through February',
    daysToMaturity: '70 Days',
    brixSweetness: 'Crisp Peppery Mustard Bite',
    flavorProfile: 'Coal-black rough exterior concealing snow-white, sharp, spicy flesh',
    soilCompanion: 'Winter rye and field peas that protect root crops from soil freeze',
    story: 'Grown across Europe since the 1500s for winter sustenance. Renowned in traditional European folk medicine for liver stimulation and winter resilience.',
    harvestMethod: 'Pulled late autumn before deep ground freeze and stored in damp cellar sand',
    culinaryUse: 'Grated fine into sour cream dressings, fermented with salt into winter kimchi, or pan-fried with duck fat',
    image: '/src/assets/images/rare_produce_harvest_1792425694317.jpg',
    tags: ['Coal Black Skin', 'Snow White Interior', 'Spicy Mustard Kick', 'Winter Storage'],
    growthProgress: {
      percentage: 68,
      currentDay: 48,
      totalDays: 70,
      currentStage: 'Black Cuticle Hardening',
      stageNumber: 3,
      daysUntilHarvest: 22,
      statusText: 'Vegetative Canopy',
      stages: [
        { name: 'Late Season Sowing', dayRange: 'Days 1–10', completed: true, current: false },
        { name: 'Deep Taproot Drive', dayRange: 'Days 11–32', completed: true, current: false },
        { name: 'Cuticle Carbonization', dayRange: 'Days 33–55', completed: false, current: true },
        { name: 'Winter Cellar Pull', dayRange: 'Days 56–70', completed: false, current: false }
      ]
    }
  },
  {
    id: 'crop-herbs-berries',
    name: 'Damak Apiary Hedgerow Berries & Herbs',
    botanicalName: 'Ribes uva-crispa & Aloysia citrodora',
    category: 'herbs-berries',
    categoryLabel: 'Orchard & Herbs',
    categoryColor: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      badgeBg: 'bg-amber-600',
    },
    harvestSeason: 'Summer through Late Autumn',
    daysToMaturity: 'Perennial Bushes',
    brixSweetness: '11.5° Brix (Tart Honey)',
    flavorProfile: 'Wild heirloom gooseberries, scented lemon verbena, and organic lavender blossoms',
    soilCompanion: 'Bordering our bee hives where pollinators feast throughout spring and summer',
    story: 'Our permaculture windbreak hedgerows are planted with heirloom berry canes and medicinal aromatic herbs that feed our bees and yield boutique pantry preserves.',
    harvestMethod: 'Hand-picked berry by berry at optimal brix sugar peak',
    culinaryUse: 'Infused into herbal tisanes, churned into goat curd tarts, or simmered into small-batch fruit spreads',
    image: '/src/assets/images/vibrant_crops_patch_1792426298694.jpg',
    tags: ['Bee Friendly', 'Heirloom Orchard', 'Essential Oils', 'Perennial Permaculture'],
    growthProgress: {
      percentage: 85,
      currentDay: 85,
      totalDays: 100,
      currentStage: 'Sugar Concentration & Late Bloom Pollination',
      stageNumber: 3,
      daysUntilHarvest: 15,
      statusText: 'Harvest Ready',
      stages: [
        { name: 'Spring Bud Break', dayRange: 'Month 1–2', completed: true, current: false },
        { name: 'Apiary Pollination Feast', dayRange: 'Month 3–4', completed: true, current: false },
        { name: 'Sun Berry Sugar Swell', dayRange: 'Month 5', completed: false, current: true },
        { name: 'Autumn Cluster Harvest', dayRange: 'Month 6', completed: false, current: false }
      ]
    }
  }
];
