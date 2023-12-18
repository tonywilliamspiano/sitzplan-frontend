export default function Klassenzimmer() {
    return (
        <div className="Klassenzimmer">
            <Reihe></Reihe>
            <Reihe></Reihe>
            <Reihe></Reihe>
            <Reihe></Reihe>
            <Lehrkraft></Lehrkraft>
        </div>
    )
}

function Reihe() {
    return (
        <div className="Reihe">
            <Tisch>Tisch</Tisch>
            <Tisch>Tisch</Tisch>
            <Tisch>Tisch</Tisch>
        </div>
    )
}

function Tisch() {
    return (
        <div className="Tisch">
            <Schueler>Schüler</Schueler>
            <Schueler>Schüler</Schueler>
        </div>
    )
}

function Schueler() {
    return (
        <div className="Schueler">
            {/*<p className="schuelerBild">Bild</p>*/}
            {/*<p className="schuelerName">Name</p>*/}
            <p className="schuelerHinzufuegen">+</p>
        </div>
    )
}

function Lehrer() {
    return (
        <div className="Lehrer">LehrerName</div>
    );
}

function Lehrkraft() {
    return (
        <div className="Lehrkraft">
            <Lehrer></Lehrer>
        </div>
    );
}