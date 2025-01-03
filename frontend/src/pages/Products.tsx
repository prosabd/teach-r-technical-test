import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductForm from '@/hooks/ProductForm';
import { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } from '@/store/productSlice';
import { fetchCategoriesStart, fetchCategoriesSuccess } from '@/store/categorySlice';
import instance, { verifyToken } from '@/utils/userInstance';
const API_URL = import.meta.env.VITE_API_URL;

const Products: React.FC = () => {
  const dispatch = useDispatch();
  // Browser settings part
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  // Page part
  const { products, loading, error } = useSelector((state: any) => state.products);
  const [view, setView] = useState<any | null>(null);
  const [order, setOrder] = useState("asc");
  // CRUD part
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const fetchProducts = async (pageNumber: number) => {
    const controller = new AbortController();
    try {
      dispatch(fetchProductsStart());
      dispatch(fetchCategoriesStart());
      // Fetch category details by name to render all products or filtered by category
      let url = API_URL + `/products?page=${pageNumber}`;
      if (categoryParam) {
        // Fetch category details by name
        const categoryResponse = await axios.get<Category[]>(API_URL + `/categories`);
        const category = categoryResponse.data["member"].filter(
            (category) => category.nom.toLowerCase() === categoryParam.toLowerCase()
        );
        if (!category) throw new Error("Category not found");
        
        // Fetch products with the category ID
        url += `&categorie=/api/categories/${category[0].id}`;
        dispatch(fetchCategoriesSuccess(categoryResponse.data["member"]));
      }

      const response = await axios.get<Product[]>(url, {
        signal: controller.signal,
      });
      setView(response.data["view"]);
      let productData = response.data["member"] || [];
      
      //Set category name on product objects
      productData = await Promise.all(
          productData.map(async (product: Product) => {
              const categoryName = product.categorie.name;
              return { ...product, category: categoryName };
            })
        );
        
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

  const handleProductUpdated = () => {
    fetchProducts(page); // Fetch products when a product is added or updated
  }

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await instance.delete(`/products/${productId}`);
      fetchProducts(page);
    } catch (error) {
      // error 
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchProducts(page);
    return () => {};
  }, [page]);

  if (loading) {
    return ( 
        <Button disabled>
            <Loader2 className="animate-spin" />
            Please wait
        </Button>
    )
  }
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
        {verifyToken().isValid && verifyToken().isAdmin && (
            <Button className="w-48 mx-auto p-4 my-2"
                onClick={handleAddProduct}
              >
                Add Product
            </Button>
          )
        }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* // Sort element by name (or order value selected) and display them */}
          {Array.isArray(products) &&
            [...products].sort((a, b) =>
                order === "asc"
                  ? a.nom.localeCompare(b.nom)
                  : b.nom.localeCompare(a.nom)
              ).map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <Link key={product.id} to={`/products/detail/${product.id}`}>
                      <CardHeader className="p-0">
                      <img
                          // Let's check if the item is a basic item and its photo exists on the server, or if it is a user-created item and its photo exists in the public/user_assets/products_images folder
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
                          className="w-full h-48 object-cover"
                      />
                      </CardHeader>
                    </Link>
                    <CardContent className="p-4">
                      <Link key={product.id} to={`/products/detail/${product.id}`}>
                        <CardTitle className="text-xl mb-2">
                        {product.nom}
                        </CardTitle>
                      </Link>
                      <CardTitle className="text-base mb-2">{product.prix}$</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                      {!categoryParam && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Category: {product.categorie.nom}
                        </p>
                      )}
                      { verifyToken().isValid && verifyToken().isAdmin && 
                        <div className="items-center space-x-2 pt-3">
                          <Button variant="secondary" size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                              Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                              Delete
                          </Button>
                        </div>
                      }
                    </CardContent>
                  </Card>
              ))}
            <ProductForm open={isModalOpen} onClose={handleCloseModal} product={selectedProduct} onProductUpdated={handleProductUpdated}/>
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
            view?.["last"]
              ? view?.["@id"] ===
                view?.["last"]
              : true
          }
        >
          Next Page
        </Button>
      </div>
    </>
  );
};

export default Products;
