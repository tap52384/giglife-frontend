import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
  import Home from "../pages/Home";
  import Login from "../pages/Login";
  import PricingPage from "../pages/PricingPage";
  import NotFoundPage from "../pages/NotFoundPage";

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    );
  }

  export default App;
