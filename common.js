"use strict";

const download = (file, name) => {
  const url = URL.createObjectURL(new Blob([file]));
  const dl = document.createElement('a');
  dl.download = name || ('fflate-demo-' + Date.now() + '.dat');
  dl.href = url;
  dl.click();
  URL.revokeObjectURL(url);
}

const install = (n, patched=false) => {
  const btn = document.querySelector(`#btn${n}`)
  btn.addEventListener("click", () => {
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

      console.log(zipObj)

      const ff = patched ? fflate_patched : fflate;

      ff.zip(zipObj, { level: 0 }, (err, data) => {
        const end = new Date()
        const status = document.querySelector(`#status${n}`)
        if (err != null) {
          status.textContent = "[error]"
        } else {
          status.textContent = `done in ${end - start} ms`
        }
        download(data, "test.zip")
      })
    })
  })
  btn.disabled = false
  btn.title = ""
  console.log(`adding listener on btn${n}...`)
}
