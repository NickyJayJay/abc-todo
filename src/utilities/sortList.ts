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

    // 'Completed' at very bottom of list
    if (statusA === 'Completed' && statusB !== 'Completed') return 1;
    if (statusA !== 'Completed' && statusB === 'Completed') return -1;

    // 'Forwarded' second from bottom of list
    if (statusA === 'Forwarded' && statusB !== 'Forwarded') return 1;
    if (statusA !== 'Forwarded' && statusB === 'Forwarded') return -1;

    // no priority and no status third from bottom of list
    if (priorityA === '' && priorityB !== '') return 1;
    if (priorityB === '' && priorityA !== '') return -1;

    // status without priority fourth from bottom of list
    if (statusA === '' && statusB !== '') return 1;
    if (statusB === '' && statusA !== '') return -1;

    // priority letter sorts in ascending order
    if (letterA > letterB) return 1;
    if (letterA < letterB) return -1;

    // priority number sorts in ascending order
    if (priorityNumberA > priorityNumberB) return 1;
    if (priorityNumberA < priorityNumberB) return -1;

    // priority letter/number combinations appear above letters without number
    if (priorityA.length === 1 && priorityB.length !== 1) return 1;
    if (priorityB.length === 1 && priorityA.length !== 1) return -1;

    return 0;
  });
};

export default sortList;
