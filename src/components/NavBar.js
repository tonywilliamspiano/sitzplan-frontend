import './NavBar.css';

export default function Navbar(props) {

    let setKlassenzimmerId = props.setKlassenzimmerId;

    let mockKlassenzimmer = [
        {
            name: "Klazi 1",
            id: 1
        },
        {
            name: "Klazi 2",
            id: 2
        },
        {
            name: "Klazi 3",
            id: 3
        }
    ]

    let getKlassenZimmer = (
        <>
            {mockKlassenzimmer.map((klassenZimmer) => (
                <div key={klassenZimmer.id} onClick={() => setKlassenzimmerId(klassenZimmer.id)} className="subItem">
                    {klassenZimmer.name}
                </div>
            ))}
        </>
    );

    return (
        <>
            <div id="mySidenav" className="sidenav">
                <div>
                    <div className="navItem">
                        Meine Klassenzimmer
                    </div>
                    {getKlassenZimmer}

                </div>

                <div className="navItem">Neues Klassenzimmer</div>
            </div>
        </>
    )
}