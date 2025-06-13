
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Toast from '../components/ui/Toast';
import { TOTAL_DURATION_OPTIONS, VISUAL_STYLE_OPTIONS } from '../constants'; 
import { 
    UserCircleIcon, 
    AdjustmentsHorizontalIcon, 
    CreditCardIcon, 
    LockClosedIcon,
    CheckCircleIcon,
} from '../components/icons';
import { useTheme } from '../contexts/ThemeContext';

type SettingsTabId = 'profile' | 'preferences' | 'billing' | 'changePassword';

interface SettingsTab {
    id: SettingsTabId;
    name: string;
    icon: React.FC<{ className?: string }>;
}

// Removed 'apiIntegration'
const SETTINGS_TABS: SettingsTab[] = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'preferences', name: 'Preferences', icon: AdjustmentsHorizontalIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
    { id: 'changePassword', name: 'Change Password', icon: LockClosedIcon },
];


const SettingsPage: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<SettingsTabId>('profile'); // Default to profile or other relevant tab
    const [toastInfo, setToastInfo] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info', icon?: React.ReactNode }>({ show: false, message: '', type: 'success' });

    const [profileData, setProfileData] = useState({
        fullName: 'Nufa Studio User',
        email: 'user@nufastudio.com',
        bio: 'Tell us about yourself...'
    });
    const [preferencesData, setPreferencesData] = useState({
        defaultDuration: '120', // Ensure value matches one from TOTAL_DURATION_OPTIONS
        defaultVisualStyle: 'Cinematic',
        enableAutosave: false,
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    
    useEffect(() => {
        let timer: number;
        if (toastInfo.show) {
          timer = window.setTimeout(() => {
            setToastInfo({ show: false, message: '', type: 'success', icon: undefined });
          }, 4000); 
        }
        return () => window.clearTimeout(timer);
      }, [toastInfo.show]);


    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };
    
    const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             const { checked } = e.target as HTMLInputElement;
            if (name === 'useDarkThemeInternal') {
                setTheme(checked ? 'dark' : 'light');
            } else {
                setPreferencesData(prev => ({ ...prev, [name]: checked }));
            }
        } else {
             setPreferencesData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const renderProfileSection = () => (
        <div className="space-y-8">
            <div className="flex items-center space-x-5">
                <div className={`w-24 h-24 rounded-full bg-brand-teal flex items-center justify-center text-black font-semibold text-4xl`}>
                    NS
                </div>
                <Button variant="secondary" size="md">Change Avatar</Button>
            </div>
            <Input id="settings-profile-fullName" label="Full Name" name="fullName" value={profileData.fullName} onChange={handleProfileChange} />
            <Input id="settings-profile-email" label="Email Address" name="email" value={profileData.email} readOnly disabled />
            <Textarea id="settings-profile-bio" label="Bio" name="bio" value={profileData.bio} onChange={handleProfileChange} placeholder="Tell us about yourself..." rows={4}/>
            <Button variant="primary" size="lg" onClick={() => {
                 setToastInfo({ show: true, message: 'Profile changes saved!', type: 'success', icon: <CheckCircleIcon className="w-5 h-5 text-white"/> });
            }}>Save Changes</Button>
        </div>
    );

    const renderPreferencesSection = () => (
        <div className="space-y-8">
            <h3 className="text-xl font-medium text-neutral-900 dark:text-white">Application Preferences</h3>
            <Select 
                label="Default Duration" 
                name="defaultDuration" 
                id="settings-preferences-defaultDuration"
                options={TOTAL_DURATION_OPTIONS} 
                value={preferencesData.defaultDuration} 
                onChange={handlePreferencesChange} 
            />
            <Select 
                label="Default Visual Style" 
                name="defaultVisualStyle" 
                id="settings-preferences-defaultVisualStyle"
                options={VISUAL_STYLE_OPTIONS.map(opt => ({label: opt, value:opt}))} 
                value={preferencesData.defaultVisualStyle} 
                onChange={handlePreferencesChange} 
            />
            
            <div className="space-y-4 pt-2.5">
                <label className="flex items-center text-base">
                    <input 
                        type="checkbox" 
                        name="enableAutosave" 
                        checked={preferencesData.enableAutosave} 
                        onChange={handlePreferencesChange} 
                        className={`form-checkbox h-5 w-5 text-brand-teal bg-neutral-100 dark:bg-neutral-700 border-neutral-400 dark:border-neutral-600 rounded focus:ring-brand-teal focus:ring-offset-2 dark:focus:ring-offset-brand-bg-card`} 
                    />
                    <span className="ml-3 text-neutral-700 dark:text-neutral-300">Enable autosave (every 5 minutes)</span>
                </label>
                <label className="flex items-center text-base">
                    <input 
                        type="checkbox" 
                        name="useDarkThemeInternal"
                        checked={theme === 'dark'} 
                        onChange={handlePreferencesChange} 
                        className={`form-checkbox h-5 w-5 text-brand-teal bg-neutral-100 dark:bg-neutral-700 border-neutral-400 dark:border-neutral-600 rounded focus:ring-brand-teal focus:ring-offset-2 dark:focus:ring-offset-brand-bg-card`}
                    />
                    <span className="ml-3 text-neutral-700 dark:text-neutral-300">Use dark theme</span>
                </label>
            </div>
            <Button variant="primary" size="lg" onClick={() => {
                 setToastInfo({ show: true, message: 'Preferences saved!', type: 'success', icon: <CheckCircleIcon className="w-5 h-5 text-white"/> });
            }}>Save Preferences</Button>
        </div>
    );

    const mockBillingHistory = [
        { date: 'Apr 01, 2025', amount: '$19.99', status: 'Paid', invoiceId: 'inv-003'},
        { date: 'Mar 01, 2025', amount: '$19.99', status: 'Paid', invoiceId: 'inv-002'},
        { date: 'Feb 01, 2025', amount: '$19.99', status: 'Paid', invoiceId: 'inv-001'},
    ];

    const renderBillingSection = () => (
        <div className="space-y-10">
            <div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">Current Plan</h3>
                <Card className="bg-neutral-100 dark:bg-neutral-800 p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-2xl font-semibold text-neutral-900 dark:text-white">Pro Plan</h4>
                            <p className="text-base text-neutral-600 dark:text-neutral-400">$19.99/month</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100`}>
                           <CheckCircleIcon className="w-5 h-5 mr-1.5" /> Active
                        </span>
                    </div>
                    <div className="mt-5 flex space-x-3">
                        <Button variant="primary" size="md">Upgrade</Button>
                        <Button variant="secondary" size="md">Cancel</Button>
                    </div>
                </Card>
            </div>

            <div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">Payment Method</h3>
                <Card className="bg-neutral-100 dark:bg-neutral-800 p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-lg text-neutral-900 dark:text-white">Visa ending in 4242</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-500">Expires 12/25</p>
                        </div>
                        <Button variant="outline" size="md">Change</Button>
                    </div>
                    <button className={`mt-4 text-base text-brand-teal hover:underline`}>
                        + Add Payment Method
                    </button>
                </Card>
            </div>

            <div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-4">Billing History</h3>
                <Card className="bg-neutral-100 dark:bg-neutral-800 p-0 overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-neutral-200 dark:bg-neutral-700">
                            <tr>
                                <th className="px-5 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">Amount</th>
                                <th className="px-5 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                            {mockBillingHistory.map(item => (
                                <tr key={item.invoiceId}>
                                    <td className="px-5 py-4 text-base text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{item.date}</td>
                                    <td className="px-5 py-4 text-base text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{item.amount}</td>
                                    <td className="px-5 py-4 text-base whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 inline-flex text-sm leading-5 font-semibold rounded-full ${item.status === 'Paid' ? 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100' : 'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-base text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                                        <Button variant="ghost" size="md" onClick={() => alert(`View Invoice ${item.invoiceId}`)}>View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
    
    const renderChangePasswordSection = () => (
        <div className="space-y-8">
            <Input id="settings-password-current" label="Current Password" type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} />
            <div>
                <Input id="settings-password-new" label="New Password" type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1.5">Password must be at least 8 characters long with a mix of letters, numbers and symbols.</p>
            </div>
            <Input id="settings-password-confirm" label="Confirm New Password" type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} />
            <Button variant="primary" size="lg" onClick={() => {
                setToastInfo({ show: true, message: 'Password updated successfully!', type: 'success', icon: <CheckCircleIcon className="w-5 h-5 text-white"/> });
            }}>Update Password</Button>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return renderProfileSection();
            case 'preferences': return renderPreferencesSection();
            case 'billing': return renderBillingSection();
            case 'changePassword': return renderChangePasswordSection();
            default: return null;
        }
    };

    const activeTabName = SETTINGS_TABS.find(tab => tab.id === activeTab)?.name || 'Settings';

    return (
        <div className="p-6 md:p-8 text-neutral-900 dark:text-neutral-100">
            {toastInfo.show && (
                <Toast 
                message={toastInfo.message} 
                type={toastInfo.type}
                onClose={() => setToastInfo({ show: false, message: '', type: 'success', icon: undefined })}
                icon={toastInfo.icon}
                />
            )}
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3">Settings</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10">Manage your account settings and preferences</p>

            <div className="flex flex-col md:flex-row gap-10">
                <Card className="md:w-1/4 lg:w-1/5 bg-white dark:bg-brand-bg-card p-0 self-start">
                    <nav className="space-y-1.5 p-3.5">
                        {SETTINGS_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-lg transition-colors duration-150 text-base ${
                                    activeTab === tab.id 
                                    ? `bg-brand-teal text-black font-semibold` 
                                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                                aria-current={activeTab === tab.id ? "page" : undefined}
                            >
                                <tab.icon className="w-6 h-6" />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </Card>

                <div className="flex-1">
                    <Card className="bg-white dark:bg-brand-bg-card">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-8">{activeTabName}</h2>
                        {renderContent()}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;