import React, {useEffect, useState} from "react";

import "./Modal.css";
import axios from "axios";
import {useKlassenListeContext} from "./KlassenListeContext";

 function Modal(props) {
     const [klassenListeUpdate, setKlassenListeUpdate] = useKlassenListeContext();

     let modal = props.modal;
     let setModal = props.setModal;
     let nameAuswaehlen = props.nameAuswaehlen;
     const [schuelerListe, setSchuelerListe] =useState([])

     function hasNoPosition(schueler){
         return schueler.position === -1;
     }

     useEffect(() => {
         if (props.klassenzimmerId <= 0 || props.klassenzimmerId === undefined) {
             return;
         }
         axios.get("http://localhost:8080/sitzplan/klassenliste/" + props.klassenzimmerId)
             .then(respose=> {
                 setSchuelerListe(respose.data)
             })
             .catch(error => {
                 console.error("erorr",error)
             })
     }, [props.klassenzimmerId, klassenListeUpdate]);

     return (
        <>
            {modal && (
                <div className="modal">
                    <div  className="overlay" onClick={()=> setModal(!modal)} ></div>
                    <div className="modal-content">
                        <button className="btn-close" onClick={()=> setModal(!modal)}> ❌ </button>
                        <div className="dummy-div"></div>
                        <h2 className="modal-title">Name auswählen</h2>
                        <div className= "nameListe-Container">
                            {
                                schuelerListe.filter(hasNoPosition).map((schueler, index) => (
                                     <div className="btn-NameListe" key={index} onClick={() =>{
                                         nameAuswaehlen(schueler)
                                         setModal(!modal)
                                     }}>{schueler.name}</div>
                                )
                                )
                            }
                        </div>

                    </div>
                </div>
            )}

        </>
    );
}
export default Modal;