import Webcam from "react-webcam";
import {useCallback, useRef, useState} from "react";

export default function Kamera() {
    const [img, setImg] = useState(null);
    const webcamRef = useRef(null);

    const videoConstraints = {
        width: 420,
        height: 420,
        facingMode: "user",
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImg(imageSrc);
    }, [webcamRef]);

    return (
        <div className="webcamContainer">
            {img == null ? (
                <>
                    <Webcam className="WebcamComponent"
                            ref={webcamRef}
                            videoConstraints={videoConstraints}/>
                    <div className="photoButtonContainer">
                        <button onClick={capture} className="photoButton">
                            <div className="insidePhotoButton"></div>
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <img src={img} className="WebcamComponent" alt="screenshot" />
                    <div className="photoButtonContainer">
                        <button onClick={() => setImg(null)} className="retakeButton">
                            Neues Foto
                        </button>
                        <button onClick={() => setImg(null)} className="submit-button">
                            Weiter
                        </button>
                    </div>
                </>
            )
            }
        </div>
    );
}