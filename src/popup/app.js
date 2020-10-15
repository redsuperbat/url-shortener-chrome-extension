import qr from 'qrcode';
import { http } from './axiosInstance';
import $ from 'jquery';

const canvas = document.querySelector('canvas');
const anchor = document.querySelector('a');

async function main() {
  toogleLoading();
  const fullUrl = await createUrl();
  if (fullUrl) {
    await drawQr(fullUrl);
    anchor.href = fullUrl;
    anchor.innerText = fullUrl;
    $('svg').on('click', () => {
      navigator.clipboard
        .writeText(fullUrl)
        .then(() => (anchor.innerText = 'Copied successfully!'))
        .catch(() => (anchor.innerText = 'Something went wrong try again...'))
        .finally(() => setTimeout(() => (anchor.innerText = fullUrl), 500));
    });
    $('button').on('click', async () => {
      const blob = await getImageBlob();
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    });
  } else {
    $('svg').remove();
    $('button').remove();
    $('body').append('<h3>Link not supported</h3>');
  }
  toogleLoading();
}

async function getImageBlob() {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob)));
}

function toogleLoading() {
  if ($('main').is(':hidden')) {
    $('main').show();
    $('#loading').hide();
  } else {
    $('main').hide();
    $('#loading').show();
  }
}

async function createUrl() {
  const url = await getCurrentUrl();
  try {
    const res = await http.post('', { url });
    return res.data.fullUrl;
  } catch (err) {
    console.log(err);
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
