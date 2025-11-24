# Currency System Migration Guide

## Overview
This migration updates the platform to store all prices in USD by default and adds automatic currency detection with manual selection support.

## Database Changes

### Schema Updates
1. **Product Model**: Added `currency` field (default: "USD")
2. **Venue Model**: Changed `currency` default from "EUR" to "USD"
3. **PhotographyService Model**: Added `currency` field (default: "USD")
4. **PartyService Model**: Changed `currency` default from "EUR" to "USD"
5. **Campaign Model**: Added `currency` field (default: "USD")
6. **Donation Model**: 
   - Changed `currency` default from "EUR" to "USD"
   - Added `originalAmount` field (stores user's selected currency amount)
   - Added `originalCurrency` field (stores user's selected currency)

## Migration Steps

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Create Migration
```bash
npx prisma migrate dev --name add_currency_support
```

### 3. Update Existing Data (if needed)
If you have existing data with prices in EUR, you'll need to convert them to USD. Create a script to update:

```typescript
// scripts/convert-prices-to-usd.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function convertPricesToUSD() {
  // Example: Convert EUR prices to USD (assuming 1 EUR = 1.09 USD)
  const eurToUsdRate = 1.09;
  
  // Update products
  await prisma.product.updateMany({
    where: { currency: "EUR" },
    data: {
      price: { multiply: eurToUsdRate },
      comparePrice: { multiply: eurToUsdRate },
      currency: "USD"
    }
  });
  
  // Update venues
  await prisma.venue.updateMany({
    where: { currency: "EUR" },
    data: {
      price: { multiply: eurToUsdRate },
      comparePrice: { multiply: eurToUsdRate },
      currency: "USD"
    }
  });
  
  // Similar for other models...
}

convertPricesToUSD();
```

### 4. Deploy Migration
```bash
npx prisma migrate deploy
```

## New Features

### Currency Context
- Automatic currency detection based on user's IP/location
- Manual currency selection (USD, EUR, GBP, MAD)
- Currency preference saved in localStorage
- Real-time price conversion

### Currency Selector Component
- Added to navbar (desktop and mobile)
- Shows current currency with symbol
- Dropdown to select from available currencies

### Supported Currencies
- **USD** - US Dollar ($)
- **EUR** - Euro (€)
- **GBP** - British Pound (£)
- **MAD** - Moroccan Dirham (د.م.)

### Exchange Rates
Current exchange rates (approximate):
- USD: 1.0 (base)
- EUR: 0.92 (1 USD = 0.92 EUR)
- GBP: 0.79 (1 USD = 0.79 GBP)
- MAD: 10.0 (1 USD = 10 MAD)

**Note**: In production, you should fetch real-time exchange rates from an API like:
- ExchangeRate-API
- Fixer.io
- CurrencyLayer

## Updated Components

1. **PriceDisplay** - Now uses currency context automatically
2. **Navbar** - Added currency selector
3. **Cart Page** - All prices use currency context
4. **Boutique Pages** - All prices use currency context
5. **Party Page** - All prices use currency context
6. **Photography Page** - All prices use currency context
7. **Association Page** - Campaign goals/raised use currency context

## Testing

1. Test automatic currency detection
2. Test manual currency selection
3. Verify prices convert correctly
4. Check localStorage persistence
5. Test on different devices/locations

## Notes

- All prices in the database are stored in USD
- Conversion happens client-side for display
- User's currency preference is saved in localStorage
- If IP detection fails, falls back to locale-based detection
- Default currency is USD if detection fails


