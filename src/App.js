import Calendar from "./components/calendar.tsx";
import "./App.css";

function App() {
  return (
    <>
      <div className="App">
        <Calendar startDate={new Date()} />
      </div>
    </>
  );
}

export default App;
