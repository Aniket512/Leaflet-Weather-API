import { BrowserRouter, Routes, Route } from "react-router-dom";
import WeatherPage from "../src/components/WeatherPage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WeatherPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
