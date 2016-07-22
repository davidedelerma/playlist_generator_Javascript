//get top track for each artist
//GET https://api.spotify.com/v1/artists/{id}/top-tracks

var getTopTracks = function(artist){
  var url = 'https://api.spotify.com/v1/artists/'+artist.id+'/top-tracks';
  var request1 = new XMLHttpRequest();
  request1.open("GET", url);
  request1.onload = function(){
    if(request.status === 200) {
      var topSongs = JSON.parse(request1.responseText)
      console.log(topSongs)
    }
  }
}

var searchSimilarArtists = function(artist){
  var url='https://api.spotify.com/v1/artists/'+artist.id+'/related-artists';
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function(){
    if(request.status === 200) {
      var similarArtists = JSON.parse(request.responseText)
      var testArtist = similarArtists.artists[0]
      console.log("test artist",testArtist)
      getTopTracks(testArtist)
    }
  }
  request.send(null);
}

var displayArtists = function(artists){
  var results = document.getElementById('results');
  results.innerHTML = "";  
  var dropdown = document.createElement('select');
  for (var artist of artists.artists.items){
    var option = document.createElement( 'option' );
    option.value = artist.name;
    option.innerHTML = artist.name;
    dropdown.appendChild(option);
  }
 
  results.appendChild(dropdown)

  searchSimilarArtists(artists.artists.items[0]);

  dropdown.onchange = function (){
    selectedIndex = dropdown.selectedIndex;
    var selectedArtist=artists.artists.items[selectedIndex]
    searchSimilarArtists(selectedArtist)
  }
}


var main = function(){


  var searchArtist = function(event) {
      event.preventDefault();
      console.log(event);
      var query = document.getElementById( 'query' ).value;
      var url='https://api.spotify.com/v1/search?q=' + query + '&type=artist';
      var request = new XMLHttpRequest();
      request.open("GET", url);
      request.onload = function(){
        if(request.status === 200) {
         var ArtistsObject = JSON.parse(request.responseText)
         displayArtists(ArtistsObject)
        }
      }
      request.send(null);
  };

  var form = document.getElementById('search-form');
  form.onsubmit = searchArtist;
}
window.onload = main;
