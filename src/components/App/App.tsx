import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { nanoid } from 'nanoid';
import useOutsideClick from '../../hooks/useOutsideClick';
import Main from '../Main/Main';
import classes from './App.module.scss';
import { Task } from '../../ts/types';
import { EditTask, EditFormData, ErrorsAndLoading } from '../../ts/interfaces';
import { TaskActionType } from '../../ts/enums';
import { taskReducer } from '../../reducers';
import sortList from '../../utilities/sortList';
import useModal from '../../hooks/useModal';

const App = () => {
  const [tasks, taskDispatch] = useReducer(taskReducer, []);

  const [state, setState] = useState<ErrorsAndLoading>({
    isLoading: true,
    httpError: null,
  });

  const [addFormData, setAddFormData] = useState<EditFormData>({
    status: '',
    letterPriority: '',
    numberPriority: '',
    priority: '',
    description: '',
  });

  const [editFormData, setEditFormData] = useState<EditFormData>({
    status: '',
    letterPriority: '',
    numberPriority: '',
    priority: '',
    description: '',
  });

  const [editTask, setEditTask] = useState<EditTask>({
    rowId: null,
    inputType: null,
    xPos: '0px',
    yPos: '0px',
    showMenu: false,
  });

  const handleOutsideClick = useCallback(
    (e: MouseEvent | TouchEvent | KeyboardEvent) => {
      setEditTask({
        rowId: null,
        inputType: (e.target as HTMLElement).dataset.id || null,
        xPos: null,
        yPos: null,
        showMenu:
          editTask.xPos &&
          editTask.yPos &&
          (e.target as HTMLButtonElement).dataset.id === 'status-cell'
            ? true
            : false,
      });
    },
    [editTask.xPos, editTask.yPos]
  );

  const outsideClickRef = useOutsideClick((e) => handleOutsideClick(e));

  const [, toggleModal, isModal] = useModal();

  useEffect(() => {
    if (isModal) {
      document.body.classList.add('lockScroll');
      document.body.style.top = `-${window.scrollY}px`;
    }
    if (!isModal) {
      document.body.classList.remove('lockScroll');
      document.body.style.top = '';
    }

    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        isModal && hideModalHandler(e);
        editTask.showMenu && setEditTask({ ...editTask, showMenu: false });
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  });

  useEffect(() => {
    try {
      const loadedTasks: Task[] = [];
      const localStorageTasks: Task[] = JSON.parse(localStorage.getItem('tasks') as string) || [];

      if (localStorageTasks) {
        localStorageTasks.forEach((task: Task) => {
          loadedTasks.push({
            id: task.id,
            status: task.status,
            priority: task.priority,
            description: task.description,
          });
        });
      }

      if (localStorageTasks.length === 0) {
        const initialTask = {
          id: nanoid(),
          status: 'In Process',
          priority: 'A1',
          description: 'Planning and solitude',
        };

        loadedTasks.push({
          ...initialTask,
        });

        while (loadedTasks.length < 16) {
          loadedTasks.push({
            id: nanoid(),
            status: '',
            priority: '',
            description: '',
          });
        }

        localStorage.setItem('tasks', JSON.stringify(loadedTasks));
      }

      sortList(loadedTasks);

      taskDispatch({
        type: TaskActionType.SET,
        data: loadedTasks,
      });
      setState({ isLoading: false, httpError: null });
    } catch (error) {
      if (error instanceof Error) {
        setState({
          isLoading: false,
          httpError: error.message,
        });
      } else {
        console.log('Unexpected error: ', error);
      }
    }
  }, []);

  const hideModalHandler = useCallback(
    (e: React.MouseEvent | React.TouchEvent | KeyboardEvent) => {
      e.stopPropagation();
      if ((e as KeyboardEvent).key === 'Tab') return;

      if (editTask.inputType === 'priority-cell') {
        const newFormData = {
          ...editFormData,
          letterPriority: '',
          numberPriority: '',
          priority: '',
        };
        setEditFormData(newFormData);
      } else {
        const newFormData = {
          ...addFormData,
          letterPriority: '',
          numberPriority: '',
          priority: localStorage.getItem('addTaskPriority'),
        };
        setAddFormData(newFormData);
      }
      setTimeout(() => {
        toggleModal();
      }, 250);
    },
    [toggleModal, editFormData, addFormData, editTask.inputType]
  );

  if (state.httpError) {
    return (
      <section className={classes.tasksError}>
        <p>Something went wrong...</p>
      </section>
    );
  }

  if (state.isLoading) {
    return (
      <section className={classes.tasksLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <div className={classes.appContainer}>
      <Main
        editTask={editTask}
        rowId={editTask.rowId}
        inputType={editTask.inputType}
        xPos={editTask.xPos}
        yPos={editTask.yPos}
        showMenu={editTask.showMenu}
        outsideClickRef={outsideClickRef}
        tasks={tasks}
        taskDispatch={taskDispatch}
        editFormData={editFormData}
        setEditTask={setEditTask}
        isModal={isModal}
        toggleModal={toggleModal}
        hideModalHandler={hideModalHandler}
        setEditFormData={setEditFormData}
        addFormData={addFormData}
        setAddFormData={setAddFormData}
      />
    </div>
  );
};

export default App;
