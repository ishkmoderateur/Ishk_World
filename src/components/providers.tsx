"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/contexts/cart-context";
import { LanguageProviderWrapper } from "./language-provider-wrapper";
import { CurrencyProvider } from "@/contexts/currency-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <LanguageProviderWrapper>
          <CartProvider>{children}</CartProvider>
        </LanguageProviderWrapper>
      </CurrencyProvider>
    </SessionProvider>
  );
}








