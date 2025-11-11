// src/app/dashboard/inventory/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { getInventoryMovements, createInventoryMovement, IInventoryMovement } from '@/services/inventoryService';
import { getProducts, IProduct } from '@/services/productService'; 

export default function InventoryPage() {
  const [movements, setMovements] = useState<IInventoryMovement[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estado para el Formulario de Registro ---
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [tipoMovimiento, setTipoMovimiento] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  const [cantidad, setCantidad] = useState<number>(1);
  const [motivo, setMotivo] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Carga inicial de datos
  const fetchData = async () => {
    try {
      setLoading(true);
      const [movData, prodData] = await Promise.all([
        getInventoryMovements(),
        getProducts() 
      ]);
      setMovements(movData);
      setProducts(prodData);
      if (prodData.length > 0) {
        setSelectedProduct(String(prodData[0].id)); 
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler para registrar el movimiento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (cantidad <= 0 || !selectedProduct) {
      setSubmitError('La cantidad debe ser mayor a 0 y debe seleccionar un producto.');
      return;
    }

    try {
      await createInventoryMovement({
        producto_id: parseInt(selectedProduct),
        tipo_movimiento: tipoMovimiento,
        cantidad: cantidad,
        motivo: motivo || 'Ajuste manual',
      });
      setCantidad(1);
      setMotivo('');
      fetchData(); 
    } catch (err: any) {
      setSubmitError(err.message || 'Error al registrar el movimiento.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-lg text-gray-600">Cargando datos de inventario...</p>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="flex items-center justify-center p-10">
        <p className="text-lg text-red-600 bg-red-100 p-4 rounded-md border border-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Inventario (CU3)</h1>

      {/* --- Formulario de Registro de Movimiento --- */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Registrar Movimiento</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <div className="flex flex-col">
            <label htmlFor="producto" className="text-sm font-medium text-gray-700">Producto</label>
            <select
              id="producto"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-900"
            >
              {/* --- CORRECCIÓN AQUÍ (p.nombre a p.name) --- */}
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="tipo_movimiento" className="text-sm font-medium text-gray-700">Tipo</label>
            <select
              id="tipo_movimiento"
              value={tipoMovimiento}
              onChange={(e) => setTipoMovimiento(e.target.value as 'ENTRADA' | 'SALIDA')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-900"
            >
              <option value="ENTRADA">Entrada (Sumar)</option>
              <option value="SALIDA">Salida (Restar)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="cantidad" className="text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              id="cantidad"
              value={cantidad}
              min="1"
              onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md transition duration-150 shadow-md"
          >
            Registrar Movimiento
          </button>
          
          <div className="md:col-span-4">
             <label htmlFor="motivo" className="text-sm font-medium text-gray-700">Motivo (Opcional)</label>
            <input
              type="text"
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-900"
              placeholder="Ej: Ajuste de inventario, Devolución de cliente..."
            />
          </div>
          
          {submitError && <p className="md:col-span-4 text-red-600">{submitError}</p>}
        </form>
      </div>

      {/* --- Historial de Movimientos --- */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 p-4 border-b">Historial de Movimientos</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.map((mov) => (
              <tr key={mov.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(mov.fecha_movimiento).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {/* --- CORRECCIÓN AQUÍ (mov.producto.nombre a mov.producto.name) --- */}
                  {mov.producto.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className={`font-semibold ${
                      mov.tipo_movimiento === 'ENTRADA' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {mov.tipo_movimiento}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                  {mov.tipo_movimiento === 'ENTRADA' ? '+' : '-'}{mov.cantidad}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mov.motivo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
       {movements.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay movimientos de inventario registrados.</p>
        </div>
      )}
    </div>
  );
}