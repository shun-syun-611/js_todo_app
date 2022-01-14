const taskValue = document.getElementById('task_value');
const taskSubmit = document.getElementById('task_submit');
const taskList = document.getElementById('task_list');

// ローカルストレージの初期化
let listItems = [];
const storage = localStorage;
const json = storage.store;

// ローカルストレージの保存内容を表示
document.addEventListener("DOMContentLoaded", () => {
    // console.log(json);
    const listItems_new = storage.store && JSON.parse(storage.store);
    console.log(listItems_new);
    if (json !== undefined) {
        listItems = JSON.parse(json);
        // console.log(listItems);
    }
    for (const item of listItems) {
        const stock_task = document.createTextNode(item.todoValue);
        const listItem = document.createElement("li");
        const pItem = document.createElement("p");
        taskList.appendChild(listItem);
        listItem.appendChild(pItem);
        pItem.appendChild(stock_task);

        // 追加したタスクに削除ボタンを付与
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute('class', 'js_delete_btn');
        deleteButton.innerHTML = "Delete";
        listItem.appendChild(deleteButton);

        // 追加したタスクに完了ボタンを付与
        createDoneButton(listItem);

        // todoがdone状態だったら、打ち消し線を付与
        const doneTaskList = item.isDone;
            if (doneTaskList) {
                const chosenTask = doneButton.closest("li");
                const chosenTaskTxt = chosenTask.firstElementChild;
                chosenTaskTxt.setAttribute('class', 'js_done_text');
            }
        // 削除、完了のイベント設置
        addTaskClick(taskSubmit);
        deleteTasksClick(deleteButton);
        doneTasksClick(doneButton);
        }
});

//追加したタスクに完了ボタンを付与
const createDoneButton = (listItem) => {
    const doneButton = document.createElement("button");
    doneButton.setAttribute('class', 'js_done_btn');
    doneButton.innerHTML = "Done";
    listItem.appendChild(doneButton);
    doneTasksClick(doneButton);
}

// 入力したタスクの追加
const addTasks = (task) => {
    // 入力したタスク内容の追加
    const pItem = document.createElement("p");
    const listItem = document.createElement("li");

    taskList.appendChild(listItem);
    listItem.appendChild(pItem);
    pItem.innerHTML = task;

    // 追加したタスクに削除ボタンを付与
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute('class', 'js_delete_btn');
    deleteButton.innerHTML = "Delete";
    listItem.appendChild(deleteButton);
    deleteTasksClick(deleteButton);
    
    createDoneButton(listItem);
};

// ボタンイベント設定
// 追加ボタンをクリックしたら、追加イベント発火
const addTaskClick = (taskSubmit) => {
    taskSubmit.addEventListener('click', e => {
        e.preventDefault();
        addTaskStorage();
    });
}
// 削除ボタンをクリックしたら、削除イベント発火
const deleteTasksClick = (deleteButton) => {
    deleteButton.addEventListener("click", e => {
        e.preventDefault();
        deleteTasks(deleteButton);
    });
}
// 完了ボタンをクリックしたら、完了イベント発火
const doneTasksClick = (doneButton) => {
    doneButton.addEventListener("click", e => {
        e.preventDefault();
        doneTasks(doneButton);
    });
}

// ボタン機能追加
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

// ストレージ処理
// 追加ボタンを押したタスクをストレージへ追加
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
// 完了ボタンを押したタスクの完了状態をストレージへ追加
const doneTasksStorage = (doneButton) => {
    const previousdeletebtn = doneButton.previousElementSibling;
    const donebtnTxt = previousdeletebtn.previousElementSibling;
    const doneValue = listItems.find(
        (item) => item.todoValue === donebtnTxt.textContent
    );
    if(doneValue.isDone) {
        doneValue.isDone = false;
        const newlistItems = listItems;
        listItems = newlistItems;
        storage.store = JSON.stringify(listItems);
    }
    else {
        doneValue.isDone = true;
        const newlistItems = listItems;
        listItems = newlistItems;
        storage.store = JSON.stringify(listItems);
    }
}
// 削除ボタンを押したタスクをストレージから削除
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