import React from 'react';
import { useFormContext } from 'react-hook-form';

const StepFour: React.FC = () => {
    const { getValues } = useFormContext();
    const values = getValues();

    const SummaryItem = ({ label, value }: { label: string, value: any }) => (
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-400 last:border-0">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-200">{label}</span>
            <span className="text-sm font-bold">{Array.isArray(value) ? value.join(', ') : (value || 'Not Specified')}</span>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-l-4 border-blue pl-6 mb-12">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Verification & Synthesis</h2>
                <p className="text-gray-200">Review your parameters before launching the generation engine.</p>
            </div>

            <div className="bg-gray-500 border border-gray-400 p-8 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-blue mb-6">Input Matrix Summary</h3>

                <SummaryItem label="Target Industry" value={values.industry} />
                <SummaryItem label="Capital Allocation" value={values.budget} />
                <SummaryItem label="Primary Market" value={values.location} />
                <SummaryItem label="Horizon" value={values.timeline} />
                <SummaryItem label="Competencies" value={values.skills} />
                <SummaryItem label="Operational Model" value={values.businessModel} />
                <SummaryItem label="Innovation Level" value={values.innovationLevel} />
            </div>

            <div className="flex items-start bg-blue/10 border-l-4 border-blue p-6 space-x-4">
                <div className="w-12 h-12 bg-blue flex items-center justify-center shrink-0">
                    <span className="text-white font-black text-xl">!</span>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold uppercase tracking-tight">System Ready for Processing</p>
                    <p className="text-xs text-gray-100 leading-relaxed">
                        Upon clicking "Generate Business Ideas", our strategic engine will process your inputs against current market data and competitive benchmarks to produce three high-potential business architectures.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StepFour;
