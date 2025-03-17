import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import Loader from "./components/loader";
import ButtonHandler from "./components/btn-handler";
import { detect, detectVideo } from "./utils/detect";
import "./style/App.css";

const App = () => {
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape

  // references
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // model configs
  const modelName = "yolo11n";

  useEffect(() => {
    tf.ready().then(async () => {
      const yolo = await tf.loadGraphModel(`${window.location.href}/${modelName}_web_model/model.json`, {
        onProgress: (fractions) => {
          setLoading({ loading: true, progress: fractions }); // set loading fractions
        },
      }); // load model

      // warming up model
      const dummyInput = tf.ones(yolo.inputs[0].shape);
      const warmupResults = yolo.execute(dummyInput);

      setLoading({ loading: false, progress: 1 });
      setModel({
        net: yolo,
        inputShape: yolo.inputs[0].shape,
      }); // set model & input shape
      tf.dispose([warmupResults, dummyInput]); // cleanup memory
    });
  }, []);

  return (
    <div className="App">
      {loading.loading && <Loader>{(loading.progress * 100).toFixed(0)}%</Loader>}
      <ButtonHandler imageRef={imageRef} cameraRef={cameraRef} videoRef={videoRef} />

      <div className="content">
        <img src="#" ref={imageRef} onLoad={() => detect(imageRef.current, model, canvasRef.current)} />
        <video autoPlay muted playsInline ref={cameraRef} onPlay={() => detectVideo(cameraRef.current, model, canvasRef.current)} />
        <video autoPlay muted playsInline ref={videoRef} onPlay={() => detectVideo(videoRef.current, model, canvasRef.current)} />
        <canvas width={model.inputShape[1]} height={model.inputShape[2]} ref={canvasRef} />
      </div>
    </div>
  );
};

export default App;
