from flask import Flask, request, jsonify
import os
import json
from datetime import datetime

app = Flask(__name__)

# CONFIGURATION
# You set these in your environment variables or hardcode for testing
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "my_secure_token_123")
PORT = int(os.getenv("PORT", 5000))

# File to store chat history (simple database for demonstration)
CHAT_HISTORY_FILE = "whatsapp_chat_history.json"

def save_message(message_data):
    """Appends a new message to the local JSON file."""
    history = []
    if os.path.exists(CHAT_HISTORY_FILE):
        try:
            with open(CHAT_HISTORY_FILE, 'r') as f:
                history = json.load(f)
        except:
            pass
            
    # Add timestamp
    message_data['received_at'] = datetime.now().isoformat()
    history.append(message_data)
    
    with open(CHAT_HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=4)
    print(f"Saved new message from {message_data.get('from', 'unknown')}")

@app.route('/webhook', methods=['GET'])
def verify_webhook():
    """
    Verifies the webhook subscription with Meta.
    Meta sends a GET request with a challenge token.
    """
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')

    if mode and token:
        if mode == 'subscribe' and token == VERIFY_TOKEN:
            print("WEBHOOK_VERIFIED")
            return challenge, 200
        else:
            return 'Verification token mismatch', 403
    return 'Hello World', 200

@app.route('/webhook', methods=['POST'])
def receive_message():
    """
    Receives the WhatsApp message payload.
    """
    body = request.get_json()

    print("Received webhook:", json.dumps(body, indent=2))

    if body.get('object') == 'whatsapp_business_account':
        for entry in body.get('entry', []):
            for change in entry.get('changes', []):
                value = change.get('value', {})
                
                # Check if it's a message
                if 'messages' in value:
                    for message in value['messages']:
                        # Extract simple data
                        msg_data = {
                            "from": message.get('from'),
                            "id": message.get('id'),
                            "type": message.get('type'),
                            "text": message.get('text', {}).get('body') if message.get('type') == 'text' else "[Media]",
                            "raw": message
                        }
                        save_message(msg_data)
                        
        return 'EVENT_RECEIVED', 200
    else:
        return 'Not a WhatsApp API event', 404

if __name__ == '__main__':
    print(f"Starting WhatsApp Webhook on port {PORT}...")
    print(f"Verify Token is: {VERIFY_TOKEN}")
    app.run(port=PORT, debug=True)
