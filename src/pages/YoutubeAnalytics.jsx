import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Sentiment from "sentiment";
import { CSVLink } from "react-csv";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [comments, setComments] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  // New states for video comparison
  const [compareVideoURL, setCompareVideoURL] = useState("");
  const [compareVideoData, setCompareVideoData] = useState(null);

  // Helper to format numbers with commas
  const formatNumber = (num) => {
    if (isNaN(num)) return num;
    return Number(num).toLocaleString();
  };

  // Replace with your own API key
  const apiKey = "AIzaSyDBQAU6xAr29VabVv4vZfXj0rvFVoPchKk";

  // Updated list with "Compare Videos"
  const componentsList = [
    { id: "channelStats", label: "Channel Stats" },
    { id: "videoStats", label: "Video Stats" },
    { id: "engagementMetrics", label: "Real-Time Engagement Metrics" },
    { id: "mostViewedVideos", label: "Most Viewed Videos" },
    { id: "mostRatedVideos", label: "Highly Rated Videos" },
    { id: "sentimentAnalysis", label: "Comment Sentiment Analysis" },
    { id: "compareVideos", label: "Compare Videos" },
  ];

  const sentimentAnalyzer = new Sentiment();

  const extractVideoID = (url) => {
    let match = url.match(
      /(?:v=|\/|shorts\/|embed\/|youtu\.be\/|\/v\/|\/e\/|watch\?v=|&v=|vi\/|\/user\/[^/]+\/|\/channel\/[^/]+\/)([0-9A-Za-z_-]{11})/
    );
    return match ? match[1] : null;
  };

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    return `${hours > 0 ? `${hours}h ` : ""}${
      minutes > 0 ? `${minutes}m ` : ""
    }${seconds}s`;
  };

  const calculateUploadFrequency = (channelData) => {
    const totalVideos = parseInt(channelData.statistics.videoCount);
    const channelCreationDate = new Date(channelData.snippet.publishedAt);
    const currentDate = new Date();
    const timeDiff = currentDate - channelCreationDate;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const avgDaysPerVideo = (daysDiff / totalVideos).toFixed(1);
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

      if (videoData.items && videoData.items.length > 0) {
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

        setCommentsPerView(
          views > 0 && comments > 0 ? Math.round(views / comments) : "N/A"
        );
        setEngagementRate(
          views > 0 ? ((likes + comments) / views).toFixed(4) : "N/A"
        );

        let channelID = video.snippet.channelId;
        let channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelID}&key=${apiKey}`
        );
        let channelData = await channelRes.json();

        if (channelData.items && channelData.items.length > 0) {
          let channel = channelData.items[0];
          setChannelStats(channel.statistics);
          setChannelName(channel.snippet.title);
          setChannelProfile(channel.snippet.thumbnails.high.url);
          setTotalVideos(channel.statistics.videoCount);
          setUploadFrequency(calculateUploadFrequency(channel));

          // Fetch 4 most viewed videos
          let videosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&maxResults=4&order=viewCount&type=video&key=${apiKey}`
          );
          let videosData = await videosRes.json();
          if (videosData.items) {
            const viewedVideosWithDetails = await Promise.all(
              videosData.items.map(async (vid) => {
                const details = await fetchVideoDetails(vid.id.videoId);
                return { ...vid, views: details.views };
              })
            );
            setMostViewedVideos(viewedVideosWithDetails);
          }

          // Fetch 4 most liked videos (Highly Rated Videos)
          let likedVideosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&maxResults=4&order=rating&type=video&key=${apiKey}`
          );
          let likedVideosData = await likedVideosRes.json();
          if (likedVideosData.items) {
            const likedVideosWithDetails = await Promise.all(
              likedVideosData.items.map(async (vid) => {
                const details = await fetchVideoDetails(vid.id.videoId);
                return { ...vid, likes: details.likes };
              })
            );
            setMostLikedVideos(likedVideosWithDetails);
          }
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

  // Fetch sentiment analysis for video comments
  const fetchSentimentAnalysis = async () => {
    let videoID = extractVideoID(videoURL);
    if (!videoID) {
      alert("Invalid video link for sentiment analysis.");
      return;
    }
    try {
      const commentsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoID}&key=${apiKey}&maxResults=1000`
      );
      const commentsData = await commentsRes.json();
      if (commentsData.items && commentsData.items.length > 0) {
        const fetchedComments = commentsData.items.map(
          (item) => item.snippet.topLevelComment.snippet.textDisplay
        );
        setComments(fetchedComments);
        const sentimentResults = fetchedComments.map((comment) => {
          const analysis = sentimentAnalyzer.analyze(comment);
          return { comment, score: analysis.score };
        });
        setSentimentData(sentimentResults);
      } else {
        alert("No comments found for this video.");
        setSentimentData([]);
      }
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
    }
  };

  // When sentiment analysis is selected and videoStats updates, fetch sentiment data
  useEffect(() => {
    if (selectedComponents.includes("sentimentAnalysis") && videoStats) {
      fetchSentimentAnalysis();
    }
  }, [videoStats, selectedComponents]);

  // Real-time tracking
  useEffect(() => {
    if (tracking) {
      const interval = setInterval(fetchStatistics, 30000);
      return () => clearInterval(interval);
    }
  }, [tracking]);

  // Handler for Drag and Drop reordering
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedComponents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedComponents(items);
  };

  const toggleComponent = (id) => {
    if (selectedComponents.includes(id)) {
      setSelectedComponents(selectedComponents.filter((item) => item !== id));
    } else {
      setSelectedComponents([...selectedComponents, id]);
    }
  };

  // Compute summary data for sentiment chart
  const sentimentSummary = sentimentData.reduce(
    (acc, { score }) => {
      if (score > 0) acc.positive++;
      else if (score < 0) acc.negative++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );

  const sentimentChartData = [
    { name: "Positive", value: sentimentSummary.positive, color: "#82ca9d" },
    { name: "Neutral", value: sentimentSummary.neutral, color: "#8884d8" },
    { name: "Negative", value: sentimentSummary.negative, color: "#ff6961" },
  ];

  // Compute chart data for video comparison
  let comparisonChartData = [];
  if (videoStats && compareVideoData) {
    comparisonChartData = [
      {
        name: "Views",
        primary: parseInt(videoStats.viewCount),
        comparison: compareVideoData.views,
      },
      {
        name: "Likes",
        primary: parseInt(videoStats.likeCount),
        comparison: compareVideoData.likes,
      },
      {
        name: "Comments",
        primary: parseInt(videoStats.commentCount),
        comparison: compareVideoData.comments,
      },
    ];
  }

  // Handler to show the embedded video player
  const handleVideoClick = (videoId) => {
    setCurrentVideoId(videoId);
    setShowPlayer(true);
  };

  // Handler to close the embedded video player
  const closePlayer = () => {
    setShowPlayer(false);
  };

  // Generate CSV data
  const generateCSVData = () => {
    const data = [];

    if (channelStats && videoStats) {
      // Channel Stats
      data.push({
        Category: "Channel Stats",
        Field: "Channel Name",
        Value: channelName,
      });
      data.push({
        Category: "Channel Stats",
        Field: "Subscribers",
        Value: channelStats.subscriberCount,
      });
      data.push({
        Category: "Channel Stats",
        Field: "Total Videos",
        Value: totalVideos,
      });
      data.push({
        Category: "Channel Stats",
        Field: "Total Views",
        Value: channelStats.viewCount,
      });
      data.push({
        Category: "Channel Stats",
        Field: "Upload Frequency",
        Value: uploadFrequency,
      });

      // Video Stats
      data.push({
        Category: "Video Stats",
        Field: "Video Title",
        Value: videoTitle,
      });
      data.push({
        Category: "Video Stats",
        Field: "Views",
        Value: videoStats.viewCount,
      });
      data.push({
        Category: "Video Stats",
        Field: "Likes",
        Value: videoStats.likeCount,
      });
      data.push({
        Category: "Video Stats",
        Field: "Comments",
        Value: videoStats.commentCount,
      });
      data.push({
        Category: "Video Stats",
        Field: "Duration",
        Value: videoDuration,
      });
      data.push({
        Category: "Video Stats",
        Field: "Trending Tags",
        Value: trendingTags.join(", "),
      });

      // Real-Time Engagement Metrics History
      statsHistory.forEach((record, index) => {
        data.push({
          Category: "Engagement Metrics",
          Field: `Record ${index + 1} Time`,
          Value: record.time,
        });
        data.push({
          Category: "Engagement Metrics",
          Field: `Record ${index + 1} Views`,
          Value: record.views,
        });
        data.push({
          Category: "Engagement Metrics",
          Field: `Record ${index + 1} Likes`,
          Value: record.likes,
        });
        data.push({
          Category: "Engagement Metrics",
          Field: `Record ${index + 1} Comments`,
          Value: record.comments,
        });
      });

      // Sentiment Analysis Summary
      data.push({
        Category: "Sentiment Analysis",
        Field: "Positive Comments Count",
        Value: sentimentSummary.positive,
      });
      data.push({
        Category: "Sentiment Analysis",
        Field: "Neutral Comments Count",
        Value: sentimentSummary.neutral,
      });
      data.push({
        Category: "Sentiment Analysis",
        Field: "Negative Comments Count",
        Value: sentimentSummary.negative,
      });
    }

    return data;
  };

  // Create CSV headers so the columns appear as "Category | Field | Value"
  const csvHeaders = [
    { label: "Category", key: "Category" },
    { label: "Field", key: "Field" },
    { label: "Value", key: "Value" },
  ];

  // Fetch statistics for the comparison video
  const fetchComparisonStats = async () => {
    const videoID = extractVideoID(compareVideoURL);
    if (!videoID) {
      alert("Invalid comparison video link.");
      return;
    }
    try {
      let res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoID}&key=${apiKey}`
      );
      let data = await res.json();
      if (data.items && data.items.length > 0) {
        let video = data.items[0];
        const stats = {
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url,
          views: parseInt(video.statistics.viewCount),
          likes: parseInt(video.statistics.likeCount),
          comments: parseInt(video.statistics.commentCount),
        };
        setCompareVideoData(stats);
      } else {
        alert("No data found for comparison video.");
      }
    } catch (error) {
      console.error("Error fetching comparison video data:", error);
    }
  };

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
        <button
          className={`btn ${tracking ? "btn-danger" : "btn-success"}`}
          onClick={() => setTracking(!tracking)}
        >
          {tracking ? "Stop Tracking" : "Start Real-time Tracking"}
        </button>
      </div>

      {/* Export CSV Button */}
      {channelStats && videoStats && (
        <div className="export-button text-center mb-3">
          <CSVLink
            data={generateCSVData()}
            headers={csvHeaders}
            filename={"youtube_analytics_data.csv"}
            className="btn btn-secondary"
          >
            Export Data as CSV
          </CSVLink>
        </div>
      )}

      {loading && (
        <div className="text-center spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      {/* --- Select Components Section --- */}
      <div className="card p-3 mb-3">
        <h4 className="text-center">Select Components to Display</h4>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="components" direction="horizontal">
            {(provided) => (
              <ul
                className="list-group list-group-horizontal d-flex justify-content-center"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {componentsList.map(({ id, label }, index) => (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`list-group-item list-group-item-action d-flex align-items-center small py-2 px-3 ${
                          selectedComponents.includes(id) ? "active" : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          borderRadius: "20px",
                          transition: "background-color 0.3s",
                          margin: "0 5px",
                          ...provided.draggableProps.style,
                        }}
                        onClick={() => toggleComponent(id)}
                      >
                        <span>{label}</span>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {/* --- End Select Components Section --- */}

      {/* --- Displaying Selected Components --- */}
      {channelStats && videoStats && (
        <div>
          {selectedComponents.includes("channelStats") && (
            <div
              className="card mb-3 p-3 text-start d-flex align-items-center"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <img
                src={channelProfile}
                alt="Channel Profile"
                className="rounded-circle me-3"
                style={{ width: "80px", height: "80px" }}
              />
              <div>
                <h4 className="mb-2">{channelName}</h4>
                <p>
                  <strong>Subscribers:</strong>{" "}
                  {formatNumber(channelStats.subscriberCount)}
                </p>
                <p>
                  <strong>Total Videos:</strong> {formatNumber(totalVideos)}
                </p>
                <p>
                  <strong>Total Views:</strong>{" "}
                  {formatNumber(channelStats.viewCount)}
                </p>
                <p>
                  <strong>Upload Frequency:</strong> {uploadFrequency}
                </p>
              </div>
            </div>
          )}

          {selectedComponents.includes("videoStats") && (
            <div className="card p-3 text-center d-flex align-items-center justify-content-center">
              <img
                src={videoThumbnail}
                alt="Video Thumbnail"
                className="img-fluid rounded mb-3"
                style={{ maxWidth: "500px", cursor: "pointer" }}
                onClick={() => handleVideoClick(extractVideoID(videoURL))}
              />
              <h4>{videoTitle}</h4>
              <p>
                <strong>Views:</strong> {formatNumber(videoStats.viewCount)}
              </p>
              <p>
                <strong>Likes:</strong> {formatNumber(videoStats.likeCount)}
              </p>
              <p>
                <strong>Comments:</strong> {formatNumber(videoStats.commentCount)}
              </p>
              <p>
                <strong>Comments Per View:</strong>{" "}
                {commentsPerView !== "N/A"
                  ? `1 in ${formatNumber(commentsPerView)} viewers comments`
                  : "No comments yet"}
              </p>
              <p>
                <strong>Engagement Rate:</strong> {engagementRate}
              </p>
              <p>
                <strong>Duration:</strong> {videoDuration}
              </p>
              <p>
                <strong>Trending Tags:</strong> {trendingTags.join(", ")}
              </p>
            </div>
          )}

          {selectedComponents.includes("engagementMetrics") && (
            <div className="card mt-4 p-3">
              <h4 className="text-center">Real-Time Engagement Metrics</h4>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={statsHistory}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
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
          )}

          {selectedComponents.includes("mostViewedVideos") && (
            <div className="card mt-4 p-3">
              <h4 className="text-center">Most Viewed Videos</h4>
              <div className="d-flex flex-wrap justify-content-center">
                {mostViewedVideos.map((video, index) => (
                  <div
                    key={index}
                    className="card m-2"
                    style={{ width: "200px", cursor: "pointer" }}
                    onClick={() => handleVideoClick(video.id.videoId)}
                  >
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt="Thumbnail"
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <p className="card-text">{video.snippet.title}</p>
                      <p className="card-text">
                        <strong>Views:</strong> {formatNumber(video.views)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedComponents.includes("mostRatedVideos") && (
            <div className="card mt-4 p-3">
              <h4 className="text-center">Highly Rated Videos</h4>
              <div className="d-flex flex-wrap justify-content-center">
                {mostLikedVideos.map((video, index) => (
                  <div
                    key={index}
                    className="card m-2"
                    style={{ width: "200px", cursor: "pointer" }}
                    onClick={() => handleVideoClick(video.id.videoId)}
                  >
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt="Thumbnail"
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <p className="card-text">{video.snippet.title}</p>
                      <p className="card-text">
                        <strong>Likes:</strong> {formatNumber(video.likes)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedComponents.includes("sentimentAnalysis") && (
            <div className="card mt-4 p-3">
              <h4 className="text-center">Comment Sentiment Analysis</h4>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={sentimentChartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {sentimentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedComponents.includes("compareVideos") && (
            <div className="card mt-4 p-3">
              <h4 className="text-center">Compare Videos</h4>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter YouTube Video Link for Comparison"
                value={compareVideoURL}
                onChange={(e) => setCompareVideoURL(e.target.value)}
              />
              <button className="btn btn-primary mb-3" onClick={fetchComparisonStats}>
                Compare
              </button>
              {compareVideoData && videoStats && (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={comparisonChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    {/* --- Using log scale to handle large differences --- */}
                    <YAxis scale="log" domain={[1, "dataMax"]} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="primary"
                      fill="#8884d8"
                      name={videoTitle || "Primary Video"}
                    />
                    <Bar
                      dataKey="comparison"
                      fill="#82ca9d"
                      name={compareVideoData.title || "Comparison Video"}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- Embedded Video Player Modal --- */}
      {showPlayer && currentVideoId && (
        <div
          className="video-modal"
          onClick={closePlayer}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "80%",
              maxWidth: "800px",
              background: "#000",
            }}
          >
            <button
              onClick={closePlayer}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 1001,
                background: "red",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <iframe
              width="100%"
              height="450"
              src={`https://www.youtube.com/embed/${currentVideoId}`}
              title="YouTube Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalytics;
