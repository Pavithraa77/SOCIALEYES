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
  const [commentsPerView, setCommentsPerView] = useState(null);
  const [engagementRate, setEngagementRate] = useState(null);
  const [videoDuration, setVideoDuration] = useState("");
  const [trendingTags, setTrendingTags] = useState([]);
  const [mostLikedVideos, setMostLikedVideos] = useState([]);
  const [mostViewedVideos, setMostViewedVideos] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [uploadFrequency, setUploadFrequency] = useState("");

  const apiKey = "AIzaSyDBQAU6xAr29VabVv4vZfXj0rvFVoPchKk";

  const extractVideoID = (url) => {
    let match = url.match(/(?:v=|\/|shorts\/|embed\/|youtu.be\/|\/v\/|\/e\/|watch\?v=|&v=|vi\/|\/user\/[^/]+\/|\/channel\/[^/]+\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] ? parseInt(match[1]) : 0);
    const minutes = (match[2] ? parseInt(match[2]) : 0);
    const seconds = (match[3] ? parseInt(match[3]) : 0);
    return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`;
  };

  const calculateUploadFrequency = (channelData) => {
    const totalVideos = parseInt(channelData.statistics.videoCount);
    const channelCreationDate = new Date(channelData.snippet.publishedAt);
    const currentDate = new Date();
    const timeDiff = currentDate - channelCreationDate;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Total days since channel creation
    const avgDaysPerVideo = (daysDiff / totalVideos).toFixed(1); // Average days between uploads
    return `approximately uploads video once in every ${avgDaysPerVideo} days`;
  };

  const fetchVideoDetails = async (videoId) => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`
    );
    const data = await res.json();
    return {
      views: data.items[0]?.statistics?.viewCount || 0,
      likes: data.items[0]?.statistics?.likeCount || 0,
    };
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
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoID}&key=${apiKey}`
      );
      let videoData = await videoRes.json();

      if (videoData.items.length > 0) {
        let video = videoData.items[0];

        setVideoTitle(video.snippet.title);
        setVideoThumbnail(video.snippet.thumbnails.high.url);
        setVideoDuration(formatDuration(video.contentDetails.duration));
        setTrendingTags(video.snippet.tags || []);

        const views = parseInt(video.statistics.viewCount);
        const likes = parseInt(video.statistics.likeCount);
        const comments = parseInt(video.statistics.commentCount);
        const newStats = {
          time: new Date().toLocaleTimeString(),
          views: views,
          likes: likes,
          comments: comments,
        };

        setVideoStats(video.statistics);
        setStatsHistory((prev) => [...prev, newStats]);

        // Calculate "1 in X viewers comments"
        setCommentsPerView(views > 0 && comments > 0 ? Math.round(views / comments) : "N/A");

        // Calculate Engagement Rate
        setEngagementRate(views > 0 ? ((likes + comments) / views).toFixed(4) : "N/A");

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
          setTotalVideos(channel.statistics.videoCount);

          // Calculate upload frequency
          setUploadFrequency(calculateUploadFrequency(channel));

          // Fetch most viewed videos
          let videosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&maxResults=4&order=viewCount&type=video&key=${apiKey}`
          );
          let videosData = await videosRes.json();
          const viewedVideosWithDetails = await Promise.all(
            videosData.items.map(async (video) => {
              const details = await fetchVideoDetails(video.id.videoId);
              return { ...video, views: details.views };
            })
          );
          setMostViewedVideos(viewedVideosWithDetails);

          // Fetch most liked videos
          let likedVideosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&maxResults=4&order=rating&type=video&key=${apiKey}`
          );
          let likedVideosData = await likedVideosRes.json();
          const likedVideosWithDetails = await Promise.all(
            likedVideosData.items.map(async (video) => {
              const details = await fetchVideoDetails(video.id.videoId);
              return { ...video, likes: details.likes };
            })
          );
          setMostLikedVideos(likedVideosWithDetails);
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
              <p><strong>Total Videos:</strong> {totalVideos}</p>
              <p><strong>Total Views:</strong> {channelStats.viewCount}</p>
              <p><strong>Upload Frequency:</strong> {uploadFrequency}</p>
            </div>
          </div>

          <div className="card p-3 text-center d-flex align-items-center justify-content-center">
            <img src={videoThumbnail} alt="Video Thumbnail" className="img-fluid rounded mb-3" style={{ maxWidth: "500px" }} />
            <h4>{videoTitle}</h4>
            <p><strong>Views:</strong> {videoStats.viewCount}</p>
            <p><strong>Likes:</strong> {videoStats.likeCount}</p>
            <p><strong>Comments:</strong> {videoStats.commentCount}</p>
            <p><strong>Comments Per View:</strong> {commentsPerView !== "N/A" ? `1 in ${commentsPerView} viewers comments` : "No comments yet"}</p>
            <p><strong>Engagement Rate:</strong> {engagementRate}</p>
            <p><strong>Duration:</strong> {videoDuration}</p>
            <p><strong>Trending Tags:</strong> {trendingTags.join(", ")}</p>
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

          <div className="card mt-4 p-3">
            <h4 className="text-center">Most Viewed Videos</h4>
            <div className="d-flex flex-wrap justify-content-center">
              {mostViewedVideos.map((video, index) => (
                <div key={index} className="card m-2" style={{ width: "200px" }}>
                  <img src={video.snippet.thumbnails.medium.url} alt="Thumbnail" className="card-img-top" />
                  <div className="card-body">
                    <p className="card-text">{video.snippet.title}</p>
                    <p className="card-text"><strong>Views:</strong> {video.views}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card mt-4 p-3">
            <h4 className="text-center">Most Liked Videos</h4>
            <div className="d-flex flex-wrap justify-content-center">
              {mostLikedVideos.map((video, index) => (
                <div key={index} className="card m-2" style={{ width: "200px" }}>
                  <img src={video.snippet.thumbnails.medium.url} alt="Thumbnail" className="card-img-top" />
                  <div className="card-body">
                    <p className="card-text">{video.snippet.title}</p>
                    <p className="card-text"><strong>Likes:</strong> {video.likes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalytics;

