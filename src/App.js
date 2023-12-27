import './App.css';
import Klassenzimmer from "./components/Klassenzimmer";
import {CurrentStudentProvider} from "./components/CurrentStudentContext";
import {KameraViewProvider, useKameraContext} from "./components/Kamera/KameraViewContext";
import NavBar from "./components/NavBar"
import {useState} from "react";

function App() {
    const [klassenzimmerId, setKlassenzimmerId] = useState(-1);

    return (

        <KameraViewProvider>
            <CurrentStudentProvider>
                <NavBar setKlassenzimmerId={setKlassenzimmerId} klassenzimmerId={klassenzimmerId}></NavBar>
                <div className="App">
                    <Klassenzimmer id={klassenzimmerId}></Klassenzimmer>
                </div>
            </CurrentStudentProvider>
        </KameraViewProvider>
    );
}

export default App;
