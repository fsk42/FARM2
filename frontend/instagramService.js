const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-file-store').FileCookieStore;

const username = 'bipamef154';
const password = 'FarmProjekt123456';
const cookieStore = new FileCookieStore('./cookies.json');

const client = new Instagram({ username, password, cookieStore });

async function login() {
  try {
    await client.login();
    console.log('Logged in successfully');
  } catch (error) {
    console.error('Error logging in:', error);
  }
}

async function uploadPhoto(photoPath, caption) {
  try {
    const { media } = await client.uploadPhoto({
      photo: photoPath,
      caption: caption,
      post: 'feed',
    });
    console.log(`Photo uploaded: https://www.instagram.com/p/${media.code}/`);
  } catch (error) {
    console.error('Error uploading photo:', error);
  }
}

module.exports = { login, uploadPhoto };
