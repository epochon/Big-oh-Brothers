import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def insurance_agent(data):
    """
    Analyzes crop damage and eligibility for government insurance schemes.
    """
    prompt = f"""
    Act as a Government Scheme & Insurance Advisor. Analyze the farmer's data to check eligibility for schemes (e.g., PMFBY, Rythu Bharosa) and disaster compensation.

    STRICT OUTPUT RULES:
    1. Use the heading: ## Scheme Eligibility & Insurance Claims
    2. Provide exactly 3-4 bullet points.
    3. Specific schemes relevant to the crop/location.
    4. Focus on fast claim processing and eligibility criteria.
    5. Each point must be a single direct sentence.

    Data: {data}
    """

    res = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return res.text
