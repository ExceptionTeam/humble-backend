## TECHNICAL TASK
 https://docs.google.com/document/d/1XIewy_Q2Y7lcUj8NXInuj3qMr1PMxYSR0F5rZEychHk/edit
## API

### Tasks

#### Teacher
* `GET /teacher/task/abbreviated-info?skip=...&top=...` - provides shortened information for all `active` tasks:

Receives in query:

`skip`: String - how much to skip. Default: 0

`top`: String - how much to get. Default: 5

Sends:
 ```javaScript
 {
  _id: String,
  name: String,
  weight: Number
 }
 ```
* `POST /teacher/task/assign` - assigns task to student:

 Receives in body:
 ```javaScript
 {
  taskId: String,
  studentId: String, /** or groupId **/
  teacherId: String,                 
  deadline: (Number of miliseconds)
 }
 ```
 * `GET /teacher/task/full-info/taskId` - gets full information about task:

 Receives in params:

 `taskId`: String - id of a task  

 Sends:
 ```javaScript
 {
  name: String,
  description: String,
  weight: Number,
  tags: Object[String, ...]
  inpFiles: Object[ { link, name } ]
  outFiles: Object[ { link, name } ]
 }
 ```
 * `DELETE /teacher/task/delete/taskId` - finds task if active and make not active:

 Receives in params:

 `taskId`: String - id of a task  

 Sends:

 `true` - if task is found
 `false` - else
 
 * `POST teacher/test/approve/requestId/teacherId` - approves student's test request and creates test assignment for required test:
 
 Receives in params:

 `requestId`: String - id of a request
 `teacherId`: String - id of a teacher
 
 Sends:
 
 status only
 
 * `GET teacher/test/get-students/teacherId` - gets array of teacher's students and groups:
 
 Receives in params:

 `teacherId`: String - id of a teacher
 
 Sends:
 ```javaScript
 {
    individualStudents: [
        {
            _id: String,
            name: String,
            surname: String
        }
    ]
    groups: [
        {
            _id: String,
            name: String,
            groupStudents: [
                {
                    _id: String,
                    name: String,
                    surname: String
                }
            ]
        }
    ]
}
 ```
* `POST teacher/test/reject/requestId` - rejects student's test request:

Receives in params:

 `requestId`: String - id of a request
 
 Sends:
 
 status only
 
* `GET teacher/test/pending-requests/teacherId` - gets all students' test request for this teacher to approve or reject:

Receives in params:

`teacherId`: String - id of a teacher

Sends:
 ```javaScript
[
  {
     _id : String,
     userId : String,
     status : String,
  }
]
```
* `POST teacher/test/new-question/` - creates new question

 Receives in body:
 ```javaScript
{
  section: [String],
  tags: [String],
  type: String,
  active: String,
  category: String,
  question: String,
  questionAuthorId: String,
  answerOptions: Schema.Types.Mixed,
  correctOptions: Schema.Types.Mixed,
  difficulty: Number,
}
 ```
  Sends:
 
 status only
 
 * `GET teacher/test/tags/` - sends all existing tags with a sections they are attached to:
 
 Sends:
  ```javaScript
{
        _id:  String,
        tag:  String,
        sectionId: {
            _id:  String,
            name:  String,
        }
}
 ```
 
* `GET teacher/test/new-assignment/` - creates new test assignment:

 Receives in body:
 ```javaScript
{
    _id : String,
    tags : [String],
    testSize : Number,
    timeToPass : Number,
    trainingPercentage : Number,
    type : String,
    name : String,
    studentId : String,
    groupId : String,
    teacherId : String,
    deadline : Number
}
 ```
 Sends:
 newly created assignment in the same form with additional lines:
 ```javaScript
{
    assignDate : Number,
    status : String
}
```

* `GET teacher/test/questions-check/teacherId/` - gets all answers for test questions that teacher needs to check:

Receives in params:

`teacherId`: String - id of a teacher

Receives in query:

`skip`: String - how much to skip. Default: 0

`top`: String - how much to get. Default: 10

Sends:
```javaScript
 {
    amount: Number,
    requests: [
        {
            _id: String,
            status: String,
            studentId: {
                _id: String,
                name: String,
                surname: String
            },
            teacherId: String,
            assignmentId: String,
            submissionId: {
                _id: String,
                completeDate: Number
            },
            questionId: {
                _id: String,
                section: [String],
                tags: [String],
                question: String
            },
            answer:  Schema.Types.Mixed
        }
    ]
}
```

* `GET teacher/test/check-res/checkid/result` - sends result of checking the question:

Receives in params:

`checkid`: String - id of a check request
`result`: Boolean - if an answer is right or wrong

status only

* `GET teacher/test/all-assignments/teacherid` - sends all teacher's test assignment:

Receives in params:

`teacherId`: String - id of a teacher

Receives in query:

`skip`: String - how much to skip. Default: 0

`top`: String - how much to get. Default: 10

Sends:

all assignments as array with amount 
 ```javaScript
{
amount: Number,
[
  {
     _id : String,
     tags : [String],
     testSize : Number,
     timeToPass : Number,
     trainingPercentage : Number,
     type : String,
     name : String,
     studentId : String,
     groupId : String,
     teacherId : String,
     deadline : Number,
     assignDate : Number,
     status : String
  }
]
}
 ```    
* `GET teacher/test/my-std-submissions/assignmentId` - sends all students' test submissions formed with assignment:

Receives in params:

`assignmentId`: String - id of an assignment

Sends:
 ```javaScript
{
    _id: String,
    questionsId: [
        {
            _id: String,
            tags: [String],
            type: String,
            category: String,
            question: String,
            difficulty: Number,
            answerOptions: Schema.Types.Mixed
        }
    ],
    timeToPass: Number,
    userId: String,
    teacherId: String,
    creationDate: Number,
    status: String,
    assignmentId: String,
    answers: Schema.Types.Mixed
}
 ``` 

* `GET teacher/test/sub-of-std/assignmentId/studentId` - sends one student's test submissions formed with assignment:

Receives in params:

`assignmentId`: String - id of an assignment
`studentId`: String - id of a student

Sends:
 ```javaScript
{
    _id: String,
    questionsId: [
        {
            _id: String,
            tags: [String],
            type: String,
            category: String,
            question: String,
            difficulty: Number,
            answerOptions: Schema.Types.Mixed
        }
    ],
    timeToPass: Number,
    userId: String,
    teacherId: String,
    creationDate: Number,
    status: String,
    assignmentId: String,
    answers: Schema.Types.Mixed
}
 ``` 

 
#### Student
* `GET /student/task/full-info/assId` - gets full information about task assignment:

Receives in params:

`assId`: String - id of a assignment

Sends:
 ```javaScript
 {
  taskId:
  {
   name: String,
   description: String,
   weight: Number
  },
  deadline: Number,
  teacherId:
  {
   name: String,
   surname: String
  }
 }
 ```
 * `GET /student/task/tasks-list/id` - gets array of all tasks of certain student.

 Receives in params:

 `id`: String - id of a student

 Sends:
 ```javaScript
 {
  _id: String
  taskId:
  {
   attempts: Number,
   name: String,
   weight: Number
  },
  teacherId:
  {
   name: String,
   surname: String
  }
  submission:
  {
   _id: String,
   srcFileId: String,
   submitTime: Number
   tests: Object[Boolean, ...]
  }
 }
 ```
 Array is sorted: first comes task `without` submissions and only then `with` submissions. If student has more than one submission for one assignment, than request sends only `one best` submission.

 #### Admin
