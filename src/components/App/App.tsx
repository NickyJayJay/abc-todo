import React, {
  useState,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import { nanoid } from 'nanoid';
import useOutsideClick from '../../hooks/useOutsideClick';
import Main from '../Main/Main';
import classes from './App.module.scss';
import { Task } from '../../ts/types';
import {
  EditTask,
  EditFormData,
  ErrorsAndLoading,
} from '../../ts/interfaces';
import { TaskActionType } from '../../ts/enums';
import { taskReducer } from '../../reducers';
import { handleMenuItemEvent } from '../UI/ContextMenu/handleMenuItemEvent';
import sortList from '../../utilities/sortList';
import useMenuCoords from '../../hooks/useMenuCoords';
import useModal from '../../hooks/useModal';
import {
  handleFormSubmit,
  handleEditFormKeyboard,
  handleEditTask,
} from './handlers';

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
    xPosTouch: '0px',
    yPosTouch: '0px',
    showMenu: false,
  });

  const [setX, setY, tableRef] = useMenuCoords();

  const handleOutsideClick = useCallback(
    (e: MouseEvent | TouchEvent | KeyboardEvent) => {
      setEditTask({
        rowId: null,
        inputType: (e.target as HTMLElement).dataset.id || null,
        xPos: null,
        yPos: null,
        xPosTouch: null,
        yPosTouch: null,
        showMenu:
          ((editTask.xPos && editTask.yPos) ||
            (editTask.xPosTouch && editTask.yPosTouch)) &&
          (e.target as HTMLButtonElement).dataset.id === 'status-cell'
            ? true
            : false,
      });
    },
    [
      editTask.xPos,
      editTask.xPosTouch,
      editTask.yPos,
      editTask.yPosTouch,
    ]
  );

  const outsideClickRef = useOutsideClick((e) =>
    handleOutsideClick(e)
  );

  const [, toggleModal, isModal] = useModal();

  useEffect(() => {
    if (editTask.showMenu || isModal) {
      document.body.classList.add('lockScroll');
      document.body.style.top = `-${window.scrollY}px`;
    }
    if (!editTask.showMenu && !isModal) {
      document.body.classList.remove('lockScroll');
      document.body.style.top = '';
    }

    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        isModal && hideModalHandler(e);
        editTask.showMenu &&
          setEditTask({ ...editTask, showMenu: false });
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const loadedTasks: Task[] = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const stringValue =
            key !== null ? localStorage.getItem(key) : null;
          if (stringValue !== null) {
            const task: Task = JSON.parse(stringValue);
            loadedTasks.push({
              id: key,
              status: task.status,
              priority: task.priority,
              description: task.description,
            });
          }
        }

        if (localStorage.length === 0) {
          const taskId = nanoid();

          localStorage.setItem(
            taskId,
            JSON.stringify({
              status: 'In Process',
              priority: 'A1',
              description: 'Planning and solitude',
            })
          );

          loadedTasks.push({
            id: taskId,
            status: 'In Process',
            priority: 'A1',
            description: 'Planning and solitude',
          });
        }

        if (localStorage.length < 16) {
          while (localStorage.length < 16) {
            const taskId = nanoid();

            localStorage.setItem(
              taskId,
              JSON.stringify({
                status: addFormData.status,
                priority: addFormData.priority,
                description: addFormData.description,
              })
            );

            loadedTasks.push({
              id: taskId,
              status: '',
              priority: '',
              description: '',
            });
          }
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
    };
    fetchTasks();
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
        };
        setEditFormData(newFormData);
      } else {
        const newFormData = {
          ...addFormData,
          letterPriority: '',
          numberPriority: '',
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
        handleFormSubmit={handleFormSubmit}
        editTask={editTask}
        rowId={editTask.rowId}
        inputType={editTask.inputType}
        xPos={editTask.xPos}
        yPos={editTask.yPos}
        showMenu={editTask.showMenu}
        outsideClickRef={outsideClickRef}
        tableRef={tableRef}
        setX={setX}
        setY={setY}
        tasks={tasks}
        taskDispatch={taskDispatch}
        handleEditTask={handleEditTask}
        editFormData={editFormData}
        setEditTask={setEditTask}
        handleEditFormKeyboard={handleEditFormKeyboard}
        isModal={isModal}
        toggleModal={toggleModal}
        hideModalHandler={hideModalHandler}
        setEditFormData={setEditFormData}
        handleMenuItemEvent={handleMenuItemEvent}
        addFormData={addFormData}
        setAddFormData={setAddFormData}
      />
    </div>
  );
};

export default App;
