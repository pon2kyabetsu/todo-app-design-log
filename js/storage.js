//localStorageから読み込む
function loadTodos() {
    // TODO
    const raw = localStorage.getItem("todos");
    if (!raw) {
        todos = [];
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        //変な形のデータが入っていた時の保険
        if(!Array.isArray(parsed)) {
            todos = [];
            return;
        }

        //1件ずつ整える
        todos = parsed
                .filter(t => t && typeof t === "object")
                .map(t => ({
                    id: Number(t.id) || Date.now(),
                    text: String(t.text ?? ""),
                    done: Boolean(t.done),
                }))
                .filter(t => t.text.trim() !== "");
        } catch (e) {
            //JSONが壊れているとか
            todos = [];
        }
}

//localStorageへ保存
function saveTodos() {
    // TODO
    localStorage.setItem("todos", JSON.stringify(todos));
}


//prefsの保存
function savePrefs() {
    const prefs = { currentFilter, searchQuery, sortMode };
    localStorage.setItem("prefs", JSON.stringify(prefs));
}

//prefsの復元
function loadPrefs() {
    const raw = localStorage.getItem("prefs");
    if (!raw) {
        return;
    }

    try {
        const p = JSON.parse(raw);
        if (p && typeof p === "object") {
            if (typeof p.currentFilter === "string" && ["all", "active", "done"].includes(p.currentFilter)) {
                currentFilter = p.currentFilter;
            }
            if (typeof p.searchQuery === "string") {
                searchQuery = p.searchQuery;
            }
            if (typeof p.sortMode === "string" && ["new", "old", "activeFirst"].includes(p.sortMode)) {
                sortMode = p.sortMode;
            }
        }
    } catch {}
}