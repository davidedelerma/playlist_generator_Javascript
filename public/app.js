//problems: refresh array of songs, get array of songs for the first artist

//understanding callback
function rndSongArrayFun(artists,callback){
  //var rndSongArray = [];
  callback(artists);
}

var rndSongArray=[];
var getTopSongs = function(artist){
  var url="https://api.spotify.com/v1/artists/"+artist.id+"/top-tracks?country=GB";
  var request = new XMLHttpRequest();
  request.open('GET',url);
  request.onload = function(){
    if(request.status === 200){
      var topSongs = JSON.parse(request.responseText);
      var rndIdx = Math.floor(Math.random() * (topSongs.tracks.length+ 1));
      rndSong = topSongs.tracks[rndIdx];
      rndSongArray.push(rndSong);
      //console.log(rndSongArray)
    };
  };
  request.send(null);
  //return rndSong
}



var searchSimilarArtists = function(artist){
  var url='https://api.spotify.com/v1/artists/'+artist.id+'/related-artists';
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function(){
    if(request.status === 200) {
      var similarArtistsObject = JSON.parse(request.responseText);
      rndSongArrayFun(similarArtistsObject.artists,function(artists){
          artists.forEach(function(artist){
            {getTopSongs(artist)}
          })
      })
      console.log('array of songs',rndSongArray);
      console.log('array of similar artists',similarArtistsObject.artists)

      // similarArtistsObject.artists.forEach(function(artist){getTopSongs(artist);});
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
      //console.log(event);
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
