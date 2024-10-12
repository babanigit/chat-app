import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoomsComponent } from './chat-rooms.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ChatRoomsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule  // Add RouterModule to imports
  ],
  exports: [
    ChatRoomsComponent
  ]
})
export class ChatRoomsModule { }
