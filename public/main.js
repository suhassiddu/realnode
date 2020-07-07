const socket = io();

const inboxPeople = document.querySelector(".inbox__people");
const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");
const fallback = document.querySelector(".fallback");

let userName = "";

const NEW_USER = 'new user'
const DISCONNECT = 'user disconnected'
const MESSAGE = 'chat message'
const TYPING = 'typing'
const EMIT_NEW_USER = 'new user'
const EMIT_MESSAGE = 'chat message'
const EMIT_TYPING = 'typing'

const newUserConnected = (user) => {
  userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  socket.emit(EMIT_NEW_USER, userName);
  addToUsersBox(userName);
};

const addToUsersBox = (userName) => {
  if (!!document.querySelector(`.${userName}-userlist`)) {
    return;
  }

  const userBox = `
    <div class="chat_ib ${userName}-userlist card"><div class="card-body">
      <h5>${userName}</h5>
    </div></div>
  `;
  inboxPeople.innerHTML += userBox;
};

const addNewMessage = ({ user, message }) => {
  const latitude = message.latitude
  const longitude = message.longitude
  const distance = message.distance || 0
  const isstill = distance < 0.001

  const time = new Date();
  const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

  const receivedMsg = `
  <div class="incoming__message card"><div class="card-body">
    <div class="received__message">
      <p>user: ${user}</p>
      <p>time: ${formattedTime}</p>
      <p>latitude: ${latitude}</p>
      <p>longitude: ${longitude}</p>
      <p>distance: ${isstill ? '<span class="badge badge-danger">still</span>' : distance}</p>
    </div>
  </div></div>`;

  const myMsg = `
  <div class="outgoing__message card">
    <div class="sent__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

  // messageBox.innerHTML = user === userName ? myMsg : receivedMsg;
  messageBox.innerHTML = receivedMsg;
};

// new user is created so we generate nickname and emit event
newUserConnected();


setInterval(function () {
  console.log("Hello");
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log("Latitude is :", position.coords.latitude);
    console.log("Longitude is :", position.coords.longitude);
    socket.emit(EMIT_MESSAGE, {
      message: { latitude: position.coords.latitude, longitude: position.coords.longitude },
      nick: userName,
    });
  }, function (error) {
    console.error("Error Code = " + error.code + " - " + error.message);
  });
}, 3000);

socket.on(NEW_USER, function (data) {
  data.map((user) => addToUsersBox(user));
});

socket.on(DISCONNECT, function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();
});

socket.on(MESSAGE, function (data) {
  addNewMessage({ user: data.nick, message: data.message });
});
