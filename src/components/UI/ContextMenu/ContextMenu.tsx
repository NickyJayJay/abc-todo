import { useContext } from 'react';
import FocusLock from 'react-focus-lock';
import classes from './ContextMenu.module.scss';
import checkmark from '../../../assets/SVG/checkmark-green.svg';
import add from '../../../assets/SVG/add.svg';
import arrowRight from '../../../assets/SVG/arrow-right.svg';
import dot from '../../../assets/SVG/dot.svg';
import trash from '../../../assets/SVG/trash.svg';
import close from '../../../assets/SVG/close-regular.svg';
import sortList from '../../../utilities/sortList';
import { handleMenuItemEvent } from './handleMenuItemEvent';
import { MainContext } from '../../../context/main-context';
import MenuItem from './MenuItem';

const ContextMenu = () => {
  const {
    xPos,
    yPos,
    editTask,
    rowId,
    tasks,
    taskDispatch,
    editFormData,
    setEditTask,
    setEditFormData,
  } = useContext(MainContext);

  const dependencies = {
    xPos,
    yPos,
    editTask,
    rowId,
    tasks,
    taskDispatch,
    editFormData,
    setEditTask,
    setEditFormData,
    sortList,
  };

  return (
    <FocusLock returnFocus>
      <div
        role='menu'
        className={`${classes.contextMenu} card`}
        style={{
          top: yPos as string,
          left: xPos as string,
        }}
      >
        <ul onTouchStart={(event) => event.stopPropagation()}>
          <MenuItem
            status='In Process'
            src={dot}
            alt='in process icon'
            onClick={handleMenuItemEvent(dependencies)}
          />
          <MenuItem
            status='Completed'
            src={checkmark}
            alt='completed icon'
            onClick={handleMenuItemEvent(dependencies)}
          />
          <MenuItem
            status='Forwarded'
            src={arrowRight}
            alt='forwarded icon'
            onClick={handleMenuItemEvent(dependencies)}
          />
          <MenuItem
            status='Delegated'
            src={add}
            alt='delegated icon'
            onClick={handleMenuItemEvent(dependencies)}
          />
          <MenuItem
            status='Remove'
            src={trash}
            alt='removed icon'
            onClick={handleMenuItemEvent(dependencies)}
          />
          {/* <MenuItem
            status="Cancel"
            src={close}
            alt="close icon"
            onClick={handleMenuItemEvent(dependencies)}
          /> */}
        </ul>
      </div>
    </FocusLock>
  );
};

export default ContextMenu;
