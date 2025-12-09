>[!IMPORTANT]
>This project is undergoing a full refactoring -- everything will change in the code archicteture and the overall idea of the project


>[!NOTE]
>Dopaminergic To-Do is a project designed to boost human productivity by leveraging the brain's dopaminergic system. The concept is simple: you create a task, complete it, and receive a substantial amount of points. These points can be redeemed for unique >rewards within the app, such as exclusive medals and titles that you can display on your profile.

Environment variables
To run this project, you must add the following variables to your .env file:

DB_DBNAME

DB_USER

DB_PASSWORD

DB_PORT

DB_HOST

DATABASE_URL

SECRET_JSON_KEY


#### Running It
```
cd api/
npm install
```


### API Documentation
Observation: Most of routes are protected and you need to be authenticated to run it. To authenticate, you must log in.



#### Create a new user account

```http
  POST /newAccount

```


| Parameter   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `username / email / password`      | `str` | You must send it from "Content-type ": application/x-www-form-urlencoded |


#### If you're logged in, running this route gonna return your accounts information decoded

```http
  GET /userProfile

```

#### A password recovery route (in developing)
```http
  POST /email-request

```

| Parameter   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email`      | `str` |  Change password |


### Task Management Routes


#### Create a new Task


```http
  POST /newTask

```

| Parameter   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `task / description `      | `str` | Add a new task |


#### Return all user's tasks from database

```http
  GET /getTasks

```


#### Delete a task

```http
  DELETE /deleteTask/:taskId
```

#### Update a existing task

```http
  PUT /changeTask/
```

| Parameter   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `task / description`      | `str` | You must send it from "Content-type ": application/x-www-form-urlencoded |


#### This route gonna mark a task as done. Then, the user associate will receive a amount of points

```http
  POST /doneTask/:taskId
```


