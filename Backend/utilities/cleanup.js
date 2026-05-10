const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Chunks = require('../models/chunks');

const cleanupOldData = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const objectIdOneHourAgo = mongoose.Types.ObjectId.createFromTime(Math.floor(oneHourAgo.getTime() / 1000));
    
    const dbResult = await Chunks.deleteMany({ _id: { $lt: objectIdOneHourAgo } });
    if (dbResult.deletedCount > 0) {
      console.log(`[Cleanup] Deleted ${dbResult.deletedCount} stale chunks from MongoDB.`);
    }

    const uploadsDir = path.join(__dirname, '../uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let deletedFiles = 0;
      
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.mtime < oneHourAgo) {
          fs.unlinkSync(filePath);
          deletedFiles++;
        }
      });
      
      if (deletedFiles > 0) {
        console.log(`[Cleanup] Deleted ${deletedFiles} stale PDF files from local storage.`);
      }
    }
  } catch (error) {
    console.error("[Cleanup] Error during scheduled cleanup:", error.message);
  }
};

const startCleanupRoutine = () => {
  const ONE_HOUR = 60 * 60 * 1000;
  console.log("[Cleanup] Routine started. Checking for stale data every 1 hour.");
  cleanupOldData();
  setInterval(cleanupOldData, ONE_HOUR);
};

module.exports = { startCleanupRoutine };
