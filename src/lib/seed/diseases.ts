export type Severity = "Low" | "Medium" | "High" | "Critical";

export type Disease = {
  slug: string;
  name: string;
  crop: string;
  severity: Severity;
  affectedPart: string;
  symptom: string;
  description: string;
  causes: string[];
  treatment: string[];
  prevention: string[];
  season: string;
};

export const DISEASES: Disease[] = [
  {
    slug: "rice-blast",
    name: "Rice Blast",
    crop: "Rice",
    severity: "High",
    affectedPart: "Leaves & panicles",
    symptom: "Diamond-shaped lesions on leaves",
    description:
      "Caused by the fungus Magnaporthe oryzae. Spindle or diamond-shaped spots with grey centres and brown margins appear on leaves. When the fungus attacks the panicle neck the grain fails to fill, which is where most of the yield loss comes from.",
    causes: [
      "Long leaf wetness during humid, cloudy monsoon spells",
      "Night temperature between 20-26°C with heavy dew",
      "Excess nitrogen top-dressing that pushes soft, leafy growth",
    ],
    treatment: [
      "Spray Tricyclazole 75 WP at 0.6 g/litre at first neck-blast symptoms",
      "Repeat after 12-15 days if humid weather continues",
      "Stop further nitrogen application until the infection is checked",
    ],
    prevention: [
      "Grow resistant varieties such as Improved Samba Mahsuri",
      "Treat seed with Carbendazim before sowing",
      "Keep balanced NPK and avoid dense transplanting",
    ],
    season: "Monsoon",
  },
  {
    slug: "bacterial-leaf-blight",
    name: "Bacterial Leaf Blight",
    crop: "Rice",
    severity: "Critical",
    affectedPart: "Leaves",
    symptom: "Yellow wavy margins drying from leaf tip",
    description:
      "Xanthomonas oryzae enters through wounds and hydathodes. Leaves dry from the tip downward in wavy yellow streaks, and in the kresek phase whole seedlings wilt within days of transplanting.",
    causes: [
      "Standing water and flooding after heavy rain",
      "Wind-driven rain that injures leaves",
      "Heavy nitrogen dose in a susceptible variety",
    ],
    treatment: [
      "Drain the field and let the soil surface dry",
      "Spray Streptocycline 0.5 g + Copper oxychloride 30 g per 10 litres",
      "Skip the next urea split until the spread stops",
    ],
    prevention: [
      "Use certified, disease-free seed",
      "Avoid clipping seedling tips at transplanting",
      "Keep bunds weed-free to reduce alternate hosts",
    ],
    season: "Monsoon",
  },
  {
    slug: "brown-spot",
    name: "Brown Spot",
    crop: "Rice",
    severity: "Medium",
    affectedPart: "Leaves & grains",
    symptom: "Oval brown spots with grey centres",
    description:
      "Bipolaris oryzae is a stress disease that shows up on nutrient-poor and drought-hit soils. Numerous small oval brown spots cover the leaf and the grain gets discoloured.",
    causes: [
      "Potassium or silicon deficient soil",
      "Water stress in unbunded, sandy fields",
      "Infected seed carried over from last season",
    ],
    treatment: [
      "Spray Mancozeb 75 WP at 2.5 g/litre",
      "Apply a corrective potash dose",
    ],
    prevention: [
      "Treat seed with hot water or Carbendazim",
      "Correct soil deficiency using a soil test report",
    ],
    season: "Monsoon",
  },
  {
    slug: "turcicum-leaf-blight",
    name: "Turcicum Leaf Blight",
    crop: "Maize",
    severity: "Medium",
    affectedPart: "Leaves",
    symptom: "Long cigar-shaped greyish-green lesions",
    description:
      "Exserohilum turcicum causes long elliptical grey-green lesions that begin on lower leaves and move up. Heavy blighting before silking cuts grain filling badly.",
    causes: [
      "Moderate temperature of 18-27°C with long dew periods",
      "Continuous maize cropping in the same plot",
    ],
    treatment: [
      "Spray Mancozeb 2.5 g/litre or Propiconazole 1 ml/litre",
      "Repeat at 10 day intervals in wet weather",
    ],
    prevention: [
      "Rotate maize with pulses",
      "Destroy infected stubble after harvest",
    ],
    season: "Monsoon",
  },
  {
    slug: "stalk-rot",
    name: "Stalk Rot",
    crop: "Maize",
    severity: "High",
    affectedPart: "Stalk base",
    symptom: "Soft, hollow, discoloured stalk base",
    description:
      "A bacterial and fungal complex that rots the lower internodes. The stalk becomes soft and hollow with a foul smell, and plants lodge just before harvest.",
    causes: [
      "Waterlogging after heavy monsoon rain",
      "High temperature followed by sudden flooding",
      "Potash deficiency weakening the stalk",
    ],
    treatment: [
      "Drain water immediately from the field",
      "Drench the base with Copper oxychloride 3 g/litre",
      "Apply potash to standing crop",
    ],
    prevention: [
      "Sow on ridges so water drains away",
      "Keep field drainage channels open before monsoon",
    ],
    season: "Monsoon",
  },
  {
    slug: "maize-rust",
    name: "Common Rust",
    crop: "Maize",
    severity: "Medium",
    affectedPart: "Leaves",
    symptom: "Cinnamon-brown powdery pustules on both leaf faces",
    description:
      "Puccinia sorghi forms small brown pustules that burst and release rust-coloured spores. Severe rust reduces photosynthesis and shrinks cob weight.",
    causes: [
      "Cool nights with 100% relative humidity",
      "Spores blown in from neighbouring late-sown fields",
    ],
    treatment: ["Spray Propiconazole 25 EC at 1 ml/litre at first pustules"],
    prevention: [
      "Sow on time with the rest of the block",
      "Prefer rust-tolerant hybrids",
    ],
    season: "Winter",
  },
  {
    slug: "yellow-rust",
    name: "Yellow Rust",
    crop: "Wheat",
    severity: "Critical",
    affectedPart: "Leaves",
    symptom: "Yellow stripes of powdery spores along leaf veins",
    description:
      "Puccinia striiformis appears as bright yellow stripes running parallel to the veins. It spreads fastest in cool north Indian winters and can take an entire field within two weeks.",
    causes: [
      "Cool 10-15°C weather with dew or light rain",
      "Susceptible varieties grown near the hills",
    ],
    treatment: [
      "Spray Propiconazole 25 EC at 1 ml/litre as soon as stripes appear",
      "Repeat after 15 days if the weather stays cool and damp",
    ],
    prevention: [
      "Grow recommended resistant varieties such as HD 3226",
      "Scout weekly from late December onward",
    ],
    season: "Winter",
  },
  {
    slug: "loose-smut",
    name: "Loose Smut",
    crop: "Wheat",
    severity: "Medium",
    affectedPart: "Ear head",
    symptom: "Ear head replaced by a black powdery mass",
    description:
      "Ustilago tritici lives inside the seed embryo. Infected plants head out early and the whole ear turns into loose black spore dust that blows onto healthy flowers.",
    causes: [
      "Sowing untreated seed from an infected field",
      "Cool humid weather at flowering",
    ],
    treatment: [
      "Rogue out and bag smutted ears before the spores scatter",
      "No effective spray once the ear is out",
    ],
    prevention: [
      "Treat seed with Carboxin 37.5 + Thiram 37.5 at 2 g/kg",
      "Use certified seed every third season",
    ],
    season: "Winter",
  },
  {
    slug: "cotton-leaf-curl-virus",
    name: "Leaf Curl Virus",
    crop: "Cotton",
    severity: "Critical",
    affectedPart: "Leaves",
    symptom: "Upward curling leaves with thick swollen veins",
    description:
      "Cotton leaf curl virus is carried by whitefly. Leaves curl upward, veins thicken and small leafy enations form on the underside. Early infection can wipe out the crop.",
    causes: [
      "High whitefly population in hot dry spells",
      "Nearby infected cotton or okra fields",
    ],
    treatment: [
      "Control whitefly with Diafenthiuron 50 WP at 1.2 g/litre",
      "Uproot and burn severely curled plants",
    ],
    prevention: [
      "Sow tolerant Bt hybrids and avoid very early sowing",
      "Install yellow sticky traps at 10 per acre",
    ],
    season: "Monsoon",
  },
  {
    slug: "cotton-bollworm",
    name: "American Bollworm",
    crop: "Cotton",
    severity: "High",
    affectedPart: "Bolls & squares",
    symptom: "Round bore holes in bolls with excreta outside",
    description:
      "Helicoverpa armigera larvae bore into squares and bolls, feed inside and leave round holes ringed with frass. Damaged bolls rot or open badly.",
    causes: [
      "Continuous flowering stage during humid monsoon",
      "Repeated use of the same insecticide group",
    ],
    treatment: [
      "Spray Emamectin benzoate 5 SG at 0.4 g/litre",
      "Install pheromone traps at 5 per acre for monitoring",
    ],
    prevention: [
      "Maintain the refuge (non-Bt) belt around Bt cotton",
      "Rotate insecticide groups every spray",
    ],
    season: "Monsoon",
  },
  {
    slug: "cotton-wilt",
    name: "Fusarium Wilt",
    crop: "Cotton",
    severity: "High",
    affectedPart: "Whole plant",
    symptom: "Yellowing and wilting with brown stem streaks",
    description:
      "Fusarium oxysporum blocks the water channels inside the stem. Leaves yellow from the bottom up and the plant wilts even in wet soil; a cut stem shows brown vascular streaks.",
    causes: [
      "Soil-borne inoculum in continuously cropped fields",
      "Root-knot nematode injury opening entry points",
    ],
    treatment: [
      "Drench root zone with Carbendazim 1 g/litre",
      "Remove and burn wilted plants with the root ball",
    ],
    prevention: [
      "Rotate with cereals for two seasons",
      "Apply Trichoderma viride enriched farmyard manure at sowing",
    ],
    season: "Monsoon",
  },
  {
    slug: "red-rot",
    name: "Red Rot",
    crop: "Sugarcane",
    severity: "Critical",
    affectedPart: "Cane & leaves",
    symptom: "Reddened internal cane with crosswise white patches",
    description:
      "Colletotrichum falcatum rots the cane from inside. Split canes show red tissue crossed by white bands and give off a sour alcoholic smell; the third and fourth leaves dry first.",
    causes: [
      "Infected setts used for planting",
      "Waterlogging and flooded furrows",
    ],
    treatment: [
      "Uproot and burn affected clumps, do not ratoon the field",
      "Drench the pits with Carbendazim 1 g/litre",
    ],
    prevention: [
      "Treat setts in hot water at 52°C for 30 minutes",
      "Plant resistant varieties like Co 0238 replacements",
    ],
    season: "Summer",
  },
  {
    slug: "sugarcane-smut",
    name: "Sugarcane Smut",
    crop: "Sugarcane",
    severity: "Medium",
    affectedPart: "Growing point",
    symptom: "Long black whip emerging from the cane top",
    description:
      "Sporisorium scitamineum turns the growing point into a long black whip covered with spores. Affected clumps become thin, grassy and low in sugar.",
    causes: ["Infected setts", "Repeated ratooning of a diseased field"],
    treatment: [
      "Cut whips carefully into a bag before they burst and destroy them",
    ],
    prevention: [
      "Hot water treatment of setts",
      "Avoid ratooning fields with more than 10% smut",
    ],
    season: "Summer",
  },
  {
    slug: "late-blight",
    name: "Late Blight",
    crop: "Potato",
    severity: "Critical",
    affectedPart: "Leaves & tubers",
    symptom: "Water-soaked black patches with white mould underneath",
    description:
      "Phytophthora infestans destroys a potato field in under a week in cool, wet weather. Dark water-soaked patches spread from leaf edges with white fungal growth on the underside.",
    causes: [
      "Night temperature near 10-20°C with fog and 90% humidity",
      "Dense foliage that stays wet through the morning",
    ],
    treatment: [
      "Spray Mancozeb 2.5 g/litre preventively, switch to Cymoxanil + Mancozeb once symptoms appear",
      "Cut and remove the haulm before harvest in a badly hit field",
    ],
    prevention: [
      "Follow the state blight forecast advisories",
      "Earth up well so tubers are not exposed",
    ],
    season: "Winter",
  },
  {
    slug: "early-blight",
    name: "Early Blight",
    crop: "Tomato",
    severity: "Medium",
    affectedPart: "Lower leaves",
    symptom: "Brown spots with concentric target rings",
    description:
      "Alternaria solani produces brown spots with concentric rings that look like a target board. It starts on the oldest leaves and moves up, exposing fruit to sunscald.",
    causes: [
      "Warm humid weather after fruit set",
      "Splash from infected soil onto lower leaves",
    ],
    treatment: [
      "Spray Mancozeb 2.5 g/litre or Difenoconazole 0.5 ml/litre",
      "Remove and destroy the lowest infected leaves",
    ],
    prevention: [
      "Stake plants and mulch to stop soil splash",
      "Rotate away from solanaceous crops",
    ],
    season: "Winter",
  },
  {
    slug: "tomato-leaf-curl",
    name: "Tomato Leaf Curl",
    crop: "Tomato",
    severity: "High",
    affectedPart: "Leaves & shoots",
    symptom: "Small cupped leaves with stunted bushy growth",
    description:
      "A whitefly-transmitted begomovirus. Leaves become small, curled and leathery, plants stay stunted and bushy and fruit set drops sharply.",
    causes: ["Whitefly build-up in hot dry weather", "Infected nursery seedlings"],
    treatment: [
      "Remove infected plants early",
      "Manage whitefly with Spiromesifen 1 ml/litre",
    ],
    prevention: [
      "Raise nursery under 40-mesh insect-proof net",
      "Use a border row of maize as a barrier crop",
    ],
    season: "Summer",
  },
  {
    slug: "tomato-fruit-borer",
    name: "Fruit Borer",
    crop: "Tomato",
    severity: "High",
    affectedPart: "Fruit",
    symptom: "Circular holes at the fruit stalk end",
    description:
      "Helicoverpa larvae push their head into the fruit leaving a clean circular hole at the stalk end. Bored fruit rots quickly and is rejected at the mandi.",
    causes: ["Overlapping tomato plantings", "Absence of trap crops"],
    treatment: [
      "Spray Bacillus thuringiensis or Chlorantraniliprole 0.3 ml/litre",
      "Hand-pick and destroy bored fruit",
    ],
    prevention: [
      "Plant marigold as a trap crop every 16 rows",
      "Use pheromone traps at 5 per acre",
    ],
    season: "Winter",
  },
  {
    slug: "chilli-anthracnose",
    name: "Anthracnose",
    crop: "Chili",
    severity: "High",
    affectedPart: "Fruit",
    symptom: "Sunken dark spots with pink spore masses on ripe fruit",
    description:
      "Colletotrichum capsici causes circular sunken lesions on ripening fruit with concentric black dots and pink spore masses. Also known as die-back when it moves into twigs.",
    causes: [
      "Rain at the fruit ripening stage",
      "Harvest delay leaving ripe fruit on the plant",
    ],
    treatment: [
      "Spray Azoxystrobin 1 ml/litre or Copper oxychloride 3 g/litre",
      "Pick and destroy infected fruit at every harvest",
    ],
    prevention: [
      "Treat seed before sowing",
      "Harvest promptly and dry the produce fast",
    ],
    season: "Monsoon",
  },
  {
    slug: "chilli-thrips",
    name: "Thrips Leaf Curl",
    crop: "Chili",
    severity: "Medium",
    affectedPart: "Leaves & buds",
    symptom: "Upward curling leaves with silvery streaks",
    description:
      "Thrips rasp the leaf surface and suck sap, making leaves curl upward in a boat shape with silvery streaks. Flower drop follows and the plant looks bunched.",
    causes: ["Prolonged dry spell", "Excess nitrogen"],
    treatment: [
      "Spray Fipronil 5 SC at 2 ml/litre",
      "Use blue sticky traps at 10 per acre",
    ],
    prevention: [
      "Keep the field weed-free",
      "Give a light irrigation during dry spells",
    ],
    season: "Summer",
  },
  {
    slug: "downy-mildew-grapes",
    name: "Downy Mildew",
    crop: "Grapes",
    severity: "Critical",
    affectedPart: "Leaves & bunches",
    symptom: "Oily yellow patches with white growth beneath",
    description:
      "Plasmopara viticola forms oil-spot patches on the upper leaf with dense white growth underneath. Infected bunches dry into brown shot berries and the crop is lost.",
    causes: [
      "Rain of over 10 mm with temperature above 10°C",
      "Dense canopy holding leaf wetness overnight",
    ],
    treatment: [
      "Spray Metalaxyl + Mancozeb 2 g/litre in the pre-bloom window",
      "Follow with Fosetyl-Al after rain",
    ],
    prevention: [
      "Prune the canopy for open airflow",
      "Keep sprays scheduled against the rain forecast",
    ],
    season: "Monsoon",
  },
  {
    slug: "alternaria-blight",
    name: "Alternaria Blight",
    crop: "Mustard",
    severity: "Medium",
    affectedPart: "Leaves, pods & stem",
    symptom: "Dark brown concentric spots on leaves",
    description:
      "Alternaria brassicae makes dark brown round spots with concentric rings on leaves and pods. Pod infection shrivels the seed and lowers oil content.",
    causes: [
      "Late sowing that pushes podding into humid weather",
      "Dew-heavy mornings at 20-25°C",
    ],
    treatment: [
      "Spray Mancozeb 2 g/litre at first spots and repeat after 15 days",
    ],
    prevention: [
      "Sow by mid-October",
      "Use a healthy seed lot and treat before sowing",
    ],
    season: "Winter",
  },
  {
    slug: "white-rust-mustard",
    name: "White Rust",
    crop: "Mustard",
    severity: "Low",
    affectedPart: "Leaves & inflorescence",
    symptom: "Shiny white pustules on the leaf underside",
    description:
      "Albugo candida forms raised shiny white pustules on the underside of leaves. Systemic infection swells and twists the flower stalk into a staghead.",
    causes: ["Cool moist weather", "Volunteer mustard plants nearby"],
    treatment: ["Spray Metalaxyl + Mancozeb 2 g/litre"],
    prevention: ["Remove stagheads early", "Rotate with cereals"],
    season: "Winter",
  },
  {
    slug: "rice-false-smut",
    name: "False Smut",
    crop: "Rice",
    severity: "Medium",
    affectedPart: "Grains",
    symptom: "Individual grains turn into velvety yellow-green balls",
    description:
      "Ustilaginoidea virens converts single grains into velvety balls that start orange-yellow and darken to olive green. Only a few grains per panicle are hit, but the spore dust lowers seed quality and grade.",
    causes: [
      "Rain and high humidity at flowering",
      "Heavy nitrogen dose close to panicle initiation",
    ],
    treatment: [
      "Spray Propiconazole 1 ml/litre at the boot leaf stage",
      "Cut and bag affected panicles rather than shaking them in the field",
    ],
    prevention: [
      "Split nitrogen instead of one heavy late dose",
      "Use clean seed and treat before sowing",
    ],
    season: "Monsoon",
  },
  {
    slug: "wheat-brown-rust",
    name: "Brown Rust",
    crop: "Wheat",
    severity: "Medium",
    affectedPart: "Leaves",
    symptom: "Scattered orange-brown pustules on the upper leaf",
    description:
      "Puccinia triticina scatters round orange-brown pustules across the upper leaf surface. It arrives later than yellow rust and mainly cuts grain weight rather than killing the crop.",
    causes: [
      "Warm 15-22°C days with dew",
      "Late-sown crop still green when spores arrive",
    ],
    treatment: ["Spray Propiconazole 25 EC at 1 ml/litre at first pustules"],
    prevention: [
      "Sow on time so the crop matures ahead of the rust window",
      "Prefer rust-resistant recommended varieties",
    ],
    season: "Winter",
  },
  {
    slug: "soybean-yellow-mosaic",
    name: "Yellow Mosaic Virus",
    crop: "Soybean",
    severity: "High",
    affectedPart: "Leaves",
    symptom: "Bright yellow patches mixed with green on leaves",
    description:
      "A whitefly-borne begomovirus. Leaves show bright yellow mosaic patches, pods stay small and poorly filled, and early infection can halve the yield.",
    causes: [
      "Whitefly moving in from nearby pulses",
      "Susceptible variety sown late",
    ],
    treatment: [
      "Rogue out mosaic plants as soon as they appear",
      "Spray Thiamethoxam 25 WG at 0.2 g/litre to check whitefly",
    ],
    prevention: [
      "Grow resistant varieties such as JS 20-116",
      "Sow within the recommended window with the rest of the block",
    ],
    season: "Monsoon",
  },
  {
    slug: "soybean-rust",
    name: "Soybean Rust",
    crop: "Soybean",
    severity: "Medium",
    affectedPart: "Leaves",
    symptom: "Tiny brown pustules on the leaf underside",
    description:
      "Phakopsora pachyrhizi forms small tan-brown pustules on the lower leaf surface that cause early leaf drop. Severe attacks before pod filling cut seed size sharply.",
    causes: ["Extended wet spells at 20-28°C", "Dense canopy holding moisture"],
    treatment: [
      "Spray Hexaconazole 5 EC at 2 ml/litre at first pustules",
      "Repeat after 15 days if wet weather continues",
    ],
    prevention: ["Keep recommended row spacing", "Avoid excess nitrogen"],
    season: "Monsoon",
  },
  {
    slug: "onion-purple-blotch",
    name: "Purple Blotch",
    crop: "Onion",
    severity: "High",
    affectedPart: "Leaves & seed stalk",
    symptom: "Purple centred spots with a yellow ring",
    description:
      "Alternaria porri starts as small white sunken spots that widen into purple lesions with a yellow halo. Infected seed stalks snap over and the bulb stops sizing.",
    causes: [
      "Humidity above 80% with warm days",
      "Overhead irrigation late in the evening",
    ],
    treatment: [
      "Spray Mancozeb 2.5 g/litre with a sticker every 10-12 days",
      "Add Difenoconazole 0.5 ml/litre in heavy attacks",
    ],
    prevention: [
      "Irrigate in the morning so leaves dry by night",
      "Rotate away from onion and garlic for a season",
    ],
    season: "Winter",
  },
  {
    slug: "banana-panama-wilt",
    name: "Panama Wilt",
    crop: "Banana",
    severity: "Critical",
    affectedPart: "Whole plant",
    symptom: "Older leaves yellow and collapse around the pseudostem",
    description:
      "Fusarium oxysporum f.sp. cubense blocks the water channels. Older leaves yellow from the margin, collapse and hang like a skirt, and the split pseudostem shows reddish-brown streaks.",
    causes: [
      "Infected suckers brought from another field",
      "Soil-borne inoculum that survives for years",
    ],
    treatment: [
      "Uproot and burn affected plants with the corm",
      "Drench the pit with Carbendazim 2 g/litre and apply Trichoderma",
    ],
    prevention: [
      "Plant tissue-culture suckers from a certified nursery",
      "Avoid replanting banana in a wilt-affected block",
    ],
    season: "Summer",
  },
  {
    slug: "brinjal-shoot-fruit-borer",
    name: "Shoot & Fruit Borer",
    crop: "Brinjal",
    severity: "High",
    affectedPart: "Shoots & fruit",
    symptom: "Drooping shoot tips and bore holes plugged with excreta",
    description:
      "Leucinodes orbonalis larvae bore into tender shoots, making them droop and dry, then move into the fruit. Bored fruit is unmarketable and the damage builds through the season.",
    causes: [
      "Overlapping plantings that keep a host available",
      "Infested fruit left in the field after picking",
    ],
    treatment: [
      "Clip and destroy drooping shoots twice a week",
      "Spray Chlorantraniliprole 18.5 SC at 0.3 ml/litre",
    ],
    prevention: [
      "Install pheromone traps at 10 per acre",
      "Grow a resistant hybrid and rotate with a non-solanaceous crop",
    ],
    season: "Summer",
  },
  {
    slug: "okra-yellow-vein-mosaic",
    name: "Yellow Vein Mosaic",
    crop: "Okra",
    severity: "High",
    affectedPart: "Leaves & fruit",
    symptom: "Net-like yellow veins with pale, twisted fruit",
    description:
      "A whitefly-transmitted virus that turns the vein network bright yellow until the whole leaf looks yellow. Fruit stays small, pale and hard, and is rejected at the market.",
    causes: ["High whitefly pressure", "Susceptible local varieties"],
    treatment: [
      "Remove infected plants at first sight",
      "Spray Diafenthiuron 50 WP at 1.2 g/litre for whitefly",
    ],
    prevention: [
      "Sow tolerant varieties such as Arka Anamika",
      "Keep the field and bunds free of weed hosts",
    ],
    season: "Summer",
  },
  {
    slug: "gram-wilt",
    name: "Chickpea Wilt",
    crop: "Gram",
    severity: "High",
    affectedPart: "Whole plant",
    symptom: "Drooping petioles with a straw-coloured drying plant",
    description:
      "Fusarium oxysporum f.sp. ciceris causes plants to droop and dry in patches. The root, when split, shows dark brown internal discolouration while the outside looks normal.",
    causes: [
      "Soil-borne inoculum in short rotations",
      "Warm dry soil at the seedling stage",
    ],
    treatment: [
      "No cure for a wilted plant — remove it with the root",
      "Drench nearby plants with Carbendazim 1 g/litre",
    ],
    prevention: [
      "Treat seed with Trichoderma viride at 4 g/kg",
      "Rotate with cereals for two seasons",
    ],
    season: "Winter",
  },
  {
    slug: "pigeonpea-sterility-mosaic",
    name: "Sterility Mosaic",
    crop: "Pigeon Pea",
    severity: "Medium",
    affectedPart: "Leaves & flowers",
    symptom: "Bushy pale plants that flower very little",
    description:
      "Spread by the eriophyid mite. Plants turn pale and bushy with small mosaic-marked leaves and produce almost no flowers or pods, which is why it is called green plague.",
    causes: ["Mite carried by wind from nearby infected plots", "Perennial ratoon plants acting as a reservoir"],
    treatment: [
      "Remove diseased bushes early in the season",
      "Spray wettable sulphur 3 g/litre against the mite vector",
    ],
    prevention: [
      "Grow resistant varieties such as Asha (ICPL 87119)",
      "Do not keep ratoon pigeon pea near a new crop",
    ],
    season: "Monsoon",
  },
  {
    slug: "potato-black-scurf",
    name: "Black Scurf",
    crop: "Potato",
    severity: "Medium",
    affectedPart: "Tubers & stems",
    symptom: "Hard black crusty specks stuck on the tuber skin",
    description:
      "Rhizoctonia solani leaves black sclerotia stuck to the tuber like dirt that will not wash off. It also girdles young sprouts, giving patchy, uneven emergence.",
    causes: [
      "Infected seed tubers",
      "Cold wet soil that slows emergence",
    ],
    treatment: [
      "Treat seed tubers with Pencycuron 0.25% before planting",
      "Harvest promptly once the haulm is mature",
    ],
    prevention: [
      "Use certified seed and rotate with cereals",
      "Plant when soil has warmed so sprouts emerge fast",
    ],
    season: "Winter",
  },
  {
    slug: "mango-powdery-mildew",
    name: "Powdery Mildew",
    crop: "Mango",
    severity: "High",
    affectedPart: "Flower panicles",
    symptom: "White powder on panicles with heavy flower drop",
    description:
      "Oidium mangiferae coats the flower panicle in white powder. The flowers dry and drop before setting, and a bad attack at bloom can cost most of the season's fruit.",
    causes: [
      "Cloudy humid weather during flowering",
      "Dense unpruned canopy",
    ],
    treatment: [
      "Dust wettable sulphur at bud burst",
      "Spray Hexaconazole 2 ml/litre at 15 day intervals through bloom",
    ],
    prevention: [
      "Prune for an open canopy after harvest",
      "Start the protective schedule before panicles open",
    ],
    season: "Summer",
  },
  {
    slug: "groundnut-tikka",
    name: "Tikka Leaf Spot",
    crop: "Groundnut",
    severity: "Medium",
    affectedPart: "Leaves",
    symptom: "Dark round spots with a yellow halo",
    description:
      "Cercospora leaf spot shows as dark brown to black round spots ringed by a yellow halo. Heavy spotting defoliates the plant before pod filling and cuts both pod and fodder yield.",
    causes: [
      "Continuous groundnut cropping in the same field",
      "Humid weather 45 days after sowing",
    ],
    treatment: [
      "Spray Chlorothalonil 2 g/litre or Carbendazim 1 g/litre",
      "Repeat after 15 days if defoliation continues",
    ],
    prevention: [
      "Rotate with pearl millet or sorghum",
      "Destroy crop residue after harvest",
    ],
    season: "Monsoon",
  },
  {
    slug: "bajra-downy-mildew",
    name: "Downy Mildew",
    crop: "Bajra",
    severity: "High",
    affectedPart: "Leaves & earhead",
    symptom: "Yellow-green half-leaf streaking, earhead turns leafy",
    description:
      "Sclerospora graminicola causes green ear disease in pearl millet. Leaves show half-yellow streaking with white growth beneath and the earhead turns into a mass of twisted green leafy structures.",
    causes: [
      "Soil-borne oospores in continuously cropped plots",
      "High humidity right after sowing rains",
    ],
    treatment: [
      "Rogue out and destroy green ear plants before spore release",
      "Spray Metalaxyl 1 g/litre in the early crop stage",
    ],
    prevention: [
      "Treat seed with Metalaxyl 6 g/kg",
      "Rotate with legumes for one season",
    ],
    season: "Monsoon",
  },
  {
    slug: "bajra-ergot",
    name: "Ergot",
    crop: "Bajra",
    severity: "Medium",
    affectedPart: "Earhead",
    symptom: "Sticky honeydew drops on the earhead",
    description:
      "Claviceps fusiformis infects open florets and oozes a sticky honeydew that later hardens into dark sclerotia. The grain is toxic to cattle, so infected lots must be cleaned.",
    causes: [
      "Rain during flowering",
      "High humidity with cloudy weather at anthesis",
    ],
    treatment: ["Spray Mancozeb 2 g/litre at 5% flowering"],
    prevention: [
      "Sow so flowering avoids peak rain",
      "Clean seed in 10% salt solution to float out sclerotia",
    ],
    season: "Monsoon",
  },
];

export const CROPS = Array.from(new Set(DISEASES.map((d) => d.crop))).sort();

export const SEVERITIES: Severity[] = ["Low", "Medium", "High", "Critical"];

export const severityStyle: Record<
  Severity,
  { color: string; bg: string; text: string; icon: string }
> = {
  Low: {
    color: "var(--green-primary)",
    bg: "rgba(34,197,94,0.16)",
    text: "#4ade80",
    icon: "leaf",
  },
  Medium: {
    color: "var(--amber)",
    bg: "rgba(245,158,11,0.16)",
    text: "#fbbf24",
    icon: "alert",
  },
  High: {
    color: "var(--orange)",
    bg: "rgba(251,146,60,0.16)",
    text: "#fdba74",
    icon: "flame",
  },
  Critical: {
    color: "var(--red-critical)",
    bg: "rgba(239,68,68,0.16)",
    text: "#fca5a5",
    icon: "skull",
  },
};

export function getDisease(slug: string) {
  return DISEASES.find((d) => d.slug === slug);
}
