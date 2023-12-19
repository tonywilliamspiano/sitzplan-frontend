import {useState} from "react";
import {useCurrentStudent} from "./CurrentStudentContext";
import Kamera from "./Kamera/Kamera";
import {useKameraContext} from "./Kamera/KameraViewContext";

export default function Klassenzimmer() {
    const [kameraView, setKameraView] = useKameraContext();

    return (
        <>
            {
                kameraView ? (
                    <Kamera setKameraView={setKameraView}></Kamera>
                ) : (
                    <>

                        <div className="Klassenzimmer">
                            <Reihe></Reihe>
                            <Reihe></Reihe>
                            <Reihe></Reihe>
                            <Reihe></Reihe>
                            <Lehrkraft></Lehrkraft>
                        </div>
                    </>
                )
            }
        </>
    )
}

function Reihe() {
    return (
        <div className="Reihe">
            <Tisch>Tisch</Tisch>
            <Tisch>Tisch</Tisch>
            <Tisch>Tisch</Tisch>
            <Tisch>Tisch</Tisch>
        </div>
    )
}

function Tisch() {
    return (
        <div className="Tisch">
            <Schueler>Schüler</Schueler>
            <Schueler>Schüler</Schueler>
        </div>
    )
}

function Schueler(schueler) {
    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [kameraView, setKameraView] = useKameraContext();

    const [testSchueler, setTestSchueler] = useState({
        name: "Tony",
        bild: null
    })

    // TODO - Pass in either a schueler object or null - conditionally rendering the image and
    // schueler = {
    //     name: "tony",
    //     image: "hello"
    // }
    return (
        <div className="Schueler">
            {testSchueler.bild !== null && testSchueler.bild !== undefined && testSchueler.bild !== '' ? (
                <>
                    <img src={testSchueler.bild} className="schuelerBild" alt="EMPTY"/>
                    <p className="schuelerName">{testSchueler.name}</p>
                </>
            ) : (
                <p className="schuelerHinzufuegen" onClick={
                    () => {
                        setCurrentStudent(testSchueler);
                        setKameraView(true);
                    }
                }>+</p>
            )}
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