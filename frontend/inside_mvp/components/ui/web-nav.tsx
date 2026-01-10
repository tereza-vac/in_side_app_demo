import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Link, usePathname } from "expo-router";

export default function WebNav() {
  if (Platform.OS !== "web") return null;

  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/(tabs)" },
    { label: "Chat", href: "/(tabs)/chat" },
    { label: "Statistiky", href: "/(tabs)/stats" },
    { label: "Profil", href: "/(tabs)/profile" }
  ];

  return (
    <View style={styles.nav}>
      <View style={styles.inner}>
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link href={item.href} key={item.href} asChild>
              <Pressable
                style={{
                  ...styles.item,
                  ...(active ? styles.activeItem : {})
                }}
              >
                <Text
                  style={{
                    ...styles.text,
                    ...(active ? styles.activeText : {})
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: "100%",
    backgroundColor: "#0D1117",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    position: "sticky",
    top: 0,
    zIndex: 50
  },
  inner: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    columnGap: 35,
    justifyContent: "flex-start"
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  text: {
    fontSize: 15,
    color: "#ccc",
    fontWeight: "500"
  },
  activeItem: {
    backgroundColor: "#1F6FEB"
  },
  activeText: {
    color: "#fff"
  }
});
