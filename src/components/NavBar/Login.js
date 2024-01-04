import React, {useEffect, useState} from "react";
import axios from "axios";

export default function Login() {
    const [benutzername, setBenutzername] = useState();
    const [passwort, setPasswort] = useState();

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = {
            "username": benutzername,
            "password": passwort
        }
        axios.post("http://localhost:8080/sitzplan/login", credentials)
            .then((response) => {
                console.log(response)
            })
    };

    return(
        <div className="loginBox">
            <h1>Bitte einloggen: </h1>
            <form>
                <label>
                    <p>Benutzername</p>
                    <input type="text" onChange={event => setBenutzername(event.target.value)}/>
                </label>
                <label>
                    <p>Passwort</p>
                    <input type="password" onChange={event => setPasswort(event.target.value)}/>
                </label>
                <div>
                    <button type="submit" onClick={handleSubmit}>Senden</button>
                </div>
            </form>
        </div>
    )
}