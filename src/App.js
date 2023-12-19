import './App.css';
import Klassenzimmer from "./components/Klassenzimmer";
import Kamera from "./components/Kamera/Kamera";
import {useState} from "react";

function App() {
    const [kameraView, setKameraView] = useState(false);

    return (
        <div className="App">
            {kameraView ? (
                <Kamera setKameraView={setKameraView}></Kamera>
            ) : (
                <>
                    <h1 className="titel" onClick={() => setKameraView(!kameraView)}>Mein Klassenzimmer</h1>
                    <Klassenzimmer></Klassenzimmer>
                </>
            )}
        </div>
    );
}

export default App;
