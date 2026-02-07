import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()


client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def environment_agent(data):
    prompt = prompt = f"""
Act as a Farming Risk Mitigation Consultant. Evaluate the soil, weather, and operational data to identify critical threats.

STRICT OUTPUT RULES:
1. Use the heading: ## Farming Risk & Mitigation Analysis
2. ProvidReturn exactly 3-4 bullet points of farming risk advice.
STRICT: No paragraphs, only bullet points. must follow this format: **[Risk Factor]:** [Specific Mitigation Action].
4. Do not include paragraphs or introductory text.
5. Ensure actions are specific to the Rajahmundry climate and rice cultivation.

Data: {data}
"""

    res = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
    )

    return res.choices[0].message.content
