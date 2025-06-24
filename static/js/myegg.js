var hi=function(data,txt) {
  "use strict";
      var shock = document.createElement('div');
	  var textnode = document.createElement('div');
	  var temp=document.createTextNode(txt); //创建一个文本节点内容
	  textnode.appendChild(temp)

      var img = new Image;
      img.src = data;
      img.style.pointerEvents = "none";
      img.style.width = '300px';
      img.style.height = '300px';
      img.style.transition = '1s all';
      img.style.position = 'fixed';
      img.style.left = 'calc(50% - 150px)';
      img.style.bottom = '-100px';
      img.style.zIndex = 999999;


	  textnode.style.pointerEvents = "none";
	  textnode.style.align = "center";
      textnode.style.width = '300px';
      textnode.style.height = '300px';
      textnode.style.transition = '1s all';
      textnode.style.position = 'fixed';
      textnode.style.left = 'calc(50% - 150px)';
      textnode.style.bottom = '-100px';
      textnode.style.zIndex = 999999;
	  document.body.appendChild(textnode);
      document.body.appendChild(img);

      window.setTimeout(function(){
        img.style.bottom = '-50px';
		textnode.style.bottom = '-50px';
      },30);

      window.setTimeout(function(){
        img.style.bottom = '-300px';
		textnode.style.bottom = '-300px';
      }, 4300);
      window.setTimeout(function(){
        img.parentNode.removeChild(img);
		textnode.parentNode.removeChild(textnode);
      }, 5400);
}

var  penguin=function(data,txt) {

    var shock = document.createElement('div');
	var textnode = document.createElement('div');
	var temp=document.createTextNode(txt); //创建一个文本节点内容
	textnode.appendChild(temp)
    var img = new Image();
    img.src = data;
    img.style.pointerEvents = "none";
    img.style.width = '374px';
    img.style.height = '375px';
    img.style.transition = '13s all';
    img.style.position = 'fixed';
    img.style.right = '-374px';
    // img.style.bottom = 'calc(-50% + 280px)';
    img.style.bottom = '0px';
    img.style.zIndex = 999999;

    textnode.style.pointerEvents = "none";
    textnode.style.width = '374px';
    textnode.style.height = '375px';
    textnode.style.transition = '13s all';
    textnode.style.position = 'fixed';
    textnode.style.right = '-374px';
    // img.style.bottom = 'calc(-50% + 280px)';
    textnode.style.bottom = '0px';
    textnode.style.zIndex = 999999;

	document.body.appendChild(textnode);
    document.body.appendChild(img);

    window.setTimeout(function(){
      img.style.right = 'calc(100% + 500px)';
	  textnode.style.right = 'calc(100% + 500px)';
    }, 50);

    // window.setTimeout(function(){
    //   img.style.right = 'calc(100% + 375px)';
    // }, 4500);

    window.setTimeout(function(){
      img.parentNode.removeChild(img);
	  textnode.parentNode.removeChild(textnode);
    }, 10300);

  };


var lol = function(data,txt) {

    var shock = document.createElement('div');
	var textnode = document.createElement('div');
	var temp=document.createTextNode(txt); //创建一个文本节点内容
	textnode.appendChild(temp)
    var img = new Image;
    img.src = data;
    img.style.pointerEvents = "none";
    img.style.width = '240px';
    img.style.height = '200px';
    img.style.transition = '1s all';
    img.style.position = 'fixed';
    img.style.left = 'calc(50% - 125px)';
    img.style.bottom = '-250px';
    img.style.zIndex = 999999;

	textnode.style.pointerEvents = "none";
    textnode.style.width = '240px';
    textnode.style.height = '200px';
    textnode.style.transition = '1s all';
    textnode.style.position = 'fixed';
    textnode.style.left = 'calc(50% - 125px)';
    textnode.style.bottom = '-250px';
    textnode.style.zIndex = 999999;

	document.body.appendChild(textnode);
    document.body.appendChild(img);

    window.setTimeout(function(){
      img.style.bottom = '-10px';
	  textnode.style.bottom = '-10px';
    },50);

    window.setTimeout(function(){
      img.style.bottom = '-250px';
	  textnode.style.bottom = '-250px';
    }, 3300);

    window.setTimeout(function(){
      img.parentNode.removeChild(img);
      textnode.parentNode.removeChild(textnode);
    }, 5400);

 };

var fly = function(data,txt) {

    var shock = document.createElement('div');
	var textnode = document.createElement('div');
	var temp=document.createTextNode(txt); //创建一个文本节点内容
	textnode.appendChild(temp)
    var img = new Image();
    img.src = data;
    img.style.pointerEvents = "none";
    img.style.width = '500px';
    img.style.height = '375px';
    img.style.transition = '6s all';
    img.style.position = 'fixed';
    img.style.right = '-374px';
    img.style.bottom = '0px';
    img.style.zIndex = 999999;

	textnode.style.pointerEvents = "none";
    textnode.style.width = '500px';
    textnode.style.height = '375px';
    textnode.style.transition = '6s all';
    textnode.style.position = 'fixed';
    textnode.style.right = '-374px';
    textnode.style.bottom = '0px';
    textnode.style.zIndex = 999999;

	document.body.appendChild(textnode);
    document.body.appendChild(img);

    window.setTimeout(function(){
      img.style.right = 'calc(50% - 187px)';
	  textnode.style.right = 'calc(50% - 187px)';
    },50);

    window.setTimeout(function(){
      img.style.right = 'calc(100% + 375px)';
	  textnode.style.right = 'calc(100% + 375px)';
    }, 4300);
    window.setTimeout(function(){
      img.parentNode.removeChild(img);
	  textnode.parentNode.removeChild(textnode);
    }, 7300);

  };

var word = ["超人和你永相随","你爱超人吗","超人要去云南","超人爱你","超人电灯"]
var func = [hi,penguin,lol,fly]
var funcimg = ["https://hunterhug.github.io/blog/static/hi.gif","https://hunterhug.github.io/blog/static/penguin.gif","https://hunterhug.github.io/blog/static/lol.gif","https://hunterhug.github.io/blog/static/fly.gif"]
//var func = [hi,lol]
//var funcimg = ["./hi.gif","./penguin.gif"]
var l = word.length - 1
var fl = func.length - 1

function happy(){
	var i = parseInt(Math.round(Math.random()*l),10)
	var fi = parseInt(Math.round(Math.random()*fl),10)
	var w =word[i]
	var data = funcimg[fi]
	console.log(i,w,data)
	func[fi](data,w);
}


happy();
var t=6;
var num = Math.round(Math.random()*2+t);
window.setInterval(happy, 1000*num);
