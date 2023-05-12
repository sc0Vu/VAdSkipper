let vad = {
  yt: {
    enabled: false,
    interval: 300
  }
}

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set({
      vad: vad
    })
  } else {
    const sVad = await chrome.storage.local.get('vad')
    vad = sVad.vad
  }
})

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    if (message) {
      let res = true
      if (message.target == 'ytEnabled') {
        console.log ('got yt enabled')
        if (vad.yt.enabled !== message.value) {
          console.log ('update yt enabled value', message.value)
          vad.yt.enabled = message.value
          await chrome.storage.local.set({ vad: vad })
        }
      } else if (message.target == 'loadVad') {
        res = vad
      }
      sendResponse(res)
    }
})