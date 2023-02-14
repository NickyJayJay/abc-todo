import { EditFormData, ErrorsAndLoading } from '../../ts/interfaces';

interface Options {
	inputType?: string | null;
	editFormData?: EditFormData;
	addFormData?: EditFormData;
	letterPriority?: string | null;
	numberPriority?: string | null;
	setEditFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	setAddFormData?: React.Dispatch<React.SetStateAction<EditFormData>>;
	handleFormSubmit?: (e: React.FormEvent<Element>) => void;
	setState?: React.Dispatch<React.SetStateAction<ErrorsAndLoading>>;
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
		if (inputType === 'priority-cell') {
			const newFormData: EditFormData = {
				...editFormData,
				letterPriority: (e.target as HTMLInputElement).value,
				priority: (e.target as HTMLInputElement).value + numberPriority,
			};
			setEditFormData && setEditFormData(newFormData);
		} else {
			const newFormData = { ...addFormData };
			newFormData.letterPriority = (e.target as HTMLInputElement).value;
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

	return (e: React.FormEvent<HTMLInputElement>) => {
		if (inputType === 'priority-cell') {
			const newFormData: EditFormData = {
				...editFormData,
				numberPriority: Math.abs(
					Number((e.target as HTMLInputElement).value.slice(0, 2))
				).toString(),
				priority:
					(letterPriority as string) +
					parseInt((e.target as HTMLInputElement).value.slice(0, 2), 10),
			};
			setEditFormData && setEditFormData(newFormData);
		} else {
			const newFormData = { ...addFormData };
			newFormData.numberPriority = Math.abs(
				Number((e.target as HTMLInputElement).value.slice(0, 2))
			).toString();
			setAddFormData && setAddFormData(newFormData);
		}
	};
};

const isFormValid = (
	e: React.MouseEvent<Element> | React.TouchEvent<Element>
) => {
	const formControls: HTMLInputElement[] = Array.from(
		(e.target as HTMLFormElement).form
	);
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
		handleFormSubmit,
		setState,
	}: Options = options;

	return (e: React.MouseEvent<Element> | React.TouchEvent<Element>) => {
		e.preventDefault();

		if (inputType === 'priority-cell') {
			isFormValid(e) && handleFormSubmit
				? handleFormSubmit(e)
				: alert("Priority input's integer value is invalid.");
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
			setState &&
				setState({ isModal: false, isLoading: false, httpError: null });
		}, 250);
	};
};
