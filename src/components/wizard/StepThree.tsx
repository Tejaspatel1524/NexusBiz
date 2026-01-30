import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from '../common/Select';

const models = ['B2B', 'B2C', 'B2B2C', 'Marketplace', 'SaaS', 'E-commerce', 'Services'];
const sizes = ['Local', 'Regional', 'National', 'International'];
const levels = ['Incremental', 'Moderate', 'Disruptive'];

const StepThree: React.FC = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-l-4 border-blue pl-6 mb-12">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Strategic Orientation</h2>
                <p className="text-gray-200">Outline your preferred operational model and market scale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Select
                    label="Operational Model"
                    {...register('businessModel', { required: 'Business model is required' })}
                    options={[
                        { value: '', label: 'Select model' },
                        ...models.map(m => ({ value: m, label: m }))
                    ]}
                    error={errors.businessModel?.message as string}
                />

                <Select
                    label="Market Scale"
                    {...register('marketSize', { required: 'Market size is required' })}
                    options={[
                        { value: '', label: 'Select scale' },
                        ...sizes.map(s => ({ value: s, label: s }))
                    ]}
                    error={errors.marketSize?.message as string}
                />

                <div className="md:col-span-2 space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-200">
                        Innovation & Impact Level
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {levels.map((level) => (
                            <label
                                key={level}
                                className="flex flex-col p-6 bg-gray-500 border border-gray-400 cursor-pointer hover:border-blue transition-all"
                            >
                                <input
                                    type="radio"
                                    value={level}
                                    className="mb-4 accent-blue"
                                    {...register('innovationLevel', { required: 'Innovation level is required' })}
                                />
                                <span className="text-sm font-black uppercase tracking-tight mb-2">{level} Innovation</span>
                                <span className="text-xs text-gray-200 leading-relaxed">
                                    {level === 'Incremental' && 'Better, faster, or cheaper versions of existing solutions.'}
                                    {level === 'Moderate' && 'Significant improvements or new applications of existing tech.'}
                                    {level === 'Disruptive' && 'Completely new market creation or shifting existing paradigms.'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepThree;
