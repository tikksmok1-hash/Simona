'use client';

import { useState } from 'react';

export default function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto divide-y divide-gray-100">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.q}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-6 text-left group"
            >
              <h3 className="font-serif text-lg font-light text-black group-hover:text-neutral-600 transition-colors">
                {faq.q}
              </h3>
              <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center border border-neutral-200 text-neutral-400 group-hover:border-black group-hover:text-black transition-all duration-300 ${isOpen ? 'rotate-45 border-black text-black' : ''}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
