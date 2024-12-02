import { BrowserRouter } from 'react-router';
import { Routes, Route } from 'react-router';
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

function App() {

  return (
    <BrowserRouter>
      <div className="App min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" />
          <Route path="*" element={<NotFound />} /> {/* Catch all unmatched routes */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
