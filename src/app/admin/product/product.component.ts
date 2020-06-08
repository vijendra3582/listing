import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CommonService } from 'src/app/services/common.service';
import { ValidateSlug, ValidateDecimal } from 'src/app/validations/custom.validators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  pageIndex = 1;
  pageSize = 10;
  total = 1;
  listOfData: any = [];
  loading = true;
  sortValue: string | null = null;
  sortKey: string | null = null;
  search: any = {};

  ProductAddEditModal: boolean = false;
  ProductAddEditModalTitle = 'Manage Products';
  ProductAddEditModalButton = '';
  isSubmitLoading: boolean = false;

  categories: any = [];
  sub_categories: any = [];
  brands: any = [];

  productForm: FormGroup;
  server_message: any = {};
  product: any = {};
  submitted: boolean = false;

  uploading = false;
  uploadingLogo = false;
  fileList: any = [];
  fileListLogo: any = [];

  currentStepForm = 0;

  stock: any = {};
  stockErrors: any = {};
  StockEditModal: boolean = false;
  StockEditModalTitle: String = "";
  StockEditModalButton: String = "";
  isStockSubmitLoading: boolean = false;

  discount: any = {};
  discountErrors: any = {};
  DiscountEditModal: boolean = false;
  DiscountEditModalTitle: String = "";
  DiscountEditModalButton: String = "";
  isDiscountSubmitLoading: boolean = false;

  tax: any = {};
  taxErrors: any = {};
  TaxEditModal: boolean = false;
  TaxEditModalTitle: String = "";
  TaxEditModalButton: String = "";
  isTaxSubmitLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private commonService: CommonService,
    private responseMessage: NzMessageService
  ) { }

  ngOnInit() {
    this.setSearch();
    this.searchData();
    this.setValues();
    this.setForm();
    this.getCategory();
    this.getBrands();
  }

  stockM(id) {
    this.stock = {};
    this.stockErrors = {};
    this.StockEditModal = true;
    this.StockEditModalButton = "Update Stock";
    this.isStockSubmitLoading = false;

    var stock = this.listOfData.find(e => {
      return e.id == id;
    })

    this.StockEditModalTitle = "Edit Stock : " + stock.name;
    this.stock.id = stock.id;
    this.stock.stock = stock.stock;
  }

  cancelStock() {
    this.StockEditModal = false;
    this.StockEditModalTitle = "";
    this.StockEditModalButton = "";
    this.isStockSubmitLoading = false;
  }

  updateStock() {
    this.isStockSubmitLoading = true;
    this.productService.changeStock(this.stock).subscribe(
      data => {
        this.cancelStock();
        this.searchData();
        this.responseMessage.success(data.data.message, { nzDuration: 2000 });
      },
      error => {
        if (error.error.message.name === "SequelizeDatabaseError") {
          this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
        } else {
          this.stockErrors = error.error.message.errors;
          this.isStockSubmitLoading = false;
        }
      }
    )
  }

  discountM(id) {
    this.discount = {};
    this.discountErrors = {};
    this.DiscountEditModal = true;
    this.DiscountEditModalButton = "Update Discount";
    this.isDiscountSubmitLoading = false;

    var discount = this.listOfData.find(e => {
      return e.id == id;
    })

    this.DiscountEditModalTitle = "Edit Discount : " + discount.name;
    this.discount.id = discount.id;
    this.discount.discount_type = discount.discount_type;
    this.discount.discount = discount.discount;
  }

  cancelDiscount() {
    this.DiscountEditModal = false;
    this.DiscountEditModalTitle = "";
    this.DiscountEditModalButton = "";
    this.isDiscountSubmitLoading = false;
  }

  updateDiscount() {
    this.isDiscountSubmitLoading = true;
    this.productService.changeDiscount(this.discount).subscribe(
      data => {
        this.cancelDiscount();
        this.searchData();
        this.responseMessage.success(data.data.message, { nzDuration: 2000 });
      },
      error => {
        if (error.error.message.name === "SequelizeDatabaseError") {
          this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
        } else {
          this.discountErrors = error.error.message.errors;
          this.isDiscountSubmitLoading = false;
        }
      }
    )
  }

  taxM(id) {
    this.tax = {};
    this.taxErrors = {};
    this.TaxEditModal = true;
    this.TaxEditModalButton = "Update Tax";
    this.isTaxSubmitLoading = false;
    var tax = this.listOfData.find(e => {
      return e.id == id;
    })

    this.TaxEditModalTitle = "Edit Tax : " + tax.name;
    this.tax.id = tax.id;
    this.tax.tax_type = tax.tax_type;
    this.tax.tax = tax.tax;
  }

  cancelTax() {
    this.TaxEditModal = false;
    this.TaxEditModalTitle = "";
    this.TaxEditModalButton = "";
    this.isTaxSubmitLoading = false;
  }

  updateTax() {
    this.isTaxSubmitLoading = true;
    this.productService.changeTax(this.tax).subscribe(
      data => {
        this.cancelTax();
        this.searchData();
        this.responseMessage.success(data.data.message, { nzDuration: 2000 });
      },
      error => {
        if (error.error.message.name === "SequelizeDatabaseError") {
          this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
        } else {
          this.taxErrors = error.error.message.errors;
          this.isTaxSubmitLoading = false;
        }
      }
    )
  }

  onChangeNumber(value: string, type): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value))) {
      var value = value;
      this.product[type] = value;
    } else {
      this.product[type] = null;
      return;
    }
  }

  pre(): void {
    this.currentStepForm -= 1;
  }

  next(): void {
    this.currentStepForm += 1;
  }

  beforeUpload = (files: FileList) => {
    this.uploading = true;
    const formData = new FormData();
    for (let file of files as any) {
      formData.append('images', file);
    }

    this.commonService.upload(formData).subscribe(
      data => {
        this.fileList = [...this.fileList, ...data.files];
        this.uploading = false;
      }
    )
    return false;
  };

  beforeUploadLogo = (file: FileList) => {
    if (this.fileListLogo.length > 0) {
      return;
    }
    this.uploadingLogo = true;
    const formData = new FormData();
    formData.append('images', file[0]);
    this.commonService.upload(formData).subscribe(
      data => {
        this.fileListLogo = [...this.fileListLogo, ...data.files];
        this.uploadingLogo = false;
      }
    )
    return false;
  };

  removeImage(image, index, type) {
    this.commonService.removeImage({ "image": image }).subscribe(
      data => {
        if (type == 'image')
          this.fileList.splice(index, 1);

        if (type == 'imageLogo')
          this.fileListLogo.splice(index, 1);
      },
      error => {

      }
    )
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.searchData(true);
  }

  setSearch() {
    this.search.id = null;
    this.search.name = null;
    this.search.category = null;
    this.search.sub_category = null;
    this.search.brand = null;
    this.search.featured = null;
    this.search.status = null;
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.productService
      .all(this.pageIndex, this.pageSize, this.sortKey!, this.sortValue!, this.search)
      .subscribe(data => {
        this.loading = false;
        this.total = data.data.count[0].count;
        this.listOfData = data.data.response;
      });
  }

  add() {
    this.ProductAddEditModal = true;
    this.ProductAddEditModalTitle = "New Product";
    this.ProductAddEditModalButton = "Add Product";
    this.fileList = [];
    this.fileListLogo = [];
    this.submitted = false;
    this.isSubmitLoading = false;
    this.currentStepForm = 0;
    this.setForm();
    this.setValues();
  }

  edit(id) {
    this.productService.single(id).subscribe(
      data => {
        this.product = data.data;
        this.product.category_id = this.product.category_id.toString();
        this.product.sub_category_id = this.product.sub_category_id.toString();
        this.product.brand_id = this.product.brand_id.toString();
        this.fileList = this.product.images;
        this.fileListLogo = this.product.logo;
        this.ProductAddEditModal = true;
        this.ProductAddEditModalTitle = "Edit : " + this.product.name;
        this.ProductAddEditModalButton = "Update";
        this.setForm();
        this.currentStepForm = 0;
      }
    )
  }

  delete(id) {
    this.productService.delete(id).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  changeFeatured(id, value) {
    const data = { "id": id, "featured": value };
    this.productService.changeFeatured(data).subscribe(
      data => {
        this.responseMessage.success(data.data.message, { nzDuration: 2000 });
      },
      error => {
        if (error.error.message.name === "SequelizeDatabaseError") {
          this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
        }
      }
    )
  }

  changeStatus(id, value) {
    const data = { "id": id, "status": value };
    this.productService.changeStatus(data).subscribe(
      data => {
        this.responseMessage.success(data.data.message, { nzDuration: 2000 });
      }
    )
  }

  cancel() {
    this.ProductAddEditModal = false;
    this.ProductAddEditModalTitle = 'Manage Products';
    this.isSubmitLoading = false;
    this.setForm();
    this.setValues();
  }


  getCategory() {
    this.commonService.dropdown('category', { "total": this.categories.length }).subscribe(
      data => {
        this.categories = [...this.categories, ...data.dropdown];
      }
    )
  }

  getSubCategory() {
    if (this.product.category_id == null) {
      return;
    }
    this.commonService.dropdown('sub_category', { "total": this.sub_categories.length, "category_id": this.product.category_id }).subscribe(
      data => {
        this.sub_categories = [...this.sub_categories, ...data.dropdown];
      }
    )
  }

  getBrands() {
    this.commonService.dropdown('brand', { "total": this.brands.length }).subscribe(
      data => {
        this.brands = [...this.brands, ...data.dropdown];
      }
    )
  }

  setValues() {
    this.product = {};
    this.product.category_id = null;
    this.product.sub_category_id = null;
    this.product.brand_id = null;
    this.product.name = null;
    this.product.slug = null;
    this.product.status = 'active';
    this.product.sale_price = null;
    this.product.purchase_price = null;
    this.product.is_featured = 'no';
    this.product.discount_type = 'flat';
    this.product.discount = null;
    this.product.tax_type = 'flat';
    this.product.tax = null;
    this.product.description = null;
    this.product.stock = null;
  }

  setForm() {
    this.productForm = this.fb.group({
      category_id: [this.product.category_id, [Validators.required]],
      sub_category_id: [this.product.sub_category_id, [Validators.required]],
      brand_id: [this.product.brand_id, [Validators.required]],
      name: [this.product.name, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      slug: [this.product.slug, [Validators.required, Validators.maxLength(255), Validators.minLength(2), ValidateSlug]],
      sale_price: [this.product.sale_price, [Validators.required, ValidateDecimal]],
      purchase_price: [this.product.purchase_price, [Validators.required, ValidateDecimal]],
      is_featured: [this.product.is_featured, [Validators.required]],
      discount_type: [this.product.discount_type, [Validators.required]],
      discount: [this.product.discount, [Validators.required, ValidateDecimal]],
      tax_type: [this.product.tax_type, [Validators.required]],
      tax: [this.product.tax, [Validators.required, ValidateDecimal]],
      description: [this.product.description, [Validators.required, Validators.minLength(2)]],
      stock: [this.product.stock, [Validators.required, ValidateDecimal]],
      status: [this.product.status, [Validators.required]]
    });
  }

  submit() {
    this.isSubmitLoading = true;
    this.submitted = true;
    if (this.productForm.valid) {
      if (this.product.id === undefined) {
        this.product.images = this.fileList;
        this.product.logo = this.fileListLogo;
        this.productService.insert(this.product).subscribe(
          data => this.handleResponse(data),
          error => this.handleError(error)
        )
      } else {
        this.product.images = this.fileList;
        this.product.logo = this.fileListLogo;
        this.productService.update(this.product).subscribe(
          data => this.handleResponse(data),
          error => this.handleError(error)
        )
      }
    }
  }

  handleResponse(data) {
    this.isSubmitLoading = false;
    this.submitted = false;
    if (data.status == true) {
      this.ProductAddEditModal = false;
      this.ProductAddEditModalTitle = 'Manage Products';
      this.responseMessage.success(data.message, { nzDuration: 2000 });
      this.searchData();
    } else {
      this.responseMessage.error(data.message, { nzDuration: 2000 });
    }
  }

  handleError(error) {
    this.isSubmitLoading = false;
    this.submitted = false;
    if (error.error.message.name === "SequelizeDatabaseError") {
      this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
    } else {
      this.server_message = error.error.message.errors;
    }
  }

  convertToSlug() {
    if (this.product.name == null) {
      return;
    }
    if (this.product.id == undefined) {
      let slug = this.product.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        ;
      this.product.slug = slug;
    }
  }

}
