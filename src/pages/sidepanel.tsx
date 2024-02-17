import './sidepanel.css';
import React, { useState, useEffect } from 'react';

interface SidePanelProps {
  onFilterChange: (filters: any) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ onFilterChange }) => {
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [colorFilters, setColorFilters] = useState<string[]>([]);
  const [kjonnFilters, setKjonnFilters] = useState<string[]>([]);
  const [merkeFilters, setMerkeFilters] = useState<string[]>([]);

  const handlePriceFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setPriceFilters(prevFilters => [...prevFilters, value]);
    } else {
      setPriceFilters(prevFilters => prevFilters.filter(filter => filter !== value));
    }
  };

  const handleColorFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setColorFilters(prevFilters => [...prevFilters, value]);
    } else {
      setColorFilters(prevFilters => prevFilters.filter(filter => filter !== value));
    }
  };

  const handleKjonnFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setKjonnFilters(prevFilters => [...prevFilters, value]);
    } else {
      setKjonnFilters(prevFilters => prevFilters.filter(filter => filter !== value));
    }
  };

  const handleMerkeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setMerkeFilters(prevFilters => [...prevFilters, value]);
    } else {
      setMerkeFilters(prevFilters => prevFilters.filter(filter => filter !== value));
    }
  };

  useEffect(() => {
    onFilterChange({ price: priceFilters, color: colorFilters, kjonn: kjonnFilters, merke: merkeFilters });
  }, [priceFilters, colorFilters, kjonnFilters, merkeFilters, onFilterChange]);

  return (
    <div className="side-panel">
      <h2>Filters</h2>
      <div className="merke-filters">
        <h3>Merke</h3>
        <label>
          <input
            type="checkbox"
            value="nike"
            checked={merkeFilters.includes('nike')}
            onChange={handleMerkeFilterChange}
          />
          Nike
        </label>
        <label>
          <input
            type="checkbox"
            value="adidas"
            checked={merkeFilters.includes('adidas')}
            onChange={handleMerkeFilterChange}
          />
          Adidas
        </label>
        <label>
          <input
            type="checkbox"
            value="newbalance"
            checked={merkeFilters.includes('newbalance')}
            onChange={handleMerkeFilterChange}
          />
          New Balance
        </label>
      </div>
      <div className="price-filters">
        <h3>Pris</h3>
        <label>
        <input
            type="checkbox"
            value="0-500"
            checked={priceFilters.includes('0-500')}
            onChange={handlePriceFilterChange}
          />
          0-500 KR
        </label>
        <label>
          <input
            type="checkbox"
            value="500-1000"
            checked={priceFilters.includes('500-1000')}
            onChange={handlePriceFilterChange}
          />
          500-1000 KR
        </label>
        <label>
          <input
            type="checkbox"
            value="1000-1500"
            checked={priceFilters.includes('1000-1500')}
            onChange={handlePriceFilterChange}
          />
          1000-1500 KR
        </label>
        <label>
          <input
            type="checkbox"
            value="1500-2000"
            checked={priceFilters.includes('1500-2000')}
            onChange={handlePriceFilterChange}
          />
          1500-2000 KR
        </label>
        <label>
          <input
            type="checkbox"
            value="2000-2500"
            checked={priceFilters.includes('2000-2500')}
            onChange={handlePriceFilterChange}
          />
          2000-2500 KR
        </label>
      </div>
      <div className="color-filters">
        <h3>Color</h3>
        <label>
          <input
            type="checkbox"
            value="rod"
            checked={colorFilters.includes('rod')}
            onChange={handleColorFilterChange}
          />
          Rød
        </label>
        <label>
          <input
            type="checkbox"
            value="bla"
            checked={colorFilters.includes('bla')}
            onChange={handleColorFilterChange}
          />
          Blå
        </label>
        <label>
          <input
            type="checkbox"
            value="gronn"
            checked={colorFilters.includes('gronn')}
            onChange={handleColorFilterChange}
          />
          Grønn
        </label>
        <label>
          <input
            type="checkbox"
            value="svart"
            checked={colorFilters.includes('svart')}
            onChange={handleColorFilterChange}
          />
          Svart
        </label>
        <label>
          <input
            type="checkbox"
            value="hvit"
            checked={colorFilters.includes('hvit')}
            onChange={handleColorFilterChange}
          />
          Hvit
        </label>
        <label>
          <input
            type="checkbox"
            value="brun"
            checked={colorFilters.includes('brun')}
            onChange={handleColorFilterChange}
          />
          Brun
        </label>
        
      </div>
      <div className="kjonn-filters">
        <h3>Kjønn</h3>
        <label>
          <input
            type="checkbox"
            value="mann"
            checked={kjonnFilters.includes('mann')}
            onChange={handleKjonnFilterChange}
          />
          Mann
        </label>
        <label>
          <input
            type="checkbox"
            value="dame"
            checked={kjonnFilters.includes('dame')}
            onChange={handleKjonnFilterChange}
          />
          Dame
        </label>
        
      </div>
    </div>
  );
};

export default SidePanel;
