export default function Spinner() {
  return (
    <div className="flex items-center justify-center gap-4">
        <svg
        width={30}
        height={20}
        viewBox="34 42 342 194"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ overflow: "visible" }}
        >
        <defs>
            <style>{`
            @keyframes redolapy-travel {
                0%   { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: -1200; }
            }
            `}</style>
        </defs>

        <path
            fill="none"
            stroke="white"
            strokeWidth={24}
            strokeLinecap="round"
            opacity={0.2}
            d="M180,130 
            C180,130 130,70 70,100 
            C70,100 10,140 60,185 
            C60,185 100,220 150,180
            C150,180 170,170 220,100
            C220,100 260,40 310,50
            C310,50 360,60 360,100
            C360,100 365,180 240,170
            C240,170 195,170 220,150
            C220,150 250,120 315,190
            C315,190 350,230 370,230"
        />

        <path
            fill="none"
            stroke="white"
            strokeWidth={24}
            strokeLinecap="round"
            strokeDasharray="100 1200"
            strokeDashoffset={0}
            style={{
            animation: "redolapy-travel 1.8s linear infinite",
            }}
            d="M180,130 
            C180,130 130,70 70,100 
            C70,100 10,140 60,185 
            C60,185 100,220 150,180
            C150,180 170,170 220,100
            C220,100 260,40 310,50
            C310,50 360,60 360,100
            C360,100 365,180 240,170
            C240,170 195,170 220,150
            C220,150 250,120 315,190
            C315,190 350,230 370,230"
        />
        </svg>
        <p>Loading...</p>
    </div>
  );
}