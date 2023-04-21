import { useState } from "react";
import jsQR from "jsqr";

const ImageQRScanner = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const code = jsQR(
              imageData.data,
              imageData.width,
              imageData.height
            );
            if (code) {
              setQrCode(code.data);
            } else {
              setQrCode(null);
            }
          }
        };
        img.src = reader.result as string;
      };
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "5rem 0", fontSize: "3rem" }}>
      <input
        style={{ fontSize: "1rem" }}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {qrCode && <p>{qrCode}</p>}
    </div>
  );
};

export default ImageQRScanner;
