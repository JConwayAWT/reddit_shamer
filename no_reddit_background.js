intervalGlobalID = -999;
currentlyCounting = false;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if (tab.url.indexOf("reddit.com") != -1 && currentlyCounting == false){
		currentlyCounting = true;

		startTime = $.now();

		intervalGlobalID = setInterval(function(){
			stillOnReddit = false;
			chrome.tabs.query({},function(tabs){
				for (i = 0; i < tabs.length; i++){
					if (tabs[i].url.indexOf("reddit.com") != -1 && currentlyCounting == true){
						stillOnReddit = true;
					}
				}

				stopTime = $.now();

				// If you've been on Reddit for more than 1.5 minutes (1.5 * 60 seconds)...
				if (currentlyCounting && stillOnReddit && ((stopTime - startTime)/1000 > 1.5 * 60)){
					var opt = {
									type: "basic",
									title: "Come on, man.",
									message: "Is this really the best thing you could be doing with your time?\r\n\r\nReally, is it?",
									iconUrl: "icon_38.png"
								}
		            chrome.notifications.create("disappointed_in_you",opt,function(){});
		            setTimeout(function(){chrome.notifications.clear("disappointed_in_you",function(){});},10000);
				}

				if (stillOnReddit == false){
					clearInterval(intervalGlobalID);
					currentlyCounting == false;
					var opt = {
									type: "basic",
									title: "Nice!",
									message: "You've made a good decision.  =)",
									iconUrl: "icon_38.png"
								}
		            chrome.notifications.create("proud_of_you",opt,function(){});
		            setTimeout(function(){chrome.notifications.clear("proud_of_you",function(){});},3000);
				}
			});
		}, 15*1000);
	}
});