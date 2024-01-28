import React, { RefObject, useEffect } from 'react';

import DescriptionEditable from '../Cells/DescriptionEditable';
import Status from '../Cells/Status';
import Priority from '../Cells/Priority';
import DescriptionReadOnly from '../Cells/DescriptionReadOnly';
import ContextMenu from '../UI/ContextMenu/ContextMenu';
import checkBox from '../../assets/SVG/checkBox.svg';
import classes from '../App/App.module.scss';
import { EditTask, EditFormData } from '../../ts/interfaces';
import { Task, TaskActionShape } from '../../ts/types';
import { handleMenuItemEvent } from '../UI/ContextMenu/handleMenuItemEvent';
import { Options } from '../App/handlers';
import useMenuCoords from '../../hooks/useMenuCoords';

interface Props {
  handleFormSubmit?: (e: React.FormEvent, options?: Options) => void;
  editTask: EditTask;
  xPos?: string | null;
  yPos?: string | null;
  rowId?: string | null;
  showMenu?: boolean;
  outsideClickRef?: RefObject<HTMLTableSectionElement>;
  tasks: Task[];
  taskDispatch?: React.Dispatch<TaskActionShape>;
  handleEditTask?: (
    e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
    options?: Options
  ) => void;
  editFormData: EditFormData;
  setEditTask: React.Dispatch<React.SetStateAction<EditTask>>;
  handleEditFormKeyboard?: (
    e: React.KeyboardEvent,
    options?: Options
  ) => void;
  isModal?: boolean;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
  handleMenuItemEvent: typeof handleMenuItemEvent;
  toggleModal: () => void;
}

const TableForm = ({
  handleFormSubmit,
  editTask,
  xPos,
  yPos,
  rowId,
  showMenu,
  outsideClickRef,
  tasks,
  taskDispatch,
  handleEditTask,
  editFormData,
  setEditTask,
  handleEditFormKeyboard,
  isModal,
  setEditFormData,
  handleMenuItemEvent,
  toggleModal,
}: Props) => {
  useEffect(() => {
    const handleResize = () => {
      setEditTask({ ...editTask, showMenu: false });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [setX, setY, tableRef] = useMenuCoords();

  return (
    <form onSubmit={handleFormSubmit}>
      {showMenu && (
        <ContextMenu
          xPos={xPos}
          yPos={yPos}
          rowId={rowId}
          editTask={editTask}
          tasks={tasks}
          taskDispatch={taskDispatch!}
          editFormData={editFormData!}
          setEditTask={setEditTask!}
          setEditFormData={setEditFormData!}
          handleMenuItemEvent={handleMenuItemEvent}
        />
      )}
      <table ref={tableRef}>
        <thead>
          <tr>
            <th className={classes.statusTitle}>
              <img src={checkBox} alt="status icon" />
            </th>
            <th className={classes.priorityTitle}>ABC</th>
            <th className={classes.descriptionTitle}>
              Prioritized Task List
            </th>
          </tr>
        </thead>
        <tbody ref={outsideClickRef}>
          {tasks!.map((task) => (
            <tr
              key={task.id}
              className={
                task.status === 'Delegated'
                  ? classes.delegated
                  : '' || task.status === 'Completed'
                  ? classes.completed
                  : '' || task.status === 'Forwarded'
                  ? classes.forwarded
                  : ''
              }
            >
              <Status
                task={task}
                handleEditTask={handleEditTask!}
                editTask={editTask!}
                toggleModal={toggleModal}
                setEditTask={setEditTask}
                setX={setX}
                setY={setY}
                setEditFormData={setEditFormData}
              />
              <Priority
                task={task}
                handleEditTask={handleEditTask!}
                handleEditFormKeyboard={handleEditFormKeyboard!}
                isModal={isModal!}
                editTask={editTask!}
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                tasks={tasks}
                taskDispatch={taskDispatch}
                toggleModal={toggleModal}
                setEditTask={setEditTask}
              />
              {editTask!.inputType === 'description-cell' &&
              rowId === task.id ? (
                <DescriptionEditable
                  handleFormSubmit={handleFormSubmit!}
                  handleEditFormKeyboard={handleEditFormKeyboard!}
                  taskId={task.id}
                  rowId={rowId}
                  inputType={editTask!.inputType}
                  taskDescription={editFormData!.description}
                  editFormData={editFormData}
                  setEditFormData={setEditFormData}
                  editTask={editTask}
                  tasks={tasks}
                  taskDispatch={taskDispatch}
                />
              ) : (
                <DescriptionReadOnly
                  task={task}
                  handleEditTask={handleEditTask!}
                  toggleModal={toggleModal}
                  setEditTask={setEditTask}
                  setEditFormData={setEditFormData}
                />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
};

export default TableForm;
