import { useLocation } from "wouter";

export default function MobileHome() {
  const [, setLocation] = useLocation();

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-orange-50">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/images/mobile-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.95
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4">
        <h1 className="text-3xl font-bold text-center text-white">
        Which member of Shiva’s Squad do you relate with the most?
        </h1>

        <button
          onClick={() => setLocation("/quiz")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-xl font-semibold transition-colors shadow-xl"
        >
          Start Quiz
        </button>

        
      </div>
    </div>
  );
}