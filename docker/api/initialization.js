const containerIds = new Array(CONTAINERS_AMOUNT).fill(null);

(function initContainersFolder() {
  fs.mkdir('./docker/containers', (err) => {
    if (!err) {
      containerIds.forEach((el, i) => {
        fs.mkdir('./docker/containers/volume-' + i, () => {});
      });
    }
  });
}());
