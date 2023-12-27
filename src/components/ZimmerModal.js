import "./Modal.css";
import {useState} from "react";
import axios from "axios";

function ZimmerModal(props) {

    let modal = props.modal;
    let setModal = props.setModal;

    const[neuKlassenZimmer,setNeuKlassenZimmer] = useState({
        name:"",
        anzahlDerReihe:0,
        anzahlDerTischProReihe:0,
        anzahlDerSchuelerProTisch:0

    })

    function handelInputInfo(event) {

        const{name, value} = event.target;

        if(name !== "name"){
            value = parseInt()
        }

        setNeuKlassenZimmer({...neuKlassenZimmer,[name]:value})

        // console.log(event.target.value)
        //
        // setNeuKlassenZimmer(event.target.value)

    }

    async function handelsubmet(event) {
       event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/sitzplan/klassenzimmer', neuKlassenZimmer, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error( error);
        }

    }



    return (
        <>
            {modal && (
                <div className="modal">
                    <div className="overlay" onClick={() => setModal(!modal)}></div>
                    <div className="modal-content">
                        <button className="btn-close" onClick={() => setModal(!modal)}> ❌</button>
                        <div className="dummy-div">
                        </div>
                        <h2 className="zimmer-titel">Felder bitte ausfüllen</h2>
                        <div className="nameListe-Container">
                          <form onSubmit={handelsubmet}>
                              <label>KlassenZimmer Name :</label>
                              <input type={"text"} value={neuKlassenZimmer.name} onChange={handelInputInfo}/>

                              <label>Anzahl der Reihe :</label>
                              <input type={"number"} value={neuKlassenZimmer.anzahlDerReihe} onChange={handelInputInfo}/>

                              <label>Anzahl Der Tische Pro Reihe :</label>
                              <input type={"number"} value={neuKlassenZimmer.anzahlDerTischProReihe} onChange={handelInputInfo}/>

                              <label>Anzahl Der Schüler Pro Tisch :</label>
                              <input type={"number"} value={neuKlassenZimmer.anzahlDerSchuelerProTisch} onChange={handelInputInfo}/>

                              <button type={"submit"}> Submit</button>


                          </form>
                        </div>
                    </div>
                </div>
                )}

        </>
);
}
export default ZimmerModal;