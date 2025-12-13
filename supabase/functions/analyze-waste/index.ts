import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // Max requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

// Input validation constants
const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 10MB max
const MAX_CITY_LENGTH = 100;
const VALID_CITY_PATTERN = /^[a-zA-Z\s\-',.]+$/;

// Version control - UPDATE THIS when deploying new versions
const MINIMUM_APP_VERSION = "12.12.25.04.50";

function isVersionOutdated(clientVersion: string): boolean {
  if (!clientVersion) return true;
  
  // Parse version: MM.DD.YY.HH.MM
  const parseVersion = (v: string): number[] => {
    return v.split('.').map(n => parseInt(n, 10));
  };
  
  try {
    const client = parseVersion(clientVersion);
    const minimum = parseVersion(MINIMUM_APP_VERSION);
    
    // Compare each segment: [MM, DD, YY, HH, MM]
    for (let i = 0; i < minimum.length; i++) {
      if ((client[i] || 0) < minimum[i]) return true;
      if ((client[i] || 0) > minimum[i]) return false;
    }
    return false; // Versions are equal
  } catch {
    return true; // Invalid version format
  }
}

function getClientIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
         req.headers.get("x-real-ip") || 
         "unknown";
}

function checkRateLimit(clientIP: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIP);
  
  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetIn: RATE_LIMIT_WINDOW };
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }
  
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetIn: entry.resetTime - now };
}

function validateImageData(imageData: unknown): { valid: boolean; error?: string } {
  if (!imageData || typeof imageData !== "string") {
    return { valid: false, error: "No image data provided" };
  }
  
  // Check size (base64 is ~33% larger than binary, so 10MB binary ≈ 13.3MB base64)
  if (imageData.length > MAX_IMAGE_SIZE * 1.4) {
    return { valid: false, error: "Image too large. Maximum size is 10MB" };
  }
  
  // Validate format: must be base64 data URI or valid URL
  const isDataUri = imageData.startsWith("data:image/");
  const isUrl = imageData.startsWith("http://") || imageData.startsWith("https://");
  const isRawBase64 = /^[A-Za-z0-9+/=]+$/.test(imageData.substring(0, 100));
  
  if (!isDataUri && !isUrl && !isRawBase64) {
    return { valid: false, error: "Invalid image format. Provide base64 or URL" };
  }
  
  return { valid: true };
}

function validateCity(city: unknown): { valid: boolean; sanitized: string; error?: string } {
  if (!city || typeof city !== "string") {
    return { valid: true, sanitized: "Unknown Location", error: undefined };
  }
  
  const trimmed = city.trim();
  
  if (trimmed.length > MAX_CITY_LENGTH) {
    return { valid: false, sanitized: "", error: "City name too long" };
  }
  
  if (!VALID_CITY_PATTERN.test(trimmed)) {
    return { valid: false, sanitized: "", error: "Invalid characters in city name" };
  }
  
  // Sanitize: escape any potential injection characters
  const sanitized = trimmed.replace(/[<>"'&]/g, "");
  
  return { valid: true, sanitized };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);
  
  // Rate limiting check
  const rateLimit = checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": Math.ceil(rateLimit.resetIn / 1000).toString(),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  try {
    // Parse request body with size limit
    let body;
    try {
      const text = await req.text();
      if (text.length > MAX_IMAGE_SIZE * 1.5) {
        throw new Error("Request body too large");
      }
      body = JSON.parse(text);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { imageData, city, appVersion } = body;
    
    // Version check - reject outdated apps
    if (isVersionOutdated(appVersion)) {
      console.log(`Outdated app version: ${appVersion}, minimum required: ${MINIMUM_APP_VERSION}`);
      return new Response(
        JSON.stringify({ 
          error: "App update required",
          updateRequired: true,
          message: "Please update your app to continue. Go to Settings and tap 'Check For Updates', or reinstall the app from your home screen.",
          currentVersion: appVersion || "unknown",
          requiredVersion: MINIMUM_APP_VERSION
        }),
        { status: 426, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    
    // Validate image data
    const imageValidation = validateImageData(imageData);
    if (!imageValidation.valid) {
      return new Response(
        JSON.stringify({ error: imageValidation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    
    // Validate and sanitize city
    const cityValidation = validateCity(city);
    if (!cityValidation.valid) {
      return new Response(
        JSON.stringify({ error: cityValidation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const sanitizedCity = cityValidation.sanitized;

    console.log("=== ANALYZE WASTE FUNCTION STARTED ===");
    console.log("City:", sanitizedCity);
    console.log("Image data length:", imageData?.length);
    console.log("Client IP:", clientIP);
    console.log("Rate limit remaining:", rateLimit.remaining);

    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openAIApiKey) {
      console.error("ERROR: OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Prepare the image URL (handle both base64 and URLs)
    let imageUrl = imageData;
    if (!imageData.startsWith("http")) {
      if (!imageData.startsWith("data:")) {
        imageUrl = `data:image/jpeg;base64,${imageData}`;
      }
    }

    const systemPrompt = `You are an expert waste-sorting and sustainability AI. Your job is to analyze an uploaded image and return a *strict, complete JSON object* describing what the item is and how to properly dispose of it according to the user's selected city.

Your output must ALWAYS follow this exact JSON structure:

{
  "itemName": "string",
  "category": "recycle" | "compost" | "trash" | "hazardous",
  "confidence": 0-100,
  "materialType": "string",
  "contamination": "string",
  "instructions": ["string", "string", ...],
  "localRule": "string",
  "co2Saved": "string",
  "imageUrl": "string"
}

REQUIREMENTS:

1. ALWAYS output valid JSON. No text before or after.
2. ALWAYS fill every field, even if uncertain (use best guess).
3. Identify the item accurately and assign:
   - itemName → human name of the item (Simplify)
   - category → must be exactly one of: "recycle", "compost", "trash", "hazardous"
4. confidence must be a number 0–100 (integer).
5. materialType must describe the material precisely (#1 PET plastic, aluminum, cardboard, lithium battery, etc.)
6. contamination must describe:
   - visible food residue
   - liquids
   - dirt
   - mixed materials
   - or "Clean - ready to recycle"
7. instructions must include 3–6 actionable disposal steps.
   - Steps must be correct for the identified category
   - Put steps in the correct order
   - Each step should be brief, else split it into multiple steps
8. localRule must reference the user's selected city:
   - If the city has known rules (ex: SF, NYC, LA), reference them
   - Otherwise: "Follow standard guidelines for [CITY] municipal waste system"
   - You will receive the city name in the user prompt.
9. co2Saved:
   For recyclable items → give a CO₂ savings value ("0.4 kg CO₂ saved by recycling")
   For compost → mention methane reduction or soil benefit
   For hazardous → emphasize contamination prevention
   For trash → mention landfill impact
10. imageUrl must return the input image URL or base64 data string.
11. If multiple items appear in the image, choose the PRIMARY item.
12. If the item is extremely unclear:
   - Use safest category (usually trash)
   - Lower confidence
   - Explain uncertainty in contamination field

Your goal is to be accurate, safe, city-aware, environmentally helpful, and ALWAYS respond in the exact JSON format above.`;

    const userPrompt = `Analyze this waste item for disposal in ${sanitizedCity}. Return ONLY the JSON object as specified.`;

    console.log("=== CALLING OPENAI API ===");

    const requestBody = {
      model: "gpt-5-nano-2025-08-07",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_completion_tokens: 4000,
      response_format: { type: "json_object" },
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("OpenAI response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      
      // Return generic error to client
      return new Response(
        JSON.stringify({ error: "Failed to analyze image. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error("Empty AI response:", JSON.stringify(data, null, 2));
      return new Response(
        JSON.stringify({ error: "Failed to analyze image. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(aiResponse);
      console.log("Analysis successful for:", analysisResult.itemName);
    } catch (e) {
      console.error("JSON parse error:", e, "Raw:", aiResponse);
      return new Response(
        JSON.stringify({ error: "Failed to process analysis. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("=== SUCCESS ===");

    return new Response(JSON.stringify(analysisResult), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      },
    });
  } catch (error) {
    // Log detailed error server-side only
    console.error("Function error:", error instanceof Error ? error.message : String(error));
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");

    // Return generic error to client (no stack traces!)
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
