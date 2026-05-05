import { useNavigate } from 'react-router-dom';
import { Battery, Star, MapPin, BadgeCheck, Share2, Heart } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

function fmtPrice(n) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `Rp ${(n / 1_000).toFixed(0)}K`;
  return `Rp ${n}`;
}

function sohColor(soh) {
  if (soh >= 0.80) return 'bright-green';
  if (soh >= 0.60) return 'soft-mint';
  if (soh >= 0.40) return 'lime-green';
  return 'red';
}

function BatteryCard({ battery, onClick, showWishlist = true }) {
  const navigate = useNavigate();
  const sohPct   = Math.round(battery.soh * 100);

  const handleClick = () => {
    if (onClick) { onClick(battery); return; }
    navigate(`/battery/${battery.id}`);
  };

  return (
    <div className="bg-white rounded-[20px] border border-[#AAAAAA] shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col overflow-hidden">

      {/* Image area */}
      <div className="relative bg-light-gray flex items-center justify-center h-36">
        <Battery size={52} className="text-[#AAAAAA]" strokeWidth={1.2} aria-hidden="true" />

        {/* Verified badge top-left */}
        {battery.verified && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-bright-green text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <BadgeCheck size={11} aria-hidden="true" />
            Verified
          </span>
        )}

        {/* Rating top-right */}
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-white border border-[#AAAAAA] text-[#222222] text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
          <Star size={11} className="text-lime-green" fill="#ACEA63" aria-hidden="true" />
          {battery.rating?.toFixed(1) ?? '—'}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-base font-bold text-deep-blue leading-tight">{battery.model_name}</h3>
          <p className="text-xs text-[#AAAAAA] mt-0.5">{battery.chemistry}</p>
        </div>

        {/* SoH with progress bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-dark-gray uppercase tracking-wide">State of Health</span>
            <span className="text-sm font-bold text-deep-blue">{sohPct}%</span>
          </div>
          <ProgressBar value={sohPct} max={100} color={sohColor(battery.soh)} animated={false} />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-[#AAAAAA] uppercase tracking-wide font-semibold">Cycles</p>
            <p className="text-[#222222] font-semibold mt-0.5">{battery.cycles ?? '—'}</p>
          </div>
          <div>
            <p className="text-[#AAAAAA] uppercase tracking-wide font-semibold">Warranty</p>
            <p className="text-[#222222] font-semibold mt-0.5">{battery.warranty_months ?? '—'} months</p>
          </div>
        </div>

        {/* Price */}
        <p className="text-xl font-bold text-deep-blue">{fmtPrice(battery.price)}</p>

        {/* Seller */}
        <div className="flex items-center gap-1 text-xs text-dark-gray">
          <MapPin size={11} aria-hidden="true" />
          <span className="truncate">{battery.seller_name}</span>
          <span className="text-[#AAAAAA]">·</span>
          <span>{battery.seller_location}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={handleClick}
            className="flex-1 bg-deep-blue text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
          >
            View Details
          </button>
          <button
            aria-label="Share battery listing"
            className="w-10 h-10 rounded-xl border border-[#AAAAAA] flex items-center justify-center text-dark-gray hover:text-deep-blue hover:border-deep-blue transition-colors"
          >
            <Share2 size={15} aria-hidden="true" />
          </button>
          {showWishlist && (
            <button
              aria-label="Add to wishlist"
              className="w-10 h-10 rounded-xl border border-[#AAAAAA] flex items-center justify-center text-dark-gray hover:text-red-400 hover:border-red-300 transition-colors"
            >
              <Heart size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BatteryCard;
