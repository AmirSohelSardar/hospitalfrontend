const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
const cloud_name = import.meta.env.VITE_CLOUD_NAME;

const uploadImageToCloudinary = async (file) => {
    if (!file) {
        throw new Error('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPG and PNG images are allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
    }

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', upload_preset);
    uploadData.append('cloud_name', cloud_name);

    try {
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            {
                method: 'POST',
                body: uploadData,
            }
        );

        // FIX: original had no error handling on the Cloudinary response
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error?.message || 'Image upload failed');
        }

        const data = await res.json();
        return data;

    } catch (error) {
        throw new Error('Image upload failed: ' + error.message);
    }
};

export default uploadImageToCloudinary;