import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService, Category } from '@ng-shops/products';
import {MessageService} from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common'

@Component({
  selector: 'ng-shops-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit{

  categoryForm!:FormGroup;
  editMode=false;
  currentCategoryId!:string;

  constructor(
    private fb:FormBuilder,
    private categoryService:CategoriesService,
    private router:Router,
    private messageService: MessageService,
    private ngZone: NgZone,
    private location:Location,
    private route:ActivatedRoute
    ){

  }

  ngOnInit(): void {
      this.categoryForm = this.fb.group({
        name:['',Validators.required],
        icon:['',Validators.required],
        color:['#fff']
      });
      this.checkEditMode();
  }

  onSubmitCategoryForm(){
    if(this.categoryForm.invalid){
      this.categoryForm.markAllAsTouched();
      return;
    }
    const { name,icon,color} =this.categoryForm.value;
    const categoryPayload:Category={
      id:this.currentCategoryId,
      name,
      icon,
      color
    }
    if(this.editMode){
      this.editCategory(categoryPayload);
    }else{
      this.addCategory(categoryPayload);
    }
  }

  private addCategory(catagory:Category){
    this.categoryService.createCategory(catagory).subscribe((data)=>{
      this.ngZone.run(()=>{
        this.messageService.add({severity:'success', summary:'Success', detail:`Category ${data.name} is Created`});
      })
      timer(2000).toPromise().then(()=>{
        this.router.navigateByUrl('/categories');
      })
    },
    () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Category is not Created!'
      });
    });
  }

  private editCategory(catagory:Category){
    this.categoryService.updateCategory(catagory).subscribe(()=>{
      this.ngZone.run(()=>{
        this.messageService.add({severity:'success', summary:'Success', detail:'Category is Updated'});
      })
      timer(2000).toPromise().then(()=>{
        this.router.navigateByUrl('/categories');
      })
    },
    () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Category is not Updated!'
      });
    });
  }

  onCancel(){
    this.location.back();
  }

  private checkEditMode(){
    this.route.params.subscribe(params=>{
      if(params?.['id']){
        this.editMode = true;
        this.currentCategoryId = params?.['id'];
        this.categoryService.getCategory(this.currentCategoryId).subscribe((catagory:Category)=>{
          this.categoryForm.patchValue({
            name:catagory.name,
            icon:catagory.icon,
            color:catagory.color
          })
        })
      }
    })
  }

  get name(){
    return this.categoryForm.get('name');
  }

  get icon(){
    return this.categoryForm.get('icon');
  }
}
