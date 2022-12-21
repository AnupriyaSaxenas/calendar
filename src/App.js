import { Route, Routes, Navigate } from "react-router-dom";
import Calendar from "./components/Calendar/calendar.tsx";
import PageNotFound from "./pageNotFound.tsx"; // Import the "page not found" component
import "./App.css";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" />} />
          <Route path="/calendar" element={<Calendar startDate={new Date()} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
