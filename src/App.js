import './App.css';
import Klassenzimmer from "./components/Klassenzimmer";
import {CurrentStudentProvider} from "./components/CurrentStudentContext";
import {KameraViewProvider, useKameraContext} from "./components/Kamera/KameraViewContext";
import NavBar from "./components/NavBar/NavBar"
import {useState} from "react";
import {KlassenListeProvider} from "./components/KlassenListeContext";

function App() {
    const [klassenzimmerId, setKlassenzimmerId] = useState(-1);
    const [schuelerContent, setSchuelerContent] = useState("+")

    return (

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
    );
}

export default App;
