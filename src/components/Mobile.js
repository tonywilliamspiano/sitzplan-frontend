import {useCurrentStudent} from "./CurrentStudentContext";
import {useKameraContext} from "./Kamera/KameraViewContext";
import {useEffect, useState} from "react";
import Modal from "./Modal";
import axios from "axios";

export default function Mobile(props) {
    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [kameraView, setKameraView] = useKameraContext();
    const [modal, setModal] = useState(false);

    // TODO - Pass in either a schueler object or null - conditionally rendering the image and
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
        <div className={"KlassenzimmerRoute"}>
            <p> Der Weg durch das Klassenzimmer....</p>
            <button onClick={ () => {
                setModal(true);
            }}
            > Schüler anlegen beginnen!</button>

            <Modal modal={modal} setModal={setModal} nameAuswaehlen={nameAuswaehlen}/>
        </div>
    )
}
