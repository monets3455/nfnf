
import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PackagePricingPage: React.FC = () => {
  const mockPlans = [
    { name: 'Free', price: '$0/mo', credits: '100/mo', features: 'Basic features, Limited generations' },
    { name: 'Lite', price: '$19/mo', credits: '1,000/mo', features: 'More generations, Standard styles' },
    { name: 'Pro', price: '$49/mo', credits: '5,000/mo', features: 'All styles, Priority support' },
    { name: 'Studio', price: '$99/mo', credits: '15,000/mo', features: 'Team features, API access' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Package & Pricing Management</h1>
        <Button variant="primary" size="md">Create New Package</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlans.map(plan => (
          <Card key={plan.name} className="bg-neutral-800 border-neutral-700">
            <h3 className="text-xl font-semibold text-brand-teal mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold text-white mb-1">{plan.price}</p>
            <p className="text-sm text-neutral-400 mb-3">Credits: {plan.credits}</p>
            <p className="text-sm text-neutral-300 mb-4 h-16 overflow-y-auto">{plan.features}</p>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">Edit</Button>
              <Button variant="outline" size="sm" className="!border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white">Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
PackagePricingPage.displayName = "PackagePricingPage";
export default PackagePricingPage;
