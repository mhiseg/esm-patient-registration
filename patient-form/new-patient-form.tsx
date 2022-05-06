import React, { useState } from "react";
import {
    Button,
    ButtonSet,
    Column, DatePicker, DatePickerInput,
    Dropdown, Form, FormGroup, Grid, RadioButton,
    RadioButtonGroup, Row, Select, SelectItem, SelectItemGroup, TextInput, Tile
} from "carbon-components-react";
import styles from "./new-patient-form.scss"
import { NumberInput } from "carbon-components-react/lib/components/NumberInput/NumberInput";
import { Icon } from '@iconify/react';
import { Field, FieldArray, Formik } from "formik";
import * as Yup from "yup";
import SearchAutocomplete from "../autocomplete/Autocomplete"
import { PhoneField } from "../patient-form/patient-registration/field/phone/phone-field.component"

const PatientFormRegistry = () => {

    function today() {
        return new Date().toLocaleDateString("fr");
    }

    const [visibility, setVisibility] = useState("hidden")

    const handleChangeVisibility = (e) => {
        setVisibility("visible");
        console.log("updated")
    }

    const [prenomRefValue, setPrenomRef] = useState()

    const handleChangePrenom = (e) => {
        // const entree = e.target.value;
        // entree ? setPrenomRef("true"):setPrenomRef(false)
        // ;
        // console.log(entree)
    }
    const [nomRefValue, setNomRef] = useState()

    const handleChangeNom = (e) => {
        // setNomRef(true);
        // console.log("updated")
    }
    const [telRefValue, setphoneRef] = useState()

    const handleChangePhone = (e) => {
        // setphoneRef(true);
        // console.log("updated")
    }

    const [initialV, setInitiatV] = useState({
        personne: [{ prenomRef: "", nomRef: "", telRef: "" }],
        typeIdentifiant: "",
        prenom: "",
        dob: "",
        statu: "",
        sexe: "Masculin",
        deptCommnune: "",
        domicile: "",
        numeroIdentifiant: "",
        nom: "",
        metier: "",
        section: "",
        adresse: "",
        telephone: "",
        habitat: "",
        prenomRef: "",
        nomRef: "",
        telRef: ""
    });

    const patientSchema = Yup.object().shape({
        typeIdentifiant: Yup.string(),
        prenom: Yup.string().required("Le prenom ne peut pas etre vide"),
        dob: Yup.date(),
        statu: Yup.string(),
        sexe: Yup.string(),
        deptCommnune: Yup.string(),
        domicile: Yup.string(),
        numeroIdentifiant: Yup.string(),
        nom: Yup.string().required("Le nom ne peut pas etre vide"),
        metier: Yup.string(),
        section: Yup.string(),
        adresse: Yup.string(),
        telephone: Yup.string(),

        personne: Yup.array(
            Yup.object({
                prenomRefValue: Yup.boolean(),
                nomRefValue: Yup.boolean(),
                telRefValue: Yup.boolean(),
                prenomRef: Yup.string().when('prenomRefValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
                nomRef: Yup.string().when('nomRefValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
                telRef: Yup.string().when('telRefValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') })
            })
        )
    });






    return (
        <Formik
            initialValues={initialV}
            validationSchema={patientSchema}
            onSubmit={(values) => {
                console.log(values);
                alert("Form is validated! Submitting the form...");
            }
            }

        >
            {(formik) => {
                const {
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    handleBlur,
                    setFieldValue,
                    isValid,
                    dirty,
                    setValues
                } = formik;
                return (
                    <Form className={styles.cardForm} onSubmit={handleSubmit}>
                        <Grid fullWidth={true}>
                            <Row >
                                <Column className={styles.firstColSyle} lg={6}>
                                    <div>
                                        <Select
                                            className={styles.marginSelect}
                                            defaultValue={values.typeIdentifiant}
                                            id="selecttypeIdentifiant"
                                            name="typeIdentifiant"
                                            size="md"
                                            light={true}
                                            hideLabel={true}
                                            value={values.typeIdentifiant}
                                            onChange={handleChange}
                                        >

                                            <SelectItem
                                                text="Carte d'identification nationale"
                                                value="CIN"
                                            />
                                            <SelectItem
                                                text="Numero d'identification fiscal"
                                                value="NIF"
                                            />

                                        </Select>
                                    </div>

                                    <TextInput
                                        className={styles.marginItem}
                                        id="patientName"
                                        labelText="Nom de la personne"
                                        hideLabel={true}
                                        light={true}
                                        placeholder="Prenom *"
                                        size="md"
                                        required={true}
                                        name="prenom"
                                        invalid={false}
                                        invalidText="Ce champ doit pas contenir seulement des chiffres ou des caracteres speciaux"
                                        value={values.prenom}
                                        onChange={handleChange}
                                    />

                                    <Row className={styles.marginSelect}>
                                        <Column sm={4} md={8} lg={6}>
                                            <DatePicker
                                                className=""
                                                maxDate={today()}
                                                datePickerType="single"
                                                locale="fr"
                                                dateFormat="d/m/Y"
                                                light={true}
                                                value={values.dob}
                                                onChange={date => setFieldValue('dob', date)}
                                            // onClose={changeState(true)}
                                            >
                                                <DatePickerInput
                                                    id="date-picker-simple"
                                                    labelText="Date Picker label"
                                                    hideLabel={true}
                                                    placeholder="dd/mm/yyyy"
                                                    size="md"

                                                />
                                            </DatePicker>
                                        </Column>

                                        <Column sm={4} md={8} lg={6}>
                                            <Row>
                                                <Column >
                                                    <NumberInput
                                                        id="carbon-number"
                                                        invalidText="L'age ne doit pas etre inferieur a 0 et superieur 1000"
                                                        max={1000}
                                                        min={0}
                                                        size="md"
                                                        value={0}
                                                        allowEmpty={true}
                                                        light={true}
                                                        hideSteppers={true}
                                                    />
                                                    <span>ans</span>
                                                </Column>

                                                <Column >
                                                    <NumberInput
                                                        id="carbon-number"
                                                        invalidText="Le nombre de mois doit etre compris entre 1 et 12"
                                                        max={11}
                                                        min={1}
                                                        size="md"
                                                        value={1}
                                                        allowEmpty={true}
                                                        light={true}
                                                        hideSteppers={true}
                                                        readOnly={true}
                                                    />
                                                    <span>mois</span>
                                                </Column >
                                            </Row>
                                        </Column>
                                    </Row>

                                    <div>
                                        <Select
                                            className={styles.marginSelect}
                                            defaultValue={values.statu}
                                            id="select-1"
                                            size="md"
                                            name="statu"
                                            light={true}
                                            hideLabel={true}
                                            value={values.statu}
                                            onChange={handleChange}
                                        >

                                            <SelectItem
                                                text="Marie"
                                                value="Marie"
                                            />
                                            <SelectItem
                                                text="Celibataire"
                                                value="celibataire"
                                            />

                                            <SelectItem
                                                text="Veuf"
                                                value="Veuf"
                                            />
                                            <SelectItem
                                                text="Divorce"
                                                value="divorce"
                                            />

                                        </Select>
                                    </div>

                                    <RadioButtonGroup
                                        className={styles.radioStyle}
                                        labelPosition="right"
                                        legendText="Sexe *"
                                        name="sexe"
                                        defaultSelected={values.sexe}
                                        valueSelected={values.sexe}
                                        onChange={handleChange}
                                    >

                                        <RadioButton labelText="Masculin" value="Masculin" id="radio-sexe-1" />
                                        <RadioButton labelText="Feminin" value="Feminin" id="radio-sexe-2" />
                                    </RadioButtonGroup>

                                    <SearchAutocomplete />

                                    {/* <TextInput
                                        className={styles.marginItem}
                                        id="departement-commune"
                                        labelText="Departement et commune"
                                        hideLabel={true}
                                        light={true}
                                        placeholder="Departement (Commmune)"
                                        size="md"
                                        value={values.deptCommnune}
                                        name="deptCommnune"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    /> */}

                                    <TextInput
                                        className={styles.marginItem}
                                        id="domicile"
                                        labelText="Renseigner la domicile"
                                        hideLabel={true}
                                        light={true}
                                        placeholder="Lieu de domicile"
                                        size="md"
                                        value={values.domicile}
                                        name="domicile"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />


                                </Column>


                                <Column className={styles.secondColStyle} lg={6}>
                                    <TextInput
                                        className={styles.marginItem}
                                        id="idpatient"
                                        labelText="Utiliser le NIF ou le CIN"
                                        hideLabel={true}
                                        light={true}
                                        placeholder="numeroIdentifiant"
                                        name="numeroIdentifiant"
                                        size="md"
                                        value={values.numeroIdentifiant}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />

                                    <TextInput
                                        className={styles.marginItem}
                                        id="nomPatient"
                                        labelText="Nom de la personne"
                                        hideLabel={true}
                                        light={true}
                                        placeholder="Nom *"
                                        size="md"
                                        name="nom"
                                        value={values.nom}
                                        required={true}
                                        invalidText={errors.nom && touched.nom}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />

                                    <TextInput
                                        className={styles.marginItem}
                                        id="sectionCommunale"
                                        labelText="Renseigner la section communale"
                                        hideLabel={true}
                                        light={true}
                                        placeholder="Lieu de naissance (Section commmunale)"
                                        name="section"
                                        size="md"
                                        value={values.section}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />

                                    <div>
                                        <Select
                                            className={styles.marginSelect}
                                            defaultValue={values.metier}
                                            id="select-Occuption"
                                            size="md"
                                            light={true}
                                            hideLabel={true}
                                            name="metier"
                                            value={values.metier}
                                            onChange={handleChange}
                                        >

                                            <SelectItem
                                                text="Informaticien"
                                                value="Informaticien"
                                            />
                                            <SelectItem
                                                text="Ing Civil"
                                                value="IngCivil"
                                            />

                                            <SelectItem
                                                text="Infirmiere"
                                                value="Infirmiere"
                                            />
                                            <SelectItem
                                                text="Medecin"
                                                value="Medecin"
                                            />

                                        </Select>
                                    </div>

                                    <RadioButtonGroup
                                        className={styles.radioStyle}
                                        legendText="Habitat"
                                        name="habitat"
                                        defaultSelected={values.habitat}
                                        valueSelected={values.habitat}
                                    >
                                        <RadioButton labelText="Urbain" value="Urbain" id="radio-occ-1" />
                                        <RadioButton labelText="Rural" value="Rural" id="radio-occ-2" />
                                    </RadioButtonGroup>

                                    <TextInput
                                        className={styles.marginItem}
                                        id="adresse"
                                        labelText="Renseigner l\'adresse"
                                        hideLabel={true}
                                        light={true}
                                        placeholder="Adresse"
                                        size="md"
                                        value={values.adresse}
                                        name="adresse"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />

                                    {/* <TextInput
                                        className={styles.marginItem}
                                        id="telephone"
                                        labelText="Numero de la personne"
                                        hideLabel={true}
                                        light={true}
                                        placeholder="Telephone"
                                        name="telephone"
                                        size="md"
                                        value={values.telephone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    /> */}

                                    <PhoneField 
                                        mask="+(50\9)9999-9999"
                                        name='phone'
                                        placeholder="Telephone"
                                        setFieldValue={setFieldValue} 
                                    />
                                </Column>


                                <FieldArray name="personne" >{
                                    (arrayHelpers) => (
                                        <Column lg={12} className={styles.marginTop}>
                                            <Grid className={styles.pm0} fullWidth={true}>
                                                {values.personne.map((friend, index) => (
                                                    <Row key={index}>

                                                        <Column lg={4} className={styles.pl0}>
                                                            <Field name={`personne.[${index}].prenomRef`} placeholder='Prenom' onBlur={(e) => { handleChangeVisibility(e) }} />
                                                        </Column>
                                                        <Column lg={4} className={styles.pl0}>
                                                            <Field name={`personne.[${index}].nomRef`} placeholder='Nom' onBlur={(e) => { handleChangeVisibility(e) }} />
                                                        </Column>
                                                        <Column lg={4} className={styles.pl0} >
                                                            <Row>
                                                                <Field name={`personne.[${index}].telRef`} placeholder='Telephone' />
                                                                {values.personne.length <= 1 && `personne.[${index}].prenomRef` != null && `personne.[${index}].nomRef` != null
                                                                    ? (
                                                                        <Icon
                                                                            icon="akar-icons:circle-plus-fill"
                                                                            inline={true}
                                                                            width="32"
                                                                            height="32"
                                                                            color="#699BF7"
                                                                            className={`${styles.buttonPlusStyle} ${styles.flexEnd}`}
                                                                            visibility={visibility}
                                                                            onClick={() => arrayHelpers.unshift({ prenomRef: "", nomRef: "", telRef: "" })}
                                                                        />
                                                                    )
                                                                    : (
                                                                        <Icon
                                                                            icon="akar-icons:circle-minus-fill"
                                                                            inline={true}
                                                                            width="32"
                                                                            height="32"
                                                                            color="#699BF7"
                                                                            className={`${styles.iconStyle} ${styles.flexEnd}`}
                                                                            onClick={() => arrayHelpers.remove(index)}
                                                                        />
                                                                    )
                                                                }
                                                            </Row>
                                                        </Column>


                                                        {/* <button type="button" onClick={() => arrayHelpers.remove(index)}> - </button> */}
                                                        {/* <button type="button" onClick={() => arrayHelpers.push({ prenomRef: "", nomRef: "", telRef: "" })} > + </button> */}

                                                    </Row>
                                                ))}
                                                {/* 
                                                <Icon
                                                    icon="akar-icons:circle-minus-fill"
                                                    inline={true}
                                                    width="32"
                                                    height="32"
                                                    color="#699BF7"
                                                    className={`${styles.iconStyle} ${styles.flexEnd}`}
                                                    onClick={() => arrayHelpers.remove(index)}
                                                /> */}
                                            </Grid>
                                        </Column>

                                    )
                                }</FieldArray>

                                {/* <Column lg={12}>
                                    <Grid className={styles.pm0} fullWidth={true}>
                                        <Row>

                                            <Column lg={4} className={styles.pl0}>
                                                <TextInput
                                                    className={styles.marginItem}
                                                    id="prenomRelation"
                                                    labelText="Prenom de la personne"
                                                    hideLabel={true}
                                                    light={true}
                                                    placeholder="Prenom"
                                                    size="md"
                                                    // name={`personne.[${index}].firstname`}
                                                    // value={`personne.[${index}].firstname`}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Column>
                                            <Column lg={4}>
                                                <TextInput
                                                    className={styles.marginItem}
                                                    id="prenomRelation"
                                                    labelText="Nom de la personne"
                                                    hideLabel={true}
                                                    light={true}
                                                    placeholder="Nom"
                                                    size="md"
                                                    name="nomRef"
                                                    value={values.nomRef}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Column>
                                            <Column lg={4}>
                                                <Row>
                                                    <TextInput
                                                        className={styles.marginItem}
                                                        id="prenomRelation"
                                                        labelText="Numero de la personne"
                                                        hideLabel={true}
                                                        light={true}
                                                        placeholder="Telephone"
                                                        name="telRef"
                                                        size="md"
                                                        value={values.telRef}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />

                                                    <Icon
                                                        icon="akar-icons:circle-plus-fill"
                                                        inline={true}
                                                        width="32"
                                                        height="32"
                                                        color="#699BF7"
                                                        className={`${styles.iconStyle} ${styles.flexEnd}`}
                                                    />
                                                </Row>
                                            </Column>
                                        </Row>
                                    </Grid>
                                </Column> */}
                            </Row>
                            <Row>
                                <Column>
                                    <Row>
                                        <Column className={styles.marginTop} lg={12} >
                                            <div className={styles.flexEnd}>
                                                <Button
                                                    className={styles.buttonStyle}
                                                    kind="danger--tertiary"
                                                    type="reset"
                                                    size="sm"
                                                    isSelected={true}
                                                >
                                                    Annuler
                                                </Button>
                                                <Button
                                                    className={styles.buttonStyle1}
                                                    kind="tertiary"
                                                    type="submit"
                                                    size="sm"
                                                    isSelected={true}
                                                    disabled={!(dirty && isValid)}
                                                >
                                                    Enregistrer
                                                </Button>
                                            </div>
                                        </Column>
                                    </Row>
                                </Column>
                            </Row>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default PatientFormRegistry;





