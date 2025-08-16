import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Trash2, Plus, Upload, X, Package } from 'lucide-react';

interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  size: string;
  stock_quantity: number;
  image?: string;
  price?: number;
  created_at: string;
}

interface ProductVariantFormProps {
  productId: string;
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
}

const ProductVariantForm = ({ productId, variants, onVariantsChange }: ProductVariantFormProps) => {
  const { t } = useTranslation();
  const [newVariant, setNewVariant] = useState({
    color: '',
    size: '',
    stock_quantity: '',
    price: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadVariantImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}_${Date.now()}.${fileExt}`;
      const filePath = `product-variants/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading variant image:', uploadError);
        toast.error('Failed to upload variant image');
        return null;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading variant image:', error);
      toast.error('Failed to upload variant image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddVariant = async () => {
    if (!newVariant.color || !newVariant.size || !newVariant.stock_quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadVariantImage(selectedFile);
        if (!imageUrl) return;
      }

      const variantData = {
        product_id: productId,
        color: newVariant.color,
        size: newVariant.size,
        stock_quantity: parseInt(newVariant.stock_quantity),
        price: newVariant.price ? parseFloat(newVariant.price) : null,
        image: imageUrl
      };

      const { data, error } = await supabase
        .from('product_variants')
        .insert([variantData])
        .select()
        .single();

      if (error) {
        console.error('Error adding variant:', error);
        toast.error('Failed to add variant');
        return;
      }

      const updatedVariants = [...variants, data];
      onVariantsChange(updatedVariants);
      
      // Reset form
      setNewVariant({ color: '', size: '', stock_quantity: '', price: '' });
      setSelectedFile(null);
      toast.success('Variant added successfully');
    } catch (error) {
      console.error('Error adding variant:', error);
      toast.error('Failed to add variant');
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) {
        console.error('Error deleting variant:', error);
        toast.error('Failed to delete variant');
        return;
      }

      const updatedVariants = variants.filter(v => v.id !== variantId);
      onVariantsChange(updatedVariants);
      toast.success('Variant deleted successfully');
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast.error('Failed to delete variant');
    }
  };

  const handleUpdateVariant = async (variantId: string, field: string, value: string) => {
    try {
      const updateData: any = {};
      if (field === 'stock_quantity') {
        updateData.stock_quantity = parseInt(value);
      } else if (field === 'price') {
        updateData.price = value ? parseFloat(value) : null;
      } else {
        updateData[field] = value;
      }

      const { error } = await supabase
        .from('product_variants')
        .update(updateData)
        .eq('id', variantId);

      if (error) {
        console.error('Error updating variant:', error);
        toast.error('Failed to update variant');
        return;
      }

      const updatedVariants = variants.map(v => 
        v.id === variantId ? { ...v, [field]: field === 'stock_quantity' ? parseInt(value) : (field === 'price' ? (value ? parseFloat(value) : null) : value) } : v
      );
      onVariantsChange(updatedVariants);
      setEditingVariant(null);
      toast.success('Variant updated successfully');
    } catch (error) {
      console.error('Error updating variant:', error);
      toast.error('Failed to update variant');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Product Variants
        </CardTitle>
        <CardDescription>
          Manage colors, sizes, and stock for this product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new variant form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
          <Input
            placeholder="Color"
            value={newVariant.color}
            onChange={(e) => setNewVariant(prev => ({ ...prev, color: e.target.value }))}
          />
          <Input
            placeholder="Size"
            value={newVariant.size}
            onChange={(e) => setNewVariant(prev => ({ ...prev, size: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Stock"
            value={newVariant.stock_quantity}
            onChange={(e) => setNewVariant(prev => ({ ...prev, stock_quantity: e.target.value }))}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Price (optional)"
            value={newVariant.price}
            onChange={(e) => setNewVariant(prev => ({ ...prev, price: e.target.value }))}
          />
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="variant-image-upload"
            />
            <label htmlFor="variant-image-upload" className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" disabled={isUploading}>
                <Upload className="h-4 w-4" />
              </Button>
            </label>
            <Button 
              onClick={handleAddVariant} 
              size="sm"
              disabled={isUploading || !newVariant.color || !newVariant.size || !newVariant.stock_quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Variants table */}
        {variants.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell>
                    {variant.image && (
                      <img 
                        src={variant.image} 
                        alt={`${variant.color} ${variant.size}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {editingVariant === variant.id ? (
                      <Input
                        defaultValue={variant.color}
                        onBlur={(e) => handleUpdateVariant(variant.id, 'color', e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span 
                        onClick={() => setEditingVariant(variant.id)}
                        className="cursor-pointer hover:underline"
                      >
                        {variant.color}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingVariant === variant.id ? (
                      <Input
                        defaultValue={variant.size}
                        onBlur={(e) => handleUpdateVariant(variant.id, 'size', e.target.value)}
                      />
                    ) : (
                      <span 
                        onClick={() => setEditingVariant(variant.id)}
                        className="cursor-pointer hover:underline"
                      >
                        {variant.size}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingVariant === variant.id ? (
                      <Input
                        type="number"
                        defaultValue={variant.stock_quantity}
                        onBlur={(e) => handleUpdateVariant(variant.id, 'stock_quantity', e.target.value)}
                      />
                    ) : (
                      <span 
                        onClick={() => setEditingVariant(variant.id)}
                        className="cursor-pointer hover:underline"
                      >
                        {variant.stock_quantity}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingVariant === variant.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={variant.price || ''}
                        onBlur={(e) => handleUpdateVariant(variant.id, 'price', e.target.value)}
                      />
                    ) : (
                      <span 
                        onClick={() => setEditingVariant(variant.id)}
                        className="cursor-pointer hover:underline"
                      >
                        {variant.price ? `$${variant.price}` : '-'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingVariant(variant.id)}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteVariant(variant.id)}
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
      </CardContent>
    </Card>
  );
};

export default ProductVariantForm;