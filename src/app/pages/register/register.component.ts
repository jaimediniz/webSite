import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  // Angular stuff: Needs to be declared for every components
  selector: 'app-register', // How we are going to use this component inside HTML(<app-register></app-register>)
  templateUrl: './register.component.html', // Linking this .ts file with HTML file
  styleUrls: ['./register.component.scss'] // Linking this .ts file with CSS file
})
export class RegisterComponent implements OnInit {
  public basicRoute = '/register';
  public formName = 'registration'; // Lowercase
  public cards = [
    {
      route: 'participant', // Lowercase, no spaces
      title: 'Participant',
      content:
        'Students who are interested in learning a new language or a new culture. You take part in activities.'
    },
    {
      route: 'volunteer',
      title: 'Volunteer',
      content: `Volunteers are people who are helping in organizing, 
        planning and developing the Language Tandem programme itself. 
        You can propose new activities, plan meeting for other volunteers, 
        develop our website or support our social media….`
    }
    // {
    //   route: 'newElement',
    //   title: 'New',
    //   content: `Multiple
    //     Lines`
    // },
  ];
  // To add new cards just add new elements to "cards", like the example above.

  constructor() {}

  ngOnInit(): void {}
}
