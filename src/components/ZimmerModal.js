import "./Modal.css";
import "./ZimmerModal.css";
import {useState} from "react";
import axios from "axios";

function ZimmerModal(props) {

    let modal = props.modal;
    let setModal = props.setModal;

    const [neuKlassenZimmer, setNeuKlassenZimmer] = useState({
        name: "",
        anzahlDerReihe: 0,
        anzahlDerTischeProReihe: 0,
        anzahlDerSchuelerProTisch: 0

    })

    function handleSubmit() {
        axios.post("http://localhost:8080/sitzplan/klassenzimmer", neuKlassenZimmer, {
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

        setNeuKlassenZimmer({
            name: "",
            anzahlDerReihe: 0,
            anzahlDerTischeProReihe: 0,
            anzahlDerSchuelerProTisch: 0
        })
    }

    function handleInputInfo(event) {
        let {name, value} = event.target;

        if (name !== "name") {
            value = parseInt(value, 10);
        }
        setNeuKlassenZimmer(prevState => ({
            ...prevState,
            [name]: value,
        }));
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
                            <form className="form-container" onSubmit={handleSubmit}>
                                <label className="label">KlassenZimmer Name :</label>
                                <input className="input" type={"text"} required={true} minLength={1} name="name" value={neuKlassenZimmer.name}
                                       onChange={handleInputInfo}/>

                                <label className="label">Anzahl der Reihe :</label>
                                <input className="input" type={"number"} required={true} min={1} name="anzahlDerReihe" value={neuKlassenZimmer.anzahlDerReihe}
                                       onChange={handleInputInfo}/>

                                <label className="label">Anzahl Der Tische Pro Reihe :</label>
                                <input className="input" type={"number"} required={true} min={1} name="anzahlDerTischeProReihe"
                                       value={neuKlassenZimmer.anzahlDerTischeProReihe} onChange={handleInputInfo}/>

                                <label className="label">Anzahl Der Schüler Pro Tisch :</label>
                                <input className="input" type={"number"} required={true} min={1} name="anzahlDerSchuelerProTisch"
                                       value={neuKlassenZimmer.anzahlDerSchuelerProTisch} onChange={handleInputInfo}/>

                                <button class="form-submit" type={"submit"}> Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default ZimmerModal;