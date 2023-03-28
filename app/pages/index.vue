<script setup lang="ts">
import { Message } from "~~/types/Message";

const socket = new WebSocket("ws://192.168.1.239:8080");

// Listen for messages
socket.addEventListener("message", (event) => {
  const message: Message = JSON.parse(event.data);

  if (message.type === "photoresistor") {
    chartSeries.value[0].data.push([message.timestamp, message.value]);
  } else if (message.type === "status") {
    active.value = message.value as boolean;
    lastActive.value = message.timestamp;
  } else if (message.type === "helper") {
    helperLedActive.value = message.value as boolean;
  }
});

const active = ref(false);
const helperLedActive = ref(false);
const lastActive = ref();

const toggleActiveStatus = () => {
  active.value = !active.value;

  const message = JSON.stringify({
    type: "toggle-status",
    timestamp: Date.now(),
    value: active.value,
  });

  socket.send(message);
};

const toggleHelperLed = () => {
  helperLedActive.value = !helperLedActive.value;

  const message = JSON.stringify({
    type: "toggle-helper",
    timestamp: Date.now(),
    value: helperLedActive.value,
  });

  socket.send(message);
};

const chartOptions = ref({
  chart: {
    type: "line",
    animations: {
      enabled: true,
      easing: "linear",
      dynamicAnimation: {
        speed: 1000,
      },
    },
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
  },
  noData: {
    text: "No data. Active Arduino to get data.",
    align: "center",
    verticalAlign: "middle",
  },
});

const chartSeries = ref([
  {
    name: "Photoresistor",
    data: [] as unknown[],
  },
]);
</script>

<template>
  <div class="flex flex-col gap-10 h-screen w-screen bg-gray-100 p-8 px-40">
    <div>
      <h1 class="text-2xl font-semibold">Photoresistor realtime measurement</h1>
    </div>
    <div class="flex gap-10 bg-white shadow-md w-full h-2/3 p-6">
      <div class="w-1/2 h-1/2">
        <apexchart
          height="500"
          type="line"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
      </div>
      <div class="flex flex-col w-1/2 h-full items-end justify-between">
        <div class="flex flex-col items-end">
          <p class="text-lg font-medium">Arduino Photoresistor</p>
          <div class="flex gap-2 items-center">
            <span
              class="flex w-3 h-3 rounded-full"
              :class="{ 'bg-green-500': active, 'bg-red-500': !active }"
            ></span>
            <span>{{ active ? "Active" : "Inactive" }}</span>
          </div>
          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
            @click="toggleActiveStatus"
          >
            {{ active ? "Turn off" : "Turn on" }}
          </button>
          <button
            type="button"
            class="focus:outline-none text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-400 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
            @click="toggleHelperLed"
          >
            {{ helperLedActive ? "Turn off helper LED" : "Turn on helper LED" }}
          </button>
        </div>
        <span class="text-gray-600 text-sm" v-if="lastActive"
          >Last status change:
          {{ useDateFormat(lastActive, "DD.MM.YYYY HH:MM:ss").value }}</span
        >
      </div>
    </div>
  </div>
</template>
