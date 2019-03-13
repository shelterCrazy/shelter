const Message=require("../Message.js");var EmmitAreaTool={width:100,height:100,draw:null,_svg:{},init(t,e,i){return this.draw=t,this.width=e,this.height=i,this.createSizeBox(e,i)},createRectLine(t,e,i){let o=this.draw,s="#8c8c8c",n="#eeeeee",h=o.group(),r=o.line(t.x,t.y,e.x,e.y).stroke({width:1,color:s}),d=o.line(t.x,t.y,e.x,e.y).stroke({width:8,color:s,opacity:0}).attr({fill:s});function u(t){r.stroke({color:s}),document.removeEventListener("mouseup",u),document.removeEventListener("mousemove",c)}function c(t){i&&i(t)}return h.add(r),h.add(d),h.stroke({color:s}),t.x===e.x?h.style("cursor","col-resize"):h.style("cursor","row-resize"),h.on("mouseover",function(){r.stroke({color:"#bcbcbc"})}),h.on("mouseout",function(){r.stroke({color:s})}),h.on("mousedown",function(t){r.stroke({color:n}),document.addEventListener("mousemove",c),document.addEventListener("mouseup",u)}),h.updateLine=function(t,e){r.plot(t.x,t.y,e.x,e.y),d.plot(t.x,t.y,e.x,e.y)},h},createRectPoint(t,e,i){let o="#0e6dde",s="#9bcbff",n=this.draw.circle(8).move(t.x-4,t.y-4).fill(o);function h(t){n.stroke({color:o}).fill(o),document.removeEventListener("mouseup",h),document.removeEventListener("mousemove",r)}function r(t){i&&i(t)}return n.style("cursor",e.cursor),n.style("pointer-events",e.pointerEvents),n.on("mouseover",function(){n.stroke({color:"#649bff"}).fill("#649bff")}),n.on("mouseout",function(){n.stroke({color:o}).fill(o)}),n.on("mousedown",function(t){n.stroke({color:s}).fill(s),document.addEventListener("mousemove",r),document.addEventListener("mouseup",h)}),n.updatePos=function(t){n.move(t.x-4,t.y-4)},n},createSizeBox(t,e){let i=t/2,o=e/2,s=this.draw.group(),n={x:-i,y:o},h={x:i,y:o},r={x:-i,y:-o},d={x:i,y:-o},u=this.createRectLine(n,h,function(t){let e=t.movementY;0!==e&&(this.height+=2*e,this.updateSizeBox(this.width,this.height))}.bind(this)),c=this.createRectLine(n,r,function(t){let e=t.movementX;0!==e&&(this.width-=2*e,this.updateSizeBox(this.width,this.height))}.bind(this)),m=this.createRectLine(h,d,function(t){let e=t.movementX;0!==e&&(this.width+=2*e,this.updateSizeBox(this.width,this.height))}.bind(this)),a=this.createRectLine(r,d,function(t){let e=t.movementY;0!==e&&(this.height-=2*e,this.updateSizeBox(this.width,this.height))}.bind(this));s.add(u),s.add(c),s.add(m),s.add(a);let l=this.createRectPoint(n,{cursor:"nesw-resize",pointerEvents:"bounding-box"},function(t){let e=t.movementX,i=t.movementY;0===e&&0===i||(this.width-=2*e,this.height+=2*i,this.updateSizeBox(this.width,this.height))}.bind(this)),g=this.createRectPoint(h,{cursor:"nwse-resize",pointerEvents:"bounding-box"},function(t){let e=t.movementX,i=t.movementY;0===e&&0===i||(this.width+=2*e,this.height+=2*i,this.updateSizeBox(this.width,this.height))}.bind(this)),v=this.createRectPoint(r,{cursor:"nwse-resize",pointerEvents:"bounding-box"},function(t){let e=t.movementX,i=t.movementY;0===e&&0===i||(this.width-=2*e,this.height-=2*i,this.updateSizeBox(this.width,this.height))}.bind(this)),p=this.createRectPoint(d,{cursor:"nesw-resize",pointerEvents:"bounding-box"},function(t){let e=t.movementX,i=t.movementY;0===e&&0===i||(this.width+=2*e,this.height-=2*i,this.updateSizeBox(this.width,this.height))}.bind(this));return s.add(l),s.add(g),s.add(v),s.add(p),this._svg.bottomLeft=l,this._svg.bottomRight=g,this._svg.topLeft=v,this._svg.topRight=p,this._svg.lineBottom=u,this._svg.lineLeft=c,this._svg.lineRight=m,this._svg.lineTop=a,window.plugin.$on(Message.MessagePipe,this._onMsg),s},updateSizeBox(t,e){let i=(t=t||0)/2,o=(e=e||0)/2,s={x:-i,y:o},n={x:i,y:o},h={x:-i,y:-o},r={x:i,y:-o};this._svg.lineBottom.updateLine(s,n),this._svg.lineLeft.updateLine(s,h),this._svg.lineRight.updateLine(n,r),this._svg.lineTop.updateLine(h,r),this._svg.bottomLeft.updatePos(s),this._svg.bottomRight.updatePos(n),this._svg.topLeft.updatePos(h),this._svg.topRight.updatePos(r),window.particle&&window.particle.svgEmmitAreaSize(t/2,e/2)},_onMsg(t){if(t.msg===Message.MessageUpdateEmmitAreaSize){let e=t.data.w,i=t.data.h;EmmitAreaTool.width=e,EmmitAreaTool.height=i,EmmitAreaTool.updateSizeBox(e,i)}}};module.exports=EmmitAreaTool;