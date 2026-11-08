import { ImageResponse } from "next/og";
import SocialPreview from "./components/SocialPreview";

export const alt = "Akash D P - 3D Full-Stack Developer and Creative Developer";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialPreview />, size);
}
