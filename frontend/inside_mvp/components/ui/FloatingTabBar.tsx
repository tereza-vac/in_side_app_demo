import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

export const FloatingTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // ikony podle názvu routy
          const iconMap: any = {
            index: "home",
            stats: "bar-chart",
            chat: "chatbubble-ellipses",
            profile: "person-circle",
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.item}
            >
              <Ionicons
                name={iconMap[route.name] || "ellipse"}
                size={26}
                color={isFocused ? "#4DA6FF" : "#ccc"}
              />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? "#4DA6FF" : "#ccc" },
                ]}
              >
                {descriptors[route.key].options.title || route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 10,
    marginTop: 3,
  },
});

export default FloatingTabBar;
