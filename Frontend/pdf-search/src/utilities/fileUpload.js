export const uploadPdfFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("pdf", file);

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/pdf/upload`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload PDF");
    }

    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
