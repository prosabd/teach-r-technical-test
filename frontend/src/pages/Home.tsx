import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Product from '../models/Product';
const API_URL = import.meta.env.VITE_API_URL;

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getRandomProducts = (array: Product[], count: number) => {
    const limitedArray = array.slice(0, 20);
    const shuffled = [...limitedArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Product[]>(API_URL + `/products`, {
          signal: controller.signal,
        });
        const productData = response.data["member"] || [];
        setProducts(getRandomProducts(productData, 3));
        setError(null);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to fetch products");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container w-screen justify-items-center mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Welcome Teach'R technical test
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <Link key={product.id} to={`/products/detail/${product.id}`}>
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
              <img
                src={`https://github.com/prosabd/teach-r-technical-test/releases/download/image-base/${product.nom
                  .replace(/&/g, '.') // Replace '&' with '.'
                  .replace(/ /g, '_')
                }.jpg`}
                  alt={product.nom}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4 justify-items-between">
                <CardTitle className="text-xl mb-2">{product.nom}</CardTitle>
                <CardTitle className="text-base mb-2">{product.prix}$</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate("/products")}
          className="px-8"
        >
          View All Products
        </Button>
      </div>
    </div>
  );
};

export default Home;
