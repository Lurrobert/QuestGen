const paragraphs = document.querySelectorAll('p');
console.log('Modified tags');
// Use the forEach method to iterate over the selected <p> tags
paragraphs.forEach((paragraph, index) => {
  // Add a unique identifier to each <p> tag
  paragraph.id = `paragraph-${index}`;
});

console.log('Modified tags');