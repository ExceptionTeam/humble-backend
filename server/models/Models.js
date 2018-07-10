'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const userSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: [true, "error"]
    },
    name: {
        type: String,
        required: [true, "error"],
        unique: true
    },
    surname: {
        type: String,
        required: [true, "error"]
    },
    password: {
        type: String,
        required: [true, "error"]
    },
    role: {
        type: String,
        required: [true, "error"]
    },
    account: {}
});

userSchema.plugin(uniqueValidator, {
    message: "already exists"
});

const questionSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    section: {
        type: [],
        required: [true, 'error']
    },
    tags: [String],
    type: {
        type: String,
        required: [true, 'error']
    },
    category: {
        type: String,
        required: [true, 'error']
    },
    question: {
        type: String,
        required: [true, 'error']
    },
    questionAuthor: {
        type: String,
        required: [true, 'error']
    },
    answerOptions: [],
    correctOptions: [],
    difficulty: {
        type: Number,
        required: [true, 'error']
    },
    peopleTested: {
        type: Number,
        required: [true, 'error']
    },
    peopleAnswered: {
        type: Number,
        required: [true, 'error']
    },
});

questionSchema.plugin(uniqueValidator, {
    message: 'already exists'
});

const studentAssignmentSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    groupId: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
});

studentAssignmentSchema.plugin(uniqueValidator, {
    message: 'already exists'
});

const teacherAssignmentSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    groupId: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
});

teacherAssignmentSchema.plugin(uniqueValidator, {
    message: 'already exists'
});

const groupSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    name: {
        type: String,
        required: [true, 'error']
    },
    teachers: {
        type: [Schema.Types.ObjectId],
        required: [true, 'error']
    },
    students: {
        type: [Schema.Types.ObjectId],
        required: [true, 'error']
    },
});

groupSchema.plugin(uniqueValidator, {
    message: 'already exists'
});

const requestSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    section: {
        type: String,
        required: [true, 'error']
    },
    status: String,
});

requestSchema.plugin(uniqueValidator, {
    message: 'already exists'
});

const assignmentSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    groupId: Schema.Types.ObjectId,
    studentId: Schema.Types.ObjectId,
    name: {
        type: String,
        required: [true, 'error']
    },
    tags: {
        type: [String],
        required: [true, 'error']
    },
    assignDate: {
        type: Date,
        required: [true, 'error']
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
});

assignmentSchema.plugin(uniqueValidator, {
    message: 'already exists'
});

const submissionSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    questions: {
        type: [Schema.Types.ObjectId],
        required: [true, 'error']
    },
    answeres: {
        type: Array,
        required: [true, 'error']
    },
    completeDate: {
        type: Date,
        required: [true, 'error']
    },
    assignmentId: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'error']
    },
});

submissionSchema.plugin(uniqueValidator, {
    message: 'already exists'
});

const User = mongoose.model("User", userSchema);
const Submission = mongoose.model('Submission', submissionSchema);
const Assignment = mongoose.model('Assignment', assignmentSchema);
const Group = mongoose.model('Group', groupSchema);
const Request = mongoose.model('Request', requestSchema);
const StudentAssignment = mongoose.model('StudentAssignment', studentAssignmentSchema);
const TeacherAssignment = mongoose.model('TeacherAssignment', teacherAssignmentSchema);
const Question = mongoose.model('Question', questionSchema);

module.exports = {
    User,
    Request,
    StudentAssignment,
    TeacherAssignment,
    Submission,
    Assignment,
    Group,
    Question,
};
