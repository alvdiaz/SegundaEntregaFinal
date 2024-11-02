import { Routes } from '@angular/router';
import { ingresoGuard } from './guards/ingreso-guard.service';
import { inicioGuard } from './guards/inicio-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
 { 
  path: 'login',
  loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
  canActivate: [ingresoGuard]
},

{ 
  path: 'inicio',
  loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage),
  canActivate: [inicioGuard]
},

  {
    path: 'miclase',
    loadComponent: () => import('./pages/miclase/miclase.page').then( m => m.MiclasePage)
  },

  {
    path: 'theme',
    loadComponent: () => import('./pages/theme/theme.page').then( m => m.ThemePage)
  },
];
