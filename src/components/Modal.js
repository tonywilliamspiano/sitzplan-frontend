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
                Open
            </button>

            {modal && (
                <div className="modal">
                    <div  className="overlay"></div>
                    <div className="modal-content">
                        <h2>Name auswählen</h2>
                        <p>

                            {

                                schuelerList.map((name, index) => (
                                    <ul key={index}>
                                        <li onClick={() =>{
                                            props.nameAuswaelen(name)
                                            setModal(!modal)
                                        }}> {name} </li>
                                    </ul>
                                )

                                // schuelerList.map((name,index)=>
                                // <ul>
                                //     <li key={index} onClick={(name) => props.nameAuswaelen(name)}>  {name} </li>
                                //
                                // </ul>

                                )


                            }
                            <button className="close-modal" onClick={()=> setModal(!modal)}>
                                CLOSE
                            </button>
                        </p>
                        {/*<button className="close-modal" onClick={()=> setModal(!modal)}>*/}
                        {/*    CLOSE*/}
                        {/*</button>*/}
                    </div>
                </div>
            )}

        </>
    );
}
export default Modal