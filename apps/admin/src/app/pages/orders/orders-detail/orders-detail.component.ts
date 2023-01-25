import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@ng-shops/orders';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ng-shops-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent  implements OnInit, OnDestroy {
  order!: Order | undefined | any;
  orderStatuses:any = [];
  selectedStatus: any;
  endsubs$: Subject<any> = new Subject();
  statusOrder:any=ORDER_STATUS;

  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }

  ngOnDestroy() {
    this.endsubs$.next(false);
    this.endsubs$.complete();
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(this.statusOrder).map((key) => {
      return {
        id: key,
        name: this.statusOrder[key]?.label
      };
    });
  }

  private _getOrder() {
    this.route.params.subscribe((params) => {
      if (params?.['id']) {
        this.orderService
          .getOrder(params?.['id'])
          .pipe(takeUntil(this.endsubs$))
          .subscribe((order) => {
            this.order = order;
            this.selectedStatus = order.status;
          });
      }
    });
  }

  onStatusChange(event:any) {
    this.orderService
      .updateOrder({ status: event.value }, this.order?.id)
      .pipe(takeUntil(this.endsubs$))
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order is updated!'
          });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Order is not updated!'
          });
        }
      );
  }
}
