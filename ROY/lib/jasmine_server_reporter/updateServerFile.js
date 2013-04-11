//
// If I put these functions in a namespace (i.e. "royUtils = {}") I
// lose the active comments (when you type the name of a function and
// hover over it, the comments below appear like Javadocs).
//

/**
 * Updates a server file. This uses a php file on the server to update
 * the file with the data passed to it, so you need Apache (or another 'real'
 * web server) along with PHP to be installed on the server.
 * @param $filename the name of the server file you wish to update (relative to DocumentRoot, i.e. "/MYPROJECT/results/x.txt").
 * @param $outStr the data you want to write to the file.
 */
function updateServerFile($filename, $outStr) {
	
	var outFile = $filename;
	
	jQuery.ajax({
		  type: 'POST',
		  url: "./updateServerFile.php",
		  data: {file: outFile, data: $outStr}, //your data
		  success: function(){return true;},
		  dataType: "text"
		});
}
