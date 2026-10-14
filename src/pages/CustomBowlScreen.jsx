import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Sparkles, 
  Plus, 
  Check, 
  ShoppingBag, 
  Flame, 
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CUSTOM_BOWL_OPTIONS } from '../data/mockData';
import confetti from 'canvas-confetti';

export const CustomBowlScreen = () => {
  const { goBack, addToCart, navigateTo, cartItemCount, showToast } = useApp();

  const [bowlName, setBowlName] = useState('My Signature Harvest Bowl');
  const [selectedBase, setSelectedBase] = useState(CUSTOM_BOWL_OPTIONS.bases[0].id);
  const [selectedVeggies, setSelectedVeggies] = useState([CUSTOM_BOWL_OPTIONS.veggies[0].id, CUSTOM_BOWL_OPTIONS.veggies[1].id]);
  const [selectedProtein, setSelectedProtein] = useState(CUSTOM_BOWL_OPTIONS.proteins[0].id);
  const [selectedDressing, setSelectedDressing] = useState(CUSTOM_BOWL_OPTIONS.dressings[0].id);
  const [selectedToppings, setSelectedToppings] = useState([CUSTOM_BOWL_OPTIONS.toppings[0].id]);
  const [activeStep, setActiveStep] = useState('base'); // 'base' | 'veggies' | 'protein' | 'dressing' | 'toppings'

  const baseItem = CUSTOM_BOWL_OPTIONS.bases.find(b => b.id === selectedBase) || CUSTOM_BOWL_OPTIONS.bases[0];
  const proteinItem = CUSTOM_BOWL_OPTIONS.proteins.find(p => p.id === selectedProtein) || CUSTOM_BOWL_OPTIONS.proteins[0];
  const dressingItem = CUSTOM_BOWL_OPTIONS.dressings.find(d => d.id === selectedDressing) || CUSTOM_BOWL_OPTIONS.dressings[0];
  const veggieItems = CUSTOM_BOWL_OPTIONS.veggies.filter(v => selectedVeggies.includes(v.id));
  const toppingItems = CUSTOM_BOWL_OPTIONS.toppings.filter(t => selectedToppings.includes(t.id));

  // Toggle Veggies (Max 3)
  const toggleVeggie = (id) => {
    if (selectedVeggies.includes(id)) {
      if (selectedVeggies.length > 1) {
        setSelectedVeggies(selectedVeggies.filter(v => v !== id));
      } else {
        showToast('Please select at least 1 veggie');
      }
    } else {
      if (selectedVeggies.length >= 3) {
        showToast('Maximum 3 veggies included. Tap one to swap.');
      } else {
        setSelectedVeggies([...selectedVeggies, id]);
      }
    }
  };

  // Toggle Toppings (Max 2)
  const toggleTopping = (id) => {
    if (selectedToppings.includes(id)) {
      setSelectedToppings(selectedToppings.filter(t => t !== id));
    } else {
      if (selectedToppings.length >= 2) {
        showToast('Maximum 2 toppings included');
      } else {
        setSelectedToppings([...selectedToppings, id]);
      }
    }
  };

  // Reset to default bowl
  const handleReset = () => {
    setSelectedBase(CUSTOM_BOWL_OPTIONS.bases[0].id);
    setSelectedVeggies([CUSTOM_BOWL_OPTIONS.veggies[0].id, CUSTOM_BOWL_OPTIONS.veggies[1].id]);
    setSelectedProtein(CUSTOM_BOWL_OPTIONS.proteins[0].id);
    setSelectedDressing(CUSTOM_BOWL_OPTIONS.dressings[0].id);
    setSelectedToppings([CUSTOM_BOWL_OPTIONS.toppings[0].id]);
    showToast('Reset to chef\'s harvest bowl default');
  };

  // Nutrition Calculations
  const nutrition = useMemo(() => {
    let calories = baseItem.cal + proteinItem.cal + dressingItem.cal;
    let protein = baseItem.protein + proteinItem.protein;
    let carbs = baseItem.carbs + proteinItem.carbs;
    let fat = baseItem.fat + proteinItem.fat + dressingItem.fat;
    let fiber = (baseItem.fiber || 0) + (proteinItem.fiber || 0);

    veggieItems.forEach(v => {
      calories += v.cal;
      protein += v.protein;
      carbs += v.carbs;
      fat += v.fat;
      fiber += (v.fiber || 0);
    });

    toppingItems.forEach(t => {
      calories += t.cal;
      if (t.id === 'feta') { protein += 4; fat += 6; }
      if (t.id === 'pumpkin-seeds') { protein += 3; fat += 5; fiber += 1; }
      if (t.id === 'avocado') { protein += 1; fat += 11; fiber += 5; carbs += 6; }
    });

    return { calories, protein, carbs, fat, fiber };
  }, [baseItem, proteinItem, dressingItem, veggieItems, toppingItems]);

  // Price Calculation ($13.50 base)
  const totalPrice = useMemo(() => {
    let price = 13.50;
    if (proteinItem.priceAdd) price += proteinItem.priceAdd;
    toppingItems.forEach(t => {
      if (t.priceAdd) price += t.priceAdd;
    });
    return price;
  }, [proteinItem, toppingItems]);

  // Add to Bag
  const handleAddCustomBowl = () => {
    const summaryList = [
      baseItem.name,
      ...veggieItems.map(v => v.name),
      proteinItem.name,
      dressingItem.name,
      ...toppingItems.map(t => t.name)
    ].join(', ');

    const customBowlProduct = {
      id: `custom-harvest-bowl-${Date.now()}`,
      name: bowlName || 'Custom Harvest Bowl',
      shortName: 'Harvest Bowl',
      tagline: 'Custom Scratch-Crafted Bowl',
      description: `Custom bowl with ${baseItem.name}, ${veggieItems.map(v => v.name).join(' & ')}, ${proteinItem.name}, finished with ${dressingItem.name}.`,
      menuPrice: totalPrice,
      calories: nutrition.calories,
      ingredientCount: 1 + veggieItems.length + 1 + 1 + toppingItems.length,
      deliveryTime: '25m',
      category: 'Custom Bowls',
      categories: ['Featured', 'Warm Bowls', 'Bowls'],
      badge: '100% Customized',
      dietary: ['Non-GMO', 'Scratch Cooked', ...(nutrition.protein > 30 ? ['High Protein'] : [])],
      image: '/images/rainbow-quinoa-bowl.jpg',
      nutrition: {
        protein: `${nutrition.protein}g`,
        carbs: `${nutrition.carbs}g`,
        fiber: `${nutrition.fiber}g`,
        fat: `${nutrition.fat}g`
      }
    };

    addToCart(customBowlProduct, 1, summaryList);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#315B0B', '#A8E83C', '#244507', '#EEF4E3']
      });
    } catch {}
    
    setTimeout(() => {
      navigateTo('cart');
    }, 450);
  };

  const steps = [
    { id: 'base', label: '1. Base Grain', count: 1 },
    { id: 'veggies', label: `2. Greens & Veggies (${selectedVeggies.length}/3)`, count: selectedVeggies.length },
    { id: 'protein', label: '3. Clean Protein', count: 1 },
    { id: 'dressing', label: '4. Farmhouse Dressing', count: 1 },
    { id: 'toppings', label: `5. Crunch & Toppings (${selectedToppings.length}/2)`, count: selectedToppings.length }
  ];

  return (
    <div className="w-full min-h-screen pb-32 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#315B0B] block">
              GRILLIX KITCHEN CRAFT
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
              Build Your Harvest Bowl
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#747B68] hover:text-[#243019] transition-all active:scale-95 shadow-xs"
              title="Reset Ingredients"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => navigateTo('cart')}
              className="relative w-10 h-10 rounded-full bg-[#244507] text-[#A8E83C] flex items-center justify-center transition-all active:scale-95 shadow-xs"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#A8E83C] text-[#0F2002] font-black text-xs leading-none rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Hero Interactive Bowl Summary & Live Nutrition Header */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#D0D8C2] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Bowl Artwork & Name */}
          <div className="lg:col-span-5 flex items-center space-x-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-[#EEF4E3] border-2 border-[#D0D8C2] shrink-0 shadow-inner">
              <img 
                src="/images/green-veggie-bowl.jpg" 
                alt="Custom Bowl preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1.5 right-1.5 bg-[#A8E83C] text-[#244507] p-1 rounded-full shadow-xs">
                <Sparkles size={12} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={bowlName}
                onChange={(e) => setBowlName(e.target.value)}
                placeholder="Give your bowl a name..."
                className="font-extrabold text-base sm:text-lg text-[#243019] bg-transparent border-b border-dashed border-[#D0D8C2] pb-0.5 focus:border-[#315B0B] focus:outline-none w-full truncate"
              />
              <p className="text-xs text-[#747B68] mt-1 line-clamp-2">
                {baseItem.name} + {veggieItems.map(v => v.name).join(', ')} + {proteinItem.name} + {dressingItem.name}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-lg font-black text-[#315B0B]">${totalPrice.toFixed(2)}</span>
                <span className="text-[11px] bg-[#EEF4E3] text-[#315B0B] font-bold px-2 py-0.5 rounded-full border border-[#D0D8C2]">
                  Base $13.50
                </span>
              </div>
            </div>
          </div>

          {/* Live Calorie & Macro Dashboard */}
          <div className="lg:col-span-7 bg-[#EEF4E3] rounded-2xl p-4 border border-[#D0D8C2]/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#244507] flex items-center space-x-1.5">
                <Flame size={14} className="text-[#315B0B]" />
                <span>Live Nutrition & Macro Breakdown</span>
              </span>
              <span className="text-xs font-extrabold text-[#315B0B] bg-white px-2.5 py-0.5 rounded-full border border-[#D0D8C2]">
                {nutrition.calories} kcal
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center pt-1">
              <div className="bg-white rounded-xl p-1.5 sm:p-2 border border-[#D0D8C2]/60">
                <span className="text-[9px] sm:text-[10px] text-[#747B68] font-bold block uppercase truncate">Protein</span>
                <span className="text-xs sm:text-sm font-black text-[#315B0B]">{nutrition.protein}g</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 sm:p-2 border border-[#D0D8C2]/60">
                <span className="text-[9px] sm:text-[10px] text-[#747B68] font-bold block uppercase truncate">Carbs</span>
                <span className="text-xs sm:text-sm font-black text-[#243019]">{nutrition.carbs}g</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 sm:p-2 border border-[#D0D8C2]/60">
                <span className="text-[9px] sm:text-[10px] text-[#747B68] font-bold block uppercase truncate">Fiber</span>
                <span className="text-xs sm:text-sm font-black text-[#243019]">{nutrition.fiber}g</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 sm:p-2 border border-[#D0D8C2]/60">
                <span className="text-[9px] sm:text-[10px] text-[#747B68] font-bold block uppercase truncate">Fat</span>
                <span className="text-xs sm:text-sm font-black text-[#747B68]">{nutrition.fat}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {steps.map((s) => {
            const isActive = activeStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#244507] text-[#A8E83C] shadow-xs'
                    : 'bg-[#E3EBD3] text-[#243019] hover:bg-[#D5E1C3] border border-[#D0D8C2]'
                }`}
              >
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Step Content Sections */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#D0D8C2] shadow-sm">
          
          {/* STEP 1: BASES */}
          {activeStep === 'base' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#243019]">Step 1: Choose Your Base Grain or Greens</h3>
                  <p className="text-xs text-[#747B68]">Select 1 scratch-cooked warm grain or nutrient-dense green foundation.</p>
                </div>
                <span className="text-xs font-bold text-[#315B0B] bg-[#EEF4E3] px-3 py-1 rounded-full">
                  1 Included
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CUSTOM_BOWL_OPTIONS.bases.map((base) => {
                  const isSelected = selectedBase === base.id;
                  return (
                    <div
                      key={base.id}
                      onClick={() => setSelectedBase(base.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#315B0B] bg-[#EEF4E3]/70 shadow-xs' 
                          : 'border-[#D0D8C2] hover:border-[#315B0B]/40 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-[#243019]">{base.name}</span>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#315B0B]"></span>}
                        </div>
                        <div className="text-xs text-[#747B68] mt-0.5 space-x-2">
                          <span>{base.cal} kcal</span>
                          <span>•</span>
                          <span>P: {base.protein}g</span>
                          <span>•</span>
                          <span>C: {base.carbs}g</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          {base.dietary?.map(d => (
                            <span key={d} className="text-[10px] bg-white border border-[#D0D8C2] text-[#315B0B] font-bold px-1.5 py-0.5 rounded-md">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#315B0B] text-white border-[#315B0B]' : 'border-[#D0D8C2]'
                      }`}>
                        {isSelected && <Check size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: GREENS & VEGGIES */}
          {activeStep === 'veggies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#243019]">Step 2: Choose Up to 3 Greens & Roasted Veggies</h3>
                  <p className="text-xs text-[#747B68]">Tossed fresh or slow-roasted daily in extra virgin olive oil.</p>
                </div>
                <span className="text-xs font-bold text-[#315B0B] bg-[#EEF4E3] px-3 py-1 rounded-full">
                  {selectedVeggies.length} / 3 Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {CUSTOM_BOWL_OPTIONS.veggies.map((veg) => {
                  const isSelected = selectedVeggies.includes(veg.id);
                  return (
                    <div
                      key={veg.id}
                      onClick={() => toggleVeggie(veg.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#315B0B] bg-[#EEF4E3]/70 shadow-xs' 
                          : 'border-[#D0D8C2] hover:border-[#315B0B]/40 bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-sm text-[#243019] block">{veg.name}</span>
                        <div className="text-xs text-[#747B68] mt-0.5 space-x-2">
                          <span>{veg.cal} kcal</span>
                          <span>•</span>
                          <span>P: {veg.protein}g</span>
                          <span>•</span>
                          <span>Fiber: {veg.fiber}g</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#315B0B] text-white border-[#315B0B]' : 'border-[#D0D8C2]'
                      }`}>
                        {isSelected ? <Check size={14} /> : <Plus size={14} className="text-[#747B68]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: PROTEINS */}
          {activeStep === 'protein' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#243019]">Step 3: Select Your Clean Protein</h3>
                  <p className="text-xs text-[#747B68]">Antibiotic-free, sustainably wild-caught, or organic plant-powered protein.</p>
                </div>
                <span className="text-xs font-bold text-[#315B0B] bg-[#EEF4E3] px-3 py-1 rounded-full">
                  1 Included
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CUSTOM_BOWL_OPTIONS.proteins.map((p) => {
                  const isSelected = selectedProtein === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProtein(p.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#315B0B] bg-[#EEF4E3]/70 shadow-xs' 
                          : 'border-[#D0D8C2] hover:border-[#315B0B]/40 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-[#243019]">{p.name}</span>
                          {p.tag && (
                            <span className="text-[10px] bg-[#EEF4E3] text-[#315B0B] font-bold px-1.5 py-0.5 rounded-md">
                              {p.tag}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#747B68] mt-0.5 space-x-2">
                          <span>{p.cal} kcal</span>
                          <span>•</span>
                          <span className="font-bold text-[#315B0B]">{p.protein}g Protein</span>
                        </div>
                        {p.priceAdd > 0 && (
                          <span className="text-xs font-extrabold text-[#315B0B] mt-1 block">
                            +${p.priceAdd.toFixed(2)} premium add
                          </span>
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#315B0B] text-white border-[#315B0B]' : 'border-[#D0D8C2]'
                      }`}>
                        {isSelected && <Check size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: DRESSINGS */}
          {activeStep === 'dressing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#243019]">Step 4: House Scratch Dressing</h3>
                  <p className="text-xs text-[#747B68]">100% seed-oil free dressings crafted with Meyer lemon, cold-pressed olive oil & herbs.</p>
                </div>
                <span className="text-xs font-bold text-[#315B0B] bg-[#EEF4E3] px-3 py-1 rounded-full">
                  1 Included (On side or tossed)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CUSTOM_BOWL_OPTIONS.dressings.map((d) => {
                  const isSelected = selectedDressing === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDressing(d.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#315B0B] bg-[#EEF4E3]/70 shadow-xs' 
                          : 'border-[#D0D8C2] hover:border-[#315B0B]/40 bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-sm text-[#243019] block">{d.name}</span>
                        <div className="text-xs text-[#747B68] mt-0.5 space-x-2">
                          <span>{d.cal} kcal</span>
                          <span>•</span>
                          <span>{d.dietary}</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#315B0B] text-white border-[#315B0B]' : 'border-[#D0D8C2]'
                      }`}>
                        {isSelected && <Check size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: TOPPINGS & CRUNCH */}
          {activeStep === 'toppings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#243019]">Step 5: Pick Up to 2 Crunches & Toppings</h3>
                  <p className="text-xs text-[#747B68]">Add texture, artisan cheeses, roasted seeds, or fresh avocado.</p>
                </div>
                <span className="text-xs font-bold text-[#315B0B] bg-[#EEF4E3] px-3 py-1 rounded-full">
                  {selectedToppings.length} / 2 Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {CUSTOM_BOWL_OPTIONS.toppings.map((top) => {
                  const isSelected = selectedToppings.includes(top.id);
                  return (
                    <div
                      key={top.id}
                      onClick={() => toggleTopping(top.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#315B0B] bg-[#EEF4E3]/70 shadow-xs' 
                          : 'border-[#D0D8C2] hover:border-[#315B0B]/40 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-[#243019]">{top.name}</span>
                        </div>
                        <div className="text-xs text-[#747B68] mt-0.5 space-x-2">
                          <span>{top.cal} kcal</span>
                          {top.priceAdd > 0 && <span className="font-bold text-[#315B0B]">+${top.priceAdd.toFixed(2)}</span>}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#315B0B] text-white border-[#315B0B]' : 'border-[#D0D8C2]'
                      }`}>
                        {isSelected ? <Check size={14} /> : <Plus size={14} className="text-[#747B68]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step Action Row */}
          <div className="pt-6 border-t border-[#EEF4E3] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              {activeStep !== 'base' && (
                <button
                  onClick={() => {
                    const stepOrder = ['base', 'veggies', 'protein', 'dressing', 'toppings'];
                    const currIdx = stepOrder.indexOf(activeStep);
                    if (currIdx > 0) setActiveStep(stepOrder[currIdx - 1]);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full border border-[#D0D8C2] text-xs font-bold text-[#243019] hover:bg-[#EEF4E3] text-center"
                >
                  Previous Step
                </button>
              )}
              {activeStep !== 'toppings' && (
                <button
                  onClick={() => {
                    const stepOrder = ['base', 'veggies', 'protein', 'dressing', 'toppings'];
                    const currIdx = stepOrder.indexOf(activeStep);
                    if (currIdx < stepOrder.length - 1) setActiveStep(stepOrder[currIdx + 1]);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-[#315B0B] text-white text-xs font-bold hover:bg-[#244507] text-center"
                >
                  Next Step
                </button>
              )}
            </div>

            <button
              onClick={handleAddCustomBowl}
              className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Add Custom Bowl • ${totalPrice.toFixed(2)}</span>
              <ShoppingBag size={16} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
