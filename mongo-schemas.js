const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const questionSchema = new mongoose.Schema({
   _id: {type: mongoose.Schema.Types.ObjectId, required: [true, "error"] },
   section: {type: [], required: [true, "error"]},
   tags: [String],
   type: {type: String, required: [true, "error"]},
   category: {type: String, required:[true,"error"]},
   question: {type: String, required:[true,"error"]},
   questionAuthor: {type: String, required:[true,"error"]},
   answerOptions: [],
   correctOptions: [],
   difficulty: {type: Number, required:[true,"error"]},
   peopleTested: {type: Number, required:[true,"error"]},
   peopleAnswered: {type: Number, required:[true,"error"]}
});
questionSchema.plugin(uniqueValidator, { message: "already exists" });

const studInfoSchema = new mongoose.Schema({
   _id: {type: mongoose.Schema.Types.ObjectId, required: [true, "error"] },
   userId: {type: mongoose.Schema.Types.ObjectId, required:[true,"error"]},
   groupId: {type: mongoose.Schema.Types.ObjectId, required:[true,"error"]}
});
studInfoSchema.plugin(uniqueValidator, { message: "already exists" });

const groupSchema = new mongoose.Schema({
   _id: {type: mongoose.Schema.Types.ObjectId, required: [true, "error"] },
   name: {type: String, required:[true,"error"]},
   teachers: {type: [mongoose.Schema.Types.ObjectId], required:[true,"error"]},
   students: {type: [mongoose.Schema.Types.ObjectId], required:[true,"error"]}
});
groupSchema.plugin(uniqueValidator, { message: "already exists" });

const assignmentSchema = new mongoose.Schema({
   _id: {type: mongoose.Schema.Types.ObjectId, required: [true, "error"] },
   groupId: mongoose.Schema.Types.ObjectId,
   studentId: mongoose.Schema.Types.ObjectId,
   name: {type: String, required:[true,"error"]},
   tags: {type: [String], required:[true,"error"]},
   assignDate: {type: Date, required:[true,"error"]},
   teacherId: {type: mongoose.Schema.Types.ObjectId, required:[true,"error"]}
});
assignmentSchema.plugin(uniqueValidator, { message: "already exists" });

const submissionSchema = new mongoose.Schema({
   _id: {type: mongoose.Schema.Types.ObjectId, required: [true, "error"] },
   questions: {type: [mongoose.Schema.Types.ObjectId], required:[true,"error"]},
   answeres: {type: Array, required:[true,"error"]},
   completeDate: {type: Date, required:[true,"error"]},
   assignmentId: {type: mongoose.Schema.Types.ObjectId, required:[true,"error"]},
   userId: {type: mongoose.Schema.Types.ObjectId, required:[true,"error"]}
});
submissionSchema.plugin(uniqueValidator, { message: "already exists" });

const Submission = mongoose.model("Submission", submissionSchema);
const Assignment = mongoose.model("Assignment", assignmentSchema);
const Group = mongoose.model("Group", groupSchema);
const StudInfo = mongoose.model("StudInfo", studInfoSchema);
const Question = mongoose.model("Question", questionSchema);

module.exports = {
    Submission,
    Assignment,
    Group,
    StudInfo,
    Question
};