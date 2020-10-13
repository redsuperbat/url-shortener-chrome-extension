chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({ color: '#3aa757' }, function () {
		console.log('The color is green.')
	})
})

chrome.browserAction.onClicked.addListener(() => {
	chrome.browserAction.setPopup({
		popup: './popup/index.html',
	})
})
