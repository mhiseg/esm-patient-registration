import { ModalFooter, ComposedModal, Button, ModalHeader, ModalBody } from "carbon-components-react"
import React, { useState } from "react"
import ReactDOM from "react-dom";




const ConfirmationModal = () => {
    return (
        <>
            <ComposedModal>
                <ModalHeader>
                    <p>Header modal</p>
                </ModalHeader>
                <ModalBody>
                    <p>Voulez-vous tuer ce patient </p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        kind="secondary"
                        onClick={() => { "setOpen(false);" }}>
                        Accepter
                    </Button>
                    <Button
                        kind="primary"
                        onClick={() => { "setOpen(false);" }}>
                        Annuler
                    </Button>
                </ModalFooter>
            </ComposedModal>
        </>
    );

}

function ModalStateManager() {
    const [open, setOpen] = useState(false);
    return (
        <>
            {typeof document === 'undefined'
                ? null
                : ReactDOM.createPortal(
                    <ComposedModal open={open} onClose={() => setOpen(false)}>
                        ...
                    </ComposedModal>,
                    document.body
                )}
            <Button kind="primary" onClick={() => setOpen(true)}>
                Open modal
            </Button>
        </>
    );
}

export default ConfirmationModal;

