import React, { useState } from "react";
import { Button, ComposedModal, ModalBody, ModalFooter, ModalHeader } from "carbon-components-react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import styles from "./confirmation-modal.scss";

export interface ConfirmationModalProps {
    onConfirmModal:() => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = (props) => {
    const [showModal, setState] = useState(false)
    const { t } = useTranslation();
    return (
        <>

            <Icon
                icon="akar-icons:circle-minus-fill"
                inline={true}
                width="32"
                height="32"
                color="#699BF7"
                onClick={e => setState(true)
                }
            />


            <div>
                <ComposedModal open={showModal} className={styles.modal} containerClassName={styles.modal} size='xs'>
                    <ModalHeader  title={t("relationShipsModal","Supprimer une relation")} className={styles.header}/>
                    <ModalBody className={styles}>
                        <p >
                            {t("messageErrorModalRelationShips","Attention! Vous etes sur le point de supprimer une relation pour ce patient. Cette action est irreversible, voulez vous continuer?") }
                        </p>
                    </ModalBody>
                    <ModalFooter className={styles.footer}>
                        <Button
                            className={styles.cancelButton}
                            kind="tertiary"
                            isSelected={true}
                            onClick={e => setState(false)}
                        >
                            {t("cancelModalButton", "Annuler")}
                        </Button>
                        <Button
                            //renderIcon={(props) => <Trash size={24} {...props} />}
                            className={styles.deleteButton}
                            kind="danger--tertiary"
                            isSelected={true}
                            onClick={e => {
                                props.onConfirmModal();
                            }}
                        >
                            {t("confirmModalButton", "Supprimer")}
                        </Button>
                    </ModalFooter>
                </ComposedModal>
            </div>
        </>
    );
}
