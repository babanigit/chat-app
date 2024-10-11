import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { demo1Modulehello } from './components/demo/demo1/demo1.module';
import { LoginModule } from './components/login/login.module';
import { ChatRoomsModule } from './components/chat-rooms/chat-rooms.module';
import { ChatModule } from './components/chat/chat.module';
import { ChatApiService } from './services/chat-api.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    demo1Modulehello,
    LoginModule,
    ChatRoomsModule,
    ChatModule
  ],
  providers: [ChatApiService,
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
