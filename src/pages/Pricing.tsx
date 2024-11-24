import React from 'react';
import { Check } from 'lucide-react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PaymentButton } from '../components/PaymentButton';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      'Up to 30 identifications per month',
      'Detailed species information',
      'Image history ( 3 days)',
      'Community support'
    ]
  },
  {
    name: 'Premium',
    price: '$9.99',
    description: 'For wildlife enthusiasts',
    features: [
      'Unlimited identifications',
      'Detailed species analysis',
      'Unlimited history',
      'Export to PDF/CSV',
      'Priority support',
      'Advanced statistics',
      'Early access to new features'
    ]
  }
];

const paypalOptions = {
  'client-id': 'test',
  currency: 'USD',
  intent: 'capture'
};

export const Pricing = () => {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="mt-20 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    {plan.price !== '$0' && (
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    )}
                  </p>
                  <p className="mt-6 text-gray-500">{plan.description}</p>

                  <ul className="mt-6 space-y-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex">
                        <Check className="flex-shrink-0 w-6 h-6 text-emerald-500" />
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <PaymentButton plan={plan} />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600">
              All plans include a 14-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};