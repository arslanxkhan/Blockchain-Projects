// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <=0.9.0;

import "../Utility/Utility.sol";

contract Todo {
    Utility utility;

    constructor(address _utilityAddress) {
        utility = Utility(_utilityAddress);
    }

    struct TodoTask {
        bytes32 Id;
        string Task;
        bool Done;
    }

    struct TodoList {
        bytes32 Id;
        string Name;
    }

    struct ListOfUserTask {
        TodoList List;
        TodoTask[] Task;
    }

    mapping(address => TodoList[]) public userLists;
    mapping(bytes32 => TodoTask[]) public tasksByListId;

    function GetAllListWithTasks()
        public
        view
        returns (ListOfUserTask[] memory)
    {
        TodoList[] memory list = userLists[msg.sender];
        ListOfUserTask[] memory listWithTask = new ListOfUserTask[](
            list.length
        );

        for (uint256 i = 0; i < list.length; i++) {
            TodoList memory currentList = list[i];
            TodoTask[] memory tasks = tasksByListId[currentList.Id];

            listWithTask[i] = ListOfUserTask({List: currentList, Task: tasks});
        }

        return listWithTask;
    }

    function AddNewList(string memory name) public {
        require(bytes(name).length > 0, "List name cannot be empty");

        userLists[msg.sender].push(
            TodoList({Id: utility.GenerateKey(msg.sender, name), Name: name})
        );
    }

    function AddNewListTask(bytes32 listId, string memory name) public {
        require(bytes(name).length > 0, "Task name cannot be empty");

        TodoList[] storage list = userLists[msg.sender];
        bool listFound = false;
        for (uint256 index = 0; index < list.length; index++) {
            if (list[index].Id == listId) {
                listFound = true;
                tasksByListId[listId].push(
                    TodoTask({
                        Done: false,
                        Task: name,
                        Id: utility.GenerateKey(msg.sender, name)
                    })
                );
                break;
            }
        }
        require(listFound, "List not found");
    }

    function MarkTaskDone(bytes32 listId, bytes32 taskId, bool done) public {
        TodoList[] storage list = userLists[msg.sender];

        bool listFound = false;
        for (uint256 index = 0; index < list.length; index++) {
            if (list[index].Id == listId) {
                listFound = true;
                bool taskFound = false;
                for (
                    uint256 taskIndex = 0;
                    taskIndex < tasksByListId[listId].length;
                    taskIndex++
                ) {
                    if (tasksByListId[listId][taskIndex].Id == taskId) {
                        taskFound = true;
                        tasksByListId[listId][taskIndex].Done = done;
                        break;
                    }
                }
                require(taskFound, "Task not found");
                break;
            }
        }

        require(listFound, "List is not found");
    }

    function DeleteList(bytes32 listId) public {
        TodoList[] storage list = userLists[msg.sender];

        bool listFound = false;
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i].Id == listId) {
                listFound = true;
                delete tasksByListId[list[i].Id];
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }

        require(listFound, "List not found");
    }


    function DeleteTaskFromList(bytes32 listId, bytes32 taskId) public {
        TodoList[] storage lists = userLists[msg.sender];
        bool listFound = false;

        for (uint256 i = 0; i < lists.length; i++) {
            if (lists[i].Id == listId) {
                listFound = true;
                TodoTask[] storage tasks = tasksByListId[listId];
                uint256 taskIndex = findTaskIndex(tasks, taskId);
                require(taskIndex < tasks.length, "Task not found");
                tasks[taskIndex] = tasks[tasks.length - 1];
                tasks.pop();

                break;
            }
        }
        require(listFound, "List not found");
    }

    function findTaskIndex(
        TodoTask[] storage tasks,
        bytes32 taskId
    ) internal view returns (uint256) {
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].Id == taskId) {
                return i;
            }
        }
        revert("Task not found");
    }
}
