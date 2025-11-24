import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const API_BASE = "http://10.0.0.139:8000";

type DailyItem = { date: string; avg: number };

export default function StatsScreen() {
  const [avgWeek, setAvgWeek] = useState<number | null>(null);
  const [daily, setDaily] = useState<DailyItem[]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const a = await fetch(`${API_BASE}/api/stats/avg-week`).then((r) => r.json());
    setAvgWeek(a.value);

    const d = await fetch(`${API_BASE}/api/stats/daily`).then((r) => r.json());
    setDaily(d);

    const c = await fetch(`${API_BASE}/api/stats/count?days=7`).then((r) => r.json());
    setCount(c.count);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Statistiky</Text>

      <Text style={styles.block}>
        👉 Průměrná nálada za poslední týden:{" "}
        <Text style={styles.bold}>{avgWeek ?? "..."}</Text>
      </Text>

      <Text style={styles.block}>
        👉 Počet záznamů za 7 dní:{" "}
        <Text style={styles.bold}>{count}</Text>
      </Text>

      <Text style={styles.subtitle}>Denní průměry:</Text>

      {daily.map((d) => (
        <Text key={d.date} style={styles.listItem}>
          {d.date}: {d.avg.toFixed(1)}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  block: { fontSize: 16, marginBottom: 6 },
  bold: { fontWeight: "bold" },
  listItem: { fontSize: 15, marginBottom: 4 },
});
