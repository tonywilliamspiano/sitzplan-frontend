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

    function hasNoPosition(schueler){
        return schueler.position === -1;
    }

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
        console.log("klassenzimmer Id = " + props.klassenzimmerId)
        axios.get("http://localhost:8080/sitzplan/klassenliste/" + props.klassenzimmerId)
            .then(respose=> {
                setSchuelerListe(respose.data)
            })
            .catch(error => {
                console.error("erorr",error)
            })
    }, [klassenListeReload, props.klassenzimmerId]);


    return (
        <>
            {modal && (
                <div className="modal">
                    <div  className="overlay" onClick={()=> setModal(!modal)} ></div>
                    <div className="modal-content">
                        <button className="btn-close" onClick={()=> setModal(!modal)}> ❌ </button>
                        <div className="dummy-div"></div>
                        <h2 className="klassenliste-title">Alle Schüler in {props.name}</h2>
                        <div className= "klassenliste">
                            {
                                schuelerListe.filter(hasNoPosition).map((schueler, index) => (
                                        <div className="klassenliste-namen" key={index} onClick={() =>{
                                            setModal(!modal)
                                        }
                                        }>{schueler.name}        <div className= "loeschen-btn" ><button className="name-loeschen"> ❎ </button> </div>  </div>
                                    )
                                )
                            }
                            <form className="neuer-name" >
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