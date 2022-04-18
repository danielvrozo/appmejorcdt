import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}

var idHTML:any = document.getElementById("app-mejorcdt");
if(localStorage.getItem('vista') == "dashboard"){
  idHTML.style.height = "auto";
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));



