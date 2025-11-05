"use server"

import { mockProducts } from "./mock-data"

export async function processOrder(cartItems: Array<{ id: number; quantity: number; price: number }>) {
  try {
    cartItems.forEach((item) => {
      const product = mockProducts.find((p) => p.id === item.id)
      if (product) {
        product.stock -= item.quantity
        // Ensure stock doesn't go negative
        if (product.stock < 0) {
          product.stock = 0
        }
      }
    })

    // Return success
    return { success: true }
  } catch (error) {
    console.error("Error processing order:", error)
    return { success: false, error: "Failed to process order" }
  }
}
