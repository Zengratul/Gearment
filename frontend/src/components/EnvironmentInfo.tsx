'use client';

import { useEffect, useState } from 'react';

export default function EnvironmentInfo() {
  const [envInfo, setEnvInfo] = useState<{
    NODE_ENV: string;
    NEXT_PUBLIC_API_URL: string;
    isDevelopment: boolean;
  } | null>(null);

  useEffect(() => {
    setEnvInfo({
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'undefined',
      isDevelopment: process.env.NODE_ENV === 'development',
    });
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!envInfo) {
    return <div>Loading environment info...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded shadow-lg text-sm">
      <div className="font-bold mb-1">Environment Info (Dev Only)</div>
      <div>NODE_ENV: {envInfo.NODE_ENV}</div>
      <div>API_URL: {envInfo.NEXT_PUBLIC_API_URL}</div>
      <div>Is Dev: {envInfo.isDevelopment ? 'Yes' : 'No'}</div>
    </div>
  );
} 