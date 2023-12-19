import './App.css';
import Klassenzimmer from "./components/Klassenzimmer";
import {CurrentStudentProvider} from "./components/CurrentStudentContext";
import {KameraViewProvider, useKameraContext} from "./components/Kamera/KameraViewContext";

function App() {
    return (
        <KameraViewProvider>
            <CurrentStudentProvider>
                <div className="App">
                    <Klassenzimmer></Klassenzimmer>
                </div>
            </CurrentStudentProvider>
        </KameraViewProvider>
    );
}

export default App;
