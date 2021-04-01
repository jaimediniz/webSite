import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';

import { MaterialModule } from '../material.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

// Atoms
import { NavButtonComponent } from './components/atoms/nav-button/nav-button.component';
import { NavLinkComponent } from './components/atoms/nav-link/nav-link.component';

// Molecules
import { NavBrandComponent } from './components/atoms/nav-brand/nav-brand.component';
import { NavButtonsComponent } from './components/molecules/nav-bar/nav-buttons/nav-buttons.component';
import { NavLinksComponent } from './components/molecules/nav-bar/nav-links/nav-links.component';
import { NavBarComponent } from './components/organisms/nav-bar/nav-bar.component';
import { CardComponent } from './components/atoms/card/card.component';
import { CardIframeTemplateComponent } from './components/templates/card-iframe-template/card-iframe-template.component';
import { LoadingComponent } from './components/organisms/loading/loading.component';

@NgModule({
  declarations: [
    NavButtonComponent,
    NavLinkComponent,
    NavBrandComponent,
    NavButtonsComponent,
    NavLinksComponent,
    NavBarComponent,
    CardComponent,
    CardIframeTemplateComponent,
    LoadingComponent
  ],
  imports: [
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  exports: [NavBarComponent, CardIframeTemplateComponent, LoadingComponent],
  providers: [],
  bootstrap: []
})
export class SharedAppModule {}
