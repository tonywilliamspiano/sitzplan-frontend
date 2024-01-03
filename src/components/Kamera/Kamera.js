import Webcam from "react-webcam";
import {React, useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import './Kamera.css'
import {useCurrentStudent} from "../CurrentStudentContext";

export default function Kamera(props) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const enableCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({video: videoConstraints});

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };

        enableCamera();

        // Cleanup stream on component unmount
        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };
    }, []);

    const apiUrl = process.env.REACT_APP_URL

    const [img, setImg] = useState(null);
    const webcamRef = useRef(null);
    const {currentStudent, setCurrentStudent} = useCurrentStudent();

    const videoConstraints = {
        width: 420,
        height: 420,
        facingMode: {ideal: 'environment'},
    };

    const fotoMachen = useCallback(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            // Set canvas dimensions to match the video frame
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame onto the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert the canvas content to an image data URL
            console.log("foto machen!")

            const imageDataUrl = canvas.toDataURL('image/png');
            setImg(imageDataUrl);
        }
    }, [videoRef]);

    const fotoSpeichern = async () => {
        // Convert the base64 image data to a Blob
        const byteCharacters = atob(img.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'image/png'});

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
                    <video ref={videoRef} autoPlay playsInline/>
                    <canvas ref={canvasRef} style={{display: 'none'}}/>
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
                    <img src={img} className="WebcamComponent" alt="screenshot"/>
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