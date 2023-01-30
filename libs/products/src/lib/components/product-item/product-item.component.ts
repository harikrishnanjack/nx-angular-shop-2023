import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CartItem, CartService } from '@ng-shops/orders';
import { Product } from '../../models/product';

@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: []
})
export class ProductItemComponent implements OnInit,OnDestroy {
 @Input() product!:Product;

 constructor(private cartService:CartService){
 }

 ngOnInit(){
  console.log();
 }

 addToCart(){
  const cartItem:CartItem={
    productId:this.product.id,
    quantity:1
  }
  this.cartService.setCartItem(cartItem);
 }
 ngOnDestroy(): void {
     console.log();

 }
}
