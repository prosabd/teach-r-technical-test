import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } from '@/store/productSlice';
import { fetchCategoriesStart, fetchCategoriesSuccess } from '@/store/categorySlice';
const API_URL = import.meta.env.VITE_API_URL;

const Home: React.FC = () => {
  const dispatch = useDispatch();
  // Browser settings part
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  // Page part
  const [products, loading, error] = useSelector((state: any) => state.products);
  const [order, setOrder] = useState("asc");

  const fetchProducts = async (pageNumber: number) => {
    const controller = new AbortController();
    try {
      dispatch(fetchProductsStart());
      dispatch(fetchCategoriesStart());
      // Fetch category details by name to render all products or filtered by category
      let url;
      if (categoryParam) {
        // Fetch category details by name
        const categoryResponse = await axios.get<Category[]>(API_URL + `/categories`);
        // console.log(categoryResponse.data);
        const category = categoryResponse.data["member"].filter(
          (category) => category.name === categoryParam
        );
        // console.log(category[0].id);
        if (!category) throw new Error("Category not found");

        // Fetch products with the category ID
        url = API_URL + `/products?category=/api/categories/${category[0].id}&page=${pageNumber}`;
        dispatch(fetchCategoriesSuccess(categoryResponse.data["member"]));
      } else {
        // Fetch products without filtering by category
        url = API_URL + `/products?page=${pageNumber}`;
      }

      const response = await axios.get<Product[]>(url, {
        signal: controller.signal,
      });
      console.log(response);
      let productData = response.data["member"] || [];

      //Set category name on product objects
      productData = await Promise.all(
        productData.map(async (product: Product) => {
          const categoryName = product.categorie.name;
          return { ...product, category: categoryName };
        })
      );

      setProducts(productData);
      dispatch(fetchProductsSuccess(productData));
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch(fetchProductsFailure("Failed to fetch products"));
      }
    }
  };

  const handleNextPage = async () => {
    const nextPage = page + 1;
    const baseUrl = categoryParam ? `/products/${categoryParam}` : "/products";
    navigate(`${baseUrl}?page=${nextPage}`);
  };

  const handlePreviousPage = async () => {
    const previousPage = page - 1;
    const baseUrl = categoryParam ? `/products/${categoryParam}` : "/products";
    navigate(`${baseUrl}?page=${previousPage}`);
  };

  useEffect(() => {
    fetchProducts(page);
    return () => {};
  }, [page, categoryParam, order]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="container mx-auto p-4 text-center">
        <div className="w-48 mx-auto p-4 pt-1">
          <Label htmlFor="order">Order</Label>
          <Select onValueChange={setOrder} defaultValue={order}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* // Sort element by name (or order value selected) and display them */}
          {Array.isArray(products) &&
            products
              .sort((a, b) =>
                order === "asc"
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name)
              )
              .map((product) => (
                <Link key={product.id} to={`/products/detail/${product.id}`}>
                  <Card key={product.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <img
                        // Let's check if the item is a basic item and its photo exists on the server, or if it is a user-created item and its photo exists in the public/user_assets/products_images folder
                        src={
                          "https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/" +
                          product.name.replace(" ", "_") +
                          ".jpg"
                            ? "https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/" +
                              product.name.replace(" ", "_") +
                              ".jpg"
                            : "@/public/user_assets/products_images/" +
                              product.name.replace(" ", "_") +
                              ".{" +
                              ["jpg", "png", "jpeg"].join("|") +
                              "}"
                        }
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-xl mb-2">
                        {product.name}
                      </CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                      {!categoryParam && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Category: {product.category}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
        <Button
          className="mt-4 mx-2 "
          onClick={handlePreviousPage}
          disabled={page <= 1}
        >
          Previous Page
        </Button>
        <Button
          className="mt-4 mx-2"
          onClick={handleNextPage}
          //verify if the current page is the last page, if it is, disable the next button
          disabled={
            response?.data?.["hydra:view"]?.["hydra:last"]
              ? response?.data?.["hydra:view"]?.["@id"] ===
                response?.data?.["hydra:view"]?.["hydra:last"]
              : true
          }
        >
          Next Page
        </Button>
      </div>
    </>
  );
};

export default Home;
