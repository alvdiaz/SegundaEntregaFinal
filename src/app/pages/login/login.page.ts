import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { colorWandOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule            // CGV-Permite usar directivas comunes de Angular
  , FormsModule             // CGV-Permite usar formularios
  , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
  , TranslateModule         // CGV-Permite usar pipe 'translate'
  , LanguageComponent // CGV-Lista de idiomas
]
})
export class LoginPage implements OnInit {

  public placeholderCorreo: string = '';  
  public placeholderPassword: string = '';  
  correo: string;
  password: string;


  constructor(private router: Router, private toastController: ToastController, private authService: AuthService) {
    this.correo = 'atorres';
    this.password = '1234';
  }

  ngOnInit(): void {
    // No es necesario actualizar los datos en localStorage aquí, ya que es parte del proceso de inicio de sesión
  }

  login() {
    this.authService.login(this.correo, this.password);
  }
  

  /**
   * Muestra un toast al usuario
   *
   * @param mensaje Mensaje a presentar al usuario
   * @param duracion Duración el toast, este es opcional
   */
  async mostrarMensaje(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion ? duracion : 2000
    });
    toast.present();
  }
}
