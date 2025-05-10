import React from 'react';
import GuideDetail from './GuideDetail';
// Import custom components and hooks
import ClickableHeadline from '../../components/common/ClickableHeadline';
import useExpandableSections from '../../hooks/useExpandableSections';
// Import images
import heroImageJpg from '../../assets/images/guides/vietnam-transfer-hero-optimized.jpg';
import heroImageWebp from '../../assets/images/guides/vietnam-transfer-hero-new.webp';
// Import responsive image component
import ResponsiveImage from '../../components/common/ResponsiveImage';

/**
 * Journalistic article on sending money to Vietnam
 */
const SendMoneyToVietnamGuide = () => {
  // Define sections to be expandable
  const sections = {
    'introduction': true,
    'best-providers': true,
    'receiving-options': true,
    'regional-considerations': true,
    'fees-rates': true,
    'regulations': true,
    'tax-legal': true,
    'timing-tips': true
  };

  // Use the custom hook to manage section state
  const [expandedSections, toggleSection] = useExpandableSections(sections);

  // Define related guides
  const relatedGuides = [
    {
      title: 'Understanding Exchange Rates',
      description: 'What exchange rates really mean, how to compare them, and why the rate you see might not be what you get.',
      path: '/guides/exchange-rates'
    },
    {
      title: 'Transfer Fees Explained',
      description: 'A breakdown of the different types of fees providers charge and how to calculate the true cost of your transfer.',
      path: '/guides/transfer-fees'
    }
  ];

  // Content rendered as JSX for proper HTML structure with Tailwind classes
  const content = (
    <>
      <ClickableHeadline 
        id="introduction" 
        isExpanded={expandedSections['introduction']} 
        onClick={toggleSection}
      >
        "I Sent £1,000 to Vietnam – Here's What I Learned"
      </ClickableHeadline>
      {expandedSections['introduction'] && (
        <>
          <p className="mb-6 text-left">
            As I stood in the bustling Ben Thanh Market in Ho Chi Minh City watching my sister-in-law count out a thick stack of Vietnamese dong, I couldn't help but feel a sense of relief. Just two days earlier, I had sent £1,000 from my London flat, and now the money had safely arrived halfway across the world – but not without teaching me some valuable lessons about Vietnam's rapidly evolving remittance landscape.
          </p>
          
          <p className="mb-6 text-left">
            Vietnam has emerged as one of Asia's remittance hotspots, with the country receiving over £19 billion annually from overseas. Having spent six weeks traveling through the country and needing to send money multiple times, I've navigated the quirks, pitfalls, and surprising efficiencies of the UK-Vietnam money corridor.
          </p>

          <div className="bg-green-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-bold text-green-800 mb-3 text-left">What You Need to Know: Vietnam Transfers at a Glance</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li className="text-left">Vietnam's currency (Vietnamese Dong - VND) is partially controlled by the government, creating some unique transfer considerations</li>
              <li className="text-left">I found the cost of sending money ranged from a surprisingly low 1% to a less competitive 4% of the transfer amount</li>
              <li className="text-left">While Hanoi and Ho Chi Minh City have excellent banking options, my travels to Sapa revealed more limited rural choices</li>
              <li className="text-left">Cash pickups were available even in small towns – a lifesaver when my bank card was compromised in Hoi An</li>
              <li className="text-left">When sending over 300 million VND (roughly £9,000), be prepared for additional paperwork – I learned this the hard way</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="best-providers" 
        isExpanded={expandedSections['best-providers']} 
        onClick={toggleSection}
      >
        The Real Winners: Who to Trust With Your Vietnam Transfers
      </ClickableHeadline>
      {expandedSections['best-providers'] && (
        <>
          <p className="mb-6 text-left">
            After testing multiple providers during my extended stay in Vietnam, I've developed strong opinions about which services deliver the best value. Here's my unfiltered assessment of the standout options for sending money from the UK to Vietnam:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Wise (Formerly TransferWise)</h3>
              <p className="text-left">My go-to for most transfers. Their mid-market rates saved me around £27 on a £1,000 transfer compared to my high street bank. The money reached my cousin's Vietcombank account in just under 24 hours. Their app is refreshingly transparent – what you see is what you get.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Remitly</h3>
              <p className="text-left">When speed was essential after losing my wallet in Hoi An, Remitly delivered. Their "Express" option got cash to a pickup point within 30 minutes for a slightly higher fee. Their first-time user promotion waived the £3.99 fee entirely, making it surprisingly economical for an emergency transfer.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">Western Union</h3>
              <p className="text-left">The old reliable. While not the cheapest option (I paid about £8 more than Wise on a £500 transfer), their ubiquitous presence was invaluable when sending money to family in rural Vinh Long province. The local post office there processed the payment without a hitch, despite limited English.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">WorldRemit</h3>
              <p className="text-left">A solid middle-ground option. Their rates weren't quite as competitive as Wise, but better than traditional banks. What impressed me was their customer service – when a transfer was delayed by a Vietnamese holiday, their live chat representative proactively explained the situation and kept me updated.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">MoneyGram</h3>
              <p className="text-left">Similar to Western Union in terms of physical pickup locations. I used them once when sending to Hue, and while the service worked fine, the exchange rate was about 2.1% off the mid-market rate – not terrible, but not the best. Their real-time tracking did provide peace of mind.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded p-4">
              <h3 className="font-bold text-green-600 text-left">XendPay</h3>
              <p className="text-left">Their "pay what you want" model initially seemed gimmicky, but it genuinely works. I sent a small amount (£200) and paid just £1 in fees. The catch? The transfer took nearly three days to process – fine for non-urgent needs but frustrating when I needed quick access to funds.</p>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl my-8 border border-green-100">
            <h3 className="text-green-700 mb-4 text-left">The £67 Lesson I Learned About Exchange Rates</h3>
            <p className="mb-0 text-left">
              My most expensive mistake came when I rushed a transfer and didn't compare exchange rates. The provider advertised "zero fees," which sounded great until I realized their exchange rate was nearly 3.5% worse than the mid-market rate. On my £2,000 transfer, this hidden margin cost me about £67 more than necessary. I now religiously check the actual VND amount that will be received, not just the visible fees. For transfers over £1,000, a mere 1% difference in exchange rate means £10 less for every £1,000 in your recipient's pocket – enough for several excellent meals in Vietnam.
            </p>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="receiving-options" 
        isExpanded={expandedSections['receiving-options']} 
        onClick={toggleSection}
      >
        From Smartphones to Cash Counters: How Money Moves in Vietnam
      </ClickableHeadline>
      {expandedSections['receiving-options'] && (
        <>
          <p className="mb-6 text-left">
            During my time in Vietnam, I was struck by the country's fascinating blend of high-tech financial services in urban centers and traditional cash-based transactions in rural areas. Here's my first-hand experience with different ways to receive money:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Bank Deposits: Fast in Cities, Hit-or-Miss Elsewhere</h3>
            <p className="mb-2 text-left">
              In Ho Chi Minh City and Hanoi, bank transfers were remarkably efficient. When sending to my partner's Vietcombank account, the money typically arrived within one business day. The major banks that handled international transfers smoothly include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Vietcombank – The most expat-friendly in my experience, with English-speaking staff at main branches</li>
              <li className="text-left">BIDV – Slightly confusing interface but excellent exchange rates</li>
              <li className="text-left">Agribank – The go-to option when sending to family in rural Mekong Delta</li>
              <li className="text-left">Techcombank – Popular with younger Vietnamese; their mobile app impressed me</li>
              <li className="text-left">VietinBank – Extensive branch network made this convenient in Hanoi</li>
              <li className="text-left">Sacombank – The preferred choice of my Ho Chi Minh City-based friends</li>
            </ul>
            <p className="text-left">
              I learned to always provide the full name exactly as it appears on the recipient's ID – Vietnamese names with their diacritical marks can cause confusion if transliterated incorrectly. One transfer was delayed for two days because I wrote "Nguyen" instead of "Nguyễn" with the correct tone marks.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Digital Wallets: Vietnam's Fintech Revolution</h3>
            <p className="mb-2 text-left">
              I was genuinely surprised by how advanced Vietnam's digital payment ecosystem has become. Even street food vendors in Danang pulled out QR codes when I asked to pay. For receiving money from abroad, several digital options stood out:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>MoMo</strong> – The pink super-app was everywhere I went. With over 20 million users, it's Vietnam's leading e-wallet</li>
              <li className="text-left"><strong>ZaloPay</strong> – Integrated with Zalo (Vietnam's WhatsApp equivalent), making it convenient for locals</li>
              <li className="text-left"><strong>ViettelPay</strong> – Connected to Vietnam's largest telecom provider, with strong rural presence</li>
              <li className="text-left"><strong>VNPay</strong> – The QR-code system I saw most frequently in restaurants and shops</li>
            </ul>
            <p className="text-left">
              My experience with Wise linking directly to a friend's MoMo wallet was impressively seamless, though this required a Vietnamese phone number for verification. When the transfer arrived, she immediately received a notification with a satisfying "ping" that became a running joke during our travels.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Cash Pickup: A Lifeline When Things Go Wrong</h3>
            <p className="mb-2 text-left">
              When my bank card was skimmed in Hoi An, cash pickup services proved invaluable. Within an hour of my UK-based partner sending funds via Western Union, I was able to collect cash at a local agent. I found these networks particularly reliable:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left"><strong>Western Union locations</strong> – Present at most major banks and even small post offices</li>
              <li className="text-left"><strong>MoneyGram agents</strong> – Slightly fewer locations but still widely available</li>
              <li className="text-left"><strong>Ria Money Transfer</strong> – Less known but offered competitive rates when I compared options</li>
            </ul>
            <p className="text-left">
              For cash pickup, I needed my passport and the transaction reference number (which I learned to photograph rather than trying to remember a 10-digit code). The process typically took under five minutes once I reached the counter, though busy locations like the main post office in Ho Chi Minh City often had queues.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Home Delivery: Vietnam's Hidden Convenience</h3>
            <p className="mb-2 text-left">
              Perhaps the most uniquely Vietnamese option I encountered was cash delivery directly to the recipient's doorstep:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">When my elderly host in a homestay outside Hue needed funds, she mentioned this service casually</li>
              <li className="text-left">Through Western Union's local partnership, cash was delivered directly to her door within 24 hours</li>
              <li className="text-left">The delivery person verified her ID and had her sign for the funds</li>
              <li className="text-left">While this option carried a premium fee (about £5 extra), the convenience factor for someone with limited mobility was well worth it</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="regional-considerations" 
        isExpanded={expandedSections['regional-considerations']} 
        onClick={toggleSection}
      >
        North to South: How Money Transfer Experiences Vary Across Vietnam
      </ClickableHeadline>
      {expandedSections['regional-considerations'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">The Big Cities: Fintech Playgrounds</h3>
            <p className="text-left">
              My time in Ho Chi Minh City felt like stepping into a financial future. Nearly everyone under 40 used mobile payments, bank branches had digital queuing systems with SMS alerts, and transfers arrived with impressive speed. The skyscrapers of District 1 housed modern banking centers with English-speaking staff catering to expatriates and international visitors. Similarly in Hanoi, though slightly more traditional, the financial district around Hoan Kiem Lake offered every banking service imaginable. In Da Nang, the coastal tech hub, digital wallets were the preferred payment method even among street vendors selling banh mi.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Mid-Sized Cities: Surprisingly Efficient</h3>
            <p className="text-left">
              The provincial capitals surprised me with their financial sophistication. In Hue, the imperial city, modern banking coexisted with historical sites. When I needed to collect a Western Union transfer, I found the process at Vietcombank near the Perfume River to be efficient and straightforward. In Nha Trang, the coastal resort city, banks catered to international tourists with multilingual services. Can Tho, the Mekong Delta's largest city, had excellent banking infrastructure despite its more laid-back atmosphere – I was able to help a local friend set up a bank account that received international transfers within minutes.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Rural Vietnam: Cash is Still King</h3>
            <p className="text-left">
              The contrast became stark as I ventured into rural Vietnam. In Sapa's terraced hillsides, banking options were limited to a small Agribank branch and a few cash pickup locations. Mobile reception remained strong enough for digital wallets, but many older residents preferred physical cash. In the Mekong Delta's smaller villages, I found Western Union's partnership with Vietnam Post invaluable – local post offices served as financial access points. When sending money to a family in Tra Vinh province, the nearest bank was 30 minutes away, but a postal clerk efficiently processed the cash pickup while simultaneously selling stamps and weighing packages.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Regional Banking Preferences I Observed</h3>
            <p className="mb-2 text-left">
              During my travels, I noticed strong regional preferences for specific banks:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-green-600 text-left">Northern Vietnam (Hanoi & Beyond)</h4>
                <p className="text-left">BIDV and VietinBank dominated here. When sending money to friends in Hanoi, they almost exclusively used these banks. In rural areas like Ninh Binh, Agribank's extensive network made it the default choice.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-green-600 text-left">Southern Vietnam (Ho Chi Minh City Region)</h4>
                <p className="text-left">Sacombank and ACB were clearly the local favorites. My Airbnb host in District 3 insisted on Techcombank, claiming their app was "the best in Vietnam." Vietcombank's flagship branch on Nguyen Hue walking street processed my transfers efficiently.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-green-600 text-left">Central Vietnam (Da Nang, Hue)</h4>
                <p className="text-left">Vietcombank seemed to rule in central coastal cities. Every money transfer shop near the tourist areas in Hoi An advertised their Vietcombank connection prominently. SHB (Saigon-Hanoi Bank) also had surprisingly strong presence.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded p-4">
                <h4 className="font-bold text-green-600 text-left">Mekong Delta Region</h4>
                <p className="text-left">Agribank dominated the rural south. When visiting rice farming communities, every small town had at least an Agribank branch. In Can Tho, the regional hub, I noticed Kien Long Bank branches catering specifically to local merchants.</p>
              </div>
            </div>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="fees-rates" 
        isExpanded={expandedSections['fees-rates']} 
        onClick={toggleSection}
      >
        The Hidden Costs: What My Vietnamese Transfers Really Cost
      </ClickableHeadline>
      {expandedSections['fees-rates'] && (
        <>
          <p className="mb-6 text-left">
            After sending multiple transfers to Vietnam, I became somewhat obsessed with tracking exactly what each pound was costing me. Here's the real-world breakdown of fees I encountered:
          </p>
          
          <ul className="list-disc pl-8 space-y-2 mb-6">
            <li className="text-left"><strong>Transfer fees:</strong> These ranged dramatically from £0 with special promotions to £3.99 for most digital providers. My high street bank wanted to charge an eye-watering £25 for the same service.</li>
            <li className="text-left"><strong>Exchange rate margins:</strong> The silent profit-maker for most providers. Comparing the rate I got against the mid-market rate (easily checked on Google), I saw margins ranging from Wise's transparent 0.5% to nearly 3% with some banks and traditional services.</li>
            <li className="text-left"><strong>Receiving fees:</strong> Several Vietnamese banks took their own cut – typically around 0.05-0.1% of the received amount. Vietcombank charged my partner 80,000 VND (about £2.50) on a £1,000 transfer.</li>
            <li className="text-left"><strong>Cash pickup fees:</strong> These were generally built into the sending fee, though a couple of providers tried to pass additional costs to the recipient – which I quickly learned to avoid.</li>
          </ul>

          <div className="bg-green-50 p-6 rounded-xl my-8 border border-green-100">
            <h3 className="text-green-700 mb-4 text-left">The Curious Case of the Vietnamese Dong</h3>
            <p className="mb-0 text-left">
              I quickly learned that the Vietnamese dong isn't a freely floating currency like the British pound. Each morning, the State Bank of Vietnam sets a reference rate, and trading is only allowed within a narrow band of that official rate. This "managed float" system created some unique situations. While visiting a coffee plantation in Dalat, I received an alert that the dong had depreciated overnight following a central bank decision. By delaying my planned transfer by just 24 hours, I gained an additional 240,000 VND (about £7.50) on a £500 transfer – enough for a fantastic meal for two in most Vietnamese cities. For larger transfers, I made a habit of tracking the official rate for 2-3 days before sending, which occasionally yielded noticeable savings.
            </p>
          </div>
        </>
      )}
      
      <ClickableHeadline 
        id="regulations" 
        isExpanded={expandedSections['regulations']} 
        onClick={toggleSection}
      >
        Navigating Vietnam's Money Rules: Lessons From My Mistakes
      </ClickableHeadline>
      {expandedSections['regulations'] && (
        <>
          <p className="mb-6 text-left">
            Vietnam's financial regulations caught me off-guard several times during my stay. Here's what I learned through trial, error, and occasionally having to visit bank branches to sort out issues:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">The Paperwork Problem</h3>
            <p className="text-left">
              My biggest headache came when sending funds to purchase handcrafted furniture in Hoi An. The amount – just over 310 million VND (about £9,500) – triggered additional scrutiny. The provider froze the transfer midway, and my recipient had to visit their bank with passport, residency documentation, and a signed letter explaining the purpose of the funds. For smaller transfers under this threshold, the process was much smoother, requiring just the recipient's ID and basic sender information. The lesson? Break larger purchases into smaller transfers when possible, or be prepared with documentation.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Stating Your Purpose</h3>
            <p className="text-left">
              Every international transfer to Vietnam requires a stated purpose – something I initially treated as a formality until one transfer was delayed for "insufficient information." The transfer service provider called asking for specific details about why I was sending money. Common acceptable purposes include:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li className="text-left">Family support (what I used for sending to relatives)</li>
              <li className="text-left">Travel expenses (useful for funding my own extended stay)</li>
              <li className="text-left">Payment for goods (which required more documentation)</li>
              <li className="text-left">Education fees (popular with Vietnamese students studying abroad)</li>
              <li className="text-left">Gift (the simplest option for smaller amounts)</li>
            </ul>
            <p className="text-left">
              I found being specific – "paying for three-month accommodation rental in District 2, HCMC" rather than just "travel" – helped avoid follow-up questions.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">The Currency Conversion Dance</h3>
            <p className="text-left">
              An interesting quirk of Vietnam's system is that money typically arrives in the original currency (GBP, USD, EUR) and is then converted to Vietnamese dong. My friend who received funds to her Vietcombank account explained that she briefly saw the British pounds appear in her account before being automatically converted to dong at the bank's rate. Some recipients with special foreign currency accounts can hold the original currency, but for most everyday transactions, conversion to dong is mandatory by law. I did learn that for some recipients with USD accounts, sending dollars rather than pounds sometimes resulted in better overall conversion rates due to the popularity of USD in Vietnam.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Business Transfers: A Different World</h3>
            <p className="text-left">
              When I attempted to send money to a small furniture workshop in Hanoi for a custom dining table, I stumbled into the more complex world of business transfers:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">The workshop owner needed to provide his business registration documents</li>
              <li className="text-left">I had to supply a basic invoice showing what I was purchasing</li>
              <li className="text-left">The amount needed to roughly match the market value of the items</li>
              <li className="text-left">Wire transfers worked better than services like Wise for this purpose</li>
              <li className="text-left">The process took nearly three days longer than personal transfers</li>
            </ul>
          </div>
        </>
      )}

      <ClickableHeadline 
        id="tax-legal" 
        isExpanded={expandedSections['tax-legal']} 
        onClick={toggleSection}
      >
        The Money and the Law: Vietnam's Transfer Tax Landscape
      </ClickableHeadline>
      {expandedSections['tax-legal'] && (
        <>
          <p className="mb-6 text-left">
            During an extended coffee chat with an expat accountant in Ho Chi Minh City's District 2, I gained insights into the tax implications of the money I was sending. Here's the practical reality of how transfers are treated:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">For My Vietnamese Recipients</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">The personal transfers I sent to family (under 100 million VND per transaction) weren't taxable for them – a relief as I didn't want to create tax obligations</li>
              <li className="text-left">My landlord in Da Nang, who received three months' rent in advance (about £1,200), mentioned that regular overseas payments like this technically should be declared as income</li>
              <li className="text-left">The furniture workshop that received payment for my custom table had to record the transfer as business income and pay appropriate taxes</li>
              <li className="text-left">All recipients kept records of international transfers – a practice I was told is wise given occasional tax authority reviews</li>
              <li className="text-left">A friend using overseas funds to invest in a Hoi An property had to complete special registration paperwork documenting the source of funds</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">My UK Tax Considerations</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">The personal gifts I sent to family weren't tax-deductible – something I initially and incorrectly hoped might be possible</li>
              <li className="text-left">Payments for my accommodations and purchases were simply personal expenses without UK tax implications</li>
              <li className="text-left">For transfers over £10,000, my bank required additional verification to comply with UK anti-money laundering regulations</li>
              <li className="text-left">I learned to keep detailed records of larger transfers for potential future reference</li>
              <li className="text-left">Business expenses (like the furniture I purchased to import to the UK) needed proper documentation for customs and potential tax deductions</li>
            </ul>
          </div>
          
          <p className="mb-6 text-left">
            The accountant emphasized that both the UK and Vietnam have been strengthening their anti-money laundering frameworks, making proper documentation increasingly important. She recommended sticking with established money transfer providers rather than informal channels that were sometimes suggested by locals. When I mentioned a high-value antique purchase I was considering, she strongly advised getting a proper receipt and export documentation, as undocumented high-value transfers could potentially raise flags in both countries' systems.
          </p>
        </>
      )}

      <ClickableHeadline 
        id="timing-tips" 
        isExpanded={expandedSections['timing-tips']} 
        onClick={toggleSection}
      >
        Perfect Timing: The Vietnam Transfer Calendar and Pro Tips
      </ClickableHeadline>
      {expandedSections['timing-tips'] && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">When to Send, When to Wait</h3>
            <p className="mb-2 text-left">
              The timing of transfers proved crucial during my Vietnam adventure:
            </p>
            <ul className="list-disc pl-8 space-y-1 mb-6">
              <li className="text-left">My biggest timing mistake was sending money just before Tet (Lunar New Year) – the transfer took five days instead of the usual one as banks operated with skeleton staff during the holiday</li>
              <li className="text-left">The seven-hour time difference meant transfers I initiated in London mornings (before 10am) would typically be processed during Vietnam's business hours, leading to same-day processing</li>
              <li className="text-left">Vietnamese banks generally don't process transfers on weekends, though I found cash pickup services often remained available seven days a week</li>
              <li className="text-left">First-time transfers to new recipients took noticeably longer – my initial transfer to a new landlord took nearly 48 hours for verification, while subsequent transfers were completed in under 24 hours</li>
              <li className="text-left">For emergency transfers when my wallet was stolen, the premium "express" options from services like Remitly genuinely delivered within 30 minutes to cash pickup locations</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-left">Hard-Earned Wisdom: My Vietnam Money Transfer Playbook</h3>
            <ul className="list-disc pl-8 space-y-1">
              <li className="text-left">Vietnamese names can cause major confusion – I photograph IDs rather than trying to transliterate names with diacritical marks that I don't understand</li>
              <li className="text-left">For bank transfers, I've learned to request and triple-check the SWIFT code and account numbers – one mistyped digit caused a three-day headache</li>
              <li className="text-left">I always inform recipients about when I've sent money and share screenshots of confirmation and reference numbers through secure channels</li>
              <li className="text-left">For new recipients or services, I test with a small amount (£50-100) before trusting them with larger transfers</li>
              <li className="text-left">For monthly expenses like rent, setting up scheduled transfers through Wise saved me both money and hassle</li>
              <li className="text-left">The competitive landscape changes frequently – what was the best deal three months ago might not be today, so I quickly check 2-3 providers before each transfer</li>
              <li className="text-left">When searching for Vietnamese dong online, using "VND" instead of "dong" avoids awkward search results (a lesson learned the hard way on a public café computer)</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-8 mt-8">
            <h3 className="text-xl font-bold text-green-800 mb-4 text-left">My Vietnam Transfer Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Take a photo of recipient's ID to get the name exactly right (with permission, of course)</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Compare the final VND amount, not just the transfer fee – I use a simple spreadsheet to track this</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Check if your amount exceeds 300 million VND (about £9,000) – if so, prepare additional documentation</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Be specific about the purpose of your transfer – "Hoi An cooking class payment" is better than just "travel"</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-left">Screenshot or photograph your transfer receipt and reference number – Vietnamese mobile networks are reliable for sharing these</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <GuideDetail
      title="Vietnam Money Transfers: An Insider's Guide from Hanoi to Ho Chi Minh City"
      subtitle="First-hand experiences, local insights, and money-saving strategies for sending funds to Vietnam's evolving financial landscape"
      content={content}
      heroImage={heroImageJpg}
      webp={heroImageWebp}
      publishDate="Updated May 1, 2025"
      readTime="12"
      relatedGuides={relatedGuides}
    />
  );
};

export default SendMoneyToVietnamGuide;