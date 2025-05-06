import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileAudio, Check, AlertCircle, X } from 'lucide-react';
import Button from './Button';

/**
 * Enhanced upload area with animations and visual feedback
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onUpload - Function called when a file is uploaded
 * @param {Array} [props.acceptedFileTypes=['audio/mpeg', 'audio/wav']] - Accepted file types
 * @param {number} [props.maxSize=10485760] - Maximum file size in bytes (default: 10MB)
 * @param {string} [props.className] - Additional CSS classes
 */
const UploadArea = ({
  onUpload,
  acceptedFileTypes = ['audio/mpeg', 'audio/wav'],
  maxSize = 10485760, // 10MB
  className = '',
  ...rest
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileDetails, setFileDetails] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setFileDetails({
      name: file.name,
      size: file.size,
      type: file.type
    });
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress for demo purposes
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      // Call the onUpload function with the file and a progress callback
      await onUpload(file, (progress) => {
        setUploadProgress(progress);
      });
      
      // Complete the progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || 'Error uploading file');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onUpload]);
  
  const {
    getRootProps,
    getInputProps,
    isDragReject,
    open
  } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: (fileRejections) => {
      setIsDragActive(false);
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`File is too large. Maximum size is ${maxSize / 1048576}MB`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError(`Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`);
      } else {
        setError(rejection.errors[0].message);
      }
    }
  });

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const resetUpload = () => {
    setFileDetails(null);
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div className={className} {...rest}>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragActive
            ? 'border-primary-500 bg-gradient-to-br from-primary-50/80 to-secondary-50/80 dark:from-primary-900/20 dark:to-secondary-900/20 scale-103 shadow-lg'
            : isDragReject
              ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10'
              : fileDetails && !error
                ? 'border-green-500 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/10 dark:to-emerald-900/10 shadow-soft'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-soft cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'
        }`}
        aria-label="Upload area for audio files"
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="animate-pulse-slow"
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-primary-500 dark:text-primary-400" />
              <p className="text-xl font-medium text-primary-700 dark:text-primary-300 font-display">
                Drop the audio file here...
              </p>
              <p className="text-sm text-primary-600/70 dark:text-primary-400/70 mt-2">
                Release to upload your audio file
              </p>
            </motion.div>
          ) : fileDetails && !error ? (
            <motion.div
              key="file-details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="relative">
                <FileAudio className="w-16 h-16 mx-auto mb-4 text-green-500 dark:text-green-400" />
                <button 
                  onClick={(e) => { e.stopPropagation(); resetUpload(); }}
                  className="absolute top-0 right-0 p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-xl font-medium font-display text-green-700 dark:text-green-300">
                {fileDetails.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {formatFileSize(fileDetails.size)}
              </p>
              
              {isUploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                    <motion.div 
                      className="bg-green-500 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                  </p>
                </div>
              )}
              
              {!isUploading && uploadProgress === 100 && (
                <motion.div 
                  className="mt-4 flex items-center justify-center text-green-600 dark:text-green-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Check className="mr-2" />
                  <span>Upload complete!</span>
                </motion.div>
              )}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500 dark:text-red-400" />
              <p className="text-xl font-medium font-display text-red-700 dark:text-red-300">
                Upload Error
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 max-w-xs mx-auto">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={(e) => { e.stopPropagation(); resetUpload(); }}
              >
                Try Again
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-xl font-medium mb-2 font-display">
                Drag & drop an audio file here, or click to select
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 max-w-md mx-auto">
                Upload your audio file (WAV or MP3) to classify its genre using our machine learning model
              </p>
              <Button
                variant="gradient"
                size="md"
                onClick={(e) => { e.stopPropagation(); open(); }}
                withIcon
                glow
              >
                <FileAudio className="mr-2 h-5 w-5" /> Select Audio File
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadArea;
