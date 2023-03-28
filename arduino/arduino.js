import johnnyFive from "johnny-five";
import { WebSocket } from "ws";

const ws = new WebSocket("ws://192.168.1.239:8080");

ws.on("error", console.error);

ws.on("message", function message(data) {
  const message = JSON.parse(data);

  if (message.type === "toggle-status") {
    active = message.value;
    if (active) {
      activityLed.on();
    } else {
      activityLed.off();
    }
  } else if (message.type === "toggle-helper") {
    helperLedActive = message.value;
    if (helperLedActive) {
      helperLed.on();
    } else {
      helperLed.off();
    }
  }
});

// Board
const { Board, Led, Button, Sensor } = johnnyFive;
const board = new Board({
  port: "COM6",
});

let active = false;
let helperLedActive = false;
let activityLed;
let helperLed;

board.on("ready", () => {
  activityLed = new Led(13);
  const activityButton = new Button({
    pin: 7,
    isPullup: true,
  });

  helperLed = new Led(12);
  const helperButton = new Button({
    pin: 2,
    isPullup: true,
  });

  const photoresistor = new Sensor({
    pin: "A2",
    freq: 500,
  });

  // Main activity
  activityButton.on("down", function () {
    active = !active;
    if (active) {
      activityLed.on();
    } else {
      activityLed.off();
    }

    const value = JSON.stringify({
      type: "status",
      timestamp: Date.now(),
      value: active,
    });
    ws.send(value);
  });

  // Helper
  helperButton.on("down", function () {
    helperLedActive = !helperLedActive;
    if (helperLedActive) {
      helperLed.on();
    } else {
      helperLed.off();
    }

    const value = JSON.stringify({
      type: "helper",
      timestamp: Date.now(),
      value: helperLedActive,
    });
    ws.send(value);
  });

  // Photoresistor
  photoresistor.on("data", function () {
    if (active) {
      const value = JSON.stringify({
        type: "photoresistor",
        timestamp: Date.now(),
        value: this.value,
      });
      ws.send(value);
    }
  });
});
