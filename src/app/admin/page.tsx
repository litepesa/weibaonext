'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AppVersion } from '@/types';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [versionInfo, setVersionInfo] = useState<AppVersion | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchVersionInfo();
    }
  }, [session]);

  const fetchVersionInfo = async () => {
    try {
      const response = await fetch('/api/version');
      const data = await response.json();
      setVersionInfo(data);
    } catch (error) {
      console.error('Failed to fetch version info:', error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setUploadStatus('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setUploadStatus('Upload successful!');
        fetchVersionInfo();
        (e.target as HTMLFormElement).reset();
      } else {
        const error = await response.json();
        setUploadStatus(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      setUploadStatus('Upload failed: Network error');
    } finally {
      setUploading(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Weibao Admin</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => signOut()}
                className="text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Current Version Info */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Current Version</h2>
                {versionInfo?.version && versionInfo.version !== 'No version available' ? (
                  <div className="space-y-2">
                    <p><strong>Version:</strong> {versionInfo.version}</p>
                    <p><strong>Size:</strong> {versionInfo.fileSize}</p>
                    <p><strong>Released:</strong> {new Date(versionInfo.releaseDate).toLocaleDateString()}</p>
                    <p><strong>Filename:</strong> {versionInfo.filename}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No version uploaded yet</p>
                )}
              </div>
            </div>

            {/* Upload New Version */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New Version</h2>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Version Number
                    </label>
                    <input
                      type="text"
                      name="version"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 1.0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      APK File
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept=".apk"
                      required
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload New Version'}
                  </button>
                </form>
                {uploadStatus && (
                  <div className={`mt-4 p-2 rounded ${uploadStatus.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {uploadStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}