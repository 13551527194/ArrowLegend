var bLoaded;var bPluginEnabled;var bMoniterDynamicLinks;var bWebsiteEnabled;var bPageEnabled;var bMonitorEmule=false;var bMonitorMagnet=false;var bMonitorTradition=false;var bMonitorIE=false;var strMonitorDemain;var strFilterDemain;var strMonitorFileExt;var whiteRegexpArray=[".+sina.com.*\\/d_load.php\\?.+",".+pcpop.com.*\\/redose.aspx\\?.+",".+pcpop.com.*\\/download.php\\?.+",".+pconline.com.cn\\/filedown.jsp\\?.+",".+chinaz.com\\/download.asp\\?.+",".+cnzz.cn\\/download.aspx\\?.+",".+zol.com.*\\/down.php\\?.+",".+zol.com.*\\?.*url=([^\\&]+).*",".+crsky.com.*\\?down_url=([^\\&]+).*",".+skycn.com.*\\/down.php\\?uri=(.+)",".+downxia.com.*\\/download.asp\\?.*url=(.+)"];var blackRegexpArray=["http.+\\?.*url=.+","http.+\\?.*uri=.+"];function checkWhiteDynamicLink(e){for(var n in whiteRegexpArray){var i=new RegExp(whiteRegexpArray[n],"i");var r=i.exec(e);if(r==e){return r}if(r!=null&&r.length==2){return r[1]}}return null}function checkBlackDynamicLink(e){for(var n in blackRegexpArray){var i=new RegExp(blackRegexpArray[n],"i");var r=i.exec(e);if(r!=null){return r}}return null}function IsDynamicLink(e){var n=e.toLowerCase();var i=true;if(n.indexOf("?")==-1||n.indexOf("magnet:?")!=-1){i=false}return i}function IsValidUrlAndMonitorProtocol(e){var n="HTTP://FTP://THUNDER://MMS://MMST://RTSP://RTSPU://XLAPP://";var i="ED2K://";var r="MAGNET:?";if(e.length==0){return false}var t=e;var a=t.indexOf(":");if(a==-1){return false}var o=t.substr(0,a+1);var l=o.toUpperCase();if(l==""){return false}var s=true;if(i.indexOf(l)!=-1){if(bMonitorEmule==false){s=false}}else if(r.indexOf(l)!=-1){if(bMonitorMagnet==false){s=false}}else if(n.indexOf(l)!=-1){if(bMonitorTradition==false){s=false}}else{s=false}return s}function IsMonitorDemain(e){if(e.length==0){return true}var n=new Array;var i=strMonitorDemain.split("||");for(var r in i){var t=i[r].slice(2);var a=t.trimRight("|");n.push(a)}var o=true;var l=e;for(var s in n){if(n[s].length>0&&l.indexOf(n[s])!=-1){o=false;break}}return o}function IsFilterDemain(e){if(e.length==0){return false}if(strFilterDemain.length==0){return false}var n=new Array;var i=strFilterDemain.split("||");for(var r in i){var t=i[r].slice(2).toLowerCase();var a=t.trimRight("|");n.push(a)}var o=false;var l=e.toLowerCase();for(var s in n){if(n[s]>0&&l.indexOf(n[s])!=-1){o=true;break}}return o}function GetExtensionFileName(e){var n=/(\\+)/g;var i=e.replace(n,"#");var r=i.split("#");var t=r[r.length-1];var a=t.split(".");return a[a.length-1]}function IsMonitorFileExt(e){if(e.length==0){return false}var n=e.indexOf(":");if(n==-1){return false}var i=e.toLowerCase();var r=i.substr(0,n+3);var t=r.trimLeft(" ");if(t=="xlapp://"){return true}if(i.indexOf("ed2k://")!=-1||i.indexOf("magnet:?")!=-1){return true}var a=false;var o=GetExtensionFileName(i);if(o.length>0){o+=";";if(strMonitorFileExt.indexOf(o)!=-1){a=true}}return a}function IsURLInMonitor(e,n){if(e.length==0){return false}if(bMonitorIE==false){return false}if(IsValidUrlAndMonitorProtocol(e)==false){return false}if(IsMonitorDemain(n)==false){return false}if(IsFilterDemain(n)){return false}if(IsMonitorFileExt(e)==false){return false}return true}function IsDownloadURL(e,n,i){var r=IsDynamicLink(e);if(!r){return IsURLInMonitor(e,i)}return false}function checkDownloadLink(e){return IsDownloadURL(e,document.cookie,document.location.href)}function GetConfig(){chrome.extension.sendRequest({name:"GetConfig"},function(e){bMonitorEmule=e.bMonitorEmule;bMonitorMagnet=e.bMonitorMagnet;bMonitorTradition=e.bMonitorTradition;bMonitorIE=e.bMonitorIE;strMonitorDemain=e.strMonitorDemain;strFilterDemain=e.strFilterDemain;strMonitorFileExt=e.strMonitorFileExt})}function CheckEnabled(e){chrome.extension.sendRequest({name:"CheckEnabled",url:e},function(e){bPluginEnabled=e.bPlugin;bWebsiteEnabled=e.bWebsite;bPageEnabled=e.bPage})}function CheckbMoniterDynamicLinks(e){chrome.extension.sendRequest({name:"CheckbMoniterDynamicLinks"},function(e){bMoniterDynamicLinks=e.bMoniterDynamicLinks})}function onLinkClick(e){if(bMoniterDynamicLinks){return}if(bPluginEnabled&&bWebsiteEnabled&&bPageEnabled){console.log("onLinkClick!");var n=this.href;var i=checkWhiteDynamicLink(n);if(i!=null){chrome.extension.sendRequest({name:"xl_download",link:i,cookie:document.cookie,referurl:document.location.href});return e.preventDefault()}i=checkBlackDynamicLink(n);if(i!=null){return}i=checkDownloadLink(n);if(i){console.log("checkResult == false!");chrome.extension.sendRequest({name:"xl_download",link:n,cookie:document.cookie,referurl:document.location.href});return e.preventDefault()}}}function RegisterClickEventListener(){for(var e=0;e<document.links.length;e++){var n=document.links[e];n.addEventListener("click",onLinkClick,false)}}function RegisterExtensionMsgListener(){chrome.extension.onMessage.addListener(function(e,n,i){if(e.name=="UpdatePluginEnabled"){bPluginEnabled=e.enable}else if(e.name=="UpdateMoniterDynamicLinks"){bMoniterDynamicLinks=e.enable}else if(e.name=="UpdateWebsiteEnabled"){bWebsiteEnabled=e.enable}else if(e.name=="UpdatePageEnabled"){bPageEnabled=e.enable}else if(e.name=="OnActivated"){if(bLoaded){CheckEnabled(document.location.href);CheckbMoniterDynamicLinks()}}else if(e.name=="GetCookie"){i({cookie:document.cookie})}})}function Init(){bLoaded=true;RegisterExtensionMsgListener();CheckEnabled(document.location.href);CheckbMoniterDynamicLinks();RegisterClickEventListener();GetConfig()}Init();