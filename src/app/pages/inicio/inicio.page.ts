import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Persona } from 'src/app/model/persona';
import jsQR, { QRCode } from 'jsqr';
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
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
  standalone: true,
  imports: [
      CommonModule            // CGV-Permite usar directivas comunes de Angular
    , FormsModule             // CGV-Permite usar formularios
    , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule         // CGV-Permite usar pipe 'translate'
    , LanguageComponent // CGV-Lista de idiomas
  ]
})
export class InicioPage implements OnInit, AfterViewInit {

  @ViewChild('video')
  private video!: ElementRef;

  @ViewChild('canvas')
  private canvas!: ElementRef;

  @ViewChild('titulo', { read: ElementRef })
  itemTitulo!: ElementRef;
  
  @ViewChild('page', { read: ElementRef })
  page!: ElementRef;

  public usuario: Usuario = new Usuario();
  public persona: Persona = new Persona();
  public escaneando = false;
  public datosQR: string = '';

  public bloqueInicio: number = 0;
  public bloqueTermino: number = 0;
  public dia: string = '';
  public horaFin: string = '';
  public horaInicio: string = '';
  public idAsignatura: string = '';
  public nombreAsignatura: string = '';
  public nombreProfesor: string = '';
  public seccion: string = '';
  public sede: string = '';

  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController,
    private authService: AuthService
  ) {}

  public ngOnInit() {

  }

  public ngAfterViewInit() {
    this.animarTituloIzqDer();
    this.animarAparicionFondo();
    this.comenzarEscaneoQR(); // Iniciar escaneo automáticamente al cargar la página
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

  animarAparicionFondo() {
    this.animationController
      .create()
      .addElement(this.page.nativeElement)
      .iterations(1)
      .duration(1200)
      .fromTo('transform', 'scale(0.5)', 'scale(1)')
      .play();
  }

  public async comenzarEscaneoQR() {
    const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    this.escaneando = true;
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      if (qrCode.data !== '') {
        this.escaneando = false;
        this.mostrarDatosQROrdenados(qrCode.data);
        return true;
      }
    }
    return false;
  }

  public mostrarDatosQROrdenados(datosQR: string): void {
    const objetoDatosQR = JSON.parse(datosQR);
    this.bloqueInicio = objetoDatosQR.bloqueInicio;
    this.bloqueTermino = objetoDatosQR.bloqueTermino;
    this.dia = objetoDatosQR.dia;
    
    this.horaFin = objetoDatosQR.horaFin;
    this.horaInicio = objetoDatosQR.horaInicio;
    this.idAsignatura = objetoDatosQR.idAsignatura;
    this.nombreAsignatura = objetoDatosQR.nombreAsignatura;
    this.nombreProfesor = objetoDatosQR.nombreProfesor;
    this.seccion = objetoDatosQR.seccion;
    this.sede = objetoDatosQR.sede;
  
    // Navegar a MiclasePage pasando tanto el usuario como los datos del QR
    const navigationExtras: NavigationExtras = {
      state: {
        datosQR: {
          bloqueInicio: this.bloqueInicio,
          bloqueTermino: this.bloqueTermino,
          dia: this.dia,
          horaFin: this.horaFin,
          horaInicio: this.horaInicio,
          idAsignatura: this.idAsignatura,
          nombreAsignatura: this.nombreAsignatura,
          nombreProfesor: this.nombreProfesor,
          seccion: this.seccion,
          sede: this.sede,
        },
        usuario: this.usuario // Aquí se pasa el usuario también
      }
    };
  
    this.router.navigate(['/miclase'], navigationExtras);
  }
  

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

  public cerrarSesion(): void {
    // Navegamos a la página de login
    this.authService.logout();
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
  public InicioPage(): void {
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario // Pasar el objeto usuario
      }
    };
    this.router.navigate(['/inicio'], navigationExtras);
  }
}
