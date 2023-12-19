import Modal from "./Modal";
import {useState} from "react";

export default function Klassenzimmer() {
    return (
        <div className="Klassenzimmer">
            <Reihe></Reihe>
            <Reihe></Reihe>
            <Reihe></Reihe>
            <Reihe></Reihe>
            <Lehrkraft></Lehrkraft>
        </div>
    )
}

function Reihe() {
    return (
        <div className="Reihe">
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

function Schueler() {


    const [name,setName] = useState("fares")
    const nameAuswaelen = ( neuname)=> {

        setName(neuname)     }
    return (

        <div className="Schueler">
            {/*<p className="schuelerBild">Bild</p>*/}
            <p className="schuelerName">{name}</p>
            <Modal nameAuswaelen={nameAuswaelen}/>
            {/*<p className="schuelerHinzufuegen">+</p>*/}
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