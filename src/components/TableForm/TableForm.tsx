import { useEffect, useContext } from 'react';

import { MainContext } from '../../context/main-context';
import DescriptionEditable from '../Cells/DescriptionEditable';
import Status from '../Cells/Status';
import Priority from '../Cells/Priority';
import DescriptionReadOnly from '../Cells/DescriptionReadOnly';
import ContextMenu from '../UI/ContextMenu/ContextMenu';
import checkBox from '../../assets/SVG/checkBox.svg';
import classes from '../App/App.module.scss';
import useMenuCoords from '../../hooks/useMenuCoords';

const TableForm = () => {
  const { editTask, tasks, rowId, showMenu, outsideClickRef, setEditTask } =
    useContext(MainContext);

  useEffect(() => {
    const handleResize = () => {
      setEditTask({ ...editTask, showMenu: false });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [editTask]);

  const { setX, setY, tableRef } = useMenuCoords();

  return (
    <form>
      {showMenu && <ContextMenu />}
      <table ref={tableRef}>
        <thead>
          <tr>
            <th className={classes.statusTitle}>
              <img src={checkBox} alt='status icon' />
            </th>
            <th className={classes.priorityTitle}>ABC</th>
            <th className={classes.descriptionTitle}>Prioritized Task List</th>
          </tr>
        </thead>
        <tbody ref={outsideClickRef}>
          {tasks!.map((task) => {
            if (!showMenu) {
              task.previewStatus = '';
            }

            return (
              <tr
                key={task.id}
                className={`
                ${task.previewStatus === 'Remove' ? classes.remove : ''}
                ${(task.status === 'Completed' && !task.previewStatus) || task.previewStatus === 'Completed' ? classes.completed : ''}
                ${(task.status === 'Forwarded' && !task.previewStatus) || task.previewStatus === 'Forwarded' ? classes.forwarded : ''}
              `}
              >
                <Status task={task} setX={setX} setY={setY} />
                <Priority task={task} />
                {editTask!.inputType === 'description-cell' &&
                  task.status !== 'Completed' &&
                  task.status !== 'Forwarded' &&
                  rowId === task.id ? (
                  <DescriptionEditable task={task} />
                ) : (
                  <DescriptionReadOnly task={task} />
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </form>
  );
};

export default TableForm;
