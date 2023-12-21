import Kamera from "./Kamera/Kamera";
import {useKameraContext} from "./Kamera/KameraViewContext";
import Schueler from "./Schueler";
import {useEffect, useState} from "react";
import axios from "axios";
import {useCurrentStudent} from "./CurrentStudentContext";
import * as htmlToImage from 'html-to-image';
import { jsPDF } from "jspdf";
import { toPng } from 'html-to-image';

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
                        <div className={"downloadButton"}>
                            <button onClick={downloadPDF}>Download Pdf</button>
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