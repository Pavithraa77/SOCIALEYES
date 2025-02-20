import { useState } from "react";

const YouTubeAnalytics = () => {
  const [videoURL, setVideoURL] = useState("");
  const [channelStats, setChannelStats] = useState(null);
  const [videoStats, setVideoStats] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  const apiKey = "AIzaSyDBQAU6xAr29VabVv4vZfXj0rvFVoPchKk";

  const extractVideoID = (url) => {
    let match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const fetchStatistics = async () => {
    let videoID = extractVideoID(videoURL);
    if (!videoID) {
      alert("Invalid video link.");
      return;
    }

    try {
      let videoRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoID}&key=${apiKey}`
      );
      let videoData = await videoRes.json();

      if (videoData.items.length > 0) {
        let video = videoData.items[0];

        // Store video title
        setVideoTitle(video.snippet.title);
        setVideoStats(video.statistics);

        let channelID = video.snippet.channelId;
        let channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelID}&key=${apiKey}`
        );
        let channelData = await channelRes.json();

        if (channelData.items.length > 0) {
          let channel = channelData.items[0];
          setChannelStats(channel.statistics);

          // Store channel name
          setChannelName(channel.snippet.title);
        }
      } else {
        alert("Invalid Video ID or no data found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container">
      <h2>YouTube Analytics</h2>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter YouTube Video Link"
        value={videoURL}
        onChange={(e) => setVideoURL(e.target.value)}
      />
      <button className="btn btn-primary mb-3" onClick={fetchStatistics}>
        Show Statistics
      </button>

      {channelStats && videoStats && (
        <div>
          <h4>Channel Info</h4>
          <p><strong>Channel Name:</strong> {channelName}</p>
          <p><strong>Subscribers:</strong> {channelStats.subscriberCount}</p>
          <p><strong>Videos:</strong> {channelStats.videoCount}</p>
          <p><strong>Total Views:</strong> {channelStats.viewCount}</p>

          <h4>Video Info</h4>
          <p><strong>Video Title:</strong> {videoTitle}</p>
          <p><strong>Views:</strong> {videoStats.viewCount}</p>
          <p><strong>Likes:</strong> {videoStats.likeCount}</p>
          <p><strong>Comments:</strong> {videoStats.commentCount}</p>
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalytics;
