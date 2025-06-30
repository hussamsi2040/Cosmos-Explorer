interface MapEventCardProps {
  title: string;
  description: string;
  link: string;
}

export default function MapEventCard({ title, description, link }: MapEventCardProps) {
  return (
    <div className="flex flex-col items-stretch justify-start rounded-xl bg-[#181c22] shadow-lg overflow-hidden p-4">
      <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-1">{title}</h3>
      <p className="text-[#9da9b8] text-base font-normal leading-normal mb-2">{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline text-sm font-medium"
      >
        Learn more
      </a>
    </div>
  );
} 