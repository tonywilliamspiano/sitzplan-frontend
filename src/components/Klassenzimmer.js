import Kamera from "./Kamera/Kamera";
import {useKameraContext} from "./Kamera/KameraViewContext";
import Schueler from "./Schueler";
import Mobile from "./Mobile";
import {useEffect, useState} from "react";
import axios from "axios";
import {useCurrentStudent} from "./CurrentStudentContext";
import * as htmlToImage from 'html-to-image';
import { jsPDF } from "jspdf";
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';

const TISCHE = 2;
const REIHEN = 2;
const SCHUELER_PRO_TISCH = 1;


export default function Klassenzimmer(props) {
    // Erlaube Zugriff auf KameraView
    const [kameraView, setKameraView] = useKameraContext();
    const [klassenzimmer, setKlassenzimmer] = useState(null);
    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [clickCount, setClickCount] = useState(0);

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

    const reihenKomponente = [];

    for (let index = 1; index <= REIHEN; index++) {
        reihenKomponente.push(
            <Reihe
                key={index}
                id={index}
                getSchuelerByPosition={getSchuelerByPosition}
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
                        <div className={"DownloadButton"}>
                            <button onClick={downloadPDF}>Download Pdf</button>
                        </div>
                        { clickCount <= REIHEN * TISCHE * SCHUELER_PRO_TISCH && ( <>
                        <Mobile //key="1"
                                clickCount={clickCount}
                                nextPos 
                                setClickCount={setClickCount}
                                getSchuelerByPosition={getSchuelerByPosition}>
                        </Mobile>
                                </> )}
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

function downloadPDF() {
    const klassenzimmer = document.getElementsByClassName('Klassenzimmer')[0];
    if (klassenzimmer) {
        console.log("Klassenzimmer ist da.")
    }
    const {offsetWidth, offsetHeight} = klassenzimmer;
    htmlToImage.toPng(klassenzimmer, {
        width: offsetWidth,
        height: offsetHeight,
        canvasWidth: 1125,
        canvasHeight: 800,
        skipAutoScale: false,
        style: {
            margin: 0,
            padding: 0,
        },
        quality: 0.95
    })
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'my-image-name.jpeg';
            const options = {orientation: 'l', format: 'a4'}
            const pdf = new jsPDF(options);
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(dataUrl, 'PNG', 0, 0);
            pdf.save("download.pdf");
        })
        .catch(function (error) {
            console.error("Error in htmlToPng", error);
        });
}
