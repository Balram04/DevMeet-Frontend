import axios from 'axios';

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/profile/upload-photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Include cookies for authentication
      }
    );

    if (response.status === 200 && response.data.photoUrl) {
      return response.data.photoUrl;
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    throw new Error('Error during image upload: ' + (error.response?.data?.message || error.message));
  }
};

export default uploadToCloudinary;
