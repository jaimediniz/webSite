import { Component, OnInit } from '@angular/core';
import { APIService } from '@app/shared/services/backend.service';
import { Registration } from '@interfaces/database';

@Component({
  // Angular stuff: Needs to be declared for every components
  selector: 'app-register', // How we are going to use this component inside HTML(<app-register></app-register>)
  templateUrl: './register.component.html', // Linking this .ts file with HTML file
  styleUrls: ['./register.component.scss'] // Linking this .ts file with CSS file
})
export class RegisterComponent implements OnInit {
  public basicRoute = '/register';
  public formName = 'registration'; // Lowercase
  public cards: Registration[];

  constructor(private api: APIService) {
    this.getCards();
  }

  ngOnInit(): void {}

  async getCards(): Promise<void> {
    const result = await this.api.getUI('Registration');
    console.log(result);
    this.cards = result;
  }
}
