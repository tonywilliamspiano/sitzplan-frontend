import './NavBar.css';
import axios from "axios";
import {useEffect, useState} from "react";
import ZimmerModal from "./ZimmerModal";
import {downloadPDF} from "./Klassenzimmer";

export default function Navbar(props) {
    let setKlassenzimmerId = props.setKlassenzimmerId;

    const [klassenzimmerListe, setKlassenzimmerListe] = useState([]);
    const [zimmerHinzufuegen, setZimmerHinzufuegen] = useState(false);

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

    function klassenzimmerHinzufuegen() {
        setZimmerHinzufuegen(true);
    }

    return (
        <>
            <div id="mySidenav" className="sidenav">
                <div>
                    <div className="navItem" onClick={() => setKlassenzimmerId(-1)}>
                        Meine Klassenzimmer
                    </div>
                    {getKlassenZimmer}
                    <ZimmerModal modal={zimmerHinzufuegen} setModal={setZimmerHinzufuegen}></ZimmerModal>

                </div>

                <div className="navItem" onClick={() => klassenzimmerHinzufuegen()}>Neues Klassenzimmer</div>

                <div className="navItem" onClick={() => downloadPDF()}>PDF Runterladen</div>
            </div>
        </>
    )
}