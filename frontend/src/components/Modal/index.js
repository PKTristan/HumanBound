import Modal from "react-modal";
import { useState } from "react";
import './Modal.css';

const InterimModal = ({ Component, btnLabel, btnClass, isHidden, params }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = (e) => {
        e.preventDefault();
        setIsOpen(true);
    };

    const handleClose = (e) => {
        e.preventDefault();
        setIsOpen(false);

    }

    const style = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
    };


    return (
        <>
            <button className={btnClass || 'open-modal'} hidden={isHidden} onClick={handleOpen}>{btnLabel}</button>

            <Modal isOpen={isOpen} className="modal" style={style}>
                <button className="exit-modal" onClick={handleClose} >X</button>
                <Component params={params} setIsOpen={setIsOpen} />
            </Modal>
        </>
    );
}


export default InterimModal;
