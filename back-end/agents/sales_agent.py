import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def sales_agent(data):
    """
    Compares companies and buyers to find the best selling price for the crop.
    """
    prompt = f"""
    Act as a Crop Sales Strategist. Analyze the crop and location data to compare potential buyers (Private Companies vs. Government Mandis vs. Exporters).

    STRICT OUTPUT RULES:
    1. Use the heading: ## Maximum Revenue Strategy
    2. Provide exactly 3-4 bullet points.
    3. Compare specific types of buyers (e.g., ITC, Reliance, Local Mandi).
    4. Focus on price maximization and payment reliability.
    5. Each point must be a single direct sentence.

    Data: {data}
    """

    res = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return res.text
