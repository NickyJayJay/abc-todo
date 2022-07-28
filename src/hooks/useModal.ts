import React from 'react';

export default () => {
	let [modal, setModal] = React.useState(false);
	let [modalContent, setModalContent] = React.useState(null);

	let handleModal = (content: any, by = false) => {
		setModal(!modal);
		if (content) {
			setModalContent(content);
		}
	};

	return { modal, handleModal, modalContent };
};
