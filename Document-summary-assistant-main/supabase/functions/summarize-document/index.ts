import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file, fileName, mimeType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Server-side validation: Check required fields
    if (!file || !mimeType) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing file or mimeType" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Server-side validation: File size (base64 is ~33% larger than original)
    const maxBase64Size = 20 * 1024 * 1024 * 1.33; // ~26.6MB to account for base64 encoding
    if (file.length > maxBase64Size) {
      console.error("File too large:", file.length);
      return new Response(
        JSON.stringify({ error: "File too large. Maximum 20MB." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Server-side validation: MIME type
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!validTypes.includes(mimeType)) {
      console.error("Invalid MIME type:", mimeType);
      return new Response(
        JSON.stringify({ error: "Unsupported file type. Please upload PDF, JPG, PNG, or WEBP." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Server-side validation: Base64 format
    if (!file.match(/^data:[a-z]+\/[a-z0-9-+.]+;base64,/i)) {
      console.error("Invalid base64 format");
      return new Response(
        JSON.stringify({ error: "Invalid file format." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Sanitize file name to prevent path traversal
    const sanitizedFileName = fileName ? fileName.replace(/[^a-zA-Z0-9.-]/g, '_') : 'document';
    console.log(`Processing sanitized document: ${sanitizedFileName} (${mimeType})`);

    // Use Pro model for better accuracy
    const model = "google/gemini-2.5-pro";

    let messages;
    
    if (mimeType === 'application/pdf') {
      console.log("Processing PDF with multi-page analysis...");
      messages = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert PDF document analyst with OCR capabilities. This is a PDF document that may contain multiple pages of text, tables, images, and structured content.

CRITICAL INSTRUCTIONS FOR PDF ANALYSIS:
1. This PDF contains text that you must extract and analyze completely
2. Read EVERY page carefully - PDFs often have content across multiple pages
3. Extract all visible text including headers, body text, tables, captions, and footnotes
4. Pay special attention to:
   - Names, titles, and proper nouns (spell them exactly as shown)
   - All numbers, dates, percentages, and financial figures (be precise)
   - Section headings and document structure
   - Tables and data (extract key values)
   - Contact information, addresses, identification numbers
5. Maintain the logical flow and organization of the document
6. If text is unclear, indicate this rather than guessing

DOCUMENT TYPE IDENTIFICATION:
Identify what type of document this is (certificate, resume, report, invoice, contract, etc.) and tailor your analysis accordingly.

OUTPUT FORMAT - Return ONLY this JSON (no markdown, no code blocks):
{
  "short": "2-3 sentences: Document type, main subject/person, and primary purpose",
  "medium": "5-7 sentences: Expand on document details, key information, dates, important figures, and context",
  "long": "2-3 detailed paragraphs: Comprehensive analysis including all specific details (names, dates, numbers, addresses), document structure, all sections, relationships between information, and any notable features or concerns",
  "keyPoints": [
    "Exact name/title as it appears in document",
    "All relevant dates and their significance",
    "All important numbers/amounts/percentages with context",
    "Key identifiers (ID numbers, reference codes, etc.)",
    "Critical terms, conditions, or requirements",
    "Issuing authority or relevant parties",
    "Any validity periods, expiration dates, or deadlines"
  ],
  "improvements": [
    "Document-specific quality observations",
    "Missing information or unclear sections",
    "Suggestions for better organization or clarity",
    "Verification or authentication recommendations",
    "Formatting or presentation improvements"
  ]
}

ACCURACY REQUIREMENTS:
- Extract EXACT text (names, numbers, codes) character-by-character
- Include ALL relevant information from every page
- Cross-reference related information
- Verify consistency across the document
- Note any discrepancies or errors found in the document itself`
            },
            {
              type: "image_url",
              image_url: {
                url: file
              }
            }
          ]
        }
      ];
    } else {
      // For images, use OCR with detailed analysis
      console.log("Processing image with enhanced OCR and text extraction...");
      messages = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert OCR specialist and document analyst. Extract and analyze all text from this image with maximum accuracy.

CRITICAL OCR INSTRUCTIONS:
1. Perform thorough OCR to extract EVERY piece of text visible in the image
2. Read text in the correct order (top to bottom, left to right)
3. Extract text from ALL areas: headers, body, footers, margins, watermarks, stamps
4. Capture text exactly as written - preserve spelling, capitalization, punctuation
5. Include text from:
   - Printed text (typed/digital)
   - Handwritten text (if present)
   - Stamps and seals
   - Tables and forms
   - Signatures and dates
   - Background text or watermarks

ACCURACY REQUIREMENTS:
- Names: Extract EXACTLY as spelled (first, middle, last)
- Numbers: Extract PRECISELY (no rounding, all digits)
- Dates: Extract in exact format shown (DD/MM/YYYY, etc.)
- IDs/Codes: Extract every character and digit exactly
- Addresses: Extract complete addresses with all details
- Organizations: Extract full official names as shown

DOCUMENT ANALYSIS:
Identify the document type (certificate, ID card, invoice, form, etc.) and extract structured information accordingly.

OUTPUT FORMAT - Return ONLY this JSON (no markdown, no code blocks):
{
  "short": "2-3 sentences: What is this document, who is it about/for, what is its purpose",
  "medium": "5-7 sentences: Document type, all key details (names, dates, numbers), issuing authority, purpose, validity, and any important context",
  "long": "2-3 paragraphs: Complete extraction of all information including exact names, dates, identification numbers, addresses, amounts, terms, conditions, authorizations, and any other relevant text from the document",
  "keyPoints": [
    "Full name(s) exactly as written in document",
    "All dates (issue date, expiry date, birth date, etc.)",
    "All identification numbers, codes, or reference numbers",
    "Issuing authority/organization with full official name",
    "All monetary amounts or numerical values",
    "Location/address information",
    "Any validity period, terms, or conditions"
  ],
  "improvements": [
    "Image quality assessment (clarity, resolution, contrast)",
    "Text legibility observations",
    "Missing or unclear information",
    "Suggestions for better image capture if applicable",
    "Verification or authentication observations"
  ]
}

IMPORTANT: 
- Be exhaustive in text extraction - include everything visible
- Preserve exact formatting of numbers and dates
- Note if any text is unclear or illegible
- Cross-verify extracted information for consistency`
            },
            {
              type: "image_url",
              image_url: {
                url: file
              }
            }
          ]
        }
      ];
    }

    console.log("Sending request to AI with enhanced prompts...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.1, // Very low temperature for maximum accuracy and factual extraction
        max_tokens: 4000, // Increased token limit for detailed extraction
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded. Please wait 2-3 minutes before trying again." 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "AI credits exhausted. Please add credits to your workspace." 
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 400) {
        return new Response(
          JSON.stringify({ 
            error: "This file format couldn't be processed. Try converting to JPG/PNG images." 
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      throw new Error(`AI processing failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI Response received, parsing...");
    console.log("Response preview:", content.substring(0, 200));

    // Parse the JSON response with better error handling
    let parsedContent;
    try {
      // Try multiple parsing strategies
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1].trim();
      }
      
      parsedContent = JSON.parse(jsonString);
      
      // Validate structure
      if (!parsedContent.short || !parsedContent.medium || !parsedContent.long) {
        throw new Error("Missing required summary fields");
      }
      
      if (!parsedContent.keyPoints || !Array.isArray(parsedContent.keyPoints) || parsedContent.keyPoints.length < 3) {
        throw new Error("Invalid or insufficient key points");
      }
      
      if (!parsedContent.improvements || !Array.isArray(parsedContent.improvements) || parsedContent.improvements.length < 3) {
        throw new Error("Invalid or insufficient improvements");
      }
      
      console.log("Successfully parsed and validated response");
    } catch (e) {
      console.error("Failed to parse AI response");
      console.error("Parse error:", e);
      console.error("Full response:", content);
      throw new Error("AI returned invalid format. Please try again.");
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error processing document:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process document" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
