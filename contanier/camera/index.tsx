import { Button } from "antd";
import { useEffect, useRef, useState } from "react";

const CameraComponent = () => {
  const [stream, setStream] = useState<MediaStream>();

  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = { video: true };
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(stream);
    } catch (err) {
      console.error("Truy cập thất bại:", err);
    }
  };
  useEffect(() => {
    startCamera();
  }, []);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      {/* <Button type="primary" onClick={startCamera}>
        Open Camera
      </Button> */}
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default CameraComponent;
