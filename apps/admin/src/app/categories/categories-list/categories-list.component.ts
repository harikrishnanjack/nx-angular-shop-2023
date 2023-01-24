/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@ng-shops/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'ng-shops-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit {
  categories:Category[]=[];
  constructor(
    private categoryService:CategoriesService,
    private router:Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ){}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(){
    this.getCategories();
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this category?',
      header: 'Delete category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.deleteCategory(categoryId).subscribe(()=>{
          this.getCategories();
          this.messageService.add({severity:'success', summary:'Success', detail:'Category is Deleted'});
        }, () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Category is not deleted!'
          });
        })
      },
  });

  }

  updateCategory(categoryid: string) {
    this.router.navigateByUrl(`categories/form/${categoryid}`);
  }

  private getCategories(){
    this.categoryService.getCategories().subscribe((data:Category[])=>{
      this.categories = data;
      // console.log(this.categories);
    })
  }
}
