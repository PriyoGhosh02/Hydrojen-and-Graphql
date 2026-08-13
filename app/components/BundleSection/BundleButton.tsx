interface BundleButtonProps {
  isActive: boolean;
  isSubmitting: boolean;
}

export function BundleButton({ isActive, isSubmitting }: BundleButtonProps) {
  return (
    <button
      type="submit"
      disabled={!isActive || isSubmitting}
      className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none border border-transparent
        ${!isActive
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : isSubmitting
            ? 'bg-accent/80 text-white cursor-wait'
            : 'bg-primary hover:bg-accent text-white hover:text-white shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.01]'
        }
      `}
    >
      {isSubmitting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Adding Bundle to Cart...
        </>
      ) : isActive ? (
        'Add Bundle to Cart'
      ) : (
        'Select 1 Watch & 1 Bracelet'
      )}
    </button>
  );
}
