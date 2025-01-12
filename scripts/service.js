chrome.commands.onCommand.addListener(shortcut => {
  if (shortcut === "reload") {
    chrome.runtime.reload()
  }  
})