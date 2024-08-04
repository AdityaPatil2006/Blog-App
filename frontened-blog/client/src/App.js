import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import "./App.css"; // Import CSS file

const apiUrl = "http://localhost:1000"; //Change the port to 1000 from 8000

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });
  const [editPost, setEditPost] = useState(null);
  const [updatedPost, setUpdatedPost] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState(""); // State for error messages

  useEffect(() => {
    axios
      .get(`${apiUrl}/posts`)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setError("Error fetching posts. Please try again later.");
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content) {
      setError("Title and content are required!");
      return;
    }

    axios
      .post(`${apiUrl}/posts`, newPost)
      .then((response) => {
        setPosts((prevState) => [...prevState, response.data]);
        setNewPost({ title: "", content: "" });
        setError(""); // Clear error on successful post
      })
      .catch((error) => {
        console.error("Error adding post:", error);
        setError("An error occurred while adding the post. Please try again.");
      });
  };

  const handleDeletePost = (id) => {
    axios
      .delete(`${apiUrl}/posts/${id}`)
      .then(() => {
        setPosts((prevState) => prevState.filter((post) => post._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        setError(
          "An error occurred while deleting the post. Please try again."
        );
      });
  };

  const startEditing = (post) => {
    setEditPost(post);
    setUpdatedPost({ title: post.title, content: post.content });
  };

  const handleUpdatePost = (id) => {
    if (!updatedPost.title || !updatedPost.content) {
      setError("Title and content are required for update!");
      return;
    }

    axios
      .put(`${apiUrl}/posts/${id}`, updatedPost)
      .then((response) => {
        setPosts((prevState) =>
          prevState.map((post) => (post._id === id ? response.data : post))
        );
        setEditPost(null);
        setUpdatedPost({ title: "", content: "" });
        setError(""); // Clear error on successful update
      })
      .catch((error) => {
        console.error("Error updating post:", error);
        setError(
          "An error occurred while updating the post. Please try again."
        );
      });
  };

  return (
    <div className="app">
      <AppBar position="static" id="app-bar">
        <Toolbar>
          {/* <Typography id="head">𝓜𝔂 𝓑𝓵𝓸𝓰</Typography> */}
          <Typography id="head">My Blog</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className="container">
        {error && (
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card className="card">
              <CardContent className="card-content">
                <h1 id="header">Enter Your Blog</h1>
                <TextField
                  label="Title"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Content"
                  name="content"
                  value={newPost.content}
                  onChange={handleInputChange}
                  multiline
                  fullWidth
                  margin="normal"
                />
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                id="add-post-button"
                onClick={handleAddPost}
              >
                Add Post
              </Button>
            </Card>
          </Grid>
          {editPost && (
            <Grid item xs={12} sm={6} md={4}>
              <Card className="card">
                <CardContent className="card-content">
                  <TextField
                    label="Title"
                    name="title"
                    value={updatedPost.title}
                    onChange={(e) =>
                      setUpdatedPost({ ...updatedPost, title: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Content"
                    name="content"
                    value={updatedPost.content}
                    onChange={(e) =>
                      setUpdatedPost({
                        ...updatedPost,
                        content: e.target.value,
                      })
                    }
                    multiline
                    fullWidth
                    margin="normal"
                  />
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdatePost(editPost._id)}
                >
                  Update Post
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditPost(null)}
                >
                  Cancel
                </Button>
              </Card>
            </Grid>
          )}
          {posts.map((post) => (
            <Grid key={post._id} item xs={12} sm={6} md={4}>
              <Card className="card">
                <CardContent className="card-content">
                  <Typography variant="h5" className="post-title">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" className="post-content">
                    {post.content}
                  </Typography>
                </CardContent>
                <div className="card-actions">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => startEditing(post)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
