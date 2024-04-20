import { EditFormData, EditTask } from '../../ts/interfaces';
import { Task, TaskActionShape } from '../../ts/types';
import { handleFormSubmit, Options as AppOptions } from '../App/handlers';
import { ALLOWED_NUMBER_INPUT_KEYS } from '../../utilities/constants';

interface Options {
  inputType?: string | null;
  editFormData?: EditFormData;
  addFormData?: EditFormData;
  letterPriority?: string | null;
  numberPriority?: string | null;
  setEditFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
  setAddFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
  toggleModal: () => void;
  editTask?: EditTask;
  tasks?: Task[];
  taskDispatch?: React.Dispatch<TaskActionShape>;
}

export const letterPriorityHandler = (options: Options) => {
  const {
    inputType,
    editFormData,
    addFormData,
    numberPriority,
    setEditFormData,
    setAddFormData,
  }: Options = options;

  return (e: React.FormEvent<HTMLInputElement>) => {
    const letterPriority = (e.target as HTMLInputElement).value;

    const priority = (e.target as HTMLInputElement).value + numberPriority;

    if (inputType === 'priority-cell') {
      const newFormData: EditFormData = {
        ...editFormData,
        letterPriority,
        priority,
      };
      setEditFormData && setEditFormData(newFormData);
    } else {
      const newFormData: EditFormData = {
        ...addFormData,
        letterPriority,
        priority,
      };
      setAddFormData && setAddFormData(newFormData);
    }
  };
};

export const numberPriorityHandler = (options: Options) => {
  const {
    inputType,
    editFormData,
    addFormData,
    letterPriority,
    setEditFormData,
    setAddFormData,
  }: Options = options;

  return (e: React.FormEvent | React.KeyboardEvent<HTMLInputElement>) => {
    let numberPriority = Math.abs(
      Number((e.target as HTMLInputElement).value.slice(0, 2))
    ).toString();

    if (numberPriority === '0') numberPriority = '';
    if (!ALLOWED_NUMBER_INPUT_KEYS.includes((e as React.KeyboardEvent).key)) e.preventDefault();

    const priority = letterPriority + numberPriority;

    if (inputType === 'priority-cell') {
      const newFormData: EditFormData = {
        ...editFormData,
        numberPriority,
        priority,
      };
      setEditFormData && setEditFormData(newFormData);
    } else {
      const newFormData: EditFormData = {
        ...addFormData,
        numberPriority,
        priority,
      };
      setAddFormData && setAddFormData(newFormData);
    }
  };
};

const isFormValid = (e: React.MouseEvent<Element> | React.TouchEvent<Element>) => {
  const formControls: HTMLInputElement[] = Array.from((e.target as HTMLFormElement).form);
  for (let control of formControls) {
    if (
      control.getAttribute('name') === 'priority' &&
      control.value.length <= 2 &&
      /^([1-9]?|[1-9][0-9])?$/i.test(control.value)
    ) {
      return true;
    } else {
      continue;
    }
  }
  return false;
};

export const updatePriorityHandler = (options: Options) => {
  const {
    inputType,
    addFormData,
    setAddFormData,
    setEditFormData,
    toggleModal,
    editTask,
    editFormData,
    tasks,
    taskDispatch,
  }: Options = options;

  return (e: React.MouseEvent<Element> | React.TouchEvent<Element>) => {
    e.preventDefault();

    if (inputType === 'priority-cell') {
      isFormValid(e) && handleFormSubmit
        ? handleFormSubmit(e, { editTask, editFormData, tasks, taskDispatch } as AppOptions)
        : alert("Priority input's integer value is invalid.");

      const newFormData = {
        ...editFormData,
        letterPriority: '',
        numberPriority: '',
        priority: '',
      };
      setEditFormData && setEditFormData(newFormData);
    } else {
      const newFormData: EditFormData = {
        ...addFormData,
        priority: `${addFormData?.letterPriority}${addFormData?.numberPriority}`,
        letterPriority: '',
        numberPriority: '',
      };
      isFormValid(e) && setAddFormData
        ? setAddFormData(newFormData)
        : alert("Priority input's integer value is invalid.");
    }
    setTimeout(() => {
      toggleModal();
    }, 250);
  };
};
