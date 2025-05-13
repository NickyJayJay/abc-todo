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
    const descriptionA = a.description as string;
    const descriptionB = b.description as string;

    // 'Completed' (priority 8)
    if (statusA === 'Completed' && statusB !== 'Completed') return 1;
    if (statusA !== 'Completed' && statusB === 'Completed') return -1;

    // 'Forwarded' (priority 7)
    if (statusA === 'Forwarded' && statusB !== 'Forwarded') return 1;
    if (statusA !== 'Forwarded' && statusB === 'Forwarded') return -1;

    // blank tasks (priority 6)
    if ((descriptionA.length === 0 && priorityA === '' && (statusA === null || statusA === 'Select Status' || statusA === '')) && (descriptionB.length !== 0 || priorityB !== '' || (statusB !== null || statusB !== 'Select Status' || statusB !== ''))) return 1;
    if ((descriptionB.length === 0 && priorityB === '' && (statusB === null || statusB === 'Select Status' || statusB === '')) && (descriptionA.length !== 0 || priorityA !== '' || (statusA !== null || statusA !== 'Select Status' || statusA !== ''))) return -1;

    // no priority and no status (piority 5)
    if (priorityA === '' && priorityB !== '') return 1;
    if (priorityB === '' && priorityA !== '') return -1;

    // status without priority (priority 4)
    if (statusA === '' && statusB !== '') return 1;
    if (statusB === '' && statusA !== '') return -1;

    // priority letter (priority 3)
    if (letterA > letterB) return 1;
    if (letterA < letterB) return -1;

    // priority number (priority 2)
    if (priorityNumberA > priorityNumberB) return 1;
    if (priorityNumberA < priorityNumberB) return -1;

    // priority letter/number combinations (priority 1)
    if (priorityA.length === 1 && priorityB.length !== 1) return 1;
    if (priorityB.length === 1 && priorityA.length !== 1) return -1;

    return 0;
  });
};

export default sortList;
