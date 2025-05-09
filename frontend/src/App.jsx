import { Routes, Route } from "react-router-dom";
import MainScreen from "./components/MainScreen";
import MyDayScreen from "./components/MyDayScreen";
import ImportantTasksScreen from "./components/ImportantTasksScreen";
import AllTasksScreen from "./components/AllTasksScreen";
import Sidebar from "./components/Sidebar";
import "./styles/styles.css";
import "./components/Sidebar.css";

function App() {
  return (
    <div className="app">
            <Sidebar />     {" "}
      <div className="main-content-area">
               {" "}
        <Routes>
                     <Route path="/" element={<MyDayScreen />} />
                    <Route path="/my-day" element={<MyDayScreen />} />
                   {" "}
          <Route path="/important" element={<ImportantTasksScreen />} />
                    <Route path="/all-tasks" element={<AllTasksScreen />} />   
             {" "}
        </Routes>
             {" "}
      </div>
         {" "}
    </div>
  );
}

export default App;
