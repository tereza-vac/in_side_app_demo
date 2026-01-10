// app/(tabs)/_layout.tsx
import React, { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import { Keyboard } from "react-native";
import FloatingTabBar from "@/components/ui/FloatingTabBar";

export default function TabsLayout() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <Tabs
      tabBar={(props) => (
        <FloatingTabBar {...props} hidden={keyboardVisible} />
      )}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, 
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="stats" options={{ title: "Stats" }} />
      <Tabs.Screen name="chat" options={{ title: "AI Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
