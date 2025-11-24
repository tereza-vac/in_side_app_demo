// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import FloatingTabBar from "@/components/ui/FloatingTabBar";


export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // vypneme defaultní bar
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "AI Chat",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
        }}
      />
    </Tabs>
  );
}
