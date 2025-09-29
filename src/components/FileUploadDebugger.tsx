import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FileUploadDebuggerProps {
  onDebugInfo?: (info: string) => void;
}

export const FileUploadDebugger: React.FC<FileUploadDebuggerProps> = ({ onDebugInfo }) => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const message = `[${timestamp}] ${info}`;
    setDebugInfo(prev => [...prev, message]);
    if (onDebugInfo) {
      onDebugInfo(message);
    }
  };

  const checkStorageBucket = async () => {
    setIsChecking(true);
    addDebugInfo('🔍 Checking storage bucket...');
    
    try {
      // Check if bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        addDebugInfo(`❌ Bucket check error: ${bucketError.message}`);
        return;
      }

      const patientDocsBucket = buckets?.find(b => b.id === 'patient-documents');
      if (!patientDocsBucket) {
        addDebugInfo('❌ patient-documents bucket not found');
        return;
      }
      
      addDebugInfo('✅ patient-documents bucket exists');

      // Check recent uploads
      const { data: files, error: filesError } = await supabase.storage
        .from('patient-documents')
        .list('', {
          limit: 10,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (filesError) {
        addDebugInfo(`❌ Files check error: ${filesError.message}`);
        return;
      }

      addDebugInfo(`📁 Found ${files?.length || 0} recent files in bucket`);
      
      if (files && files.length > 0) {
        files.slice(0, 3).forEach((file, index) => {
          addDebugInfo(`📄 File ${index + 1}: ${file.name} (${new Date(file.created_at).toLocaleString()})`);
        });
      }

    } catch (error) {
      addDebugInfo(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsChecking(false);
    }
  };

  const testUpload = async () => {
    addDebugInfo('🧪 Testing file upload...');
    
    try {
      // Create a simple test file
      const testContent = `Test upload - ${new Date().toISOString()}`;
      const testFile = new File([testContent], 'test-upload.txt', { type: 'text/plain' });
      const testFileName = `test_${Date.now()}.txt`;

      const { data, error } = await supabase.storage
        .from('patient-documents')
        .upload(testFileName, testFile);

      if (error) {
        addDebugInfo(`❌ Test upload failed: ${error.message}`);
        return;
      }

      addDebugInfo(`✅ Test upload successful: ${data.path}`);

      // Clean up test file
      const { error: deleteError } = await supabase.storage
        .from('patient-documents')
        .remove([testFileName]);

      if (deleteError) {
        addDebugInfo(`⚠️ Test file cleanup failed: ${deleteError.message}`);
      } else {
        addDebugInfo('🗑️ Test file cleaned up successfully');
      }

    } catch (error) {
      addDebugInfo(`❌ Test upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearDebugInfo = () => {
    setDebugInfo([]);
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-4 mt-4">
      <h3 className="font-semibold text-gray-800 mb-3">📋 File Upload Debugger</h3>
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={checkStorageBucket}
          disabled={isChecking}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isChecking ? 'Checking...' : 'Check Storage'}
        </button>
        
        <button
          onClick={testUpload}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
        >
          Test Upload
        </button>
        
        <button
          onClick={clearDebugInfo}
          className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
        >
          Clear Log
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 text-xs font-mono p-3 rounded max-h-40 overflow-y-auto">
        {debugInfo.length === 0 ? (
          <div className="text-gray-500">No debug information yet. Click "Check Storage" to start.</div>
        ) : (
          debugInfo.map((info, index) => (
            <div key={index} className="mb-1">
              {info}
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-gray-600 mt-2">
        This component helps debug file upload issues. Use it temporarily during development.
      </div>
    </div>
  );
};