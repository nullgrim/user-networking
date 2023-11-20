import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ onClose, children, buttonOnlyDismiss, props }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const modalRef = useRef(null);

    const handleClose = useCallback((e) => {
        e.preventDefault();
        onClose()
    }, [onClose])

    const handleClickOutside = useCallback((e) => {
        if (!modalRef?.current?.contains(e.target) && !buttonOnlyDismiss) {
            handleClose(e)
        }
    }, [buttonOnlyDismiss, handleClose]);

    useEffect(() => {
        setModalOpen(true)
        setTimeout(() => {
            window.addEventListener('click', handleClickOutside);
            document.body.style.overflow = 'hidden';
        })

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('click', handleClickOutside);
        };
    }, [handleClickOutside]);

    return ReactDOM.createPortal(
        <section className={`select-none fixed inset-0 flex items-center justify-center backdrop-blur-sm h-screen w-full z-[999] bg-dark-900/30 transition-opacity duration-500 ease-in-out ${modalOpen ? "opacity-100" : "opacity-0"}`}>
            <div ref={modalRef} className="overflow-y-auto relative p-4 md:p-6 gap-3 bg-dark-800 rounded-xl flex flex-col min-w-[300px] sm:max-h-[90%] w-[90%] sm:w-[75%] md:w-[60%] lg:w-1/2 xl:w-1/3 2xl:w-[30%] relative overflow-hidden border-2 border-white/30">
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { onClose, props });
                    } else {
                        return child;
                    }
                })}
            </div>
        </section>,
        document.body
    );
};

export default Modal;
