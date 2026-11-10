import React, { useState, useMemo } from 'react';
import { BookOpen, HelpCircle, Check, ArrowRight, MessageSquare, ChevronDown, ChevronUp, Sprout, Send, UserCheck } from 'lucide-react';
import { AdviceArticle, FaqQuestion, Product } from '../types/farm';
import { ADVICE_ARTICLES, FAQ_QUESTIONS, OWNER_INFO } from '../data/advice';
import { PRODUCTS } from '../data/products';

interface AdviceHubProps {
  onSelectProduct: (product: Product) => void;
}

export const AdviceHub: React.FC<AdviceHubProps> = ({ onSelectProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>('advice-guinea-fowl');
  
  // Ask the Farmers interactive state
  const [userQuestion, setUserQuestion] = useState('');
  const [userCategory, setUserCategory] = useState('Guinea Fowl & Turkeys');
  const [answeredQuestion, setAnsweredQuestion] = useState<{
    question: string;
    answer: string;
    farmer: string;
  } | null>(null);

  const categories = [
    { id: 'all', label: 'All Advice' },
    { id: 'poultry', label: 'Guinea Fowl & Turkeys' },
    { id: 'small-mammals', label: 'Rabbits & Guinea Pigs' },
    { id: 'rare-crops', label: 'Rare Crops & Horticulture' },
    { id: 'soil-permaculture', label: 'Living Soil & Organic Care' },
  ];

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') return ADVICE_ARTICLES;
    return ADVICE_ARTICLES.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    // Generate responsive farm wisdom based on keywords in question
    const qLower = userQuestion.toLowerCase();
    let farmerResponse = '';
    let respondingFarmer = 'David & Margaret Damak';

    if (qLower.includes('guinea') || qLower.includes('tick') || qLower.includes('fowl')) {
      respondingFarmer = 'David Damak (Livestock)';
      farmerResponse = `Guinea fowl are incredible foragers! If you're introducing them, remember our core rule: keep them locked in their roost for 4 to 6 weeks first, so they recognize it as safe home base. Train them with cracked corn in the evening and they will reliably return at dusk.`;
    } else if (qLower.includes('rabbit') || qLower.includes('flemish') || qLower.includes('cavy') || qLower.includes('guinea pig') || qLower.includes('hay')) {
      respondingFarmer = 'Margaret Damak (Small Animals)';
      farmerResponse = `For rabbits and cavies, gut motility is life. Always ensure unlimited coarse meadow or timothy grass hay (at least 80% of their total volume). Avoid sudden green diet shifts and provide fresh clean water in heavy ceramic crocks.`;
    } else if (qLower.includes('turkey') || qLower.includes('bourbon')) {
      respondingFarmer = 'David Damak (Livestock)';
      farmerResponse = `Heritage turkeys like our Bourbon Reds do exceptionally well on pasture! Make sure poults are protected from chill and damp drafts during their first 8 weeks. Once feathered, their curious and affectionate demeanor makes them a joy.`;
    } else if (qLower.includes('romanesco') || qLower.includes('cauliflower') || qLower.includes('beet') || qLower.includes('potato') || qLower.includes('grow')) {
      respondingFarmer = 'Margaret Damak (Horticulture)';
      farmerResponse = `Rare heirlooms like Romanesco need steady, uninterrupted moisture to produce sharp fractal peaks. Mulch deeply with clean barley straw and provide calcium-rich compost early in root formation.`;
    } else {
      respondingFarmer = 'David & Margaret Damak';
      farmerResponse = `Thank you for asking! At Damak Farm, our foundational advice for any homestead challenge is: mimic natural biology. Build rich organic soil with aged manure compost, respect the foraging instincts of your birds, and provide plenty of room to roam.`;
    }

    setAnsweredQuestion({
      question: userQuestion,
      answer: farmerResponse,
      farmer: respondingFarmer,
    });
    setUserQuestion('');
  };

  return (
    <section id="advice" className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF8F5] via-[#F4F9F2] to-[#FAF8F5] border-b border-[#D8E6D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Homestead Knowledge & Husbandry · From Damak Farm</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#113824] tracking-tight mb-4">
            Farmer&apos;s Advice & Agrarian Journal
          </h2>
          <p className="text-base sm:text-lg text-[#3E5244] leading-relaxed">
            Practical, field-tested guidance from 28 years of breeding heritage poultry, raising gentle rabbits and cavies, and cultivating rare heirloom varieties without synthetic inputs.
          </p>
        </div>

        {/* Owners Feature Card */}
        <div className="bg-[#FFFFFF] rounded-3xl border-2 border-emerald-200/90 overflow-hidden mb-16 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full bg-emerald-950">
              <img
                src={OWNER_INFO.image}
                alt={OWNER_INFO.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent text-white">
                <span className="font-serif text-xl font-bold text-white block">
                  {OWNER_INFO.name}
                </span>
                <span className="text-xs text-amber-300 font-semibold">
                  {OWNER_INFO.roles} · {OWNER_INFO.yearsFarming}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-xs text-emerald-800 font-bold uppercase tracking-wider mb-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>The Farmers&apos; Note</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#113824] mb-3 leading-tight">
                &ldquo;We don&apos;t just sell rare produce; we share the stewardship behind it.&rdquo;
              </h3>
              <p className="text-sm text-[#3E5244] leading-relaxed mb-6">
                {OWNER_INFO.philosophy} Whether you are starting your first flock of tick-hunting guinea fowl, setting up a proper rabbitry for Flemish Giants, or attempting to harvest tight fractal Romanesco, we believe good farming is open-source knowledge passed between neighbors.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 border-t border-emerald-100 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="font-bold text-[#113824] block">Avian Husbandry</span>
                  <span className="text-[#3E5244]">Guinea Fowl & Turkeys</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-950 block">Small Mammals</span>
                  <span className="text-[#78644A]">Rabbits & Cavies</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="font-bold text-purple-950 block">Rare Heirloom Crops</span>
                  <span className="text-[#635370]">Non-GMO Heritage Seeds</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advice Articles List */}
        <div className="mb-16">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h3 className="font-serif text-2xl font-bold text-[#1E261E]">
              Husbandry & Horticulture Guides
            </h3>
            {/* Category selection */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFEBE4] rounded-xl">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-[#2E4222] text-[#FAF8F5] shadow-xs'
                      : 'text-[#4F5649] hover:text-[#1E261E] hover:bg-[#E4DED4]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredArticles.map((article) => {
              const isExpanded = expandedArticleId === article.id;
              const relatedProduct = PRODUCTS.find((p) => p.id === article.relatedProductId);

              return (
                <div
                  key={article.id}
                  className="bg-[#FFFFFF] rounded-xl border border-[#DFD8CC] overflow-hidden transition-all duration-200"
                >
                  {/* Article Accordion Header */}
                  <button
                    onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <div>
                      {/* Unboxed clean metadata */}
                      <div className="flex items-center gap-2 text-xs text-[#626A59] mb-1.5 font-medium">
                        <span className="uppercase tracking-wider text-[11px] font-semibold text-[#4E6738]">
                          {article.categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{article.author}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.readTime}</span>
                      </div>

                      <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1E261E] mb-1">
                        {article.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#5B6353] line-clamp-2">
                        {article.summary}
                      </p>
                    </div>

                    <div className="p-2 rounded-lg bg-[#EFEAE2] text-[#2E4222] shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#EDE7DD] bg-[#FCFBF8] animate-in fade-in duration-200">
                      {/* Key Takeaways */}
                      <div className="mb-6 p-4 bg-[#F5F2EB] rounded-xl border border-[#DFD8CC]">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#2E4222] mb-2 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#3E5C2D]" />
                          <span>Owner Takeaways</span>
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#474F3F]">
                          {article.keyTakeaways.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#3E5C2D] font-bold">›</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Deep paragraphs */}
                      <div className="space-y-4 text-xs sm:text-sm text-[#4E5646] leading-relaxed mb-6">
                        {article.content.map((para, idx) => (
                          <p key={idx}>{para}</p>
                        ))}
                      </div>

                      {/* Farmer Tip Box */}
                      <div className="p-4 bg-[#EAE4D8] rounded-xl border border-[#D5CCBE] flex items-start gap-3 mb-6">
                        <Sprout className="w-4 h-4 text-[#3E5C2D] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-[#1E261E] block mb-0.5">
                            Damak Farm Field Rule:
                          </span>
                          <p className="text-xs text-[#3E4536] italic">
                            &ldquo;{article.farmerTip}&rdquo;
                          </p>
                        </div>
                      </div>

                      {/* Related Product Link */}
                      {relatedProduct && (
                        <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#DFD8CC]">
                          <div className="flex items-center gap-3">
                            <img
                              src={relatedProduct.image}
                              alt={relatedProduct.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-lg object-cover bg-[#EFEAE2]"
                            />
                            <div>
                              <span className="text-[11px] font-semibold text-[#4E6738] block uppercase">
                                Associated Farm Breed / Crop
                              </span>
                              <span className="font-serif text-xs font-bold text-[#1E261E]">
                                {relatedProduct.name}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onSelectProduct(relatedProduct)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#2E4222] bg-[#EFEAE2] hover:bg-[#E5DFD4] rounded-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Inspect Variety</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive "Ask Damak Farm" Section */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#DFD7CB] p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Q&A Knowledge base */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4E6738] mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>Frequently Answered by the Owners</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1E261E] mb-6">
                Common Questions on Livestock & Rare Crops
              </h3>

              <div className="space-y-4">
                {FAQ_QUESTIONS.map((faq) => (
                  <div key={faq.id} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E4DDD1]">
                    <div className="flex items-center justify-between text-[11px] text-[#69705E] mb-1 font-medium">
                      <span>{faq.category}</span>
                      <span>Answered by {faq.farmer}</span>
                    </div>
                    <p className="font-serif text-sm font-bold text-[#1E261E] mb-2">
                      {faq.question}
                    </p>
                    <p className="text-xs text-[#525949] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Question Submission Form */}
            <div className="lg:col-span-6 bg-[#F8F5EE] rounded-xl border border-[#DFD8CC] p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E4222] mb-1">
                <MessageSquare className="w-4 h-4" />
                <span>Ask David & Margaret</span>
              </div>
              <h4 className="font-serif text-xl font-bold text-[#1E261E] mb-2">
                Have a Question About Your Farm or Garden?
              </h4>
              <p className="text-xs text-[#5B6353] leading-relaxed mb-6">
                Ask about housing guinea fowl, feeding rabbits, raising heritage turkeys, or growing rare vegetables. Receive immediate insights from our homestead experience.
              </p>

              <form onSubmit={handleAskSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E261E] mb-1.5">
                    Topic of Interest
                  </label>
                  <select
                    value={userCategory}
                    onChange={(e) => setUserCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#D5CDC0] rounded-lg text-xs text-[#1E261E] focus:outline-none focus:ring-2 focus:ring-[#3B5323]"
                  >
                    <option value="Guinea Fowl & Turkeys">Guinea Fowl & Turkeys</option>
                    <option value="Rabbits & Cavies">Rabbits & Cavies</option>
                    <option value="Rare Heirloom Crops">Rare Heirloom Crops</option>
                    <option value="Organic Soil & Composting">Organic Soil & Composting</option>
                    <option value="Farm Gate Pickup">Farm Gate Pickup & Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E261E] mb-1.5">
                    Your Question
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. How do I protect young guinea fowl from nocturnal predators, or how often should I feed timothy hay?"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    className="w-full p-3 bg-white border border-[#D5CDC0] rounded-lg text-xs text-[#1E261E] placeholder:text-[#8C9384] focus:outline-none focus:ring-2 focus:ring-[#3B5323]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!userQuestion.trim()}
                  className="w-full py-3 px-4 bg-[#2E4222] text-[#FAF8F5] hover:bg-[#203017] disabled:opacity-40 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask the Farmers</span>
                </button>
              </form>

              {/* Answer display */}
              {answeredQuestion && (
                <div className="mt-6 p-4 bg-[#FFFFFF] rounded-xl border border-[#D8CFBF] animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px] text-[#4E6738] font-bold mb-1">
                    <span>Farmer&apos;s Direct Answer</span>
                    <span>{answeredQuestion.farmer}</span>
                  </div>
                  <p className="font-serif text-xs font-bold text-[#1E261E] mb-2 italic">
                    &ldquo;{answeredQuestion.question}&rdquo;
                  </p>
                  <p className="text-xs text-[#4A5242] leading-relaxed">
                    {answeredQuestion.answer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
