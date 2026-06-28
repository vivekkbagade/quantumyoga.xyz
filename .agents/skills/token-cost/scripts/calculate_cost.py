import json
from pathlib import Path

# Prices per 1 Million tokens (standard Gemini 3.5 Flash pricing as reference)
PRICE_INPUT_1M = 0.075
PRICE_OUTPUT_1M = 0.30

print("=========================================")
print("     ANTIGRAVITY TOKEN COST REPORT       ")
print("=========================================\n")

# 1. Analyze Graphify Costs
cost_path = Path("graphify-out/cost.json")
if cost_path.exists():
    try:
        data = json.loads(cost_path.read_text(encoding="utf-8"))
        total_in = data.get("total_input_tokens", 0)
        total_out = data.get("total_output_tokens", 0)
        cost_in = (total_in / 1_000_000) * PRICE_INPUT_1M
        cost_out = (total_out / 1_000_000) * PRICE_OUTPUT_1M
        total_cost = cost_in + cost_out
        
        print("--- [Graphify Knowledge Graph Builds] ---")
        print(f"Total Runs:       {len(data.get('runs', []))}")
        print(f"Input Tokens:     {total_in:,}")
        print(f"Output Tokens:    {total_out:,}")
        print(f"Estimated Cost:   ${total_cost:.5f}\n")
    except Exception as e:
        print(f"Error parsing cost.json: {e}\n")
else:
    print("Graphify cost.json not found.\n")

# 2. Analyze Chat Transcripts
transcript_path = Path(r"C:\Users\admin\.gemini\antigravity-ide\brain\521b4aec-31c4-4de1-a159-0593e4560615\.system_generated\logs\transcript.jsonl")
if not transcript_path.exists():
    # Fallback to search inside AppData
    for p in Path(r"C:\Users\admin\.gemini\antigravity-ide").glob("**/transcript.jsonl"):
        transcript_path = p
        break

if transcript_path.exists():
    try:
        lines = transcript_path.read_text(encoding="utf-8").splitlines()
        step_count = len(lines)
        file_size_kb = transcript_path.stat().st_size / 1024
        
        print("--- [Active Chat Conversation Log] ---")
        print(f"File Path:        {transcript_path}")
        print(f"Total Steps:      {step_count}")
        print(f"Transcript Size:  {file_size_kb:.2f} KB")
        print("Note: Actual model token logs are managed by Google AI Studio console.")
    except Exception as e:
        print(f"Error reading transcript: {e}")
else:
    print("Conversation transcript logs not found in workspace.")
print("\n=========================================")
