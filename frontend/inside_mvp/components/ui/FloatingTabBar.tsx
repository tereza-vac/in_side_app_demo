import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FloatingProps extends BottomTabBarProps {
  hidden?: boolean; // 🔥 nový prop
}

export const FloatingTabBar: React.FC<FloatingProps> = ({
  state,
  descriptors,
  navigation,
  hidden,
}) => {
  const insets = useSafeAreaInsets();

  const opacity = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  // animace hide/show
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: hidden ? 0 : 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: hidden ? 50 : 0, // posun mimo obraz při psaní
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [hidden]);

  if (Platform.OS === "web") return null;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom + 6,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
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

          const iconMap: Record<string, string> = {
            index: "home",
            stats: "bar-chart",
            chat: "chatbubble-ellipses",
            profile: "person-circle",
          };

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.item}>
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 20,
  },
  bar: {
    flexDirection: "row",
    backgroundColor: "#111",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
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
