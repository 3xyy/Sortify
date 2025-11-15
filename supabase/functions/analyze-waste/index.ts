import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, city } = await req.json();
    console.log('Analyzing waste for city:', city);

    if (!imageData) {
      throw new Error('No image data provided');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Prepare the image URL (handle both base64 and URLs)
    let imageUrl = imageData;
    if (!imageData.startsWith('http')) {
      // It's base64, ensure it has the proper data URI prefix
      if (!imageData.startsWith('data:')) {
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

    console.log('Calling OpenAI GPT-5 with vision...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_completion_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const aiResponse = data.choices?.[0]?.message?.content;
    console.log('AI analysis:', aiResponse);
    
    if (!aiResponse) {
      console.error('Empty response from AI:', JSON.stringify(data));
      throw new Error('Empty response from AI. Please try again.');
    }
    
    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(aiResponse);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      console.error('Raw response:', aiResponse);
      throw new Error('Invalid JSON response from AI');
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-waste function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
