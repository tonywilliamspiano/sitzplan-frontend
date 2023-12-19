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

function Schueler(schueler) {

    // TODO - Pass in either a schueler object or null - conditionally rendering the image and
    // schueler = {
    //     name: "tony",
    //     image: "hello"
    // }
    return (
        <div className="Schueler">
            {schueler.image !== null && schueler.image !== undefined && schueler.image !== '' ? (
                <>
                    <img src="test.png" className="schuelerBild" alt="EMPTY"/>
                    <p className="schuelerName">{schueler.name}</p>
                </>
            ) : (
                <p className="schuelerHinzufuegen">+</p>
            )}
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