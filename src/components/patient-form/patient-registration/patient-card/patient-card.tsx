import React from "react";
import { Column, Grid, Row, Tile } from "carbon-components-react";
import { Icon } from '@iconify/react';
import styles from './patient-card.scss';

const PatientCard = ({ Patient }) => {
    return (
        <Tile className={styles.cardBox} light={true}>
            <Grid className={styles.pm0} fullWidth={true}>
                <Row className={styles.pm0}>
                    {/* Partie reserve pour mettre la photo */}
                    <Column className={styles.patientPhoto} lg={1}>
                        <p className={styles.alias} >LS</p>
                    </Column>
                    {/* Partie reserve pour les infos */}
                    <Column className={styles.pm0} lg={11}>
                        <Grid className={styles.pm0} fullWidth={true}>
                            <Column lg={12}>
                                <Row className={styles.borderBottom}>
                                    <Column className={styles.pm0} lg={6} >
                                        <h1 className={styles.name}>
                                            {(Patient.gender === "female") ?
                                                <Icon icon="emojione-monotone:woman" className={styles.iconHead} />
                                                : null}
                                            {(Patient.gender === "male") ?
                                                <Icon icon="emojione-monotone:man" className={styles.iconHead} />
                                                : null}
                                            {Patient.firstName} <span>{Patient.lastName}</span></h1>
                                    </Column>
                                    <Column className={styles.pm0} lg={6}><h1 className={`${styles.align} ${styles.pm0}`}><Icon icon="ant-design:field-number-outlined" className={styles.iconHead} /> 						{Patient.No_dossier}</h1></Column>
                                </Row>
                            </Column>

                            <Row>
                                <Column lg={4}>
                                    <Column >
                                        <p> <Icon icon="clarity:calendar-solid" className={styles.icon} /> {Patient.birth}</p></Column>
                                    <Column><p><Icon icon="entypo:location-pin" className={styles.icon} /> {Patient.residence}</p></Column>
                                    <Column><p><Icon icon="bxs:building" className={styles.icon} /> {Patient.habitat}</p></Column>
                                </Column>

                                <Column lg={3}>
                                    <Column><p></p></Column>
                                    <Column><p><Icon icon="carbon:user-multiple" className={styles.icon} />{Patient.matrimonial}</p></Column>
                                    <Column><p><Icon icon="ic:outline-work" className={styles.icon} />{Patient.occupation}</p></Column>
                                </Column>

                                <Column lg={3}>
                                    <Column><p><Icon icon="bxs:phone-call" className={styles.icon} /> +509 3128 00 00</p></Column>
                                    <Column><p><Icon icon="fxemoji:email" className={styles.icon} /> louisshacha@gmail.com</p></Column>
                                    <Column><p><Icon icon="akar-icons:link-chain" className={styles.icon} />Show relationships</p></Column>
                                </Column>

                                <Column lg={2}>
                                    <Column className={`${styles.pm0} ${styles.borderLeft}`}>
                                        <Icon icon="fluent:heart-pulse-20-filled"  className={styles.heartStyle} />
                                    </Column>
                                </Column>
                            </Row>
                        </Grid>
                    </Column>
                </Row>
            </Grid>
        </Tile>
    );
}

export default PatientCard;
