const express = require('express');
const router = express.Router();
const StudentInfo = require('../Schemas/studentDetails');
const BranchInfo = require('../Schemas/BranchDetails');

/*  
     API information
     C -> Create.............(1).'/createStudent'.......................(POST)
     R -> Read...............(1).'/getStudent-class'....................(GET)
     ........................(2).'/getStudent-branch'...................(GET)
     ........................(3).'/getStudent-class-branch'.............(GET)
     U -> Update.............(1).'/updateStudent'.......................(PUT)
     D -> Delete.............(1).'/deleteStudent'.......................(DELETE)
*/

// 1. API for creating a new student
router.post('/createStudent', async (req, res) => {
     console.log("Received request body:", req.body);

     const { studentName, studentEmail, studentId, studentAge, studentClass, studentBranch } = req.body;

     if (!studentName || !studentEmail || !studentId || !studentAge || !studentClass || !studentBranch) {
          return res.status(400).json({ error: "All fields are required" });
     }

     try {
          const newStudent = new StudentInfo({
               studentName,
               studentEmail,
               studentId,
               studentAge,
               studentClass,
               studentBranch
          });

          await newStudent.save();
          console.log("New student created:", newStudent);
          console.log("new Student ID:", newStudent.id)
          res.status(201).json({ message: "Student created successfully", student: newStudent });

     } catch (error) {
          console.error("Error creating student:", error);

          if (error.code === 11000) {  // duplicate key error
               return res.status(400).json({ error: "Student with this ID/Email already exists" });
          }

          res.status(500).json({ error: "Internal Server Error" });
     }
});



// 2. GET APIs


//A. API for getting All students from the same class.
router.get('/getStudent-class', async (req, res) => {
     const { studentClass } = req.body;
     if (!studentClass) {
          return res.status(400).json({ status: "Error", error: "class is required" });
     }
     const students = await StudentInfo.find({ studentClass });
     res.status(200).json({ students });

     if (students) {
          console.log("Students from class", studentClass, ":", students);
          return res.status(200).json({ status: "Found Students", data: students });

     } else {
          return res.status(404).json({ status: "Error", error: "No students found in this class" });
     }
});

// B. API for getting All students from the same branch.
router.get('/getStudent-branch', async (req, res) => {
     const { studentBranch } = req.body;
     if (!studentBranch) {
          return res.status(400).json({ status: "Error", error: "Please enter the student branch" });
     }
     const students = await StudentInfo.find({ studentBranch });
     res.status(200).json({ students });
     if (students) {
          console.log("Students from the Branch :", studentBranch, ":", students);
          return res.status(200).json({ status: "Found Students", data: students });
     } else {
          return res.status(404).json({ status: "Error", error: "No students found in this branch" });
     }
});


// C.API from getting All Students from the a specific class and a specific branch

router.get('/getStudent-class-branch', async (req, res) => {
     const { studentClass, studentBranch } = req.body;
     if (!studentClass || !studentBranch) {
          return res.status(400).json({ status: "Error", error: "Both class and branch are required" });
     }

     const students = await StudentInfo.find({ studentClass, studentBranch });
     if (students) {
          console.log("Students from class", studentClass, "and branch", studentBranch, ":", students);
          if (students.length === 0) {
               return res.status(404).json({ status: "Sorry", error: "No students found in this class and branch" });
          }
          return res.status(200).json({ status: "Found Students", data: students });

     } else {
          return res.status(404).json({ status: "Error", error: "No students found in this class and branch" });
     }
});

// 3.PUT APIs
// Gonna create an API for updating the information of a specific student based on their studentId
// router.put('/updateStudent', async (req, res) => {
//      const { studentId } = req.params;
//      const updates = req.body;

//      if (!studentId) {
//           return res.status(400).json({
//                status: "Error",
//                message: "Student ID is required"
//           });
//      }
//      try {
//           const updateStudent = await StudentInfo.findOneAndUpdate(
//                { studentId },
//                updates,
//                { new: true }
//           );
//           if (!updateStudent) {
//                return res.status(404).json({ error: "Student Not found" });
//           }
//           res.status(200).json({ status: "Success", data: updateStudent });
//           console.log(updateStudent);
//      } catch (error) {
//           return res.status(500).json({ error: "Internal Server Error" });
//      }
// });



router.put('/updateStudent', async (req, res) => {
     console.log("Request body:", req.body);  // 👈 add this
     const { studentId, ...updateFields } = req.body;

     if (!studentId) {
          return res.status(400).json({ status: "Error", message: "Student ID is required" });
     }

     try {
          const updatedStudent = await StudentInfo.findOneAndUpdate(
               { studentId },
               updateFields,
               { new: true }
          );

          if (!updatedStudent) {
               return res.status(404).json({ status: "Error", message: "Student not found" });
          }

          res.status(200).json({ status: "Success", student: updatedStudent });
          console.log("Updated student:", updatedStudent);
     } catch (error) {
          console.error("Error updating student:", error);
          res.status(500).json({ status: "Error", message: "Internal Server Error" });
     }
});


// 4.Delete APIs
router.delete('/deleteStudent', async (req, res) => {
     const { studentId } = req.body;
     if (!studentId) {
          return res.status(400).json({ status: "error", message: "Student ID is required" });
     }
     try {
          const deleteStudent = await StudentInfo.findOneAndDelete({ studentId });
          if (!deleteStudent) {
               return res.status(404).json({ status: "error", message: "Student not found" });
          }
          console.log("Deleted student:", deleteStudent);
          res.status(200).json({ status: "success", message: "Student deleted successfully" });
     } catch (error) {
          console.error("Error deleting student:", error);
          res.status(500).json({ status: "error", message: "Internal Server Error" });
     }
});


// TRYING TO CREATE AN API THAT TAKES BOTH MODULES AND GIVES ME INFORMATION
// router.get('/getStudentByBranch', (req, res) = {
//      const { branchName } = req.body;
//      if(!branchName) {
//           return res.status(400).json({
//                status: "Error",
//                message: "Please Enter a valid BranchName"
//           });
//      }

// });

router.get('/getStudentByBranch', async (req, res) => {
     const { branchName } = req.body;

     if (!branchName) {
          return res.status(400).json({
               status: "Error",
               message: "Please enter a valid BranchName"
          });
     }

     try {
          const students = await StudentInfo.find({ studentBranch: branchName });

          if (!students || students.length === 0) {
               return res.status(404).json({
                    status: "Error",
                    message: "No students found in this branch"
               });
          }
          console.log("Number of students from", branchName, ":", students.length);
          console.log("Students from branch", branchName, ":", students);
          return res.status(200).json({
               status: "Success",
               totalStudents: students.length,
               data: students
          });


     } catch (error) {
          console.error("Error fetching students by branch:", error);
          return res.status(500).json({
               status: "Error",
               message: "Internal Server Error"
          });
     }
});



// AN API that can access 2 different modules and provide results based on that....

router.get('/getStudentplusBranch', async (req, res) => {
     const { branchName } = req.body; // Or consider using req.query for GET

     if (!branchName) {
          return res.status(400).json({
               status: "Error",
               message: "Please enter a valid BranchName"
          });
     }

     try {
          // 1. Find students in this branch
          const students = await StudentInfo.find({ studentBranch: branchName });

          // 2. Find branch details
          const branchDetails = await BranchInfo.findOne({ branchName });

          if (!branchDetails) {
               return res.status(404).json({
                    status: "Error",
                    message: `Branch "${branchName}" not found`
               });
          }

          console.log(`Number of students from ${branchName}:`, students.length);
          console.log(`Students from branch ${branchName}:`, students);
          console.log(`Branch details:`, branchDetails);

          return res.status(200).json({
               status: "Success",
               totalStudents: students.length,
               branchDetails: branchDetails,
               students: students
          });

     } catch (error) {
          console.error("Error fetching students and branch info:", error);
          return res.status(500).json({
               status: "Error",
               message: "Internal Server Error"
          });
     }
});



module.exports = router;
