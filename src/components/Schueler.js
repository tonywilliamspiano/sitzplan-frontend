import {useCurrentStudent} from "./CurrentStudentContext";
import {useKameraContext} from "./Kamera/KameraViewContext";
import {useEffect, useRef, useState} from "react";
import Modal from "./Modal";
import axios from "axios";
import {IS_SELECTED, NONE_SELECTED} from "./Klassenzimmer";
import {useKlassenListeContext} from "./KlassenListeContext";

export default function Schueler(props) {
    const apiUrl = process.env.REACT_APP_URL;

    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [kameraView, setKameraView] = useKameraContext();
    const [modal, setModal] = useState(false);
    const [update, setupdate] = useState(0)
    const [klassenListe, setKlassenListe] = useKlassenListeContext();

    const [schueler, setSchueler] = useState(null)

    useEffect(() => {
        setSchueler(props.getSchuelerByPosition(props.position))
        setImageLoaded(true)
    }, [props.update, klassenListe]);

    useEffect(() => {
        if (currentStudent !== null) {
            setKameraView(true);
        }
    }, [currentStudent]); // This effect runs whenever schueler changes

    const [name, setName] = useState("")
    const nameAuswaehlen = (schueler) => {

        axios.post(apiUrl + "/sitzplan/positionieren/" + props.position, schueler, {
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

    const [imageLoaded, setImageLoaded] = useState(true);
    const handleImageError = () => {     setImageLoaded(false);};
    const handleImageLoad = () => {     setImageLoaded(true);};



    return (

        <div ref={myElementRef} className={`Schueler ${props.isSelected(props.position) === IS_SELECTED ? 'selected' : ''}`} style={props.style}>
            {schueler !== null ? (
                <div className="schuelerContainer" onClick={() => props.selectPosition(props.position)}>

                    {imageLoaded ? (
                        <img
                            src={apiUrl + "/sitzplan/foto/" + schueler.id}
                            alt="foto vom schueler"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            className="schuelerBild" style={schuelerBildStyle}

                        />
                    ) : (
                        <img
                            src={process.env.PUBLIC_URL + '/defaultfoto.png'}
                            alt="default"
                            className="schuelerBild" style={schuelerBildStyle}
                        />
                    )}
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
                }>{props.schuelerContent}</div>
            )}
            <Modal modal={modal}
                   setModal={setModal}
                   nameAuswaehlen={nameAuswaehlen}
                   klassenzimmerId={props.klassenzimmerId}
            />
        </div>
    )
}
