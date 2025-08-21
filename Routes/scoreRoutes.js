// In this one we shall create 4 CRUD based APIs :
// 1.To create a student's account.
// 2.To read the scores.
// 3.To Update the scores in case of mistake in checking.
// 4.To Delete the student's records in case the student seeks transfer.

const express = require('express');
const router = express.Router();
const scoreInfo = require('../Schemas/scoreDetails'); // ✅ keep only one import

// Ensure indexes are synced
scoreInfo.syncIndexes();


// CREATE API
router.post('/createScoreCard', async (req, res) => {
     try {
          const { studentName, studentId, branchId, scoreStatus, branchScores } = req.body;

          // Validation
          if (!studentName || !studentId || !branchId || !scoreStatus ||
               !branchScores || !Array.isArray(branchScores) || branchScores.length === 0) {
               return res.status(400).json({ error: "Please fill all the required fields" });
          }

          // Create new score document
          const newScore = new scoreInfo({
               studentName,
               studentId,
               branchId,
               scoreStatus,
               branchScores
          });

          // Business logic: check failed subjects
          let failed = 0;
          for (let i = 0; i < newScore.branchScores.length; i++) {
               if (newScore.branchScores[i] < 40) {
                    failed++;
               }
          }

          // If more than half subjects failed → mark as "Failed"
          if (failed > newScore.branchScores.length / 2) {
               newScore.scoreStatus = "Failed";
          }

          await newScore.save();
          console.log("New score card created:", newScore);

          return res.status(201).json({
               message: "Score card created successfully",
               data: newScore
          });
     } catch (error) {
          console.error("Error creating score card:", error);
          if (error.code === 11000) {
               return res.status(409).json({ error: "Duplicate entry for studentId or branchId" });
          }
          return res.status(500).json({ error: "Internal server error" });
     }
});







module.exports = router;