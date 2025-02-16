import { useLocation } from "wouter";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

export default function DesktopHome() {
  const [, setLocation] = useLocation();

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <img 
        src="/images/freepik__retouch__82608.png" 
        alt="Shiva Squad Personality Test" 
        className="w-full h-full object-cover object-center"
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-end gap-8 pb-16 px-6">
      <div className="text-5xl font-bold text-center mb-4 text-white drop-shadow-lg font-poppins tracking-wide">
        Which member of Shiva's Squad
        <br />
        do you relate with the most?
      </div>
        {/* <div className="flex flex-col gap-4 text-center mb-4">
          <p className="text-white text-xl leading-relaxed max-w-2xl drop-shadow-lg font-poppins">
            Take this fun quiz to discover which member of Shiva's Squad you relate with the most. Don't forget to share your results!
          </p>
        </div> */}
        <button
          onClick={() => setLocation("/quiz")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-16 py-4 rounded-full text-2xl font-semibold transition-colors shadow-xl font-poppins tracking-wide"
        >
          Start Quiz
        </button>
        

        
      </div>
    </div>
  );
}
