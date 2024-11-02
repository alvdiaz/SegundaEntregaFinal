import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';  // Asegúrate de que esta importación es correcta
import { AlertController, AnimationController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage implements OnInit, AfterViewInit {

  @ViewChild('page', { read: ElementRef }) page!: ElementRef;

  // Usuario actual que viene desde la página anterior
  usuarioActual: Usuario | null = null;
  // Respuesta ingresada por el usuario
  respuestaIngresada: string = '';

  constructor(private router: Router,
     private navCtrl: NavController,
    private animationController: AnimationController,
    private alertController: AlertController) { }

  ngOnInit() {
    // Aquí recuperamos el usuario actual desde la navegación anterior
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuarioActual = navigation.extras.state['usuario'];
    }
  }

  // Función para validar la respuesta secreta
  validarRespuesta() {
    if (this.usuarioActual && this.respuestaIngresada.trim().toLowerCase() === this.usuarioActual.respuestaSecreta.toLowerCase()) {
      // Si la respuesta es correcta, redirigir a la página de éxito y pasar el usuarioActual en el state
      this.router.navigate(['/correcto'], { state: { usuario: this.usuarioActual } });
    } else {
      // Si la respuesta es incorrecta, redirigir a la página de error
      this.router.navigate(['/incorrecto']);
    }
  
    }

    ngAfterViewInit() {
      // this.animarDeslizarVertical()
  }

  // animarDeslizarVertical() {
  //   this.animationController
  //     .create()
  //     .addElement(this.page.nativeElement)
  //     .duration(800)
  //     .fromTo('transform', 'translateY(100%)', 'translateY(0%)')
  //     .play();
  // }
    
  }


