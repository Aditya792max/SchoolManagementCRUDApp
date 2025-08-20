
const express = require('express');
const router = express.Router();
const branchInfo = require('../Schemas/BranchDetails');


// APIs information

/* 
     This one requires 4 different APIs
     1.To create a new branch________________________________________________✅
     2.To get all branches___________________________________________________✅
     3.To update a branch____________________________________________________✅
     4.To delete a branch____________________________________________________✅
*/


// 1.API to create the new branch


router.post('/createBranch', async (req, res) => {
     console.log("Received request body:", req.body);

     const { branchName, branchId, branchSubjects, branchHead } = req.body;

     // Check for missing or invalid fields
     if (
          !branchName ||
          !branchId ||
          !branchHead ||
          !branchSubjects ||
          !Array.isArray(branchSubjects) ||
          branchSubjects.length === 0
     ) {
          return res.status(400).json({
               error: "All fields are required and branchSubjects must be a non-empty array"
          });
     }

     try {
          const newBranch = new branchInfo({
               branchName,
               branchId,
               branchSubjects,
               branchHead
          });

          await newBranch.save();
          console.log("New branch created:", newBranch);
          res.status(201).json({ message: "Branch created successfully", branch: newBranch });

     } catch (error) {
          console.error("Error creating branch:", error);

          if (error.code === 11000) {  // duplicate key error
               return res.status(400).json({ error: "Branch with this ID already exists" });
          }

          res.status(500).json({ error: "Internal Server Error" });
     }
});

// 2.API to get the branches

router.get('/getBranch', async (req, res) => {
     const { branchId } = req.body;
     console.log("received req body", req.body);
     // Validation of the field
     if (!branchId) {
          return res.status(400).json({
               status: "Error",
               message: "Please entre the field in branchId"
          });
     }
     const branches = await branchInfo.findOne({ branchId });
     res.status(200).json({ branchId });
     if (branches) {
          console.log(branches);
          return res.status(200).json({
               status: "success",
               message: "Branch is found"
          });
     } else {
          return res.status(404).json({ status: "Error", error: "No Branch found in this class" });
     }

});

// API to update the branch

router.put('/updateBranch', async (req, res) => {
     console.log("received the req body", req.body);
     const { branchId, ...updateFields } = req.body;
     if (!branchId) {
          return res.status(400).json({
               status: "error",
               message: "Please enter the branchId to update"
          });
     }
     try {
          updateBranch = await branchInfo.findOneAndUpdate(
               { branchId },
               updateFields,
               { new: true }
          );
          if (!updateBranch) {
               res.status(404).json({
                    status: "error",
                    message: "the given branch is not found"
               });
          }
          res.status(200).json({
               status: "success",
               message: "The given branch has been updated"
          });
          console.log(req.body);
     } catch (error) {
          console.error("Error updating the branch", error);
          res.status(500).json({
               status: "Error",
               message: "Internal server error"
          });
     }
});


// 4.API to delete the branch

router.delete("/deleteBranch", async (req, res) => {
     console.log("received the req body:", req.body);
     const { branchId } = req.body;
     // Validation of the fields
     if (!branchId) {
          return res.status(400).json({
               status: "error",
               message: "please fill in the required fields"
          });
     }
     try {
          const deleteBranch = await branchInfo.findOneAndDelete({ branchId });
          if (!deleteBranch) {
               return res.status(404).json({
                    status: "error",
                    message: "requested branch is not found"
               });
          }
          console.log("Deleted Branch is:", deleteBranch);
          res.status(200).json({
               status: "success",
               message: "requested branch has been deleted"
          });
     } catch (error) {
          console.error("Error has occoured", error);
          res.status(500).json({
               status: "Error",
               message: "Internal Server Error"
          });
     }
});



module.exports = router;