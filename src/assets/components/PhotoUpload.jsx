import { useState, useRef, useEffect } from 'react';
import uploadToCloudinary from '../../utils/uploadToCloudinary';

const PhotoUpload = ({ currentPhotoUrl, onPhotoChange, disabled = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Upload to Cloudinary
    setIsUploading(true);
    try {
      const cloudinaryUrl = await uploadToCloudinary(file);
      onPhotoChange(cloudinaryUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
        className="w-full px-4 py-3 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none md:hover:opacity-90"
        style={{
          background: isDesktop 
            ? 'linear-gradient(90deg, #3486e4, #126322, #d85650)' 
            : 'linear-gradient(90deg, #3486e4, #126322, #d85650)',
          backgroundSize: isDesktop ? '200% 100%' : '100% 100%',
          transition: 'all 0.3s ease',
          backgroundPosition: '0% 0',
        }}
        onMouseEnter={(e) => {
          if (isDesktop && !disabled && !isUploading) {
            e.target.style.backgroundPosition = '100% 0';
          }
        }}
        onMouseLeave={(e) => {
          if (isDesktop && !disabled && !isUploading) {
            e.target.style.backgroundPosition = '0% 0';
          }
        }}
      >
        {isUploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Uploading Photo...
          </>
        ) : (
          <>
            <svg
              className="w-1 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
             />
            </svg>
            📸 Upload Profile Photo
          </>
        )}
      </button>

      {/* Helper text */}
      <p className="text-xs text-gray-400 mt-2 text-center">
        JPG, PNG or GIF (max 5MB)
      </p>
    </div>
  );
};

export default PhotoUpload;
