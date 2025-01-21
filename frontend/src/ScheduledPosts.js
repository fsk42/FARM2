import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./ScheduledPostsCalendar.css";

function ScheduledPostsCalendar() {
  const [posts, setPosts] = useState([]);
  const [datePosts, setDatePosts] = useState([]); // Posts for the selected date
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date
  const [currentIndex, setCurrentIndex] = useState(0); // Index for sliding

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/scheduled_posts"
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching scheduled posts:", error);
      }
    };

    fetchScheduledPosts();
  }, []);

  const getPostsByDate = (date) => {
    const selectedDate = date.toLocaleDateString("de-DE"); // Convert selected date to German format
    return posts.filter((post) => {
      if (!post.scheduled_time) return false;
      const postDate = new Date(post.scheduled_time).toLocaleDateString(
        "de-DE"
      ); // Compare with German format
      return postDate === selectedDate;
    });
  };

  const handleDateChange = (date) => {
    const postsForDate = getPostsByDate(date);
    setSelectedDate(date);
    setDatePosts(postsForDate);
    setCurrentIndex(0); // Reset index when a new date is selected
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const postsForDate = getPostsByDate(date);
      if (postsForDate.length > 0) {
        return null; // No additional dot needed
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const postsForDate = getPostsByDate(date);
      if (postsForDate.length > 0) {
        return "highlight-tile"; // Add the highlight class to the tile
      }
    }
    return null;
  };

  // Sliding logic for the left button
  const slideLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Sliding logic for the right button
  const slideRight = () => {
    if (currentIndex < datePosts.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/delete_scheduled_post/${postId}`
      );

      if (response.data.status === "success") {
        // Remove the deleted post from the local state
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
        setDatePosts(
          updatedPosts.filter((post) => {
            const postDate = new Date(post.scheduled_time).toLocaleDateString(
              "de-DE"
            );
            return postDate === selectedDate.toLocaleDateString("de-DE");
          })
        );
        setCurrentIndex(0); // Reset index if needed
      } else {
        alert("Failed to delete the post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="scheduled-posts-calendar">
      <h1>Scheduled Posts Calendar</h1>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        className="custom-calendar"
      />

      <div className="carousel-container">
        <h2>Scheduled Posts for {selectedDate.toDateString()}</h2>
        {datePosts.length > 0 ? (
          <div className="carousel">
            {currentIndex > 0 && ( // Show the left button only if not on the first post
              <button className="carousel-button left" onClick={slideLeft}>
                &lt;
              </button>
            )}
            <div className="carousel-content">
              <div className="post-item">
                <p>
                  <strong>Type:</strong> {datePosts[currentIndex].post_type}
                </p>
                <p>
                  <strong>Caption:</strong> {datePosts[currentIndex].caption}
                </p>
                <p>
                  <strong>Hashtags:</strong> {datePosts[currentIndex].hashtags}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {datePosts[currentIndex].scheduled_time.slice(11, 19)}
                </p>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(datePosts[currentIndex].id)}
                >
                  Delete
                </button>
              </div>
            </div>
            {currentIndex < datePosts.length - 1 && ( // Show the right button only if not on the last post
              <button className="carousel-button right" onClick={slideRight}>
                &gt;
              </button>
            )}
          </div>
        ) : (
          <p>No scheduled posts for this date.</p>
        )}
      </div>

      <a href="/" className="button back-button">
        Back to Main Page
      </a>
    </div>
  );
}

export default ScheduledPostsCalendar;