    // console.log('hello')
    const taskValue = document.getElementsByClassName('task_value')[0];
    const taskSubmit = document.getElementsByClassName('task_submit')[0];
    const taskList = document.getElementsByClassName('task_list')[0];

    // 追加ボタンを作成
    const addTasks = (task) => {
        // 入力したタスクの追加
        const listItem = document.createElement("li");
        const showItem = taskList.appendChild(listItem);
        showItem.innerHTML = task;

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
    }

    // 追加ボタンをクリックしたら、追加イベントを発火
    taskSubmit.addEventListener('click', e => {
        e.preventDefault();
        const task = taskValue.value;
        addTasks(task);
        taskValue.value = '';
    });
