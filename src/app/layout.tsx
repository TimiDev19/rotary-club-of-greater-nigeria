import type { Metadata } from "next";
import "./styles.css";
export const metadata: Metadata = {
  title: "Rotary E-Club of Greater Nigeria",
  description: "Service, fellowship and community impact across Nigeria.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
