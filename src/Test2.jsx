import React from "react";
import { loadStripe } from "@stripe/stripe-js";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51QSK69Ruhc1bo2OWTbJUd9tswR7jHIkEr2fzNDPToS7QA0GWxoz5mAj8usTmTEEgwRJqbJ5IqEYYMqMR4K0wjxoi00U36WNYRs"
);

const PaymentButton = () => {
  const handlePayment = async () => {
    const stripe = await stripePromise;

    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: "price_1QSKrJRuhc1bo2OWr2OCtDUN", // Replace with the Price ID from the Stripe Dashboard
          quantity: 1,
        },
      ],
      mode: "payment",
      successUrl: "http://localhost:3000/success",
      cancelUrl: "http://localhost:3000/cancel",
    });

    if (error) {
      console.error("Stripe Checkout Error:", error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Pay $20
    </button>
  );
};

export default PaymentButton;
