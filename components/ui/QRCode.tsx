import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

// NOTE: This component uses an external API for QR code generation for simplicity.
export const QRCode: React.FC<QRCodeProps> = ({ value, size = 150 }) => {
  if (!value) return null;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
  
  return (
    <img src={qrCodeUrl} alt="QR Code" width={size} height={size} />
  );
};