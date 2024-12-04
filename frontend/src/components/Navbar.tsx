import React from 'react';
import { Link, useNavigate } from 'react-router';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Category from '@/models/Category';
import { fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure } from '@/store/categorySlice';
import { verifyToken, logout} from '@/utils/userInstance';
const API_URL = import.meta.env.VITE_API_URL;

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector((state: any) => state.categories);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(fetchCategoriesStart());
                const response = await axios.get<Category[]>(API_URL + `/categories`);
                dispatch(fetchCategoriesSuccess(response.data["member"]));
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    dispatch(fetchCategoriesFailure(error.message || 'An error occurred'));
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [dispatch]);

    const logOut = () => {
        logout();
        navigate("/products");
      };

    return (
        <div className="flex flex-col min-h-10 w-screen pt-6 pb-10">
            <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border">
                <div className="container mx-auto h-full">
                    <div className="flex justify-between items-center h-full px-4">
                        <div className="flex items-center gap-4">
                        <Link to="/"><h1 className="text-xl font-bold">Teach'R Test</h1></Link>
                        </div>

                        <div className="flex-1 flex items-center space-x-4">
                            <Button variant="ghost" className="ml-10" asChild>
                                <Link to="/">Home</Link>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button  className="flex items-center gap-2">
                                        Categories <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <Link to="/products"
                                        className="w-full h-full text-foreground no-underline hover:no-underline">
                                        View All
                                        </Link>
                                    </DropdownMenuItem>
                                    {categories.map(category => (
                                        <DropdownMenuItem key={category.id} asChild>
                                            <Link to={`/products/${category.nom.toLowerCase()}`}
                                                className="w-full h-full text-foreground no-underline hover:no-underline">
                                                {category.nom}
                                            </Link>
                                        </DropdownMenuItem>
                                      ))
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center">
                          {verifyToken().isValid ?
                              (
                              <div className='flex space-x-3'>
                                <Button variant="destructive" size="default" onClick={logOut}>
                                    Disconnect
                                </Button>
                                <Button variant="outline" size="default" disabled>
                                    Hi Admin
                                </Button>
                              </div>
                           ):(
                              <Link to="/login">
                                  <Button variant="outline" size="default">
                                      Connect (Crud actions)
                                  </Button>
                              </Link>
                           )
                          }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;