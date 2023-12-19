import './App.css';
import Klassenzimmer from "./components/Klassenzimmer";
import Modal from "./components/Modal";

function App() {
  return (
    <div className="App">
        {/*<Modal/>*/}
      <h1>Mein Klassenzimmer</h1>
      <Klassenzimmer></Klassenzimmer>
    </div>
  );
}

export default App;
