import {
  Affirmation,
  JokeItem,
  JournalEntry,
  MoodCheckIn,
  MusicVibe,
  ResourceArticle,
  WatchCategory,
} from "../types";

export const initialMoodHistory: MoodCheckIn[] = [
  {
    id: "hist-1",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    mood: "reflective",
    intensity: 6,
    reasons: ["Work & Tasks", "Sleep & Energy"],
    note: "Busy workday, but had a nice warm cup of matcha in the afternoon.",
  },
  {
    id: "hist-2",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    mood: "anxious",
    intensity: 7,
    reasons: ["Work & Tasks", "Overthinking"],
    note: "Deadlines felt a bit overwhelming in the morning, did 4-7-8 breathing.",
  },
  {
    id: "hist-3",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    mood: "peaceful",
    intensity: 8,
    reasons: ["Friends & Social", "Nature", "Sleep & Energy"],
    note: "Went on a sunset walk with a friend. Mind felt so much quieter.",
  },
];

export const initialJournalEntries: JournalEntry[] = [
  {
    id: "j-1",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    prompt: "A moment today that felt peaceful or grounded",
    content:
      "Sitting by the window with warm morning tea, noticing how the breeze rustled the maple leaves outside. No urgency, just quiet observation.",
    tags: ["Morning", "Peace", "Gratitude"],
    moodSnapshot: "peaceful",
  },
  {
    id: "j-2",
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    prompt: "Something I am gently letting go of",
    content:
      "The pressure to finish every single task on my endless to-do list before letting myself rest. Today I gave myself permission to step away at 6 PM.",
    tags: ["Boundaries", "Rest", "Self-Care"],
    moodSnapshot: "balanced",
  },
];

export const curatedAffirmations: Affirmation[] = [
  {
    id: "aff-1",
    text: "I do not have to carry the weight of tomorrow right now; this single breath is enough.",
    category: "Anxiety Relief",
    reflectionPrompt: "What is one thing you can gently let go of control over today?",
    isFavorite: true,
  },
  {
    id: "aff-2",
    text: "My worth is not defined by how much I finish today. Rest is part of living, not a reward I have to earn.",
    category: "Self-Compassion",
    reflectionPrompt: "Where can you give yourself permission to ease up pressure?",
  },
  {
    id: "aff-3",
    text: "I am allowed to feel complicated emotions without needing to immediately fix or judge them.",
    category: "Mindful Presence",
    reflectionPrompt: "What emotion is asking for your quiet understanding right now?",
  },
  {
    id: "aff-4",
    text: "Small, gentle steps forward are still progress. Softness is a quiet superpower.",
    category: "Courage & Boundaries",
    reflectionPrompt: "Name one tiny victory you accomplished in the last 24 hours.",
  },
  {
    id: "aff-5",
    text: "I choose to be a kind friend to my own mind today.",
    category: "Self-Compassion",
    reflectionPrompt: "How would you speak to your best friend if they were in your shoes?",
  },
  {
    id: "aff-6",
    text: "My body knows how to settle into sleep when I release the day's responsibilities.",
    category: "Sleep & Rest",
    reflectionPrompt: "What thoughts can you place into a mental safe box until tomorrow morning?",
  },
];

export const resourceArticles: ResourceArticle[] = [
  {
    id: "res-1",
    title: "The 90-Second Emotional Wave: Riding Out High Spikes",
    category: "Anxiety & Stress",
    readTime: "3 min read",
    description:
      "Neurobiologically, the chemical surge of an emotional wave lasts roughly 90 seconds. Here is how to surf through it without spiraling.",
    keyTakeaways: [
      "Physical sensations (tight chest, shallow breath) peak and naturally recede if we don't fuel them with recursive thoughts.",
      "Anchor to sensory data: temperature of your palms, firmness of the floor.",
      "Repeat mentally: 'This is a physical wave, and it is already beginning to pass.'",
    ],
    practicalExercise:
      "Place both feet flat, breathe in for 4, exhale with an audible sigh for 6. Count down from 90 softly.",
  },
  {
    id: "res-2",
    title: "Breaking The Doomscroll Loop Before Bed",
    category: "Sleep & Unwinding",
    readTime: "4 min read",
    description:
      "Why our brains crave stimulation when tired, and gentle nighttime rituals that transition you into deep restorative rest.",
    keyTakeaways: [
      "Tired brains have low executive friction, making social algorithms irresistible.",
      "Create a physical barrier: charge your device across the room 30 mins before sleeping.",
      "Replace the dopamine loop with a sensory anchor: soft warm lighting, chamomile tea, or ambient lo-fi.",
    ],
    practicalExercise:
      "Turn on LUMA's Rain soundscape in the Fun Zone and jot down 3 simple things you are done worrying about for tonight.",
  },
  {
    id: "res-3",
    title: "Taming The Overthinking Spiral: Cognitive Defusion",
    category: "Focus & Reset",
    readTime: "4 min read",
    description:
      "Instead of fighting anxious thoughts or arguing with them, learn the art of viewing them like clouds in your mental sky.",
    keyTakeaways: [
      "A thought is an event in the mind, not an undeniable forecast of the future.",
      "Add the prefix: 'I notice I am having the thought that...'",
      "Separating your identity from the thought creates immediate emotional breathing room.",
    ],
    practicalExercise:
      "Use LUMA's 'Thought Dump' tool: type your anxious worry, then click 'Release It' and watch it dissolve.",
  },
  {
    id: "res-4",
    title: "Setting Gentle Boundaries Without Guilt",
    category: "Relationships",
    readTime: "5 min read",
    description:
      "How to protect your emotional battery and say 'no' warmly, without over-explaining or feeling selfish.",
    keyTakeaways: [
      "Boundaries aren't walls; they are clear property lines that allow healthy intimacy.",
      "A simple formula: 'I love you, and I need a quiet evening to recharge tonight.'",
      "You do not need a medical or tragic excuse to honor your need for rest.",
    ],
    practicalExercise:
      "Write out a one-sentence boundary you want to honor this week in your private gratitude journal.",
  },
  {
    id: "res-5",
    title: "The Self-Compassion Break: Dr. Kristin Neff's 3 Pillars",
    category: "Self-Compassion",
    readTime: "3 min read",
    description:
      "A transformative, clinically backed approach to meeting your own mistakes and tough days with genuine warmth.",
    keyTakeaways: [
      "Mindfulness: Acknowledging 'This is a moment of suffering or stress.'",
      "Common Humanity: Remembering 'Struggle is part of shared human life; I am not alone.'",
      "Self-Kindness: Asking 'What kind words would soothe me right now?'",
    ],
    practicalExercise:
      "Place one hand gently on your heart or opposite shoulder. Take three steady breaths while repeating 'May I be patient with myself.'",
  },
];

export const musicVibes: MusicVibe[] = [
  {
    id: "vibe-lofi",
    vibe: "Lo-fi",
    emoji: "🎧",
    description: "Vinyl crackle, jazzy piano loops, and warm cozy beats to study or unwind with.",
    color: "from-purple-100 to-indigo-50",
    tracks: [
      { title: "Bao's Rainy Study Window", artist: "Luma Beats", duration: "2:45", tag: "Focus", whyGood: "Subtle rhythm that grounds restless thoughts" },
      { title: "Midnight Tea Kettle", artist: "Nujazz Cafe", duration: "2:30", tag: "Late Night", whyGood: "Gentle Rhodes chords with warm vinyl warmth" },
      { title: "Starlight Reverie", artist: "Cosmic Sleeper", duration: "3:10", tag: "Bedtime", whyGood: "Soft basslines that mimic deep relaxed heartbeats" },
    ],
  },
  {
    id: "vibe-chill",
    vibe: "Chill",
    emoji: "☕",
    description: "Soft acoustic melodies, gentle fingerpicking, and mellow rhythms to slow your pulse.",
    color: "from-amber-100 to-orange-50",
    tracks: [
      { title: "Warm Woolen Blankets", artist: "Norah & Friends", duration: "3:14", tag: "Acoustic", whyGood: "Intimate vocal warmth that feels like a hug" },
      { title: "Sunday Morning Dew", artist: "Mellow Breeze", duration: "2:52", tag: "Guitar", whyGood: "Open-tuned acoustic guitar with quiet reverbs" },
      { title: "Lavender Tea", artist: "Cedar & Pine", duration: "3:40", tag: "Cozy", whyGood: "Slow waltz rhythm ideal for a cup of herbal tea" },
    ],
  },
  {
    id: "vibe-happy",
    vibe: "Happy",
    emoji: "☀️",
    description: "Sunlit rhythms, playful ukuleles, and upbeat melodies to spark a bright smile.",
    color: "from-yellow-100 to-amber-50",
    tracks: [
      { title: "Golden Hour Stroll", artist: "Sunny Day Parade", duration: "2:58", tag: "Uplifting", whyGood: "Whimsical glockenspiel and cheerful handclaps" },
      { title: "Dandelion Wishes", artist: "Joyful Whistle", duration: "3:05", tag: "Smiles", whyGood: "Playful whistling over breezy acoustic strumming" },
      { title: "Pocket Full of Sunshine", artist: "The Brightside", duration: "3:22", tag: "Groove", whyGood: "Bouncy bassline that gently lifts your mood" },
    ],
  },
  {
    id: "vibe-romantic",
    vibe: "Romantic",
    emoji: "🌸",
    description: "Tender strings, soft pianos, and delicate harmonies that feel like a gentle embrace.",
    color: "from-pink-100 to-rose-50",
    tracks: [
      { title: "Holding Hands in the Garden", artist: "Serenade Duet", duration: "3:40", tag: "Strings", whyGood: "Cello and violin duet evoking deep tenderness" },
      { title: "Petals in the Breeze", artist: "Claire De Lune Ensemble", duration: "4:12", tag: "Piano", whyGood: "Impressionistic piano that softens tension" },
      { title: "Sweetest Whisper", artist: "Amore Trio", duration: "3:15", tag: "Acoustic", whyGood: "Warm romantic fingerstyle melody" },
    ],
  },
  {
    id: "vibe-sad",
    vibe: "Sad",
    emoji: "🌧️",
    description: "Deep, validating, emotional acoustics that let you feel your tears without feeling alone.",
    color: "from-blue-100 to-slate-100",
    tracks: [
      { title: "Let It Rain Gently", artist: "Solitary Willow", duration: "4:05", tag: "Cathartic", whyGood: "Solemn piano chords allowing safe emotional release" },
      { title: "The Quiet Room", artist: "Echoes of Dust", duration: "3:30", tag: "Release", whyGood: "Validates sorrow without being hopelessly heavy" },
      { title: "Tears Wash The Dust Away", artist: "Still Waters", duration: "3:45", tag: "Healing", whyGood: "Gradually builds into a comforting resolution" },
    ],
  },
  {
    id: "vibe-energetic",
    vibe: "Energetic",
    emoji: "⚡",
    description: "Uplifting rhythms and driving beats to get you out of a physical or mental slump.",
    color: "from-emerald-100 to-teal-50",
    tracks: [
      { title: "Spark Plug Morning", artist: "Kinetic Pulse", duration: "3:15", tag: "Rhythm", whyGood: "Steady 124 BPM driving positive physical momentum" },
      { title: "Step By Step Momentum", artist: "Neon Sprint", duration: "3:40", tag: "Cardio", whyGood: "Upbeat synth arpeggios that awaken sluggish energy" },
      { title: "Sunrise Horizon", artist: "Daybreak Flow", duration: "3:28", tag: "Motivation", whyGood: "Celebratory brass stabs and driving percussion" },
    ],
  },
  {
    id: "vibe-pop",
    vibe: "Pop",
    emoji: "✨",
    description: "Catchy, bright, feel-good anthems that lighten the atmosphere in seconds.",
    color: "from-fuchsia-100 to-purple-50",
    tracks: [
      { title: "Electric Confetti", artist: "Starlight Pop", duration: "3:02", tag: "Anthem", whyGood: "Infectious chorus designed to get toes tapping" },
      { title: "Good Vibes Only", artist: "The Daydreamers", duration: "2:48", tag: "Catchy", whyGood: "Light-hearted summer synth hooks" },
      { title: "Dancing With My Shadow", artist: "Luna Glow", duration: "3:12", tag: "Playful", whyGood: "Playful retro disco rhythm for bedroom dancing" },
    ],
  },
  {
    id: "vibe-bollywood",
    vibe: "Bollywood",
    emoji: "🪕",
    description: "Heartwarming, soulful Indian melodies and uplifting acoustics for comfort and joy.",
    color: "from-rose-100 to-amber-50",
    tracks: [
      { title: "Iktara (Acoustic Reprise)", artist: "Soul Strings", duration: "4:02", tag: "Soulful", whyGood: "Gentle acoustic guitar with sublime Sufi vocals" },
      { title: "Kabira (Gentle Breeze)", artist: "Rhythm & Harmony", duration: "3:50", tag: "Reflective", whyGood: "Heart-opening folk acoustics reminding us to be free" },
      { title: "Morning Raga Lounge", artist: "Aakash Deep", duration: "3:25", tag: "Peace", whyGood: "Tranquil bamboo flute (bansuri) with sitar drones" },
    ],
  },
];

export const watchRecommendations: WatchCategory[] = [
  {
    genre: "Comedy",
    items: [
      {
        title: "Paddington 2",
        platform: "Family Comedy",
        year: "2017",
        synopsis: "A polite, marmalade-loving bear spreads kindness, joy, and delicious sandwiches to everyone he meets.",
        whyWatch: "Universally proven to restore faith in humanity and bring warmth to the heaviest day.",
        comfortRating: "10/10 Comfort",
      },
      {
        title: "Ted Lasso",
        platform: "Apple TV+",
        year: "2020",
        synopsis: "An American college coach manages an English football club with unconditional empathy and radical optimism.",
        whyWatch: "Tackles anxiety, panic attacks, and vulnerability with genuine humor and heart.",
        comfortRating: "9.8/10 Wholesome",
      },
      {
        title: "The Good Place",
        platform: "Netflix",
        year: "2016",
        synopsis: "Four flawed humans try to become better people in an eccentric afterlife experiment.",
        whyWatch: "Smart, joyful, and philosophical—proves that nobody is broken beyond repair.",
        comfortRating: "9.5/10 Witty",
      },
    ],
  },
  {
    genre: "Romance",
    items: [
      {
        title: "About Time",
        platform: "Movie",
        year: "2013",
        synopsis: "A young man discovers time travel, leading to tender life lessons about love, fathers, and ordinary days.",
        whyWatch: "A deeply nourishing film that leaves you looking at everyday moments with reverence.",
        comfortRating: "9.7/10 Heartfelt",
      },
      {
        title: "Before Sunrise",
        platform: "Movie",
        year: "1995",
        synopsis: "Two strangers meet on a European train and spend one magical night walking through Vienna talking about life.",
        whyWatch: "Intimate, slow-paced conversational beauty that feels like an authentic human connection.",
        comfortRating: "9.4/10 Intimate",
      },
      {
        title: "Amélie",
        platform: "Movie",
        year: "2001",
        synopsis: "An imaginative Parisian waitress decides to secretly orchestrate tiny miracles for those around her.",
        whyWatch: "Rich accordion music, warm saturated tones, and pure whimsical love.",
        comfortRating: "9.6/10 Whimsical",
      },
    ],
  },
  {
    genre: "Thriller",
    items: [
      {
        title: "Knives Out",
        platform: "Movie",
        year: "2019",
        synopsis: "A quirky southern detective investigates the eccentric family of a wealthy mystery novelist.",
        whyWatch: "Witty, fast-paced puzzle that occupies 100% of your cognitive focus away from real-world worries.",
        comfortRating: "9.5/10 Smart Fun",
      },
      {
        title: "Only Murders in the Building",
        platform: "Hulu",
        year: "2021",
        synopsis: "Three true-crime podcast obsessives team up to investigate a death in their cozy Upper West Side building.",
        whyWatch: "Warm knit sweaters, autumn Manhattan streets, and delightfully light mystery suspense.",
        comfortRating: "9.2/10 Cozy Thrill",
      },
      {
        title: "Rear Window",
        platform: "Classic",
        year: "1954",
        synopsis: "A recuperating photographer suspects foul play in his courtyard neighbor's apartment.",
        whyWatch: "Hitchcock at his most captivating—timeless suspense that commands complete immersion.",
        comfortRating: "9.1/10 Classic",
      },
    ],
  },
  {
    genre: "Horror",
    items: [
      {
        title: "A Quiet Place",
        platform: "Movie",
        year: "2018",
        synopsis: "A tight-knit family navigates a post-apocalyptic world in silence to protect each other from noise-sensitive creatures.",
        whyWatch: "Masterclass in sensory immersion that celebrates deep parental devotion and quiet resilience.",
        comfortRating: "8.8/10 Gripping",
      },
      {
        title: "The Others",
        platform: "Movie",
        year: "2001",
        synopsis: "A mother in a fog-shrouded Victorian manor awaits her husband's return while protecting her sensitive children.",
        whyWatch: "Atmospheric, gothic elegance relying on shadow and mystery rather than gore.",
        comfortRating: "8.7/10 Atmospheric",
      },
      {
        title: "Signs",
        platform: "Movie",
        year: "2002",
        synopsis: "A grieving former pastor and his family discover mysterious crop circles on their Pennsylvania farm.",
        whyWatch: "Fascinating blend of sci-fi tension and a tender journey toward reclaiming hope and faith.",
        comfortRating: "8.9/10 Emotional Thrill",
      },
    ],
  },
  {
    genre: "Action",
    items: [
      {
        title: "Spider-Man: Into the Spider-Verse",
        platform: "Animation",
        year: "2018",
        synopsis: "Teenager Miles Morales steps into his unique identity as Spider-Man alongside alternate heroes.",
        whyWatch: "Visual masterpiece with dynamic comic energy and a soundtrack that sparks confidence.",
        comfortRating: "9.9/10 Inspiring",
      },
      {
        title: "Everything Everywhere All At Once",
        platform: "Movie",
        year: "2022",
        synopsis: "An overwhelmed laundromat owner connects with alternate universe versions of herself to save her daughter.",
        whyWatch: "Wild, creative rollercoaster that lands on the most profound message: 'Be kind, especially when we don't know what's going on.'",
        comfortRating: "9.7/10 Life-affirming",
      },
      {
        title: "Top Gun: Maverick",
        platform: "Movie",
        year: "2022",
        synopsis: "Maverick returns to train a squad of elite young pilots for a specialized, daring mission.",
        whyWatch: "Pure cinematic adrenaline, breathtaking aerial cinematography, and triumphant team camaraderie.",
        comfortRating: "9.3/10 Adrenaline",
      },
    ],
  },
  {
    genre: "Animation",
    items: [
      {
        title: "My Neighbor Totoro",
        platform: "Studio Ghibli",
        year: "1988",
        synopsis: "Two sisters explore rural Japan and befriend gentle woodland spirits who look after them.",
        whyWatch: "Zero villains, pure gentle wonder. Watching this is like taking a warm somatic sigh.",
        comfortRating: "10/10 Pure Healing",
      },
      {
        title: "Inside Out",
        platform: "Disney Pixar",
        year: "2015",
        synopsis: "Joy, Sadness, Anger, Fear, and Disgust guide an 11-year-old girl through a major life move.",
        whyWatch: "Validates that sadness is a necessary, compassionate emotion that brings people together.",
        comfortRating: "9.8/10 Cathartic",
      },
      {
        title: "Klaus",
        platform: "Netflix",
        year: "2019",
        synopsis: "A selfish postman and an artisan toymaker spark a chain reaction of goodwill in a frozen town.",
        whyWatch: "Sumptuous hand-drawn lighting and the timeless motto: 'A true selfless act always sparks another.'",
        comfortRating: "9.9/10 Uplifting",
      },
    ],
  },
  {
    genre: "Drama",
    items: [
      {
        title: "Little Women",
        platform: "Movie",
        year: "2019",
        synopsis: "Greta Gerwig's vibrant adaptation of the March sisters coming of age on their own terms.",
        whyWatch: "Cozy fireside atmosphere, magnificent music score, and deep familial affection.",
        comfortRating: "9.6/10 Nourishing",
      },
      {
        title: "Dead Poets Society",
        platform: "Movie",
        year: "1989",
        synopsis: "An unconventional English teacher inspires boarding school students to seize the day through poetry.",
        whyWatch: "Robin Williams at his most inspiring; reminds us to embrace curiosity and passion.",
        comfortRating: "9.4/10 Inspiring",
      },
      {
        title: "Good Will Hunting",
        platform: "Movie",
        year: "1997",
        synopsis: "A troubled mathematics genius finds healing through an empathetic therapist who sees through his defenses.",
        whyWatch: "The iconic 'It's not your fault' scene remains one of cinema's most healing moments.",
        comfortRating: "9.5/10 Healing",
      },
    ],
  },
];

export const jokeCollection: JokeItem[] = [
  {
    id: "jk-1",
    category: "Wholesome",
    setup: "Why did the little panda bring a bamboo shoot to school?",
    punchline: "Because he wanted to show everyone how fast he could grow! 🎋🐼",
    pandaReaction: "Bao gives you a warm panda high-five!",
  },
  {
    id: "jk-2",
    category: "Wholesome",
    setup: "What is a cloud's favorite kind of hug?",
    punchline: "A gentle misty rainbow cuddle! 🌈☁️",
    pandaReaction: "Bao does a cozy happy wiggle.",
  },
  {
    id: "jk-3",
    category: "Puns",
    setup: "Why was the math book looking so stressed out?",
    punchline: "Because it had way too many problems to solve on its own! 📐",
    pandaReaction: "Bao offers the math book a cup of chamomile tea.",
  },
  {
    id: "jk-4",
    category: "Puns",
    setup: "What did one teacup say to the other teacup?",
    punchline: "You are looking brew-tiful today! ☕✨",
    pandaReaction: "Bao sips hot green tea with a wink.",
  },
  {
    id: "jk-5",
    category: "Animal",
    setup: "What do you call a sleeping dinosaur?",
    punchline: "A dino-snore! 🦕💤",
    pandaReaction: "Bao curls into a sleepy fluffy ball.",
  },
  {
    id: "jk-6",
    category: "Animal",
    setup: "Why do sea otters hold hands while they sleep?",
    punchline: "So they don't drift away! (And because they are precious!) 🦦❤️",
    pandaReaction: "Bao holds up two fluffy paws in solidarity.",
  },
  {
    id: "jk-7",
    category: "Work & Study",
    setup: "Why did the computer take a 10-minute mindfulness break?",
    punchline: "Its cache was too full and it needed to refresh its memory! 💻🧘",
    pandaReaction: "Bao gently closes the laptop lid.",
  },
  {
    id: "jk-8",
    category: "Work & Study",
    setup: "I told my calendar that my weekend is fully booked with rest...",
    punchline: "It said: 'Finally, an appointment worth keeping!' 📅🛋️",
    pandaReaction: "Bao nods approvingly from a hammock.",
  },
  {
    id: "jk-9",
    category: "Everyday",
    setup: "My bed and I have a deeply committed relationship...",
    punchline: "We are literally perfect together, but my 7 AM alarm is wildly jealous! ⏰🛌",
    pandaReaction: "Bao hides under a warm quilt.",
  },
  {
    id: "jk-10",
    category: "Everyday",
    setup: "Why did the scarecrow win an award?",
    punchline: "Because he was outstanding in his field! 🌾🎖️",
    pandaReaction: "Bao applauds enthusiastically!",
  },
];

export const jokesList = jokeCollection;
