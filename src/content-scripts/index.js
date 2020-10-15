import $ from 'jquery';
import isUrl from 'validator/es/lib/isURL';
import { http } from '../popup/axiosInstance';
import { popupElement } from './elements';

window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
let showPopup = false;
let selectedUrl = '';

// Add all elements
$('body').append(popupElement);
const popup = document.getElementById('url-shortener-popup');
// Hide elements initally
removePopup();

function handleMouseMove(e) {
  const selected = window.getSelection().toString();
  if (isUrl(selected)) {
    selectedUrl = selected;
    if (!showPopup) {
      showPopup = true;
      createPopup();
    }
    movePopup(e);
  } else {
    if (!showPopup) return;
    showPopup = false;
    removePopup();
  }
}

function createPopup() {
  $(popup).show();
  console.log('Added popup somewhere...');
}

function removePopup() {
  $(popup).hide();
  $(popup).find('section').hide();
  console.log('Removed popup...');
}

function movePopup(e) {
  const x = e.pageX;
  const y = e.pageY;
  //   const x = e.pageX - $(window).offset().left + $(window).scrollLeft();
  //   const y = e.pageY - $(window).offset().top + $(window).scrollTop();
  console.log('setting position to', x, y);
  $(popup).animate({ top: y - 20, left: x + 20 }, 0);
}

async function createUrl(url) {
  try {
    const res = await http.post('', { url });
    return res.data.fullUrl;
  } catch (err) {
    console.log(err);
  }
}

function handleMouseUp() {
  window.removeEventListener('mousemove', handleMouseMove);
}

function handleMouseDown() {
  window.addEventListener('mousemove', handleMouseMove);
}
// Dont create another url when one is created already
$(popup)
  .find('section')
  .on('click', (e) => e.stopPropagation());

$(popup).on('click', async (e) => {
  e.stopPropagation();
  const fullUrl = await createUrl(selectedUrl);
  $(popup).find('section').show();
  if (fullUrl) {
    $(popup).find('a').attr('href', fullUrl).html(fullUrl);
  }
});
