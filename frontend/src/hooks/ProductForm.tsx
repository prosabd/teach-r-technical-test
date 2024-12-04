import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Product from '@/models/Product';
import { fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure } from '@/store/categorySlice';
import instance from '@/utils/userInstance';
import Category from "@/models/Category";
const API_URL = import.meta.env.VITE_API_URL;


interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, product }) => {
  const products = useSelector((state: any) => state.products);
  const { categories, loading, error } = useSelector((state: any) => state.categories);
  const [formData, setFormData] = useState<Product>(product || { 
    id: products.length + 1, nom: '', description: '', prix: 0, dateCreation: new Date(), categorie: { id: 0, nom: '', description: '' } });
  const dispatch = useDispatch();

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find(category => category.id.toString() === value);
    if (selectedCategory) {
      setFormData({ ...formData, categorie: selectedCategory });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const productData = {
      nom: formData.nom,
      description: formData.description,
      prix: formData.prix,
      categorie: formData.categorie.id
    };
  
    try {
      if (product) {
        await instance.put(`${API_URL}/products/edit/${product.id}`, productData);
      } else {
        await instance.post(`${API_URL}/products/new`, productData);
      }
      
      onClose();
    } catch (error) {
      // error
    }
  };
  

  const fetchCategories = async () => {
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
  }
  
  useEffect(() => {
      fetchCategories();
  }, []);
  
  if (loading) {
    return (
      <Dialog open={open}>
        <DialogContent>
          <div>Loading categories...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open}>
        <DialogContent>
          <div>Error loading categories: {error}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} disableEnforceFocus>
      <DialogTitle>
        {product ? "Edit Product" : "Add Product"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Product Name"
          type="text"
          fullWidth
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          value={formData.prix}
          onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
          />
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={handleCategoryChange} value={formData.categorie.id.toString()}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent style={{ zIndex: 5000 }}>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{product ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;