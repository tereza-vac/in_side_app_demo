import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const API_BASE = 'http://10.0.0.139:8000'; // když se změní IP, upravíš jen tohle

type Entry = {
  id?: number;
  mood: number;
  ts: string;
  note?: string | null;
};

export default function HomeScreen() {
  const [mood, setMood] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  // Načtení záznamů po startu
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/mood`);
        if (!res.ok) throw new Error('API error');
        const data = (await res.json()) as Entry[];
        setEntries(data);
      } catch (e) {
        console.warn('GET /api/mood failed', e);
      }
    })();
  }, []);

  const addMood = async () => {
    console.log('Klik na ULOŽIT, mood =', mood);
    const n = Number(mood);

    if (!Number.isFinite(n) || n < 1 || n > 10) {
      Alert.alert('Zadej číslo 1–10');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: n, note }),
      });

      if (!res.ok) throw new Error('API error');

      const created = (await res.json()) as Entry;
      setEntries(prev => [created, ...prev]);
      setMood('');
      setNote('');
    } catch (e) {
      console.warn('POST /api/mood failed', e);
      Alert.alert('Nepodařilo se uložit náladu na server.');
    } finally {
      setLoading(false);
    }
  };

  const moodEmoji = (value: number) => {
    if (value <= 3) return '😢';
    if (value <= 6) return '😐';
    if (value <= 8) return '🙂';
    return '🤩';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Denní check-in nálady 🌤️</Text>

        {/* FORM KARTA */}
        <View style={styles.card}>
          <Text style={styles.label}>Jak se cítíš (1–10)?</Text>
          <TextInput
            value={mood}
            onChangeText={setMood}
            keyboardType="numeric"
            placeholder="např. 7"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>
            Co se dnes stalo?
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="např. práce, hádka, pohoda..."
            placeholderTextColor="#999"
            style={[styles.input, styles.noteInput]}
            multiline
          />

          <TouchableOpacity style={styles.btn} onPress={addMood} disabled={loading}>
            <Text style={styles.btnText}>
              {loading ? 'Ukládám…' : 'ULOŽIT'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SEZNAM ZÁZNAMŮ */}
        {entries.length > 0 && (
          <View style={styles.listWrapper}>
            <Text style={styles.sectionTitle}>Poslední záznamy</Text>

            {entries.map(e => (
              <View key={e.id ?? e.ts} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryEmoji}>{moodEmoji(e.mood)}</Text>
                  <Text style={styles.entryTitle}>
                    {new Date(e.ts).toLocaleString()} — nálada: {e.mood}/10
                  </Text>
                </View>

                {e.note ? (
                  <Text style={styles.noteText}>✏️ {e.note}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050509',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.97)',
    padding: 22,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 10,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  noteInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listWrapper: {
    width: '100%',
    marginTop: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  entry: {
    width: '100%',
    padding: 14,
    backgroundColor: '#111216',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#23242b',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  entryEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  entryTitle: {
    color: 'white',
    fontSize: 14,
    flexShrink: 1,
  },
  noteText: {
    color: '#b8b8c5',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 2,
  },
});
