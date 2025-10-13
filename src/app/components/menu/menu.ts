import { Component } from "@angular/core";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
    selector: 'menu',
    templateUrl: './menu.html',
    styleUrls: ['./menu.css'],
    imports: [MatFormField, MatLabel, MatInputModule]
})
export class Menu {

}