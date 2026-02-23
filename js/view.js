//画面描画（フィルタ適用込み）
function render() {
    // TODO
    //フィルタ適用(state.jsで実行)
    const visibleTodos = getVisibleTodos();

    //リストを空にする
    todoList.innerHTML = "";

    //DOMを生成して追加
    visibleTodos.forEach((todo) => {
        //変数定義
        const li = document.createElement("li");
        const cb = document.createElement("input");
        const del = document.createElement("button");

        li.className = "item";
        li.dataset.id = String(todo.id);

        //チェック(完了切替用)
        cb.type = "checkbox";
        cb.className = "toggle";
        cb.checked = todo.done;

        //削除ボタン
        del.className = "del";
        del.type = "button";
        del.textContent = "削除";


        //テキスト or 編集input
        if (todo.id === editingId){
            const input = document.createElement("input");
            input.className = "edit";
            input.type = "text";
            input.value = todo.text;

            input.dataset.editId = String(todo.id);

            li.append(cb, input, del);
        } else {
            const span = document.createElement("span");
            span.className = "text";
            span.textContent = todo.text;
            if (todo.done) {
                span.classList.add("done");
            }
            li.append(cb, span, del);
        }
        todoList.appendChild(li);
        });

    //状態表示(件数)
    const total = todos.length;
    const doneCount = todos.filter(t => t.done).length;
    const activeCount = total - doneCount;
    const rate = total === 0 ? 0 : Math.round((doneCount / total) * 100);

    if (progressBar) {
        progressBar.style.width = `${rate}%`;
    }
    progressText.textContent = `合計:${total} / 未完了:${activeCount} / 完了:${doneCount}`;

    const editInput = document.querySelector('.edit[data-edit-id]');
    if (editInput) {
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }
}

//トースト表示
let toastTimer = null;

function showToast(message) {
    const el = document.querySelector("#toast");
    if (!el) {
        return;
    }

    el.textContent = message;
    el.classList.add("show");

    if (toastTimer) {
        clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
        el.classList.remove("show");
    }, 2000);
}