import Modal from "react-modal";
import { useState } from "react";
import './Modal.css';

const InterimModal = ({ Component, btnLabel, btnClass, isHidden, onClose=null, setOpen=false, params }) => {
    const [isOpen, setIsOpen] = useState(setOpen);

    const handleOpen = (e) => {
        e.preventDefault();
        setIsOpen(true);
    };

    const handleClose = (e) => {
        e.preventDefault();
        if (onClose) {
            onClose.forEach(fn => fn());
        }
        setIsOpen(false);

    }

    const style = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
    };


    return (
        <>
            <button className={btnClass || 'open-modal'} hidden={isHidden || false} onClick={handleOpen}>{btnLabel || 'Open Modal'}</button>

            <Modal isOpen={isOpen} className="modal" style={style}>
                <button className="exit-modal" onClick={handleClose} >X</button>
                <Component params={params} setIsOpen={setIsOpen} />
            </Modal>
        </>
    );
}


export default InterimModal;
