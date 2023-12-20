import {useCurrentStudent} from "./CurrentStudentContext";
import {useKameraContext} from "./Kamera/KameraViewContext";
import {useState} from "react";
import Modal from "./Modal";

export default function Schueler(props) {
    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [kameraView, setKameraView] = useKameraContext();
    const [modal, setModal] = useState(false);

    // TODO - Pass in either a schueler object or null - conditionally rendering the image and
    const [testSchueler, setTestSchueler] = useState(
        props.getSchuelerByPosition(props.position)
    )

    const [name, setName] = useState("")
    const nameAuswaehlen = (neuname) => {
        setName(neuname)
        setTestSchueler(testSchueler);
        // setCurrentStudent(testSchueler);
        // setKameraView(true);
    }
    return (

        <div className="Schueler">
            {testSchueler !== null ? (
                <>
                    <img src={testSchueler.image} className="schuelerBild" alt="EMPTY"/>
                    <p className="schuelerName">{props.position}. {testSchueler.name}</p>
                </>
            ) : (
                <p className="schuelerHinzufuegen" onClick={
                    () => {
                        setModal(true);
                    }
                }>{props.position}</p>
            )}
            <Modal modal={modal} setModal={setModal} nameAuswaehlen={nameAuswaehlen}/>
        </div>
    )
}