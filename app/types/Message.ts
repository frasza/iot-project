export type Message = {
  type: "photoresistor" | "status" | "helper";
  timestamp: number;
  value: number | string | boolean;
};
