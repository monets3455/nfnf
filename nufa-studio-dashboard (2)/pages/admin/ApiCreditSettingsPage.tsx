
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import { CheckCircleIcon, CogIcon, KeyIcon, CurrencyDollarIcon } from '../../components/icons';

interface ApiServiceSetting {
  name: string;
  apiKey: string;
  creditsPerOperation: number; // e.g., credits per image, per 1k tokens, per video second
  internalCostPerOperation: number; // e.g., $0.02 per image, $0.001 per 1k tokens
  operationUnit: string; // e.g., "image generated", "1k tokens processed", "second of video"
}

const initialApiSettings: Record<string, ApiServiceSetting> = {
  gpt: {
    name: "GPT (Text Generation)",
    apiKey: "mock_gpt_key_xxxxxxxxxxxx",
    creditsPerOperation: 1,
    internalCostPerOperation: 0.0005,
    operationUnit: "1k tokens processed"
  },
  fluxKontext: {
    name: "Flux Kontext (Image Generation)",
    apiKey: "mock_flux_key_xxxxxxxxxxxx",
    creditsPerOperation: 5,
    internalCostPerOperation: 0.02,
    operationUnit: "image generated"
  },
  veo2: {
    name: "Veo 2 (Image-to-Video)",
    apiKey: "mock_veo2_key_xxxxxxxxxxxx",
    creditsPerOperation: 2,
    internalCostPerOperation: 0.01,
    operationUnit: "second of video"
  },
  veo3: {
    name: "Veo 3 (Text-to-Video)",
    apiKey: "mock_veo3_key_xxxxxxxxxxxx",
    creditsPerOperation: 10,
    internalCostPerOperation: 0.05,
    operationUnit: "second of video"
  }
};

const CREDIT_VALUE_IN_USD = 0.01; // Example: 1 credit = $0.01

const ApiCreditSettingsPage: React.FC = () => {
  const [apiSettings, setApiSettings] = useState<Record<string, ApiServiceSetting>>(initialApiSettings);
  const [toastInfo, setToastInfo] = useState<{ show: boolean; message: string; type: 'success' | 'error', icon?: React.ReactNode }>({ show: false, message: '', type: 'success' });
  const [creditValue, setCreditValue] = useState<number>(CREDIT_VALUE_IN_USD);

  useEffect(() => {
    // In a real app, load these settings from a backend
    const storedSettings = localStorage.getItem('nufa-admin-api-settings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        // Basic validation to ensure structure matches
        if (parsedSettings.gpt && parsedSettings.fluxKontext && parsedSettings.veo2 && parsedSettings.veo3) {
             setApiSettings(parsedSettings);
        }
      } catch (e) {
        console.error("Failed to parse stored API settings:", e);
      }
    }
    const storedCreditValue = localStorage.getItem('nufa-admin-credit-value');
    if (storedCreditValue) {
        setCreditValue(parseFloat(storedCreditValue));
    }
  }, []);

  const handleInputChange = (serviceKey: string, field: keyof ApiServiceSetting, value: string | number) => {
    setApiSettings(prev => ({
      ...prev,
      [serviceKey]: {
        ...prev[serviceKey],
        [field]: typeof prev[serviceKey][field] === 'number' ? Number(value) : value
      }
    }));
  };
  
  const handleCreditValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) {
        setCreditValue(val);
    } else if (e.target.value === "") {
        setCreditValue(0);
    }
  }

  const handleSaveSettings = (serviceKey?: string) => {
    // In a real app, save these to a backend
    localStorage.setItem('nufa-admin-api-settings', JSON.stringify(apiSettings));
    localStorage.setItem('nufa-admin-credit-value', creditValue.toString());
    
    const message = serviceKey 
        ? `${apiSettings[serviceKey].name} settings saved!`
        : "Global credit value saved!";
    setToastInfo({ show: true, message, type: 'success', icon: <CheckCircleIcon className="w-5 h-5 text-white" /> });
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {toastInfo.show && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo({ show: false, message: '', type: 'success', icon: undefined })}
          icon={toastInfo.icon}
        />
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center">
          <CogIcon className="w-8 h-8 mr-3 text-brand-teal" />
          API & Credit Settings
        </h1>
      </div>

      <Card className="bg-white dark:bg-brand-bg-card">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4 flex items-center">
            <CurrencyDollarIcon className="w-6 h-6 mr-2 text-brand-teal" />
            Credit Valuation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <Input
                id="creditValue"
                label="Value of 1 Credit (in USD)"
                type="number"
                value={creditValue.toString()}
                onChange={handleCreditValueChange}
                step="0.001"
                min="0"
                placeholder="e.g., 0.01"
            />
            <Button variant="primary" onClick={() => handleSaveSettings()} size="md" className="md:w-auto h-fit">
                Save Credit Value
            </Button>
        </div>
         <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            This value is used to calculate estimated profit margins.
        </p>
      </Card>

      {Object.entries(apiSettings).map(([key, service]) => {
        const revenuePerOperation = service.creditsPerOperation * creditValue;
        const profitPerOperation = revenuePerOperation - service.internalCostPerOperation;
        const profitMargin = revenuePerOperation > 0 ? (profitPerOperation / revenuePerOperation) * 100 : 0;

        return (
          <Card key={key} className="bg-white dark:bg-brand-bg-card">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-6 flex items-center">
              <KeyIcon className="w-6 h-6 mr-2 text-brand-teal" />
              {service.name}
            </h2>
            <div className="space-y-6">
              <Input
                id={`${key}-apiKey`}
                label="API Key (Mock)"
                type="text"
                value={service.apiKey}
                onChange={(e) => handleInputChange(key, 'apiKey', e.target.value)}
                placeholder={`Enter ${service.name} API Key`}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id={`${key}-credits`}
                  label={`Credits per ${service.operationUnit}`}
                  type="number"
                  value={service.creditsPerOperation.toString()}
                  onChange={(e) => handleInputChange(key, 'creditsPerOperation', e.target.value)}
                  min="0"
                />
                <Input
                  id={`${key}-internalCost`}
                  label={`Est. Internal Cost (USD) per ${service.operationUnit}`}
                  type="number"
                  value={service.internalCostPerOperation.toString()}
                  onChange={(e) => handleInputChange(key, 'internalCostPerOperation', e.target.value)}
                  step="0.0001"
                  min="0"
                />
              </div>
              <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700">
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Estimated Financials (per operation):</h4>
                <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                    <li>User Pays: {service.creditsPerOperation} credits</li>
                    <li>Est. Revenue: ${revenuePerOperation.toFixed(4)} (at ${creditValue.toFixed(4)}/credit)</li>
                    <li>Est. Internal Cost: ${service.internalCostPerOperation.toFixed(4)}</li>
                    <li className={`font-semibold ${profitPerOperation >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        Est. Profit: ${profitPerOperation.toFixed(4)}
                    </li>
                    <li className={`font-semibold ${profitMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        Est. Profit Margin: {profitMargin.toFixed(2)}%
                    </li>
                </ul>
              </div>
              <div className="flex justify-end">
                <Button variant="secondary" onClick={() => handleSaveSettings(key)} size="md">
                  Save {service.name.split(' ')[0]} Settings
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
ApiCreditSettingsPage.displayName = "ApiCreditSettingsPage";
export default ApiCreditSettingsPage;
