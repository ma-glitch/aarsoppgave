import React, { useState } from 'react';
import './faq.css';

const faqData = [{ 
    Spørsmaal: 'Hvordan logge in?', 
    svar: '- I top menyen finner du en knapp som heter logg in. - Trykk på den. - Her skriver du in brukernavnet og passordet du lagde tidligere. - Deretter trykker du logg in. - Da skal du får opp en pop up som sier at du har blitt logget in' 
    },
    { 
    Spørsmaal: 'How do I install React?', 
    svar: 'You can install React using npm or yarn.' 
    },
    { 
    Spørsmaal: 'What is JSX?', 
    svar: 'JSX is a syntax extension for JavaScript used with React to describe what the UI should look like.' 
    }];

const Support: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

    const filteredFAQ = faqData.filter((faq) =>
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
