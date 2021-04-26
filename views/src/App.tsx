import React, { EventHandler } from "react";
import csv from "csvtojson";
import "./App.css";

function onSubmitForm(evt: any) {
  evt.preventDefault();
  csv()
    .fromString(evt.target.questions.value)
    .subscribe((question) => {
      question.options = [question.a, question.b, question.c, question.d];
      delete question.a;
      delete question.b;
      delete question.c;
      delete question.d;
    })
    .then((questions) => {
      const course = {
        adminPassword: evt.target.adminPassword.value,
        name: evt.target.name.value,
        topic: evt.target.topic.value,
        questions: questions,
      };

      fetch("http://localhost:8080/course/new", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      })
        .then(console.log)
        .catch(console.error);
    });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">Questions Uploader</header>
      <a
        className="template-link mt-5 mb-5"
        href="https://docs.google.com/spreadsheets/d/1oIJ8QSv2fIVbEfayETDKmjLZQuAZ7dVIz0465TAnziA/edit?usp=sharing"
        target="_blank"
        rel="opener"
      >
        Follow this template in order to upload your questions correctly
      </a>

      <div className="p-3 mb-2 bg-info text-white">
        All http responses will be available in the console
      </div>

      <form className="container mt-5" method="POST" onSubmit={onSubmitForm}>
        <div className="form-group">
          <label htmlFor="courseName">Course Name</label>
          <input
            type="text"
            className="form-control"
            id="courseName"
            name="name"
            aria-describedby="Course Name"
            placeholder="Java 101, Typescript Basics,..."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="adminPassword">Admin Password</label>
          <input
            type="password"
            className="form-control"
            id="adminPassword"
            name="adminPassword"
            placeholder="Admin Password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="topicId">Topic ID</label>
          <input
            type="text"
            className="form-control"
            id="topicId"
            name="topic"
            aria-describedby="Topic ID"
            placeholder="Object ID used in the db"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="csvContent">
            Paste the contents of CSV File below
          </label>
          <textarea
            className="form-control"
            id="csvContent"
            name="questions"
            rows={25}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
