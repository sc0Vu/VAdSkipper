let vad = undefined
const vadYtEnabled = document.getElementById('enable-close-ad-automatically')
const YT_SCRIPT_ID = 'VAD:YT'
let ytRegistered = false

async function getCurrentRegisteredIds() {
  const scripts = await chrome.scripting.getRegisteredContentScripts()
  return scripts.map(script => script.id)
}

async function registerYtSkipper() {
  if (!ytRegistered) {
    // TODO: check why this didn't execute
    await chrome.scripting.registerContentScripts(
      [{
        id: YT_SCRIPT_ID,
        js: ['content.js'],
        matches: ["https://*.youtube.com/*"],
      }]
    )
    ytRegistered = true
  }
  return true
}

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
    const scriptIds = await getCurrentRegisteredIds()
    if (scriptIds.indexOf(YT_SCRIPT_ID) < 0) {
      registerYtSkipper()
    } else {
      ytRegistered = true
    }
    vadYtEnabled.checked = true
  }
}

loadSettings()

vadYtEnabled.addEventListener('click', async (e) => {
  const checked = e.target.checked
  chrome.runtime.sendMessage({
    type: 'event',
    target: 'ytEnabled',
    value: checked
  })
  const scriptIds = await getCurrentRegisteredIds()
  if (checked) {
    if (scriptIds.indexOf(YT_SCRIPT_ID) < 0) {
      registerYtSkipper()
    } else {
      ytRegistered = true
    }
  } else {
    chrome.scripting.unregisterContentScripts({
      ids: scriptIds
    })
  }
})