"use strict";

function isFirefoxContentScript() {
  return typeof browser !== "undefined" && typeof wrappedJSObject !== "undefined";
}

async function readFileBytes(file, passthrough=false) {
  return file.bytes()
    .then((bytes) => {
      if (passthrough || !isFirefoxContentScript()) {
        return bytes;
      }

      // In Firefox content scripts, DOM/File objects come from the page realm.
      // Copy once into an extension-owned buffer so the hot loop does not pay
      // cross-compartment access costs for every byte.
      const localBytes = new Uint8Array(bytes.byteLength);
      localBytes.set(bytes);
      return localBytes;
    })
}

const download = (file, name) => {
  const url = URL.createObjectURL(new Blob([file]));
  const dl = document.createElement('a');
  dl.download = name || ('fflate-demo-' + Date.now() + '.dat');
  dl.href = url;
  dl.click();
  URL.revokeObjectURL(url);
}

const install = (n, passthrough=false) => {
  Notification.requestPermission()
  const container = document.querySelector(`#container${n}`)
  const btn = container.querySelector(`.btn`)
  btn.addEventListener("click", () => {
    btn.disabled = true
    btn.textContent = "running..."

    const files = document.querySelector(`#selector`).files

    const zipObj = {}

    Promise.all(Array.from(files, async (file) => {
      return readFileBytes(file, passthrough).then((bytes) => {
        zipObj[file.webkitRelativePath] = bytes
        return true
      })
    })).then(() => {
      console.log(zipObj)

      const start = new Date()

      const callback = (err, data) => {
          const end = new Date()
          const statusSpan = container.querySelector(`.status`)
          if (err != null) {
            statusSpan.textContent = "[error]"
          } else {
            statusSpan.textContent = `done in ${end - start} ms`

            if (Notification.permission === "granted") {
              new Notification("Zipped data is ready for download")
            }

            const downloadBtn = document.createElement("button")
            downloadBtn.textContent = "download"
            downloadBtn.addEventListener("click", () => {download(data, "test.zip")})
            container.querySelector(".download")?.replaceChildren(downloadBtn)
          }
        }

      fflate.zip(zipObj, { level: 0 }, callback)
    })
  })
  btn.disabled = false
  btn.title = ""
}
