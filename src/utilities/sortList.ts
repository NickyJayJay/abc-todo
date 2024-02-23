import { Task } from '../ts/types';

const sortList = (loadedTasks: Task[]) => {
  loadedTasks.sort((a: Task, b: Task) => {
    const priorityA = a.priority as string;
    const priorityB = b.priority as string;
    const statusA = a.status as string;
    const statusB = b.status as string;
    const [letterA, numA] = priorityA.split(/([0-9]{1,2})/);
    const [letterB, numB] = priorityB.split(/([0-9]{1,2})/);
    const priorityNumberA = Number(numA);
    const priorityNumberB = Number(numB);

    if (statusA === 'Completed' && statusB !== 'Completed') return 1;
    if (statusA !== 'Completed' && statusB === 'Completed') return -1;

    if (statusA === 'Forwarded' && statusB !== 'Forwarded') return 1;
    if (statusA !== 'Forwarded' && statusB === 'Forwarded') return -1;

    if (priorityA === '' && priorityB !== '') return 1;
    if (priorityB === '' && priorityA !== '') return -1;

    if (letterA > letterB) return 1;
    if (letterA < letterB) return -1;

    if (priorityNumberA > priorityNumberB) return 1;
    if (priorityNumberA < priorityNumberB) return -1;

    if (priorityA.length === 1 && priorityB.length !== 1) return 1;
    if (priorityB.length === 1 && priorityA.length !== 1) return -1;

    return 0;
  });
};

export default sortList;
