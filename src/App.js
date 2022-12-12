import { Routes, Route } from "react-router-dom";
//components
import HomePage from "./components/trainLookup/HomePage";
import TripView from "./components/tripView/TripView";


function App() {
  return(
    <div className="all-else">
        <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/:id" element={<TripView />} />
        </Routes>
    </div>
  );
}

export default App;
