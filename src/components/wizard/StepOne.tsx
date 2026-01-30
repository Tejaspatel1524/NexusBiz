import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from '../common/Select';
import Input from '../common/Input';
import type { Industry } from '../../types';

const industries: { value: Industry; label: string }[] = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Education', label: 'Education' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Food & Beverage', label: 'Food & Beverage' },
    { value: 'Aerospace', label: 'Aerospace' },
    { value: 'Agriculture', label: 'Agriculture' },
    { value: 'Construction', label: 'Construction' },
    { value: 'Hospitality', label: 'Hospitality' },
    { value: 'Media', label: 'Media' },
    { value: 'Telecommunications', label: 'Telecommunications' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Automotive', label: 'Automotive' },
    { value: 'Pharmaceuticals', label: 'Pharmaceuticals' },
];

const budgetRanges = [
    { value: '$0-$10k', label: '$0 - $10,000' },
    { value: '$10k-$50k', label: '$10,000 - $50,000' },
    { value: '$50k-$100k', label: '$50,000 - $100,000' },
    { value: '$100k-$500k', label: '$100,000 - $500,000' },
    { value: '$500k+', label: '$500,000+' },
];

const timelines = [
    { value: '3 months', label: '3 Months (Accelerated)' },
    { value: '6 months', label: '6 Months (Standard)' },
    { value: '1 year', label: '1 Year (Strategic)' },
    { value: '2+ years', label: '2+ Years (Long-term)' },
];

const StepOne: React.FC = () => {
    const { register, watch, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-l-4 border-blue pl-6 mb-12">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Foundation & Landscape</h2>
                <p className="text-gray-200">Define the core parameters of your business environment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Select
                    label="Target Industry"
                    {...register('industry', { required: 'Industry is required' })}
                    options={[{ value: '', label: 'Select an industry' }, ...industries]}
                    error={errors.industry?.message as string}
                />

                <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-200">
                        Capital Allocation: <span className="text-blue">{watch('budget') || '$50k-$100k'}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="4"
                        step="1"
                        className="w-full h-1 bg-gray-400 appearance-none cursor-pointer accent-blue"
                        {...register('budget', {
                            required: 'Budget is required',
                            setValueAs: (v) => budgetRanges[parseInt(v)]?.value || '$50k-$100k'
                        })}
                    />
                    <div className="flex justify-between text-[10px] font-bold text-gray-200 px-1">
                        <span>$0</span>
                        <span>$10k</span>
                        <span>$50k</span>
                        <span>$100k</span>
                        <span>$500k+</span>
                    </div>
                </div>

                <Input
                    label="Primary Market Location"
                    placeholder="e.g. New York, London, Global"
                    {...register('location', { required: 'Location is required' })}
                    error={errors.location?.message as string}
                />

                <Select
                    label="Launch Horizon"
                    {...register('timeline', { required: 'Timeline is required' })}
                    options={[{ value: '', label: 'Select timeline' }, ...timelines]}
                    error={errors.timeline?.message as string}
                />
            </div>
        </div>
    );
};

export default StepOne;
