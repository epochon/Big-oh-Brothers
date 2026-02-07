import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def refiner_agent(env_data, market_data):
    """
    Summarizes the environment and market data into a concise search query (< 200 chars)
    optimized for the Tavily API.
    """
    prompt = f"""
Act as a Senior Agricultural Economist. Analyze the provided Environment and Market data to deliver a high-level strategic roadmap.

STRICT OUTPUT RULES:
1. Use the heading: ## Strategic Agricultural Roadmap
2. Provide exactly 3-4 bullet points.
3. Each point must be a single, direct, actionable sentence.
4. Focus exclusively on ROI, capital preservation, and long-term sustainability.
5. NO introduction, NO concluding remarks, and NO conversational filler.

Environment Data: {env_data[:1000]}
Market Data: {market_data[:1000]}
"""

    try:
        res = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return res.text.strip()
    except Exception as e:
        # Fallback in case of error
        return "Comprehensive farming advice for current conditions"
