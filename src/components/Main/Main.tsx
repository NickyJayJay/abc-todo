import React, { RefObject, useRef, useEffect } from 'react';

import TableForm from '../TableForm/TableForm';
import AddTaskForm from '../AddTaskForm/AddTaskForm';
import Card from '../UI/Card/Card';
import classes from '../App/App.module.scss';
import { EditTask, EditFormData } from '../../ts/interfaces';
import { Task, TaskActionShape } from '../../ts/types';
import { MainContext } from '../../context/main-context';
import UpdateTaskPriority from '../UpdateTaskPriority/UpdateTaskPriority';
import useModal from '../../hooks/useModal';

interface Props {
  editTask: EditTask;
  rowId?: string | null;
  inputType?: string | null;
  xPos?: string | null;
  yPos?: string | null;
  showMenu?: boolean;
  outsideClickRef?: RefObject<HTMLTableSectionElement>;
  tasks: Task[];
  taskDispatch: React.Dispatch<TaskActionShape>;
  editFormData: EditFormData;
  setEditTask: React.Dispatch<React.SetStateAction<EditTask>>;
  isModal?: boolean;
  toggleModal: () => void;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
  addFormData: EditFormData;
  setAddFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
}

const Main = ({
  editTask,
  rowId,
  inputType,
  xPos,
  yPos,
  showMenu,
  outsideClickRef,
  tasks,
  taskDispatch,
  editFormData,
  setEditTask,
  isModal,
  toggleModal,
  setEditFormData,
  addFormData,
  setAddFormData,
}: Props) => {
  const priorityInput = useRef<HTMLInputElement>(null);
  const letterPriority =
    inputType === 'priority-cell' ? editFormData.letterPriority : addFormData.letterPriority;
  const numberPriority =
    inputType === 'priority-cell' ? editFormData.numberPriority : addFormData.numberPriority;

  useEffect(() => {
    inputType === 'priority-input' && priorityInput.current?.focus();
  }, [inputType, priorityInput]);

  const { Modal } = useModal();

  let modal = isModal ? (
    <Modal role='dialog' callback={toggleModal}>
      {(inputType === 'priority-cell' || inputType === 'priority-input') && <UpdateTaskPriority />}
    </Modal>
  ) : null;

  return (
    <MainContext.Provider
      value={{
        inputType,
        editFormData,
        setEditFormData,
        addFormData,
        setAddFormData,
        letterPriority,
        numberPriority,
        toggleModal,
        editTask,
        tasks,
        taskDispatch,
        xPos,
        yPos,
        rowId,
        showMenu,
        outsideClickRef,
        setEditTask,
        isModal,
      }}
    >
      {modal}
      <Card className={`${classes.card} card`}>
        <TableForm />
        <AddTaskForm ref={priorityInput} />
      </Card>
    </MainContext.Provider>
  );
};

export default Main;
