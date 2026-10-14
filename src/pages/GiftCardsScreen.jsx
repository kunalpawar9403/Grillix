import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GIFT_CARDS } from '../data/mockData';
import confetti from 'canvas-confetti';

export const GiftCardsScreen = () => {
  const { goBack, showToast } = useApp();

  const [activeChip, setActiveChip] = useState('Featured');
  const [selectedCard, setSelectedCard] = useState(GIFT_CARDS[0]);
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);

  const categories = ['Featured', 'Seasonal', 'Thanks'];

  const filteredCards = GIFT_CARDS.filter((card) => {
    if (activeChip === 'Featured') return true;
    return card.category === activeChip;
  });

  const handleSendGift = (e) => {
    e.preventDefault();
    if (!recipientEmail) {
      showToast('Please enter recipient email');
      return;
    }
    setShowSendModal(false);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    showToast(`$${selectedAmount} GRILLIX Gift Card sent to ${recipientEmail}!`);
    setRecipientEmail('');
    setPersonalMessage('');
  };

  return (
    <div className="w-full min-h-screen pb-28 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
            Send a sweet gift
          </h1>

          <button
            onClick={() => showToast('Check digital gift card balance')}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Category Chips matching screenshot */}
        <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isActive = activeChip === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveChip(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#244507] text-white shadow-xs'
                    : 'bg-[#E3EBD3] text-[#243019] hover:bg-[#D5E1C3] border border-[#D0D8C2]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gift Cards Container */}
        <div className="space-y-6">
          
          {/* Featured Card 1: Father's Day 4-Photo Collage Design */}
          {activeChip === 'Featured' && (
            <div className="bg-white rounded-3xl overflow-hidden border border-[#D0D8C2] shadow-sm">
              {/* Top 2 Images */}
              <div className="grid grid-cols-2 gap-1.5 p-2 pb-0">
                <div className="h-28 sm:h-36 rounded-2xl overflow-hidden">
                  <img
                    src="/images/rainbow-quinoa-bowl.jpg"
                    alt="Chicken Salad"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-28 sm:h-36 rounded-2xl overflow-hidden">
                  <img
                    src="/images/fresh-salad-bowl.jpg"
                    alt="Fresh Salad"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Middle Typography Banner matching screenshot */}
              <div className="py-6 px-4 text-center">
                <span className="text-xs font-black uppercase tracking-widest text-[#315B0B] block">
                  GRILLIX
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold italic tracking-tight text-[#243019] mt-0.5">
                  HAPPY FATHER'S <span className="text-[#747B68]">DAY</span>
                </h2>
                <div className="inline-block border-b-2 border-[#243019] pb-0.5 mt-0.5">
                  <span className="text-xs sm:text-sm font-extrabold tracking-widest text-[#243019] uppercase">
                    GIFT CARD
                  </span>
                </div>
              </div>

              {/* Bottom 2 Images */}
              <div className="grid grid-cols-2 gap-1.5 p-2 pt-0">
                <div className="h-28 sm:h-36 rounded-2xl overflow-hidden">
                  <img
                    src="/images/hero-spinach.jpg"
                    alt="Greens"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-28 sm:h-36 rounded-2xl overflow-hidden">
                  <img
                    src="/images/green-veggie-bowl.jpg"
                    alt="Salad Bowl"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Quick Action Footer */}
              <div className="p-4 sm:p-5 bg-[#EEF4E3] border-t border-[#D0D8C2] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  {[25, 50, 75, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setSelectedAmount(amt)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selectedAmount === amt
                          ? 'bg-[#315B0B] text-white shadow-xs'
                          : 'bg-white text-[#243019] border border-[#D0D8C2] hover:bg-[#E3EBD3]'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedCard(GIFT_CARDS[0]);
                    setShowSendModal(true);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  Send This Gift
                </button>
              </div>
            </div>
          )}

          {/* Additional Filtered Cards from mockData */}
          {filteredCards.filter(c => c.id !== 'fathers-day' || activeChip !== 'Featured').map((card) => (
            <div 
              key={card.id}
              className="bg-[#DCE7CB] rounded-3xl overflow-hidden border border-[#C5D5AF] shadow-xs flex flex-col sm:flex-row items-center justify-between p-5 gap-4"
            >
              <div className="space-y-1 text-center sm:text-left flex-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#315B0B] block">
                  GRILLIX
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold italic text-[#243019] tracking-tight">
                  {card.headline}
                </h3>
                <p className="text-xs font-extrabold tracking-widest text-[#243019]">
                  {card.subheadline}
                </p>
                {card.discountTag && (
                  <div className="pt-2">
                    <span className="bg-[#244507] text-[#A8E83C] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                      {card.discountTag}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden shadow-xs shrink-0">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full sm:w-auto shrink-0">
                <button
                  onClick={() => {
                    setSelectedCard(card);
                    setShowSendModal(true);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-bold text-xs shadow-sm transition-all"
                >
                  Send {card.category} Card
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* Gift Card Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-[#D0D8C2] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF4E3]">
              <div>
                <h3 className="text-lg font-bold text-[#243019]">Send Digital Gift Card</h3>
                <p className="text-xs text-[#747B68]">{selectedCard?.title}</p>
              </div>
              <button onClick={() => setShowSendModal(false)} className="p-1 rounded-full text-[#747B68]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendGift} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#243019] mb-1">Gift Amount</label>
                <div className="flex space-x-2">
                  {[25, 50, 75, 100].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setSelectedAmount(amt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                        selectedAmount === amt
                          ? 'bg-[#315B0B] text-white border-[#315B0B]'
                          : 'bg-[#EEF4E3] text-[#243019] border-[#D0D8C2]'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243019] mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full bg-[#EEF4E3] border border-[#D0D8C2] rounded-xl px-3.5 py-2 text-xs text-[#243019] focus:outline-none focus:border-[#315B0B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243019] mb-1">Personal Message</label>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Enjoy a healthy, delicious meal on me!"
                  rows={3}
                  className="w-full bg-[#EEF4E3] border border-[#D0D8C2] rounded-xl px-3.5 py-2 text-xs text-[#243019] focus:outline-none focus:border-[#315B0B]"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-sm shadow-md transition-all active:scale-98"
                >
                  Send ${selectedAmount} Gift Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
