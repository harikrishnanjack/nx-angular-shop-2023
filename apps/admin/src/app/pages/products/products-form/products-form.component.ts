import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService, Category, Product, ProductsService } from '@ng-shops/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'ng-shops-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit,OnDestroy{

  editmode = false;
  form!: FormGroup;
  isSubmitted = false;
  catagories:Category[] = [];
  imageDisplay!: string | ArrayBuffer | any;
  currentProductId!: string;
  endsubs$: Subject<any> = new Subject();

 constructor(
  private formBuilder: FormBuilder,
  private productsService: ProductsService,
  private categoriesService: CategoriesService,
  private router:Router,
  private messageService: MessageService,
  private confirmationService: ConfirmationService,
  private route:ActivatedRoute,
  private location: Location,

 ){}
 ngOnInit(): void {
  this.initForm();
  this.getCategories();
  this.checkEditMode();
}
private initForm() {
  this.form = this.formBuilder.group({
    name: ['', Validators.required],
    brand: ['', Validators.required],
    price: ['', Validators.required],
    category: ['', Validators.required],
    countInStock: ['', Validators.required],
    description: ['', Validators.required],
    richDescription: [''],
    image: ['', Validators.required],
    isFeatured: [false]
  });
}

  private getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endsubs$))
      .subscribe((categories) => {
        this.catagories = categories;
      });
  }

  onSubmitProduct(){
    this.isSubmitted=true;
    if(this.form.invalid) return;
    const productFromData= new FormData();
    Object.keys(this.productForm).map((key)=>{
      productFromData.append(key,this.productForm[key].value)
    });
    if(this.editmode){
      this.updateProduct(productFromData);
    }else{
      this.addProduct(productFromData);
    }

  }

  private updateProduct(products:FormData){
    this.productsService.updateProduct(products,this.currentProductId).subscribe((data)=>{
        this.messageService.add({severity:'success', summary:'Success', detail:`Product ${data.name} is Updated`});
        timer(2000).toPromise().then(()=>{
        this.router.navigateByUrl('/products');
      })
    },
    () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Product is not Updated!'
      });
    });
  }

  private addProduct(products:FormData){
    this.productsService.createProduct(products).subscribe((data)=>{
        this.messageService.add({severity:'success', summary:'Success', detail:`Product ${data.name} is Created`});
        timer(2000).toPromise().then(()=>{
        this.router.navigateByUrl('/products');
      })
    },
    () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Product is not Created!'
      });
    });
  }

  private checkEditMode(){
    this.route.params.subscribe(params=>{
      if(params?.['id']){
        this.editmode = true;
        this.currentProductId = params?.['id'];
        this.productsService.getProduct(this.currentProductId).subscribe((products:Product)=>{
          this.form.patchValue({
            name:products.name,
            brand:products.brand,
            price:products.price,
            category:products?.category?.id,
            countInStock:products.countInStock,
            description:products.description,
            richDescription:products.richDescription,
            isFeatured:products.isFeatured

          })
          this.imageDisplay=products.image;
          this.productForm?.['image'].setValidators([]);
          this.productForm?.['image'].updateValueAndValidity();
        })
      }
    })
  }

  onCancelProduct(){
    this.location.back();
  }

  onImageUpload(event:any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form?.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      };
      fileReader.readAsDataURL(file);
    }
  }

  ngOnDestroy():void {
    this.endsubs$.next(false);
    this.endsubs$.complete();
  }
  get productForm() {
    return this.form.controls;
  }
}
