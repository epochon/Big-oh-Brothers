import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()


client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def environment_agent(data):
    prompt = f"""
Evaluate soil, weather and risk for farming.

Data: {data}
Return short farming risk advice.
"""

    res = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
    )

    return res.choices[0].message.content
