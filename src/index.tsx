import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

import Echo from 'laravel-echo';

// @ts-ignore
// window.Pusher = require('pusher-js');
//
// // @ts-ignore
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: '80e06980f526e21fc058',
//     cluster: 'ad996698bd4ed48f496c',
//     forceTLS: true,
//     // host: 'http://127.0.0.1:6001',
//     // broadcaster: 'socket.io',
//     // client: socketio,
//     transports: ['websocket', 'polling', 'flashsocket']
// });
//
// //echo.connect();
// // @ts-ignore
// window.Echo.channel('example')
//     .listen('my-event', () => {
//     console.log("Heard an event");
// });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
