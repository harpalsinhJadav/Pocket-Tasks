import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import { api } from "./src/api";

type Task = { id:number; title:string; done:boolean };

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data } = await api.get<Task[]>("/api/tasks");
    setTasks(data);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!title.trim()) return;
    setLoading(true);
    await api.post("/api/tasks", { title });
    setTitle("");
    setLoading(false);
    load();
  }

  async function toggle(id:number, done:boolean) {
    await api.patch(`/api/tasks/${id}`, { done });
    load();
  }

  async function remove(id:number) {
    await api.delete(`/api/tasks/${id}`);
    load();
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 12, flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Pocket Tasks (Mobile)</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            style={{ flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 44 }}
          />
          <Button title={loading ? "..." : "Add"} onPress={add} disabled={loading} />
        </View>

        <FlatList
          data={tasks}
          keyExtractor={t => String(t.id)}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={() => toggle(item.id, !item.done)} style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, textDecorationLine: item.done ? "line-through" : "none", color: item.done ? "#6b7280" : "#111827" }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => remove(item.id)}>
                <Text style={{ color: "#dc2626" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
