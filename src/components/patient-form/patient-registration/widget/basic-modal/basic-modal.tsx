import React, { useState } from "react";
import { Button, ComposedModal, ModalBody, ModalFooter, ModalHeader } from "carbon-components-react";
import { useTranslation } from "react-i18next";
import styles from "./basic-modal.scss";
// import Trash from "@carbon/icons-react/es/trash-can/24";

export interface basicModalProps {
    onConfirmModal: () => void;
    state: boolean;
    onClose: (stat: boolean) => void;
    title: string;
    body: any;
    primaryButtonName?: string;
    secondaryButtonName?: string;
}

export const BasicModal: React.FC<basicModalProps> = ({
    onConfirmModal,
    state,
    onClose,
    title,
    body,
    primaryButtonName,
    secondaryButtonName
    }) => {
    const { t } = useTranslation();

    return (
        <>
            <div>
                <ComposedModal open={state} onClose={() => onClose(false)} className={styles.modal} containerClassName={styles.node} size='xs'>
                    <ModalHeader title={title} className={styles.header} />
                    <ModalBody className={styles.body} >
                       {body}
                    </ModalBody>
                    <ModalFooter className={styles.footer}>
                        <Button
                            //renderIcon={(props) => <Trash size={24} {...props} />}
                            className={styles.deleteButton}
                            kind="danger--tertiary"
                            isSelected={true}
                            onClick={e => {
                                onConfirmModal();
                            }}
                        >
                            {secondaryButtonName}
                        </Button>
                        <Button
                            className={styles.cancelButton}
                            kind="tertiary"
                            isSelected={true}
                            onClick={(e) => {
                                onClose(false)
                            }}
                        >
                            {primaryButtonName}
                        </Button>
                    </ModalFooter>
                </ComposedModal>
            </div>
        </>
    );
}
