import { ChangeEvent, createContext } from 'react';

interface PriorityContextShape {
	letterPriority: string;
	numberPriority: string;
	editMode: string | null | undefined;
	updatePriorityHandler: (e: React.MouseEvent<Element, MouseEvent>) => void;
	letterPriorityHandler: (e: React.FormEvent<HTMLInputElement>) => void;
	numberPriorityHandler: (e: React.FormEvent<HTMLInputElement>) => void;
	handleEditFormSubmit: (e: React.FormEvent) => void;
	handleAddFormChange: (
		e: ChangeEvent<Element> | React.FormEvent<HTMLFormElement>
	) => void;
}

export const PriorityContext = createContext({} as PriorityContextShape);
