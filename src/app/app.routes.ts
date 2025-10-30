import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Employee } from './pages/employee/employee';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { OrdersList } from './pages/admin/orders/orders-list/orders-list';
import { CreateOrder } from './pages/admin/orders/create-order/create-order';
import { EditOrder } from './pages/admin/orders/edit-order/edit-order';
import { CustomersList } from './pages/admin/customers/customers-list/customers-list';
import { CreateCustomer } from './pages/admin/customers/create-customer/create-customer';
import { EmployeesList } from './pages/admin/employees/employees-list/employees-list';
import { CreateEmployee } from './pages/admin/employees/create-employee/create-employee';
import { EditEmployee } from './pages/admin/employees/edit-employee/edit-employee';
import { EditCustomer } from './pages/admin/customers/edit-customer/edit-customer';
import { RolesList } from './pages/admin/roles/roles-list/roles-list';
import { CreateRole } from './pages/admin/roles/create-role/create-role';
import { EditRole } from './pages/admin/roles/edit-role/edit-role';
import { AreasList } from './pages/admin/areas/areas-list/areas-list';
import { CreateArea } from './pages/admin/areas/create-area/create-area';
import { EditArea } from './pages/admin/areas/edit-area/edit-area';
import { CategoriesList } from './pages/admin/categories/categories-list/categories-list';
import { CreateCategory } from './pages/admin/categories/create-category/create-category';
import { EditCategory } from './pages/admin/categories/edit-category/edit-category';
import { MaterialsList } from './pages/admin/materials/materials-list/materials-list';
import { CreateMaterial } from './pages/admin/materials/create-material/create-material';
import { EditMaterial } from './pages/admin/materials/edit-material/edit-material';
import { FlowsList } from './pages/admin/flows/flows-list/flows-list';
import { CreateFlow } from './pages/admin/flows/create-flow/create-flow';
import { EditFlow } from './pages/admin/flows/edit-flow/edit-flow';
import { OrderTrackingComponent } from './pages/admin/oracle-procedures/order-tracking/order-tracking';
import { ProductLocationComponent } from './pages/admin/oracle-procedures/product-location/product-location';


export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [authGuard, roleGuard],
        data: { role: 'admin' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'orders', component: OrdersList },
            { path: 'orders/create', component: CreateOrder },
            { path: 'orders/edit/:id', component: EditOrder },
            { path: 'customers', component: CustomersList },
            { path: 'customers/create', component: CreateCustomer },
            { path: 'customers/edit/:id', component: EditCustomer },
            { path: 'employees', component: EmployeesList },
            { path: 'employees/create', component: CreateEmployee },
            { path: 'employees/edit/:id', component: EditEmployee },
            { path: 'roles', component: RolesList },
            { path: 'roles/create', component: CreateRole },
            { path: 'roles/edit/:id', component: EditRole },
            { path: 'areas', component: AreasList },
            { path: 'areas/create', component: CreateArea },
            { path: 'areas/edit/:id', component: EditArea },
            { path: 'categories', component: CategoriesList },
            { path: 'categories/create', component: CreateCategory },
            { path: 'categories/edit/:id', component: EditCategory },
            { path: 'materials', component: MaterialsList },
            { path: 'materials/create', component: CreateMaterial },
            { path: 'materials/edit/:id', component: EditMaterial },
            { path: 'flows', component: FlowsList },
            { path: 'flows/create', component: CreateFlow },
            { path: 'flows/edit/:id', component: EditFlow },
            { path: 'order-tracking', component: OrderTrackingComponent },
            { path: 'product-location', component: ProductLocationComponent },
        ]
    },
    {
        path: 'employee',
        component: Employee,
        canActivate: [authGuard, roleGuard],
        data: { role: 'employee' }
    }
];
