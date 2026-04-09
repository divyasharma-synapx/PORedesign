import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ value, onChange, min = 1, max = 999 }) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };
  const handleInput = (e) => {
    const val = parseInt(e.target.value) || min;
    onChange(Math.max(min, Math.min(max, val)));
  };

  return (
    <div className="quantity-stepper">
      <button className="quantity-stepper__btn" onClick={handleDecrement} disabled={value <= min}>
        <Minus size={14} />
      </button>
      <input
        type="number"
        className="quantity-stepper__value"
        value={value}
        onChange={handleInput}
        min={min}
        max={max}
      />
      <button className="quantity-stepper__btn" onClick={handleIncrement} disabled={value >= max}>
        <Plus size={14} />
      </button>
    </div>
  );
}
