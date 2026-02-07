import os
from google import genai
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def market_agent(data):
    prompt = f"Analyze crop market trends and give sell/hold advice.\nData: {data}"

    res = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt
    )
    return res.text
