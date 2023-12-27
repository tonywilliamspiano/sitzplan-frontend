import "./Modal.css";

function ZimmerModal(props) {

    let modal = props.modal;
    let setModal = props.setModal;

    return (
        <>
            {modal && (
                <div className="modal">
                    <div  className="overlay" onClick={()=> setModal(!modal)} ></div>
                    <div className="modal-content">
                        <button className="btn-close" onClick={()=> setModal(!modal)}> ❌ </button>
                        <div className="dummy-div"></div>
                        <h2 className="modal-title">Name auswählen</h2>
                        <div className= "nameListe-Container">
                        </div>

                    </div>
                </div>
            )}

        </>
    );
}
export default ZimmerModal;