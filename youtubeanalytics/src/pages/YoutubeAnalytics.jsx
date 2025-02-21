import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const YouTubeAnalytics = () => {
  const [videoURL, setVideoURL] = useState("");
  const [channelStats, setChannelStats] = useState(null);
  const [videoStats, setVideoStats] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelProfile, setChannelProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [statsHistory, setStatsHistory] = useState([]);

  const apiKey = "AIzaSyDBQAU6xAr29VabVv4vZfXj0rvFVoPchKk";

  const extractVideoID = (url) => {
    let match = url.match(/(?:v=|\/|shorts\/|embed\/|youtu.be\/|\/v\/|\/e\/|watch\?v=|&v=|vi\/|\/user\/[^/]+\/|\/channel\/[^/]+\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const fetchStatistics = async () => {
    let videoID = extractVideoID(videoURL);
    if (!videoID) {
      alert("Invalid video link.");
      return;
    }

    setLoading(true);
    try {
      let videoRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoID}&key=${apiKey}`
      );
      let videoData = await videoRes.json();

      if (videoData.items.length > 0) {
        let video = videoData.items[0];

        setVideoTitle(video.snippet.title);
        setVideoThumbnail(video.snippet.thumbnails.high.url);
        const newStats = {
          time: new Date().toLocaleTimeString(),
          views: parseInt(video.statistics.viewCount),
          likes: parseInt(video.statistics.likeCount),
          comments: parseInt(video.statistics.commentCount),
        };
        setVideoStats(video.statistics);
        setStatsHistory((prev) => [...prev, newStats]);

        let channelID = video.snippet.channelId;
        let channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelID}&key=${apiKey}`
        );
        let channelData = await channelRes.json();

        if (channelData.items.length > 0) {
          let channel = channelData.items[0];
          setChannelStats(channel.statistics);
          setChannelName(channel.snippet.title);
          setChannelProfile(channel.snippet.thumbnails.high.url);
        }
      } else {
        alert("Invalid Video ID or no data found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tracking) {
      const interval = setInterval(fetchStatistics, 30000);
      return () => clearInterval(interval);
    }
  }, [tracking]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">YouTube Analytics</h2>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter YouTube Video Link"
        value={videoURL}
        onChange={(e) => setVideoURL(e.target.value)}
      />
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-primary me-2" onClick={fetchStatistics}>
          Show Statistics
        </button>
        <button className={`btn ${tracking ? "btn-danger" : "btn-success"}`} onClick={() => setTracking(!tracking)}>
          {tracking ? "Stop Tracking" : "Start Real-time Tracking"}
        </button>
      </div>

      {loading && <div className="text-center spinner-border text-primary mt-3" role="status"><span className="visually-hidden">Loading...</span></div>}

      {channelStats && videoStats && (
        <div>
          <div className="card mb-3 p-3 text-start d-flex align-items-center" style={{ display: "flex", flexDirection: "row" }}>
            <img src={channelProfile} alt="Channel Profile" className="rounded-circle me-3" style={{ width: "80px", height: "80px" }} />
            <div>
              <h4 className="mb-2">{channelName}</h4>
              <p><strong>Subscribers:</strong> {channelStats.subscriberCount}</p>
              <p><strong>Total Videos:</strong> {channelStats.videoCount}</p>
              <p><strong>Total Views:</strong> {channelStats.viewCount}</p>
            </div>
          </div>

          <div className="card p-3 text-center d-flex align-items-center justify-content-center">
            <img src={videoThumbnail} alt="Video Thumbnail" className="img-fluid rounded mb-3" style={{ maxWidth: "500px" }} />
            <h4>{videoTitle}</h4>
            <p><strong>Views:</strong> {videoStats.viewCount}</p>
            <p><strong>Likes:</strong> {videoStats.likeCount}</p>
            <p><strong>Comments:</strong> {videoStats.commentCount}</p>
          </div>

          <div className="card mt-4 p-3">
            <h4 className="text-center">Real-Time Engagement Metrics</h4>
            <ResponsiveContainer width="100%" height={350}>
  <LineChart data={statsHistory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="time" />
    <YAxis domain={["dataMin", "dataMax + 5"]} allowDecimals={false} />
    <Tooltip />
    <Legend />
    <Line
      type="monotone"
      dataKey="likes"
      stroke="#82ca9d"
      strokeWidth={3}
      dot={{ r: 5, stroke: "#82ca9d", strokeWidth: 2, fill: "white" }}
      activeDot={{ r: 8 }}
    />
  </LineChart>
</ResponsiveContainer>

          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalytics;
