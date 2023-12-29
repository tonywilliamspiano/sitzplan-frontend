import {useCurrentStudent} from "../CurrentStudentContext";
import {useKameraContext} from "../Kamera/KameraViewContext";
import "./Mobile.css"
import {useEffect, useRef, useState} from "react";
import Modal from "../Modal";
import axios from "axios";

export default function Mobile(props) {
    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [kameraView, setKameraView] = useKameraContext();
    const [modal, setModal] = useState(false);
    const clickCount = props.clickCount;
    const setClickCount = props.setClickCount;

    const [zimmerView, setZimmerView] = useState(true);
    const [miniKlassenzimmer, setMiniKlassenzimmer] = useState(null);

    // TODO - Pass in either a schueler object or null - conditionally rendering the image and
    const [schueler, setSchueler] = useState(
        props.getSchuelerByPosition(1)
    );

    useEffect(() => {
        if (currentStudent !== null) {
            setKameraView(true);
        }
    }, [currentStudent]); // This effect runs whenever schueler changes

    const [name, setName] = useState("")
    const nameAuswaehlen = (schueler) => {
        let freierPlatz = selectedPosition;
        if (freierPlatz === -1) {
            freierPlatz = naechsterFreierPlatz();
        }
        axios.post("http://localhost:8080/sitzplan/positionieren/" + freierPlatz, schueler, {
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

    const naechsterFreierPlatz = () => {
        if (!props.klassenzimmer) {
            return -1;
        }
        let ANZAHL_SCHUELER = props.klassenzimmer.anzahlDerReihe
            * props.klassenzimmer.anzahlDerTischeProReihe
            * props.klassenzimmer.anzahlDerSchuelerProTisch;

        for (let i = 1; i < ANZAHL_SCHUELER; i++) {
            let platzIstFrei = true;
            for (let schueler of props.klassenzimmer.schuelerListe) {
                if (schueler.position === i) {
                    platzIstFrei = false;
                }
            }
            if (platzIstFrei) {
                return i;
            }
        }
        return -1;
    }

    const [klassenzimmerListe, setKlassenzimmerListe] = useState([]);

    function makeKlassenzimmerListeKomponente() {
        return (
            <div className="zimmer-liste">
                {klassenzimmerListe.map((zimmer, index) => (
                    <div className="zimmer-namen" key={index} onClick={() => {
                        props.setKlassenzimmerId(zimmer.id)
                        setZimmerView(true)
                    }}>
                        {zimmer.name}
                    </div>
                ))}
            </div>)
    }

    useEffect(() => {
        axios.get("http://localhost:8080/sitzplan/meinklassenzimmer")
            .then(response => {
                setKlassenzimmerListe(response.data);
            })
    }, [props.klassenzimmerId]);

    const getKlassenzimmerName = () => {
        for (let klassenzimmer of klassenzimmerListe) {
            if (klassenzimmer.id === props.klassenzimmerId) {
                return klassenzimmer.name;
            }
        }
        return null
    }
    const [selectedPosition, setSelectedPosition] = useState(-1);

    useEffect(() => {
        if (props.klassenzimmer !== null) {
            miniKlassenzimmerBauen()
        }
    }, [zimmerView, selectedPosition, props.klassenzimmerId, props.klassenzimmer])

    const miniKlassenzimmerBauen = () => {
        console.log('wird neu gebaut...')
        if (selectedPosition === -1) {
            setSelectedPosition(naechsterFreierPlatz());
            console.log("Naechsten platz nehmen...")
        }
        const reihen = Array.from(Array(props.klassenzimmer.anzahlDerReihe).keys()).map(x => x + 1);
        const schuelerProReihe = Array.from(Array(props.klassenzimmer.anzahlDerTischeProReihe
            * props.klassenzimmer.anzahlDerSchuelerProTisch).keys()).map(x => x + 1);

        const select = (position) => {
            if (selectedPosition === position) {
                setSelectedPosition(-1);
            } else {
                setSelectedPosition(position);
            }
        }

        let miniZimmer = (

            <div className="mini-klassenzimmer">
                {reihen.map((index) => (
                    <MiniReihe className="minizimmer-reihe"
                               key={index}
                               schuelerProReihe={schuelerProReihe}
                               getSchuelerByPosition={props.getSchuelerByPosition}
                               reihenIndex={index}
                               selectedPosition={selectedPosition}
                               select={select}>
                    </MiniReihe>
                ))}
            </div>
        );

        setMiniKlassenzimmer(miniZimmer);
    }

    useEffect(() => {
        setSelectedPosition(naechsterFreierPlatz)
    }, [props.klassenzimmer])

    return (
        <div className="mobile-ansicht">

            {zimmerView && props.klassenzimmer ? (
                <>
                    <h2> Klassenzimmer {getKlassenzimmerName()}</h2>
                    {miniKlassenzimmer}
                    <button className="kleiner-button anlegen-button" onClick={() => {
                        setModal(true);
                        console.log("Setting modal...")
                    }}
                    > Schüler anlegen
                    </button>
                    <button className="mobile-button zurueck-button" onClick={() => {
                        props.setKlassenzimmerId(-1);
                        setZimmerView(false)
                    }}
                    > Anderes Zimmer
                    </button>
                    <Modal modal={modal} setModal={setModal} nameAuswaehlen={nameAuswaehlen}
                           klassenzimmerId={props.klassenzimmerId}/>
                </>
            ) : (
                <>
                    {props.klassenzimmerId === -1 ? (
                        <>
                            <h2 className="zimmerauswahl-titel">Klassenzimmer auswählen: </h2>
                            {makeKlassenzimmerListeKomponente()}
                        </>
                    ) : (
                        <div className={"KlassenzimmerRoute"}>
                            <h2> Klassenzimmer {getKlassenzimmerName()}</h2>
                            <button className="mobile-button anlegen-button" onClick={() => {
                                setZimmerView(true);
                            }}
                            > Schüler anlegen
                            </button>

                            <button className="mobile-button neuauswahl-button" onClick={() => {
                                props.setKlassenzimmerId(-1);
                            }}
                            > Anderes Zimmer auswählen
                            </button>
                        </div>
                    )
                    }
                </>
            )}
        </div>
    )
}

function MiniReihe(props) {
    const [reload, setReload] = useState(0);

    return (
        <div className="minizimmer-reihe">
            {props.schuelerProReihe.map((index) => {
                    let position = (props.reihenIndex - 1) * props.schuelerProReihe.length + (index);
                    let schueler = props.getSchuelerByPosition(position);
                    let initials = "";
                    if (schueler) {
                        const fullName = schueler.name;
                        const words = fullName.split(' ');

                        const initial = words.map(word => word.charAt(0) + '.');
                        initials = initial.join(' ');
                    }
                    return (
                        <div key={index}
                             className={`minizimmer-schueler ${props.selectedPosition === position ? 'selected' : ''}`}
                             onClick={() => {
                                 if (!schueler) {
                                     props.select(position);
                                 }
                                 setReload(reload + 1);
                             }}>
                            {schueler ? (
                                <>{initials}</>
                            ) : (
                                <>➕</>
                            )}
                        </div>
                    )
                }
            )
            }
        </div>
    );
}
