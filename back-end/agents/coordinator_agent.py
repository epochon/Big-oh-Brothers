import os, requests

TAVILY_KEY = os.getenv("TAVILY_API_KEY")

def coordinator(env_result, market_result):
    query = f"Farming advice: {env_result} {market_result}"

    res = requests.post(
        "https://api.tavily.com/search",
        json={
            "api_key": TAVILY_KEY,
            "query": query,
            "search_depth": "basic",
            "max_results": 3
        },
    ).json()

    summary = " ".join(r["content"] for r in res["results"])
    return f"Final Advice based on current insights: {summary[:300]}"
