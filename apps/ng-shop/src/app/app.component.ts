import { Component,OnInit } from '@angular/core';
import { UsersService } from '@ng-shops/users';

@Component({
  selector: 'ng-shops-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
 constructor(private usersService:UsersService){}

 ngOnInit(){
  this.usersService.initAppSession();
 }
}
