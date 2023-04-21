import { Button } from "antd";
import jsQR, { QRCode } from "jsqr";
import { useEffect, useRef, useState } from "react";

const ScannerQR = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream;

    const video = videoRef.current;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        stream = mediaStream;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((error) => {
        console.error("Không lấy được dữ liệu. Kết nối thất bại", error);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const scanQRCode = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(video, 0, 0, width, height);
      const imageData = ctx?.getImageData(0, 0, width, height);
      const code: QRCode | null = imageData
        ? jsQR(imageData.data, imageData.width, imageData.height)
        : null;
      if (code) {
        setQrCode(code.data);
      } else {
        setQrCode(null);
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <video ref={videoRef} />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
      <Button style={{ margin: "2rem 0" }} onClick={scanQRCode}>
        Scan QRCode
      </Button>
      <div>QR Code: {qrCode}</div>
    </div>
  );
};

export default ScannerQR;
