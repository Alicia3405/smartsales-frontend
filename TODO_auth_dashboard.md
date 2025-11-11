# TODO: Implementación de la Interfaz de Autenticación y Dashboard Base

- [x] Create LoginForm component with form, authentication via authService, redirect to /dashboard
- [x] Create /login page using LoginForm component
- [x] Create Sidebar component with role-based navigation (Admin: all menus, Operator: limited)
- [x] Create DashboardLayout component with sidebar, user info display (name/role from JWT), notifications area
- [x] Create /dashboard page using DashboardLayout, connect WS on mount
- [x] Ensure responsive design with Tailwind CSS (primary #00BCD4, secondary #FF9800, white background)
- [x] Handle authentication state: redirect to /login if not authenticated
- [x] Update src/app/layout.tsx for global styles if needed
- [x] Test with npm run dev: verify login flow and WS connection
