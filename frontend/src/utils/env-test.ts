import getConfig from 'next/config';

export const logEnvironmentVariables = () => {
  const { publicRuntimeConfig } = getConfig() || {};
  
  console.log('=== Environment Variables Debug ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_API_URL (process.env):', process.env.NEXT_PUBLIC_API_URL);
  console.log('NEXT_PUBLIC_API_URL (runtime):', publicRuntimeConfig?.apiUrl);
  console.log('Final API URL:', publicRuntimeConfig?.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api');
  console.log('===================================');
};

export const getApiUrl = () => {
  const { publicRuntimeConfig } = getConfig() || {};
  return publicRuntimeConfig?.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
}; 