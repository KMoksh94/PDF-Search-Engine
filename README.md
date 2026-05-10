# 🧠 AI PDF Search Engine

An advanced, full-stack Retrieval-Augmented Generation (RAG) platform that allows users to upload massive PDF documents and instantly ask questions about them. 

Instead of relying on basic keyword matching, this engine uses the **Google Gemini API** to generate 3,072-dimensional vector embeddings of your document's text. By leveraging **MongoDB Atlas Vector Search**, the application mathematically retrieves the most relevant paragraphs and feeds them to an AI to generate highly accurate, conversational answers—complete with exact Page and Paragraph citations. 

Built with scalability and security in mind, the architecture features strict context isolation (ensuring queries never mix data between different PDFs) and an autonomous background worker that automatically purges stale documents and vectors to optimize server memory.
