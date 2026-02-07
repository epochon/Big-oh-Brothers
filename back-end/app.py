# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from agents.coordinator_agent import coordinator
from agents.environment_agent import environment_agent
from agents.market_agent import market_agent
from agents.refiner_agent import refiner_agent
from agents.sales_agent import sales_agent
from agents.insurance_agent import insurance_agent
from agents.profile_agent import profile_agent
from agents.deal_agent import deal_agent

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        # Convert to string to prevent prompt injection errors
        # data_str = json.dumps(data) # This line is removed as agents now expect dict directly

        # 1. Get results from agents
        env_res = environment_agent(data)
        mark_res = market_agent(data)
        sales_res = sales_agent(data)
        insure_res = insurance_agent(data)
        
        # Deal Agent returns a JSON string, so we parse it here if possible
        try:
            deal_res_raw = deal_agent(data)
            deal_res = json.loads(deal_res_raw)
        except:
            deal_res = [] # Fallback
        
        # 2. Generate the Farming Strategic Roadmap (Refiner Agent now acts as the synthesizer)
        roadmap = refiner_agent(env_res, mark_res)

        # 3. RETURN A DICTIONARY
        return jsonify({
            "environment": env_res,
            "market": mark_res,
            "sales": sales_res,
            "insurance": insure_res,
            "deals": deal_res,
            "decision": roadmap  # The roadmap IS the final decision/advice now
        })

    except Exception as e:
        print(f"Error occurred: {e}") # This helps you see the error in terminal
        return jsonify({"error": str(e)}), 500

@app.route("/analyze_profile", methods=["POST"])
def analyze_profile():
    data = request.json
    history = data.get("history", [])
    
    # Call the profile agent with the history
    analysis = profile_agent(history)
    
    return jsonify({"analysis": analysis})

if __name__ == "__main__":
    app.run(debug=True)
