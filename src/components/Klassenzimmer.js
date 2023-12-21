import Kamera from "./Kamera/Kamera";
import {useKameraContext} from "./Kamera/KameraViewContext";
import Schueler from "./Schueler";
import {useEffect, useState} from "react";
import axios from "axios";
import {useCurrentStudent} from "./CurrentStudentContext";

export default function Klassenzimmer(props) {
    // Erlaube Zugriff auf KameraView
    const [kameraView, setKameraView] = useKameraContext();

    const [klassenzimmer, setKlassenzimmer] = useState(null);
    const {currentStudent, setCurrentStudent} = useCurrentStudent();

    useEffect(() => {
            fetchKlassenzimmer(setKlassenzimmer);
    }, [currentStudent]);

    let getSchuelerByPosition = (position) => {
        for (let i = 0; i < klassenzimmer.schuelerListe.length; i++) {
            let schueler = klassenzimmer.schuelerListe[i];
            if (schueler.position === position) {
                return schueler;
            }
        }
        return null;
    }

    // Return Body
    if (klassenzimmer === null) {
        return <p></p>;
    }
    return (
        <>
            {
                kameraView ? (
                    <Kamera setKameraView={setKameraView}></Kamera>
                ) : (
                    <>
                        <div className="Klassenzimmer">
                            <Reihe id={1} getSchuelerByPosition={getSchuelerByPosition}></Reihe>
                            <Reihe id={2} getSchuelerByPosition={getSchuelerByPosition}></Reihe>
                            <Reihe id={3} getSchuelerByPosition={getSchuelerByPosition}></Reihe>
                            <Reihe id={4} getSchuelerByPosition={getSchuelerByPosition}></Reihe>
                            <Lehrkraft></Lehrkraft>
                        </div>
                    </>
                )
            }
        </>
    )
}

function Reihe(props) {
    return (
        <div className="Reihe">
            <Tisch id={(props.id - 1) * 4 + 1} getSchuelerByPosition={props.getSchuelerByPosition}>Tisch</Tisch>
            <Tisch id={(props.id - 1) * 4 + 2} getSchuelerByPosition={props.getSchuelerByPosition}>Tisch</Tisch>
            <Tisch id={(props.id - 1) * 4 + 3} getSchuelerByPosition={props.getSchuelerByPosition}>Tisch</Tisch>
            <Tisch id={(props.id - 1) * 4 + 4} getSchuelerByPosition={props.getSchuelerByPosition}>Tisch</Tisch>
        </div>
    )
}

function Tisch(props) {
    return (
        <div className="Tisch">
            <Schueler position={(props.id - 1) * 2 + 1} getSchuelerByPosition={props.getSchuelerByPosition}>Schüler</Schueler>
            <Schueler position={(props.id - 1) * 2 + 2} getSchuelerByPosition={props.getSchuelerByPosition}>Schüler</Schueler>
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
