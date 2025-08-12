
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Trash2, Edit, Plus, Package, Upload, X } from 'lucide-react';
import CategoryModal from '@/components/admin/CategoryModal';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  image: string | null;
  category_id: string | null;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  created_at: string;
}

const AdminProducts = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    category_id: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setIsProductsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const extractImagePath = (imageUrl: string | null): string | null => {
    if (!imageUrl) return null;
    
    try {
      // Extract the file path from the Supabase Storage URL
      // URL format: https://[project].supabase.co/storage/v1/object/public/product-images/[filename]
      const url = new URL(imageUrl);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.indexOf('product-images');
      
      if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
        return pathSegments.slice(bucketIndex + 1).join('/');
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting image path:', error);
      return null;
    }
  };

  const deleteImageFromStorage = async (imageUrl: string | null): Promise<boolean> => {
    if (!imageUrl) return true;
    
    const imagePath = extractImagePath(imageUrl);
    if (!imagePath) return false;

    try {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([imagePath]);

      if (error) {
        console.error('Error deleting image:', error);
        return false;
      }

      console.log('Image deleted successfully:', imagePath);
      return true;
    } catch (error) {
      console.error('Error deleting image from storage:', error);
      return false;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      console.log('Uploading file:', fileName);
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category_id) {
      toast.error('Title, price, and category are required');
      return;
    }

    try {
      let imageUrl = formData.image;
      let oldImageUrl: string | null = null;

      // If editing and uploading a new image, store the old image URL for deletion
      if (editingProduct && selectedFile && editingProduct.image) {
        oldImageUrl = editingProduct.image;
      }

      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (!uploadedUrl) {
          return;
        }
        imageUrl = uploadedUrl;
      }

      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description || null,
        image: imageUrl || null,
        category_id: formData.category_id
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        
        // Delete old image if we uploaded a new one
        if (oldImageUrl && selectedFile) {
          await deleteImageFromStorage(oldImageUrl);
        }
        
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast.success('Product created successfully');
      }

      setFormData({ title: '', price: '', description: '', image: '', category_id: '' });
      setSelectedFile(null);
      setEditingProduct(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      description: product.description || '',
      image: product.image || '',
      category_id: product.category_id || ''
    });
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleDelete = async (product: Product) => {
    setProductToDelete(product);
  };

  const handleDeleteConfirmed = async () => {
    if (!productToDelete) return;

    try {
      // Delete the product from database first
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (error) throw error;
      
      // Delete the product's image from storage
      if (productToDelete.image) {
        await deleteImageFromStorage(productToDelete.image);
      }
      
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setProductToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', price: '', description: '', image: '', category_id: '' });
    setSelectedFile(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleCategoryAdded = (newCategory: { id: string; name: string }) => {
    setCategories(prev => [...prev, { ...newCategory, created_at: new Date().toISOString() }]);
    setFormData(prev => ({ ...prev, category_id: newCategory.id }));
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'No Category';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

   return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className={`flex justify-between items-center flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="min-w-0 flex-1">
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Add, edit, or remove products from your store</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-brand-accent hover:bg-brand-accent/90 shrink-0">
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Product Form */}
          {showForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Product title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CategoryModal onCategoryAdded={handleCategoryAdded} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 flex-col sm:flex-row">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="flex-1 w-full"
                      />
                      {selectedFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeSelectedFile}
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {selectedFile && (
                      <div className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Upload className="h-4 w-4" />
                        <span>Selected: {selectedFile.name}</span>
                      </div>
                    )}
                    
                    {formData.image && !selectedFile && (
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <img 
                          src={formData.image} 
                          alt="Current product" 
                          className="w-16 h-16 object-cover rounded"
                        />
                        <span className="text-sm text-gray-600">Current image</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description"
                    rows={3}
                  />
                </div>
                <div className={`flex gap-2 ${isRTL ? 'justify-end' : 'justify-start'} flex-wrap`}>
                  <Button 
                    type="submit" 
                    className="bg-brand-accent hover:bg-brand-accent/90"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                        Uploading...
                      </>
                    ) : (
                      editingProduct ? 'Update Product' : 'Create Product'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          {isProductsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
            </div>
          ) : (
            <div className={` ${isRTL ? 'rtl' : 'ltr'}`}>
              <Table className={`min-w-full ${isRTL ? 'rtl' : 'ltr'}`}>
                <TableHeader className={`${isRTL ? 'rtl' : 'ltr'}`}>
                  <TableRow className={`${isRTL ? 'rtl' : 'ltr'}`}>
                    <TableHead className="text-center">Image</TableHead>
                    <TableHead className="text-center">Title</TableHead>
                    <TableHead className="text-center min-w-[100px]">Category</TableHead>
                    <TableHead className="text-center min-w-[80px]">Price</TableHead>
                    <TableHead className="text-right">Description</TableHead>
                    <TableHead className="text-center min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="text-center">
                        {product.image ? (
                          <div className="flex justify-center">
                            <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded" />
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="break-words max-w-[200px]">
                          {product.title}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 whitespace-nowrap">
                            {getCategoryName(product.category_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] break-words" title={product.description || 'No description'}>
                          {product.description || 'No description'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="min-w-[40px]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product)}
                            className="min-w-[40px]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {products.length === 0 && !isProductsLoading && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500">Get started by adding your first product.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={productToDelete !== null} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirmed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
