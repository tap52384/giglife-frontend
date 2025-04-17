import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
  import HomePage from "../pages/HomePage";
  import PricingPage from "../pages/PricingPage";
  import NotFoundPage from "../pages/NotFoundPage";

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    );
  }

  export default App;
