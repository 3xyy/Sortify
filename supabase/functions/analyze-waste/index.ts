import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, city } = await req.json();
    console.log("=== ANALYZE WASTE FUNCTION STARTED ===");
    console.log("City:", city);
    console.log("Image data length:", imageData?.length);
    console.log("Image data type:", typeof imageData);
    console.log("Image data preview:", imageData?.substring(0, 50));

    if (!imageData) {
      console.error("ERROR: No image data provided");
      throw new Error("No image data provided");
    }

    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    console.log("API Key present:", !!openAIApiKey);
    console.log("API Key length:", openAIApiKey?.length);

    if (!openAIApiKey) {
      console.error("ERROR: OPENAI_API_KEY not configured");
      throw new Error("OPENAI_API_KEY not configured");
    }

    // Prepare the image URL (handle both base64 and URLs)
    let imageUrl = imageData;
    if (!imageData.startsWith("http")) {
      // It's base64, ensure it has the proper data URI prefix
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

    const userPrompt = `Analyze this waste item for disposal in ${city}. Return ONLY the JSON object as specified.`;

    console.log("=== CALLING OPENAI API ===");
    console.log("Model: gpt-5-nano-2025-08-07");

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

    console.log("Request body prepared, messages count:", requestBody.messages.length);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("=== OPENAI RESPONSE ===");
    console.log("Status:", response.status);
    console.log("Status text:", response.statusText);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("=== OPENAI API ERROR ===");
      console.error("Status:", response.status);
      console.error("Error text:", errorText);

      // Try to parse error as JSON for more details
      try {
        const errorJson = JSON.parse(errorText);
        console.error("Error details:", JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.error("Could not parse error as JSON");
      }

      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("=== OPENAI RESPONSE DATA ===");
    console.log("Full response:", JSON.stringify(data, null, 2));
    console.log("Choices count:", data.choices?.length);

    const aiResponse = data.choices?.[0]?.message?.content;
    console.log("=== AI RESPONSE CONTENT ===");
    console.log("Content type:", typeof aiResponse);
    console.log("Content length:", aiResponse?.length);
    console.log("Content preview:", aiResponse?.substring(0, 200));
    console.log("Full content:", aiResponse);

    if (!aiResponse) {
      console.error("=== EMPTY AI RESPONSE ===");
      console.error("Full data object:", JSON.stringify(data, null, 2));
      throw new Error("Empty response from AI. Please check your API key and try again.");
    }

    // Parse the JSON response
    let analysisResult;
    try {
      console.log("=== PARSING JSON ===");
      analysisResult = JSON.parse(aiResponse);
      console.log("Parsed successfully:", JSON.stringify(analysisResult, null, 2));
    } catch (e) {
      console.error("=== JSON PARSE ERROR ===");
      console.error("Error:", e);
      console.error("Raw response to parse:", aiResponse);
      const errorMsg = e instanceof Error ? e.message : String(e);
      throw new Error(`Invalid JSON response from AI: ${errorMsg}`);
    }

    console.log("=== SUCCESS ===");
    console.log("Returning result:", JSON.stringify(analysisResult, null, 2));

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("=== FUNCTION ERROR ===");
    console.error("Error type:", error instanceof Error ? "Error" : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: error instanceof Error ? error.stack : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
