export function Decode(file) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    return evt.target.result
  };
  reader.readAsText(file);
}
