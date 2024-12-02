import { BrowserRouter } from 'react-router';
import { Routes, Route } from 'react-router';
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import NotFound from "@/pages/NotFound";

function App() {

  return (
    <BrowserRouter>
      <div className="App min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" />
          <Route path="/products">
            <Route index element={<Products />} /> {/* Shows all products */}
            <Route path=":category" element={<Products />} /> {/* Shows products by categories */}
            {/* <Route path="detail/:id" element={<ProductDetail />} />  */}
          </Route>
          <Route path="*" element={<NotFound />} /> {/* Catch all unmatched routes */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
