import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Trash2, Edit, Plus, Package, Upload, X } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  image: string | null;
  created_at: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
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

  useEffect(() => {
    fetchProducts();
  }, []);

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
    
    if (!formData.title || !formData.price) {
      toast.error('Title and price are required');
      return;
    }

    try {
      let imageUrl = formData.image;

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
        image: imageUrl || null
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast.success('Product created successfully');
      }

      setFormData({ title: '', price: '', description: '', image: '' });
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
      image: product.image || ''
    });
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', price: '', description: '', image: '' });
    setSelectedFile(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Add, edit, or remove products from your store</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-brand-accent hover:bg-brand-accent/90">
              <Plus className="mr-2 h-4 w-4" />
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
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="flex-1"
                      />
                      {selectedFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeSelectedFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Upload className="h-4 w-4" />
                        <span>Selected: {selectedFile.name}</span>
                      </div>
                    )}
                    
                    {formData.image && !selectedFile && (
                      <div className="flex items-center gap-2">
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
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="bg-brand-accent hover:bg-brand-accent/90"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {product.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
    </div>
  );
};

export default AdminProducts;
