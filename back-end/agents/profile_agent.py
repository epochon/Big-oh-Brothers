from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

def profile_agent(history_data):
    """
    Analyzes farming history to give long-term strategic advice.
    """
    prompt = f"""
    Act as a Senior Farming Consultant. Analyze the following crop history for a farmer:
    {history_data}

    STRICT OUTPUT RULES:
    1. Use the heading: ## Long-Term Farming Strategy
    2. Provide exactly 3-4 bullet points.
    3. Focus on:
       - Crop rotation suggestions based on history.
       - Soil health recovery (e.g., nitrogen fixation needs).
       - Long-term economic sustainability.
    4. NO paragraphs, ONLY bullet points.
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    
    return response.text
