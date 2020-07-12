import { NgModule }                 from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';

import { UserServiceRouter }        from './management/user/user.service.router';

const routes: Routes = [
  { path: 'home',        
    loadChildren: () => import('./general/home/home.module').then(m => m.HomeModule), 
    canActivate: [UserServiceRouter] 
  },
  { path: 'users',                          
    loadChildren: () => import('./management/user/user.module').then(m => m.UserModule),    
    canActivate: [UserServiceRouter] 
  },
  { path: '**',redirectTo: '/',pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
