import React, {useEffect, useState} from "react";

import "./Modal.css";
import axios from "axios";

 function Modal(props) {

     let modal = props.modal;
     let setModal = props.setModal;
     let nameAuswaehlen = props.nameAuswaehlen;
     const [schuelerListe, setSchuelerListe] =useState([])

     // const schuelerList = ["Timo Engler", "Jakob Harsch", "Noah Hitzler", "Lukas Hoffmann", "Marius Karch"
     //     , "Michael Kratzer", "Juri Till Krauß", "Justin Mack ", "Tim Mader", "Felix Mayer "
     //     , "Jochen Müller", "Christian Quint", " Hagen Johannes Reinbold ", "Sara Doris Sachs", "Jakob Steck "
     //     , "Pauline Straub", "Luca  Weller "
     // ]

     useEffect(() => {
         axios.get("http://localhost:8080/sitzplan/klassenliste")
             .then(respose=> {
                 setSchuelerListe(respose.data)
             })
             .catch(error => {
                 console.error("erorr",error)
             })
     }, []);


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
                                schuelerListe.map((name, index) => (
                                     <div className="btn-NameListe" key={index} onClick={() =>{
                                         nameAuswaehlen(name)
                                         setModal(!modal)
                                     }}>{name}</div>
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