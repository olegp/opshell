var IMAGE_DIR = resolve("../../images/");

function build(image) {
  put(IMAGE_DIR + image, "/tmp/images/" + image);
  run('docker build -t="{0}" {1}', [image, "/tmp/images/" + image], true);
}

build('base');
var images = fs.list(IMAGE_DIR);
images.splice(images.indexOf('base'), 1);
images.forEach(build);
