import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@ng-shops/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'ng-shops-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit{

  products:Product[]=[];

  constructor(
    private productService:ProductsService,
    private router:Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ){}

  ngOnInit(){
    console.log();
    this.getProducts();
  }

  private getProducts(){
    this.productService.getProducts().subscribe((data:Product[])=>{
      this.products = data;
    })
  }

  deleteProduct(productId:string){
    this.confirmationService.confirm({
      message: 'Do you want to delete this product?',
      header: 'Delete category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(productId).subscribe(()=>{
          this.getProducts();
          this.messageService.add({severity:'success', summary:'Success', detail:'Product is Deleted'});
        }, () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not deleted!'
          });
        })
      },
  });
  }
  updateProduct(productId:string){
    this.router.navigateByUrl(`products/form/${productId}`);
  }

}
