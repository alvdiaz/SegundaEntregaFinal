import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';  
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { ToastController } from '@ionic/angular';
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
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [
    CommonModule            // CGV-Permite usar directivas comunes de Angular
  , FormsModule             // CGV-Permite usar formularios
  , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
  , TranslateModule         // CGV-Permite usar pipe 'translate'
  , LanguageComponent // CGV-Lista de idiomas
]
})
export class CorreoPage implements OnInit, AfterViewInit {

  @ViewChild('page', { read: ElementRef }) page!: ElementRef;


  // Variable que almacenará el correo ingresado
  correoIngresado: string = '';
  // Usuario actual que se utilizará en la siguiente página
  usuarioActual: Usuario | null = null;

  constructor(private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController
  ) {
    
   }

  ngOnInit() {}

  // Función para validar si el correo ingresado pertenece a un usuario
  validarCorreo() {
    const usuarioService = new Usuario();
  
    // Buscar si existe el usuario con el correo ingresado
    const usuarioEncontrado = listaUsuarios.find(usuario => usuario.correo === this.correoIngresado);
  
    if (usuarioEncontrado) {
      // Si el correo es válido, almacenar el usuario actual
      this.usuarioActual = usuarioEncontrado;
      // Redirigir a la página de pregunta secreta con el estado (usuario actual)
      this.router.navigate(['/pregunta'], { state: { usuario: this.usuarioActual } });
    } else {
      // Si el correo no es válido, redirigir a la página de error
      this.router.navigate(['/incorrecto']);
    }
  }

  public ngAfterViewInit() {
    // this.animarDeslizarVertical()
  }

  // animarDeslizarVertical() {
  //   this.animationController
  //     .create()
  //     .addElement(this.page.nativeElement)
  //     .duration(800)
  //     .fromTo('transform', 'translateY(-100%)', 'translateY(0%)')
  //     .play();
  // }
}
