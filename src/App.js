import { useState } from "react";
import "./App.css";
import { Form } from "./components/Form";
import { List } from "./components/List";

function App() {
  const [tasks, setTasks] = useState([]);

  const taskEntry = (taskObj) => {
    setTasks([...tasks, taskObj]);
  };

  const handleOnDelete = (_id) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }

    const filteredArg = tasks.filter((item) => item._id !== _id);

    setTasks(filteredArg);
  };

  const taskSwitcher = (_id, type) => {
    const updatedArg = tasks.map((item) => {
      if (_id === item._id) {
        item.type = type;
      }

      return item;
    });

    setTasks(updatedArg);
  };

  console.log(tasks);
  return (
    <div className="wrapper">
      <div className="container">
        {/* <!-- top title --> */}
        <div className="row">
          <div className="col text-center mt-5">
            <h1>Not To Do List</h1>
          </div>
        </div>

        <Form taskEntry={taskEntry} />

        <List
          tasks={tasks}
          handleOnDelete={handleOnDelete}
          taskSwitcher={taskSwitcher}
        />

        {/* <!-- total hr area --> */}
        <div className="row fw-bold">
          <div className="col">
            The total hours allocated = <span id="totalHrs">0</span> Hrs
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
