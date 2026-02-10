# How to Connect WhatsApp Business API

To get chat content from WhatsApp Business, you need to set up the **WhatsApp Business Cloud API** and a **Webhook**.

This guide explains how to link your phone number to Meta and run a local server to receive messages.

## 1. Create a Meta App

1.  Go to [Meta for Developers](https://developers.facebook.com/).
2.  Create a generic **Business App**.
3.  Add the **WhatsApp** product to your app.
4.  Get your **System User Access Token** and **Phone Number ID**.

## 2. Set Up a Webhook (Your Server)

Meta needs a URL to send messages to. Since you are developing locally, you need a tool like **ngrok** to expose your local server to the internet.

### A. Run the Python Script

I have created a simple script `whatsapp_webhook.py` for you.

1.  Open a terminal in VS Code.
2.  Install Flask:
    ```bash
    pip install flask
    ```
3.  Run the server:
    ```bash
    python whatsapp_webhook.py
    ```
    It will run on `http://localhost:5000`.

### B. Expose to Internet via Ngrok

1.  Download [ngrok](https://ngrok.com/).
2.  Run ngrok for port 5000:
    ```bash
    ngrok http 5000
    ```
3.  Copy the `https` URL (e.g., `https://a1b2c3d4.ngrok.io`).

## 3. Configure Webhook in Meta Dashboard

1.  Go to your App Dashboard > **WhatsApp** > **Configuration**.
2.  Click **Edit** next to Webhook.
3.  **Callback URL**: Paste your ngrok URL + `/webhook` (e.g., `https://a1b2c3d4.ngrok.io/webhook`).
4.  **Verify Token**: Enter `my_secure_token_123` (or whatever you set in the script).
5.  Click **Verify and Save**.
6.  Under **Webhook Fields**, subscribe to `messages`.

## 4. Test It

1.  Send a message to the test phone number provided in the WhatsApp dashboard.
2.  Check your terminal running `python whatsapp_webhook.py`.
3.  You will see the JSON payload of the message.
4.  The message will be saved to `whatsapp_chat_history.json`.

## 5. Next Steps

*   **Database**: Instead of saving to a JSON file, connect this script to a real database (SQLite, PostgreSQL, MongoDB).
*   **Hosting**: Deploy this script to a cloud provider like Heroku, AWS, or Google Cloud so it runs 24/7.
*   **Frontend**: Modify your dashboard to read from the database instead of the static file.
