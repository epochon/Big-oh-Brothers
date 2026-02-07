from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

def deal_agent(data):
    """
    Acts as a Market Broker to find buyers and generate a contract.
    Input: Crop, Land Size, Location.
    Output: JSON with buyer offers and breakdown.
    """
    # Handle defaults
    crop = data.get('crop') or "Rice"
    land = data.get('land') or "5"
    location = data.get('location') or "India"

    prompt = f"""
    Act as a Crop Market Broker. Analyze these details:
    Crop: {crop}
    Land Size: {land} acres
    Location: {location}

    STRICT OUTPUT RULES:
    1. Identify 3 specific potential buyers for this region (e.g., ITC, Reliance, Local Mandi).
    2. Estimate the total YIELD (in Quintals) based on land size.
    3. Suggest a realistic PRICE per Quintal for each buyer.
    4. Calculate Total Earnings = Yield * Price.
    
    RETURN ONLY A LIST OF DICTIONARIES in this EXACT JSON format (no markdown):
    [
        {{"buyer": "Buyer Name", "type": "Type (Corporate/Mandi)", "price_per_qt": 2000, "estimated_yield": 50, "total_earning": 100000}},
        ...
    ]
    """
    
    # Note: For simplicity in this demo, strict JSON generation is requested.
    # In a production app, we'd use structured output features more robustly.
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            'response_mime_type': 'application/json'
        }
    )
    
    return response.text
