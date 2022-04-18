import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent} from './templates/login/login.component';
import { DashboardComponent } from './templates/dashboard/dashboard.component';
import { ModalComponent } from './modal/modal.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'  },
  { path: 'login', component:LoginComponent },
  { path: 'dashboard', component:DashboardComponent  },
  { path: 'modal', component:ModalComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ LoginComponent, DashboardComponent, ModalComponent ]
