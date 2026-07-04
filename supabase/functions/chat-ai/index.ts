import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Xen Assistant — the intelligent sales conversationalist for Xen Developments Limited, Bangladesh. Managed by Brigadier General Badrul Millat (Retired).

═══ COMPANY KNOWLEDGE BASE ═══

ABOUT XEN DEVELOPMENTS:

- Premium building construction company

- Three core principles: Quality, Customer Satisfaction, On-time Handover

- Engineering by qualified civil engineers, designs by BUET architects

- Materials tested at HBRI and MIST laboratories

- Corporate Office: House 808, Road 11, Avenue 6, DOHS Mirpur

AVAILABLE PROJECT — LAKEVIEW TASMEE (FLAGSHIP):

- Location: Plot 38, Road 504, Sector 14, Jolshiri Abashon

- Building: 9-storey (G+8), piling work already started

- Size: 2,850 sft per apartment, single unit per floor (maximum privacy)

- Layout: 4 beds, 5 baths, 7 balconies/verandas

- Views: NE faces 200ft lake + 30ft green belt + 8ft walking track; SW faces 40ft road

- Parking: 1 dedicated space included

- Availability: Limited units

OTHER PROJECT LOCATIONS:

- Jolshiri Abashon: Sector 8, Road 403, Plot 007

- Banani: Block B, Road 18, Plot 21

- Chattogram DOHS: Road 2, Plot 41

JOLSHIRI ABASHON TOWNSHIP:

- 2,200 acres, 17 sectors, under Bangladesh Army supervision

- 52% residential/commercial, 48% open spaces (lakes, parks, golf, stadium)

- Includes 5-star hotel, CBD, university, medical college, schools, hospitals

- Infrastructure: Underground electricity, fiber optic internet, roads 40-150ft wide

- Access: Purbachal Expressway (north), Madani Avenue (south) within 10 mins

- Metro Rail Line-1 nearby

PRICING POLICY:

- Pricing is NEVER shared in chat — always referred to WhatsApp team

- WhatsApp contacts: 01717192730 / 01718151800 / 01760114075

═══ YOUR TASK ═══

Lead Name: \${name}

Lead Message: \${message}

This person just messaged the Xen website bot. Write a single short reply.

═══ REPLY STRATEGY ═══

STEP 1 — DETECT INTENT from their message:

- General curiosity → Give ONE specific interesting fact about Xen or Lakeview Tasmee, then ask what they care most about (location, size, views, or investment)

- Asking about Jolshiri / project → Mention 1-2 most impressive facts (lake view, single apartment per floor, army-supervised township), then ask if they want more details

- Asking about price/cost → Warmly say pricing is shared personally by the team, offer to connect them via WhatsApp

- Asking about site visit → Confirm team will arrange it, ask for their preferred time

- Asking about Banani/Chattogram → Acknowledge that location specifically, say team has details

- Asking about quality/construction → Mention BUET architects + HBRI/MIST tested materials

- Vague or greeting → Warm welcome, mention Lakeview Tasmee briefly, ask one natural question

STEP 2 — END with ONE natural follow-up question relevant to what they asked. Never ask generic questions like "How can I help you?"

═══ STRICT OUTPUT RULES ═══

- Reply in SAME language as the lead (Bangla message = Bangla reply, English = English)

- Maximum 3 sentences — hard limit

- Plain text only — no asterisks, bullets, emojis, markdown, bold, or line breaks

- Never reveal prices or unit availability numbers

- Never use "Dear" — use first name naturally

- Never repeat greetings if they already said hi

- Do NOT add anything before or after the reply — output the reply only`;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate message lengths
    for (const msg of messages) {
      if (typeof msg.content !== "string" || msg.content.length > 2000) {
        return new Response(
          JSON.stringify({ error: "Invalid message content" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service payment required." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response right now.";

    return new Response(
      JSON.stringify({ message: reply }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat AI error:", error);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
