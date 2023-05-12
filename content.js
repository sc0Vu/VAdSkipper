let vad = undefined

// load settings
async function loadSettings () {
  const data = await chrome.runtime.sendMessage({
    type: 'event',
    target: 'loadVad'
  })
  if (vad === undefined) {
    vad = data
  }
  if (vad.yt.enabled) {
    registerYtSkipper()
  }
}

function registerYtSkipper() {
  const search = () => {
    console.log("search")
    // another ? .ytp-ad-overlay-close-button
    let ytSkipBtn = document.querySelector(".ytp-ad-skip-button")

    if(ytSkipBtn) {
      ytSkipBtn.click()
    }
  }
  if (vad.yt.enabled) {
    return window.setInterval(search, vad.yt.interval)
  }
}

loadSettings()