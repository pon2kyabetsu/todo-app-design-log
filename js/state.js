let todos = [];
let currentFilter = "all";
let searchQuery = "";
let sortMode = "new";
let history = [];
const HISTORY_LIMIT = 20;
let editingId = null;
const TODO_MAX_LEN = 50;

//追加
function addTodoItem(text) {
    pushHistory();
    const todo = {
        id: Date.now(),
        text,
        done: false,
    };

    todos.push(todo);
}

//完了切替
function toggleTodo(id) {
    pushHistory();
    const t = todos.find(x => x.id === id);
    if (!t) {
        return;
    }

    t.done = !t.done;
}

//削除
function deleteTodo(id) {
    pushHistory();
    todos = todos.filter(x => x.id !== id);
}

//まとめて切替
function toggleAll() {
    pushHistory();
    const allDone = todos.length > 0 && todos.every(t => t.done);
    todos = todos.map(t => ({ ...t, done: !allDone }));
}

//完了ToDoすべて削除
function clearDone() {
    pushHistory();
    const before = todos.length;
    todos = todos.filter(t => !t.done);
    const removed = before - todos.length;
    return removed;
}

function getVisibleTodos() {
    //フィルター
    let list = todos;
    if (currentFilter === "active") {
        list = list.filter(t => !t.done);
    } else if (currentFilter === "done") {
        list = list.filter(t => t.done);
    }

    //検索
    const q = searchQuery.trim().toLowerCase();
    if (q) {
        list = list.filter(t => t.text.toLowerCase().includes(q));
    }

    //ソート
    if (sortMode === "new") {
        list = [...list].sort((a, b) => b.id - a.id);
    } else if (sortMode === "old") {
        list = [...list].sort((a, b) => a.id - b.id);
    } else if (sortMode === "activeFirst") {
        list = [...list].sort((a, b) => Number(a.done) - Number(b.done));
    }

    return list;
}

//todosのコピーを保存
function pushHistory() {
    history.push(todos.map(t => ({ ...t })));
    if (history.length > HISTORY_LIMIT) history.shift();
}

//アンドゥ
function undo() {
    const prev = history.pop();
    if (!prev) {
        return false;
    }
    todos = prev;
    return true;
}

//編集
function startEdit(id) {
    editingId = id;
}

function cancelEdit() {
    editingId = null;
}

function updateTodoText(id, newText) {
    const text = newText.trim();
    if (text === "") {
        return false;
    }

    //Undo対象とする
    pushHistory();
    const t = todos.find(x => x.id === id);
    if (!t) {
        return false;
    }

    t.text = text;
    editingId = null;
    return true;
}

//Prefsをリセットする
function resetPrefs() {
    currentFilter = "all";
    searchQuery = "";
    sortMode = "new";
}

//Prefsをすべてリセット
function resetAll() {
    todos = [];
    history = [];
    resetPrefs();
}

//バリデーション
function normalizeText(text) {
    return text
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
}

function validateTodoText(text, excludeId = null) {
    const trimmed = text.trim();
    if (trimmed === "") {
        return { ok: false, message: "空文字は登録できません"};
    }
    if (trimmed.length > TODO_MAX_LEN) {
        return { ok: false, message: `${TODO_MAX_LEN}文字以内にしてください`};
    }

    const key = normalizeText(trimmed);
    const dup = todos.some(t => normalizeText(t.text) === key && t.id !== excludeId);
    if (dup) {
        return { ok: false, message: "同じToDoがすでに存在しています"};
    }
    return { ok: true, value: trimmed};
}