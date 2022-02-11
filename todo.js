const taskValue = document.getElementById('task_value');
const taskSubmit = document.getElementById('task_submit');
const taskList = document.getElementById('task_list');
let select_year = document.getElementById("select_year");
let select_month = document.getElementById("select_month");
let select_day = document.getElementById("select_day");

const date = new Date();
const thisYear = date.getFullYear();
const thisMonth = date.getMonth();
const thisDate = date.getDate();
const isLeapYear = year => (year % 4 === 0) && (year % 100 !== 0) || (year % 400 === 0);
let datesOfFebruary = isLeapYear(thisYear) ? 29 : 28;
let datesOfMonth = [31, datesOfFebruary, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 年月日を生成する関数
const createOption = (id, startNum, endNum, current) => {
    const selectDom = document.getElementById(id);
    for (let i = startNum; i <= endNum; i++) {
        if (i == current) {
            const option = document.createElement("option");
            option.innerText = i;
            option.setAttribute("selected", true);
            selectDom.appendChild(option);
        }
        else {
            const option = document.createElement("option");
            option.innerText = i;
            selectDom.appendChild(option);
        }
    }
}

// リアルタイムの年月日を初期表示
createOption("select_year", thisYear, thisYear + 10, thisYear);
createOption("select_month", 1, 12, thisMonth);
createOption("select_day", 1, datesOfMonth[thisMonth], thisDate);

const selectYearBox = select_year
const selectMonthBox = select_month;
const selectDayBox = select_day;

// 月の変更時に、日を1日にして、月に合わせた日数に更新
selectMonthBox.addEventListener("change", e => {
    select_day.innerHTML = "";
    const updatedMonth = e.target.value;
    createOption("select_day", 1, datesOfMonth[updatedMonth - 1], 1);
});
// 年の変更時に、日を1日にして、月に合わせた日数に更新
selectYearBox.addEventListener("change", e => {
    select_month.innerHTML = "";
    select_day.innerHTML = "";
    const updateYear = e.target.value;
    datesOfFebruary = isLeapYear(updateYear) ? 29 : 28;
    datesOfMonth = [31, datesOfFebruary, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    createOption("select_month", 1, 12, 1);
    createOption("select_day", 1, datesOfMonth[0], 1);
});

// ローカルストレージの初期化
let listItems = [];
const storage = localStorage;

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
// 追加したタスクに期限日を付与
const createDeatLineText = (listItem) => {
    const deadLineText = document.createElement("p");
    const deadLineAddText = deadLineAdd();
    deadLineText.setAttribute('class', 'js_deadline');
    deadLineText.innerHTML = "期限日: " + deadLineAddText;
    listItem.appendChild(deadLineText);
    return deadLineText;
}

/* ---------------
タスク作成
----------------*/
// 新しいタスクの追加
const addTasks = (task) => {
    const listItem = createAddTask(task);
    const deleteButton = createDeleteButton(listItem);
    const doneButton = createDoneButton(listItem);
    const deadLineText = createDeatLineText(listItem);
    deleteTasksClick(deleteButton);
    doneTasksClick(doneButton);
    return deadLineText;
};
// 入力したタスク内容の追加
const createAddTask = (task) => {
    const pItem = document.createElement("p");
    pItem.setAttribute('class', 'js_todo');
    const listItem = document.createElement("li");
    taskList.appendChild(listItem);
    listItem.appendChild(pItem);
    pItem.innerHTML = task;
    return listItem;
}
//入力したタスクの期限日を追加
const deadLineAdd = () => {
    const deadLineYear = select_year.value;
    const deadLineMonth = select_month.value;
    const deadLineDate = select_day.value;
    const deadLine = deadLineYear + "年" + deadLineMonth + "月" + deadLineDate + "日";
    return deadLine;
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
//ローカルストレージの保存内容の取得
const queryTasksStorage = () => {
    queryListItems = storage.store && JSON.parse(storage.store);
    listItems = queryListItems ? queryListItems: [];
    return listItems;
}
// ローカルストレージの保存内容の表示
const showTasksStorage = () => {
    if (listItems.length !== 0) {
        for (const item of listItems) {
            const listItem = showTaskList(item);
            const deleteButton = createDeleteButton(listItem);
            const doneButton = createDoneButton(listItem);
            showDeadLine(item, listItem)
            showDoneTaskList(item,doneButton);
            deleteTasksClick(deleteButton);
            doneTasksClick(doneButton);
        }
    }
}
// ローカルストレージの保存内容の表示内容の作成
const showTaskList = (item) => {
    const stock_task = document.createTextNode(item.todoValue);
    const listItem = document.createElement("li");
    const pItem = document.createElement("p");
    pItem.setAttribute('class', 'js_todo');
    taskList.appendChild(listItem);
    listItem.appendChild(pItem);
    pItem.appendChild(stock_task);
    return listItem;
}
// ローカルストレージの保存内容の表示内容の作成
const showDeadLine = (item, listItem) => {
    const stock_deadLine = document.createTextNode(item.deadLine);
    const pItem = document.createElement("p");
    pItem.setAttribute('class', 'js_deadline');
    listItem.appendChild(pItem);
    pItem.appendChild(stock_deadLine);
}
// タスクをローカルストレージへ追加
const addTaskStorage = () => {
    const task = taskValue.value.trim();
    // if (task !== "") {
        const deadLine = "期限日: " + deadLineAdd();
        if (task){
            const item = {
                todoValue: task,
                isDeleted: false,
                isDone: false,
                deadLine: deadLine
            };
            listItems.push(item);
            storage.store = JSON.stringify(listItems);

            addTasks(task);
            taskValue.value = '';
        }
    // }
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

// ローカルストレージの保存内容を表示
document.addEventListener("DOMContentLoaded", () => {
    // if (listItems.length !== 0) {
        queryTasksStorage();
        showTasksStorage();
    // }
});