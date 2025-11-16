import { px } from "@zos/utils";
import { getDeviceInfo } from "@zos/device";
import {
  createWidget,
  widget,
  align,
  prop,
  text_style,
  event,
  keyboard,
} from "@zos/ui";

const { width: device_width, height: device_height } = getDeviceInfo();
const { h } = keyboard.getContentRect();

export const styles = {
  container: {
    layout: {
      display: "flex",
      flex_flow: "column wrap",
      justify_content: "start",
      align_items: "center",
      align_content: "center",
      top: h + "",
      width: "100vw",
      height: "100vh",
    },
  },
  candidateBar: {
    layout: {
      display: "flex",
      justify_content: "flex-end",
      flex_flow: "row",
      column_gap: "5",
      width: "100%",
      height: "10vh",
      padding_right: "36",
      
    },
  },
  candidateButton: {
    radius: 10,
    normal_color: 0xfc6950,
    press_color: 0xfeb4a8,
    layout: {
      width: "50",
      height: "100%",
      font_size: "40",
    },
  },
  keyboard: {
    layout: {
      display: "flex",
      flex_flow: "column",
      gap: "12",
      width: "100%",
      flex_grow: "1",
    },
  },
  keyboardRow: {
    layout: {
      display: "flex",
      flex_flow: "row wrap",
      justify_content: "center",
      align_items: "center",
      align_content: "center",
      width: "100%",
      height: "12vh",
      column_gap: "2",
    },
  },
  keyButton: {
    radius: 10,
    normal_color: 0x000000,
    press_color: 0x333333,
    layout: {
      height: "100%",
      width: "9.5%",
      font_size: "40",
    },
  },
  toggleLang: {
    text: "Сменить язык",
    normal_color: 0x000000,
    press_color: 0x333333,
    radius: 10,
    layout: {
      width: "25%",
      height: "100%",
      font_size: "40",
      min_width: "50",
    },
  },
  t9Bar: {
    layout: {
      display: "flex",
      justify_content: "center",
      align_items: "center",
      flex_flow: "row",
      column_gap: "5",
      width: "100%",
      height: "6vh",
    },
  },
  t9Button: {
    radius: 8,
    normal_color: 0x2a2a2a,
    press_color: 0x4a4a4a,
    layout: {
      width: "auto",
      height: "100%",
      font_size: "32",
      padding_left: "10",
      padding_right: "10",
      min_width: "40",
    },
  },
};
