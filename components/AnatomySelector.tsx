import React from 'react';

const AnatomySelector = ({ selectedMuscle, onSelect }) => {
  
  // Helper to determine styling classes based on selection state
  // Using the requested MuscleWiki style:
  // - Unselected: Light gray fill, dark blue/zinc stroke
  // - Selected: Blue fill, dark stroke
  // - Hover: Slightly darker fill
  const getPathProps = (muscle) => ({
    className: `transition-all duration-200 cursor-pointer stroke-[#1e3a8a] stroke-[1px]
      ${selectedMuscle === muscle 
        ? 'fill-[#3b82f6]' // Blue fill when selected
        : 'fill-[#e5e7eb] hover:fill-[#d1d5db]'}`, // Light gray fill, darker on hover
    onClick: () => onSelect(muscle)
  });

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-16 py-10 select-none bg-white/5 rounded-3xl p-8">
      
      {/* --- FRONT VIEW (Anterior) --- */}
      <div className="relative group flex flex-col items-center">
        <h3 className="text-zinc-400 text-xs tracking-[0.2em] font-bold uppercase mb-4">Anterior</h3>
        
        {/* Adjusted ViewBox for a cleaner mannequin look */}
        <svg width="200" height="460" viewBox="0 0 200 460" className="drop-shadow-lg">
          <g>
            {/* HEAD */}
            <path d="M100 20 C112 20 118 32 115 45 C114 50 108 55 100 55 C92 55 86 50 85 45 C82 32 88 20 100 20 Z" className="fill-[#e5e7eb] stroke-[#1e3a8a] stroke-[1px]" />

            {/* NECK/TRAPS */}
            <path d="M85 45 L70 55 L130 55 L115 45 Z" {...getPathProps('Omuz')} />

            {/* SHOULDERS (Deltoids) */}
            <path d="M70 55 L50 65 L55 90 L70 80 Z" {...getPathProps('Omuz')} />
            <path d="M130 55 L150 65 L145 90 L130 80 Z" {...getPathProps('Omuz')} />

            {/* CHEST (Pectorals) */}
            <path d="M70 55 L130 55 L125 95 L100 105 L75 95 Z" {...getPathProps('Göğüs')} />

            {/* ARMS (Biceps) */}
            <path d="M55 90 L45 115 L55 120 L70 80 Z" {...getPathProps('Kol')} />
            <path d="M145 90 L155 115 L145 120 L130 80 Z" {...getPathProps('Kol')} />

            {/* FOREARMS */}
            <path d="M45 115 L35 150 L45 155 L55 120 Z" {...getPathProps('Kol')} />
            <path d="M155 115 L165 150 L155 155 L145 120 Z" {...getPathProps('Kol')} />

            {/* ABS (Abdominals) */}
            <path d="M75 95 L125 95 L115 145 L85 145 Z" {...getPathProps('Karın')} />

            {/* OBLIQUES */}
            <path d="M75 95 L85 145 L70 140 L70 80 Z" {...getPathProps('Karın')} />
            <path d="M125 95 L115 145 L130 140 L130 80 Z" {...getPathProps('Karın')} />

            {/* PELVIS Area (Non-interactive connector) */}
            <path d="M85 145 L115 145 L100 160 Z" className="fill-[#e5e7eb] stroke-[#1e3a8a] stroke-[1px]" />

            {/* QUADS (Thighs) */}
            <path d="M85 145 L100 160 L95 230 L70 220 L55 180 Z" {...getPathProps('Bacak')} />
            <path d="M115 145 L100 160 L105 230 L130 220 L145 180 Z" {...getPathProps('Bacak')} />

            {/* CALVES (Shins) */}
            <path d="M70 220 L95 230 L90 300 L75 310 L65 280 Z" {...getPathProps('Bacak')} />
            <path d="M130 220 L105 230 L110 300 L125 310 L135 280 Z" {...getPathProps('Bacak')} />
          </g>
        </svg>
      </div>

      {/* --- BACK VIEW (Posterior) --- */}
      <div className="relative group flex flex-col items-center">
        <h3 className="text-zinc-400 text-xs tracking-[0.2em] font-bold uppercase mb-4">Posterior</h3>
        
        <svg width="200" height="460" viewBox="0 0 200 460" className="drop-shadow-lg">
          <g>
             {/* HEAD BACK */}
             <path d="M100 20 C112 20 118 32 115 45 C114 50 108 55 100 55 C92 55 86 50 85 45 C82 32 88 20 100 20 Z" className="fill-[#e5e7eb] stroke-[#1e3a8a] stroke-[1px]" />

            {/* TRAPS/BACK NECK */}
            <path d="M85 45 L70 55 L100 70 L130 55 L115 45 Z" {...getPathProps('Sırt')} />

            {/* SHOULDERS REAR */}
            <path d="M70 55 L50 65 L55 85 L70 70 Z" {...getPathProps('Omuz')} />
            <path d="M130 55 L150 65 L145 85 L130 70 Z" {...getPathProps('Omuz')} />

            {/* UPPER BACK (Lats/Rhomboids) */}
            <path d="M70 70 L100 85 L130 70 L120 120 L100 130 L80 120 Z" {...getPathProps('Sırt')} />

            {/* TRICEPS (Arms Back) */}
            <path d="M55 85 L45 115 L55 120 L65 100 Z" {...getPathProps('Kol')} />
            <path d="M145 85 L155 115 L145 120 L135 100 Z" {...getPathProps('Kol')} />

             {/* FOREARMS BACK */}
            <path d="M45 115 L35 150 L45 155 L55 120 Z" {...getPathProps('Kol')} />
            <path d="M155 115 L165 150 L155 155 L145 120 Z" {...getPathProps('Kol')} />

            {/* LOWER BACK */}
            <path d="M80 120 L100 130 L120 120 L115 145 L85 145 Z" {...getPathProps('Sırt')} />

            {/* GLUTES */}
            <path d="M85 145 L100 145 L100 180 L70 170 Z" {...getPathProps('Bacak')} />
            <path d="M115 145 L100 145 L100 180 L130 170 Z" {...getPathProps('Bacak')} />

            {/* HAMSTRINGS */}
            <path d="M70 170 L100 180 L95 230 L60 220 Z" {...getPathProps('Bacak')} />
            <path d="M130 170 L100 180 L105 230 L140 220 Z" {...getPathProps('Bacak')} />

            {/* CALVES BACK */}
            <path d="M60 220 L95 230 L90 300 L70 290 Z" {...getPathProps('Bacak')} />
            <path d="M140 220 L105 230 L110 300 L130 290 Z" {...getPathProps('Bacak')} />

          </g>
        </svg>
      </div>

    </div>
  );
};

export default AnatomySelector;
