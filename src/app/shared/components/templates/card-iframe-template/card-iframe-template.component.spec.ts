import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardIframeTemplateComponent } from './card-iframe-template.component';

describe('CardIframeTemplateComponent', () => {
  let component: CardIframeTemplateComponent;
  let fixture: ComponentFixture<CardIframeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardIframeTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardIframeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
