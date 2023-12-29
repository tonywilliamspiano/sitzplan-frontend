import "../Modal.css";
import "./ZimmerModal.css";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useKlassenListeContext} from "../KlassenListeContext";
import "./KlassenListePopup.css"

function KlassenListePopup(props) {

    let modal = props.modal;
    let setModal = props.setModal;
    const [name, setName] = useState('');
    const [klassenListeReload, setKlassenListeReload] = useKlassenListeContext();

    const [schuelerListe, setSchuelerListe] = useState([])

    const handleSubmit = (event) => {
        event.preventDefault();

        let schueler = {
            name: name,
            position: -1
        }
        if (props.klassenzimmerId === -1) {
            return;
        }
        axios.post("http://localhost:8080/sitzplan/schueler/" + props.klassenzimmerId, schueler)
            .then((response) => {
                setKlassenListeReload(klassenListeReload + 1)
                console.log(schuelerListe)
            })
        setName("")
    };

    const handleKeyDown = (event) => {
        // Check if the Enter key is pressed (key code 13)
        if (event.keyCode === 13) {
            event.preventDefault(); // Prevent inserting a new line
            handleSubmit(event); // Trigger the form submission
        }
    };

    const handleChange = (event) => {
        setName(event.target.value);
    };

    useEffect(() => {
        if (props.klassenzimmerId === -1) {
            return;
        }
        axios.get("http://localhost:8080/sitzplan/klassenliste-komplett/" + props.klassenzimmerId)
            .then(respose => {
                setSchuelerListe(respose.data)
            })
            .catch(error => {
                console.error("erorr", error)
            })
    }, [klassenListeReload, props.klassenzimmerId]);


    function schuelerLoeschen(schueler) {
        const userConfirmed = window.confirm('Willst du wirklich ' + schueler.name + ' aus dem Klassenzimmer ' + props.name + ' entfernen?');

        if (userConfirmed) {
            axios.delete("http://localhost:8080/sitzplan/schueler/" + schueler.id)
                .then(() =>
                    setKlassenListeReload(klassenListeReload + 1));
        }
    }

    return (
        <>
            {modal && (
                <div className="modal">
                    <div className="overlay" onClick={() => setModal(!modal)}></div>
                    <div className="klassenliste-modal">
                        <button className="btn-close" onClick={() => setModal(!modal)}> ❌</button>
                        <div className="dummy-div"></div>
                        <h2 className="klassenliste-title">Alle Schüler in {props.name}</h2>
                        <div className="klassenliste">
                            {
                                schuelerListe.filter.map((schueler, index) => (
                                        <div className="namen-container" key={index}>
                                            <div className="klassenliste-namen" key={index}>{schueler.name}
                                            </div>
                                            <div className="loeschen-btn">
                                                <button onClick={() => schuelerLoeschen(schueler)}
                                                        className="name-loeschen"> ❌
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                            <form className="neuer-name">
                                <textarea
                                    id="nameTextArea"
                                    name="name"
                                    value={name}
                                    placeholder="gib den Name ein...."
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                />
                            </form>
                        </div>

                    </div>
                </div>
            )}

        </>
    );
}

export default KlassenListePopup;