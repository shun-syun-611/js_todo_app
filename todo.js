const taskValue = document.getElementById('task_value');
const taskSubmit = document.getElementById('task_submit');
const taskList = document.getElementById('task_list');

// ローカルストレージの初期化
let listItems = [];
const storage = localStorage;

// ローカルストレージの保存内容を表示
document.addEventListener("DOMContentLoaded", () => {
    queryTasksStorage();
    showTasksStorage();
    console.log(listItems);
});

/* ---------------
ボタン作成
----------------*/
const createButton = () => {
    const createButton = document.createElement("button");
    return createButton;
} 

// 追加したタスクに削除ボタンを付与
const createDeleteButton = (listItem) => {
    const deleteButton = createButton();
    deleteButton.setAttribute('class', 'js_delete_btn');
    deleteButton.innerHTML = "Delete";
    listItem.appendChild(deleteButton);
    return deleteButton;
}
// 追加したタスクに完了ボタンを付与
const createDoneButton = (listItem) => {
    const doneButton = createButton();
    doneButton.setAttribute('class', 'js_done_btn');
    doneButton.innerHTML = "Done";
    listItem.appendChild(doneButton);
    return doneButton;
}

// todoがdone状態だったら、打ち消し線を付与
const showDoneTaskList = (item, doneButton) => {
    const doneTaskList = item.isDone;
    if (doneTaskList) {
        const chosenTask = doneButton.closest("li");
        const chosenTaskTxt = chosenTask.firstElementChild;
        chosenTaskTxt.setAttribute('class', 'js_done_text');
    }
}

/* ---------------
タスク作成
----------------*/
// 新しいタスクの追加
const addTasks = (task) => {
    const listItem = createAddTask(task);
    const deleteButton = createDeleteButton(listItem);
    const doneButton = createDoneButton(listItem);
    deleteTasksClick(deleteButton);
    doneTasksClick(doneButton);
};
// 入力したタスク内容の追加
const createAddTask = (task) => {
    const pItem = document.createElement("p");
    const listItem = document.createElement("li");
    taskList.appendChild(listItem);
    listItem.appendChild(pItem);
    pItem.innerHTML = task;
    return listItem;
}

/* ---------------
イベント設定
----------------*/
// 追加ボタンをクリックしたら、追加イベント発火
    taskSubmit.addEventListener('click', e => {
        e.preventDefault();
        addTaskStorage();
    });
// 削除ボタンをクリックしたら、削除イベント発火
const deleteTasksClick = (deleteButton) => {
    deleteButton.addEventListener("click", e => {
        e.preventDefault();
        const chosenTask = deleteButton.previousSibling;
        const chosenTaskText = chosenTask.textContent;
        if(window.confirm(`本当に「${chosenTaskText}」を削除してよろしいですか？`)) {
            deleteTasks(deleteButton);
        }
    });
}
// 完了ボタンをクリックしたら、完了イベント発火
const doneTasksClick = (doneButton) => {
    doneButton.addEventListener("click", e => {
        e.preventDefault();
        doneTasks(doneButton);
    });
}

// 削除ボタンをクリックした時の確認


/* ---------------
機能追加
----------------*/
// 削除ボタンにタスクを消す機能を付与
const deleteTasks = (deleteButton) => {
    const chosenTask = deleteButton.closest("li");
    taskList.removeChild(chosenTask);
    deleteTasksStorage(deleteButton);
}
//完了ボタンでタスクに横線を入れる機能を付与
const doneTasks = (doneButton) => {
    const chosenTask = doneButton.closest("li");
    const chosenTaskTxt = chosenTask.firstElementChild;
    chosenTaskTxt.classList.toggle('js_done_text');
    doneTasksStorage(doneButton);
}

/* ---------------
ストレージ処理
----------------*/
// ローカルストレージの保存内容の表示
const showTasksStorage = () => {
    for (const item of listItems) {
        const listItem = showTaskList(item);
        const deleteButton = createDeleteButton(listItem);
        const doneButton = createDoneButton(listItem);
        showDoneTaskList(item,doneButton);
        deleteTasksClick(deleteButton);
        doneTasksClick(doneButton);
    }
}
//ローカルストレージの保存内容の取得
const queryTasksStorage = () => {
    listItems = storage.store && JSON.parse(storage.store);    
}
// ローカルストレージの保存内容の表示内容の作成
const showTaskList = (item) => {
    const stock_task = document.createTextNode(item.todoValue);
    const listItem = document.createElement("li");
    const pItem = document.createElement("p");
    taskList.appendChild(listItem);
    listItem.appendChild(pItem);
    pItem.appendChild(stock_task);
    return listItem;
}
// タスクをローカルストレージへ追加
const addTaskStorage = () => {
    const task = taskValue.value;
    if (task){
        const item = {
            todoValue: task,
            isDeleted: false,
            isDone: false
        };
        listItems.push(item);
        storage.store = JSON.stringify(listItems);

        addTasks(task);
        taskValue.value = '';
    }
}
// タスクの完了状態をローカルストレージへ追加
const doneTasksStorage = (doneButton) => {
    const previousdeletebtn = doneButton.previousElementSibling;
    const donebtnTxt = previousdeletebtn.previousElementSibling;
    const doneValue = listItems.find(
    (item) => item.todoValue === donebtnTxt.textContent
    );

    const doneValueStatus = (doneValue) => {
        const doneValueStatus = doneValue.isDone;
        return doneValueStatus;
    }

    console.log(doneValueStatus(doneValue));
    if(doneValue.isDone) {
        doneValue.isDone = false;
        const newlistItems = listItems;
        listItems = newlistItems;
        storage.store = JSON.stringify(listItems);
    }else {
        doneValue.isDone = true;
        const newlistItems = listItems;
        listItems = newlistItems;
        storage.store = JSON.stringify(listItems);
    }
}
// タスクをローカルストレージから削除
const deleteTasksStorage = (deleteButton) => {
    const delbtnTxt = deleteButton.previousElementSibling;
    const delValue = listItems.find(
    (item) => item.todoValue === delbtnTxt.textContent
    );
    delValue.isDeleted = true;
    const newlistItems = listItems.filter((item) => item.isDeleted === false);
    listItems = newlistItems;
    storage.store = JSON.stringify(listItems);
}