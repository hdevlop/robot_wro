'use client'

import { Rajdhani } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { MqttProvider } from "await-mqtt/client";

const rajdhani = Rajdhani({
  weight: ["500", "600", "700"],

});

const mqttConfig = {
  url: process.env.NEXT_PUBLIC_MQTT_BROKER_URL,
  username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
  password: process.env.NEXT_PUBLIC_MQTT_PASSWORD
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${rajdhani.className}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MqttProvider options={mqttConfig}>

            {children}
          </MqttProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
