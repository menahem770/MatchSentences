var matchSentence = function getEditDistance(a, b) {
  if (a.length === 0) return b.length; 
  if (b.length === 0) return a.length; 
  a = a.toLowerCase();
  b = b.toLowerCase();
  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) == a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};
var matchSentences = function(a,collection){
    var res = [];
    res.dist = Number.MAX_SAFE_INTEGER;
    res.index = -1;
    collection.forEach(function(element) {
        var dist = matchSentence(a,element.title);
        if(dist <  res.dist){
            res.index = element._id;
            res.dist = dist;
        }
    });
    return res;
}
exports.matchSentences = matchSentences;