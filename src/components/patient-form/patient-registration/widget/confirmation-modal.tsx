import React from "react";
import { useTranslation } from "react-i18next";
import { BasicModal } from "./basic-modal/basic-modal";


export interface ConfirmationModalProps {
    conFirmModal: any;
    closeModal: any;
    modalState: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ conFirmModal, closeModal,modalState }) => {
    const { t } = useTranslation();

    return (
        <>
            <BasicModal
                onConfirmModal={conFirmModal}
                state={modalState}
                onClose={closeModal}
                title={t("relationShipsModal", "Supprimer une relation")}
                body={
                    <p >
                        {t("messageErrorModalRelationShips", "Attention! Vous etes sur le point de supprimer une relation pour ce patient. Cette action est irreversible, voulez vous continuer?")}
                    </p>
                }
                primaryButtonName={t("cancelModalButton", "Annuler")}
                secondaryButtonName={t("confirmModalButton", "Supprimer")}
            />
        </>
    );
}