import { Stack } from "expo-router";
import { Platform } from "react-native";
import WebNav from "@/components/ui/web-nav";   // ← WEB MENU

export default function RootLayout() {
  return (
    <>
      {/* Only show WebNav on web */}
      {Platform.OS === "web" && <WebNav />}

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
