import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Product from "@/models/Product";
const API_URL = import.meta.env.VITE_API_URL;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const response = await axios.get<Product>(API_URL + `/products/${id}`, {
        signal: controller.signal,
      });
      
      // Set category name on product object
      const categoryName = response.data.categorie.name;
      const productData = { 
        ...response.data, 
        category: categoryName 
      };
      
      setProduct(productData);
      setError(null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError("Failed to fetch product");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    return () => {};
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  
  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  
  if (!product) return <div className="text-center mt-8">Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="outline"
        onClick={() => navigate("/products")}
        className="mb-4"
      >
        Back to Products
      </Button>
      
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <img
            src={
              "https://github.com/prosabd/teach-r-technical-test/releases/download/image-base/" +
              product.nom
                .replace(/&/g, '.') // Replace '&' with '.'
                .replace(/ /g, '_') + ".jpg"
                ? "https://github.com/prosabd/teach-r-technical-test/releases/download/image-base/" +
                  product.nom
                    .replace(/&/g, '.') // Replace '&' with '.'
                    .replace(/ /g, '_') + ".jpg"
                : "@/public/user_assets/products_images/" +
                  product.nom.replace(" ", "_") +
                  ".{" +
                  ["jpg", "png", "jpeg"].join("|") +
                  "}"
            }
            alt={product.nom}
            className="w-full h-64 object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
            }}
          />
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          <CardTitle className="text-2xl font-bold">{product.nom}</CardTitle>
          
          <CardDescription className="text-lg">
            {product.description}
          </CardDescription>
          
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Category: {product.categorie.nom}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;