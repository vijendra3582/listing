import { HeaderComponent } from './includes/header/header.component';
import { SidebarComponent } from './includes/sidebar/sidebar.component';
import { FooterComponent } from './includes/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { ForgetComponent } from './forget/forget.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { BrandComponent } from './brand/brand.component';
import { ProductComponent } from './product/product.component';
import { ImportProductComponent } from './import-product/import-product.component';

export const adminComponents = [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    DashboardComponent,
    CategoryComponent,
    SubCategoryComponent,
    BrandComponent,
    ProductComponent,
    ImportProductComponent
];


export * from './includes/header/header.component';
export * from './includes/sidebar/sidebar.component';
export * from './includes/footer/footer.component';
export * from './login/login.component';
export * from './register/register.component';
export * from './forget/forget.component';
export * from './dashboard/dashboard.component';
export * from './category/category.component';
export * from './sub-category/sub-category.component';
export * from './brand/brand.component';
export * from './product/product.component';
export * from './import-product/import-product.component';
