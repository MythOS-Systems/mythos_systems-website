import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Navigation } from './Navigation';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const faqSections: FAQSection[] = [
    {
      title: 'ABOUT MYTHOS',
      items: [
        {
          question: 'What is MythOS?',
          answer: 'MythOS is digital infrastructure built to help local businesses compete against corporate monopolies. We provide tools that give small businesses the same advantages that chains spend millions on - visibility, automation, and AI-powered operations.',
        },
        {
          question: 'Why did you build this?',
          answer: 'Local businesses were losing not because they offered worse service, but because they didn\'t control distribution. The best barber couldn\'t compete with corporate search rankings. The best cafe got buried under endless ad spend. We built MythOS because someone had to level the field.',
        },
        {
          question: 'How is this different from other business tools?',
          answer: 'Most tools are built for enterprises and scaled down. We built specifically for small businesses from day one. No bloat, no features you don\'t need, no extraction. Just infrastructure designed for how local businesses actually operate.',
        },
        {
          question: 'Who is this for?',
          answer: 'Small business owners tired of getting crushed by monopolies. People who want to discover their city instead of scrolling feeds. Anyone who believes local should win.',
        },
      ],
    },
    {
      title: 'ETHICS & BIG TECH',
      items: [
        {
          question: 'Is MythOS an ethical tech company?',
          answer: 'Yes. We don\'t sell your data, run ads against you, or lock you into contracts. MythOS exists to keep money and attention inside local neighborhoods instead of extracting it to Big Tech. Circulation, not extraction, is the whole point.',
        },
        {
          question: 'What companies are fighting Big Tech?',
          answer: 'MythOS is one of them. We build the software, hardware, and payments that let local businesses compete with the platforms Big Tech favors, without paying Big Tech just to be seen in their own neighborhoods.',
        },
        {
          question: 'What\'s an ethical alternative to Big Tech for small businesses?',
          answer: 'MythOS. The Network ranks businesses by quality and proximity instead of ad spend, and MythOS Pro gives owners AI-powered operations for $100/month with no data mining and no extraction.',
        },
        {
          question: 'Why does MythOS call itself a rebellion?',
          answer: 'Because the rules were built to keep local losing. Big Tech owns distribution and rents it back to chains. We\'re building the infrastructure to take it back and hand local its power again.',
        },
      ],
    },
    {
      title: 'THE NETWORK',
      items: [
        {
          question: 'What is The Network?',
          answer: 'A free hyperlocal discovery app that helps you find the best businesses in your neighborhood - not the ones with the biggest ad budgets. It\'s designed for exploration, not extraction.',
        },
        {
          question: 'How does it work?',
          answer: 'The Network shows you local businesses based on proximity, quality, and community engagement - not who paid the most for search rankings. You discover real places run by real people in your city.',
        },
        {
          question: 'Is it really free?',
          answer: 'Yes. The Network is free for users and free for businesses to get listed. No ads, no data mining, no extraction.',
        },
        {
          question: 'How do I get my business on The Network?',
          answer: 'Download the app and claim your business. It takes less than 5 minutes. We\'ll handle the rest.',
        },
      ],
    },
    {
      title: 'MYTHOS PRO & MYLO',
      items: [
        {
          question: 'What is MythOS Pro?',
          answer: 'AI-powered business automation for $100/month. It includes Mylo, our AI assistant that handles reception, booking, customer service, and operations - giving you the power of an entire team.',
        },
        {
          question: 'What can Mylo actually do?',
          answer: 'Mylo answers calls and texts, books appointments, handles customer inquiries, manages scheduling, and integrates with your existing tools like Square. It works 24/7 so you can focus on running your business instead of juggling twenty roles.',
        },
        {
          question: 'How much does it cost?',
          answer: '$100/month. No hidden fees, no enterprise upsells, no contracts. Cancel anytime.',
        },
        {
          question: 'What integrations do you support?',
          answer: 'Currently we integrate with Square for payments and booking. More integrations coming based on what our community needs.',
        },
        {
          question: 'Do I need to be tech-savvy to use this?',
          answer: 'No. If you can send a text message, you can use MythOS Pro. We built it for business owners, not engineers.',
        },
      ],
    },
    {
      title: 'LAUNCH & AVAILABILITY',
      items: [
        {
          question: 'When are you launching?',
          answer: 'Dallas / Fort Worth launches October 1, 2026. From there we\'ll scale to more cities.',
        },
        {
          question: 'What cities will you be in?',
          answer: 'Dallas / Fort Worth first, launching October 1, 2026. After that, we\'re expanding based on where local businesses need us most. Want us in your city? Let us know.',
        },
        {
          question: 'Can I use this outside your launch cities?',
          answer: 'Not yet, but we\'re moving fast. Sign up for updates and we\'ll let you know when we reach your area.',
        },
        {
          question: 'How do I stay updated?',
          answer: 'Follow us on social media or join our email list. We\'ll keep you posted on launches, features, and the rebellion.',
        },
      ],
    },
  ];

  const handleContact = () => {
    window.location.href = 'mailto:hello@mythosrebellion.com';
  };

  // Inject FAQPage structured data, scoped to this route. The prerender snapshots
  // document.documentElement.outerHTML, so this gets baked into /faq/index.html only,
  // giving search + AI engines clean, citable question/answer pairs that mirror the
  // visible content on the page (required for the schema to be valid).
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqSections.flatMap((section) =>
        section.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        }))
      ),
    };
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'faq-schema';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => {
      document.getElementById('faq-schema')?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 
          className="text-5xl md:text-6xl font-bold text-white mb-6 text-center"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-[#B0B0B0] text-center max-w-2xl mx-auto">
          Everything you need to know about rebuilding local economies
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {faqSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-16">
            {/* Section Title */}
            <h2 
              className="text-2xl font-bold text-white mb-8 tracking-wider"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              {section.title}
            </h2>

            {/* FAQ Items */}
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => {
                const itemId = `${sectionIndex}-${itemIndex}`;
                const isOpen = openItems.has(itemId);

                return (
                  <div
                    key={itemId}
                    className="border border-white/10 rounded-lg overflow-hidden transition-all duration-200 hover:border-[#ff3333]/50"
                  >
                    {/* Question */}
                    <button
                      onClick={() => toggleItem(itemId)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left group"
                    >
                      <span className="text-lg font-semibold text-white group-hover:text-[#ff3333] transition-colors pr-4">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`flex-shrink-0 w-5 h-5 text-[#ff3333] transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Answer */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        isOpen ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="px-6 pb-5 text-[#B0B0B0] leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}