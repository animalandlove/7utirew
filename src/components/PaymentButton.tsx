import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

interface PaymentButtonProps {
  plan: {
    name: string;
    price: string;
  };
}

const stripePromise = loadStripe('pk_test_your_publishable_key');

export const PaymentButton: React.FC<PaymentButtonProps> = ({ plan }) => {
  const amount = plan.price === '$0' ? '0' : plan.price.replace('$', '');

  const handleStripeCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // In production, this would call your backend to create a checkout session
      toast.error('Stripe integration requires backend setup');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  if (plan.price === '$0') {
    return (
      <button
        className="mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
        onClick={() => toast.success('Free plan activated!')}
      >
        Get started
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <PayPalButtons
        style={{ layout: 'horizontal' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                  currency_code: 'USD'
                },
                description: `WildLens ${plan.name} Plan`
              }
            ]
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            await actions.order.capture();
            toast.success('Payment successful! Welcome to WildLens Premium.');
          }
        }}
        onError={() => {
          toast.error('Payment failed. Please try again.');
        }}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or pay with card</span>
        </div>
      </div>

      <button
        onClick={handleStripeCheckout}
        className="w-full py-3 px-6 border border-gray-300 rounded-md text-center font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        Pay with Card
      </button>
    </div>
  );
};