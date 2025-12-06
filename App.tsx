import "./global.css";
import { useState } from "react"; //関数の中身が変わると最新の状態に再レンダリング
import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [text, setText] = useState(""); //onChangeなどのイベントを使ってsetTextを発動させて現在のtextの状態を変更するような形、textは入力されている文字そのもの。このコードには状態を管理する処理しか含まれない。useState()はstateの初期値
  const [editingId, setEditing] = useState(null);
  const [todos, setTodos] = useState([]);

  //新しいTodoを作るか既存のTodoを更新する変数
  const handleSubmit = () => {
    //もしテキストが入力されていれば: trimはtextに入力されている前後の空白を削除した文字列を返す。()は現在入力されている文字列
    if (text.trim()) {
      //今、編集中のIDはあるか？を確認
      if (editingId) {
        //mapはtodosからデータを一つづつコピーしてupdateToolsという変数に入れる。　mapと...の違いはどちらも元データをコピーするがmapは中の要素をいじる時、...は新しいデータを追加するときに使う
        const updatedTools = todos.map((todo) => {
          //todoのリストの中から配列順に現在編集中のタスクと同じIDがないか確認してもしあったら下の処理をする
          if (todo.id === editingId) {
            return { ...todo, text }; //...todo <= これはIDなどの他のデータは元のままにして、textだけは今入力されている内容で上書きする
          }
          return todo; //現在編集中のタスクと同じIDがなければそのままupdateToolsに含める
        });
        setTodos(updatedTools); //setTodosでupdateToolsを参照させてtodosを更新
        setEditing(null); //編集状態をoffに
        //入力欄に入っているのは編集IDではなかったら
      } else {
        const newTodo = { id: Date.now().toString(), text }; //タスクにIDを追加している、Data.nowは現在の時刻で生成されるID、toStringはで文字列に変換。textもタスクを追加する時セットに
        setTodos([...todos, newTodo]); //todosのコピーを作り、一番後ろに新しいnewTodoを一番後ろに置き、仮想DOMで更新
      }
      setText(""); //最後にテキストの中身を空に更新
    } //elseの処理がないのでテキストが空白ならば何も処理は起きない
  };

  //編集モードに入る処理
  //何かのイベントで発生する関数。(id)に入るidはクリックされたボタンのタスクに対応したidが入る
  const handleEdit = (id) => {
    //findはmapのようにtodosの全ての配列ではなく条件に当てはまるtodosの一つのタスクを探し出し、コピーしてくる。findは最初のデータを参照する、それをtodoと呼ぶ、todoの中のidは(id)と同じですか？を確認、これを繰り返す
    const todoToEdit = todos.find((todo) => todo.id === id);
    //もしtodoToEditがあるなら エラーでIDが見つからなかった場合undefindになりアプリがクラッシュするためifを入れる
    if (todoToEdit) {
      setText(todoToEdit.text); //setTextでtodoToEditのtextの文字列に更新 入力欄に入れる
      setEditing(id); //編集モードとしてidの更新処理をさせる
    }
  };

  const handleRemove = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id); //filterメッソド: 条件に合うものだけを残す。 !== ノットイコール: 今チェックしているタスクのIDは(id)と違いますか？ 合わせると違うものは残り、一致するものは残らない
    setTodos(filteredTodos); //(id)と一致するタスクがなくなったリスト
    //今消そうとしてるIDが編集中IDだったら
    if (editingId === id) {
      setText(""); //入力欄を空っぽにし
      setEditing(null); //編集モードを終了
    }
  };

  return (
    <View className="flex-1 p-4 mt-20 bg-white">
      <Text className="text-3 mb-2 text-center">Todoリスト</Text>
      <TextInput
        className="h-40 border-[#ddd] border px-8 mb-8"
        value={text} //textInputの文字=stateのテキストであることを明記
        onChangeText={setText} //文字が変わるたびにsetTextでtextを更新
        placeholder="新しいTodoを追加"
      />
      <TouchableOpacity
        onPress={handleSubmit} //押した時handleSubmitを発動
        className="bg-blue-500 p-4 rounded-lg items-center mt-2"
      >
        <Text className="text-white text-lg font-bold">
          {/* 三項演算子(やっていることは一行で書けるif-else文): editingId に何か入ってるなら更新を表示、NOの場合、追加と表示*/}
          {editingId ? "更新" : "追加"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={todos} //このリストの参照元はtodosであることを明記
        //todosの一つのオブジェクトをどう表示するかを指定(データの数だけ自動で繰り返して表示してくれる)
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center p-8 border-b-[#ddd] border-b">
            {/* itemの中のテキストを表示 */}
            <Text className="text-lg">{item.text}</Text>
            <View className="flex-row">
              {/* タップしたらこの行のID (item.id) を持って関数行けという処理 */}
              <TouchableOpacity onPress={() => handleEdit(item.id)}>
                <Text className="text-blue-600 text-lg mr-8">編集</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Text className="text-red-600 text-lg">削除</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        //基本的にFlatListのitemをitemの登録された順番で管理している。文字2番目のタスクが消されると、3番目以降は順番を詰めることになるがそこでReactは困惑し全体を再レンダリングする
        //これを解決するためにitemの中にあるidで管理させるようにしている
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
