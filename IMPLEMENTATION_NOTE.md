# Implementation Note

## How I Built the Real-Time Messaging

I used Socket.io for real-time communication, which sits on top of WebSockets and handles reconnection and fallbacks automatically. The key difference from regular HTTP is that the connection stays open the whole session. Instead of the client polling "any new messages?", the server pushes them out the moment they arrive.

When someone sends a message, the client emits a `send_message` event over the open socket. The server receives it, saves it to MongoDB, then broadcasts a `receive_message` event to everyone in the room using `io.to(room).emit()`. Socket.io's room abstraction made targeting specific users straightforward — join a room on connect, leave on disconnect, and broadcasts go only to the right people. The whole round trip takes under 50ms on a local network.

For message history, I used a plain REST endpoint that fetches the last 50 messages when you first join. Everything after that comes through the WebSocket. I kept them separate on purpose — HTTP is simpler for bulk reads and there's no reason to overload the socket connection with it.

The online user list lives in memory on the server as a Map keyed by socket ID. Socket.io fires a `disconnect` event automatically when someone closes their tab or loses connection, so cleanup is handled without any extra logic.

## Challenges I Ran Into

**Duplicate messages on reconnect.** After a brief network drop, Socket.io reconnects and the client re-fetches history — but some live events were already in the queue, so the same message appeared twice. Fixed it by checking the `_id` before appending to state.

**Typing indicator spam.** My first version emitted a `typing` event on every single keystroke. I added a debounce — emit once when typing starts, then wait 1.5 seconds of silence before emitting `stop_typing`. Much cleaner on the network.

**React StrictMode double-mounting.** React 18 in development intentionally mounts components twice. This was opening two Socket.io connections simultaneously. Moving the socket into a `useRef` fixed it — the ref persists across remounts so only one connection gets created.

**CORS on the WebSocket handshake.** Socket.io upgrades from HTTP to WebSocket, which means the initial handshake goes through CORS. I had to configure the origin in both Express's CORS middleware and Socket.io's own CORS option. Setting only one caused silent failures in Chrome with no useful error message.