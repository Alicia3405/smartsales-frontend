// src/components/ProductFormModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
// 1. Importa las interfaces y funciones corregidas
import { IProduct, IProductDTO, createProduct, updateProduct, getCategories, ICategory } from '@/services/productService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; 
  productToEdit: IProduct | null; 
}

const ProductFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, productToEdit }) => {
  
  // 2. Estado inicial usando la interfaz IProductDTO corregida
  const initialState: IProductDTO = {
    name: '', // <-- CORREGIDO (antes 'nombre')
    description: '',
    sku: '',
    stock: 0, // <-- CORREGIDO (antes 'stock_actual')
    min_stock: 10,
    precio: '0.00',
    categoria_id: 0, 
  };

  const [formData, setFormData] = useState<IProductDTO>(initialState);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = productToEdit !== null;

  useEffect(() => {
    // Cargar categorías para el dropdown
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        // Si no estamos editando, asigna la primera categoría por defecto
        if (!isEditMode && cats.length > 0) {
          setFormData(prev => ({ ...prev, categoria_id: cats[0].id }));
        }
      } catch (err) {
        setError("Error: No se pudieron cargar las categorías.");
      }
    };
    
    if (isOpen) {
      fetchCategories();
      if (isEditMode) {
        // Pre-llena el formulario si estamos en modo "Editar"
        setFormData({
          name: productToEdit.name,
          description: productToEdit.description,
          sku: productToEdit.sku,
          stock: productToEdit.stock,
          min_stock: productToEdit.min_stock,
          precio: productToEdit.precio,
          categoria_id: productToEdit.categoria.id,
        });
      } else {
        // Limpia el formulario si estamos en modo "Crear"
        setFormData(initialState);
      }
      setError(null);
    }
  }, [productToEdit, isOpen]); 

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (e.target.type === 'number') ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.categoria_id === 0) {
      setError("Por favor, selecciona una categoría válida.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateProduct(productToEdit.id, formData);
      } else {
        await createProduct(formData);
      }
      onSave(); 
      onClose(); 
    } catch (err: any) {
      setError(err.message || 'Error al guardar. Revisa los campos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl z-50 transform transition-all">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          
          {error && (
             <p className="text-sm font-semibold text-red-600 border border-red-200 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
          
          {/* --- CORRECCIÓN DE DISEÑO (Campos 'name', 'stock', 'description') --- */}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text" name="name" id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
              required
            />
          </div>
          
          <div>
            <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              name="categoria_id"
              id="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
              required
            >
              <option value={0} disabled>Selecciona una categoría...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU (Código)</label>
            <input
              type="text" name="sku" id="sku"
              value={formData.sku}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio (Bs)</label>
              <input
                type="text" name="precio" id="precio"
                value={formData.precio}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Actual</label>
              <input
                type="number" name="stock" id="stock"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                required
              />
            </div>
            
            <div>
              <label htmlFor="min_stock" className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
              <input
                type="number" name="min_stock" id="min_stock"
                value={formData.min_stock}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="description" id="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button" onClick={onClose} disabled={isSubmitting}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="bg-[#00BCD4] text-white px-4 py-2 rounded-md hover:bg-[#009688]"
            >
              {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;