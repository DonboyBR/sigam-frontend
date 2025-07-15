import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Importa a configuração da aplicação
import { AppComponent } from './app/app'; // Importa o AppComponent (sua classe principal)

bootstrapApplication(AppComponent, appConfig) // Inicia a aplicação com AppComponent e a configuração
  .catch((err) => console.error(err));
