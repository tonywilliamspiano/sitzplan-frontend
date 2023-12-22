import Kamera from "./Kamera/Kamera";
import {useKameraContext} from "./Kamera/KameraViewContext";
import Schueler from "./Schueler";
import {useEffect, useState} from "react";
import axios from "axios";
import {useCurrentStudent} from "./CurrentStudentContext";

const TISCHE = 4;
const REIHEN = 3;
const SCHUELER_PRO_TISCH = 2;

export const NONE_SELECTED = -1;
export const OTHER_SELECTED = 0;
export const IS_SELECTED = 1;

export default function Klassenzimmer(props) {

    // Erlaube Zugriff auf KameraView
    const [kameraView, setKameraView] = useKameraContext();

    const [klassenzimmer, setKlassenzimmer] = useState(null);
    const {currentStudent, setCurrentStudent} = useCurrentStudent();

    const [selectedPosition, setSelectedPosition] = useState(NONE_SELECTED)

    useEffect(() => {
        fetchKlassenzimmer(setKlassenzimmer);
    }, [currentStudent]);

    const getSchuelerByPosition = (position) => {
        for (let i = 0; i < klassenzimmer.schuelerListe.length; i++) {
            let schueler = klassenzimmer.schuelerListe[i];
            if (schueler.position === position) {
                return schueler;
            }
        }
        return null;
    }

    const selectPosition = (position) => {
        if (selectedPosition === NONE_SELECTED) {
            setSelectedPosition(position);
        }
        else if (selectedPosition === position) {
            setSelectedPosition(NONE_SELECTED);
        }
        else {
            let schuelerDerGetauschtWird = getSchuelerByPosition(selectedPosition)
            console.log("SWITCHING POSITIONS: " + selectedPosition + " and " + position)
            console.log("FOLGENDER SCHUELER WIRD GETAUSCHT: " + schuelerDerGetauschtWird.name)

            setSelectedPosition(NONE_SELECTED);


            axios.post("http://localhost:8080/sitzplan/tauschen/" + position, schuelerDerGetauschtWird, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }

    const isSelected = (position) => {
        if (position === selectedPosition) {
            return IS_SELECTED;
        }
        else if (selectedPosition !== NONE_SELECTED) {
            return OTHER_SELECTED;
        }
        else {
            return NONE_SELECTED;
        }
    }

    // Return Body
    if (klassenzimmer === null) {
        return <p></p>;
    }

    const reihenKomponente = [];

    for (let index = 1; index <= REIHEN; index++) {
        reihenKomponente.push(
            <Reihe
                key={index}
                id={index}
                getSchuelerByPosition={getSchuelerByPosition}
                selectPosition={selectPosition}
                isSelected={isSelected}
            >
                Tisch
            </Reihe>
        );
    }

    return (
        <>
            {
                kameraView ? (
                    <Kamera setKameraView={setKameraView}></Kamera>
                ) : (
                    <>
                        <div className="Klassenzimmer">
                            {reihenKomponente}
                            <Lehrkraft></Lehrkraft>
                        </div>
                    </>
                )
            }
        </>
    )
}

function Reihe(props) {
    const tischKomponenten = [];

    for (let index = 1; index <= TISCHE; index++) {
        tischKomponenten.push(
            <Tisch
                key={index}
                id={(props.id - 1) * TISCHE + index}
                getSchuelerByPosition={props.getSchuelerByPosition}
                selectPosition={props.selectPosition}
                isSelected={props.isSelected}
            >
                Tisch
            </Tisch>
        );
    }

    return (
        <div className="Reihe">
            {tischKomponenten}
        </div>
    )
}

function Tisch(props) {
    const schuelerKomponenten = []

    const schuelerStyle = {
        width: (100 / SCHUELER_PRO_TISCH) + ("%")
    }

    const tischStyle = {
        width: (90 / TISCHE) + ("%"),
        height: (30 / REIHEN) + "vw"
    }

    for (let index = 1; index <= SCHUELER_PRO_TISCH; index++) {
        schuelerKomponenten.push(
                <Schueler style={schuelerStyle}
                          key={index}
                          position={(props.id - 1) * SCHUELER_PRO_TISCH + index}
                          getSchuelerByPosition={props.getSchuelerByPosition}
                          selectPosition={props.selectPosition}
                          isSelected={props.isSelected}
                >
                    Tisch
                </Schueler>
        );
    }

    return (
        <div className="Tisch" style={tischStyle}>
            {schuelerKomponenten}
        </div>
    )
}

function Lehrer() {
    return (
        <div className="Lehrer">LehrerName</div>
    );
}

function Lehrkraft() {
    return (
        <div className="Lehrkraft">
            <Lehrer></Lehrer>
        </div>
    );
}

function fetchKlassenzimmer(setKlassenzimmer) {
    axios.get("http://localhost:8080/sitzplan/klassenzimmer/1")
        .then(response => {
            setKlassenzimmer(response.data);
        })
        .catch(error => {
            console.error("Error fetching klassenzimmer:", error);
        });
}
