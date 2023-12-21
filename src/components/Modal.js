import React, { useState } from "react";

import "./Modal.css";

 function Modal(props) {

     let modal = props.modal;
     let setModal = props.setModal;
     let nameAuswaehlen = props.nameAuswaehlen;

     const schuelerList = ["Timo Engler", "Jakob Harsch", "Noah Hitzler", "Lukas Hoffmann", "Marius Karch"
         , "Michael Kratzer", "Juri Till Krauß", "Justin Mack ", "Tim Mader", "Felix Mayer "
         , "Jochen Müller", "Christian Quint", " Hagen Johannes Reinbold ", "Sara Doris Sachs", "Jakob Steck "
         , "Pauline Straub", "Luca  Weller "
     ]


     return (
        <>
            {modal && (
                <div className="modal">
                    <div  className="overlay" onClick={()=> setModal(!modal)} ></div>
                    <div className="modal-content">
                        <h2 className="modal-title">Name auswählen</h2>
                        <button className="btn-close" onClick={()=> setModal(!modal)}> ❌ </button>
                        <h2>Name auswählen</h2>

                        <div className= "nameListe-Container">
                            {
                                schuelerList.map((name, index) => (
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
export default Modal