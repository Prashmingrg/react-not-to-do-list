import { useEffect, useState } from "react";
import "./App.css";
import { Form } from "./components/Form";
import { List } from "./components/List";
import {
  addTask,
  deleteTasks,
  fetchTasks,
  updateTask,
} from "./helpers/axiosHelper";

const ttlHrPerWek = 24 * 7;
function App() {
  const [tasks, setTasks] = useState([]);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [response, setResponse] = useState([]);
  const [allEntrySelected, setAllEntrySelected] = useState([]);
  const [allbadSelected, setAllbadSelected] = useState([]);

  const totalHrs = tasks.reduce((acc, item) => acc + item.hr, 0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await fetchTasks();
    setTasks(res.data.data);
  };

  const taskEntry = async (taskObj) => {
    if (totalHrs + taskObj.hr > ttlHrPerWek) {
      setResponse({
        status: "error",
        message: "Yo Boss, too many hours, can't fit the task.",
      });
      return;
    }

    const { data } = await addTask(taskObj);
    if (data.status === "success") {
      getData();
    }
    setResponse(data);
  };

  const handleOnSelectAll = (e) => {
    const { checked, value } = e.target;

    if (value === "entry") {
      checked ? setAllEntrySelected(true) : setAllEntrySelected(false);
    }

    if (value === "bad") {
      checked ? setAllbadSelected(true) : setAllbadSelected(false);
    }

    if (checked) {
      // slecet all
      const argToGetIds = tasks.filter((item) => {
        return item.type === value;
      });

      const ids = argToGetIds.map((item) => item._id);

      setIdsToDelete([...idsToDelete, ...ids]);
    } else {
      //unselect
      setIdsToDelete([]);

      // ony unselect the ids taht belongs to the value === entry || bad
    }
  };

  const handleOnManyDelete = async () => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }

    const { data } = await deleteTasks(idsToDelete);
    setResponse(data);

    data.status === "success" && getData();
    setIdsToDelete([]);
  };

  const taskSwitcher = async (_id, type) => {
    // call axios to call put method with data

    const { data } = await updateTask({ type, _id });
    console.log(data);

    setResponse(data);

    data.status === "success" && getData();
    //
  };

  const handleOnCheck = (e) => {
    const { checked, value } = e.target;

    console.log(checked, value);
    if (!checked) {
      const { type } = tasks.filter((item) => item._id === value)[0];
      console.log(type);
      type === "entry" ? setAllEntrySelected(false) : setAllbadSelected(false);
    }

    if (checked) {
      setIdsToDelete([...idsToDelete, value]);
    } else {
      const tempArg = idsToDelete.filter((item) => item !== value);
      setIdsToDelete(tempArg);
    }
  };

  console.log(response);
  return (
    <div className="wrapper">
      <div className="container">
        {/* <!-- top title --> */}
        <div className="row">
          <div className="col text-center mt-5">
            <h1>Not To Do List</h1>
          </div>
        </div>

        {response.message && (
          <div
            className={
              response.status === "success"
                ? "alert alert-success"
                : "alert alert-danger"
            }
          >
            {response.message}{" "}
          </div>
        )}

        <Form taskEntry={taskEntry} />

        <List
          tasks={tasks}
          handleOnSelectAll={handleOnSelectAll}
          taskSwitcher={taskSwitcher}
          handleOnCheck={handleOnCheck}
          idsToDelete={idsToDelete}
          allEntrySelected={allEntrySelected}
        />

        {idsToDelete.length > 0 && (
          <div className="d-grid py-4">
            <button
              className="btn btn-lg btn-danger"
              onClick={handleOnManyDelete}
            >
              Delete selected tasks
            </button>
          </div>
        )}

        {/* <!-- total hr area --> */}

        <div className="row fw-bold">
          <div className="col">The total hours allocated = {totalHrs} Hrs</div>
        </div>
      </div>
    </div>
  );
}

export default App;
