/* Logic to play a song */

	function playSong(item){
		var songName = item.innerHTML;
		$.getJSON('/song/'+songName, function(url){
			var player = document.getElementById('player');
			while(player.hasChildNodes()){
				player.removeChild(player.lastChild);
			}

			var playlist = [{
				mp3: url.data,
				rating:0,
				title:songName,
				duration: '3:30',
				artist: 'AC/DC',
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


