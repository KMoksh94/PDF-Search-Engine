const mongoose = require("mongoose");
const chunkSchema = new mongoose.Schema({
  text : {type : String, required : true},
  pageNumber : {type : Number, required : true},
  paragraphStart : {type : Number, required : true},
  paragraphEnd : {type : Number, required : true},
  embedding : {type : [Number], required : true},
  pdfId : {type : String, required : true}
})

const Chunks = mongoose.model("Chunks", chunkSchema)
module.exports = Chunks;