# PayPal Integration Setup Guide

## Overview
This guide explains how to set up PayPal payments for your Ishk platform using PayPal REST API.

## Prerequisites
- PayPal Business Account
- Access to PayPal Developer Dashboard

## Step 1: Get PayPal API Credentials

1. **Go to PayPal Developer Dashboard**
   - Visit: https://developer.paypal.com/dashboard
   - Sign in with your PayPal Business account

2. **Create a New App**
   - Click "Create App" or "My Apps & Credentials"
   - Choose "Merchant" as the app type
   - Give it a name (e.g., "Ishk Platform")
   - Select environment: **Sandbox** (for testing) or **Live** (for production)

3. **Get Your Credentials**
   - After creating the app, you'll see:
     - **Client ID**
     - **Client Secret**
   - Copy these credentials (you'll need them for your `.env` file)

## Step 2: Configure Environment Variables

Add these to your `.env` file:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_MODE=sandbox  # or "live" for production
PAYPAL_WEBHOOK_ID=your_webhook_id_here  # Optional, for webhook verification
```

### For Production:
- Set `PAYPAL_MODE=live`
- Use your **Live** credentials from PayPal Dashboard
- Update your webhook URL in PayPal Dashboard

## Step 3: Set Up Webhooks (Optional but Recommended)

Webhooks allow PayPal to notify your server about payment events.

1. **In PayPal Developer Dashboard:**
   - Go to your app
   - Click "Webhooks"
   - Click "Add Webhook"

2. **Webhook URL:**
   ```
   https://yourdomain.com/api/paypal/webhook
   ```
   For local testing, use a service like ngrok:
   ```
   https://your-ngrok-url.ngrok.io/api/paypal/webhook
   ```

3. **Select Events to Listen For:**
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.REFUNDED`

4. **Copy Webhook ID:**
   - After creating the webhook, copy the Webhook ID
   - Add it to your `.env` as `PAYPAL_WEBHOOK_ID`

## Step 4: Test the Integration

### Test Mode (Sandbox)
1. Use PayPal Sandbox test accounts:
   - Create test accounts in PayPal Developer Dashboard
   - Use these accounts to test payments

2. Test the flow:
   - Add items to cart
   - Select "PayPal" as payment method
   - Click "Pay with PayPal"
   - Log in with a Sandbox test account
   - Complete the payment

### Test Cards (Sandbox)
PayPal Sandbox provides test accounts, not test cards. Use the test buyer account credentials.

## Step 5: Go Live

1. **Switch to Live Mode:**
   - Update `PAYPAL_MODE=live` in `.env`
   - Use your **Live** Client ID and Secret

2. **Update Webhook URL:**
   - Update webhook URL in PayPal Dashboard to your production domain
   - Verify webhook is working

3. **Test with Real Account:**
   - Test with a small amount first
   - Verify orders are created correctly
   - Check webhook events are received

## API Endpoints Created

### 1. Create PayPal Order
**POST** `/api/paypal/create-order`
- Creates a PayPal order
- Returns approval URL for user to complete payment

### 2. Capture PayPal Payment
**POST** `/api/paypal/capture`
- Captures the payment after user approves
- Creates order in database

### 3. PayPal Webhook
**POST** `/api/paypal/webhook`
- Receives payment events from PayPal
- Updates order status automatically

## How It Works

1. **User selects PayPal** in cart
2. **Clicks "Pay with PayPal"**
3. **System creates PayPal order** via `/api/paypal/create-order`
4. **User redirected to PayPal** to approve payment
5. **User approves payment** on PayPal
6. **PayPal redirects back** to `/orders/success?paymentMethod=paypal&session_id={ORDER_ID}`
7. **System captures payment** via `/api/paypal/capture`
8. **Order created in database**
9. **Webhook confirms** payment (optional)

## Currency Support

PayPal supports multiple currencies. The integration uses the currency from your currency context:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- MAD (Moroccan Dirham)

Make sure your PayPal account supports the currencies you want to accept.

## Troubleshooting

### "PayPal is not configured"
- Check that `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set in `.env`
- Restart your development server after adding env variables

### "PayPal order creation failed"
- Verify your credentials are correct
- Check that you're using the right mode (sandbox vs live)
- Check PayPal Developer Dashboard for any account restrictions

### Webhook not receiving events
- Verify webhook URL is accessible
- Check webhook is enabled in PayPal Dashboard
- Verify webhook ID matches in `.env`

### Payment not completing
- Check browser console for errors
- Verify return URL is correct
- Check PayPal account has sufficient balance (sandbox)

## Security Notes

1. **Never expose Client Secret** in client-side code
2. **Use HTTPS** in production
3. **Verify webhook signatures** in production (currently simplified)
4. **Store credentials securely** (use environment variables)
5. **Implement rate limiting** on webhook endpoint

## Support

For PayPal API issues:
- PayPal Developer Docs: https://developer.paypal.com/docs/
- PayPal Support: https://www.paypal.com/support

For integration issues:
- Check server logs for detailed error messages
- Verify all environment variables are set correctly




