# Test `fflate` within a WebExtension

## Instructions

1. Clone this repo, and load `manifest.json` as an extension:
  - Firefox: `about:debugging` → This Firefox → Load Temporary Add-on...
  - Chrome: `about:extensions` → Load unpacked
2. Go to the [demo](https://gapato.github.io/test-fflate-webextension/). If both `zip` buttons should be enabled if the extension loaded successfully.
3. Select the cloned directory (which contains 3 1MB random blobs in `data` dir) and click the buttons. On Firefox, the second should be much slower (50ms vs 10s).

