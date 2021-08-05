(this.webpackJsonphexjs=this.webpackJsonphexjs||[]).push([[0],{18:function(t,e,i){"use strict";i.r(e);var s=i(2),n=i.n(s),a=i(10),r=i.n(a),h=i(1),c=i(6),o=i(7),u=i(12),l=i(11),f=i(9),v=function(){function t(){Object(c.a)(this,t),this.WIDTH=11,this.HEIGHT=11,this.currentPlayer=1,this.gameOver=!1,this.winner=0,this.board=new Array(this.HEIGHT),this.searched=new Array(this.HEIGHT),this.searchedQueue=[];for(var e=0;e<this.HEIGHT;e++)this.board[e]=new Array(this.WIDTH).fill(0),this.searched[e]=new Array(this.WIDTH).fill(!1)}return Object(o.a)(t,[{key:"move",value:function(t,e){if(0!==this.board[t][e]||this.gameOver||!this.inBound(t,e))return!1;this.board[t][e]=this.currentPlayer,this.findWin(t,e)&&(this.winner=this.currentPlayer,this.gameOver=!0),this.currentPlayer*=-1}},{key:"findConnection",value:function(t,e,i){var s,n=this.dfs(t,e,i),a=Object(f.a)(this.searchedQueue);try{for(a.s();!(s=a.n()).done;){var r=s.value;this.searched[r[0]][r[1]]=!1}}catch(h){a.e(h)}finally{a.f()}return this.searchedQueue=[],n}},{key:"dfs",value:function(t,e,i){if(!this.inBound(t,e)||this.board[t][e]!==this.currentPlayer)return!1;if(i(t,e))return!0;var s=!1,n=this.neighbors(t,e);this.searched[t][e]=!0,this.searchedQueue.push([t,e]);var a,r=Object(f.a)(n);try{for(r.s();!(a=r.n()).done;){var c=a.value;if(this.inBound.apply(this,Object(h.a)(c))&&!this.searched[c[0]][c[1]]&&this.dfs.apply(this,Object(h.a)(c).concat([i]))){s=!0;break}}}catch(o){r.e(o)}finally{r.f()}return s}},{key:"inBound",value:function(t,e){return t>=0&&e>=0&&t<this.HEIGHT&&e<this.WIDTH}},{key:"neighbors",value:function(t,e){return[[t-1,e],[t-1,e+1],[t,e+1],[t+1,e],[t+1,e-1],[t,e-1]]}},{key:"connectTop",value:function(t,e){return t<=0}},{key:"connectBottom",value:function(t,e){return t>=this.HEIGHT-1}},{key:"connectLeft",value:function(t,e){return e<=0}},{key:"connectRight",value:function(t,e){return e>=this.WIDTH-1}},{key:"findWin",value:function(t,e){var i,s,n=this;this.currentPlayer>0?(i=function(t,e){return n.connectTop(t,e)},s=function(t,e){return n.connectBottom(t,e)}):(i=function(t,e){return n.connectLeft(t,e)},s=function(t,e){return n.connectRight(t,e)});var a=this.findConnection(t,e,i),r=this.findConnection(t,e,s);return console.log(a,r),a&&r}}]),t}(),d=i(3),x=i.n(d),y=i(0),b=function(t){Object(u.a)(i,t);var e=Object(l.a)(i);function i(t){var s;return Object(c.a)(this,i),(s=e.call(this,t)).canvasRef=n.a.createRef(),s.statusRef=n.a.createRef(),s.statusRef2=n.a.createRef(),s}return Object(o.a)(i,[{key:"componentDidMount",value:function(){var t=this;this.canvas=this.canvasRef.current,this.ctx=this.canvas.getContext("2d"),this.hex=new v,this.WHITE=[255,255,255],this.BLACK=[0,0,0],this.RED=[255,0,0],this.BLUE=[0,0,255],this.hexagons=new Array(this.hex.HEIGHT),this.cellSize=80;for(var e=0;e<this.hex.HEIGHT;e++){this.hexagons[e]=new Array(this.hex.WIDTH);for(var i=0;i<this.hex.WIDTH;i++){this.hexagons[e][i]=[];for(var s=this.getCenter(e,i),n=0;n<6;n++){var a=n*Math.PI/3+Math.PI/2;this.hexagons[e][i].push([s[0]+this.cellSize*Math.cos(a),s[1]-this.cellSize*Math.sin(a)])}}}setInterval((function(){t.update(),t.draw()}),1e3/30);var r=this;this.canvas.addEventListener("click",(function(t){var e=r.canvas.getBoundingClientRect(),i=2*(t.clientX-e.left),s=2*(t.clientY-e.top);r.mousePressed(i,s)}))}},{key:"getCenter",value:function(t,e){var i=Math.sin(Math.PI/3);return[1.5*this.cellSize+t*this.cellSize*i+2*e*this.cellSize*i,1.5*this.cellSize+t*this.cellSize*3/2]}},{key:"drawCell",value:function(t,e){this.ctx.strokeStyle="black",this.ctx.lineWidth=2;var i=this.hexagons[t][e];this.ctx.beginPath();for(var s=0;s<6;s++){var n,a;(n=this.ctx).moveTo.apply(n,Object(h.a)(i[s])),(a=this.ctx).lineTo.apply(a,Object(h.a)(i[(s+1)%6]))}this.ctx.stroke(),this.ctx.lineWidth=5;for(var r=0;r<6;r++){var c,o,u,l,f=[[i[r][0],i[r][1]],[i[(r+1)%6][0],i[(r+1)%6][1]]],v=0===t&&(0===r||5===r),d=t===this.hex.HEIGHT-1&&(2===r||3===r),x=0===e&&(1===r||2===r),y=e===this.hex.WIDTH-1&&(4===r||5===r);if(v||d)this.ctx.strokeStyle="red",this.ctx.beginPath(),(c=this.ctx).moveTo.apply(c,Object(h.a)(f[0])),(o=this.ctx).lineTo.apply(o,Object(h.a)(f[1])),this.ctx.stroke();if(x||y)this.ctx.strokeStyle="blue",this.ctx.beginPath(),(u=this.ctx).moveTo.apply(u,Object(h.a)(f[0])),(l=this.ctx).lineTo.apply(l,Object(h.a)(f[1])),this.ctx.stroke()}}},{key:"draw",value:function(){this.ctx.fillStyle="white",this.ctx.rect(0,0,this.canvas.width,this.canvas.height);for(var t=0;t<this.hex.HEIGHT;t++)for(var e=0;e<this.hex.WIDTH;e++){this.ctx.fillStyle="white",this.drawCell(t,e);var i,s=this.getCenter(t,e),n=void 0;switch(this.hex.board[t][e]){case 1:n="red";break;case-1:n="blue"}if(n)this.ctx.strokeStyle="black",this.ctx.lineWidth=5,this.ctx.beginPath(),(i=this.ctx).arc.apply(i,Object(h.a)(s).concat([this.cellSize/2,0,2*Math.PI])),this.ctx.stroke(),this.ctx.fillStyle=n,this.ctx.fill()}}},{key:"update",value:function(){var t=this.statusRef.current,e=this.statusRef2.current;this.hex.gameOver?(t.textContent="".concat(this.hex.winner>0?"Red":"Blue"),e.textContent=" Wins"):(t.textContent="".concat(this.hex.currentPlayer>0?"Red":"Blue"),e.textContent="'s Turn",this.hex.currentPlayer>0?(t.classList.remove(x.a.blue),t.classList.add(x.a.red)):(t.classList.remove(x.a.red),t.classList.add(x.a.blue)))}},{key:"getCell",value:function(t,e){for(var i=0;i<this.hex.HEIGHT;i++)for(var s=0;s<this.hex.WIDTH;s++){var n=this.getCenter(i,s);if(Math.pow(t-n[0],2)+Math.pow(e-n[1],2)<=Math.pow(this.cellSize,2))return[i,s]}}},{key:"mousePressed",value:function(t,e){var i,s=this.getCell(t,e);void 0!==s&&(i=this.hex).move.apply(i,Object(h.a)(s))}},{key:"render",value:function(){return Object(y.jsxs)("div",{children:[Object(y.jsx)("span",{ref:this.statusRef,className:x.a.status}),Object(y.jsx)("span",{ref:this.statusRef2,className:x.a.status}),Object(y.jsx)("br",{}),Object(y.jsx)("canvas",{ref:this.canvasRef,width:"2400",height:"1600",style:{width:"1200px",height:"800px"}})]})}}]),i}(s.Component);var p=function(){return Object(y.jsx)(b,{})};r.a.render(Object(y.jsx)(n.a.StrictMode,{children:Object(y.jsx)(p,{})}),document.getElementById("root"))},3:function(t,e,i){t.exports={status:"game_status__2JA7C",red:"game_red__AsdVU",blue:"game_blue__2EDZp"}}},[[18,1,2]]]);
//# sourceMappingURL=main.e9f57ef5.chunk.js.map