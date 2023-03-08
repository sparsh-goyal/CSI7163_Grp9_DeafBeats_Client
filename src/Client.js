import React, { useState, useRef } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "./Firebase";
import "./Client.css";

function WebcamStreamCapture() {
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isGetStartedBtnClicked, setGetStartedBtnClicked] = useState(false);

  const videoRef = useRef(null);

  const startWebcam = async () => {
    setGetStartedBtnClicked(true);
    try {
      // access webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(stream);
      setVideoUrl(null);

      // display the stream from webcam
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices.", error);
      setErrorMsg("Error accessing media devices.");
    }
  };

  const stopWebcam = () => {
    setGetStartedBtnClicked(false);
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setVideoUrl(null);
    }
  };

  var optionsVp9 = {
    mimeType: "video/webm",
    codecs: "vp9",
    videoBitsPerSecond: 2500000,
  };

  const record = (stream) => {
    // record video from the browser
    var mediaRecorderVp9 = new MediaRecorder(stream, optionsVp9);

    // saves data in chunks
    const chunks = [];

    mediaRecorderVp9.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    mediaRecorderVp9.addEventListener("stop", () => {
      // save chunks as Blob object
      var startTimeVp9 = new Date();
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoUrl(URL.createObjectURL(blob));
      var elapsedTimeVp9 = new Date() - startTimeVp9;
      console.warn("Time to encode file using VP9: " + elapsedTimeVp9 + " ms");

      setRecording(false);

      // configure VP9 file
      const videoName = prompt(
        "Enter the file name for uploading the VP9 file:"
      );
      setStream(null);
      setVideoUrl(null);
      setGetStartedBtnClicked(false)
      const storageRef = ref(storage, videoName);
      // send to the firebase server
      uploadBytes(storageRef, blob).then(() => {
        alert("VP9 File " + videoName + ".webm was uploaded!");
      });
    });

    mediaRecorderVp9.start();
    setRecording(true);
  };

  const startRecording = () => {
    if (!stream) return;
    record(stream);
  };

  const stopRecording = () => {
    if (!stream) return;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  };

  return (
    <div className="min-vh-100 min-vw-100" id="homepage">
      {!isGetStartedBtnClicked && (
        <div>
          <h1 id="title">DeafBeats</h1>
          <h3 id="subTitle">
            An application for Deaf People to generate and enjoy music
          </h3>
        </div>
      )}
      {errorMsg && <div>{errorMsg}</div>}
      {isGetStartedBtnClicked && (
        <div className="d-flex">
          <video id="webcamVideo" ref={videoRef} autoPlay={true} />
          <div id="instructions" className="pt-4">
            <h4 className="text-center">Instructions</h4>
            <h5>Make <img src="./a.jpg" width={60} height={70}></img> gesture for note corresponding A</h5>
            <h5>Make <img src="./b.jpg" width={60} height={70}></img> gesture for note corresponding B</h5>
            <h5>Make <img src="./c.jpg" width={60} height={70}></img> gesture for note corresponding C</h5>
            <div>
              {stream && (
                <div className="d-flex justify-content-between pt-5">
                  {recording ? (
                    <button id="stopRecBtn" onClick={stopRecording}>
                      Stop Recording
                    </button>
                  ) : (
                    <button id="startRecBtn" onClick={startRecording}>
                      Start Recording
                    </button>
                  )}
                  <button id="stopWebcamBtn" onClick={stopWebcam}>
                    Stop Webcam
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!isGetStartedBtnClicked && (
        <button id="getStartedBtn" onClick={startWebcam}>
          Get Started
        </button>
      )}

      {!isGetStartedBtnClicked && (
        <footer id="teamIntro">
          Made with ❤ and care by Sparsh and Luciana (Group #9)
        </footer>
      )}
    </div>
  );
}

export default WebcamStreamCapture;
