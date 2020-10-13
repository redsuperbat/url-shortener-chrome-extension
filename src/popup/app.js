import qr from 'qrcode';
import { http } from './axiosInstance';
import { createApp } from 'vue';

const canvas = document.querySelector('canvas');
const anchor = document.querySelector('a');

const app = createApp();
app.mount('#app');

async function main() {
  const fullUrl = await createUrl();
  await drawQr(fullUrl);
  anchor.href = fullUrl;
  anchor.innerText = fullUrl;
}

async function createUrl() {
  const url = await getCurrentUrl();
  try {
    const res = await http.post('', { url });
    drawQr(res.data.fullUrl);
    return res.data.fullUrl;
  } catch (err) {
    console.log(err.response.data);
  }
}

async function getCurrentUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      resolve(tabs[0].url);
    });
  });
}

function drawQr(string) {
  return new Promise((resolve) =>
    qr.toCanvas(canvas, string, (err) => {
      if (err) console.log(err);
      console.log('Success');
      canvas.style.height = '200px';
      canvas.style.width = '200px';
      resolve();
    }),
  );
}

main();
