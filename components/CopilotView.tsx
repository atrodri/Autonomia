import React, { useEffect, useRef, useState } from 'react';
import { Header } from './Header';

declare global {
  interface Window {
    google: any;
  }
}

interface CopilotViewProps {
  origin: string;
  destination: string;
}

const CopilotView: React.FC<CopilotViewProps> = ({ origin, destination }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [routeInstructions, setRouteInstructions] = useState<string[]>([]);
  const [tripSummary, setTripSummary] = useState<{ distance: string; duration: string }>({ distance: '', duration: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        disableDefaultUI: true,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#FF6B00" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
        ],
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        polylineOptions: { strokeColor: '#FFEB3B', strokeWeight: 8, strokeOpacity: 0.9 },
      });
      directionsRenderer.setMap(map);

      const [lat, lng] = origin.split(',').map(Number);
      const originLatLng = { lat, lng };

      directionsService.route(
        { origin: originLatLng, destination, travelMode: 'DRIVING' },
        (result: any, status: string) => {
          if (status === 'OK' && result?.routes?.[0]?.legs?.[0]) {
            directionsRenderer.setDirections(result);
            const leg = result.routes[0].legs[0];
            setTripSummary({ distance: leg.distance.text, duration: leg.duration.text });
            const instructions = leg.steps.map((step: any) => step.instructions.replace(/<[^>]*>/g, ''));
            setRouteInstructions(instructions);
          } else {
            setError('Não foi possível carregar a rota do co-piloto.');
          }
        }
      );
    }
  }, [origin, destination]);

  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col p-4 md:p-6 container mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white">Visualização do Co-piloto</h2>
          <p className="text-sm text-[#CFCFCF]">Acompanhe a rota para auxiliar o motorista.</p>
        </div>
        
        {error && <p className="text-center text-red-500">{error}</p>}
        
        <div className="bg-[#141414] rounded-lg shadow-lg p-4 flex-grow flex flex-col gap-4">
          <div ref={mapRef} className="w-full h-64 md:h-80 rounded-md bg-[#0A0A0A] border border-[#444]" />
          <div className="flex-grow overflow-y-auto pr-2">
            <h3 className="text-lg font-semibold text-[#FF6B00] mb-2">Instruções da Rota</h3>
            {tripSummary.distance && (
              <p className="text-sm text-white mb-3">
                Total: <span className="font-bold">{tripSummary.distance}</span> ({tripSummary.duration})
              </p>
            )}
            <ul className="space-y-2 text-sm">
              {routeInstructions.map((instr, index) => (
                <li key={index} className="border-b border-[#2a2a2a] pb-2 last:border-b-0">{instr}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopilotView;