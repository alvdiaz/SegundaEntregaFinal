import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
})
export class IncorrectoPage implements OnInit, AfterViewInit {

  @ViewChild('page', { read: ElementRef }) page!: ElementRef;


  constructor(
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController
  ) { 

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.animarExpansion();
    
  }

  // animarExpansion() {
  //   this.animationController
  //     .create()
  //     .addElement(this.page.nativeElement)
  //     .duration(1200)
  //     .fromTo('transform', 'scaleX(0)', 'scaleX(1)')
  //     .play();
  // }

}
