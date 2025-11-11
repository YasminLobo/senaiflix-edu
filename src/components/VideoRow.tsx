import VideoCard from "./VideoCard";

interface VideoRowProps {
  title: string;
  videos: Array<{ id: string; title: string; thumbnail: string; ageRating: string }>;
}

const VideoRow = ({ title, videos }: VideoRowProps) => {
  return (
    <section className="px-4 md:px-8 py-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            thumbnail={video.thumbnail}
            ageRating={video.ageRating}
          />
        ))}
      </div>
    </section>
  );
};

export default VideoRow;
