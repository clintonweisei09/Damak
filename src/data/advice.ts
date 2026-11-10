import { AdviceArticle, FaqQuestion } from '../types/farm';

export const OWNER_INFO = {
  name: 'David & Margaret Damak',
  roles: 'Founders & Master Husbandmen',
  yearsFarming: '28 Years',
  farmLocation: 'Damak Valley Homestead, Ridgefield',
  philosophy: 'Regenerative biodiversity, heritage preservation, and honoring the natural instincts of every animal and heirloom seed in our care.',
  image: '/src/assets/images/damak_farm_owners_1792425696095.jpg'
};

export const ADVICE_ARTICLES: AdviceArticle[] = [
  {
    id: 'advice-guinea-fowl',
    title: 'The Guinea Fowl Guide: Natural Tick Suppression & Flock Integration',
    category: 'poultry',
    categoryLabel: 'Poultry & Game Birds',
    summary: 'Why guinea fowl are the undisputed champions of homestead pest control, how to train them to roost safely at night, and preventing wandering.',
    author: 'David Damak',
    authorRole: 'Head of Livestock & Aviary',
    readTime: '6 min read',
    publishDate: 'October 12, 2026',
    keyTakeaways: [
      'A flock of 6-8 guinea fowl can clear 2-3 acres of deer ticks, crickets, and grasshoppers within one season.',
      'Must be coop-trained for 6 continuous weeks before free-ranging, or they will roost 30 feet high in tree branches.',
      'Always feed cracked corn or black oil sunflower seeds exclusively inside their night coop at sunset.'
    ],
    content: [
      'Many homesteaders acquire guinea fowl hoping for quiet, low-maintenance lawn ornaments. Guinea fowl are neither quiet nor standard poultry; they are semi-wild African game birds with heightened alert systems that operate as nature’s most relentless tick vacuums.',
      'In our 28 years on the farm, we noticed a 95% drop in pasture tick populations within 90 days of introducing our breeding Pearl Guinea flock. Unlike chickens, guinea fowl rarely scratch up garden beds with heavy claws; instead, they delicately hunt insect pests off foliage without devastating root systems.',
      'The #1 mistake newcomers make is letting new keets out too early. Guinea fowl have an instinctive urge to roost high in oak or birch canopies, exposing them to great horned owls. Keep your flock locked in their secure predator-proof pen for 4 to 6 weeks. Establish a rhythmic auditory call (a whistle or shaking bucket) paired with evening grains. They will remember their home coop and return every dusk.'
    ],
    farmerTip: 'Never release your entire guinea flock on their first free-range day. Release only two while keeping the rest in the pen. The free birds will not abandon the flock call and will stay within sight.',
    relatedProductId: 'prod-guinea-fowl-pair'
  },
  {
    id: 'advice-rabbits-guinea-pigs',
    title: 'Small Mammal Digestion: Preventing GI Stasis in Rabbits and Cavies',
    category: 'small-mammals',
    categoryLabel: 'Rabbits & Cavies',
    summary: 'Essential dietary proportions, the vital role of long-stem coarse timothy hay, and recognizing early warning signs of digestive slowing.',
    author: 'Margaret Damak',
    authorRole: 'Head of Organic Nursery & Small Animals',
    readTime: '5 min read',
    publishDate: 'October 5, 2026',
    keyTakeaways: [
      '80% to 85% of a rabbit or guinea pig diet must consist of unfertilized, dust-free grass hay.',
      'Guinea pigs cannot biosynthesize Vitamin C — provide daily fresh bell pepper slices or organic kale.',
      'Flemish Giants require low-impact bedding to protect hocks and must never be housed on wire-bottom cages.'
    ],
    content: [
      'Both European rabbits and South American cavies (guinea pigs) possess a delicate hindgut fermentation system powered by beneficial cecal microbes. In our rabbitry, we treat gut motility as the foundation of longevity.',
      'Commercial grain pellets are often overfed by well-meaning owners. Too much concentrated starch slows down peristalsis and leads to deadly Gastrointestinal (GI) Stasis. At Damak Farm, pellets are treated as a modest vitamin supplement (no more than 2 tablespoons per day for adult rabbits).',
      'The secret to gleaming coats and healthy teeth is coarse first-cut meadow hay. The abrasive silica microscopic crystals in grass hay naturally wear down open-rooted incisors and molars that grow continuously throughout their lifespan.'
    ],
    farmerTip: 'Fresh dandelion leaves and plantain weeds harvested from unsprayed soil are natural digestive tonics. Feed a small handful whenever a rabbit or cavy seems sluggish.',
    relatedProductId: 'prod-flemish-giant-rabbit'
  },
  {
    id: 'advice-heritage-turkeys',
    title: 'Pasture-Raising Bourbon Red Turkeys: Foraging, Roosts & Cold Weather Care',
    category: 'poultry',
    categoryLabel: 'Heritage Turkeys',
    summary: 'The difference between industrial commercial white broad-breasted turkeys and natural heritage breeds that can fly, forage, and thrive in winter paddocks.',
    author: 'David Damak',
    authorRole: 'Head of Livestock & Aviary',
    readTime: '7 min read',
    publishDate: 'September 28, 2026',
    keyTakeaways: [
      'Heritage turkeys live 8-10 years and reproduce naturally without artificial insemination.',
      'Higher protein requirements (26-28% starter crude protein for poults) compared to standard chicks.',
      'Bourbon Reds are remarkably cold hardy if kept out of horizontal damp drafts.'
    ],
    content: [
      'Industrial supermarket turkeys have been bred into biological dead-ends — unable to fly, walk comfortably, or breed without human assistance. By contrast, heritage Bourbon Reds are majestic, agile foragers that relish chasing grasshoppers across our clover fields.',
      'When brooding poults during their first 8 weeks, warmth and dry bedding are sacred. Once their adult plumage comes in, they become one of the most weather-resilient birds on the farmstead, willingly perching on wooden paddock rails even in frosty weather.',
      'Their diet is supplemented with windfall organic apples, clover, and organic sprouted barley, which produces incredible marbling and rich, unctuous dark meat that honors historical culinary traditions.'
    ],
    farmerTip: 'Turkeys are sociable and form strong bonds with their caretakers. Spend 10 minutes talking to your flock each morning — a calm turkey is 50% less prone to stress illnesses.',
    relatedProductId: 'prod-bourbon-red-turkey'
  },
  {
    id: 'advice-rare-romanesco',
    title: 'Mastering Fractal Romanesco & Rare Brassicas: Soil Drainage & Harvest Timing',
    category: 'rare-crops',
    categoryLabel: 'Heirloom Horticulture',
    summary: 'How to achieve perfectly defined spiral fractal cones, preventing buttoning in unpredictable weather, and culinary pairings from the farm kitchen.',
    author: 'Margaret Damak',
    authorRole: 'Head of Organic Nursery & Small Animals',
    readTime: '6 min read',
    publishDate: 'September 18, 2026',
    keyTakeaways: [
      'Romanesco is intolerant of mid-summer heat; target transplanting so heading coincides with cool autumn nights (10°C to 15°C).',
      'Needs rich, calcium-fortified organic soil with a steady pH between 6.5 and 7.2 to avoid hollow stem.',
      'Harvest before the spiral cones begin to loosen or develop purple blush.'
    ],
    content: [
      'Romanesco is the geometric marvel of the vegetable kingdom. Each floret is a self-similar fractal replicating the golden ratio spiral of the primary head.',
      'To grow pristine heads without bitterness, consistent moisture is mandatory. A single 48-hour dry spell during the head-initiation phase causes the plant to abort tight curd formation, resulting in loose, fibrous sprouts. We use drip irrigation beneath thick barley straw mulch to keep root zones cool and damp.',
      'In the kitchen, treat Romanesco with reverence: roast it whole with raw garlic cloves, cold-pressed olive oil, and freshly cracked sea salt at 200°C for 28 minutes until floret tips turn golden bronze.'
    ],
    farmerTip: 'Dust young brassica leaves with clean wood ash and diatomeceous earth early in the morning when dew clings to the leaves to deter flea beetles naturally.',
    relatedProductId: 'prod-romanesco'
  },
  {
    id: 'advice-permaculture-soil',
    title: 'Building Living Living Soil: Why We Never Use Synthetic Nitrogen or Pesticides',
    category: 'soil-permaculture',
    categoryLabel: 'Soil & Permaculture',
    summary: 'Harnessing rabbit and guinea pig manure as cold "black gold", worm casting tea, and cover crop succession for deep root resilience.',
    author: 'David & Margaret Damak',
    authorRole: 'Damak Farmstead',
    readTime: '8 min read',
    publishDate: 'September 4, 2026',
    keyTakeaways: [
      'Rabbit and cavy manure is "cold" and can be applied directly to garden beds without hot composting.',
      'Deep tap-rooted daikon radishes break hardpan clay without heavy tillage.',
      'Biodiversity creates natural predator-prey equilibrium across farm boundaries.'
    ],
    content: [
      'True organic farming is not the mere substitution of organic-approved bottled sprays for chemical ones; it is the deliberate construction of an ecosystem where pests find no ecological vacuum to conquer.',
      'Our secret weapon at Damak Farm is our rabbitry and cavy manure. Unlike chicken manure, which is hot in volatile uric acid and burns fragile seedling roots unless composted for months, rabbit manure contains balanced nitrogen and phosphorus wrapped in fibrous timothy hay matter. We dress our rare purple potatoes and chard beds directly with it each spring.',
      'Healthy soil with vibrant mycorrhizal fungal networks produces vegetables with measurably higher Brix sugar levels and dense mineral profiles that taste like real vegetables used to taste.'
    ],
    farmerTip: 'Brew an aerated compost tea with rain water and two shovels of mature compost. Spray onto plant leaves at dawn — beneficial microbes colonize the leaf surface and prevent powdery mildew.',
    relatedProductId: 'prod-organic-timothy-hay'
  }
];

export const FAQ_QUESTIONS: FaqQuestion[] = [
  {
    id: 'faq-1',
    question: 'Can guinea fowl live peacefully alongside regular backyard chickens?',
    answer: 'Yes, with one key rule: introduce them when young or provide ample roosting space! Guinea fowl have dominant personalities and may chase chickens away from feed troughs if confined in small spaces. With open foraging or a spacious run, they cohabitate peacefully and chickens benefit from guinea alerts.',
    category: 'Poultry',
    farmer: 'David Damak'
  },
  {
    id: 'faq-2',
    question: 'How do you ship live rabbits, guinea pigs, or poultry?',
    answer: 'Live animals (rabbits, guinea pigs, guinea fowl, and turkeys) are strictly available for Farm Gate Pickup or our specialized local temperature-controlled courier within a 45-mile radius. We never put live animals into conventional parcel transit. Fresh produce, hatching eggs, and pantry preserves can be shipped nationwide in insulated temperature-regulated eco-cool packs.',
    category: 'Logistics & Care',
    farmer: 'Margaret Damak'
  },
  {
    id: 'faq-3',
    question: 'Why are your heirloom vegetables so different from supermarket varieties?',
    answer: 'Supermarket vegetables are bred for uniform transit durability and long shelf lives at the expense of taste, nutritional density, and genetic variety. Our rare heirlooms (like Romanesco, Chioggia beets, and purple fingerlings) are heritage seeds selected over centuries for exquisite flavor, rich anthocyanins, and sweetness.',
    category: 'Produce',
    farmer: 'Margaret Damak'
  },
  {
    id: 'faq-4',
    question: 'How much space does a pair of Flemish Giant rabbits need?',
    answer: 'A minimum of 12 to 16 square feet of flat, clean ground space with comfortable soft bedding, plus daily exercise time in a predator-proof run. Because they can grow to 14–18 pounds, avoid wire mesh floors which cause painful pododermatitis (sore hocks).',
    category: 'Small Animals',
    farmer: 'Margaret Damak'
  },
  {
    id: 'faq-5',
    question: 'How should I store Romanesco and rare roots after delivery?',
    answer: 'Keep Romanesco in its perforated breathable paper bag in the vegetable crisper drawer (2°C–4°C); it stays fresh and firm for 7 to 9 days. For Purple fingerlings and Chioggia beets, store in a cool, dark, dry pantry box — do not refrigerate potatoes as starch converts prematurely to sugars.',
    category: 'Produce',
    farmer: 'David Damak'
  }
];
