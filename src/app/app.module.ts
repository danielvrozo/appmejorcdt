import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { LevelsComponent } from './templates/levels/levels.component';
import { UpdateComponent } from './crud/update/update.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from './modal/modal.component';

import { LayoutModule } from '@angular/cdk/layout';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgOtpInputModule } from  'ng-otp-input';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    LevelsComponent,
    UpdateComponent,
    ModalComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    HttpClientModule,
    LayoutModule,
    NgxIntlTelInputModule,
    NgOtpInputModule,
    NgChartsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
