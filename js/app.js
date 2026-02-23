const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");
const statusEl = document.querySelector("#status");
const filterBtns = document.querySelectorAll(".filter");
const toggleAllBtn = document.querySelector("#toggleAllBtn");
const clearDoneBtn = document.querySelector("#clearDoneBtn");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const progressBar = document.querySelector("#progressBar");
const undoBtn = document.querySelector("#undoBtn");
const resetPrefsBtn = document.querySelector("#resetPrefsBtn");
const resetAllBtn = document.querySelector("#resetAllBtn");
const jsonArea = document.querySelector("#jsonArea");
const exportBtn = document.querySelector("#exportBtn");
const importBtn = document.querySelector("#importBtn");

//遅延実行の定義
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// savePrefs を遅延実行する関数を作る
const debouncedSavePrefs = debounce(savePrefs, 300);

//起動
loadPrefs();
loadTodos();

//UIに反映する
searchInput.value = searchQuery;
sortSelect.value = sortMode;

filterBtns.forEach(b => b.classList.remove("active"));
document.querySelector(`[data-filter="${currentFilter}"]`)?.classList.add("active");

render();

//追加
function addTodo() {
  // TODO
  const v = validateTodoText(todoInput.value);
  if (!v.ok) {
    showToast(v.message);
    todoInput.focus();
    return;
  }
  addTodoItem(v.value);
  saveTodos();
  render();

  todoInput.value = "";
  statusEl.textContent = "";
  showToast("追加しました");

}

//イベント：追加
addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});


//フィルタ
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    savePrefs();
    render();
  });
});

//完了/削除（イベント委譲）
todoList.addEventListener("click", (e) => {
  if (editingId !== null) {
    return;
  }
  const li = e.target.closest(".item");
  if (!li) {
    return;
  }
  const id = Number(li.dataset.id);

  //削除
  if (e.target.classList.contains("del")) {
    deleteTodo(id);
    saveTodos();
    render();
    return;
  }

  //完了切替:チェックボックスorテキストを押したら切替
  if (e.target.classList.contains("toggle") || e.target.classList.contains("text")) {
    toggleTodo(id);
    saveTodos();
    render();
  }
});

if (toggleAllBtn) {
  toggleAllBtn.addEventListener("click", () => {
  toggleAll();
  saveTodos();
  render();
});
}

if (clearDoneBtn) {
  clearDoneBtn.addEventListener("click", () => {
    if (!confirm("完了ToDoを削除しますか？")) {
      return;
    }
    const removed = clearDone()
    saveTodos();
    render();
    statusEl.textContent = removed > 0 ? `完了ToDoを${removed}件削除しました` : "削除する完了ToDoがありません";
});
}

//検索
if (searchInput) {
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    render();
    debouncedSavePrefs();
  });
}

//ソート
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    sortMode = sortSelect.value;
    savePrefs();
    render();
  });
}

//アンドゥ
if (undoBtn) {
  undoBtn.addEventListener("click", () => {
    const ok = undo();
    if (!ok) {
      statusEl.textContent = "取り消せる操作がありません";
      return;
    }
    saveTodos();
    render();
    statusEl.textContent = "もとに戻しました"
  });
}

//編集
todoList.addEventListener("dblclick", (e) => {
    const li = e.target.closest(".item");
    if (!li) {
      return;
    }
    const id = Number(li.dataset.id);
    startEdit(id);
    render();
});

todoList.addEventListener("keydown", (e) => {
  if (!e.target.classList.contains("edit")) {
    return;
  }
  const id = Number(e.target.dataset.editId);

  if (e.key === "Enter") {
    const v = validateTodoText(e.target.value, id);
    if (!v.ok) {
      showToast(v.message);
      return;
    }
    updateTodoText(id, v.value);
    saveTodos();
    render();
    showToast("更新しました");
  }

  if (e.key === "Escape") {
    cancelEdit();
    render();
  }
});

todoList.addEventListener("focusout", (e) => {
  if (!e.target.classList.contains("edit")) {
    return;
  }

  if (editingId === null) {
    return;
  }

  const id = Number(e.target.dataset.editId);
  const v = validateTodoText(e.target.value, id);

  if (!v.ok) {
    cancelEdit();
    render();
    showToast(v.message);
    return;
  }
  updateTodoText(id, v.value);
  saveTodos();
  render();
  showToast("更新しました");
});

if (resetPrefsBtn) {
  resetPrefsBtn.addEventListener("click", () => {
    resetPrefs();
    savePrefs();

    //UIに反映
    if (searchInput) {
      searchInput.value = searchQuery;
    }
    if (sortSelect) {
      sortSelect.value = sortMode;
    }

    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    document.querySelector('[data-filter="all"]')?.classList.add("active");
    render();
  });
}

if (resetAllBtn) {
  resetAllBtn.addEventListener("click", () => {
    if (!confirm("全データを削除します。よろしいですか？")) {
      return;
    }
    resetAll();
    saveTodos();
    savePrefs();
    if (jsonArea) {
      jsonArea.value = "";
    }
    if (searchInput) {
      searchInput.value = "";
    }
    if (sortSelect) {
      sortSelect.value = "new";
    }

    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    document.querySelector('[data-filter="all"]')?.classList.add("active");
    render();
  });
}

if (exportBtn && jsonArea) {
  exportBtn.addEventListener("click", () => {
    jsonArea.value = JSON.stringify(todos, null, 2);
  });
}

if (importBtn && jsonArea) {
  importBtn.addEventListener("click", () => {
    try {
      const data = JSON.parse(jsonArea.value);
      if (!Array.isArray(data)) {
        throw new Error("配列じゃない");
      }
        //バリデーション
        const next = data.map(t => ({
          id: Number(t.id) || Date.now(),
          text: String(t.text ?? "").trim(),
          done: Boolean(t.done),
        })).filter(t => t.text !== "");

        pushHistory();
        todos = next;

        saveTodos();
        render();
        statusEl.textContent = "インポートしました";
      } catch {
        statusEl.textContent = "JSONの形式が正しありません";
      }
  });
}

