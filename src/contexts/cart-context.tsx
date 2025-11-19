"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => Promise<void>;
  removeItem: (productId: string, size?: string, color?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  total: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from database or localStorage
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (session?.user) {
          // Load from database for logged-in users
          const response = await fetch("/api/cart");
          if (response.ok) {
            const data = await response.json();
            setItems(data.items || []);
          }
        } else {
          // Load from localStorage for guests
          const savedCart = localStorage.getItem("ishk-cart");
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error loading cart:", error);
        }
        // Fallback to localStorage for guest users
        if (!session?.user) {
          const savedCart = localStorage.getItem("ishk-cart");
          if (savedCart) {
            try {
              setItems(JSON.parse(savedCart));
            } catch (parseError) {
              // Invalid JSON in localStorage, clear it
              localStorage.removeItem("ishk-cart");
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [session]);

  // Save cart to database or localStorage
  const saveCart = async (newItems: CartItem[]) => {
    try {
      if (session?.user) {
        // Save to database
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: newItems }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to save cart to database");
        }
      } else {
        // Save to localStorage
        localStorage.setItem("ishk-cart", JSON.stringify(newItems));
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error saving cart:", error);
      }
      // Fallback to localStorage for guest users
      if (!session?.user) {
        localStorage.setItem("ishk-cart", JSON.stringify(newItems));
      }
    }
  };

  const addItem = async (item: Omit<CartItem, "id">) => {
    try {
      if (session?.user) {
        // For logged-in users, use API endpoint
        const response = await fetch("/api/cart/item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }),
        });

        if (response.ok) {
          // Reload cart from database
          const cartResponse = await fetch("/api/cart");
          if (cartResponse.ok) {
            const data = await cartResponse.json();
            setItems(data.items || []);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to add item to cart");
        }
      } else {
        // For guest users, update local state
        const newItem: CartItem = {
          ...item,
          id: `${item.productId}-${item.size || ""}-${item.color || ""}`,
        };

        setItems((prevItems) => {
          const existingIndex = prevItems.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              i.color === item.color
          );

          let newItems: CartItem[];
          if (existingIndex >= 0) {
            // Update quantity
            newItems = [...prevItems];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + item.quantity,
            };
          } else {
            // Add new item
            newItems = [...prevItems, newItem];
          }

          saveCart(newItems);
          return newItems;
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error adding item to cart:", error);
      }
      throw error;
    }
  };

  const removeItem = async (productId: string, size?: string, color?: string) => {
    try {
      if (session?.user) {
        // Find the item ID from current items
        const itemToRemove = items.find(
          (i) =>
            i.productId === productId &&
            i.size === size &&
            i.color === color
        );

        if (itemToRemove) {
          const response = await fetch(`/api/cart/item?id=${itemToRemove.id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            // Reload cart from database
            const cartResponse = await fetch("/api/cart");
            if (cartResponse.ok) {
              const data = await cartResponse.json();
              setItems(data.items || []);
            }
          } else {
            throw new Error("Failed to remove item from cart");
          }
        }
      } else {
        // For guest users, update local state
        setItems((prevItems) => {
          const newItems = prevItems.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.size === size &&
                i.color === color
              )
          );
          saveCart(newItems);
          return newItems;
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error removing item from cart:", error);
      }
      throw error;
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      await removeItem(productId, size, color);
      return;
    }

    try {
      if (session?.user) {
        // Find the item ID from current items
        const itemToUpdate = items.find(
          (i) =>
            i.productId === productId &&
            i.size === size &&
            i.color === color
        );

        if (itemToUpdate) {
          const response = await fetch("/api/cart/item", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              itemId: itemToUpdate.id,
              quantity,
            }),
          });

          if (response.ok) {
            // Reload cart from database
            const cartResponse = await fetch("/api/cart");
            if (cartResponse.ok) {
              const data = await cartResponse.json();
              setItems(data.items || []);
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to update cart item");
          }
        }
      } else {
        // For guest users, update local state
        setItems((prevItems) => {
          const newItems = prevItems.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          );
          saveCart(newItems);
          return newItems;
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating cart item quantity:", error);
      }
      throw error;
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (session?.user) {
      await fetch("/api/cart", { method: "DELETE" });
    } else {
      localStorage.removeItem("ishk-cart");
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

