import {useCurrentStudent} from "./CurrentStudentContext";
import {useKameraContext} from "./Kamera/KameraViewContext";
import {useState} from "react";
import Modal from "./Modal";

export default function Schueler() {
    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [kameraView, setKameraView] = useKameraContext();
    const [modal, setModal] = useState(false);

    // TODO - Pass in either a schueler object or null - conditionally rendering the image and
    const [testSchueler, setTestSchueler] = useState({
        name: "Tony",
        bild: null
    })

    const [name, setName] = useState("")
    const nameAuswaehlen = (neuname) => {
        setName(neuname)
        testSchueler.bild = "etwas";
        setTestSchueler(testSchueler);
        // setCurrentStudent(testSchueler);
        // setKameraView(true);
    }
    return (

        <div className="Schueler">
            {testSchueler.bild !== null && testSchueler.bild !== undefined && testSchueler.bild !== '' ? (
                <>
                    <img src={testSchueler.bild} className="schuelerBild" alt="EMPTY"/>
                    <p className="schuelerName">{name}</p>
                </>
            ) : (
                <p className="schuelerHinzufuegen" onClick={
                    () => {
                        setModal(true);
                    }
                }>+</p>
            )}
            <Modal modal={modal} setModal={setModal} nameAuswaehlen={nameAuswaehlen}/>
        </div>
    )
}