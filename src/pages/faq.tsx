import React, { useState } from 'react';
import './faq.css';
import faqData from '../data/faqData.json';

const Support: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

    const filteredFAQ = faqData.faqData.filter((faq) =>
        faq.Spørsmaal.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleAnswer = (index: number) => {
        if (expandedIndexes.includes(index)) {
            setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
        } else {
            setExpandedIndexes([...expandedIndexes, index]);
        }
    };



    return (
        <div className="container">
            <h1>Spørsmål</h1>
            <input className='søk'
                type="text"
                placeholder="Søk etter spørsmål.."
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                }}
            />
            <div className='svarwrapp'>
                {filteredFAQ.map((faq, index) => (
                    <div key={index} className='svar'>
                        <h2 className="spor" onClick={() => toggleAnswer(index)}>{faq.Spørsmaal}</h2>
                        {expandedIndexes.includes(index) && (
                            <ul className={expandedIndexes.includes(index) ? "svarlist vis" : "svarlist"}>
                                {faq.svar.split('-').map((item, idx) => {
                                    const trimmedItem = item.trim();
                                    return trimmedItem && <li key={idx}>{trimmedItem}</li>;
                                })}
                            </ul>
                        )}
                    </div>
                ))}
                {filteredFAQ.length === 0 && <p>Fant ingen resultater.</p>}
            </div>
        </div>
    );
}

export default Support;
