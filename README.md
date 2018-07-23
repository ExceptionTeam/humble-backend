## TECHNICAL TASK
 https://docs.google.com/document/d/1XIewy_Q2Y7lcUj8NXInuj3qMr1PMxYSR0F5rZEychHk/edit
## API

### Tasks

#### Teacher
* `GET /teacher/task/abbreviated-info?skip=...&top=...` - provides shortened information for all `active` tasks

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
* `POST /teacher/task/assign` - assigns task to student

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
 * `DELETE /teacher/task/delete/taskId` - finds task if active and make not active

 Receives in params:

 `taskId`: String - id of a task  

 Sends:

 `true` - if task is found
 `false` - else

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
