import './NavBar.css';
import axios from "axios";
import {useEffect, useState} from "react";
import ZimmerModal from "./ZimmerModal";
import {downloadPDF} from "../Klassenzimmer";
import KlassenListePopup from "./KlassenListePopup";

export default function Navbar(props) {
    let setKlassenzimmerId = props.setKlassenzimmerId;

    const [klassenzimmerListe, setKlassenzimmerListe] = useState([]);
    const [zimmerHinzufuegen, setZimmerHinzufuegen] = useState(false);
    const [klassenPopup, setKlassenPopup] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8080/sitzplan/meinklassenzimmer")
            .then(response => {
                setKlassenzimmerListe(response.data);
            })
    }, [props.klassenzimmerId]);

    let getKlassenZimmer = (
        <>
            {klassenzimmerListe.map((klassenZimmer) => (
                <div key={klassenZimmer.id} onClick={() => setKlassenzimmerId(klassenZimmer.id)} className="subItem ">
                    {klassenZimmer.name}
                </div>
            ))}
        </>
    );

    const getKlassenzimmerName = () => {
        for (let klassenzimmer of klassenzimmerListe) {
            if (klassenzimmer.id === props.klassenzimmerId) {
                return klassenzimmer.name;
            }
        }
        return "Kein Zimmer ausgewählt"
    }

    function klassenzimmerHinzufuegen() {
        setZimmerHinzufuegen(true);
    }

    return (
        <>
            <div id="mySidenav" className="sidenav">
                <div className="navItem" onClick={() => klassenzimmerHinzufuegen()}>Neues Klassenzimmer</div>
                <div>
                    <div className="navItem" onClick={() => setKlassenzimmerId(-1)}>
                        Meine Klassenzimmer
                    </div>
                    {getKlassenZimmer}
                    <ZimmerModal modal={zimmerHinzufuegen} setModal={setZimmerHinzufuegen}></ZimmerModal>
                    <KlassenListePopup modal={klassenPopup} setModal={setKlassenPopup} klassenzimmerId={props.klassenzimmerId} name={getKlassenzimmerName()}></KlassenListePopup>

                </div>


                <div className="navItem" onClick={() => {setKlassenPopup(true)}}>Klassenliste Bearbeiten</div>
                <div className="navItem" onClick={() => {}}>Klassenliste Hochladen</div>

                <div className="navItem" onClick={() => downloadPDF()}>PDF Runterladen</div>
                <div className="navItem"></div>
                {/*<div className="navItem"></div>*/}
                {/*<div className="navItem"></div>*/}


            </div>
        </>
    )
}