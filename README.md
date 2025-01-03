## chat-app

# Django test on Postman

Here's how to test the chat functionality in Postman:

Login/Get Token

```
CopyPOST http://localhost:8000/api/users/login/
Body (raw JSON):
{
    "username": "user1",
    "password": "yourpassword"
}
```

For all subsequent requests, add the token to Headers:

CopyAuthorization: Token your_token_here

View Available Rooms

```
CopyGET http://localhost:8000/api/chatrooms/available_rooms/
```

Join a Room

```
CopyPOST http://localhost:8000/api/chatrooms/{room_id}/join_room/
```

Send Message

```
CopyPOST http://localhost:8000/api/messages/
Body (raw JSON):
{
    "room": room_id,
    "content": "Hello from user2!"
}
```

View Room Messages

```
CopyGET http://localhost:8000/api/messages/?room={room_id}
```

Leave Room

```
CopyPOST http://localhost:8000/api/chatrooms/{room_id}/leave_room/
```