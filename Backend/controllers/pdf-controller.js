const fs = require("fs");
const {chunkText} = require("../utilities/chunkCreation");
const pdfParse = require("pdf-parse");
const { generativeEmbeddings, generativeAnswers } = require("../utilities/gemini");
const Chunks = require("../models/chunks");

const uploadFunction = async (req,res)=>{
try {
  if(!req.file) return res.status(400).json({message : `Please upload a pdf file`})

    const pdfId = req.file.filename;
    const dataBuffer = fs.readFileSync(req.file.path);
    const render_page = (pageData)=> pageData.getTextContent().then(textContent=>{
        let lastY,text = "";
        for(let item of textContent.items){
          text+=(lastY=== item.transform[5] || !lastY ? item.str : '\n' +item.str);
          lastY = item.transform[5]
        }
        return text + "\n\n---PAGE BREAK---\n\n";
      })
    const data = await pdfParse(dataBuffer,{pagerender : render_page});
    const pages = data.text.split("---PAGE BREAK---").map(p=> p.trim()).filter(Boolean);

      const documentChunks = chunkText(pages,250);

      const savedChunks = [];

    for(const chunk of documentChunks){
      const vector = await generativeEmbeddings(chunk.text);

      const newChunk = new Chunks({
        text : chunk.text,
        pageNumber : chunk.pageNumber,
        paragraphStart : chunk.paragraphStart,
        paragraphEnd : chunk.paragraphEnd,
        embedding : vector,
        pdfId : pdfId
      })
      await newChunk.save();
      savedChunks.push(newChunk)
    }

    res.status(200).json({message : `PDF Uploaded Successfully! Processed chunks!`, totalChunks : documentChunks.length, chunks: documentChunks, pdfId: pdfId})
  } catch (error) {
    console.log("Error in uploading pdf file", error)
    res.status(500).json({message : `Error in uploading pdf file`})
  }
}

const askFunction = async(req,res)=>{
  try{
    const {question, pdfId} = req.body;
    if(!question) return res.status(400).json({message : "Please enter a question"})
    if(!pdfId) return res.status(400).json({message : "Please provide a pdfId to search within."})

    const questionVector = await generativeEmbeddings(question);
    const relevantChunks = await Chunks.aggregate([
      {
        $vectorSearch :{
         index : "embeddingIndex",
         path : "embedding",
         queryVector : questionVector,
         numCandidates : 100,
         limit : 5,
         filter: { pdfId: pdfId }
        }
      },{
        $project : {
          _id : 0,
          text : 1,
          pageNumber : 1,
          paragraphStart : 1,
          paragraphEnd : 1,
          score : {
            $meta : "vectorSearchScore"
          }
        }
      }
    ]);
    console.log(relevantChunks)
    if(relevantChunks.length === 0) return res.status(404).json({message : `No relevant information found!`})

    let contextText = `Here are some extracted parts of the PDF document : \n\n`;
    relevantChunks.forEach((chunk,index) => {
      contextText +=`---Chunk ${index +1} (Page ${chunk.pageNumber}, Paragraghs ${chunk.paragraphStart} - ${chunk.paragraphEnd})\n\n`
      contextText += chunk.text +`\n\n`;
    });

    const prompt = `
    ${contextText}
     Based ONLY on the provided context above, answer the following question:
      "${question}"
      
      Important rules:
      1. If the answer is not in the context, say "I don't know based on the provided document."
      2. Always cite your sources at the end of your answer using the provided Page and Paragraph numbers (e.g., [Page 5, Para 2-3]).
    `;

    const answer = await generativeAnswers(prompt);
    res.status(200).json({answer, sources : relevantChunks});
    
  }catch(error){
    console.log("Error in asking question", error)
    res.status(500).json({message : `Error in asking question`})
  }
}

module.exports = {uploadFunction, askFunction}
