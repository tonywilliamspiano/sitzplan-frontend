import {useCurrentStudent} from "./CurrentStudentContext";
import {useKameraContext} from "./Kamera/KameraViewContext";
import {useState} from "react";
import Modal from "./Modal";

export default function Schueler() {
    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [kameraView, setKameraView] = useKameraContext();

    // TODO - Pass in either a schueler object or null - conditionally rendering the image and
    const [testSchueler, setTestSchueler] = useState({
        name: "Tony",
        bild: "irgendwas"
    })

    const [name, setName] = useState("")
    const nameAuswaelen = (neuname) => {
        setName(neuname)
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
                        setCurrentStudent(testSchueler);
                        setKameraView(true);
                    }
                }>+</p>
            )}
            <Modal nameAuswaelen={nameAuswaelen}/>
        </div>
    )
}