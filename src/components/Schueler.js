import {useCurrentStudent} from "./CurrentStudentContext";
import {useKameraContext} from "./Kamera/KameraViewContext";
import {useEffect, useRef, useState} from "react";
import Modal from "./Modal";
import axios from "axios";
import {IS_SELECTED, NONE_SELECTED} from "./Klassenzimmer";

export default function Schueler(props) {
    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [kameraView, setKameraView] = useKameraContext();
    const [modal, setModal] = useState(false);
    const [update, setupdate] = useState(0)

    const [schueler, setSchueler] = useState(null)

    useEffect(() => {
        setSchueler(props.getSchuelerByPosition(props.position))
        console.log("SETTING NEW position!")
    }, [props.update]);

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

    let schuelerNameStyle = {};
    let schuelerBildStyle = {};

            const myElementRef = useRef(null);
        const getSize = () => {

            const myElement = myElementRef.current;

            if (myElement) {
                const styles = window.getComputedStyle(myElement);
                const width = parseFloat(styles.width);
                const height = parseFloat(styles.height);

                if (width > (height * 2)) {
                    schuelerBildStyle.width = "35%";
                    schuelerNameStyle.width = "50%"
                }
                else if (width > height) {
                    schuelerBildStyle.width = "50%";
                    schuelerNameStyle.width = "40%"
                }
            }
        }
    getSize();

    return (

        <div ref={myElementRef} className={`Schueler ${props.isSelected(props.position) === IS_SELECTED ? 'selected' : ''}`} style={props.style}>
            {schueler !== null ? (
                <div className="schuelerContainer" onClick={() => props.selectPosition(props.position)}>
                    <img src={"http://localhost:8080/sitzplan/foto/" + schueler.id} className="schuelerBild" style={schuelerBildStyle}/>
                    <p className="schuelerName" style={schuelerNameStyle}>{schueler.name}</p>
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
                }>+</div>
            )}
            <Modal modal={modal}
                   setModal={setModal}
                   nameAuswaehlen={nameAuswaehlen}
                   klassenzimmerId={props.klassenzimmerId}
            />
        </div>
    )
}
