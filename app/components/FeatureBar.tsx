interface FeatureItem {
  icon: React.ReactNode;
  line1: string;
  line2?: string;
  highlight?: boolean;
}

export function FeatureBar() {
  const features: FeatureItem[] = [
    {
      icon: (
        <svg
          className="w-9 h-9 sm:w-10 sm:h-10 mx-auto text-white"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Wrist with watch */}
          <rect x="19" y="4" width="10" height="40" rx="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="9" fill="black" stroke="currentColor" />
          <circle cx="24" cy="24" r="1.5" fill="currentColor" />
          <path d="M24 19v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      line1: 'Shop from over 3000+',
      line2: 'styles',
    },
    {
      icon: (
        <svg
          className="w-9 h-9 sm:w-10 sm:h-10 mx-auto text-white"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Crosshair Target */}
          <circle cx="24" cy="24" r="15" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="2.5" fill="currentColor" />
          <path d="M24 5v7M24 36v7M5 24h7M36 24h7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      line1: 'No Cost EMI above 7k',
    },
    {
      icon: (
        <svg
          className="w-9 h-9 sm:w-10 sm:h-10 mx-auto text-white"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Cash / Banknote */}
          <rect x="7" y="13" width="34" height="22" rx="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="5.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 18h.01M35 30h.01" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      line1: 'COD available upto 25k',
    },
    {
      icon: (
        <svg
          className="w-9 h-9 sm:w-10 sm:h-10 mx-auto text-white"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Wallet */}
          <path
            d="M9 13h28a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V17a4 4 0 0 1 4-4z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M5 19h36" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M29 22h12v10H29a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"
            fill="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="35" cy="27" r="1.5" fill="currentColor" />
        </svg>
      ),
      line1: '10% off on 1st purchase -',
      line2: 'WELCOME10',
      highlight: true,
    },
    {
      icon: (
        <svg
          className="w-9 h-9 sm:w-10 sm:h-10 mx-auto text-white"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Shield / Authenticity */}
          <path
            d="M24 4L8 10v12c0 10.5 6.8 20.3 16 22 9.2-1.7 16-11.5 16-22V10L24 4z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M17 24l5 5 9-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      line1: '100% Certified',
      line2: 'Authentic Products',
    },
    {
      icon: (
        <svg
          className="w-9 h-9 sm:w-10 sm:h-10 mx-auto text-white"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Easy Return / Exchange */}
          <path
            d="M8 20a16 16 0 1 1 3.5 10M8 12v8h8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M22 24h4v6M26 24v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      line1: 'Easy 7-Day Returns',
      line2: '& Exchange',
    },
    {
      icon: (
        <svg
          className="w-9 h-9 sm:w-10 sm:h-10 mx-auto text-white"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Shopping Cart */}
          <path
            d="M7 9h6l6 20h18l4-15H15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="21" cy="36" r="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="35" cy="36" r="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      line1: 'Ship in 24 hours',
    },
  ];

  return (
    <section className="relative z-10 w-full bg-black text-white py-12 sm:py-16 border-t border-neutral-900 overflow-hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8 sm:gap-10 lg:gap-6 items-start justify-items-center">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-default transition-transform duration-300 hover:-translate-y-1 w-full max-w-[200px]"
            >
              {/* Icon Container */}
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              {/* Text */}
              <p className="text-xs sm:text-sm text-gray-200 font-light leading-relaxed tracking-wide font-sans">
                <span>{item.line1}</span>
                {item.line2 && (
                  <span
                    className={`block ${
                      item.highlight
                        ? 'font-medium tracking-wider text-white mt-0.5'
                        : ''
                    }`}
                  >
                    {item.line2}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
