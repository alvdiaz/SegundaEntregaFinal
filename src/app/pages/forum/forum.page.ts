import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { APIClientService } from 'src/app/services/apiclient.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonFabButton, IonFab, IonList, IonCardContent, IonHeader
  , IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle
  , IonCardSubtitle, IonItem, IonLabel, IonInput, IonTextarea
  , IonGrid, IonRow, IonCol, IonButton, IonIcon, IonContent
  , IonFabList } from '@ionic/angular/standalone';
import { pencilOutline, trashOutline, add } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from 'src/app/model/post';
import { showToast } from 'src/app/tools/message-functions';
import { addIcons } from 'ionicons';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/model/usuario';
import { NavigationExtras, Route, Router } from '@angular/router';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
  standalone: true,
  imports: [      CommonModule            // CGV-Permite usar directivas comunes de Angular
    , FormsModule             // CGV-Permite usar formularios
    , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
  ]
})
export class ForumPage implements OnInit, OnDestroy {

  post: Post = new Post();
  posts: Post[] = [];
  selectedPostText = '';
  intervalId: any = null;
  usuario = new Usuario();
  private postsSubscription!: Subscription;
  private userSubscription!: Subscription;
  constructor(private api: APIClientService, private auth: AuthService,   private router: Router
  ) {
    addIcons({ pencilOutline, trashOutline, add });
  }

  ngOnInit() {
    this.postsSubscription = this.api.postList.subscribe((posts) => {
      this.posts = posts;
    });
    this.userSubscription = this.auth.usuarioAutenticado.subscribe((user) => {
      this.usuario = user? user : new Usuario();
    });
    this.api.refreshPostList(); // Actualiza lista de posts al iniciar
  }

  ngOnDestroy() {
    if (this.postsSubscription) this.postsSubscription.unsubscribe();
  }

  cleanPost() {
    this.post = new Post();
    this.selectedPostText = 'Nueva publicación';
  }

  savePost() {
    if (!this.post.title.trim()) {
      showToast('Por favor, completa el título.');
      return;
    }
    if (!this.post.body.trim()) {
      showToast('Por favor, completa el cuerpo.');
      return;
    }

    if (this.post.id) {
      this.updatePost();
    } else {
      this.createPost();
    }
  }

  private async createPost() {
    this.post.author = this.usuario.nombre + ' ' + this.usuario.apellido;
    const createdPost = await this.api.createPost(this.post);
    if (createdPost) {
      showToast(`Publicación creada correctamente: ${createdPost.title}`);
      this.cleanPost();
    }
  }

  private async updatePost() {
    this.post.author = this.usuario.nombre + ' ' + this.usuario.apellido;
    const updatedPost = await this.api.updatePost(this.post);
    if (updatedPost) {
      showToast(`Publicación actualizada correctamente: ${updatedPost.title}`);
      this.cleanPost();
    }
  }

  editPost(post: Post) {
    this.post = { ...post }; // Crea una copia para editar sin afectar la lista
    this.selectedPostText = `Editando publicación #${post.id}`;
    document.getElementById('topOfPage')!.scrollIntoView({ behavior: 'smooth' });
  }

  async deletePost(post: Post) {
    const success = await this.api.deletePost(post.id);
    if (success) {
      showToast(`Publicación eliminada correctamente: ${post.id}`);
      this.cleanPost();
    }
  }

  getPostId(index: number, post: Post) {
    return post.id;
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

