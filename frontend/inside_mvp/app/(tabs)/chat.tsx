import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { API_URL } from "@constants/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* -------------------------
   MODEL OPTIONS
------------------------- */
export const MODEL_OPTIONS = [
  { label: "LLaMA 3.3 – 70B (Versatile)", value: "llama-3.3-70b-versatile" },
  { label: "LLaMA 3.1 – 8B (Instant)", value: "llama-3.1-8b-instant" },
  { label: "LLaMA 3.1 – 70B (Instant)", value: "llama-3.1-70b-instant" },
  { label: "Mixtral 8x7B", value: "mixtral-8x7b-instruct" },
  { label: "GPT-4o mini", value: "gpt-4o-mini" },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ahoj! Jsem tvůj AI parťák. Jak ti mohu dnes pomoct? 😊",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    MODEL_OPTIONS[0].value
  );

  const scrollRef = useRef(null);

  /* -------------------------
      KEYBOARD FIX
  ------------------------- */
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  /* -------------------------
        SEND MESSAGE
  ------------------------- */
  async function sendMessage() {
    if (!input.trim() || loading) return;

    const newMsg = { role: "user", content: input.trim() };
    const history = [...messages, newMsg];

    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, model: selectedModel }),
      });

      const data = await res.json();
      const full = data.reply || "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      fakeStream(full);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function fakeStream(full) {
    let i = 0;
    const step = 3;

    const interval = setInterval(() => {
      i += step;

      setMessages((prev) => {
        const arr = [...prev];
        arr[arr.length - 1].content = full.slice(0, i);
        return arr;
      });

      if (i >= full.length) clearInterval(interval);
    }, 10);
  }

  const handleKeyPress = (e) => {
    if (
      Platform.OS === "web" &&
      e?.nativeEvent?.key === "Enter" &&
      !e?.nativeEvent?.shiftKey
    ) {
      e.preventDefault?.();
      sendMessage();
    }
  };

  /* -------------------------
        UI
  ------------------------- */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>AI Chat</Text>

        {/* -------------------------
              MODEL DROPDOWN
        ------------------------- */}
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            onPress={() => setDropdownOpen((v) => !v)}
            style={styles.dropdownButton}
          >
            <Text style={styles.dropdownText}>
              {MODEL_OPTIONS.find((m) => m.value === selectedModel)?.label}
            </Text>
            <Text style={styles.arrow}>{dropdownOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownList}>
              {MODEL_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setSelectedModel(option.value);
                    setDropdownOpen(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* -------------------------
              MESSAGES
        ------------------------- */}
        <ScrollView
          ref={scrollRef}
          style={styles.chat}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              keyboardVisible
                ? keyboardHeight + 120
                : insets.bottom + 140,
          }}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.msgBubble,
                msg.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.msgText}>{msg.content}</Text>
            </View>
          ))}

          {loading && <Text style={styles.loading}>AI přemýšlí…</Text>}
        </ScrollView>

        {/* -------------------------
              INPUT BAR
        ------------------------- */}
        <View
          style={[
            styles.inputBar,
            {
              bottom: keyboardVisible
                ? keyboardHeight + 60
                : insets.bottom + 70,
            },
          ]}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Napiš zprávu..."
            multiline
            style={styles.input}
            onKeyPress={handleKeyPress}
            blurOnSubmit={false}
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading}
            style={[styles.sendBtn, loading && { opacity: 0.6 }]}
          >
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* -------------------------
      STYLES
------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: Platform.OS === "web" ? 25 : 60,
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 10,
  },

  /* Dropdown */
  dropdownWrapper: { marginBottom: 20 },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
  },
  dropdownText: { fontSize: 15 },
  arrow: { fontSize: 16 },

  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    maxHeight: 280,
    overflow: "hidden",
    elevation: 3,
  },
  dropdownItem: { padding: 14 },
  dropdownItemText: { fontSize: 15 },

  /* Messages */
  chat: { flex: 1 },
  msgBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#e8e8ec",
    alignSelf: "flex-start",
  },
  msgText: { color: "#000" },
  loading: { marginTop: 4, color: "#666" },

  /* Input */
  inputBar: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "web" ? 10 : 8,
    maxHeight: 120,
  },
  sendBtn: {
    backgroundColor: "#007bff",
    marginLeft: 10,
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  sendBtnText: { color: "#fff", fontWeight: "600" },
});
