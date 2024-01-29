import React, { RefObject, useRef, useEffect } from 'react';

import TableForm from '../TableForm/TableForm';
import AddTaskForm from '../AddTaskForm/AddTaskForm';
import Card from '../UI/Card/Card';
import classes from '../App/App.module.scss';
import { EditTask, EditFormData } from '../../ts/interfaces';
import { Task, TaskActionShape } from '../../ts/types';
import { handleMenuItemEvent } from '../UI/ContextMenu/handleMenuItemEvent';
import { PriorityContext } from '../../context/priority-context';
import UpdateTaskPriority from '../UpdateTaskPriority/UpdateTaskPriority';
import useModal from '../../hooks/useModal';
import { Options } from '../App/handlers';
interface Props {
  handleFormSubmit?: (e: React.FormEvent, options?: Options) => void;
  editTask: EditTask;
  rowId?: string | null;
  inputType?: string | null;
  xPos?: string | null;
  yPos?: string | null;
  showMenu?: boolean;
  outsideClickRef?: RefObject<HTMLTableSectionElement>;
  tasks: Task[];
  taskDispatch: React.Dispatch<TaskActionShape>;
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
  toggleModal: () => void;
  hideModalHandler: (
    e: React.MouseEvent | React.TouchEvent | KeyboardEvent
  ) => void;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
  handleMenuItemEvent: typeof handleMenuItemEvent;
  addFormData: EditFormData;
  setAddFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

const Main = ({
  handleFormSubmit,
  editTask,
  rowId,
  inputType,
  xPos,
  yPos,
  showMenu,
  outsideClickRef,
  tasks,
  taskDispatch,
  handleEditTask,
  editFormData,
  setEditTask,
  handleEditFormKeyboard,
  isModal,
  toggleModal,
  hideModalHandler,
  setEditFormData,
  handleMenuItemEvent,
  addFormData,
  setAddFormData,
}: Props) => {
  const priorityInput = useRef<HTMLInputElement>(null);
  const letterPriority =
    inputType === 'priority-cell'
      ? editFormData.letterPriority
      : addFormData.letterPriority;
  const numberPriority =
    inputType === 'priority-cell'
      ? editFormData.numberPriority
      : addFormData.numberPriority;

  useEffect(() => {
    inputType === 'priority-input' && priorityInput.current?.focus();
  }, [inputType, priorityInput]);

  const [Modal, ,] = useModal();

  let modal = isModal ? (
    <Modal role="dialog" hideModalHandler={hideModalHandler}>
      {(inputType === 'priority-cell' ||
        inputType === 'priority-input') && <UpdateTaskPriority />}
    </Modal>
  ) : null;

  return (
    <PriorityContext.Provider
      value={{
        inputType: inputType,
        editFormData: editFormData,
        setEditFormData: setEditFormData,
        addFormData: addFormData,
        setAddFormData: setAddFormData,
        letterPriority: letterPriority,
        numberPriority: numberPriority,
        toggleModal: toggleModal,
        editTask: editTask,
        tasks: tasks,
        taskDispatch: taskDispatch,
      }}
    >
      {modal}
      <Card className={`${classes.card} card`}>
        <TableForm
          handleFormSubmit={handleFormSubmit}
          editTask={editTask}
          xPos={xPos}
          yPos={yPos}
          rowId={rowId}
          showMenu={showMenu}
          outsideClickRef={outsideClickRef}
          tasks={tasks}
          taskDispatch={taskDispatch}
          handleEditTask={handleEditTask}
          editFormData={editFormData}
          setEditTask={setEditTask}
          handleEditFormKeyboard={handleEditFormKeyboard}
          isModal={isModal}
          setEditFormData={setEditFormData}
          handleMenuItemEvent={handleMenuItemEvent}
          toggleModal={toggleModal}
        />
        <AddTaskForm
          addFormData={addFormData}
          ref={priorityInput}
          taskDispatch={taskDispatch}
          setAddFormData={setAddFormData}
          inputType={inputType}
          toggleModal={toggleModal}
        />
      </Card>
    </PriorityContext.Provider>
  );
};

export default Main;
