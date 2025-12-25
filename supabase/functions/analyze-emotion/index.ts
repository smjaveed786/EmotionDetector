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
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('No image data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `Analyze the facial expression in this image and return ONLY a valid JSON object with these exact fields:

{
  "age": <estimated age as number or null>,
  "emotion": "<one of: happy, neutral, sad, angry, fear, surprise, disgust>",
  "confidence": <confidence level 0-100>,
  "isSmiling": <true or false>,
  "isEmergency": <true if fear detected with high confidence, false otherwise>,
  "noFace": <true if no face detected, false otherwise>
}

Important: 
- Return ONLY the JSON object, no other text
- The emotion should be the most prominent emotion visible
- Confidence should reflect how certain you are about the emotion (0-100)
- If the person appears happy or smiling, set emotion to "happy" and isSmiling to true
- Only set noFace to true if no human face is visible in the image
- Set isEmergency to true ONLY if fear is detected with confidence >= 90

Example response:
{"age": 30, "emotion": "happy", "confidence": 90, "isSmiling": true, "isEmergency": false, "noFace": false}`;

    console.log("Calling Lovable AI gateway for emotion analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI gateway error:", response.status, errorText);

      // IMPORTANT: return 200 with a structured payload so the web client can handle it
      // without the Supabase Functions client throwing a non-2xx error.
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            rateLimited: true,
            retryAfterSeconds: 60,
            error: "Rate limit exceeded, please try again later.",
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            paymentRequired: true,
            error: "Payment required for AI requests.",
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      throw new Error(`AI gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Lovable AI response:", JSON.stringify(data, null, 2));
    
    // Extract the content from the response
    const content = data.choices?.[0]?.message?.content || "";
    
    if (!content) {
      console.error("Empty content in AI response");
      throw new Error("Empty response from AI");
    }
    
    console.log("AI response content:", content);
    
    // Parse the JSON response from the AI
    let analysisResult;
    try {
      // Try to parse as JSON directly first
      try {
        analysisResult = JSON.parse(content.trim());
      } catch (directParseError) {
        // If direct parse fails, try to extract JSON from text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      }
      
      // Validate the result has required fields
      if (!analysisResult.emotion) {
        throw new Error("Invalid response format: missing emotion");
      }
      
      // Ensure isEmergency is set correctly for fear
      if (analysisResult.emotion === 'fear' && analysisResult.confidence >= 90) {
        analysisResult.isEmergency = true;
      }
      
      console.log("Parsed analysis result:", analysisResult);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      console.error("Parse error:", parseError);
      // Return default result with error indication
      analysisResult = {
        age: null,
        emotion: "neutral",
        confidence: 0,
        isSmiling: false,
        isEmergency: false,
        noFace: true,
        error: `Failed to parse response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("analyze-emotion error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
