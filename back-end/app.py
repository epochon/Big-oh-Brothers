# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from agents.coordinator_agent import coordinator
from agents.environment_agent import environment_agent
from agents.market_agent import market_agent

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        # Convert to string to prevent prompt injection errors
        data_str = json.dumps(data)

        # 1. Get results from agents
        env_res = environment_agent(data_str)
        mark_res = market_agent(data_str)
        
        # 2. Get the final coordinated advice
        coord_res = coordinator(env_res, mark_res)

        # 3. RETURN A DICTIONARY (This fixes the 'undefined' issue)
        return jsonify({
            "environment": env_res,
            "market": mark_res,
            "decision": coord_res  # 'decision' matches script.js
        })

    except Exception as e:
        print(f"Error occurred: {e}") # This helps you see the error in terminal
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)