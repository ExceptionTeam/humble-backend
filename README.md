## TECHNICAL TASK
 https://docs.google.com/document/d/1XIewy_Q2Y7lcUj8NXInuj3qMr1PMxYSR0F5rZEychHk/edit
## API

### Tasks

#### Teacher
* `GET /teacher/task/abbreviated-info` - provides shortened information for all `active` tasks

Sends:
 ```javaScript
 {
  _id,
  name,
  weight
 }
 ```
* `POST /teacher/task/assign` - assigns task to student

 Receives in body:
 ```javaScript
 {
  taskId,
  studentId, /** or groupId **/
  teacherId,                         
  deadline (Number of miliseconds)
 }
 ```
 * `GET /teacher/task/full-info?taskId=...` - gets full information about task:

 Receives in query:

 `taskId`: String - id of a task  

 Sends:
 ```javaScript
 {
  name, 
  description, 
  weight,
  tags[]
  inpFiles: [ { link, name } ]
  outFiles: [ { link, name } ]
 }
 ```

#### Student
* `GET /student/task/full-info?assId=...` - gets full informaton about task assignment:

Receives in query:

 `assId`: String - id of a assignment 

Sends:
 ```javaScript
 {
  taskId:
  {
   name,
   description,
   weight
  },
  deadline,
  teacherId: 
  {
   name,
   surname
  }
 }
 ```
 * `GET /student/task/tasks-list?id=...` - gets array of all tasks of certain student. 

 Receives in query:

 `id`: String - id of a student 

 Sends:
 ```javaScript
 {
  _id,
  taskId: 
  {
   attempts,
   name,
   weight,
   active
  },
  teacherId:
  {
   name,
   surname
  }
  submission:
  {
   _id,
   srcFileId,
   submitTime,
   tests: []
  }
 }
 ```
 Array is sorted: first comes task `without` submissions and only then `with` submissions. If student has more than one submission for one assignment,than request sends only `one best` submission.

 #### Admin