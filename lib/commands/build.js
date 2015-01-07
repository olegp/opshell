var IMAGE_DIR = resolve("../../images/");
fs.list(IMAGE_DIR).forEach(function(image) {
  put(IMAGE_DIR + image, "/tmp/images/" + image);
  run('docker build -t="{0}" {1}', [image, "/tmp/images/" + image], true);
});
