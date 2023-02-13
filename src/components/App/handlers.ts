import { Task, TaskActionShape } from '../../ts/types';
import { ErrorsAndLoading } from '../../ts/interfaces';
import { TaskActionType } from '../../ts/enums';

export interface Options {
	taskDispatch: (a: TaskActionShape) => void;
	sortList: (a: Task[]) => void;
	setState: React.Dispatch<React.SetStateAction<ErrorsAndLoading>>;
	url: string | undefined;
}

export const fetchTasks = (
	taskDispatch: (a: TaskActionShape) => void,
	sortList: (a: Task[]) => void,
	setState: React.Dispatch<React.SetStateAction<ErrorsAndLoading>>,
	url: string | undefined
) => {
	return async () => {
		try {
			const response = await fetch(`${url}/tasks.json`);

			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const responseData = await response.json();
			const loadedTasks: Task[] = [];

			for (const key in responseData) {
				loadedTasks.push({
					id: key,
					status: responseData[key].status,
					priority: responseData[key].priority,
					description: responseData[key].description,
				});
			}

			sortList(loadedTasks);

			taskDispatch({
				type: TaskActionType.SET,
				data: loadedTasks,
			});
			setState({ isModal: false, isLoading: false, httpError: null });
		} catch (error) {
			if (error instanceof Error) {
				setState({
					isModal: false,
					isLoading: false,
					httpError: error.message,
				});
			} else {
				console.log('Unexpected error', error);
			}
		}
	};
};
