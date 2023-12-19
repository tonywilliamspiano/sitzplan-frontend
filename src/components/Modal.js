import React, { useState } from "react";

import "./Modal.css";

 function Modal(props) {
    const [modal, setModal] = useState(false);


     const schuelerList = ["Timo Engler", "Jakob Harsch", "Noah Hitzler", "Lukas Hoffmann", "Marius Karch"
         , "Michael Kratzer", "Juri Till Krauß", "Justin Mack ", "Tim Mader", "Felix Mayer "
         , "Jochen Müller", "Christian Quint", " Hagen Johannes Reinbold ", "Sara Doris Sachs", "Jakob Steck "
         , "Pauline Straub", "Luca  Weller "
     ]


     return (
        <>
            <button onClick={()=> setModal(!modal)} className="btn-modal">
               +
            </button>

            {modal && (
                <div className="modal">
                    <div  className="overlay"></div>
                    <div className="modal-content">
                        <h2>Name auswählen</h2>
                        <div className= "nameListe-Container">

                            {

                                // schuelerList.map((name, index) => (
                                //     <ul key={index}>
                                //         <li onClick={() =>{
                                //             props.nameAuswaelen(name)
                                //             setModal(!modal)
                                //         }}> {name} </li>
                                //     </ul>

                                schuelerList.map((name, index) => (
                                     <ul key={index}>

                                            <button className="btn-NameListe" onClick={() =>{
                                                props.nameAuswaelen(name)
                                                setModal(!modal)
                                            }}> {name} </button>

                                        </ul>

                                )


                                )

                            }
                            {/*<button className="close-modal" onClick={()=> setModal(!modal)}>*/}
                            {/*    CLOSE*/}
                            {/*</button>*/}
                        </div>

                    </div>
                </div>
            )}

        </>
    );
}
export default Modal