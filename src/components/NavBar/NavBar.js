import './NavBar.css';
import axios from "axios";
import {useEffect, useState} from "react";
import ZimmerModal from "./ZimmerModal";
import {downloadPDF} from "../Klassenzimmer";
import KlassenListePopup from "./KlassenListePopup";
import {useKlassenListeContext} from "../KlassenListeContext";

export default function Navbar(props) {
    const apiUrl = process.env.REACT_APP_URL;
    let setKlassenzimmerId = props.setKlassenzimmerId;

    const [klassenzimmerListe, setKlassenzimmerListe] = useState([]);
    const [zimmerHinzufuegen, setZimmerHinzufuegen] = useState(false);
    const [klassenPopup, setKlassenPopup] = useState(false);
    const [klassenListe, setKlassenListe] = useKlassenListeContext();
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        axios.get(apiUrl + "/sitzplan/meinklassenzimmer")
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

    async function klassenlisteHochladen() {
        // Optionen setzen sodass nur die Worddokumente angezeigt werden.
        const pickerOpts = {
            types: [
                {
                    description: "Word Dokumente",
                    accept: {
                        "text/*": [".docx"],
                    },
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
        };

        const pizzip = require("pizzip");
        const convert = require('xml-js')
        try {
            // Open file picker and destructure the result the first handle
            const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
            // get file contents
            const fileData = await fileHandle.getFile();
            const content = await fileData.arrayBuffer();
            const unzipped = new pizzip(content);
            const rawJSON = convert.xml2json(unzipped.files["word/document.xml"].asText(), {compact: true, spaces: 4});
            const convertedJSON = JSON.parse(rawJSON);
            console.log(convertedJSON['w:document']['w:body']['w:tbl']['w:tr']);
            const rows = convertedJSON['w:document']['w:body']['w:tbl']['w:tr'];
            const schuelerListe = [];
            for (let i = 0; i < rows.length; i++) {
                const surname = rows[i]['w:tc'][1]['w:p']['w:r']['w:t']['_text'];
                const name = rows[i]['w:tc'][2]['w:p']['w:r']['w:t']['_text'];
                const schueler = name + " " + surname;
                console.log(schueler);
                schuelerListe.push(schueler);
            }

            const schuelerListeDTO = {"schuelerListe" : schuelerListe };
            if (props.klassenzimmerId) {
                axios.post(apiUrl + "/sitzplan/schueler-liste/" + props.klassenzimmerId, schuelerListeDTO)
                    .then((response) => {
                        console.log(response)
                        setKlassenListe(klassenListe + 1);
                        window.alert("Klassenliste erfolgreich hinzugefügt 🎉")
                    })
            }

        } catch (error) {
            console.error("Error:", error.message);
        }

    }

    return (
        <>
            <div className={"header"}>
                <button className={"btn-hamburger"} onClick={() => setShowMenu(!showMenu)}></button>
            </div>
            <div id="mySidenav" className={`sidenav ${showMenu ? "show" : ""}`}>

                <div className="navItem" onClick={() => klassenzimmerHinzufuegen()}>Neues Klassenzimmer</div>
                <div>
                    <div className="navItem" onClick={() => setKlassenzimmerId(-1)}>
                        Meine Klassenzimmer
                    </div>
                    {getKlassenZimmer}
                    <ZimmerModal modal={zimmerHinzufuegen} setModal={setZimmerHinzufuegen}
                                 setKlassenzimmerId={setKlassenzimmerId}></ZimmerModal>
                    <KlassenListePopup modal={klassenPopup} setModal={setKlassenPopup}
                                       klassenzimmerId={props.klassenzimmerId}
                                       name={getKlassenzimmerName()}></KlassenListePopup>

                </div>

                {props.klassenzimmerId > 0 ? (
                    <div className="navItem" onClick={() => {setKlassenPopup(true)}}>Klassenliste Bearbeiten</div>
                ) : (<></>)
                }



                {props.klassenzimmerId > 0 ? (
                    <>
                        <div className="navItem"
                             onClick={klassenlisteHochladen}>Klassenliste Hochladen</div>
                        <div className="navItem-bottomBtn" onClick={() => downloadPDF(props.schuelerContent, props.setSchuelerContent)}>PDF Runterladen</div>
                    </>
                ) : (<></>)
                }

            </div>
        </>
    )
}