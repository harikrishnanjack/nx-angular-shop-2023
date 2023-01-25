import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@ng-shops/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ng-shops-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit,OnDestroy{
  orders:Order[]=[];
  endsubs$: Subject<any> = new Subject();
  orderStatus:any = ORDER_STATUS;


  constructor(
    private orderService:OrdersService,
    private router:Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ){}

  ngOnInit(): void {
    this.getOrders();
  }

  ngOnDestroy() {
    this.endsubs$.next(false);
    this.endsubs$.complete();
  }

  getOrders() {
    this.orderService
      .getOrders()
      .pipe(takeUntil(this.endsubs$))
      .subscribe((orders) => {
        this.orders = orders;
        console.log(this.orders,'orders');

      });
  }

  deleteOrder(orderId:string){
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService
          .deleteOrder(orderId)
          .pipe(takeUntil(this.endsubs$))
          .subscribe(
            () => {
              this.getOrders();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Order is deleted!'
              });
            },
            () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Order is not deleted!'
              });
            }
          );
      }
    });

  }

  showOrder(orderId:string){
    this.router.navigateByUrl(`orders/${orderId}`);
  }
}
