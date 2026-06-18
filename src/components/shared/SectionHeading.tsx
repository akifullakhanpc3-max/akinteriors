

interface SectionHeadingProps {
  label: string;
  title: string;
  highlightedWord: string;
  description?: string;
}

export default function SectionHeading({ label, title, highlightedWord, description }: SectionHeadingProps) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">
        {label}
      </span>
      <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mt-4 mb-6">
        {title}{' '}
        <span className="text-[#C8A97E]">{highlightedWord}</span>
      </h2>
      {description && (
        <p className="text-gray-600 text-lg">{description}</p>
      )}
    </div>
  );
}
