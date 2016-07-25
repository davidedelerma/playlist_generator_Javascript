var rndSongArray = [];


//understanding callback
function rndSongArrayFun(artists,callback){  
  // eachSeries(artists,function(artist){getTopSongs(artist)})
  for (i = 0; i<artists.length; i++){
    //if(i < artists.length){
      //console.log('output -1')
      (function(i){getTopSongs(artists[i])})(i)
      //getTopSongs(artists[i])
   // }else if(i = artists.length){
   // }
  }
  callback()
}

var getTopSongs = function(artist){
  var url="https://api.spotify.com/v1/artists/"+artist.id+"/top-tracks?country=GB";
  var request = new XMLHttpRequest();
  request.open('GET',url);
  request.onload = function(){
    if(request.status === 200){
      var topSongs = JSON.parse(request.responseText);
      var rndIdx = Math.floor(Math.random() * (topSongs.tracks.length+ 1));
      var rndSong = topSongs.tracks[rndIdx];
      rndSongArray.push(rndSong);
      console.log('output 0');
      //callback(rndSong)
    };
  };
  request.send(null);
  //return rndSong
}



var searchSimilarArtists = function(artist,callback){
  var url='https://api.spotify.com/v1/artists/'+artist.id+'/related-artists';
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function(){
    if(request.status === 200) {
      var similarArtistsObject = JSON.parse(request.responseText);
      //callback
      rndSongArrayFun(similarArtistsObject.artists,function(){console.log('Output 1',rndSongArray)})
      console.log('array of similar artists',similarArtistsObject.artists,'2')
      callback()
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
  searchSimilarArtists(artists.artists.items[0],function(){console.log('output3',artist,rndSongArray)});

  dropdown.onchange = function (){

    selectedIndex = dropdown.selectedIndex;
    var selectedArtist=artists.artists.items[selectedIndex]
    searchSimilarArtists(selectedArtist)
    console.log('array of songs',rndSongArray);

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
