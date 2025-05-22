'use client';

import { useState, useEffect } from 'react';
import { AppVersion } from '@/types';

export default function HomePage() {
  const [versionInfo, setVersionInfo] = useState<AppVersion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersionInfo();
  }, []);

  const fetchVersionInfo = async () => {
    try {
      const response = await fetch('/api/version');
      const data = await response.json();
      setVersionInfo(data);
    } catch (error) {
      console.error('Failed to fetch version info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (versionInfo?.downloadUrl) {
      window.open(versionInfo.downloadUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Weibao Chat
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Download the latest version of Weibao Chat app
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {versionInfo?.version && versionInfo.version !== 'No version available' ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Latest Version
                  </h2>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Version:</strong> {versionInfo.version}</p>
                    <p><strong>Size:</strong> {versionInfo.fileSize}</p>
                    <p><strong>Released:</strong> {new Date(versionInfo.releaseDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
                >
                  Download APK
                </button>
              </>
            ) : (
              <div className="text-gray-500">
                <p>No version available for download yet.</p>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500">
            <p>By downloading, you agree to our terms of service.</p>
          </div>
        </div>
      </div>
    </div>
  );
}