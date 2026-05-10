export const askPdfQuestion = async (question, pdfId) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/pdf/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, pdfId })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to get answer from AI");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching AI answer:", error);
    throw error;
  }
};
