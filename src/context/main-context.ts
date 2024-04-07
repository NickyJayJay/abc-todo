import { createContext, RefObject } from 'react';
import { EditFormData, EditTask } from '../ts/interfaces';
import { Task, TaskActionShape } from '../ts/types';

interface MainContextShape {
  addFormData: EditFormData;
  editFormData: EditFormData;
  editTask: EditTask;
  handleFormSubmit?: (e: React.FormEvent) => void;
  inputType?: string | null;
  isModal?: boolean;
  letterPriority?: string;
  numberPriority?: string;
  outsideClickRef?: RefObject<HTMLTableSectionElement>;
  rowId?: string | null;
  setAddFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
  setEditFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
  setEditTask: React.Dispatch<React.SetStateAction<EditTask>>;
  showMenu?: boolean;
  taskDispatch: React.Dispatch<TaskActionShape>;
  tasks: Task[];
  toggleModal: () => void;
  xPos?: string | null;
  yPos?: string | null;
}

export const MainContext = createContext({} as MainContextShape);
