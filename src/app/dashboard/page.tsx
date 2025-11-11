export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de control de SmartSales. Aquí puedes gestionar productos, inventario y más.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Productos</h2>
          <p className="text-gray-600">Gestiona tu catálogo de productos.</p>
          <button className="mt-4 bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md transition duration-150">
            Ver Productos
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Inventario</h2>
          <p className="text-gray-600">Controla el stock y movimientos.</p>
          <button className="mt-4 bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md transition duration-150">
            Ver Inventario
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Reportes</h2>
          <p className="text-gray-600">Genera reportes dinámicos.</p>
          <button className="mt-4 bg-[#00BCD4] hover:bg-[#0097A7] text-white font-semibold py-2 px-4 rounded-md transition duration-150">
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  );
}
