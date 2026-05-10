const chunkText = (pagesArray,maxWords = 250)=>{
  const chunks = [];
  
  for(let pageIndex = 0; pageIndex < pagesArray.length;pageIndex++){
    const pageText = pagesArray[pageIndex]
    const paragraphs = pageText.split("\n").map(p => p.trim()).filter(Boolean);

    let currentChunk = ""
    let startPara = 1;
    let wordCount = 0;

    for(let paraIndex = 0; paraIndex < paragraphs.length; paraIndex++){
      const paragraph = paragraphs[paraIndex];
      const wordsInPara = paragraph.split(/\s+/).length;

      if(wordCount + wordsInPara > maxWords && wordCount > 0){
        chunks.push({
          pageNumber : pageIndex +1,
          paragraphStart : startPara,
          paragraphEnd : paraIndex,
          text : currentChunk.trim()
        });

        currentChunk = paragraph + "\n";
        startPara = paraIndex + 1;
        wordCount = wordsInPara;
      }else {
        currentChunk += paragraph + "\n";
        wordCount += wordsInPara;
      }
      }
     if(currentChunk.trim().length > 0){
      chunks.push({
        pageNumber : pageIndex + 1,
        paragraphStart : startPara,
        paragraphEnd : paragraphs.length,
        text : currentChunk.trim()
      })
     }
    }
    return chunks
  }

  module.exports = {chunkText}