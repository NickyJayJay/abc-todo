import React, { createContext } from 'react';
import useModal from '../../../hooks/useModal';
import Modal from './Modal';

let ModalContext: any;
ModalContext = createContext('');

interface Props {
	children: string | JSX.Element;
}

let ModalProvider = ({ children }: Props) => {
	let { modal, handleModal, modalContent } = useModal();
	return (
		<ModalContext.Provider value={{ modal, handleModal, modalContent }}>
			<Modal />
			{children}
		</ModalContext.Provider>
	);
};

export { ModalContext, ModalProvider };
