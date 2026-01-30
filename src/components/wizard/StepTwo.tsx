import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../common/Button';

const skillsList = [
    'Marketing', 'Sales', 'Technology', 'Finance', 'Operations', 'Design', 'Strategy', 'Legal', 'HR', 'Product'
];

const riskLevels = ['Low', 'Medium', 'High'];

const StepTwo: React.FC = () => {
    const { register, watch } = useFormContext();
    const selectedSkills = watch('skills') || [];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-l-4 border-blue pl-6 mb-12">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Capabilities & Risk</h2>
                <p className="text-gray-200">Assess available assets and risk appetite.</p>
            </div>

            <div className="space-y-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-200">
                    Core Competencies (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {skillsList.map((skill) => (
                        <label
                            key={skill}
                            className={cn(
                                'flex items-center justify-center p-4 border border-gray-300 cursor-pointer transition-all duration-200 text-xs font-bold uppercase tracking-widest',
                                selectedSkills.includes(skill) ? 'bg-blue border-blue text-white' : 'bg-gray-400 hover:border-gray-200'
                            )}
                        >
                            <input
                                type="checkbox"
                                value={skill}
                                className="hidden"
                                {...register('skills')}
                            />
                            {skill}
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-200">
                        Resource Inventory
                    </label>
                    <div className="space-y-4">
                        {['Team', 'Office Space', 'Equipment', 'Funding'].map((resource) => (
                            <div key={resource} className="flex items-center justify-between p-4 bg-gray-500 border border-gray-400">
                                <span className="text-sm font-bold uppercase tracking-tight">{resource}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        {...register(`resources.${resource.toLowerCase().replace(' ', '')}`)}
                                    />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-200">
                        Risk Tolerance Profile
                    </label>
                    <div className="flex flex-col space-y-4">
                        {riskLevels.map((level) => (
                            <label
                                key={level}
                                className={cn(
                                    'flex items-center p-4 border border-gray-300 cursor-pointer transition-all duration-200',
                                    watch('riskTolerance') === level ? 'bg-white text-black border-white' : 'bg-gray-400 hover:border-gray-200'
                                )}
                            >
                                <input
                                    type="radio"
                                    value={level}
                                    className="hidden"
                                    {...register('riskTolerance', { required: 'Risk tolerance is required' })}
                                />
                                <span className="text-sm font-bold uppercase tracking-widest">{level} Risk Exposure</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepTwo;
