import Webcam from "react-webcam";
import {React, useCallback, useRef, useState} from "react";
import axios from "axios";
import './Kamera.css'
import {useCurrentStudent} from "../CurrentStudentContext";

export default function Kamera(props) {
    const apiUrl = process.env.REACT_APP_URL

    const [img, setImg] = useState(null);
    const webcamRef = useRef(null);
    const { currentStudent, setCurrentStudent } = useCurrentStudent();

    const videoConstraints = {
        width: 420,
        height: 420,
        facingMode: "user",
    };

    const fotoMachen = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImg(imageSrc);
    }, [webcamRef]);

    const fotoSpeichern = async () => {
        // Convert the base64 image data to a Blob
        const byteCharacters = atob(img.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        // Create a FormData object to send the image as a file
        const formData = new FormData();
        formData.append('image', blob, 'captured_image.png');
        formData.append('name', currentStudent.name);

        try {
            const response = await axios.post(apiUrl + '/sitzplan/foto/' + currentStudent.id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Server response:', response.data);
        } catch (error) {
            // Handle errors
            console.error('Error uploading image:', error);
        }
        setCurrentStudent(null);
        props.setKameraView(false);
        
    };

    return (
        <div className="webcamContainer">
            {img == null ? (
                <>
                    <Webcam className="WebcamComponent"
                            ref={webcamRef}
                            videoConstraints={videoConstraints}/>
                    <div className="takePhotoButtonContainer">
                        <button onClick={() => {
                            setCurrentStudent(null);
                            props.setKameraView(false);
                        }} className="zurueckButton">
                            Kein Foto
                        </button>
                        <div onClick={fotoMachen} className="photoButton">
                            <div className="insidePhotoButton"></div>
                        </div>
                        <div className="dummyButton">
                            <div></div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <img src={img} className="WebcamComponent" alt="screenshot" />
                    <div className="photoButtonContainer">
                        <button onClick={() => setImg(null)} className="retakeButton">
                            Neues Foto
                        </button>
                        <button onClick={fotoSpeichern} className="submit-button">
                            Weiter
                        </button>
                    </div>
                </>
            )
            }

            {/*{img == null && (*/}
            {/*    <div className="defaultPhotoContainer">*/}
            {/*        <img  src={process.env.PUBLIC_URL + '/defaultfoto.png'} alt="default" />*/}

            {/*       */}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
}