import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Moon, Shield, Zap, Save, Globe } from 'lucide-react';
import Button from '../components/common/Button';
import { useLanguage, type Language } from '../i18n';

const Settings: React.FC = () => {
    const { language, setLanguage, t, languageNames, availableLanguages } = useLanguage();
    const [saved, setSaved] = React.useState(false);
    const [localSettings, setLocalSettings] = React.useState({
        notifications: true,
        emailUpdates: false,
        darkMode: true,
        autoSave: true,
        analytics: true,
    });

    const handleToggle = (key: keyof typeof localSettings) => {
        setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
        setSaved(false);
    };

    const handleSave = () => {
        // Save settings to localStorage
        localStorage.setItem('nexusbiz-settings', JSON.stringify(localSettings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 geometric-grid">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue flex items-center justify-center">
                            <SettingsIcon size={24} className="text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                            {t('settingsTitle')}
                        </h1>
                    </div>
                    <p className="text-gray-400">
                        {t('customizeExperience')}
                    </p>
                </motion.div>

                {/* Notifications Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 bg-black border border-gray-400 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Bell size={20} className="text-blue" />
                        <h2 className="text-lg font-bold uppercase tracking-tight">
                            {t('notifications')}
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">{t('pushNotifications')}</h3>
                                <p className="text-sm text-gray-400">Receive notifications about new features</p>
                            </div>
                            <button
                                onClick={() => handleToggle('notifications')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.notifications ? 'bg-blue' : 'bg-gray-500'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${localSettings.notifications ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">{t('emailUpdates')}</h3>
                                <p className="text-sm text-gray-400">Get weekly digest of your business ideas</p>
                            </div>
                            <button
                                onClick={() => handleToggle('emailUpdates')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.emailUpdates ? 'bg-blue' : 'bg-gray-500'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${localSettings.emailUpdates ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Appearance Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 bg-black border border-gray-400 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Moon size={20} className="text-blue" />
                        <h2 className="text-lg font-bold uppercase tracking-tight">
                            {t('appearance')}
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">{t('darkMode')}</h3>
                                <p className="text-sm text-gray-400">Use dark theme across the application</p>
                            </div>
                            <button
                                onClick={() => handleToggle('darkMode')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.darkMode ? 'bg-blue' : 'bg-gray-500'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${localSettings.darkMode ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Language Selector */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-blue" />
                                <div>
                                    <h3 className="font-medium text-white">{t('language')}</h3>
                                    <p className="text-sm text-gray-400">Choose your preferred language</p>
                                </div>
                            </div>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                className="bg-gray-500 border border-gray-400 text-white px-4 py-2 text-sm focus:border-blue focus:outline-none transition-colors"
                            >
                                {availableLanguages.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {languageNames[lang]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* AI & Performance Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 bg-black border border-gray-400 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Zap size={20} className="text-blue" />
                        <h2 className="text-lg font-bold uppercase tracking-tight">
                            {t('aiPerformance')}
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">{t('autoSaveIdeas')}</h3>
                                <p className="text-sm text-gray-400">Automatically save generated business ideas</p>
                            </div>
                            <button
                                onClick={() => handleToggle('autoSave')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.autoSave ? 'bg-blue' : 'bg-gray-500'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${localSettings.autoSave ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">{t('usageAnalytics')}</h3>
                                <p className="text-sm text-gray-400">Help improve NexusBiz by sharing anonymous usage data</p>
                            </div>
                            <button
                                onClick={() => handleToggle('analytics')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.analytics ? 'bg-blue' : 'bg-gray-500'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${localSettings.analytics ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Privacy Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8 bg-black border border-gray-400 p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Shield size={20} className="text-blue" />
                        <h2 className="text-lg font-bold uppercase tracking-tight">{t('privacy')}</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        All AI processing happens locally on your machine. Your business ideas and data never leave your computer.
                    </p>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>{t('localProcessingActive')}</span>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-end"
                >
                    <Button onClick={handleSave} className="flex items-center gap-2">
                        <Save size={18} />
                        {saved ? t('saved') : t('saveSettings')}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
