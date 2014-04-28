/* Logic to play a song */

function playSong(item){
	var songID = item;
	$.getJSON('/song/'+songID, function(song){
		var player = document.getElementById('player');
		while(player.hasChildNodes()){
			player.removeChild(player.lastChild);
		}

		var playlist = [{
			mp3: song.url,
			rating:4,
			title:song.title,
			duration: song.length,
			artist: song.artist,
		}];

		$('#player').ttwMusicPlayer(playlist, {
			autoPlay:true,
			description:''
		});
	});
}

$('.button--dropbox.js').click(function(){
	window.location.href = "/auth";
});

$(document).ready(function(){
	debugger;
	if(location.href.charAt(location.href.length-1) == '/'){
		var userEmail = $.jStorage.get('rockolAppUserEmail', null);

		if(userEmail)
		{
			window.location.href = "/enter/"+encodeURIComponent(userEmail);
		}
	}

	$('#userkey').ready(function(){
		debugger;
		var userEmail = $('#userkey').html();

		if(userEmail && userEmail !== '')
		{
			$.jStorage.set('rockolAppUserEmail', userEmail);
		}
	});
});
