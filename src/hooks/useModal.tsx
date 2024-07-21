import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FocusLock from 'react-focus-lock';

import classes from '../components/UI/Modal/Modal.module.scss';
import Card from '../components/UI/Card/Card';
import Close from '../assets/SVG/close.svg';

type Props = {
  children: React.ReactNode;
  role?: string;
  callback: () => void;
};

const useModal = () => {
  const [isModal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!isModal);
  };

  useEffect(() => {
    if (isModal) {
      document.body.classList.add('lockScroll');
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      document.body.classList.remove('lockScroll');
      document.body.style.top = '';
    }
  }, [isModal]);

  const Modal = useCallback(({ children, role, callback }: Props) => {
    return (
      <>
        {ReactDOM.createPortal(
          <div
            className={classes.backdrop}
            onClick={() => callback()}
            onTouchStart={() => callback()}
          ></div>,
          document.getElementById('backdrop-root')!
        )}
        {ReactDOM.createPortal(
          <div onClick={(e) => e.stopPropagation()}>
            <Card className={`${classes.modal} ${classes.active}`} role={role}>
              <FocusLock returnFocus>
                <button
                  className={classes.closeModal}
                  tab-index='0'
                  onClick={() => callback()}
                  onTouchStart={() => callback()}
                >
                  <img src={Close} alt='close icon' />
                </button>
                {children}
              </FocusLock>
            </Card>
          </div>,
          document.getElementById('overlay-root')!
        )}
      </>
    );
  }, []);

  return { Modal, toggleModal, isModal };
};

export default useModal;
