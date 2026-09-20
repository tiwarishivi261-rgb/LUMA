import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI();
  }
  return aiClient;
}

const defaultJaipurClinics = [
  {
    id: "jp-vimhns",
    name: "Vivekananda Institute of Mental Health and Neuro Sciences",
    address: "C-25D, Malviya Nagar Industrial Area, Malviya Nagar, Jaipur, Rajasthan 302017",
    phone: "083860 45922",
    rating: 4.8,
    userRatingCount: 650,
    googleMapsUri: "https://maps.google.com/?cid=2225048173124151070",
    distanceKm: 7.8,
    types: ["hospital", "doctor", "medical_clinic", "mental_health"],
  },
  {
    id: "jp-dharmdeep",
    name: "Dr. Dharmdeep Singh (Senior Psychiatrist & De-addiction)",
    address: "AB 91 Shiv Shakti Vihar, near HP Petrol Pump, Niwaru, Jaipur, Rajasthan 302012",
    phone: "097995 47211",
    rating: 4.9,
    userRatingCount: 854,
    googleMapsUri: "https://maps.google.com/?cid=6144441702438822735",
    distanceKm: 11.6,
    types: ["doctor", "medical_clinic", "mental_health"],
  },
  {
    id: "jp-jangir",
    name: "Dr. Shri Niwash Jangir (Psychiatrist & Neuropsychiatrist)",
    address: "Pink Vinayak Hospital, 46, Dhuleshwar Garden, Sardar Patel Marg, C Scheme, Jaipur, Rajasthan 302001",
    phone: "098120 75333",
    rating: 5.0,
    userRatingCount: 532,
    googleMapsUri: "https://maps.google.com/?cid=15276490048463992157",
    distanceKm: 1.2,
    types: ["hospital", "doctor", "medical_clinic", "mental_health"],
  },
  {
    id: "jp-tambi",
    name: "Dr. Anil Tambi (Consultant Neuro-Psychiatrist)",
    address: "Kalgeri Road, A-630, Govind Marg, near Rungata Hospital, Malviya Nagar, Jaipur, Rajasthan 302017",
    phone: "0141 252 2955",
    rating: 4.8,
    userRatingCount: 1220,
    googleMapsUri: "https://maps.google.com/?cid=8113909453006965930",
    distanceKm: 6.9,
    types: ["doctor", "medical_clinic", "mental_health"],
  },
  {
    id: "jp-gaurav",
    name: "Dr. Gaurav Rajender (Psychiatrist & Counselor)",
    address: "B-2, Govind Marg, Near Pink Square Mall, Raja Park, Jaipur, Rajasthan 302004",
    phone: "088900 06006",
    rating: 5.0,
    userRatingCount: 3107,
    googleMapsUri: "https://maps.google.com/?cid=14950718111258956579",
    distanceKm: 5.2,
    types: ["doctor", "medical_clinic", "mental_health"],
  },
];

// Nearby Healthcare & Clinic Search using Google Maps Places API (New)
// Defaults to Jaipur, Rajasthan with real Google Maps Places Text Search
app.get("/api/places/nearby", async (req, res) => {
  const city = (req.query.city as string) || "Jaipur, Rajasthan";
  const query = (req.query.q as string) || "mental health clinic psychiatrist therapist";

  try {
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res.json({
        places: defaultJaipurClinics,
        city,
        attribution: "Google Maps & Accredited Healthcare Registry",
      });
    }

    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-Maps-Solution-ID": "gmp_git_agentskills_v1",
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.googleMapsUri,places.rating,places.userRatingCount,places.location,places.types",
      },
      body: JSON.stringify({
        textQuery: `${query} in ${city}`,
        maxResultCount: 8,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Places API error:", response.status, errText);
      return res.json({
        places: defaultJaipurClinics,
        city,
        attribution: "Google Maps & Accredited Healthcare Registry",
      });
    }

    const data = await response.json();
    const jaipurCenter = { lat: 26.9124, lng: 75.7873 };

    let places = (data.places || []).map((p: any) => {
      let distanceKm: number | undefined;
      if (p.location?.latitude && p.location?.longitude) {
        const dLat = (p.location.latitude - jaipurCenter.lat) * 111;
        const dLng = (p.location.longitude - jaipurCenter.lng) * 102;
        distanceKm = Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10;
      }

      return {
        id: p.id,
        name: p.displayName?.text || "Mental Health Clinic",
        address: p.formattedAddress || "Jaipur, Rajasthan",
        phone: p.nationalPhoneNumber || undefined,
        rating: p.rating || undefined,
        userRatingCount: p.userRatingCount || undefined,
        googleMapsUri: p.googleMapsUri || `https://maps.google.com/?q=${encodeURIComponent(p.displayName?.text || query)}`,
        distanceKm,
        types: p.types || [],
      };
    });

    if (places.length === 0 && city.toLowerCase().includes("jaipur")) {
      places = defaultJaipurClinics;
    }

    res.json({
      city,
      places,
      attribution: "Google Maps",
    });
  } catch (error: any) {
    console.error("Error in /api/places/nearby:", error);
    res.json({
      places: defaultJaipurClinics,
      city,
      attribution: "Google Maps & Accredited Healthcare Registry",
    });
  }
});

// In-memory mock community posts with seed data
let communityPosts = [
  {
    id: "post-1",
    author: "Gentle Panda",
    avatar: "🐼",
    topic: "Wins",
    timestamp: "10 mins ago",
    content: "Took a 10-minute walk outside instead of doom-scrolling when I felt overwhelmed with work today. The breeze helped a lot. Small victories count!",
    hearts: 14,
    hugs: 8,
    sparkles: 12,
    replies: [
      { id: "rep-1", author: "Cozy Koala", avatar: "🐨", content: "So proud of you! Breaking that scroll loop is genuinely hard.", timestamp: "5 mins ago" }
    ]
  },
  {
    id: "post-2",
    author: "Calm Llama",
    avatar: "🦙",
    topic: "Anxiety",
    timestamp: "45 mins ago",
    content: "My chest felt tight before a big presentation. Did the 4-7-8 breathing twice in the quiet room. Heart rate slowed down enough to get through it safely.",
    hearts: 22,
    hugs: 19,
    sparkles: 9,
    replies: [
      { id: "rep-2", author: "Serene Sloth", avatar: "🦥", content: "That breathwork is magic. Sending peaceful energy for the rest of your day!", timestamp: "20 mins ago" }
    ]
  },
  {
    id: "post-3",
    author: "Mellow Otter",
    avatar: "🦦",
    topic: "DailyGratitude",
    timestamp: "2 hours ago",
    content: "Grateful for warm cinnamon tea, cozy socks, and having friends who let me be quiet when I don't have the energy to talk.",
    hearts: 31,
    hugs: 15,
    sparkles: 24,
    replies: []
  },
  {
    id: "post-4",
    author: "Hopeful Fox",
    avatar: "🦊",
    topic: "Overthinking",
    timestamp: "4 hours ago",
    content: "Remembering a reminder from LUMA: 'Thoughts are like weather; you don't have to control the clouds to enjoy the sky.' Needed to hear this tonight.",
    hearts: 45,
    hugs: 28,
    sparkles: 37,
    replies: [
      { id: "rep-3", author: "Peaceful Bunny", avatar: "🐰", content: "Saving this quote in my journal right now ✨", timestamp: "3 hours ago" }
    ]
  }
];

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "LUMA Wellness Companion" });
});

// Community Feed Endpoints
app.get(["/api/community", "/api/community/posts"], (_req, res) => {
  res.json(communityPosts);
});

app.post(["/api/community", "/api/community/posts"], (req, res) => {
  const { author, authorAlias, avatar, topic, tag, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Content is required" });
  }

  const newPost = {
    id: `post-${Date.now()}`,
    author: authorAlias || author || "Gentle Wanderer",
    authorAlias: authorAlias || author || "Gentle Wanderer",
    avatar: avatar || "🐼",
    topic: tag || topic || "General",
    tag: tag || topic || "Gentle Reminder",
    timestamp: "Just now",
    content: content.trim(),
    reactions: 1,
    hearts: 1,
    hugs: 1,
    sparkles: 0,
    replies: []
  };

  communityPosts.unshift(newPost);
  res.status(201).json(newPost);
});

app.post(["/api/community/:id/react", "/api/community/posts/:id/react"], (req, res) => {
  const { id } = req.params;
  const { reaction } = req.body || {}; // 'hearts' | 'hugs' | 'sparkles'
  const post: any = communityPosts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  post.reactions = (post.reactions || 0) + 1;
  if (reaction === "hearts") post.hearts = (post.hearts || 0) + 1;
  else if (reaction === "hugs") post.hugs = (post.hugs || 0) + 1;
  else if (reaction === "sparkles") post.sparkles = (post.sparkles || 0) + 1;
  res.json(post);
});

app.post(["/api/community/:id/reply", "/api/community/posts/:id/reply"], (req, res) => {
  const { id } = req.params;
  const { author, avatar, content } = req.body;
  const post = communityPosts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Reply content required" });
  }

  const newReply = {
    id: `rep-${Date.now()}`,
    author: author || "Mindful Friend",
    avatar: avatar || "🌸",
    content: content.trim(),
    timestamp: "Just now"
  };
  post.replies.push(newReply);
  res.status(201).json({ reply: newReply, post });
});

// AI Companion Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const ai = getGenAI();

    // Prepare contextual system instruction
    const currentMoodStr = userContext?.currentMood
      ? `User's latest check-in: Mood is "${userContext.currentMood.mood}" (intensity ${userContext.currentMood.intensity}/10). Context factors: ${userContext.currentMood.reasons?.join(", ") || "none specified"}. Note: "${userContext.currentMood.note || "No note"}".`
      : "User has not checked in their mood yet today.";

    const recentActivitiesStr = userContext?.recentActivities?.length
      ? `Recent wellness activities: ${userContext.recentActivities.join(", ")}.`
      : "";

    const userName = userContext?.name || "Friend";

    const systemPrompt = `You are LUMA, a warm, modern, emotionally intelligent mental-wellness companion and digital friend for ${userName}.
You are NOT a clinical diagnostic app, robotic questionnaire, or formal medical therapist. You are a compassionate, thoughtful, authentic confidant who listens deeply, validates feelings, and offers gentle grounded presence.

Key characteristics:
1. Warm, relatable, Gen-Z / modern friendly, thoughtful. Speak like a caring, grounded companion who sits beside them with a warm cup of tea.
2. Short to medium conversational responses (2 to 4 gentle paragraphs or conversational thoughts). Do not write overwhelming essays or bullet-heavy lectures unless specifically asked.
3. Be attentive to context:
   - Current Mood Context: ${currentMoodStr}
   - Activity Context: ${recentActivitiesStr}
4. Conversational Continuity: Remember what was just talked about in recent turns. Follow up naturally instead of restarting like a stranger.
5. Adapt to their immediate emotional need:
   - Venting: Hold gentle space, empathize authentically, don't rush to "fix" it right away.
   - Overthinking/Anxious: Offer a grounding anchor, remind them they are safe right now, invite a soft exhale.
   - Drained/Tired: Validate the need to rest without guilt.
   - Joyful/Proud: Celebrate enthusiastically with them!
6. Occasional Natural Suggestions: When it feels supportive, you can organically invite them to try one of LUMA's tools, such as:
   - Box breathing or 4-7-8 relaxing breath
   - 5-4-3-2-1 Sensory Grounding
   - Thought Dump (uncluttering the mind)
   - Fun Zone (a light laugh with panda jokes, soothing lo-fi, or a quick game of tic-tac-toe)
7. Non-Clinical Safety Guardrail: If the user expresses active self-harm, suicidal ideation, or severe emergency, respond with heartfelt care, validate their human pain, and clearly provide direct help resources:
   - "Please know you don't have to carry this alone. You can reach the Suicide & Crisis Lifeline anytime by calling or texting 988 (US/Canada), texting HOME to 741741, calling 111 (UK), or calling 9152987821 (India). Professional and compassionate people are available 24/7."
`;

    if (!ai) {
      // Warm, contextual fallback if API key is not configured
      const lastMessage = messages?.[messages.length - 1]?.content || "";
      const lower = lastMessage.toLowerCase();

      const needsProfessionalSupport =
        lower.includes("need a therapist") ||
        lower.includes("doctor") ||
        lower.includes("psychiatrist") ||
        lower.includes("clinic") ||
        lower.includes("hospital") ||
        lower.includes("depression") ||
        lower.includes("can't take this anymore") ||
        lower.includes("professional help") ||
        lower.includes("therapy");

      const isSafetyConcern =
        lower.includes("kill myself") ||
        lower.includes("suicide") ||
        lower.includes("end my life") ||
        lower.includes("harm myself") ||
        lower.includes("want to die");

      let reply = "";
      if (isSafetyConcern) {
        reply = `Please know how much you matter, and that you do not have to carry this alone. I am here with you, but I urge you to connect with human support right now. You can call or text 988 (US/Canada), text HOME to 741741, call 111 (UK), or call 9152987821 (India). Loving help is available 24/7.`;
      } else if (needsProfessionalSupport) {
        reply = `I hear you, ${userName}, and I want you to know how deeply courageous it is to recognize when additional support is needed. While LUMA is here as a gentle companion, connecting with an accredited mental health professional, therapist, or clinic can provide the personalized care you deserve. Would you like to view nearby support centers in Jaipur?`;
      } else if (lower.includes("overwhelm") || lower.includes("stress") || lower.includes("anxious") || lower.includes("panic")) {
        reply = `I hear you, ${userName}. It sounds like a lot is weighing on your shoulders right now. Take a soft breath with me—just dropping your shoulders away from your ears for a moment. You don't have to solve everything in this exact minute. Would you like to do a quick 2-minute 4-7-8 breathing exercise together, or would you rather vent about what's pressing on you?`;
      } else if (lower.includes("sad") || lower.includes("cry") || lower.includes("down") || lower.includes("lonely")) {
        reply = `I'm holding gentle space for you right now, ${userName}. It's completely okay to feel heavy and not have everything figured out. Your feelings make sense, and you don't need to force a smile. I'm right here with you. What feels like the hardest part of today?`;
      } else if (lower.includes("happy") || lower.includes("good") || lower.includes("win") || lower.includes("great") || lower.includes("proud")) {
        reply = `That brings such a warm smile to my face, ${userName}! Seeing you have a moment of lightness or celebration is so wonderful. Tell me more about it—what made this moment special?`;
      } else if (lower.includes("tired") || lower.includes("exhausted") || lower.includes("burnout") || lower.includes("drained")) {
        reply = `You've been carrying so much, ${userName}. Sometimes the most productive and loving thing you can do is give yourself permission to do absolutely nothing for a little while. Have you had a sip of water or a moment to rest your eyes recently?`;
      } else {
        reply = `I'm here with you, ${userName}. Thank you for sharing that with me. Even in the middle of a busy or uncertain day, taking a moment to pause and check in with yourself is a meaningful step. How are you feeling in your body right now?`;
      }

      return res.json({
        reply,
        suggestProfessionalSupport: needsProfessionalSupport,
        isSafetyConcern: isSafetyConcern,
        suggestedAction: isSafetyConcern
          ? { type: "safety_alert", label: "Immediate Crisis & Safety Support" }
          : needsProfessionalSupport
          ? { type: "professional_support", label: "Find Professional Support Near You" }
          : lower.includes("stress") || lower.includes("anxious")
          ? { type: "breathing", label: "Try 4-7-8 Breathwork", reason: "Helps calm the sympathetic nervous system" }
          : undefined
      });
    }

    // Call Gemini with multi-model fallback to ensure zero repetitive answers and resilience against 503 spikes
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let replyText = "";

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.85,
          },
        });
        if (response.text && response.text.trim()) {
          replyText = response.text.trim();
          break;
        }
      } catch (err: any) {
        // Handle transient 503 high demand or unavailable error smoothly by trying next candidate
        console.warn(`Model ${modelName} attempt unavailable or busy, trying next model:`, err?.status || err?.message || err);
      }
    }

    if (!replyText) {
      // Dynamic conversational fallback based on the user's latest message
      const lastMsg = messages?.[messages.length - 1]?.content || "";
      const lower = lastMsg.toLowerCase();
      if (lower.includes("anxious") || lower.includes("stress") || lower.includes("panic")) {
        replyText = `I hear how much tension is present right now, ${userName}. Your chest and shoulders might be holding a lot of tightness. Let's take one unhurried breath together—drop your jaw, soften your shoulders. Would you like to try our 4-7-8 relaxing breath, or do you want to keep sharing what's happening?`;
      } else if (lower.includes("sad") || lower.includes("cry") || lower.includes("lonely") || lower.includes("hurt")) {
        replyText = `I'm sitting right here with you, ${userName}. It's completely valid and human to feel low, and you don't need to put on a brave face for me. What is feeling the heaviest on your heart right now?`;
      } else {
        replyText = `Thank you for sharing that with me, ${userName}. I'm listening closely with an open heart. What thoughts or bodily feelings are showing up most for you right now?`;
      }
    }

    // Check if professional support suggestion or safety concern should be flagged
    const lastUserText = (messages?.[messages.length - 1]?.content || "").toLowerCase();
    const needsProfessionalSupport =
      lastUserText.includes("need a therapist") ||
      lastUserText.includes("doctor") ||
      lastUserText.includes("psychiatrist") ||
      lastUserText.includes("clinic") ||
      lastUserText.includes("hospital") ||
      lastUserText.includes("depression") ||
      lastUserText.includes("can't take this anymore") ||
      lastUserText.includes("professional help") ||
      lastUserText.includes("therapy");

    const isSafetyConcern =
      lastUserText.includes("kill myself") ||
      lastUserText.includes("suicide") ||
      lastUserText.includes("end my life") ||
      lastUserText.includes("harm myself") ||
      lastUserText.includes("want to die");

    res.json({
      reply: replyText,
      suggestProfessionalSupport: needsProfessionalSupport,
      isSafetyConcern: isSafetyConcern,
      suggestedAction: isSafetyConcern
        ? { type: "safety_alert", label: "Immediate Crisis & Safety Support" }
        : needsProfessionalSupport
        ? { type: "professional_support", label: "Find Professional Support Near You" }
        : undefined,
    });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    res.json({
      reply: "I'm listening and right here beside you. Take a deep, slow breath. Tell me what's on your mind today, and we'll take it one gentle step at a time.",
      suggestProfessionalSupport: false,
      isSafetyConcern: false,
    });
  }
});

// Personalized AI Insights Endpoint
app.post("/api/mood/insight", async (req, res) => {
  try {
    const { history, currentMood, userName } = req.body;

    // Helper to generate deeply tailored non-clinical insight if models are busy or offline
    const buildTailoredInsight = () => {
      const mood = (currentMood?.mood || "balanced").toLowerCase();
      const reasons: string[] = currentMood?.reasons || [];
      const name = userName || "Friend";
      const reasonText = reasons.length > 0 ? reasons.slice(0, 2).join(" & ") : "daily rhythm";

      if (mood === "anxious" || mood === "overwhelmed") {
        return {
          summary: `You are moving through a high-energy mental space right now, ${name}.`,
          keyPattern: reasons.length
            ? `Your nervous system shows noticeable sensitivity when dealing with ${reasonText}.`
            : `High-stimulation days naturally ask for smaller, more frequent grounding pauses.`,
          nudge: `Unclench your jaw, drop your shoulders away from your ears, and take 3 slow exhales.`
        };
      } else if (mood === "drained") {
        return {
          summary: `Your energy is gently asking for restorative rest rather than more effort.`,
          keyPattern: `Continuous emotional output without unstructured downtime gently depletes your reserves.`,
          nudge: `Give yourself permission to do 10 minutes of completely agenda-free quiet time today.`
        };
      } else if (mood === "peaceful" || mood === "joyful" || mood === "balanced") {
        return {
          summary: `There is an open, nourishing sense of equilibrium in your day, ${name}.`,
          keyPattern: `Notice how intentional moments around ${reasonText} support your clarity and ease.`,
          nudge: `Bookmark this feeling of lightness in your memory to anchor future busy days.`
        };
      } else if (mood === "reflective") {
        return {
          summary: `You are in a thoughtful, observant space with your inner world, ${name}.`,
          keyPattern: `Quiet introspection often reveals what boundaries or priorities matter most.`,
          nudge: `Jot down one feeling or thought that feels most important to you today.`
        };
      }

      return {
        summary: `Your emotional baseline shows steady awareness and self-compassion, ${name}.`,
        keyPattern: reasons.length
          ? `Your energy connects closely with ${reasonText} throughout the week.`
          : `Taking a moment to pause and check in helps stabilize your emotional baseline.`,
        nudge: `Drink a warm sip of water and honor the small steps you've taken today.`
      };
    };

    const ai = getGenAI();
    if (!ai) {
      return res.json(buildTailoredInsight());
    }

    const prompt = `Based on the user's recent mood logs:
Current Mood: ${JSON.stringify(currentMood || {})}
Recent logs: ${JSON.stringify(history?.slice(-5) || [])}
Generate a warm, supportive, non-clinical insight for ${userName || "this user"} in JSON format:
{
  "summary": "Short 1-2 sentence warm observation about their emotional rhythm",
  "keyPattern": "1 sentence identifying a gentle pattern or connection to their tags",
  "nudge": "1 compassionate, actionable mini-nudge for the rest of the day"
}`;

    const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let parsed: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            systemInstruction: "You are LUMA, a supportive wellness companion. Offer warm, encouraging, non-clinical pattern observations."
          }
        });

        if (response.text && response.text.trim()) {
          const jsonMatch = response.text.trim();
          parsed = JSON.parse(jsonMatch);
          if (parsed && parsed.summary && parsed.keyPattern && parsed.nudge) {
            break;
          }
        }
      } catch (err: any) {
        // Log brief note for transient 503 or 429 and try fallback model
        console.warn(`Insight model ${modelName} unavailable, trying fallback:`, err?.status || err?.message || err);
      }
    }

    if (parsed && parsed.summary) {
      return res.json(parsed);
    }

    // If all models are experiencing high demand (503), return contextual fallback
    return res.json(buildTailoredInsight());
  } catch (err) {
    console.error("Error generating insight fallback:", err);
    res.json({
      summary: "Your emotional rhythm is unique and ever-evolving.",
      keyPattern: "Notice how small intentional pauses create space for calmer clarity.",
      nudge: "Take a sip of water, drop your shoulders, and honor where you are right now."
    });
  }
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LUMA server running on http://localhost:${PORT}`);
  });
}

start();
