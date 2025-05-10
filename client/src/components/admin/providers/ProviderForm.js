import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, X, RefreshCw, Zap } from 'lucide-react';

const ProviderForm = ({ provider = null, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    logo: '',
    description: '',
    baseUrl: '',
    apiKey: '',
    apiSecret: '',
    apiEnabled: false,
    apiHandler: 'generic',
    apiVersion: 'v1',
    exchangeRateMargin: 0,
    transferFeeStructure: {
      type: 'flat',
      amount: 0,
      percentage: 0,
      minimum: 0,
      maximum: 0
    },
    transferTimeHours: {
      min: 0,
      max: 48
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    methods: ['bank_transfer'],
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiTesting, setApiTesting] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null);

  // Currency options
  const currencyOptions = [
    'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CHF', 'CNY', 
    'HKD', 'NZD', 'SGD', 'INR', 'MXN', 'BRL', 'ZAR'
  ];

  // Payment method options
  const methodOptions = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'cash_pickup', label: 'Cash Pickup' },
    { value: 'mobile_wallet', label: 'Mobile Wallet' }
  ];

  // API handler options
  const apiHandlerOptions = [
    { value: 'generic', label: 'Generic API' },
    { value: 'wise', label: 'Wise API' },
    { value: 'transferwise', label: 'TransferWise API' },
    { value: 'xe', label: 'XE API' },
    { value: 'westernunion', label: 'Western Union API' },
    { value: 'ofx', label: 'OFX API' },
    { value: 'remitly', label: 'Remitly API' }
  ];

  // Initialize form with provider data if editing
  useEffect(() => {
    if (provider) {
      // Map provider data to form state
      setFormData({
        ...provider,
        // Ensure nested objects are set properly
        transferFeeStructure: {
          type: provider.transferFeeStructure?.type || 'flat',
          amount: provider.transferFeeStructure?.amount || 0,
          percentage: provider.transferFeeStructure?.percentage || 0,
          minimum: provider.transferFeeStructure?.minimum || 0,
          maximum: provider.transferFeeStructure?.maximum || 0
        },
        transferTimeHours: {
          min: provider.transferTimeHours?.min || 0,
          max: provider.transferTimeHours?.max || 48
        },
        supportedCurrencies: provider.supportedCurrencies || ['USD', 'EUR', 'GBP'],
        methods: provider.methods || ['bank_transfer']
      });
    }
  }, [provider]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'number' ? parseFloat(value) : value
        }
      });
    } else {
      // Handle regular inputs
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : 
               type === 'number' ? parseFloat(value) : value
      });
    }
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (e, field) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      [field]: options
    });
  };

  // Test API connection
  const testApiConnection = async () => {
    if (!formData.baseUrl || !formData.apiKey) {
      setErrors({
        ...errors,
        baseUrl: !formData.baseUrl ? 'Base URL is required' : null,
        apiKey: !formData.apiKey ? 'API key is required' : null
      });
      return;
    }

    try {
      setApiTesting(true);
      setApiTestResult(null);
      
      // If we're editing, use the test API endpoint
      if (provider && provider._id) {
        const res = await axios.post(`/api/admin/providers/${provider._id}/test-api`);
        setApiTestResult({
          success: res.data.success,
          message: res.data.message
        });
      } else {
        // For new providers, simulate a test
        // In a real app, you'd implement a way to test without saving
        setApiTestResult({
          success: true,
          message: 'API configuration looks valid (simulated test)'
        });
      }
    } catch (err) {
      setApiTestResult({
        success: false,
        message: err.response?.data?.message || 'Failed to test API connection'
      });
    } finally {
      setApiTesting(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.code) newErrors.code = 'Code is required';
    if (!formData.logo) newErrors.logo = 'Logo URL is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.baseUrl) newErrors.baseUrl = 'Base URL is required';
    if (!formData.apiKey) newErrors.apiKey = 'API key is required';
    
    if (formData.transferFeeStructure.type === 'flat') {
      if (formData.transferFeeStructure.amount < 0) {
        newErrors['transferFeeStructure.amount'] = 'Fee amount cannot be negative';
      }
    } else {
      if (formData.transferFeeStructure.percentage < 0) {
        newErrors['transferFeeStructure.percentage'] = 'Fee percentage cannot be negative';
      }
      if (formData.transferFeeStructure.minimum < 0) {
        newErrors['transferFeeStructure.minimum'] = 'Minimum fee cannot be negative';
      }
    }
    
    if (formData.exchangeRateMargin < 0) {
      newErrors.exchangeRateMargin = 'Exchange rate margin cannot be negative';
    }
    
    if (formData.transferTimeHours.min < 0) {
      newErrors['transferTimeHours.min'] = 'Minimum transfer time cannot be negative';
    }
    
    if (formData.transferTimeHours.max < formData.transferTimeHours.min) {
      newErrors['transferTimeHours.max'] = 'Maximum transfer time must be greater than minimum';
    }
    
    if (formData.supportedCurrencies.length === 0) {
      newErrors.supportedCurrencies = 'At least one currency must be selected';
    }
    
    if (formData.methods.length === 0) {
      newErrors.methods = 'At least one payment method must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle validation errors from server
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cancel form and go back
  const handleCancel = () => {
    navigate('/admin/providers');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {provider ? 'Edit Provider' : 'Add New Provider'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {provider ? 'Update provider details and settings' : 'Configure a new money transfer provider'}
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Provider Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Provider Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Provider Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Provider Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.code ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Short unique code for this provider (e.g., wise, xe, wu)
                </p>
              </div>

              {/* Logo URL */}
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                  Logo URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="logo"
                  id="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.logo ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.logo && (
                  <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="active" className="ml-2 block text-sm font-medium text-gray-700">
                  Active Provider
                </label>
                <p className="ml-4 text-xs text-gray-500">
                  Only active providers will be visible to users
                </p>
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div className="col-span-1 md:col-span-2 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Base URL */}
              <div>
                <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700">
                  API Base URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="baseUrl"
                  id="baseUrl"
                  value={formData.baseUrl}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.baseUrl ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.baseUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.baseUrl}</p>
                )}
              </div>

              {/* API Key */}
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  API Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apiKey"
                  id="apiKey"
                  value={formData.apiKey}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.apiKey ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.apiKey && (
                  <p className="mt-1 text-sm text-red-600">{errors.apiKey}</p>
                )}
              </div>

              {/* API Secret */}
              <div>
                <label htmlFor="apiSecret" className="block text-sm font-medium text-gray-700">
                  API Secret
                </label>
                <input
                  type="password"
                  name="apiSecret"
                  id="apiSecret"
                  value={formData.apiSecret}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional, only required for certain API types
                </p>
              </div>

              {/* API Handler */}
              <div>
                <label htmlFor="apiHandler" className="block text-sm font-medium text-gray-700">
                  API Handler
                </label>
                <select
                  name="apiHandler"
                  id="apiHandler"
                  value={formData.apiHandler}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {apiHandlerOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Select the appropriate handler for this provider's API
                </p>
              </div>

              {/* API Version */}
              <div>
                <label htmlFor="apiVersion" className="block text-sm font-medium text-gray-700">
                  API Version
                </label>
                <input
                  type="text"
                  name="apiVersion"
                  id="apiVersion"
                  value={formData.apiVersion}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* API Enabled */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="apiEnabled"
                  id="apiEnabled"
                  checked={formData.apiEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="apiEnabled" className="ml-2 block text-sm font-medium text-gray-700">
                  Enable Live API Integration
                </label>
                <p className="ml-4 text-xs text-gray-500">
                  When enabled, live API will be used for rate calculations
                </p>
              </div>

              {/* Test API Connection Button */}
              <div className="col-span-1 md:col-span-2">
                <button
                  type="button"
                  onClick={testApiConnection}
                  disabled={apiTesting}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {apiTesting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Test API Connection
                    </>
                  )}
                </button>
                
                {apiTestResult && (
                  <div className={`mt-2 p-3 rounded-md ${apiTestResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {apiTestResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fee and Rate Configuration */}
          <div className="col-span-1 md:col-span-2 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fee and Rate Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fee Structure Type */}
              <div>
                <label htmlFor="transferFeeStructure.type" className="block text-sm font-medium text-gray-700">
                  Fee Structure Type
                </label>
                <select
                  name="transferFeeStructure.type"
                  id="transferFeeStructure.type"
                  value={formData.transferFeeStructure.type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="flat">Flat Fee</option>
                  <option value="percentage">Percentage Fee</option>
                </select>
              </div>

              {/* Fee Amount or Percentage */}
              {formData.transferFeeStructure.type === 'flat' ? (
                <div>
                  <label htmlFor="transferFeeStructure.amount" className="block text-sm font-medium text-gray-700">
                    Flat Fee Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="transferFeeStructure.amount"
                      id="transferFeeStructure.amount"
                      value={formData.transferFeeStructure.amount}
                      onChange={handleChange}
                      className={`pl-7 block w-full rounded-md shadow-sm ${errors['transferFeeStructure.amount'] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                      step="0.01"
                      min="0"
                    />
                  </div>
                  {errors['transferFeeStructure.amount'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['transferFeeStructure.amount']}</p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="transferFeeStructure.percentage" className="block text-sm font-medium text-gray-700">
                      Fee Percentage
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="transferFeeStructure.percentage"
                        id="transferFeeStructure.percentage"
                        value={formData.transferFeeStructure.percentage}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm ${errors['transferFeeStructure.percentage'] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                        step="0.01"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                    {errors['transferFeeStructure.percentage'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['transferFeeStructure.percentage']}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="transferFeeStructure.minimum" className="block text-sm font-medium text-gray-700">
                      Minimum Fee
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="transferFeeStructure.minimum"
                        id="transferFeeStructure.minimum"
                        value={formData.transferFeeStructure.minimum}
                        onChange={handleChange}
                        className={`pl-7 block w-full rounded-md shadow-sm ${errors['transferFeeStructure.minimum'] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {errors['transferFeeStructure.minimum'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['transferFeeStructure.minimum']}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="transferFeeStructure.maximum" className="block text-sm font-medium text-gray-700">
                      Maximum Fee (optional)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="transferFeeStructure.maximum"
                        id="transferFeeStructure.maximum"
                        value={formData.transferFeeStructure.maximum}
                        onChange={handleChange}
                        className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Leave at 0 for no maximum
                    </p>
                  </div>
                </>
              )}

              {/* Exchange Rate Margin */}
              <div>
                <label htmlFor="exchangeRateMargin" className="block text-sm font-medium text-gray-700">
                  Exchange Rate Margin
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="exchangeRateMargin"
                    id="exchangeRateMargin"
                    value={formData.exchangeRateMargin}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm ${errors.exchangeRateMargin ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                    step="0.01"
                    min="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                {errors.exchangeRateMargin && (
                  <p className="mt-1 text-sm text-red-600">{errors.exchangeRateMargin}</p>
                )}
              </div>

              {/* Transfer Time */}
              <div>
                <label htmlFor="transferTimeHours.min" className="block text-sm font-medium text-gray-700">
                  Min Transfer Time (hours)
                </label>
                <input
                  type="number"
                  name="transferTimeHours.min"
                  id="transferTimeHours.min"
                  value={formData.transferTimeHours.min}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors['transferTimeHours.min'] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  min="0"
                />
                {errors['transferTimeHours.min'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['transferTimeHours.min']}</p>
                )}
              </div>

              <div>
                <label htmlFor="transferTimeHours.max" className="block text-sm font-medium text-gray-700">
                  Max Transfer Time (hours)
                </label>
                <input
                  type="number"
                  name="transferTimeHours.max"
                  id="transferTimeHours.max"
                  value={formData.transferTimeHours.max}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors['transferTimeHours.max'] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  min="0"
                />
                {errors['transferTimeHours.max'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['transferTimeHours.max']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Supported Currencies and Methods */}
          <div className="col-span-1 md:col-span-2 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Supported Currencies and Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supported Currencies */}
              <div>
                <label htmlFor="supportedCurrencies" className="block text-sm font-medium text-gray-700">
                  Supported Currencies
                </label>
                <select
                  name="supportedCurrencies"
                  id="supportedCurrencies"
                  multiple
                  value={formData.supportedCurrencies}
                  onChange={(e) => handleMultiSelectChange(e, 'supportedCurrencies')}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.supportedCurrencies ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  size="8"
                >
                  {currencyOptions.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Hold Ctrl (or Command on Mac) to select multiple currencies
                </p>
                {errors.supportedCurrencies && (
                  <p className="mt-1 text-sm text-red-600">{errors.supportedCurrencies}</p>
                )}
              </div>

              {/* Payment Methods */}
              <div>
                <label htmlFor="methods" className="block text-sm font-medium text-gray-700">
                  Payment Methods
                </label>
                <select
                  name="methods"
                  id="methods"
                  multiple
                  value={formData.methods}
                  onChange={(e) => handleMultiSelectChange(e, 'methods')}
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.methods ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  size="8"
                >
                  {methodOptions.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Hold Ctrl (or Command on Mac) to select multiple methods
                </p>
                {errors.methods && (
                  <p className="mt-1 text-sm text-red-600">{errors.methods}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-row-reverse gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {provider ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {provider ? 'Save Changes' : 'Create Provider'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProviderForm; 