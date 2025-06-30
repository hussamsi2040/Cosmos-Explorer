interface ImageCardProps {
  title: string;
  imageUrl: string;
  description: string;
  credit?: string;
}

export default function ImageCard({ title, imageUrl, description, credit }: ImageCardProps) {
  return (
    <div className="flex flex-col items-stretch justify-start rounded-xl bg-[#181c22] shadow-lg overflow-hidden">
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">{title}</h3>
        <p className="text-[#9da9b8] text-base font-normal leading-normal">{description}</p>
        {credit && <span className="text-xs text-[#6c7a89]">{credit}</span>}
      </div>
    </div>
  );
} 