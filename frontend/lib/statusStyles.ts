import type { InferenceStatus } from "./types";

export interface StatusStyle {
  headerBg: string;
  cardBg: string;
  border: string;
  text: string;
  tagBg: string;
  tagText: string;
  icon: string;
  iconColor: string;
  label: string;
  gaugeColor: string;
}

export const STATUS_STYLES: Record<InferenceStatus, StatusStyle> = {
  WASPADAI: {
    headerBg: "#690005",
    cardBg: "#3D0D0A",
    border: "#C8352A",
    text: "#FFDAD6",
    tagBg: "#93000A",
    tagText: "#FFDAD6",
    icon: "✕",
    iconColor: "#C8352A",
    label: "WASPADAI",
    gaugeColor: "#C8352A",
  },
  TERVERIFIKASI: {
    headerBg: "#003256",
    cardBg: "#003256",
    border: "#015184",
    text: "#AAD4FF",
    tagBg: "#015184",
    tagText: "#AAD4FF",
    icon: "✓",
    iconColor: "#9BCBFF",
    label: "TERVERIFIKASI",
    gaugeColor: "#015184",
  },
  KONTEKS_BERBEDA: {
    headerBg: "#432C00",
    cardBg: "#432C00",
    border: "#5F3F00",
    text: "#FFC66B",
    tagBg: "#5F3F00",
    tagText: "#FFC66B",
    icon: "⚡",
    iconColor: "#FFC66B",
    label: "KONTEKS BERBEDA",
    gaugeColor: "#FFC66B",
  },
  NETRAL: {
    headerBg: "#2F2921",
    cardBg: "#3A342B",
    border: "#504535",
    text: "#9D8E7C",
    tagBg: "#2F2921",
    tagText: "#9D8E7C",
    icon: "?",
    iconColor: "#9D8E7C",
    label: "NETRAL",
    gaugeColor: "#504535",
  },
};
