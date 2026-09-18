/* 自动生成，请勿手工编辑。
   源：src/app/3d/  构建：node scripts/build-3d-bundle.cjs
   数据：src/app/3d/gamedata.json（由 scripts/extract-3d-data.mjs 从游戏本体生成）
   改动请改源文件后重新构建，直接编辑本文件会在下次构建时被覆盖。 */
"use strict";var Scene3D=(()=>{var No=Object.defineProperty;var ud=Object.getOwnPropertyDescriptor;var dd=Object.getOwnPropertyNames;var fd=Object.prototype.hasOwnProperty;var pd=(i,e)=>{for(var t in e)No(i,t,{get:e[t],enumerable:!0})},md=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of dd(e))!fd.call(i,s)&&s!==t&&No(i,s,{get:()=>e[s],enumerable:!(n=ud(e,s))||n.enumerable});return i};var gd=i=>md(No({},"__esModule",{value:!0}),i);var b_={};pd(b_,{LAYOUT_KIND:()=>Cc,SPECS:()=>To,buildLocation:()=>Ao,create3DShell:()=>nd,createGame3D:()=>Po,createHUD:()=>Io,gamedata:()=>id,palette:()=>kn});var hh=0,pl=1,uh=2;var qs=1,Ma=2,as=3,di=0,Zt=1,It=2,Fn=0,os=1,ml=2,gl=3,_l=4,dh=5;var wi=100,fh=101,ph=102,mh=103,gh=104,_h=200,yh=201,xh=202,vh=203,yl=204,xl=205,Mh=206,bh=207,Sh=208,Eh=209,wh=210,Th=211,Ah=212,Rh=213,Ch=214,Nr=0,Ur=1,Fr=2,Zi=3,Br=4,Or=5,kr=6,Hr=7,vl=0,Ph=1,Ih=2,Sn=0,Ml=1,bl=2,Sl=3,Ys=4,El=5,wl=6,Tl=7;var Al=300,fi=301,Ti=302,ba=303,Sa=304,Zs=306,Ki=1e3,qt=1001,zr=1002,Ft=1003,Lh=1004;var Ks=1005;var Bt=1006,Ea=1007;var pi=1008;var Qt=1009,Rl=1010,Cl=1011,ls=1012,wa=1013,En=1014,wn=1015,Tn=1016,Ta=1017,Aa=1018,cs=1020,Pl=35902,Il=35899,Ll=1021,Dl=1022,dn=1023,Dn=1026,mi=1027,Nl=1028,Ra=1029,gi=1030,Ca=1031;var Pa=1033,$s=33776,Js=33777,js=33778,Qs=33779,Ia=35840,La=35841,Da=35842,Na=35843,Ua=36196,Fa=37492,Ba=37496,Oa=37488,ka=37489,er=37490,Ha=37491,za=37808,Ga=37809,Va=37810,Wa=37811,Xa=37812,qa=37813,Ya=37814,Za=37815,Ka=37816,$a=37817,Ja=37818,ja=37819,Qa=37820,eo=37821,to=36492,no=36494,io=36495,so=36283,ro=36284,tr=36285,ao=36286;var Ts=2300,Gr=2301,Lr=2302,ol=2303,ll=2400,cl=2401,hl=2402;var Dh=3200;var oo=0,Nh=1,Zn="",Lt="srgb",As="srgb-linear",Rs="linear",dt="srgb";var Dr=7680;var Uh=519,Fh=512,Bh=513,Oh=514,lo=515,kh=516,Hh=517,co=518,zh=519,Gh=35044;var Ul="300 es",vn=2e3,$i=2001;function _d(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function yd(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Cs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Vh(){let i=Cs("canvas");return i.style.display="block",i}var Hc={},Ji=null;function Fl(...i){let e="THREE."+i.shift();Ji?Ji("log",e,...i):console.log(e,...i)}function Wh(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Be(...i){i=Wh(i);let e="THREE."+i.shift();if(Ji)Ji("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Oe(...i){i=Wh(i);let e="THREE."+i.shift();if(Ji)Ji("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function bi(...i){let e=i.join(" ");e in Hc||(Hc[e]=!0,Be(...i))}function Xh(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var qh={[Nr]:Ur,[Fr]:kr,[Br]:Hr,[Zi]:Or,[Ur]:Nr,[kr]:Fr,[Hr]:Br,[Or]:Zi},Nn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Uo=Math.PI/180,Vr=180/Math.PI;function nr(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ht[i&255]+Ht[i>>8&255]+Ht[i>>16&255]+Ht[i>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]).toLowerCase()}function Qe(i,e,t){return Math.max(e,Math.min(t,i))}function xd(i,e){return(i%e+e)%e}function Fo(i,e,t){return(1-t)*i+t*e}function xs(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function $t(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Gl=class Gl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Gl.prototype.isVector2=!0;var Ne=Gl,Un=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],f=r[a+1],p=r[a+2],x=r[a+3];if(d!==x||l!==u||c!==f||h!==p){let g=l*u+c*f+h*p+d*x;g<0&&(u=-u,f=-f,p=-p,x=-x,g=-g);let m=1-o;if(g<.9995){let S=Math.acos(g),T=Math.sin(S);m=Math.sin(m*S)/T,o=Math.sin(o*S)/T,l=l*m+u*o,c=c*m+f*o,h=h*m+p*o,d=d*m+x*o}else{l=l*m+u*o,c=c*m+f*o,h=h*m+p*o,d=d*m+x*o;let S=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=S,c*=S,h*=S,d*=S}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],p=r[a+3];return e[t]=o*p+h*d+l*f-c*u,e[t+1]=l*p+h*u+c*d-o*f,e[t+2]=c*p+h*f+o*u-l*d,e[t+3]=h*p-o*d-l*u-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),f=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:Be("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>d){let f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){let f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Vl=class Vl{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(zc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(zc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Bo.copy(this).projectOnVector(e),this.sub(Bo)}reflect(e){return this.sub(Bo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Vl.prototype.isVector3=!0;var P=Vl,Bo=new P,zc=new Un,Wl=class Wl{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],x=s[0],g=s[3],m=s[6],S=s[1],T=s[4],v=s[7],E=s[2],b=s[5],R=s[8];return r[0]=a*x+o*S+l*E,r[3]=a*g+o*T+l*b,r[6]=a*m+o*v+l*R,r[1]=c*x+h*S+d*E,r[4]=c*g+h*T+d*b,r[7]=c*m+h*v+d*R,r[2]=u*x+f*S+p*E,r[5]=u*g+f*T+p*b,r[8]=u*m+f*v+p*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,p=t*d+n*u+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/p;return e[0]=d*x,e[1]=(s*c-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=u*x,e[4]=(h*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=f*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return bi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Oo.makeScale(e,t)),this}rotate(e){return bi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Oo.makeRotation(-e)),this}translate(e,t){return bi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Oo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Wl.prototype.isMatrix3=!0;var ze=Wl,Oo=new ze,Gc=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Vc=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function vd(){let i={enabled:!0,workingColorSpace:As,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===dt&&(s.r=Xn(s.r),s.g=Xn(s.g),s.b=Xn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===dt&&(s.r=Yi(s.r),s.g=Yi(s.g),s.b=Yi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Zn?Rs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return bi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return bi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[As]:{primaries:e,whitePoint:n,transfer:Rs,toXYZ:Gc,fromXYZ:Vc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Lt},outputColorSpaceConfig:{drawingBufferColorSpace:Lt}},[Lt]:{primaries:e,whitePoint:n,transfer:dt,toXYZ:Gc,fromXYZ:Vc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Lt}}}),i}var nt=vd();function Xn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Yi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ni,Wr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ni===void 0&&(Ni=Cs("canvas")),Ni.width=e.width,Ni.height=e.height;let s=Ni.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ni}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Cs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Xn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Xn(t[n]/255)*255):t[n]=Xn(t[n]);return{data:t,width:e.width,height:e.height}}else return Be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Md=0,ji=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Md++}),this.uuid=nr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ko(s[a].image)):r.push(ko(s[a]))}else r=ko(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function ko(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Wr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Be("Texture: Unable to serialize Texture."),{})}var bd=0,Ho=new P,Yt=class i extends Nn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=qt,s=qt,r=Bt,a=pi,o=dn,l=Qt,c=i.DEFAULT_ANISOTROPY,h=Zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bd++}),this.uuid=nr(),this.name="",this.source=new ji(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ne(0,0),this.repeat=new Ne(1,1),this.center=new Ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ho).x}get height(){return this.source.getSize(Ho).y}get depth(){return this.source.getSize(Ho).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Be(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Al)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ki:e.x=e.x-Math.floor(e.x);break;case qt:e.x=e.x<0?0:1;break;case zr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ki:e.y=e.y-Math.floor(e.y);break;case qt:e.y=e.y<0?0:1;break;case zr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Yt.DEFAULT_IMAGE=null;Yt.DEFAULT_MAPPING=Al;Yt.DEFAULT_ANISOTROPY=1;var Xl=class Xl{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],x=l[2],g=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let T=(c+1)/2,v=(f+1)/2,E=(m+1)/2,b=(h+u)/4,R=(d+x)/4,y=(p+g)/4;return T>v&&T>E?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=b/n,r=R/n):v>E?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=b/s,r=y/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=R/r,s=y/r),this.set(n,s,r,t),this}let S=Math.sqrt((g-p)*(g-p)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(S)<.001&&(S=1),this.x=(g-p)/S,this.y=(d-x)/S,this.z=(u-h)/S,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this.w=Qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this.w=Qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Xl.prototype.isVector4=!0;var wt=Xl,Xr=class extends Nn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new wt(0,0,e,t),this.scissorTest=!1,this.viewport=new wt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new Yt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Bt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ji(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},jt=class extends Xr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ps=class extends Yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var qr=class extends Yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var va=class va{constructor(e,t,n,s,r,a,o,l,c,h,d,u,f,p,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,d,u,f,p,x,g)}set(e,t,n,s,r,a,o,l,c,h,d,u,f,p,x,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=p,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new va().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/Ui.setFromMatrixColumn(e,0).length(),r=1/Ui.setFromMatrixColumn(e,1).length(),a=1/Ui.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let u=a*h,f=a*d,p=o*h,x=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=f+p*c,t[5]=u-x*c,t[9]=-o*l,t[2]=x-u*c,t[6]=p+f*c,t[10]=a*l}else if(e.order==="YXZ"){let u=l*h,f=l*d,p=c*h,x=c*d;t[0]=u+x*o,t[4]=p*o-f,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=f*o-p,t[6]=x+u*o,t[10]=a*l}else if(e.order==="ZXY"){let u=l*h,f=l*d,p=c*h,x=c*d;t[0]=u-x*o,t[4]=-a*d,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*h,t[9]=x-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let u=a*h,f=a*d,p=o*h,x=o*d;t[0]=l*h,t[4]=p*c-f,t[8]=u*c+x,t[1]=l*d,t[5]=x*c+u,t[9]=f*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let u=a*l,f=a*c,p=o*l,x=o*c;t[0]=l*h,t[4]=x-u*d,t[8]=p*d+f,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*d+p,t[10]=u-x*d}else if(e.order==="XZY"){let u=a*l,f=a*c,p=o*l,x=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+x,t[5]=a*h,t[9]=f*d-p,t[2]=p*d-f,t[6]=o*h,t[10]=x*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Sd,e,Ed)}lookAt(e,t,n){let s=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),ei.crossVectors(n,tn),ei.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),ei.crossVectors(n,tn)),ei.normalize(),fr.crossVectors(tn,ei),s[0]=ei.x,s[4]=fr.x,s[8]=tn.x,s[1]=ei.y,s[5]=fr.y,s[9]=tn.y,s[2]=ei.z,s[6]=fr.z,s[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],x=n[6],g=n[10],m=n[14],S=n[3],T=n[7],v=n[11],E=n[15],b=s[0],R=s[4],y=s[8],w=s[12],C=s[1],U=s[5],F=s[9],k=s[13],L=s[2],G=s[6],Y=s[10],X=s[14],ae=s[3],q=s[7],Q=s[11],ne=s[15];return r[0]=a*b+o*C+l*L+c*ae,r[4]=a*R+o*U+l*G+c*q,r[8]=a*y+o*F+l*Y+c*Q,r[12]=a*w+o*k+l*X+c*ne,r[1]=h*b+d*C+u*L+f*ae,r[5]=h*R+d*U+u*G+f*q,r[9]=h*y+d*F+u*Y+f*Q,r[13]=h*w+d*k+u*X+f*ne,r[2]=p*b+x*C+g*L+m*ae,r[6]=p*R+x*U+g*G+m*q,r[10]=p*y+x*F+g*Y+m*Q,r[14]=p*w+x*k+g*X+m*ne,r[3]=S*b+T*C+v*L+E*ae,r[7]=S*R+T*U+v*G+E*q,r[11]=S*y+T*F+v*Y+E*Q,r[15]=S*w+T*k+v*X+E*ne,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],f=e[14],p=e[3],x=e[7],g=e[11],m=e[15],S=l*f-c*u,T=o*f-c*d,v=o*u-l*d,E=a*f-c*h,b=a*u-l*h,R=a*d-o*h;return t*(x*S-g*T+m*v)-n*(p*S-g*E+m*b)+s*(p*T-x*E+m*R)-r*(p*v-x*b+g*R)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],f=e[11],p=e[12],x=e[13],g=e[14],m=e[15],S=t*o-n*a,T=t*l-s*a,v=t*c-r*a,E=n*l-s*o,b=n*c-r*o,R=s*c-r*l,y=h*x-d*p,w=h*g-u*p,C=h*m-f*p,U=d*g-u*x,F=d*m-f*x,k=u*m-f*g,L=S*k-T*F+v*U+E*C-b*w+R*y;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let G=1/L;return e[0]=(o*k-l*F+c*U)*G,e[1]=(s*F-n*k-r*U)*G,e[2]=(x*R-g*b+m*E)*G,e[3]=(u*b-d*R-f*E)*G,e[4]=(l*C-a*k-c*w)*G,e[5]=(t*k-s*C+r*w)*G,e[6]=(g*v-p*R-m*T)*G,e[7]=(h*R-u*v+f*T)*G,e[8]=(a*F-o*C+c*y)*G,e[9]=(n*C-t*F-r*y)*G,e[10]=(p*b-x*v+m*S)*G,e[11]=(d*v-h*b-f*S)*G,e[12]=(o*w-a*U-l*y)*G,e[13]=(t*U-n*w+s*y)*G,e[14]=(x*T-p*E-g*S)*G,e[15]=(h*E-d*T+u*S)*G,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,p=r*d,x=a*h,g=a*d,m=o*d,S=l*c,T=l*h,v=l*d,E=n.x,b=n.y,R=n.z;return s[0]=(1-(x+m))*E,s[1]=(f+v)*E,s[2]=(p-T)*E,s[3]=0,s[4]=(f-v)*b,s[5]=(1-(u+m))*b,s[6]=(g+S)*b,s[7]=0,s[8]=(p+T)*R,s[9]=(g-S)*R,s[10]=(1-(u+x))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Ui.set(s[0],s[1],s[2]).length(),o=Ui.set(s[4],s[5],s[6]).length(),l=Ui.set(s[8],s[9],s[10]).length();r<0&&(a=-a),gn.copy(this);let c=1/a,h=1/o,d=1/l;return gn.elements[0]*=c,gn.elements[1]*=c,gn.elements[2]*=c,gn.elements[4]*=h,gn.elements[5]*=h,gn.elements[6]*=h,gn.elements[8]*=d,gn.elements[9]*=d,gn.elements[10]*=d,t.setFromRotationMatrix(gn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=vn,l=!1){let c=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),f=(n+s)/(n-s),p,x;if(l)p=r/(a-r),x=a*r/(a-r);else if(o===vn)p=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===$i)p=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=vn,l=!1){let c=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),f=-(n+s)/(n-s),p,x;if(l)p=1/(a-r),x=a/(a-r);else if(o===vn)p=-2/(a-r),x=-(a+r)/(a-r);else if(o===$i)p=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};va.prototype.isMatrix4=!0;var Et=va,Ui=new P,gn=new Et,Sd=new P(0,0,0),Ed=new P(1,1,1),ei=new P,fr=new P,tn=new P,Wc=new Et,Xc=new Un,qn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Qe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Wc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Wc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Xc.setFromEuler(this),this.setFromQuaternion(Xc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};qn.DEFAULT_ORDER="XYZ";var Is=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},wd=0,qc=new P,Fi=new Un,Hn=new Et,pr=new P,vs=new P,Td=new P,Ad=new Un,Yc=new P(1,0,0),Zc=new P(0,1,0),Kc=new P(0,0,1),$c={type:"added"},Rd={type:"removed"},Bi={type:"childadded",child:null},zo={type:"childremoved",child:null},Vt=class i extends Nn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wd++}),this.uuid=nr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new qn,n=new Un,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Et},normalMatrix:{value:new ze}}),this.matrix=new Et,this.matrixWorld=new Et,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Is,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Fi.setFromAxisAngle(e,t),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(e,t){return Fi.setFromAxisAngle(e,t),this.quaternion.premultiply(Fi),this}rotateX(e){return this.rotateOnAxis(Yc,e)}rotateY(e){return this.rotateOnAxis(Zc,e)}rotateZ(e){return this.rotateOnAxis(Kc,e)}translateOnAxis(e,t){return qc.copy(e).applyQuaternion(this.quaternion),this.position.add(qc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Yc,e)}translateY(e){return this.translateOnAxis(Zc,e)}translateZ(e){return this.translateOnAxis(Kc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?pr.copy(e):pr.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),vs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(vs,pr,this.up):Hn.lookAt(pr,vs,this.up),this.quaternion.setFromRotationMatrix(Hn),s&&(Hn.extractRotation(s.matrixWorld),Fi.setFromRotationMatrix(Hn),this.quaternion.premultiply(Fi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Oe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent($c),Bi.child=e,this.dispatchEvent(Bi),Bi.child=null):Oe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Rd),zo.child=e,this.dispatchEvent(zo),zo.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Hn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Hn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent($c),Bi.child=e,this.dispatchEvent(Bi),Bi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,e,Td),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,Ad,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Vt.DEFAULT_UP=new P(0,1,0);Vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var He=class extends Vt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Cd={type:"move"},Qi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new He,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new He,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new He,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),m=this._getHandJoint(c,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new He;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Yh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ti={h:0,s:0,l:0},mr={h:0,s:0,l:0};function Go(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var We=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=nt.workingColorSpace){if(e=xd(e,1),t=Qe(t,0,1),n=Qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Go(a,r,e+1/3),this.g=Go(a,r,e),this.b=Go(a,r,e-1/3)}return nt.colorSpaceToWorking(this,s),this}setStyle(e,t=Lt){function n(r){r!==void 0&&parseFloat(r)<1&&Be("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Be("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Lt){let n=Yh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xn(e.r),this.g=Xn(e.g),this.b=Xn(e.b),this}copyLinearToSRGB(e){return this.r=Yi(e.r),this.g=Yi(e.g),this.b=Yi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Lt){return nt.workingToColorSpace(zt.copy(this),e),Math.round(Qe(zt.r*255,0,255))*65536+Math.round(Qe(zt.g*255,0,255))*256+Math.round(Qe(zt.b*255,0,255))}getHexString(e=Lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.workingToColorSpace(zt.copy(this),t);let n=zt.r,s=zt.g,r=zt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.workingToColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=Lt){nt.workingToColorSpace(zt.copy(this),e);let t=zt.r,n=zt.g,s=zt.b;return e!==Lt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ti),this.setHSL(ti.h+e,ti.s+t,ti.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ti),e.getHSL(mr);let n=Fo(ti.h,mr.h,t),s=Fo(ti.s,mr.s,t),r=Fo(ti.l,mr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},zt=new We;We.NAMES=Yh;var Ls=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new We(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Ds=class extends Vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new qn,this.environmentIntensity=1,this.environmentRotation=new qn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},_n=new P,zn=new P,Vo=new P,Gn=new P,Oi=new P,ki=new P,Jc=new P,Wo=new P,Xo=new P,qo=new P,Yo=new wt,Zo=new wt,Ko=new wt,ri=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),_n.subVectors(e,t),s.cross(_n);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){_n.subVectors(s,t),zn.subVectors(n,t),Vo.subVectors(e,t);let a=_n.dot(_n),o=_n.dot(zn),l=_n.dot(Vo),c=zn.dot(zn),h=zn.dot(Vo),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-o*h)*u,p=(a*h-o*l)*u;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Gn)===null?!1:Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Gn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Gn.x),l.addScaledVector(a,Gn.y),l.addScaledVector(o,Gn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Yo.setScalar(0),Zo.setScalar(0),Ko.setScalar(0),Yo.fromBufferAttribute(e,t),Zo.fromBufferAttribute(e,n),Ko.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Yo,r.x),a.addScaledVector(Zo,r.y),a.addScaledVector(Ko,r.z),a}static isFrontFacing(e,t,n,s){return _n.subVectors(n,t),zn.subVectors(e,t),_n.cross(zn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return _n.subVectors(this.c,this.b),zn.subVectors(this.a,this.b),_n.cross(zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Oi.subVectors(s,n),ki.subVectors(r,n),Wo.subVectors(e,n);let l=Oi.dot(Wo),c=ki.dot(Wo);if(l<=0&&c<=0)return t.copy(n);Xo.subVectors(e,s);let h=Oi.dot(Xo),d=ki.dot(Xo);if(h>=0&&d<=h)return t.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Oi,a);qo.subVectors(e,r);let f=Oi.dot(qo),p=ki.dot(qo);if(p>=0&&f<=p)return t.copy(r);let x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(ki,o);let g=h*p-f*d;if(g<=0&&d-h>=0&&f-p>=0)return Jc.subVectors(r,s),o=(d-h)/(d-h+(f-p)),t.copy(s).addScaledVector(Jc,o);let m=1/(g+x+u);return a=x*m,o=u*m,t.copy(n).addScaledVector(Oi,a).addScaledVector(ki,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ai=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(yn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(yn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=yn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,yn):yn.fromBufferAttribute(r,a),yn.applyMatrix4(e.matrixWorld),this.expandByPoint(yn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),gr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),gr.copy(n.boundingBox)),gr.applyMatrix4(e.matrixWorld),this.union(gr)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,yn),yn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ms),_r.subVectors(this.max,Ms),Hi.subVectors(e.a,Ms),zi.subVectors(e.b,Ms),Gi.subVectors(e.c,Ms),ni.subVectors(zi,Hi),ii.subVectors(Gi,zi),yi.subVectors(Hi,Gi);let t=[0,-ni.z,ni.y,0,-ii.z,ii.y,0,-yi.z,yi.y,ni.z,0,-ni.x,ii.z,0,-ii.x,yi.z,0,-yi.x,-ni.y,ni.x,0,-ii.y,ii.x,0,-yi.y,yi.x,0];return!$o(t,Hi,zi,Gi,_r)||(t=[1,0,0,0,1,0,0,0,1],!$o(t,Hi,zi,Gi,_r))?!1:(yr.crossVectors(ni,ii),t=[yr.x,yr.y,yr.z],$o(t,Hi,zi,Gi,_r))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,yn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(yn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Vn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Vn=[new P,new P,new P,new P,new P,new P,new P,new P],yn=new P,gr=new ai,Hi=new P,zi=new P,Gi=new P,ni=new P,ii=new P,yi=new P,Ms=new P,_r=new P,yr=new P,xi=new P;function $o(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){xi.fromArray(i,r);let o=s.x*Math.abs(xi.x)+s.y*Math.abs(xi.y)+s.z*Math.abs(xi.z),l=e.dot(xi),c=t.dot(xi),h=n.dot(xi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Pt=new P,xr=new Ne,Pd=0,Jt=class extends Nn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Gh,this.updateRanges=[],this.gpuType=wn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)xr.fromBufferAttribute(this,t),xr.applyMatrix3(e),this.setXY(t,xr.x,xr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=xs(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=$t(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=xs(t,this.array)),t}setX(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=xs(t,this.array)),t}setY(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=xs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=xs(t,this.array)),t}setW(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array),s=$t(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array),s=$t(s,this.array),r=$t(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Ns=class extends Jt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Us=class extends Jt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var gt=class extends Jt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Id=new ai,bs=new P,Jo=new P,es=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Id.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;bs.subVectors(e,this.center);let t=bs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(bs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Jo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(bs.copy(e.center).add(Jo)),this.expandByPoint(bs.copy(e.center).sub(Jo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Ld=0,hn=new Et,jo=new Vt,Vi=new P,nn=new ai,Ss=new ai,Ut=new P,Ot=class i extends Nn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ld++}),this.uuid=nr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(_d(e)?Us:Ns)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ze().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return hn.makeRotationFromQuaternion(e),this.applyMatrix4(hn),this}rotateX(e){return hn.makeRotationX(e),this.applyMatrix4(hn),this}rotateY(e){return hn.makeRotationY(e),this.applyMatrix4(hn),this}rotateZ(e){return hn.makeRotationZ(e),this.applyMatrix4(hn),this}translate(e,t,n){return hn.makeTranslation(e,t,n),this.applyMatrix4(hn),this}scale(e,t,n){return hn.makeScale(e,t,n),this.applyMatrix4(hn),this}lookAt(e){return jo.lookAt(e),jo.updateMatrix(),this.applyMatrix4(jo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vi).negate(),this.translate(Vi.x,Vi.y,Vi.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new gt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ai);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Oe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Oe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new es);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Oe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ss.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(nn.min,Ss.min),nn.expandByPoint(Ut),Ut.addVectors(nn.max,Ss.max),nn.expandByPoint(Ut)):(nn.expandByPoint(Ss.min),nn.expandByPoint(Ss.max))}nn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Ut.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Ut));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ut.fromBufferAttribute(o,c),l&&(Vi.fromBufferAttribute(e,c),Ut.add(Vi)),s=Math.max(s,n.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Oe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Oe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Jt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let y=0;y<n.count;y++)o[y]=new P,l[y]=new P;let c=new P,h=new P,d=new P,u=new Ne,f=new Ne,p=new Ne,x=new P,g=new P;function m(y,w,C){c.fromBufferAttribute(n,y),h.fromBufferAttribute(n,w),d.fromBufferAttribute(n,C),u.fromBufferAttribute(r,y),f.fromBufferAttribute(r,w),p.fromBufferAttribute(r,C),h.sub(c),d.sub(c),f.sub(u),p.sub(u);let U=1/(f.x*p.y-p.x*f.y);isFinite(U)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(U),g.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(U),o[y].add(x),o[w].add(x),o[C].add(x),l[y].add(g),l[w].add(g),l[C].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let y=0,w=S.length;y<w;++y){let C=S[y],U=C.start,F=C.count;for(let k=U,L=U+F;k<L;k+=3)m(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let T=new P,v=new P,E=new P,b=new P;function R(y){E.fromBufferAttribute(s,y),b.copy(E);let w=o[y];T.copy(w),T.sub(E.multiplyScalar(E.dot(w))).normalize(),v.crossVectors(b,w);let U=v.dot(l[y])<0?-1:1;a.setXYZW(y,T.x,T.y,T.z,U)}for(let y=0,w=S.length;y<w;++y){let C=S[y],U=C.start,F=C.count;for(let k=U,L=U+F;k<L;k+=3)R(e.getX(k+0)),R(e.getX(k+1)),R(e.getX(k+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Jt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,h=new P,d=new P;if(e)for(let u=0,f=e.count;u<f;u+=3){let p=e.getX(u+0),x=e.getX(u+1),g=e.getX(u+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),f=0,p=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let m=0;m<h;m++)u[p++]=c[f++]}return new Jt(u,h,d)}if(this.index===null)return Be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=e(u,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Qo=new P,Dd=new P,Nd=new ze,xn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Qo.subVectors(n,t).cross(Dd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Qo),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Nd.getNormalMatrix(e),s=this.coplanarPoint(Qo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Ud=0,oi=class extends Nn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ud++}),this.uuid=nr(),this.name="",this.type="Material",this.blending=os,this.side=di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yl,this.blendDst=xl,this.blendEquation=wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=Zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Uh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Dr,this.stencilZFail=Dr,this.stencilZPass=Dr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Be(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new We().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new xn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ne().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ne().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Wn=new P,el=new P,vr=new P,Mr=new P,Yr=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Wn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Wn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Wn.copy(this.origin).addScaledVector(this.direction,t),Wn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){el.copy(e).add(t).multiplyScalar(.5),vr.copy(t).sub(e).normalize(),Mr.copy(this.origin).sub(el);let r=e.distanceTo(t)*.5,a=-this.direction.dot(vr),o=Mr.dot(this.direction),l=-Mr.dot(vr),c=Mr.lengthSq(),h=Math.abs(1-a*a),d,u,f,p;if(h>0)if(d=a*l-o,u=a*o-l,p=r*h,d>=0)if(u>=-p)if(u<=p){let x=1/h;d*=x,u*=x,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(el).addScaledVector(vr,u),f}intersectSphere(e,t){if(e.radius<0)return null;Wn.subVectors(e.center,this.origin);let n=Wn.dot(this.direction),s=Wn.dot(Wn)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Wn)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=e.x-a.x,u=e.y-a.y,f=e.z-a.z,p=t.x-a.x,x=t.y-a.y,g=t.z-a.z,m=n.x-a.x,S=n.y-a.y,T=n.z-a.z,v=Math.abs(l),E=Math.abs(c),b=Math.abs(h),R,y,w,C,U,F,k,L,G,Y,X,ae;if(v>=E&&v>=b?(w=l,F=d,G=p,ae=m,l>=0?(R=c,y=h,C=u,U=f,k=x,L=g,Y=S,X=T):(R=h,y=c,C=f,U=u,k=g,L=x,Y=T,X=S)):E>=b?(w=c,F=u,G=x,ae=S,c>=0?(R=h,y=l,C=f,U=d,k=g,L=p,Y=T,X=m):(R=l,y=h,C=d,U=f,k=p,L=g,Y=m,X=T)):(w=h,F=f,G=g,ae=T,h>=0?(R=l,y=c,C=d,U=u,k=p,L=x,Y=m,X=S):(R=c,y=l,C=u,U=d,k=x,L=p,Y=S,X=m)),w===0)return null;let q=R/w,Q=y/w,ne=1/w,Pe=C-q*F,Ie=U-Q*F,ft=k-q*G,et=L-Q*G,rt=Y-q*ae,K=X-Q*ae,ee=rt*et-K*ft,be=Pe*K-Ie*rt,ke=ft*Ie-et*Pe;if(s){if(ee<0||be<0||ke<0)return null}else if((ee<0||be<0||ke<0)&&(ee>0||be>0||ke>0))return null;let ve=ee+be+ke;if(ve===0)return null;let Ge=ne*(ee*F+be*G+ke*ae);return(ve>0?Ge<0:Ge>0)?null:this.at(Ge/ve,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Mn=class extends oi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.combine=vl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},jc=new Et,vi=new Yr,br=new es,Qc=new P,Sr=new P,Er=new P,wr=new P,tl=new P,Tr=new P,eh=new P,Ar=new P,B=class extends Vt{constructor(e=new Ot,t=new Mn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Tr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],d=r[l];h!==0&&(tl.fromBufferAttribute(d,e),a?Tr.addScaledVector(tl,h):Tr.addScaledVector(tl.sub(t),h))}t.add(Tr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),br.copy(n.boundingSphere),br.applyMatrix4(r),vi.copy(e.ray).recast(e.near),!(br.containsPoint(vi.origin)===!1&&(vi.intersectSphere(br,Qc)===null||vi.origin.distanceToSquared(Qc)>(e.far-e.near)**2))&&(jc.copy(r).invert(),vi.copy(e.ray).applyMatrix4(jc),!(n.boundingBox!==null&&vi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,vi)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,x=u.length;p<x;p++){let g=u[p],m=a[g.materialIndex],S=Math.max(g.start,f.start),T=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let v=S,E=T;v<E;v+=3){let b=o.getX(v),R=o.getX(v+1),y=o.getX(v+2);s=Rr(this,m,e,n,c,h,d,b,R,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){let S=o.getX(g),T=o.getX(g+1),v=o.getX(g+2);s=Rr(this,a,e,n,c,h,d,S,T,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,x=u.length;p<x;p++){let g=u[p],m=a[g.materialIndex],S=Math.max(g.start,f.start),T=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let v=S,E=T;v<E;v+=3){let b=v,R=v+1,y=v+2;s=Rr(this,m,e,n,c,h,d,b,R,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){let S=g,T=g+1,v=g+2;s=Rr(this,a,e,n,c,h,d,S,T,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function Fd(i,e,t,n,s,r,a,o){let l;if(e.side===Zt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===di,o),l===null)return null;Ar.copy(o),Ar.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Ar);return c<t.near||c>t.far?null:{distance:c,point:Ar.clone(),object:i}}function Rr(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Sr),i.getVertexPosition(l,Er),i.getVertexPosition(c,wr);let h=Fd(i,e,t,n,Sr,Er,wr,eh);if(h){let d=new P;ri.getBarycoord(eh,Sr,Er,wr,d),s&&(h.uv=ri.getInterpolatedAttribute(s,o,l,c,d,new Ne)),r&&(h.uv1=ri.getInterpolatedAttribute(r,o,l,c,d,new Ne)),a&&(h.normal=ri.getInterpolatedAttribute(a,o,l,c,d,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new P,materialIndex:0};ri.getNormal(Sr,Er,wr,u.normal),h.face=u,h.barycoord=d}return h}var Zr=class extends Yt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Ft,h=Ft,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Mi=new es,Bd=new Ne(.5,.5),Cr=new P,ts=class{constructor(e=new xn,t=new xn,n=new xn,s=new xn,r=new xn,a=new xn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=vn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],p=r[8],x=r[9],g=r[10],m=r[11],S=r[12],T=r[13],v=r[14],E=r[15];if(s[0].setComponents(c-a,f-h,m-p,E-S).normalize(),s[1].setComponents(c+a,f+h,m+p,E+S).normalize(),s[2].setComponents(c+o,f+d,m+x,E+T).normalize(),s[3].setComponents(c-o,f-d,m-x,E-T).normalize(),n)s[4].setComponents(l,u,g,v).normalize(),s[5].setComponents(c-l,f-u,m-g,E-v).normalize();else if(s[4].setComponents(c-l,f-u,m-g,E-v).normalize(),t===vn)s[5].setComponents(c+l,f+u,m+g,E+v).normalize();else if(t===$i)s[5].setComponents(l,u,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Mi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Mi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Mi)}intersectsSprite(e){Mi.center.set(0,0,0);let t=Bd.distanceTo(e.center);return Mi.radius=.7071067811865476+t,Mi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Mi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Cr.x=s.normal.x>0?e.max.x:e.min.x,Cr.y=s.normal.y>0?e.max.y:e.min.y,Cr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Cr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Fs=class extends Yt{constructor(e=[],t=fi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Yn=class extends Yt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var li=class extends Yt{constructor(e,t,n=En,s,r,a,o=Ft,l=Ft,c,h=Dn,d=1){if(h!==Dn&&h!==mi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ji(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Kr=class extends li{constructor(e,t=En,n=fi,s,r,a=Ft,o=Ft,l,c=Dn){let h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Bs=class extends Yt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},oe=class i extends Ot{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,f=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,s,a,2),p("x","z","y",1,-1,e,n,-t,s,a,3),p("x","y","z",1,-1,e,t,n,s,r,4),p("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new gt(c,3)),this.setAttribute("normal",new gt(h,3)),this.setAttribute("uv",new gt(d,2));function p(x,g,m,S,T,v,E,b,R,y,w){let C=v/R,U=E/y,F=v/2,k=E/2,L=b/2,G=R+1,Y=y+1,X=0,ae=0,q=new P;for(let Q=0;Q<Y;Q++){let ne=Q*U-k;for(let Pe=0;Pe<G;Pe++){let Ie=Pe*C-F;q[x]=Ie*S,q[g]=ne*T,q[m]=L,c.push(q.x,q.y,q.z),q[x]=0,q[g]=0,q[m]=b>0?1:-1,h.push(q.x,q.y,q.z),d.push(Pe/R),d.push(1-Q/y),X+=1}}for(let Q=0;Q<y;Q++)for(let ne=0;ne<R;ne++){let Pe=u+ne+G*Q,Ie=u+ne+G*(Q+1),ft=u+(ne+1)+G*(Q+1),et=u+(ne+1)+G*Q;l.push(Pe,Ie,et),l.push(Ie,ft,et),ae+=6}o.addGroup(f,ae,w),f+=ae,u+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},Si=class i extends Ot{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let a=[],o=[],l=[],c=[],h=t/2,d=Math.PI/2*e,u=t,f=2*d+u,p=n*2+r,x=s+1,g=new P,m=new P;for(let S=0;S<=p;S++){let T=0,v=0,E=0,b=0;if(S<=n){let w=S/n,C=w*Math.PI/2;v=-h-e*Math.cos(C),E=e*Math.sin(C),b=-e*Math.cos(C),T=w*d}else if(S<=n+r){let w=(S-n)/r;v=-h+w*t,E=e,b=0,T=d+w*u}else{let w=(S-n-r)/n,C=w*Math.PI/2;v=h+e*Math.sin(C),E=e*Math.cos(C),b=e*Math.sin(C),T=d+u+w*d}let R=Math.max(0,Math.min(1,T/f)),y=0;S===0?y=.5/s:S===p&&(y=-.5/s);for(let w=0;w<=s;w++){let C=w/s,U=C*Math.PI*2,F=Math.sin(U),k=Math.cos(U);m.x=-E*k,m.y=v,m.z=E*F,o.push(m.x,m.y,m.z),g.set(-E*k,b,E*F),g.normalize(),l.push(g.x,g.y,g.z),c.push(C+y,R)}if(S>0){let w=(S-1)*x;for(let C=0;C<s;C++){let U=w+C,F=w+C+1,k=S*x+C,L=S*x+C+1;a.push(U,F,k),a.push(F,L,k)}}}this.setIndex(a),this.setAttribute("position",new gt(o,3)),this.setAttribute("normal",new gt(l,3)),this.setAttribute("uv",new gt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}};var qe=class i extends Ot{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],f=[],p=0,x=[],g=n/2,m=0;S(),a===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new gt(d,3)),this.setAttribute("normal",new gt(u,3)),this.setAttribute("uv",new gt(f,2));function S(){let v=new P,E=new P,b=0,R=(t-e)/n;for(let y=0;y<=r;y++){let w=[],C=y/r,U=C*(t-e)+e;for(let F=0;F<=s;F++){let k=F/s,L=k*l+o,G=Math.sin(L),Y=Math.cos(L);E.x=U*G,E.y=-C*n+g,E.z=U*Y,d.push(E.x,E.y,E.z),v.set(G,R,Y).normalize(),u.push(v.x,v.y,v.z),f.push(k,1-C),w.push(p++)}x.push(w)}for(let y=0;y<s;y++)for(let w=0;w<r;w++){let C=x[w][y],U=x[w+1][y],F=x[w+1][y+1],k=x[w][y+1];(e>0||w!==0)&&(h.push(C,U,k),b+=3),(t>0||w!==r-1)&&(h.push(U,F,k),b+=3)}c.addGroup(m,b,0),m+=b}function T(v){let E=p,b=new Ne,R=new P,y=0,w=v===!0?e:t,C=v===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,g*C,0),u.push(0,C,0),f.push(.5,.5),p++;let U=p;for(let F=0;F<=s;F++){let L=F/s*l+o,G=Math.cos(L),Y=Math.sin(L);R.x=w*Y,R.y=g*C,R.z=w*G,d.push(R.x,R.y,R.z),u.push(0,C,0),b.x=G*.5+.5,b.y=Y*.5*C+.5,f.push(b.x,b.y),p++}for(let F=0;F<s;F++){let k=E+F,L=U+F;v===!0?h.push(L,L+1,k):h.push(L+1,L,k),y+=3}c.addGroup(m,y,v===!0?1:2),m+=y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ei=class i extends qe{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},$r=class i extends Ot{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new gt(r,3)),this.setAttribute("normal",new gt(r.slice(),3)),this.setAttribute("uv",new gt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(S){let T=new P,v=new P,E=new P;for(let b=0;b<t.length;b+=3)f(t[b+0],T),f(t[b+1],v),f(t[b+2],E),l(T,v,E,S)}function l(S,T,v,E){let b=E+1,R=[];for(let y=0;y<=b;y++){R[y]=[];let w=S.clone().lerp(v,y/b),C=T.clone().lerp(v,y/b),U=b-y;for(let F=0;F<=U;F++)F===0&&y===b?R[y][F]=w:R[y][F]=w.clone().lerp(C,F/U)}for(let y=0;y<b;y++)for(let w=0;w<2*(b-y)-1;w++){let C=Math.floor(w/2);w%2===0?(u(R[y][C+1]),u(R[y+1][C]),u(R[y][C])):(u(R[y][C+1]),u(R[y+1][C+1]),u(R[y+1][C]))}}function c(S){let T=new P;for(let v=0;v<r.length;v+=3)T.x=r[v+0],T.y=r[v+1],T.z=r[v+2],T.normalize().multiplyScalar(S),r[v+0]=T.x,r[v+1]=T.y,r[v+2]=T.z}function h(){let S=new P;for(let T=0;T<r.length;T+=3){S.x=r[T+0],S.y=r[T+1],S.z=r[T+2];let v=g(S)/2/Math.PI+.5,E=m(S)/Math.PI+.5;a.push(v,1-E)}p(),d()}function d(){for(let S=0;S<a.length;S+=6){let T=a[S+0],v=a[S+2],E=a[S+4],b=Math.max(T,v,E),R=Math.min(T,v,E);b>.9&&R<.1&&(T<.2&&(a[S+0]+=1),v<.2&&(a[S+2]+=1),E<.2&&(a[S+4]+=1))}}function u(S){r.push(S.x,S.y,S.z)}function f(S,T){let v=S*3;T.x=e[v+0],T.y=e[v+1],T.z=e[v+2]}function p(){let S=new P,T=new P,v=new P,E=new P,b=new Ne,R=new Ne,y=new Ne;for(let w=0,C=0;w<r.length;w+=9,C+=6){S.set(r[w+0],r[w+1],r[w+2]),T.set(r[w+3],r[w+4],r[w+5]),v.set(r[w+6],r[w+7],r[w+8]),b.set(a[C+0],a[C+1]),R.set(a[C+2],a[C+3]),y.set(a[C+4],a[C+5]),E.copy(S).add(T).add(v).divideScalar(3);let U=g(E);x(b,C+0,S,U),x(R,C+2,T,U),x(y,C+4,v,U)}}function x(S,T,v,E){E<0&&S.x===1&&(a[T]=S.x-1),v.x===0&&v.z===0&&(a[T]=E/2/Math.PI+.5)}function g(S){return Math.atan2(S.z,-S.x)}function m(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var un=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Be("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],u=n[s+1]-h,f=(a-h)/u;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new Ne:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new P,s=[],r=[],a=[],o=new P,l=new Et;for(let f=0;f<=e;f++){let p=f/e;s[f]=this.getTangentAt(p,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let p=Math.acos(Qe(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Qe(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Os=class extends un{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new Ne){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Jr=class extends Os{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Bl(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,s(a,o,u,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var th=new P,nh=new P,nl=new Bl,il=new Bl,sl=new Bl,ns=class extends un{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(nh.subVectors(s[0],s[1]).add(s[0]),c=nh);let d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(th.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=th),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(d),f),x=Math.pow(d.distanceToSquared(u),f),g=Math.pow(u.distanceToSquared(h),f);x<1e-4&&(x=1),p<1e-4&&(p=x),g<1e-4&&(g=x),nl.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,p,x,g),il.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,p,x,g),sl.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,p,x,g)}else this.curveType==="catmullrom"&&(nl.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),il.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),sl.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(nl.calc(l),il.calc(l),sl.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function ih(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Od(i,e){let t=1-i;return t*t*e}function kd(i,e){return 2*(1-i)*i*e}function Hd(i,e){return i*i*e}function Es(i,e,t,n){return Od(i,e)+kd(i,t)+Hd(i,n)}function zd(i,e){let t=1-i;return t*t*t*e}function Gd(i,e){let t=1-i;return 3*t*t*i*e}function Vd(i,e){return 3*(1-i)*i*i*e}function Wd(i,e){return i*i*i*e}function ws(i,e,t,n,s){return zd(i,e)+Gd(i,t)+Vd(i,n)+Wd(i,s)}var jr=class extends un{constructor(e=new Ne,t=new Ne,n=new Ne,s=new Ne){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Ne){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ws(e,s.x,r.x,a.x,o.x),ws(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Qr=class extends un{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ws(e,s.x,r.x,a.x,o.x),ws(e,s.y,r.y,a.y,o.y),ws(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ea=class extends un{constructor(e=new Ne,t=new Ne){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ne){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ne){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ta=class extends un{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},na=class extends un{constructor(e=new Ne,t=new Ne,n=new Ne){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Ne){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Es(e,s.x,r.x,a.x),Es(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ks=class extends un{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Es(e,s.x,r.x,a.x),Es(e,s.y,r.y,a.y),Es(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ia=class extends un{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ne){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(ih(o,l.x,c.x,h.x,d.x),ih(o,l.y,c.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new Ne().fromArray(s))}return this}},Xd=Object.freeze({__proto__:null,ArcCurve:Jr,CatmullRomCurve3:ns,CubicBezierCurve:jr,CubicBezierCurve3:Qr,EllipseCurve:Os,LineCurve:ea,LineCurve3:ta,QuadraticBezierCurve:na,QuadraticBezierCurve3:ks,SplineCurve:ia});var is=class i extends $r{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var it=class i extends Ot{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=e/o,u=t/l,f=[],p=[],x=[],g=[];for(let m=0;m<h;m++){let S=m*u-a;for(let T=0;T<c;T++){let v=T*d-r;p.push(v,-S,0),x.push(0,0,1),g.push(T/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let S=0;S<o;S++){let T=S+c*m,v=S+c*(m+1),E=S+1+c*(m+1),b=S+1+c*m;f.push(T,v,b),f.push(v,E,b)}this.setIndex(f),this.setAttribute("position",new gt(p,3)),this.setAttribute("normal",new gt(x,3)),this.setAttribute("uv",new gt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var bn=class i extends Ot{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new P,u=new P,f=[],p=[],x=[],g=[];for(let m=0;m<=n;m++){let S=[],T=m/n,v=a+T*o,E=e*Math.cos(v),b=Math.sqrt(e*e-E*E),R=0;m===0&&a===0?R=.5/t:m===n&&l===Math.PI&&(R=-.5/t);for(let y=0;y<=t;y++){let w=y/t,C=s+w*r;d.x=-b*Math.cos(C),d.y=E,d.z=b*Math.sin(C),p.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),g.push(w+R,1-T),S.push(c++)}h.push(S)}for(let m=0;m<n;m++)for(let S=0;S<t;S++){let T=h[m][S+1],v=h[m][S],E=h[m+1][S],b=h[m+1][S+1];(m!==0||a>0)&&f.push(T,v,b),(m!==n-1||l<Math.PI)&&f.push(v,E,b)}this.setIndex(f),this.setAttribute("position",new gt(p,3)),this.setAttribute("normal",new gt(x,3)),this.setAttribute("uv",new gt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Hs=class i extends Ot{constructor(e=new ks(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new P,l=new P,c=new Ne,h=new P,d=[],u=[],f=[],p=[];x(),this.setIndex(p),this.setAttribute("position",new gt(d,3)),this.setAttribute("normal",new gt(u,3)),this.setAttribute("uv",new gt(f,2));function x(){for(let T=0;T<t;T++)g(T);g(r===!1?t:0),S(),m()}function g(T){h=e.getPointAt(T/t,h);let v=a.normals[T],E=a.binormals[T];for(let b=0;b<=s;b++){let R=b/s*Math.PI*2,y=Math.sin(R),w=-Math.cos(R);l.x=w*v.x+y*E.x,l.y=w*v.y+y*E.y,l.z=w*v.z+y*E.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,d.push(o.x,o.y,o.z)}}function m(){for(let T=1;T<=t;T++)for(let v=1;v<=s;v++){let E=(s+1)*(T-1)+(v-1),b=(s+1)*T+(v-1),R=(s+1)*T+v,y=(s+1)*(T-1)+v;p.push(E,b,y),p.push(b,R,y)}}function S(){for(let T=0;T<=t;T++)for(let v=0;v<=s;v++)c.x=T/t,c.y=v/s,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new Xd[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function Ai(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(sh(s))s.isRenderTargetTexture?(Be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(sh(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Wt(i){let e={};for(let t=0;t<i.length;t++){let n=Ai(i[t]);for(let s in n)e[s]=n[s]}return e}function sh(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function qd(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ol(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}var Zh={clone:Ai,merge:Wt},Yd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Zd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,sn=class extends oi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Yd,this.fragmentShader=Zd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ai(e.uniforms),this.uniformsGroups=qd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new We().setHex(s.value);break;case"v2":this.uniforms[n].value=new Ne().fromArray(s.value);break;case"v3":this.uniforms[n].value=new P().fromArray(s.value);break;case"v4":this.uniforms[n].value=new wt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new ze().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Et().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},sa=class extends sn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ae=class extends oi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new We(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new We(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=oo,this.normalScale=new Ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var ra=class extends oi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Dh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},aa=class extends oi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Wi(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function rl(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var ci=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},oa=class extends ci{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ll,endingEnd:ll}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case cl:r=e,o=2*t-n;break;case hl:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case cl:a=e,l=2*n-t;break;case hl:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,p=(n-t)/(s-t),x=p*p,g=x*p,m=-u*g+2*u*x-u*p,S=(1+u)*g+(-1.5-2*u)*x+(-.5+u)*p+1,T=(-1-f)*g+(1.5+f)*x+.5*p,v=f*g-f*x;for(let E=0;E!==o;++E)r[E]=m*a[h+E]+S*a[c+E]+T*a[l+E]+v*a[d+E];return r}},la=class extends ci{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}},ca=class extends ci{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ha=class extends ci{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let p=(n-t)/(s-t),x=1-p;for(let g=0;g!==o;++g)r[g]=a[c+g]*x+a[l+g]*p;return r}let u=o*2,f=e-1;for(let p=0;p!==o;++p){let x=a[c+p],g=a[l+p],m=f*u+p*2,S=d[m],T=d[m+1],v=e*u+p*2,E=h[v],b=h[v+1],R=$d(n,t,S,E,s);r[p]=Kh(R,x,T,b,g)}return r}};function Kh(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Kd(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function $d(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=Kh(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=Kd(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var rn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Wi(t,this.TimeBufferType),this.values=Wi(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Wi(e.times,Array),values:Wi(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),rl(e.settings)&&(n.settings={inTangents:Wi(e.settings.inTangents,Array),outTangents:Wi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ca(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new la(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new oa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ha(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ts:t=this.InterpolantFactoryMethodDiscrete;break;case Gr:t=this.InterpolantFactoryMethodLinear;break;case Lr:t=this.InterpolantFactoryMethodSmooth;break;case ol:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Be("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ts;case this.InterpolantFactoryMethodLinear:return Gr;case this.InterpolantFactoryMethodSmooth:return Lr;case this.InterpolantFactoryMethodBezier:return ol}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;rl(this.settings)&&(rh(this.settings.inTangents,e),rh(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Oe("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Oe("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Oe("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Oe("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&yd(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Oe("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Lr,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let d=o*n,u=d-n,f=d+n;for(let p=0;p!==n;++p){let x=t[d+p];if(x!==t[u+p]||x!==t[f+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,u=a*n;for(let f=0;f!==n;++f)t[u+f]=t[d+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,rl(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function rh(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}rn.prototype.ValueTypeName="";rn.prototype.TimeBufferType=Float32Array;rn.prototype.ValueBufferType=Float32Array;rn.prototype.DefaultInterpolation=Gr;var hi=class extends rn{constructor(e,t,n){super(e,t,n)}};hi.prototype.ValueTypeName="bool";hi.prototype.ValueBufferType=Array;hi.prototype.DefaultInterpolation=Ts;hi.prototype.InterpolantFactoryMethodLinear=void 0;hi.prototype.InterpolantFactoryMethodSmooth=void 0;var ua=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}};ua.prototype.ValueTypeName="color";var da=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}};da.prototype.ValueTypeName="number";var fa=class extends ci{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)Un.slerpFlat(r,0,a,c-o,a,c,l);return r}},zs=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new fa(this.times,this.values,this.getValueSize(),e)}};zs.prototype.ValueTypeName="quaternion";zs.prototype.InterpolantFactoryMethodSmooth=void 0;var ui=class extends rn{constructor(e,t,n){super(e,t,n)}};ui.prototype.ValueTypeName="string";ui.prototype.ValueBufferType=Array;ui.prototype.DefaultInterpolation=Ts;ui.prototype.InterpolantFactoryMethodLinear=void 0;ui.prototype.InterpolantFactoryMethodSmooth=void 0;var pa=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}};pa.prototype.ValueTypeName="vector";var ma=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],p=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},$h=new ma,ga=class{constructor(e){this.manager=e!==void 0?e:$h,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ga.DEFAULT_MATERIAL_NAME="__DEFAULT";var ss=class extends Vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new We(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Gs=class extends ss{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new We(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},al=new Et,ah=new P,oh=new P,_a=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ne(512,512),this.mapType=Qt,this.map=null,this.mapPass=null,this.matrix=new Et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ts,this._frameExtents=new Ne(1,1),this._viewportCount=1,this._viewports=[new wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;ah.setFromMatrixPosition(e.matrixWorld),t.position.copy(ah),oh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(oh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){al.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(al,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===$i||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(al)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Pr=new P,Ir=new Un,Ln=new P,Vs=class extends Vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Et,this.projectionMatrix=new Et,this.projectionMatrixInverse=new Et,this.coordinateSystem=vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Pr,Ir,Ln),Ln.x===1&&Ln.y===1&&Ln.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pr,Ir,Ln.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Pr,Ir,Ln),Ln.x===1&&Ln.y===1&&Ln.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pr,Ir,Ln.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},si=new P,lh=new Ne,ch=new Ne,Gt=class extends Vs{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Vr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Uo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Vr*2*Math.atan(Math.tan(Uo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(si.x,si.y).multiplyScalar(-e/si.z),si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(si.x,si.y).multiplyScalar(-e/si.z)}getViewSize(e,t){return this.getViewBounds(e,lh,ch),t.subVectors(ch,lh)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Uo*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var rs=class extends Vs{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ul=class extends _a{constructor(){super(new rs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ws=class extends ss{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.target=new Vt,this.shadow=new ul}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Xs=class extends ss{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Xi=-90,qi=1,ya=class extends Vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Gt(Xi,qi,e,t);s.layers=this.layers,this.add(s);let r=new Gt(Xi,qi,e,t);r.layers=this.layers,this.add(r);let a=new Gt(Xi,qi,e,t);a.layers=this.layers,this.add(a);let o=new Gt(Xi,qi,e,t);o.layers=this.layers,this.add(o);let l=new Gt(Xi,qi,e,t);l.layers=this.layers,this.add(l);let c=new Gt(Xi,qi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===vn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===$i)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},xa=class extends Gt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var kl="\\[\\]\\.:\\/",Jd=new RegExp("["+kl+"]","g"),Hl="[^"+kl+"]",jd="[^"+kl.replace("\\.","")+"]",Qd=/((?:WC+[\/:])*)/.source.replace("WC",Hl),ef=/(WCOD+)?/.source.replace("WCOD",jd),tf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Hl),nf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Hl),sf=new RegExp("^"+Qd+ef+tf+nf+"$"),rf=["material","materials","bones","map"],dl=class{constructor(e,t,n){let s=n||St.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},St=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Jd,"")}static parseTrackName(e){let t=sf.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);rf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Be("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Oe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Oe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Oe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Oe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Oe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Oe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Oe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Oe("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Oe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Oe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};St.Composite=dl;St.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};St.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};St.prototype.GetterByBindingType=[St.prototype._getValue_direct,St.prototype._getValue_array,St.prototype._getValue_arrayElement,St.prototype._getValue_toArray];St.prototype.SetterByBindingTypeAndVersioning=[[St.prototype._setValue_direct,St.prototype._setValue_direct_setNeedsUpdate,St.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[St.prototype._setValue_array,St.prototype._setValue_array_setNeedsUpdate,St.prototype._setValue_array_setMatrixWorldNeedsUpdate],[St.prototype._setValue_arrayElement,St.prototype._setValue_arrayElement_setNeedsUpdate,St.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[St.prototype._setValue_fromArray,St.prototype._setValue_fromArray_setNeedsUpdate,St.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var E_=new Float32Array(1);var ql=class ql{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};ql.prototype.isMatrix2=!0;var fl=ql;function zl(i,e,t,n){let s=af(n);switch(t){case Ll:return i*e;case Nl:return i*e/s.components*s.byteLength;case Ra:return i*e/s.components*s.byteLength;case gi:return i*e*2/s.components*s.byteLength;case Ca:return i*e*2/s.components*s.byteLength;case Dl:return i*e*3/s.components*s.byteLength;case dn:return i*e*4/s.components*s.byteLength;case Pa:return i*e*4/s.components*s.byteLength;case $s:case Js:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case js:case Qs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case La:case Na:return Math.max(i,16)*Math.max(e,8)/4;case Ia:case Da:return Math.max(i,8)*Math.max(e,8)/2;case Ua:case Fa:case Oa:case ka:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ba:case er:case Ha:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case za:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ga:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Va:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Wa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case qa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Za:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ka:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case $a:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ja:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Qa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case eo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case to:case no:case io:return Math.ceil(i/4)*Math.ceil(e/4)*16;case so:case ro:return Math.ceil(i/4)*Math.ceil(e/4)*8;case tr:case ao:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function af(i){switch(i){case Qt:case Rl:return{byteLength:1,components:1};case ls:case Cl:case Tn:return{byteLength:2,components:1};case Ta:case Aa:return{byteLength:2,components:4};case En:case wa:case wn:return{byteLength:4,components:1};case Pl:case Il:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function yu(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function pf(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){let p=d[u],x=d[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++u,d[u]=x)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){let x=d[f];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var mf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,_f=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,vf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,bf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Ef=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Af=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Rf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Cf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Pf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,If=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Lf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Df=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Nf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Uf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ff=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Bf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Of=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,kf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Hf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,zf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Gf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Vf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xf="gl_FragColor = linearToOutputTexel( gl_FragColor );",qf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Yf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Zf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Kf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,$f=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Jf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,jf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ep=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,tp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,np=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ip=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,sp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ap=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,op=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,lp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,hp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,up=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,dp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,fp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,pp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,mp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,gp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_p=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,yp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,bp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Sp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ep=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,wp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ap=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Pp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ip=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Lp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Np=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Op=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,kp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Hp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Gp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Wp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Xp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Yp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Zp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Kp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$p=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Jp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,jp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Qp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,em=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,tm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,nm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,im=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,sm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,rm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,am=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,om=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,lm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,cm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,hm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,dm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,pm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,mm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,gm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ym=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,bm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Sm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Em=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,wm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Tm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Am=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Rm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Cm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Pm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Im=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Nm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Um=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Fm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Bm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Om=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,km=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Hm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Wm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Xm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ym=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ke={alphahash_fragment:mf,alphahash_pars_fragment:gf,alphamap_fragment:_f,alphamap_pars_fragment:yf,alphatest_fragment:xf,alphatest_pars_fragment:vf,aomap_fragment:Mf,aomap_pars_fragment:bf,batching_pars_vertex:Sf,batching_vertex:Ef,begin_vertex:wf,beginnormal_vertex:Tf,bsdfs:Af,iridescence_fragment:Rf,bumpmap_pars_fragment:Cf,clipping_planes_fragment:Pf,clipping_planes_pars_fragment:If,clipping_planes_pars_vertex:Lf,clipping_planes_vertex:Df,color_fragment:Nf,color_pars_fragment:Uf,color_pars_vertex:Ff,color_vertex:Bf,common:Of,cube_uv_reflection_fragment:kf,defaultnormal_vertex:Hf,displacementmap_pars_vertex:zf,displacementmap_vertex:Gf,emissivemap_fragment:Vf,emissivemap_pars_fragment:Wf,colorspace_fragment:Xf,colorspace_pars_fragment:qf,envmap_fragment:Yf,envmap_common_pars_fragment:Zf,envmap_pars_fragment:Kf,envmap_pars_vertex:$f,envmap_physical_pars_fragment:op,envmap_vertex:Jf,fog_vertex:jf,fog_pars_vertex:Qf,fog_fragment:ep,fog_pars_fragment:tp,gradientmap_pars_fragment:np,lightmap_pars_fragment:ip,lights_lambert_fragment:sp,lights_lambert_pars_fragment:rp,lights_pars_begin:ap,lights_toon_fragment:lp,lights_toon_pars_fragment:cp,lights_phong_fragment:hp,lights_phong_pars_fragment:up,lights_physical_fragment:dp,lights_physical_pars_fragment:fp,lights_fragment_begin:pp,lights_fragment_maps:mp,lights_fragment_end:gp,lightprobes_pars_fragment:_p,logdepthbuf_fragment:yp,logdepthbuf_pars_fragment:xp,logdepthbuf_pars_vertex:vp,logdepthbuf_vertex:Mp,map_fragment:bp,map_pars_fragment:Sp,map_particle_fragment:Ep,map_particle_pars_fragment:wp,metalnessmap_fragment:Tp,metalnessmap_pars_fragment:Ap,morphinstance_vertex:Rp,morphcolor_vertex:Cp,morphnormal_vertex:Pp,morphtarget_pars_vertex:Ip,morphtarget_vertex:Lp,normal_fragment_begin:Dp,normal_fragment_maps:Np,normal_pars_fragment:Up,normal_pars_vertex:Fp,normal_vertex:Bp,normalmap_pars_fragment:Op,clearcoat_normal_fragment_begin:kp,clearcoat_normal_fragment_maps:Hp,clearcoat_pars_fragment:zp,iridescence_pars_fragment:Gp,opaque_fragment:Vp,packing:Wp,premultiplied_alpha_fragment:Xp,project_vertex:qp,dithering_fragment:Yp,dithering_pars_fragment:Zp,roughnessmap_fragment:Kp,roughnessmap_pars_fragment:$p,shadowmap_pars_fragment:Jp,shadowmap_pars_vertex:jp,shadowmap_vertex:Qp,shadowmask_pars_fragment:em,skinbase_vertex:tm,skinning_pars_vertex:nm,skinning_vertex:im,skinnormal_vertex:sm,specularmap_fragment:rm,specularmap_pars_fragment:am,tonemapping_fragment:om,tonemapping_pars_fragment:lm,transmission_fragment:cm,transmission_pars_fragment:hm,uv_pars_fragment:um,uv_pars_vertex:dm,uv_vertex:fm,worldpos_vertex:pm,background_vert:mm,background_frag:gm,backgroundCube_vert:_m,backgroundCube_frag:ym,cube_vert:xm,cube_frag:vm,depth_vert:Mm,depth_frag:bm,distance_vert:Sm,distance_frag:Em,equirect_vert:wm,equirect_frag:Tm,linedashed_vert:Am,linedashed_frag:Rm,meshbasic_vert:Cm,meshbasic_frag:Pm,meshlambert_vert:Im,meshlambert_frag:Lm,meshmatcap_vert:Dm,meshmatcap_frag:Nm,meshnormal_vert:Um,meshnormal_frag:Fm,meshphong_vert:Bm,meshphong_frag:Om,meshphysical_vert:km,meshphysical_frag:Hm,meshtoon_vert:zm,meshtoon_frag:Gm,points_vert:Vm,points_frag:Wm,shadow_vert:Xm,shadow_frag:qm,sprite_vert:Ym,sprite_frag:Zm},ge={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new Ne(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},On={basic:{uniforms:Wt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:Wt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new We(0)},envMapIntensity:{value:1}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:Wt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:Wt([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:Wt([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new We(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:Wt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:Wt([ge.points,ge.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:Wt([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:Wt([ge.common,ge.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:Wt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:Wt([ge.sprite,ge.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distance:{uniforms:Wt([ge.common,ge.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distance_vert,fragmentShader:Ke.distance_frag},shadow:{uniforms:Wt([ge.lights,ge.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};On.physical={uniforms:Wt([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Ne(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Ne},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};var ho={r:0,b:0,g:0},Km=new Et,xu=new ze;xu.set(-1,0,0,0,1,0,0,0,1);function $m(i,e,t,n,s,r){let a=new We(0),o=s===!0?0:1,l,c,h=null,d=0,u=null;function f(S){let T=S.isScene===!0?S.background:null;if(T&&T.isTexture){let v=S.backgroundBlurriness>0;T=e.get(T,v)}return T}function p(S){let T=!1,v=f(S);v===null?g(a,o):v&&v.isColor&&(g(v,1),T=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(S,T){let v=f(T);v&&(v.isCubeTexture||v.mapping===Zs)?(c===void 0&&(c=new B(new oe(1,1,1),new sn({name:"BackgroundCubeMaterial",uniforms:Ai(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Km.makeRotationFromEuler(T.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(xu),c.material.toneMapped=nt.getTransfer(v.colorSpace)!==dt,(h!==v||d!==v.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=v,d=v.version,u=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new B(new it(2,2),new sn({name:"BackgroundMaterial",uniforms:Ai(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:di,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=nt.getTransfer(v.colorSpace)!==dt,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||d!==v.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=v,d=v.version,u=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,T){S.getRGB(ho,Ol(i)),t.buffers.color.setClear(ho.r,ho.g,ho.b,T,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,T=1){a.set(S),o=T,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,g(a,o)},render:p,addToRenderList:x,dispose:m}}function Jm(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,a=!1;function o(U,F,k,L,G){let Y=!1,X=d(U,L,k,F);r!==X&&(r=X,c(r.object)),Y=f(U,L,k,G),Y&&p(U,L,k,G),G!==null&&e.update(G,i.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,v(U,F,k,L),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return i.createVertexArray()}function c(U){return i.bindVertexArray(U)}function h(U){return i.deleteVertexArray(U)}function d(U,F,k,L){let G=L.wireframe===!0,Y=n[F.id];Y===void 0&&(Y={},n[F.id]=Y);let X=U.isInstancedMesh===!0?U.id:0,ae=Y[X];ae===void 0&&(ae={},Y[X]=ae);let q=ae[k.id];q===void 0&&(q={},ae[k.id]=q);let Q=q[G];return Q===void 0&&(Q=u(l()),q[G]=Q),Q}function u(U){let F=[],k=[],L=[];for(let G=0;G<t;G++)F[G]=0,k[G]=0,L[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:k,attributeDivisors:L,object:U,attributes:{},index:null}}function f(U,F,k,L){let G=r.attributes,Y=F.attributes,X=0,ae=k.getAttributes();for(let q in ae)if(ae[q].location>=0){let ne=G[q],Pe=Y[q];if(Pe===void 0&&(q==="instanceMatrix"&&U.instanceMatrix&&(Pe=U.instanceMatrix),q==="instanceColor"&&U.instanceColor&&(Pe=U.instanceColor)),ne===void 0||ne.attribute!==Pe||Pe&&ne.data!==Pe.data)return!0;X++}return r.attributesNum!==X||r.index!==L}function p(U,F,k,L){let G={},Y=F.attributes,X=0,ae=k.getAttributes();for(let q in ae)if(ae[q].location>=0){let ne=Y[q];ne===void 0&&(q==="instanceMatrix"&&U.instanceMatrix&&(ne=U.instanceMatrix),q==="instanceColor"&&U.instanceColor&&(ne=U.instanceColor));let Pe={};Pe.attribute=ne,ne&&ne.data&&(Pe.data=ne.data),G[q]=Pe,X++}r.attributes=G,r.attributesNum=X,r.index=L}function x(){let U=r.newAttributes;for(let F=0,k=U.length;F<k;F++)U[F]=0}function g(U){m(U,0)}function m(U,F){let k=r.newAttributes,L=r.enabledAttributes,G=r.attributeDivisors;k[U]=1,L[U]===0&&(i.enableVertexAttribArray(U),L[U]=1),G[U]!==F&&(i.vertexAttribDivisor(U,F),G[U]=F)}function S(){let U=r.newAttributes,F=r.enabledAttributes;for(let k=0,L=F.length;k<L;k++)F[k]!==U[k]&&(i.disableVertexAttribArray(k),F[k]=0)}function T(U,F,k,L,G,Y,X){X===!0?i.vertexAttribIPointer(U,F,k,G,Y):i.vertexAttribPointer(U,F,k,L,G,Y)}function v(U,F,k,L){x();let G=L.attributes,Y=k.getAttributes(),X=F.defaultAttributeValues;for(let ae in Y){let q=Y[ae];if(q.location>=0){let Q=G[ae];if(Q===void 0&&(ae==="instanceMatrix"&&U.instanceMatrix&&(Q=U.instanceMatrix),ae==="instanceColor"&&U.instanceColor&&(Q=U.instanceColor)),Q!==void 0){let ne=Q.normalized,Pe=Q.itemSize,Ie=e.get(Q);if(Ie===void 0)continue;let ft=Ie.buffer,et=Ie.type,rt=Ie.bytesPerElement,K=et===i.INT||et===i.UNSIGNED_INT||Q.gpuType===wa;if(Q.isInterleavedBufferAttribute){let ee=Q.data,be=ee.stride,ke=Q.offset;if(ee.isInstancedInterleavedBuffer){for(let ve=0;ve<q.locationSize;ve++)m(q.location+ve,ee.meshPerAttribute);U.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let ve=0;ve<q.locationSize;ve++)g(q.location+ve);i.bindBuffer(i.ARRAY_BUFFER,ft);for(let ve=0;ve<q.locationSize;ve++)T(q.location+ve,Pe/q.locationSize,et,ne,be*rt,(ke+Pe/q.locationSize*ve)*rt,K)}else{if(Q.isInstancedBufferAttribute){for(let ee=0;ee<q.locationSize;ee++)m(q.location+ee,Q.meshPerAttribute);U.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ee=0;ee<q.locationSize;ee++)g(q.location+ee);i.bindBuffer(i.ARRAY_BUFFER,ft);for(let ee=0;ee<q.locationSize;ee++)T(q.location+ee,Pe/q.locationSize,et,ne,Pe*rt,Pe/q.locationSize*ee*rt,K)}}else if(X!==void 0){let ne=X[ae];if(ne!==void 0)switch(ne.length){case 2:i.vertexAttrib2fv(q.location,ne);break;case 3:i.vertexAttrib3fv(q.location,ne);break;case 4:i.vertexAttrib4fv(q.location,ne);break;default:i.vertexAttrib1fv(q.location,ne)}}}}S()}function E(){w();for(let U in n){let F=n[U];for(let k in F){let L=F[k];for(let G in L){let Y=L[G];for(let X in Y)h(Y[X].object),delete Y[X];delete L[G]}}delete n[U]}}function b(U){if(n[U.id]===void 0)return;let F=n[U.id];for(let k in F){let L=F[k];for(let G in L){let Y=L[G];for(let X in Y)h(Y[X].object),delete Y[X];delete L[G]}}delete n[U.id]}function R(U){for(let F in n){let k=n[F];for(let L in k){let G=k[L];if(G[U.id]===void 0)continue;let Y=G[U.id];for(let X in Y)h(Y[X].object),delete Y[X];delete G[U.id]}}}function y(U){for(let F in n){let k=n[F],L=U.isInstancedMesh===!0?U.id:0,G=k[L];if(G!==void 0){for(let Y in G){let X=G[Y];for(let ae in X)h(X[ae].object),delete X[ae];delete G[Y]}delete k[L],Object.keys(k).length===0&&delete n[F]}}}function w(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:C,dispose:E,releaseStatesOfGeometry:b,releaseStatesOfObject:y,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:g,disableUnusedAttributes:S}}function jm(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Qm(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==dn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){let y=R===Tn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Qt&&R!==wn&&!y&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Be("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Be("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:S,maxVaryings:T,maxFragmentUniforms:v,maxSamples:E,samples:b}}function e0(i){let e=this,t=null,n=0,s=!1,r=!1,a=new xn,o=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){let p=d.clippingPlanes,x=d.clipIntersection,g=d.clipShadows,m=i.get(d);if(!s||p===null||p.length===0||r&&!g)r?h(null):c();else{let S=r?0:n,T=S*4,v=m.clippingState||null;l.value=v,v=h(p,u,T,f);for(let E=0;E!==T;++E)v[E]=t[E];m.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,p){let x=d!==null?d.length:0,g=null;if(x!==0){if(g=l.value,p!==!0||g===null){let m=f+x*4,S=u.matrixWorldInverse;o.getNormalMatrix(S),(g===null||g.length<m)&&(g=new Float32Array(m));for(let T=0,v=f;T!==x;++T,v+=4)a.copy(d[T]).applyMatrix4(S,o),a.normal.toArray(g,v),g[v+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}var us=4,t0=6,n0=20,i0=256,ir=new rs,Jh=new We,Yl=null,Zl=0,Kl=0,$l=!1,s0=new P,Ri=new P,fo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=s0}=r;Yl=this._renderer.getRenderTarget(),Zl=this._renderer.getActiveCubeFace(),Kl=this._renderer.getActiveMipmapLevel(),$l=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=eu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Yl,Zl,Kl),this._renderer.xr.enabled=$l,e.scissorTest=!1,hs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===fi||e.mapping===Ti?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Yl=this._renderer.getRenderTarget(),Zl=this._renderer.getActiveCubeFace(),Kl=this._renderer.getActiveMipmapLevel(),$l=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Bt,minFilter:Bt,generateMipmaps:!1,type:Tn,format:dn,colorSpace:As,depthBuffer:!1},s=jh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=jh(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=r0(r)),this._blurMaterial=o0(r,e,t),this._ggxMaterial=a0(r,e,t)}return s}_compileMaterial(e){let t=new B(new Ot,e);this._renderer.compile(t,ir)}_sceneToCubeUV(e,t,n,s,r){let l=new Gt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Jh),d.toneMapping=Sn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new B(new oe,new Mn({name:"PMREM.Background",side:Zt,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,m=!1,S=e.background;S?S.isColor&&(g.color.copy(S),e.background=null,m=!0):(g.color.copy(Jh),m=!0);for(let T=0;T<6;T++){let v=T%3;v===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[T],r.y,r.z)):v===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[T]));let E=this._cubeSize;hs(s,v*E,T>2?E:0,E,E),d.setRenderTarget(s),m&&d.render(x,l),d.render(e,l)}d.toneMapping=f,d.autoClear=u,e.background=S}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===fi||e.mapping===Ti;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=eu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;hs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,ir)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:p}=this,x=this._sizeLods[n],g=3*x*(n>p-us?n-p+us:0),m=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=p-t,hs(r,g,m,3*x,2*x),s.setRenderTarget(r),s.render(o,ir),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,hs(e,g,m,3*x,2*x),s.setRenderTarget(e),s.render(o,ir)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-us?s-this._lodMax+us:0),u=4*(this._cubeSize-h);hs(t,d,u,3*h,2*h),a.setRenderTarget(t),a.render(l,ir)}};function r0(i){let e=[],t=[],n=i,s=i-us+1+t0;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,p=new Float32Array(f*u*d),x=new Float32Array(f*u*d);for(let m=0;m<d;m++){let S=m%3*2/3-1,T=m>2?0:-1,v=[S,T,0,S+2/3,T,0,S+2/3,T+1,0,S,T,0,S+2/3,T+1,0,S,T+1,0];p.set(v,f*u*m);for(let E=0;E<u;E++){let b=h[E*2]*2-1,R=h[E*2+1]*2-1;m===0?Ri.set(1,R,b):m===1?Ri.set(-b,1,-R):m===2?Ri.set(-b,R,1):m===3?Ri.set(-1,R,-b):m===4?Ri.set(-b,-1,R):Ri.set(b,R,-1),Ri.toArray(x,(m*u+E)*f)}}let g=new Ot;g.setAttribute("position",new Jt(p,f)),g.setAttribute("outputDirection",new Jt(x,f)),t.push(new B(g,null)),n>us&&n--}return{lodMeshes:t,sizeLods:e}}function jh(i,e,t){let n=new jt(i,e,t);return n.texture.mapping=Zs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function hs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function a0(i,e,t){return new sn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:i0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:go(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function o0(i,e,t){return new sn({name:"SphericalGaussianBlur",defines:{SAMPLES:n0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:go(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function Qh(){return new sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function eu(){return new sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function go(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var po=class extends jt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Fs(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new oe(5,5,5),r=new sn({name:"CubemapFromEquirect",uniforms:Ai(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Zt,blending:Fn});r.uniforms.tEquirect.value=t;let a=new B(s,r),o=t.minFilter;return t.minFilter===pi&&(t.minFilter=Bt),new ya(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function l0(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===ba||f===Sa)if(e.has(u)){let p=e.get(u).texture;return o(p,u.mapping)}else{let p=u.image;if(p&&p.height>0){let x=new po(p.height);return x.fromEquirectangularTexture(i,u),e.set(u,x),u.addEventListener("dispose",c),o(x.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let f=u.mapping,p=f===ba||f===Sa,x=f===fi||f===Ti;if(p||x){let g=t.get(u),m=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new fo(i)),g=p?n.fromEquirectangular(u,g):n.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,t.set(u,g),g.texture;if(g!==void 0)return g.texture;{let S=u.image;return p&&S&&S.height>0||x&&S&&l(S)?(n===null&&(n=new fo(i)),g=p?n.fromEquirectangular(u):n.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,t.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function o(u,f){return f===ba?u.mapping=fi:f===Sa&&(u.mapping=Ti),u}function l(u){let f=0,p=6;for(let x=0;x<p;x++)u[x]!==void 0&&f++;return f===p}function c(u){let f=u.target;f.removeEventListener("dispose",c);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function c0(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&bi("WebGLRenderer: "+n+" extension not supported."),s}}}function h0(i,e,t,n){let s={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let p in u.attributes)e.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete s[u.id];let f=r.get(u);f&&(e.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)e.update(u[f],i.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,p=d.attributes.position,x=0;if(p===void 0)return;if(f!==null){let S=f.array;x=f.version;for(let T=0,v=S.length;T<v;T+=3){let E=S[T+0],b=S[T+1],R=S[T+2];u.push(E,b,b,R,R,E)}}else{let S=p.array;x=p.version;for(let T=0,v=S.length/3-1;T<v;T+=3){let E=T+0,b=T+1,R=T+2;u.push(E,b,b,R,R,E)}}let g=new(p.count>=65535?Us:Ns)(u,1);g.version=x;let m=r.get(d);m&&e.remove(m),r.set(d,g)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function u0(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),t.update(u,n,1)}function c(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*a,f),t.update(u,n,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let x=0;for(let g=0;g<f;g++)x+=u[g];t.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function d0(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Oe("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function f0(i,e,t){let n=new WeakMap,s=new wt;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let w=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",w)};u!==void 0&&u.texture.dispose();let f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],S=o.morphAttributes.color||[],T=0;f===!0&&(T=1),p===!0&&(T=2),x===!0&&(T=3);let v=o.attributes.position.count*T,E=1;v>e.maxTextureSize&&(E=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let b=new Float32Array(v*E*4*d),R=new Ps(b,v,E,d);R.type=wn,R.needsUpdate=!0;let y=T*4;for(let C=0;C<d;C++){let U=g[C],F=m[C],k=S[C],L=v*E*4*C;for(let G=0;G<U.count;G++){let Y=G*y;f===!0&&(s.fromBufferAttribute(U,G),b[L+Y+0]=s.x,b[L+Y+1]=s.y,b[L+Y+2]=s.z,b[L+Y+3]=0),p===!0&&(s.fromBufferAttribute(F,G),b[L+Y+4]=s.x,b[L+Y+5]=s.y,b[L+Y+6]=s.z,b[L+Y+7]=0),x===!0&&(s.fromBufferAttribute(k,G),b[L+Y+8]=s.x,b[L+Y+9]=s.y,b[L+Y+10]=s.z,b[L+Y+11]=k.itemSize===4?s.w:1)}}u={count:d,texture:R,size:new Ne(v,E)},n.set(o,u),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let p=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function p0(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,d=c.geometry,u=e.get(c,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var m0={[Ml]:"LINEAR_TONE_MAPPING",[bl]:"REINHARD_TONE_MAPPING",[Sl]:"CINEON_TONE_MAPPING",[Ys]:"ACES_FILMIC_TONE_MAPPING",[wl]:"AGX_TONE_MAPPING",[Tl]:"NEUTRAL_TONE_MAPPING",[El]:"CUSTOM_TONE_MAPPING"};function g0(i,e,t,n,s,r){let a=new jt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Ot;c.setAttribute("position",new gt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new gt([0,2,0,0,2,0],2));let h=new sa({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new B(c,h),u=new rs(-1,1,1,-1,0,1),f=null,p=null,x=!1,g,m=null,S=[],T=!1;this.setSize=function(v,E){a.setSize(v,E),o!==null&&o.setSize(v,E),l!==null&&l.setSize(v,E);for(let b=0;b<S.length;b++){let R=S[b];R.setSize&&R.setSize(v,E)}},this.setEffects=function(v){S=v,T=S.length>0&&S[0].isRenderPass===!0;let E=a.width,b=a.height;S.length>0&&o===null&&(o=new jt(E,b,{type:Tn,depthBuffer:!1,stencilBuffer:!1}),l=new jt(E,b,{type:Tn,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<S.length;R++){let y=S[R];y.setSize&&y.setSize(E,b)}},this.begin=function(v,E){if(x||v.toneMapping===Sn&&S.length===0)return!1;if(m=E,E!==null){let b=E.width,R=E.height;(a.width!==b||a.height!==R)&&this.setSize(b,R)}return T===!1&&v.setRenderTarget(a),g=v.toneMapping,v.toneMapping=Sn,!0},this.hasRenderPass=function(){return T},this.end=function(v,E){v.toneMapping=g,x=!0;let b=a,R=o;for(let y=0;y<S.length;y++){let w=S[y];w.enabled!==!1&&(w.render(v,R,b,E),w.needsSwap!==!1&&(b=R,R=R===o?l:o))}if(f!==v.outputColorSpace||p!==v.toneMapping){f=v.outputColorSpace,p=v.toneMapping,h.defines={},nt.getTransfer(f)===dt&&(h.defines.SRGB_TRANSFER="");let y=m0[p];y&&(h.defines[y]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=b.texture,v.setRenderTarget(m),v.render(d,u),m=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var vu=new Yt,Ql=new li(1,1),Mu=new Ps,bu=new qr,Su=new Fs,tu=[],nu=[],iu=new Float32Array(16),su=new Float32Array(9),ru=new Float32Array(4);function fs(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=tu[s];if(r===void 0&&(r=new Float32Array(s),tu[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Dt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Nt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function _o(i,e){let t=nu[e];t===void 0&&(t=new Int32Array(e),nu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function _0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function y0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;i.uniform2fv(this.addr,e),Nt(t,e)}}function x0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;i.uniform3fv(this.addr,e),Nt(t,e)}}function v0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;i.uniform4fv(this.addr,e),Nt(t,e)}}function M0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Dt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Nt(t,e)}else{if(Dt(t,n))return;ru.set(n),i.uniformMatrix2fv(this.addr,!1,ru),Nt(t,n)}}function b0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Dt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Nt(t,e)}else{if(Dt(t,n))return;su.set(n),i.uniformMatrix3fv(this.addr,!1,su),Nt(t,n)}}function S0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Dt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Nt(t,e)}else{if(Dt(t,n))return;iu.set(n),i.uniformMatrix4fv(this.addr,!1,iu),Nt(t,n)}}function E0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function w0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;i.uniform2iv(this.addr,e),Nt(t,e)}}function T0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;i.uniform3iv(this.addr,e),Nt(t,e)}}function A0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;i.uniform4iv(this.addr,e),Nt(t,e)}}function R0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function C0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;i.uniform2uiv(this.addr,e),Nt(t,e)}}function P0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;i.uniform3uiv(this.addr,e),Nt(t,e)}}function I0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;i.uniform4uiv(this.addr,e),Nt(t,e)}}function L0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ql.compareFunction=t.isReversedDepthBuffer()?co:lo,r=Ql):r=vu,t.setTexture2D(e||r,s)}function D0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||bu,s)}function N0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Su,s)}function U0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Mu,s)}function F0(i){switch(i){case 5126:return _0;case 35664:return y0;case 35665:return x0;case 35666:return v0;case 35674:return M0;case 35675:return b0;case 35676:return S0;case 5124:case 35670:return E0;case 35667:case 35671:return w0;case 35668:case 35672:return T0;case 35669:case 35673:return A0;case 5125:return R0;case 36294:return C0;case 36295:return P0;case 36296:return I0;case 35678:case 36198:case 36298:case 36306:case 35682:return L0;case 35679:case 36299:case 36307:return D0;case 35680:case 36300:case 36308:case 36293:return N0;case 36289:case 36303:case 36311:case 36292:return U0}}function B0(i,e){i.uniform1fv(this.addr,e)}function O0(i,e){let t=fs(e,this.size,2);i.uniform2fv(this.addr,t)}function k0(i,e){let t=fs(e,this.size,3);i.uniform3fv(this.addr,t)}function H0(i,e){let t=fs(e,this.size,4);i.uniform4fv(this.addr,t)}function z0(i,e){let t=fs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function G0(i,e){let t=fs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function V0(i,e){let t=fs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function W0(i,e){i.uniform1iv(this.addr,e)}function X0(i,e){i.uniform2iv(this.addr,e)}function q0(i,e){i.uniform3iv(this.addr,e)}function Y0(i,e){i.uniform4iv(this.addr,e)}function Z0(i,e){i.uniform1uiv(this.addr,e)}function K0(i,e){i.uniform2uiv(this.addr,e)}function $0(i,e){i.uniform3uiv(this.addr,e)}function J0(i,e){i.uniform4uiv(this.addr,e)}function j0(i,e,t){let n=this.cache,s=e.length,r=_o(t,s);Dt(n,r)||(i.uniform1iv(this.addr,r),Nt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Ql:a=vu;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Q0(i,e,t){let n=this.cache,s=e.length,r=_o(t,s);Dt(n,r)||(i.uniform1iv(this.addr,r),Nt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||bu,r[a])}function eg(i,e,t){let n=this.cache,s=e.length,r=_o(t,s);Dt(n,r)||(i.uniform1iv(this.addr,r),Nt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Su,r[a])}function tg(i,e,t){let n=this.cache,s=e.length,r=_o(t,s);Dt(n,r)||(i.uniform1iv(this.addr,r),Nt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Mu,r[a])}function ng(i){switch(i){case 5126:return B0;case 35664:return O0;case 35665:return k0;case 35666:return H0;case 35674:return z0;case 35675:return G0;case 35676:return V0;case 5124:case 35670:return W0;case 35667:case 35671:return X0;case 35668:case 35672:return q0;case 35669:case 35673:return Y0;case 5125:return Z0;case 36294:return K0;case 36295:return $0;case 36296:return J0;case 35678:case 36198:case 36298:case 36306:case 35682:return j0;case 35679:case 36299:case 36307:return Q0;case 35680:case 36300:case 36308:case 36293:return eg;case 36289:case 36303:case 36311:case 36292:return tg}}var ec=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=F0(t.type)}},tc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ng(t.type)}},nc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Jl=/(\w+)(\])?(\[|\.)?/g;function au(i,e){i.seq.push(e),i.map[e.id]=e}function ig(i,e,t){let n=i.name,s=n.length;for(Jl.lastIndex=0;;){let r=Jl.exec(n),a=Jl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){au(t,c===void 0?new ec(o,i,e):new tc(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new nc(o),au(t,d)),t=d}}}var ds=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);ig(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function ou(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var sg=37297,rg=0;function ag(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var lu=new ze;function og(i){nt._getMatrix(lu,nt.workingColorSpace,i);let e=`mat3( ${lu.elements.map(t=>t.toFixed(4))} )`;switch(nt.getTransfer(i)){case Rs:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return Be("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function cu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+ag(i.getShaderSource(e),o)}else return r}function lg(i,e){let t=og(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var cg={[Ml]:"Linear",[bl]:"Reinhard",[Sl]:"Cineon",[Ys]:"ACESFilmic",[wl]:"AgX",[Tl]:"Neutral",[El]:"Custom"};function hg(i,e){let t=cg[e];return t===void 0?(Be("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var uo=new P;function ug(){nt.getLuminanceCoefficients(uo);let i=uo.x.toFixed(4),e=uo.y.toFixed(4),t=uo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function dg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(rr).join(`
`)}function fg(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function pg(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function rr(i){return i!==""}function hu(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function uu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var mg=/^[ \t]*#include +<([\w\d./]+)>/gm;function ic(i){return i.replace(mg,_g)}var gg=new Map;function _g(i,e){let t=Ke[e];if(t===void 0){let n=gg.get(e);if(n!==void 0)t=Ke[n],Be('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return ic(t)}var yg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function du(i){return i.replace(yg,xg)}function xg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function fu(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var vg={[qs]:"SHADOWMAP_TYPE_PCF",[as]:"SHADOWMAP_TYPE_VSM"};function Mg(i){return vg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var bg={[fi]:"ENVMAP_TYPE_CUBE",[Ti]:"ENVMAP_TYPE_CUBE",[Zs]:"ENVMAP_TYPE_CUBE_UV"};function Sg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":bg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Eg={[Ti]:"ENVMAP_MODE_REFRACTION"};function wg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Eg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Tg={[vl]:"ENVMAP_BLENDING_MULTIPLY",[Ph]:"ENVMAP_BLENDING_MIX",[Ih]:"ENVMAP_BLENDING_ADD"};function Ag(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Tg[i.combine]||"ENVMAP_BLENDING_NONE"}function Rg(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Cg(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Mg(t),c=Sg(t),h=wg(t),d=Ag(t),u=Rg(t),f=dg(t),p=fg(r),x=s.createProgram(),g,m,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(rr).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(rr).join(`
`),m.length>0&&(m+=`
`)):(g=[fu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(rr).join(`
`),m=[fu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Sn?"#define TONE_MAPPING":"",t.toneMapping!==Sn?Ke.tonemapping_pars_fragment:"",t.toneMapping!==Sn?hg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,lg("linearToOutputTexel",t.outputColorSpace),ug(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(rr).join(`
`)),a=ic(a),a=hu(a,t),a=uu(a,t),o=ic(o),o=hu(o,t),o=uu(o,t),a=du(a),o=du(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===Ul?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ul?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let T=S+g+a,v=S+m+o,E=ou(s,s.VERTEX_SHADER,T),b=ou(s,s.FRAGMENT_SHADER,v);s.attachShader(x,E),s.attachShader(x,b),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function R(U){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(x)||"",k=s.getShaderInfoLog(E)||"",L=s.getShaderInfoLog(b)||"",G=F.trim(),Y=k.trim(),X=L.trim(),ae=!0,q=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(ae=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,E,b);else{let Q=cu(s,E,"vertex"),ne=cu(s,b,"fragment");Oe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+G+`
`+Q+`
`+ne)}else G!==""?Be("WebGLProgram: Program Info Log:",G):(Y===""||X==="")&&(q=!1);q&&(U.diagnostics={runnable:ae,programLog:G,vertexShader:{log:Y,prefix:g},fragmentShader:{log:X,prefix:m}})}s.deleteShader(E),s.deleteShader(b),y=new ds(s,x),w=pg(s,x)}let y;this.getUniforms=function(){return y===void 0&&R(this),y};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(x,sg)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=rg++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=b,this}var Pg=0,sc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new rc(e),t.set(e,n)),n}},rc=class{constructor(e){this.id=Pg++,this.code=e,this.usedTimes=0}};function Ig(i){return i===gi||i===er||i===tr}function Lg(i,e,t,n,s,r){let a=new Is,o=new sc,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(y){return l.add(y),y===0?"uv":`uv${y}`}function x(y,w,C,U,F,k){let L=U.fog,G=F.geometry,Y=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?U.environment:null,X=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,ae=e.get(y.envMap||Y,X),q=ae&&ae.mapping===Zs?ae.image.height:null,Q=f[y.type];y.precision!==null&&(u=n.getMaxPrecision(y.precision),u!==y.precision&&Be("WebGLProgram.getParameters:",y.precision,"not supported, using",u,"instead."));let ne=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Pe=ne!==void 0?ne.length:0,Ie=0;G.morphAttributes.position!==void 0&&(Ie=1),G.morphAttributes.normal!==void 0&&(Ie=2),G.morphAttributes.color!==void 0&&(Ie=3);let ft,et,rt,K;if(Q){let yt=On[Q];ft=yt.vertexShader,et=yt.fragmentShader}else{ft=y.vertexShader,et=y.fragmentShader;let yt=o.getVertexShaderStage(y),ht=o.getFragmentShaderStage(y);o.update(y,yt,ht),rt=yt.id,K=ht.id}let ee=i.getRenderTarget(),be=i.state.buffers.depth.getReversed(),ke=F.isInstancedMesh===!0,ve=F.isBatchedMesh===!0,Ge=!!y.map,Tt=!!y.matcap,$e=!!ae,st=!!y.aoMap,pt=!!y.lightMap,ie=!!y.bumpMap&&y.wireframe===!1,Ee=!!y.normalMap,Xe=!!y.displacementMap,vt=!!y.emissiveMap,ot=!!y.metalnessMap,lt=!!y.roughnessMap,I=y.anisotropy>0,Mt=y.clearcoat>0,tt=y.dispersion>0,A=y.retroreflectivity>0,_=y.iridescence>0,O=y.sheen>0,V=y.transmission>0,Z=I&&!!y.anisotropyMap,ce=Mt&&!!y.clearcoatMap,he=Mt&&!!y.clearcoatNormalMap,$=Mt&&!!y.clearcoatRoughnessMap,j=_&&!!y.iridescenceMap,ue=_&&!!y.iridescenceThicknessMap,Le=O&&!!y.sheenColorMap,me=O&&!!y.sheenRoughnessMap,de=!!y.specularMap,De=!!y.specularColorMap,Fe=!!y.specularIntensityMap,Ve=V&&!!y.transmissionMap,N=V&&!!y.thicknessMap,fe=!!y.gradientMap,J=!!y.alphaMap,pe=y.alphaTest>0,xe=!!y.alphaHash,se=!!y.extensions,Ue=Sn;y.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Ue=i.toneMapping);let Re={shaderID:Q,shaderType:y.type,shaderName:y.name,vertexShader:ft,fragmentShader:et,defines:y.defines,customVertexShaderID:rt,customFragmentShaderID:K,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:u,batching:ve,batchingColor:ve&&F._colorsTexture!==null,instancing:ke,instancingColor:ke&&F.instanceColor!==null,instancingMorph:ke&&F.morphTexture!==null,outputColorSpace:ee===null?i.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:nt.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:Ge,matcap:Tt,envMap:$e,envMapMode:$e&&ae.mapping,envMapCubeUVHeight:q,aoMap:st,lightMap:pt,bumpMap:ie,normalMap:Ee,displacementMap:Xe,emissiveMap:vt,normalMapObjectSpace:Ee&&y.normalMapType===Nh,normalMapTangentSpace:Ee&&y.normalMapType===oo,packedNormalMap:Ee&&y.normalMapType===oo&&Ig(y.normalMap.format),metalnessMap:ot,roughnessMap:lt,anisotropy:I,anisotropyMap:Z,clearcoat:Mt,clearcoatMap:ce,clearcoatNormalMap:he,clearcoatRoughnessMap:$,dispersion:tt,retroreflection:A,iridescence:_,iridescenceMap:j,iridescenceThicknessMap:ue,sheen:O,sheenColorMap:Le,sheenRoughnessMap:me,specularMap:de,specularColorMap:De,specularIntensityMap:Fe,transmission:V,transmissionMap:Ve,thicknessMap:N,gradientMap:fe,opaque:y.transparent===!1&&y.blending===os&&y.alphaToCoverage===!1,alphaMap:J,alphaTest:pe,alphaHash:xe,combine:y.combine,mapUv:Ge&&p(y.map.channel),aoMapUv:st&&p(y.aoMap.channel),lightMapUv:pt&&p(y.lightMap.channel),bumpMapUv:ie&&p(y.bumpMap.channel),normalMapUv:Ee&&p(y.normalMap.channel),displacementMapUv:Xe&&p(y.displacementMap.channel),emissiveMapUv:vt&&p(y.emissiveMap.channel),metalnessMapUv:ot&&p(y.metalnessMap.channel),roughnessMapUv:lt&&p(y.roughnessMap.channel),anisotropyMapUv:Z&&p(y.anisotropyMap.channel),clearcoatMapUv:ce&&p(y.clearcoatMap.channel),clearcoatNormalMapUv:he&&p(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&p(y.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&p(y.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&p(y.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&p(y.sheenColorMap.channel),sheenRoughnessMapUv:me&&p(y.sheenRoughnessMap.channel),specularMapUv:de&&p(y.specularMap.channel),specularColorMapUv:De&&p(y.specularColorMap.channel),specularIntensityMapUv:Fe&&p(y.specularIntensityMap.channel),transmissionMapUv:Ve&&p(y.transmissionMap.channel),thicknessMapUv:N&&p(y.thicknessMap.channel),alphaMapUv:J&&p(y.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Ee||I),vertexNormals:!!G.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!G.attributes.uv&&(Ge||J),fog:!!L,useFog:y.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||G.attributes.normal===void 0&&Ee===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:be,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:G.attributes.position!==void 0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Pe,morphTextureStride:Ie,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ue,decodeVideoTexture:Ge&&y.map.isVideoTexture===!0&&nt.getTransfer(y.map.colorSpace)===dt,decodeVideoTextureEmissive:vt&&y.emissiveMap.isVideoTexture===!0&&nt.getTransfer(y.emissiveMap.colorSpace)===dt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===It,flipSided:y.side===Zt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:se&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&y.extensions.multiDraw===!0||ve)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Re.vertexUv1s=l.has(1),Re.vertexUv2s=l.has(2),Re.vertexUv3s=l.has(3),l.clear(),Re}function g(y){let w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(let C in y.defines)w.push(C),w.push(y.defines[C]);return y.isRawShaderMaterial===!1&&(m(w,y),S(w,y),w.push(i.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function m(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numSunLights),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numSunLightShadows),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function S(y,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),y.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),y.push(a.mask)}function T(y){let w=f[y.type],C;if(w){let U=On[w];C=Zh.clone(U.uniforms)}else C=y.uniforms;return C}function v(y,w){let C=h.get(w);return C!==void 0?++C.usedTimes:(C=new Cg(i,w,y,s),c.push(C),h.set(w,C)),C}function E(y){if(--y.usedTimes===0){let w=c.indexOf(y);c[w]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function b(y){o.remove(y)}function R(){o.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:T,acquireProgram:v,releaseProgram:E,releaseShaderCache:b,programs:c,dispose:R}}function Dg(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Ng(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function pu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function mu(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,p,x,g,m){let S=i[e];return S===void 0?(S={id:u.id,object:u,geometry:f,material:p,materialVariant:a(u),groupOrder:x,renderOrder:u.renderOrder,z:g,group:m},i[e]=S):(S.id=u.id,S.object=u,S.geometry=f,S.material=p,S.materialVariant=a(u),S.groupOrder=x,S.renderOrder=u.renderOrder,S.z=g,S.group=m),e++,S}function l(u,f,p,x,g,m,S){S.reversedDepth===!0&&(g=-g);let T=o(u,f,p,x,g,m);p.transmission>0?n.push(T):p.transparent===!0?s.push(T):t.push(T)}function c(u,f,p,x,g,m){let S=o(u,f,p,x,g,m);p.transmission>0?n.unshift(S):p.transparent===!0?s.unshift(S):t.unshift(S)}function h(u,f){t.length>1&&t.sort(u||Ng),n.length>1&&n.sort(f||pu),s.length>1&&s.sort(f||pu)}function d(){for(let u=e,f=i.length;u<f;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function Ug(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new mu,i.set(n,[a])):s>=r.length?(a=new mu,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Fg(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new P,color:new We};break;case"SpotLight":t={position:new P,direction:new P,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new We,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new We,groundColor:new We};break;case"RectAreaLight":t={color:new We,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function Bg(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Og=0;function kg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Hg(i){let e=new Fg,t=Bg(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new Et,a=new Et;function o(c){let h=0,d=0,u=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let f=0,p=0,x=0,g=0,m=0,S=0,T=0,v=0,E=0,b=0,R=0,y=0,w=0,C=0;c.sort(kg);for(let F=0,k=c.length;F<k;F++){let L=c[F],G=L.color,Y=L.intensity,X=L.distance,ae=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===gi?ae=L.shadow.map.texture:ae=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=G.r*Y,d+=G.g*Y,u+=G.b*Y;else if(L.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(L.sh.coefficients[q],Y);C++}else if(L.isSunLight){let q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Q=L.shadow,ne=t.get(L);ne.shadowIntensity=Q.intensity,ne.shadowBias=Q.bias,ne.shadowNormalBias=Q.normalBias,ne.shadowRadius=Q.radius,ne.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),n.sunShadow[p]=ne,n.sunShadowMap[p]=ae;let Pe=Q.getViewportCount();for(let Ie=0;Ie<Pe;Ie++)n.sunShadowMatrix[x+Ie]=Q.getMatrix(Ie),n.sunShadowCascade[x+Ie]=Q._cascadeData[Ie];x+=Pe,p++}n.sun[f]=q,f++}else if(L.isDirectionalLight){let q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Q=L.shadow,ne=t.get(L);ne.shadowIntensity=Q.intensity,ne.shadowBias=Q.bias,ne.shadowNormalBias=Q.normalBias,ne.shadowRadius=Q.radius,ne.shadowMapSize=Q.mapSize,n.directionalShadow[g]=ne,n.directionalShadowMap[g]=ae,n.directionalShadowMatrix[g]=L.shadow.matrix,E++}n.directional[g]=q,g++}else if(L.isSpotLight){let q=e.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(G).multiplyScalar(Y),q.distance=X,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,n.spot[S]=q;let Q=L.shadow;if(L.map&&(n.spotLightMap[y]=L.map,y++,Q.updateMatrices(L),L.castShadow&&w++),n.spotLightMatrix[S]=Q.matrix,L.castShadow){let ne=t.get(L);ne.shadowIntensity=Q.intensity,ne.shadowBias=Q.bias,ne.shadowNormalBias=Q.normalBias,ne.shadowRadius=Q.radius,ne.shadowMapSize=Q.mapSize,n.spotShadow[S]=ne,n.spotShadowMap[S]=ae,R++}S++}else if(L.isRectAreaLight){let q=e.get(L);q.color.copy(G).multiplyScalar(Y),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),n.rectArea[T]=q,T++}else if(L.isPointLight){let q=e.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){let Q=L.shadow,ne=t.get(L);ne.shadowIntensity=Q.intensity,ne.shadowBias=Q.bias,ne.shadowNormalBias=Q.normalBias,ne.shadowRadius=Q.radius,ne.shadowMapSize=Q.mapSize,ne.shadowCameraNear=Q.camera.near,ne.shadowCameraFar=Q.camera.far,n.pointShadow[m]=ne,n.pointShadowMap[m]=ae,n.pointShadowMatrix[m]=L.shadow.matrix,b++}n.point[m]=q,m++}else if(L.isHemisphereLight){let q=e.get(L);q.skyColor.copy(L.color).multiplyScalar(Y),q.groundColor.copy(L.groundColor).multiplyScalar(Y),n.hemi[v]=q,v++}}T>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ge.LTC_FLOAT_1,n.rectAreaLTC2=ge.LTC_FLOAT_2):(n.rectAreaLTC1=ge.LTC_HALF_1,n.rectAreaLTC2=ge.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let U=n.hash;(U.sunLength!==f||U.directionalLength!==g||U.pointLength!==m||U.spotLength!==S||U.rectAreaLength!==T||U.hemiLength!==v||U.numSunShadows!==p||U.numDirectionalShadows!==E||U.numPointShadows!==b||U.numSpotShadows!==R||U.numSpotMaps!==y||U.numLightProbes!==C)&&(n.sun.length=f,n.directional.length=g,n.spot.length=S,n.rectArea.length=T,n.point.length=m,n.hemi.length=v,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.directionalShadowMatrix.length=E,n.pointShadow.length=b,n.pointShadowMap.length=b,n.pointShadowMatrix.length=b,n.spotShadow.length=R,n.spotShadowMap.length=R,n.spotLightMatrix.length=R+y-w,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,U.sunLength=f,U.directionalLength=g,U.pointLength=m,U.spotLength=S,U.rectAreaLength=T,U.hemiLength=v,U.numSunShadows=p,U.numDirectionalShadows=E,U.numPointShadows=b,U.numSpotShadows=R,U.numSpotMaps=y,U.numLightProbes=C,n.version=Og++)}function l(c,h){let d=0,u=0,f=0,p=0,x=0,g=0,m=h.matrixWorldInverse;for(let S=0,T=c.length;S<T;S++){let v=c[S];if(v.isSunLight){let E=n.sun[d];E.direction.setFromMatrixPosition(v.matrixWorld),E.direction.transformDirection(m),d++}else if(v.isDirectionalLight){let E=n.directional[u];E.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),u++}else if(v.isSpotLight){let E=n.spot[p];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),p++}else if(v.isRectAreaLight){let E=n.rectArea[x];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(m),a.identity(),r.copy(v.matrixWorld),r.premultiply(m),a.extractRotation(r),E.halfWidth.set(v.width*.5,0,0),E.halfHeight.set(0,v.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),x++}else if(v.isPointLight){let E=n.point[f];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){let E=n.hemi[g];E.direction.setFromMatrixPosition(v.matrixWorld),E.direction.transformDirection(m),g++}}}return{setup:o,setupView:l,state:n}}function gu(i){let e=new Hg(i),t=[],n=[],s=[];function r(u){d.camera=u,t.length=0,n.length=0,s.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){e.setup(t)}function h(u){e.setupView(t,u)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function zg(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new gu(i),e.set(s,[o])):r>=a.length?(o=new gu(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Gg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Wg=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],Xg=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],_u=new Et,sr=new P,jl=new P;function qg(i,e,t){let n=new ts,s=new Ne,r=new Ne,a=new wt,o=new ra,l=new aa,c={},h=t.maxTextureSize,d={[di]:Zt,[Zt]:di,[It]:It},u=new sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ne},radius:{value:4}},vertexShader:Gg,fragmentShader:Vg}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let p=new Ot;p.setAttribute("position",new Jt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new B(p,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qs;let m=this.type;this.render=function(b,R,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;this.type===Ma&&(Be("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=qs);let w=i.getRenderTarget(),C=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Fn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let k=m!==this.type;k&&R.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(G=>G.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,G=b.length;L<G;L++){let Y=b[L],X=Y.shadow;if(X===void 0){Be("WebGLShadowMap:",Y,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let ae=X.getFrameExtents();s.multiply(ae),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ae.x),s.x=r.x*ae.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ae.y),s.y=r.y*ae.y,X.mapSize.y=r.y));let q=i.state.buffers.depth.getReversed();if(X.camera._reversedDepth=q,X.map===null||k===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===as){if(Y.isPointLight){Be("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new jt(s.x,s.y,{format:gi,type:Tn,minFilter:Bt,magFilter:Bt,generateMipmaps:!1}),X.map.texture.name=Y.name+".shadowMap",X.map.depthTexture=new li(s.x,s.y,wn),X.map.depthTexture.name=Y.name+".shadowMapDepth",X.map.depthTexture.format=Dn,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Ft,X.map.depthTexture.magFilter=Ft}else Y.isPointLight?(X.map=new po(s.x),X.map.depthTexture=new Kr(s.x,En)):(X.map=new jt(s.x,s.y),X.map.depthTexture=new li(s.x,s.y,En)),X.map.depthTexture.name=Y.name+".shadowMap",X.map.depthTexture.format=Dn,this.type===qs?(X.map.depthTexture.compareFunction=q?co:lo,X.map.depthTexture.minFilter=Bt,X.map.depthTexture.magFilter=Bt):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Ft,X.map.depthTexture.magFilter=Ft);X.camera.updateProjectionMatrix()}X.map.isWebGLCubeRenderTarget!==!0&&(X.map.width!==s.x||X.map.height!==s.y)&&X.map.setSize(s.x,s.y);let Q=X.map.isWebGLCubeRenderTarget?6:X.getViewportCount();Y.isPointLight!==!0&&X.updateMatrices(Y,y);for(let ne=0;ne<Q;ne++){let Pe=X.getCamera(ne);if(Y.isPointLight){let Ie=X.camera,ft=X.matrix,et=Y.distance||Ie.far;et!==Ie.far&&(Ie.far=et,Ie.updateProjectionMatrix()),sr.setFromMatrixPosition(Y.matrixWorld),Ie.position.copy(sr),jl.copy(Ie.position),jl.add(Wg[ne]),Ie.up.copy(Xg[ne]),Ie.lookAt(jl),Ie.updateMatrixWorld(),ft.makeTranslation(-sr.x,-sr.y,-sr.z),_u.multiplyMatrices(Ie.projectionMatrix,Ie.matrixWorldInverse),X._frustum.setFromProjectionMatrix(_u,Ie.coordinateSystem,Ie.reversedDepth)}if(X.map.isWebGLCubeRenderTarget)i.setRenderTarget(X.map,ne),i.clear();else{ne===0&&(i.setRenderTarget(X.map),i.clear());let Ie=X.getViewport(ne);a.set(r.x*Ie.x,r.y*Ie.y,r.x*Ie.z,r.y*Ie.w),F.viewport(a)}n=X.getFrustum(ne),v(R,y,Pe,Y,this.type)}X.isPointLightShadow!==!0&&this.type===as&&S(X,y),X.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(w,C,U)};function S(b,R){let y=e.update(x);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null?b.mapPass=new jt(s.x,s.y,{format:gi,type:Tn}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value.set(b.map.width,b.map.height),u.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(R,null,y,u,x,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value.set(b.map.width,b.map.height),f.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(R,null,y,f,x,null)}function T(b,R,y,w){let C=null,U=y.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(U!==void 0)C=U;else if(C=y.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let F=C.uuid,k=R.uuid,L=c[F];L===void 0&&(L={},c[F]=L);let G=L[k];G===void 0&&(G=C.clone(),L[k]=G,R.addEventListener("dispose",E)),C=G}if(C.visible=R.visible,C.wireframe=R.wireframe,w===as?C.side=R.shadowSide!==null?R.shadowSide:R.side:C.side=R.shadowSide!==null?R.shadowSide:d[R.side],C.alphaMap=R.alphaMap,C.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,C.map=R.map,C.clipShadows=R.clipShadows,C.clippingPlanes=R.clippingPlanes,C.clipIntersection=R.clipIntersection,C.displacementMap=R.displacementMap,C.displacementScale=R.displacementScale,C.displacementBias=R.displacementBias,C.wireframeLinewidth=R.wireframeLinewidth,C.linewidth=R.linewidth,y.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let F=i.properties.get(C);F.light=y}return C}function v(b,R,y,w,C){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&C===as)&&(!b.frustumCulled||b.intersectsFrustum(n))){b.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,b.matrixWorld);let k=e.update(b),L=b.material;if(Array.isArray(L)){let G=k.groups;for(let Y=0,X=G.length;Y<X;Y++){let ae=G[Y],q=L[ae.materialIndex];if(q&&q.visible){let Q=T(b,q,w,C);b.onBeforeShadow(i,b,R,y,k,Q,ae),i.renderBufferDirect(y,null,k,Q,b,ae),b.onAfterShadow(i,b,R,y,k,Q,ae)}}}else if(L.visible){let G=T(b,L,w,C);b.onBeforeShadow(i,b,R,y,k,G,null),i.renderBufferDirect(y,null,k,G,b,null),b.onAfterShadow(i,b,R,y,k,G,null)}}let F=b.children;for(let k=0,L=F.length;k<L;k++)v(F[k],R,y,w,C)}function E(b){b.target.removeEventListener("dispose",E);for(let y in c){let w=c[y],C=b.target.uuid;C in w&&(w[C].dispose(),delete w[C])}}}function Yg(i,e){function t(){let N=!1,fe=new wt,J=null,pe=new wt(0,0,0,0);return{setMask:function(xe){J!==xe&&!N&&(i.colorMask(xe,xe,xe,xe),J=xe)},setLocked:function(xe){N=xe},setClear:function(xe,se,Ue,Re,yt){yt===!0&&(xe*=Re,se*=Re,Ue*=Re),fe.set(xe,se,Ue,Re),pe.equals(fe)===!1&&(i.clearColor(xe,se,Ue,Re),pe.copy(fe))},reset:function(){N=!1,J=null,pe.set(-1,0,0,0)}}}function n(){let N=!1,fe=!1,J=null,pe=null,xe=null;return{setReversed:function(se){if(fe!==se){let Ue=e.get("EXT_clip_control");se?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT),fe=se;let Re=xe;xe=null,this.setClear(Re)}},getReversed:function(){return fe},setTest:function(se){se?ee(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(se){J!==se&&!N&&(i.depthMask(se),J=se)},setFunc:function(se){if(fe&&(se=qh[se]),pe!==se){switch(se){case Nr:i.depthFunc(i.NEVER);break;case Ur:i.depthFunc(i.ALWAYS);break;case Fr:i.depthFunc(i.LESS);break;case Zi:i.depthFunc(i.LEQUAL);break;case Br:i.depthFunc(i.EQUAL);break;case Or:i.depthFunc(i.GEQUAL);break;case kr:i.depthFunc(i.GREATER);break;case Hr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}pe=se}},setLocked:function(se){N=se},setClear:function(se){xe!==se&&(xe=se,fe&&(se=1-se),i.clearDepth(se))},reset:function(){N=!1,J=null,pe=null,xe=null,fe=!1}}}function s(){let N=!1,fe=null,J=null,pe=null,xe=null,se=null,Ue=null,Re=null,yt=null;return{setTest:function(ht){N||(ht?ee(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(ht){fe!==ht&&!N&&(i.stencilMask(ht),fe=ht)},setFunc:function(ht,mn,Pn){(J!==ht||pe!==mn||xe!==Pn)&&(i.stencilFunc(ht,mn,Pn),J=ht,pe=mn,xe=Pn)},setOp:function(ht,mn,Pn){(se!==ht||Ue!==mn||Re!==Pn)&&(i.stencilOp(ht,mn,Pn),se=ht,Ue=mn,Re=Pn)},setLocked:function(ht){N=ht},setClear:function(ht){yt!==ht&&(i.clearStencil(ht),yt=ht)},reset:function(){N=!1,fe=null,J=null,pe=null,xe=null,se=null,Ue=null,Re=null,yt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,p=[],x=null,g=!1,m=null,S=null,T=null,v=null,E=null,b=null,R=null,y=new We(0,0,0),w=0,C=!1,U=null,F=null,k=null,L=null,G=null,Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),X=!1,ae=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(ae=parseFloat(/^WebGL (\d)/.exec(q)[1]),X=ae>=1):q.indexOf("OpenGL ES")!==-1&&(ae=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),X=ae>=2);let Q=null,ne={},Pe=i.getParameter(i.SCISSOR_BOX),Ie=i.getParameter(i.VIEWPORT),ft=new wt().fromArray(Pe),et=new wt().fromArray(Ie);function rt(N,fe,J,pe){let xe=new Uint8Array(4),se=i.createTexture();i.bindTexture(N,se),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ue=0;Ue<J;Ue++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(fe,0,i.RGBA,1,1,pe,0,i.RGBA,i.UNSIGNED_BYTE,xe):i.texImage2D(fe+Ue,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xe);return se}let K={};K[i.TEXTURE_2D]=rt(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(i.DEPTH_TEST),a.setFunc(Zi),ie(!1),Ee(pl),ee(i.CULL_FACE),st(Fn);function ee(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function be(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function ke(N,fe){return u[N]!==fe?(i.bindFramebuffer(N,fe),u[N]=fe,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=fe),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=fe),!0):!1}function ve(N,fe){let J=p,pe=!1;if(N){J=f.get(fe),J===void 0&&(J=[],f.set(fe,J));let xe=N.textures;if(J.length!==xe.length||J[0]!==i.COLOR_ATTACHMENT0){for(let se=0,Ue=xe.length;se<Ue;se++)J[se]=i.COLOR_ATTACHMENT0+se;J.length=xe.length,pe=!0}}else J[0]!==i.BACK&&(J[0]=i.BACK,pe=!0);pe&&i.drawBuffers(J)}function Ge(N){return x!==N?(i.useProgram(N),x=N,!0):!1}let Tt={[wi]:i.FUNC_ADD,[fh]:i.FUNC_SUBTRACT,[ph]:i.FUNC_REVERSE_SUBTRACT};Tt[mh]=i.MIN,Tt[gh]=i.MAX;let $e={[_h]:i.ZERO,[yh]:i.ONE,[xh]:i.SRC_COLOR,[yl]:i.SRC_ALPHA,[wh]:i.SRC_ALPHA_SATURATE,[Sh]:i.DST_COLOR,[Mh]:i.DST_ALPHA,[vh]:i.ONE_MINUS_SRC_COLOR,[xl]:i.ONE_MINUS_SRC_ALPHA,[Eh]:i.ONE_MINUS_DST_COLOR,[bh]:i.ONE_MINUS_DST_ALPHA,[Th]:i.CONSTANT_COLOR,[Ah]:i.ONE_MINUS_CONSTANT_COLOR,[Rh]:i.CONSTANT_ALPHA,[Ch]:i.ONE_MINUS_CONSTANT_ALPHA};function st(N,fe,J,pe,xe,se,Ue,Re,yt,ht){if(N===Fn){g===!0&&(be(i.BLEND),g=!1);return}if(g===!1&&(ee(i.BLEND),g=!0),N!==dh){if(N!==m||ht!==C){if((S!==wi||E!==wi)&&(i.blendEquation(i.FUNC_ADD),S=wi,E=wi),ht)switch(N){case os:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ml:i.blendFunc(i.ONE,i.ONE);break;case gl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _l:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Oe("WebGLState: Invalid blending: ",N);break}else switch(N){case os:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ml:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case gl:Oe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _l:Oe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Oe("WebGLState: Invalid blending: ",N);break}T=null,v=null,b=null,R=null,y.set(0,0,0),w=0,m=N,C=ht}return}xe=xe||fe,se=se||J,Ue=Ue||pe,(fe!==S||xe!==E)&&(i.blendEquationSeparate(Tt[fe],Tt[xe]),S=fe,E=xe),(J!==T||pe!==v||se!==b||Ue!==R)&&(i.blendFuncSeparate($e[J],$e[pe],$e[se],$e[Ue]),T=J,v=pe,b=se,R=Ue),(Re.equals(y)===!1||yt!==w)&&(i.blendColor(Re.r,Re.g,Re.b,yt),y.copy(Re),w=yt),m=N,C=!1}function pt(N,fe){N.side===It?be(i.CULL_FACE):ee(i.CULL_FACE);let J=N.side===Zt;fe&&(J=!J),ie(J),N.blending===os&&N.transparent===!1?st(Fn):st(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);let pe=N.stencilWrite;o.setTest(pe),pe&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),vt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ee(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function ie(N){U!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),U=N)}function Ee(N){N!==hh?(ee(i.CULL_FACE),N!==F&&(N===pl?i.cullFace(i.BACK):N===uh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),F=N}function Xe(N){N!==k&&(X&&i.lineWidth(N),k=N)}function vt(N,fe,J){N?(ee(i.POLYGON_OFFSET_FILL),(L!==fe||G!==J)&&(L=fe,G=J,a.getReversed()&&(fe=-fe),i.polygonOffset(fe,J))):be(i.POLYGON_OFFSET_FILL)}function ot(N){N?ee(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function lt(N){N===void 0&&(N=i.TEXTURE0+Y-1),Q!==N&&(i.activeTexture(N),Q=N)}function I(N,fe,J){J===void 0&&(Q===null?J=i.TEXTURE0+Y-1:J=Q);let pe=ne[J];pe===void 0&&(pe={type:void 0,texture:void 0},ne[J]=pe),(pe.type!==N||pe.texture!==fe)&&(Q!==J&&(i.activeTexture(J),Q=J),i.bindTexture(N,fe||K[N]),pe.type=N,pe.texture=fe)}function Mt(){let N=ne[Q];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function tt(){try{i.compressedTexImage2D(...arguments)}catch(N){Oe("WebGLState:",N)}}function A(){try{i.compressedTexImage3D(...arguments)}catch(N){Oe("WebGLState:",N)}}function _(){try{i.texSubImage2D(...arguments)}catch(N){Oe("WebGLState:",N)}}function O(){try{i.texSubImage3D(...arguments)}catch(N){Oe("WebGLState:",N)}}function V(){try{i.compressedTexSubImage2D(...arguments)}catch(N){Oe("WebGLState:",N)}}function Z(){try{i.compressedTexSubImage3D(...arguments)}catch(N){Oe("WebGLState:",N)}}function ce(){try{i.texStorage2D(...arguments)}catch(N){Oe("WebGLState:",N)}}function he(){try{i.texStorage3D(...arguments)}catch(N){Oe("WebGLState:",N)}}function $(){try{i.texImage2D(...arguments)}catch(N){Oe("WebGLState:",N)}}function j(){try{i.texImage3D(...arguments)}catch(N){Oe("WebGLState:",N)}}function ue(N){return d[N]!==void 0?d[N]:i.getParameter(N)}function Le(N,fe){d[N]!==fe&&(i.pixelStorei(N,fe),d[N]=fe)}function me(N){ft.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),ft.copy(N))}function de(N){et.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),et.copy(N))}function De(N,fe){let J=c.get(fe);J===void 0&&(J=new WeakMap,c.set(fe,J));let pe=J.get(N);pe===void 0&&(pe=i.getUniformBlockIndex(fe,N.name),J.set(N,pe))}function Fe(N,fe){let pe=c.get(fe).get(N);l.get(fe)!==pe&&(i.uniformBlockBinding(fe,pe,N.__bindingPointIndex),l.set(fe,pe))}function Ve(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},Q=null,ne={},u={},f=new WeakMap,p=[],x=null,g=!1,m=null,S=null,T=null,v=null,E=null,b=null,R=null,y=new We(0,0,0),w=0,C=!1,U=null,F=null,k=null,L=null,G=null,ft.set(0,0,i.canvas.width,i.canvas.height),et.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ee,disable:be,bindFramebuffer:ke,drawBuffers:ve,useProgram:Ge,setBlending:st,setMaterial:pt,setFlipSided:ie,setCullFace:Ee,setLineWidth:Xe,setPolygonOffset:vt,setScissorTest:ot,activeTexture:lt,bindTexture:I,unbindTexture:Mt,compressedTexImage2D:tt,compressedTexImage3D:A,texImage2D:$,texImage3D:j,pixelStorei:Le,getParameter:ue,updateUBOMapping:De,uniformBlockBinding:Fe,texStorage2D:ce,texStorage3D:he,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:V,compressedTexSubImage3D:Z,scissor:me,viewport:de,reset:Ve}}function Zg(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ne,h=new WeakMap,d=new Set,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(A,_){return p?new OffscreenCanvas(A,_):Cs("canvas")}function g(A,_,O){let V=1,Z=tt(A);if((Z.width>O||Z.height>O)&&(V=O/Math.max(Z.width,Z.height)),V<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let ce=Math.floor(V*Z.width),he=Math.floor(V*Z.height);u===void 0&&(u=x(ce,he));let $=_?x(ce,he):u;return $.width=ce,$.height=he,$.getContext("2d").drawImage(A,0,0,ce,he),Be("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+ce+"x"+he+")."),$}else return"data"in A&&Be("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),A;return A}function m(A){return A.generateMipmaps}function S(A){i.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(A,_,O,V,Z,ce=!1){if(A!==null){if(i[A]!==void 0)return i[A];Be("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let he;V&&(he=e.get("EXT_texture_norm16"),he||Be("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=_;if(_===i.RED&&(O===i.FLOAT&&($=i.R32F),O===i.HALF_FLOAT&&($=i.R16F),O===i.UNSIGNED_BYTE&&($=i.R8),O===i.UNSIGNED_SHORT&&he&&($=he.R16_EXT),O===i.SHORT&&he&&($=he.R16_SNORM_EXT)),_===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.R8UI),O===i.UNSIGNED_SHORT&&($=i.R16UI),O===i.UNSIGNED_INT&&($=i.R32UI),O===i.BYTE&&($=i.R8I),O===i.SHORT&&($=i.R16I),O===i.INT&&($=i.R32I)),_===i.RG&&(O===i.FLOAT&&($=i.RG32F),O===i.HALF_FLOAT&&($=i.RG16F),O===i.UNSIGNED_BYTE&&($=i.RG8),O===i.UNSIGNED_SHORT&&he&&($=he.RG16_EXT),O===i.SHORT&&he&&($=he.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.RG8UI),O===i.UNSIGNED_SHORT&&($=i.RG16UI),O===i.UNSIGNED_INT&&($=i.RG32UI),O===i.BYTE&&($=i.RG8I),O===i.SHORT&&($=i.RG16I),O===i.INT&&($=i.RG32I)),_===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.RGB8UI),O===i.UNSIGNED_SHORT&&($=i.RGB16UI),O===i.UNSIGNED_INT&&($=i.RGB32UI),O===i.BYTE&&($=i.RGB8I),O===i.SHORT&&($=i.RGB16I),O===i.INT&&($=i.RGB32I)),_===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.RGBA8UI),O===i.UNSIGNED_SHORT&&($=i.RGBA16UI),O===i.UNSIGNED_INT&&($=i.RGBA32UI),O===i.BYTE&&($=i.RGBA8I),O===i.SHORT&&($=i.RGBA16I),O===i.INT&&($=i.RGBA32I)),_===i.RGB&&(O===i.UNSIGNED_SHORT&&he&&($=he.RGB16_EXT),O===i.SHORT&&he&&($=he.RGB16_SNORM_EXT),O===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),_===i.RGBA){let j=ce?Rs:nt.getTransfer(Z);O===i.FLOAT&&($=i.RGBA32F),O===i.HALF_FLOAT&&($=i.RGBA16F),O===i.UNSIGNED_BYTE&&($=j===dt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT&&he&&($=he.RGBA16_EXT),O===i.SHORT&&he&&($=he.RGBA16_SNORM_EXT),O===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function E(A,_){let O;return A?_===null||_===En||_===cs?O=i.DEPTH24_STENCIL8:_===wn?O=i.DEPTH32F_STENCIL8:_===ls&&(O=i.DEPTH24_STENCIL8,Be("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===En||_===cs?O=i.DEPTH_COMPONENT24:_===wn?O=i.DEPTH_COMPONENT32F:_===ls&&(O=i.DEPTH_COMPONENT16),O}function b(A,_){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ft&&A.minFilter!==Bt?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function R(A){let _=A.target;_.removeEventListener("dispose",R),w(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&d.delete(_)}function y(A){let _=A.target;_.removeEventListener("dispose",y),U(_)}function w(A){let _=n.get(A);if(_.__webglInit===void 0)return;let O=A.source,V=f.get(O);if(V){let Z=V[_.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&C(A),Object.keys(V).length===0&&f.delete(O)}n.remove(A)}function C(A){let _=n.get(A);i.deleteTexture(_.__webglTexture);let O=A.source,V=f.get(O);delete V[_.__cacheKey],a.memory.textures--}function U(A){let _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(_.__webglFramebuffer[V]))for(let Z=0;Z<_.__webglFramebuffer[V].length;Z++)i.deleteFramebuffer(_.__webglFramebuffer[V][Z]);else i.deleteFramebuffer(_.__webglFramebuffer[V]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[V])}else{if(Array.isArray(_.__webglFramebuffer))for(let V=0;V<_.__webglFramebuffer.length;V++)i.deleteFramebuffer(_.__webglFramebuffer[V]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let V=0;V<_.__webglColorRenderbuffer.length;V++)_.__webglColorRenderbuffer[V]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[V]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let O=A.textures;for(let V=0,Z=O.length;V<Z;V++){let ce=n.get(O[V]);ce.__webglTexture&&(i.deleteTexture(ce.__webglTexture),a.memory.textures--),n.remove(O[V])}n.remove(A)}let F=0;function k(){F=0}function L(){return F}function G(A){F=A}function Y(){let A=F;return A>=s.maxTextures&&Be("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+s.maxTextures),F+=1,A}function X(A){let _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function ae(A,_){let O=n.get(A);if(A.isVideoTexture&&I(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&O.__version!==A.version){let V=A.image;if(V===null)Be("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)Be("WebGLRenderer: Texture marked for update but image is incomplete");else{be(O,A,_);return}}else A.isExternalTexture&&(O.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+_)}function q(A,_){let O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){be(O,A,_);return}else A.isExternalTexture&&(O.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+_)}function Q(A,_){let O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){be(O,A,_);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+_)}function ne(A,_){let O=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&O.__version!==A.version){ke(O,A,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+_)}let Pe={[Ki]:i.REPEAT,[qt]:i.CLAMP_TO_EDGE,[zr]:i.MIRRORED_REPEAT},Ie={[Ft]:i.NEAREST,[Lh]:i.NEAREST_MIPMAP_NEAREST,[Ks]:i.NEAREST_MIPMAP_LINEAR,[Bt]:i.LINEAR,[Ea]:i.LINEAR_MIPMAP_NEAREST,[pi]:i.LINEAR_MIPMAP_LINEAR},ft={[Fh]:i.NEVER,[zh]:i.ALWAYS,[Bh]:i.LESS,[lo]:i.LEQUAL,[Oh]:i.EQUAL,[co]:i.GEQUAL,[kh]:i.GREATER,[Hh]:i.NOTEQUAL};function et(A,_){if(_.type===wn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Bt||_.magFilter===Ea||_.magFilter===Ks||_.magFilter===pi||_.minFilter===Bt||_.minFilter===Ea||_.minFilter===Ks||_.minFilter===pi)&&Be("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,Pe[_.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Pe[_.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Pe[_.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,Ie[_.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,Ie[_.minFilter]),_.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,ft[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ft||_.minFilter!==Ks&&_.minFilter!==pi||_.type===wn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function rt(A,_){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",R));let V=_.source,Z=f.get(V);Z===void 0&&(Z={},f.set(V,Z));let ce=X(_);if(ce!==A.__cacheKey){Z[ce]===void 0&&(Z[ce]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Z[ce].usedTimes++;let he=Z[A.__cacheKey];he!==void 0&&(Z[A.__cacheKey].usedTimes--,he.usedTimes===0&&C(_)),A.__cacheKey=ce,A.__webglTexture=Z[ce].texture}return O}function K(A,_,O){return Math.floor(Math.floor(A/O)/_)}function ee(A,_,O,V){let ce=A.updateRanges;if(ce.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,O,V,_.data);else{ce.sort((Le,me)=>Le.start-me.start);let he=0;for(let Le=1;Le<ce.length;Le++){let me=ce[he],de=ce[Le],De=me.start+me.count,Fe=K(de.start,_.width,4),Ve=K(me.start,_.width,4);de.start<=De+1&&Fe===Ve&&K(de.start+de.count-1,_.width,4)===Fe?me.count=Math.max(me.count,de.start+de.count-me.start):(++he,ce[he]=de)}ce.length=he+1;let $=t.getParameter(i.UNPACK_ROW_LENGTH),j=t.getParameter(i.UNPACK_SKIP_PIXELS),ue=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let Le=0,me=ce.length;Le<me;Le++){let de=ce[Le],De=Math.floor(de.start/4),Fe=Math.ceil(de.count/4),Ve=De%_.width,N=Math.floor(De/_.width),fe=Fe,J=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ve),t.pixelStorei(i.UNPACK_SKIP_ROWS,N),t.texSubImage2D(i.TEXTURE_2D,0,Ve,N,fe,J,O,V,_.data)}A.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,$),t.pixelStorei(i.UNPACK_SKIP_PIXELS,j),t.pixelStorei(i.UNPACK_SKIP_ROWS,ue)}}function be(A,_,O){let V=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(V=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(V=i.TEXTURE_3D);let Z=rt(A,_),ce=_.source;t.bindTexture(V,A.__webglTexture,i.TEXTURE0+O);let he=n.get(ce);if(ce.version!==he.__version||Z===!0){if(t.activeTexture(i.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let J=nt.getPrimaries(nt.workingColorSpace),pe=_.colorSpace===Zn?null:nt.getPrimaries(_.colorSpace),xe=_.colorSpace===Zn||J===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let j=g(_.image,!1,s.maxTextureSize);j=Mt(_,j);let ue=r.convert(_.format,_.colorSpace),Le=r.convert(_.type),me=v(_.internalFormat,ue,Le,_.normalized,_.colorSpace,_.isVideoTexture);et(V,_);let de,De=_.mipmaps,Fe=_.isVideoTexture!==!0,Ve=he.__version===void 0||Z===!0,N=ce.dataReady,fe=b(_,j);if(_.isDepthTexture)me=E(_.format===mi,_.type),Ve&&(Fe?t.texStorage2D(i.TEXTURE_2D,1,me,j.width,j.height):t.texImage2D(i.TEXTURE_2D,0,me,j.width,j.height,0,ue,Le,null));else if(_.isDataTexture)if(De.length>0){Fe&&Ve&&t.texStorage2D(i.TEXTURE_2D,fe,me,De[0].width,De[0].height);for(let J=0,pe=De.length;J<pe;J++)de=De[J],Fe?N&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,de.width,de.height,ue,Le,de.data):t.texImage2D(i.TEXTURE_2D,J,me,de.width,de.height,0,ue,Le,de.data);_.generateMipmaps=!1}else Fe?(Ve&&t.texStorage2D(i.TEXTURE_2D,fe,me,j.width,j.height),N&&ee(_,j,ue,Le)):t.texImage2D(i.TEXTURE_2D,0,me,j.width,j.height,0,ue,Le,j.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Fe&&Ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,me,De[0].width,De[0].height,j.depth);for(let J=0,pe=De.length;J<pe;J++)if(de=De[J],_.format!==dn)if(ue!==null)if(Fe){if(N)if(_.layerUpdates.size>0){let xe=zl(de.width,de.height,_.format,_.type);for(let se of _.layerUpdates){let Ue=de.data.subarray(se*xe/de.data.BYTES_PER_ELEMENT,(se+1)*xe/de.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,se,de.width,de.height,1,ue,Ue)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,de.width,de.height,j.depth,ue,de.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,me,de.width,de.height,j.depth,0,de.data,0,0);else Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Fe?N&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,de.width,de.height,j.depth,ue,Le,de.data):t.texImage3D(i.TEXTURE_2D_ARRAY,J,me,de.width,de.height,j.depth,0,ue,Le,de.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Fe&&Ve&&t.texStorage2D(i.TEXTURE_2D,fe,me,De[0].width,De[0].height);for(let J=0,pe=De.length;J<pe;J++)de=De[J],_.format!==dn?ue!==null?Fe?N&&t.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,de.width,de.height,ue,de.data):t.compressedTexImage2D(i.TEXTURE_2D,J,me,de.width,de.height,0,de.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Fe?N&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,de.width,de.height,ue,Le,de.data):t.texImage2D(i.TEXTURE_2D,J,me,de.width,de.height,0,ue,Le,de.data)}else if(_.isDataArrayTexture)if(Fe){if(Ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,me,j.width,j.height,j.depth),N)if(_.layerUpdates.size>0){let J=zl(j.width,j.height,_.format,_.type);for(let pe of _.layerUpdates){let xe=j.data.subarray(pe*J/j.data.BYTES_PER_ELEMENT,(pe+1)*J/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,pe,j.width,j.height,1,ue,Le,xe)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ue,Le,j.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,me,j.width,j.height,j.depth,0,ue,Le,j.data);else if(_.isData3DTexture)Fe?(Ve&&t.texStorage3D(i.TEXTURE_3D,fe,me,j.width,j.height,j.depth),N&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ue,Le,j.data)):t.texImage3D(i.TEXTURE_3D,0,me,j.width,j.height,j.depth,0,ue,Le,j.data);else if(_.isFramebufferTexture){if(Ve)if(Fe)t.texStorage2D(i.TEXTURE_2D,fe,me,j.width,j.height);else{let J=j.width,pe=j.height;for(let xe=0;xe<fe;xe++)t.texImage2D(i.TEXTURE_2D,xe,me,J,pe,0,ue,Le,null),J>>=1,pe>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){let J=i.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),j.parentNode!==J){J.appendChild(j),d.add(_),J.onpaint=pe=>{let xe=pe.changedElements;for(let se of d)xe.includes(se.image)&&(se.needsUpdate=!0)},J.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,j);else{let xe=i.RGBA,se=i.RGBA,Ue=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,xe,se,Ue,j)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(De.length>0){if(Fe&&Ve){let J=tt(De[0]);t.texStorage2D(i.TEXTURE_2D,fe,me,J.width,J.height)}for(let J=0,pe=De.length;J<pe;J++)de=De[J],Fe?N&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,ue,Le,de):t.texImage2D(i.TEXTURE_2D,J,me,ue,Le,de);_.generateMipmaps=!1}else if(Fe){if(Ve){let J=tt(j);t.texStorage2D(i.TEXTURE_2D,fe,me,J.width,J.height)}N&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue,Le,j)}else t.texImage2D(i.TEXTURE_2D,0,me,ue,Le,j);m(_)&&S(V),he.__version=ce.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function ke(A,_,O){if(_.image.length!==6)return;let V=rt(A,_),Z=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+O);let ce=n.get(Z);if(Z.version!==ce.__version||V===!0){t.activeTexture(i.TEXTURE0+O);let he=nt.getPrimaries(nt.workingColorSpace),$=_.colorSpace===Zn?null:nt.getPrimaries(_.colorSpace),j=_.colorSpace===Zn||he===$?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let ue=_.isCompressedTexture||_.image[0].isCompressedTexture,Le=_.image[0]&&_.image[0].isDataTexture,me=[];for(let se=0;se<6;se++)!ue&&!Le?me[se]=g(_.image[se],!0,s.maxCubemapSize):me[se]=Le?_.image[se].image:_.image[se],me[se]=Mt(_,me[se]);let de=me[0],De=r.convert(_.format,_.colorSpace),Fe=r.convert(_.type),Ve=v(_.internalFormat,De,Fe,_.normalized,_.colorSpace),N=_.isVideoTexture!==!0,fe=ce.__version===void 0||V===!0,J=Z.dataReady,pe=b(_,de);et(i.TEXTURE_CUBE_MAP,_);let xe;if(ue){N&&fe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,Ve,de.width,de.height);for(let se=0;se<6;se++){xe=me[se].mipmaps;for(let Ue=0;Ue<xe.length;Ue++){let Re=xe[Ue];_.format!==dn?De!==null?N?J&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue,0,0,Re.width,Re.height,De,Re.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue,Ve,Re.width,Re.height,0,Re.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue,0,0,Re.width,Re.height,De,Fe,Re.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue,Ve,Re.width,Re.height,0,De,Fe,Re.data)}}}else{if(xe=_.mipmaps,N&&fe){xe.length>0&&pe++;let se=tt(me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,Ve,se.width,se.height)}for(let se=0;se<6;se++)if(Le){N?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,me[se].width,me[se].height,De,Fe,me[se].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ve,me[se].width,me[se].height,0,De,Fe,me[se].data);for(let Ue=0;Ue<xe.length;Ue++){let yt=xe[Ue].image[se].image;N?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue+1,0,0,yt.width,yt.height,De,Fe,yt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue+1,Ve,yt.width,yt.height,0,De,Fe,yt.data)}}else{N?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,De,Fe,me[se]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ve,De,Fe,me[se]);for(let Ue=0;Ue<xe.length;Ue++){let Re=xe[Ue];N?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue+1,0,0,De,Fe,Re.image[se]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue+1,Ve,De,Fe,Re.image[se])}}}m(_)&&S(i.TEXTURE_CUBE_MAP),ce.__version=Z.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function ve(A,_,O,V,Z,ce){let he=r.convert(O.format,O.colorSpace),$=r.convert(O.type),j=v(O.internalFormat,he,$,O.normalized,O.colorSpace),ue=n.get(_),Le=n.get(O);if(Le.__renderTarget=_,!ue.__hasExternalTextures){let me=Math.max(1,_.width>>ce),de=Math.max(1,_.height>>ce);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?t.texImage3D(Z,ce,j,me,de,_.depth,0,he,$,null):t.texImage2D(Z,ce,j,me,de,0,he,$,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),lt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,Z,Le.__webglTexture,0,ot(_)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,V,Z,Le.__webglTexture,ce),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ge(A,_,O){if(i.bindRenderbuffer(i.RENDERBUFFER,A),_.depthBuffer){let V=_.depthTexture,Z=V&&V.isDepthTexture?V.type:null,ce=E(_.stencilBuffer,Z),he=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;lt(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot(_),ce,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,ot(_),ce,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ce,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,he,i.RENDERBUFFER,A)}else{let V=_.textures;for(let Z=0;Z<V.length;Z++){let ce=V[Z],he=r.convert(ce.format,ce.colorSpace),$=r.convert(ce.type),j=v(ce.internalFormat,he,$,ce.normalized,ce.colorSpace);lt(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot(_),j,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,ot(_),j,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,j,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Tt(A,_,O){let V=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=n.get(_.depthTexture);if(Z.__renderTarget=_,(!Z.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),V){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,_.depthTexture.addEventListener("dispose",R)),Z.__webglTexture===void 0){Z.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),et(i.TEXTURE_CUBE_MAP,_.depthTexture);let ue=r.convert(_.depthTexture.format),Le=r.convert(_.depthTexture.type),me;_.depthTexture.format===Dn?me=i.DEPTH_COMPONENT24:_.depthTexture.format===mi&&(me=i.DEPTH24_STENCIL8);for(let de=0;de<6;de++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,me,_.width,_.height,0,ue,Le,null)}}else ae(_.depthTexture,0);let ce=Z.__webglTexture,he=ot(_),$=V?i.TEXTURE_CUBE_MAP_POSITIVE_X+O:i.TEXTURE_2D,j=_.depthTexture.format===mi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===Dn)lt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,$,ce,0,he):i.framebufferTexture2D(i.FRAMEBUFFER,j,$,ce,0);else if(_.depthTexture.format===mi)lt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,$,ce,0,he):i.framebufferTexture2D(i.FRAMEBUFFER,j,$,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function $e(A){let _=n.get(A),O=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){let V=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),V){let Z=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,V.removeEventListener("dispose",Z)};V.addEventListener("dispose",Z),_.__depthDisposeCallback=Z}_.__boundDepthTexture=V}if(A.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let V=0;V<6;V++)Tt(_.__webglFramebuffer[V],A,V);else{let V=A.texture.mipmaps;V&&V.length>0?Tt(_.__webglFramebuffer[0],A,0):Tt(_.__webglFramebuffer,A,0)}else if(O){_.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[V]),_.__webglDepthbuffer[V]===void 0)_.__webglDepthbuffer[V]=i.createRenderbuffer(),Ge(_.__webglDepthbuffer[V],A,!1);else{let Z=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=_.__webglDepthbuffer[V];i.bindRenderbuffer(i.RENDERBUFFER,ce),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,ce)}}else{let V=A.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Ge(_.__webglDepthbuffer,A,!1);else{let Z=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ce),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,ce)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function st(A,_,O){let V=n.get(A);_!==void 0&&ve(V.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&$e(A)}function pt(A){let _=A.texture,O=n.get(A),V=n.get(_);A.addEventListener("dispose",y);let Z=A.textures,ce=A.isWebGLCubeRenderTarget===!0,he=Z.length>1;if(he||(V.__webglTexture===void 0&&(V.__webglTexture=i.createTexture()),V.__version=_.version,a.memory.textures++),ce){O.__webglFramebuffer=[];for(let $=0;$<6;$++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[$]=[];for(let j=0;j<_.mipmaps.length;j++)O.__webglFramebuffer[$][j]=i.createFramebuffer()}else O.__webglFramebuffer[$]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let $=0;$<_.mipmaps.length;$++)O.__webglFramebuffer[$]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(he)for(let $=0,j=Z.length;$<j;$++){let ue=n.get(Z[$]);ue.__webglTexture===void 0&&(ue.__webglTexture=i.createTexture(),a.memory.textures++)}if(A.samples>0&&lt(A)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let $=0;$<Z.length;$++){let j=Z[$];O.__webglColorRenderbuffer[$]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[$]);let ue=r.convert(j.format,j.colorSpace),Le=r.convert(j.type),me=v(j.internalFormat,ue,Le,j.normalized,j.colorSpace,A.isXRRenderTarget===!0),de=ot(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,de,me,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$,i.RENDERBUFFER,O.__webglColorRenderbuffer[$])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Ge(O.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ce){t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),et(i.TEXTURE_CUBE_MAP,_);for(let $=0;$<6;$++)if(_.mipmaps&&_.mipmaps.length>0)for(let j=0;j<_.mipmaps.length;j++)ve(O.__webglFramebuffer[$][j],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,j);else ve(O.__webglFramebuffer[$],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);m(_)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(he){for(let $=0,j=Z.length;$<j;$++){let ue=Z[$],Le=n.get(ue),me=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(me=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(me,Le.__webglTexture),et(me,ue),ve(O.__webglFramebuffer,A,ue,i.COLOR_ATTACHMENT0+$,me,0),m(ue)&&S(me)}t.unbindTexture()}else{let $=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&($=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture($,V.__webglTexture),et($,_),_.mipmaps&&_.mipmaps.length>0)for(let j=0;j<_.mipmaps.length;j++)ve(O.__webglFramebuffer[j],A,_,i.COLOR_ATTACHMENT0,$,j);else ve(O.__webglFramebuffer,A,_,i.COLOR_ATTACHMENT0,$,0);m(_)&&S($),t.unbindTexture()}A.depthBuffer&&$e(A)}function ie(A){let _=A.textures;for(let O=0,V=_.length;O<V;O++){let Z=_[O];if(m(Z)){let ce=T(A),he=n.get(Z).__webglTexture;t.bindTexture(ce,he),S(ce),t.unbindTexture()}}}let Ee=[],Xe=[];function vt(A){if(A.samples>0){if(lt(A)===!1){let _=A.textures,O=A.width,V=A.height,Z=i.COLOR_BUFFER_BIT,ce=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=n.get(A),$=_.length>1;if($)for(let ue=0;ue<_.length;ue++)t.bindFramebuffer(i.FRAMEBUFFER,he.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,he.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer);let j=A.texture.mipmaps;j&&j.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,he.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let ue=0;ue<_.length;ue++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),$){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,he.__webglColorRenderbuffer[ue]);let Le=n.get(_[ue]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Le,0)}i.blitFramebuffer(0,0,O,V,0,0,O,V,Z,i.NEAREST),l===!0&&(Ee.length=0,Xe.length=0,Ee.push(i.COLOR_ATTACHMENT0+ue),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&(Ee.push(ce),Xe.push(ce),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Xe)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ee))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),$)for(let ue=0;ue<_.length;ue++){t.bindFramebuffer(i.FRAMEBUFFER,he.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,he.__webglColorRenderbuffer[ue]);let Le=n.get(_[ue]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,he.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.TEXTURE_2D,Le,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&l){let _=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function ot(A){return Math.min(s.maxSamples,A.samples)}function lt(A){let _=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function I(A){let _=a.render.frame;h.get(A)!==_&&(h.set(A,_),A.update())}function Mt(A,_){let O=A.colorSpace,V=A.format,Z=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||O!==As&&O!==Zn&&(nt.getTransfer(O)===dt?(V!==dn||Z!==Qt)&&Be("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Oe("WebGLTextures: Unsupported texture color space:",O)),_}function tt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=Y,this.resetTextureUnits=k,this.getTextureUnits=L,this.setTextureUnits=G,this.setTexture2D=ae,this.setTexture2DArray=q,this.setTexture3D=Q,this.setTextureCube=ne,this.rebindTextures=st,this.setupRenderTarget=pt,this.updateRenderTargetMipmap=ie,this.updateMultisampleRenderTarget=vt,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=lt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Kg(i,e){function t(n,s=Zn){let r,a=nt.getTransfer(s);if(n===Qt)return i.UNSIGNED_BYTE;if(n===Ta)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Aa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Pl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Il)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Rl)return i.BYTE;if(n===Cl)return i.SHORT;if(n===ls)return i.UNSIGNED_SHORT;if(n===wa)return i.INT;if(n===En)return i.UNSIGNED_INT;if(n===wn)return i.FLOAT;if(n===Tn)return i.HALF_FLOAT;if(n===Ll)return i.ALPHA;if(n===Dl)return i.RGB;if(n===dn)return i.RGBA;if(n===Dn)return i.DEPTH_COMPONENT;if(n===mi)return i.DEPTH_STENCIL;if(n===Nl)return i.RED;if(n===Ra)return i.RED_INTEGER;if(n===gi)return i.RG;if(n===Ca)return i.RG_INTEGER;if(n===Pa)return i.RGBA_INTEGER;if(n===$s||n===Js||n===js||n===Qs)if(a===dt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===$s)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===$s)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Js)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===js)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Qs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ia||n===La||n===Da||n===Na)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ia)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===La)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Da)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Na)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ua||n===Fa||n===Ba||n===Oa||n===ka||n===er||n===Ha)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ua||n===Fa)return a===dt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ba)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Oa)return r.COMPRESSED_R11_EAC;if(n===ka)return r.COMPRESSED_SIGNED_R11_EAC;if(n===er)return r.COMPRESSED_RG11_EAC;if(n===Ha)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===za||n===Ga||n===Va||n===Wa||n===Xa||n===qa||n===Ya||n===Za||n===Ka||n===$a||n===Ja||n===ja||n===Qa||n===eo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===za)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ga)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Va)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wa)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xa)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===qa)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ya)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Za)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ka)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===$a)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ja)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ja)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Qa)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===eo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===to||n===no||n===io)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===to)return a===dt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===no)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===io)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===so||n===ro||n===tr||n===ao)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===so)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ro)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===tr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ao)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===cs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var $g=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Jg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ac=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Bs(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new sn({vertexShader:$g,fragmentShader:Jg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new B(new it(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},oc=class extends Nn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null,x=typeof XRWebGLBinding<"u",g=new ac,m={},S=t.getContextAttributes(),T=null,v=null,E=[],b=[],R=new Ne,y=null,w=null,C=new Gt;C.viewport=new wt;let U=new Gt;U.viewport=new wt;let F=[C,U],k=new xa,L=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ee=E[K];return ee===void 0&&(ee=new Qi,E[K]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(K){let ee=E[K];return ee===void 0&&(ee=new Qi,E[K]=ee),ee.getGripSpace()},this.getHand=function(K){let ee=E[K];return ee===void 0&&(ee=new Qi,E[K]=ee),ee.getHandSpace()};function Y(K){let ee=b.indexOf(K.inputSource);if(ee===-1)return;let be=E[ee];be!==void 0&&(be.update(K.inputSource,K.frame,c||a),be.dispatchEvent({type:K.type,data:K.inputSource}))}function X(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",ae);for(let K=0;K<E.length;K++){let ee=b[K];ee!==null&&(b[K]=null,E[K].disconnect(ee))}L=null,G=null,g.reset();for(let K in m)delete m[K];if(e.setRenderTarget(T),f=null,u=null,d=null,s=null,v=null,rt.stop(),n.isPresenting=!1,e.setPixelRatio(y),e.setSize(R.width,R.height,!1),w!==null){let K=w.camera;K.fov=w.fov,K.zoom=w.zoom,K.updateProjectionMatrix(),w=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&Be("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&Be("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(T=e.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",X),s.addEventListener("inputsourceschange",ae),S.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(R),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let be=null,ke=null,ve=null;S.depth&&(ve=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,be=S.stencil?mi:Dn,ke=S.stencil?cs:En);let Ge={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Ge),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),v=new jt(u.textureWidth,u.textureHeight,{format:dn,type:Qt,depthTexture:new li(u.textureWidth,u.textureHeight,ke,void 0,void 0,void 0,void 0,void 0,void 0,be),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let be={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,be),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new jt(f.framebufferWidth,f.framebufferHeight,{format:dn,type:Qt,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),rt.setContext(s),rt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ae(K){for(let ee=0;ee<K.removed.length;ee++){let be=K.removed[ee],ke=b.indexOf(be);ke>=0&&(b[ke]=null,E[ke].disconnect(be))}for(let ee=0;ee<K.added.length;ee++){let be=K.added[ee],ke=b.indexOf(be);if(ke===-1){for(let Ge=0;Ge<E.length;Ge++)if(Ge>=b.length){b.push(be),ke=Ge;break}else if(b[Ge]===null){b[Ge]=be,ke=Ge;break}if(ke===-1)break}let ve=E[ke];ve&&ve.connect(be)}}let q=new P,Q=new P;function ne(K,ee,be){q.setFromMatrixPosition(ee.matrixWorld),Q.setFromMatrixPosition(be.matrixWorld);let ke=q.distanceTo(Q),ve=ee.projectionMatrix.elements,Ge=be.projectionMatrix.elements,Tt=ve[14]/(ve[10]-1),$e=ve[14]/(ve[10]+1),st=(ve[9]+1)/ve[5],pt=(ve[9]-1)/ve[5],ie=(ve[8]-1)/ve[0],Ee=(Ge[8]+1)/Ge[0],Xe=Tt*ie,vt=Tt*Ee,ot=ke/(-ie+Ee),lt=ot*-ie;if(ee.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(lt),K.translateZ(ot),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),ve[10]===-1)K.projectionMatrix.copy(ee.projectionMatrix),K.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{let I=Tt+ot,Mt=$e+ot,tt=Xe-lt,A=vt+(ke-lt),_=st*$e/Mt*I,O=pt*$e/Mt*I;K.projectionMatrix.makePerspective(tt,A,_,O,I,Mt),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function Pe(K,ee){ee===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ee.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let ee=K.near,be=K.far;g.texture!==null&&(g.depthNear>0&&(ee=g.depthNear),g.depthFar>0&&(be=g.depthFar)),k.near=U.near=C.near=ee,k.far=U.far=C.far=be,(L!==k.near||G!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),L=k.near,G=k.far),k.layers.mask=K.layers.mask|6,C.layers.mask=k.layers.mask&-5,U.layers.mask=k.layers.mask&-3;let ke=K.parent,ve=k.cameras;Pe(k,ke);for(let Ge=0;Ge<ve.length;Ge++)Pe(ve[Ge],ke);ve.length===2?ne(k,C,U):k.projectionMatrix.copy(C.projectionMatrix),w===null&&K.isPerspectiveCamera&&(w={camera:K,fov:K.fov,zoom:K.zoom}),Ie(K,k,ke)};function Ie(K,ee,be){be===null?K.matrix.copy(ee.matrixWorld):(K.matrix.copy(be.matrixWorld),K.matrix.invert(),K.matrix.multiply(ee.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ee.projectionMatrix),K.projectionMatrixInverse.copy(ee.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Vr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(K){l=K,u!==null&&(u.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(k)},this.getCameraTexture=function(K){return m[K]};let ft=null;function et(K,ee){if(h=ee.getViewerPose(c||a),p=ee,h!==null){let be=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let ke=!1;be.length!==k.cameras.length&&(k.cameras.length=0,ke=!0);for(let $e=0;$e<be.length;$e++){let st=be[$e],pt=null;if(f!==null)pt=f.getViewport(st);else{let Ee=d.getViewSubImage(u,st);pt=Ee.viewport,$e===0&&(e.setRenderTargetTextures(v,Ee.colorTexture,Ee.depthStencilTexture),e.setRenderTarget(v))}let ie=F[$e];ie===void 0&&(ie=new Gt,ie.layers.enable($e),ie.viewport=new wt,F[$e]=ie),ie.matrix.fromArray(st.transform.matrix),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale),ie.projectionMatrix.fromArray(st.projectionMatrix),ie.projectionMatrixInverse.copy(ie.projectionMatrix).invert(),ie.viewport.set(pt.x,pt.y,pt.width,pt.height),$e===0&&(k.matrix.copy(ie.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),ke===!0&&k.cameras.push(ie)}let ve=s.enabledFeatures;if(ve&&ve.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=n.getBinding();let $e=d.getDepthInformation(be[0]);$e&&$e.isValid&&$e.texture&&g.init($e,s.renderState)}if(ve&&ve.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let $e=0;$e<be.length;$e++){let st=be[$e].camera;if(st){let pt=m[st];pt||(pt=new Bs,m[st]=pt);let ie=d.getCameraImage(st);pt.sourceTexture=ie}}}}for(let be=0;be<E.length;be++){let ke=b[be],ve=E[be];ke!==null&&ve!==void 0&&ve.update(ke,ee,c||a)}ft&&ft(K,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),p=null}let rt=new yu;rt.setAnimationLoop(et),this.setAnimationLoop=function(K){ft=K},this.dispose=function(){}}},jg=new Et,Eu=new ze;Eu.set(-1,0,0,0,1,0,0,0,1);function Qg(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Ol(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,S,T,v){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),d(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),u(g,m),m.isMeshPhysicalMaterial&&f(g,m,v)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,S,T):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Zt&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Zt&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let S=e.get(m),T=S.envMap,v=S.envMapRotation;T&&(g.envMap.value=T,g.envMapRotation.value.setFromMatrix4(jg.makeRotationFromEuler(v)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Eu),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,S,T){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*S,g.scale.value=T*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function d(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function u(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,S){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Zt&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){let S=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function e_(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,E){let b=E.program;n.uniformBlockBinding(v,b)}function c(v,E){let b=s[v.id];b===void 0&&(g(v),b=h(v),s[v.id]=b,v.addEventListener("dispose",S));let R=E.program;n.updateUBOMapping(v,R);let y=e.render.frame;r[v.id]!==y&&(u(v),r[v.id]=y)}function h(v){let E=d();v.__bindingPointIndex=E;let b=i.createBuffer(),R=v.__size,y=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,R,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,b),b}function d(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Oe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){let E=s[v.id],b=v.uniforms,R=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let y=0,w=b.length;y<w;y++){let C=b[y];if(Array.isArray(C))for(let U=0,F=C.length;U<F;U++)f(C[U],y,U,R);else f(C,y,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,E,b,R){if(x(v,E,b,R)===!0){let y=v.__offset,w=v.value;if(Array.isArray(w)){let C=0;for(let U=0;U<w.length;U++){let F=w[U],k=m(F);p(F,v.__data,C),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(C+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(w,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,y,v.__data)}}function p(v,E,b){typeof v=="number"||typeof v=="boolean"?E[0]=v:v.isMatrix3?(E[0]=v.elements[0],E[1]=v.elements[1],E[2]=v.elements[2],E[3]=0,E[4]=v.elements[3],E[5]=v.elements[4],E[6]=v.elements[5],E[7]=0,E[8]=v.elements[6],E[9]=v.elements[7],E[10]=v.elements[8],E[11]=0):ArrayBuffer.isView(v)?E.set(new v.constructor(v.buffer,v.byteOffset,E.length)):v.toArray(E,b)}function x(v,E,b,R){let y=v.value,w=E+"_"+b;if(R[w]===void 0)return typeof y=="number"||typeof y=="boolean"?R[w]=y:ArrayBuffer.isView(y)?R[w]=y.slice():R[w]=y.clone(),!0;{let C=R[w];if(typeof y=="number"||typeof y=="boolean"){if(C!==y)return R[w]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(C.equals(y)===!1)return C.copy(y),!0}}return!1}function g(v){let E=v.uniforms,b=0,R=16;for(let w=0,C=E.length;w<C;w++){let U=Array.isArray(E[w])?E[w]:[E[w]];for(let F=0,k=U.length;F<k;F++){let L=U[F],G=Array.isArray(L.value)?L.value:[L.value];for(let Y=0,X=G.length;Y<X;Y++){let ae=G[Y],q=m(ae),Q=b%R,ne=Q%q.boundary,Pe=Q+ne;b+=ne,Pe!==0&&R-Pe<q.storage&&(b+=R-Pe),L.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=b,b+=q.storage}}}let y=b%R;return y>0&&(b+=R-y),v.__size=b,v.__cache={},this}function m(v){let E={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(E.boundary=4,E.storage=4):v.isVector2?(E.boundary=8,E.storage=8):v.isVector3||v.isColor?(E.boundary=16,E.storage=12):v.isVector4?(E.boundary=16,E.storage=16):v.isMatrix3?(E.boundary=48,E.storage=48):v.isMatrix4?(E.boundary=64,E.storage=64):v.isTexture?Be("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(E.boundary=16,E.storage=v.byteLength):Be("WebGLRenderer: Unsupported uniform value type.",v),E}function S(v){let E=v.target;E.removeEventListener("dispose",S);let b=a.indexOf(E.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function T(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:T}}var t_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Bn=null;function n_(){return Bn===null&&(Bn=new Zr(t_,16,16,gi,Tn),Bn.name="DFG_LUT",Bn.minFilter=Bt,Bn.magFilter=Bt,Bn.wrapS=qt,Bn.wrapT=qt,Bn.generateMipmaps=!1,Bn.needsUpdate=!0),Bn}var mo=class{constructor(e={}){let{canvas:t=Vh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=Qt}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let x=f,g=new Set([Pa,Ca,Ra]),m=new Set([Qt,En,ls,cs,Ta,Aa]),S=new Uint32Array(4),T=new Int32Array(4),v=new P,E=null,b=null,R=[],y=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Sn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,U=!1,F=null,k=null,L=null,G=null;this._outputColorSpace=Lt;let Y=0,X=0,ae=null,q=-1,Q=null,ne=new wt,Pe=new wt,Ie=null,ft=new We(0),et=0,rt=t.width,K=t.height,ee=1,be=null,ke=null,ve=new wt(0,0,rt,K),Ge=new wt(0,0,rt,K),Tt=!1,$e=new ts,st=!1,pt=!1,ie=new Et,Ee=new P,Xe=new wt,vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ot=!1;function lt(){return ae===null?ee:1}let I=n;function Mt(M,D){return t.getContext(M,D)}let tt,A,_,O,V,Z,ce,he,$,j,ue,Le,me,de,De,Fe,Ve,N,fe,J,pe,xe,se;try{let M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",yt,!1),t.addEventListener("webglcontextrestored",ht,!1),t.addEventListener("webglcontextcreationerror",mn,!1),I===null){let D="webgl2";if(I=Mt(D,M),I===null)throw Mt(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ue()}catch(M){throw t.removeEventListener("webglcontextlost",yt,!1),t.removeEventListener("webglcontextrestored",ht,!1),t.removeEventListener("webglcontextcreationerror",mn,!1),Oe("WebGLRenderer: "+M.message),M}function Ue(){tt=new c0(I),tt.init(),pe=new Kg(I,tt),A=new Qm(I,tt,e,pe),_=new Yg(I,tt),A.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),k=I.createFramebuffer(),L=I.createFramebuffer(),G=I.createFramebuffer(),O=new d0(I),V=new Dg,Z=new Zg(I,tt,_,V,A,pe,O),ce=new l0(C),he=new pf(I),xe=new Jm(I,he),$=new h0(I,he,O,xe),j=new p0(I,$,he,xe,O),N=new f0(I,A,Z),De=new e0(V),ue=new Lg(C,ce,tt,A,xe,De),Le=new Qg(C,V),me=new Ug,de=new zg(tt),Ve=new $m(C,ce,_,j,p,l),Fe=new qg(C,j,A),se=new e_(I,O,A,_),fe=new jm(I,tt,O),J=new u0(I,tt,O),O.programs=ue.programs,C.capabilities=A,C.extensions=tt,C.properties=V,C.renderLists=me,C.shadowMap=Fe,C.state=_,C.info=O}x!==Qt&&(w=new g0(x,t.width,t.height,o,s,r));let Re=new oc(C,I);this.xr=Re,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let M=tt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=tt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(M){M!==void 0&&(ee=M,this.setSize(rt,K,!1))},this.getSize=function(M){return M.set(rt,K)},this.setSize=function(M,D,W=!0){if(Re.isPresenting){Be("WebGLRenderer: Can't change size while VR device is presenting.");return}rt=M,K=D,t.width=Math.floor(M*ee),t.height=Math.floor(D*ee),W===!0&&(t.style.width=M+"px",t.style.height=D+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,M,D)},this.getDrawingBufferSize=function(M){return M.set(rt*ee,K*ee).floor()},this.setDrawingBufferSize=function(M,D,W){rt=M,K=D,ee=W,t.width=Math.floor(M*W),t.height=Math.floor(D*W),this.setViewport(0,0,M,D)},this.setEffects=function(M){if(x===Qt){Oe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let D=0;D<M.length;D++)if(M[D].isOutputPass===!0){Be("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(ne)},this.getViewport=function(M){return M.copy(ve)},this.setViewport=function(M,D,W,H){M.isVector4?ve.set(M.x,M.y,M.z,M.w):ve.set(M,D,W,H),_.viewport(ne.copy(ve).multiplyScalar(ee).round())},this.getScissor=function(M){return M.copy(Ge)},this.setScissor=function(M,D,W,H){M.isVector4?Ge.set(M.x,M.y,M.z,M.w):Ge.set(M,D,W,H),_.scissor(Pe.copy(Ge).multiplyScalar(ee).round())},this.getScissorTest=function(){return Tt},this.setScissorTest=function(M){_.setScissorTest(Tt=M)},this.setOpaqueSort=function(M){be=M},this.setTransparentSort=function(M){ke=M},this.getClearColor=function(M){return M.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(M=!0,D=!0,W=!0){let H=0;if(M){let z=!1;if(ae!==null){let ye=ae.texture.format;z=g.has(ye)}if(z){let ye=ae.texture.type,Se=m.has(ye),_e=Ve.getClearColor(),we=Ve.getClearAlpha(),Ce=_e.r,Ze=_e.g,je=_e.b;Se?(S[0]=Ce,S[1]=Ze,S[2]=je,S[3]=we,I.clearBufferuiv(I.COLOR,0,S)):(T[0]=Ce,T[1]=Ze,T[2]=je,T[3]=we,I.clearBufferiv(I.COLOR,0,T))}else H|=I.COLOR_BUFFER_BIT}D&&(H|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(H|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&I.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),F=M},this.dispose=function(){t.removeEventListener("webglcontextlost",yt,!1),t.removeEventListener("webglcontextrestored",ht,!1),t.removeEventListener("webglcontextcreationerror",mn,!1),Ve.dispose(),me.dispose(),de.dispose(),V.dispose(),ce.dispose(),j.dispose(),xe.dispose(),se.dispose(),ue.dispose(),Re.dispose(),Re.removeEventListener("sessionstart",Ic),Re.removeEventListener("sessionend",Lc),_i.stop()};function yt(M){M.preventDefault(),Fl("WebGLRenderer: Context Lost."),U=!0}function ht(){Fl("WebGLRenderer: Context Restored."),U=!1;let M=O.autoReset,D=Fe.enabled,W=Fe.autoUpdate,H=Fe.needsUpdate,z=Fe.type;Ue(),O.autoReset=M,Fe.enabled=D,Fe.autoUpdate=W,Fe.needsUpdate=H,Fe.type=z}function mn(M){Oe("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Pn(M){let D=M.target;D.removeEventListener("dispose",Pn),sd(D)}function sd(M){rd(M),V.remove(M)}function rd(M){let D=V.get(M).programs;D!==void 0&&(D.forEach(function(W){ue.releaseProgram(W)}),M.isShaderMaterial&&ue.releaseShaderCache(M))}this.renderBufferDirect=function(M,D,W,H,z,ye){D===null&&(D=vt);let Se=z.isMesh&&z.matrixWorld.determinantAffine()<0,_e=ld(M,D,W,H,z);_.setMaterial(H,Se);let we=W.index,Ce=1;if(H.wireframe===!0){if(we=$.getWireframeAttribute(W),we===void 0)return;Ce=2}let Ze=W.drawRange,je=W.attributes.position,Te=Ze.start*Ce,ut=(Ze.start+Ze.count)*Ce;ye!==null&&(Te=Math.max(Te,ye.start*Ce),ut=Math.min(ut,(ye.start+ye.count)*Ce)),we!==null?(Te=Math.max(Te,0),ut=Math.min(ut,we.count)):je!=null&&(Te=Math.max(Te,0),ut=Math.min(ut,je.count));let Ct=ut-Te;if(Ct<0||Ct===1/0)return;xe.setup(z,H,_e,W,we);let bt,_t=fe;if(we!==null&&(bt=he.get(we),_t=J,_t.setIndex(bt)),z.isMesh)H.wireframe===!0?(_.setLineWidth(H.wireframeLinewidth*lt()),_t.setMode(I.LINES)):_t.setMode(I.TRIANGLES);else if(z.isLine){let kt=H.linewidth;kt===void 0&&(kt=1),_.setLineWidth(kt*lt()),z.isLineSegments?_t.setMode(I.LINES):z.isLineLoop?_t.setMode(I.LINE_LOOP):_t.setMode(I.LINE_STRIP)}else z.isPoints?_t.setMode(I.POINTS):z.isSprite&&_t.setMode(I.TRIANGLES);if(z.isBatchedMesh)if(tt.get("WEBGL_multi_draw"))_t.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let kt=z._multiDrawStarts,Me=z._multiDrawCounts,Xt=z._multiDrawCount,ct=we?he.get(we).bytesPerElement:1,cn=V.get(H).currentProgram.getUniforms();for(let In=0;In<Xt;In++)cn.setValue(I,"_gl_DrawID",In),_t.render(kt[In]/ct,Me[In])}else if(z.isInstancedMesh)_t.renderInstances(Te,Ct,z.count);else if(W.isInstancedBufferGeometry){let kt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Me=Math.min(W.instanceCount,kt);_t.renderInstances(Te,Ct,Me)}else _t.render(Te,Ct)};function Pc(M,D,W,H){F!==null&&M.isNodeMaterial&&F.setObject(H,M),st===!0&&De.setState(M,W,!1),M.transparent===!0&&M.side===It&&M.forceSinglePass===!1?(M.side=Zt,M.needsUpdate=!0,dr(M,D,H),M.side=di,M.needsUpdate=!0,dr(M,D,H),M.side=It):dr(M,D,H)}this.compile=function(M,D,W=null){W===null&&(W=M),F!==null&&F.renderStart(M,D,W),b=de.get(W),b.init(D),y.push(b),W.traverseVisible(function(z){z.isLight&&z.layers.test(D.layers)&&(b.pushLight(z),z.castShadow&&b.pushShadow(z))}),M!==W&&M.traverseVisible(function(z){z.isLight&&z.layers.test(D.layers)&&(b.pushLight(z),z.castShadow&&b.pushShadow(z))}),b.setupLights(),F!==null&&F.updateLights(b.state.lightsArray),pt=this.localClippingEnabled,st=De.init(this.clippingPlanes,pt),st===!0&&De.setGlobalState(this.clippingPlanes,D),F!==null&&Fe.render(b.state.shadowsArray,W,D);let H=new Set;return M.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let ye=z.material;if(ye)if(Array.isArray(ye))for(let Se=0;Se<ye.length;Se++){let _e=ye[Se];Pc(_e,W,D,z),H.add(_e)}else Pc(ye,W,D,z),H.add(ye)}),b=y.pop(),F!==null&&F.renderEnd(),H},this.compileAsync=function(M,D,W=null){let H=this.compile(M,D,W);return new Promise(z=>{function ye(){if(H.forEach(function(Se){let we=V.get(Se).currentProgram;(we===void 0||we.isReady())&&H.delete(Se)}),H.size===0){z(M);return}setTimeout(ye,10)}tt.get("KHR_parallel_shader_compile")!==null?ye():setTimeout(ye,10)})};let Lo=null;function ad(M){Lo&&Lo(M)}function Ic(){_i.stop()}function Lc(){_i.start()}let _i=new yu;_i.setAnimationLoop(ad),typeof self<"u"&&_i.setContext(self),this.setAnimationLoop=function(M){Lo=M,Re.setAnimationLoop(M),M===null?_i.stop():_i.start()},Re.addEventListener("sessionstart",Ic),Re.addEventListener("sessionend",Lc),this.render=function(M,D){if(D!==void 0&&D.isCamera!==!0){Oe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;F!==null&&F.renderStart(M,D);let W=Re.enabled===!0&&Re.isPresenting===!0,H=w!==null&&(ae===null||W)&&w.begin(C,ae);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),Re.enabled===!0&&Re.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Re.cameraAutoUpdate===!0&&Re.updateCamera(D),D=Re.getCamera()),M.isScene===!0&&M.onBeforeRender(C,M,D,ae),b=de.get(M,y.length),b.init(D),b.state.textureUnits=Z.getTextureUnits(),y.push(b),ie.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),$e.setFromProjectionMatrix(ie,vn,D.reversedDepth),pt=this.localClippingEnabled,st=De.init(this.clippingPlanes,pt),E=me.get(M,R.length),E.init(),R.push(E),Re.enabled===!0&&Re.isPresenting===!0){let Se=C.xr.getDepthSensingMesh();Se!==null&&Do(Se,D,-1/0,C.sortObjects)}Do(M,D,0,C.sortObjects),E.finish(),F!==null&&F.updateLights(b.state.lightsArray),C.sortObjects===!0&&E.sort(be,ke),ot=Re.enabled===!1||Re.isPresenting===!1||Re.hasDepthSensing()===!1,ot&&Ve.addToRenderList(E,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),st===!0&&De.beginShadows();let z=b.state.shadowsArray;if(Fe.render(z,M,D),st===!0&&De.endShadows(),(H&&w.hasRenderPass())===!1){let Se=E.opaque,_e=E.transmissive;if(b.setupLights(),D.isArrayCamera){let we=D.cameras;if(_e.length>0)for(let Ce=0,Ze=we.length;Ce<Ze;Ce++){let je=we[Ce];Nc(Se,_e,M,je)}ot&&Ve.render(M);for(let Ce=0,Ze=we.length;Ce<Ze;Ce++){let je=we[Ce];Dc(E,M,je,je.viewport)}}else _e.length>0&&Nc(Se,_e,M,D),ot&&Ve.render(M),Dc(E,M,D)}ae!==null&&X===0&&(Z.updateMultisampleRenderTarget(ae),Z.updateRenderTargetMipmap(ae)),H&&w.end(C),M.isScene===!0&&M.onAfterRender(C,M,D),xe.resetDefaultState(),q=-1,Q=null,y.pop(),y.length>0?(b=y[y.length-1],Z.setTextureUnits(b.state.textureUnits),st===!0&&De.setGlobalState(C.clippingPlanes,b.state.camera)):b=null,R.pop(),R.length>0?E=R[R.length-1]:E=null,F!==null&&F.renderEnd()};function Do(M,D,W,H){if(M.visible===!1)return;if(M.layers.test(D.layers)){if(M.isGroup)W=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(D);else if(M.isLightProbeGrid)b.pushLightProbeGrid(M);else if(M.isLight)b.pushLight(M),M.castShadow&&b.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum($e)){H&&Xe.setFromMatrixPosition(M.matrixWorld).applyMatrix4(ie);let Se=j.update(M),_e=M.material;_e.visible&&E.push(M,Se,_e,W,Xe.z,null,D)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum($e))){let Se=j.update(M),_e=M.material;if(H&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Xe.copy(M.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Xe.copy(Se.boundingSphere.center)),Xe.applyMatrix4(M.matrixWorld).applyMatrix4(ie)),Array.isArray(_e)){let we=Se.groups;for(let Ce=0,Ze=we.length;Ce<Ze;Ce++){let je=we[Ce],Te=_e[je.materialIndex];Te&&Te.visible&&E.push(M,Se,Te,W,Xe.z,je,D)}}else _e.visible&&E.push(M,Se,_e,W,Xe.z,null,D)}}let ye=M.children;for(let Se=0,_e=ye.length;Se<_e;Se++)Do(ye[Se],D,W,H)}function Dc(M,D,W,H){let{opaque:z,transmissive:ye,transparent:Se}=M;b.setupLightsView(W),st===!0&&De.setGlobalState(C.clippingPlanes,W),H&&_.viewport(ne.copy(H)),z.length>0&&ur(z,D,W),ye.length>0&&ur(ye,D,W),Se.length>0&&ur(Se,D,W),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Nc(M,D,W,H){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){let Te=tt.has("EXT_color_buffer_half_float")||tt.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new jt(1,1,{generateMipmaps:!0,type:Te?Tn:Qt,minFilter:pi,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:nt.workingColorSpace})}let ye=b.state.transmissionRenderTarget[H.id],Se=H.viewport||ne;ye.setSize(Se.z*C.transmissionResolutionScale,Se.w*C.transmissionResolutionScale);let _e=C.getRenderTarget(),we=C.getActiveCubeFace(),Ce=C.getActiveMipmapLevel();C.setRenderTarget(ye),C.getClearColor(ft),et=C.getClearAlpha(),et<1&&C.setClearColor(16777215,.5),C.clear(),ot&&Ve.render(W);let Ze=C.toneMapping;C.toneMapping=Sn;let je=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),b.setupLightsView(H),st===!0&&De.setGlobalState(C.clippingPlanes,H),ur(M,W,H),Z.updateMultisampleRenderTarget(ye),Z.updateRenderTargetMipmap(ye),tt.has("WEBGL_multisampled_render_to_texture")===!1){let Te=!1;for(let ut=0,Ct=D.length;ut<Ct;ut++){let bt=D[ut],{object:_t,geometry:kt,material:Me,group:Xt}=bt;if(Me.side===It&&_t.layers.test(H.layers)){let ct=Me.side;Me.side=Zt,Me.needsUpdate=!0,Uc(_t,W,H,kt,Me,Xt),Me.side=ct,Me.needsUpdate=!0,Te=!0}}Te===!0&&(Z.updateMultisampleRenderTarget(ye),Z.updateRenderTargetMipmap(ye))}C.setRenderTarget(_e,we,Ce),C.setClearColor(ft,et),je!==void 0&&(H.viewport=je),C.toneMapping=Ze}function ur(M,D,W){let H=D.isScene===!0?D.overrideMaterial:null;for(let z=0,ye=M.length;z<ye;z++){let Se=M[z],{object:_e,geometry:we,group:Ce}=Se,Ze=Se.material;Ze.allowOverride===!0&&H!==null&&(Ze=H),_e.layers.test(W.layers)&&Uc(_e,D,W,we,Ze,Ce)}}function Uc(M,D,W,H,z,ye){F!==null&&z.isNodeMaterial&&F.setObject(M,z),M.onBeforeRender(C,D,W,H,z,ye),M.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),z.onBeforeRender(C,D,W,H,M,ye),z.transparent===!0&&z.side===It&&z.forceSinglePass===!1?(z.side=Zt,z.needsUpdate=!0,C.renderBufferDirect(W,D,H,z,M,ye),z.side=di,z.needsUpdate=!0,C.renderBufferDirect(W,D,H,z,M,ye),z.side=It):C.renderBufferDirect(W,D,H,z,M,ye),M.onAfterRender(C,D,W,H,z,ye)}function dr(M,D,W){D.isScene!==!0&&(D=vt);let H=V.get(M),z=b.state.lights,ye=b.state.shadowsArray,Se=z.state.version,_e=ue.getParameters(M,z.state,ye,D,W,b.state.lightProbeGridArray),we=ue.getProgramCacheKey(_e),Ce=H.programs;H.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?D.environment:null,H.fog=D.fog;let Ze=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;H.envMap=ce.get(M.envMap||H.environment,Ze),H.envMapRotation=H.environment!==null&&M.envMap===null?D.environmentRotation:M.envMapRotation,Ce===void 0&&(M.addEventListener("dispose",Pn),Ce=new Map,H.programs=Ce);let je=Ce.get(we);if(je!==void 0){if(H.currentProgram===je&&H.lightsStateVersion===Se)return Bc(M,_e),je}else _e.uniforms=ue.getUniforms(M),F!==null&&M.isNodeMaterial&&F.build(M,W,_e),M.onBeforeCompile(_e,C),je=ue.acquireProgram(_e,we),Ce.set(we,je),H.uniforms=_e.uniforms;let Te=H.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Te.clippingPlanes=De.uniform),Bc(M,_e),H.needsLights=hd(M),H.lightsStateVersion=Se,H.needsLights&&(Te.ambientLightColor.value=z.state.ambient,Te.lightProbe.value=z.state.probe,Te.sunLights.value=z.state.sun,Te.sunLightShadows.value=z.state.sunShadow,Te.directionalLights.value=z.state.directional,Te.directionalLightShadows.value=z.state.directionalShadow,Te.spotLights.value=z.state.spot,Te.spotLightShadows.value=z.state.spotShadow,Te.rectAreaLights.value=z.state.rectArea,Te.ltc_1.value=z.state.rectAreaLTC1,Te.ltc_2.value=z.state.rectAreaLTC2,Te.pointLights.value=z.state.point,Te.pointLightShadows.value=z.state.pointShadow,Te.hemisphereLights.value=z.state.hemi,Te.sunShadowMatrix.value=z.state.sunShadowMatrix,Te.sunShadowCascade.value=z.state.sunShadowCascade,Te.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Te.spotLightMatrix.value=z.state.spotLightMatrix,Te.spotLightMap.value=z.state.spotLightMap,Te.pointShadowMatrix.value=z.state.pointShadowMatrix),H.lightProbeGrid=b.state.lightProbeGridArray.length>0,H.currentProgram=je,H.uniformsList=null,je}function Fc(M){if(M.uniformsList===null){let D=M.currentProgram.getUniforms();M.uniformsList=ds.seqWithValue(D.seq,M.uniforms)}return M.uniformsList}function Bc(M,D){let W=V.get(M);W.outputColorSpace=D.outputColorSpace,W.batching=D.batching,W.batchingColor=D.batchingColor,W.instancing=D.instancing,W.instancingColor=D.instancingColor,W.instancingMorph=D.instancingMorph,W.skinning=D.skinning,W.morphTargets=D.morphTargets,W.morphNormals=D.morphNormals,W.morphColors=D.morphColors,W.morphTargetsCount=D.morphTargetsCount,W.numClippingPlanes=D.numClippingPlanes,W.numIntersection=D.numClipIntersection,W.vertexAlphas=D.vertexAlphas,W.vertexTangents=D.vertexTangents,W.toneMapping=D.toneMapping}function od(M,D){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;v.setFromMatrixPosition(D.matrixWorld);for(let W=0,H=M.length;W<H;W++){let z=M[W];if(z.texture!==null&&z.boundingBox.containsPoint(v))return z}return null}function ld(M,D,W,H,z){D.isScene!==!0&&(D=vt),Z.resetTextureUnits();let ye=D.fog,Se=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?D.environment:null,_e=ae===null?C.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:nt.workingColorSpace,we=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ce=ce.get(H.envMap||Se,we),Ze=H.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,je=!!W.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Te=!!W.morphAttributes.position,ut=!!W.morphAttributes.normal,Ct=!!W.morphAttributes.color,bt=Sn;H.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(bt=C.toneMapping);let _t=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,kt=_t!==void 0?_t.length:0,Me=V.get(H),Xt=b.state.lights;if(st===!0&&(pt===!0||M!==Q)){let xt=M===Q&&H.id===q;De.setState(H,M,xt)}let ct=!1;H.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==Xt.state.version||Me.outputColorSpace!==_e||z.isBatchedMesh&&Me.batching===!1||!z.isBatchedMesh&&Me.batching===!0||z.isBatchedMesh&&Me.batchingColor===!0&&z._colorsTexture===null||z.isBatchedMesh&&Me.batchingColor===!1&&z._colorsTexture!==null||z.isInstancedMesh&&Me.instancing===!1||!z.isInstancedMesh&&Me.instancing===!0||z.isSkinnedMesh&&Me.skinning===!1||!z.isSkinnedMesh&&Me.skinning===!0||z.isInstancedMesh&&Me.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Me.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Me.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Me.instancingMorph===!1&&z.morphTexture!==null||Me.envMap!==Ce||H.fog===!0&&Me.fog!==ye||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==De.numPlanes||Me.numIntersection!==De.numIntersection)||Me.vertexAlphas!==Ze||Me.vertexTangents!==je||Me.morphTargets!==Te||Me.morphNormals!==ut||Me.morphColors!==Ct||Me.toneMapping!==bt||Me.morphTargetsCount!==kt||!!Me.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(ct=!0):(ct=!0,Me.__version=H.version);let cn=Me.currentProgram;ct===!0&&(cn=dr(H,D,z),F&&H.isNodeMaterial&&F.onUpdateProgram(H,cn,Me));let In=!1,Jn=!1,Li=!1,mt=cn.getUniforms(),Rt=Me.uniforms;if(_.useProgram(cn.program)&&(In=!0,Jn=!0,Li=!0),H.id!==q&&(q=H.id,Jn=!0),Me.needsLights){let xt=od(b.state.lightProbeGridArray,z);Me.lightProbeGrid!==xt&&(Me.lightProbeGrid=xt,Jn=!0)}if(In||Q!==M){_.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),mt.setValue(I,"projectionMatrix",M.projectionMatrix),mt.setValue(I,"viewMatrix",M.matrixWorldInverse);let Qn=mt.map.cameraPosition;Qn!==void 0&&Qn.setValue(I,Ee.setFromMatrixPosition(M.matrixWorld)),A.logarithmicDepthBuffer&&mt.setValue(I,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&mt.setValue(I,"isOrthographic",M.isOrthographicCamera===!0),Q!==M&&(Q=M,Jn=!0,Li=!0)}if(Me.needsLights&&(Xt.state.sunShadowMap.length>0&&mt.setValue(I,"sunShadowMap",Xt.state.sunShadowMap,Z),Xt.state.directionalShadowMap.length>0&&mt.setValue(I,"directionalShadowMap",Xt.state.directionalShadowMap,Z),Xt.state.spotShadowMap.length>0&&mt.setValue(I,"spotShadowMap",Xt.state.spotShadowMap,Z),Xt.state.pointShadowMap.length>0&&mt.setValue(I,"pointShadowMap",Xt.state.pointShadowMap,Z)),z.isSkinnedMesh){mt.setOptional(I,z,"bindMatrix"),mt.setOptional(I,z,"bindMatrixInverse");let xt=z.skeleton;xt&&(xt.boneTexture===null&&xt.computeBoneTexture(),mt.setValue(I,"boneTexture",xt.boneTexture,Z))}z.isBatchedMesh&&(mt.setOptional(I,z,"batchingTexture"),mt.setValue(I,"batchingTexture",z._matricesTexture,Z),mt.setOptional(I,z,"batchingIdTexture"),mt.setValue(I,"batchingIdTexture",z._indirectTexture,Z),mt.setOptional(I,z,"batchingColorTexture"),z._colorsTexture!==null&&mt.setValue(I,"batchingColorTexture",z._colorsTexture,Z));let jn=W.morphAttributes;if((jn.position!==void 0||jn.normal!==void 0||jn.color!==void 0)&&N.update(z,W,cn),(Jn||Me.receiveShadow!==z.receiveShadow)&&(Me.receiveShadow=z.receiveShadow,mt.setValue(I,"receiveShadow",z.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&D.environment!==null&&(Rt.envMapIntensity.value=D.environmentIntensity),Rt.dfgLUT!==void 0&&(Rt.dfgLUT.value=n_()),Jn){if(mt.setValue(I,"toneMappingExposure",C.toneMappingExposure),Me.needsLights&&cd(Rt,Li),ye&&H.fog===!0&&Le.refreshFogUniforms(Rt,ye),Le.refreshMaterialUniforms(Rt,H,ee,K,b.state.transmissionRenderTarget[M.id]),Me.needsLights&&Me.lightProbeGrid){let xt=Me.lightProbeGrid;Rt.probesSH.value=xt.texture,Rt.probesMin.value.copy(xt.boundingBox.min),Rt.probesMax.value.copy(xt.boundingBox.max),Rt.probesResolution.value.copy(xt.resolution)}ds.upload(I,Fc(Me),Rt,Z)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(ds.upload(I,Fc(Me),Rt,Z),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&mt.setValue(I,"center",z.center),mt.setValue(I,"modelViewMatrix",z.modelViewMatrix),mt.setValue(I,"normalMatrix",z.normalMatrix),mt.setValue(I,"modelMatrix",z.matrixWorld),H.uniformsGroups!==void 0){let xt=H.uniformsGroups;for(let Qn=0,Di=xt.length;Qn<Di;Qn++){let kc=xt[Qn];se.update(kc,cn),se.bind(kc,cn)}}return cn}function cd(M,D){M.ambientLightColor.needsUpdate=D,M.lightProbe.needsUpdate=D,M.sunLights.needsUpdate=D,M.sunLightShadows.needsUpdate=D,M.directionalLights.needsUpdate=D,M.directionalLightShadows.needsUpdate=D,M.pointLights.needsUpdate=D,M.pointLightShadows.needsUpdate=D,M.spotLights.needsUpdate=D,M.spotLightShadows.needsUpdate=D,M.rectAreaLights.needsUpdate=D,M.hemisphereLights.needsUpdate=D}function hd(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return ae},this.setRenderTargetTextures=function(M,D,W){let H=V.get(M);H.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),V.get(M.texture).__webglTexture=D,V.get(M.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:W,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,D){let W=V.get(M);W.__webglFramebuffer=D,W.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(M,D=0,W=0){ae=M,Y=D,X=W;let H=null,z=!1,ye=!1;if(M){let _e=V.get(M);if(_e.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(I.FRAMEBUFFER,_e.__webglFramebuffer),ne.copy(M.viewport),Pe.copy(M.scissor),Ie=M.scissorTest,_.viewport(ne),_.scissor(Pe),_.setScissorTest(Ie),q=-1;return}else if(_e.__webglFramebuffer===void 0)Z.setupRenderTarget(M);else if(_e.__hasExternalTextures)Z.rebindTextures(M,V.get(M.texture).__webglTexture,V.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let Ze=M.depthTexture;if(_e.__boundDepthTexture!==Ze){if(Ze!==null&&V.has(Ze)&&(M.width!==Ze.image.width||M.height!==Ze.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(M)}}let we=M.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(ye=!0);let Ce=V.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ce[D])?H=Ce[D][W]:H=Ce[D],z=!0):M.samples>0&&Z.useMultisampledRTT(M)===!1?H=V.get(M).__webglMultisampledFramebuffer:Array.isArray(Ce)?H=Ce[W]:H=Ce,ne.copy(M.viewport),Pe.copy(M.scissor),Ie=M.scissorTest}else ne.copy(ve).multiplyScalar(ee).floor(),Pe.copy(Ge).multiplyScalar(ee).floor(),Ie=Tt;if(W!==0&&(H=k),_.bindFramebuffer(I.FRAMEBUFFER,H)&&_.drawBuffers(M,H),_.viewport(ne),_.scissor(Pe),_.setScissorTest(Ie),z){let _e=V.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+D,_e.__webglTexture,W)}else if(ye){let _e=D;for(let we=0;we<M.textures.length;we++){let Ce=V.get(M.textures[we]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+we,Ce.__webglTexture,W,_e)}}else if(M!==null&&W!==0){let _e=V.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,_e.__webglTexture,W)}q=-1};function Oc(M){let D=V.get(M);return(D.__readFormat!==M.format||D.__readType!==M.type)&&(D.__readFormat=M.format,D.__readType=M.type,D.__formatReadable=A.textureFormatReadable(M.format),D.__typeReadable=A.textureTypeReadable(M.type)),D}this.readRenderTargetPixels=function(M,D,W,H,z,ye,Se,_e=0){if(!(M&&M.isWebGLRenderTarget)){Oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=V.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we){_.bindFramebuffer(I.FRAMEBUFFER,we);try{let Ce=M.textures[_e],Ze=Ce.format,je=Ce.type;M.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+_e);let Te=Oc(Ce);if(Te.__formatReadable===!1){Oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Te.__typeReadable===!1){Oe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=M.width-H&&W>=0&&W<=M.height-z&&I.readPixels(D,W,H,z,pe.convert(Ze),pe.convert(je),ye)}finally{let Ce=ae!==null?V.get(ae).__webglFramebuffer:null;_.bindFramebuffer(I.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(M,D,W,H,z,ye,Se,_e=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=V.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we)if(D>=0&&D<=M.width-H&&W>=0&&W<=M.height-z){_.bindFramebuffer(I.FRAMEBUFFER,we);let Ce=M.textures[_e],Ze=Ce.format,je=Ce.type;M.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+_e);let Te=Oc(Ce);if(Te.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Te.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ut=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,ut),I.bufferData(I.PIXEL_PACK_BUFFER,ye.byteLength,I.STREAM_READ),I.readPixels(D,W,H,z,pe.convert(Ze),pe.convert(je),0),I.bindBuffer(I.PIXEL_PACK_BUFFER,null);let Ct=ae!==null?V.get(ae).__webglFramebuffer:null;_.bindFramebuffer(I.FRAMEBUFFER,Ct);let bt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Xh(I,bt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,ut),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ye),I.bindBuffer(I.PIXEL_PACK_BUFFER,null),I.deleteBuffer(ut),I.deleteSync(bt),ye}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,D=null,W=0){let H=Math.pow(2,-W),z=Math.floor(M.image.width*H),ye=Math.floor(M.image.height*H),Se=D!==null?D.x:0,_e=D!==null?D.y:0;Z.setTexture2D(M,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,Se,_e,z,ye),_.unbindTexture()},this.copyTextureToTexture=function(M,D,W=null,H=null,z=0,ye=0){let Se,_e,we,Ce,Ze,je,Te,ut,Ct,bt=M.isCompressedTexture?M.mipmaps[ye]:M.image;if(W!==null)Se=W.max.x-W.min.x,_e=W.max.y-W.min.y,we=W.isBox3?W.max.z-W.min.z:1,Ce=W.min.x,Ze=W.min.y,je=W.isBox3?W.min.z:0;else{let Rt=Math.pow(2,-z);Se=Math.floor(bt.width*Rt),_e=Math.floor(bt.height*Rt),M.isDataArrayTexture?we=bt.depth:M.isData3DTexture?we=Math.floor(bt.depth*Rt):we=1,Ce=0,Ze=0,je=0}H!==null?(Te=H.x,ut=H.y,Ct=H.z):(Te=0,ut=0,Ct=0);let _t=pe.convert(D.format),kt=pe.convert(D.type),Me;D.isData3DTexture?(Z.setTexture3D(D,0),Me=I.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(Z.setTexture2DArray(D,0),Me=I.TEXTURE_2D_ARRAY):(Z.setTexture2D(D,0),Me=I.TEXTURE_2D),_.activeTexture(I.TEXTURE0),_.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,D.flipY),_.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),_.pixelStorei(I.UNPACK_ALIGNMENT,D.unpackAlignment);let Xt=_.getParameter(I.UNPACK_ROW_LENGTH),ct=_.getParameter(I.UNPACK_IMAGE_HEIGHT),cn=_.getParameter(I.UNPACK_SKIP_PIXELS),In=_.getParameter(I.UNPACK_SKIP_ROWS),Jn=_.getParameter(I.UNPACK_SKIP_IMAGES);_.pixelStorei(I.UNPACK_ROW_LENGTH,bt.width),_.pixelStorei(I.UNPACK_IMAGE_HEIGHT,bt.height),_.pixelStorei(I.UNPACK_SKIP_PIXELS,Ce),_.pixelStorei(I.UNPACK_SKIP_ROWS,Ze),_.pixelStorei(I.UNPACK_SKIP_IMAGES,je);let Li=M.isDataArrayTexture||M.isData3DTexture,mt=D.isDataArrayTexture||D.isData3DTexture;if(M.isDepthTexture){let Rt=V.get(M),jn=V.get(D),xt=V.get(Rt.__renderTarget),Qn=V.get(jn.__renderTarget);_.bindFramebuffer(I.READ_FRAMEBUFFER,xt.__webglFramebuffer),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,Qn.__webglFramebuffer);for(let Di=0;Di<we;Di++)Li&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,V.get(M).__webglTexture,z,je+Di),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,V.get(D).__webglTexture,ye,Ct+Di)),I.blitFramebuffer(Ce,Ze,Se,_e,Te,ut,Se,_e,I.DEPTH_BUFFER_BIT,I.NEAREST);_.bindFramebuffer(I.READ_FRAMEBUFFER,null),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(z!==0||M.isRenderTargetTexture||V.has(M)){let Rt=V.get(M),jn=V.get(D);_.bindFramebuffer(I.READ_FRAMEBUFFER,L),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,G);for(let xt=0;xt<we;xt++)Li?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Rt.__webglTexture,z,je+xt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Rt.__webglTexture,z),mt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,jn.__webglTexture,ye,Ct+xt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,jn.__webglTexture,ye),z!==0?I.blitFramebuffer(Ce,Ze,Se,_e,Te,ut,Se,_e,I.COLOR_BUFFER_BIT,I.NEAREST):mt?I.copyTexSubImage3D(Me,ye,Te,ut,Ct+xt,Ce,Ze,Se,_e):I.copyTexSubImage2D(Me,ye,Te,ut,Ce,Ze,Se,_e);_.bindFramebuffer(I.READ_FRAMEBUFFER,null),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else mt?M.isDataTexture||M.isData3DTexture?I.texSubImage3D(Me,ye,Te,ut,Ct,Se,_e,we,_t,kt,bt.data):D.isCompressedArrayTexture?I.compressedTexSubImage3D(Me,ye,Te,ut,Ct,Se,_e,we,_t,bt.data):I.texSubImage3D(Me,ye,Te,ut,Ct,Se,_e,we,_t,kt,bt):M.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,ye,Te,ut,Se,_e,_t,kt,bt.data):M.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,ye,Te,ut,bt.width,bt.height,_t,bt.data):I.texSubImage2D(I.TEXTURE_2D,ye,Te,ut,Se,_e,_t,kt,bt);_.pixelStorei(I.UNPACK_ROW_LENGTH,Xt),_.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ct),_.pixelStorei(I.UNPACK_SKIP_PIXELS,cn),_.pixelStorei(I.UNPACK_SKIP_ROWS,In),_.pixelStorei(I.UNPACK_SKIP_IMAGES,Jn),ye===0&&D.generateMipmaps&&I.generateMipmap(Me),_.unbindTexture()},this.initRenderTarget=function(M){V.get(M).__webglFramebuffer===void 0&&Z.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Z.setTextureCube(M,0):M.isData3DTexture?Z.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Z.setTexture2DArray(M,0):Z.setTexture2D(M,0),_.unbindTexture()},this.resetState=function(){Y=0,X=0,ae=null,_.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=nt._getDrawingBufferColorSpace(e),t.unpackColorSpace=nt._getUnpackColorSpace()}};var te=256;function an(i=te,e=te){let t=document.createElement("canvas");return t.width=i,t.height=e,t}function on(i,e=1,t=1){let n=new Yn(i);return n.colorSpace=Lt,n.wrapS=n.wrapT=Ki,n.repeat.set(e,t),n.anisotropy=8,n}function ln(i,e,t,n){let s=i.getImageData(0,0,e,t),r=s.data;for(let a=0;a<r.length;a+=4){let o=(Math.random()-.5)*n;r[a]+=o,r[a+1]+=o,r[a+2]+=o}i.putImageData(s,0,0)}function fn(i,e,t,n,s,r=26){for(let a=0;a<n;a++)i.fillStyle=s(Math.random()),i.beginPath(),i.arc(Math.random()*e,Math.random()*t,4+Math.random()*r,0,Math.PI*2),i.fill()}function ar(i={}){let{base:e="#c9c6bc",grout:t="#9c9a90",tile:n=22,water:s=16}=i,r=an(),a=r.getContext("2d");a.fillStyle=e,a.fillRect(0,0,te,te),a.strokeStyle=t,a.lineWidth=1.1;for(let l=0;l<=te;l+=n)a.beginPath(),a.moveTo(l,0),a.lineTo(l,te),a.stroke();for(let l=0;l<=te;l+=n)a.beginPath(),a.moveTo(0,l),a.lineTo(te,l),a.stroke();for(let l=0;l<s;l++){let c=Math.random()*te,h=a.createLinearGradient(c,0,c,te);h.addColorStop(0,`rgba(74,78,68,${.1+Math.random()*.18})`),h.addColorStop(1,"rgba(74,78,68,0)"),a.fillStyle=h,a.fillRect(c,0,4+Math.random()*12,te)}fn(a,te,te,34,l=>`rgba(62,66,58,${.03+l*.07})`),ln(a,te,te,20);let o=a.createLinearGradient(0,te*.7,0,te);return o.addColorStop(0,"rgba(56,60,50,0)"),o.addColorStop(1,"rgba(56,60,50,0.40)"),a.fillStyle=o,a.fillRect(0,te*.7,te,te*.3),on(r)}function An(i={}){let{base:e="#7e8078",crack:t=18,wet:n=.35}=i,s=an(),r=s.getContext("2d");r.fillStyle=e,r.fillRect(0,0,te,te),fn(r,te,te,60,a=>`rgba(52,55,50,${.02+a*.06})`,34),fn(r,te,te,30,a=>`rgba(150,150,142,${.015+a*.04})`,22),r.strokeStyle="rgba(42,45,40,0.5)";for(let a=0;a<t;a++){r.lineWidth=.6+Math.random()*1.3,r.beginPath();let o=Math.random()*te,l=Math.random()*te;r.moveTo(o,l);for(let c=0;c<5;c++)o+=(Math.random()-.5)*46,l+=(Math.random()-.5)*46,r.lineTo(o,l);r.stroke()}if(n>0)for(let a=0;a<10;a++){let o=r.createRadialGradient(Math.random()*te,Math.random()*te,2,Math.random()*te,Math.random()*te,30+Math.random()*50);o.addColorStop(0,`rgba(38,44,46,${n*.5})`),o.addColorStop(1,"rgba(38,44,46,0)"),r.fillStyle=o,r.fillRect(0,0,te,te)}return ln(r,te,te,26),on(s)}function Tu(i,e={}){let{bg:t="#b0342a",fg:n="#f2efe6",w:s=512,h:r=128}=e,a=an(s,r),o=a.getContext("2d");o.fillStyle=t,o.fillRect(0,0,s,r),o.fillStyle=n;let l=Math.min(r*.62,s*.86/Math.max(i.length,1));o.font=`700 ${l}px "Microsoft YaHei","PingFang SC",sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(i,s/2,r*.54),o.strokeStyle="rgba(30,26,22,0.5)",o.lineWidth=5,o.strokeRect(2.5,2.5,s-5,r-5),fn(o,s,r,16,h=>`rgba(40,34,28,${.04+h*.12})`,26),ln(o,s,r,14);let c=on(a);return c.wrapS=c.wrapT=qt,c}function or(){let i=an(),e=i.getContext("2d");e.fillStyle="#5c6058",e.fillRect(0,0,te,te);for(let t=0;t<te;t+=32)e.fillStyle=`rgba(28,32,30,${.2+Math.random()*.2})`,e.fillRect(t,0,2,te);return fn(e,te,te,40,t=>`rgba(92,64,40,${.05+t*.18})`,30),ln(e,te,te,22),on(i)}function uc(){let i=an(64,64),e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,64);t.addColorStop(0,"#4a5560"),t.addColorStop(.5,"#333b44"),t.addColorStop(1,"#242a31"),e.fillStyle=t,e.fillRect(0,0,64,64),ln(e,64,64,12);let n=on(i);return n.wrapS=n.wrapT=qt,n}var lc=null,cc=null,hc=null,wu=null;function dc(i=.9,e=1.2){lc||(lc=new Ae({color:9343624,roughness:.85,metalness:.15}),cc=new Ae({color:4869448,roughness:.6,metalness:.6}));let t=new He,n=new B(new oe(i,e,.08),lc);t.add(n);let s=new B(new it(i*.82,e*.82),yo());s.position.z=.045,t.add(s);for(let a=1;a<=4;a++){let o=new B(new oe(.025,e*.94,.025),cc);o.position.set(-i/2+i*a/5,0,.06),t.add(o)}let r=new B(new oe(i*.94,.025,.025),cc);return r.position.set(0,0,.06),t.add(r),t}var Au=null;function yo(){return yo._m||(yo._m=new Ae({map:Au,roughness:.35,metalness:.25})),yo._m}function Ru(){Au=uc()}function fc(i={}){let{base:e="#8a5f4a",mortar:t="#6f6a60",rowH:n=16,brickW:s=34}=i,r=an(),a=r.getContext("2d");a.fillStyle=t,a.fillRect(0,0,te,te);for(let o=0,l=0;l<te;l+=n,o++){let c=o%2*(s/2);for(let h=-s;h<te+s;h+=s){let d=.82+Math.random()*.36,u=Math.round(138*d),f=Math.round(95*d),p=Math.round(74*d);a.fillStyle=`rgb(${u},${f},${p})`,a.fillRect(h+c+1.2,l+1.2,s-2.4,n-2.4)}}return fn(a,te,te,40,o=>`rgba(40,36,32,${.03+o*.1})`,30),ln(a,te,te,22),on(r)}function Rn(i={}){let{base:e="#6d7370",period:t=14,vertical:n=!1}=i,s=an(),r=s.getContext("2d");r.fillStyle=e,r.fillRect(0,0,te,te);for(let a=0;a<te;a+=t){let o=r.createLinearGradient(a,0,a+t,0);o.addColorStop(0,"rgba(255,255,255,0.13)"),o.addColorStop(.5,"rgba(0,0,0,0.20)"),o.addColorStop(1,"rgba(255,255,255,0.06)"),r.fillStyle=o,n?r.fillRect(a,0,t,te):r.fillRect(0,a,te,t)}return fn(r,te,te,34,a=>`rgba(96,64,40,${.04+a*.16})`,26),ln(r,te,te,18),on(s)}function xo(i={}){let{base:e="#46525c",mullion:t="#2c3238",cell:n=32}=i,s=an(),r=s.getContext("2d");r.fillStyle=e,r.fillRect(0,0,te,te);for(let a=0;a<te;a+=n)for(let o=0;o<te;o+=n){let l=.78+Math.random()*.5;r.fillStyle=`rgba(${Math.round(96*l)},${Math.round(112*l)},${Math.round(124*l)},0.85)`,r.fillRect(o+1.5,a+1.5,n-3,n-3);let c=r.createLinearGradient(o,a,o+n,a+n);c.addColorStop(0,"rgba(190,205,215,0.16)"),c.addColorStop(.5,"rgba(0,0,0,0)"),c.addColorStop(1,"rgba(20,26,30,0.22)"),r.fillStyle=c,r.fillRect(o+1.5,a+1.5,n-3,n-3)}r.strokeStyle=t,r.lineWidth=3;for(let a=0;a<=te;a+=n)r.beginPath(),r.moveTo(a,0),r.lineTo(a,te),r.stroke(),r.beginPath(),r.moveTo(0,a),r.lineTo(te,a),r.stroke();return ln(r,te,te,10),on(s)}function Cu(){let i=an(),e=i.getContext("2d");e.fillStyle="#4a4c4a",e.fillRect(0,0,te,te),fn(e,te,te,70,t=>`rgba(30,32,33,${.05+t*.14})`,40),fn(e,te,te,40,t=>`rgba(120,122,118,${.02+t*.05})`,18);for(let t=0;t<6;t++){e.strokeStyle="rgba(26,28,28,0.6)",e.lineWidth=1+Math.random(),e.beginPath();let n=Math.random()*te,s=Math.random()*te;e.moveTo(n,s);for(let r=0;r<6;r++)n+=(Math.random()-.5)*60,s+=(Math.random()-.5)*60,e.lineTo(n,s);e.stroke()}return ln(e,te,te,30),on(i)}function Pu(i={}){let{base:e="#8b8a82",gap:t="#706f68",tile:n=42}=i,s=an(),r=s.getContext("2d");r.fillStyle=t,r.fillRect(0,0,te,te);for(let a=0;a<te;a+=n)for(let o=0;o<te;o+=n){let l=.86+Math.random()*.28;r.fillStyle=`rgb(${Math.round(155*l)},${Math.round(154*l)},${Math.round(146*l)})`,r.fillRect(o+1.5,a+1.5,n-3,n-3)}return fn(r,te,te,30,a=>`rgba(60,62,58,${.03+a*.08})`,26),ln(r,te,te,16),on(s)}function Iu(i={}){let{base:e="#454b3e"}=i,t=an(),n=t.getContext("2d");n.fillStyle=e,n.fillRect(0,0,te,te);for(let s=0;s<2600;s++){let r=.6+Math.random()*.9;n.strokeStyle=`rgba(${Math.round(72*r)},${Math.round(80*r)},${Math.round(58*r)},0.8)`,n.lineWidth=1;let a=Math.random()*te,o=Math.random()*te;n.beginPath(),n.moveTo(a,o),n.lineTo(a+(Math.random()-.5)*4,o-3-Math.random()*5),n.stroke()}return fn(n,te,te,30,s=>`rgba(38,42,32,${.05+s*.14})`,34),ln(n,te,te,14),on(t)}function vo(i={}){let{base:e="#8f8b84"}=i,t=an(),n=t.getContext("2d");n.fillStyle=e,n.fillRect(0,0,te,te);for(let s=0;s<30;s++){n.strokeStyle=`rgba(60,56,52,${.06+Math.random()*.12})`,n.lineWidth=.6+Math.random()*1.6,n.beginPath();let r=Math.random()*te,a=Math.random()*te;n.moveTo(r,a);for(let o=0;o<4;o++)r+=(Math.random()-.5)*110,a+=(Math.random()-.5)*40,n.lineTo(r,a);n.stroke()}return fn(n,te,te,20,s=>`rgba(160,156,148,${.03+s*.07})`,40),ln(n,te,te,12),on(t)}function Lu(i={}){let{base:e="#6b4f38"}=i,t=an(),n=t.getContext("2d");n.fillStyle=e,n.fillRect(0,0,te,te);for(let s=0;s<90;s++){n.strokeStyle=`rgba(${40+Math.random()*60},${28+Math.random()*40},${18+Math.random()*30},${.12+Math.random()*.22})`,n.lineWidth=.7+Math.random()*2.4,n.beginPath();let r=Math.random()*te;n.moveTo(0,r);for(let a=0;a<=te;a+=32)r+=(Math.random()-.5)*5,n.lineTo(a,r);n.stroke()}return ln(n,te,te,16),on(t)}function Du(){hc||(hc=new Ae({color:11053214,roughness:.8,metalness:.1}),wu=new Ae({color:5921878,roughness:.7,metalness:.3}));let i=new He,e=new B(new oe(.78,.54,.32),hc);i.add(e);let t=new B(new qe(.2,.2,.04,16),wu);return t.rotation.x=Math.PI/2,t.position.z=.17,i.add(t),i}var pn=null,Ye=i=>new Ae(i);function Nu(){let i={glass:uc(),asphalt:Cu(),paver:Pu(),grass:Iu(),stone:vo(),wood:Lu(),roof:or()},e=n=>n<=1?[Ye({map:ar({base:"#c2bfb4"}),roughness:.95}),Ye({map:ar({base:"#b6b3a7",tile:19}),roughness:.95}),Ye({map:fc({base:"#7d5644"}),roughness:.96}),Ye({map:An({base:"#8a8880",wet:.2}),roughness:.97})]:n===2?[Ye({map:ar({base:"#cbc9c0",tile:26,water:8}),roughness:.94}),Ye({map:An({base:"#9a978e",wet:.1,crack:10}),roughness:.95}),Ye({map:fc({base:"#8a6a56",rowH:18}),roughness:.95}),Ye({map:ar({base:"#b8b6ac",tile:30,water:6}),roughness:.94})]:[Ye({map:vo({base:"#a8a49b"}),roughness:.7}),Ye({map:xo({base:"#424e58"}),roughness:.28,metalness:.42}),Ye({map:vo({base:"#9c9a92"}),roughness:.72}),Ye({map:xo({base:"#4a5258",cell:36}),roughness:.3,metalness:.4})],t=n=>n<=1?Ye({map:An({base:"#6c6f66",wet:.4,crack:22}),roughness:.98}):Ye(n===2?{map:An({base:"#7d7f76",wet:.28,crack:14}),roughness:.97}:{map:i.paver.clone(),roughness:.9});pn={tex:i,tiers:{},common:{metal:Ye({color:5132620,roughness:.62,metalness:.55}),metalLight:Ye({color:9277834,roughness:.55,metalness:.5}),dark:Ye({color:2895665,roughness:.8}),rubber:Ye({color:1974306,roughness:.95}),wood:Ye({map:i.wood,roughness:.88}),stone:Ye({map:i.stone,roughness:.72}),asphalt:Ye({map:i.asphalt,roughness:.95}),paver:Ye({map:i.paver,roughness:.9}),grass:Ye({map:i.grass,roughness:.99}),glassPane:Ye({map:i.glass,roughness:.32,metalness:.34}),curtain:Ye({map:xo(),roughness:.3,metalness:.4}),panel:Ye({map:Rn({base:"#6d7370"}),roughness:.78,metalness:.28}),panelBlue:Ye({map:Rn({base:"#4e5a63",period:18}),roughness:.74,metalness:.3}),panelRust:Ye({map:Rn({base:"#6a5a4c",period:16}),roughness:.86,metalness:.18}),tarp:Ye({color:4147780,roughness:.96,side:It}),laneSurf:Ye({map:An({base:"#75786f",wet:.5,crack:26}),roughness:.97}),signRed:null,cloth:[5991290,9076856,7167846,8030834,10132114].map(n=>Ye({color:n,roughness:.95,side:It}))}};for(let n of[1,2,3]){let s=e(n);pn.tiers[n]={walls:s,wall:s[0],ground:t(n),roof:Ye({map:or(),roughness:.93}),accent:n<=1?Ye({color:9058864,roughness:.85}):Ye(n===2?{color:6975339,roughness:.8}:{color:3621194,roughness:.68,metalness:.25}),trim:n<=1?Ye({color:10129798,roughness:.9}):Ye(n===2?{color:11052700,roughness:.88}:{color:11580333,roughness:.7}),awning:n<=1?Ye({color:4867128,roughness:.95,side:It}):Ye({color:5593944,roughness:.92,side:It})}}for(let n of[1,2,3])pn.tiers[n].ground.map.repeat.set(1,1),pn.tiers[n].ground.map.needsUpdate=!0;return pn.common.asphalt.map.repeat.set(1,1),pn.common.laneSurf.map.repeat.set(1,1),pn.common.paver.map.repeat.set(1,1),pn}function kn(){if(!pn)throw new Error("palette 未初始化，先调用 buildPalette()");return pn}var Kn=i=>pn.tiers[Math.min(3,Math.max(1,i|0))]||pn.tiers[2];var at=(i,e)=>i+Math.random()*(e-i),$n=(i,e)=>Math.floor(at(i,e+1)),Cn=i=>i[Math.floor(Math.random()*i.length)],Pi=i=>Math.random()<i,le=null;function Uu(i){le=i}var pc=new Map;function i_(i,e={}){let t=i+JSON.stringify(e);if(pc.has(t))return pc.get(t);let n=new Ae({map:Tu(i,e),roughness:.85});return pc.set(t,n),n}var mc=new Map;function Mo(i,e={}){let{bg:t="#e8e4d8",fg:n="#2a2a28",w:s=512,h:r=128,font:a='700 62px "Microsoft YaHei","PingFang SC",sans-serif'}=e,o=`${i}|${t}|${n}|${s}|${r}|${a}`;if(mc.has(o))return mc.get(o);let l=document.createElement("canvas");l.width=s,l.height=r;let c=l.getContext("2d");c.fillStyle=t,c.fillRect(0,0,s,r),c.fillStyle=n,c.font=a,c.textAlign="center",c.textBaseline="middle";let h=String(i).split(`
`),d=r/(h.length+.6);h.forEach((p,x)=>c.fillText(p,s/2,d*(x+.9)));let u=new Yn(l);u.colorSpace=Lt,u.wrapS=u.wrapT=qt;let f=new Ae({map:u,roughness:.9});return mc.set(o,f),f}function Fu({w:i,d:e,floors:t,floorH:n=2.9,tier:s=1,windows:r=!0}){let a=Kn(s),o=new He,l=t*n,c=Cn(a.walls),h=new oe(i,l,e),d=c.clone();d.map=c.map.clone(),d.map.needsUpdate=!0,d.map.repeat.set(i/3.2,l/3.2);let u=new B(h,d);if(u.position.y=l/2,u.castShadow=!0,u.receiveShadow=!0,o.add(u),r){let p=Math.max(2,Math.round(i/2.6));for(let x=0;x<t;x++){let g=x*n+n*.56;for(let m=0;m<p;m++){let S=-i/2+(m+.5)*(i/p);for(let T of[1,-1]){let v=dc(.88,1.24);v.position.set(S,g,T*(e/2+.05)),T<0&&(v.rotation.y=Math.PI),o.add(v)}}}}for(let p=0,x=$n(2,s===1?7:4);p<x;p++){let g=Du(),m=Pi(.5)?1:-1;g.position.set(at(-i/2+.7,i/2-.7),at(n*1.2,l-.9),m*(e/2+.19)),m<0&&(g.rotation.y=Math.PI),o.add(g)}if(s<=2)for(let p=0,x=$n(0,s===1?4:2);p<x;p++){let g=at(n*1.6,l-.6),m=Pi(.5)?1:-1,S=at(1.4,2.3),T=at(-i/2+1.2,i/2-1.2),v=new B(new qe(.028,.028,S,6),le.common.metal);v.rotation.z=Math.PI/2,v.position.set(T,g,m*(e/2+.5)),o.add(v);let E=$n(1,3);for(let b=0;b<E;b++){let R=at(.32,.55),y=at(.6,1),w=new B(new it(R,y),Cn(le.common.cloth));w.position.set(T-S/2+(b+1)*(S/(E+1)),g-y/2-.03,m*(e/2+.5)),w.castShadow=!0,o.add(w)}}let f=new B(new oe(i+.16,.5,e+.16),c);if(f.position.y=l+.25,f.castShadow=!0,o.add(f),Pi(s===1?.75:.4)){let p=new B(new qe(.62,.62,1.15,14),new Ae({color:10134428,roughness:.6,metalness:.35}));p.position.set(at(-i/4,i/4),l+1.1,at(-e/4,e/4)),p.castShadow=!0,o.add(p)}if(Pi(.5)){let p=new B(new oe(at(2,3.4),.12,at(1.6,2.6)),new Ae({map:or(),roughness:.9}));p.position.set(at(-i/4,i/4),l+.9,at(-e/4,e/4)),p.rotation.z=at(-.1,.1),p.castShadow=!0,o.add(p)}return o.userData.footprint={w:i,d:e,h:l},o}function bo({w:i,d:e,floors:t,floorH:n=2.85,tier:s=2,balcony:r=!0,units:a=null}){let o=Kn(s),l=new He,c=t*n,h=Cn(o.walls),d=h.clone();d.map=h.map.clone(),d.map.needsUpdate=!0,d.map.repeat.set(i/3.4,c/3.4);let u=new B(new oe(i,c,e),d);u.position.y=c/2,u.castShadow=!0,u.receiveShadow=!0,l.add(u);let f=a||Math.max(2,Math.round(i/3.6)),p=i/f;for(let g=0;g<t;g++){let m=g*n+n*.42;for(let S=0;S<f;S++){let T=-i/2+(S+.5)*p;for(let v of[1,-1]){let E=dc(1.05,1.35);E.position.set(T,m+.5,v*(e/2+.05)),v<0&&(E.rotation.y=Math.PI),l.add(E)}if(r&&g>0)for(let v of[1,-1]){let E=p*.78,b=new B(new oe(E,.12,1.05),o.trim);b.position.set(T,m+1.5,v*(e/2+.55)),b.castShadow=!0,b.receiveShadow=!0,l.add(b);let R=new B(new oe(E,.9,.06),le.common.metalLight);if(R.position.set(T,m+1.95,v*(e/2+1.06)),l.add(R),Pi(.35)){let y=new B(new it(E,.92),le.common.glassPane);y.position.set(T,m+1.95,v*(e/2+1.07)),v<0&&(y.rotation.y=Math.PI),l.add(y)}}}}for(let g=0;g<f;g++){let m=-i/2+(g+.5)*p,S=s<=1?le.common.dark:le.common.metalLight,T=new B(new oe(1.1,2.1,.1),S);if(T.position.set(m,1.05,e/2+.06),l.add(T),Pi(.6)){let v=new B(new it(.42,.3),Mo(`${$n(1,9)}栋`,{bg:"#c8c4b8",fg:"#3a3a36",w:256,h:180,font:'700 96px "Microsoft YaHei",sans-serif'}));v.position.set(m+.85,1.75,e/2+.07),l.add(v)}}let x=new B(new oe(i+.14,.46,e+.14),h);return x.position.y=c+.23,x.castShadow=!0,l.add(x),l.userData.footprint={w:i,d:e,h:c},l}function lr({w:i,d:e,floors:t,floorH:n=3.4,tier:s=3,podium:r=!0,crown:a=!0}){let o=Kn(s),l=new He,c=t*n,h=le.common.curtain.clone();h.map=h.map.clone(),h.map.needsUpdate=!0,h.map.repeat.set(i/4.2,c/4.2);let d=new B(new oe(i,c,e),h);d.position.y=c/2,d.castShadow=!0,d.receiveShadow=!0,l.add(d);let u=o.trim;for(let f=1;f<t;f++){let p=new B(new oe(i+.12,.14,e+.12),u);p.position.y=f*n,l.add(p)}if(r){let p=i+3.2,x=e+3.2,g=s>=3?new Ae({map:An({base:"#9c9a92",wet:0}),roughness:.66}):o.wall,m=new B(new oe(p,4.6,x),g);m.position.y=4.6/2,m.castShadow=!0,m.receiveShadow=!0,l.add(m);for(let T of[1,-1]){let v=new B(new it(p*.86,2.6),le.common.glassPane);v.position.set(0,1.9,T*(x/2+.03)),T<0&&(v.rotation.y=Math.PI),l.add(v)}let S=new B(new oe(Math.min(p*.5,6),.22,2.4),le.common.dark);S.position.set(0,3.3,x/2+1),S.castShadow=!0,l.add(S)}if(a){let f=new B(new oe(i*.62,1.6,e*.62),o.trim);f.position.y=c+.8,f.castShadow=!0,l.add(f);let p=new B(new qe(.06,.06,2.6,6),le.common.metal);p.position.y=c+2.9,l.add(p)}return l.userData.footprint={w:i,d:e,h:c},l}function gc({width:i=5,sign:e="小卖部",tier:t=2,height:n=3.4,open:s=!0,signColor:r=null}){let a=Kn(t),o=new He,l=new B(new oe(i,n,.3),a.wall);if(l.position.set(0,n/2,-.15),l.castShadow=!0,l.receiveShadow=!0,o.add(l),s){let u=new B(new it(i*.74,n*.7),le.common.glassPane);u.position.set(0,n*.36,.02),o.add(u);let f=new B(new oe(i*.78,.12,.08),le.common.metalLight);f.position.set(i*.39,n*.36,.04),o.add(f)}else{let u=new B(new oe(i*.78,n*.72,.1),new Ae({map:Rn({base:"#6b6f6a",period:9}),roughness:.86}));u.position.set(0,n*.37,.02),o.add(u)}let c=new B(new oe(i,.1,1.15),a.awning);c.position.set(0,n*.8,.6),c.rotation.x=-.12,c.castShadow=!0,o.add(c);let h=new B(new oe(i*.96,.8,.18),r?new Ae({color:r,roughness:.85}):a.accent);h.position.set(0,n*.98,.06),o.add(h);let d=new B(new it(i*.92,.72),i_(e));return d.position.set(0,n*.98,.16),o.add(d),o.userData.footprint={w:i,d:.6,h:n},o}function _c({w:i,d:e,h:t=6.5,tier:n=2,sawtooth:s=!0,doors:r=2,panel:a=null}){let o=new He,l=a||(n<=1?le.common.panelRust:le.common.panel),c=l.clone();c.map=l.map.clone(),c.map.needsUpdate=!0,c.map.repeat.set(i/4,t/4);let h=new B(new oe(i,t,e),c);if(h.position.y=t/2,h.castShadow=!0,h.receiveShadow=!0,o.add(h),s){let d=Math.max(2,Math.round(e/4));for(let u=0;u<d;u++){let f=-e/2+(u+.5)*(e/d),p=new B(new oe(i*.98,.1,e/d*.86),le.common.panel);p.position.set(0,t+.55,f),p.rotation.x=-.5,p.castShadow=!0,o.add(p);let x=new B(new it(i*.9,e/d*.66),le.common.glassPane);x.position.set(0,t+.42,f+.5),x.rotation.x=Math.PI/2-.9,o.add(x)}}else{let d=new B(new oe(i+.3,.18,e+.3),le.common.panel);d.position.y=t+.1,d.castShadow=!0,o.add(d)}for(let d=0;d<r;d++){let u=Math.min(4.2,i/(r+.6)),f=r===1?0:-i/2+(d+.5)*(i/r),p=new B(new oe(u,t*.62,.16),new Ae({map:Rn({base:"#7a7f78",period:11}),roughness:.84}));p.position.set(f,t*.31,e/2+.09),o.add(p)}if(Pi(.7)){let d=new B(new qe(.34,.34,t*.8,10),le.common.metal);d.position.set(-i/2-.4,t*.45,at(-e/3,e/3)),d.castShadow=!0,o.add(d)}for(let d=0,u=$n(1,3);d<u;d++){let f=new B(new oe(.5,.7,.3),le.common.metalLight);f.position.set(at(-i/2+1,i/2-1),at(2,3.4),e/2+.2),o.add(f)}return o.userData.footprint={w:i,d:e,h:t},o}function ps({w:i,d:e,h:t=11,tier:n=2,steps:s=!0,columns:r=!0,roofStyle:a="flat"}){let o=Kn(n),l=new He,c=n>=3?le.common.stone:new Ae({map:An({base:n<=1?"#8f8c84":"#a5a29a",wet:.1,crack:8}),roughness:.9}),h=c.clone();h.map=c.map.clone(),h.map.needsUpdate=!0,h.map.repeat.set(i/4.5,t/4.5);let d=new B(new oe(i,t,e),h);d.position.y=t/2,d.castShadow=!0,d.receiveShadow=!0,l.add(d);let u=Math.max(3,Math.round(i/2.4));for(let f=0;f<Math.max(1,Math.floor(t/3.2));f++){let p=1.9+f*3.2;if(p>t-1.2)break;for(let x=0;x<u;x++){let g=-i/2+(x+.5)*(i/u),m=new B(new it(i/u*.6,1.7),le.common.glassPane);m.position.set(g,p,e/2+.04),l.add(m)}}if(s){let f=Math.min(i*.62,12);for(let p=0;p<4;p++){let x=new B(new oe(f,.22,.9),le.common.stone);x.position.set(0,.11+p*.22,e/2+2.4-p*.9),x.receiveShadow=!0,l.add(x)}}if(r){let f=Math.max(3,Math.round(i/3.4));for(let x=0;x<f;x++){let g=-i/2+(x+.5)*(i/f),m=new B(new qe(.34,.38,t*.34,14),le.common.stone);m.position.set(g,t*.17,e/2+1.7),m.castShadow=!0,l.add(m)}let p=new B(new oe(i,.7,2.6),le.common.stone);p.position.set(0,t*.36,e/2+1.7),p.castShadow=!0,l.add(p)}if(a==="hip"){let f=new B(new Ei(i*.78,2.6,4),le.common.dark);f.rotation.y=Math.PI/4,f.position.y=t+1.3,f.castShadow=!0,l.add(f)}else{let f=new B(new oe(i+.4,.5,e+.4),o.trim);f.position.y=t+.25,f.castShadow=!0,l.add(f)}return l.userData.footprint={w:i,d:e,h:t},l}function yc({w:i,d:e,floors:t=4,floorH:n=3.6,tier:s=2,corridor:r=!0}){let a=Kn(s),o=new He,l=t*n,c=Cn(a.walls),h=c.clone();h.map=c.map.clone(),h.map.needsUpdate=!0,h.map.repeat.set(i/3.6,l/3.6);let d=new B(new oe(i,l,e),h);d.position.y=l/2,d.castShadow=!0,d.receiveShadow=!0,o.add(d);let u=Math.max(4,Math.round(i/3));for(let f=1;f<=t;f++){let p=(f-.5)*n;for(let g=0;g<u;g++){let m=-i/2+(g+.5)*(i/u),S=new B(new it(i/u*.72,n*.52),le.common.glassPane);if(S.position.set(m,p,e/2+.04),o.add(S),r){let T=S.clone();T.position.z=-(e/2+.04),T.rotation.y=Math.PI,o.add(T)}}if(r){let g=new B(new oe(i,.14,1.5),a.trim);g.position.set(0,(f-1)*n+n*.06,e/2+.8),g.receiveShadow=!0,o.add(g);let m=new B(new oe(i,1,.07),le.common.metalLight);m.position.set(0,(f-1)*n+n*.06+.55,e/2+1.52),o.add(m)}let x=new B(new oe(i+.1,.16,e+.1),a.trim);x.position.y=f*n,o.add(x)}return o.userData.footprint={w:i,d:e,h:l},o}function xc({w:i=2.4,d:e=1.2,tier:t=2,colors:n=null,goods:s=!0,box:r=!1}){let a=new He,o=i,l=e,c=new B(new oe(o,.1,l),le.common.wood);c.position.y=.9,c.castShadow=!0,c.receiveShadow=!0,a.add(c);for(let u of[-1,1]){let f=new B(new oe(.08,.9,l*.9),le.common.metal);f.position.set(u*(o/2-.14),.45,0),a.add(f)}let h=n||[7031364,4477530,5921348,4867152],d=new B(new oe(o*1.12,.08,l*1.5),new Ae({color:Cn(h),roughness:.95,side:It}));d.position.set(0,2.2,0),d.rotation.x=-.05,d.castShadow=!0,a.add(d);for(let u of[-1,1])for(let f of[-1,1]){let p=new B(new qe(.035,.035,2.2,6),le.common.metal);p.position.set(u*(o/2-.06),1.1,f*(l*.66)),a.add(p)}if(s){let u=$n(3,6);for(let f=0;f<u;f++){let p=at(.18,.34),x=at(.12,.3),g=new B(Math.random()<.5?new oe(p,x,p*.8):new qe(p*.4,p*.42,x,8),new Ae({color:Cn([6978122,9071162,8018506,5925482,9079386,10521178]),roughness:.9}));g.position.set(at(-o/2+.3,o/2-.3),.97+x/2,at(-l/2+.25,l/2-.25)),g.castShadow=!0,a.add(g)}}if(r)for(let u=0,f=$n(1,3);u<f;u++){let p=new B(new oe(at(.5,.8),at(.3,.5),at(.4,.6)),new Ae({color:Cn([14210248,9071178]),roughness:.92}));p.position.set(at(-o/2+.4,o/2-.4),.22,at(-l/2,l/2)-.3),p.castShadow=!0,a.add(p)}return a.userData.footprint={w:o,d:l,h:2.2},a}function So({w:i=6,d:e=2.4,h:t=2.6,color:n=4151914}){let s=new He,r=new Ae({map:Rn({base:"#3f5a6a",period:12}),roughness:.82,metalness:.24});r.color=new We(n);let a=new B(new oe(i,t,e),r);a.position.y=t/2,a.castShadow=!0,a.receiveShadow=!0,s.add(a);for(let o of[-1,1]){let l=new B(new oe(.08,t*.94,e*.94),le.common.dark);l.position.set(o*(i/2+.04),t/2,0),s.add(l)}return s.userData.footprint={w:i,d:e,h:t},s}function vc({r:i=2.2,h:e=3.4,tier:t=2}={}){let n=new He,s=new B(new qe(i,i,.3,6),le.common.stone);s.position.y=.15,s.receiveShadow=!0,n.add(s);for(let o=0;o<6;o++){let l=o/6*Math.PI*2,c=new B(new qe(.11,.13,e,8),t>=3?le.common.stone:new Ae({color:8011574,roughness:.88}));c.position.set(Math.cos(l)*i*.82,e/2+.3,Math.sin(l)*i*.82),c.castShadow=!0,n.add(c)}let r=new B(new Ei(i*1.35,1.5,6),le.common.dark);r.position.y=e+1,r.castShadow=!0,n.add(r);let a=new B(new bn(.16,10,8),le.common.accent||le.common.metal);return a.position.y=e+1.85,n.add(a),n.userData.footprint={w:i*1.4,d:i*1.4,h:e+1.5},n}function Mc({w:i=7,h:e=5.2,text:t="城中村"}){let n=new He,s=new Ae({color:6963256,roughness:.88});for(let c of[-1,1]){let h=new B(new oe(.6,e,.6),s);h.position.set(c*(i/2-.3),e/2,0),h.castShadow=!0,n.add(h)}let r=new B(new oe(i,.95,.7),s);r.position.y=e-.5,r.castShadow=!0,n.add(r);let a=new B(new oe(i+1.2,.28,1.4),le.common.dark);a.position.y=e+.05,a.castShadow=!0,n.add(a);let o=new B(new it(i*.62,.72),Mo(t,{bg:"#5a3630",fg:"#e8dcc0",font:'700 74px "Microsoft YaHei",sans-serif'}));o.position.set(0,e-.5,.37),n.add(o);let l=o.clone();return l.position.z=-.37,l.rotation.y=Math.PI,n.add(l),n}function Ii({len:i,h:e=2.4,tier:t=2,kind:n="brick"}){let s=new He,r;if(n==="hoarding"?r=new Ae({map:Rn({base:"#4d6a78",period:20}),roughness:.85,metalness:.15}):n==="railing"?r=null:r=new Ae({map:An({base:t<=1?"#84827a":"#9a9890",wet:.15,crack:10}),roughness:.94}),n==="railing"){let a=Math.max(2,Math.round(i/2.2));for(let o=0;o<=a;o++){let l=new B(new oe(.1,e,.1),le.common.metal);l.position.set(-i/2+o*i/a,e/2,0),s.add(l)}for(let o=0;o<3;o++){let l=new B(new oe(i,.06,.06),le.common.metal);l.position.set(0,.35+o*(e-.5)/2,0),s.add(l)}}else{let a=new B(new oe(i,e,.26),r);a.position.y=e/2,a.castShadow=!0,a.receiveShadow=!0,s.add(a);let o=new B(new oe(i+.1,.12,.36),le.common.trim||le.common.metalLight);o.position.y=e+.06,s.add(o)}return s.userData.footprint={w:i,d:.3,h:e},s}function ms({w:i=3.6,h:e=2.2,y:t=2.6,text:n="招工",bg:s="#3a4a58",fg:r="#e8e4d8",legs:a=!0}){let o=new He,l=new B(new oe(i,e,.12),le.common.dark);l.position.y=t,l.castShadow=!0,o.add(l);let c=new B(new it(i*.94,e*.88),Mo(n,{bg:s,fg:r,w:512,h:Math.round(512*e/i)}));if(c.position.set(0,t,.07),o.add(c),a)for(let h of[-1,1]){let d=new B(new qe(.06,.06,t-e/2,8),le.common.metal);d.position.set(h*i*.34,(t-e/2)/2,0),o.add(d)}return o}function Bu({h:i=9,arms:e=3}={}){let t=new He,n=new B(new qe(.15,.19,i,10),new Ae({map:An({base:"#8b8a80",wet:0,crack:8}),roughness:.95}));n.position.y=i/2,n.castShadow=!0,t.add(n);for(let s=0;s<e;s++){let r=new B(new oe(1.9,.09,.09),le.common.metal);r.position.y=i-1.6+s*.75,r.castShadow=!0,t.add(r)}return t}function Eo(i,e,t=.9){let n=new P().addVectors(i,e).multiplyScalar(.5);n.y-=t;let s=new ns([i,n,e]),r=new Hs(s,20,.028,5,!1);return new B(r,new Ae({color:2369066,roughness:.95}))}function bc({h:i=7,tier:e=2}={}){let t=new He,n=new B(new qe(.09,.13,i,10),le.common.metal);n.position.y=i/2,n.castShadow=!0,t.add(n);let s=new B(new oe(1.5,.09,.09),le.common.metal);s.position.set(.7,i-.1,0),s.rotation.z=.16,t.add(s);let r=new B(new oe(.72,.14,.34),le.common.metalLight);r.position.set(1.4,i-.24,0),t.add(r);let a=new B(new it(.6,.28),new Mn({color:e>=3?16773320:15259816,transparent:!0,opacity:.5}));return a.rotation.x=Math.PI/2,a.position.set(1.4,i-.33,0),t.add(a),t}function Sc({h:i=5.2,kind:e="broad",tier:t=2}={}){let n=new He,s=new Ae({color:4865844,roughness:.95}),r=t>=3?[4612154,4085302,5269572]:[3951156,4476986,3556398],a=i*(e==="palm"?.82:.46),o=new B(new qe(i*.035,i*.055,a,7),s);if(o.position.y=a/2,o.castShadow=!0,n.add(o),e==="palm")for(let l=0;l<7;l++){let c=l/7*Math.PI*2,h=new B(new it(i*.55,i*.14),new Ae({color:Cn(r),roughness:.9,side:It}));h.position.set(Math.cos(c)*i*.24,a+.2,Math.sin(c)*i*.24),h.rotation.set(-.5,-c,.2),n.add(h)}else{let l=$n(3,4);for(let c=0;c<l;c++){let h=i*at(.24,.34),d=new B(new is(h,1),new Ae({color:Cn(r),roughness:.97,flatShading:!0}));d.position.set(at(-i*.16,i*.16),a+h*at(.5,1.1),at(-i*.16,i*.16)),d.castShadow=!0,n.add(d)}}return n.userData.footprint={w:.5,d:.5,h:i},n}function Ou({w:i=1.6,d:e=1.6,h:t=.5}){let n=new He,s=new B(new oe(i,t,e),le.common.stone);s.position.y=t/2,s.castShadow=!0,s.receiveShadow=!0,n.add(s);let r=new B(new oe(i*.86,.1,e*.86),new Ae({color:3813672,roughness:1}));r.position.y=t+.02,n.add(r);for(let a=0,o=$n(3,6);a<o;a++){let l=new B(new is(at(.14,.26),0),new Ae({color:Cn([4215342,4873268,5917242,6969924]),roughness:.98,flatShading:!0}));l.position.set(at(-i/3,i/3),t+.16,at(-e/3,e/3)),l.castShadow=!0,n.add(l)}return n}function ku({len:i=2.2,h:e=1,kind:t="fence"}){let n=new He;if(t==="cone"){let s=new B(new Ei(.26,.62,10),new Ae({color:10111540,roughness:.85}));s.position.y=.31,s.castShadow=!0,n.add(s);let r=new B(new oe(.46,.05,.46),le.common.dark);r.position.y=.025,n.add(r)}else if(t==="stone"){let s=new B(new bn(.3,12,8),le.common.stone);s.scale.y=.85,s.position.y=.24,s.castShadow=!0,n.add(s)}else{let s=new B(new oe(i,.08,.08),le.common.metalLight);s.position.y=e,s.castShadow=!0,n.add(s);let r=s.clone();r.position.y=e*.55,n.add(r);for(let a=0;a<=2;a++){let o=new B(new qe(.05,.05,e,8),le.common.metalLight);o.position.set(-i/2+a*i/2,e/2,0),n.add(o)}}return n}function Hu({w:i=8,h:e=9,d:t=1.2}){let n=new He,s=le.common.metalLight,r=Math.max(2,Math.round(i/1.8));for(let l=0;l<=r;l++){let c=-i/2+l*i/r;for(let h of[-1,1]){let d=new B(new qe(.055,.055,e,8),s);d.position.set(c,e/2,h*t/2),n.add(d)}}let a=Math.max(2,Math.round(e/2.2));for(let l=1;l<=a;l++){let c=l*e/(a+1);for(let d of[-1,1]){let u=new B(new oe(i,.07,.07),s);u.position.set(0,c,d*t/2),n.add(u)}let h=new B(new oe(i,.08,t*.92),le.common.wood);h.position.set(0,c,0),h.receiveShadow=!0,n.add(h)}let o=new B(new it(i,e*.95),new Ae({color:3099194,roughness:.98,transparent:!0,opacity:.82,side:It}));return o.position.set(0,e/2,t/2+.03),n.add(o),n.userData.footprint={w:i,d:t,h:e},n}function zu({h:i=26,jib:e=20}){let t=new He,n=new Ae({color:9071162,roughness:.72,metalness:.35}),s=new B(new oe(3.2,.6,3.2),le.common.dark);s.position.y=.3,s.castShadow=!0,t.add(s);let r=new B(new oe(1.1,i,1.1),n);r.position.y=i/2+.6,r.castShadow=!0,t.add(r);let a=new B(new oe(e,.42,.5),n);a.position.set(e/2-2,i+.9,0),a.castShadow=!0,t.add(a);let o=new B(new oe(e*.3,.7,.9),le.common.dark);o.position.set(-e*.18-2,i+.9,0),t.add(o);let l=new B(new oe(1.2,1.2,1.4),le.common.metalLight);l.position.set(1.4,i+.2,.5),t.add(l);let c=new B(new qe(.05,.05,5,6),le.common.metal);return c.position.set(e*.4,i-1.6,0),t.add(c),t.userData.footprint={w:3.4,d:3.4,h:i},t}function gs({color:i=3817800,kind:e="sedan"}={}){let t=new He,n=new Ae({color:i,roughness:.42,metalness:.42});if(e==="truck"){let s=new B(new oe(2.2,2,2.4),n);s.position.set(0,1.5,2.6),s.castShadow=!0,t.add(s);let r=new B(new oe(2.5,2.6,5.4),new Ae({map:Rn({base:"#7a7f78",period:14}),roughness:.82}));r.position.set(0,1.9,-1.6),r.castShadow=!0,t.add(r);let a=new qe(.62,.62,.4,12);for(let o of[-1.2,1.2])for(let l of[3,-1,-3.4]){let c=new B(a,le.common.rubber);c.rotation.z=Math.PI/2,c.position.set(o,.62,l),t.add(c)}t.userData.footprint={w:2.6,d:8.8,h:3.2}}else{let s=new B(new oe(1.86,.7,4.4),n);s.position.y=.72,s.castShadow=!0,t.add(s);let r=new B(new oe(1.7,.62,2.2),le.common.glassPane);r.position.set(0,1.32,-.15),r.castShadow=!0,t.add(r);let a=new qe(.34,.34,.26,12);for(let o of[-.86,.86])for(let l of[1.45,-1.45]){let c=new B(a,le.common.rubber);c.rotation.z=Math.PI/2,c.position.set(o,.34,l),t.add(c)}t.userData.footprint={w:2,d:4.6,h:1.7}}return t}function _s({kind:i="scooter",color:e=3095108}={}){let t=new He,n=new qe(i==="bike"?.34:.27,i==="bike"?.34:.27,i==="bike"?.05:.1,14);if(i==="tricycle"){let s=new B(new oe(1.3,.5,2),new Ae({map:Rn({base:"#6a5a4a"}),roughness:.88}));s.position.set(0,.62,-.9),s.castShadow=!0,t.add(s);let r=new B(new oe(.6,.7,.9),new Ae({color:e,roughness:.6,metalness:.3}));r.position.set(0,.75,1),t.add(r);let a=new qe(.28,.28,.1,12);for(let c of[-.7,.7]){let h=new B(a,le.common.rubber);h.rotation.z=Math.PI/2,h.position.set(c,.28,-1.3),t.add(h)}let o=new B(a,le.common.rubber);o.rotation.z=Math.PI/2,o.position.set(0,.28,1.35),t.add(o);let l=new B(new oe(.7,.06,.06),le.common.metal);l.position.set(0,1.2,1.1),t.add(l),t.userData.footprint={w:1.5,d:3,h:1.3}}else if(i==="bike"){let s=new B(new oe(.08,.5,1.1),new Ae({color:e,roughness:.6,metalness:.4}));s.position.set(0,.66,0),s.rotation.x=.1,t.add(s);let r=new B(new oe(.6,.05,.05),le.common.metal);r.position.set(0,1.02,.52),t.add(r);let a=new B(new oe(.2,.09,.36),le.common.dark);a.position.set(0,.94,-.34),t.add(a);for(let o of[.56,-.56]){let l=new B(n,le.common.rubber);l.rotation.z=Math.PI/2,l.position.set(0,.34,o),t.add(l)}t.userData.footprint={w:.6,d:1.6,h:1.1}}else{let s=new B(new oe(.5,.36,1.5),new Ae({color:e,roughness:.55,metalness:.35}));s.position.y=.62,s.castShadow=!0,t.add(s);let r=new B(new oe(.44,.16,.7),le.common.dark);r.position.set(0,.86,-.16),t.add(r);for(let o of[.62,-.62]){let l=new B(n,le.common.rubber);l.rotation.z=Math.PI/2,l.position.set(0,.27,o),t.add(l)}let a=new B(new oe(.62,.06,.06),le.common.metal);a.position.set(0,1.06,.58),t.add(a),t.userData.footprint={w:.7,d:1.7,h:1.2}}return t}function cr({color:i=9075258,large:e=!1}={}){let t=new He;if(e){let n=new B(new oe(1.6,1.1,1),new Ae({color:Cn([3824202,4872810,5920072]),roughness:.82,metalness:.2}));n.position.y=.55,n.castShadow=!0,t.add(n);let s=new B(new oe(1.66,.1,1.06),le.common.dark);s.position.y=1.14,s.rotation.x=-.12,t.add(s);let r=new qe(.16,.16,.1,10);for(let a of[-.66,.66])for(let o of[-.4,.4]){let l=new B(r,le.common.rubber);l.rotation.z=Math.PI/2,l.position.set(a,.16,o),t.add(l)}t.userData.footprint={w:1.7,d:1.1,h:1.2}}else{let n=new B(new qe(.36,.3,.92,12),new Ae({color:i,roughness:.75}));n.position.y=.46,n.castShadow=!0,t.add(n);let s=new B(new qe(.39,.39,.08,12),le.common.dark);s.position.y=.94,t.add(s),t.userData.footprint={w:.8,d:.8,h:1}}return t}function Ec(){let i=new He,e=new B(new oe(1.7,.09,.48),le.common.wood);e.position.y=.46,e.castShadow=!0,i.add(e);let t=new B(new oe(1.7,.4,.08),le.common.wood);t.position.set(0,.72,-.2),i.add(t);for(let n of[-.7,.7]){let s=new B(new oe(.08,.46,.44),le.common.metal);s.position.set(n,.23,0),i.add(s)}return i}function Gu(){let i=new He,e=new B(new oe(4.6,.14,1.6),le.common.metalLight);e.position.y=2.6,e.castShadow=!0,i.add(e);for(let r of[-2.1,2.1]){let a=new B(new qe(.07,.07,2.6,8),le.common.metal);a.position.set(r,1.3,-.6),i.add(a)}let t=new B(new it(4.4,1.7),le.common.glassPane);t.position.set(0,1.7,-.72),i.add(t);let n=new B(new oe(3.2,.09,.4),le.common.dark);n.position.set(0,.55,-.5),i.add(n);let s=new B(new it(.7,1),Mo(`公交
站`,{bg:"#2f3f52",fg:"#d8dce0",w:256,h:380}));return s.position.set(2.5,2,0),i.add(s),i}function wc({r:i=2.4}={}){let e=new He,t=new B(new qe(i,i*1.05,.6,24),le.common.stone);t.position.y=.3,t.receiveShadow=!0,e.add(t);let n=new B(new qe(i*.92,i*.92,.1,24),new Ae({color:2767426,roughness:.14,metalness:.5}));n.position.y=.58,e.add(n);let s=new B(new qe(.14,.3,1.2,12),new Ae({color:5925490,roughness:.3,metalness:.4,transparent:!0,opacity:.6}));return s.position.y=1.2,e.add(s),e.userData.footprint={w:i*2.2,d:i*2.2,h:.7},e}function Vu({h:i=9,color:e=9054754}={}){let t=new He,n=new B(new qe(.06,.08,i,8),le.common.metalLight);n.position.y=i/2,t.add(n);let s=new B(new it(1.8,1.2),new Ae({color:e,roughness:.9,side:It}));return s.position.set(.9,i-.85,0),t.add(s),t}function Tc({len:i=6,rows:e=3,gap:t=1.1}={}){let n=new He;for(let s=0;s<e;s++){let r=new B(new oe(i,.06,.06),le.common.metalLight);r.position.set(0,.9,-s*t),n.add(r);let a=r.clone();a.position.y=.55,n.add(a);for(let o=0;o<=4;o++){let l=new B(new qe(.045,.045,.95,6),le.common.metalLight);l.position.set(-i/2+o*i/4,.48,-s*t),n.add(l)}}return n}function Wu({icon:i="❓",label:e="",color:t=14201946,y:n=0}){let s=new He,r=document.createElement("canvas");r.width=256,r.height=256;let a=r.getContext("2d");a.strokeStyle="rgba(232,214,150,0.95)",a.lineWidth=10,a.beginPath(),a.arc(128,128,104,0,Math.PI*2),a.stroke();let o=a.createRadialGradient(128,128,20,128,128,100);o.addColorStop(0,"rgba(232,214,150,0.42)"),o.addColorStop(1,"rgba(232,214,150,0)"),a.fillStyle=o,a.beginPath(),a.arc(128,128,100,0,Math.PI*2),a.fill();let l=new B(new it(2.4,2.4),new Mn({map:new Yn(r),transparent:!0,depthWrite:!1}));l.rotation.x=-Math.PI/2,l.position.y=.06+n,s.add(l);let c=document.createElement("canvas");c.width=256,c.height=128;let h=c.getContext("2d");h.fillStyle="rgba(24,28,30,0.82)",h.beginPath(),h.roundRect(6,6,244,116,16),h.fill(),h.fillStyle="#f0e8d0",h.font='700 76px "Microsoft YaHei","PingFang SC",sans-serif',h.textAlign="center",h.textBaseline="middle",h.fillText(i||"?",128,66);let d=new B(new it(1.5,.75),new Mn({map:new Yn(c),transparent:!0,depthWrite:!1}));return d.position.y=2.15,s.add(d),s.userData.hotspot={icon:i,label:e,color:t,sprite:d,ring:l},s}function wo({len:i=140,w:e=12,x:t=0,z:n=0,mat:s=null}){let r=s||le.common.asphalt,a=r.clone();a.map=r.map.clone(),a.map.needsUpdate=!0,a.map.repeat.set(e/3.4,i/3.4);let o=new B(new it(e,i),a);return o.rotation.x=-Math.PI/2,o.position.set(t,.012,n),o.receiveShadow=!0,o}function Xu({len:i=140,w:e=3.4,x:t=0,z:n=0}){let s=le.common.paver.clone();s.map=le.common.paver.map.clone(),s.map.needsUpdate=!0,s.map.repeat.set(e/1.8,i/1.8);let r=new B(new it(e,i),s);return r.rotation.x=-Math.PI/2,r.position.set(t,.02,n),r.receiveShadow=!0,r}function Ac({len:i=140,x:e=0,z:t=0,h:n=.16}){let s=new B(new oe(.22,n,i),le.common.trim||le.common.metalLight);return s.position.set(e,n/2,t),s.receiveShadow=!0,s}function qu({len:i=12,x:e=0,z:t=0,stripes:n=7}){let s=new He;for(let r=0;r<n;r++){let a=new B(new it(i,.52),new Ae({color:12105388,roughness:.94}));a.rotation.x=-Math.PI/2,a.position.set(e,.028,t-(n-1)*1/2+r*1),a.receiveShadow=!0,s.add(a)}return s}var re=(i,e)=>i+Math.random()*(e-i),en=(i,e)=>Math.floor(re(i,e+1)),At=i=>i[Math.floor(Math.random()*i.length)],Je=i=>Math.random()<i,Rc=class{constructor(e,t,n){this.scene=e,this.spec=t,this.tier=n,this.T=Kn(n),this.group=new He,this.group.name=t.id,this.colliders=[],this.blockers=[],this.lots=[],this.hotspots=[],e.add(this.group)}place(e,t,n,s=0,{collide:r="auto",block:a=!1,noMerge:o=!1}={}){e.position.set(t,e.position.y,n),e.rotation.y=s,o&&(e.userData.noMerge=!0),this.group.add(e);let l=e.userData.footprint;if(l&&r!=="none"){let c=Math.cos(-s),h=Math.sin(-s),d=(Math.abs(c)*l.w+Math.abs(h)*l.d)/2,u=(Math.abs(h)*l.w+Math.abs(c)*l.d)/2,f={minX:t-d,maxX:t+d,minZ:n-u,maxZ:n+u};this.colliders.push(f),a&&this.blockers.push(f)}return e}lot(e,t,n=0,s="walk"){this.lots.push({x:e,z:t,rot:n,kind:s})}spot(e,t,n,s,r=3.6){for(let a=0;a<30;a++){let o=re(e,t),l=re(n,s);if(Math.hypot(o,l-(this.spawnZ||0))>=r)return[o,l]}return[r_(e,t),n<0?s-2:n+2]}addRaw(e,t=!1){return t&&(e.userData.noMerge=!0),this.group.add(e),e}};function r_(i,e){return i+(e-i)*.5}function hr(i,e,t,n=4.5){let s=i.clone();return s.map=i.map.clone(),s.map.needsUpdate=!0,s.map.repeat.set(Math.max(1,e/n),Math.max(1,t/n)),s}function a_(i,e){let{group:t,T:n,spec:s}=i,r=190,a=new B(new it(r,r),hr(n.ground,r,r));a.rotation.x=-Math.PI/2,a.receiveShadow=!0,t.add(a);let o=i.streetLen=s.streetLen||96;if(i.courtW=s.courtW||46,i.plazaW=s.plazaW||44,i.spawnZ=12,e==="avenue"){i.roadW=i.spec.roadW||15;let l=wo({len:r,w:i.roadW});t.add(l);for(let c of[-1,1])t.add(Xu({len:r,w:3.6,x:c*(i.roadW/2+1.8)})),t.add(Ac({len:r,x:c*(i.roadW/2+.05),h:.16}));for(let c=-o/2+6;c<o/2;c+=22)t.add(qu({len:Math.min(i.roadW,12),z:c}));i.laneHalf=i.roadW/2+3.8}else if(e==="lane"){i.roadW=i.spec.roadW||9.5;let l=wo({len:r,w:i.roadW,mat:kn().common.laneSurf});t.add(l);for(let c of[-1,1])t.add(Ac({len:r,x:c*(i.roadW/2+.1),h:.12}));i.laneHalf=i.roadW/2}else if(e==="compound"){let l=new B(new it(i.courtW,o),hr(n.ground,i.courtW,o));l.rotation.x=-Math.PI/2,l.position.y=.014,l.receiveShadow=!0,t.add(l),i.laneHalf=i.courtW/2}else if(e==="yard"){let l=wo({len:r,w:58});l.position.y=.014,t.add(l);for(let c=0;c<6;c++){let h=re(8,16),d=re(8,16),u=new B(new it(h,d),hr(n.ground,h,d));u.rotation.x=-Math.PI/2,u.position.set(re(-22,22),.016,re(-o/2,o/2)),u.receiveShadow=!0,t.add(u)}i.laneHalf=26}else{let l=new B(new it(i.plazaW,o),hr(n.ground,i.plazaW,o));l.rotation.x=-Math.PI/2,l.position.y=.014,l.receiveShadow=!0,t.add(l);for(let c=0;c<5;c++){let h=re(9,18),d=re(12,22),u=new B(new it(h,d),hr(kn().common.grass,h,d,3));u.rotation.x=-Math.PI/2,u.position.set(re(-22,22),.018,re(-o/2+8,o/2-8)),u.receiveShadow=!0,t.add(u)}i.laneHalf=i.plazaW/2}}function o_(i){let{spec:e,tier:t}=i,n=i.streetLen,s=i.laneHalf,r=[];for(let a of[-1,1]){let o=-n/2;for(;o<n/2;){let l=re(6.5,10.5),c=re(7,10),h=Je(.25)?en(2,3):en(3,e.maxFloors||6),d=Fu({w:l,d:c,floors:h,tier:t}),u=a*(s+c/2+re(.05,.6));i.place(d,u,o+l/2,0,{block:!0}),r.push({x:u,z:o+l/2,d:c,w:l,side:a}),o+=l+re(.1,.6)}}return r}function l_(i){let{tier:e}=i,t=i.streetLen,n=i.laneHalf,s=[];for(let r of[-1,1]){let a=-t/2;for(;a<t/2;){let o=re(12,20),l=re(12,17),c=Je(e>=3?.62:.3),h;c?h=lr({w:o,d:l,floors:en(e>=3?8:5,e>=3?20:11),tier:e}):h=bo({w:o,d:l,floors:en(4,7),tier:e,units:Math.max(3,Math.round(o/4))});let d=r*(n+l/2);i.place(h,d,a+o/2,0,{block:!0}),s.push({x:d,z:a+o/2,d:l,w:o,side:r}),a+=o+re(.6,2.2)}}return s}function c_(i){let{spec:e,tier:t}=i,n=i.streetLen,s=i.courtW||46,r=s/2,a=t>=3?2:2.4,o=t>=3?"railing":"brick",l=9;for(let h of[-1,1])i.place(Ii({len:n,h:a,tier:t,kind:o}),h*(r+.4),0,Math.PI/2,{collide:"auto"});for(let h of[-1,1]){let d=(s-l)/2;i.place(Ii({len:d,h:a,tier:t,kind:o}),-(s+l)/4,h*(n/2-.4),0,{}),i.place(Ii({len:d,h:a,tier:t,kind:o}),(s+l)/4,h*(n/2-.4),0,{})}let c=[];for(let h of[-1,1]){let d=-n/2+8,u=e.blocks||3;for(let f=0;f<u;f++){let p=re(14,22),x=re(10,14),g;e.structure==="tower"?g=lr({w:p,d:x,floors:en(7,16),tier:t,podium:!1}):e.structure==="hall"?g=ps({w:p,d:x,h:re(10,15),tier:t,steps:!1,columns:f===0,roofStyle:"flat"}):g=bo({w:p,d:x,floors:e.floors||en(4,6),tier:t,units:Math.max(3,Math.round(p/4))});let m=h*(r-x/2-re(.5,1.5));i.place(g,m,d+p/2,0,{block:!0}),c.push({x:m,z:d+p/2,d:x,w:p,side:h}),d+=p+re(4,9)}}if(e.gate!==!1){let h=Mc({w:l+.6,h:5.4,text:e.shortName||e.name});i.place(h,0,n/2-.4,0,{})}return i.spawnZ=n/2-16,c}function h_(i){let{spec:e,tier:t}=i,n=i.streetLen,s=[];if(e.structure==="site"){let l=re(20,26),c=re(14,18),h=en(3,6),d=-5,u=i.spawnZ-(c/2+6),f=d_({w:l,d:c,floors:h,tier:t});i.place(f,d,u,.06,{block:!0});let p=Hu({w:l*.5,h:h*2.9,d:1.4});i.place(p,d-l*.24,u+c/2+1.3,0,{});let x=zu({h:26+h*2.8,jib:22});i.place(x,12,3,.6,{});for(let m of[-1,1])i.place(Ii({len:n,h:2.6,tier:t,kind:"hoarding"}),m*24,0,Math.PI/2,{});for(let m of[-1,1])i.place(Ii({len:40,h:2.6,tier:t,kind:"hoarding"}),0,m*(n/2),0,{});let g=_c({w:8,d:4.6,h:3.2,tier:t,sawtooth:!1,doors:1,panel:kn().common.panelRust});return i.place(g,-15,24,.18,{block:!0}),i.lots.push({x:d,z:u+c/2+4,rot:0,kind:"site-center"}),i.lots.push({x:4,z:20,rot:0,kind:"site"}),i.lots.push({x:-14,z:18,rot:0,kind:"site"}),i.spawnZ=22,s}let r=5;i.spawnZ=n/2-30;let a=-n/2+6;for(;a<n/2-10;){let l=re(15,21),c=re(11,15),h=re(6,9.5),d=Je(.5)?-1:1,u=_c({w:l,d:c,h,tier:t,sawtooth:Je(.7),doors:en(2,3)}),f=d*(r+c/2+re(0,2));i.place(u,f,a+l/2,d>0?0:Math.PI,{block:!0}),s.push({x:f,z:a+l/2,d:c,w:l,side:d}),a+=l+re(3,8)}for(let l=0;l<5;l++){let c=So({w:re(5,7),d:2.5,h:re(2.5,3),color:At([4151914,5917242,4872772,6969930])}),h=At([-1,1])*re(2,12);i.place(c,h,u_(-n/2+6,n/2-6,i.spawnZ),re(-.4,.4)+(Je(.5)?0:Math.PI/2),{})}let o=l=>{let c=Je(.5)?1:-1,[h,d]=i.spot(c*2.4,c*7.5,-n/2+8,n/2-8,l);return Math.abs(d-i.spawnZ)<7?[h,d+(d<i.spawnZ?-8:8)]:[h,d]};for(let l=0;l<4;l++){let c=new He,h=re(4.2,6.2),d=2.5,u=So({w:h,d,h:2.6,color:At([4151914,4872772,6969930,5917242])});if(c.add(u),Je(.45)){let x=So({w:h,d,h:2.6,color:At([4872772,4151914,6969930])});x.position.y=2.6,x.rotation.y=Je(.5)?0:.06,c.add(x)}let[f,p]=o(9);c.userData.footprint={w:h,d,h:2.6},i.place(c,f,p,Je(.5)?0:Math.PI/2,{})}for(let l=0;l<8;l++){let c=new B(Je(.5)?new qe(re(.3,.55),re(.3,.55),re(2.2,4.5),10):new oe(re(1.2,2.2),re(.5,1.1),re(.8,1.4)),new Ae({color:At([5921362,6974050,4868678,6969930]),roughness:.82,metalness:.3}));c.position.y=.5,c.rotation.z=Math.PI/2,c.castShadow=!0;let[h,d]=o(8);i.place(c,h,d,re(0,Math.PI),{})}return i.spawnZ=n/2-30,s}function u_(i,e,t){for(let n=0;n<20;n++){let s=re(i,e);if(Math.abs(s-(t||0))>4)return s}return i}function d_({w:i,d:e,floors:t,tier:n=1}){let s=new He,r=3,a=kn().common.stone,o={x:Math.max(2,Math.round(i/4)),z:Math.max(2,Math.round(e/4))};for(let c=0;c<t;c++){let h=c*r,d=new B(new oe(i,.28,e),a);d.position.set(0,h+.14,0),d.castShadow=!0,d.receiveShadow=!0,s.add(d);for(let u=0;u<=o.x;u++)for(let f=0;f<=o.z;f++){if(u>0&&u<o.x&&f>0&&f<o.z)continue;let p=new B(new oe(.42,r,.42),a);p.position.set(-i/2+u*i/o.x,h+r/2,-e/2+f*e/o.z),p.castShadow=!0,s.add(p)}}let l=Math.max(2,Math.round(e/4));for(let c=0;c<=l;c++){let h=new B(new oe(i*.94,r*.6,.2),a);h.position.set(0,t*r+r*.3,-e/2+c*e/l),h.castShadow=!0,s.add(h)}for(let c=0;c<14;c++){let h=new B(new qe(.045,.045,re(.5,1.3),5),new Ae({color:6969930,roughness:.7,metalness:.5}));h.position.set(re(-i/2,i/2),t*r+re(.3,.8),re(-e/2,e/2)),s.add(h)}return s.userData.footprint={w:i,d:e,h:t*r},s}function f_(i){let{spec:e,tier:t}=i,n=i.streetLen,s=[],r=e.mainW||(e.structure==="tower"?re(18,24):re(24,34)),a=re(12,18),o;e.structure==="tower"?o=lr({w:r,d:a,floors:en(10,20),tier:t}):e.structure==="teaching"?o=yc({w:r,d:a,floors:en(4,6),tier:t}):e.structure==="pavilion"?o=ps({w:r,d:a,h:10,tier:t,steps:!0,columns:!0,roofStyle:"hip"}):o=ps({w:r,d:a,h:e.mainH||re(11,17),tier:t,steps:e.steps!==!1,columns:!0,roofStyle:e.hipRoof?"hip":"flat"});let l=-n/2+a/2+14;i.place(o,0,l,0,{block:!0}),s.push({x:0,z:l,d:a,w:r,side:0}),i.spawnZ=Math.min(n/2-8,l+a/2+13);for(let c of[-1,1]){if(Je(.25))continue;let h=re(14,22),d=re(10,15),u;e.structure==="teaching"?u=yc({w:h,d,floors:en(3,5),tier:t,corridor:Je(.5)}):t>=3&&Je(.5)?u=lr({w:h*.8,d,floors:en(6,12),tier:t,podium:!1}):u=bo({w:h,d,floors:en(3,6),tier:t,units:Math.max(2,Math.round(h/4))}),i.place(u,c*re(20,27),l+re(6,16),c>0?-.35:.35,{block:!0}),s.push({x:c*22,z:l+10,d,w:h,side:c})}if(e.flagPole)for(let c=0;c<3;c++)i.place(Vu({h:11}),(c-1)*4.5,l+a/2+9,0,{});if(e.gate){for(let h of[-1,1])i.place(Ii({len:n/2-10/2,h:2.2,tier:t,kind:"railing"}),h*(n/4+10/4),n/2-1.5,0,{});i.place(Mc({w:10+.8,h:5.6,text:e.shortName||e.name}),0,n/2-1.5,0,{})}return s}var ys={slum:["便利超市","五金水电","平价水果","阿强理发","兰州拉面","手机维修","废品回收","宽带办理"],wholesaleMarket:["南北干货","冻品批发","粮油批发","一次性用品","塑料制品"],night_market:["烧烤","麻辣烫","炒粉炒面","烤冷面","炸串","柠檬茶","铁板鱿鱼","糖水"],flea_market:["收旧手机","二手书","旧家电","古玩杂项","旧衣翻新","维修钟表"],flower_bird_market:["绿植花卉","观赏鱼","鸟笼鸟粮","宠物用品","盆栽多肉"],vegetable_market:["时令蔬菜","猪牛羊肉","活鱼水产","粮油副食","豆制品","干货调料"],internet_cafe:["网咖","电竞馆","奶茶"],commercialDist:["潮流服饰","数码旗舰店","美妆","烘焙","零食优选","运动装备"],entertainment:["KTV","电玩城","影城","棋牌室","酒吧"],auto_city:["汽车销售","轮胎店","汽修厂","汽车美容","汽配"],bank:["储蓄所","理财中心","ATM"],trainingCenter:["公考培训","电工焊工","会计实操","电脑培训"],default:["杂货","快递代收","小卖部"]};function p_(i,e,t){let{spec:n,tier:s}=i,r=i.streetLen,a=i.laneHalf,o=kn(),l=(h,d,u,f,p)=>i.spot(h,d,u,f,p),c=Math.max(3,Math.round((n.footfall||.6)*10));for(let h=0;h<c;h++){let[d,u]=l(-a,a,-r/2,r/2),f=cr({color:At([9075258,4155972,3820122]),large:Je(.3)});i.place(f,d,u,re(0,Math.PI*2))}if(e==="lane"){let h=ys[n.id]||ys.default;t.forEach((u,f)=>{if(Je(.42))return;let p=h[f%h.length],x=gc({width:Math.min(u.w*.86,5.6),sign:p,tier:s,open:Je(.65)});x.position.set(Math.sign(u.x)*(Math.abs(u.x)-u.d/2-.16),0,u.z),x.rotation.y=u.x>0?-Math.PI/2:Math.PI/2,i.addRaw(x),i.lot(Math.sign(u.x)*(Math.abs(u.x)-u.d/2-1.7),u.z,0,"shop")});let d=[];for(let u=-r/2+4;u<=r/2-4;u+=9)for(let f of[-1,1]){let p=Bu(),x=f*(a+.6);i.place(p,x,u+re(-1.2,1.2),0,{}),d.push(p),i.colliders.push({minX:x-.28,maxX:x+.28,minZ:p.position.z-.28,maxZ:p.position.z+.28})}for(let u=0;u<d.length;u++){let f=d[u],p=d[u+2];if(p)for(let x=0;x<2;x++){let g=7.3-x*.7;i.addRaw(Eo(new P(f.position.x,g,f.position.z),new P(p.position.x,g,p.position.z),re(.7,1.5)))}if(Je(.68)){let x=d.find(g=>Math.sign(g.position.x)!==Math.sign(f.position.x)&&Math.abs(g.position.z-f.position.z)<3.6);x&&i.addRaw(Eo(new P(f.position.x,re(6.2,7.4),f.position.z),new P(x.position.x,re(6.2,7.4),x.position.z),re(1,2)))}}for(let u=0;u<9;u++){let f=Je(.5)?-1:1,[p,x]=l(f*a*.42,f*a*.66,-r/2+2,r/2-2),g=Je(.22)?"tricycle":Je(.2)?"bike":"scooter",m=_s({kind:g,color:At([3095108,7027252,3820090,5593696])});m.rotation.y=f>0?re(-.4,.4)+Math.PI:re(-.4,.4),i.place(m,p,x,m.rotation.y,{})}if(n.id==="night_market"){for(let u=-r/2+8;u<r/2-6;u+=re(6.5,10))for(let f of[-1,1]){let[p,x]=l(f*(a-1.5),f*(a-1.2),u-1,u+1,2.4),g=xc({w:re(2,2.8),d:1.2,tier:s,box:!0});i.place(g,p,x,f>0?Math.PI/2:-Math.PI/2,{}),i.lot(p-f*1.4,x,0,"stall")}for(let u=-r/2+10;u<r/2-8;u+=9){let p=new P(-a-.3,5.2,u),x=new P(a+.3,5.2,u+re(-1,1));i.addRaw(Eo(p,x,.5));for(let g=1;g<9;g++){let m=new P().lerpVectors(p,x,g/9);m.y-=Math.sin(g/9*Math.PI)*.5;let S=new B(new bn(.075,6,5),new Mn({color:At([16767120,16756832,16771248])}));S.position.copy(m),i.addRaw(S)}}}return}if(e==="avenue"){let h=ys[n.id]||ys.default,d=0;for(let p of t){let x=en(1,3),g=p.w/(x+.4);for(let m=0;m<x;m++){let S=h[d++%h.length],T=gc({width:g,sign:S,tier:s,open:Je(.78),height:3.8}),v=p.z-p.w/2+g*(m+.7);T.position.set(Math.sign(p.x)*(Math.abs(p.x)-p.d/2-.18),0,v),T.rotation.y=p.x>0?-Math.PI/2:Math.PI/2,i.addRaw(T),i.lot(Math.sign(p.x)*(Math.abs(p.x)-p.d/2-2.1),v,0,"shop")}}for(let p=-r/2+6;p<r/2;p+=16)for(let x of[-1,1]){if(Math.abs(p-i.spawnZ)<3)continue;let g=bc({h:7.4,tier:s});i.place(g,x*(a-.5),p,x>0?Math.PI:0,{})}for(let p=0;p<4;p++){let[x,g]=l(-18,18,-r/2+10,r/2-10);i.place(ms({w:re(3,4.6),h:re(2,3),y:re(3,4.4),text:At(["限时特惠","全场五折","新店开业","招聘中","分期免息"]),bg:At(["#3a4a58","#5a3038","#3f4a3a"]),fg:"#e8e4d8"}),x,g,re(-.3,.3)+(Je(.5)?0:Math.PI/2),{})}for(let p=0;p<7;p++){let x=Je(.5)?-1:1,[g,m]=l(x*2.5,x*(a-4),-r/2+4,r/2-4,4.5),S=gs({color:At([3817800,6975348,3095108,5917252,9080722])});i.place(S,g,m,x>0?0:Math.PI,{})}for(let p=0;p<8;p++){let x=Je(.5)?-1:1,[g,m]=l(x*(a-1.4),x*(a-.2),-r/2,r/2,3.2),S=_s({kind:Je(.3)?"bike":"scooter",color:At([3095108,7027252,3820090])});i.place(S,g,m,re(0,Math.PI*2),{})}let[u,f]=l(-14,14,-r/2+8,r/2-8,6);i.place(Gu(),u,f,Je(.5)?Math.PI:0,{});return}if(e==="compound"){for(let h=0;h<10;h++){let[d,u]=l(-a+2,a-2,-r/2+5,r/2-5);i.place(Sc({h:re(4.5,7),tier:s}),d,u,re(0,Math.PI*2),{})}for(let h=0;h<8;h++){let[d,u]=l(-a+3,a-3,-r/2+6,r/2-6);i.place(Ec(),d,u,re(0,Math.PI*2),{})}for(let h=0;h<6;h++){let[d,u]=l(-a+2,a-2,-r/2+5,r/2-5);i.place(cr({color:At([4155972,9075258])}),d,u,re(0,Math.PI*2),{})}for(let h=0;h<12;h++){let[d,u]=l(-a+3,a-3,-r/2+6,r/2-6,2.6),f=_s({kind:Je(.65)?"bike":"scooter",color:At([3820090,4868698,5913146])});i.place(f,d,u,re(0,Math.PI*2),{})}for(let h=0;h<3;h++){let[d,u]=l(-a+4,a-4,-r/2+10,r/2-10,5);i.place(ms({w:3.2,h:1.8,y:2.2,text:At(["社区公告","文明公约",`收费标准
明码标价`,"招聘信息"]),bg:"#e0dcd0",fg:"#3a3a36"}),d,u,Je(.5)?0:Math.PI/2,{})}if(n.stalls){let h=ys[n.id]||ys.default,d=0;for(let u=-r/2+10;u<r/2-10;u+=4.4){for(let f of[-1,1]){let[p,x]=l(f*5,f*12,u-1.2,u+1.2,2.6),g=xc({w:re(2.2,3),d:1.4,tier:s,box:!0});i.place(g,p,x,f>0?Math.PI/2:-Math.PI/2,{}),Je(.55)&&i.lot(p-f*1.5,x,0,"stall")}i.place(ms({w:2.4,h:.7,y:3.4,text:h[d++%h.length],bg:"#5a4030",fg:"#e8dcc8",legs:!1}),re(-8,8),u,0,{})}}if(n.id==="hospital"){let h=Tc({len:7,rows:3});h.position.set(0,0,i.spawnZ-12),h.userData.noMerge=!0,i.addRaw(h),i.place(gs({color:14211280,kind:"truck"}),re(-10,-5),i.spawnZ-6,Math.PI/2,{})}return}if(e==="yard"){for(let h=0;h<5;h++){let[d,u]=l(-a+5,a-5,-r/2+6,r/2-6,5),f=gs({color:At([3817800,5921370,4872810]),kind:Je(.6)?"truck":"sedan"});i.place(f,d,u,Je(.5)?0:Math.PI/2,{})}for(let h=0;h<6;h++){let[d,u]=l(-a+4,a-4,-r/2+4,r/2-4,3.2);i.place(_s({kind:"tricycle",color:At([4872778,6965818])}),d,u,re(0,Math.PI*2),{})}for(let h=0;h<4;h++){let[d,u]=l(-a+4,a-4,-r/2+4,r/2-4,3.2);i.place(cr({large:!0}),d,u,re(0,Math.PI*2),{})}if(n.structure==="site"){for(let h=0;h<14;h++){let[d,u]=l(-a+4,a-4,-r/2+4,r/2-4,3),f=new B(Je(.5)?new oe(re(1.4,2.6),re(.3,.7),re(.9,1.5)):new qe(re(.3,.6),re(.3,.6),re(1.2,3),10),new Ae({color:At([6969930,9076856,5917242,4868682]),roughness:.9,metalness:.2}));f.position.y=.4,f.castShadow=!0,i.place(f,d,u,re(0,Math.PI),{})}for(let h=0;h<8;h++){let[d,u]=l(-a+4,a-4,-r/2+4,r/2-4,3);i.place(ku({kind:Je(.6)?"cone":"fence"}),d,u,re(0,Math.PI*2),{})}i.place(ms({w:5,h:1.5,y:3.2,text:"安全第一 质量为本",bg:"#8a3a2a",fg:"#f0e4cc",legs:!1}),-21,i.spawnZ+6,Math.PI/2,{})}return}for(let h=0;h<16;h++){let[d,u]=l(-a+3,a-3,-r/2+4,r/2-4);i.place(Sc({h:re(4.5,8.5),tier:s,kind:Je(.18)?"palm":"broad"}),d,u,re(0,Math.PI*2),{})}for(let h=0;h<7;h++){let[d,u]=l(-a+4,a-4,-r/2+8,r/2-8);i.place(Ec(),d,u,re(0,Math.PI*2),{})}for(let h=0;h<8;h++){let[d,u]=l(-a+3,a-3,-r/2+6,r/2-6,3);i.place(bc({h:6.6,tier:s}),d,u,re(0,Math.PI*2),{})}for(let h=0;h<6;h++){let[d,u]=l(-a+3,a-3,-r/2+6,r/2-6);i.place(cr({color:At([4155972,9075258])}),d,u,0,{})}for(let h=0;h<5;h++){let[d,u]=l(-a+4,a-4,-r/2+10,r/2-10);i.place(Ou({w:re(1.4,2.4),d:re(1.4,2.4)}),d,u,0,{})}for(let h=0;h<5;h++){let[d,u]=l(-a+4,a-4,-r/2+8,r/2-8,2.8),f=_s({kind:Je(.6)?"bike":"scooter",color:At([3820090,4868698,5913146,3095108])});i.place(f,d,u,re(0,Math.PI*2),{})}if(n.id==="park"&&(i.place(vc({r:2.6}),re(-14,14),re(-6,6),0,{}),i.place(wc({r:3.2}),re(-16,16),re(2,14),0,{})),n.id==="temple"){i.place(vc({r:2.2,tier:s}),re(-16,-8),re(-4,6),0,{});let h=new B(new qe(.9,1.05,1.3,14),new Ae({color:5917242,roughness:.75,metalness:.35}));h.position.y=.65,h.castShadow=!0,i.place(h,0,i.spawnZ-16,0,{})}if(n.id==="techPark"){i.place(wc({r:3.6}),0,i.spawnZ-18,0,{});for(let h=0;h<8;h++){let[d,u]=l(-18,18,-r/2+8,r/2-8,5);i.place(gs({color:At([3095108,9080722,3817800,5925498])}),d,u,Je(.5)?0:Math.PI,{})}}if(n.id==="gov_office"||n.id==="court"){let h=Tc({len:8,rows:4});h.position.set(0,0,i.spawnZ-10),h.userData.noMerge=!0,i.addRaw(h);for(let d=0;d<5;d++){let[u,f]=l(-16,16,r/2-22,r/2-12,4);i.place(gs({color:At([3095108,3817800,5921370])}),u,f,Je(.5)?0:Math.PI,{})}}if(n.id==="school"&&n.gym&&i.place(ps({w:24,d:16,h:13,tier:s,steps:!1,columns:!1,roofStyle:"flat"}),0,r/2-24,0,{block:!0}),n.id==="gym"&&i.place(ps({w:30,d:20,h:15,tier:s,steps:!0,columns:!1,roofStyle:"flat"}),0,r/2-26,0,{block:!0}),n.id==="job_market"||n.id==="library"||n.id==="community_center")for(let h=0;h<4;h++){let[d,u]=l(-16,16,-r/2+14,r/2-14,5);i.place(ms({w:4,h:2.4,y:2.4,text:At([`招聘信息
每日更新`,"免费求职登记",`开放时间
09:00-21:00`,"新书上架"]),bg:"#3a4a58",fg:"#e8e4d8"}),d,u,Je(.5)?0:Math.PI/2,{})}}var To={slum:{layout:"lane",structure:"lowRise",streetLen:100,roadW:9.5,maxFloors:6},wholesaleMarket:{layout:"yard",structure:"shed",streetLen:92},construction:{layout:"yard",structure:"site",streetLen:86},factoryZone:{layout:"yard",structure:"shed",streetLen:104},school:{layout:"plaza",structure:"teaching",streetLen:104,plazaW:50,mainW:40,gym:!0,gate:!0,shortName:"大学城"},commercialDist:{layout:"avenue",structure:"tower",streetLen:108,roadW:16},techPark:{layout:"plaza",structure:"tower",streetLen:104,plazaW:52,mainW:26,flagPole:!0},hospital:{layout:"compound",structure:"tower",streetLen:96,courtW:38,blocks:3,gate:!0,shortName:"医院"},bank:{layout:"avenue",structure:"tower",streetLen:78,roadW:14},park:{layout:"plaza",structure:"hall",streetLen:96,plazaW:56,mainW:17,mainH:8,gate:!0,shortName:"公园"},community_center:{layout:"plaza",structure:"hall",streetLen:84,plazaW:46,mainW:26,gate:!0,shortName:"社区中心"},night_market:{layout:"lane",structure:"lowRise",streetLen:96,roadW:10,maxFloors:4},trainingCenter:{layout:"compound",structure:"hall",streetLen:82,courtW:34,blocks:2,gate:!0,shortName:"培训中心"},suburb:{layout:"lane",structure:"lowRise",streetLen:110,roadW:11,maxFloors:3},luxury_community:{layout:"compound",structure:"tower",streetLen:104,courtW:40,blocks:4,gate:!0,shortName:"高档小区"},old_community:{layout:"compound",structure:"slab",streetLen:96,courtW:38,blocks:3,floors:6,gate:!0,shortName:"老旧小区"},gov_office:{layout:"plaza",structure:"hall",streetLen:96,plazaW:50,mainW:36,flagPole:!0,gate:!0,shortName:"政务大厅"},court:{layout:"plaza",structure:"hall",streetLen:92,plazaW:50,mainW:32,flagPole:!0,hipRoof:!0,gate:!0,shortName:"人民法院"},job_market:{layout:"plaza",structure:"hall",streetLen:88,plazaW:46,mainW:30,gate:!0,shortName:"人才市场"},entertainment:{layout:"avenue",structure:"tower",streetLen:96,roadW:15},temple:{layout:"plaza",structure:"pavilion",streetLen:84,plazaW:46,mainW:28,hipRoof:!0,gate:!0,shortName:"古寺"},library:{layout:"plaza",structure:"hall",streetLen:88,plazaW:48,mainW:32,gate:!0,shortName:"图书馆"},gym:{layout:"plaza",structure:"hall",streetLen:100,plazaW:54,mainW:30,gate:!0,shortName:"体育馆"},internet_cafe:{layout:"lane",structure:"lowRise",streetLen:72,roadW:9,maxFloors:5},logistics_park:{layout:"yard",structure:"shed",streetLen:108},auto_city:{layout:"avenue",structure:"tower",streetLen:100,roadW:18},flower_bird_market:{layout:"lane",structure:"lowRise",streetLen:88,roadW:11,maxFloors:3},flea_market:{layout:"lane",structure:"lowRise",streetLen:84,roadW:10,maxFloors:3},vegetable_market:{layout:"compound",structure:"hall",streetLen:80,courtW:36,blocks:2,gate:!0,stalls:!0,shortName:"菜市场"}},Cc={lane:"巷弄",avenue:"商业街",compound:"院区",yard:"厂区",plaza:"广场"},Yu=!1;function Ao(i,e,t,n={}){let s=e.locations[t];if(!s)throw new Error(`未知地点: ${t}`);let r={...To[t]||To.community_center,name:s.name,id:t,shortName:s.name};Yu||(Uu(kn()),Yu=!0);let a=Math.min(3,Math.max(1,s.wealthTier|0)),o=new Rc(i,r,a),l=r.layout;a_(o,l);let c=[];l==="lane"?c=o_(o):l==="avenue"?c=l_(o):l==="compound"?c=c_(o):l==="yard"?c=h_(o):c=f_(o),p_(o,l,c),m_(o,s,l);let h=new P(0,0,o.spawnZ),d=o.streetLen/2-1.5,u={minX:-o.laneHalf+1,maxX:o.laneHalf-1,minZ:-d,maxZ:d},f={lane:{yaw:.38,pitch:.7,dist:16,minH:5.2},avenue:{yaw:.38,pitch:.7,dist:17,minH:5.5},compound:{yaw:.38,pitch:.71,dist:17,minH:5.8},yard:{yaw:.46,pitch:.7,dist:17,minH:6.5},plaza:{yaw:.38,pitch:.72,dist:18,minH:7.5}};return{id:t,name:s.name,meta:s,group:o.group,colliders:o.colliders,blockers:o.blockers,hotspots:o.hotspots,spawn:h,bounds:u,camera:f[l]||f.lane,laneHalf:o.laneHalf,streetLen:o.streetLen,stats:{tier:a,layout:l,layoutName:Cc[l],structure:r.structure}}}function m_(i,e,t){var h;let n=i.laneHalf,s=i.streetLen,r=[];for(let d of e.jobs||[])r.push({kind:"work",id:d.id,name:d.name,icon:d.icon||"💼",data:d});for(let d of e.actions||[])r.push({kind:"action",id:d.id,name:d.name,icon:d.icon||"⚡",data:d});for(let d of e.actionsExtra||[])r.push({kind:"extra",id:d.id,name:d.name,icon:d.icon||"⚡",data:d});for(let d of e.illegal||[])r.push({kind:"risk",id:d.id,name:d.name,icon:d.icon||"⚠️",data:d});for(let d of e.amenities||[])r.push({kind:"service",id:d.id,name:d.name,icon:d.icon||"🏪",data:d});((e.buy||[]).length||(e.sell||[]).length)&&r.push({kind:"trade",id:`${e.id}_trade`,name:"买卖交易",icon:"🛒",data:{buy:e.buy||[],sell:e.sell||[],specialties:e.specialtyLabels||e.specialties||[],vendingNote:e.vendingNote||""}}),r.length||r.push({kind:"look",id:`${e.id}_look`,name:"四处看看",icon:"👀",data:{desc:e.desc,type:e.type,footfall:e.footfall,dailyProbability:e.dailyProbability,specialties:e.specialtyLabels||e.specialties||[],priceMod:e.priceModList||[],vendingNote:e.vendingNote||""}});let a=5,o=r;if(r.length>a){let d={};for(let f of r)(d[h=f.kind]||(d[h]=[])).push(f);o=[];let u=0;for(;o.length<a&&u<30;){for(let f of["work","trade","service","action","extra","risk"]){let p=d[f];if(p&&p[u]&&(o.push(p[u]),o.length>=a))break}u++}}let l=i.lots.map(d=>[d.x,d.z]);if(l.length<o.length){let d=[];if(t==="yard"||t==="compound")for(let u of[-s/3,0,s/3,s/2-14])d.push([0,u]);else if(t==="plaza")for(let u of[i.spawnZ-7,i.spawnZ-19,0,-s/4])d.push([re(-6,6),u]);else for(let u of[-s/2+10,-s/2+24,s/2-24,s/2-10])d.push([-n*.5,u]);for(let u of d)l.push(u)}l.sort(()=>Math.random()-.5);let c=[];for(let d of o){let u=null,f=-1;for(let[m,S]of l){let T=1/0;for(let[v,E]of c)T=Math.min(T,Math.hypot(m-v,S-E));T>f&&(f=T,u=[m,S])}if(!u)break;c.push(u);let[p,x]=u,g=Wu({icon:d.icon});g.userData.noMerge=!0,g.position.set(p,0,x),i.group.add(g),i.hotspots.push({object:g,x:p,z:x,radius:2.8,kind:d.kind,id:d.id,label:d.name,icon:d.icon,data:d.data,place:e.name})}}function Ku(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Ot,c=0;for(let h=0;h<i.length;++h){let d=i[h],u=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(d.morphAttributes[f])}if(e){let f;if(t)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0,d=[];for(let u=0;u<i.length;++u){let f=i[u].index;for(let p=0;p<f.count;++p)d.push(f.getX(p)+h);h+=i[u].attributes.position.count}l.setIndex(d)}for(let h in r){let d=Zu(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(let h in a){let d=a[h][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<d;++u){let f=[];for(let x=0;x<a[h].length;++x)f.push(a[h][x][u]);let p=Zu(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}}return l}function Zu(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let a=new e(r),o=new Jt(a,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let d=l/t;for(let u=0,f=h.count;u<f;u++)for(let p=0;p<t;p++){let x=h.getComponent(u,p);o.setComponent(u+d,p,x)}}else a.set(h.array,l);l+=h.count*t}return s!==void 0&&(o.gpuType=s),o}function g_(i){return[i.type,i.color?i.color.getHexString():"",i.emissive?i.emissive.getHexString():"",i.roughness,i.metalness,i.side,i.transparent?1:0,i.opacity,i.flatShading?1:0,i.map?i.map.uuid:"",i.map?`${i.map.repeat.x}x${i.map.repeat.y}`:"",i.alphaMap?i.alphaMap.uuid:""].join("|")}function __(i){let e=i;for(;e;){if(e.userData&&e.userData.noMerge)return!0;e=e.parent}return!1}function y_(i){for(let e of Object.keys(i.attributes))e!=="position"&&e!=="normal"&&e!=="uv"&&i.deleteAttribute(e);for(let e of Object.keys(i.morphAttributes))delete i.morphAttributes[e];return i.morphTargetsRelative=!1,i}function $u(i){i.updateMatrixWorld(!0);let e=[];i.traverse(o=>{o.isMesh&&o.geometry&&o.geometry.attributes.position&&!__(o)&&e.push(o)});let t=e.length;if(t<12)return{before:t,after:t,buckets:0};let n=new Map;for(let o of e){let l=g_(o.material),c=n.get(l);c||(c={mat:o.material,list:[]},n.set(l,c)),c.list.push(o)}let s=0,r=0;for(let{mat:o,list:l}of n.values()){if(l.length<3){s+=l.length;continue}let c=[],h=!0;for(let f of l)try{let p=f.geometry.index?f.geometry.toNonIndexed():f.geometry.clone();p.applyMatrix4(f.matrixWorld),c.push(y_(p))}catch{h=!1;break}if(!h){s+=l.length;continue}let d=null;try{d=Ku(c,!1)}catch{d=null}if(!d){s+=l.length;continue}let u=new B(d,o);u.castShadow=!0,u.receiveShadow=!0,u.frustumCulled=!0,i.add(u),r++;for(let f of l)f.parent&&f.parent.remove(f);s+=1}let a=[];i.traverse(o=>{o!==i&&(o.isGroup||o.isObject3D)&&!o.isMesh&&o.children.length===0&&a.push(o)});for(let o of a)o.parent&&o.parent.remove(o);return{before:t,after:s,buckets:r}}function Ju(i){let e=0,t=0;return i.traverse(n=>{if(!n.isMesh)return;e++;let s=n.geometry;if(!s)return;let r=s.index?s.index.count:s.attributes.position.count;t+=r/3}),{meshes:e,tris:Math.round(t)}}var Ro=class{constructor(e,t,n){this.colliders=t,this.radius=.34,this.speed=3.1,this.runSpeed=5.6,this.moving=!1,this.phase=0,this.bounds={minX:-26,maxX:26,minZ:-24,maxZ:24};let s=new He,r=new Ae({color:3883080,roughness:.92}),a=new Ae({color:11571312,roughness:.85}),o=new Ae({color:2566959,roughness:.9}),l=new B(new Si(.23,.42,6,12),r);l.position.y=.86,l.castShadow=!0,s.add(l);let c=new B(new bn(.163,16,12),a);c.position.y=1.34,c.castShadow=!0,s.add(c);let h=new B(new bn(.168,16,12,0,Math.PI*2,0,Math.PI*.55),o);h.position.y=1.355,s.add(h),this.legs=[];for(let u of[-.105,.105]){let f=new B(new Si(.078,.44,4,8),o);f.position.set(u,.3,0),f.castShadow=!0,s.add(f),this.legs.push(f)}this.arms=[];for(let u of[-.3,.3]){let f=new B(new Si(.062,.38,4,8),r);f.position.set(u,.9,0),f.castShadow=!0,s.add(f),this.arms.push(f)}let d=new B(new oe(.3,.36,.16),new Ae({color:4865846,roughness:.95}));d.position.set(0,.86,-.24),s.add(d),s.position.copy(n),e.add(s),this.mesh=s,this.pos=s.position,this.facing=Math.PI}update(e,t,n){let s=0,r=0;(t.has("KeyW")||t.has("ArrowUp"))&&(r-=1),(t.has("KeyS")||t.has("ArrowDown"))&&(r+=1),(t.has("KeyA")||t.has("ArrowLeft"))&&(s-=1),(t.has("KeyD")||t.has("ArrowRight"))&&(s+=1);let a=t.has("ShiftLeft")||t.has("ShiftRight"),o=a?this.runSpeed:this.speed;if(this.moving=s!==0||r!==0,this.moving){let c=Math.hypot(s,r);s/=c,r/=c;let h=Math.cos(n),d=Math.sin(n),u=s*h+r*d,f=-s*d+r*h;this.pos.x+=u*o*e,this.pos.z+=f*o*e;let x=Math.atan2(u,f)-this.facing;for(;x>Math.PI;)x-=Math.PI*2;for(;x<-Math.PI;)x+=Math.PI*2;this.facing+=x*Math.min(1,e*12),this.phase+=e*(a?13:8.5)}else this.phase+=e*1.6;this.resolveCollisions();let l=this.moving?a?.85:.6:.06;this.legs[0].rotation.x=Math.sin(this.phase)*l,this.legs[1].rotation.x=-Math.sin(this.phase)*l,this.arms[0].rotation.x=-Math.sin(this.phase)*l*.7,this.arms[1].rotation.x=Math.sin(this.phase)*l*.7,this.mesh.position.y=this.moving?Math.abs(Math.sin(this.phase))*.035:0,this.mesh.rotation.y=this.facing}resolveCollisions(){let e=this.radius;for(let n of this.colliders){let s=Math.max(n.minX,Math.min(this.pos.x,n.maxX)),r=Math.max(n.minZ,Math.min(this.pos.z,n.maxZ)),a=this.pos.x-s,o=this.pos.z-r,l=a*a+o*o;if(l>=e*e)continue;if(l<1e-6){let d=Math.abs(this.pos.x-n.minX),u=Math.abs(n.maxX-this.pos.x),f=Math.abs(this.pos.z-n.minZ),p=Math.abs(n.maxZ-this.pos.z),x=Math.min(d,u,f,p);x===d?this.pos.x=n.minX-e:x===u?this.pos.x=n.maxX+e:x===f?this.pos.z=n.minZ-e:this.pos.z=n.maxZ+e;continue}let c=Math.sqrt(l),h=(e-c)/c;this.pos.x+=a*h,this.pos.z+=o*h}let t=this.bounds;this.pos.x=Math.max(t.minX,Math.min(t.maxX,this.pos.x)),this.pos.z=Math.max(t.minZ,Math.min(t.maxZ,this.pos.z))}setWorld({colliders:e,spawn:t,bounds:n}){this.colliders=e||[],t&&this.pos.set(t.x,0,t.z),n&&(this.bounds=n),this.moving=!1,this.phase=0}},Co=class{constructor(e,t,n){this.camera=e,this.colliders=n||[],this.yaw=.38,this.pitch=.76,this.dist=18,this.minH=5.5,this.cur=new P().copy(t),this.apply(this.cur)}clearance(e,t,n,s,r){let a=r;for(let o of this.colliders){let l=x_(e,t,n,s,o);l!==null&&l<a&&(a=l)}return Math.max(this.minH,a-.7)}penetration(e,t){let s=0;for(let r of this.colliders)if(e>r.minX-.9&&e<r.maxX+.9&&t>r.minZ-.9&&t<r.maxZ+.9){let a=e-(r.minX-.9),o=r.maxX+.9-e,l=t-(r.minZ-.9),c=r.maxZ+.9-t;s=Math.max(s,Math.min(a,o,l,c))}return s}apply(e){let t=Math.cos(this.pitch),n=Math.sin(this.pitch),s=Math.sin(this.yaw),r=Math.cos(this.yaw),a=this.dist*t,o=Math.min(a,this.clearance(e.x,e.z,s,r,a));for(let c=0;c<10;c++){let h=this.penetration(e.x+s*o,e.z+r*o);if(h<=0)break;let d=o-(h+.5);if(d<=this.minH){o=this.minH;break}o=d}let l=o/Math.max(t,.15);this.camera.position.set(e.x+s*o,e.y+l*n,e.z+r*o),this.camera.lookAt(e.x,e.y+.9,e.z)}update(e,t){this.cur.lerp(t,Math.min(1,e*6.5)),this.apply(this.cur)}setWorld({colliders:e,target:t,yaw:n,pitch:s,dist:r,minH:a}={}){this.colliders=e||[],n!=null&&(this.yaw=n),s!=null&&(this.pitch=s),r!=null&&(this.dist=r),a!=null&&(this.minH=a),t&&this.cur.copy(t),this.apply(this.cur)}zoom(e){this.dist=Math.max(9,Math.min(32,this.dist+e))}};function x_(i,e,t,n,s){let r=0,a=1/0;if(Math.abs(t)<1e-8){if(i<s.minX||i>s.maxX)return null}else{let o=(s.minX-i)/t,l=(s.maxX-i)/t;if(o>l){let c=o;o=l,l=c}r=Math.max(r,o),a=Math.min(a,l)}if(Math.abs(n)<1e-8){if(e<s.minZ||e>s.maxZ)return null}else{let o=(s.minZ-e)/n,l=(s.maxZ-e)/n;if(o>l){let c=o;o=l,l=c}r=Math.max(r,o),a=Math.min(a,l)}return a<r||a<0?null:r>0?r:0}var Kt={sky:5857626,fog:{color:5594197,density:.0155},hemi:{sky:8228246,ground:4342844,intensity:1.5},sun:{color:14207656,intensity:2.15,pos:[16,20,-14],shadowSize:2048,frustum:40},ambient:{color:5331041,intensity:.9},exposure:1.3},ju=.38,Qu=.76;function Po(i){let{container:e,data:t}=i;if(!e)throw new Error("createGame3D: 缺少 container");if(!t||!t.locations)throw new Error("createGame3D: 缺少 gamedata");let n=i.mode!=="mini",s;try{s=new mo({antialias:!0,powerPreference:"high-performance"})}catch(ie){return i.onError?.(ie instanceof Error?ie:new Error(String(ie))),v_()}s.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),s.outputColorSpace=Lt,s.toneMapping=Ys,s.toneMappingExposure=Kt.exposure,s.shadowMap.enabled=!0,s.shadowMap.type=Ma,s.domElement.style.display="block",s.domElement.style.width="100%",s.domElement.style.height="100%",e.appendChild(s.domElement);let r=new Ds;r.background=new We(Kt.sky),r.fog=new Ls(Kt.fog.color,Kt.fog.density);let a=new Gs(Kt.hemi.sky,Kt.hemi.ground,Kt.hemi.intensity);r.add(a);let o=new Ws(Kt.sun.color,Kt.sun.intensity);o.position.set(...Kt.sun.pos),o.castShadow=!0,o.shadow.mapSize.set(Kt.sun.shadowSize,Kt.sun.shadowSize),o.shadow.camera.near=1,o.shadow.camera.far=110;let l=Kt.sun.frustum;o.shadow.camera.left=-l,o.shadow.camera.right=l,o.shadow.camera.top=l,o.shadow.camera.bottom=-l,o.shadow.bias=-9e-4,o.shadow.normalBias=.022,r.add(o),r.add(o.target),r.add(new Xs(Kt.ambient.color,Kt.ambient.intensity)),Ru(),Nu();let c=new Ro(r,[],new P(0,0,10)),h=new Gt(46,1,.1,400),d=new Co(h,c.pos,[]),u=null,f=null,p=null,x=!1,g=0,m=0,S=new Set;function T(){let ie=e.clientWidth||1,Ee=e.clientHeight||1;h.aspect=ie/Ee,h.updateProjectionMatrix(),s.setSize(ie,Ee,!1)}let v=typeof ResizeObserver<"u"?new ResizeObserver(()=>T()):null;v?.observe(e),window.addEventListener("resize",T);function E(ie){let Ee=ie.target;if(!Ee||!Ee.tagName)return!1;let Xe=Ee.tagName.toLowerCase();return Xe==="input"||Xe==="textarea"||Xe==="select"||Ee.isContentEditable}function b(ie){E(ie)||!x||!n||(S.add(ie.code),(ie.code.startsWith("Arrow")||ie.code==="Space")&&ie.preventDefault(),ie.code==="KeyE"&&(ie.preventDefault(),ee()),ie.code)}function R(ie){S.delete(ie.code)}function y(){S.clear()}n&&(window.addEventListener("keydown",b),window.addEventListener("keyup",R),window.addEventListener("blur",y));let w=4,C=.25,U=1.35,F=!1,k=null,L=0,G=0,Y=0,X=null;function ae(ie){ie.button!==0&&ie.pointerType==="mouse"||(F=!0,k=ie.pointerId,L=0,G=ie.clientX,Y=ie.clientY,X={x:ie.clientX,y:ie.clientY},e.setPointerCapture?.(ie.pointerId),e.classList.add("is-dragging"))}function q(ie){if(!F||ie.pointerId!==k)return;let Ee=ie.clientX-G,Xe=ie.clientY-Y;L+=Math.abs(Ee)+Math.abs(Xe),G=ie.clientX,Y=ie.clientY,!(L<w)&&(X=null,d.yaw-=Ee*.006,d.pitch=Math.max(C,Math.min(U,d.pitch+Xe*.004)))}function Q(ie){if(ie.pointerId===k&&(F=!1,k=null,e.releasePointerCapture?.(ie.pointerId),e.classList.remove("is-dragging"),X)){let Ee=Ie(X.x,X.y);X=null,Ee&&(p=Ee,i.onInteract?.(Ee))}}function ne(){d.yaw=ju,d.pitch=Qu}n&&(e.addEventListener("pointerdown",ae),e.addEventListener("pointermove",q),e.addEventListener("pointerup",Q),e.addEventListener("pointercancel",Q),e.addEventListener("dblclick",ne));let Pe=new P;function Ie(ie,Ee){if(!u)return null;let Xe=e.getBoundingClientRect(),vt=ie-Xe.left,ot=Ee-Xe.top,lt=null,I=46;for(let Mt of u.hotspots){if(Pe.set(Mt.x,1.4,Mt.z).project(h),Pe.z>1)continue;let tt=(Pe.x*.5+.5)*Xe.width,A=(-Pe.y*.5+.5)*Xe.height,_=Math.hypot(tt-vt,A-ot);_<I&&(I=_,lt=Mt)}return lt}function ft(ie){ie&&(ie.group.traverse(Ee=>{Ee.isMesh&&Ee.geometry&&Ee.geometry.dispose()}),r.remove(ie.group))}function et(ie){if(!t.locations[ie])return i.onError?.(new Error(`未知地点: ${ie}`)),null;let Ee=performance.now();ft(u),u=Ao(r,t,ie);let Xe=$u(u.group),vt=Ju(u.group);c.setWorld({colliders:u.colliders,spawn:u.spawn,bounds:u.bounds}),d.setWorld({colliders:u.blockers,target:u.spawn,...u.camera}),d.cur.copy(u.spawn),d.apply(d.cur),n||(d.dist=Math.min(34,d.dist+9),d.apply(d.cur));let ot=u.spawn,lt=c.radius,I=u.colliders.filter(A=>ot.x>A.minX-lt&&ot.x<A.maxX+lt&&ot.z>A.minZ-lt&&ot.z<A.maxZ+lt).length;p=null,i.onFocus?.(null),f=ie;let Mt=Math.round(performance.now()-Ee),tt={id:ie,ms:Mt,tris:vt.tris,spawnBlocked:I,meshes:{before:Xe.before,after:Xe.after},hotspots:u.hotspots.length,colliders:u.colliders.length};return i.onBuild?.(tt),rt=tt,u}let rt=null;function K(){if(!u)return null;let ie=null,Ee=1/0;for(let Xe of u.hotspots){let vt=Math.hypot(c.pos.x-Xe.x,c.pos.z-Xe.z);vt<Xe.radius&&vt<Ee&&(Ee=vt,ie=Xe)}return ie}function ee(){p&&i.onInteract?.(p)}function be(ie){let Ee=u?.hotspots[ie];Ee&&(p=Ee,i.onInteract?.(Ee))}function ke(ie){if(!x)return;g=requestAnimationFrame(ke);let Ee=Math.min(.05,(ie-m)/1e3);m=ie,c.update(Ee,S,d.yaw),d.update(Ee,c.pos),o.position.set(c.pos.x+16,22,c.pos.z-14),o.target.position.copy(c.pos),o.target.updateMatrixWorld();let Xe=K();if(Xe!==p&&(p=Xe,i.onFocus?.(p||null)),u){let ot=ie*.0016;for(let lt of u.hotspots){let I=lt.object?.userData?.hotspot;if(!I)continue;let Mt=lt===p,tt=(Mt?1.18:1)+Math.sin(ot*2+lt.x)*.05;I.ring?.scale.setScalar(tt),I.sprite&&(I.sprite.position.y=2.15+Math.sin(ot*1.7+lt.z)*.09,I.sprite.material.opacity=Mt?1:.72)}}s.render(r,h),Ge++;let vt=(ie-Tt)/1e3;vt>=.5&&(ve=Math.round(Ge/vt),Tt=ie,Ge=0)}let ve=0,Ge=0,Tt=0;function $e(){x||(x=!0,T(),m=performance.now(),Tt=m,Ge=0,g=requestAnimationFrame(ke))}function st(){x=!1,cancelAnimationFrame(g),S.clear()}function pt(){st(),ft(u),v?.disconnect(),window.removeEventListener("resize",T),n&&(window.removeEventListener("keydown",b),window.removeEventListener("keyup",R),window.removeEventListener("blur",y),e.removeEventListener("pointerdown",ae),e.removeEventListener("pointermove",q),e.removeEventListener("pointerup",Q),e.removeEventListener("pointercancel",Q),e.removeEventListener("dblclick",ne),e.classList.remove("is-dragging")),s.dispose(),s.domElement.remove()}return{loadLocation:et,start:$e,stop:st,dispose:pt,resize:T,interact:ee,interactHotspot:be,zoom:ie=>d.zoom(ie),resetView(){d.yaw=ju,d.pitch=Qu,d.apply(d.cur)},get view(){return{yaw:d.yaw,pitch:d.pitch,dist:d.dist}},get locationId(){return f},get hotspot(){return p},get hotspots(){return u?u.hotspots:[]},get playerPos(){return{x:c.pos.x,z:c.pos.z}},get stats(){return{fps:ve,calls:s.info.render.calls,triangles:s.info.render.triangles,build:rt}},teleport(ie,Ee){c.pos.set(ie,0,Ee),d.cur.set(ie,0,Ee),d.apply(d.cur)},key(ie,Ee=!0){if(ie==="KeyE"&&Ee){ee();return}Ee?S.add(ie):S.delete(ie)},get scene(){return r},get camera(){return h}}}function v_(){let i=()=>{};return{loadLocation:()=>null,start:i,stop:i,dispose:i,resize:i,interact:i,interactHotspot:i,zoom:i,teleport:i,key:i,resetView:i,view:{yaw:0,pitch:0,dist:0},locationId:null,hotspot:null,hotspots:[],playerPos:{x:0,z:0},stats:{fps:0,calls:0,triangles:0,build:null},scene:null,camera:null}}var ed=[{key:"hunger",label:"饱腹",icon:"🍚",invert:!1},{key:"fatigue",label:"疲劳",icon:"😴",invert:!0},{key:"hygiene",label:"卫生",icon:"🚿",invert:!1},{key:"happiness",label:"心情",icon:"🙂",invert:!1},{key:"health",label:"健康",icon:"❤️",invert:!1,from:"status"}];function td(i,e){let t=e?100-i:i;return t>=55?"ok":t>=25?"warn":"bad"}function Io(i={}){let e=document.createElement("div");e.className="s3h",e.innerHTML=`
    <div class="s3h-top">
      <div class="s3h-clock">
        <span class="s3h-day" data-f="day">第 1 天</span>
        <span class="s3h-sep">·</span>
        <span class="s3h-slot" data-f="slot">上午</span>
        <span class="s3h-weather" data-f="weather"></span>
      </div>
      <div class="s3h-place">
        <span class="s3h-place-icon" data-f="locIcon">📍</span>
        <span class="s3h-place-name" data-f="locName">—</span>
      </div>
      <div class="s3h-purse">
        <span class="s3h-cash" data-f="cash">¥0</span>
        <span class="s3h-debt" data-f="debt" hidden></span>
      </div>
    </div>

    <div class="s3h-vitals" data-f="vitals"></div>

    <div class="s3h-ap">
      <div class="s3h-ap-head">
        <span>行动力</span>
        <span data-f="apText">0 / 100</span>
      </div>
      <div class="s3h-ap-track"><i data-f="apFill"></i></div>
    </div>

    <div class="s3h-prompt" hidden data-f="prompt"></div>

    <div class="s3h-tray" data-f="tray">
      <div class="s3h-tray-head">
        <span class="s3h-tray-title" data-f="trayTitle">当前可做的事</span>
        <button type="button" class="s3h-tray-toggle" data-f="trayToggle">收起</button>
      </div>
      <div class="s3h-tray-body" data-f="trayBody"></div>
    </div>

    <div class="s3h-keys">
      <kbd>WASD</kbd> 走动 <kbd>Shift</kbd> 跑 ·
      <b>按住左键拖动</b> 转视角 · <kbd>滚轮</kbd> 缩放 ·
      <kbd>E</kbd> 交互 · <kbd>Tab</kbd> 行动 · <kbd>M</kbd> 去处
    </div>

    <div class="s3h-toast-wrap" data-f="toasts"></div>

    <div class="s3h-map" hidden data-f="map">
      <div class="s3h-map-panel">
        <div class="s3h-map-head">
          <span>去哪里</span>
          <button type="button" class="s3h-map-close" data-f="mapClose">✕</button>
        </div>
        <input class="s3h-map-search" data-f="mapSearch" placeholder="搜索地点…" />
        <div class="s3h-map-list" data-f="mapList"></div>
      </div>
    </div>
  `;let t=l=>e.querySelector(`[data-f="${l}"]`),n={day:t("day"),slot:t("slot"),weather:t("weather"),locIcon:t("locIcon"),locName:t("locName"),cash:t("cash"),debt:t("debt"),vitals:t("vitals"),apText:t("apText"),apFill:t("apFill"),prompt:t("prompt"),tray:t("tray"),trayTitle:t("trayTitle"),trayToggle:t("trayToggle"),trayBody:t("trayBody"),toasts:t("toasts"),map:t("map"),mapList:t("mapList"),mapSearch:t("mapSearch"),mapClose:t("mapClose")};n.vitals.innerHTML=ed.map(l=>`
    <div class="s3h-vital" data-k="${l.key}" title="${l.label}">
      <span class="s3h-vital-icon">${l.icon}</span>
      <span class="s3h-vital-bar"><i></i></span>
      <span class="s3h-vital-num">0</span>
    </div>`).join("");let s=ed.map(l=>({spec:l,row:n.vitals.querySelector(`[data-k="${l.key}"]`)}));s.forEach(({row:l})=>{l._fill=l.querySelector("i"),l._num=l.querySelector(".s3h-vital-num"),l._track=l.querySelector(".s3h-vital-bar")});let r=!1,a=!1,o={el:e,setTop({day:l,slot:c,weather:h,cash:d,debt:u,locIcon:f,locName:p}){if(l!=null&&(n.day.textContent=`第 ${l} 天`),c!=null&&(n.slot.textContent=c),h!=null&&(n.weather.textContent=h?` · ${h}`:""),p!=null&&(n.locName.textContent=p),f!=null&&(n.locIcon.textContent=f||"📍"),d!=null&&(n.cash.textContent=`¥${Math.round(d).toLocaleString("zh-CN")}`),u!=null){let x=Number(u)>0;n.debt.hidden=!x,x&&(n.debt.textContent=`欠 ¥${Math.round(u).toLocaleString("zh-CN")}`)}},setNeeds(l,c){for(let{spec:h,row:d}of s){let u=h.from==="status"?c:l;if(!u)continue;let f=u[h.key];if(typeof f!="number")continue;let p=Math.max(0,Math.min(100,f));d._fill.style.width=p+"%",d._fill.dataset.tone=td(p,h.invert),d._num.textContent=Math.round(p),d.dataset.tone=td(p,h.invert)}},setAP(l,c){let h=c||100;n.apText.textContent=`${Math.round(l)} / ${Math.round(h)}`,n.apFill.style.width=Math.max(0,Math.min(100,l/h*100))+"%",n.apFill.dataset.tone=l/h>=.25?"ok":"bad"},setPrompt(l){if(!l){n.prompt.hidden=!0;return}n.prompt.innerHTML=`<kbd>E</kbd><span>${l.icon||""} ${l.label||""}</span>`+(l.hint?`<em>${l.hint}</em>`:""),n.prompt.hidden=!1},setActions(l,c){if(!l||!l.length){n.trayBody.innerHTML='<div class="s3h-empty">此刻这里没有可做的事，换个地方看看。</div>';return}n.trayBody.innerHTML=l.map((h,d)=>{let u=h.kind?`<span class="s3h-chip">${h.kind}</span>`:"",f=h.cost?`<span class="s3h-cost">${h.cost}</span>`:"";return`
        <button type="button" class="s3h-act${h.disabled?" is-off":""}" data-i="${d}"
                ${h.disabled?"disabled":""} title="${h.reason||h.desc||""}">
          <span class="s3h-act-icon">${h.icon||"•"}</span>
          <span class="s3h-act-main">
            <span class="s3h-act-name">${h.name}</span>
            ${h.desc?`<span class="s3h-act-desc">${h.desc}</span>`:""}
            ${h.disabled&&h.reason?`<span class="s3h-act-reason">${h.reason}</span>`:""}
          </span>
          ${u}${f}
        </button>`}).join(""),n.trayBody.querySelectorAll(".s3h-act").forEach(h=>{h.addEventListener("click",()=>{let d=l[Number(h.dataset.i)];d&&!d.disabled&&c(d)})})},toggleTray(l){return r=l==null?!r:!!l,n.tray.classList.toggle("is-open",r),n.trayToggle.textContent=r?"收起":"展开",r},setLocations(l,c){let h=(d="")=>{let u=d.trim().toLowerCase(),f=u?l.filter(p=>`${p.name} ${p.desc||""}`.toLowerCase().includes(u)):l;n.mapList.innerHTML=f.length?f.map(p=>`<button type="button" class="s3h-loc" data-id="${p.id}">
              <span class="s3h-loc-icon">${p.icon||"📍"}</span>
              <span class="s3h-loc-name">${p.name}</span>
            </button>`).join(""):'<div class="s3h-empty">没有匹配的地点</div>',n.mapList.querySelectorAll(".s3h-loc").forEach(p=>{p.addEventListener("click",()=>{o.toggleMap(!1),c(p.dataset.id)})})};h(""),n.mapSearch.addEventListener("input",()=>h(n.mapSearch.value))},toggleMap(l){return a=l==null?!a:!!l,n.map.hidden=!a,a&&n.mapSearch.focus(),a},get mapOpen(){return a},notify(l,c="ok"){let h=document.createElement("div");h.className=`s3h-toast is-${c}`,h.textContent=l,n.toasts.appendChild(h),setTimeout(()=>h.classList.add("is-out"),2400),setTimeout(()=>h.remove(),3e3)},destroy(){e.remove()}};return n.trayToggle.addEventListener("click",()=>o.toggleTray()),n.mapClose.addEventListener("click",()=>o.toggleMap(!1)),n.map.addEventListener("click",l=>{l.target===n.map&&o.toggleMap(!1)}),o}function nd(i={}){let{container:e,data:t,readHUD:n,readActions:s,readLocations:r,onAction:a,onTravel:o,onNotice:l,onExit:c}=i;if(!e)throw new Error("create3DShell: 缺少 container");let h=document.createElement("div");h.className="s3s3d";let d=document.createElement("div");d.className="s3s3d-stage",h.appendChild(d),e.appendChild(h);let u=Io();h.appendChild(u.el);let f=null,p=null,x=!1;function g(){return f||(f=Po({container:d,data:t,mode:"full",onInteract:b=>{let R=a?.(b);R&&R.ok===!1?u.notify(R.reason||"这一步现在做不了","warn"):R&&R.message&&u.notify(R.message,"ok")},onFocus:b=>u.setPrompt(b),onError:b=>u.notify("3D 不可用："+(b&&b.message?b.message:b),"bad")}),f)}function m(){try{if(n){let b=n();b&&(u.setTop(b),u.setNeeds(b.needs,b.status),b.ap&&u.setAP(b.ap.cur,b.ap.max))}if(s){let b=s()||[];u.setActions(b,R=>{let y=a?.(R);y&&y.ok===!1?u.notify(y.reason||"这一步现在做不了","warn"):m()})}}catch(b){u.notify("状态刷新失败："+(b&&b.message?b.message:b),"bad")}}function S(b){let y=g().loadLocation(b);return y?(p=b,y):null}function T(b){if(!b||b===p)return;let R=o?.(b);if(R&&R.ok===!1){u.notify(R.reason||"去不了那里","warn");return}S(b),m(),u.notify("已到达："+(v(b)?.name||b),"ok")}function v(b){let R=r&&r()||[];for(let y of R)if(y.id===b)return y;return null}function E(b){let R=b.target;R&&R.tagName&&/^(INPUT|TEXTAREA|SELECT)$/.test(R.tagName)||(b.code==="Tab"?(b.preventDefault(),u.toggleTray()):b.code==="KeyM"?(b.preventDefault(),u.toggleMap()):b.code==="KeyR"&&g().resetView())}return{el:h,hud:u,start(){if(x)return;x=!0;let b=g();return b.start(),r&&u.setLocations(r()||[],T),window.addEventListener("keydown",E),window.addEventListener("resize",()=>b.resize()),m(),this},stop(){x=!1,window.removeEventListener("keydown",E),f?.stop()},dispose(){this.stop(),f?.dispose(),f=null,u.destroy(),h.remove()},loadLocation:S,travel:T,refresh:m,resize(){f?.resize()},sync(){m()},notify(b,R){u.notify(b,R)},get locationId(){return p},get view3d(){return f},get stats(){return f?f.stats:null},get debug(){return{locationId:p,actions:u.el.querySelectorAll(".s3h-act").length,vitals:u.el.querySelectorAll(".s3h-vital").length,promptVisible:!u.el.querySelector('[data-f="prompt"]').hidden,view:f?f.view:null,tris:f?f.stats.triangles:0,calls:f?f.stats.calls:0}}}}var id={generatedAt:"2026-09-18T07:19:43.319Z",source:"src/js/data/{locations,location_flavor,jobs,amenities,actions,goods}.js + src/js/phase1/actions_extra.js + src/js/core/illegal_actions.js",count:29,categoryLabels:{daily:"日用",food:"食品",luxury:"奢侈",clothing:"服装",electronics:"电子",scrap:"废品"},locations:{slum:{id:"slum",name:"城中村",icon:"🏘️",desc:"鱼龙混杂的城中村，房租便宜，机会也多。",type:"residential",wealthTier:1,footfall:.6,specialties:["scrap_metal","scrap_paper","scrap_plastic"],specialtyLabels:["废金属","废纸板","废塑料"],priceMod:{water:.9,snacks:.85,noodles:.8,scrap_metal:1.6,scrap_paper:1.5,scrap_plastic:1.5,daily_use:.7},priceModList:[{key:"water",value:.9,label:"瓶装水"},{key:"snacks",value:.85,label:"零食"},{key:"noodles",value:.8,label:"面条"},{key:"scrap_metal",value:1.6,label:"废金属"},{key:"scrap_paper",value:1.5,label:"废纸板"},{key:"scrap_plastic",value:1.5,label:"废塑料"},{key:"daily_use",value:.7,label:"日用品"}],dailyProbability:.4,flavor:["🐱 一只花猫从巷道里蹿出来，在你脚边蹭了蹭，咕噜噜地叫着。","👴 隔壁老李家传来咿咿呀呀的粤语歌声，是那首《月亮代表我的心》。",'👶 楼道里有孩子在追逐打闹，脚步声噔噔作响，大人在远处喊"慢点跑"。',"🍜 谁家飘出炒菜香，是葱炒鸡蛋的味道，让人突然觉得有些饿。","📱 斜对面阿姨对着手机大声视频通话，方言地道，笑声传出去很远。","🚲 楼道口停了一排共享单车，有两辆已经歪倒成了一堆，没人管。","☔ 屋顶漏出一道细流，房东说上周修，但已经说了好几周了。","🌃 夜里有人在走廊抽烟，橙红的烟头在黑暗里一明一灭。"],jobs:[{id:"waste_recycling",name:"废品回收",icon:"♻️",desc:"走街串巷收废纸板、废金属、废塑料，转手卖给回收站。脏活累活但门槛最低。",startupCost:0,risk:{injury:.01,illness:.005},payHint:{min:20,max:55,text:`payCalc(state) {
      // v3.53 修复：下限从¥20提升到¥25，避免"升级住房→入不敷出"死锁
      const base = Random.float(25, 55);
      const multi = 1 + (state.skills.sales && state.skills.sales.level || 0) * 0.005;
      // v3.8 P1修复：zhouScrap`}},{id:"old_zhou_recycling",name:"老周介绍·正规回收站",icon:"♻️",desc:"老周引荐你去了城西正规废品回收站，分类更细、称重公道、收入翻倍。",startupCost:0,risk:{injury:.02},payHint:{min:30,max:55,text:`payCalc(state) {
      return Math.floor(
        55 +
          state.player.physique * 0.6 +
          (state.skills.sales && state.skills.sales.level || 0) * 0.5 +
          Random.float(0, 30),
      );
    }`}}],amenities:[{id:"slum_canteen",name:"城中村小食堂",icon:"🍚",type:"food",tier:1,cost:6,ap:5,desc:"6块钱管饱，油大盐重，凑合一顿。",primary:{hunger:30},junkFood:!0,lateNight:!1},{id:"slum_publicbath",name:"城中村公共澡堂",icon:"🛁",type:"bath",tier:1,cost:8,ap:8,desc:"热水管够，人多点，但便宜。",primary:{hygiene:35},junkFood:!1,lateNight:!1},{id:"slum_chesssquare",name:"城中村棋牌摊",icon:"♟️",type:"fun",tier:1,cost:5,ap:10,desc:"和大爷下两盘象棋，赢了请烟，输了听吹牛。",primary:{happiness:20},junkFood:!1,lateNight:!1},{id:"slum_napshop",name:"城中村钟点房",icon:"🛏️",type:"rest",tier:1,cost:10,ap:12,desc:"5块钱一小时，简陋但能躺平。",primary:{fatigue:-28},junkFood:!1,lateNight:!1}],actions:[],actionsExtra:[{id:"internet_bar",name:"网吧上网",desc:"花 5 块在网吧上 2 小时网，可以查资料、刷视频、玩游戏。",icon:"💻",apCost:20,payEstimate:"智力+0.3, 随机技能XP",costEstimate:5,hint:"去城中村、商业区或科技园附近的网吧"},{id:"salon_chat",name:"路边理发店聊天",desc:"花 10 块剪个头发，顺便听听老板吹牛。需要敏捷≥18才能帮上忙。",icon:"💈",apCost:20,payEstimate:"心情+10",costEstimate:10,hint:"去城中村或商业区的理发店"}],illegal:[{id:"illegal_steal_battery",name:"偷电瓶",icon:"🔋",desc:"凌晨潜入小区车棚偷电动车电瓶。来钱快，但被保安或警察抓住就完蛋。",apCost:6,rewardRange:[80,180],catchProb:.4,moralityDelta:-15,penalty:{jailDays:2,fine:800}}],buy:[{id:"scrap_paper",name:"废纸板",unit:"斤",price:1.2,category:"scrap"},{id:"water",name:"瓶装水",unit:"瓶",price:1.4,category:"daily"},{id:"lettuce",name:"生菜",unit:"斤",price:2,category:"food"},{id:"corn",name:"玉米",unit:"根",price:2,category:"food"},{id:"onion",name:"洋葱",unit:"斤",price:2,category:"food"},{id:"garlic",name:"大蒜",unit:"斤",price:2,category:"food"},{id:"scrap_plastic",name:"废塑料",unit:"斤",price:2.3,category:"scrap"},{id:"vegetables",name:"蔬菜",unit:"斤",price:3,category:"food"},{id:"tofu",name:"豆腐",unit:"块",price:3,category:"food"},{id:"ginger",name:"生姜",unit:"斤",price:3,category:"food"},{id:"instant_noodles",name:"方便面",unit:"袋",price:4,category:"food"},{id:"scrap_metal",name:"废金属",unit:"斤",price:4,category:"scrap"},{id:"fruits",name:"水果",unit:"斤",price:6,category:"food"},{id:"daily_use",name:"日用品",unit:"件",price:7,category:"daily"},{id:"second_hand_book",name:"二手书",unit:"本",price:15,category:"books"},{id:"clothing",name:"二手衣物",unit:"件",price:25,category:"clothing"}],sell:[{id:"cold_medicine",name:"感冒药",unit:"盒",price:20,category:"medicine"}],vendingNote:"本地居民为主，消费力弱"},wholesaleMarket:{id:"wholesaleMarket",name:"批发市场",icon:"🏪",desc:"各种商品批发的集散地，进货的天堂。",type:"commercial",wealthTier:2,footfall:.9,specialties:[],specialtyLabels:[],priceMod:{water:.8,snacks:.78,noodles:.75,cigarettes:.85,beer:.82,clothing:.8,electronics:.8,fruits:.75,vegetables:.75},priceModList:[{key:"water",value:.8,label:"瓶装水"},{key:"snacks",value:.78,label:"零食"},{key:"noodles",value:.75,label:"面条"},{key:"cigarettes",value:.85,label:"香烟"},{key:"beer",value:.82,label:"啤酒"},{key:"clothing",value:.8,label:"二手衣物"},{key:"electronics",value:.8,label:"小电子产品"},{key:"fruits",value:.75,label:"水果"},{key:"vegetables",value:.75,label:"蔬菜"}],dailyProbability:1,flavor:["🔊 广播喇叭正在播报今日行情：'生姜价格上浮两成！赶紧进货！'","🤝 两个批发商在货堆前激烈讨价还价，嗓门大得整条街都能听见。","🚛 一辆满载货物的大卡车正在倒车，工人们四散躲避，指挥声此起彼伏。","📦 地上散落着被踩扁的纸箱，一个清洁工费力地把它们叠起来。","👃 各种气味混在一起：水果香、海鲜腥、纸箱霉味……早已分不清哪个是哪个。","💼 一个外省口音的中年男人正在向摊主批量询价，手里拿着个小本子记着。","🌅 最早的一批摊主天不亮就来了，现在正疲惫地端着保温杯小口喝茶。"],jobs:[{id:"wholesale_delivery",name:"批发配送",icon:"🚚",desc:"帮批发商送货上门。需要会开车，体力好，收入稳定。",startupCost:0,risk:{injury:.02},payHint:{min:50,max:90,text:`payCalc(state) {
        const drivingBonus = state.skills.driving?.level || 0;
        return Math.floor(Random.float(50, 90) * (1 + drivingBonus * 0.02));
      }`}},{id:"wholesale_sorting",name:"货物分拣",icon:"📦",desc:"在批发市场仓库分拣货物。重复劳动但轻松，适合休息养病。",startupCost:0,risk:{injury:.03},payHint:{min:40,max:70,text:`payCalc(state) {
        return Math.floor(Random.float(40, 70));
      }`}}],amenities:[{id:"wholesale_noodle",name:"批发市场面馆",icon:"🍜",type:"food",tier:2,cost:14,ap:5,desc:"老板娘的牛肉面，分量足，性价比尚可。",primary:{hunger:45,happiness:3},junkFood:!1,lateNight:!1}],actions:[{id:"wholesale_flip",name:"批发市场倒货",icon:"🔄",desc:"在批发市场寻找低价商品，就地转卖给其他摊位。需要口才和眼力。",apCost:20,payEstimate:"100~300"}],actionsExtra:[],illegal:[{id:"illegal_blackmarket",name:"📦 黑市倒卖",icon:"📦",desc:"倒卖来路不明的货物（赃物/走私品）。利润高，但抓到就是 2 天拘留+重罚。",apCost:8,rewardRange:[150,350],catchProb:.45,moralityDelta:-20,penalty:{jailDays:3,fine:1500}},{id:"illegal_fake_docs",name:"📜 倒卖假证",icon:"📜",desc:"在批发市场找人做假身份证/毕业证。市场需求大，但警察盯得紧。",apCost:6,rewardRange:[150,400],catchProb:.35,moralityDelta:-14,penalty:{jailDays:1,fine:600}}],buy:[{id:"water",name:"瓶装水",unit:"瓶",price:1.2,category:"daily"},{id:"lettuce",name:"生菜",unit:"斤",price:2,category:"food"},{id:"corn",name:"玉米",unit:"根",price:2,category:"food"},{id:"onion",name:"洋葱",unit:"斤",price:2,category:"food"},{id:"garlic",name:"大蒜",unit:"斤",price:2,category:"food"},{id:"vinegar",name:"醋",unit:"瓶",price:2,category:"food"},{id:"starch",name:"淀粉",unit:"袋",price:2,category:"food"},{id:"vegetables",name:"蔬菜",unit:"斤",price:2.3,category:"food"},{id:"pen",name:"笔",unit:"支",price:3,category:"stationery"},{id:"tofu",name:"豆腐",unit:"块",price:3,category:"food"},{id:"ginger",name:"生姜",unit:"斤",price:3,category:"food"},{id:"beer",name:"啤酒",unit:"瓶",price:3.3,category:"food"},{id:"snacks",name:"零食",unit:"包",price:3.9,category:"food"},{id:"instant_noodles",name:"方便面",unit:"袋",price:4,category:"food"},{id:"mushroom",name:"蘑菇",unit:"斤",price:4,category:"food"},{id:"fruits",name:"水果",unit:"斤",price:4.5,category:"food"},{id:"carnation",name:"康乃馨",unit:"支",price:5,category:"flowers"},{id:"bamboo_shoot",name:"竹笋",unit:"斤",price:5,category:"food"},{id:"daily_use",name:"日用品",unit:"件",price:10,category:"daily"},{id:"rose",name:"玫瑰花",unit:"支",price:10,category:"flowers"},{id:"painkiller",name:"止痛药",unit:"盒",price:10,category:"medicine"},{id:"notebook_item",name:"笔记本",unit:"本",price:10,category:"stationery"},{id:"cigarettes",name:"香烟",unit:"包",price:12.8,category:"luxury"},{id:"second_hand_book",name:"二手书",unit:"本",price:15,category:"books"},{id:"clothing",name:"二手衣物",unit:"件",price:20,category:"clothing"},{id:"cold_medicine",name:"感冒药",unit:"盒",price:20,category:"medicine"},{id:"shrimp",name:"虾",unit:"斤",price:20,category:"food"},{id:"duck",name:"鸭子",unit:"只",price:22,category:"food"},{id:"electronics",name:"小电子产品",unit:"个",price:64,category:"electronics"}],sell:[{id:"scrap_metal",name:"废金属",unit:"斤",price:2.5,category:"scrap"},{id:"scrap_plastic",name:"废塑料",unit:"斤",price:1.5,category:"scrap"},{id:"scrap_paper",name:"废纸板",unit:"斤",price:.8,category:"scrap"}],vendingNote:"批发商多，但也有零散买家"},construction:{id:"construction",name:"建筑工地",icon:"🏗️",desc:"尘土飞扬的建筑工地，到处是钢筋水泥。",type:"industrial",wealthTier:1,footfall:.5,specialties:["water","beer","cigarettes","instant_noodles"],specialtyLabels:["瓶装水","啤酒","香烟","方便面"],priceMod:{},priceModList:[],dailyProbability:.3,flavor:["🔨 远处传来叮叮当当的敲击声，混着电钻的嗡嗡，工人们已经开工了。","💬 两个工人蹲在角落玩手机，用家乡话聊着老家的收成，偶尔哈哈大笑。","😤 安全帽下是一张被太阳晒得黝黑的脸，汗水顺着额头淌下来，没人在乎。","🎵 工地广播正在播放《再回首》，老歌的旋律在尘土和钢筋间飘荡。","🧱 一摞砖被吊机缓缓吊上高空，在风中轻轻晃动，像是城市的骨头。","🌿 工地围栏缝隙里长出了几根杂草，挤在钢筋水泥里倔强地活着。","🍱 午饭时间，工人们端着饭盒聚在树荫下，有说有笑，像是一天里最放松的时刻。","🌙 傍晚收工，工人们从脚手架上一个个爬下来，沉默着往宿舍方向走。"],jobs:[{id:"manual_labor_construction",name:"建筑工地苦力",icon:"🧱",desc:"在工地搬砖、扛水泥、推砂石。纯体力活，工资日结不拖欠。",startupCost:0,risk:{injury:.03,illness:.02},payHint:{min:30,max:65,text:`payCalc(state) {
      const weldBonus =
        typeof getConstructionBonus === "function"
          ? getConstructionBonus((state.skills.welding && state.skills.welding.level || 0))
          : 0;
      const bossBonus`}},{id:"premium_engineering",name:"正规工程队（李工头推荐）",icon:"🏗️",desc:"李工头介绍的正规建筑公司，工资两倍、有工伤险，活儿也相对规范。",startupCost:0,risk:{injury:.015},payHint:{min:60,max:220,text:`payCalc(state) {
      const weldBonus =
        typeof getConstructionBonus === "function"
          ? getConstructionBonus((state.skills.welding && state.skills.welding.level || 0))
          : 0;
      return Math.flo`}},{id:"steel_worker",name:"钢结构工人",icon:"🏗️",desc:"在建筑工地做钢结构焊接和安装。高空作业，收入高但风险也高。",startupCost:0,risk:{injury:.12},payHint:{min:55,max:120,text:`payCalc(state) {
        var base =
          120 + ((state.skills.welding && state.skills.welding.level || 0)) * 2.5 + Random.float(0, 55);
        return Math.floor(
          base *
            (typeof getBranchJobBon`}}],amenities:[{id:"construction_lunchbox",name:"工地盒饭",icon:"🥡",type:"food",tier:1,cost:10,ap:5,desc:"工地附近的盒饭车，肉沫白菜配米饭。",primary:{hunger:32},junkFood:!0,lateNight:!1}],actions:[{id:"scrapyard_picking",name:"废品站淘货",icon:"🔩",desc:"在工地附近的废品站翻找，运气好能发现值钱物件。了解行情的人更容易捡到宝。",apCost:20,payEstimate:"50~300"}],actionsExtra:[],illegal:[],buy:[{id:"scrap_metal",name:"废金属",unit:"斤",price:2.5,category:"scrap"}],sell:[{id:"cigarettes",name:"香烟",unit:"包",price:15,category:"luxury"},{id:"painkiller",name:"止痛药",unit:"盒",price:10,category:"medicine"},{id:"instant_noodles",name:"方便面",unit:"袋",price:4,category:"food"},{id:"beer",name:"啤酒",unit:"瓶",price:4,category:"food"},{id:"water",name:"瓶装水",unit:"瓶",price:1.5,category:"daily"}],vendingNote:"工人偶尔消费，管理严格"},factoryZone:{id:"factoryZone",name:"工业区",icon:"🏭",desc:"工厂聚集的工业区，机器轰鸣声不绝于耳。",type:"industrial",wealthTier:2,footfall:1,specialties:["beer","cigarettes","water","instant_noodles"],specialtyLabels:["啤酒","香烟","瓶装水","方便面"],priceMod:{water:1.1,snacks:1,noodles:1,cigarettes:1.2,beer:1.2},priceModList:[{key:"water",value:1.1,label:"瓶装水"},{key:"snacks",value:1,label:"零食"},{key:"noodles",value:1,label:"面条"},{key:"cigarettes",value:1.2,label:"香烟"},{key:"beer",value:1.2,label:"啤酒"}],dailyProbability:.5,flavor:["🏭 厂房里机器轰鸣，振动能透过地面一直传到脚底，习惯了就好。","👷 换班的工人们列队而出，统一的工服，脸上有种说不清的疲惫感。","⚠️ 厂门口贴着新的招工告示：'月薪4500，包食宿，有意者面谈'。","🌫️ 排气管道里冒出白色蒸汽，遮住了半片天空，工人们早就不抬头看了。","🚌 厂区通勤班车停在路边，等着上下班的工人，车窗上有人用手指画了个圈。","🍚 厂区角落的小食堂刚开饭，盒饭比外面便宜一半，大家排队端着往里走。","📻 某家小工厂门口摆了台收音机，正播报着省城的新闻，但没有人在听。"],jobs:[{id:"factory_work_assembly",name:"工厂流水线",icon:"🏭",desc:"在电子厂做装配工。机械重复手不停，但收入稳定包吃住。",startupCost:0,risk:{injury:.03,illness:.02},payHint:{min:15,max:80,text:`payCalc(state) {
      const elecBonus =
        typeof getFactoryBonus === "function"
          ? getFactoryBonus((state.skills.electrician && state.skills.electrician.level || 0))
          : 0;
      // v3.8 P1修复：zhan`}},{id:"factory_overtime",name:"工厂加班",icon:"⏰",desc:"工业区工厂招临时加班工。工资高但疲劳增加快，适合短期冲刺。",startupCost:0,risk:{injury:.05,illness:.02},payHint:{min:40,max:120,text:`payCalc(state) {
      return Math.floor(
        120 + state.player.physique * 0.4 + Random.float(0, 40),
      );
    }`}},{id:"long_haul_driver",name:"长途司机",icon:"🚛",desc:"跑长途货运，跨省运输。需要长途运输连携激活。",startupCost:0,risk:{injury:.03},payHint:{min:150,max:250,text:"function(s) { return Math.floor(250 + (s.skills.driving?.level || 0) * 2.5 + (s.skills.accounting?.level || 0) * 1.5 + Random.float(0, 150)); }"}},{id:"truck_assistant",name:"跟车助理",icon:"🚚",desc:"跟货车跑运输，负责装卸货和单据交接。体力活但收入稳定。",startupCost:0,risk:{injury:.05},payHint:{min:35,max:80,text:`payCalc(state) {
        var base =
          80 + ((state.skills.driving && state.skills.driving.level || 0)) * 1.0 + Random.float(0, 35);
        return Math.floor(
          base *
            (typeof getBranchJobBonu`}},{id:"factory_electrician",name:"工厂电工",icon:"⚡",desc:"在工厂负责电气设备维护和检修。技术硬、责任大、工资高。",startupCost:0,risk:{injury:.06},payHint:{min:45,max:100,text:`payCalc(state) {
        var base =
          100 +
          ((state.skills.electrician && state.skills.electrician.level || 0)) * 2.0 +
          Random.float(0, 45);
        return Math.floor(
          base *
       `}}],amenities:[{id:"factory_canteen",name:"工厂食堂",icon:"🍱",type:"food",tier:2,cost:12,ap:5,desc:"三菜一汤，标配饭量，吃饱不浪费。",primary:{hunger:42,happiness:2},junkFood:!1,lateNight:!1},{id:"factory_shower",name:"工厂浴室",icon:"🚿",type:"bath",tier:2,cost:8,ap:6,desc:"下班后顺路冲个澡，工人福利。",primary:{hygiene:40},junkFood:!1,lateNight:!1},{id:"factory_karaoke",name:"工业区KTV",icon:"🎤",type:"fun",tier:2,cost:25,ap:15,desc:"工人大哥的下班嗨歌局，酒过三巡情绪高涨。",primary:{happiness:35,fatigue:5,hunger:-8},junkFood:!1,lateNight:!0}],actions:[{id:"factory_parttime",name:"工厂兼职",icon:"🏭",desc:"在工业区的工厂做临时工，体力活但收入稳定。需要一定的体力基础。",apCost:25,payEstimate:"80~120"}],actionsExtra:[],illegal:[],buy:[{id:"water",name:"瓶装水",unit:"瓶",price:1.7,category:"daily"},{id:"beer",name:"啤酒",unit:"瓶",price:4.8,category:"food"}],sell:[{id:"cold_medicine",name:"感冒药",unit:"盒",price:20,category:"medicine"},{id:"cigarettes",name:"香烟",unit:"包",price:18,category:"luxury"},{id:"painkiller",name:"止痛药",unit:"盒",price:10,category:"medicine"},{id:"beer",name:"啤酒",unit:"瓶",price:4.8,category:"food"},{id:"instant_noodles",name:"方便面",unit:"袋",price:4,category:"food"},{id:"scrap_metal",name:"废金属",unit:"斤",price:2.5,category:"scrap"},{id:"scrap_plastic",name:"废塑料",unit:"斤",price:1.5,category:"scrap"},{id:"scrap_paper",name:"废纸板",unit:"斤",price:.8,category:"scrap"}],vendingNote:"午休工人是主力消费群体"},school:{id:"school",name:"大学城",icon:"🎓",desc:"高校云集的大学城，年轻人多，机会特殊。",type:"institutional",wealthTier:2,footfall:1.2,specialties:["fruits","vegetables","snacks"],specialtyLabels:["水果","蔬菜","零食"],priceMod:{water:.8,snacks:.9,noodles:.9,fruits:1,vegetables:1},priceModList:[{key:"water",value:.8,label:"瓶装水"},{key:"snacks",value:.9,label:"零食"},{key:"noodles",value:.9,label:"面条"},{key:"fruits",value:1,label:"水果"},{key:"vegetables",value:1,label:"蔬菜"}],dailyProbability:.5,flavor:["📚 几个大学生背着双肩包走过，讨论的是某个大厂的秋招笔试题，你听懂了一半。","🎸 操场那边传来吉他声，一个男生对着空气弹唱，音调有点跑。","💻 图书馆门口，几个学生靠着墙刷手机，偶尔把屏幕转给旁边的人看。","🌸 校园里的玉兰花开了，粉白相间，和旁边灰色的教学楼形成奇怪的对比。","📋 公告栏上贴满了讲座通知、兼职信息和失物招领，密密麻麻没有空隙。","🌙 傍晚的校园里，情侣们沿着湖边漫步，低声说话，好像整个世界是他们的。","☕ 校门口奶茶店门口排了长队，新出的草莓季限定款正是热门打卡对象。"],jobs:[{id:"xiao_mei_tutoring",name:"小美推荐·精英家教",icon:"🎓",desc:"小美把你的联系方式推荐给了她导师开的补习机构，时薪比普通家教高出一大截。",startupCost:0,risk:{},payHint:{min:45,max:100,text:`payCalc(state) {
      return Math.floor(
        100 +
          state.player.intelligence * 0.8 +
          (state.skills.english && state.skills.english.level || 0) * 0.6 +
          Random.float(0, 45),
      );
    `}},{id:"tutoring",name:"家教辅导",icon:"📚",desc:"给中小学生辅导功课。智力要求不高，但需要耐心和责任心。",startupCost:0,risk:{},payHint:{min:30,max:40,text:`payCalc(state) {
      return Math.floor(
        40 + state.player.intelligence * 0.3 + Random.float(0, 30),
      );
    }`}},{id:"document_translator",name:"文档翻译",icon:"📝",desc:"接翻译公司的文档翻译单子。自由职业，在家也能做，时间灵活。",startupCost:0,risk:{},payHint:{min:40,max:80,text:`payCalc(state) {
        var base =
          80 + ((state.skills.english && state.skills.english.level || 0)) * 2.0 + Random.float(0, 40);
        return Math.floor(
          base *
            (typeof getBranchJobBonu`}}],amenities:[{id:"school_takeout",name:"大学城外卖",icon:"🍱",type:"food",tier:2,cost:18,ap:5,desc:"学生街的小炒，年轻人最爱。",primary:{hunger:40,happiness:5},junkFood:!1,lateNight:!1},{id:"school_shower",name:"大学城澡堂",icon:"🚿",type:"bath",tier:2,cost:10,ap:6,desc:"学校配套澡堂，干净整洁。",primary:{hygiene:42,happiness:2},junkFood:!1,lateNight:!1},{id:"school_arcade",name:"大学城游戏厅",icon:"🕹️",type:"fun",tier:2,cost:18,ap:12,desc:"拳皇、街霸、跳舞机，年轻人的解压圣地。",primary:{happiness:30,fatigue:5},junkFood:!1,lateNight:!0},{id:"school_studyroom",name:"大学城自习室小憩",icon:"📚",type:"rest",tier:2,cost:5,ap:10,desc:"趴在书桌上眯一会，醒来还能学一会。",primary:{fatigue:-22,happiness:2},junkFood:!1,lateNight:!1}],actions:[{id:"night_school_study",name:"夜校自习",icon:"📚",desc:"在大学城找个自习室学习，效率比在住处高得多。需要交电费。",apCost:25,payEstimate:null}],actionsExtra:[{id:"self_study",name:"图书馆自习",desc:"去图书馆（商业区旁）安静看书。",icon:"📖",apCost:20,payEstimate:"技能XP+30",costEstimate:null,hint:"去大学城、培训中心或图书馆自习"},{id:"night_school",name:"上夜校",desc:"晚上上夜校，提升智力+相关技能。需要 ¥50 学费，智力≥25。",icon:"🌃",apCost:20,payEstimate:"智力+1, 技能+",costEstimate:50,hint:"去大学城或培训中心报名夜校"}],illegal:[{id:"illegal_exam_proxy",name:"✍️ 代考",icon:"✍️",desc:"替人参加考试，一科几百块。被发现就是开除+记过。",apCost:8,rewardRange:[200,500],catchProb:.3,moralityDelta:-16,penalty:{jailDays:1,fine:700}}],buy:[{id:"scrap_paper",name:"废纸板",unit:"斤",price:.8,category:"scrap"},{id:"pen",name:"笔",unit:"支",price:3,category:"stationery"},{id:"snacks",name:"零食",unit:"包",price:4.5,category:"food"},{id:"fruits",name:"水果",unit:"斤",price:6,category:"food"},{id:"notebook_item",name:"笔记本",unit:"本",price:10,category:"stationery"},{id:"second_hand_book",name:"二手书",unit:"本",price:15,category:"books"}],sell:[{id:"electronics",name:"小电子产品",unit:"个",price:80,category:"electronics"},{id:"vitamins_item",name:"维生素",unit:"瓶",price:20,category:"medicine"},{id:"notebook_item",name:"笔记本",unit:"本",price:10,category:"stationery"},{id:"snacks",name:"零食",unit:"包",price:4.5,category:"food"},{id:"pen",name:"笔",unit:"支",price:3,category:"stationery"},{id:"corn",name:"玉米",unit:"根",price:2,category:"food"}],vendingNote:"学生零食消费旺盛，均价稍低"},commercialDist:{id:"commercialDist",name:"商业区",icon:"🏬",desc:"繁华的商业地段，人来人往，商机无限。",type:"commercial",wealthTier:3,footfall:1.8,specialties:["clothing","electronics","beer","cigarettes","fruits"],specialtyLabels:["二手衣物","小电子产品","啤酒","香烟","水果"],priceMod:{water:1.1,snacks:1.15,noodles:1.1,cigarettes:1.15,beer:1.2,clothing:1.15,electronics:1.15,fruits:1.18,vegetables:1.15},priceModList:[{key:"water",value:1.1,label:"瓶装水"},{key:"snacks",value:1.15,label:"零食"},{key:"noodles",value:1.1,label:"面条"},{key:"cigarettes",value:1.15,label:"香烟"},{key:"beer",value:1.2,label:"啤酒"},{key:"clothing",value:1.15,label:"二手衣物"},{key:"electronics",value:1.15,label:"小电子产品"},{key:"fruits",value:1.18,label:"水果"},{key:"vegetables",value:1.15,label:"蔬菜"}],dailyProbability:.6,flavor:["🛍️ 商场橱窗里展示着最新款手机，标价让你默默收回了目光。","🎤 路边有人正在表演街头魔术，围观者发出阵阵惊呼，帽子里已经有了不少硬币。","📣 两家服装店在隔壁打价格战，各自的促销音乐互相干扰，嘈杂到听不清。","😎 几个穿着时髦的年轻人站在路口自拍，摆着各种姿势，没人注意你的存在。","👩‍💼 一个穿职业装的女士边打电话边快步穿过人群，脚步不停，眼神锐利。","🎉 某家新店正在开业，门口贴着'全场五折三天'的红色条幅，人声鼎沸。","🌂 下午三点，阳光晒得路面发烫，遮阳伞和墨镜成了人手一件的标配。"],jobs:[{id:"street_vending_food",name:"摆摊卖小吃",icon:"🍢",desc:"在街边支个小摊卖烤串、煎饼果子。客流量越大，手艺越好，赚得越多。",startupCost:50,risk:{},payHint:{min:10,max:80,text:`payCalc(state) {
      const skillBonus = (state.skills.cooking && state.skills.cooking.level || 0) * 0.8;
      const base = Random.float(45 + skillBonus, 80 + skillBonus);
      const footfall =
        typeof getVendi`}},{id:"sister_zhang_vending",name:"张姐介绍·黄金摊位",icon:"🏪",desc:"张姐帮你弄到了商业区步行街口的好摊位，客流量大，生意兴隆。",startupCost:0,risk:{},payHint:{min:35,max:80,text:`payCalc(state) {
      var footfall =
        typeof getVendingFootfallMod === "function"
          ? getVendingFootfallMod((state.trade && state.trade.currentLocation), state)
          : 1.0;
      return Math.floor(
 `}},{id:"delivery_rider",name:"外卖骑手",icon:"🛵",desc:"平台众包骑手，接单送餐。多劳多得，风里来雨里去。",startupCost:0,risk:{injury:.07},payHint:{min:10,max:730,text:`payCalc(state) {
      var base = 50 + state.player.agility * 0.7 + Random.float(0, 50);
      // [全系统自洽修复] 域D R730b 修复:好感奖励承诺零兑现(huangPriorityOrders配送+10%/huangEbike+15%/xiaochenDeliveryTips+10%写后全库零读取)
      var f = st`}},{id:"restaurant_assistant",name:"帮陈师傅打下手",icon:"🍳",desc:"在陈师傅餐厅打下手，学做菜的同时赚点辛苦钱。",startupCost:0,risk:{},payHint:{min:30,max:50,text:`payCalc(state) {
      const cookBonus =
        typeof getCookingDiscount === "function"
          ? Math.floor((state.skills.cooking && state.skills.cooking.level || 0) * 0.5)
          : 0;
      return Math.floor(50 `}},{id:"logistics_driver",name:"物流专职司机",icon:"🚛",desc:"老李给你安排的专职司机活，开物流车跑固定路线。稳定，不用看天气吃饭，比跑外卖强多了。",startupCost:0,risk:{injury:.02},payHint:{min:80,max:120,text:`payCalc(state) {
      return Math.floor(120 + (state.skills.driving?.level || 0) * 2 + state.player.agility * 0.3 + Random.float(0, 80));
    }`}},{id:"food_truck_owner",name:"移动餐车",icon:"🚚",desc:"开餐车卖小吃。烹饪+销售双技能加持，生意红火。需要餐饮创业连携激活。",startupCost:0,risk:{illness:.01},payHint:{min:100,max:200,text:"function(s) { return Math.floor(200 + (s.skills.cooking?.level || 0) * 2 + (s.skills.sales?.level || 0) * 1.5 + Random.float(0, 100)); }"}},{id:"master_repairman",name:"全能维修",icon:"🔧",desc:"家电维修、电路检修无所不能。需要综合维修连携激活。",startupCost:0,risk:{injury:.02},payHint:{min:100,max:250,text:"function(s) { return Math.floor(250 + (s.skills.repair?.level || 0) * 2.5 + (s.skills.electrician?.level || 0) * 2 + Random.float(0, 100)); }"}},{id:"sales_team_lead",name:"销售主管",icon:"👥",desc:"带领小团队做地推和客户拓展。需要团队销售连携激活。",startupCost:0,risk:{},payHint:{min:150,max:300,text:"function(s) { return Math.floor(300 + (s.skills.sales?.level || 0) * 2.5 + (s.skills.management?.level || 0) * 2 + Random.float(0, 150)); }"}},{id:"smart_home_tech",name:"智能家居技术员",icon:"🏡",desc:"安装调试智能家居系统。需要智能家居专家连携激活。",startupCost:0,risk:{injury:.01},payHint:{min:200,max:400,text:"function(s) { return Math.floor(400 + (s.skills.repair?.level || 0) * 2.5 + (s.skills.electrician?.level || 0) * 2 + (s.skills.coding?.level || 0) * 2 + Random.float(0, 200)); }"}},{id:"cafeteria_worker",name:"食堂帮厨",icon:"🥘",desc:"在企事业单位食堂帮厨，切菜配菜打饭。稳定轻松，比街边摊环境好。",startupCost:0,risk:{},payHint:{min:35,max:70,text:`payCalc(state) {
        var base =
          70 + ((state.skills.cooking && state.skills.cooking.level || 0)) * 1.0 + Random.float(0, 35);
        var branchBonus = 1.25;
        if (typeof getBranchJobBonus === "functi`}},{id:"phone_modding",name:"手机改装",icon:"📱",desc:"帮客户改装手机——换壳、扩容、改色。年轻客户多，利润不错。",startupCost:0,risk:{},payHint:{min:40,max:80,text:`payCalc(state) {
        var base =
          80 + ((state.skills.repair && state.skills.repair.level || 0)) * 1.8 + Random.float(0, 40);
        return Math.floor(
          base *
            (typeof getBranchJobBonus `}},{id:"foreign_trade_assistant",name:"外贸助理",icon:"📦",desc:"在外贸公司协助处理订单、邮件往来。英语好是核心竞争力。",startupCost:0,risk:{},payHint:{min:40,max:90,text:`payCalc(state) {
        var base =
          90 + ((state.skills.english && state.skills.english.level || 0)) * 1.5 + Random.float(0, 40);
        return Math.floor(
          base *
            (typeof getBranchJobBonu`}},{id:"taxi_driver",name:"出租车司机",icon:"🚕",desc:"开出租拉客，多劳多得。驾龄越长路线越熟，赚得越多。",startupCost:0,risk:{injury:.03},payHint:{min:45,max:70,text:`payCalc(state) {
        var base =
          70 + ((state.skills.driving && state.skills.driving.level || 0)) * 1.2 + Random.float(0, 45);
        return Math.floor(
          base *
            (typeof getBranchJobBonu`}},{id:"shop_assistant",name:"导购员",icon:"🏪",desc:"在商场门店做导购，底薪加提成。销售技巧越好收入越高。",startupCost:0,risk:{},payHint:{min:35,max:55,text:`payCalc(state) {
        var base =
          55 + ((state.skills.sales && state.skills.sales.level || 0)) * 1.5 + Random.float(0, 35);
        return Math.floor(
          base *
            (typeof getBranchJobBonus ==`}},{id:"procurement_clerk",name:"采购员",icon:"📋",desc:"为公司采购物资，谈价格比质量。嘴皮子和眼力见都要好。",startupCost:0,risk:{},payHint:{min:40,max:75,text:`payCalc(state) {
        var base =
          75 + ((state.skills.sales && state.skills.sales.level || 0)) * 1.8 + Random.float(0, 40);
        return Math.floor(
          base *
            (typeof getBranchJobBonus ==`}},{id:"courier_gig",name:"跑腿零工",icon:"🚶",desc:"帮人取快递、送文件、买咖啡，啥急活都接。灵活自由，多劳多得。",startupCost:0,risk:{injury:.01},payHint:{min:35,max:35,text:`payCalc(state) {
        var base = 35 + state.player.agility * 0.3 + Random.float(0, 35);
        // 有配送类技能收入更高
        if (state.skills.driving && state.skills.driving.level > 0)
          base *= 1.15;
        if (sta`}}],amenities:[{id:"commercial_restaurant",name:"商业区中餐馆",icon:"🍽️",type:"food",tier:3,cost:35,ap:8,desc:"荤素搭配，营养均衡，吃完精神百倍。",primary:{hunger:65,happiness:10},junkFood:!1,lateNight:!1},{id:"commercial_spa",name:"商业区高级SPA",icon:"🧖",type:"bath",tier:3,cost:50,ap:12,desc:"精油按摩+蒸桑拿，身心都得到净化。",primary:{hygiene:60,fatigue:-25,happiness:12},junkFood:!1,lateNight:!1},{id:"commercial_cinema",name:"商业区电影院",icon:"🎬",type:"fun",tier:3,cost:45,ap:12,desc:"IMAX 大片，爆米花配可乐，沉浸2小时不想出来。",primary:{happiness:45,fatigue:-10},junkFood:!1,lateNight:!1},{id:"commercial_bar",name:"商业区酒吧",icon:"🍸",type:"fun",tier:3,cost:70,ap:18,desc:"鸡尾酒、小食拼盘、霓虹灯光，但喝多明天难受。",primary:{happiness:50,fatigue:10,hunger:-10},junkFood:!0,lateNight:!0}],actions:[{id:"flyer_distribution",name:"商业区发传单",icon:"📄",desc:"在商业区帮商家发传单，收入稳定但枯燥。",apCost:20,payEstimate:"60~80"}],actionsExtra:[{id:"internet_bar",name:"网吧上网",desc:"花 5 块在网吧上 2 小时网，可以查资料、刷视频、玩游戏。",icon:"💻",apCost:20,payEstimate:"智力+0.3, 随机技能XP",costEstimate:5,hint:"去城中村、商业区或科技园附近的网吧"},{id:"salon_chat",name:"路边理发店聊天",desc:"花 10 块剪个头发，顺便听听老板吹牛。需要敏捷≥18才能帮上忙。",icon:"💈",apCost:20,payEstimate:"心情+10",costEstimate:10,hint:"去城中村或商业区的理发店"},{id:"gym",name:"办健身卡锻炼",desc:"去健身房办月卡，提升体质和敏捷。",icon:"🏋️",apCost:20,payEstimate:"体质+1, 敏捷+0.5",costEstimate:200,hint:"去公园、商业区或娱乐城附近的健身场所"},{id:"pharmacy",name:"买药/买营养品",desc:"去药房买维生素、补品等。需要 ¥30~80。",icon:"💊",apCost:20,payEstimate:"健康+5",costEstimate:30,hint:"去医院或商业区药房"},{id:"supermarket",name:"去超市采购",desc:"去超市买点吃的用的。需要 ¥30~60。",icon:"🛒",apCost:20,payEstimate:"饥饱+30, 卫生+",costEstimate:30,hint:"去商业区超市"},{id:"clothing",name:"买件新衣服",desc:"去服装店买件像样的衣服，提升卫生/心情/名气。",icon:"👕",apCost:20,payEstimate:"卫生+10, 名气+",costEstimate:80,hint:"去商业区服装店"}],illegal:[{id:"illegal_pickpocket",name:"🤏 扒窃",icon:"🤏",desc:"在商业区人潮中摸手机钱包。技术活，但被人赃并获就是拘留+罚款。",apCost:4,rewardRange:[40,120],catchProb:.3,moralityDelta:-12,penalty:{jailDays:1,fine:300}},{id:"illegal_shop_theft",name:"🏪 盗窃店铺",icon:"🏪",desc:"趁店员不注意顺走货架上的值钱商品。商业区机会多，但监控也多。",apCost:6,rewardRange:[100,300],catchProb:.45,moralityDelta:-18,penalty:{jailDays:2,fine:1e3}},{id:"illegal_scam",name:"🎭 碰瓷",icon:"🎭",desc:"在马路上故意被车蹭倒，讹司机赔偿。风险高，但成功来钱快。",apCost:5,rewardRange:[50,180],catchProb:.5,moralityDelta:-15,penalty:{jailDays:2,fine:800}}],buy:[{id:"scrap_plastic",name:"废塑料",unit:"斤",price:1.5,category:"scrap"},{id:"vitamins_item",name:"维生素",unit:"瓶",price:20,category:"medicine"}],sell:[{id:"electronics",name:"小电子产品",unit:"个",price:92,category:"electronics"},{id:"clothing",name:"二手衣物",unit:"件",price:28.7,category:"clothing"},{id:"duck",name:"鸭子",unit:"只",price:22,category:"food"},{id:"cold_medicine",name:"感冒药",unit:"盒",price:20,category:"medicine"},{id:"vitamins_item",name:"维生素",unit:"瓶",price:20,category:"medicine"},{id:"shrimp",name:"虾",unit:"斤",price:20,category:"food"},{id:"cigarettes",name:"香烟",unit:"包",price:17.3,category:"luxury"},{id:"second_hand_book",name:"二手书",unit:"本",price:15,category:"books"},{id:"daily_use",name:"日用品",unit:"件",price:10,category:"daily"},{id:"rose",name:"玫瑰花",unit:"支",price:10,category:"flowers"},{id:"painkiller",name:"止痛药",unit:"盒",price:10,category:"medicine"},{id:"fruits",name:"水果",unit:"斤",price:7.1,category:"food"},{id:"snacks",name:"零食",unit:"包",price:5.8,category:"food"},{id:"carnation",name:"康乃馨",unit:"支",price:5,category:"flowers"},{id:"bamboo_shoot",name:"竹笋",unit:"斤",price:5,category:"food"},{id:"beer",name:"啤酒",unit:"瓶",price:4.8,category:"food"},{id:"instant_noodles",name:"方便面",unit:"袋",price:4,category:"food"},{id:"mushroom",name:"蘑菇",unit:"斤",price:4,category:"food"},{id:"vegetables",name:"蔬菜",unit:"斤",price:3.4,category:"food"},{id:"pen",name:"笔",unit:"支",price:3,category:"stationery"},{id:"tofu",name:"豆腐",unit:"块",price:3,category:"food"},{id:"ginger",name:"生姜",unit:"斤",price:3,category:"food"},{id:"lettuce",name:"生菜",unit:"斤",price:2,category:"food"},{id:"corn",name:"玉米",unit:"根",price:2,category:"food"},{id:"onion",name:"洋葱",unit:"斤",price:2,category:"food"},{id:"garlic",name:"大蒜",unit:"斤",price:2,category:"food"},{id:"vinegar",name:"醋",unit:"瓶",price:2,category:"food"},{id:"starch",name:"淀粉",unit:"袋",price:2,category:"food"},{id:"water",name:"瓶装水",unit:"瓶",price:1.7,category:"daily"}],vendingNote:"主商圈，客流量最大，但城管也多"},techPark:{id:"techPark",name:"科技园",icon:"💻",desc:"互联网大厂的聚集地，高楼林立，精英云集。",type:"corporate",wealthTier:3,footfall:.7,specialties:["electronics","daily_use","snacks"],specialtyLabels:["小电子产品","日用品","零食"],priceMod:{},priceModList:[],dailyProbability:.4,flavor:["💻 几个穿格子衫的程序员坐在户外，盯着笔记本屏幕敲代码，耳机挂在脖子上。","☕ 园区咖啡馆里坐满了人，讨论的全是'融资''估值''赛道'……你插不上话。","🚗 停车场里一溜儿新能源车，不少还贴着大厂内部泊位贴纸。","📊 大楼入口大屏滚动着季度KPI和公司目标，路过的员工都没什么表情。","👓 一个戴眼镜的年轻人等外卖，手机不停地刷工作群消息，嘴角抿得很紧。","🎯 招聘广告牌写着'改变世界，从这里开始'，下方小字标注：'大小周，年终双薪'。","🌃 深夜还有几栋楼亮着灯，某个格子间里有人对着屏幕皱眉，连夜赶项目。"],jobs:[{id:"content_writing",name:"内容创作者",icon:"✍️",desc:"给平台和公众号写文章、做内容。要有文字功底和英语能力，本科以上学历优先。",startupCost:0,risk:{},payHint:{min:50,max:85,text:`payCalc(state) {
      const engBonus = state.skills.english
        ? (state.skills.english && state.skills.english.level || 0) * 0.8
        : 0;
      const intBonus = state.player.intelligence * 0.7;
      return Mat`}},{id:"junior_analyst",name:"初级数据分析师",icon:"📊",desc:"用Excel/表格做市场数据分析，输出报告。高学历高智力才能胜任，但薪资也是街头最高档。",startupCost:0,risk:{},payHint:{min:60,max:130,text:`payCalc(state) {
      return Math.floor(
        130 + state.player.intelligence * 1.2 + Random.float(0, 60),
      );
    }`}},{id:"remote_dev",name:"远程开发",icon:"💻",desc:"接海外远程编程项目。需要国际外包连携激活。",startupCost:0,risk:{},payHint:{min:200,max:300,text:"function(s) { return Math.floor(300 + (s.skills.coding?.level || 0) * 3 + (s.skills.english?.level || 0) * 2 + Random.float(0, 200)); }"}},{id:"foreign_company_staff",name:"外企职员",icon:"🏢",desc:"在外资企业做行政/协调工作。需要外企晋升连携激活。",startupCost:0,risk:{},payHint:{min:200,max:400,text:"function(s) { return Math.floor(400 + (s.skills.english?.level || 0) * 3 + (s.skills.management?.level || 0) * 2 + Random.float(0, 200)); }"}},{id:"finance_analyst",name:"财务分析师",icon:"📊",desc:"为企业提供财务分析服务。需要财务自由连携激活。",startupCost:0,risk:{},payHint:{min:150,max:350,text:"function(s) { return Math.floor(350 + (s.skills.accounting?.level || 0) * 3 + (s.skills.management?.level || 0) * 2 + Random.float(0, 150)); }"}},{id:"instrument_repair",name:"仪器仪表维修",icon:"🔬",desc:"维修精密测量仪器、实验室设备。技术含量高，收入可观。",startupCost:0,risk:{},payHint:{min:50,max:100,text:`payCalc(state) {
        var base =
          100 + ((state.skills.repair && state.skills.repair.level || 0)) * 2.5 + Random.float(0, 50);
        var branchBonus =
          typeof getBranchJobBonus === "function"
     `}},{id:"web_designer",name:"网页设计师",icon:"🎨",desc:"帮小公司做网页设计制作。学了前端正好用上，按项目计酬。",startupCost:0,risk:{},payHint:{min:55,max:110,text:`payCalc(state) {
        var base =
          110 + ((state.skills.coding && state.skills.coding.level || 0)) * 2.0 + Random.float(0, 55);
        return Math.floor(
          base *
            (typeof getBranchJobBonus`}},{id:"server_ops",name:"服务器运维",icon:"⚙️",desc:"维护公司服务器、数据库。夜班少，工作稳定，是技术岗的敲门砖。",startupCost:0,risk:{},payHint:{min:50,max:130,text:`payCalc(state) {
        var base =
          130 + ((state.skills.coding && state.skills.coding.level || 0)) * 2.5 + Random.float(0, 50);
        return Math.floor(
          base *
            (typeof getBranchJobBonus`}},{id:"network_monitor",name:"网络安全监控",icon:"🔒",desc:"监控公司网络安全状况，排查异常流量。责任重大，薪资丰厚。",startupCost:0,risk:{},payHint:{min:45,max:120,text:`payCalc(state) {
        var base =
          120 + ((state.skills.coding && state.skills.coding.level || 0)) * 2.2 + Random.float(0, 45);
        return Math.floor(
          base *
            (typeof getBranchJobBonus`}},{id:"project_coordinator",name:"项目协调员",icon:"📊",desc:"协调团队内部工作进度，做会议记录和任务追踪。管理入门岗。",startupCost:0,risk:{},payHint:{min:35,max:85,text:`payCalc(state) {
        var base =
          85 + ((state.skills.management && state.skills.management.level || 0)) * 1.5 + Random.float(0, 35);
        return Math.floor(
          base *
            (typeof getBranchJ`}},{id:"audit_assistant",name:"审计助理",icon:"🔍",desc:"协助注册会计师做账目审计，核对票据和凭证。严谨细致是核心要求。",startupCost:0,risk:{},payHint:{min:40,max:95,text:`payCalc(state) {
        var base =
          95 + ((state.skills.accounting && state.skills.accounting.level || 0)) * 2.0 + Random.float(0, 40);
        return Math.floor(
          base *
            (typeof getBranchJ`}}],amenities:[{id:"techpark_brunch",name:"科技园轻食",icon:"🥗",type:"food",tier:3,cost:35,ap:8,desc:"藜麦三文鱼沙拉，互联网精英的标配午餐。",primary:{hunger:60,happiness:8},junkFood:!1,lateNight:!1},{id:"techpark_gymshower",name:"科技园健身房淋浴",icon:"🚿",type:"bath",tier:3,cost:20,ap:8,desc:"刷一下健身卡顺便淋浴，互联网人省时之选。",primary:{hygiene:50,fatigue:-10},junkFood:!1,lateNight:!1},{id:"techpark_napcapsule",name:"科技园午睡舱",icon:"🛌",type:"rest",tier:3,cost:20,ap:8,desc:"高科技睡眠舱，30分钟顶3小时。",primary:{fatigue:-40,happiness:5},junkFood:!1,lateNight:!1}],actions:[{id:"techpark_networking",name:"科技园找机会",icon:"💡",desc:"在科技园里观察和接触创业公司的人，可能找到工作或创业机会。需要脑子灵活。",apCost:20,payEstimate:"0~∞"}],actionsExtra:[{id:"internet_bar",name:"网吧上网",desc:"花 5 块在网吧上 2 小时网，可以查资料、刷视频、玩游戏。",icon:"💻",apCost:20,payEstimate:"智力+0.3, 随机技能XP",costEstimate:5,hint:"去城中村、商业区或科技园附近的网吧"}],illegal:[],buy:[{id:"electronics",name:"小电子产品",unit:"个",price:80,category:"electronics"}],sell:[{id:"electronics",name:"小电子产品",unit:"个",price:80,category:"electronics"},{id:"clothing",name:"二手衣物",unit:"件",price:25,category:"clothing"},{id:"vitamins_item",name:"维生素",unit:"瓶",price:20,category:"medicine"},{id:"shrimp",name:"虾",unit:"斤",price:20,category:"food"},{id:"second_hand_book",name:"二手书",unit:"本",price:15,category:"books"},{id:"daily_use",name:"日用品",unit:"件",price:10,category:"daily"},{id:"rose",name:"玫瑰花",unit:"支",price:10,category:"flowers"},{id:"notebook_item",name:"笔记本",unit:"本",price:10,category:"stationery"},{id:"fruits",name:"水果",unit:"斤",price:6,category:"food"},{id:"pen",name:"笔",unit:"支",price:3,category:"stationery"}],vendingNote:"白领消费力强但习惯点外卖"},hospital:{id:"hospital",name:"医院",icon:"🏥",desc:"看病治疗的地方。健康是革命的本钱。",type:"service",wealthTier:2,footfall:.8,specialties:["fruits","water","snacks"],specialtyLabels:["水果","瓶装水","零食"],priceMod:{},priceModList:[],dailyProbability:.3,flavor:["🏥 急诊室外有人焦急地来回踱步，手机夹在肩膀和耳朵之间，边走边说。","👴 挂号大厅里老人排了长队，有人抱着病历本，有人盯着叫号屏幕发呆。","💊 药房窗口贴着收费价格单，一串长长的数字，让人叹了口气。","🌹 走廊里有人端着一束百合花，脸上带着疲惫的笑，应该是来探病的家属。","😢 候诊区的孩子哭了起来，旁边的父母轻声安抚，说'一会儿就好了'。","🍱 护士换班时抱着保温饭盒穿过走廊，脚步匆忙，没时间喘息。","📋 门诊室外的椅子上，有人低着头翻看检查报告，眼神里有种说不清的凝重。"],jobs:[{id:"hospital_companion",name:"陪诊服务",icon:"🏥",desc:"帮老人/行动不便者去医院陪诊挂号、取药。需要耐心和细心，收入稳定。",startupCost:0,risk:{illness:.02},payHint:{min:80,max:80,text:`payCalc(state) {
      return Math.floor(80 + state.player.mental * 0.3 + Random.float(0, 80));
    }`}}],amenities:[],actions:[{id:"hospital_donate",name:"医院献血",icon:"🩸",desc:"去医院献血，既能帮助他人又能赚营养补贴。要求身体健康。",apCost:15,payEstimate:"200"}],actionsExtra:[{id:"pharmacy",name:"买药/买营养品",desc:"去药房买维生素、补品等。需要 ¥30~80。",icon:"💊",apCost:20,payEstimate:"健康+5",costEstimate:30,hint:"去医院或商业区药房"}],illegal:[],buy:[{id:"painkiller",name:"止痛药",unit:"盒",price:10,category:"medicine"},{id:"cold_medicine",name:"感冒药",unit:"盒",price:20,category:"medicine"},{id:"vitamins_item",name:"维生素",unit:"瓶",price:20,category:"medicine"}],sell:[{id:"shrimp",name:"虾",unit:"斤",price:20,category:"food"},{id:"cigarettes",name:"香烟",unit:"包",price:15,category:"luxury"},{id:"daily_use",name:"日用品",unit:"件",price:10,category:"daily"},{id:"fruits",name:"水果",unit:"斤",price:6,category:"food"},{id:"carnation",name:"康乃馨",unit:"支",price:5,category:"flowers"},{id:"mushroom",name:"蘑菇",unit:"斤",price:4,category:"food"},{id:"vegetables",name:"蔬菜",unit:"斤",price:3,category:"food"},{id:"tofu",name:"豆腐",unit:"块",price:3,category:"food"},{id:"ginger",name:"生姜",unit:"斤",price:3,category:"food"}],vendingNote:"探病家属是主要客群"},bank:{id:"bank",name:"银行",icon:"🏦",desc:"存取款、办理贷款。",type:"service",wealthTier:2,footfall:.4,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.2,flavor:["🔢 取号机叫到了87号，你手里拿着148号，慢慢等吧。","💼 西装笔挺的理财顾问正向一位中年女士推销基金，语气轻柔，措辞笃定。","🏦 存款利率告示牌上的数字已经很久没有变动了，旁边的人看了一眼就走了。","😴 等待区里有一位大爷睡着了，脑袋垂在胸前，手里的号码单差点掉落。","📱 ATM机前有人忘了密码，反复重试，后面排队的人耐心地等，没人催。","🔒 保险柜展示窗里摆着金条模型，亮闪闪的，吸引了很多人停下来看。","❄️ 银行里的空调开得很足，比外面凉快多了，有个流浪汉悄悄坐在角落蹭凉气。"],jobs:[{id:"bank_security",name:"银行保安",icon:"👮",desc:"在银行大厅维持秩序，站一天挺累的，但胜在稳定。偶尔能遇上运钞车押运的额外任务。",startupCost:0,risk:{},payHint:{min:60,max:90,text:`function (state) {
      return Math.floor(Random.float(60, 90));
    }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"人流稀少，不适合摆摊"},park:{id:"park",name:"公园",icon:"🌳",desc:"城市中的绿洲，可以放松身心。",type:"recreation",wealthTier:2,footfall:1,specialties:["snacks","water","fruits"],specialtyLabels:["零食","瓶装水","水果"],priceMod:{},priceModList:[],dailyProbability:.5,flavor:["🌳 老人们在树荫下打太极拳，动作舒缓而专注，像是慢放的录像。","🦆 湖边有人在喂鸭子，孩子兴奋地蹲下去，鸭子却拍着翅膀跑开了。","📻 广场舞队伍正在热身，音乐混着笑声飘过来，自成一个小世界。","🏃 一个中年男人慢跑经过，汗水浸透了后背，表情却很放松，脚步均匀。","🌺 公园里的月季花开了，有人凑近拿手机拍，比比划划寻找最好的角度。","⛸️ 溜冰场传来轮滑的声音，几个孩子扶着栏杆慢慢滑，互相对视着笑。","🌅 傍晚的阳光把树影拉得很长，坐在长椅上什么都不做也是一种奢侈。","🕊️ 一群鸽子聚在广场上觅食，有人扔了把瓜子，鸽子们扑腾着扑过去。"],jobs:[{id:"busking",name:"街头表演",icon:"🎸",desc:"在天桥或广场表演才艺。脸皮要厚，观众打赏全看心情。",startupCost:0,risk:{},payHint:{min:18,max:42,text:`payCalc(state) {
        return Math.floor(
          18 +
            (state.player.mental || 0) * 0.2 +
            (state.player.fame || 0) * 0.3 +
            (typeof Random !== "undefined" && Random.float ? Random.f`}}],amenities:[{id:"park_streetfood",name:"公园小吃摊",icon:"🌭",type:"food",tier:2,cost:12,ap:5,desc:"烤串、烤肠、煎饼果子，夜市的诱惑。",primary:{hunger:35,happiness:4},junkFood:!0,lateNight:!1},{id:"park_chat",name:"公园闲坐",icon:"🪑",type:"fun",tier:1,cost:0,ap:8,desc:"晒晒太阳，看老人下棋，心情慢慢好起来。",primary:{happiness:18,fatigue:-5},junkFood:!1,lateNight:!1},{id:"park_nap",name:"公园长椅小憩",icon:"😴",type:"rest",tier:1,cost:0,ap:10,desc:"找张长椅躺一会，蚊子可能多点。",primary:{fatigue:-20},junkFood:!1,lateNight:!1}],actions:[{id:"park_exercise",name:"公园晨练",icon:"🏃",desc:"在公园晨练，免费又健康，还能放松身心。",apCost:15,payEstimate:"0"}],actionsExtra:[{id:"gym",name:"办健身卡锻炼",desc:"去健身房办月卡，提升体质和敏捷。",icon:"🏋️",apCost:20,payEstimate:"体质+1, 敏捷+0.5",costEstimate:200,hint:"去公园、商业区或娱乐城附近的健身场所"}],illegal:[],buy:[],sell:[{id:"snacks",name:"零食",unit:"包",price:5,category:"food"},{id:"water",name:"瓶装水",unit:"瓶",price:1.5,category:"daily"}],vendingNote:"周末家庭聚集，工作日冷清"},community_center:{id:"community_center",name:"社区中心",icon:"🏛️",desc:"街道办下属的社区服务中心,提供免费讲座、职业咨询和邻里互助活动。",type:"public",wealthTier:2,footfall:.5,specialties:["second_hand_book","pen","notebook_item"],specialtyLabels:["二手书","笔","笔记本"],priceMod:{water:.8,snacks:.9,daily_use:.85},priceModList:[{key:"water",value:.8,label:"瓶装水"},{key:"snacks",value:.9,label:"零食"},{key:"daily_use",value:.85,label:"日用品"}],dailyProbability:.3,flavor:[],jobs:[{id:"community_volunteer",name:"社区志愿者",icon:"🤝",desc:"在社区中心帮忙组织活动、服务居民。不赚钱但积人脉、长心智。",startupCost:0,risk:{},payHint:{min:20,max:20,text:"payCalc(state) { return Math.floor(Random.float(0, 20)); }"}},{id:"career_counselor_assistant",name:"职业咨询助理",icon:"📋",desc:"协助老陈做职业咨询,整理资料。需要一定的心智和社交能力。",startupCost:0,risk:{},payHint:{min:30,max:30,text:"payCalc(state) { return Math.floor(30 + state.player.mental * 0.3 + Random.float(0, 30)); }"}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"公共服务为主,少量便民摊位"},night_market:{id:"night_market",name:"夜市",icon:"🏮",desc:"傍晚开始热闹的夜市,各种小吃摊位、杂货地摊,烟火气十足。",type:"commercial",wealthTier:2,footfall:.95,specialties:["snacks","water","beer","clothing"],specialtyLabels:["零食","瓶装水","啤酒","二手衣物"],priceMod:{snacks:.9,water:.85,beer:.8,clothing:1.1},priceModList:[{key:"snacks",value:.9,label:"零食"},{key:"water",value:.85,label:"瓶装水"},{key:"beer",value:.8,label:"啤酒"},{key:"clothing",value:1.1,label:"二手衣物"}],dailyProbability:.7,flavor:[],jobs:[{id:"night_market_vendor",name:"夜市摆摊",icon:"🏮",desc:"在夜市支个摊卖小吃或杂货。客流量大,赚钱快,但竞争激烈。",startupCost:0,risk:{illness:.01},payHint:{min:60,max:120,text:`payCalc(state) {
        const base = Random.float(60, 120);
        const cookBonus = (state.skills.cooking && state.skills.cooking.level) ? state.skills.cooking.level * 0.8 : 0;
        const salesBonus = (state.skills`}},{id:"night_market_helper",name:"夜市帮工",icon:"🍢",desc:"帮小薇或其他摊主打下手。学手艺、攒经验,收入稳定。",startupCost:0,risk:{},payHint:{min:25,max:50,text:`payCalc(state) {
        return Math.floor(50 + ((state.skills.cooking && state.skills.cooking.level) || 0) * 0.6 + Random.float(0, 25));
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"人流量大,消费意愿强,但竞争也激烈"},trainingCenter:{id:"trainingCenter",name:"培训中心",icon:"📚",desc:"学习技能、考取证书的地方。投资自己。",type:"education",wealthTier:2,footfall:.7,specialties:["daily_use","snacks","water"],specialtyLabels:["日用品","零食","瓶装水"],priceMod:{},priceModList:[],dailyProbability:.3,flavor:["📖 走廊里有人在背电工规范，念念有词，来回踱步，背完一页换一页。","🎓 布告栏上贴满了职业资格考试的广告，每一张都许诺'高薪就业，前途无量'。","✏️ 自习室里，学员们低着头做练习题，偶尔叹气翻页，偶尔提笔认真填写。","👨‍🏫 教室里传出讲师的声音：'这道题考试必考！大家划重点！翻过去别睡着！'","☕ 门口的小卖部咖啡卖得不错，下午三点最容易犯困，买一杯提提神。","📱 课间休息时，大家纷纷刷手机，有人在查招聘信息，有人在看直播。","🌙 晚班学员下课已经快九点了，还要坐末班公交回家，眼睛里有一种说不清的疲惫。"],jobs:[{id:"training_assistant",name:"培训助理",icon:"📋",desc:"协助培训老师管理班级、准备教材。需要耐心和组织能力。",startupCost:0,risk:{},payHint:{min:40,max:40,text:`payCalc(state) {
      return Math.floor(40 + state.player.mental * 0.2 + Random.float(0, 40));
    }`}}],amenities:[],actions:[{id:"library_study",name:"图书馆啃书",icon:"📖",desc:"在培训中心的图书馆看书，各种技能书都有，对提升技能很有帮助。只需交茶水费。",apCost:20,payEstimate:null}],actionsExtra:[{id:"self_study",name:"图书馆自习",desc:"去图书馆（商业区旁）安静看书。",icon:"📖",apCost:20,payEstimate:"技能XP+30",costEstimate:null,hint:"去大学城、培训中心或图书馆自习"},{id:"night_school",name:"上夜校",desc:"晚上上夜校，提升智力+相关技能。需要 ¥50 学费，智力≥25。",icon:"🌃",apCost:20,payEstimate:"智力+1, 技能+",costEstimate:50,hint:"去大学城或培训中心报名夜校"}],illegal:[],buy:[],sell:[],vendingNote:"学员课间小消费"},suburb:{id:"suburb",name:"郊区",icon:"🌆",desc:"城市边缘的郊区，安静但交通不便。房租便宜，适合养病/休息。",type:"residential",wealthTier:2,footfall:.4,specialties:["vegetables","fruits"],specialtyLabels:["蔬菜","水果"],priceMod:{water:.85,vegetables:.8,fruits:.85},priceModList:[{key:"water",value:.85,label:"瓶装水"},{key:"vegetables",value:.8,label:"蔬菜"},{key:"fruits",value:.85,label:"水果"}],dailyProbability:.3,flavor:["🌾 郊区的田埂上，几个老人正在收割最后一茬水稻，镰刀在阳光下闪着光。","🚌 末班公交车慢悠悠地开过来，车上只有三四个乘客，司机打着哈欠。","🐕 一只土狗趴在路边晒太阳，看到有人经过就懒洋洋地抬一下眼皮。","🏡 一栋自建小楼正在装修，电钻声从清晨响到傍晚，邻居们早已习以为常。","🌅 傍晚时分，郊区的天空格外开阔，晚霞把整片天空染成橘红色。","🚲 一条乡间小路旁停着几辆自行车，骑车的人正在路边小卖部买冰棍。","🌙 郊区的夜晚格外安静，偶尔能听到远处火车的汽笛声，悠长而遥远。"],jobs:[],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"客流量少，适合长期居住不适合摆摊"},luxury_community:{id:"luxury_community",name:"高档小区",icon:"🏘️",desc:"高档封闭式小区，有物业和保安。普通摆摊进不去，但可以提供上门服务。",type:"residential",wealthTier:3,footfall:.3,specialties:["cigarettes","electronics"],specialtyLabels:["香烟","小电子产品"],priceMod:{clothing:1.3,electronics:1.2,cigarettes:1.4},priceModList:[{key:"clothing",value:1.3,label:"二手衣物"},{key:"electronics",value:1.2,label:"小电子产品"},{key:"cigarettes",value:1.4,label:"香烟"}],dailyProbability:.2,flavor:[],jobs:[{id:"premium_housekeeper",name:"高档家政",icon:"🧹",desc:"在高档小区做家政服务。环境好、收入高，但需要细致耐心。",startupCost:0,risk:{},payHint:{min:16,max:80,text:`payCalc(state) {
        // [域A 修复] hygiene 真实路径为 state.needs.hygiene (非 state.player.hygiene)，
        // 原写法恒为 undefined → ||0 吸收 → 清洁度加成永远为 0。
        // [全系统自洽修复] 域A A类#16: state.needs 守卫
        var hygiene = state `}},{id:"chauffeur",name:"私人司机",icon:"🚗",desc:"给富人当专职司机。需要驾驶技术好、穿着得体、守时。",startupCost:0,risk:{injury:.01},payHint:{min:30,max:90,text:`payCalc(state) {
        var base =
          90 + (state.skills.driving?.level || 0) * 1.2 + Random.float(0, 30);
        return Math.floor(base);
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"门禁严格，需要预约才能进入"},old_community:{id:"old_community",name:"老旧小区",icon:"🏘️",desc:"90年代建的老小区，设施陈旧但生活便利。居民多为本地老住户。",type:"residential",wealthTier:2,footfall:.7,specialties:["daily_use","vegetables"],specialtyLabels:["日用品","蔬菜"],priceMod:{daily_use:.9,vegetables:.85},priceModList:[{key:"daily_use",value:.9,label:"日用品"},{key:"vegetables",value:.85,label:"蔬菜"}],dailyProbability:.4,flavor:[],jobs:[{id:"cleaning_service",name:"清洁工",icon:"🧹",desc:"在老小区做清洁，楼道扫地、清运垃圾。辛苦但稳定。",startupCost:0,risk:{injury:.02},payHint:{min:20,max:40,text:`payCalc(state) {
        return Math.floor(
          40 + state.player.physique * 0.2 + Random.float(0, 20),
        );
      }`}},{id:"repair_service",name:"维修工",icon:"🔧",desc:"帮小区居民修水管、通马桶、换灯泡。手艺活，邻里街坊都找你。",startupCost:0,risk:{injury:.03},payHint:{min:40,max:50,text:`payCalc(state) {
        var base =
          50 + (state.skills.repair?.level || 0) * 1.5 + Random.float(0, 40);
        return Math.floor(base);
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"老年居民多，消费习惯保守"},gov_office:{id:"gov_office",name:"政府办事大厅",icon:"🏛️",desc:"办理各种证件/业务的地方。办证/贷款/社保都在这里。",type:"service",wealthTier:2,footfall:.5,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.2,flavor:[],jobs:[],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"人流稀少，不适合摆摊"},court:{id:"court",name:"法院",icon:"⚖️",desc:"打官司的地方。可以起诉欠债不还、劳动纠纷等。",type:"service",wealthTier:2,footfall:.3,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.1,flavor:[],jobs:[],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"严肃场所，不适合摆摊"},job_market:{id:"job_market",name:"人才市场",icon:"🏢",desc:"找工作、招聘的地方。每周有招聘会，可以投简历。",type:"service",wealthTier:2,footfall:.8,specialties:["daily_use"],specialtyLabels:["日用品"],priceMod:{daily_use:.9},priceModList:[{key:"daily_use",value:.9,label:"日用品"}],dailyProbability:.3,flavor:[],jobs:[],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"求职者多，但消费力弱"},entertainment:{id:"entertainment",name:"娱乐城",icon:"🎮",desc:"电影院/KTV/游戏厅聚集地。放松娱乐，消耗现金。",type:"recreation",wealthTier:3,footfall:1.5,specialties:["snacks","beer","electronics"],specialtyLabels:["零食","啤酒","小电子产品"],priceMod:{snacks:1.2,beer:1.3,electronics:1.1},priceModList:[{key:"snacks",value:1.2,label:"零食"},{key:"beer",value:1.3,label:"啤酒"},{key:"electronics",value:1.1,label:"小电子产品"}],dailyProbability:.6,flavor:[],jobs:[],amenities:[],actions:[],actionsExtra:[{id:"gym",name:"办健身卡锻炼",desc:"去健身房办月卡，提升体质和敏捷。",icon:"🏋️",apCost:20,payEstimate:"体质+1, 敏捷+0.5",costEstimate:200,hint:"去公园、商业区或娱乐城附近的健身场所"},{id:"movie",name:"看场电影",desc:"去影院看场电影放松一下。",icon:"🎬",apCost:20,payEstimate:"心情+18",costEstimate:35,hint:"去娱乐城的影院"},{id:"ktv",name:"KTV 唱歌",desc:"约朋友去 KTV 吼两小时。",icon:"🎤",apCost:20,payEstimate:"心情+25, 人缘+",costEstimate:80,hint:"去娱乐城的 KTV"}],illegal:[{id:"illegal_foot_massage",name:"🦶 洗脚城灰服务",icon:"🦶",desc:"去洗脚城点'特殊服务'。心情大涨，但有被扫黄抓+染病风险。",apCost:4,rewardRange:[25,40],catchProb:.25,moralityDelta:-10,penalty:{jailDays:0,fine:500,diseaseProb:.35}}],buy:[],sell:[],vendingNote:"年轻人多，消费力强"},temple:{id:"temple",name:"寺庙",icon:"⛩️",desc:"城市中的古老寺庙。祈福/冥想/心灵慰藉。",type:"recreation",wealthTier:2,footfall:.6,specialties:["fruits","water"],specialtyLabels:["水果","瓶装水"],priceMod:{fruits:1.1,water:1.05},priceModList:[{key:"fruits",value:1.1,label:"水果"},{key:"water",value:1.05,label:"瓶装水"}],dailyProbability:.3,flavor:[],jobs:[],amenities:[],actions:[{id:"temple_meditate_extra",name:"寺庙静心",icon:"🧘",desc:"在寺庙里打坐冥想，净化心灵。烧点香火，求个心安。",apCost:15,payEstimate:null}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"香客多，不适合摆摊"},library:{id:"library",name:"图书馆",icon:"📖",desc:"免费的公共图书馆，藏书丰富环境安静。适合自学技能、查找资料、消磨时光。",type:"education",wealthTier:2,footfall:.5,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.2,flavor:["📚 自习区坐满了人，有人戴着耳机看书，有人在草稿纸上写写画画。","📖 一位老人坐在角落里看报纸，报纸已经泛黄，边角卷了起来。","🌿 窗边的绿植长得很好，阳光透过玻璃照在上面，叶片泛着绿光。","📋 公告栏上贴着读书会通知，'本周六晚七点，共读《活着》'。","☕ 阅览区有人小声打电话，被管理员提醒后赶紧挂了，脸红着道歉。","🌙 闭馆音乐响起，学生们陆续起身收拾书包，有人打了个大大的哈欠。","📖 一个小女孩踮着脚够书架上的绘本，旁边的妈妈帮她拿下来，轻声读给她听。"],jobs:[],amenities:[],actions:[],actionsExtra:[{id:"self_study",name:"图书馆自习",desc:"去图书馆（商业区旁）安静看书。",icon:"📖",apCost:20,payEstimate:"技能XP+30",costEstimate:null,hint:"去大学城、培训中心或图书馆自习"},{id:"borrow_books",name:"借书自学",desc:"从图书馆借专业书籍回家学习。可以指定一门技能专精提升，效率比泛读高。",icon:"📚",apCost:15,payEstimate:"指定技能XP+40",costEstimate:null,hint:"在图书馆借书自学"},{id:"reading_club",name:"参加读书会",desc:"参加图书馆周末读书会，与人交流读书心得。兼顾社交和学习，还能认识新朋友。",icon:"👥",apCost:20,payEstimate:"社交+技能+心情",costEstimate:null,hint:"在图书馆参加读书会"}],illegal:[],buy:[],sell:[],vendingNote:"安静场所，禁止摆摊"},gym:{id:"gym",name:"体育馆",icon:"🏋️",desc:"可以健身/打球/游泳的地方。增强体质的好去处。",type:"recreation",wealthTier:2,footfall:.8,specialties:["vitamins_item","snacks"],specialtyLabels:["维生素","零食"],priceMod:{snacks:1.1,vitamins_item:1.1},priceModList:[{key:"snacks",value:1.1,label:"零食"},{key:"vitamins_item",value:1.1,label:"维生素"}],dailyProbability:.4,flavor:[],jobs:[{id:"gym_coach",name:"健身教练",icon:"💪",desc:"在体育馆做私人教练。需要好身材+专业指导能力。",startupCost:0,risk:{injury:.02},payHint:{min:30,max:70,text:`payCalc(state) {
        var base =
          70 +
          state.player.physique * 0.5 +
          (state.player.fame || 0) * 0.2 +
          Random.float(0, 30);
        return Math.floor(base);
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"运动人群多，消费力中等"},internet_cafe:{id:"internet_cafe",name:"网吧",icon:"🖥️",desc:"上网/打游戏的地方。可以接线上任务，也可以消磨时间。",type:"recreation",wealthTier:2,footfall:.7,specialties:["snacks","beer"],specialtyLabels:["零食","啤酒"],priceMod:{snacks:1,beer:1},priceModList:[{key:"snacks",value:1,label:"零食"},{key:"beer",value:1,label:"啤酒"}],dailyProbability:.5,flavor:[],jobs:[{id:"data_entry",name:"数据录入",icon:"⌨️",desc:"在网吧接线上数据录入任务，打字快就赚得多。",startupCost:0,risk:{},payHint:{min:25,max:30,text:`payCalc(state) {
        var base = 30 + state.player.intelligence * 0.5 + Random.float(0, 25);
        return Math.floor(base);
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"年轻人多，零食饮料消费旺盛"},logistics_park:{id:"logistics_park",name:"物流园区",icon:"🚚",desc:"快递/物流集散中心。工作机会多，但环境嘈杂。",type:"industrial",wealthTier:2,footfall:1,specialties:["instant_noodles","daily_use"],specialtyLabels:["方便面","日用品"],priceMod:{instant_noodles:.9,daily_use:.85},priceModList:[{key:"instant_noodles",value:.9,label:"方便面"},{key:"daily_use",value:.85,label:"日用品"}],dailyProbability:.5,flavor:[],jobs:[{id:"package_delivery",name:"快递配送",icon:"📦",desc:"在物流园接单送快递，跑得勤就赚得多。有电动车更高效。",startupCost:0,risk:{injury:.03},payHint:{min:35,max:730,text:`payCalc(state) {
        var base =
          55 +
          state.player.agility * 0.3 +
          (state.skills.driving?.level || 0) * 0.8 +
          Random.float(0, 35);
        // [全系统自洽修复] 域D R730b 修复:配送类好感奖励同样作用于快`}},{id:"warehouse_worker",name:"仓库管理员",icon:"📋",desc:"在物流园仓库做管理，货物入库出库登记。稳定但枯燥。",startupCost:0,risk:{injury:.01},payHint:{min:25,max:50,text:`payCalc(state) {
        return Math.floor(
          50 + state.player.intelligence * 0.2 + Random.float(0, 25),
        );
      }`}},{id:"logistics_sorting",name:"物流分拣",icon:"📦",desc:"在物流园流水线分拣包裹。不需要技术，体力活计件算钱。",startupCost:0,risk:{injury:.02},payHint:{min:25,max:35,text:`payCalc(state) {
        return Math.floor(
          35 + state.player.agility * 0.2 + Random.float(0, 25),
        );
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"快递员和司机是主力消费群体"},auto_city:{id:"auto_city",name:"汽车城",icon:"🚗",desc:"4S店和二手车市场聚集地。可以买车/修车/找工作。",type:"commercial",wealthTier:3,footfall:.6,specialties:["electronics","cigarettes"],specialtyLabels:["小电子产品","香烟"],priceMod:{electronics:1.1},priceModList:[{key:"electronics",value:1.1,label:"小电子产品"}],dailyProbability:.3,flavor:[],jobs:[{id:"auto_repair",name:"汽车维修",icon:"🔧",desc:"在4S店或汽修厂修车。技术活，车子越修越值钱。",startupCost:0,risk:{injury:.04},payHint:{min:50,max:70,text:`payCalc(state) {
        var base =
          70 + (state.skills.repair?.level || 0) * 2.0 + Random.float(0, 50);
        return Math.floor(base);
      }`}},{id:"car_sales",name:"汽车销售",icon:"🚗",desc:"在4S店卖车。口才好+懂车，提成高但压力大。",startupCost:0,risk:{},payHint:{min:45,max:80,text:`payCalc(state) {
        var base =
          45 +
          (state.skills.sales?.level || 0) * 2.5 +
          (state.player.fame || 0) * 0.3 +
          Random.float(0, 80);
        return Math.floor(base);
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"看车人多，但买车人少"},flower_bird_market:{id:"flower_bird_market",name:"花鸟市场",icon:"🌸",desc:"卖花/宠物/观赏鱼的地方。喜欢动植物的天堂。",type:"recreation",wealthTier:2,footfall:.5,specialties:["carnation","rose"],specialtyLabels:["康乃馨","玫瑰花"],priceMod:{},priceModList:[],dailyProbability:.3,flavor:[],jobs:[{id:"pet_sitter",name:"宠物护理",icon:"🐾",desc:"在花鸟市场帮人照看宠物，洗澡剪毛遛狗。喜欢动物的人会开心。",startupCost:0,risk:{injury:.01},payHint:{min:30,max:40,text:`payCalc(state) {
        return Math.floor(40 + state.player.mental * 0.3 + Random.float(0, 30));
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"爱好者多，消费力中等"},flea_market:{id:"flea_market",name:"二手市场",icon:"🏴",desc:"淘二手货的地方。可以低价买入高价卖出，考验眼光。",type:"commercial",wealthTier:2,footfall:.8,specialties:["clothing","electronics","second_hand_book"],specialtyLabels:["二手衣物","小电子产品","二手书"],priceMod:{clothing:.7,electronics:.75,second_hand_book:.6},priceModList:[{key:"clothing",value:.7,label:"二手衣物"},{key:"electronics",value:.75,label:"小电子产品"},{key:"second_hand_book",value:.6,label:"二手书"}],dailyProbability:.5,flavor:[],jobs:[],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"淘货人多，消费力参差不齐"},vegetable_market:{id:"vegetable_market",name:"菜市场",icon:"",desc:"买菜的地方。新鲜食材最便宜，但环境嘈杂。讨价还价的唇枪舌剑此起彼伏。",type:"commercial",wealthTier:2,footfall:1.2,specialties:["vegetables","fruits","pork","fish"],specialtyLabels:["蔬菜","水果","猪肉","鱼"],priceMod:{vegetables:.7,fruits:.75,pork:.85,fish:.8},priceModList:[{key:"vegetables",value:.7,label:"蔬菜"},{key:"fruits",value:.75,label:"水果"},{key:"pork",value:.85,label:"猪肉"},{key:"fish",value:.8,label:"鱼"}],dailyProbability:.8,flavor:[],jobs:[],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[{id:"vegetables",name:"蔬菜",unit:"斤",price:2.1,category:"food"},{id:"fruits",name:"水果",unit:"斤",price:4.5,category:"food"}],sell:[],vendingNote:"买菜人多，但消费力有限"}}};return gd(b_);})();
