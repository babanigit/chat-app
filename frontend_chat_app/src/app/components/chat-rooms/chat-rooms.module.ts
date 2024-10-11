import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoomsComponent } from './chat-rooms.component';



@NgModule({
  declarations: [
    ChatRoomsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ChatRoomsComponent
  ]
})
export class ChatRoomsModule { }
