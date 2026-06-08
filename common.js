"use strict";

const download = (file, name) => {
  const url = URL.createObjectURL(new Blob([file]));
  const dl = document.createElement('a');
  dl.download = name || ('fflate-demo-' + Date.now() + '.dat');
  dl.href = url;
  dl.click();
  URL.revokeObjectURL(url);
}

const install = (n) => {
  Notification.requestPermission()
  const container = document.querySelector(`#container${n}`)
  const btn = container.querySelector(`.btn`)
  btn.addEventListener("click", () => {
    btn.disabled = true
    btn.textContent = "running..."

    const files = document.querySelector(`#selector`).files

    const zipObj = {}
    const promises = []

    for (const file of files) {
      promises.push(new Promise(async (resolve, reject) => {
        zipObj[file.webkitRelativePath] = await file.bytes()
        resolve(true)
      }))
    }

    Promise.all(promises).then(() => {

      const start = new Date()

      fflate.zip(zipObj, { level: 0 }, (err, data) => {
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
      })
    })
  })
  btn.disabled = false
  btn.title = ""
}
