import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "AIzaSyDBQAU6xAr29VabVv4vZfXj0rvFVoPchKk";

const YouTubeStats = () => {
  const [videoID, setVideoID] = useState("");
  const [channelStats, setChannelStats] = useState(null);
  const [videoStats, setVideoStats] = useState(null);

  const extractVideoID = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const fetchStatistics = async () => {
    const id = extractVideoID(videoID);
    if (!id) {
      alert("Invalid video link");
      return;
    }

    try {
      const videoResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`
      );

      if (videoResponse.data.items.length > 0) {
        const video = videoResponse.data.items[0];
        setVideoStats(video.statistics);
        fetchChannelStatistics(video.snippet.channelId);
      } else {
        alert("No data found for the video.");
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const fetchChannelStatistics = async (channelID) => {
    try {
      const channelResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelID}&key=${API_KEY}`
      );

      if (channelResponse.data.items.length > 0) {
        setChannelStats(channelResponse.data.items[0].statistics);
      } else {
        alert("No data found for the channel.");
      }
    } catch (error) {
      console.error("Error fetching channel data:", error);
    }
  };

  return (
    <div className="container">
      <h2>YouTube Statistics</h2>
      <input
        type="text"
        placeholder="Enter YouTube video link"
        value={videoID}
        onChange={(e) => setVideoID(e.target.value)}
      />
      <button onClick={fetchStatistics}>Show Statistics</button>

      {channelStats && videoStats && (
        <div className="stats-container">
          <div className="stats">
            <h3>Statistics</h3>
            <p>Channel Views: {channelStats.viewCount}</p>
            <p>Channel Subscribers: {channelStats.subscriberCount}</p>
            <p>Channel Videos: {channelStats.videoCount}</p>
            <p>Video Views: {videoStats.viewCount}</p>
            <p>Video Likes: {videoStats.likeCount}</p>
            <p>Video Comments: {videoStats.commentCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeStats;
