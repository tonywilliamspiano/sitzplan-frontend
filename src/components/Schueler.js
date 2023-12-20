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
                    <img src="https://media.gq.com/photos/5cd0a78cb41d092460cd73bf/1:1/w_1125,h_1125,c_limit/Keanu-Con-GQ-2019-050619.jpg" className="schuelerBild" alt="EMPTY"/>
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