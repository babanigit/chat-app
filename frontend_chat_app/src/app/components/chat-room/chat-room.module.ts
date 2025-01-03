import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoomComponent } from './chat-room.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: ChatRoomComponent }];

@NgModule({
  declarations: [ChatRoomComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  exports: [ChatRoomComponent],
})
export class ChatRoomModule {}
