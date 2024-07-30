import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FocusLock from 'react-focus-lock';

import classes from '../components/UI/Modal/Modal.module.scss';
import Card from '../components/UI/Card/Card';
import Close from '../assets/SVG/close.svg';

type Props = {
  children: React.ReactNode;
  role?: string;
  callback: (e?: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => void;
  isVisible: boolean;
};

const useModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalRendered, setIsModalRendered] = useState(false);

  const showModal = () => {
    setIsModalRendered(true);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 10);
  };

  const hideModal = (e?: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    setIsModalVisible(false);
    setTimeout(() => {
      setIsModalRendered(false);
    }, 250);
  };

  useEffect(() => {
    if (isModalRendered) {
      document.body.classList.add('lockScroll');
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      document.body.classList.remove('lockScroll');
      document.body.style.top = '';
    }
  }, [isModalRendered]);

  const Modal = useCallback(({ children, role, callback, isVisible }: Props) => {
    return (
      <>
        {ReactDOM.createPortal(
          <div
            className={classes.backdrop}
            onClick={(e) => callback(e)}
            onTouchStart={(e) => callback(e)}
          ></div>,
          document.getElementById('backdrop-root')!
        )}
        {ReactDOM.createPortal(
          <Card
            className={`${classes.modal} ${isVisible ? classes.visible : ''} ${classes.active}`}
            role={role}
          >
            <FocusLock returnFocus>
              <button
                className={classes.closeModal}
                tab-index='0'
                onClick={(e) => callback(e)}
                onTouchStart={(e) => callback(e)}
              >
                <img src={Close} alt='close icon' />
              </button>
              {children}
            </FocusLock>
          </Card>,
          document.getElementById('overlay-root')!
        )}
      </>
    );
  }, []);

  return {
    Modal,
    hideModal,
    showModal,
    isModalVisible,
    isModalRendered,
  };
};

export default useModal;
