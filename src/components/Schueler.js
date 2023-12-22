import {useCurrentStudent} from "./CurrentStudentContext";
import {useKameraContext} from "./Kamera/KameraViewContext";
import {useEffect, useState} from "react";
import Modal from "./Modal";
import axios from "axios";
import {IS_SELECTED, NONE_SELECTED} from "./Klassenzimmer";

export default function Schueler(props) {
    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [kameraView, setKameraView] = useKameraContext();
    const [modal, setModal] = useState(false);

    const [schueler, setSchueler] = useState(
        props.getSchuelerByPosition(props.position)
    )

    useEffect(() => {
        if (currentStudent !== null) {
            setKameraView(true);
        }
    }, [currentStudent]); // This effect runs whenever schueler changes

    const [name, setName] = useState("")
    const nameAuswaehlen = (schueler) => {

        axios.post("http://localhost:8080/sitzplan/positionieren/" + props.position, schueler, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                setSchueler(response.data)
                setCurrentStudent(response.data);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    return (

        <div className={`Schueler ${props.isSelected(props.position) === IS_SELECTED ? 'selected' : ''}`} style={props.style}>
            {schueler !== null ? (
                <div onClick={() => props.selectPosition(props.position)}>
                    <img src={"http://localhost:8080/sitzplan/foto/" + schueler.id} className="schuelerBild"/>
                    <p className="schuelerName">{schueler.name}</p>
                </div>
            ) : (
                <div className="schuelerHinzufuegen" onClick={
                    () => {
                        if (props.isSelected(props.position) === NONE_SELECTED) {
                            setModal(true);
                        }
                        else {
                            props.selectPosition(props.position)
                        }
                    }
                }>
                <p >+</p>
                </div>
            )}
            <Modal modal={modal} setModal={setModal} nameAuswaehlen={nameAuswaehlen}/>
        </div>
    )
}
