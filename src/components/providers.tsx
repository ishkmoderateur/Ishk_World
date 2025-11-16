"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/contexts/cart-context";
import { LanguageProviderWrapper } from "./language-provider-wrapper";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProviderWrapper>
        <CartProvider>{children}</CartProvider>
      </LanguageProviderWrapper>
    </SessionProvider>
  );
}








