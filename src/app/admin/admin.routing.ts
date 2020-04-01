import 
{
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    CategoryComponent,
    SubCategoryComponent,
    BrandComponent,
    ProductComponent,
    ImportProductComponent,
    BundleComponent,
	VendorComponent
} from './pages';
import { Routes } from '@angular/router';
import { AuthGuard } from './../guards/auth.guard';
import { LoginGuard } from './../guards/login.guard';

export const adminRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: DashboardComponent
    },
    {
        path: "auth/login",
        canActivate: [LoginGuard],
        component: LoginComponent
    },
    {
        path: "auth/register",
        canActivate: [LoginGuard],
        component: RegisterComponent
    },
    {
        path: "auth/forget",
        canActivate: [LoginGuard],
        component: ForgetComponent
    },
    {
        path: "dashboard",
        canActivate: [AuthGuard],
        component: DashboardComponent
    },
    {
        path: "category",
        canActivate: [AuthGuard],
        component: CategoryComponent
    },
    {
        path: "sub-category",
        canActivate: [AuthGuard],
        component: SubCategoryComponent
    },
    {
        path: "brand",
        canActivate: [AuthGuard],
        component: BrandComponent
    },
    {
        path: "product",
        canActivate: [AuthGuard],
        component: ProductComponent
    },
    {
        path: "import-product",
        canActivate: [AuthGuard],
        component: ImportProductComponent
    },
    {
        path: "bundle",
        canActivate: [AuthGuard],
        component: BundleComponent
    },
    {
        path: "vendor",
        canActivate: [AuthGuard],
        component: VendorComponent
    }
];