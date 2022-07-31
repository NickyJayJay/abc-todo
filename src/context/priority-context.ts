import { RefObject, ChangeEvent, createContext } from 'react';

interface PriorityContext {
	letterPriority: string;
	numberPriority: string;
	editMode: string | null | undefined;
	priorityInput: RefObject<HTMLInputElement>;
	updatePriorityHandler: (e: React.MouseEvent<Element, MouseEvent>) => void;
	letterPriorityHandler: (e: React.FormEvent<HTMLInputElement>) => void;
	numberPriorityHandler: (e: React.FormEvent<HTMLInputElement>) => void;
	handleEditFormSubmit: (e: React.FormEvent) => void;
	handleAddFormChange: (
		e: ChangeEvent<Element> | React.FormEvent<HTMLFormElement>
	) => void;
}

export const PriorityContext = createContext({} as PriorityContext);
