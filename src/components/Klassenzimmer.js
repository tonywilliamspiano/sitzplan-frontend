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

export const NONE_SELECTED = -1;
export const OTHER_SELECTED = 0;
export const IS_SELECTED = 1;

export default function Klassenzimmer(props) {

    let id = props.id;
    // Erlaube Zugriff auf KameraView
    const [kameraView, setKameraView] = useKameraContext();
    const [klassenzimmer, setKlassenzimmer] = useState(null);
    const {currentStudent, setCurrentStudent} = useCurrentStudent();
    const [update, setUpdate] = useState(0)
    const [clickCount, setClickCount] = useState(0);

    const [selectedPosition, setSelectedPosition] = useState(NONE_SELECTED)

    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);

        console.log("ANIMATING!")
        // Reset the animation state after a short delay (adjust as needed)
        const timeoutId = setTimeout(() => {
            setIsAnimating(false);
        }, 1000); // 1000 milliseconds (1 second) in this example

        // Clean up the timeout to avoid memory leaks
        return () => clearTimeout(timeoutId);
    }, [props.id]);

    useEffect(() => {
        fetchKlassenzimmer(setKlassenzimmer, setUpdate, id);
    }, [currentStudent, props.id]);

    const getSchuelerByPosition = (position) => {
        for (let i = 0; i < klassenzimmer.schuelerListe.length; i++) {
            let schueler = klassenzimmer.schuelerListe[i];
            if (schueler.position === position) {
                return schueler;
            }
        }
        return null;
    }

    const selectPosition = async (position) => {
        if (selectedPosition === NONE_SELECTED) {
            setSelectedPosition(position);
        } else if (selectedPosition === position) {
            setSelectedPosition(NONE_SELECTED);
        } else {
            let schuelerDerGetauschtWird = getSchuelerByPosition(selectedPosition)

            await axios.post("http://localhost:8080/sitzplan/tauschen/" + position, schuelerDerGetauschtWird, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                    console.log(response.data)
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            setSelectedPosition(NONE_SELECTED)
            fetchKlassenzimmer(setKlassenzimmer, setUpdate, id)
        }
    }

    const isSelected = (position) => {
        if (position === selectedPosition) {
            return IS_SELECTED;
        } else if (selectedPosition !== NONE_SELECTED) {
            return OTHER_SELECTED;
        } else {
            return NONE_SELECTED;
        }
    }

    const reihenKomponente = [];
    if (klassenzimmer !== null) {
        for (let index = 1; index <= klassenzimmer.anzahlDerReihe; index++) {
            reihenKomponente.push(
                <Reihe
                    key={index}
                    id={index}
                    getSchuelerByPosition={getSchuelerByPosition}
                    selectPosition={selectPosition}
                    isSelected={isSelected}
                    update={update}
                    REIHEN={klassenzimmer.anzahlDerReihe}
                    TISCHE={klassenzimmer.anzahlDerTischeProReihe}
                    SCHUELER={klassenzimmer.anzahlDerSchuelerProTisch}
                >
                </Reihe>
            );
        }
    }

    return (
        <>
            {
                kameraView ? (
                    <Kamera setKameraView={setKameraView}></Kamera>
                ) : (
                    <>
                        <div className={`Klassenzimmer ${isAnimating ? 'trigger-animation' : ''}`}>
                            {
                                klassenzimmer !== null ? (
                                    <>
                                        <h2 className="klassenzimmer-titel">{klassenzimmer.raumnummer}</h2>
                                        {reihenKomponente}
                                        <Lehrkraft></Lehrkraft>
                                    </>
                                ) : (<div className="nicht-vorhanden">
                                    Kein Klassenzimmer ausgewählt
                                </div>)
                            }
                        </div>
                        <div className={"DownloadButton"}>
                            <button onClick={downloadPDF}>Download Pdf</button>
                        </div>
                        { clickCount <= 30 && ( <>
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

    for (let index = 1; index <= props.TISCHE; index++) {
        tischKomponenten.push(
            <Tisch
                key={index}
                id={(props.id - 1) * props.TISCHE + index}
                getSchuelerByPosition={props.getSchuelerByPosition}
                selectPosition={props.selectPosition}
                isSelected={props.isSelected}
                update={props.update}
                SCHUELER={props.SCHUELER}
                TISCHE={props.TISCHE}
                REIHEN={props.REIHEN}
            >
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
        width: (100 / props.SCHUELER) + ("%")
    }

    const tischStyle = {
        width: (90 / props.TISCHE) + ("%"),
        height: (30 / props.REIHEN) + "vw"
    }

    for (let index = 1; index <= props.SCHUELER; index++) {
        schuelerKomponenten.push(
            <Schueler style={schuelerStyle}
                      key={index}
                      position={(props.id - 1) * props.SCHUELER + index}
                      getSchuelerByPosition={props.getSchuelerByPosition}
                      selectPosition={props.selectPosition}
                      isSelected={props.isSelected}
                      update={props.update}
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

function fetchKlassenzimmer(setKlassenzimmer, setUpdate, id) {
    axios.get("http://localhost:8080/sitzplan/klassenzimmer/" + id)
        .then(response => {
            console.log(response.data)
            setKlassenzimmer(response.data);
            if (setUpdate !== null) {
                setUpdate((update) => update + 1);
            }
        })
        .catch(error => {
            setKlassenzimmer(null);
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
