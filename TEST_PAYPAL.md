# Testing PayPal Integration

## Quick Test Steps

### 1. Start Your Development Server
```bash
npm run dev
```

### 2. Verify Environment Variables
Make sure your `.env` file has:
```env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox
NEXTAUTH_URL=http://localhost:3000
```

### 3. Test the Integration

1. **Add Items to Cart**
   - Go to `/boutique`
   - Add some products to cart
   - Go to `/cart`

2. **Select PayPal Payment**
   - In the cart page, you should see two payment options:
     - **Card** (Stripe)
     - **PayPal**
   - Click on **PayPal** to select it

3. **Proceed to Checkout**
   - Click "Pay with PayPal" button
   - You should be redirected to PayPal login page

4. **Complete Payment (Sandbox)**
   - Use a PayPal Sandbox test account
   - Log in and approve the payment
   - You'll be redirected back to `/orders/success`

5. **Verify Order**
   - Check your database - order should be created
   - Check `/profile` - order should appear in order history

## PayPal Sandbox Test Accounts

If you don't have test accounts:

1. Go to https://developer.paypal.com/dashboard
2. Click on "Sandbox" → "Accounts"
3. Create a test buyer account
4. Use those credentials to test payments

## Common Issues & Solutions

### Issue: "PayPal is not configured"
**Solution:**
- Check `.env` file has `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
- Restart your dev server after adding env variables
- Make sure no typos in variable names

### Issue: "PayPal order creation failed"
**Solution:**
- Verify credentials are correct
- Check you're using sandbox credentials with `PAYPAL_MODE=sandbox`
- Check browser console for detailed error
- Verify PayPal account is active

### Issue: Redirect not working
**Solution:**
- Check `NEXTAUTH_URL` is set correctly
- For local: `http://localhost:3000`
- Make sure return URL in PayPal matches your domain

### Issue: Payment not capturing
**Solution:**
- Check browser console for errors
- Verify `sessionStorage` has order metadata
- Check server logs for capture errors
- Verify PayPal order ID is correct

## Testing Checklist

- [ ] PayPal button appears in cart
- [ ] Can select PayPal as payment method
- [ ] Clicking "Pay with PayPal" redirects to PayPal
- [ ] Can log in with test account
- [ ] Can approve payment
- [ ] Redirects back to success page
- [ ] Order is created in database
- [ ] Order appears in profile/orders

## Debug Mode

To see detailed logs, check:
1. **Browser Console** - Client-side errors
2. **Server Terminal** - API errors
3. **Network Tab** - API request/response

## Next Steps After Testing

Once sandbox testing works:
1. Switch to live mode: `PAYPAL_MODE=live`
2. Use live credentials
3. Test with small real payment
4. Set up webhooks for production


