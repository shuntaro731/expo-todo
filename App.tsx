import "./global.css";
import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [text, setText] = useState("");
  const [editingId, setEditing] = useState(null);
  const [todos, setTodos] = useState([]);

  const handleSubmit = () => {
    if (text.trim()) {
      if (editingId) {
        const updatedTools = todos.map((todo) => {
          if (todo.id === editingId) {
            return { ...todo, text };
          }
          return todo;
        });

        setTodos(updatedTools);
        setEditing(null);
      } else {
        const newTodo = { id: Date.now().toString(), text };
        setTodos([...todos, newTodo]);
      }
      setText("");
    }
  };

  const handleEdit = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setText(todoToEdit.text);
      setEditing(id);
    }
  };

  const handleRemove = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);

    if (editingId === id) {
      setText("");
      setEditing(null);
    }
  };

  return (
    <View className="flex-1 p-4 mt-20 bg-white ">
      <Text className="text-3 mb-2 text-center">Todoリスト</Text>
      <TextInput
        className="h-40 border-[#ddd] border px-8 mb-8"
        value={text}
        onChangeText={setText}
        placeholder="新しいTodoを追加"
      />
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-500 p-4 rounded-lg items-center mt-2"
      >
        <Text className="text-white text-lg font-bold">
          {editingId ? "更新" : "追加"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center p-8 border-b-[#ddd] border-b">
            <Text className="text-lg">{item.text}</Text>
            <View className="flex-row">
              <TouchableOpacity onPress={() => handleEdit(item.id)}>
                <Text className="text-blue-600 text-lg mr-8">編集</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Text className="text-red-600 text-lg">削除</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
