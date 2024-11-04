import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, IonicSafeString, AnimationController, ToastController} from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { AuthService } from 'src/app/services/auth.service';
import { DataBaseService } from 'src/app/services/data-base.service';




@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.page.html',
  styleUrls: ['./misdatos.page.scss'],
  standalone: true,
  imports: [
      CommonModule            // CGV-Permite usar directivas comunes de Angular
    , FormsModule             // CGV-Permite usar formularios
    , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule         // CGV-Permite usar pipe 'translate'
    , LanguageComponent // CGV-Lista de idiomas
  ]
})
export class MisdatosPage implements OnInit, AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('page', { read: ElementRef }) page!: ElementRef;



  public usuario: Usuario = new Usuario();
  public nivelesEducacionales: NivelEducacional[] = []; // Lista de niveles educacionales
  public fechaNacimientoInput: string = ''; // Fecha en formato para ion-datetime

  
  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController,
    private toastController: ToastController,
    private auth :AuthService,
    private db: DataBaseService


  ) {
    this.auth.usuarioAutenticado.subscribe((usuario) => {
      console.log(usuario);
      if (usuario) {
        this.usuario = usuario;
      }
    });
  }

  ngOnInit() {
    this.nivelesEducacionales = NivelEducacional.getNivelesEducacionales();

    // Convertir fechaNacimiento a formato 'yyyy-MM-dd' si tiene un valor inicial
    if (this.usuario.fechaNacimiento) {
      this.fechaNacimientoInput = this.formatDateForInput(this.usuario.fechaNacimiento);
    }
  }

  private formatDateForInput(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // formato "YYYY-MM-DD" requerido por ion-datetime
  }

  // Actualizar fechaNacimiento cuando se seleccione una nueva fecha en ion-datetime
  onFechaNacimientoChange(event: any) {
    const selectedDate = event.detail.value; // Fecha seleccionada en formato "YYYY-MM-DD"
    const [year, month, day] = selectedDate.split('-').map(Number);
    this.usuario.fechaNacimiento = new Date(year, month - 1, day); // Convertir a Date
  }
  
  
  
  
  

  public ngAfterViewInit() {
    this.animarTituloIzqDer();
    this.animarVueltaDePagina();

  }

  animarTituloIzqDer() {
    this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(6000)
      .fromTo('transform', 'translate(10%)', 'translate(100%)')
      .fromTo('opacity',1, 1,)
      .play();
  }


  animarVueltaDePagina() {
    // this.animationController
    //   .create()
    //   .addElement(this.page.nativeElement)
    //   .iterations(1)
    //   .duration(1000)
    //   .fromTo('transform', 'rotateY(deg)', 'rotateY(-180)')
    //   .duration(1000)
    //   .fromTo('transform', 'rotateY(-180deg)', 'rotateY(0deg)')
    //   .play();
  }


  

  // Función 1: Actualizar datos del usuario en la lista de usuarios válidos


  public cerrarSesion(): void {
    // Navegamos a la página de login
    this.auth.logout();
    }

  public MisdatosPage(): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario // Pasar el objeto usuario
      }
    };
    this.router.navigate(['/misdatos'], navigationExtras);
  }
  

  public MiclasePage(): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario // Pasar el objeto usuario
      }
    };
    this.router.navigate(['/miclase'], navigationExtras);
  }

  public InicioPage (): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario // Pasar el objeto usuario
      }
    };
    this.router.navigate(['/inicio'], navigationExtras);
  }

  public limpiarFormulario(): void {
    for (const [key, value] of Object.entries(this.usuario)) {
      Object.defineProperty(this.usuario, key, { value: '' });
    }
  }

  asignado(texto: string) {
    if (texto.trim() !== '') {
      return texto;
    }
    return 'No asignado';
  }


  mostrarDatosPersona() {
    // Si el usuario no ingresa la cuenta, se mostrará un error
    if (this.usuario.correo.trim() === '') {
      this.mostrarMensajeAlerta('El correo es un campo obligatorio.');
      return;
    }

    // Si el usuario no ingresa al menos el nombre o el apellido, se mostrará un error
 

    // Mostrar un mensaje emergente con los datos de la persona
    let mensaje = `

  
  Cuenta:   ${this.usuario.cuenta}
  Nombre:   ${this.asignado(this.usuario.nombre)}
  Apellido:   ${this.asignado(this.usuario.apellido)}
  Correo:   ${this.asignado(this.usuario.correo)} 
  Pregunta Secreta:   ${this.usuario.preguntaSecreta}
  Respuesta Secreta:${this.usuario.respuestaSecreta}  

  Contraseña Nueva:   ${this.usuario.password}
  Contraseña Nueva:   ${this.usuario.password}

 
    `;
    this.mostrarMensajeAlerta(mensaje);
  }



  async mostrarMensajeAlerta(mensaje: string,) {
    const alert = await this.alertController.create({
      header: 'Datos personales',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  // Función para limpiar los datos
  limpiar() {
    this.usuario.cuenta='';
    this.usuario.nombre='';
    this.usuario.apellido='';
    this.usuario.correo='';
    this.usuario.preguntaSecreta='';
    this.usuario.respuestaSecreta='';
    this.usuario.password='';


  }




  async actualizarDatos() {
    try {
      // Update the user in the database using guardarUsuario method from DataBaseService
      await this.db.guardarUsuario(this.usuario);
  
      // Show success message
      await this.mostrarMensajeExito();
    } catch (error) {
      console.error('Error updating user data:', error);
      // Show an error message
      await this.mostrarMensajeError('Hubo un problema al actualizar tus datos. Por favor, intenta nuevamente.');
    }
  }
  
  async mostrarMensajeError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  



  async mostrarMensajeExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Tus datos han sido actualizados correctamente.',
      buttons: ['OK']
    });

    await alert.present();
  }
  


}
