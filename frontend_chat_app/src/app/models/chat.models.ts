// src/app/models/chat.models.ts
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  participants: User[];
  created_at: string;
}

export interface Message {
  id: number;
  room: number;
  user: number;
  user_username: string;
  content: string;
  created_at: string;
}
