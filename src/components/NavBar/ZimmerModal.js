import "../Modal.css";
import "./ZimmerModal.css";
import {useState} from "react";
import axios from "axios";

function ZimmerModal(props) {
    const apiUrl = process.env.REACT_APP_URL;

    let modal = props.modal;
    let setModal = props.setModal;

    const [neuKlassenZimmer, setNeuKlassenZimmer] = useState({
        name: "",
        anzahlDerReihe: 1,
        anzahlDerTischeProReihe: 1,
        anzahlDerSchuelerProTisch: 1

    })

    function handleSubmit() {
        axios.post(apiUrl + "/sitzplan/klassenzimmer", neuKlassenZimmer, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                props.setKlassenzimmerId(response.data.id)
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
                                <label className="label">Klassenzimmer Name :</label>
                                <input className="name-input" placeholder="Mein Klassenzimmer" type={"text"} required={true} minLength={1} name="name" value={neuKlassenZimmer.name}
                                       onChange={handleInputInfo}/>

                                <label className="label">Reihen:</label>
                                <select className="input" name="anzahlDerReihe" value={neuKlassenZimmer.anzahlDerReihe} onChange={handleInputInfo}>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>

                                <label className="label">Tische pro Reihe :</label>
                                <select className="input" name="anzahlDerTischeProReihe" value={neuKlassenZimmer.anzahlDerTischeProReihe} onChange={handleInputInfo}>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>

                                <label className="label">Schüler pro Tisch :</label>
                                <select className="input" name="anzahlDerSchuelerProTisch" value={neuKlassenZimmer.anzahlDerSchuelerProTisch} onChange={handleInputInfo}>
                                    {[1, 2, 3].map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>

                                <button className="form-submit" type={"submit"}>Klassenzimmer anlegen</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default ZimmerModal;