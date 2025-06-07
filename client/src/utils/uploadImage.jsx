import axiosInstance from "./axiosinstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();  // Corrected capitalization

  // Append image File to form data
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post("/image-upload", formData, {
      // No need to set content-Type header manually
    });

    return response.data; // Return response data
  } catch (error) {
    console.error("Error uploading the image:", error);
    throw error; // Rethrow error for handling
  }
};

export default uploadImage;
