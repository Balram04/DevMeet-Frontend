# Cloudinary Setup Guide for DevHub

## Prerequisites
1. Create a Cloudinary account at https://cloudinary.com/
2. Get your Cloud Name from the Cloudinary dashboard

## Setup Steps

### 1. Configure Environment Variables
Update the `.env` file in your project root with your Cloudinary details:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
```

Replace `your_cloud_name_here` with your actual Cloudinary cloud name.

### 2. Create Upload Preset in Cloudinary
1. Go to your Cloudinary console
2. Navigate to Settings > Upload
3. Scroll down to "Upload presets"
4. Click "Add upload preset"
5. Set the following:
   - **Preset name**: `devhub_profiles`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `devhub/profiles` (optional, for organization)
   - **Transformation**: Add transformations if needed (e.g., resize, crop)
   - **Format**: Auto
   - **Quality**: Auto

### 3. Optional: Configure Image Transformations
You can add transformations to automatically optimize images:

**Recommended settings for profile photos:**
- Width: 400px
- Height: 400px
- Crop: Fill
- Quality: Auto
- Format: Auto

### 4. Security (Optional but Recommended)
For production, consider:
1. Setting up signed uploads
2. Configuring allowed file types
3. Setting file size limits
4. Adding folder restrictions

## Usage
The PhotoUpload component will automatically:
1. Validate file type (images only)
2. Validate file size (max 5MB)
3. Show preview before upload
4. Upload to Cloudinary
5. Return the public URL

## Troubleshooting

### Common Issues:
1. **Upload fails**: Check your cloud name and upload preset
2. **CORS errors**: Ensure your upload preset allows unsigned uploads
3. **File too large**: Reduce image size or increase limits in Cloudinary

### Test Upload:
You can test the upload by trying to change your profile photo in the Edit Profile section.

## Environment Variables Reference
```env
# Required
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Optional (if using signed uploads)
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
```

Remember to never commit your API secrets to version control!
