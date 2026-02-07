import os
from google import genai
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def market_agent(data):
    prompt = f"""
Act as a Market Intelligence Analyst specializing in Indian Grain Commodities. Analyze current rice market trends and the $500,000 investment context.

STRICT OUTPUT RULES:
1. Use the heading: ## Market Execution & Inventory Strategy
2. Provide exactly 3-4 bullet points.
3. Clearly state "SELL," "HOLD," or "MONITOR" within the points.
4. Focus on MSP (Minimum Support Price) alignment, export policy impacts, and cash flow timing.
5. NO prose, NO filler, ONLY bulleted strategic points.

Data: {data}
"""
    res = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return res.text
