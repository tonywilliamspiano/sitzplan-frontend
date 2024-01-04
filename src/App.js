import './App.css';
import Klassenzimmer from "./components/Klassenzimmer";
import {CurrentStudentProvider} from "./components/CurrentStudentContext";
import {KameraViewProvider, useKameraContext} from "./components/Kamera/KameraViewContext";
import NavBar from "./components/NavBar/NavBar"
import Login from "./components/NavBar/Login"
import {useState} from "react";
import {KlassenListeProvider} from "./components/KlassenListeContext";
import axios from "axios";

function App() {
    const [klassenzimmerId, setKlassenzimmerId] = useState(-1);
    const [schuelerContent, setSchuelerContent] = useState("+");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // so dass in jedem axios request die cookies mitgesendet werden
    axios.defaults.withCredentials = true;
    const allCookies = document.cookie;
    const cookiesArray = allCookies.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        const cookie = cookiesArray[i].trim();
        if (cookie.indexOf('sessionId=') === 0) {
            setIsLoggedIn(true);
        }
    }

    return (
        <>
        { isLoggedIn ? (

            <KameraViewProvider>
                <KlassenListeProvider>
                    <CurrentStudentProvider>
                        <NavBar setKlassenzimmerId={setKlassenzimmerId} klassenzimmerId={klassenzimmerId} schuelerContent={schuelerContent} setSchuelerContent={setSchuelerContent}></NavBar>
                        <div className="App">
                            <Klassenzimmer id={klassenzimmerId} setKlassenzimmerId={setKlassenzimmerId} schuelerContent={schuelerContent} setSchuelerContent={setSchuelerContent}></Klassenzimmer>
                        </div>
                    </CurrentStudentProvider>
                </KlassenListeProvider>
            </KameraViewProvider>
            ) : (
                <Login setIsLoggedIn={setIsLoggedIn}></Login>)}
        </>
    );
}

export default App;
