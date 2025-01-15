export default function ClustringPage() {
  return (
    <div
      className="relative"
      style={{ paddingBottom: "56.25%", height: 0, overflow: "hidden" }}
    >
      <iframe
        src="https://clustering-visualizer.web.app/kmeans"
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
      ></iframe>
    </div>
  );
}
