const {GoogleGenerativeAI} = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const generativeEmbeddings = async(text)=>{
  const model = genAI.getGenerativeModel({model : "gemini-embedding-2"});
  const result = await model.embedContent(text);
  return result.embedding.values;
}

const generativeAnswers = async(prompt)=>{
  const model = genAI.getGenerativeModel({model : "gemini-2.5-flash"})
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = {generativeEmbeddings, generativeAnswers}