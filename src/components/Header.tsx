import { BadgeCheck } from 'lucide-react';

export const Header = () => {
  return (
    <header className='bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 text-white py-6 px-8 shadow-lg'>
      <div className='flex items-center gap-4'>
        <BadgeCheck className='w-10 h-10 text-cyan-400' />
        <div>
          <h1 className='text-2xl font-bold'>
            RuleBuilder: Offer & Discount Rules
          </h1>
          <p className='text-sm text-gray-300'>
            Configure eligibility rules effortlessly and optimize your
            promotional strategy.
          </p>
        </div>
      </div>
    </header>
  );
};
