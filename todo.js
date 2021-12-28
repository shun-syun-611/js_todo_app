    const taskValue = document.getElementsByClassName('task_value')[0];
    const taskSubmit = document.getElementsByClassName('task_submit')[0];
    const taskList = document.getElementsByClassName('task_list')[0];

    // ローカルストレージの初期化
    let listItems = [];
    const storage = localStorage;

    // リロードされた時に、ローカルストレージの保存内容を表示
    document.addEventListener("DOMContentLoaded", () => {
        const json = storage.store;
        if (json === undefined) {
            return;
        }
        listItems = JSON.parse(json);
        for (const item of listItems) {
            const stock_task = document.createTextNode(item.todoValue);
            const listItem = document.createElement("li");
            const pItem = document.createElement("p");
            taskList.appendChild(listItem);
            listItem.appendChild(pItem);
            pItem.appendChild(stock_task);

            // 以下、二つの処理は後で細かく共通化できそう
            // 追加したタスクに削除ボタンを付与
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Delete";
            listItem.appendChild(deleteButton);

            // 削除ボタンをクリックしたら、削除イベント発火
            deleteButton.addEventListener("click", e => {
                e.preventDefault();
                deleteTasks(deleteButton);
            });
            }
    });

    // 追加ボタンを作成
    const addTasks = (task) => {
        // 入力したタスクの追加
        const pItem = document.createElement("p");
        const listItem = document.createElement("li");

        taskList.appendChild(listItem);
        listItem.appendChild(pItem);
        pItem.innerHTML = task;

        // 追加したタスクに削除ボタンを付与
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        listItem.appendChild(deleteButton);

        // 削除ボタンをクリックしたら、削除イベント発火
        deleteButton.addEventListener("click", e => {
            e.preventDefault();
            deleteTasks(deleteButton);
        });
    };

    // 削除ボタンにタスクを消す機能を付与
    const deleteTasks = (deleteButton) => {
        const chosenTask = deleteButton.closest("li");
        taskList.removeChild(chosenTask);


        // 削除ボタンを押したタスクをストレージから削除
        const delbtnTxt = deleteButton.previousElementSibling;
        const delValue = listItems.find(
        (item) => item.todoValue === delbtnTxt.textContent
        );
        delValue.isDeleted = true;
        const newlistItems = listItems.filter((item) => item.isDeleted === false);
        listItems = newlistItems;
        storage.store = JSON.stringify(listItems);

    }

    // 追加ボタンをクリックしたら、追加イベントを発火
    taskSubmit.addEventListener('click', e => {
        e.preventDefault();
        const task = taskValue.value;
        if (task !== ""){
            // ローカルストレージに保存
            const item = {
                todoValue: task,
                isDeleted: false
            };
            listItems.push(item);
            storage.store = JSON.stringify(listItems);

            addTasks(task);
            taskValue.value = '';
        }
    });
