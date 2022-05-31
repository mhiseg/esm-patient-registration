import React from "react";
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import PatientCard from "./patient-card";
import ReactDOM from "react-dom";
import { waitFor, fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";

const mockPatient = {
    lastName: "Aline",
    firstName: "Joseph",
    No_dossier: "12345678",
    birth: "12/03/1999",
    matrimonial: "Celibatere",
    occupation: "Informaticien(ne)",
    residence: "Puit-blain,Route de freres",
    phone: "+509 3128 00 00",
    habitat: "Urbain",
    email: "louisshacha@gmail.com"
}

const printCertificate = jest.fn((value) => { return true });

describe("patient card", () => {
    const card = () => {
        render(
            <PatientCard Patient={mockPatient} />,
        );
    }

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <PatientCard Patient={mockPatient} />,
            div,
        );
    });


    it('Verify if object attributes are in the documents', () => {
        const { getByText } = render(<PatientCard Patient={mockPatient} />,);
        const tab = Object.values(mockPatient);

        tab.map(content =>
            getByText((el, node) => {
                el = content;
                const doesHaveText = (node) => (node.textContent).includes(el)
                const nodeHasText = doesHaveText(node);

                const childrenDontHaveText = Array.from(node.children).every(
                    child => !doesHaveText(child)
                );

                return  (nodeHasText && childrenDontHaveText);
            })
        )
    });


    it('Is the validate button is render when the patient is dead', async () => {
        const expeted = screen.getByRole("button", { name: "validate" })

        await waitFor(() => {
            expect(expeted).toBeInTheDocument();
        })
    })

    it('Is the validate button is not render when the patient is alive', async () => {
        const expeted = screen.getByRole("button", { name: "validate" });

        await waitFor(() => {
            expect(expeted).not.toBeInTheDocument();
        })
    })

    it('Patient certificate is printable within card ', async () => {
        const expeted = screen.getByRole("button", { name: "print" })
        fireEvent.click(expeted);

        await waitFor(() => {
            expect(expeted).toBeInTheDocument();
            expect(printCertificate).toHaveBeenCalledWith();
        })
    })

});

