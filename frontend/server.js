const express = require('express');
const { login, uploadPhoto } = require('./InstagramService');

const app = express();
app.use(express.json());

app.post('/upload', async (req, res) => {
  const { photoPath, caption } = req.body;
  try {
    await login();
    await uploadPhoto(photoPath, caption);
    res.send('Photo uploaded successfully!');
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).send('Error uploading photo');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

app.get('/', (req, res) => {
    res.send('Server is running');
  });
  
