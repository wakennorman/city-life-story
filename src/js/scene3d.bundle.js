/* 自动生成，请勿手工编辑。
   源：src/app/3d/  构建：node scripts/build-3d-bundle.cjs
   数据：src/app/3d/gamedata.json（由 scripts/extract-3d-data.mjs 从游戏本体生成）
   改动请改源文件后重新构建，直接编辑本文件会在下次构建时被覆盖。 */
"use strict";var Scene3D=(()=>{var kc=Object.defineProperty;var Om=Object.getOwnPropertyDescriptor;var Bm=Object.getOwnPropertyNames;var km=Object.prototype.hasOwnProperty;var zm=(i,e)=>{for(var t in e)kc(i,t,{get:e[t],enumerable:!0})},Hm=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of Bm(e))!km.call(i,s)&&s!==t&&kc(i,s,{get:()=>e[s],enumerable:!(n=Om(e,s))||n.enumerable});return i};var Gm=i=>Hm(kc({},"__esModule",{value:!0}),i);var $M={};zm($M,{KITS:()=>wM,LAYOUT_KIND:()=>Fh,LOAD_STATE:()=>es,M_PER_UNIT:()=>ym,SPECS:()=>bc,assetBase:()=>TM,awningProp:()=>mc,buildLocation:()=>Sc,chimneyProp:()=>uc,cityLamp:()=>Kp,create3DShell:()=>Rm,createAssetLoader:()=>pd,createGame3D:()=>Uc,createHUD:()=>Fc,dumpster:()=>fc,gamedata:()=>Cm,glbProp:()=>vn,listOf:()=>md,palette:()=>pi,parasolProp:()=>gc,pendingAssetCount:()=>Ha,pickFor:()=>RM,pumpAssets:()=>za,setAssetBase:()=>xm,setAssetLoader:()=>lc,shippingContainerProp:()=>Yp,siteBarrier:()=>Zp,solarPanelProp:()=>qp,tankProp:()=>cc,trafficCone:()=>dc,utilityPole:()=>pc,waterTowerProp:()=>hc});var xf=0,Tu=1,yf=2;var gs=1,_f=2,lr=3,ui=0,dn=1,Ut=2,kt=0,cr=1,ga=2,wu=3,Au=4,ll=5;var Ln=100,vf=101,Mf=102,bf=103,Sf=104,xs=200,Ef=201,Tf=202,wf=203,Ru=204,Cu=205,xa=206,Af=207,ya=208,Rf=209,Cf=210,Pf=211,If=212,Lf=213,Df=214,Co=0,Po=1,Io=2,Ws=3,Lo=4,Do=5,No=6,Uo=7,Pu=0,Nf=1,Uf=2,Xn=0,_a=1,va=2,Ma=3,ys=4,ba=5,Sa=6,Ea=7,fu="attached",Ff="detached",Iu=300,Zi=301,_s=302,ur=303,cl=304,Ta=306,Qt=1e3,sn=1001,Xs=1002,It=1003,ul=1004;var vs=1005;var Bt=1006,hr=1007;var qn=1008;var rn=1009,Lu=1010,Du=1011,dr=1012,hl=1013,Yn=1014,Tn=1015,qt=1016,dl=1017,fl=1018,$i=1020,Nu=35902,Uu=35899,Fu=1021,Ou=1022,fn=1023,ii=1026,hi=1027,pl=1028,ml=1029,ji=1030,gl=1031;var xl=1033,wa=33776,Aa=33777,Ra=33778,Ca=33779,yl=35840,_l=35841,vl=35842,Ml=35843,bl=36196,Sl=37492,El=37496,Tl=37488,wl=37489,Pa=37490,Al=37491,Rl=37808,Cl=37809,Pl=37810,Il=37811,Ll=37812,Dl=37813,Nl=37814,Ul=37815,Fl=37816,Ol=37817,Bl=37818,kl=37819,zl=37820,Hl=37821,Gl=36492,Vl=36494,Wl=36495,Xl=36283,ql=36284,Ia=36285,Yl=36286;var os=2300,ls=2301,wo=2302,pu=2303,mu=2400,gu=2401,xu=2402,Of=2500;var Bu=0,La=1,fr=2,Bf=3200;var Da=0,kf=1,Kn="",wt="srgb",un="srgb-linear",Hr="linear",ut="srgb";var Ao=7680;var zf=519,Hf=512,Gf=513,Vf=514,Kl=515,Wf=516,Xf=517,Zl=518,qf=519,ku=35044;var zu="300 es",Gn=2e3,qs=2001;function Vm(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Wm(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Ys(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Yf(){let i=Ys("canvas");return i.style.display="block",i}var Pd={},Ks=null;function Gr(...i){let e="THREE."+i.shift();Ks?Ks("log",e,...i):console.log(e,...i)}function Kf(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Fe(...i){i=Kf(i);let e="THREE."+i.shift();if(Ks)Ks("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function ze(...i){i=Kf(i);let e="THREE."+i.shift();if(Ks)Ks("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function as(...i){let e=i.join(" ");e in Pd||(Pd[e]=!0,Fe(...i))}function Zf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var $f={[Co]:Po,[Io]:No,[Lo]:Uo,[Ws]:Do,[Po]:Co,[No]:Io,[Uo]:Lo,[Do]:Ws},si=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Id=1234567,Or=Math.PI/180,cs=180/Math.PI;function Vn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[i&255]+tn[i>>8&255]+tn[i>>16&255]+tn[i>>24&255]+"-"+tn[e&255]+tn[e>>8&255]+"-"+tn[e>>16&15|64]+tn[e>>24&255]+"-"+tn[t&63|128]+tn[t>>8&255]+"-"+tn[t>>16&255]+tn[t>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function Je(i,e,t){return Math.max(e,Math.min(t,i))}function Hu(i,e){return(i%e+e)%e}function Xm(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function qm(i,e,t){return i!==e?(t-i)/(e-i):0}function Br(i,e,t){return(1-t)*i+t*e}function Ym(i,e,t,n){return Br(i,e,1-Math.exp(-t*n))}function Km(i,e=1){return e-Math.abs(Hu(i,e*2)-e)}function Zm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function $m(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function jm(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Jm(i,e){return i+Math.random()*(e-i)}function Qm(i){return i*(.5-Math.random())}function e0(i){i!==void 0&&(Id=i);let e=Id+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function t0(i){return i*Or}function n0(i){return i*cs}function i0(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function s0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function r0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function a0(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),p=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*p,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*p,o*c);break;case"ZYZ":i.set(l*p,l*f,o*h,o*c);break;default:Fe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Hn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function gt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Gu={DEG2RAD:Or,RAD2DEG:cs,generateUUID:Vn,clamp:Je,euclideanModulo:Hu,mapLinear:Xm,inverseLerp:qm,lerp:Br,damp:Ym,pingpong:Km,smoothstep:Zm,smootherstep:$m,randInt:jm,randFloat:Jm,randFloatSpread:Qm,seededRandom:e0,degToRad:t0,radToDeg:n0,isPowerOfTwo:i0,ceilPowerOfTwo:s0,floorPowerOfTwo:r0,setQuaternionFromProperEuler:a0,normalize:gt,denormalize:Hn},Ku=class Ku{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ku.prototype.isVector2=!0;var xe=Ku,Sn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],f=r[a+1],p=r[a+2],x=r[a+3];if(u!==x||l!==d||c!==f||h!==p){let g=l*d+c*f+h*p+u*x;g<0&&(d=-d,f=-f,p=-p,x=-x,g=-g);let m=1-o;if(g<.9995){let v=Math.acos(g),E=Math.sin(v);m=Math.sin(m*v)/E,o=Math.sin(o*v)/E,l=l*m+d*o,c=c*m+f*o,h=h*m+p*o,u=u*m+x*o}else{l=l*m+d*o,c=c*m+f*o,h=h*m+p*o,u=u*m+x*o;let v=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=v,c*=v,h*=v,u*=v}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],p=r[a+3];return e[t]=o*p+h*u+l*f-c*d,e[t+1]=l*p+h*d+c*u-o*f,e[t+2]=c*p+h*f+o*d-l*u,e[t+3]=h*p-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),f=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:Fe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Je(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Zu=class Zu{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ld.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ld.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return zc.copy(this).projectOnVector(e),this.sub(zc)}reflect(e){return this.sub(zc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Zu.prototype.isVector3=!0;var P=Zu,zc=new P,Ld=new Sn,$u=class $u{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],x=s[0],g=s[3],m=s[6],v=s[1],E=s[4],y=s[7],S=s[2],M=s[5],A=s[8];return r[0]=a*x+o*v+l*S,r[3]=a*g+o*E+l*M,r[6]=a*m+o*y+l*A,r[1]=c*x+h*v+u*S,r[4]=c*g+h*E+u*M,r[7]=c*m+h*y+u*A,r[2]=d*x+f*v+p*S,r[5]=d*g+f*E+p*M,r[8]=d*m+f*y+p*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,p=t*u+n*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/p;return e[0]=u*x,e[1]=(s*c-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=d*x,e[4]=(h*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=f*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return as("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Hc.makeScale(e,t)),this}rotate(e){return as("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Hc.makeRotation(-e)),this}translate(e,t){return as("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Hc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};$u.prototype.isMatrix3=!0;var Ge=$u,Hc=new Ge,Dd=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Nd=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function o0(){let i={enabled:!0,workingColorSpace:un,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ut&&(s.r=Ei(s.r),s.g=Ei(s.g),s.b=Ei(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ut&&(s.r=Vs(s.r),s.g=Vs(s.g),s.b=Vs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Kn?Hr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return as("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return as("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[un]:{primaries:e,whitePoint:n,transfer:Hr,toXYZ:Dd,fromXYZ:Nd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:wt},outputColorSpaceConfig:{drawingBufferColorSpace:wt}},[wt]:{primaries:e,whitePoint:n,transfer:ut,toXYZ:Dd,fromXYZ:Nd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:wt}}}),i}var Ke=o0();function Ei(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Vs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Cs,Fo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Cs===void 0&&(Cs=Ys("canvas")),Cs.width=e.width,Cs.height=e.height;let s=Cs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Cs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ys("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ei(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ei(t[n]/255)*255):t[n]=Ei(t[n]);return{data:t,width:e.width,height:e.height}}else return Fe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},l0=0,Zs=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:l0++}),this.uuid=Vn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Gc(s[a].image)):r.push(Gc(s[a]))}else r=Gc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Gc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Fo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Fe("Texture: Unable to serialize Texture."),{})}var c0=0,Vc=new P,Yt=class i extends si{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=sn,s=sn,r=Bt,a=qn,o=fn,l=rn,c=i.DEFAULT_ANISOTROPY,h=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:c0++}),this.uuid=Vn(),this.name="",this.source=new Zs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new xe(0,0),this.repeat=new xe(1,1),this.center=new xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Vc).x}get height(){return this.source.getSize(Vc).y}get depth(){return this.source.getSize(Vc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Fe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Fe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Iu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qt:e.x=e.x-Math.floor(e.x);break;case sn:e.x=e.x<0?0:1;break;case Xs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qt:e.y=e.y-Math.floor(e.y);break;case sn:e.y=e.y<0?0:1;break;case Xs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Yt.DEFAULT_IMAGE=null;Yt.DEFAULT_MAPPING=Iu;Yt.DEFAULT_ANISOTROPY=1;var ju=class ju{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],x=l[2],g=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let E=(c+1)/2,y=(f+1)/2,S=(m+1)/2,M=(h+d)/4,A=(u+x)/4,_=(p+g)/4;return E>y&&E>S?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=M/n,r=A/n):y>S?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=M/s,r=_/s):S<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),n=A/r,s=_/r),this.set(n,s,r,t),this}let v=Math.sqrt((g-p)*(g-p)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(g-p)/v,this.y=(u-x)/v,this.z=(d-h)/v,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this.w=Je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this.w=Je(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ju.prototype.isVector4=!0;var xt=ju,Oo=class extends si{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new Yt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Bt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Zs(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Nt=class extends Oo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Vr=class extends Yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Bo=class extends Yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var ol=class ol{constructor(e,t,n,s,r,a,o,l,c,h,u,d,f,p,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,d,f,p,x,g)}set(e,t,n,s,r,a,o,l,c,h,u,d,f,p,x,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=p,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ol().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/Ps.setFromMatrixColumn(e,0).length(),r=1/Ps.setFromMatrixColumn(e,1).length(),a=1/Ps.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,f=a*u,p=o*h,x=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+p*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=p+f*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,p=c*h,x=c*u;t[0]=d+x*o,t[4]=p*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-p,t[6]=x+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,p=c*h,x=c*u;t[0]=d-x*o,t[4]=-a*u,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*h,t[9]=x-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,f=a*u,p=o*h,x=o*u;t[0]=l*h,t[4]=p*c-f,t[8]=d*c+x,t[1]=l*u,t[5]=x*c+d,t[9]=f*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,f=a*c,p=o*l,x=o*c;t[0]=l*h,t[4]=x-d*u,t[8]=p*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+p,t[10]=d-x*u}else if(e.order==="XZY"){let d=a*l,f=a*c,p=o*l,x=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+x,t[5]=a*h,t[9]=f*u-p,t[2]=p*u-f,t[6]=o*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(u0,e,h0)}lookAt(e,t,n){let s=this.elements;return Mn.subVectors(e,t),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),zi.crossVectors(n,Mn),zi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),zi.crossVectors(n,Mn)),zi.normalize(),eo.crossVectors(Mn,zi),s[0]=zi.x,s[4]=eo.x,s[8]=Mn.x,s[1]=zi.y,s[5]=eo.y,s[9]=Mn.y,s[2]=zi.z,s[6]=eo.z,s[10]=Mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],x=n[6],g=n[10],m=n[14],v=n[3],E=n[7],y=n[11],S=n[15],M=s[0],A=s[4],_=s[8],w=s[12],R=s[1],L=s[5],D=s[9],k=s[13],N=s[2],H=s[6],j=s[10],$=s[14],se=s[3],X=s[7],ne=s[11],ie=s[15];return r[0]=a*M+o*R+l*N+c*se,r[4]=a*A+o*L+l*H+c*X,r[8]=a*_+o*D+l*j+c*ne,r[12]=a*w+o*k+l*$+c*ie,r[1]=h*M+u*R+d*N+f*se,r[5]=h*A+u*L+d*H+f*X,r[9]=h*_+u*D+d*j+f*ne,r[13]=h*w+u*k+d*$+f*ie,r[2]=p*M+x*R+g*N+m*se,r[6]=p*A+x*L+g*H+m*X,r[10]=p*_+x*D+g*j+m*ne,r[14]=p*w+x*k+g*$+m*ie,r[3]=v*M+E*R+y*N+S*se,r[7]=v*A+E*L+y*H+S*X,r[11]=v*_+E*D+y*j+S*ne,r[15]=v*w+E*k+y*$+S*ie,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],x=e[7],g=e[11],m=e[15],v=l*f-c*d,E=o*f-c*u,y=o*d-l*u,S=a*f-c*h,M=a*d-l*h,A=a*u-o*h;return t*(x*v-g*E+m*y)-n*(p*v-g*S+m*M)+s*(p*E-x*S+m*A)-r*(p*y-x*M+g*A)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],x=e[13],g=e[14],m=e[15],v=t*o-n*a,E=t*l-s*a,y=t*c-r*a,S=n*l-s*o,M=n*c-r*o,A=s*c-r*l,_=h*x-u*p,w=h*g-d*p,R=h*m-f*p,L=u*g-d*x,D=u*m-f*x,k=d*m-f*g,N=v*k-E*D+y*L+S*R-M*w+A*_;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/N;return e[0]=(o*k-l*D+c*L)*H,e[1]=(s*D-n*k-r*L)*H,e[2]=(x*A-g*M+m*S)*H,e[3]=(d*M-u*A-f*S)*H,e[4]=(l*R-a*k-c*w)*H,e[5]=(t*k-s*R+r*w)*H,e[6]=(g*y-p*A-m*E)*H,e[7]=(h*A-d*y+f*E)*H,e[8]=(a*D-o*R+c*_)*H,e[9]=(n*R-t*D-r*_)*H,e[10]=(p*M-x*y+m*v)*H,e[11]=(u*y-h*M-f*v)*H,e[12]=(o*w-a*L-l*_)*H,e[13]=(t*L-n*w+s*_)*H,e[14]=(x*E-p*S-g*v)*H,e[15]=(h*S-u*E+d*v)*H,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,p=r*u,x=a*h,g=a*u,m=o*u,v=l*c,E=l*h,y=l*u,S=n.x,M=n.y,A=n.z;return s[0]=(1-(x+m))*S,s[1]=(f+y)*S,s[2]=(p-E)*S,s[3]=0,s[4]=(f-y)*M,s[5]=(1-(d+m))*M,s[6]=(g+v)*M,s[7]=0,s[8]=(p+E)*A,s[9]=(g-v)*A,s[10]=(1-(d+x))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Ps.set(s[0],s[1],s[2]).length(),o=Ps.set(s[4],s[5],s[6]).length(),l=Ps.set(s[8],s[9],s[10]).length();r<0&&(a=-a),On.copy(this);let c=1/a,h=1/o,u=1/l;return On.elements[0]*=c,On.elements[1]*=c,On.elements[2]*=c,On.elements[4]*=h,On.elements[5]*=h,On.elements[6]*=h,On.elements[8]*=u,On.elements[9]*=u,On.elements[10]*=u,t.setFromRotationMatrix(On),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Gn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),p,x;if(l)p=r/(a-r),x=a*r/(a-r);else if(o===Gn)p=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===qs)p=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Gn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),p,x;if(l)p=1/(a-r),x=a/(a-r);else if(o===Gn)p=-2/(a-r),x=-(a+r)/(a-r);else if(o===qs)p=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};ol.prototype.isMatrix4=!0;var ke=ol,Ps=new P,On=new ke,u0=new P(0,0,0),h0=new P(1,1,1),zi=new P,eo=new P,Mn=new P,Ud=new ke,Fd=new Sn,Ti=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Fe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ud.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ud,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Fd.setFromEuler(this),this.setFromQuaternion(Fd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ti.DEFAULT_ORDER="XYZ";var Wr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},d0=0,Od=new P,Is=new Sn,yi=new ke,to=new P,Cr=new P,f0=new P,p0=new Sn,Bd=new P(1,0,0),kd=new P(0,1,0),zd=new P(0,0,1),Hd={type:"added"},m0={type:"removed"},Ls={type:"childadded",child:null},Wc={type:"childremoved",child:null},Lt=class i extends si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:d0++}),this.uuid=Vn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new Ti,n=new Sn,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ke},normalMatrix:{value:new Ge}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.multiply(Is),this}rotateOnWorldAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.premultiply(Is),this}rotateX(e){return this.rotateOnAxis(Bd,e)}rotateY(e){return this.rotateOnAxis(kd,e)}rotateZ(e){return this.rotateOnAxis(zd,e)}translateOnAxis(e,t){return Od.copy(e).applyQuaternion(this.quaternion),this.position.add(Od.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Bd,e)}translateY(e){return this.translateOnAxis(kd,e)}translateZ(e){return this.translateOnAxis(zd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?to.copy(e):to.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Cr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yi.lookAt(Cr,to,this.up):yi.lookAt(to,Cr,this.up),this.quaternion.setFromRotationMatrix(yi),s&&(yi.extractRotation(s.matrixWorld),Is.setFromRotationMatrix(yi),this.quaternion.premultiply(Is.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ze("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Hd),Ls.child=e,this.dispatchEvent(Ls),Ls.child=null):ze("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(m0),Wc.child=e,this.dispatchEvent(Wc),Wc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yi.multiply(e.parent.matrixWorld)),e.applyMatrix4(yi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Hd),Ls.child=e,this.dispatchEvent(Ls),Ls.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cr,e,f0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cr,p0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Lt.DEFAULT_UP=new P(0,1,0);Lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Be=class extends Lt{constructor(){super(),this.isGroup=!0,this.type="Group"}},g0={type:"move"},$s=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Be,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Be,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Be,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),m=this._getHandJoint(c,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(g0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Be;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},jf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hi={h:0,s:0,l:0},no={h:0,s:0,l:0};function Xc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Re=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=wt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ke.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ke.workingColorSpace){if(e=Hu(e,1),t=Je(t,0,1),n=Je(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Xc(a,r,e+1/3),this.g=Xc(a,r,e),this.b=Xc(a,r,e-1/3)}return Ke.colorSpaceToWorking(this,s),this}setStyle(e,t=wt){function n(r){r!==void 0&&parseFloat(r)<1&&Fe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Fe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Fe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=wt){let n=jf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Fe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ei(e.r),this.g=Ei(e.g),this.b=Ei(e.b),this}copyLinearToSRGB(e){return this.r=Vs(e.r),this.g=Vs(e.g),this.b=Vs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=wt){return Ke.workingToColorSpace(nn.copy(this),e),Math.round(Je(nn.r*255,0,255))*65536+Math.round(Je(nn.g*255,0,255))*256+Math.round(Je(nn.b*255,0,255))}getHexString(e=wt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.workingToColorSpace(nn.copy(this),t);let n=nn.r,s=nn.g,r=nn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ke.workingColorSpace){return Ke.workingToColorSpace(nn.copy(this),t),e.r=nn.r,e.g=nn.g,e.b=nn.b,e}getStyle(e=wt){Ke.workingToColorSpace(nn.copy(this),e);let t=nn.r,n=nn.g,s=nn.b;return e!==wt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Hi),this.setHSL(Hi.h+e,Hi.s+t,Hi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Hi),e.getHSL(no);let n=Br(Hi.h,no.h,t),s=Br(Hi.s,no.s,t),r=Br(Hi.l,no.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},nn=new Re;Re.NAMES=jf;var Xr=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Re(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var qr=class extends Lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ti,this.environmentIntensity=1,this.environmentRotation=new Ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Bn=new P,_i=new P,qc=new P,vi=new P,Ds=new P,Ns=new P,Gd=new P,Yc=new P,Kc=new P,Zc=new P,$c=new xt,jc=new xt,Jc=new xt,qi=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Bn.subVectors(e,t),s.cross(Bn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Bn.subVectors(s,t),_i.subVectors(n,t),qc.subVectors(e,t);let a=Bn.dot(Bn),o=Bn.dot(_i),l=Bn.dot(qc),c=_i.dot(_i),h=_i.dot(qc),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,p=(a*h-o*l)*d;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,vi)===null?!1:vi.x>=0&&vi.y>=0&&vi.x+vi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,vi.x),l.addScaledVector(a,vi.y),l.addScaledVector(o,vi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return $c.setScalar(0),jc.setScalar(0),Jc.setScalar(0),$c.fromBufferAttribute(e,t),jc.fromBufferAttribute(e,n),Jc.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector($c,r.x),a.addScaledVector(jc,r.y),a.addScaledVector(Jc,r.z),a}static isFrontFacing(e,t,n,s){return Bn.subVectors(n,t),_i.subVectors(e,t),Bn.cross(_i).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Bn.subVectors(this.c,this.b),_i.subVectors(this.a,this.b),Bn.cross(_i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Ds.subVectors(s,n),Ns.subVectors(r,n),Yc.subVectors(e,n);let l=Ds.dot(Yc),c=Ns.dot(Yc);if(l<=0&&c<=0)return t.copy(n);Kc.subVectors(e,s);let h=Ds.dot(Kc),u=Ns.dot(Kc);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Ds,a);Zc.subVectors(e,r);let f=Ds.dot(Zc),p=Ns.dot(Zc);if(p>=0&&f<=p)return t.copy(r);let x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Ns,o);let g=h*p-f*u;if(g<=0&&u-h>=0&&f-p>=0)return Gd.subVectors(r,s),o=(u-h)/(u-h+(f-p)),t.copy(s).addScaledVector(Gd,o);let m=1/(g+x+d);return a=x*m,o=d*m,t.copy(n).addScaledVector(Ds,a).addScaledVector(Ns,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},En=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(kn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(kn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=kn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,kn):kn.fromBufferAttribute(r,a),kn.applyMatrix4(e.matrixWorld),this.expandByPoint(kn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),io.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),io.copy(n.boundingBox)),io.applyMatrix4(e.matrixWorld),this.union(io)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,kn),kn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Pr),so.subVectors(this.max,Pr),Us.subVectors(e.a,Pr),Fs.subVectors(e.b,Pr),Os.subVectors(e.c,Pr),Gi.subVectors(Fs,Us),Vi.subVectors(Os,Fs),ns.subVectors(Us,Os);let t=[0,-Gi.z,Gi.y,0,-Vi.z,Vi.y,0,-ns.z,ns.y,Gi.z,0,-Gi.x,Vi.z,0,-Vi.x,ns.z,0,-ns.x,-Gi.y,Gi.x,0,-Vi.y,Vi.x,0,-ns.y,ns.x,0];return!Qc(t,Us,Fs,Os,so)||(t=[1,0,0,0,1,0,0,0,1],!Qc(t,Us,Fs,Os,so))?!1:(ro.crossVectors(Gi,Vi),t=[ro.x,ro.y,ro.z],Qc(t,Us,Fs,Os,so))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Mi=[new P,new P,new P,new P,new P,new P,new P,new P],kn=new P,io=new En,Us=new P,Fs=new P,Os=new P,Gi=new P,Vi=new P,ns=new P,Pr=new P,so=new P,ro=new P,is=new P;function Qc(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){is.fromArray(i,r);let o=s.x*Math.abs(is.x)+s.y*Math.abs(is.y)+s.z*Math.abs(is.z),l=e.dot(is),c=t.dot(is),h=n.dot(is);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Vt=new P,ao=new xe,x0=0,Xt=class extends si{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:x0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ku,this.updateRanges=[],this.gpuType=Tn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ao.fromBufferAttribute(this,t),ao.applyMatrix3(e),this.setXY(t,ao.x,ao.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix3(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix4(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyNormalMatrix(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.transformDirection(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Hn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=gt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Hn(t,this.array)),t}setX(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Hn(t,this.array)),t}setY(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Hn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Hn(t,this.array)),t}setW(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array),s=gt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array),s=gt(s,this.array),r=gt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Yr=class extends Xt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Kr=class extends Xt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ct=class extends Xt{constructor(e,t,n){super(new Float32Array(e),t,n)}},y0=new En,Ir=new P,eu=new P,gn=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):y0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ir.subVectors(e,this.center);let t=Ir.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ir,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(eu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ir.copy(e.center).add(eu)),this.expandByPoint(Ir.copy(e.center).sub(eu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},_0=0,Cn=new ke,tu=new Lt,Bs=new P,bn=new En,Lr=new En,jt=new P,Dt=class i extends si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_0++}),this.uuid=Vn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Vm(e)?Kr:Yr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ge().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Cn.makeRotationFromQuaternion(e),this.applyMatrix4(Cn),this}rotateX(e){return Cn.makeRotationX(e),this.applyMatrix4(Cn),this}rotateY(e){return Cn.makeRotationY(e),this.applyMatrix4(Cn),this}rotateZ(e){return Cn.makeRotationZ(e),this.applyMatrix4(Cn),this}translate(e,t,n){return Cn.makeTranslation(e,t,n),this.applyMatrix4(Cn),this}scale(e,t,n){return Cn.makeScale(e,t,n),this.applyMatrix4(Cn),this}lookAt(e){return tu.lookAt(e),tu.updateMatrix(),this.applyMatrix4(tu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bs).negate(),this.translate(Bs.x,Bs.y,Bs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ct(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Fe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new En);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];bn.setFromBufferAttribute(r),this.morphTargetsRelative?(jt.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(jt),jt.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(jt)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ze('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(bn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Lr.setFromBufferAttribute(o),this.morphTargetsRelative?(jt.addVectors(bn.min,Lr.min),bn.expandByPoint(jt),jt.addVectors(bn.max,Lr.max),bn.expandByPoint(jt)):(bn.expandByPoint(Lr.min),bn.expandByPoint(Lr.max))}bn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)jt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(jt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)jt.fromBufferAttribute(o,c),l&&(Bs.fromBufferAttribute(e,c),jt.add(Bs)),s=Math.max(s,n.distanceToSquared(jt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ze('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ze("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Xt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new P,l[_]=new P;let c=new P,h=new P,u=new P,d=new xe,f=new xe,p=new xe,x=new P,g=new P;function m(_,w,R){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,R),d.fromBufferAttribute(r,_),f.fromBufferAttribute(r,w),p.fromBufferAttribute(r,R),h.sub(c),u.sub(c),f.sub(d),p.sub(d);let L=1/(f.x*p.y-p.x*f.y);isFinite(L)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(L),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(L),o[_].add(x),o[w].add(x),o[R].add(x),l[_].add(g),l[w].add(g),l[R].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let _=0,w=v.length;_<w;++_){let R=v[_],L=R.start,D=R.count;for(let k=L,N=L+D;k<N;k+=3)m(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let E=new P,y=new P,S=new P,M=new P;function A(_){S.fromBufferAttribute(s,_),M.copy(S);let w=o[_];E.copy(w),E.sub(S.multiplyScalar(S.dot(w))).normalize(),y.crossVectors(M,w);let L=y.dot(l[_])<0?-1:1;a.setXYZW(_,E.x,E.y,E.z,L)}for(let _=0,w=v.length;_<w;++_){let R=v[_],L=R.start,D=R.count;for(let k=L,N=L+D;k<N;k+=3)A(e.getX(k+0)),A(e.getX(k+1)),A(e.getX(k+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Xt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,h=new P,u=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),x=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jt.fromBufferAttribute(e,t),jt.normalize(),e.setXYZ(t,jt.x,jt.y,jt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,p=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let m=0;m<h;m++)d[p++]=c[f++]}return new Xt(d,h,u)}if(this.index===null)return Fe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},js=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ku,this.updateRanges=[],this.version=0,this.uuid=Vn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},cn=new P,Js=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.applyMatrix4(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.applyNormalMatrix(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.transformDirection(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Hn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=gt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=gt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=gt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=gt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=gt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Hn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Hn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Hn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Hn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array),s=gt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array),s=gt(s,this.array),r=gt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Gr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Xt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Gr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},nu=new P,v0=new P,M0=new Ge,zn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=nu.subVectors(n,t).cross(v0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(nu),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||M0.getNormalMatrix(e),s=this.coplanarPoint(nu).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},b0=0,hn=class extends si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:b0++}),this.uuid=Vn(),this.name="",this.type="Material",this.blending=cr,this.side=ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ru,this.blendDst=Cu,this.blendEquation=Ln,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Re(0,0,0),this.blendAlpha=0,this.depthFunc=Ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=zf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ao,this.stencilZFail=Ao,this.stencilZPass=Ao,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Fe(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Fe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Re().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new zn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new xe().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new xe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var bi=new P,iu=new P,oo=new P,lo=new P,us=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,bi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=bi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(bi.copy(this.origin).addScaledVector(this.direction,t),bi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){iu.copy(e).add(t).multiplyScalar(.5),oo.copy(t).sub(e).normalize(),lo.copy(this.origin).sub(iu);let r=e.distanceTo(t)*.5,a=-this.direction.dot(oo),o=lo.dot(this.direction),l=-lo.dot(oo),c=lo.lengthSq(),h=Math.abs(1-a*a),u,d,f,p;if(h>0)if(u=a*l-o,d=a*o-l,p=r*h,u>=0)if(d>=-p)if(d<=p){let x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(iu).addScaledVector(oo,d),f}intersectSphere(e,t){if(e.radius<0)return null;bi.subVectors(e.center,this.origin);let n=bi.dot(this.direction),s=bi.dot(bi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,bi)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,x=t.y-a.y,g=t.z-a.z,m=n.x-a.x,v=n.y-a.y,E=n.z-a.z,y=Math.abs(l),S=Math.abs(c),M=Math.abs(h),A,_,w,R,L,D,k,N,H,j,$,se;if(y>=S&&y>=M?(w=l,D=u,H=p,se=m,l>=0?(A=c,_=h,R=d,L=f,k=x,N=g,j=v,$=E):(A=h,_=c,R=f,L=d,k=g,N=x,j=E,$=v)):S>=M?(w=c,D=d,H=x,se=v,c>=0?(A=h,_=l,R=f,L=u,k=g,N=p,j=E,$=m):(A=l,_=h,R=u,L=f,k=p,N=g,j=m,$=E)):(w=h,D=f,H=g,se=E,h>=0?(A=l,_=c,R=u,L=d,k=p,N=x,j=m,$=v):(A=c,_=l,R=d,L=u,k=x,N=p,j=v,$=m)),w===0)return null;let X=A/w,ne=_/w,ie=1/w,Ce=R-X*D,Pe=L-ne*D,rt=k-X*H,Ye=N-ne*H,Qe=j-X*se,Z=$-ne*se,ee=Qe*Ye-Z*rt,_e=Ce*Z-Pe*Qe,Oe=rt*Pe-Ye*Ce;if(s){if(ee<0||_e<0||Oe<0)return null}else if((ee<0||_e<0||Oe<0)&&(ee>0||_e>0||Oe>0))return null;let be=ee+_e+Oe;if(be===0)return null;let He=ie*(ee*D+_e*H+Oe*se);return(be>0?He<0:He>0)?null:this.at(He/be,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Kt=class extends hn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Re(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.combine=Pu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Vd=new ke,ss=new us,co=new gn,Wd=new P,uo=new P,ho=new P,fo=new P,su=new P,po=new P,Xd=new P,mo=new P,U=class extends Lt{constructor(e=new Dt,t=new Kt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){po.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(su.fromBufferAttribute(u,e),a?po.addScaledVector(su,h):po.addScaledVector(su.sub(t),h))}t.add(po)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),co.copy(n.boundingSphere),co.applyMatrix4(r),ss.copy(e.ray).recast(e.near),!(co.containsPoint(ss.origin)===!1&&(ss.intersectSphere(co,Wd)===null||ss.origin.distanceToSquared(Wd)>(e.far-e.near)**2))&&(Vd.copy(r).invert(),ss.copy(e.ray).applyMatrix4(Vd),!(n.boundingBox!==null&&ss.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ss)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,x=d.length;p<x;p++){let g=d[p],m=a[g.materialIndex],v=Math.max(g.start,f.start),E=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let y=v,S=E;y<S;y+=3){let M=o.getX(y),A=o.getX(y+1),_=o.getX(y+2);s=go(this,m,e,n,c,h,u,M,A,_),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){let v=o.getX(g),E=o.getX(g+1),y=o.getX(g+2);s=go(this,a,e,n,c,h,u,v,E,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,x=d.length;p<x;p++){let g=d[p],m=a[g.materialIndex],v=Math.max(g.start,f.start),E=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let y=v,S=E;y<S;y+=3){let M=y,A=y+1,_=y+2;s=go(this,m,e,n,c,h,u,M,A,_),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){let v=g,E=g+1,y=g+2;s=go(this,a,e,n,c,h,u,v,E,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function S0(i,e,t,n,s,r,a,o){let l;if(e.side===dn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===ui,o),l===null)return null;mo.copy(o),mo.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(mo);return c<t.near||c>t.far?null:{distance:c,point:mo.clone(),object:i}}function go(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,uo),i.getVertexPosition(l,ho),i.getVertexPosition(c,fo);let h=S0(i,e,t,n,uo,ho,fo,Xd);if(h){let u=new P;qi.getBarycoord(Xd,uo,ho,fo,u),s&&(h.uv=qi.getInterpolatedAttribute(s,o,l,c,u,new xe)),r&&(h.uv1=qi.getInterpolatedAttribute(r,o,l,c,u,new xe)),a&&(h.normal=qi.getInterpolatedAttribute(a,o,l,c,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new P,materialIndex:0};qi.getNormal(uo,ho,fo,d.normal),h.face=d,h.barycoord=u}return h}var Dr=new xt,qd=new xt,Yd=new xt,E0=new xt,Kd=new ke,xo=new P,ru=new gn,Zd=new ke,au=new us,Zr=class extends U{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=fu,this.bindMatrix=new ke,this.bindMatrixInverse=new ke,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new En),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,xo),this.boundingBox.expandByPoint(xo)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new gn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,xo),this.boundingSphere.expandByPoint(xo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ru.copy(this.boundingSphere),ru.applyMatrix4(s),e.ray.intersectsSphere(ru)!==!1&&(Zd.copy(s).invert(),au.copy(e.ray).applyMatrix4(Zd),!(this.boundingBox!==null&&au.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,au)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new xt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===fu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ff?this.bindMatrixInverse.copy(this.bindMatrix).invert():Fe("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;qd.fromBufferAttribute(s.attributes.skinIndex,e),Yd.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Dr.copy(t),t.set(0,0,0,0)):(Dr.set(...t,1),t.set(0,0,0)),Dr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let a=Yd.getComponent(r);if(a!==0){let o=qd.getComponent(r);Kd.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(E0.copy(Dr).applyMatrix4(Kd),a)}}return t.isVector4&&(t.w=Dr.w),t.applyMatrix4(this.bindMatrixInverse)}},Qs=class extends Lt{constructor(){super(),this.isBone=!0,this.type="Bone"}},ri=class extends Yt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=It,h=It,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},$d=new ke,T0=new ke,$r=class i{constructor(e=[],t=[]){this.uuid=Vn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Fe("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new ke)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new ke;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:T0;$d.multiplyMatrices(o,t[r]),$d.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new ri(t,e,e,fn,Tn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],a=t[r];a===void 0&&(Fe("Skeleton: No bone found with UUID:",r),a=new Qs),this.bones.push(a),this.boneInverses.push(new ke().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let a=t[s];e.bones.push(a.uuid);let o=n[s];e.boneInverses.push(o.toArray())}return e}},wi=class extends Xt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ks=new ke,jd=new ke,yo=[],Jd=new En,w0=new ke,Nr=new U,Ur=new gn,jr=class extends U{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new wi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,w0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new En),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ks),Jd.copy(e.boundingBox).applyMatrix4(ks),this.boundingBox.union(Jd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new gn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ks),Ur.copy(e.boundingSphere).applyMatrix4(ks),this.boundingSphere.union(Ur)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Nr.geometry=this.geometry,Nr.material=this.material,Nr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ur.copy(this.boundingSphere),Ur.applyMatrix4(n),e.ray.intersectsSphere(Ur)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ks),jd.multiplyMatrices(n,ks),Nr.matrixWorld=jd,Nr.raycast(e,yo);for(let a=0,o=yo.length;a<o;a++){let l=yo[a];l.instanceId=r,l.object=this,t.push(l)}yo.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new wi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ri(new Float32Array(s*this.count),s,this.count,pl,Tn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},rs=new gn,A0=new xe(.5,.5),_o=new P,er=class{constructor(e=new zn,t=new zn,n=new zn,s=new zn,r=new zn,a=new zn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Gn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],x=r[9],g=r[10],m=r[11],v=r[12],E=r[13],y=r[14],S=r[15];if(s[0].setComponents(c-a,f-h,m-p,S-v).normalize(),s[1].setComponents(c+a,f+h,m+p,S+v).normalize(),s[2].setComponents(c+o,f+u,m+x,S+E).normalize(),s[3].setComponents(c-o,f-u,m-x,S-E).normalize(),n)s[4].setComponents(l,d,g,y).normalize(),s[5].setComponents(c-l,f-d,m-g,S-y).normalize();else if(s[4].setComponents(c-l,f-d,m-g,S-y).normalize(),t===Gn)s[5].setComponents(c+l,f+d,m+g,S+y).normalize();else if(t===qs)s[5].setComponents(l,d,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),rs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),rs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(rs)}intersectsSprite(e){rs.center.set(0,0,0);let t=A0.distanceTo(e.center);return rs.radius=.7071067811865476+t,rs.applyMatrix4(e.matrixWorld),this.intersectsSphere(rs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(_o.x=s.normal.x>0?e.max.x:e.min.x,_o.y=s.normal.y>0?e.max.y:e.min.y,_o.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(_o)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var tr=class extends hn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Re(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ko=new P,zo=new P,Qd=new ke,Fr=new us,vo=new gn,ou=new P,ef=new P,hs=class extends Lt{constructor(e=new Dt,t=new tr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)ko.fromBufferAttribute(t,s-1),zo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=ko.distanceTo(zo);e.setAttribute("lineDistance",new ct(n,1))}else Fe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),vo.copy(n.boundingSphere),vo.applyMatrix4(s),vo.radius+=r,e.ray.intersectsSphere(vo)===!1)return;Qd.copy(s).invert(),Fr.copy(e.ray).applyMatrix4(Qd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let x=f,g=p-1;x<g;x+=c){let m=h.getX(x),v=h.getX(x+1),E=Mo(this,e,Fr,l,m,v,x);E&&t.push(E)}if(this.isLineLoop){let x=h.getX(p-1),g=h.getX(f),m=Mo(this,e,Fr,l,x,g,p-1);m&&t.push(m)}}else{let f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let x=f,g=p-1;x<g;x+=c){let m=Mo(this,e,Fr,l,x,x+1,x);m&&t.push(m)}if(this.isLineLoop){let x=Mo(this,e,Fr,l,p-1,f,p-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Mo(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(ko.fromBufferAttribute(o,s),zo.fromBufferAttribute(o,r),t.distanceSqToSegment(ko,zo,ou,ef)>n)return;ou.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(ou);if(!(c<e.near||c>e.far))return{distance:c,point:ef.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var tf=new P,nf=new P,Jr=class extends hs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)tf.fromBufferAttribute(t,s),nf.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+tf.distanceTo(nf);e.setAttribute("lineDistance",new ct(n,1))}else Fe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Qr=class extends hs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},nr=class extends hn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Re(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},sf=new ke,yu=new us,bo=new gn,So=new P,ea=class extends Lt{constructor(e=new Dt,t=new nr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),bo.copy(n.boundingSphere),bo.applyMatrix4(s),bo.radius+=r,e.ray.intersectsSphere(bo)===!1)return;sf.copy(s).invert(),yu.copy(e.ray).applyMatrix4(sf);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=d,x=f;p<x;p++){let g=c.getX(p);So.fromBufferAttribute(u,g),rf(So,g,l,s,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let p=d,x=f;p<x;p++)So.fromBufferAttribute(u,p),rf(So,p,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function rf(i,e,t,n,s,r,a){let o=yu.distanceSqToPoint(i);if(o<t){let l=new P;yu.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var ta=class extends Yt{constructor(e=[],t=Zi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Pn=class extends Yt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var ai=class extends Yt{constructor(e,t,n=Yn,s,r,a,o=It,l=It,c,h=ii,u=1){if(h!==ii&&h!==hi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Zs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ho=class extends ai{constructor(e,t=Yn,n=Zi,s,r,a=It,o=It,l,c=ii){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},na=class extends Yt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},oe=class i extends Dt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,f=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,s,a,2),p("x","z","y",1,-1,e,n,-t,s,a,3),p("x","y","z",1,-1,e,t,n,s,r,4),p("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ct(c,3)),this.setAttribute("normal",new ct(h,3)),this.setAttribute("uv",new ct(u,2));function p(x,g,m,v,E,y,S,M,A,_,w){let R=y/A,L=S/_,D=y/2,k=S/2,N=M/2,H=A+1,j=_+1,$=0,se=0,X=new P;for(let ne=0;ne<j;ne++){let ie=ne*L-k;for(let Ce=0;Ce<H;Ce++){let Pe=Ce*R-D;X[x]=Pe*v,X[g]=ie*E,X[m]=N,c.push(X.x,X.y,X.z),X[x]=0,X[g]=0,X[m]=M>0?1:-1,h.push(X.x,X.y,X.z),u.push(Ce/A),u.push(1-ne/_),$+=1}}for(let ne=0;ne<_;ne++)for(let ie=0;ie<A;ie++){let Ce=d+ie+H*ne,Pe=d+ie+H*(ne+1),rt=d+(ie+1)+H*(ne+1),Ye=d+(ie+1)+H*ne;l.push(Ce,Pe,Ye),l.push(Pe,rt,Ye),se+=6}o.addGroup(f,se,w),f+=se,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},ds=class i extends Dt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let a=[],o=[],l=[],c=[],h=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+r,x=s+1,g=new P,m=new P;for(let v=0;v<=p;v++){let E=0,y=0,S=0,M=0;if(v<=n){let w=v/n,R=w*Math.PI/2;y=-h-e*Math.cos(R),S=e*Math.sin(R),M=-e*Math.cos(R),E=w*u}else if(v<=n+r){let w=(v-n)/r;y=-h+w*t,S=e,M=0,E=u+w*d}else{let w=(v-n-r)/n,R=w*Math.PI/2;y=h+e*Math.sin(R),S=e*Math.cos(R),M=e*Math.sin(R),E=u+d+w*u}let A=Math.max(0,Math.min(1,E/f)),_=0;v===0?_=.5/s:v===p&&(_=-.5/s);for(let w=0;w<=s;w++){let R=w/s,L=R*Math.PI*2,D=Math.sin(L),k=Math.cos(L);m.x=-S*k,m.y=y,m.z=S*D,o.push(m.x,m.y,m.z),g.set(-S*k,M,S*D),g.normalize(),l.push(g.x,g.y,g.z),c.push(R+_,A)}if(v>0){let w=(v-1)*x;for(let R=0;R<s;R++){let L=w+R,D=w+R+1,k=v*x+R,N=v*x+R+1;a.push(L,D,k),a.push(D,N,k)}}}this.setIndex(a),this.setAttribute("position",new ct(o,3)),this.setAttribute("normal",new ct(l,3)),this.setAttribute("uv",new ct(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}};var Xe=class i extends Dt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],p=0,x=[],g=n/2,m=0;v(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new ct(u,3)),this.setAttribute("normal",new ct(d,3)),this.setAttribute("uv",new ct(f,2));function v(){let y=new P,S=new P,M=0,A=(t-e)/n;for(let _=0;_<=r;_++){let w=[],R=_/r,L=R*(t-e)+e;for(let D=0;D<=s;D++){let k=D/s,N=k*l+o,H=Math.sin(N),j=Math.cos(N);S.x=L*H,S.y=-R*n+g,S.z=L*j,u.push(S.x,S.y,S.z),y.set(H,A,j).normalize(),d.push(y.x,y.y,y.z),f.push(k,1-R),w.push(p++)}x.push(w)}for(let _=0;_<s;_++)for(let w=0;w<r;w++){let R=x[w][_],L=x[w+1][_],D=x[w+1][_+1],k=x[w][_+1];(e>0||w!==0)&&(h.push(R,L,k),M+=3),(t>0||w!==r-1)&&(h.push(L,D,k),M+=3)}c.addGroup(m,M,0),m+=M}function E(y){let S=p,M=new xe,A=new P,_=0,w=y===!0?e:t,R=y===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,g*R,0),d.push(0,R,0),f.push(.5,.5),p++;let L=p;for(let D=0;D<=s;D++){let N=D/s*l+o,H=Math.cos(N),j=Math.sin(N);A.x=w*j,A.y=g*R,A.z=w*H,u.push(A.x,A.y,A.z),d.push(0,R,0),M.x=H*.5+.5,M.y=j*.5*R+.5,f.push(M.x,M.y),p++}for(let D=0;D<s;D++){let k=S+D,N=L+D;y===!0?h.push(N,N+1,k):h.push(N+1,N,k),_+=3}c.addGroup(m,_,y===!0?1:2),m+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},fs=class i extends Xe{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Go=class i extends Dt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new ct(r,3)),this.setAttribute("normal",new ct(r.slice(),3)),this.setAttribute("uv",new ct(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){let E=new P,y=new P,S=new P;for(let M=0;M<t.length;M+=3)f(t[M+0],E),f(t[M+1],y),f(t[M+2],S),l(E,y,S,v)}function l(v,E,y,S){let M=S+1,A=[];for(let _=0;_<=M;_++){A[_]=[];let w=v.clone().lerp(y,_/M),R=E.clone().lerp(y,_/M),L=M-_;for(let D=0;D<=L;D++)D===0&&_===M?A[_][D]=w:A[_][D]=w.clone().lerp(R,D/L)}for(let _=0;_<M;_++)for(let w=0;w<2*(M-_)-1;w++){let R=Math.floor(w/2);w%2===0?(d(A[_][R+1]),d(A[_+1][R]),d(A[_][R])):(d(A[_][R+1]),d(A[_+1][R+1]),d(A[_+1][R]))}}function c(v){let E=new P;for(let y=0;y<r.length;y+=3)E.x=r[y+0],E.y=r[y+1],E.z=r[y+2],E.normalize().multiplyScalar(v),r[y+0]=E.x,r[y+1]=E.y,r[y+2]=E.z}function h(){let v=new P;for(let E=0;E<r.length;E+=3){v.x=r[E+0],v.y=r[E+1],v.z=r[E+2];let y=g(v)/2/Math.PI+.5,S=m(v)/Math.PI+.5;a.push(y,1-S)}p(),u()}function u(){for(let v=0;v<a.length;v+=6){let E=a[v+0],y=a[v+2],S=a[v+4],M=Math.max(E,y,S),A=Math.min(E,y,S);M>.9&&A<.1&&(E<.2&&(a[v+0]+=1),y<.2&&(a[v+2]+=1),S<.2&&(a[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function f(v,E){let y=v*3;E.x=e[y+0],E.y=e[y+1],E.z=e[y+2]}function p(){let v=new P,E=new P,y=new P,S=new P,M=new xe,A=new xe,_=new xe;for(let w=0,R=0;w<r.length;w+=9,R+=6){v.set(r[w+0],r[w+1],r[w+2]),E.set(r[w+3],r[w+4],r[w+5]),y.set(r[w+6],r[w+7],r[w+8]),M.set(a[R+0],a[R+1]),A.set(a[R+2],a[R+3]),_.set(a[R+4],a[R+5]),S.copy(v).add(E).add(y).divideScalar(3);let L=g(S);x(M,R+0,v,L),x(A,R+2,E,L),x(_,R+4,y,L)}}function x(v,E,y,S){S<0&&v.x===1&&(a[E]=v.x-1),y.x===0&&y.z===0&&(a[E]=S/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var In=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Fe("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new xe:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new P,s=[],r=[],a=[],o=new P,l=new ke;for(let f=0;f<=e;f++){let p=f/e;s[f]=this.getTangentAt(p,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let p=Math.acos(Je(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Je(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ia=class extends In{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new xe){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Vo=class extends ia{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Vu(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var af=new P,of=new P,lu=new Vu,cu=new Vu,uu=new Vu,ir=class extends In{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(of.subVectors(s[0],s[1]).add(s[0]),c=of);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(af.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=af),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),p<1e-4&&(p=x),g<1e-4&&(g=x),lu.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,p,x,g),cu.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,p,x,g),uu.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,p,x,g)}else this.curveType==="catmullrom"&&(lu.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),cu.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),uu.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(lu.calc(l),cu.calc(l),uu.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function lf(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function R0(i,e){let t=1-i;return t*t*e}function C0(i,e){return 2*(1-i)*i*e}function P0(i,e){return i*i*e}function kr(i,e,t,n){return R0(i,e)+C0(i,t)+P0(i,n)}function I0(i,e){let t=1-i;return t*t*t*e}function L0(i,e){let t=1-i;return 3*t*t*i*e}function D0(i,e){return 3*(1-i)*i*i*e}function N0(i,e){return i*i*i*e}function zr(i,e,t,n,s){return I0(i,e)+L0(i,t)+D0(i,n)+N0(i,s)}var Wo=class extends In{constructor(e=new xe,t=new xe,n=new xe,s=new xe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new xe){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(zr(e,s.x,r.x,a.x,o.x),zr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xo=class extends In{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(zr(e,s.x,r.x,a.x,o.x),zr(e,s.y,r.y,a.y,o.y),zr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},qo=class extends In{constructor(e=new xe,t=new xe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new xe){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new xe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yo=class extends In{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ko=class extends In{constructor(e=new xe,t=new xe,n=new xe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new xe){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(kr(e,s.x,r.x,a.x),kr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},sa=class extends In{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(kr(e,s.x,r.x,a.x),kr(e,s.y,r.y,a.y),kr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Zo=class extends In{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new xe){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(lf(o,l.x,c.x,h.x,u.x),lf(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new xe().fromArray(s))}return this}},U0=Object.freeze({__proto__:null,ArcCurve:Vo,CatmullRomCurve3:ir,CubicBezierCurve:Wo,CubicBezierCurve3:Xo,EllipseCurve:ia,LineCurve:qo,LineCurve3:Yo,QuadraticBezierCurve:Ko,QuadraticBezierCurve3:sa,SplineCurve:Zo});var sr=class i extends Go{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var nt=class i extends Dt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],p=[],x=[],g=[];for(let m=0;m<h;m++){let v=m*d-a;for(let E=0;E<c;E++){let y=E*u-r;p.push(y,-v,0),x.push(0,0,1),g.push(E/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let v=0;v<o;v++){let E=v+c*m,y=v+c*(m+1),S=v+1+c*(m+1),M=v+1+c*m;f.push(E,y,M),f.push(y,S,M)}this.setIndex(f),this.setAttribute("position",new ct(p,3)),this.setAttribute("normal",new ct(x,3)),this.setAttribute("uv",new ct(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Wn=class i extends Dt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new P,d=new P,f=[],p=[],x=[],g=[];for(let m=0;m<=n;m++){let v=[],E=m/n,y=a+E*o,S=e*Math.cos(y),M=Math.sqrt(e*e-S*S),A=0;m===0&&a===0?A=.5/t:m===n&&l===Math.PI&&(A=-.5/t);for(let _=0;_<=t;_++){let w=_/t,R=s+w*r;u.x=-M*Math.cos(R),u.y=S,u.z=M*Math.sin(R),p.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),g.push(w+A,1-E),v.push(c++)}h.push(v)}for(let m=0;m<n;m++)for(let v=0;v<t;v++){let E=h[m][v+1],y=h[m][v],S=h[m+1][v],M=h[m+1][v+1];(m!==0||a>0)&&f.push(E,y,M),(m!==n-1||l<Math.PI)&&f.push(y,S,M)}this.setIndex(f),this.setAttribute("position",new ct(p,3)),this.setAttribute("normal",new ct(x,3)),this.setAttribute("uv",new ct(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var ra=class i extends Dt{constructor(e=new sa(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new P,l=new P,c=new xe,h=new P,u=[],d=[],f=[],p=[];x(),this.setIndex(p),this.setAttribute("position",new ct(u,3)),this.setAttribute("normal",new ct(d,3)),this.setAttribute("uv",new ct(f,2));function x(){for(let E=0;E<t;E++)g(E);g(r===!1?t:0),v(),m()}function g(E){h=e.getPointAt(E/t,h);let y=a.normals[E],S=a.binormals[E];for(let M=0;M<=s;M++){let A=M/s*Math.PI*2,_=Math.sin(A),w=-Math.cos(A);l.x=w*y.x+_*S.x,l.y=w*y.y+_*S.y,l.z=w*y.z+_*S.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,u.push(o.x,o.y,o.z)}}function m(){for(let E=1;E<=t;E++)for(let y=1;y<=s;y++){let S=(s+1)*(E-1)+(y-1),M=(s+1)*E+(y-1),A=(s+1)*E+y,_=(s+1)*(E-1)+y;p.push(S,M,_),p.push(M,A,_)}}function v(){for(let E=0;E<=t;E++)for(let y=0;y<=s;y++)c.x=E/t,c.y=y/s,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new U0[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function Ms(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(cf(s))s.isRenderTargetTexture?(Fe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(cf(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function an(i){let e={};for(let t=0;t<i.length;t++){let n=Ms(i[t]);for(let s in n)e[s]=n[s]}return e}function cf(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function F0(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Wu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}var pn={clone:Ms,merge:an},O0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,B0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Mt=class extends hn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=O0,this.fragmentShader=B0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ms(e.uniforms),this.uniformsGroups=F0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Re().setHex(s.value);break;case"v2":this.uniforms[n].value=new xe().fromArray(s.value);break;case"v3":this.uniforms[n].value=new P().fromArray(s.value);break;case"v4":this.uniforms[n].value=new xt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ge().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ke().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},rr=class extends Mt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ee=class extends hn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Re(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Re(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Da,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},xn=class extends Ee{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new xe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Je(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Re(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Re(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Re(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var aa=class extends hn{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Da,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}};var $o=class extends hn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Bf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},jo=class extends hn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Xi(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Ro(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function k0(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function uf(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=i[o+l]}return s}function z0(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}var oi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Jo=class extends oi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:mu,endingEnd:mu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case gu:r=e,o=2*t-n;break;case xu:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case gu:a=e,l=2*n-t;break;case xu:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(s-t),x=p*p,g=x*p,m=-d*g+2*d*x-d*p,v=(1+d)*g+(-1.5-2*d)*x+(-.5+d)*p+1,E=(-1-f)*g+(1.5+f)*x+.5*p,y=f*g-f*x;for(let S=0;S!==o;++S)r[S]=m*a[h+S]+v*a[c+S]+E*a[l+S]+y*a[u+S];return r}},Qo=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},el=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},tl=class extends oi{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){let p=(n-t)/(s-t),x=1-p;for(let g=0;g!==o;++g)r[g]=a[c+g]*x+a[l+g]*p;return r}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let x=a[c+p],g=a[l+p],m=f*d+p*2,v=u[m],E=u[m+1],y=e*d+p*2,S=h[y],M=h[y+1],A=G0(n,t,v,S,s);r[p]=Jf(A,x,E,M,g)}return r}};function Jf(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function H0(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function G0(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=Jf(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=H0(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var yn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Xi(t,this.TimeBufferType),this.values=Xi(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Xi(e.times,Array),values:Xi(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),Ro(e.settings)&&(n.settings={inTangents:Xi(e.settings.inTangents,Array),outTangents:Xi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new el(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Qo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Jo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new tl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case os:t=this.InterpolantFactoryMethodDiscrete;break;case ls:t=this.InterpolantFactoryMethodLinear;break;case wo:t=this.InterpolantFactoryMethodSmooth;break;case pu:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Fe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return os;case this.InterpolantFactoryMethodLinear:return ls;case this.InterpolantFactoryMethodSmooth:return wo;case this.InterpolantFactoryMethodBezier:return pu}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;Ro(this.settings)&&(hf(this.settings.inTangents,e),hf(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(ze("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(ze("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){ze("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){ze("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Wm(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){ze("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===wo,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let u=o*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let x=t[u+p];if(x!==t[d+p]||x!==t[f+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,Ro(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function hf(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}yn.prototype.ValueTypeName="";yn.prototype.TimeBufferType=Float32Array;yn.prototype.ValueBufferType=Float32Array;yn.prototype.DefaultInterpolation=ls;var Ai=class extends yn{constructor(e,t,n){super(e,t,n)}};Ai.prototype.ValueTypeName="bool";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=os;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var oa=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};oa.prototype.ValueTypeName="color";var Ri=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};Ri.prototype.ValueTypeName="number";var nl=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)Sn.slerpFlat(r,0,a,c-o,a,c,l);return r}},Ci=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new nl(this.times,this.values,this.getValueSize(),e)}};Ci.prototype.ValueTypeName="quaternion";Ci.prototype.InterpolantFactoryMethodSmooth=void 0;var Pi=class extends yn{constructor(e,t,n){super(e,t,n)}};Pi.prototype.ValueTypeName="string";Pi.prototype.ValueBufferType=Array;Pi.prototype.DefaultInterpolation=os;Pi.prototype.InterpolantFactoryMethodLinear=void 0;Pi.prototype.InterpolantFactoryMethodSmooth=void 0;var Yi=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};Yi.prototype.ValueTypeName="vector";var la=class{constructor(e="",t=-1,n=[],s=Of){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Vn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(W0(n[a]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(yn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);let h=k0(l);l=uf(l,1,h),c=uf(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Ri(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],h=c.name.match(r);if(h&&h.length>1){let u=h[1],d=s[u];d||(s[u]=d=[]),d.push(c)}}let a=[];for(let o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function V0(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ri;case"vector":case"vector2":case"vector3":case"vector4":return Yi;case"color":return oa;case"quaternion":return Ci;case"bool":case"boolean":return Ai;case"string":return Pi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function W0(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=V0(i.type);if(i.times===void 0){let n=[],s=[];z0(i.keys,n,s,"value"),i.times=n,i.values=s}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),Ro(i.settings)&&(t.settings={inTangents:Xi(i.settings.inTangents,Float32Array),outTangents:Xi(i.settings.outTangents,Float32Array)}),t}var ni={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(df(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!df(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function df(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var il=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Qf=new il,li=class{constructor(e){this.manager=e!==void 0?e:Qf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};li.DEFAULT_MATERIAL_NAME="__DEFAULT";var Si={},_u=class extends Error{constructor(e,t){super(e),this.response=t}},ar=class extends li{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=ni.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Si[e]!==void 0){Si[e].push({onLoad:t,onProgress:n,onError:s});return}Si[e]=[],Si[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Fe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=Si[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,x=0,g=new ReadableStream({start(m){v();function v(){u.read().then(({done:E,value:y})=>{if(E)m.close();else{x+=y.byteLength;let S=new ProgressEvent("progress",{lengthComputable:p,loaded:x,total:f});for(let M=0,A=h.length;M<A;M++){let _=h[M];_.onProgress&&_.onProgress(S)}m.enqueue(y),v()}},E=>{m.error(E)})}}});return new Response(g)}else throw new _u(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{ni.add(`file:${e}`,c);let h=Si[e];delete Si[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=Si[e];if(h===void 0)throw this.manager.itemError(e),c;delete Si[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var zs=new WeakMap,sl=class extends li{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=ni.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=zs.get(a);u===void 0&&(u=[],zs.set(a,u)),u.push({onLoad:t,onError:s})}return a}let o=Ys("img");function l(){h(),t&&t(this);let u=zs.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}zs.delete(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),ni.remove(`image:${e}`);let d=zs.get(this)||[];for(let f=0;f<d.length;f++){let p=d[f];p.onError&&p.onError(u)}zs.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ni.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}};var ca=class extends li{constructor(e){super(e)}load(e,t,n,s){let r=new Yt,a=new sl(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Ki=class extends Lt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Re(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ua=class extends Ki{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Lt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Re(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},hu=new ke,ff=new P,pf=new P,or=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xe(512,512),this.mapType=rn,this.map=null,this.mapPass=null,this.matrix=new ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new er,this._frameExtents=new xe(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;ff.setFromMatrixPosition(e.matrixWorld),t.position.copy(ff),pf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(pf),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){hu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(hu,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===qs||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(hu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Eo=new P,To=new Sn,ti=new P,ha=class extends Lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=Gn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Eo,To,ti),ti.x===1&&ti.y===1&&ti.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Eo,To,ti.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Eo,To,ti),ti.x===1&&ti.y===1&&ti.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Eo,To,ti.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Wi=new P,mf=new xe,gf=new xe,Wt=class extends ha{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=cs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Or*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return cs*2*Math.atan(Math.tan(Or*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z),Wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z)}getViewSize(e,t){return this.getViewBounds(e,mf,gf),t.subVectors(gf,mf)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Or*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},vu=class extends or{constructor(){super(new Wt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=cs*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},da=class extends Ki{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Lt.DEFAULT_UP),this.updateMatrix(),this.target=new Lt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new vu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Mu=class extends or{constructor(){super(new Wt(90,1,.5,500)),this.isPointLightShadow=!0}},ps=class extends Ki{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Mu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},ci=class extends ha{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},bu=class extends or{constructor(){super(new ci(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ms=class extends Ki{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Lt.DEFAULT_UP),this.updateMatrix(),this.target=new Lt,this.shadow=new bu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},fa=class extends Ki{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Ii=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var du=new WeakMap,pa=class extends li{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Fe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Fe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=ni.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{du.has(a)===!0?(s&&s(du.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return ni.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),du.set(l,c),ni.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ni.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Hs=-90,Gs=1,rl=class extends Lt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Wt(Hs,Gs,e,t);s.layers=this.layers,this.add(s);let r=new Wt(Hs,Gs,e,t);r.layers=this.layers,this.add(r);let a=new Wt(Hs,Gs,e,t);a.layers=this.layers,this.add(a);let o=new Wt(Hs,Gs,e,t);o.layers=this.layers,this.add(o);let l=new Wt(Hs,Gs,e,t);l.layers=this.layers,this.add(l);let c=new Wt(Hs,Gs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Gn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===qs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},al=class extends Wt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ma=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=X0.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function X0(){this._document.hidden===!1&&this.reset()}var Xu="\\[\\]\\.:\\/",q0=new RegExp("["+Xu+"]","g"),qu="[^"+Xu+"]",Y0="[^"+Xu.replace("\\.","")+"]",K0=/((?:WC+[\/:])*)/.source.replace("WC",qu),Z0=/(WCOD+)?/.source.replace("WCOD",Y0),$0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",qu),j0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",qu),J0=new RegExp("^"+K0+Z0+$0+j0+"$"),Q0=["material","materials","bones","map"],Su=class{constructor(e,t,n){let s=n||vt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},vt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(q0,"")}static parseTrackName(e){let t=J0.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Q0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Fe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ze("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ze("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ze("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){ze("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){ze("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;ze("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};vt.Composite=Su;vt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};vt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};vt.prototype.GetterByBindingType=[vt.prototype._getValue_direct,vt.prototype._getValue_array,vt.prototype._getValue_arrayElement,vt.prototype._getValue_toArray];vt.prototype.SetterByBindingTypeAndVersioning=[[vt.prototype._setValue_direct,vt.prototype._setValue_direct_setNeedsUpdate,vt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_array,vt.prototype._setValue_array_setNeedsUpdate,vt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_arrayElement,vt.prototype._setValue_arrayElement_setNeedsUpdate,vt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_fromArray,vt.prototype._setValue_fromArray_setNeedsUpdate,vt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var JM=new Float32Array(1);var Ju=class Ju{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};Ju.prototype.isMatrix2=!0;var Eu=Ju;function Yu(i,e,t,n){let s=eg(n);switch(t){case Fu:return i*e;case pl:return i*e/s.components*s.byteLength;case ml:return i*e/s.components*s.byteLength;case ji:return i*e*2/s.components*s.byteLength;case gl:return i*e*2/s.components*s.byteLength;case Ou:return i*e*3/s.components*s.byteLength;case fn:return i*e*4/s.components*s.byteLength;case xl:return i*e*4/s.components*s.byteLength;case wa:case Aa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ra:case Ca:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case _l:case Ml:return Math.max(i,16)*Math.max(e,8)/4;case yl:case vl:return Math.max(i,8)*Math.max(e,8)/2;case bl:case Sl:case Tl:case wl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case El:case Pa:case Al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Rl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Cl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Pl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Il:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ll:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Dl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Nl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Fl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case kl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case zl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Hl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Gl:case Vl:case Wl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Xl:case ql:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ia:case Yl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function eg(i){switch(i){case rn:case Lu:return{byteLength:1,components:1};case dr:case Du:case qt:return{byteLength:2,components:1};case dl:case fl:return{byteLength:2,components:4};case Yn:case hl:case Tn:return{byteLength:4,components:1};case Nu:case Uu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Fe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Mp(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ng(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){let p=u[d],x=u[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){let x=u[f];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var ig=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,sg=`#ifdef USE_ALPHAHASH
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
#endif`,rg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ag=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,og=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,lg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,cg=`#ifdef USE_AOMAP
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
#endif`,ug=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hg=`#ifdef USE_BATCHING
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
#endif`,dg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,pg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,mg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,gg=`#ifdef USE_IRIDESCENCE
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
#endif`,xg=`#ifdef USE_BUMPMAP
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
#endif`,yg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,_g=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Mg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,bg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Sg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Eg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Tg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,wg=`#define PI 3.141592653589793
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
} // validated`,Ag=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Rg=`vec3 transformedNormal = objectNormal;
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
#endif`,Cg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Pg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ig=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Lg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Dg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ng=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ug=`#ifdef USE_ENVMAP
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
#endif`,Fg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Og=`#ifdef USE_ENVMAP
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
#endif`,Bg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,kg=`#ifdef USE_ENVMAP
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
#endif`,zg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Hg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Gg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Vg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Wg=`#ifdef USE_GRADIENTMAP
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
}`,Xg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,qg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Yg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Kg=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Zg=`#ifdef USE_ENVMAP
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
#endif`,$g=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ex=`PhysicalMaterial material;
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
#endif`,tx=`uniform sampler2D dfgLUT;
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
}`,nx=`
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
#endif`,ix=`#if defined( RE_IndirectDiffuse )
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
#endif`,sx=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,rx=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,ax=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ox=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ux=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,dx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,fx=`#if defined( USE_POINTS_UV )
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
#endif`,px=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,mx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,gx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_x=`#ifdef USE_MORPHTARGETS
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
#endif`,vx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,bx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ex=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,wx=`#ifdef USE_NORMALMAP
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
#endif`,Ax=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Rx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Px=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ix=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Dx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Nx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ux=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Fx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ox=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,kx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,zx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Hx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Gx=`float getShadowMask() {
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
}`,Vx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Wx=`#ifdef USE_SKINNING
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
#endif`,Xx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qx=`#ifdef USE_SKINNING
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
#endif`,Yx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Kx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Zx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$x=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,jx=`#ifdef USE_TRANSMISSION
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
#endif`,Jx=`#ifdef USE_TRANSMISSION
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
#endif`,Qx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ey=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ty=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ny=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,iy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,sy=`uniform sampler2D t2D;
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
}`,ry=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ay=`#ifdef ENVMAP_TYPE_CUBE
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
}`,oy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ly=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cy=`#include <common>
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
}`,uy=`#if DEPTH_PACKING == 3200
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
}`,hy=`#define DISTANCE
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
}`,dy=`#define DISTANCE
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
}`,fy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,py=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,my=`uniform float scale;
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
}`,gy=`uniform vec3 diffuse;
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
}`,xy=`#include <common>
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
}`,yy=`uniform vec3 diffuse;
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
}`,_y=`#define LAMBERT
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
}`,vy=`#define LAMBERT
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
}`,My=`#define MATCAP
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
}`,by=`#define MATCAP
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
}`,Sy=`#define NORMAL
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
}`,Ey=`#define NORMAL
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
}`,Ty=`#define PHONG
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
}`,wy=`#define PHONG
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
}`,Ay=`#define STANDARD
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
}`,Ry=`#define STANDARD
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
}`,Cy=`#define TOON
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
}`,Py=`#define TOON
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
}`,Iy=`uniform float size;
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
}`,Ly=`uniform vec3 diffuse;
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
}`,Dy=`#include <common>
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
}`,Ny=`uniform vec3 color;
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
}`,Uy=`uniform float rotation;
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
}`,Fy=`uniform vec3 diffuse;
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
}`,$e={alphahash_fragment:ig,alphahash_pars_fragment:sg,alphamap_fragment:rg,alphamap_pars_fragment:ag,alphatest_fragment:og,alphatest_pars_fragment:lg,aomap_fragment:cg,aomap_pars_fragment:ug,batching_pars_vertex:hg,batching_vertex:dg,begin_vertex:fg,beginnormal_vertex:pg,bsdfs:mg,iridescence_fragment:gg,bumpmap_pars_fragment:xg,clipping_planes_fragment:yg,clipping_planes_pars_fragment:_g,clipping_planes_pars_vertex:vg,clipping_planes_vertex:Mg,color_fragment:bg,color_pars_fragment:Sg,color_pars_vertex:Eg,color_vertex:Tg,common:wg,cube_uv_reflection_fragment:Ag,defaultnormal_vertex:Rg,displacementmap_pars_vertex:Cg,displacementmap_vertex:Pg,emissivemap_fragment:Ig,emissivemap_pars_fragment:Lg,colorspace_fragment:Dg,colorspace_pars_fragment:Ng,envmap_fragment:Ug,envmap_common_pars_fragment:Fg,envmap_pars_fragment:Og,envmap_pars_vertex:Bg,envmap_physical_pars_fragment:Zg,envmap_vertex:kg,fog_vertex:zg,fog_pars_vertex:Hg,fog_fragment:Gg,fog_pars_fragment:Vg,gradientmap_pars_fragment:Wg,lightmap_pars_fragment:Xg,lights_lambert_fragment:qg,lights_lambert_pars_fragment:Yg,lights_pars_begin:Kg,lights_toon_fragment:$g,lights_toon_pars_fragment:jg,lights_phong_fragment:Jg,lights_phong_pars_fragment:Qg,lights_physical_fragment:ex,lights_physical_pars_fragment:tx,lights_fragment_begin:nx,lights_fragment_maps:ix,lights_fragment_end:sx,lightprobes_pars_fragment:rx,logdepthbuf_fragment:ax,logdepthbuf_pars_fragment:ox,logdepthbuf_pars_vertex:lx,logdepthbuf_vertex:cx,map_fragment:ux,map_pars_fragment:hx,map_particle_fragment:dx,map_particle_pars_fragment:fx,metalnessmap_fragment:px,metalnessmap_pars_fragment:mx,morphinstance_vertex:gx,morphcolor_vertex:xx,morphnormal_vertex:yx,morphtarget_pars_vertex:_x,morphtarget_vertex:vx,normal_fragment_begin:Mx,normal_fragment_maps:bx,normal_pars_fragment:Sx,normal_pars_vertex:Ex,normal_vertex:Tx,normalmap_pars_fragment:wx,clearcoat_normal_fragment_begin:Ax,clearcoat_normal_fragment_maps:Rx,clearcoat_pars_fragment:Cx,iridescence_pars_fragment:Px,opaque_fragment:Ix,packing:Lx,premultiplied_alpha_fragment:Dx,project_vertex:Nx,dithering_fragment:Ux,dithering_pars_fragment:Fx,roughnessmap_fragment:Ox,roughnessmap_pars_fragment:Bx,shadowmap_pars_fragment:kx,shadowmap_pars_vertex:zx,shadowmap_vertex:Hx,shadowmask_pars_fragment:Gx,skinbase_vertex:Vx,skinning_pars_vertex:Wx,skinning_vertex:Xx,skinnormal_vertex:qx,specularmap_fragment:Yx,specularmap_pars_fragment:Kx,tonemapping_fragment:Zx,tonemapping_pars_fragment:$x,transmission_fragment:jx,transmission_pars_fragment:Jx,uv_pars_fragment:Qx,uv_pars_vertex:ey,uv_vertex:ty,worldpos_vertex:ny,background_vert:iy,background_frag:sy,backgroundCube_vert:ry,backgroundCube_frag:ay,cube_vert:oy,cube_frag:ly,depth_vert:cy,depth_frag:uy,distance_vert:hy,distance_frag:dy,equirect_vert:fy,equirect_frag:py,linedashed_vert:my,linedashed_frag:gy,meshbasic_vert:xy,meshbasic_frag:yy,meshlambert_vert:_y,meshlambert_frag:vy,meshmatcap_vert:My,meshmatcap_frag:by,meshnormal_vert:Sy,meshnormal_frag:Ey,meshphong_vert:Ty,meshphong_frag:wy,meshphysical_vert:Ay,meshphysical_frag:Ry,meshtoon_vert:Cy,meshtoon_frag:Py,points_vert:Iy,points_frag:Ly,shadow_vert:Dy,shadow_frag:Ny,sprite_vert:Uy,sprite_frag:Fy},ve={common:{diffuse:{value:new Re(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Re(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new Re(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new Re(16777215)},opacity:{value:1},center:{value:new xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},fi={basic:{uniforms:an([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:an([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Re(0)},envMapIntensity:{value:1}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:an([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Re(0)},specular:{value:new Re(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:an([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Re(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:an([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Re(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:an([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:an([ve.points,ve.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:an([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:an([ve.common,ve.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:an([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:an([ve.sprite,ve.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distance:{uniforms:an([ve.common,ve.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distance_vert,fragmentShader:$e.distance_frag},shadow:{uniforms:an([ve.lights,ve.fog,{color:{value:new Re(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};fi.physical={uniforms:an([fi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new Re(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new Re(0)},specularColor:{value:new Re(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};var $l={r:0,b:0,g:0},Oy=new ke,bp=new Ge;bp.set(-1,0,0,0,1,0,0,0,1);function By(i,e,t,n,s,r){let a=new Re(0),o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(v){let E=v.isScene===!0?v.background:null;if(E&&E.isTexture){let y=v.backgroundBlurriness>0;E=e.get(E,y)}return E}function p(v){let E=!1,y=f(v);y===null?g(a,o):y&&y.isColor&&(g(y,1),E=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(v,E){let y=f(E);y&&(y.isCubeTexture||y.mapping===Ta)?(c===void 0&&(c=new U(new oe(1,1,1),new Mt({name:"BackgroundCubeMaterial",uniforms:Ms(fi.backgroundCube.uniforms),vertexShader:fi.backgroundCube.vertexShader,fragmentShader:fi.backgroundCube.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,M,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Oy.makeRotationFromEuler(E.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(bp),c.material.toneMapped=Ke.getTransfer(y.colorSpace)!==ut,(h!==y||u!==y.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,u=y.version,d=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new U(new nt(2,2),new Mt({name:"BackgroundMaterial",uniforms:Ms(fi.background.uniforms),vertexShader:fi.background.vertexShader,fragmentShader:fi.background.fragmentShader,side:ui,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=Ke.getTransfer(y.colorSpace)!==ut,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||u!==y.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,u=y.version,d=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function g(v,E){v.getRGB($l,Wu(i)),t.buffers.color.setClear($l.r,$l.g,$l.b,E,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,E=1){a.set(v),o=E,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,g(a,o)},render:p,addToRenderList:x,dispose:m}}function ky(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(L,D,k,N,H){let j=!1,$=u(L,N,k,D);r!==$&&(r=$,c(r.object)),j=f(L,N,k,H),j&&p(L,N,k,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(j||a)&&(a=!1,y(L,D,k,N),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return i.createVertexArray()}function c(L){return i.bindVertexArray(L)}function h(L){return i.deleteVertexArray(L)}function u(L,D,k,N){let H=N.wireframe===!0,j=n[D.id];j===void 0&&(j={},n[D.id]=j);let $=L.isInstancedMesh===!0?L.id:0,se=j[$];se===void 0&&(se={},j[$]=se);let X=se[k.id];X===void 0&&(X={},se[k.id]=X);let ne=X[H];return ne===void 0&&(ne=d(l()),X[H]=ne),ne}function d(L){let D=[],k=[],N=[];for(let H=0;H<t;H++)D[H]=0,k[H]=0,N[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:k,attributeDivisors:N,object:L,attributes:{},index:null}}function f(L,D,k,N){let H=r.attributes,j=D.attributes,$=0,se=k.getAttributes();for(let X in se)if(se[X].location>=0){let ie=H[X],Ce=j[X];if(Ce===void 0&&(X==="instanceMatrix"&&L.instanceMatrix&&(Ce=L.instanceMatrix),X==="instanceColor"&&L.instanceColor&&(Ce=L.instanceColor)),ie===void 0||ie.attribute!==Ce||Ce&&ie.data!==Ce.data)return!0;$++}return r.attributesNum!==$||r.index!==N}function p(L,D,k,N){let H={},j=D.attributes,$=0,se=k.getAttributes();for(let X in se)if(se[X].location>=0){let ie=j[X];ie===void 0&&(X==="instanceMatrix"&&L.instanceMatrix&&(ie=L.instanceMatrix),X==="instanceColor"&&L.instanceColor&&(ie=L.instanceColor));let Ce={};Ce.attribute=ie,ie&&ie.data&&(Ce.data=ie.data),H[X]=Ce,$++}r.attributes=H,r.attributesNum=$,r.index=N}function x(){let L=r.newAttributes;for(let D=0,k=L.length;D<k;D++)L[D]=0}function g(L){m(L,0)}function m(L,D){let k=r.newAttributes,N=r.enabledAttributes,H=r.attributeDivisors;k[L]=1,N[L]===0&&(i.enableVertexAttribArray(L),N[L]=1),H[L]!==D&&(i.vertexAttribDivisor(L,D),H[L]=D)}function v(){let L=r.newAttributes,D=r.enabledAttributes;for(let k=0,N=D.length;k<N;k++)D[k]!==L[k]&&(i.disableVertexAttribArray(k),D[k]=0)}function E(L,D,k,N,H,j,$){$===!0?i.vertexAttribIPointer(L,D,k,H,j):i.vertexAttribPointer(L,D,k,N,H,j)}function y(L,D,k,N){x();let H=N.attributes,j=k.getAttributes(),$=D.defaultAttributeValues;for(let se in j){let X=j[se];if(X.location>=0){let ne=H[se];if(ne===void 0&&(se==="instanceMatrix"&&L.instanceMatrix&&(ne=L.instanceMatrix),se==="instanceColor"&&L.instanceColor&&(ne=L.instanceColor)),ne!==void 0){let ie=ne.normalized,Ce=ne.itemSize,Pe=e.get(ne);if(Pe===void 0)continue;let rt=Pe.buffer,Ye=Pe.type,Qe=Pe.bytesPerElement,Z=Ye===i.INT||Ye===i.UNSIGNED_INT||ne.gpuType===hl;if(ne.isInterleavedBufferAttribute){let ee=ne.data,_e=ee.stride,Oe=ne.offset;if(ee.isInstancedInterleavedBuffer){for(let be=0;be<X.locationSize;be++)m(X.location+be,ee.meshPerAttribute);L.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let be=0;be<X.locationSize;be++)g(X.location+be);i.bindBuffer(i.ARRAY_BUFFER,rt);for(let be=0;be<X.locationSize;be++)E(X.location+be,Ce/X.locationSize,Ye,ie,_e*Qe,(Oe+Ce/X.locationSize*be)*Qe,Z)}else{if(ne.isInstancedBufferAttribute){for(let ee=0;ee<X.locationSize;ee++)m(X.location+ee,ne.meshPerAttribute);L.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let ee=0;ee<X.locationSize;ee++)g(X.location+ee);i.bindBuffer(i.ARRAY_BUFFER,rt);for(let ee=0;ee<X.locationSize;ee++)E(X.location+ee,Ce/X.locationSize,Ye,ie,Ce*Qe,Ce/X.locationSize*ee*Qe,Z)}}else if($!==void 0){let ie=$[se];if(ie!==void 0)switch(ie.length){case 2:i.vertexAttrib2fv(X.location,ie);break;case 3:i.vertexAttrib3fv(X.location,ie);break;case 4:i.vertexAttrib4fv(X.location,ie);break;default:i.vertexAttrib1fv(X.location,ie)}}}}v()}function S(){w();for(let L in n){let D=n[L];for(let k in D){let N=D[k];for(let H in N){let j=N[H];for(let $ in j)h(j[$].object),delete j[$];delete N[H]}}delete n[L]}}function M(L){if(n[L.id]===void 0)return;let D=n[L.id];for(let k in D){let N=D[k];for(let H in N){let j=N[H];for(let $ in j)h(j[$].object),delete j[$];delete N[H]}}delete n[L.id]}function A(L){for(let D in n){let k=n[D];for(let N in k){let H=k[N];if(H[L.id]===void 0)continue;let j=H[L.id];for(let $ in j)h(j[$].object),delete j[$];delete H[L.id]}}}function _(L){for(let D in n){let k=n[D],N=L.isInstancedMesh===!0?L.id:0,H=k[N];if(H!==void 0){for(let j in H){let $=H[j];for(let se in $)h($[se].object),delete $[se];delete H[j]}delete k[N],Object.keys(k).length===0&&delete n[D]}}}function w(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:R,dispose:S,releaseStatesOfGeometry:M,releaseStatesOfObject:_,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:g,disableUnusedAttributes:v}}function zy(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Hy(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==fn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let _=A===qt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==rn&&A!==Tn&&!_&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Fe("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Fe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=i.getParameter(i.MAX_SAMPLES),M=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:v,maxVaryings:E,maxFragmentUniforms:y,maxSamples:S,samples:M}}function Gy(i){let e=this,t=null,n=0,s=!1,r=!1,a=new zn,o=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let p=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,m=i.get(u);if(!s||p===null||p.length===0||r&&!g)r?h(null):c();else{let v=r?0:n,E=v*4,y=m.clippingState||null;l.value=y,y=h(p,d,E,f);for(let S=0;S!==E;++S)y[S]=t[S];m.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,p){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=l.value,p!==!0||g===null){let m=f+x*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<m)&&(g=new Float32Array(m));for(let E=0,y=f;E!==x;++E,y+=4)a.copy(u[E]).applyMatrix4(v,o),a.normal.toArray(g,y),g[y+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}var mr=4,Vy=6,Wy=20,Xy=256,Na=new ci,ep=new Re,Qu=null,eh=0,th=0,nh=!1,qy=new P,bs=new P,xr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=qy}=r;Qu=this._renderer.getRenderTarget(),eh=this._renderer.getActiveCubeFace(),th=this._renderer.getActiveMipmapLevel(),nh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ip(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=np(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Qu,eh,th),this._renderer.xr.enabled=nh,e.scissorTest=!1,pr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Zi||e.mapping===_s?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qu=this._renderer.getRenderTarget(),eh=this._renderer.getActiveCubeFace(),th=this._renderer.getActiveMipmapLevel(),nh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Bt,minFilter:Bt,generateMipmaps:!1,type:qt,format:fn,colorSpace:un,depthBuffer:!1},s=tp(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=tp(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Yy(r)),this._blurMaterial=Zy(r,e,t),this._ggxMaterial=Ky(r,e,t)}return s}_compileMaterial(e){let t=new U(new Dt,e);this._renderer.compile(t,Na)}_sceneToCubeUV(e,t,n,s,r){let l=new Wt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(ep),u.toneMapping=Xn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new U(new oe,new Kt({name:"PMREM.Background",side:dn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,m=!1,v=e.background;v?v.isColor&&(g.color.copy(v),e.background=null,m=!0):(g.color.copy(ep),m=!0);for(let E=0;E<6;E++){let y=E%3;y===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):y===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));let S=this._cubeSize;pr(s,y*S,E>2?S:0,S,S),u.setRenderTarget(s),m&&u.render(x,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=v}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Zi||e.mapping===_s;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ip()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=np());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;pr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Na)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=c*1.25,f=u*d,{_lodMax:p}=this,x=this._sizeLods[n],g=3*x*(n>p-mr?n-p+mr:0),m=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=p-t,pr(r,g,m,3*x,2*x),s.setRenderTarget(r),s.render(o,Na),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,pr(e,g,m,3*x,2*x),s.setRenderTarget(e),s.render(o,Na)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],u=3*h*(s>this._lodMax-mr?s-this._lodMax+mr:0),d=4*(this._cubeSize-h);pr(t,u,d,3*h,2*h),a.setRenderTarget(t),a.render(l,Na)}};function Yy(i){let e=[],t=[],n=i,s=i-mr+1+Vy;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,f=3,p=new Float32Array(f*d*u),x=new Float32Array(f*d*u);for(let m=0;m<u;m++){let v=m%3*2/3-1,E=m>2?0:-1,y=[v,E,0,v+2/3,E,0,v+2/3,E+1,0,v,E,0,v+2/3,E+1,0,v,E+1,0];p.set(y,f*d*m);for(let S=0;S<d;S++){let M=h[S*2]*2-1,A=h[S*2+1]*2-1;m===0?bs.set(1,A,M):m===1?bs.set(-M,1,-A):m===2?bs.set(-M,A,1):m===3?bs.set(-1,A,-M):m===4?bs.set(-M,-1,A):bs.set(M,A,-1),bs.toArray(x,(m*d+S)*f)}}let g=new Dt;g.setAttribute("position",new Xt(p,f)),g.setAttribute("outputDirection",new Xt(x,f)),t.push(new U(g,null)),n>mr&&n--}return{lodMeshes:t,sizeLods:e}}function tp(i,e,t){let n=new Nt(i,e,t);return n.texture.mapping=Ta,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function pr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Ky(i,e,t){return new Mt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Xy,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ec(),fragmentShader:`

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
		`,blending:kt,depthTest:!1,depthWrite:!1})}function Zy(i,e,t){return new Mt({name:"SphericalGaussianBlur",defines:{SAMPLES:Wy,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ec(),fragmentShader:`

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
		`,blending:kt,depthTest:!1,depthWrite:!1})}function np(){return new Mt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ec(),fragmentShader:`

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
		`,blending:kt,depthTest:!1,depthWrite:!1})}function ip(){return new Mt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:kt,depthTest:!1,depthWrite:!1})}function ec(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Jl=class extends Nt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ta(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new oe(5,5,5),r=new Mt({name:"CubemapFromEquirect",uniforms:Ms(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:dn,blending:kt});r.uniforms.tEquirect.value=t;let a=new U(s,r),o=t.minFilter;return t.minFilter===qn&&(t.minFilter=Bt),new rl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function $y(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===ur||f===cl)if(e.has(d)){let p=e.get(d).texture;return o(p,d.mapping)}else{let p=d.image;if(p&&p.height>0){let x=new Jl(p.height);return x.fromEquirectangularTexture(i,d),e.set(d,x),d.addEventListener("dispose",c),o(x.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){let f=d.mapping,p=f===ur||f===cl,x=f===Zi||f===_s;if(p||x){let g=t.get(d),m=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return n===null&&(n=new xr(i)),g=p?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{let v=d.image;return p&&v&&v.height>0||x&&v&&l(v)?(n===null&&(n=new xr(i)),g=p?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,f){return f===ur?d.mapping=Zi:f===cl&&(d.mapping=_s),d}function l(d){let f=0,p=6;for(let x=0;x<p;x++)d[x]!==void 0&&f++;return f===p}function c(d){let f=d.target;f.removeEventListener("dispose",c);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function jy(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&as("WebGLRenderer: "+n+" extension not supported."),s}}}function Jy(i,e,t,n){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,p=u.attributes.position,x=0;if(p===void 0)return;if(f!==null){let v=f.array;x=f.version;for(let E=0,y=v.length;E<y;E+=3){let S=v[E+0],M=v[E+1],A=v[E+2];d.push(S,M,M,A,A,S)}}else{let v=p.array;x=p.version;for(let E=0,y=v.length/3-1;E<y;E+=3){let S=E+0,M=E+1,A=E+2;d.push(S,M,M,A,A,S)}}let g=new(p.count>=65535?Kr:Yr)(d,1);g.version=x;let m=r.get(u);m&&e.remove(m),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Qy(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){i.drawElements(n,d,r,u*a),t.update(d,n,1)}function c(u,d,f){f!==0&&(i.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let x=0;for(let g=0;g<f;g++)x+=d[g];t.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function e_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:ze("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function t_(i,e,t){let n=new WeakMap,s=new xt;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let w=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",w)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],E=0;f===!0&&(E=1),p===!0&&(E=2),x===!0&&(E=3);let y=o.attributes.position.count*E,S=1;y>e.maxTextureSize&&(S=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let M=new Float32Array(y*S*4*u),A=new Vr(M,y,S,u);A.type=Tn,A.needsUpdate=!0;let _=E*4;for(let R=0;R<u;R++){let L=g[R],D=m[R],k=v[R],N=y*S*4*R;for(let H=0;H<L.count;H++){let j=H*_;f===!0&&(s.fromBufferAttribute(L,H),M[N+j+0]=s.x,M[N+j+1]=s.y,M[N+j+2]=s.z,M[N+j+3]=0),p===!0&&(s.fromBufferAttribute(D,H),M[N+j+4]=s.x,M[N+j+5]=s.y,M[N+j+6]=s.z,M[N+j+7]=0),x===!0&&(s.fromBufferAttribute(k,H),M[N+j+8]=s.x,M[N+j+9]=s.y,M[N+j+10]=s.z,M[N+j+11]=k.itemSize===4?s.w:1)}}d={count:u,texture:A,size:new xe(y,S)},n.set(o,d),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let p=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function n_(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var i_={[_a]:"LINEAR_TONE_MAPPING",[va]:"REINHARD_TONE_MAPPING",[Ma]:"CINEON_TONE_MAPPING",[ys]:"ACES_FILMIC_TONE_MAPPING",[Sa]:"AGX_TONE_MAPPING",[Ea]:"NEUTRAL_TONE_MAPPING",[ba]:"CUSTOM_TONE_MAPPING"};function s_(i,e,t,n,s,r){let a=new Nt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Dt;c.setAttribute("position",new ct([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ct([0,2,0,0,2,0],2));let h=new rr({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new U(c,h),d=new ci(-1,1,1,-1,0,1),f=null,p=null,x=!1,g,m=null,v=[],E=!1;this.setSize=function(y,S){a.setSize(y,S),o!==null&&o.setSize(y,S),l!==null&&l.setSize(y,S);for(let M=0;M<v.length;M++){let A=v[M];A.setSize&&A.setSize(y,S)}},this.setEffects=function(y){v=y,E=v.length>0&&v[0].isRenderPass===!0;let S=a.width,M=a.height;v.length>0&&o===null&&(o=new Nt(S,M,{type:qt,depthBuffer:!1,stencilBuffer:!1}),l=new Nt(S,M,{type:qt,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<v.length;A++){let _=v[A];_.setSize&&_.setSize(S,M)}},this.begin=function(y,S){if(x||y.toneMapping===Xn&&v.length===0)return!1;if(m=S,S!==null){let M=S.width,A=S.height;(a.width!==M||a.height!==A)&&this.setSize(M,A)}return E===!1&&y.setRenderTarget(a),g=y.toneMapping,y.toneMapping=Xn,!0},this.hasRenderPass=function(){return E},this.end=function(y,S){y.toneMapping=g,x=!0;let M=a,A=o;for(let _=0;_<v.length;_++){let w=v[_];w.enabled!==!1&&(w.render(y,A,M,S),w.needsSwap!==!1&&(M=A,A=A===o?l:o))}if(f!==y.outputColorSpace||p!==y.toneMapping){f=y.outputColorSpace,p=y.toneMapping,h.defines={},Ke.getTransfer(f)===ut&&(h.defines.SRGB_TRANSFER="");let _=i_[p];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=M.texture,y.setRenderTarget(m),y.render(u,d),m=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var Sp=new Yt,rh=new ai(1,1),Ep=new Vr,Tp=new Bo,wp=new ta,sp=[],rp=[],ap=new Float32Array(16),op=new Float32Array(9),lp=new Float32Array(4);function yr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=sp[s];if(r===void 0&&(r=new Float32Array(s),sp[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Zt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function $t(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function tc(i,e){let t=rp[e];t===void 0&&(t=new Int32Array(e),rp[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function r_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function a_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;i.uniform2fv(this.addr,e),$t(t,e)}}function o_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Zt(t,e))return;i.uniform3fv(this.addr,e),$t(t,e)}}function l_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;i.uniform4fv(this.addr,e),$t(t,e)}}function c_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Zt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),$t(t,e)}else{if(Zt(t,n))return;lp.set(n),i.uniformMatrix2fv(this.addr,!1,lp),$t(t,n)}}function u_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Zt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),$t(t,e)}else{if(Zt(t,n))return;op.set(n),i.uniformMatrix3fv(this.addr,!1,op),$t(t,n)}}function h_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Zt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),$t(t,e)}else{if(Zt(t,n))return;ap.set(n),i.uniformMatrix4fv(this.addr,!1,ap),$t(t,n)}}function d_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function f_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;i.uniform2iv(this.addr,e),$t(t,e)}}function p_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Zt(t,e))return;i.uniform3iv(this.addr,e),$t(t,e)}}function m_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;i.uniform4iv(this.addr,e),$t(t,e)}}function g_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function x_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;i.uniform2uiv(this.addr,e),$t(t,e)}}function y_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Zt(t,e))return;i.uniform3uiv(this.addr,e),$t(t,e)}}function __(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;i.uniform4uiv(this.addr,e),$t(t,e)}}function v_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(rh.compareFunction=t.isReversedDepthBuffer()?Zl:Kl,r=rh):r=Sp,t.setTexture2D(e||r,s)}function M_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Tp,s)}function b_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||wp,s)}function S_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Ep,s)}function E_(i){switch(i){case 5126:return r_;case 35664:return a_;case 35665:return o_;case 35666:return l_;case 35674:return c_;case 35675:return u_;case 35676:return h_;case 5124:case 35670:return d_;case 35667:case 35671:return f_;case 35668:case 35672:return p_;case 35669:case 35673:return m_;case 5125:return g_;case 36294:return x_;case 36295:return y_;case 36296:return __;case 35678:case 36198:case 36298:case 36306:case 35682:return v_;case 35679:case 36299:case 36307:return M_;case 35680:case 36300:case 36308:case 36293:return b_;case 36289:case 36303:case 36311:case 36292:return S_}}function T_(i,e){i.uniform1fv(this.addr,e)}function w_(i,e){let t=yr(e,this.size,2);i.uniform2fv(this.addr,t)}function A_(i,e){let t=yr(e,this.size,3);i.uniform3fv(this.addr,t)}function R_(i,e){let t=yr(e,this.size,4);i.uniform4fv(this.addr,t)}function C_(i,e){let t=yr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function P_(i,e){let t=yr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function I_(i,e){let t=yr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function L_(i,e){i.uniform1iv(this.addr,e)}function D_(i,e){i.uniform2iv(this.addr,e)}function N_(i,e){i.uniform3iv(this.addr,e)}function U_(i,e){i.uniform4iv(this.addr,e)}function F_(i,e){i.uniform1uiv(this.addr,e)}function O_(i,e){i.uniform2uiv(this.addr,e)}function B_(i,e){i.uniform3uiv(this.addr,e)}function k_(i,e){i.uniform4uiv(this.addr,e)}function z_(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Zt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=rh:a=Sp;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function H_(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Zt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Tp,r[a])}function G_(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Zt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||wp,r[a])}function V_(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Zt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Ep,r[a])}function W_(i){switch(i){case 5126:return T_;case 35664:return w_;case 35665:return A_;case 35666:return R_;case 35674:return C_;case 35675:return P_;case 35676:return I_;case 5124:case 35670:return L_;case 35667:case 35671:return D_;case 35668:case 35672:return N_;case 35669:case 35673:return U_;case 5125:return F_;case 36294:return O_;case 36295:return B_;case 36296:return k_;case 35678:case 36198:case 36298:case 36306:case 35682:return z_;case 35679:case 36299:case 36307:return H_;case 35680:case 36300:case 36308:case 36293:return G_;case 36289:case 36303:case 36311:case 36292:return V_}}var ah=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=E_(t.type)}},oh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=W_(t.type)}},lh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},ih=/(\w+)(\])?(\[|\.)?/g;function cp(i,e){i.seq.push(e),i.map[e.id]=e}function X_(i,e,t){let n=i.name,s=n.length;for(ih.lastIndex=0;;){let r=ih.exec(n),a=ih.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){cp(t,c===void 0?new ah(o,i,e):new oh(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new lh(o),cp(t,u)),t=u}}}var gr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);X_(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function up(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var q_=37297,Y_=0;function K_(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var hp=new Ge;function Z_(i){Ke._getMatrix(hp,Ke.workingColorSpace,i);let e=`mat3( ${hp.elements.map(t=>t.toFixed(4))} )`;switch(Ke.getTransfer(i)){case Hr:return[e,"LinearTransferOETF"];case ut:return[e,"sRGBTransferOETF"];default:return Fe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function dp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+K_(i.getShaderSource(e),o)}else return r}function $_(i,e){let t=Z_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var j_={[_a]:"Linear",[va]:"Reinhard",[Ma]:"Cineon",[ys]:"ACESFilmic",[Sa]:"AgX",[Ea]:"Neutral",[ba]:"Custom"};function J_(i,e){let t=j_[e];return t===void 0?(Fe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var jl=new P;function Q_(){Ke.getLuminanceCoefficients(jl);let i=jl.x.toFixed(4),e=jl.y.toFixed(4),t=jl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ev(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fa).join(`
`)}function tv(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function nv(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Fa(i){return i!==""}function fp(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function pp(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var iv=/^[ \t]*#include +<([\w\d./]+)>/gm;function ch(i){return i.replace(iv,rv)}var sv=new Map;function rv(i,e){let t=$e[e];if(t===void 0){let n=sv.get(e);if(n!==void 0)t=$e[n],Fe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return ch(t)}var av=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mp(i){return i.replace(av,ov)}function ov(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function gp(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var lv={[gs]:"SHADOWMAP_TYPE_PCF",[lr]:"SHADOWMAP_TYPE_VSM"};function cv(i){return lv[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var uv={[Zi]:"ENVMAP_TYPE_CUBE",[_s]:"ENVMAP_TYPE_CUBE",[Ta]:"ENVMAP_TYPE_CUBE_UV"};function hv(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":uv[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var dv={[_s]:"ENVMAP_MODE_REFRACTION"};function fv(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":dv[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var pv={[Pu]:"ENVMAP_BLENDING_MULTIPLY",[Nf]:"ENVMAP_BLENDING_MIX",[Uf]:"ENVMAP_BLENDING_ADD"};function mv(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":pv[i.combine]||"ENVMAP_BLENDING_NONE"}function gv(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function xv(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=cv(t),c=hv(t),h=fv(t),u=mv(t),d=gv(t),f=ev(t),p=tv(r),x=s.createProgram(),g,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Fa).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Fa).join(`
`),m.length>0&&(m+=`
`)):(g=[gp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fa).join(`
`),m=[gp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Xn?"#define TONE_MAPPING":"",t.toneMapping!==Xn?$e.tonemapping_pars_fragment:"",t.toneMapping!==Xn?J_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,$_("linearToOutputTexel",t.outputColorSpace),Q_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Fa).join(`
`)),a=ch(a),a=fp(a,t),a=pp(a,t),o=ch(o),o=fp(o,t),o=pp(o,t),a=mp(a),o=mp(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===zu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===zu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let E=v+g+a,y=v+m+o,S=up(s,s.VERTEX_SHADER,E),M=up(s,s.FRAGMENT_SHADER,y);s.attachShader(x,S),s.attachShader(x,M),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function A(L){if(i.debug.checkShaderErrors){let D=s.getProgramInfoLog(x)||"",k=s.getShaderInfoLog(S)||"",N=s.getShaderInfoLog(M)||"",H=D.trim(),j=k.trim(),$=N.trim(),se=!0,X=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(se=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,S,M);else{let ne=dp(s,S,"vertex"),ie=dp(s,M,"fragment");ze("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+H+`
`+ne+`
`+ie)}else H!==""?Fe("WebGLProgram: Program Info Log:",H):(j===""||$==="")&&(X=!1);X&&(L.diagnostics={runnable:se,programLog:H,vertexShader:{log:j,prefix:g},fragmentShader:{log:$,prefix:m}})}s.deleteShader(S),s.deleteShader(M),_=new gr(s,x),w=nv(s,x)}let _;this.getUniforms=function(){return _===void 0&&A(this),_};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(x,q_)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Y_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=S,this.fragmentShader=M,this}var yv=0,uh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new hh(e),t.set(e,n)),n}},hh=class{constructor(e){this.id=yv++,this.code=e,this.usedTimes=0}};function _v(i){return i===ji||i===Pa||i===Ia}function vv(i,e,t,n,s,r){let a=new Wr,o=new uh,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return l.add(_),_===0?"uv":`uv${_}`}function x(_,w,R,L,D,k){let N=L.fog,H=D.geometry,j=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?L.environment:null,$=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,se=e.get(_.envMap||j,$),X=se&&se.mapping===Ta?se.image.height:null,ne=f[_.type];_.precision!==null&&(d=n.getMaxPrecision(_.precision),d!==_.precision&&Fe("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));let ie=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Ce=ie!==void 0?ie.length:0,Pe=0;H.morphAttributes.position!==void 0&&(Pe=1),H.morphAttributes.normal!==void 0&&(Pe=2),H.morphAttributes.color!==void 0&&(Pe=3);let rt,Ye,Qe,Z;if(ne){let Et=fi[ne];rt=Et.vertexShader,Ye=Et.fragmentShader}else{rt=_.vertexShader,Ye=_.fragmentShader;let Et=o.getVertexShaderStage(_),ft=o.getFragmentShaderStage(_);o.update(_,Et,ft),Qe=Et.id,Z=ft.id}let ee=i.getRenderTarget(),_e=i.state.buffers.depth.getReversed(),Oe=D.isInstancedMesh===!0,be=D.isBatchedMesh===!0,He=!!_.map,dt=!!_.matcap,Ve=!!se,je=!!_.aoMap,it=!!_.lightMap,We=!!_.bumpMap&&_.wireframe===!1,ot=!!_.normalMap,Pt=!!_.displacementMap,Ft=!!_.emissiveMap,mt=!!_.metalnessMap,ht=!!_.roughnessMap,F=_.anisotropy>0,St=_.clearcoat>0,st=_.dispersion>0,C=_.retroreflectivity>0,b=_.iridescence>0,B=_.sheen>0,G=_.transmission>0,Y=F&&!!_.anisotropyMap,ue=St&&!!_.clearcoatMap,me=St&&!!_.clearcoatNormalMap,Q=St&&!!_.clearcoatRoughnessMap,te=b&&!!_.iridescenceMap,ge=b&&!!_.iridescenceThicknessMap,De=B&&!!_.sheenColorMap,pe=B&&!!_.sheenRoughnessMap,fe=!!_.specularMap,z=!!_.specularColorMap,K=!!_.specularIntensityMap,he=G&&!!_.transmissionMap,I=G&&!!_.thicknessMap,ce=!!_.gradientMap,J=!!_.alphaMap,de=_.alphaTest>0,ye=!!_.alphaHash,re=!!_.extensions,Ne=Xn;_.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Ne=i.toneMapping);let Te={shaderID:ne,shaderType:_.type,shaderName:_.name,vertexShader:rt,fragmentShader:Ye,defines:_.defines,customVertexShaderID:Qe,customFragmentShaderID:Z,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:be,batchingColor:be&&D._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&D.instanceColor!==null,instancingMorph:Oe&&D.morphTexture!==null,outputColorSpace:ee===null?i.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Ke.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:He,matcap:dt,envMap:Ve,envMapMode:Ve&&se.mapping,envMapCubeUVHeight:X,aoMap:je,lightMap:it,bumpMap:We,normalMap:ot,displacementMap:Pt,emissiveMap:Ft,normalMapObjectSpace:ot&&_.normalMapType===kf,normalMapTangentSpace:ot&&_.normalMapType===Da,packedNormalMap:ot&&_.normalMapType===Da&&_v(_.normalMap.format),metalnessMap:mt,roughnessMap:ht,anisotropy:F,anisotropyMap:Y,clearcoat:St,clearcoatMap:ue,clearcoatNormalMap:me,clearcoatRoughnessMap:Q,dispersion:st,retroreflection:C,iridescence:b,iridescenceMap:te,iridescenceThicknessMap:ge,sheen:B,sheenColorMap:De,sheenRoughnessMap:pe,specularMap:fe,specularColorMap:z,specularIntensityMap:K,transmission:G,transmissionMap:he,thicknessMap:I,gradientMap:ce,opaque:_.transparent===!1&&_.blending===cr&&_.alphaToCoverage===!1,alphaMap:J,alphaTest:de,alphaHash:ye,combine:_.combine,mapUv:He&&p(_.map.channel),aoMapUv:je&&p(_.aoMap.channel),lightMapUv:it&&p(_.lightMap.channel),bumpMapUv:We&&p(_.bumpMap.channel),normalMapUv:ot&&p(_.normalMap.channel),displacementMapUv:Pt&&p(_.displacementMap.channel),emissiveMapUv:Ft&&p(_.emissiveMap.channel),metalnessMapUv:mt&&p(_.metalnessMap.channel),roughnessMapUv:ht&&p(_.roughnessMap.channel),anisotropyMapUv:Y&&p(_.anisotropyMap.channel),clearcoatMapUv:ue&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:me&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:ge&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:De&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:pe&&p(_.sheenRoughnessMap.channel),specularMapUv:fe&&p(_.specularMap.channel),specularColorMapUv:z&&p(_.specularColorMap.channel),specularIntensityMapUv:K&&p(_.specularIntensityMap.channel),transmissionMapUv:he&&p(_.transmissionMap.channel),thicknessMapUv:I&&p(_.thicknessMap.channel),alphaMapUv:J&&p(_.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(ot||F),vertexNormals:!!H.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!H.attributes.uv&&(He||J),fog:!!N,useFog:_.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||H.attributes.normal===void 0&&ot===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:_e,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:H.attributes.position!==void 0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Ce,morphTextureStride:Pe,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ne,decodeVideoTexture:He&&_.map.isVideoTexture===!0&&Ke.getTransfer(_.map.colorSpace)===ut,decodeVideoTextureEmissive:Ft&&_.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(_.emissiveMap.colorSpace)===ut,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ut,flipSided:_.side===dn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:re&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(re&&_.extensions.multiDraw===!0||be)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Te.vertexUv1s=l.has(1),Te.vertexUv2s=l.has(2),Te.vertexUv3s=l.has(3),l.clear(),Te}function g(_){let w=[];if(_.shaderID?w.push(_.shaderID):(w.push(_.customVertexShaderID),w.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)w.push(R),w.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(m(w,_),v(w,_),w.push(i.outputColorSpace)),w.push(_.customProgramCacheKey),w.join()}function m(_,w){_.push(w.precision),_.push(w.outputColorSpace),_.push(w.envMapMode),_.push(w.envMapCubeUVHeight),_.push(w.mapUv),_.push(w.alphaMapUv),_.push(w.lightMapUv),_.push(w.aoMapUv),_.push(w.bumpMapUv),_.push(w.normalMapUv),_.push(w.displacementMapUv),_.push(w.emissiveMapUv),_.push(w.metalnessMapUv),_.push(w.roughnessMapUv),_.push(w.anisotropyMapUv),_.push(w.clearcoatMapUv),_.push(w.clearcoatNormalMapUv),_.push(w.clearcoatRoughnessMapUv),_.push(w.iridescenceMapUv),_.push(w.iridescenceThicknessMapUv),_.push(w.sheenColorMapUv),_.push(w.sheenRoughnessMapUv),_.push(w.specularMapUv),_.push(w.specularColorMapUv),_.push(w.specularIntensityMapUv),_.push(w.transmissionMapUv),_.push(w.thicknessMapUv),_.push(w.combine),_.push(w.fogExp2),_.push(w.sizeAttenuation),_.push(w.morphTargetsCount),_.push(w.morphAttributeCount),_.push(w.numSunLights),_.push(w.numDirLights),_.push(w.numPointLights),_.push(w.numSpotLights),_.push(w.numSpotLightMaps),_.push(w.numHemiLights),_.push(w.numRectAreaLights),_.push(w.numSunLightShadows),_.push(w.numDirLightShadows),_.push(w.numPointLightShadows),_.push(w.numSpotLightShadows),_.push(w.numSpotLightShadowsWithMaps),_.push(w.numLightProbes),_.push(w.shadowMapType),_.push(w.toneMapping),_.push(w.numClippingPlanes),_.push(w.numClipIntersection),_.push(w.depthPacking)}function v(_,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function E(_){let w=f[_.type],R;if(w){let L=fi[w];R=pn.clone(L.uniforms)}else R=_.uniforms;return R}function y(_,w){let R=h.get(w);return R!==void 0?++R.usedTimes:(R=new xv(i,w,_,s),c.push(R),h.set(w,R)),R}function S(_){if(--_.usedTimes===0){let w=c.indexOf(_);c[w]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function M(_){o.remove(_)}function A(){o.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:E,acquireProgram:y,releaseProgram:S,releaseShaderCache:M,programs:c,dispose:A}}function Mv(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function bv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function xp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function yp(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,x,g,m){let v=i[e];return v===void 0?(v={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:x,renderOrder:d.renderOrder,z:g,group:m},i[e]=v):(v.id=d.id,v.object=d,v.geometry=f,v.material=p,v.materialVariant=a(d),v.groupOrder=x,v.renderOrder=d.renderOrder,v.z=g,v.group=m),e++,v}function l(d,f,p,x,g,m,v){v.reversedDepth===!0&&(g=-g);let E=o(d,f,p,x,g,m);p.transmission>0?n.push(E):p.transparent===!0?s.push(E):t.push(E)}function c(d,f,p,x,g,m){let v=o(d,f,p,x,g,m);p.transmission>0?n.unshift(v):p.transparent===!0?s.unshift(v):t.unshift(v)}function h(d,f){t.length>1&&t.sort(d||bv),n.length>1&&n.sort(f||xp),s.length>1&&s.sort(f||xp)}function u(){for(let d=e,f=i.length;d<f;d++){let p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function Sv(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new yp,i.set(n,[a])):s>=r.length?(a=new yp,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Ev(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new P,color:new Re};break;case"SpotLight":t={position:new P,direction:new P,color:new Re,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Re,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Re,groundColor:new Re};break;case"RectAreaLight":t={color:new Re,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function Tv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var wv=0;function Av(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Rv(i){let e=new Ev,t=Tv(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new ke,a=new ke;function o(c){let h=0,u=0,d=0;for(let D=0;D<9;D++)n.probe[D].set(0,0,0);let f=0,p=0,x=0,g=0,m=0,v=0,E=0,y=0,S=0,M=0,A=0,_=0,w=0,R=0;c.sort(Av);for(let D=0,k=c.length;D<k;D++){let N=c[D],H=N.color,j=N.intensity,$=N.distance,se=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===ji?se=N.shadow.map.texture:se=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)h+=H.r*j,u+=H.g*j,d+=H.b*j;else if(N.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(N.sh.coefficients[X],j);R++}else if(N.isSunLight){let X=e.get(N);if(X.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let ne=N.shadow,ie=t.get(N);ie.shadowIntensity=ne.intensity,ie.shadowBias=ne.bias,ie.shadowNormalBias=ne.normalBias,ie.shadowRadius=ne.radius,ie.shadowMapSize.copy(ne.mapSize).multiply(ne.getFrameExtents()),n.sunShadow[p]=ie,n.sunShadowMap[p]=se;let Ce=ne.getViewportCount();for(let Pe=0;Pe<Ce;Pe++)n.sunShadowMatrix[x+Pe]=ne.getMatrix(Pe),n.sunShadowCascade[x+Pe]=ne._cascadeData[Pe];x+=Ce,p++}n.sun[f]=X,f++}else if(N.isDirectionalLight){let X=e.get(N);if(X.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let ne=N.shadow,ie=t.get(N);ie.shadowIntensity=ne.intensity,ie.shadowBias=ne.bias,ie.shadowNormalBias=ne.normalBias,ie.shadowRadius=ne.radius,ie.shadowMapSize=ne.mapSize,n.directionalShadow[g]=ie,n.directionalShadowMap[g]=se,n.directionalShadowMatrix[g]=N.shadow.matrix,S++}n.directional[g]=X,g++}else if(N.isSpotLight){let X=e.get(N);X.position.setFromMatrixPosition(N.matrixWorld),X.color.copy(H).multiplyScalar(j),X.distance=$,X.coneCos=Math.cos(N.angle),X.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),X.decay=N.decay,n.spot[v]=X;let ne=N.shadow;if(N.map&&(n.spotLightMap[_]=N.map,_++,ne.updateMatrices(N),N.castShadow&&w++),n.spotLightMatrix[v]=ne.matrix,N.castShadow){let ie=t.get(N);ie.shadowIntensity=ne.intensity,ie.shadowBias=ne.bias,ie.shadowNormalBias=ne.normalBias,ie.shadowRadius=ne.radius,ie.shadowMapSize=ne.mapSize,n.spotShadow[v]=ie,n.spotShadowMap[v]=se,A++}v++}else if(N.isRectAreaLight){let X=e.get(N);X.color.copy(H).multiplyScalar(j),X.halfWidth.set(N.width*.5,0,0),X.halfHeight.set(0,N.height*.5,0),n.rectArea[E]=X,E++}else if(N.isPointLight){let X=e.get(N);if(X.color.copy(N.color).multiplyScalar(N.intensity),X.distance=N.distance,X.decay=N.decay,N.castShadow){let ne=N.shadow,ie=t.get(N);ie.shadowIntensity=ne.intensity,ie.shadowBias=ne.bias,ie.shadowNormalBias=ne.normalBias,ie.shadowRadius=ne.radius,ie.shadowMapSize=ne.mapSize,ie.shadowCameraNear=ne.camera.near,ie.shadowCameraFar=ne.camera.far,n.pointShadow[m]=ie,n.pointShadowMap[m]=se,n.pointShadowMatrix[m]=N.shadow.matrix,M++}n.point[m]=X,m++}else if(N.isHemisphereLight){let X=e.get(N);X.skyColor.copy(N.color).multiplyScalar(j),X.groundColor.copy(N.groundColor).multiplyScalar(j),n.hemi[y]=X,y++}}E>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let L=n.hash;(L.sunLength!==f||L.directionalLength!==g||L.pointLength!==m||L.spotLength!==v||L.rectAreaLength!==E||L.hemiLength!==y||L.numSunShadows!==p||L.numDirectionalShadows!==S||L.numPointShadows!==M||L.numSpotShadows!==A||L.numSpotMaps!==_||L.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=g,n.spot.length=v,n.rectArea.length=E,n.point.length=m,n.hemi.length=y,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=M,n.pointShadowMap.length=M,n.pointShadowMatrix.length=M,n.spotShadow.length=A,n.spotShadowMap.length=A,n.spotLightMatrix.length=A+_-w,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=R,L.sunLength=f,L.directionalLength=g,L.pointLength=m,L.spotLength=v,L.rectAreaLength=E,L.hemiLength=y,L.numSunShadows=p,L.numDirectionalShadows=S,L.numPointShadows=M,L.numSpotShadows=A,L.numSpotMaps=_,L.numLightProbes=R,n.version=wv++)}function l(c,h){let u=0,d=0,f=0,p=0,x=0,g=0,m=h.matrixWorldInverse;for(let v=0,E=c.length;v<E;v++){let y=c[v];if(y.isSunLight){let S=n.sun[u];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(m),u++}else if(y.isDirectionalLight){let S=n.directional[d];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),d++}else if(y.isSpotLight){let S=n.spot[p];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),p++}else if(y.isRectAreaLight){let S=n.rectArea[x];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),a.identity(),r.copy(y.matrixWorld),r.premultiply(m),a.extractRotation(r),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){let S=n.point[f];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),f++}else if(y.isHemisphereLight){let S=n.hemi[g];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(m),g++}}}return{setup:o,setupView:l,state:n}}function _p(i){let e=new Rv(i),t=[],n=[],s=[];function r(d){u.camera=d,t.length=0,n.length=0,s.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){s.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}let u={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Cv(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new _p(i),e.set(s,[o])):r>=a.length?(o=new _p(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Pv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Iv=`uniform sampler2D shadow_pass;
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
}`,Lv=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],Dv=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],vp=new ke,Ua=new P,sh=new P;function Nv(i,e,t){let n=new er,s=new xe,r=new xe,a=new xt,o=new $o,l=new jo,c={},h=t.maxTextureSize,u={[ui]:dn,[dn]:ui,[Ut]:Ut},d=new Mt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xe},radius:{value:4}},vertexShader:Pv,fragmentShader:Iv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let p=new Dt;p.setAttribute("position",new Xt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new U(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gs;let m=this.type;this.render=function(M,A,_){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||M.length===0)return;this.type===_f&&(Fe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=gs);let w=i.getRenderTarget(),R=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),D=i.state;D.setBlending(kt),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let k=m!==this.type;k&&A.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(H=>H.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,H=M.length;N<H;N++){let j=M[N],$=j.shadow;if($===void 0){Fe("WebGLShadowMap:",j,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);let se=$.getFrameExtents();s.multiply(se),r.copy($.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/se.x),s.x=r.x*se.x,$.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/se.y),s.y=r.y*se.y,$.mapSize.y=r.y));let X=i.state.buffers.depth.getReversed();if($.camera._reversedDepth=X,$.map===null||k===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===lr){if(j.isPointLight){Fe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new Nt(s.x,s.y,{format:ji,type:qt,minFilter:Bt,magFilter:Bt,generateMipmaps:!1}),$.map.texture.name=j.name+".shadowMap",$.map.depthTexture=new ai(s.x,s.y,Tn),$.map.depthTexture.name=j.name+".shadowMapDepth",$.map.depthTexture.format=ii,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=It,$.map.depthTexture.magFilter=It}else j.isPointLight?($.map=new Jl(s.x),$.map.depthTexture=new Ho(s.x,Yn)):($.map=new Nt(s.x,s.y),$.map.depthTexture=new ai(s.x,s.y,Yn)),$.map.depthTexture.name=j.name+".shadowMap",$.map.depthTexture.format=ii,this.type===gs?($.map.depthTexture.compareFunction=X?Zl:Kl,$.map.depthTexture.minFilter=Bt,$.map.depthTexture.magFilter=Bt):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=It,$.map.depthTexture.magFilter=It);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==s.x||$.map.height!==s.y)&&$.map.setSize(s.x,s.y);let ne=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();j.isPointLight!==!0&&$.updateMatrices(j,_);for(let ie=0;ie<ne;ie++){let Ce=$.getCamera(ie);if(j.isPointLight){let Pe=$.camera,rt=$.matrix,Ye=j.distance||Pe.far;Ye!==Pe.far&&(Pe.far=Ye,Pe.updateProjectionMatrix()),Ua.setFromMatrixPosition(j.matrixWorld),Pe.position.copy(Ua),sh.copy(Pe.position),sh.add(Lv[ie]),Pe.up.copy(Dv[ie]),Pe.lookAt(sh),Pe.updateMatrixWorld(),rt.makeTranslation(-Ua.x,-Ua.y,-Ua.z),vp.multiplyMatrices(Pe.projectionMatrix,Pe.matrixWorldInverse),$._frustum.setFromProjectionMatrix(vp,Pe.coordinateSystem,Pe.reversedDepth)}if($.map.isWebGLCubeRenderTarget)i.setRenderTarget($.map,ie),i.clear();else{ie===0&&(i.setRenderTarget($.map),i.clear());let Pe=$.getViewport(ie);a.set(r.x*Pe.x,r.y*Pe.y,r.x*Pe.z,r.y*Pe.w),D.viewport(a)}n=$.getFrustum(ie),y(A,_,Ce,j,this.type)}$.isPointLightShadow!==!0&&this.type===lr&&v($,_),$.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(w,R,L)};function v(M,A){let _=e.update(x);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null?M.mapPass=new Nt(s.x,s.y,{format:ji,type:qt}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),d.uniforms.shadow_pass.value=M.map.depthTexture,d.uniforms.resolution.value.set(M.map.width,M.map.height),d.uniforms.radius.value=M.radius,i.setRenderTarget(M.mapPass),i.clear(),i.renderBufferDirect(A,null,_,d,x,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value.set(M.map.width,M.map.height),f.uniforms.radius.value=M.radius,i.setRenderTarget(M.map),i.clear(),i.renderBufferDirect(A,null,_,f,x,null)}function E(M,A,_,w){let R=null,L=_.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(L!==void 0)R=L;else if(R=_.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let D=R.uuid,k=A.uuid,N=c[D];N===void 0&&(N={},c[D]=N);let H=N[k];H===void 0&&(H=R.clone(),N[k]=H,A.addEventListener("dispose",S)),R=H}if(R.visible=A.visible,R.wireframe=A.wireframe,w===lr?R.side=A.shadowSide!==null?A.shadowSide:A.side:R.side=A.shadowSide!==null?A.shadowSide:u[A.side],R.alphaMap=A.alphaMap,R.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,R.map=A.map,R.clipShadows=A.clipShadows,R.clippingPlanes=A.clippingPlanes,R.clipIntersection=A.clipIntersection,R.displacementMap=A.displacementMap,R.displacementScale=A.displacementScale,R.displacementBias=A.displacementBias,R.wireframeLinewidth=A.wireframeLinewidth,R.linewidth=A.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let D=i.properties.get(R);D.light=_}return R}function y(M,A,_,w,R){if(M.visible===!1)return;if(M.layers.test(A.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&R===lr)&&(!M.frustumCulled||M.intersectsFrustum(n))){M.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,M.matrixWorld);let k=e.update(M),N=M.material;if(Array.isArray(N)){let H=k.groups;for(let j=0,$=H.length;j<$;j++){let se=H[j],X=N[se.materialIndex];if(X&&X.visible){let ne=E(M,X,w,R);M.onBeforeShadow(i,M,A,_,k,ne,se),i.renderBufferDirect(_,null,k,ne,M,se),M.onAfterShadow(i,M,A,_,k,ne,se)}}}else if(N.visible){let H=E(M,N,w,R);M.onBeforeShadow(i,M,A,_,k,H,null),i.renderBufferDirect(_,null,k,H,M,null),M.onAfterShadow(i,M,A,_,k,H,null)}}let D=M.children;for(let k=0,N=D.length;k<N;k++)y(D[k],A,_,w,R)}function S(M){M.target.removeEventListener("dispose",S);for(let _ in c){let w=c[_],R=M.target.uuid;R in w&&(w[R].dispose(),delete w[R])}}}function Uv(i,e){function t(){let I=!1,ce=new xt,J=null,de=new xt(0,0,0,0);return{setMask:function(ye){J!==ye&&!I&&(i.colorMask(ye,ye,ye,ye),J=ye)},setLocked:function(ye){I=ye},setClear:function(ye,re,Ne,Te,Et){Et===!0&&(ye*=Te,re*=Te,Ne*=Te),ce.set(ye,re,Ne,Te),de.equals(ce)===!1&&(i.clearColor(ye,re,Ne,Te),de.copy(ce))},reset:function(){I=!1,J=null,de.set(-1,0,0,0)}}}function n(){let I=!1,ce=!1,J=null,de=null,ye=null;return{setReversed:function(re){if(ce!==re){let Ne=e.get("EXT_clip_control");re?Ne.clipControlEXT(Ne.LOWER_LEFT_EXT,Ne.ZERO_TO_ONE_EXT):Ne.clipControlEXT(Ne.LOWER_LEFT_EXT,Ne.NEGATIVE_ONE_TO_ONE_EXT),ce=re;let Te=ye;ye=null,this.setClear(Te)}},getReversed:function(){return ce},setTest:function(re){re?ee(i.DEPTH_TEST):_e(i.DEPTH_TEST)},setMask:function(re){J!==re&&!I&&(i.depthMask(re),J=re)},setFunc:function(re){if(ce&&(re=$f[re]),de!==re){switch(re){case Co:i.depthFunc(i.NEVER);break;case Po:i.depthFunc(i.ALWAYS);break;case Io:i.depthFunc(i.LESS);break;case Ws:i.depthFunc(i.LEQUAL);break;case Lo:i.depthFunc(i.EQUAL);break;case Do:i.depthFunc(i.GEQUAL);break;case No:i.depthFunc(i.GREATER);break;case Uo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}de=re}},setLocked:function(re){I=re},setClear:function(re){ye!==re&&(ye=re,ce&&(re=1-re),i.clearDepth(re))},reset:function(){I=!1,J=null,de=null,ye=null,ce=!1}}}function s(){let I=!1,ce=null,J=null,de=null,ye=null,re=null,Ne=null,Te=null,Et=null;return{setTest:function(ft){I||(ft?ee(i.STENCIL_TEST):_e(i.STENCIL_TEST))},setMask:function(ft){ce!==ft&&!I&&(i.stencilMask(ft),ce=ft)},setFunc:function(ft,Fn,Qn){(J!==ft||de!==Fn||ye!==Qn)&&(i.stencilFunc(ft,Fn,Qn),J=ft,de=Fn,ye=Qn)},setOp:function(ft,Fn,Qn){(re!==ft||Ne!==Fn||Te!==Qn)&&(i.stencilOp(ft,Fn,Qn),re=ft,Ne=Fn,Te=Qn)},setLocked:function(ft){I=ft},setClear:function(ft){Et!==ft&&(i.clearStencil(ft),Et=ft)},reset:function(){I=!1,ce=null,J=null,de=null,ye=null,re=null,Ne=null,Te=null,Et=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},u={},d={},f=new WeakMap,p=[],x=null,g=!1,m=null,v=null,E=null,y=null,S=null,M=null,A=null,_=new Re(0,0,0),w=0,R=!1,L=null,D=null,k=null,N=null,H=null,j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,se=0,X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(se=parseFloat(/^WebGL (\d)/.exec(X)[1]),$=se>=1):X.indexOf("OpenGL ES")!==-1&&(se=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),$=se>=2);let ne=null,ie={},Ce=i.getParameter(i.SCISSOR_BOX),Pe=i.getParameter(i.VIEWPORT),rt=new xt().fromArray(Ce),Ye=new xt().fromArray(Pe);function Qe(I,ce,J,de){let ye=new Uint8Array(4),re=i.createTexture();i.bindTexture(I,re),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ne=0;Ne<J;Ne++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(ce,0,i.RGBA,1,1,de,0,i.RGBA,i.UNSIGNED_BYTE,ye):i.texImage2D(ce+Ne,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ye);return re}let Z={};Z[i.TEXTURE_2D]=Qe(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=Qe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=Qe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=Qe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(i.DEPTH_TEST),a.setFunc(Ws),We(!1),ot(Tu),ee(i.CULL_FACE),je(kt);function ee(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function _e(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Oe(I,ce){return d[I]!==ce?(i.bindFramebuffer(I,ce),d[I]=ce,I===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ce),I===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ce),!0):!1}function be(I,ce){let J=p,de=!1;if(I){J=f.get(ce),J===void 0&&(J=[],f.set(ce,J));let ye=I.textures;if(J.length!==ye.length||J[0]!==i.COLOR_ATTACHMENT0){for(let re=0,Ne=ye.length;re<Ne;re++)J[re]=i.COLOR_ATTACHMENT0+re;J.length=ye.length,de=!0}}else J[0]!==i.BACK&&(J[0]=i.BACK,de=!0);de&&i.drawBuffers(J)}function He(I){return x!==I?(i.useProgram(I),x=I,!0):!1}let dt={[Ln]:i.FUNC_ADD,[vf]:i.FUNC_SUBTRACT,[Mf]:i.FUNC_REVERSE_SUBTRACT};dt[bf]=i.MIN,dt[Sf]=i.MAX;let Ve={[xs]:i.ZERO,[Ef]:i.ONE,[Tf]:i.SRC_COLOR,[Ru]:i.SRC_ALPHA,[Cf]:i.SRC_ALPHA_SATURATE,[ya]:i.DST_COLOR,[xa]:i.DST_ALPHA,[wf]:i.ONE_MINUS_SRC_COLOR,[Cu]:i.ONE_MINUS_SRC_ALPHA,[Rf]:i.ONE_MINUS_DST_COLOR,[Af]:i.ONE_MINUS_DST_ALPHA,[Pf]:i.CONSTANT_COLOR,[If]:i.ONE_MINUS_CONSTANT_COLOR,[Lf]:i.CONSTANT_ALPHA,[Df]:i.ONE_MINUS_CONSTANT_ALPHA};function je(I,ce,J,de,ye,re,Ne,Te,Et,ft){if(I===kt){g===!0&&(_e(i.BLEND),g=!1);return}if(g===!1&&(ee(i.BLEND),g=!0),I!==ll){if(I!==m||ft!==R){if((v!==Ln||S!==Ln)&&(i.blendEquation(i.FUNC_ADD),v=Ln,S=Ln),ft)switch(I){case cr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ga:i.blendFunc(i.ONE,i.ONE);break;case wu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Au:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ze("WebGLState: Invalid blending: ",I);break}else switch(I){case cr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ga:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case wu:ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Au:ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ze("WebGLState: Invalid blending: ",I);break}E=null,y=null,M=null,A=null,_.set(0,0,0),w=0,m=I,R=ft}return}ye=ye||ce,re=re||J,Ne=Ne||de,(ce!==v||ye!==S)&&(i.blendEquationSeparate(dt[ce],dt[ye]),v=ce,S=ye),(J!==E||de!==y||re!==M||Ne!==A)&&(i.blendFuncSeparate(Ve[J],Ve[de],Ve[re],Ve[Ne]),E=J,y=de,M=re,A=Ne),(Te.equals(_)===!1||Et!==w)&&(i.blendColor(Te.r,Te.g,Te.b,Et),_.copy(Te),w=Et),m=I,R=!1}function it(I,ce){I.side===Ut?_e(i.CULL_FACE):ee(i.CULL_FACE);let J=I.side===dn;ce&&(J=!J),We(J),I.blending===cr&&I.transparent===!1?je(kt):je(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);let de=I.stencilWrite;o.setTest(de),de&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),Ft(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ee(i.SAMPLE_ALPHA_TO_COVERAGE):_e(i.SAMPLE_ALPHA_TO_COVERAGE)}function We(I){L!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),L=I)}function ot(I){I!==xf?(ee(i.CULL_FACE),I!==D&&(I===Tu?i.cullFace(i.BACK):I===yf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_e(i.CULL_FACE),D=I}function Pt(I){I!==k&&($&&i.lineWidth(I),k=I)}function Ft(I,ce,J){I?(ee(i.POLYGON_OFFSET_FILL),(N!==ce||H!==J)&&(N=ce,H=J,a.getReversed()&&(ce=-ce),i.polygonOffset(ce,J))):_e(i.POLYGON_OFFSET_FILL)}function mt(I){I?ee(i.SCISSOR_TEST):_e(i.SCISSOR_TEST)}function ht(I){I===void 0&&(I=i.TEXTURE0+j-1),ne!==I&&(i.activeTexture(I),ne=I)}function F(I,ce,J){J===void 0&&(ne===null?J=i.TEXTURE0+j-1:J=ne);let de=ie[J];de===void 0&&(de={type:void 0,texture:void 0},ie[J]=de),(de.type!==I||de.texture!==ce)&&(ne!==J&&(i.activeTexture(J),ne=J),i.bindTexture(I,ce||Z[I]),de.type=I,de.texture=ce)}function St(){let I=ie[ne];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function st(){try{i.compressedTexImage2D(...arguments)}catch(I){ze("WebGLState:",I)}}function C(){try{i.compressedTexImage3D(...arguments)}catch(I){ze("WebGLState:",I)}}function b(){try{i.texSubImage2D(...arguments)}catch(I){ze("WebGLState:",I)}}function B(){try{i.texSubImage3D(...arguments)}catch(I){ze("WebGLState:",I)}}function G(){try{i.compressedTexSubImage2D(...arguments)}catch(I){ze("WebGLState:",I)}}function Y(){try{i.compressedTexSubImage3D(...arguments)}catch(I){ze("WebGLState:",I)}}function ue(){try{i.texStorage2D(...arguments)}catch(I){ze("WebGLState:",I)}}function me(){try{i.texStorage3D(...arguments)}catch(I){ze("WebGLState:",I)}}function Q(){try{i.texImage2D(...arguments)}catch(I){ze("WebGLState:",I)}}function te(){try{i.texImage3D(...arguments)}catch(I){ze("WebGLState:",I)}}function ge(I){return u[I]!==void 0?u[I]:i.getParameter(I)}function De(I,ce){u[I]!==ce&&(i.pixelStorei(I,ce),u[I]=ce)}function pe(I){rt.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),rt.copy(I))}function fe(I){Ye.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),Ye.copy(I))}function z(I,ce){let J=c.get(ce);J===void 0&&(J=new WeakMap,c.set(ce,J));let de=J.get(I);de===void 0&&(de=i.getUniformBlockIndex(ce,I.name),J.set(I,de))}function K(I,ce){let de=c.get(ce).get(I);l.get(ce)!==de&&(i.uniformBlockBinding(ce,de,I.__bindingPointIndex),l.set(ce,de))}function he(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},ne=null,ie={},d={},f=new WeakMap,p=[],x=null,g=!1,m=null,v=null,E=null,y=null,S=null,M=null,A=null,_=new Re(0,0,0),w=0,R=!1,L=null,D=null,k=null,N=null,H=null,rt.set(0,0,i.canvas.width,i.canvas.height),Ye.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ee,disable:_e,bindFramebuffer:Oe,drawBuffers:be,useProgram:He,setBlending:je,setMaterial:it,setFlipSided:We,setCullFace:ot,setLineWidth:Pt,setPolygonOffset:Ft,setScissorTest:mt,activeTexture:ht,bindTexture:F,unbindTexture:St,compressedTexImage2D:st,compressedTexImage3D:C,texImage2D:Q,texImage3D:te,pixelStorei:De,getParameter:ge,updateUBOMapping:z,uniformBlockBinding:K,texStorage2D:ue,texStorage3D:me,texSubImage2D:b,texSubImage3D:B,compressedTexSubImage2D:G,compressedTexSubImage3D:Y,scissor:pe,viewport:fe,reset:he}}function Fv(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xe,h=new WeakMap,u=new Set,d,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,b){return p?new OffscreenCanvas(C,b):Ys("canvas")}function g(C,b,B){let G=1,Y=st(C);if((Y.width>B||Y.height>B)&&(G=B/Math.max(Y.width,Y.height)),G<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let ue=Math.floor(G*Y.width),me=Math.floor(G*Y.height);d===void 0&&(d=x(ue,me));let Q=b?x(ue,me):d;return Q.width=ue,Q.height=me,Q.getContext("2d").drawImage(C,0,0,ue,me),Fe("WebGLRenderer: Texture has been resized from ("+Y.width+"x"+Y.height+") to ("+ue+"x"+me+")."),Q}else return"data"in C&&Fe("WebGLRenderer: Image in DataTexture is too big ("+Y.width+"x"+Y.height+")."),C;return C}function m(C){return C.generateMipmaps}function v(C){i.generateMipmap(C)}function E(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(C,b,B,G,Y,ue=!1){if(C!==null){if(i[C]!==void 0)return i[C];Fe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let me;G&&(me=e.get("EXT_texture_norm16"),me||Fe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Q=b;if(b===i.RED&&(B===i.FLOAT&&(Q=i.R32F),B===i.HALF_FLOAT&&(Q=i.R16F),B===i.UNSIGNED_BYTE&&(Q=i.R8),B===i.UNSIGNED_SHORT&&me&&(Q=me.R16_EXT),B===i.SHORT&&me&&(Q=me.R16_SNORM_EXT)),b===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(Q=i.R8UI),B===i.UNSIGNED_SHORT&&(Q=i.R16UI),B===i.UNSIGNED_INT&&(Q=i.R32UI),B===i.BYTE&&(Q=i.R8I),B===i.SHORT&&(Q=i.R16I),B===i.INT&&(Q=i.R32I)),b===i.RG&&(B===i.FLOAT&&(Q=i.RG32F),B===i.HALF_FLOAT&&(Q=i.RG16F),B===i.UNSIGNED_BYTE&&(Q=i.RG8),B===i.UNSIGNED_SHORT&&me&&(Q=me.RG16_EXT),B===i.SHORT&&me&&(Q=me.RG16_SNORM_EXT)),b===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(Q=i.RG8UI),B===i.UNSIGNED_SHORT&&(Q=i.RG16UI),B===i.UNSIGNED_INT&&(Q=i.RG32UI),B===i.BYTE&&(Q=i.RG8I),B===i.SHORT&&(Q=i.RG16I),B===i.INT&&(Q=i.RG32I)),b===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),B===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),B===i.UNSIGNED_INT&&(Q=i.RGB32UI),B===i.BYTE&&(Q=i.RGB8I),B===i.SHORT&&(Q=i.RGB16I),B===i.INT&&(Q=i.RGB32I)),b===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),B===i.UNSIGNED_INT&&(Q=i.RGBA32UI),B===i.BYTE&&(Q=i.RGBA8I),B===i.SHORT&&(Q=i.RGBA16I),B===i.INT&&(Q=i.RGBA32I)),b===i.RGB&&(B===i.UNSIGNED_SHORT&&me&&(Q=me.RGB16_EXT),B===i.SHORT&&me&&(Q=me.RGB16_SNORM_EXT),B===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(Q=i.R11F_G11F_B10F)),b===i.RGBA){let te=ue?Hr:Ke.getTransfer(Y);B===i.FLOAT&&(Q=i.RGBA32F),B===i.HALF_FLOAT&&(Q=i.RGBA16F),B===i.UNSIGNED_BYTE&&(Q=te===ut?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT&&me&&(Q=me.RGBA16_EXT),B===i.SHORT&&me&&(Q=me.RGBA16_SNORM_EXT),B===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function S(C,b){let B;return C?b===null||b===Yn||b===$i?B=i.DEPTH24_STENCIL8:b===Tn?B=i.DEPTH32F_STENCIL8:b===dr&&(B=i.DEPTH24_STENCIL8,Fe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Yn||b===$i?B=i.DEPTH_COMPONENT24:b===Tn?B=i.DEPTH_COMPONENT32F:b===dr&&(B=i.DEPTH_COMPONENT16),B}function M(C,b){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==It&&C.minFilter!==Bt?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function A(C){let b=C.target;b.removeEventListener("dispose",A),w(b),b.isVideoTexture&&h.delete(b),b.isHTMLTexture&&u.delete(b)}function _(C){let b=C.target;b.removeEventListener("dispose",_),L(b)}function w(C){let b=n.get(C);if(b.__webglInit===void 0)return;let B=C.source,G=f.get(B);if(G){let Y=G[b.__cacheKey];Y.usedTimes--,Y.usedTimes===0&&R(C),Object.keys(G).length===0&&f.delete(B)}n.remove(C)}function R(C){let b=n.get(C);i.deleteTexture(b.__webglTexture);let B=C.source,G=f.get(B);delete G[b.__cacheKey],a.memory.textures--}function L(C){let b=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(b.__webglFramebuffer[G]))for(let Y=0;Y<b.__webglFramebuffer[G].length;Y++)i.deleteFramebuffer(b.__webglFramebuffer[G][Y]);else i.deleteFramebuffer(b.__webglFramebuffer[G]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[G])}else{if(Array.isArray(b.__webglFramebuffer))for(let G=0;G<b.__webglFramebuffer.length;G++)i.deleteFramebuffer(b.__webglFramebuffer[G]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let G=0;G<b.__webglColorRenderbuffer.length;G++)b.__webglColorRenderbuffer[G]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[G]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let B=C.textures;for(let G=0,Y=B.length;G<Y;G++){let ue=n.get(B[G]);ue.__webglTexture&&(i.deleteTexture(ue.__webglTexture),a.memory.textures--),n.remove(B[G])}n.remove(C)}let D=0;function k(){D=0}function N(){return D}function H(C){D=C}function j(){let C=D;return C>=s.maxTextures&&Fe("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),D+=1,C}function $(C){let b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function se(C,b){let B=n.get(C);if(C.isVideoTexture&&F(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&B.__version!==C.version){let G=C.image;if(G===null)Fe("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)Fe("WebGLRenderer: Texture marked for update but image is incomplete");else{_e(B,C,b);return}}else C.isExternalTexture&&(B.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+b)}function X(C,b){let B=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&B.__version!==C.version){_e(B,C,b);return}else C.isExternalTexture&&(B.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+b)}function ne(C,b){let B=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&B.__version!==C.version){_e(B,C,b);return}t.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+b)}function ie(C,b){let B=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&B.__version!==C.version){Oe(B,C,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+b)}let Ce={[Qt]:i.REPEAT,[sn]:i.CLAMP_TO_EDGE,[Xs]:i.MIRRORED_REPEAT},Pe={[It]:i.NEAREST,[ul]:i.NEAREST_MIPMAP_NEAREST,[vs]:i.NEAREST_MIPMAP_LINEAR,[Bt]:i.LINEAR,[hr]:i.LINEAR_MIPMAP_NEAREST,[qn]:i.LINEAR_MIPMAP_LINEAR},rt={[Hf]:i.NEVER,[qf]:i.ALWAYS,[Gf]:i.LESS,[Kl]:i.LEQUAL,[Vf]:i.EQUAL,[Zl]:i.GEQUAL,[Wf]:i.GREATER,[Xf]:i.NOTEQUAL};function Ye(C,b){if(b.type===Tn&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Bt||b.magFilter===hr||b.magFilter===vs||b.magFilter===qn||b.minFilter===Bt||b.minFilter===hr||b.minFilter===vs||b.minFilter===qn)&&Fe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,Ce[b.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,Ce[b.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,Ce[b.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,Pe[b.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,Pe[b.minFilter]),b.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,rt[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===It||b.minFilter!==vs&&b.minFilter!==qn||b.type===Tn&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){let B=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Qe(C,b){let B=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",A));let G=b.source,Y=f.get(G);Y===void 0&&(Y={},f.set(G,Y));let ue=$(b);if(ue!==C.__cacheKey){Y[ue]===void 0&&(Y[ue]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,B=!0),Y[ue].usedTimes++;let me=Y[C.__cacheKey];me!==void 0&&(Y[C.__cacheKey].usedTimes--,me.usedTimes===0&&R(b)),C.__cacheKey=ue,C.__webglTexture=Y[ue].texture}return B}function Z(C,b,B){return Math.floor(Math.floor(C/B)/b)}function ee(C,b,B,G){let ue=C.updateRanges;if(ue.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,b.width,b.height,B,G,b.data);else{ue.sort((De,pe)=>De.start-pe.start);let me=0;for(let De=1;De<ue.length;De++){let pe=ue[me],fe=ue[De],z=pe.start+pe.count,K=Z(fe.start,b.width,4),he=Z(pe.start,b.width,4);fe.start<=z+1&&K===he&&Z(fe.start+fe.count-1,b.width,4)===K?pe.count=Math.max(pe.count,fe.start+fe.count-pe.start):(++me,ue[me]=fe)}ue.length=me+1;let Q=t.getParameter(i.UNPACK_ROW_LENGTH),te=t.getParameter(i.UNPACK_SKIP_PIXELS),ge=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,b.width);for(let De=0,pe=ue.length;De<pe;De++){let fe=ue[De],z=Math.floor(fe.start/4),K=Math.ceil(fe.count/4),he=z%b.width,I=Math.floor(z/b.width),ce=K,J=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,he),t.pixelStorei(i.UNPACK_SKIP_ROWS,I),t.texSubImage2D(i.TEXTURE_2D,0,he,I,ce,J,B,G,b.data)}C.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Q),t.pixelStorei(i.UNPACK_SKIP_PIXELS,te),t.pixelStorei(i.UNPACK_SKIP_ROWS,ge)}}function _e(C,b,B){let G=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(G=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(G=i.TEXTURE_3D);let Y=Qe(C,b),ue=b.source;t.bindTexture(G,C.__webglTexture,i.TEXTURE0+B);let me=n.get(ue);if(ue.version!==me.__version||Y===!0){if(t.activeTexture(i.TEXTURE0+B),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){let J=Ke.getPrimaries(Ke.workingColorSpace),de=b.colorSpace===Kn?null:Ke.getPrimaries(b.colorSpace),ye=b.colorSpace===Kn||J===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye)}t.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment);let te=g(b.image,!1,s.maxTextureSize);te=St(b,te);let ge=r.convert(b.format,b.colorSpace),De=r.convert(b.type),pe=y(b.internalFormat,ge,De,b.normalized,b.colorSpace,b.isVideoTexture);Ye(G,b);let fe,z=b.mipmaps,K=b.isVideoTexture!==!0,he=me.__version===void 0||Y===!0,I=ue.dataReady,ce=M(b,te);if(b.isDepthTexture)pe=S(b.format===hi,b.type),he&&(K?t.texStorage2D(i.TEXTURE_2D,1,pe,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,pe,te.width,te.height,0,ge,De,null));else if(b.isDataTexture)if(z.length>0){K&&he&&t.texStorage2D(i.TEXTURE_2D,ce,pe,z[0].width,z[0].height);for(let J=0,de=z.length;J<de;J++)fe=z[J],K?I&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,fe.width,fe.height,ge,De,fe.data):t.texImage2D(i.TEXTURE_2D,J,pe,fe.width,fe.height,0,ge,De,fe.data);b.generateMipmaps=!1}else K?(he&&t.texStorage2D(i.TEXTURE_2D,ce,pe,te.width,te.height),I&&ee(b,te,ge,De)):t.texImage2D(i.TEXTURE_2D,0,pe,te.width,te.height,0,ge,De,te.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){K&&he&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ce,pe,z[0].width,z[0].height,te.depth);for(let J=0,de=z.length;J<de;J++)if(fe=z[J],b.format!==fn)if(ge!==null)if(K){if(I)if(b.layerUpdates.size>0){let ye=Yu(fe.width,fe.height,b.format,b.type);for(let re of b.layerUpdates){let Ne=fe.data.subarray(re*ye/fe.data.BYTES_PER_ELEMENT,(re+1)*ye/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,re,fe.width,fe.height,1,ge,Ne)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,fe.width,fe.height,te.depth,ge,fe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,pe,fe.width,fe.height,te.depth,0,fe.data,0,0);else Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else K?I&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,fe.width,fe.height,te.depth,ge,De,fe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,J,pe,fe.width,fe.height,te.depth,0,ge,De,fe.data);b.layerUpdates.size>0&&b.clearLayerUpdates()}else{K&&he&&t.texStorage2D(i.TEXTURE_2D,ce,pe,z[0].width,z[0].height);for(let J=0,de=z.length;J<de;J++)fe=z[J],b.format!==fn?ge!==null?K?I&&t.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,fe.width,fe.height,ge,fe.data):t.compressedTexImage2D(i.TEXTURE_2D,J,pe,fe.width,fe.height,0,fe.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):K?I&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,fe.width,fe.height,ge,De,fe.data):t.texImage2D(i.TEXTURE_2D,J,pe,fe.width,fe.height,0,ge,De,fe.data)}else if(b.isDataArrayTexture)if(K){if(he&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ce,pe,te.width,te.height,te.depth),I)if(b.layerUpdates.size>0){let J=Yu(te.width,te.height,b.format,b.type);for(let de of b.layerUpdates){let ye=te.data.subarray(de*J/te.data.BYTES_PER_ELEMENT,(de+1)*J/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,de,te.width,te.height,1,ge,De,ye)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,ge,De,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,pe,te.width,te.height,te.depth,0,ge,De,te.data);else if(b.isData3DTexture)K?(he&&t.texStorage3D(i.TEXTURE_3D,ce,pe,te.width,te.height,te.depth),I&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,ge,De,te.data)):t.texImage3D(i.TEXTURE_3D,0,pe,te.width,te.height,te.depth,0,ge,De,te.data);else if(b.isFramebufferTexture){if(he)if(K)t.texStorage2D(i.TEXTURE_2D,ce,pe,te.width,te.height);else{let J=te.width,de=te.height;for(let ye=0;ye<ce;ye++)t.texImage2D(i.TEXTURE_2D,ye,pe,J,de,0,ge,De,null),J>>=1,de>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in i){let J=i.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),te.parentNode!==J){J.appendChild(te),u.add(b),J.onpaint=de=>{let ye=de.changedElements;for(let re of u)ye.includes(re.image)&&(re.needsUpdate=!0)},J.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,te);else{let ye=i.RGBA,re=i.RGBA,Ne=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,ye,re,Ne,te)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(z.length>0){if(K&&he){let J=st(z[0]);t.texStorage2D(i.TEXTURE_2D,ce,pe,J.width,J.height)}for(let J=0,de=z.length;J<de;J++)fe=z[J],K?I&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,ge,De,fe):t.texImage2D(i.TEXTURE_2D,J,pe,ge,De,fe);b.generateMipmaps=!1}else if(K){if(he){let J=st(te);t.texStorage2D(i.TEXTURE_2D,ce,pe,J.width,J.height)}I&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ge,De,te)}else t.texImage2D(i.TEXTURE_2D,0,pe,ge,De,te);m(b)&&v(G),me.__version=ue.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function Oe(C,b,B){if(b.image.length!==6)return;let G=Qe(C,b),Y=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+B);let ue=n.get(Y);if(Y.version!==ue.__version||G===!0){t.activeTexture(i.TEXTURE0+B);let me=Ke.getPrimaries(Ke.workingColorSpace),Q=b.colorSpace===Kn?null:Ke.getPrimaries(b.colorSpace),te=b.colorSpace===Kn||me===Q?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let ge=b.isCompressedTexture||b.image[0].isCompressedTexture,De=b.image[0]&&b.image[0].isDataTexture,pe=[];for(let re=0;re<6;re++)!ge&&!De?pe[re]=g(b.image[re],!0,s.maxCubemapSize):pe[re]=De?b.image[re].image:b.image[re],pe[re]=St(b,pe[re]);let fe=pe[0],z=r.convert(b.format,b.colorSpace),K=r.convert(b.type),he=y(b.internalFormat,z,K,b.normalized,b.colorSpace),I=b.isVideoTexture!==!0,ce=ue.__version===void 0||G===!0,J=Y.dataReady,de=M(b,fe);Ye(i.TEXTURE_CUBE_MAP,b);let ye;if(ge){I&&ce&&t.texStorage2D(i.TEXTURE_CUBE_MAP,de,he,fe.width,fe.height);for(let re=0;re<6;re++){ye=pe[re].mipmaps;for(let Ne=0;Ne<ye.length;Ne++){let Te=ye[Ne];b.format!==fn?z!==null?I?J&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ne,0,0,Te.width,Te.height,z,Te.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ne,he,Te.width,Te.height,0,Te.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ne,0,0,Te.width,Te.height,z,K,Te.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ne,he,Te.width,Te.height,0,z,K,Te.data)}}}else{if(ye=b.mipmaps,I&&ce){ye.length>0&&de++;let re=st(pe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,de,he,re.width,re.height)}for(let re=0;re<6;re++)if(De){I?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,pe[re].width,pe[re].height,z,K,pe[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,he,pe[re].width,pe[re].height,0,z,K,pe[re].data);for(let Ne=0;Ne<ye.length;Ne++){let Et=ye[Ne].image[re].image;I?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ne+1,0,0,Et.width,Et.height,z,K,Et.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ne+1,he,Et.width,Et.height,0,z,K,Et.data)}}else{I?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,z,K,pe[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,he,z,K,pe[re]);for(let Ne=0;Ne<ye.length;Ne++){let Te=ye[Ne];I?J&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ne+1,0,0,z,K,Te.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ne+1,he,z,K,Te.image[re])}}}m(b)&&v(i.TEXTURE_CUBE_MAP),ue.__version=Y.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function be(C,b,B,G,Y,ue){let me=r.convert(B.format,B.colorSpace),Q=r.convert(B.type),te=y(B.internalFormat,me,Q,B.normalized,B.colorSpace),ge=n.get(b),De=n.get(B);if(De.__renderTarget=b,!ge.__hasExternalTextures){let pe=Math.max(1,b.width>>ue),fe=Math.max(1,b.height>>ue);Y===i.TEXTURE_3D||Y===i.TEXTURE_2D_ARRAY?t.texImage3D(Y,ue,te,pe,fe,b.depth,0,me,Q,null):t.texImage2D(Y,ue,te,pe,fe,0,me,Q,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),ht(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,G,Y,De.__webglTexture,0,mt(b)):(Y===i.TEXTURE_2D||Y>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Y<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,G,Y,De.__webglTexture,ue),t.bindFramebuffer(i.FRAMEBUFFER,null)}function He(C,b,B){if(i.bindRenderbuffer(i.RENDERBUFFER,C),b.depthBuffer){let G=b.depthTexture,Y=G&&G.isDepthTexture?G.type:null,ue=S(b.stencilBuffer,Y),me=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ht(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt(b),ue,b.width,b.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt(b),ue,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,ue,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,me,i.RENDERBUFFER,C)}else{let G=b.textures;for(let Y=0;Y<G.length;Y++){let ue=G[Y],me=r.convert(ue.format,ue.colorSpace),Q=r.convert(ue.type),te=y(ue.internalFormat,me,Q,ue.normalized,ue.colorSpace);ht(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt(b),te,b.width,b.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt(b),te,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,te,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function dt(C,b,B){let G=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Y=n.get(b.depthTexture);if(Y.__renderTarget=b,(!Y.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),G){if(Y.__webglInit===void 0&&(Y.__webglInit=!0,b.depthTexture.addEventListener("dispose",A)),Y.__webglTexture===void 0){Y.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),Ye(i.TEXTURE_CUBE_MAP,b.depthTexture);let ge=r.convert(b.depthTexture.format),De=r.convert(b.depthTexture.type),pe;b.depthTexture.format===ii?pe=i.DEPTH_COMPONENT24:b.depthTexture.format===hi&&(pe=i.DEPTH24_STENCIL8);for(let fe=0;fe<6;fe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,pe,b.width,b.height,0,ge,De,null)}}else se(b.depthTexture,0);let ue=Y.__webglTexture,me=mt(b),Q=G?i.TEXTURE_CUBE_MAP_POSITIVE_X+B:i.TEXTURE_2D,te=b.depthTexture.format===hi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(b.depthTexture.format===ii)ht(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Q,ue,0,me):i.framebufferTexture2D(i.FRAMEBUFFER,te,Q,ue,0);else if(b.depthTexture.format===hi)ht(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Q,ue,0,me):i.framebufferTexture2D(i.FRAMEBUFFER,te,Q,ue,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ve(C){let b=n.get(C),B=C.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==C.depthTexture){let G=C.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),G){let Y=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,G.removeEventListener("dispose",Y)};G.addEventListener("dispose",Y),b.__depthDisposeCallback=Y}b.__boundDepthTexture=G}if(C.depthTexture&&!b.__autoAllocateDepthBuffer)if(B)for(let G=0;G<6;G++)dt(b.__webglFramebuffer[G],C,G);else{let G=C.texture.mipmaps;G&&G.length>0?dt(b.__webglFramebuffer[0],C,0):dt(b.__webglFramebuffer,C,0)}else if(B){b.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[G]),b.__webglDepthbuffer[G]===void 0)b.__webglDepthbuffer[G]=i.createRenderbuffer(),He(b.__webglDepthbuffer[G],C,!1);else{let Y=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=b.__webglDepthbuffer[G];i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,ue)}}else{let G=C.texture.mipmaps;if(G&&G.length>0?t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),He(b.__webglDepthbuffer,C,!1);else{let Y=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,ue)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function je(C,b,B){let G=n.get(C);b!==void 0&&be(G.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Ve(C)}function it(C){let b=C.texture,B=n.get(C),G=n.get(b);C.addEventListener("dispose",_);let Y=C.textures,ue=C.isWebGLCubeRenderTarget===!0,me=Y.length>1;if(me||(G.__webglTexture===void 0&&(G.__webglTexture=i.createTexture()),G.__version=b.version,a.memory.textures++),ue){B.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(b.mipmaps&&b.mipmaps.length>0){B.__webglFramebuffer[Q]=[];for(let te=0;te<b.mipmaps.length;te++)B.__webglFramebuffer[Q][te]=i.createFramebuffer()}else B.__webglFramebuffer[Q]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){B.__webglFramebuffer=[];for(let Q=0;Q<b.mipmaps.length;Q++)B.__webglFramebuffer[Q]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(me)for(let Q=0,te=Y.length;Q<te;Q++){let ge=n.get(Y[Q]);ge.__webglTexture===void 0&&(ge.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&ht(C)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let Q=0;Q<Y.length;Q++){let te=Y[Q];B.__webglColorRenderbuffer[Q]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[Q]);let ge=r.convert(te.format,te.colorSpace),De=r.convert(te.type),pe=y(te.internalFormat,ge,De,te.normalized,te.colorSpace,C.isXRRenderTarget===!0),fe=mt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,pe,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.RENDERBUFFER,B.__webglColorRenderbuffer[Q])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),He(B.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ue){t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture),Ye(i.TEXTURE_CUBE_MAP,b);for(let Q=0;Q<6;Q++)if(b.mipmaps&&b.mipmaps.length>0)for(let te=0;te<b.mipmaps.length;te++)be(B.__webglFramebuffer[Q][te],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,te);else be(B.__webglFramebuffer[Q],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);m(b)&&v(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(me){for(let Q=0,te=Y.length;Q<te;Q++){let ge=Y[Q],De=n.get(ge),pe=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(pe=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,De.__webglTexture),Ye(pe,ge),be(B.__webglFramebuffer,C,ge,i.COLOR_ATTACHMENT0+Q,pe,0),m(ge)&&v(pe)}t.unbindTexture()}else{let Q=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Q=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Q,G.__webglTexture),Ye(Q,b),b.mipmaps&&b.mipmaps.length>0)for(let te=0;te<b.mipmaps.length;te++)be(B.__webglFramebuffer[te],C,b,i.COLOR_ATTACHMENT0,Q,te);else be(B.__webglFramebuffer,C,b,i.COLOR_ATTACHMENT0,Q,0);m(b)&&v(Q),t.unbindTexture()}C.depthBuffer&&Ve(C)}function We(C){let b=C.textures;for(let B=0,G=b.length;B<G;B++){let Y=b[B];if(m(Y)){let ue=E(C),me=n.get(Y).__webglTexture;t.bindTexture(ue,me),v(ue),t.unbindTexture()}}}let ot=[],Pt=[];function Ft(C){if(C.samples>0){if(ht(C)===!1){let b=C.textures,B=C.width,G=C.height,Y=i.COLOR_BUFFER_BIT,ue=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=n.get(C),Q=b.length>1;if(Q)for(let ge=0;ge<b.length;ge++)t.bindFramebuffer(i.FRAMEBUFFER,me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer);let te=C.texture.mipmaps;te&&te.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let ge=0;ge<b.length;ge++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Y|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Y|=i.STENCIL_BUFFER_BIT)),Q){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,me.__webglColorRenderbuffer[ge]);let De=n.get(b[ge]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,De,0)}i.blitFramebuffer(0,0,B,G,0,0,B,G,Y,i.NEAREST),l===!0&&(ot.length=0,Pt.length=0,ot.push(i.COLOR_ATTACHMENT0+ge),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(ot.push(ue),Pt.push(ue),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Pt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Q)for(let ge=0;ge<b.length;ge++){t.bindFramebuffer(i.FRAMEBUFFER,me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,me.__webglColorRenderbuffer[ge]);let De=n.get(b[ge]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,De,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let b=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function mt(C){return Math.min(s.maxSamples,C.samples)}function ht(C){let b=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function F(C){let b=a.render.frame;h.get(C)!==b&&(h.set(C,b),C.update())}function St(C,b){let B=C.colorSpace,G=C.format,Y=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||B!==un&&B!==Kn&&(Ke.getTransfer(B)===ut?(G!==fn||Y!==rn)&&Fe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ze("WebGLTextures: Unsupported texture color space:",B)),b}function st(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=j,this.resetTextureUnits=k,this.getTextureUnits=N,this.setTextureUnits=H,this.setTexture2D=se,this.setTexture2DArray=X,this.setTexture3D=ne,this.setTextureCube=ie,this.rebindTextures=je,this.setupRenderTarget=it,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=Ve,this.setupFrameBufferTexture=be,this.useMultisampledRTT=ht,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Ov(i,e){function t(n,s=Kn){let r,a=Ke.getTransfer(s);if(n===rn)return i.UNSIGNED_BYTE;if(n===dl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===fl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Nu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Uu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Lu)return i.BYTE;if(n===Du)return i.SHORT;if(n===dr)return i.UNSIGNED_SHORT;if(n===hl)return i.INT;if(n===Yn)return i.UNSIGNED_INT;if(n===Tn)return i.FLOAT;if(n===qt)return i.HALF_FLOAT;if(n===Fu)return i.ALPHA;if(n===Ou)return i.RGB;if(n===fn)return i.RGBA;if(n===ii)return i.DEPTH_COMPONENT;if(n===hi)return i.DEPTH_STENCIL;if(n===pl)return i.RED;if(n===ml)return i.RED_INTEGER;if(n===ji)return i.RG;if(n===gl)return i.RG_INTEGER;if(n===xl)return i.RGBA_INTEGER;if(n===wa||n===Aa||n===Ra||n===Ca)if(a===ut)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===wa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ca)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===wa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ra)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ca)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===yl||n===_l||n===vl||n===Ml)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===yl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===_l)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===vl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ml)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===bl||n===Sl||n===El||n===Tl||n===wl||n===Pa||n===Al)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===bl||n===Sl)return a===ut?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===El)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Tl)return r.COMPRESSED_R11_EAC;if(n===wl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Pa)return r.COMPRESSED_RG11_EAC;if(n===Al)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Rl||n===Cl||n===Pl||n===Il||n===Ll||n===Dl||n===Nl||n===Ul||n===Fl||n===Ol||n===Bl||n===kl||n===zl||n===Hl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Rl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Cl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Pl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Il)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ll)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Dl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Nl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ul)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Fl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ol)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Bl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===kl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===zl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Hl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Gl||n===Vl||n===Wl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Gl)return a===ut?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Vl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Wl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Xl||n===ql||n===Ia||n===Yl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Xl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ql)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ia)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Yl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===$i?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Bv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,kv=`
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

}`,dh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new na(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Mt({vertexShader:Bv,fragmentShader:kv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new U(new nt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},fh=class extends si{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null,x=typeof XRWebGLBinding<"u",g=new dh,m={},v=t.getContextAttributes(),E=null,y=null,S=[],M=[],A=new xe,_=null,w=null,R=new Wt;R.viewport=new xt;let L=new Wt;L.viewport=new xt;let D=[R,L],k=new al,N=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ee=S[Z];return ee===void 0&&(ee=new $s,S[Z]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(Z){let ee=S[Z];return ee===void 0&&(ee=new $s,S[Z]=ee),ee.getGripSpace()},this.getHand=function(Z){let ee=S[Z];return ee===void 0&&(ee=new $s,S[Z]=ee),ee.getHandSpace()};function j(Z){let ee=M.indexOf(Z.inputSource);if(ee===-1)return;let _e=S[ee];_e!==void 0&&(_e.update(Z.inputSource,Z.frame,c||a),_e.dispatchEvent({type:Z.type,data:Z.inputSource}))}function $(){s.removeEventListener("select",j),s.removeEventListener("selectstart",j),s.removeEventListener("selectend",j),s.removeEventListener("squeeze",j),s.removeEventListener("squeezestart",j),s.removeEventListener("squeezeend",j),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",se);for(let Z=0;Z<S.length;Z++){let ee=M[Z];ee!==null&&(M[Z]=null,S[Z].disconnect(ee))}N=null,H=null,g.reset();for(let Z in m)delete m[Z];if(e.setRenderTarget(E),f=null,d=null,u=null,s=null,y=null,Qe.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(A.width,A.height,!1),w!==null){let Z=w.camera;Z.fov=w.fov,Z.zoom=w.zoom,Z.updateProjectionMatrix(),w=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Fe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&Fe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",j),s.addEventListener("selectstart",j),s.addEventListener("selectend",j),s.addEventListener("squeeze",j),s.addEventListener("squeezestart",j),s.addEventListener("squeezeend",j),s.addEventListener("end",$),s.addEventListener("inputsourceschange",se),v.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(A),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,Oe=null,be=null;v.depth&&(be=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=v.stencil?hi:ii,Oe=v.stencil?$i:Yn);let He={colorFormat:t.RGBA8,depthFormat:be,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(He),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Nt(d.textureWidth,d.textureHeight,{format:fn,type:rn,depthTexture:new ai(d.textureWidth,d.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let _e={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,_e),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Nt(f.framebufferWidth,f.framebufferHeight,{format:fn,type:rn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Qe.setContext(s),Qe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function se(Z){for(let ee=0;ee<Z.removed.length;ee++){let _e=Z.removed[ee],Oe=M.indexOf(_e);Oe>=0&&(M[Oe]=null,S[Oe].disconnect(_e))}for(let ee=0;ee<Z.added.length;ee++){let _e=Z.added[ee],Oe=M.indexOf(_e);if(Oe===-1){for(let He=0;He<S.length;He++)if(He>=M.length){M.push(_e),Oe=He;break}else if(M[He]===null){M[He]=_e,Oe=He;break}if(Oe===-1)break}let be=S[Oe];be&&be.connect(_e)}}let X=new P,ne=new P;function ie(Z,ee,_e){X.setFromMatrixPosition(ee.matrixWorld),ne.setFromMatrixPosition(_e.matrixWorld);let Oe=X.distanceTo(ne),be=ee.projectionMatrix.elements,He=_e.projectionMatrix.elements,dt=be[14]/(be[10]-1),Ve=be[14]/(be[10]+1),je=(be[9]+1)/be[5],it=(be[9]-1)/be[5],We=(be[8]-1)/be[0],ot=(He[8]+1)/He[0],Pt=dt*We,Ft=dt*ot,mt=Oe/(-We+ot),ht=mt*-We;if(ee.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ht),Z.translateZ(mt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),be[10]===-1)Z.projectionMatrix.copy(ee.projectionMatrix),Z.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{let F=dt+mt,St=Ve+mt,st=Pt-ht,C=Ft+(Oe-ht),b=je*Ve/St*F,B=it*Ve/St*F;Z.projectionMatrix.makePerspective(st,C,b,B,F,St),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function Ce(Z,ee){ee===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ee.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let ee=Z.near,_e=Z.far;g.texture!==null&&(g.depthNear>0&&(ee=g.depthNear),g.depthFar>0&&(_e=g.depthFar)),k.near=L.near=R.near=ee,k.far=L.far=R.far=_e,(N!==k.near||H!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),N=k.near,H=k.far),k.layers.mask=Z.layers.mask|6,R.layers.mask=k.layers.mask&-5,L.layers.mask=k.layers.mask&-3;let Oe=Z.parent,be=k.cameras;Ce(k,Oe);for(let He=0;He<be.length;He++)Ce(be[He],Oe);be.length===2?ie(k,R,L):k.projectionMatrix.copy(R.projectionMatrix),w===null&&Z.isPerspectiveCamera&&(w={camera:Z,fov:Z.fov,zoom:Z.zoom}),Pe(Z,k,Oe)};function Pe(Z,ee,_e){_e===null?Z.matrix.copy(ee.matrixWorld):(Z.matrix.copy(_e.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ee.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ee.projectionMatrix),Z.projectionMatrixInverse.copy(ee.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=cs*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(k)},this.getCameraTexture=function(Z){return m[Z]};let rt=null;function Ye(Z,ee){if(h=ee.getViewerPose(c||a),p=ee,h!==null){let _e=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let Oe=!1;_e.length!==k.cameras.length&&(k.cameras.length=0,Oe=!0);for(let Ve=0;Ve<_e.length;Ve++){let je=_e[Ve],it=null;if(f!==null)it=f.getViewport(je);else{let ot=u.getViewSubImage(d,je);it=ot.viewport,Ve===0&&(e.setRenderTargetTextures(y,ot.colorTexture,ot.depthStencilTexture),e.setRenderTarget(y))}let We=D[Ve];We===void 0&&(We=new Wt,We.layers.enable(Ve),We.viewport=new xt,D[Ve]=We),We.matrix.fromArray(je.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(je.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(it.x,it.y,it.width,it.height),Ve===0&&(k.matrix.copy(We.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Oe===!0&&k.cameras.push(We)}let be=s.enabledFeatures;if(be&&be.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let Ve=u.getDepthInformation(_e[0]);Ve&&Ve.isValid&&Ve.texture&&g.init(Ve,s.renderState)}if(be&&be.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let Ve=0;Ve<_e.length;Ve++){let je=_e[Ve].camera;if(je){let it=m[je];it||(it=new na,m[je]=it);let We=u.getCameraImage(je);it.sourceTexture=We}}}}for(let _e=0;_e<S.length;_e++){let Oe=M[_e],be=S[_e];Oe!==null&&be!==void 0&&be.update(Oe,ee,c||a)}rt&&rt(Z,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),p=null}let Qe=new Mp;Qe.setAnimationLoop(Ye),this.setAnimationLoop=function(Z){rt=Z},this.dispose=function(){}}},zv=new ke,Ap=new Ge;Ap.set(-1,0,0,0,1,0,0,0,1);function Hv(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Wu(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,v,E,y){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,y)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,v,E):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===dn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===dn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let v=e.get(m),E=v.envMap,y=v.envMapRotation;E&&(g.envMap.value=E,g.envMapRotation.value.setFromMatrix4(zv.makeRotationFromEuler(y)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Ap),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,v,E){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*v,g.scale.value=E*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,v){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===dn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){let v=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Gv(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,S){let M=S.program;n.uniformBlockBinding(y,M)}function c(y,S){let M=s[y.id];M===void 0&&(g(y),M=h(y),s[y.id]=M,y.addEventListener("dispose",v));let A=S.program;n.updateUBOMapping(y,A);let _=e.render.frame;r[y.id]!==_&&(d(y),r[y.id]=_)}function h(y){let S=u();y.__bindingPointIndex=S;let M=i.createBuffer(),A=y.__size,_=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,A,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,M),M}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return ze("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){let S=s[y.id],M=y.uniforms,A=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let _=0,w=M.length;_<w;_++){let R=M[_];if(Array.isArray(R))for(let L=0,D=R.length;L<D;L++)f(R[L],_,L,A);else f(R,_,0,A)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,S,M,A){if(x(y,S,M,A)===!0){let _=y.__offset,w=y.value;if(Array.isArray(w)){let R=0;for(let L=0;L<w.length;L++){let D=w[L],k=m(D);p(D,y.__data,R),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(R+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(w,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,y.__data)}}function p(y,S,M){typeof y=="number"||typeof y=="boolean"?S[0]=y:y.isMatrix3?(S[0]=y.elements[0],S[1]=y.elements[1],S[2]=y.elements[2],S[3]=0,S[4]=y.elements[3],S[5]=y.elements[4],S[6]=y.elements[5],S[7]=0,S[8]=y.elements[6],S[9]=y.elements[7],S[10]=y.elements[8],S[11]=0):ArrayBuffer.isView(y)?S.set(new y.constructor(y.buffer,y.byteOffset,S.length)):y.toArray(S,M)}function x(y,S,M,A){let _=y.value,w=S+"_"+M;if(A[w]===void 0)return typeof _=="number"||typeof _=="boolean"?A[w]=_:ArrayBuffer.isView(_)?A[w]=_.slice():A[w]=_.clone(),!0;{let R=A[w];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return A[w]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function g(y){let S=y.uniforms,M=0,A=16;for(let w=0,R=S.length;w<R;w++){let L=Array.isArray(S[w])?S[w]:[S[w]];for(let D=0,k=L.length;D<k;D++){let N=L[D],H=Array.isArray(N.value)?N.value:[N.value];for(let j=0,$=H.length;j<$;j++){let se=H[j],X=m(se),ne=M%A,ie=ne%X.boundary,Ce=ne+ie;M+=ie,Ce!==0&&A-Ce<X.storage&&(M+=A-Ce),N.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=M,M+=X.storage}}}let _=M%A;return _>0&&(M+=A-_),y.__size=M,y.__cache={},this}function m(y){let S={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(S.boundary=4,S.storage=4):y.isVector2?(S.boundary=8,S.storage=8):y.isVector3||y.isColor?(S.boundary=16,S.storage=12):y.isVector4?(S.boundary=16,S.storage=16):y.isMatrix3?(S.boundary=48,S.storage=48):y.isMatrix4?(S.boundary=64,S.storage=64):y.isTexture?Fe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(S.boundary=16,S.storage=y.byteLength):Fe("WebGLRenderer: Unsupported uniform value type.",y),S}function v(y){let S=y.target;S.removeEventListener("dispose",v);let M=a.indexOf(S.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function E(){for(let y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:E}}var Vv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),di=null;function Wv(){return di===null&&(di=new ri(Vv,16,16,ji,qt),di.name="DFG_LUT",di.minFilter=Bt,di.magFilter=Bt,di.wrapS=sn,di.wrapT=sn,di.generateMipmaps=!1,di.needsUpdate=!0),di}var Ql=class{constructor(e={}){let{canvas:t=Yf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=rn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let x=f,g=new Set([xl,gl,ml]),m=new Set([rn,Yn,dr,$i,dl,fl]),v=new Uint32Array(4),E=new Int32Array(4),y=new P,S=null,M=null,A=[],_=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Xn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,L=!1,D=null,k=null,N=null,H=null;this._outputColorSpace=wt;let j=0,$=0,se=null,X=-1,ne=null,ie=new xt,Ce=new xt,Pe=null,rt=new Re(0),Ye=0,Qe=t.width,Z=t.height,ee=1,_e=null,Oe=null,be=new xt(0,0,Qe,Z),He=new xt(0,0,Qe,Z),dt=!1,Ve=new er,je=!1,it=!1,We=new ke,ot=new P,Pt=new xt,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},mt=!1;function ht(){return se===null?ee:1}let F=n;function St(T,O){return t.getContext(T,O)}let st,C,b,B,G,Y,ue,me,Q,te,ge,De,pe,fe,z,K,he,I,ce,J,de,ye,re;try{let T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Et,!1),t.addEventListener("webglcontextrestored",ft,!1),t.addEventListener("webglcontextcreationerror",Fn,!1),F===null){let O="webgl2";if(F=St(O,T),F===null)throw St(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ne()}catch(T){throw t.removeEventListener("webglcontextlost",Et,!1),t.removeEventListener("webglcontextrestored",ft,!1),t.removeEventListener("webglcontextcreationerror",Fn,!1),ze("WebGLRenderer: "+T.message),T}function Ne(){st=new jy(F),st.init(),de=new Ov(F,st),C=new Hy(F,st,e,de),b=new Uv(F,st),C.reversedDepthBuffer&&d&&b.buffers.depth.setReversed(!0),k=F.createFramebuffer(),N=F.createFramebuffer(),H=F.createFramebuffer(),B=new e_(F),G=new Mv,Y=new Fv(F,st,b,G,C,de,B),ue=new $y(R),me=new ng(F),ye=new ky(F,me),Q=new Jy(F,me,B,ye),te=new n_(F,Q,me,ye,B),I=new t_(F,C,Y),z=new Gy(G),ge=new vv(R,ue,st,C,ye,z),De=new Hv(R,G),pe=new Sv,fe=new Cv(st),he=new By(R,ue,b,te,p,l),K=new Nv(R,te,C),re=new Gv(F,B,C,b),ce=new zy(F,st,B),J=new Qy(F,st,B),B.programs=ge.programs,R.capabilities=C,R.extensions=st,R.properties=G,R.renderLists=pe,R.shadowMap=K,R.state=b,R.info=B}x!==rn&&(w=new s_(x,t.width,t.height,o,s,r));let Te=new fh(R,F);this.xr=Te,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let T=st.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=st.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(T){T!==void 0&&(ee=T,this.setSize(Qe,Z,!1))},this.getSize=function(T){return T.set(Qe,Z)},this.setSize=function(T,O,q=!0){if(Te.isPresenting){Fe("WebGLRenderer: Can't change size while VR device is presenting.");return}Qe=T,Z=O,t.width=Math.floor(T*ee),t.height=Math.floor(O*ee),q===!0&&(t.style.width=T+"px",t.style.height=O+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(Qe*ee,Z*ee).floor()},this.setDrawingBufferSize=function(T,O,q){Qe=T,Z=O,ee=q,t.width=Math.floor(T*q),t.height=Math.floor(O*q),this.setViewport(0,0,T,O)},this.setEffects=function(T){if(x===rn){ze("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let O=0;O<T.length;O++)if(T[O].isOutputPass===!0){Fe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(ie)},this.getViewport=function(T){return T.copy(be)},this.setViewport=function(T,O,q,V){T.isVector4?be.set(T.x,T.y,T.z,T.w):be.set(T,O,q,V),b.viewport(ie.copy(be).multiplyScalar(ee).round())},this.getScissor=function(T){return T.copy(He)},this.setScissor=function(T,O,q,V){T.isVector4?He.set(T.x,T.y,T.z,T.w):He.set(T,O,q,V),b.scissor(Ce.copy(He).multiplyScalar(ee).round())},this.getScissorTest=function(){return dt},this.setScissorTest=function(T){b.setScissorTest(dt=T)},this.setOpaqueSort=function(T){_e=T},this.setTransparentSort=function(T){Oe=T},this.getClearColor=function(T){return T.copy(he.getClearColor())},this.setClearColor=function(){he.setClearColor(...arguments)},this.getClearAlpha=function(){return he.getClearAlpha()},this.setClearAlpha=function(){he.setClearAlpha(...arguments)},this.clear=function(T=!0,O=!0,q=!0){let V=0;if(T){let W=!1;if(se!==null){let Se=se.texture.format;W=g.has(Se)}if(W){let Se=se.texture.type,Ae=m.has(Se),Me=he.getClearColor(),Ie=he.getClearAlpha(),Ue=Me.r,Ze=Me.g,tt=Me.b;Ae?(v[0]=Ue,v[1]=Ze,v[2]=tt,v[3]=Ie,F.clearBufferuiv(F.COLOR,0,v)):(E[0]=Ue,E[1]=Ze,E[2]=tt,E[3]=Ie,F.clearBufferiv(F.COLOR,0,E))}else V|=F.COLOR_BUFFER_BIT}O&&(V|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(V|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&F.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),D=T},this.dispose=function(){t.removeEventListener("webglcontextlost",Et,!1),t.removeEventListener("webglcontextrestored",ft,!1),t.removeEventListener("webglcontextcreationerror",Fn,!1),he.dispose(),pe.dispose(),fe.dispose(),G.dispose(),ue.dispose(),te.dispose(),ye.dispose(),re.dispose(),ge.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",Md),Te.removeEventListener("sessionend",bd),ts.stop()};function Et(T){T.preventDefault(),Gr("WebGLRenderer: Context Lost."),L=!0}function ft(){Gr("WebGLRenderer: Context Restored."),L=!1;let T=B.autoReset,O=K.enabled,q=K.autoUpdate,V=K.needsUpdate,W=K.type;Ne(),B.autoReset=T,K.enabled=O,K.autoUpdate=q,K.needsUpdate=V,K.type=W}function Fn(T){ze("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Qn(T){let O=T.target;O.removeEventListener("dispose",Qn),Pm(O)}function Pm(T){Im(T),G.remove(T)}function Im(T){let O=G.get(T).programs;O!==void 0&&(O.forEach(function(q){ge.releaseProgram(q)}),T.isShaderMaterial&&ge.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,q,V,W,Se){O===null&&(O=Ft);let Ae=W.isMesh&&W.matrixWorld.determinantAffine()<0,Me=Nm(T,O,q,V,W);b.setMaterial(V,Ae);let Ie=q.index,Ue=1;if(V.wireframe===!0){if(Ie=Q.getWireframeAttribute(q),Ie===void 0)return;Ue=2}let Ze=q.drawRange,tt=q.attributes.position,Le=Ze.start*Ue,pt=(Ze.start+Ze.count)*Ue;Se!==null&&(Le=Math.max(Le,Se.start*Ue),pt=Math.min(pt,(Se.start+Se.count)*Ue)),Ie!==null?(Le=Math.max(Le,0),pt=Math.min(pt,Ie.count)):tt!=null&&(Le=Math.max(Le,0),pt=Math.min(pt,tt.count));let Gt=pt-Le;if(Gt<0||Gt===1/0)return;ye.setup(W,V,Me,q,Ie);let Rt,_t=ce;if(Ie!==null&&(Rt=me.get(Ie),_t=J,_t.setIndex(Rt)),W.isMesh)V.wireframe===!0?(b.setLineWidth(V.wireframeLinewidth*ht()),_t.setMode(F.LINES)):_t.setMode(F.TRIANGLES);else if(W.isLine){let en=V.linewidth;en===void 0&&(en=1),b.setLineWidth(en*ht()),W.isLineSegments?_t.setMode(F.LINES):W.isLineLoop?_t.setMode(F.LINE_LOOP):_t.setMode(F.LINE_STRIP)}else W.isPoints?_t.setMode(F.POINTS):W.isSprite&&_t.setMode(F.TRIANGLES);if(W.isBatchedMesh)if(st.get("WEBGL_multi_draw"))_t.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let en=W._multiDrawStarts,we=W._multiDrawCounts,ln=W._multiDrawCount,lt=Ie?me.get(Ie).bytesPerElement:1,Rn=G.get(V).currentProgram.getUniforms();for(let ei=0;ei<ln;ei++)Rn.setValue(F,"_gl_DrawID",ei),_t.render(en[ei]/lt,we[ei])}else if(W.isInstancedMesh)_t.renderInstances(Le,Gt,W.count);else if(q.isInstancedBufferGeometry){let en=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,we=Math.min(q.instanceCount,en);_t.renderInstances(Le,Gt,we)}else _t.render(Le,Gt)};function vd(T,O,q,V){D!==null&&T.isNodeMaterial&&D.setObject(V,T),je===!0&&z.setState(T,q,!1),T.transparent===!0&&T.side===Ut&&T.forceSinglePass===!1?(T.side=dn,T.needsUpdate=!0,Qa(T,O,V),T.side=ui,T.needsUpdate=!0,Qa(T,O,V),T.side=Ut):Qa(T,O,V)}this.compile=function(T,O,q=null){q===null&&(q=T),D!==null&&D.renderStart(T,O,q),M=fe.get(q),M.init(O),_.push(M),q.traverseVisible(function(W){W.isLight&&W.layers.test(O.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),T!==q&&T.traverseVisible(function(W){W.isLight&&W.layers.test(O.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),M.setupLights(),D!==null&&D.updateLights(M.state.lightsArray),it=this.localClippingEnabled,je=z.init(this.clippingPlanes,it),je===!0&&z.setGlobalState(this.clippingPlanes,O),D!==null&&K.render(M.state.shadowsArray,q,O);let V=new Set;return T.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let Se=W.material;if(Se)if(Array.isArray(Se))for(let Ae=0;Ae<Se.length;Ae++){let Me=Se[Ae];vd(Me,q,O,W),V.add(Me)}else vd(Se,q,O,W),V.add(Se)}),M=_.pop(),D!==null&&D.renderEnd(),V},this.compileAsync=function(T,O,q=null){let V=this.compile(T,O,q);return new Promise(W=>{function Se(){if(V.forEach(function(Ae){let Ie=G.get(Ae).currentProgram;(Ie===void 0||Ie.isReady())&&V.delete(Ae)}),V.size===0){W(T);return}setTimeout(Se,10)}st.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let Oc=null;function Lm(T){Oc&&Oc(T)}function Md(){ts.stop()}function bd(){ts.start()}let ts=new Mp;ts.setAnimationLoop(Lm),typeof self<"u"&&ts.setContext(self),this.setAnimationLoop=function(T){Oc=T,Te.setAnimationLoop(T),T===null?ts.stop():ts.start()},Te.addEventListener("sessionstart",Md),Te.addEventListener("sessionend",bd),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;D!==null&&D.renderStart(T,O);let q=Te.enabled===!0&&Te.isPresenting===!0,V=w!==null&&(se===null||q)&&w.begin(R,se);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(O),O=Te.getCamera()),T.isScene===!0&&T.onBeforeRender(R,T,O,se),M=fe.get(T,_.length),M.init(O),M.state.textureUnits=Y.getTextureUnits(),_.push(M),We.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Ve.setFromProjectionMatrix(We,Gn,O.reversedDepth),it=this.localClippingEnabled,je=z.init(this.clippingPlanes,it),S=pe.get(T,A.length),S.init(),A.push(S),Te.enabled===!0&&Te.isPresenting===!0){let Ae=R.xr.getDepthSensingMesh();Ae!==null&&Bc(Ae,O,-1/0,R.sortObjects)}Bc(T,O,0,R.sortObjects),S.finish(),D!==null&&D.updateLights(M.state.lightsArray),R.sortObjects===!0&&S.sort(_e,Oe),mt=Te.enabled===!1||Te.isPresenting===!1||Te.hasDepthSensing()===!1,mt&&he.addToRenderList(S,T),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),je===!0&&z.beginShadows();let W=M.state.shadowsArray;if(K.render(W,T,O),je===!0&&z.endShadows(),(V&&w.hasRenderPass())===!1){let Ae=S.opaque,Me=S.transmissive;if(M.setupLights(),O.isArrayCamera){let Ie=O.cameras;if(Me.length>0)for(let Ue=0,Ze=Ie.length;Ue<Ze;Ue++){let tt=Ie[Ue];Ed(Ae,Me,T,tt)}mt&&he.render(T);for(let Ue=0,Ze=Ie.length;Ue<Ze;Ue++){let tt=Ie[Ue];Sd(S,T,tt,tt.viewport)}}else Me.length>0&&Ed(Ae,Me,T,O),mt&&he.render(T),Sd(S,T,O)}se!==null&&$===0&&(Y.updateMultisampleRenderTarget(se),Y.updateRenderTargetMipmap(se)),V&&w.end(R),T.isScene===!0&&T.onAfterRender(R,T,O),ye.resetDefaultState(),X=-1,ne=null,_.pop(),_.length>0?(M=_[_.length-1],Y.setTextureUnits(M.state.textureUnits),je===!0&&z.setGlobalState(R.clippingPlanes,M.state.camera)):M=null,A.pop(),A.length>0?S=A[A.length-1]:S=null,D!==null&&D.renderEnd()};function Bc(T,O,q,V){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)q=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLightProbeGrid)M.pushLightProbeGrid(T);else if(T.isLight)M.pushLight(T),T.castShadow&&M.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||T.intersectsFrustum(Ve)){V&&Pt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(We);let Ae=te.update(T),Me=T.material;Me.visible&&S.push(T,Ae,Me,q,Pt.z,null,O)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||T.intersectsFrustum(Ve))){let Ae=te.update(T),Me=T.material;if(V&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Pt.copy(T.boundingSphere.center)):(Ae.boundingSphere===null&&Ae.computeBoundingSphere(),Pt.copy(Ae.boundingSphere.center)),Pt.applyMatrix4(T.matrixWorld).applyMatrix4(We)),Array.isArray(Me)){let Ie=Ae.groups;for(let Ue=0,Ze=Ie.length;Ue<Ze;Ue++){let tt=Ie[Ue],Le=Me[tt.materialIndex];Le&&Le.visible&&S.push(T,Ae,Le,q,Pt.z,tt,O)}}else Me.visible&&S.push(T,Ae,Me,q,Pt.z,null,O)}}let Se=T.children;for(let Ae=0,Me=Se.length;Ae<Me;Ae++)Bc(Se[Ae],O,q,V)}function Sd(T,O,q,V){let{opaque:W,transmissive:Se,transparent:Ae}=T;M.setupLightsView(q),je===!0&&z.setGlobalState(R.clippingPlanes,q),V&&b.viewport(ie.copy(V)),W.length>0&&Ja(W,O,q),Se.length>0&&Ja(Se,O,q),Ae.length>0&&Ja(Ae,O,q),b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}function Ed(T,O,q,V){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[V.id]===void 0){let Le=st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[V.id]=new Nt(1,1,{generateMipmaps:!0,type:Le?qt:rn,minFilter:qn,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ke.workingColorSpace})}let Se=M.state.transmissionRenderTarget[V.id],Ae=V.viewport||ie;Se.setSize(Ae.z*R.transmissionResolutionScale,Ae.w*R.transmissionResolutionScale);let Me=R.getRenderTarget(),Ie=R.getActiveCubeFace(),Ue=R.getActiveMipmapLevel();R.setRenderTarget(Se),R.getClearColor(rt),Ye=R.getClearAlpha(),Ye<1&&R.setClearColor(16777215,.5),R.clear(),mt&&he.render(q);let Ze=R.toneMapping;R.toneMapping=Xn;let tt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),M.setupLightsView(V),je===!0&&z.setGlobalState(R.clippingPlanes,V),Ja(T,q,V),Y.updateMultisampleRenderTarget(Se),Y.updateRenderTargetMipmap(Se),st.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let pt=0,Gt=O.length;pt<Gt;pt++){let Rt=O[pt],{object:_t,geometry:en,material:we,group:ln}=Rt;if(we.side===Ut&&_t.layers.test(V.layers)){let lt=we.side;we.side=dn,we.needsUpdate=!0,Td(_t,q,V,en,we,ln),we.side=lt,we.needsUpdate=!0,Le=!0}}Le===!0&&(Y.updateMultisampleRenderTarget(Se),Y.updateRenderTargetMipmap(Se))}R.setRenderTarget(Me,Ie,Ue),R.setClearColor(rt,Ye),tt!==void 0&&(V.viewport=tt),R.toneMapping=Ze}function Ja(T,O,q){let V=O.isScene===!0?O.overrideMaterial:null;for(let W=0,Se=T.length;W<Se;W++){let Ae=T[W],{object:Me,geometry:Ie,group:Ue}=Ae,Ze=Ae.material;Ze.allowOverride===!0&&V!==null&&(Ze=V),Me.layers.test(q.layers)&&Td(Me,O,q,Ie,Ze,Ue)}}function Td(T,O,q,V,W,Se){D!==null&&W.isNodeMaterial&&D.setObject(T,W),T.onBeforeRender(R,O,q,V,W,Se),T.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),W.onBeforeRender(R,O,q,V,T,Se),W.transparent===!0&&W.side===Ut&&W.forceSinglePass===!1?(W.side=dn,W.needsUpdate=!0,R.renderBufferDirect(q,O,V,W,T,Se),W.side=ui,W.needsUpdate=!0,R.renderBufferDirect(q,O,V,W,T,Se),W.side=Ut):R.renderBufferDirect(q,O,V,W,T,Se),T.onAfterRender(R,O,q,V,W,Se)}function Qa(T,O,q){O.isScene!==!0&&(O=Ft);let V=G.get(T),W=M.state.lights,Se=M.state.shadowsArray,Ae=W.state.version,Me=ge.getParameters(T,W.state,Se,O,q,M.state.lightProbeGridArray),Ie=ge.getProgramCacheKey(Me),Ue=V.programs;V.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?O.environment:null,V.fog=O.fog;let Ze=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;V.envMap=ue.get(T.envMap||V.environment,Ze),V.envMapRotation=V.environment!==null&&T.envMap===null?O.environmentRotation:T.envMapRotation,Ue===void 0&&(T.addEventListener("dispose",Qn),Ue=new Map,V.programs=Ue);let tt=Ue.get(Ie);if(tt!==void 0){if(V.currentProgram===tt&&V.lightsStateVersion===Ae)return Ad(T,Me),tt}else Me.uniforms=ge.getUniforms(T),D!==null&&T.isNodeMaterial&&D.build(T,q,Me),T.onBeforeCompile(Me,R),tt=ge.acquireProgram(Me,Ie),Ue.set(Ie,tt),V.uniforms=Me.uniforms;let Le=V.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Le.clippingPlanes=z.uniform),Ad(T,Me),V.needsLights=Fm(T),V.lightsStateVersion=Ae,V.needsLights&&(Le.ambientLightColor.value=W.state.ambient,Le.lightProbe.value=W.state.probe,Le.sunLights.value=W.state.sun,Le.sunLightShadows.value=W.state.sunShadow,Le.directionalLights.value=W.state.directional,Le.directionalLightShadows.value=W.state.directionalShadow,Le.spotLights.value=W.state.spot,Le.spotLightShadows.value=W.state.spotShadow,Le.rectAreaLights.value=W.state.rectArea,Le.ltc_1.value=W.state.rectAreaLTC1,Le.ltc_2.value=W.state.rectAreaLTC2,Le.pointLights.value=W.state.point,Le.pointLightShadows.value=W.state.pointShadow,Le.hemisphereLights.value=W.state.hemi,Le.sunShadowMatrix.value=W.state.sunShadowMatrix,Le.sunShadowCascade.value=W.state.sunShadowCascade,Le.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Le.spotLightMatrix.value=W.state.spotLightMatrix,Le.spotLightMap.value=W.state.spotLightMap,Le.pointShadowMatrix.value=W.state.pointShadowMatrix),V.lightProbeGrid=M.state.lightProbeGridArray.length>0,V.currentProgram=tt,V.uniformsList=null,tt}function wd(T){if(T.uniformsList===null){let O=T.currentProgram.getUniforms();T.uniformsList=gr.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function Ad(T,O){let q=G.get(T);q.outputColorSpace=O.outputColorSpace,q.batching=O.batching,q.batchingColor=O.batchingColor,q.instancing=O.instancing,q.instancingColor=O.instancingColor,q.instancingMorph=O.instancingMorph,q.skinning=O.skinning,q.morphTargets=O.morphTargets,q.morphNormals=O.morphNormals,q.morphColors=O.morphColors,q.morphTargetsCount=O.morphTargetsCount,q.numClippingPlanes=O.numClippingPlanes,q.numIntersection=O.numClipIntersection,q.vertexAlphas=O.vertexAlphas,q.vertexTangents=O.vertexTangents,q.toneMapping=O.toneMapping}function Dm(T,O){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;y.setFromMatrixPosition(O.matrixWorld);for(let q=0,V=T.length;q<V;q++){let W=T[q];if(W.texture!==null&&W.boundingBox.containsPoint(y))return W}return null}function Nm(T,O,q,V,W){O.isScene!==!0&&(O=Ft),Y.resetTextureUnits();let Se=O.fog,Ae=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?O.environment:null,Me=se===null?R.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:Ke.workingColorSpace,Ie=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Ue=ue.get(V.envMap||Ae,Ie),Ze=V.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,tt=!!q.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Le=!!q.morphAttributes.position,pt=!!q.morphAttributes.normal,Gt=!!q.morphAttributes.color,Rt=Xn;V.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(Rt=R.toneMapping);let _t=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,en=_t!==void 0?_t.length:0,we=G.get(V),ln=M.state.lights;if(je===!0&&(it===!0||T!==ne)){let Tt=T===ne&&V.id===X;z.setState(V,T,Tt)}let lt=!1;V.version===we.__version?(we.needsLights&&we.lightsStateVersion!==ln.state.version||we.outputColorSpace!==Me||W.isBatchedMesh&&we.batching===!1||!W.isBatchedMesh&&we.batching===!0||W.isBatchedMesh&&we.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&we.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&we.instancing===!1||!W.isInstancedMesh&&we.instancing===!0||W.isSkinnedMesh&&we.skinning===!1||!W.isSkinnedMesh&&we.skinning===!0||W.isInstancedMesh&&we.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&we.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&we.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&we.instancingMorph===!1&&W.morphTexture!==null||we.envMap!==Ue||V.fog===!0&&we.fog!==Se||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==z.numPlanes||we.numIntersection!==z.numIntersection)||we.vertexAlphas!==Ze||we.vertexTangents!==tt||we.morphTargets!==Le||we.morphNormals!==pt||we.morphColors!==Gt||we.toneMapping!==Rt||we.morphTargetsCount!==en||!!we.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(lt=!0):(lt=!0,we.__version=V.version);let Rn=we.currentProgram;lt===!0&&(Rn=Qa(V,O,W),D&&V.isNodeMaterial&&D.onUpdateProgram(V,Rn,we));let ei=!1,Oi=!1,As=!1,yt=Rn.getUniforms(),Ot=we.uniforms;if(b.useProgram(Rn.program)&&(ei=!0,Oi=!0,As=!0),V.id!==X&&(X=V.id,Oi=!0),we.needsLights){let Tt=Dm(M.state.lightProbeGridArray,W);we.lightProbeGrid!==Tt&&(we.lightProbeGrid=Tt,Oi=!0)}if(ei||ne!==T){b.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),yt.setValue(F,"projectionMatrix",T.projectionMatrix),yt.setValue(F,"viewMatrix",T.matrixWorldInverse);let ki=yt.map.cameraPosition;ki!==void 0&&ki.setValue(F,ot.setFromMatrixPosition(T.matrixWorld)),C.logarithmicDepthBuffer&&yt.setValue(F,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&yt.setValue(F,"isOrthographic",T.isOrthographicCamera===!0),ne!==T&&(ne=T,Oi=!0,As=!0)}if(we.needsLights&&(ln.state.sunShadowMap.length>0&&yt.setValue(F,"sunShadowMap",ln.state.sunShadowMap,Y),ln.state.directionalShadowMap.length>0&&yt.setValue(F,"directionalShadowMap",ln.state.directionalShadowMap,Y),ln.state.spotShadowMap.length>0&&yt.setValue(F,"spotShadowMap",ln.state.spotShadowMap,Y),ln.state.pointShadowMap.length>0&&yt.setValue(F,"pointShadowMap",ln.state.pointShadowMap,Y)),W.isSkinnedMesh){yt.setOptional(F,W,"bindMatrix"),yt.setOptional(F,W,"bindMatrixInverse");let Tt=W.skeleton;Tt&&(Tt.boneTexture===null&&Tt.computeBoneTexture(),yt.setValue(F,"boneTexture",Tt.boneTexture,Y))}W.isBatchedMesh&&(yt.setOptional(F,W,"batchingTexture"),yt.setValue(F,"batchingTexture",W._matricesTexture,Y),yt.setOptional(F,W,"batchingIdTexture"),yt.setValue(F,"batchingIdTexture",W._indirectTexture,Y),yt.setOptional(F,W,"batchingColorTexture"),W._colorsTexture!==null&&yt.setValue(F,"batchingColorTexture",W._colorsTexture,Y));let Bi=q.morphAttributes;if((Bi.position!==void 0||Bi.normal!==void 0||Bi.color!==void 0)&&I.update(W,q,Rn),(Oi||we.receiveShadow!==W.receiveShadow)&&(we.receiveShadow=W.receiveShadow,yt.setValue(F,"receiveShadow",W.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&O.environment!==null&&(Ot.envMapIntensity.value=O.environmentIntensity),Ot.dfgLUT!==void 0&&(Ot.dfgLUT.value=Wv()),Oi){if(yt.setValue(F,"toneMappingExposure",R.toneMappingExposure),we.needsLights&&Um(Ot,As),Se&&V.fog===!0&&De.refreshFogUniforms(Ot,Se),De.refreshMaterialUniforms(Ot,V,ee,Z,M.state.transmissionRenderTarget[T.id]),we.needsLights&&we.lightProbeGrid){let Tt=we.lightProbeGrid;Ot.probesSH.value=Tt.texture,Ot.probesMin.value.copy(Tt.boundingBox.min),Ot.probesMax.value.copy(Tt.boundingBox.max),Ot.probesResolution.value.copy(Tt.resolution)}gr.upload(F,wd(we),Ot,Y)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(gr.upload(F,wd(we),Ot,Y),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&yt.setValue(F,"center",W.center),yt.setValue(F,"modelViewMatrix",W.modelViewMatrix),yt.setValue(F,"normalMatrix",W.normalMatrix),yt.setValue(F,"modelMatrix",W.matrixWorld),V.uniformsGroups!==void 0){let Tt=V.uniformsGroups;for(let ki=0,Rs=Tt.length;ki<Rs;ki++){let Cd=Tt[ki];re.update(Cd,Rn),re.bind(Cd,Rn)}}return Rn}function Um(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.sunLights.needsUpdate=O,T.sunLightShadows.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function Fm(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return se},this.setRenderTargetTextures=function(T,O,q){let V=G.get(T);V.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),G.get(T.texture).__webglTexture=O,G.get(T.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:q,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,O){let q=G.get(T);q.__webglFramebuffer=O,q.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(T,O=0,q=0){se=T,j=O,$=q;let V=null,W=!1,Se=!1;if(T){let Me=G.get(T);if(Me.__useDefaultFramebuffer!==void 0){b.bindFramebuffer(F.FRAMEBUFFER,Me.__webglFramebuffer),ie.copy(T.viewport),Ce.copy(T.scissor),Pe=T.scissorTest,b.viewport(ie),b.scissor(Ce),b.setScissorTest(Pe),X=-1;return}else if(Me.__webglFramebuffer===void 0)Y.setupRenderTarget(T);else if(Me.__hasExternalTextures)Y.rebindTextures(T,G.get(T.texture).__webglTexture,G.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Ze=T.depthTexture;if(Me.__boundDepthTexture!==Ze){if(Ze!==null&&G.has(Ze)&&(T.width!==Ze.image.width||T.height!==Ze.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Y.setupDepthRenderbuffer(T)}}let Ie=T.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(Se=!0);let Ue=G.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ue[O])?V=Ue[O][q]:V=Ue[O],W=!0):T.samples>0&&Y.useMultisampledRTT(T)===!1?V=G.get(T).__webglMultisampledFramebuffer:Array.isArray(Ue)?V=Ue[q]:V=Ue,ie.copy(T.viewport),Ce.copy(T.scissor),Pe=T.scissorTest}else ie.copy(be).multiplyScalar(ee).floor(),Ce.copy(He).multiplyScalar(ee).floor(),Pe=dt;if(q!==0&&(V=k),b.bindFramebuffer(F.FRAMEBUFFER,V)&&b.drawBuffers(T,V),b.viewport(ie),b.scissor(Ce),b.setScissorTest(Pe),W){let Me=G.get(T.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+O,Me.__webglTexture,q)}else if(Se){let Me=O;for(let Ie=0;Ie<T.textures.length;Ie++){let Ue=G.get(T.textures[Ie]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Ie,Ue.__webglTexture,q,Me)}}else if(T!==null&&q!==0){let Me=G.get(T.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Me.__webglTexture,q)}X=-1};function Rd(T){let O=G.get(T);return(O.__readFormat!==T.format||O.__readType!==T.type)&&(O.__readFormat=T.format,O.__readType=T.type,O.__formatReadable=C.textureFormatReadable(T.format),O.__typeReadable=C.textureTypeReadable(T.type)),O}this.readRenderTargetPixels=function(T,O,q,V,W,Se,Ae,Me=0){if(!(T&&T.isWebGLRenderTarget)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=G.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ae!==void 0&&(Ie=Ie[Ae]),Ie){b.bindFramebuffer(F.FRAMEBUFFER,Ie);try{let Ue=T.textures[Me],Ze=Ue.format,tt=Ue.type;T.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Me);let Le=Rd(Ue);if(Le.__formatReadable===!1){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Le.__typeReadable===!1){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-V&&q>=0&&q<=T.height-W&&F.readPixels(O,q,V,W,de.convert(Ze),de.convert(tt),Se)}finally{let Ue=se!==null?G.get(se).__webglFramebuffer:null;b.bindFramebuffer(F.FRAMEBUFFER,Ue)}}},this.readRenderTargetPixelsAsync=async function(T,O,q,V,W,Se,Ae,Me=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=G.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ae!==void 0&&(Ie=Ie[Ae]),Ie)if(O>=0&&O<=T.width-V&&q>=0&&q<=T.height-W){b.bindFramebuffer(F.FRAMEBUFFER,Ie);let Ue=T.textures[Me],Ze=Ue.format,tt=Ue.type;T.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Me);let Le=Rd(Ue);if(Le.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Le.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let pt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,pt),F.bufferData(F.PIXEL_PACK_BUFFER,Se.byteLength,F.STREAM_READ),F.readPixels(O,q,V,W,de.convert(Ze),de.convert(tt),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let Gt=se!==null?G.get(se).__webglFramebuffer:null;b.bindFramebuffer(F.FRAMEBUFFER,Gt);let Rt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Zf(F,Rt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,pt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Se),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(pt),F.deleteSync(Rt),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,O=null,q=0){let V=Math.pow(2,-q),W=Math.floor(T.image.width*V),Se=Math.floor(T.image.height*V),Ae=O!==null?O.x:0,Me=O!==null?O.y:0;Y.setTexture2D(T,0),F.copyTexSubImage2D(F.TEXTURE_2D,q,0,0,Ae,Me,W,Se),b.unbindTexture()},this.copyTextureToTexture=function(T,O,q=null,V=null,W=0,Se=0){let Ae,Me,Ie,Ue,Ze,tt,Le,pt,Gt,Rt=T.isCompressedTexture?T.mipmaps[Se]:T.image;if(q!==null)Ae=q.max.x-q.min.x,Me=q.max.y-q.min.y,Ie=q.isBox3?q.max.z-q.min.z:1,Ue=q.min.x,Ze=q.min.y,tt=q.isBox3?q.min.z:0;else{let Ot=Math.pow(2,-W);Ae=Math.floor(Rt.width*Ot),Me=Math.floor(Rt.height*Ot),T.isDataArrayTexture?Ie=Rt.depth:T.isData3DTexture?Ie=Math.floor(Rt.depth*Ot):Ie=1,Ue=0,Ze=0,tt=0}V!==null?(Le=V.x,pt=V.y,Gt=V.z):(Le=0,pt=0,Gt=0);let _t=de.convert(O.format),en=de.convert(O.type),we;O.isData3DTexture?(Y.setTexture3D(O,0),we=F.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(Y.setTexture2DArray(O,0),we=F.TEXTURE_2D_ARRAY):(Y.setTexture2D(O,0),we=F.TEXTURE_2D),b.activeTexture(F.TEXTURE0),b.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,O.flipY),b.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),b.pixelStorei(F.UNPACK_ALIGNMENT,O.unpackAlignment);let ln=b.getParameter(F.UNPACK_ROW_LENGTH),lt=b.getParameter(F.UNPACK_IMAGE_HEIGHT),Rn=b.getParameter(F.UNPACK_SKIP_PIXELS),ei=b.getParameter(F.UNPACK_SKIP_ROWS),Oi=b.getParameter(F.UNPACK_SKIP_IMAGES);b.pixelStorei(F.UNPACK_ROW_LENGTH,Rt.width),b.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Rt.height),b.pixelStorei(F.UNPACK_SKIP_PIXELS,Ue),b.pixelStorei(F.UNPACK_SKIP_ROWS,Ze),b.pixelStorei(F.UNPACK_SKIP_IMAGES,tt);let As=T.isDataArrayTexture||T.isData3DTexture,yt=O.isDataArrayTexture||O.isData3DTexture;if(T.isDepthTexture){let Ot=G.get(T),Bi=G.get(O),Tt=G.get(Ot.__renderTarget),ki=G.get(Bi.__renderTarget);b.bindFramebuffer(F.READ_FRAMEBUFFER,Tt.__webglFramebuffer),b.bindFramebuffer(F.DRAW_FRAMEBUFFER,ki.__webglFramebuffer);for(let Rs=0;Rs<Ie;Rs++)As&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,G.get(T).__webglTexture,W,tt+Rs),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,G.get(O).__webglTexture,Se,Gt+Rs)),F.blitFramebuffer(Ue,Ze,Ae,Me,Le,pt,Ae,Me,F.DEPTH_BUFFER_BIT,F.NEAREST);b.bindFramebuffer(F.READ_FRAMEBUFFER,null),b.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(W!==0||T.isRenderTargetTexture||G.has(T)){let Ot=G.get(T),Bi=G.get(O);b.bindFramebuffer(F.READ_FRAMEBUFFER,N),b.bindFramebuffer(F.DRAW_FRAMEBUFFER,H);for(let Tt=0;Tt<Ie;Tt++)As?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ot.__webglTexture,W,tt+Tt):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Ot.__webglTexture,W),yt?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Bi.__webglTexture,Se,Gt+Tt):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Bi.__webglTexture,Se),W!==0?F.blitFramebuffer(Ue,Ze,Ae,Me,Le,pt,Ae,Me,F.COLOR_BUFFER_BIT,F.NEAREST):yt?F.copyTexSubImage3D(we,Se,Le,pt,Gt+Tt,Ue,Ze,Ae,Me):F.copyTexSubImage2D(we,Se,Le,pt,Ue,Ze,Ae,Me);b.bindFramebuffer(F.READ_FRAMEBUFFER,null),b.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else yt?T.isDataTexture||T.isData3DTexture?F.texSubImage3D(we,Se,Le,pt,Gt,Ae,Me,Ie,_t,en,Rt.data):O.isCompressedArrayTexture?F.compressedTexSubImage3D(we,Se,Le,pt,Gt,Ae,Me,Ie,_t,Rt.data):F.texSubImage3D(we,Se,Le,pt,Gt,Ae,Me,Ie,_t,en,Rt):T.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,Se,Le,pt,Ae,Me,_t,en,Rt.data):T.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,Se,Le,pt,Rt.width,Rt.height,_t,Rt.data):F.texSubImage2D(F.TEXTURE_2D,Se,Le,pt,Ae,Me,_t,en,Rt);b.pixelStorei(F.UNPACK_ROW_LENGTH,ln),b.pixelStorei(F.UNPACK_IMAGE_HEIGHT,lt),b.pixelStorei(F.UNPACK_SKIP_PIXELS,Rn),b.pixelStorei(F.UNPACK_SKIP_ROWS,ei),b.pixelStorei(F.UNPACK_SKIP_IMAGES,Oi),Se===0&&O.generateMipmaps&&F.generateMipmap(we),b.unbindTexture()},this.initRenderTarget=function(T){G.get(T).__webglFramebuffer===void 0&&Y.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Y.setTextureCube(T,0):T.isData3DTexture?Y.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Y.setTexture2DArray(T,0):Y.setTexture2D(T,0),b.unbindTexture()},this.resetState=function(){j=0,$=0,se=null,b.reset(),ye.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}};var wn=2.4,_r=1024,Di=512,Xv=(i,e=_r,t=wn)=>i/1e3/t*e;function Li(i,e,t=!1,n=wn){let s=Math.max(2,Math.round(e/Xv(i,e,n)));return t&&s%2&&(s+=1),Math.min(s,e)}var gh=4.5,qv=3;function At(i=Di,e=i){let t=document.createElement("canvas");return t.width=i,t.height=e,t}var Pp=[],Ip=0,Yv={tileM:wn,ext:_r,noise:Di,surfaces:Pp,get normalMapsBuilt(){return Ip}};typeof window<"u"&&(window.__matDebug=Yv);var Kv=["concrete","asphalt","paver","stone","grass"];function An(i,e={}){let{normalScale:t=1,kind:n="tex",metersPerRepeat:s=wn,height:r=null,clamp:a=!1,repeat:o=null}=e,l=new Pn(i);l.colorSpace=wt,l.wrapS=l.wrapT=a?sn:Qt,o&&l.repeat.set(o[0],o[1]),l.anisotropy=8;let c=Kv.includes(n);return l.userData.surface={kind:n,resolution:i.width,metersPerRepeat:s,normalScale:t,hasHeight:!!r,height:r,groundFriendly:c},Pp.push({kind:n,resolution:i.width,heightResolution:r?r.width:0,metersPerRepeat:s,normalScale:t,hasHeight:!!r,groundFriendly:c}),l}var ph=null;function Zv(){if(ph)return ph;let i=256,e=At(i,i),t=e.getContext("2d"),n=t.createImageData(i,i),s=n.data;for(let r=0;r<s.length;r+=4){let a=128+(Math.random()-.5)*255;s[r]=s[r+1]=s[r+2]=a,s[r+3]=255}return t.putImageData(n,0,0),ph=e,e}function zt(i,e,t,n){n<=0||(i.save(),i.globalAlpha=Math.min(.85,n/60),i.globalCompositeOperation="overlay",i.fillStyle=i.createPattern(Zv(),"repeat"),i.fillRect(0,0,e,t),i.restore())}function Dn(i,e,t,n,s,r=26){for(let a=0;a<n;a++)i.fillStyle=s(Math.random()),i.beginPath(),i.arc(Math.random()*e,Math.random()*t,4+Math.random()*r,0,Math.PI*2),i.fill()}var $v=1.9;function jv(i){let e=i.width,t=i.height,n=i.getContext("2d").getImageData(0,0,e,t).data,s=At(e,t),r=s.getContext("2d"),a=r.createImageData(e,t),o=(h,u)=>{let d=(h%e+e)%e,f=(u%t+t)%t;return n[(f*e+d)*4]/255},l=$v/4;for(let h=0;h<t;h++)for(let u=0;u<e;u++){let d=o(u-1,h-1),f=o(u,h-1),p=o(u+1,h-1),x=o(u-1,h),g=o(u+1,h),m=o(u-1,h+1),v=o(u,h+1),E=o(u+1,h+1),y=p+2*g+E-(d+2*x+m),S=m+2*v+E-(d+2*f+p),M=-y*l,A=S*l,_=1,w=Math.hypot(M,A,_)||1;M/=w,A/=w,_/=w;let R=(h*e+u)*4;a.data[R]=(M*.5+.5)*255,a.data[R+1]=(A*.5+.5)*255,a.data[R+2]=(_*.5+.5)*255,a.data[R+3]=255}r.putImageData(a,0,0);let c=new Pn(s);return c.colorSpace=Kn,c.wrapS=c.wrapT=Qt,c.anisotropy=8,c.name="normal",Ip++,c}var Rp=new WeakMap;function Jv(i){if(!i)return null;let e=Rp.get(i);return e||(e=jv(i),Rp.set(i,e)),e}function Lp(i){return(e,t=1)=>{i.fillStyle=`rgba(${e},${e},${e},${t})`}}function _n(i,e={}){let{normalScale:t,...n}=e,s=new Ee({map:i,...n}),r=i&&i.userData?i.userData.surface:null,a=t??(r?r.normalScale:0),o=Jv(r&&r.height);return o&&(s.normalMap=o,s.normalScale.set(a,a)),s}function Ni(i,e,t,n=wn){let s=i.clone(),r=Math.max(1e-4,e/n),a=Math.max(1e-4,t/n);return i.map&&(s.map=i.map.clone(),s.map.needsUpdate=!0,s.map.repeat.set(r,a)),i.normalMap&&(s.normalMap=i.normalMap.clone(),s.normalMap.needsUpdate=!0,s.normalMap.repeat.set(r,a)),s}function Dp(i){return i&&i.map&&i.normalMap&&(i.normalMap.repeat.copy(i.map.repeat),i.normalMap.needsUpdate=!0),i}function Oa(i={}){let{base:e="#c9c6bc",grout:t="#9c9a90",tileWMM:n=200,tileHMM:s=300,water:r=16,metersPerRepeat:a=wn}=i,o=_r,l=Li(n,o,!1,a),c=Li(s,o,!1,a),h=o/l,u=o/c,d=At(o),f=d.getContext("2d"),p=At(o),x=p.getContext("2d"),g=Lp(x);x.fillStyle="#e8e8e8",x.fillRect(0,0,o,o),g(70);for(let v=0;v<=o;v+=h)x.fillRect(v-1,0,2.4,o);for(let v=0;v<=o;v+=u)x.fillRect(0,v-1,o,2.4);f.fillStyle=e,f.fillRect(0,0,o,o),f.strokeStyle=t,f.lineWidth=2.2;for(let v=0;v<=o;v+=h)f.beginPath(),f.moveTo(v,0),f.lineTo(v,o),f.stroke();for(let v=0;v<=o;v+=u)f.beginPath(),f.moveTo(0,v),f.lineTo(o,v),f.stroke();for(let v=0;v<c;v++)for(let E=0;E<l;E++){let y=.92+Math.random()*.16;f.fillStyle=`rgba(255,255,255,${(y-1)*.35})`,f.fillRect(E*h+1.6,v*u+1.6,h-3.2,u-3.2)}for(let v=0;v<r;v++){let E=Math.random()*o,y=f.createLinearGradient(E,0,E,o);y.addColorStop(0,`rgba(74,78,68,${.1+Math.random()*.18})`),y.addColorStop(1,"rgba(74,78,68,0)"),f.fillStyle=y,f.fillRect(E,0,12+Math.random()*34,o)}Dn(f,o,o,90,v=>`rgba(62,66,58,${.03+v*.07})`,60);let m=f.createLinearGradient(0,o*.72,0,o);return m.addColorStop(0,"rgba(56,60,50,0)"),m.addColorStop(1,"rgba(56,60,50,0.42)"),f.fillStyle=m,f.fillRect(0,o*.72,o,o*.28),zt(f,o,o,14),An(d,{kind:"tileWall",normalScale:1,height:p,metersPerRepeat:a})}function Zn(i={}){let{base:e="#7e8078",crack:t=18,wet:n=.35,metersPerRepeat:s=wn}=i,r=Di,a=At(r),o=a.getContext("2d"),l=At(r),c=l.getContext("2d"),h=Lp(c);c.fillStyle="#b4b4b4",c.fillRect(0,0,r,r),o.fillStyle=e,o.fillRect(0,0,r,r),Dn(o,r,r,60,u=>`rgba(52,55,50,${.02+u*.06})`,34),Dn(o,r,r,30,u=>`rgba(150,150,142,${.015+u*.04})`,22),o.strokeStyle="rgba(42,45,40,0.5)",h(58);for(let u=0;u<t;u++){let d=.6+Math.random()*1.3;o.lineWidth=d,c.lineWidth=d+.6;let f=[],p=Math.random()*r,x=Math.random()*r;f.push([p,x]);for(let g=0;g<5;g++)p+=(Math.random()-.5)*46,x+=(Math.random()-.5)*46,f.push([p,x]);for(let g of[f,f.map(([m,v])=>[m+r,v])])o.beginPath(),c.beginPath(),g.forEach(([m,v],E)=>{E?(o.lineTo(m,v),c.lineTo(m,v)):(o.moveTo(m,v),c.moveTo(m,v))}),o.stroke(),c.stroke()}if(n>0)for(let u=0;u<10;u++){let d=o.createRadialGradient(Math.random()*r,Math.random()*r,2,Math.random()*r,Math.random()*r,30+Math.random()*50);d.addColorStop(0,`rgba(38,44,46,${n*.5})`),d.addColorStop(1,"rgba(38,44,46,0)"),o.fillStyle=d,o.fillRect(0,0,r,r)}return zt(o,r,r,26),zt(c,r,r,18),An(a,{kind:"concrete",normalScale:.5,height:l,metersPerRepeat:s})}function Np(i,e={}){let{bg:t="#b0342a",fg:n="#f2efe6",w:s=512,h:r=128}=e,a=At(s,r),o=a.getContext("2d");o.fillStyle=t,o.fillRect(0,0,s,r),o.fillStyle=n;let l=Math.min(r*.62,s*.86/Math.max(i.length,1));return o.font=`700 ${l}px "Microsoft YaHei","PingFang SC",sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(i,s/2,r*.54),o.strokeStyle="rgba(30,26,22,0.5)",o.lineWidth=5,o.strokeRect(2.5,2.5,s-5,r-5),Dn(o,s,r,16,c=>`rgba(40,34,28,${.04+c*.12})`,26),zt(o,s,r,14),An(a,{kind:"sign",normalScale:.3,clamp:!0})}function Ba(){let i=Di,e=At(i),t=e.getContext("2d"),n=At(i),s=n.getContext("2d");t.fillStyle="#5c6058",t.fillRect(0,0,i,i),s.fillStyle="#c0c0c0",s.fillRect(0,0,i,i);let r=i/Li(600,i);for(let a=0;a<i;a+=r)t.fillStyle=`rgba(28,32,30,${.2+Math.random()*.2})`,t.fillRect(a,0,3,i),s.fillStyle="#5a5a5a",s.fillRect(a-1.5,0,4.5,i);return Dn(t,i,i,40,a=>`rgba(92,64,40,${.05+a*.18})`,30),zt(t,i,i,22),zt(s,i,i,14),An(e,{kind:"roof",normalScale:.6,height:n})}function xh(){let e=At(128,128),t=e.getContext("2d"),n=t.createLinearGradient(0,0,0,128);return n.addColorStop(0,"#4a5560"),n.addColorStop(.5,"#333b44"),n.addColorStop(1,"#242a31"),t.fillStyle=n,t.fillRect(0,0,128,128),zt(t,128,128,12),An(e,{kind:"glass",normalScale:0,clamp:!0})}var nc=null,mh=null,ic=null,Cp=null;function yh(i=.9,e=1.2){nc||(nc=new Ee({color:10133658,roughness:.58,metalness:.85}),mh=new Ee({color:4869448,roughness:.5,metalness:.9}));let t=new Be,n=new U(new oe(i,e,.08),nc);t.add(n);let s=.022,r=nc;for(let[l,c,h,u]of[[i+s*2,s,0,e/2+s/2],[i+s*2,s,0,-e/2-s/2],[s,e+s*2,i/2+s/2,0],[s,e+s*2,-i/2-s/2,0]]){let d=new U(new oe(l,c,.1),r);d.position.set(h,u,.012),d.userData.bevel="window-lip",t.add(d)}t.userData.bevels=(t.userData.bevels||0)+4;let a=new U(new nt(i*.82,e*.82),sc());a.position.z=.045,t.add(a);for(let l=1;l<=4;l++){let c=new U(new oe(.025,e*.94,.025),mh);c.position.set(-i/2+i*l/5,0,.06),t.add(c)}let o=new U(new oe(i*.94,.025,.025),mh);return o.position.set(0,0,.06),t.add(o),t}var Up=null;function sc(){return sc._m||(sc._m=new Ee({map:Up,roughness:.12,metalness:0,envMapIntensity:1.5})),sc._m}function Fp(){Up=xh()}function _h(i={}){let{base:e="#8a5f4a",mortar:t="#6f6a60",brickWMM:n=250,rowHMM:s=125,metersPerRepeat:r=wn}=i,a=_r,o=Li(n,a,!0,r),l=Li(s,a,!0,r),c=a/o,h=a/l,u=Math.max(1.6,h*.09),d=At(a),f=d.getContext("2d"),p=At(a),x=p.getContext("2d");x.fillStyle="#d2d2d2",x.fillRect(0,0,a,a),f.fillStyle=t,f.fillRect(0,0,a,a);for(let g=0;g<l;g++){let m=g*h,v=g%2*(c/2);x.fillRect(0,m-u/2,a,u);for(let E=-1;E<=o;E++){let y=E*c+v;x.fillRect(y-u/2,m,u,h);let S=.82+Math.random()*.36;f.fillStyle=`rgb(${Math.round(138*S)},${Math.round(95*S)},${Math.round(74*S)})`,f.fillRect(y+u/2,m+u/2,c-u,h-u)}}return Dn(f,a,a,40,g=>`rgba(40,36,32,${.03+g*.1})`,30),zt(f,a,a,22),zt(x,a,a,16),An(d,{kind:"brick",normalScale:1.1,height:p,metersPerRepeat:r})}function $n(i={}){let{base:e="#6d7370",ribMM:t=150,vertical:n=!1}=i,s=Di,r=s/Li(t,s),a=At(s),o=a.getContext("2d"),l=At(s),c=l.getContext("2d");o.fillStyle=e,o.fillRect(0,0,s,s),c.fillStyle="#808080",c.fillRect(0,0,s,s);for(let h=0;h<s;h+=r){let u=o.createLinearGradient(h,0,h+r,0);u.addColorStop(0,"rgba(255,255,255,0.15)"),u.addColorStop(.5,"rgba(0,0,0,0.22)"),u.addColorStop(1,"rgba(255,255,255,0.08)"),o.fillStyle=u,n?o.fillRect(h,0,r,s):o.fillRect(0,h,s,r);for(let d=0;d<r;d++){let f=d/r*Math.PI*2,p=Math.round(128+Math.sin(f)*100);c.fillStyle=`rgb(${p},${p},${p})`,n?c.fillRect(h+d,0,1,s):c.fillRect(0,h+d,s,1)}}return Dn(o,s,s,34,h=>`rgba(96,64,40,${.04+h*.16})`,26),zt(o,s,s,18),An(a,{kind:"metalPanel",normalScale:.7,height:l})}function rc(i={}){let{base:e="#46525c",mullion:t="#2c3238",cellMM:n=1200,metersPerRepeat:s=wn}=i,r=_r,a=Li(n,r,!1,s),o=r/a,l=At(r),c=l.getContext("2d"),h=At(r),u=h.getContext("2d");u.fillStyle="#dcdcdc",u.fillRect(0,0,r,r),c.fillStyle=e,c.fillRect(0,0,r,r);for(let d=0;d<r;d+=o){u.fillRect(0,d-2,r,4);for(let f=0;f<r;f+=o){u.fillRect(f-2,d,4,o);let p=.78+Math.random()*.5;c.fillStyle=`rgba(${Math.round(96*p)},${Math.round(112*p)},${Math.round(124*p)},0.85)`,c.fillRect(f+2,d+2,o-4,o-4);let x=c.createLinearGradient(f,d,f+o,d+o);x.addColorStop(0,"rgba(190,205,215,0.16)"),x.addColorStop(.5,"rgba(0,0,0,0)"),x.addColorStop(1,"rgba(20,26,30,0.22)"),c.fillStyle=x,c.fillRect(f+2,d+2,o-4,o-4)}}c.strokeStyle=t,c.lineWidth=4;for(let d=0;d<=r;d+=o)c.beginPath(),c.moveTo(d,0),c.lineTo(d,r),c.stroke(),c.beginPath(),c.moveTo(0,d),c.lineTo(r,d),c.stroke();return zt(c,r,r,10),zt(u,r,r,8),An(l,{kind:"curtainWall",normalScale:.6,height:h,metersPerRepeat:s})}function Op(i={}){let{metersPerRepeat:e=gh}=i,t=Di,n=At(t),s=n.getContext("2d"),r=At(t),a=r.getContext("2d");s.fillStyle="#4a4c4a",s.fillRect(0,0,t,t),a.fillStyle="#a8a8a8",a.fillRect(0,0,t,t),Dn(s,t,t,70,o=>`rgba(30,32,33,${.05+o*.14})`,40),Dn(s,t,t,40,o=>`rgba(120,122,118,${.02+o*.05})`,18);for(let o=0;o<900;o++){let l=Math.random()*t,c=Math.random()*t,h=.6+Math.random()*1.7,u=.7+Math.random()*.6;s.fillStyle=`rgba(${Math.round(130*u)},${Math.round(132*u)},${Math.round(128*u)},0.5)`,s.beginPath(),s.arc(l,c,h,0,Math.PI*2),s.fill(),a.fillStyle=`rgba(255,255,255,${.25+Math.random()*.5})`,a.beginPath(),a.arc(l,c,h,0,Math.PI*2),a.fill()}for(let o=0;o<6;o++){s.strokeStyle="rgba(26,28,28,0.6)",s.lineWidth=1+Math.random(),a.strokeStyle="#4a4a4a",a.lineWidth=1.6+Math.random(),s.beginPath(),a.beginPath();let l=Math.random()*t,c=Math.random()*t;s.moveTo(l,c),a.moveTo(l,c);for(let h=0;h<6;h++)l+=(Math.random()-.5)*60,c+=(Math.random()-.5)*60,s.lineTo(l,c),a.lineTo(l,c);s.stroke(),a.stroke()}return zt(s,t,t,30),zt(a,t,t,22),An(n,{kind:"asphalt",normalScale:.6,height:r,metersPerRepeat:e})}function Bp(i={}){let{gap:e="#706f68",tileMM:t=300,metersPerRepeat:n=gh}=i,s=_r,r=Li(t,s,!1,n),a=s/r,o=Math.max(2,a*.035),l=At(s),c=l.getContext("2d"),h=At(s),u=h.getContext("2d");u.fillStyle="#d0d0d0",u.fillRect(0,0,s,s),c.fillStyle=e,c.fillRect(0,0,s,s);for(let d=0;d<s;d+=a){u.fillStyle="#5c5c5c",u.fillRect(0,d-o/2,s,o);for(let f=0;f<s;f+=a){u.fillStyle="#5c5c5c",u.fillRect(f-o/2,d,o,a);let p=.86+Math.random()*.28;c.fillStyle=`rgb(${Math.round(155*p)},${Math.round(154*p)},${Math.round(146*p)})`,c.fillRect(f+o/2,d+o/2,a-o,a-o)}}return Dn(c,s,s,46,d=>`rgba(60,62,58,${.03+d*.08})`,34),zt(c,s,s,16),zt(u,s,s,12),An(l,{kind:"paver",normalScale:.8,height:h,metersPerRepeat:n})}function kp(i={}){let{base:e="#454b3e",metersPerRepeat:t=qv}=i,n=Di,s=At(n),r=s.getContext("2d"),a=At(n),o=a.getContext("2d");r.fillStyle=e,r.fillRect(0,0,n,n),o.fillStyle="#909090",o.fillRect(0,0,n,n);let l=5200;for(let c=0;c<l;c++){let h=.6+Math.random()*.9,u=Math.random()*n,d=Math.random()*n,f=(Math.random()-.5)*4,p=-3-Math.random()*5;r.strokeStyle=`rgba(${Math.round(72*h)},${Math.round(80*h)},${Math.round(58*h)},0.8)`,r.lineWidth=1,r.beginPath(),r.moveTo(u,d),r.lineTo(u+f,d+p),r.stroke(),o.strokeStyle=h>.95?"rgba(240,240,240,0.5)":"rgba(150,150,150,0.35)",o.lineWidth=1,o.beginPath(),o.moveTo(u,d),o.lineTo(u+f,d+p),o.stroke()}return Dn(r,n,n,30,c=>`rgba(38,42,32,${.05+c*.14})`,34),zt(r,n,n,14),zt(o,n,n,20),An(s,{kind:"grass",normalScale:.5,height:a,metersPerRepeat:t})}function ka(i={}){let{base:e="#8f8b84",slabMM:t=800,metersPerRepeat:n=gh}=i,s=Di,r=Li(t,s,!1,n),a=s/r,o=At(s),l=o.getContext("2d"),c=At(s),h=c.getContext("2d");l.fillStyle=e,l.fillRect(0,0,s,s),h.fillStyle="#e0e0e0",h.fillRect(0,0,s,s),l.strokeStyle="rgba(70,66,62,0.45)",l.lineWidth=1.6,h.strokeStyle="#585858",h.lineWidth=2.4;for(let u=0;u<=s;u+=a)l.beginPath(),l.moveTo(u,0),l.lineTo(u,s),l.stroke(),l.beginPath(),l.moveTo(0,u),l.lineTo(s,u),l.stroke(),h.beginPath(),h.moveTo(u,0),h.lineTo(u,s),h.stroke(),h.beginPath(),h.moveTo(0,u),h.lineTo(s,u),h.stroke();for(let u=0;u<30;u++){l.strokeStyle=`rgba(60,56,52,${.06+Math.random()*.12})`,l.lineWidth=.6+Math.random()*1.6,l.beginPath();let d=Math.random()*s,f=Math.random()*s;l.moveTo(d,f);for(let p=0;p<4;p++)d+=(Math.random()-.5)*110,f+=(Math.random()-.5)*40,l.lineTo(d,f);l.stroke()}return Dn(l,s,s,20,u=>`rgba(160,156,148,${.03+u*.07})`,40),zt(l,s,s,12),zt(h,s,s,10),An(o,{kind:"stone",normalScale:.8,height:c,metersPerRepeat:n})}function zp(i={}){let{base:e="#6b4f38",metersPerRepeat:t=wn}=i,n=Di,s=At(n),r=s.getContext("2d"),a=At(n),o=a.getContext("2d");r.fillStyle=e,r.fillRect(0,0,n,n),o.fillStyle="#b8b8b8",o.fillRect(0,0,n,n);for(let l=0;l<120;l++){let c=`rgba(${40+Math.random()*60},${28+Math.random()*40},${18+Math.random()*30},${.12+Math.random()*.22})`,h=.7+Math.random()*2.4;r.strokeStyle=c,r.lineWidth=h;let u=Math.random()<.45;u&&(o.strokeStyle="rgba(88,88,88,0.55)",o.lineWidth=h*.8);let d=Math.random()*n;r.beginPath(),o.beginPath(),r.moveTo(0,d),o.moveTo(0,d);for(let f=0;f<=n;f+=32)d+=(Math.random()-.5)*5,r.lineTo(f,d),o.lineTo(f,d);r.stroke(),u&&o.stroke()}return zt(r,n,n,16),An(s,{kind:"wood",normalScale:.7,height:a,metersPerRepeat:t})}function Hp(){ic||(ic=new Ee({color:11053214,roughness:.72,metalness:.25}),Cp=new Ee({color:5921878,roughness:.62,metalness:.5}));let i=new Be,e=new U(new oe(.78,.54,.32),ic);i.add(e);let t=new U(new oe(.8,.03,.34),ic);t.position.y=.27,i.add(t);let n=new U(new Xe(.2,.2,.04,16),Cp);return n.rotation.x=Math.PI/2,n.position.z=.17,i.add(n),i}var jn=null,bt=_n;function Gp(){let i={glass:xh(),asphalt:Op(),paver:Bp(),grass:kp({metersPerRepeat:3}),stone:ka(),wood:zp(),roof:Ba()},e=s=>s<=1?[bt(Oa({base:"#c2bfb4"}),{roughness:.45}),bt(Oa({base:"#b6b3a7",tileHMM:380}),{roughness:.48}),bt(_h({base:"#7d5644"}),{roughness:.94}),bt(Zn({base:"#8a8880",wet:.2}),{roughness:.93})]:s===2?[bt(Oa({base:"#cbc9c0",water:8}),{roughness:.42}),bt(Zn({base:"#9a978e",wet:.1,crack:10}),{roughness:.92}),bt(_h({base:"#8a6a56",rowHMM:140}),{roughness:.95}),bt(Oa({base:"#b8b6ac",tileWMM:250,water:6}),{roughness:.46})]:[bt(ka({base:"#a8a49b"}),{roughness:.7}),bt(rc({base:"#424e58"}),{roughness:.3,envMapIntensity:1.4}),bt(ka({base:"#9c9a92",slabMM:1e3}),{roughness:.75}),bt(rc({base:"#4a5258",cellMM:1500}),{roughness:.32,envMapIntensity:1.4})],t=s=>s<=1?bt(Zn({base:"#6c6f66",wet:.4,crack:22}),{roughness:.95}):s===2?bt(Zn({base:"#7d7f76",wet:.28,crack:14}),{roughness:.93}):bt(ka({base:"#a8a49b",slabMM:1200}),{roughness:.74});jn={tex:i,tiers:{},common:{metal:new Ee({color:5132620,roughness:.45,metalness:.9}),metalLight:new Ee({color:9277834,roughness:.42,metalness:.85}),dark:new Ee({color:2895665,roughness:.8}),rubber:new Ee({color:1974306,roughness:.95}),wood:bt(i.wood,{roughness:.75}),stone:bt(i.stone,{roughness:.72}),asphalt:bt(i.asphalt,{roughness:.9}),paver:bt(i.paver,{roughness:.86}),grass:bt(i.grass,{roughness:.99}),glassPane:bt(i.glass,{roughness:.1,envMapIntensity:1.5}),curtain:bt(rc(),{roughness:.3,envMapIntensity:1.4}),panel:bt($n({base:"#6d7370"}),{roughness:.72}),panelBlue:bt($n({base:"#4e5a63",ribMM:180}),{roughness:.7}),panelRust:bt($n({base:"#6a5a4c",ribMM:160}),{roughness:.84}),trim:new Ee({color:10129798,roughness:.9}),tarp:new Ee({color:4147780,roughness:.96,side:Ut}),laneSurf:bt(Zn({base:"#75786f",wet:.5,crack:26}),{roughness:.97}),signRed:null,cloth:[5991290,9076856,7167846,8030834,10132114].map(s=>new Ee({color:s,roughness:.95,side:Ut}))}};for(let s of[1,2,3]){let r=e(s);jn.tiers[s]={walls:r,wall:r[0],ground:t(s),roof:bt(Ba(),{roughness:.93}),accent:s<=1?new Ee({color:9058864,roughness:.85}):s===2?new Ee({color:6975339,roughness:.8}):new Ee({color:3621194,roughness:.62,envMapIntensity:1.2}),trim:s<=1?new Ee({color:10129798,roughness:.9}):s===2?new Ee({color:11052700,roughness:.88}):new Ee({color:11580333,roughness:.7}),awning:s<=1?new Ee({color:4867128,roughness:.95,side:Ut}):new Ee({color:5593944,roughness:.92,side:Ut})}}let n=s=>{s.map&&(s.map.repeat.set(1,1),s.map.needsUpdate=!0),s.normalMap&&(s.normalMap.repeat.set(1,1),s.normalMap.needsUpdate=!0)};for(let s of[1,2,3])n(jn.tiers[s].ground);return n(jn.common.asphalt),n(jn.common.laneSurf),n(jn.common.paver),jn}function pi(){if(!jn)throw new Error("palette 未初始化，先调用 buildPalette()");return jn}var Ui=i=>jn.tiers[Math.min(3,Math.max(1,i|0))]||jn.tiers[2];var at=(i,e)=>i+Math.random()*(e-i),Fi=(i,e)=>Math.floor(at(i,e+1)),Nn=i=>i[Math.floor(Math.random()*i.length)],Es=i=>Math.random()<i;function Qv(i,e,t){let n=Math.max(i,t)+e;return n<8?.02:n<26?.025:.03}function Ji(i,e,t,n,s,r,a=2){let o=Qv(e,n,t),l=[[e/2+o/2,t/2+o/2],[-e/2-o/2,t/2+o/2],[e/2+o/2,-t/2-o/2],[-e/2-o/2,-t/2-o/2]].slice(0,Math.max(1,Math.min(4,a))),c=new oe(o,n,o);for(let[h,u]of l){let d=new U(c,r);d.position.set(h,s+n/2,u),d.castShadow=!0,i.add(d)}return i.userData.chamfers=(i.userData.chamfers||0)+l.length,l.length}function oc(i,e,t,n,s,r,a,o){let c=new oe(e+.04,.02,.05);for(let h of[t/2+.02/2,-t/2-.02/2]){let u=new U(c,o);u.position.set(n,s+h,r),a&&(u.rotation.y=a),u.userData.bevel="opening-sill",i.add(u)}return i.userData.sills=(i.userData.sills||0)+2,2}var le=null;function Vp(i){le=i}var Jn=[],bh=null;function lc(i){bh=i}function vn(i,e,t,n={}){let s=new Be;if(s.userData.glb={kit:i,name:e,ready:!1},s.userData.noMerge=!0,typeof t=="function"){let r=t();r&&(r.userData.isFallback=!0,s.add(r))}return n.y&&(s.position.y=n.y),n.rotY&&(s.rotation.y=n.rotY),n.scale&&s.scale.setScalar(n.scale),n.footprint&&(s.userData.footprint=n.footprint),Jn.push({wrap:s,kit:i,name:e,opt:n,owner:ac}),s}var ac=null;function Wp(i){let e=ac;return ac=i||null,()=>{ac=e}}function za(){if(!bh)return 0;let i=0;for(let e=Jn.length-1;e>=0;e--){let t=Jn[e],n=bh.instance(t.kit,t.name,t.opt);if(n){for(let s=t.wrap.children.length-1;s>=0;s--){let r=t.wrap.children[s];r.userData.isFallback&&t.wrap.remove(r)}t.wrap.add(n),t.wrap.userData.glb.ready=!0,Jn.splice(e,1),i++}}return i}function Ha(){return Jn.length}function Xp(i=null){let e=Jn.length;if(!i)return Jn.length=0,e;for(let t=Jn.length-1;t>=0;t--){let n=Jn[t],s=n.owner===i;if(!s){let r=n.wrap;for(;r;){if(r===i){s=!0;break}r=r.parent}}s&&Jn.splice(t,1)}return e-Jn.length}function cc({large:i=!1,tier:e=2}={}){return vn("industrial",i?"detail-tank-large":"detail-tank",()=>{let n=new Be,s=i?1.1:.8,r=i?2.2:1.6,a=new U(new Xe(s,s,r,14),le.common.metal);a.position.y=r/2,a.castShadow=!0,n.add(a);let o=new U(new Xe(s*.55,s*.55,.22,12),le.common.metalLight);return o.position.y=r+.11,n.add(o),n.userData.footprint={w:s*2,d:s*2,h:r+.3},n},{footprint:{w:i?2.2:1.6,d:i?2.2:1.6,h:i?2.5:1.9}})}function uc({kind:i="medium"}={}){return vn("industrial",`chimney-${i}`,null,{footprint:{w:1.2,d:1.2,h:8}})}function hc(){return vn("industrial","water-tower",null,{footprint:{w:2.4,d:2.4,h:9}})}function qp({landscape:i=!0}={}){return vn("industrial",i?"solar-panel-landscape":"solar-panel-portrait",null,{footprint:{w:2,d:1.2,h:1.6}})}function Yp({variant:i="a"}={}){return vn("industrial",`shipping-container-${i}`,()=>{let e=new Be,t=new U(new oe(6,2.6,2.4),le.common.metal||le.common.metalLight);return t.position.y=1.3,t.castShadow=!0,e.add(t),e.userData.footprint={w:6,d:2.4,h:2.6},e},{footprint:{w:6,d:2.4,h:2.6}})}function Kp({kind:i=null}={}){let e=i||Nn(["light-square","light-square-double","light-curved"]);return vn("roads",e,null,{footprint:{w:.6,d:.6,h:7}})}function Zp(){return vn("roads","construction-barrier",()=>{let i=new Be,e=new U(new oe(2,.9,.16),le.common.metalLight);return e.position.y=.65,e.castShadow=!0,i.add(e),i.userData.footprint={w:2,d:.2,h:1.1},i},{footprint:{w:2,d:.2,h:1.1}})}function dc(){return vn("roads","construction-cone",null,{footprint:{w:.4,d:.4,h:.6}})}function fc(){return vn("roads","dumpster",null,{footprint:{w:1.6,d:.9,h:1.2}})}function pc(){return vn("roads","electricity-pole",null,{footprint:{w:.4,d:.4,h:8}})}function mc({wide:i=!1}={}){return vn("commercial",i?"detail-awning-wide":"detail-awning",null,{footprint:{w:i?5:3,d:.9,h:.4}})}function gc({variant:i="a"}={}){return vn("commercial",`detail-parasol-${i}`,null,{footprint:{w:1.6,d:1.6,h:2.4}})}var vh=new Map;function eM(i,e={}){let t=i+JSON.stringify(e);if(vh.has(t))return vh.get(t);let n=new Ee({map:Np(i,e),roughness:.85});return vh.set(t,n),n}var Mh=new Map;function xc(i,e={}){let{bg:t="#e8e4d8",fg:n="#2a2a28",w:s=512,h:r=128,font:a='700 62px "Microsoft YaHei","PingFang SC",sans-serif'}=e,o=`${i}|${t}|${n}|${s}|${r}|${a}`;if(Mh.has(o))return Mh.get(o);let l=document.createElement("canvas");l.width=s,l.height=r;let c=l.getContext("2d");c.fillStyle=t,c.fillRect(0,0,s,r),c.fillStyle=n,c.font=a,c.textAlign="center",c.textBaseline="middle";let h=String(i).split(`
`),u=r/(h.length+.6);h.forEach((p,x)=>c.fillText(p,s/2,u*(x+.9)));let d=new Pn(l);d.colorSpace=wt,d.wrapS=d.wrapT=sn;let f=new Ee({map:d,roughness:.9});return Mh.set(o,f),f}function $p({w:i,d:e,floors:t,floorH:n=2.9,tier:s=1,windows:r=!0}){let a=Ui(s),o=new Be,l=t*n,c=Nn(a.walls),h=new oe(i,l,e),u=Ni(c,i,l),d=new U(h,u);if(d.position.y=l/2,d.castShadow=!0,d.receiveShadow=!0,o.add(d),Ji(o,i,e,l,0,a.trim,2),r){let p=Math.max(2,Math.round(i/2.6));for(let x=0;x<t;x++){let g=x*n+n*.56;for(let m=0;m<p;m++){let v=-i/2+(m+.5)*(i/p);for(let E of[1,-1]){let y=yh(.88,1.24);y.position.set(v,g,E*(e/2+.05)),E<0&&(y.rotation.y=Math.PI),o.add(y)}}}}for(let p=0,x=Fi(2,s===1?7:4);p<x;p++){let g=Hp(),m=Es(.5)?1:-1;g.position.set(at(-i/2+.7,i/2-.7),at(n*1.2,l-.9),m*(e/2+.19)),m<0&&(g.rotation.y=Math.PI),o.add(g)}if(s<=2)for(let p=0,x=Fi(0,s===1?4:2);p<x;p++){let g=at(n*1.6,l-.6),m=Es(.5)?1:-1,v=at(1.4,2.3),E=at(-i/2+1.2,i/2-1.2),y=new U(new Xe(.028,.028,v,6),le.common.metal);y.rotation.z=Math.PI/2,y.position.set(E,g,m*(e/2+.5)),o.add(y);let S=Fi(1,3);for(let M=0;M<S;M++){let A=at(.32,.55),_=at(.6,1),w=new U(new nt(A,_),Nn(le.common.cloth));w.position.set(E-v/2+(M+1)*(v/(S+1)),g-_/2-.03,m*(e/2+.5)),w.castShadow=!0,o.add(w)}}let f=new U(new oe(i+.16,.5,e+.16),c);if(f.position.y=l+.25,f.castShadow=!0,o.add(f),Es(s===1?.75:.4)){let p=new U(new Xe(.62,.62,1.15,14),new Ee({color:10134428,roughness:.6,metalness:.35}));p.position.set(at(-i/4,i/4),l+1.1,at(-e/4,e/4)),p.castShadow=!0,o.add(p)}if(Es(.5)){let p=new U(new oe(at(2,3.4),.12,at(1.6,2.6)),_n(Ba(),{roughness:.9}));p.position.set(at(-i/4,i/4),l+.9,at(-e/4,e/4)),p.rotation.z=at(-.1,.1),p.castShadow=!0,o.add(p)}return o.userData.footprint={w:i,d:e,h:l},o}function yc({w:i,d:e,floors:t,floorH:n=2.85,tier:s=2,balcony:r=!0,units:a=null}){let o=Ui(s),l=new Be,c=t*n,h=Nn(o.walls),u=Ni(h,i,c),d=new U(new oe(i,c,e),u);d.position.y=c/2,d.castShadow=!0,d.receiveShadow=!0,l.add(d),Ji(l,i,e,c,0,o.trim,4);let f=a||Math.max(2,Math.round(i/3.6)),p=i/f;for(let g=0;g<t;g++){let m=g*n+n*.42;for(let v=0;v<f;v++){let E=-i/2+(v+.5)*p;for(let y of[1,-1]){let S=yh(1.05,1.35);S.position.set(E,m+.5,y*(e/2+.05)),y<0&&(S.rotation.y=Math.PI),l.add(S)}if(r&&g>0)for(let y of[1,-1]){let S=p*.78,M=new U(new oe(S,.12,1.05),o.trim);M.position.set(E,m+1.5,y*(e/2+.55)),M.castShadow=!0,M.receiveShadow=!0,l.add(M);let A=new U(new oe(S,.9,.06),le.common.metalLight);if(A.position.set(E,m+1.95,y*(e/2+1.06)),l.add(A),Es(.35)){let _=new U(new nt(S,.92),le.common.glassPane);_.position.set(E,m+1.95,y*(e/2+1.07)),y<0&&(_.rotation.y=Math.PI),l.add(_)}}}}for(let g=0;g<f;g++){let m=-i/2+(g+.5)*p,v=s<=1?le.common.dark:le.common.metalLight,E=new U(new oe(1.1,2.1,.1),v);if(E.position.set(m,1.05,e/2+.06),l.add(E),oc(l,1.1,2.1,m,1.05,e/2+.07,0,o.trim),Es(.6)){let y=new U(new nt(.42,.3),xc(`${Fi(1,9)}栋`,{bg:"#c8c4b8",fg:"#3a3a36",w:256,h:180,font:'700 96px "Microsoft YaHei",sans-serif'}));y.position.set(m+.85,1.75,e/2+.07),l.add(y)}}let x=new U(new oe(i+.14,.46,e+.14),h);return x.position.y=c+.23,x.castShadow=!0,l.add(x),l.userData.footprint={w:i,d:e,h:c},l}function Ga({w:i,d:e,floors:t,floorH:n=3.4,tier:s=3,podium:r=!0,crown:a=!0}){let o=Ui(s),l=new Be,c=t*n,h=Ni(le.common.curtain,i,c),u=new U(new oe(i,c,e),h);u.position.y=c/2,u.castShadow=!0,u.receiveShadow=!0,l.add(u),Ji(l,i,e,c,0,o.trim,4);let d=o.trim;for(let f=1;f<t;f++){let p=new U(new oe(i+.12,.14,e+.12),d);p.position.y=f*n,l.add(p)}if(r){let p=i+3.2,x=e+3.2,g=s>=3?_n(Zn({base:"#9c9a92",wet:0}),{roughness:.66}):o.wall,m=new U(new oe(p,4.6,x),g);m.position.y=4.6/2,m.castShadow=!0,m.receiveShadow=!0,l.add(m),Ji(l,p,x,4.6,0,o.trim,4);for(let E of[1,-1]){let y=new U(new nt(p*.86,2.6),le.common.glassPane);y.position.set(0,1.9,E*(x/2+.03)),E<0&&(y.rotation.y=Math.PI),l.add(y)}let v=new U(new oe(Math.min(p*.5,6),.22,2.4),le.common.dark);v.position.set(0,3.3,x/2+1),v.castShadow=!0,l.add(v)}if(a){let f=new U(new oe(i*.62,1.6,e*.62),o.trim);f.position.y=c+.8,f.castShadow=!0,l.add(f);let p=new U(new Xe(.06,.06,2.6,6),le.common.metal);p.position.y=c+2.9,l.add(p)}return l.userData.footprint={w:i,d:e,h:c},l}function Sh({width:i=5,sign:e="小卖部",tier:t=2,height:n=3.4,open:s=!0,signColor:r=null}){let a=Ui(t),o=new Be,l=new U(new oe(i,n,.3),a.wall);if(l.position.set(0,n/2,-.15),l.castShadow=!0,l.receiveShadow=!0,o.add(l),Ji(o,i,.3,n,0,a.trim,4),s){let d=new U(new nt(i*.74,n*.7),le.common.glassPane);d.position.set(0,n*.36,.02),o.add(d);let f=new U(new oe(i*.78,.12,.08),le.common.metalLight);f.position.set(i*.39,n*.36,.04),o.add(f),oc(o,i*.74,n*.7,0,n*.36,.03,0,a.trim)}else{let d=new U(new oe(i*.78,n*.72,.1),_n($n({base:"#6b6f6a",ribMM:75}),{roughness:.86}));d.position.set(0,n*.37,.02),o.add(d),oc(o,i*.78,n*.72,0,n*.37,.03,0,a.trim)}let c=new U(new oe(i,.1,1.15),a.awning);c.position.set(0,n*.8,.6),c.rotation.x=-.12,c.castShadow=!0,o.add(c);let h=new U(new oe(i*.96,.8,.18),r?new Ee({color:r,roughness:.85}):a.accent);h.position.set(0,n*.98,.06),o.add(h);let u=new U(new nt(i*.92,.72),eM(e));return u.position.set(0,n*.98,.16),o.add(u),o.userData.footprint={w:i,d:.6,h:n},o}function Eh({w:i,d:e,h:t=6.5,tier:n=2,sawtooth:s=!0,doors:r=2,panel:a=null}){let o=new Be,l=a||(n<=1?le.common.panelRust:le.common.panel),c=Ni(l,i,t),h=new U(new oe(i,t,e),c);if(h.position.y=t/2,h.castShadow=!0,h.receiveShadow=!0,o.add(h),Ji(o,i,e,t,0,le.common.metalLight,4),s){let u=Math.max(2,Math.round(e/4));for(let d=0;d<u;d++){let f=-e/2+(d+.5)*(e/u),p=new U(new oe(i*.98,.1,e/u*.86),le.common.panel);p.position.set(0,t+.55,f),p.rotation.x=-.5,p.castShadow=!0,o.add(p);let x=new U(new nt(i*.9,e/u*.66),le.common.glassPane);x.position.set(0,t+.42,f+.5),x.rotation.x=Math.PI/2-.9,o.add(x)}}else{let u=new U(new oe(i+.3,.18,e+.3),le.common.panel);u.position.y=t+.1,u.castShadow=!0,o.add(u)}for(let u=0;u<r;u++){let d=Math.min(4.2,i/(r+.6)),f=r===1?0:-i/2+(u+.5)*(i/r),p=new U(new oe(d,t*.62,.16),_n($n({base:"#7a7f78",ribMM:90}),{roughness:.84}));p.position.set(f,t*.31,e/2+.09),o.add(p),oc(o,d,t*.62,f,t*.31,e/2+.11,0,le.common.metalLight)}if(Es(.7)){let u=new U(new Xe(.34,.34,t*.8,10),le.common.metal);u.position.set(-i/2-.4,t*.45,at(-e/3,e/3)),u.castShadow=!0,o.add(u)}for(let u=0,d=Fi(1,3);u<d;u++){let f=new U(new oe(.5,.7,.3),le.common.metalLight);f.position.set(at(-i/2+1,i/2-1),at(2,3.4),e/2+.2),o.add(f)}return o.userData.footprint={w:i,d:e,h:t},o}function vr({w:i,d:e,h:t=11,tier:n=2,steps:s=!0,columns:r=!0,roofStyle:a="flat"}){let o=Ui(n),l=new Be,c=n>=3?le.common.stone:_n(Zn({base:n<=1?"#8f8c84":"#a5a29a",wet:.1,crack:8}),{roughness:.9}),h=Ni(c,i,t),u=new U(new oe(i,t,e),h);u.position.y=t/2,u.castShadow=!0,u.receiveShadow=!0,l.add(u),Ji(l,i,e,t,0,le.common.stone,4);let d=Math.max(3,Math.round(i/2.4));for(let f=0;f<Math.max(1,Math.floor(t/3.2));f++){let p=1.9+f*3.2;if(p>t-1.2)break;for(let x=0;x<d;x++){let g=-i/2+(x+.5)*(i/d),m=new U(new nt(i/d*.6,1.7),le.common.glassPane);m.position.set(g,p,e/2+.04),l.add(m)}}if(s){let f=Math.min(i*.62,12);for(let p=0;p<4;p++){let x=new U(new oe(f,.22,.9),le.common.stone);x.position.set(0,.11+p*.22,e/2+2.4-p*.9),x.receiveShadow=!0,l.add(x)}}if(r){let f=Math.max(3,Math.round(i/3.4));for(let x=0;x<f;x++){let g=-i/2+(x+.5)*(i/f),m=new U(new Xe(.34,.38,t*.34,14),le.common.stone);m.position.set(g,t*.17,e/2+1.7),m.castShadow=!0,l.add(m)}let p=new U(new oe(i,.7,2.6),le.common.stone);p.position.set(0,t*.36,e/2+1.7),p.castShadow=!0,l.add(p)}if(a==="hip"){let f=new U(new fs(i*.78,2.6,4),le.common.dark);f.rotation.y=Math.PI/4,f.position.y=t+1.3,f.castShadow=!0,l.add(f)}else{let f=new U(new oe(i+.4,.5,e+.4),o.trim);f.position.y=t+.25,f.castShadow=!0,l.add(f)}return l.userData.footprint={w:i,d:e,h:t},l}function Th({w:i,d:e,floors:t=4,floorH:n=3.6,tier:s=2,corridor:r=!0}){let a=Ui(s),o=new Be,l=t*n,c=Nn(a.walls),h=Ni(c,i,l),u=new U(new oe(i,l,e),h);u.position.y=l/2,u.castShadow=!0,u.receiveShadow=!0,o.add(u),Ji(o,i,e,l,0,a.trim,4);let d=Math.max(4,Math.round(i/3));for(let f=1;f<=t;f++){let p=(f-.5)*n;for(let g=0;g<d;g++){let m=-i/2+(g+.5)*(i/d),v=new U(new nt(i/d*.72,n*.52),le.common.glassPane);if(v.position.set(m,p,e/2+.04),o.add(v),r){let E=v.clone();E.position.z=-(e/2+.04),E.rotation.y=Math.PI,o.add(E)}}if(r){let g=new U(new oe(i,.14,1.5),a.trim);g.position.set(0,(f-1)*n+n*.06,e/2+.8),g.receiveShadow=!0,o.add(g);let m=new U(new oe(i,1,.07),le.common.metalLight);m.position.set(0,(f-1)*n+n*.06+.55,e/2+1.52),o.add(m)}let x=new U(new oe(i+.1,.16,e+.1),a.trim);x.position.y=f*n,o.add(x)}return o.userData.footprint={w:i,d:e,h:l},o}function wh({w:i=2.4,d:e=1.2,tier:t=2,colors:n=null,goods:s=!0,box:r=!1}){let a=new Be,o=i,l=e,c=new U(new oe(o,.1,l),le.common.wood);c.position.y=.9,c.castShadow=!0,c.receiveShadow=!0,a.add(c);for(let d of[-1,1]){let f=new U(new oe(.08,.9,l*.9),le.common.metal);f.position.set(d*(o/2-.14),.45,0),a.add(f)}let h=n||[7031364,4477530,5921348,4867152],u=new U(new oe(o*1.12,.08,l*1.5),new Ee({color:Nn(h),roughness:.95,side:Ut}));u.position.set(0,2.2,0),u.rotation.x=-.05,u.castShadow=!0,a.add(u);for(let d of[-1,1])for(let f of[-1,1]){let p=new U(new Xe(.035,.035,2.2,6),le.common.metal);p.position.set(d*(o/2-.06),1.1,f*(l*.66)),a.add(p)}if(s){let d=Fi(3,6);for(let f=0;f<d;f++){let p=at(.18,.34),x=at(.12,.3),g=new U(Math.random()<.5?new oe(p,x,p*.8):new Xe(p*.4,p*.42,x,8),new Ee({color:Nn([6978122,9071162,8018506,5925482,9079386,10521178]),roughness:.9}));g.position.set(at(-o/2+.3,o/2-.3),.97+x/2,at(-l/2+.25,l/2-.25)),g.castShadow=!0,a.add(g)}}if(r)for(let d=0,f=Fi(1,3);d<f;d++){let p=new U(new oe(at(.5,.8),at(.3,.5),at(.4,.6)),new Ee({color:Nn([14210248,9071178]),roughness:.92}));p.position.set(at(-o/2+.4,o/2-.4),.22,at(-l/2,l/2)-.3),p.castShadow=!0,a.add(p)}return a.userData.footprint={w:o,d:l,h:2.2},a}function _c({w:i=6,d:e=2.4,h:t=2.6,color:n=4151914}){let s=new Be,r=_n($n({base:"#3f5a6a",ribMM:120}),{roughness:.82,metalness:0});r.color=new Re(n);let a=new U(new oe(i,t,e),r);a.position.y=t/2,a.castShadow=!0,a.receiveShadow=!0,s.add(a);for(let o of[-1,1]){let l=new U(new oe(.08,t*.94,e*.94),le.common.dark);l.position.set(o*(i/2+.04),t/2,0),s.add(l)}return s.userData.footprint={w:i,d:e,h:t},s}function Ah({r:i=2.2,h:e=3.4,tier:t=2}={}){let n=new Be,s=new U(new Xe(i,i,.3,6),le.common.stone);s.position.y=.15,s.receiveShadow=!0,n.add(s);for(let o=0;o<6;o++){let l=o/6*Math.PI*2,c=new U(new Xe(.11,.13,e,8),t>=3?le.common.stone:new Ee({color:8011574,roughness:.88}));c.position.set(Math.cos(l)*i*.82,e/2+.3,Math.sin(l)*i*.82),c.castShadow=!0,n.add(c)}let r=new U(new fs(i*1.35,1.5,6),le.common.dark);r.position.y=e+1,r.castShadow=!0,n.add(r);let a=new U(new Wn(.16,10,8),le.common.accent||le.common.metal);return a.position.y=e+1.85,n.add(a),n.userData.footprint={w:i*1.4,d:i*1.4,h:e+1.5},n}function Rh({w:i=7,h:e=5.2,text:t="城中村"}){let n=new Be,s=new Ee({color:6963256,roughness:.88});for(let c of[-1,1]){let h=new U(new oe(.6,e,.6),s);h.position.set(c*(i/2-.3),e/2,0),h.castShadow=!0,n.add(h)}let r=new U(new oe(i,.95,.7),s);r.position.y=e-.5,r.castShadow=!0,n.add(r);let a=new U(new oe(i+1.2,.28,1.4),le.common.dark);a.position.y=e+.05,a.castShadow=!0,n.add(a);let o=new U(new nt(i*.62,.72),xc(t,{bg:"#5a3630",fg:"#e8dcc0",font:'700 74px "Microsoft YaHei",sans-serif'}));o.position.set(0,e-.5,.37),n.add(o);let l=o.clone();return l.position.z=-.37,l.rotation.y=Math.PI,n.add(l),n}function Ts({len:i,h:e=2.4,tier:t=2,kind:n="brick"}){let s=new Be,r;if(n==="hoarding"?r=_n($n({base:"#4d6a78",ribMM:200}),{roughness:.85,metalness:0}):n==="railing"?r=null:r=_n(Zn({base:t<=1?"#84827a":"#9a9890",wet:.15,crack:10}),{roughness:.94}),n==="railing"){let a=Math.max(2,Math.round(i/2.2));for(let o=0;o<=a;o++){let l=new U(new oe(.1,e,.1),le.common.metal);l.position.set(-i/2+o*i/a,e/2,0),s.add(l)}for(let o=0;o<3;o++){let l=new U(new oe(i,.06,.06),le.common.metal);l.position.set(0,.35+o*(e-.5)/2,0),s.add(l)}}else{let a=new U(new oe(i,e,.26),r);a.position.y=e/2,a.castShadow=!0,a.receiveShadow=!0,s.add(a);let o=new U(new oe(i+.1,.12,.36),le.common.trim||le.common.metalLight);o.position.y=e+.06,s.add(o)}return s.userData.footprint={w:i,d:.3,h:e},s}function Mr({w:i=3.6,h:e=2.2,y:t=2.6,text:n="招工",bg:s="#3a4a58",fg:r="#e8e4d8",legs:a=!0}){let o=new Be,l=new U(new oe(i,e,.12),le.common.dark);l.position.y=t,l.castShadow=!0,o.add(l);let c=new U(new nt(i*.94,e*.88),xc(n,{bg:s,fg:r,w:512,h:Math.round(512*e/i)}));if(c.position.set(0,t,.07),o.add(c),a)for(let h of[-1,1]){let u=new U(new Xe(.06,.06,t-e/2,8),le.common.metal);u.position.set(h*i*.34,(t-e/2)/2,0),o.add(u)}return o}function jp({h:i=9,arms:e=3}={}){let t=new Be,n=new U(new Xe(.15,.19,i,10),_n(Zn({base:"#8b8a80",wet:0,crack:8}),{roughness:.95}));n.position.y=i/2,n.castShadow=!0,t.add(n);for(let s=0;s<e;s++){let r=new U(new oe(1.9,.09,.09),le.common.metal);r.position.y=i-1.6+s*.75,r.castShadow=!0,t.add(r)}return t}function vc(i,e,t=.9){let n=new P().addVectors(i,e).multiplyScalar(.5);n.y-=t;let s=new ir([i,n,e]),r=new ra(s,20,.022,5,!1);return new U(r,new Ee({color:3817285,roughness:.85}))}function Ch({h:i=7,tier:e=2}={}){let t=new Be,n=new U(new Xe(.09,.13,i,10),le.common.metal);n.position.y=i/2,n.castShadow=!0,t.add(n);let s=new U(new oe(1.5,.09,.09),le.common.metal);s.position.set(.7,i-.1,0),s.rotation.z=.16,t.add(s);let r=new U(new oe(.72,.14,.34),le.common.metalLight);r.position.set(1.4,i-.24,0),t.add(r);let a=new U(new nt(.6,.28),new Kt({color:e>=3?16773320:15259816,transparent:!0,opacity:.5}));return a.rotation.x=Math.PI/2,a.position.set(1.4,i-.33,0),a.userData.noMerge=!0,t.add(a),t.userData.lampHead={x:1.4,y:i-.35,z:0},t.userData.lampBulb=a,t}function Ph({h:i=5.2,kind:e="broad",tier:t=2}={}){let n=new Be,s=new Ee({color:4865844,roughness:.95}),r=t>=3?[4612154,4085302,5269572]:[3951156,4476986,3556398],a=i*(e==="palm"?.82:.46),o=new U(new Xe(i*.035,i*.055,a,7),s);if(o.position.y=a/2,o.castShadow=!0,n.add(o),e==="palm")for(let l=0;l<7;l++){let c=l/7*Math.PI*2,h=new U(new nt(i*.55,i*.14),new Ee({color:Nn(r),roughness:.9,side:Ut}));h.position.set(Math.cos(c)*i*.24,a+.2,Math.sin(c)*i*.24),h.rotation.set(-.5,-c,.2),n.add(h)}else{let l=Fi(3,4);for(let c=0;c<l;c++){let h=i*at(.24,.34),u=new U(new sr(h,1),new Ee({color:Nn(r),roughness:.97,flatShading:!0}));u.position.set(at(-i*.16,i*.16),a+h*at(.5,1.1),at(-i*.16,i*.16)),u.castShadow=!0,n.add(u)}}return n.userData.footprint={w:.5,d:.5,h:i},n}function Jp({w:i=1.6,d:e=1.6,h:t=.5}){let n=new Be,s=new U(new oe(i,t,e),le.common.stone);s.position.y=t/2,s.castShadow=!0,s.receiveShadow=!0,n.add(s);let r=new U(new oe(i*.86,.1,e*.86),new Ee({color:3813672,roughness:1}));r.position.y=t+.02,n.add(r);for(let a=0,o=Fi(3,6);a<o;a++){let l=new U(new sr(at(.14,.26),0),new Ee({color:Nn([4215342,4873268,5917242,6969924]),roughness:.98,flatShading:!0}));l.position.set(at(-i/3,i/3),t+.16,at(-e/3,e/3)),l.castShadow=!0,n.add(l)}return n}function Qp({len:i=2.2,h:e=1,kind:t="fence"}){let n=new Be;if(t==="cone"){let s=new U(new fs(.26,.62,10),new Ee({color:10111540,roughness:.85}));s.position.y=.31,s.castShadow=!0,n.add(s);let r=new U(new oe(.46,.05,.46),le.common.dark);r.position.y=.025,n.add(r)}else if(t==="stone"){let s=new U(new Wn(.3,12,8),le.common.stone);s.scale.y=.85,s.position.y=.24,s.castShadow=!0,n.add(s)}else{let s=new U(new oe(i,.08,.08),le.common.metalLight);s.position.y=e,s.castShadow=!0,n.add(s);let r=s.clone();r.position.y=e*.55,n.add(r);for(let a=0;a<=2;a++){let o=new U(new Xe(.05,.05,e,8),le.common.metalLight);o.position.set(-i/2+a*i/2,e/2,0),n.add(o)}}return n}function em({w:i=8,h:e=9,d:t=1.2}){let n=new Be,s=le.common.metalLight,r=Math.max(2,Math.round(i/1.8));for(let l=0;l<=r;l++){let c=-i/2+l*i/r;for(let h of[-1,1]){let u=new U(new Xe(.055,.055,e,8),s);u.position.set(c,e/2,h*t/2),n.add(u)}}let a=Math.max(2,Math.round(e/2.2));for(let l=1;l<=a;l++){let c=l*e/(a+1);for(let u of[-1,1]){let d=new U(new oe(i,.07,.07),s);d.position.set(0,c,u*t/2),n.add(d)}let h=new U(new oe(i,.08,t*.92),le.common.wood);h.position.set(0,c,0),h.receiveShadow=!0,n.add(h)}let o=new U(new nt(i,e*.95),new Ee({color:3099194,roughness:.98,transparent:!0,opacity:.82,side:Ut}));return o.position.set(0,e/2,t/2+.03),n.add(o),n.userData.footprint={w:i,d:t,h:e},n}function tm({h:i=26,jib:e=20}){let t=new Be,n=new Ee({color:9071162,roughness:.72,metalness:.35}),s=new U(new oe(3.2,.6,3.2),le.common.dark);s.position.y=.3,s.castShadow=!0,t.add(s);let r=new U(new oe(1.1,i,1.1),n);r.position.y=i/2+.6,r.castShadow=!0,t.add(r);let a=new U(new oe(e,.42,.5),n);a.position.set(e/2-2,i+.9,0),a.castShadow=!0,t.add(a);let o=new U(new oe(e*.3,.7,.9),le.common.dark);o.position.set(-e*.18-2,i+.9,0),t.add(o);let l=new U(new oe(1.2,1.2,1.4),le.common.metalLight);l.position.set(1.4,i+.2,.5),t.add(l);let c=new U(new Xe(.05,.05,5,6),le.common.metal);return c.position.set(e*.4,i-1.6,0),t.add(c),t.userData.footprint={w:3.4,d:3.4,h:i},t}function br({color:i=3817800,kind:e="sedan"}={}){let t=new Be,n=new Ee({color:i,roughness:.42,metalness:.42});if(e==="truck"){let s=new U(new oe(2.2,2,2.4),n);s.position.set(0,1.5,2.6),s.castShadow=!0,t.add(s);let r=new U(new oe(2.5,2.6,5.4),_n($n({base:"#7a7f78",ribMM:110}),{roughness:.82}));r.position.set(0,1.9,-1.6),r.castShadow=!0,t.add(r);let a=new Xe(.62,.62,.4,12);for(let o of[-1.2,1.2])for(let l of[3,-1,-3.4]){let c=new U(a,le.common.rubber);c.rotation.z=Math.PI/2,c.position.set(o,.62,l),t.add(c)}t.userData.footprint={w:2.6,d:8.8,h:3.2}}else{let s=new U(new oe(1.86,.7,4.4),n);s.position.y=.72,s.castShadow=!0,t.add(s);let r=new U(new oe(1.7,.62,2.2),le.common.glassPane);r.position.set(0,1.32,-.15),r.castShadow=!0,t.add(r);let a=new Xe(.34,.34,.26,12);for(let o of[-.86,.86])for(let l of[1.45,-1.45]){let c=new U(a,le.common.rubber);c.rotation.z=Math.PI/2,c.position.set(o,.34,l),t.add(c)}t.userData.footprint={w:2,d:4.6,h:1.7}}return t}function Sr({kind:i="scooter",color:e=3095108}={}){let t=new Be,n=new Xe(i==="bike"?.34:.27,i==="bike"?.34:.27,i==="bike"?.05:.1,14);if(i==="tricycle"){let s=new U(new oe(1.3,.5,2),_n($n({base:"#6a5a4a"}),{roughness:.88}));s.position.set(0,.62,-.9),s.castShadow=!0,t.add(s);let r=new U(new oe(.6,.7,.9),new Ee({color:e,roughness:.6,metalness:.3}));r.position.set(0,.75,1),t.add(r);let a=new Xe(.28,.28,.1,12);for(let c of[-.7,.7]){let h=new U(a,le.common.rubber);h.rotation.z=Math.PI/2,h.position.set(c,.28,-1.3),t.add(h)}let o=new U(a,le.common.rubber);o.rotation.z=Math.PI/2,o.position.set(0,.28,1.35),t.add(o);let l=new U(new oe(.7,.06,.06),le.common.metal);l.position.set(0,1.2,1.1),t.add(l),t.userData.footprint={w:1.5,d:3,h:1.3}}else if(i==="bike"){let s=new U(new oe(.08,.5,1.1),new Ee({color:e,roughness:.6,metalness:.4}));s.position.set(0,.66,0),s.rotation.x=.1,t.add(s);let r=new U(new oe(.6,.05,.05),le.common.metal);r.position.set(0,1.02,.52),t.add(r);let a=new U(new oe(.2,.09,.36),le.common.dark);a.position.set(0,.94,-.34),t.add(a);for(let o of[.56,-.56]){let l=new U(n,le.common.rubber);l.rotation.z=Math.PI/2,l.position.set(0,.34,o),t.add(l)}t.userData.footprint={w:.6,d:1.6,h:1.1}}else{let s=new U(new oe(.5,.36,1.5),new Ee({color:e,roughness:.55,metalness:.35}));s.position.y=.62,s.castShadow=!0,t.add(s);let r=new U(new oe(.44,.16,.7),le.common.dark);r.position.set(0,.86,-.16),t.add(r);for(let o of[.62,-.62]){let l=new U(n,le.common.rubber);l.rotation.z=Math.PI/2,l.position.set(0,.27,o),t.add(l)}let a=new U(new oe(.62,.06,.06),le.common.metal);a.position.set(0,1.06,.58),t.add(a),t.userData.footprint={w:.7,d:1.7,h:1.2}}return t}function Va({color:i=9075258,large:e=!1}={}){let t=new Be;if(e){let n=new U(new oe(1.6,1.1,1),new Ee({color:Nn([3824202,4872810,5920072]),roughness:.82,metalness:.2}));n.position.y=.55,n.castShadow=!0,t.add(n);let s=new U(new oe(1.66,.1,1.06),le.common.dark);s.position.y=1.14,s.rotation.x=-.12,t.add(s);let r=new Xe(.16,.16,.1,10);for(let a of[-.66,.66])for(let o of[-.4,.4]){let l=new U(r,le.common.rubber);l.rotation.z=Math.PI/2,l.position.set(a,.16,o),t.add(l)}t.userData.footprint={w:1.7,d:1.1,h:1.2}}else{let n=new U(new Xe(.36,.3,.92,12),new Ee({color:i,roughness:.75}));n.position.y=.46,n.castShadow=!0,t.add(n);let s=new U(new Xe(.39,.39,.08,12),le.common.dark);s.position.y=.94,t.add(s),t.userData.footprint={w:.8,d:.8,h:1}}return t}function Ih(){let i=new Be,e=new U(new oe(1.7,.09,.48),le.common.wood);e.position.y=.46,e.castShadow=!0,i.add(e);let t=new U(new oe(1.7,.4,.08),le.common.wood);t.position.set(0,.72,-.2),i.add(t);for(let n of[-.7,.7]){let s=new U(new oe(.08,.46,.44),le.common.metal);s.position.set(n,.23,0),i.add(s)}return i}function nm(){let i=new Be,e=new U(new oe(4.6,.14,1.6),le.common.metalLight);e.position.y=2.6,e.castShadow=!0,i.add(e);for(let r of[-2.1,2.1]){let a=new U(new Xe(.07,.07,2.6,8),le.common.metal);a.position.set(r,1.3,-.6),i.add(a)}let t=new U(new nt(4.4,1.7),le.common.glassPane);t.position.set(0,1.7,-.72),i.add(t);let n=new U(new oe(3.2,.09,.4),le.common.dark);n.position.set(0,.55,-.5),i.add(n);let s=new U(new nt(.7,1),xc(`公交
站`,{bg:"#2f3f52",fg:"#d8dce0",w:256,h:380}));return s.position.set(2.5,2,0),i.add(s),i}function Lh({r:i=2.4}={}){let e=new Be,t=new U(new Xe(i,i*1.05,.6,24),le.common.stone);t.position.y=.3,t.receiveShadow=!0,e.add(t);let n=new U(new Xe(i*.92,i*.92,.1,24),new Ee({color:2767426,roughness:.14,metalness:.5}));n.position.y=.58,e.add(n);let s=new U(new Xe(.14,.3,1.2,12),new Ee({color:5925490,roughness:.3,metalness:.4,transparent:!0,opacity:.6}));return s.position.y=1.2,e.add(s),e.userData.footprint={w:i*2.2,d:i*2.2,h:.7},e}function im({h:i=9,color:e=9054754}={}){let t=new Be,n=new U(new Xe(.06,.08,i,8),le.common.metalLight);n.position.y=i/2,t.add(n);let s=new U(new nt(1.8,1.2),new Ee({color:e,roughness:.9,side:Ut}));return s.position.set(.9,i-.85,0),t.add(s),t}function Dh({len:i=6,rows:e=3,gap:t=1.1}={}){let n=new Be;for(let s=0;s<e;s++){let r=new U(new oe(i,.06,.06),le.common.metalLight);r.position.set(0,.9,-s*t),n.add(r);let a=r.clone();a.position.y=.55,n.add(a);for(let o=0;o<=4;o++){let l=new U(new Xe(.045,.045,.95,6),le.common.metalLight);l.position.set(-i/2+o*i/4,.48,-s*t),n.add(l)}}return n}function sm({icon:i="❓",label:e="",color:t=14201946,y:n=0}){let s=new Be,r=document.createElement("canvas");r.width=256,r.height=256;let a=r.getContext("2d");a.strokeStyle="rgba(232,214,150,0.95)",a.lineWidth=10,a.beginPath(),a.arc(128,128,104,0,Math.PI*2),a.stroke();let o=a.createRadialGradient(128,128,20,128,128,100);o.addColorStop(0,"rgba(232,214,150,0.42)"),o.addColorStop(1,"rgba(232,214,150,0)"),a.fillStyle=o,a.beginPath(),a.arc(128,128,100,0,Math.PI*2),a.fill();let l=new U(new nt(2.4,2.4),new Kt({map:new Pn(r),transparent:!0,depthWrite:!1}));l.rotation.x=-Math.PI/2,l.position.y=.06+n,s.add(l);let c=document.createElement("canvas");c.width=256,c.height=128;let h=c.getContext("2d");h.fillStyle="rgba(24,28,30,0.82)",h.beginPath(),h.roundRect(6,6,244,116,16),h.fill(),h.fillStyle="#f0e8d0",h.font='700 76px "Microsoft YaHei","PingFang SC",sans-serif',h.textAlign="center",h.textBaseline="middle",h.fillText(i||"?",128,66);let u=new U(new nt(1.5,.75),new Kt({map:new Pn(c),transparent:!0,depthWrite:!1}));return u.position.y=2.15,s.add(u),s.userData.hotspot={icon:i,label:e,color:t,sprite:u,ring:l},s}function Mc({len:i=140,w:e=12,x:t=0,z:n=0,mat:s=null}){let r=s||le.common.asphalt,a=r.map&&r.map.userData&&r.map.userData.surface?r.map.userData.surface.metersPerRepeat:wn,o=Ni(r,e,i,a),l=new U(new nt(e,i),o);return l.rotation.x=-Math.PI/2,l.position.set(t,.012,n),l.receiveShadow=!0,l}function rm({len:i=140,w:e=3.4,x:t=0,z:n=0}){let s=le.common.paver.map&&le.common.paver.map.userData&&le.common.paver.map.userData.surface?le.common.paver.map.userData.surface.metersPerRepeat:wn,r=Ni(le.common.paver,e,i,s),a=new U(new nt(e,i),r);return a.rotation.x=-Math.PI/2,a.position.set(t,.02,n),a.receiveShadow=!0,a}function Nh({len:i=140,x:e=0,z:t=0,h:n=.16}){let s=new U(new oe(.22,n,i),le.common.trim||le.common.metalLight);return s.position.set(e,n/2,t),s.receiveShadow=!0,s}function am({len:i=12,x:e=0,z:t=0,stripes:n=7}){let s=new Be;for(let r=0;r<n;r++){let a=new U(new nt(i,.52),new Ee({color:12105388,roughness:.94}));a.rotation.x=-Math.PI/2,a.position.set(e,.028,t-(n-1)*1/2+r*1),a.receiveShadow=!0,s.add(a)}return s}var ae=(i,e)=>i+Math.random()*(e-i),on=(i,e)=>Math.floor(ae(i,e+1)),Ct=i=>i[Math.floor(Math.random()*i.length)],qe=i=>Math.random()<i,Uh=class{constructor(e,t,n){this.scene=e,this.spec=t,this.tier=n,this.T=Ui(n),this.group=new Be,this.group.name=t.id,this.colliders=[],this.blockers=[],this.lots=[],this.hotspots=[],e.add(this.group)}place(e,t,n,s=0,{collide:r="auto",block:a=!1,noMerge:o=!1}={}){e.position.set(t,e.position.y,n),e.rotation.y=s,o&&(e.userData.noMerge=!0),this.group.add(e);let l=e.userData.footprint;if(l&&r!=="none"){let c=Math.cos(-s),h=Math.sin(-s),u=(Math.abs(c)*l.w+Math.abs(h)*l.d)/2,d=(Math.abs(h)*l.w+Math.abs(c)*l.d)/2,f={minX:t-u,maxX:t+u,minZ:n-d,maxZ:n+d};this.colliders.push(f),a&&this.blockers.push(f)}return e}lot(e,t,n=0,s="walk"){this.lots.push({x:e,z:t,rot:n,kind:s})}spot(e,t,n,s,r=3.6){for(let a=0;a<30;a++){let o=ae(e,t),l=ae(n,s);if(Math.hypot(o,l-(this.spawnZ||0))>=r)return[o,l]}return[nM(e,t),n<0?s-2:n+2]}addRaw(e,t=!1){return t&&(e.userData.noMerge=!0),this.group.add(e),e}};function nM(i,e){return i+(e-i)*.5}function Wa(i,e,t,n=null){let s=i.clone();if(i.map){s.map=i.map.clone(),s.map.needsUpdate=!0;let r=i.map.userData&&i.map.userData.surface?i.map.userData.surface.metersPerRepeat:null,a=n||r||4.5;s.map.repeat.set(Math.max(1,e/a),Math.max(1,t/a))}return Dp(s),s}function iM(i,e){let{group:t,T:n,spec:s}=i,r=190,a=new U(new nt(r,r),Wa(n.ground,r,r));a.rotation.x=-Math.PI/2,a.receiveShadow=!0,t.add(a);let o=i.streetLen=s.streetLen||96;if(i.courtW=s.courtW||46,i.plazaW=s.plazaW||44,i.spawnZ=12,e==="avenue"){i.roadW=i.spec.roadW||15;let l=Mc({len:r,w:i.roadW});t.add(l);for(let c of[-1,1])t.add(rm({len:r,w:3.6,x:c*(i.roadW/2+1.8)})),t.add(Nh({len:r,x:c*(i.roadW/2+.05),h:.16}));for(let c=-o/2+6;c<o/2;c+=22)t.add(am({len:Math.min(i.roadW,12),z:c}));i.laneHalf=i.roadW/2+3.8}else if(e==="lane"){i.roadW=i.spec.roadW||9.5;let l=Mc({len:r,w:i.roadW,mat:pi().common.laneSurf});t.add(l);for(let c of[-1,1])t.add(Nh({len:r,x:c*(i.roadW/2+.1),h:.12}));i.laneHalf=i.roadW/2}else if(e==="compound"){let l=new U(new nt(i.courtW,o),Wa(n.ground,i.courtW,o));l.rotation.x=-Math.PI/2,l.position.y=.014,l.receiveShadow=!0,t.add(l),i.laneHalf=i.courtW/2}else if(e==="yard"){let l=Mc({len:r,w:58});l.position.y=.014,t.add(l);for(let c=0;c<6;c++){let h=ae(8,16),u=ae(8,16),d=new U(new nt(h,u),Wa(n.ground,h,u));d.rotation.x=-Math.PI/2,d.position.set(ae(-22,22),.016,ae(-o/2,o/2)),d.receiveShadow=!0,t.add(d)}i.laneHalf=26}else{let l=new U(new nt(i.plazaW,o),Wa(n.ground,i.plazaW,o));l.rotation.x=-Math.PI/2,l.position.y=.014,l.receiveShadow=!0,t.add(l);for(let c=0;c<5;c++){let h=ae(9,18),u=ae(12,22),d=new U(new nt(h,u),Wa(pi().common.grass,h,u));d.rotation.x=-Math.PI/2,d.position.set(ae(-22,22),.018,ae(-o/2+8,o/2-8)),d.receiveShadow=!0,t.add(d)}i.laneHalf=i.plazaW/2}}function sM(i){let{spec:e,tier:t}=i,n=i.streetLen,s=i.laneHalf,r=[];for(let a of[-1,1]){let o=-n/2;for(;o<n/2;){let l=ae(6.5,10.5),c=ae(7,10),h=qe(.25)?on(2,3):on(3,e.maxFloors||6),u=$p({w:l,d:c,floors:h,tier:t}),d=a*(s+c/2+ae(.05,.6));i.place(u,d,o+l/2,0,{block:!0}),r.push({x:d,z:o+l/2,d:c,w:l,side:a}),o+=l+ae(.1,.6)}}return r}function rM(i){let{tier:e}=i,t=i.streetLen,n=i.laneHalf,s=[];for(let r of[-1,1]){let a=-t/2;for(;a<t/2;){let o=ae(12,20),l=ae(12,17),c=qe(e>=3?.62:.3),h;c?h=Ga({w:o,d:l,floors:on(e>=3?8:5,e>=3?20:11),tier:e}):h=yc({w:o,d:l,floors:on(4,7),tier:e,units:Math.max(3,Math.round(o/4))});let u=r*(n+l/2);i.place(h,u,a+o/2,0,{block:!0}),s.push({x:u,z:a+o/2,d:l,w:o,side:r}),a+=o+ae(.6,2.2)}}return s}function aM(i){let{spec:e,tier:t}=i,n=i.streetLen,s=i.courtW||46,r=s/2,a=t>=3?2:2.4,o=t>=3?"railing":"brick",l=9;for(let h of[-1,1])i.place(Ts({len:n,h:a,tier:t,kind:o}),h*(r+.4),0,Math.PI/2,{collide:"auto"});for(let h of[-1,1]){let u=(s-l)/2;i.place(Ts({len:u,h:a,tier:t,kind:o}),-(s+l)/4,h*(n/2-.4),0,{}),i.place(Ts({len:u,h:a,tier:t,kind:o}),(s+l)/4,h*(n/2-.4),0,{})}let c=[];for(let h of[-1,1]){let u=-n/2+8,d=e.blocks||3;for(let f=0;f<d;f++){let p=ae(14,22),x=ae(10,14),g;e.structure==="tower"?g=Ga({w:p,d:x,floors:on(7,16),tier:t,podium:!1}):e.structure==="hall"?g=vr({w:p,d:x,h:ae(10,15),tier:t,steps:!1,columns:f===0,roofStyle:"flat"}):g=yc({w:p,d:x,floors:e.floors||on(4,6),tier:t,units:Math.max(3,Math.round(p/4))});let m=h*(r-x/2-ae(.5,1.5));i.place(g,m,u+p/2,0,{block:!0}),c.push({x:m,z:u+p/2,d:x,w:p,side:h}),u+=p+ae(4,9)}}if(e.gate!==!1){let h=Rh({w:l+.6,h:5.4,text:e.shortName||e.name});i.place(h,0,n/2-.4,0,{})}return i.spawnZ=n/2-16,c}function oM(i){let{spec:e,tier:t}=i,n=i.streetLen,s=[];if(e.structure==="site"){let c=ae(20,26),h=ae(14,18),u=on(3,6),d=-5,f=i.spawnZ-(h/2+6),p=cM({w:c,d:h,floors:u,tier:t});i.place(p,d,f,.06,{block:!0});let x=em({w:c*.5,h:u*2.9,d:1.4});i.place(x,d-c*.24,f+h/2+1.3,0,{});let g=tm({h:26+u*2.8,jib:22});i.place(g,12,3,.6,{});for(let v of[-1,1])i.place(Ts({len:n,h:2.6,tier:t,kind:"hoarding"}),v*24,0,Math.PI/2,{});for(let v of[-1,1])i.place(Ts({len:40,h:2.6,tier:t,kind:"hoarding"}),0,v*(n/2),0,{});let m=Eh({w:8,d:4.6,h:3.2,tier:t,sawtooth:!1,doors:1,panel:pi().common.panelRust});return i.place(m,-15,24,.18,{block:!0}),i.lots.push({x:d,z:f+h/2+4,rot:0,kind:"site-center"}),i.lots.push({x:4,z:20,rot:0,kind:"site"}),i.lots.push({x:-14,z:18,rot:0,kind:"site"}),i.spawnZ=22,s}let r=5;i.spawnZ=n/2-30;let a=-n/2+6;for(;a<n/2-10;){let c=ae(15,21),h=ae(11,15),u=ae(6,9.5),d=qe(.5)?-1:1,f=Eh({w:c,d:h,h:u,tier:t,sawtooth:qe(.7),doors:on(2,3)}),p=d*(r+h/2+ae(0,2));i.place(f,p,a+c/2,d>0?0:Math.PI,{block:!0}),s.push({x:p,z:a+c/2,d:h,w:c,side:d}),a+=c+ae(3,8)}for(let c=0;c<5;c++){let h=_c({w:ae(5,7),d:2.5,h:ae(2.5,3),color:Ct([4151914,5917242,4872772,6969930])}),u=Ct([-1,1])*ae(2,12);i.place(h,u,lM(-n/2+6,n/2-6,i.spawnZ),ae(-.4,.4)+(qe(.5)?0:Math.PI/2),{})}let o=c=>{let h=qe(.5)?1:-1,[u,d]=i.spot(h*2.4,h*7.5,-n/2+8,n/2-8,c);return Math.abs(d-i.spawnZ)<7?[u,d+(d<i.spawnZ?-8:8)]:[u,d]};for(let c=0;c<4;c++){let h=new Be,u=ae(4.2,6.2),d=2.5,f=_c({w:u,d,h:2.6,color:Ct([4151914,4872772,6969930,5917242])});if(h.add(f),qe(.45)){let g=_c({w:u,d,h:2.6,color:Ct([4872772,4151914,6969930])});g.position.y=2.6,g.rotation.y=qe(.5)?0:.06,h.add(g)}let[p,x]=o(9);h.userData.footprint={w:u,d,h:2.6},i.place(h,p,x,qe(.5)?0:Math.PI/2,{})}for(let c=0;c<8;c++){let h=new U(qe(.5)?new Xe(ae(.3,.55),ae(.3,.55),ae(2.2,4.5),10):new oe(ae(1.2,2.2),ae(.5,1.1),ae(.8,1.4)),new Ee({color:Ct([5921362,6974050,4868678,6969930]),roughness:.82,metalness:.3}));h.position.y=.5,h.rotation.z=Math.PI/2,h.castShadow=!0;let[u,d]=o(8);i.place(h,u,d,ae(0,Math.PI),{})}i.spawnZ=n/2-30;let l=on(1,2);for(let c=0;c<l;c++){let[h,u]=o(7);i.place(cc({large:qe(.4),tier:t}),h,u,ae(0,Math.PI*2),{})}{let c=Ct([-1,1])*ae(9,15);i.place(uc({kind:Ct(["medium","large"])}),c,-n/2+ae(8,14),0,{});let h=-c;i.place(hc(),h,-n/2+ae(10,16),ae(0,Math.PI*2),{})}for(let c=0;c<4;c++){let[h,u]=i.spot(-8,8,-n/2+8,n/2-8,5);i.place(dc(),h,u,0,{})}return s}function lM(i,e,t){for(let n=0;n<20;n++){let s=ae(i,e);if(Math.abs(s-(t||0))>4)return s}return i}function cM({w:i,d:e,floors:t,tier:n=1}){let s=new Be,r=3,a=pi().common.stone,o={x:Math.max(2,Math.round(i/4)),z:Math.max(2,Math.round(e/4))};for(let c=0;c<t;c++){let h=c*r,u=new U(new oe(i,.28,e),a);u.position.set(0,h+.14,0),u.castShadow=!0,u.receiveShadow=!0,s.add(u);for(let d=0;d<=o.x;d++)for(let f=0;f<=o.z;f++){if(d>0&&d<o.x&&f>0&&f<o.z)continue;let p=new U(new oe(.42,r,.42),a);p.position.set(-i/2+d*i/o.x,h+r/2,-e/2+f*e/o.z),p.castShadow=!0,s.add(p)}}let l=Math.max(2,Math.round(e/4));for(let c=0;c<=l;c++){let h=new U(new oe(i*.94,r*.6,.2),a);h.position.set(0,t*r+r*.3,-e/2+c*e/l),h.castShadow=!0,s.add(h)}for(let c=0;c<14;c++){let h=new U(new Xe(.045,.045,ae(.5,1.3),5),new Ee({color:6969930,roughness:.7,metalness:.5}));h.position.set(ae(-i/2,i/2),t*r+ae(.3,.8),ae(-e/2,e/2)),s.add(h)}return s.userData.footprint={w:i,d:e,h:t*r},s}function uM(i){let{spec:e,tier:t}=i,n=i.streetLen,s=[],r=e.mainW||(e.structure==="tower"?ae(18,24):ae(24,34)),a=ae(12,18),o;e.structure==="tower"?o=Ga({w:r,d:a,floors:on(10,20),tier:t}):e.structure==="teaching"?o=Th({w:r,d:a,floors:on(4,6),tier:t}):e.structure==="pavilion"?o=vr({w:r,d:a,h:10,tier:t,steps:!0,columns:!0,roofStyle:"hip"}):o=vr({w:r,d:a,h:e.mainH||ae(11,17),tier:t,steps:e.steps!==!1,columns:!0,roofStyle:e.hipRoof?"hip":"flat"});let l=-n/2+a/2+14;i.place(o,0,l,0,{block:!0}),s.push({x:0,z:l,d:a,w:r,side:0}),i.spawnZ=Math.min(n/2-8,l+a/2+13);for(let h of[-1,1]){if(qe(.25))continue;let u=ae(14,22),d=ae(10,15),f;e.structure==="teaching"?f=Th({w:u,d,floors:on(3,5),tier:t,corridor:qe(.5)}):t>=3&&qe(.5)?f=Ga({w:u*.8,d,floors:on(6,12),tier:t,podium:!1}):f=yc({w:u,d,floors:on(3,6),tier:t,units:Math.max(2,Math.round(u/4))}),i.place(f,h*ae(20,27),l+ae(6,16),h>0?-.35:.35,{block:!0}),s.push({x:h*22,z:l+10,d,w:u,side:h})}if(e.flagPole)for(let h=0;h<3;h++)i.place(im({h:11}),(h-1)*4.5,l+a/2+9,0,{});if(e.gate){for(let u of[-1,1])i.place(Ts({len:n/2-10/2,h:2.2,tier:t,kind:"railing"}),u*(n/4+10/4),n/2-1.5,0,{});i.place(Rh({w:10+.8,h:5.6,text:e.shortName||e.name}),0,n/2-1.5,0,{})}let c=e.gate?0:on(2,4);for(let h=0;h<c;h++){let[u,d]=i.spot(-10,10,-n/2+10,n/2-10,7);i.place(gc({variant:qe(.5)?"a":"b"}),u,d,ae(0,Math.PI*2),{})}return s}var Er={slum:["便利超市","五金水电","平价水果","阿强理发","兰州拉面","手机维修","废品回收","宽带办理"],wholesaleMarket:["南北干货","冻品批发","粮油批发","一次性用品","塑料制品"],night_market:["烧烤","麻辣烫","炒粉炒面","烤冷面","炸串","柠檬茶","铁板鱿鱼","糖水"],flea_market:["收旧手机","二手书","旧家电","古玩杂项","旧衣翻新","维修钟表"],flower_bird_market:["绿植花卉","观赏鱼","鸟笼鸟粮","宠物用品","盆栽多肉"],vegetable_market:["时令蔬菜","猪牛羊肉","活鱼水产","粮油副食","豆制品","干货调料"],internet_cafe:["网咖","电竞馆","奶茶"],commercialDist:["潮流服饰","数码旗舰店","美妆","烘焙","零食优选","运动装备"],entertainment:["KTV","电玩城","影城","棋牌室","酒吧"],auto_city:["汽车销售","轮胎店","汽修厂","汽车美容","汽配"],bank:["储蓄所","理财中心","ATM"],trainingCenter:["公考培训","电工焊工","会计实操","电脑培训"],default:["杂货","快递代收","小卖部"]};function hM(i,e,t){let{spec:n,tier:s}=i,r=i.streetLen,a=i.laneHalf,o=pi(),l=(u,d,f,p,x)=>i.spot(u,d,f,p,x),c=Math.max(3,Math.round((n.footfall||.6)*10));for(let u=0;u<c;u++){let[d,f]=l(-a,a,-r/2,r/2),p=Va({color:Ct([9075258,4155972,3820122]),large:qe(.3)});i.place(p,d,f,ae(0,Math.PI*2))}let h=Math.max(1,Math.round((n.footfall||.6)*3));for(let u=0;u<h;u++){let[d,f]=l(-a,a,-r/2+3,r/2-3,4.5);i.place(fc(),d,f,ae(-.3,.3)+(qe(.5)?0:Math.PI/2),{})}for(let u=-r/2+6;u<r/2;u+=16)for(let d of[-1,1]){if(Math.abs(u-i.spawnZ)<3)continue;let f=Ch({h:7.4,tier:s});i.place(f,d*(a-.5),u,d>0?Math.PI:0,{})}if(e==="lane"){let u=Er[n.id]||Er.default;t.forEach((f,p)=>{if(qe(.42))return;let x=u[p%u.length],g=Sh({width:Math.min(f.w*.86,5.6),sign:x,tier:s,open:qe(.65)});g.position.set(Math.sign(f.x)*(Math.abs(f.x)-f.d/2-.16),0,f.z),g.rotation.y=f.x>0?-Math.PI/2:Math.PI/2,i.addRaw(g),i.lot(Math.sign(f.x)*(Math.abs(f.x)-f.d/2-1.7),f.z,0,"shop")});let d=[];for(let f=-r/2+4;f<=r/2-4;f+=9)for(let p of[-1,1]){let x=jp(),g=p*(a+.6);i.place(x,g,f+ae(-1.2,1.2),0,{}),d.push(x),i.colliders.push({minX:g-.28,maxX:g+.28,minZ:x.position.z-.28,maxZ:x.position.z+.28})}for(let f=0;f<d.length;f++){let p=d[f],x=d[f+2];if(x)for(let g=0;g<2;g++){let m=7.3-g*.7;i.addRaw(vc(new P(p.position.x,m,p.position.z),new P(x.position.x,m,x.position.z),ae(.7,1.5)))}if(qe(.68)){let g=d.find(m=>Math.sign(m.position.x)!==Math.sign(p.position.x)&&Math.abs(m.position.z-p.position.z)<3.6);g&&i.addRaw(vc(new P(p.position.x,ae(6.2,7.4),p.position.z),new P(g.position.x,ae(6.2,7.4),g.position.z),ae(1,2)))}}for(let f=0;f<9;f++){let p=qe(.5)?-1:1,[x,g]=l(p*a*.42,p*a*.66,-r/2+2,r/2-2),m=qe(.22)?"tricycle":qe(.2)?"bike":"scooter",v=Sr({kind:m,color:Ct([3095108,7027252,3820090,5593696])});v.rotation.y=p>0?ae(-.4,.4)+Math.PI:ae(-.4,.4),i.place(v,x,g,v.rotation.y,{})}if(n.id==="night_market"){for(let f=-r/2+8;f<r/2-6;f+=ae(6.5,10))for(let p of[-1,1]){let[x,g]=l(p*(a-1.5),p*(a-1.2),f-1,f+1,2.4),m=wh({w:ae(2,2.8),d:1.2,tier:s,box:!0});i.place(m,x,g,p>0?Math.PI/2:-Math.PI/2,{}),i.lot(x-p*1.4,g,0,"stall")}for(let f=-r/2+10;f<r/2-8;f+=9){let x=new P(-a-.3,5.2,f),g=new P(a+.3,5.2,f+ae(-1,1));i.addRaw(vc(x,g,.5));for(let m=1;m<9;m++){let v=new P().lerpVectors(x,g,m/9);v.y-=Math.sin(m/9*Math.PI)*.5;let E=new U(new Wn(.075,6,5),new Kt({color:Ct([16767120,16756832,16771248])}));E.position.copy(v),i.addRaw(E)}}}for(let f=0;f<3;f++){let[p,x]=l(-a*.9,a*.9,-r/2+6,r/2-6,6);i.place(pc(),p,x,ae(-.2,.2),{})}t.forEach((f,p)=>{if(qe(.55))return;let x=qe(.4),g=mc({wide:x}),m=Math.sign(f.x)||1;i.place(g,m*(Math.abs(f.x)-f.d/2-.5),f.z,m>0?-Math.PI/2:Math.PI/2,{})});return}if(e==="avenue"){let u=Er[n.id]||Er.default,d=0;for(let x of t){let g=on(1,3),m=x.w/(g+.4);for(let v=0;v<g;v++){let E=u[d++%u.length],y=Sh({width:m,sign:E,tier:s,open:qe(.78),height:3.8}),S=x.z-x.w/2+m*(v+.7);y.position.set(Math.sign(x.x)*(Math.abs(x.x)-x.d/2-.18),0,S),y.rotation.y=x.x>0?-Math.PI/2:Math.PI/2,i.addRaw(y),i.lot(Math.sign(x.x)*(Math.abs(x.x)-x.d/2-2.1),S,0,"shop")}}for(let x=0;x<4;x++){let[g,m]=l(-18,18,-r/2+10,r/2-10);i.place(Mr({w:ae(3,4.6),h:ae(2,3),y:ae(3,4.4),text:Ct(["限时特惠","全场五折","新店开业","招聘中","分期免息"]),bg:Ct(["#3a4a58","#5a3038","#3f4a3a"]),fg:"#e8e4d8"}),g,m,ae(-.3,.3)+(qe(.5)?0:Math.PI/2),{})}for(let x=0;x<7;x++){let g=qe(.5)?-1:1,[m,v]=l(g*2.5,g*(a-4),-r/2+4,r/2-4,4.5),E=br({color:Ct([3817800,6975348,3095108,5917252,9080722])});i.place(E,m,v,g>0?0:Math.PI,{})}for(let x=0;x<8;x++){let g=qe(.5)?-1:1,[m,v]=l(g*(a-1.4),g*(a-.2),-r/2,r/2,3.2),E=Sr({kind:qe(.3)?"bike":"scooter",color:Ct([3095108,7027252,3820090])});i.place(E,m,v,ae(0,Math.PI*2),{})}let[f,p]=l(-14,14,-r/2+8,r/2-8,6);i.place(nm(),f,p,qe(.5)?Math.PI:0,{});return}if(e==="compound"){for(let u=0;u<10;u++){let[d,f]=l(-a+2,a-2,-r/2+5,r/2-5);i.place(Ph({h:ae(4.5,7),tier:s}),d,f,ae(0,Math.PI*2),{})}for(let u=0;u<8;u++){let[d,f]=l(-a+3,a-3,-r/2+6,r/2-6);i.place(Ih(),d,f,ae(0,Math.PI*2),{})}for(let u=0;u<6;u++){let[d,f]=l(-a+2,a-2,-r/2+5,r/2-5);i.place(Va({color:Ct([4155972,9075258])}),d,f,ae(0,Math.PI*2),{})}for(let u=0;u<12;u++){let[d,f]=l(-a+3,a-3,-r/2+6,r/2-6,2.6),p=Sr({kind:qe(.65)?"bike":"scooter",color:Ct([3820090,4868698,5913146])});i.place(p,d,f,ae(0,Math.PI*2),{})}for(let u=0;u<3;u++){let[d,f]=l(-a+4,a-4,-r/2+10,r/2-10,5);i.place(Mr({w:3.2,h:1.8,y:2.2,text:Ct(["社区公告","文明公约",`收费标准
明码标价`,"招聘信息"]),bg:"#e0dcd0",fg:"#3a3a36"}),d,f,qe(.5)?0:Math.PI/2,{})}if(n.stalls){let u=Er[n.id]||Er.default,d=0;for(let f=-r/2+10;f<r/2-10;f+=4.4){for(let p of[-1,1]){let[x,g]=l(p*5,p*12,f-1.2,f+1.2,2.6),m=wh({w:ae(2.2,3),d:1.4,tier:s,box:!0});i.place(m,x,g,p>0?Math.PI/2:-Math.PI/2,{}),qe(.55)&&i.lot(x-p*1.5,g,0,"stall")}i.place(Mr({w:2.4,h:.7,y:3.4,text:u[d++%u.length],bg:"#5a4030",fg:"#e8dcc8",legs:!1}),ae(-8,8),f,0,{})}}if(n.id==="hospital"){let u=Dh({len:7,rows:3});u.position.set(0,0,i.spawnZ-12),u.userData.noMerge=!0,i.addRaw(u),i.place(br({color:14211280,kind:"truck"}),ae(-10,-5),i.spawnZ-6,Math.PI/2,{})}return}if(e==="yard"){for(let u=0;u<5;u++){let[d,f]=l(-a+5,a-5,-r/2+6,r/2-6,5),p=br({color:Ct([3817800,5921370,4872810]),kind:qe(.6)?"truck":"sedan"});i.place(p,d,f,qe(.5)?0:Math.PI/2,{})}for(let u=0;u<6;u++){let[d,f]=l(-a+4,a-4,-r/2+4,r/2-4,3.2);i.place(Sr({kind:"tricycle",color:Ct([4872778,6965818])}),d,f,ae(0,Math.PI*2),{})}for(let u=0;u<4;u++){let[d,f]=l(-a+4,a-4,-r/2+4,r/2-4,3.2);i.place(Va({large:!0}),d,f,ae(0,Math.PI*2),{})}if(n.structure==="site"){for(let u=0;u<14;u++){let[d,f]=l(-a+4,a-4,-r/2+4,r/2-4,3),p=new U(qe(.5)?new oe(ae(1.4,2.6),ae(.3,.7),ae(.9,1.5)):new Xe(ae(.3,.6),ae(.3,.6),ae(1.2,3),10),new Ee({color:Ct([6969930,9076856,5917242,4868682]),roughness:.9,metalness:.2}));p.position.y=.4,p.castShadow=!0,i.place(p,d,f,ae(0,Math.PI),{})}for(let u=0;u<8;u++){let[d,f]=l(-a+4,a-4,-r/2+4,r/2-4,3);i.place(Qp({kind:qe(.6)?"cone":"fence"}),d,f,ae(0,Math.PI*2),{})}i.place(Mr({w:5,h:1.5,y:3.2,text:"安全第一 质量为本",bg:"#8a3a2a",fg:"#f0e4cc",legs:!1}),-21,i.spawnZ+6,Math.PI/2,{})}return}for(let u=0;u<16;u++){let[d,f]=l(-a+3,a-3,-r/2+4,r/2-4);i.place(Ph({h:ae(4.5,8.5),tier:s,kind:qe(.18)?"palm":"broad"}),d,f,ae(0,Math.PI*2),{})}for(let u=0;u<7;u++){let[d,f]=l(-a+4,a-4,-r/2+8,r/2-8);i.place(Ih(),d,f,ae(0,Math.PI*2),{})}for(let u=0;u<8;u++){let[d,f]=l(-a+3,a-3,-r/2+6,r/2-6,3);i.place(Ch({h:6.6,tier:s}),d,f,ae(0,Math.PI*2),{})}for(let u=0;u<6;u++){let[d,f]=l(-a+3,a-3,-r/2+6,r/2-6);i.place(Va({color:Ct([4155972,9075258])}),d,f,0,{})}for(let u=0;u<5;u++){let[d,f]=l(-a+4,a-4,-r/2+10,r/2-10);i.place(Jp({w:ae(1.4,2.4),d:ae(1.4,2.4)}),d,f,0,{})}for(let u=0;u<5;u++){let[d,f]=l(-a+4,a-4,-r/2+8,r/2-8,2.8),p=Sr({kind:qe(.6)?"bike":"scooter",color:Ct([3820090,4868698,5913146,3095108])});i.place(p,d,f,ae(0,Math.PI*2),{})}if(n.id==="park"&&(i.place(Ah({r:2.6}),ae(-14,14),ae(-6,6),0,{}),i.place(Lh({r:3.2}),ae(-16,16),ae(2,14),0,{})),n.id==="temple"){i.place(Ah({r:2.2,tier:s}),ae(-16,-8),ae(-4,6),0,{});let u=new U(new Xe(.9,1.05,1.3,14),new Ee({color:5917242,roughness:.75,metalness:.35}));u.position.y=.65,u.castShadow=!0,i.place(u,0,i.spawnZ-16,0,{})}if(n.id==="techPark"){i.place(Lh({r:3.6}),0,i.spawnZ-18,0,{});for(let u=0;u<8;u++){let[d,f]=l(-18,18,-r/2+8,r/2-8,5);i.place(br({color:Ct([3095108,9080722,3817800,5925498])}),d,f,qe(.5)?0:Math.PI,{})}}if(n.id==="gov_office"||n.id==="court"){let u=Dh({len:8,rows:4});u.position.set(0,0,i.spawnZ-10),u.userData.noMerge=!0,i.addRaw(u);for(let d=0;d<5;d++){let[f,p]=l(-16,16,r/2-22,r/2-12,4);i.place(br({color:Ct([3095108,3817800,5921370])}),f,p,qe(.5)?0:Math.PI,{})}}if(n.id==="school"&&n.gym&&i.place(vr({w:24,d:16,h:13,tier:s,steps:!1,columns:!1,roofStyle:"flat"}),0,r/2-24,0,{block:!0}),n.id==="gym"&&i.place(vr({w:30,d:20,h:15,tier:s,steps:!0,columns:!1,roofStyle:"flat"}),0,r/2-26,0,{block:!0}),n.id==="job_market"||n.id==="library"||n.id==="community_center")for(let u=0;u<4;u++){let[d,f]=l(-16,16,-r/2+14,r/2-14,5);i.place(Mr({w:4,h:2.4,y:2.4,text:Ct([`招聘信息
每日更新`,"免费求职登记",`开放时间
09:00-21:00`,"新书上架"]),bg:"#3a4a58",fg:"#e8e4d8"}),d,f,qe(.5)?0:Math.PI/2,{})}}var bc={slum:{layout:"lane",structure:"lowRise",streetLen:100,roadW:9.5,maxFloors:6},wholesaleMarket:{layout:"yard",structure:"shed",streetLen:92},construction:{layout:"yard",structure:"site",streetLen:86},factoryZone:{layout:"yard",structure:"shed",streetLen:104},school:{layout:"plaza",structure:"teaching",streetLen:104,plazaW:50,mainW:40,gym:!0,gate:!0,shortName:"大学城"},commercialDist:{layout:"avenue",structure:"tower",streetLen:108,roadW:16},techPark:{layout:"plaza",structure:"tower",streetLen:104,plazaW:52,mainW:26,flagPole:!0},hospital:{layout:"compound",structure:"tower",streetLen:96,courtW:38,blocks:3,gate:!0,shortName:"医院"},bank:{layout:"avenue",structure:"tower",streetLen:78,roadW:14},park:{layout:"plaza",structure:"hall",streetLen:96,plazaW:56,mainW:17,mainH:8,gate:!0,shortName:"公园"},community_center:{layout:"plaza",structure:"hall",streetLen:84,plazaW:46,mainW:26,gate:!0,shortName:"社区中心"},night_market:{layout:"lane",structure:"lowRise",streetLen:96,roadW:10,maxFloors:4},trainingCenter:{layout:"compound",structure:"hall",streetLen:82,courtW:34,blocks:2,gate:!0,shortName:"培训中心"},suburb:{layout:"lane",structure:"lowRise",streetLen:110,roadW:11,maxFloors:3},luxury_community:{layout:"compound",structure:"tower",streetLen:104,courtW:40,blocks:4,gate:!0,shortName:"高档小区"},old_community:{layout:"compound",structure:"slab",streetLen:96,courtW:38,blocks:3,floors:6,gate:!0,shortName:"老旧小区"},gov_office:{layout:"plaza",structure:"hall",streetLen:96,plazaW:50,mainW:36,flagPole:!0,gate:!0,shortName:"政务大厅"},court:{layout:"plaza",structure:"hall",streetLen:92,plazaW:50,mainW:32,flagPole:!0,hipRoof:!0,gate:!0,shortName:"人民法院"},job_market:{layout:"plaza",structure:"hall",streetLen:88,plazaW:46,mainW:30,gate:!0,shortName:"人才市场"},entertainment:{layout:"avenue",structure:"tower",streetLen:96,roadW:15},temple:{layout:"plaza",structure:"pavilion",streetLen:84,plazaW:46,mainW:28,hipRoof:!0,gate:!0,shortName:"古寺"},library:{layout:"plaza",structure:"hall",streetLen:88,plazaW:48,mainW:32,gate:!0,shortName:"图书馆"},gym:{layout:"plaza",structure:"hall",streetLen:100,plazaW:54,mainW:30,gate:!0,shortName:"体育馆"},internet_cafe:{layout:"lane",structure:"lowRise",streetLen:72,roadW:9,maxFloors:5},logistics_park:{layout:"yard",structure:"shed",streetLen:108},auto_city:{layout:"avenue",structure:"tower",streetLen:100,roadW:18},flower_bird_market:{layout:"lane",structure:"lowRise",streetLen:88,roadW:11,maxFloors:3},flea_market:{layout:"lane",structure:"lowRise",streetLen:84,roadW:10,maxFloors:3},vegetable_market:{layout:"compound",structure:"hall",streetLen:80,courtW:36,blocks:2,gate:!0,stalls:!0,shortName:"菜市场"}},Fh={lane:"巷弄",avenue:"商业街",compound:"院区",yard:"厂区",plaza:"广场"},om=!1;function Sc(i,e,t,n={}){let s=e.locations[t];if(!s)throw new Error(`未知地点: ${t}`);let r={...bc[t]||bc.community_center,name:s.name,id:t,shortName:s.name};om||(Vp(pi()),om=!0);let a=Math.min(3,Math.max(1,s.wealthTier|0)),o=new Uh(i,r,a),l=r.layout,c=Wp(o.group),h=[];try{iM(o,l),l==="lane"?h=sM(o):l==="avenue"?h=rM(o):l==="compound"?h=aM(o):l==="yard"?h=oM(o):h=uM(o),hM(o,l,h)}finally{c()}dM(o,s,l);let u=new P(0,0,o.spawnZ),d=o.streetLen/2-1.5,f={minX:-o.laneHalf+1,maxX:o.laneHalf-1,minZ:-d,maxZ:d},p={lane:{yaw:.38,pitch:.7,dist:16,minH:5.2},avenue:{yaw:.38,pitch:.7,dist:17,minH:5.5},compound:{yaw:.38,pitch:.71,dist:17,minH:5.8},yard:{yaw:.46,pitch:.7,dist:17,minH:6.5},plaza:{yaw:.38,pitch:.72,dist:18,minH:7.5}};return{id:t,name:s.name,meta:s,group:o.group,colliders:o.colliders,blockers:o.blockers,hotspots:o.hotspots,spawn:u,bounds:f,camera:p[l]||p.lane,laneHalf:o.laneHalf,streetLen:o.streetLen,stats:{tier:a,layout:l,layoutName:Fh[l],structure:r.structure}}}function dM(i,e,t){var h;let n=i.laneHalf,s=i.streetLen,r=[];for(let u of e.jobs||[])r.push({kind:"work",id:u.id,name:u.name,icon:u.icon||"💼",data:u});for(let u of e.actions||[])r.push({kind:"action",id:u.id,name:u.name,icon:u.icon||"⚡",data:u});for(let u of e.actionsExtra||[])r.push({kind:"extra",id:u.id,name:u.name,icon:u.icon||"⚡",data:u});for(let u of e.illegal||[])r.push({kind:"risk",id:u.id,name:u.name,icon:u.icon||"⚠️",data:u});for(let u of e.amenities||[])r.push({kind:"service",id:u.id,name:u.name,icon:u.icon||"🏪",data:u});((e.buy||[]).length||(e.sell||[]).length)&&r.push({kind:"trade",id:`${e.id}_trade`,name:"买卖交易",icon:"🛒",data:{buy:e.buy||[],sell:e.sell||[],specialties:e.specialtyLabels||e.specialties||[],vendingNote:e.vendingNote||""}}),r.length||r.push({kind:"look",id:`${e.id}_look`,name:"四处看看",icon:"👀",data:{desc:e.desc,type:e.type,footfall:e.footfall,dailyProbability:e.dailyProbability,specialties:e.specialtyLabels||e.specialties||[],priceMod:e.priceModList||[],vendingNote:e.vendingNote||""}});let a=5,o=r;if(r.length>a){let u={};for(let f of r)(u[h=f.kind]||(u[h]=[])).push(f);o=[];let d=0;for(;o.length<a&&d<30;){for(let f of["work","trade","service","action","extra","risk"]){let p=u[f];if(p&&p[d]&&(o.push(p[d]),o.length>=a))break}d++}}let l=i.lots.map(u=>[u.x,u.z]);if(l.length<o.length){let u=[];if(t==="yard"||t==="compound")for(let d of[-s/3,0,s/3,s/2-14])u.push([0,d]);else if(t==="plaza")for(let d of[i.spawnZ-7,i.spawnZ-19,0,-s/4])u.push([ae(-6,6),d]);else for(let d of[-s/2+10,-s/2+24,s/2-24,s/2-10])u.push([-n*.5,d]);for(let d of u)l.push(d)}l.sort(()=>Math.random()-.5);let c=[];for(let u of o){let d=null,f=-1;for(let[m,v]of l){let E=1/0;for(let[y,S]of c)E=Math.min(E,Math.hypot(m-y,v-S));E>f&&(f=E,d=[m,v])}if(!d)break;c.push(d);let[p,x]=d,g=sm({icon:u.icon});g.userData.noMerge=!0,g.position.set(p,0,x),i.group.add(g),i.hotspots.push({object:g,x:p,z:x,radius:2.8,kind:u.kind,id:u.id,label:u.name,icon:u.icon,data:u.data,place:e.name})}}function cm(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Dt,c=0;for(let h=0;h<i.length;++h){let u=i[h],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0,u=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let p=0;p<f.count;++p)u.push(f.getX(p)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=lm(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in a){let u=a[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let x=0;x<a[h].length;++x)f.push(a[h][x][d]);let p=lm(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}}return l}function lm(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let a=new e(r),o=new Xt(a,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let d=0,f=h.count;d<f;d++)for(let p=0;p<t;p++){let x=h.getComponent(d,p);o.setComponent(d+u,p,x)}}else a.set(h.array,l);l+=h.count*t}return s!==void 0&&(o.gpuType=s),o}function Oh(i,e){if(e===Bu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===fr||e===La){let t=i.getIndex();if(t===null){let r=[],a=i.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===fr)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function um(i){let e=new Map,t=new Map,n=i.clone();return hm(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function hm(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)hm(i.children[n],e.children[n],t)}var Ec=class extends li{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Wh(t)}),this.register(function(t){return new Xh(t)}),this.register(function(t){return new ed(t)}),this.register(function(t){return new td(t)}),this.register(function(t){return new nd(t)}),this.register(function(t){return new Yh(t)}),this.register(function(t){return new Kh(t)}),this.register(function(t){return new Zh(t)}),this.register(function(t){return new $h(t)}),this.register(function(t){return new Vh(t)}),this.register(function(t){return new jh(t)}),this.register(function(t){return new qh(t)}),this.register(function(t){return new Qh(t)}),this.register(function(t){return new Jh(t)}),this.register(function(t){return new Hh(t)}),this.register(function(t){return new Tc(t,et.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Tc(t,et.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new id(t)})}load(e,t,n,s){let r=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=Ii.extractUrlBase(e);a=Ii.resolveURL(c,this.path)}else a=Ii.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new ar(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===gm){try{a[et.KHR_BINARY_GLTF]=new sd(e)}catch(u){s&&s(u);return}r=JSON.parse(a[et.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new hd(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case et.KHR_MATERIALS_UNLIT:a[u]=new Gh;break;case et.KHR_DRACO_MESH_COMPRESSION:a[u]=new rd(r,this.dracoLoader);break;case et.KHR_TEXTURE_TRANSFORM:a[u]=new ad;break;case et.KHR_MESH_QUANTIZATION:a[u]=new od;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};function fM(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Ht(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var et={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Hh=class{constructor(e){this.parser=e,this.name=et.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new Re(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],un);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new ms(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new ps(h),c.distance=u;break;case"spot":c=new da(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),mi(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},Gh=class{constructor(){this.name=et.KHR_MATERIALS_UNLIT}getMaterialType(){return Kt}extendParams(e,t,n){let s=[];e.color=new Re(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],un),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,wt))}return Promise.all(s)}},Vh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Wh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ht(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new xe(r,r)}return Promise.all(s)}},Xh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ht(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},qh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ht(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},Yh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ht(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new Re(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],un)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,wt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},Kh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ht(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},Zh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ht(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Re().setRGB(r[0],r[1],r[2],un),Promise.all(s)}},$h=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IOR}getMaterialType(e){return Ht(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},jh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ht(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new Re().setRGB(r[0],r[1],r[2],un),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,wt)),Promise.all(s)}},Jh=class{constructor(e){this.parser=e,this.name=et.EXT_MATERIALS_BUMP}getMaterialType(e){return Ht(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},Qh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ht(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Ht(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},ed=class{constructor(e){this.parser=e,this.name=et.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}},td=class{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},nd=class{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},Tc=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){let l=s.byteOffset||0,c=s.byteLength||0,h=s.count,u=s.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){let f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,s.mode,s.filter),f})})}else return null}},id=class{constructor(e){this.name=et.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==Un.TRIANGLES&&c.mode!==Un.TRIANGLE_STRIP&&c.mode!==Un.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(let p of u){let x=new ke,g=new P,m=new Sn,v=new P(1,1,1),E=new jr(p.geometry,p.material,d);for(let S=0;S<d;S++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,S),l.ROTATION&&m.fromBufferAttribute(l.ROTATION,S),l.SCALE&&v.fromBufferAttribute(l.SCALE,S),E.setMatrixAt(S,x.compose(g,m,v));let y=null;for(let S in l)if(S==="_COLOR_0"){let M=l[S];E.instanceColor=new wi(M.array,M.itemSize,M.normalized)}else if(S!=="TRANSLATION"&&S!=="ROTATION"&&S!=="SCALE"){if(y===null){let A=E.geometry;y=new Dt,y.name=A.name;for(let _ in A.attributes)y.setAttribute(_,A.attributes[_]);for(let _ in A.morphAttributes)y.morphAttributes[_]=A.morphAttributes[_];A.index!==null&&y.setIndex(A.index),y.morphTargetsRelative=A.morphTargetsRelative;for(let _ of A.groups)y.addGroup(_.start,_.count,_.materialIndex);A.boundingBox!==null&&(y.boundingBox=A.boundingBox.clone()),A.boundingSphere!==null&&(y.boundingSphere=A.boundingSphere.clone()),y.drawRange.start=A.drawRange.start,y.drawRange.count=A.drawRange.count,y.userData=Object.assign({},A.userData),E.geometry=y}let M=l[S];y.setAttribute(S,new wi(M.array,M.itemSize,M.normalized))}Lt.prototype.copy.call(E,p),this.parser.assignFinalMaterial(E),f.push(E)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},gm="glTF",Xa=12,dm={JSON:1313821514,BIN:5130562},sd=class{constructor(e){this.name=et.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Xa),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==gm)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-Xa,r=new DataView(e,Xa),a=0;for(;a<s;){let o=r.getUint32(a,!0);a+=4;let l=r.getUint32(a,!0);if(a+=4,l===dm.JSON){let c=new Uint8Array(e,Xa+a,o);this.content=n.decode(c)}else if(l===dm.BIN){let c=Xa+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},rd=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=et.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let h in a){let u=cd[h]||h.toLowerCase();o[u]=a[h]}for(let h in e.attributes){let u=cd[h]||h.toLowerCase();if(a[h]!==void 0){let d=n.accessors[e.attributes[h]],f=Tr[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){s.decodeDracoFile(h,function(f){for(let p in f.attributes){let x=f.attributes[p],g=l[p];g!==void 0&&(x.normalized=g)}u(f)},o,c,un,d)})})}},ad=class{constructor(){this.name=et.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},od=class{constructor(){this.name=et.KHR_MESH_QUANTIZATION}},wc=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=s-t,u=(n-t)/h,d=u*u,f=d*u,p=e*c,x=p-c,g=-2*f+3*d,m=f-d,v=1-g,E=m-d+u;for(let y=0;y!==o;y++){let S=a[x+y+o],M=a[x+y+l]*h,A=a[p+y+o],_=a[p+y]*h;r[y]=v*S+E*M+g*A+m*_}return r}},pM=new Sn,ld=class extends wc{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return pM.fromArray(r).normalize().toArray(r),r}},Un={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Tr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},fm={9728:It,9729:Bt,9984:ul,9985:hr,9986:vs,9987:qn},pm={33071:sn,33648:Xs,10497:Qt},Bh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},cd={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Qi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},mM={CUBICSPLINE:void 0,LINEAR:ls,STEP:os},kh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function gM(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Ee({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ui})),i.DefaultMaterial}function ws(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function mi(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function xM(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):i.attributes.position;a.push(d)}if(s){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):i.attributes.normal;o.push(d)}if(r){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):i.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let h=c[0],u=c[1],d=c[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=u),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function yM(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function _M(i){let e,t=i.extensions&&i.extensions[et.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+zh(t.attributes):e=i.indices+":"+zh(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+zh(i.targets[n]);return e}function zh(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function ud(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function vM(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var MM=new ke,hd=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new fM,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?this.textureLoader=new ca(this.options.manager):this.textureLoader=new pa(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ar(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return ws(r,o,s),mi(o,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,h]of a.children.entries())r(h,o.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[et.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,a){n.load(Ii.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let a=Bh[s.type],o=Tr[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new Xt(c,a,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){let o=a[0],l=Bh[s.type],c=Tr[s.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,p=s.normalized===!0,x,g;if(f&&f!==u){let m=Math.floor(d/f),v="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+m+":"+s.count,E=t.cache.get(v);E||(x=new c(o,m*f,s.count*f/h),E=new js(x,f/h),t.cache.add(v,E)),g=new Js(E,l,d%f/h,p)}else o===null?x=new c(s.count*l):x=new c(o,d,s.count*l),g=new Xt(x,l,p);if(s.sparse!==void 0){let m=Bh.SCALAR,v=Tr[s.sparse.indices.componentType],E=s.sparse.indices.byteOffset||0,y=s.sparse.values.byteOffset||0,S=new v(a[1],E,s.sparse.count*m),M=new c(a[2],y,s.sparse.count*l);o!==null&&(g=new Xt(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let A=0,_=S.length;A<_;A++){let w=S[A];if(g.setX(w,M[A*l]),l>=2&&g.setY(w,M[A*l+1]),l>=3&&g.setZ(w,M[A*l+2]),l>=4&&g.setW(w,M[A*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){let s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);let d=(r.samplers||{})[a.sampler]||{};return h.magFilter=fm[d.magFilter]||Bt,h.minFilter=fm[d.minFilter]||qn,h.wrapS=pm[d.wrapS]||Qt,h.wrapT=pm[d.wrapT]||Qt,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==It&&h.minFilter!==Bt,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let a=s.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;let d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(x){let g=new Yt(x);g.needsUpdate=!0,d(g)}),t.load(Ii.resolveURL(u,r.path),p,void 0,f)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),mi(u,a),u.userData.mimeType=a.mimeType||vM(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[et.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[et.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=r.associations.get(a);a=r.extensions[et.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new nr,hn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new tr,hn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Ee}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],a,o={},l=r.extensions||{},c=[];if(l[et.KHR_MATERIALS_UNLIT]){let u=s[et.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{let u=r.pbrMetallicRoughness||{};if(o.color=new Re(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],un),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,wt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Ut);let h=r.alphaMode||kh.OPAQUE;if(h===kh.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===kh.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Kt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new xe(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==Kt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Kt){let u=r.emissiveFactor;o.emissive=new Re().setRGB(u[0],u[1],u[2],un)}return r.emissiveTexture!==void 0&&a!==Kt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,wt)),Promise.all(c).then(function(){let u=new a(o);return r.name&&(u.name=r.name),mi(u,r),t.associations.set(u,{materials:e}),r.extensions&&ws(s,u,r),u})}createUniqueName(e){let t=vt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[et.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return mm(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],h=_M(c),u=s[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[et.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=mm(new Dt,c,t),c.mode===Un.TRIANGLE_STRIP?d=d.then(f=>Oh(f,La)):c.mode===Un.TRIANGLE_FAN&&(d=d.then(f=>Oh(f,fr))),s[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let h=a[l].material===void 0?gM(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,p=h.length;f<p;f++){let x=h[f],g=a[f],m,v=c[f];if(g.mode===Un.TRIANGLES||g.mode===Un.TRIANGLE_STRIP||g.mode===Un.TRIANGLE_FAN||g.mode===void 0){let E=r.isSkinnedMesh===!0,y=x.hasAttribute("skinIndex")&&x.hasAttribute("skinWeight");E&&y===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),m=E&&y?new Zr(x,v):new U(x,v),m.isSkinnedMesh===!0&&m.normalizeSkinWeights()}else if(g.mode===Un.LINES)m=new Jr(x,v);else if(g.mode===Un.LINE_STRIP)m=new hs(x,v);else if(g.mode===Un.LINE_LOOP)m=new Qr(x,v);else if(g.mode===Un.POINTS)m=new ea(x,v);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(m.geometry.morphAttributes).length>0&&yM(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),mi(m,r),g.extensions&&ws(s,m,g),t.assignFinalMaterial(m),u.push(m)}for(let f=0,p=u.length;f<p;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&ws(s,u[0],r),u[0];let d=new Be;r.extensions&&ws(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Wt(Gu.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new ci(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),mi(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),a=s,o=[],l=[];for(let c=0,h=a.length;c<h;c++){let u=a[c];if(u){o.push(u);let d=new ke;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new $r(o,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=s.channels.length;u<d;u++){let f=s.channels[u],p=s.samplers[f.sampler],x=f.target,g=x.node,m=s.parameters!==void 0?s.parameters[p.input]:p.input,v=s.parameters!==void 0?s.parameters[p.output]:p.output;x.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",m)),l.push(this.getDependency("accessor",v)),c.push(p),h.push(x))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],p=u[2],x=u[3],g=u[4],m=[];for(let E=0,y=d.length;E<y;E++){let S=d[E],M=f[E],A=p[E],_=x[E],w=g[E];if(S===void 0)continue;S.updateMatrix&&S.updateMatrix();let R=n._createAnimationTracks(S,M,A,_,w);if(R)for(let L=0;L<R.length;L++)m.push(R[L])}let v=new la(r,void 0,m);return mi(v,s),v})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){let h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,MM)});for(let f=0,p=u.length;f<p;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){let f=h.userData.pivot,p=u[0];h.pivot=new P().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],p.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new Qs:c.length>1?h=new Be:c.length===1?h=c[0]:h=new Lt,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),mi(h,r),r.extensions&&ws(n,h,r),r.matrix!==void 0){let u=new ke;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let u=s.associations.get(h);s.associations.set(h,{...u})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new Be;n.name&&(r.name=s.createUniqueName(n.name)),mi(r,n),n.extensions&&ws(t,r,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){let d=l[h];d.parent!==null?r.add(um(d)):r.add(d)}let c=h=>{let u=new Map;for(let[d,f]of s.associations)(d instanceof hn||d instanceof Yt)&&u.set(d,f);return h.traverse(d=>{let f=s.associations.get(d);f!=null&&u.set(d,f)}),u};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let a=[],o=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}Qi[r.path]===Qi.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(Qi[r.path]){case Qi.weights:h=Ri;break;case Qi.rotation:h=Ci;break;case Qi.translation:case Qi.scale:h=Yi;break;default:n.itemSize===1?h=Ri:h=Yi;break}let u=s.interpolation!==void 0?mM[s.interpolation]:ls,d=this._getArrayFromAccessor(n);for(let f=0,p=l.length;f<p;f++){let x=new h(l[f]+"."+Qi[r.path],t.array,d,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),a.push(x)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=ud(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof Ci?ld:wc;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function bM(i,e,t){let n=e.attributes,s=new En;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new P(l[0],l[1],l[2]),new P(c[0],c[1],c[2])),o.normalized){let h=ud(Tr[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let o=new P,l=new P;for(let c=0,h=r.length;c<h;c++){let u=r[c];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let x=ud(Tr[d.componentType]);l.multiplyScalar(x)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;let a=new gn;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function mm(i,e,t){let n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(let a in n){let o=cd[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){let a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return Ke.workingColorSpace!==un&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ke.workingColorSpace}" not supported.`),mi(i,e),bM(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?xM(i,e.targets,t):i})}var dd={commercial:[{name:"building-a",tris:1252,size:108936},{name:"building-b",tris:1276,size:106408},{name:"building-c",tris:1195,size:102788},{name:"building-d",tris:1100,size:95160},{name:"building-e",tris:1509,size:128208},{name:"building-f",tris:1794,size:148952},{name:"building-g",tris:2006,size:166356},{name:"building-h",tris:1512,size:127384},{name:"building-i",tris:2544,size:209728},{name:"building-j",tris:5246,size:440652},{name:"building-k",tris:2960,size:246976},{name:"building-l",tris:3512,size:290516},{name:"building-m",tris:3740,size:301004},{name:"building-n",tris:4350,size:341232},{name:"building-skyscraper-a",tris:1292,size:111336},{name:"building-skyscraper-b",tris:1592,size:138480},{name:"building-skyscraper-c",tris:1704,size:149524},{name:"building-skyscraper-d",tris:1892,size:167148},{name:"building-skyscraper-e",tris:1156,size:101880},{name:"detail-awning-wide",tris:40,size:5544},{name:"detail-awning",tris:40,size:5528},{name:"detail-overhang-wide",tris:64,size:6716},{name:"detail-overhang",tris:64,size:6704},{name:"detail-parasol-a",tris:96,size:10320},{name:"detail-parasol-b",tris:120,size:12120},{name:"low-detail-building-a",tris:188,size:14340},{name:"low-detail-building-b",tris:200,size:16336},{name:"low-detail-building-c",tris:142,size:12284},{name:"low-detail-building-d",tris:106,size:8716},{name:"low-detail-building-e",tris:96,size:8240},{name:"low-detail-building-f",tris:88,size:6932},{name:"low-detail-building-g",tris:200,size:16320},{name:"low-detail-building-h",tris:378,size:26812},{name:"low-detail-building-i",tris:152,size:11768},{name:"low-detail-building-j",tris:188,size:16404},{name:"low-detail-building-k",tris:86,size:7556},{name:"low-detail-building-l",tris:150,size:12128},{name:"low-detail-building-m",tris:188,size:15112},{name:"low-detail-building-n",tris:62,size:5904},{name:"low-detail-building-wide-a",tris:156,size:12736},{name:"low-detail-building-wide-b",tris:246,size:18736}],industrial:[{name:"building-a",tris:2046,size:177316},{name:"building-b",tris:2422,size:212040},{name:"building-c",tris:1928,size:175844},{name:"building-d",tris:1158,size:100768},{name:"building-e",tris:1484,size:129400},{name:"building-f",tris:1552,size:134916},{name:"building-g",tris:1242,size:106940},{name:"building-h",tris:698,size:63644},{name:"building-i",tris:798,size:73848},{name:"building-j",tris:886,size:80792},{name:"building-k",tris:702,size:65472},{name:"building-l",tris:1896,size:162424},{name:"building-m",tris:1694,size:138920},{name:"building-n",tris:1262,size:109256},{name:"building-o",tris:868,size:76552},{name:"building-p",tris:1162,size:103760},{name:"building-q",tris:2062,size:181248},{name:"building-r",tris:1912,size:173056},{name:"building-s",tris:876,size:81192},{name:"building-t",tris:1586,size:139896},{name:"chimney-basic",tris:88,size:9036},{name:"chimney-large",tris:218,size:20932},{name:"chimney-medium",tris:160,size:15020},{name:"chimney-small",tris:124,size:10536},{name:"detail-tank-large",tris:566,size:47452},{name:"detail-tank",tris:310,size:31436},{name:"shipping-container-a",tris:402,size:36624},{name:"shipping-container-b",tris:402,size:37052},{name:"shipping-container-c",tris:402,size:36620},{name:"solar-panel-flat",tris:164,size:13964},{name:"solar-panel-landscape-group",tris:976,size:81860},{name:"solar-panel-landscape",tris:244,size:21776},{name:"solar-panel-portrait-group",tris:976,size:81856},{name:"solar-panel-portrait",tris:244,size:21772},{name:"water-tower",tris:968,size:93836},{name:"windmill-low",tris:456,size:46296},{name:"windmill",tris:456,size:46292}],roads:[{name:"bridge-pillar-wide",tris:38,size:5488},{name:"bridge-pillar",tris:38,size:5468},{name:"construction-barrier",tris:60,size:7052},{name:"construction-cone",tris:66,size:7056},{name:"construction-fence",tris:136,size:14856},{name:"construction-light",tris:144,size:15320},{name:"dumpster",tris:234,size:24456},{name:"electricity-pole-single",tris:176,size:19480},{name:"electricity-pole-wide",tris:544,size:56732},{name:"electricity-pole",tris:416,size:43652},{name:"electricity-side-single",tris:176,size:19464},{name:"electricity-side-wide",tris:544,size:56732},{name:"electricity-side",tris:416,size:43652},{name:"electricity-wires-wide",tris:200,size:22240},{name:"electricity-wires",tris:72,size:8952},{name:"light-curved-cross",tris:270,size:24912},{name:"light-curved-double",tris:152,size:14208},{name:"light-curved",tris:92,size:9492},{name:"light-square-cross",tris:134,size:13512},{name:"light-square-double",tris:88,size:9216},{name:"light-square",tris:60,size:6996},{name:"road-bend-barrier",tris:128,size:11912},{name:"road-bend-sidewalk",tris:220,size:17024},{name:"road-bend-square-barrier",tris:48,size:5880},{name:"road-bend-square",tris:60,size:6268},{name:"road-bend",tris:260,size:20164},{name:"road-bridge",tris:240,size:24796},{name:"road-crossing",tris:104,size:8700},{name:"road-crossroad-barrier",tris:112,size:11256},{name:"road-crossroad-line",tris:108,size:9692},{name:"road-crossroad-path",tris:276,size:18708},{name:"road-crossroad",tris:116,size:10084},{name:"road-curve-barrier",tris:200,size:17920},{name:"road-curve-intersection-barrier",tris:166,size:15480},{name:"road-curve-intersection",tris:298,size:22788},{name:"road-curve-pavement",tris:220,size:17044},{name:"road-curve",tris:308,size:23912},{name:"road-driveway-double-barrier",tris:72,size:8460},{name:"road-driveway-double",tris:72,size:7664},{name:"road-driveway-single-barrier",tris:48,size:6272},{name:"road-driveway-single",tris:60,size:6568},{name:"road-end-barrier",tris:28,size:4028},{name:"road-end-round-barrier",tris:160,size:16328},{name:"road-end-round",tris:218,size:17532},{name:"road-end",tris:42,size:4940},{name:"road-intersection-barrier",tris:68,size:7676},{name:"road-intersection-line",tris:76,size:7492},{name:"road-intersection-path",tris:204,size:13736},{name:"road-intersection",tris:84,size:7900},{name:"road-roundabout-barrier",tris:754,size:61636},{name:"road-roundabout",tris:1636,size:105876},{name:"road-side-barrier",tris:24,size:4200},{name:"road-side-entry-barrier",tris:232,size:20276},{name:"road-side-entry",tris:306,size:24288},{name:"road-side-exit-barrier",tris:232,size:20272},{name:"road-side-exit",tris:306,size:24280},{name:"road-side",tris:44,size:5272},{name:"road-sign-empty-hanging",tris:112,size:12072},{name:"road-sign-empty",tris:42,size:5968},{name:"road-sign-object-stop",tris:62,size:6600},{name:"road-sign-object-street",tris:56,size:6648},{name:"road-sign-object-warning",tris:62,size:7384},{name:"road-sign-stop",tris:104,size:10720},{name:"road-sign-street",tris:154,size:15948},{name:"road-sign-warning",tris:104,size:11496},{name:"road-slant-barrier",tris:24,size:4052},{name:"road-slant-curve-barrier",tris:420,size:38824},{name:"road-slant-curve",tris:544,size:47880},{name:"road-slant-flat-curve",tris:648,size:55868},{name:"road-slant-flat-high",tris:44,size:5300},{name:"road-slant-flat",tris:44,size:5284},{name:"road-slant-high-barrier",tris:24,size:4068},{name:"road-slant-high",tris:44,size:5256},{name:"road-slant",tris:44,size:5240},{name:"road-split-barrier",tris:512,size:41340},{name:"road-split",tris:862,size:60128},{name:"road-square-barrier",tris:32,size:4048},{name:"road-square",tris:36,size:4436},{name:"road-straight-barrier-end",tris:16,size:3640},{name:"road-straight-barrier-half",tris:24,size:4092},{name:"road-straight-barrier",tris:24,size:4196},{name:"road-straight-half",tris:44,size:5264},{name:"road-straight",tris:44,size:5248},{name:"sign-highway-detailed",tris:256,size:23532},{name:"sign-highway-wide",tris:144,size:13968},{name:"sign-highway",tris:180,size:17288},{name:"tile-high",tris:12,size:2788},{name:"tile-low",tris:12,size:2800},{name:"tile-slant",tris:12,size:2820},{name:"tile-slantHigh",tris:12,size:2832},{name:"traffic-light-hanging",tris:230,size:22132},{name:"traffic-light-object-hanging",tris:114,size:10876},{name:"traffic-light-object-horizontal",tris:118,size:11664},{name:"traffic-light-object-vertical",tris:132,size:12408},{name:"traffic-light",tris:212,size:20344}]};var EM="assets/kenney/",fd=EM;function xm(i){typeof i=="string"&&i&&(fd=i.endsWith("/")?i:i+"/")}function TM(){return fd}var wM=["commercial","industrial","roads"],ym=8,AM={"roads/electricity-pole":11,"roads/light-square":9.5,"roads/light-square-double":9.5,"roads/light-curved":9.5,"roads/dumpster":5,"industrial/chimney-medium":7,"industrial/chimney-large":8,"industrial/water-tower":5.5,"industrial/shipping-container-a":1.9,"industrial/shipping-container-b":1.9,"industrial/shipping-container-c":1.9,"industrial/detail-tank":3.2,"industrial/detail-tank-large":4.4},es={PENDING:"pending",READY:"ready",FAILED:"failed"};function pd(){let i=new Ec,e=new Map,t={requested:0,ready:0,failed:0},n=(h,u)=>`${h}/${u}`;function s(h,u){let d=n(h,u),f=e.get(d);return f||(f={state:es.PENDING,proto:null,error:null},e.set(d,f)),f}function r(h,u){let d=s(h,u);if(d.state===es.READY)return Promise.resolve(d.proto);if(d.state===es.FAILED)return Promise.resolve(null);if(d._inflight)return d._inflight;t.requested++;let f=`${fd}${h}/${u}.glb`;return d._inflight=new Promise(p=>{i.load(f,x=>{d.state=es.READY,d.proto=x.scene,t.ready++,p(d.proto)},void 0,x=>{d.state=es.FAILED,d.error=x&&x.message||String(x),t.failed++,console.warn(`[assets] 载入失败 ${f}: ${d.error}`),p(null)})}),d._inflight}function a(h=[]){let u=[];for(let d of h)if(Array.isArray(d))u.push(r(d[0],d[1]));else if(typeof d=="string")for(let f of md(d))u.push(r(d,f.name));return Promise.all(u).then(d=>d.filter(Boolean).length)}function o(h,u){let d=e.get(n(h,u));return d&&d.state===es.READY?d.proto:null}function l(h,u,d={}){let f=o(h,u);if(!f)return null;let p=f.clone(!0);p.position.set(d.x||0,d.y||0,d.z||0),typeof d.rotY=="number"&&(p.rotation.y=d.rotY);let x=AM[`${h}/${u}`],g=typeof d.scale=="number"?d.scale:x||ym;return p.scale.setScalar(g),p.traverse(m=>{m.isMesh&&(m.castShadow=!0,m.receiveShadow=!0,m.userData.glbSourced=!0)}),p}function c(){let h={pending:0,ready:0,failed:0},u=[];for(let[d,f]of e)h[f.state]++,f.state===es.FAILED&&u.push({key:d,error:f.error});return{...t,byState:h,failures:u,cached:e.size}}return{load:r,warm:a,get:o,instance:l,report:c,cache:e,setBase(h){xm(h)}}}function md(i){return dd&&dd[i]||[]}function RM(i,e,t){let n=md(i);if(!n.length)return[];let s=2166136261;for(let a=0;a<e.length;a++)s^=e.charCodeAt(a),s=Math.imul(s,16777619);let r=[];for(let a=0;a<t;a++)s=Math.imul(s^s>>>15,2246822507),s=Math.imul(s^s>>>13,3266489909),r.push(n[Math.abs(s)%n.length]);return r}function CM(i){return[i.type,i.color?i.color.getHexString():"",i.emissive?i.emissive.getHexString():"",i.roughness,i.metalness,i.side,i.transparent?1:0,i.opacity,i.flatShading?1:0,i.map?i.map.uuid:"",i.map?`${i.map.repeat.x}x${i.map.repeat.y}`:"",i.alphaMap?i.alphaMap.uuid:""].join("|")}function PM(i){let e=i;for(;e;){if(e.userData&&e.userData.noMerge)return!0;e=e.parent}return!1}function IM(i){for(let e of Object.keys(i.attributes))e!=="position"&&e!=="normal"&&e!=="uv"&&i.deleteAttribute(e);for(let e of Object.keys(i.morphAttributes))delete i.morphAttributes[e];return i.morphTargetsRelative=!1,i}function _m(i){i.updateMatrixWorld(!0);let e=[];i.traverse(o=>{o.isMesh&&o.geometry&&o.geometry.attributes.position&&!PM(o)&&e.push(o)});let t=e.length;if(t<12)return{before:t,after:t,buckets:0};let n=new Map;for(let o of e){let l=CM(o.material),c=n.get(l);c||(c={mat:o.material,list:[]},n.set(l,c)),c.list.push(o)}let s=0,r=0;for(let{mat:o,list:l}of n.values()){if(l.length<3){s+=l.length;continue}let c=[],h=!0;for(let f of l)try{let p=f.geometry.index?f.geometry.toNonIndexed():f.geometry.clone();p.applyMatrix4(f.matrixWorld),c.push(IM(p))}catch{h=!1;break}if(!h){s+=l.length;continue}let u=null;try{u=cm(c,!1)}catch{u=null}if(!u){s+=l.length;continue}let d=new U(u,o);d.castShadow=!0,d.receiveShadow=!0,d.frustumCulled=!0,i.add(d),r++;for(let f of l)f.parent&&f.parent.remove(f);s+=1}let a=[];i.traverse(o=>{o!==i&&(o.isGroup||o.isObject3D)&&!o.isMesh&&o.children.length===0&&a.push(o)});for(let o of a)o.parent&&o.parent.remove(o);return{before:t,after:s,buckets:r}}function gd(i){let e=0,t=0;return i.traverse(n=>{if(!n.isMesh)return;e++;let s=n.geometry;if(!s)return;let r=s.index?s.index.count:s.attributes.position.count;t+=r/3}),{meshes:e,tris:Math.round(t)}}var Ac=class{constructor(e,t,n){this.colliders=t,this.radius=.34,this.speed=3.1,this.runSpeed=5.6,this.moving=!1,this.phase=0,this.bounds={minX:-26,maxX:26,minZ:-24,maxZ:24};let s=new Be,r=new Ee({color:3883080,roughness:.92}),a=new Ee({color:11571312,roughness:.85}),o=new Ee({color:2566959,roughness:.9}),l=new U(new ds(.23,.42,6,12),r);l.position.y=.86,l.castShadow=!0,s.add(l);let c=new U(new Wn(.163,16,12),a);c.position.y=1.34,c.castShadow=!0,s.add(c);let h=new U(new Wn(.168,16,12,0,Math.PI*2,0,Math.PI*.55),o);h.position.y=1.355,s.add(h),this.legs=[];for(let d of[-.105,.105]){let f=new U(new ds(.078,.44,4,8),o);f.position.set(d,.3,0),f.castShadow=!0,s.add(f),this.legs.push(f)}this.arms=[];for(let d of[-.3,.3]){let f=new U(new ds(.062,.38,4,8),r);f.position.set(d,.9,0),f.castShadow=!0,s.add(f),this.arms.push(f)}let u=new U(new oe(.3,.36,.16),new Ee({color:4865846,roughness:.95}));u.position.set(0,.86,-.24),s.add(u),s.position.copy(n),e.add(s),this.mesh=s,this.pos=s.position,this.facing=Math.PI}update(e,t,n){let s=0,r=0;(t.has("KeyW")||t.has("ArrowUp"))&&(r-=1),(t.has("KeyS")||t.has("ArrowDown"))&&(r+=1),(t.has("KeyA")||t.has("ArrowLeft"))&&(s-=1),(t.has("KeyD")||t.has("ArrowRight"))&&(s+=1);let a=t.has("ShiftLeft")||t.has("ShiftRight"),o=a?this.runSpeed:this.speed;if(this.moving=s!==0||r!==0,this.moving){let c=Math.hypot(s,r);s/=c,r/=c;let h=Math.cos(n),u=Math.sin(n),d=s*h+r*u,f=-s*u+r*h;this.pos.x+=d*o*e,this.pos.z+=f*o*e;let x=Math.atan2(d,f)-this.facing;for(;x>Math.PI;)x-=Math.PI*2;for(;x<-Math.PI;)x+=Math.PI*2;this.facing+=x*Math.min(1,e*12),this.phase+=e*(a?13:8.5)}else this.phase+=e*1.6;this.resolveCollisions();let l=this.moving?a?.85:.6:.06;this.legs[0].rotation.x=Math.sin(this.phase)*l,this.legs[1].rotation.x=-Math.sin(this.phase)*l,this.arms[0].rotation.x=-Math.sin(this.phase)*l*.7,this.arms[1].rotation.x=Math.sin(this.phase)*l*.7,this.mesh.position.y=this.moving?Math.abs(Math.sin(this.phase))*.035:0,this.mesh.rotation.y=this.facing}resolveCollisions(){let e=this.radius;for(let n of this.colliders){let s=Math.max(n.minX,Math.min(this.pos.x,n.maxX)),r=Math.max(n.minZ,Math.min(this.pos.z,n.maxZ)),a=this.pos.x-s,o=this.pos.z-r,l=a*a+o*o;if(l>=e*e)continue;if(l<1e-6){let u=Math.abs(this.pos.x-n.minX),d=Math.abs(n.maxX-this.pos.x),f=Math.abs(this.pos.z-n.minZ),p=Math.abs(n.maxZ-this.pos.z),x=Math.min(u,d,f,p);x===u?this.pos.x=n.minX-e:x===d?this.pos.x=n.maxX+e:x===f?this.pos.z=n.minZ-e:this.pos.z=n.maxZ+e;continue}let c=Math.sqrt(l),h=(e-c)/c;this.pos.x+=a*h,this.pos.z+=o*h}let t=this.bounds;this.pos.x=Math.max(t.minX,Math.min(t.maxX,this.pos.x)),this.pos.z=Math.max(t.minZ,Math.min(t.maxZ,this.pos.z))}setWorld({colliders:e,spawn:t,bounds:n}){this.colliders=e||[],t&&this.pos.set(t.x,0,t.z),n&&(this.bounds=n),this.moving=!1,this.phase=0}},Rc=class{constructor(e,t,n){this.camera=e,this.colliders=n||[],this.yaw=.38,this.pitch=.76,this.dist=18,this.minH=5.5,this.cur=new P().copy(t),this.apply(this.cur)}clearance(e,t,n,s,r){let a=r;for(let o of this.colliders){let l=LM(e,t,n,s,o);l!==null&&l<a&&(a=l)}return Math.max(this.minH,a-.7)}penetration(e,t){let s=0;for(let r of this.colliders)if(e>r.minX-.9&&e<r.maxX+.9&&t>r.minZ-.9&&t<r.maxZ+.9){let a=e-(r.minX-.9),o=r.maxX+.9-e,l=t-(r.minZ-.9),c=r.maxZ+.9-t;s=Math.max(s,Math.min(a,o,l,c))}return s}apply(e){let t=Math.cos(this.pitch),n=Math.sin(this.pitch),s=Math.sin(this.yaw),r=Math.cos(this.yaw),a=this.dist*t,o=Math.min(a,this.clearance(e.x,e.z,s,r,a));for(let c=0;c<10;c++){let h=this.penetration(e.x+s*o,e.z+r*o);if(h<=0)break;let u=o-(h+.5);if(u<=this.minH){o=this.minH;break}o=u}let l=o/Math.max(t,.15);this.camera.position.set(e.x+s*o,e.y+l*n,e.z+r*o),this.camera.lookAt(e.x,e.y+.9,e.z)}update(e,t){this.cur.lerp(t,Math.min(1,e*6.5)),this.apply(this.cur)}setWorld({colliders:e,target:t,yaw:n,pitch:s,dist:r,minH:a}={}){this.colliders=e||[],n!=null&&(this.yaw=n),s!=null&&(this.pitch=s),r!=null&&(this.dist=r),a!=null&&(this.minH=a),t&&this.cur.copy(t),this.apply(this.cur)}zoom(e){this.dist=Math.max(9,Math.min(32,this.dist+e))}};function LM(i,e,t,n,s){let r=0,a=1/0;if(Math.abs(t)<1e-8){if(i<s.minX||i>s.maxX)return null}else{let o=(s.minX-i)/t,l=(s.maxX-i)/t;if(o>l){let c=o;o=l,l=c}r=Math.max(r,o),a=Math.min(a,l)}if(Math.abs(n)<1e-8){if(e<s.minZ||e>s.maxZ)return null}else{let o=(s.minZ-e)/n,l=(s.maxZ-e)/n;if(o>l){let c=o;o=l,l=c}r=Math.max(r,o),a=Math.min(a,l)}return a<r||a<0?null:r>0?r:0}var gi={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var mn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},DM=new ci(-1,1,1,-1,0,1),xd=class extends Dt{constructor(){super(),this.setAttribute("position",new ct([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ct([0,2,0,0,2,0],2))}},NM=new xd,xi=class{constructor(e){this._mesh=new U(NM,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,DM)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var wr=class extends mn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Mt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=pn.clone(e.uniforms),this.material=new Mt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new xi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var qa=class extends mn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Cc=class extends mn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Pc=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new xe);this._width=n.width,this._height=n.height,t=new Nt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:qt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new wr(gi),this.copyPass.material.blending=kt,this.timer=new ma}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}qa!==void 0&&(a instanceof qa?n=!0:a instanceof Cc&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new xe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Ic=class extends mn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Re}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}};var Ya={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new xe},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new ke},cameraProjectionMatrixInverse:{value:new ke},cameraWorldMatrix:{value:new ke},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new P(-1,-1,-1)},sceneBoxMax:{value:new P(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},Ka={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Lc={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function vm(i=5){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=UM(e),n=t.length,s=new Uint8Array(n*4);for(let a=0;a<n;++a){let o=t[a],l=2*Math.PI*o/n,c=new P(Math.cos(l),Math.sin(l),0).normalize();s[a*4]=(c.x*.5+.5)*255,s[a*4+1]=(c.y*.5+.5)*255,s[a*4+2]=127,s[a*4+3]=255}let r=new ri(s,e,e);return r.wrapS=Qt,r.wrapT=Qt,r.needsUpdate=!0,r}function UM(i){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=e*e,n=Array(t).fill(0),s=Math.floor(e/2),r=e-1;for(let a=1;a<=t;){if(s===-1&&r===e?(r=e-2,s=0):(r===e&&(r=0),s<0&&(s=e-1)),n[s*e+r]!==0){r-=2,s++;continue}else n[s*e+r]=a++;r++,s--}return n}var Za={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:yd(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new xe},cameraProjectionMatrixInverse:{value:new ke},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function yd(i,e,t){let n=FM(i,e,t),s="vec3[SAMPLES](";for(let r=0;r<i;r++){let a=n[r];s+=`vec3(${a.x}, ${a.y}, ${a.z})${r<i-1?",":")"}`}return s}function FM(i,e,t){let n=[];for(let s=0;s<i;s++){let r=2*Math.PI*e*s/i,a=Math.pow(s/(i-1),t);n.push(new P(Math.cos(r),Math.sin(r),a))}return n}var Dc=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,s,r,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,l=Math.floor(e+o),c=Math.floor(t+o),h=(3-Math.sqrt(3))/6,u=(l+c)*h,d=l-u,f=c-u,p=e-d,x=t-f,g,m;p>x?(g=1,m=0):(g=0,m=1);let v=p-g+h,E=x-m+h,y=p-1+2*h,S=x-1+2*h,M=l&255,A=c&255,_=this.perm[M+this.perm[A]]%12,w=this.perm[M+g+this.perm[A+m]]%12,R=this.perm[M+1+this.perm[A+1]]%12,L=.5-p*p-x*x;L<0?n=0:(L*=L,n=L*L*this._dot(this.grad3[_],p,x));let D=.5-v*v-E*E;D<0?s=0:(D*=D,s=D*D*this._dot(this.grad3[w],v,E));let k=.5-y*y-S*S;return k<0?r=0:(k*=k,r=k*k*this._dot(this.grad3[R],y,S)),70*(n+s+r)}noise3d(e,t,n){let s,r,a,o,c=(e+t+n)*.3333333333333333,h=Math.floor(e+c),u=Math.floor(t+c),d=Math.floor(n+c),f=1/6,p=(h+u+d)*f,x=h-p,g=u-p,m=d-p,v=e-x,E=t-g,y=n-m,S,M,A,_,w,R;v>=E?E>=y?(S=1,M=0,A=0,_=1,w=1,R=0):v>=y?(S=1,M=0,A=0,_=1,w=0,R=1):(S=0,M=0,A=1,_=1,w=0,R=1):E<y?(S=0,M=0,A=1,_=0,w=1,R=1):v<y?(S=0,M=1,A=0,_=0,w=1,R=1):(S=0,M=1,A=0,_=1,w=1,R=0);let L=v-S+f,D=E-M+f,k=y-A+f,N=v-_+2*f,H=E-w+2*f,j=y-R+2*f,$=v-1+3*f,se=E-1+3*f,X=y-1+3*f,ne=h&255,ie=u&255,Ce=d&255,Pe=this.perm[ne+this.perm[ie+this.perm[Ce]]]%12,rt=this.perm[ne+S+this.perm[ie+M+this.perm[Ce+A]]]%12,Ye=this.perm[ne+_+this.perm[ie+w+this.perm[Ce+R]]]%12,Qe=this.perm[ne+1+this.perm[ie+1+this.perm[Ce+1]]]%12,Z=.6-v*v-E*E-y*y;Z<0?s=0:(Z*=Z,s=Z*Z*this._dot3(this.grad3[Pe],v,E,y));let ee=.6-L*L-D*D-k*k;ee<0?r=0:(ee*=ee,r=ee*ee*this._dot3(this.grad3[rt],L,D,k));let _e=.6-N*N-H*H-j*j;_e<0?a=0:(_e*=_e,a=_e*_e*this._dot3(this.grad3[Ye],N,H,j));let Oe=.6-$*$-se*se-X*X;return Oe<0?o=0:(Oe*=Oe,o=Oe*Oe*this._dot3(this.grad3[Qe],$,se,X)),32*(s+r+a+o)}noise4d(e,t,n,s){let r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,h,u,d,f,p,x=(e+t+n+s)*l,g=Math.floor(e+x),m=Math.floor(t+x),v=Math.floor(n+x),E=Math.floor(s+x),y=(g+m+v+E)*c,S=g-y,M=m-y,A=v-y,_=E-y,w=e-S,R=t-M,L=n-A,D=s-_,k=w>R?32:0,N=w>L?16:0,H=R>L?8:0,j=w>D?4:0,$=R>D?2:0,se=L>D?1:0,X=k+N+H+j+$+se,ne=a[X][0]>=3?1:0,ie=a[X][1]>=3?1:0,Ce=a[X][2]>=3?1:0,Pe=a[X][3]>=3?1:0,rt=a[X][0]>=2?1:0,Ye=a[X][1]>=2?1:0,Qe=a[X][2]>=2?1:0,Z=a[X][3]>=2?1:0,ee=a[X][0]>=1?1:0,_e=a[X][1]>=1?1:0,Oe=a[X][2]>=1?1:0,be=a[X][3]>=1?1:0,He=w-ne+c,dt=R-ie+c,Ve=L-Ce+c,je=D-Pe+c,it=w-rt+2*c,We=R-Ye+2*c,ot=L-Qe+2*c,Pt=D-Z+2*c,Ft=w-ee+3*c,mt=R-_e+3*c,ht=L-Oe+3*c,F=D-be+3*c,St=w-1+4*c,st=R-1+4*c,C=L-1+4*c,b=D-1+4*c,B=g&255,G=m&255,Y=v&255,ue=E&255,me=o[B+o[G+o[Y+o[ue]]]]%32,Q=o[B+ne+o[G+ie+o[Y+Ce+o[ue+Pe]]]]%32,te=o[B+rt+o[G+Ye+o[Y+Qe+o[ue+Z]]]]%32,ge=o[B+ee+o[G+_e+o[Y+Oe+o[ue+be]]]]%32,De=o[B+1+o[G+1+o[Y+1+o[ue+1]]]]%32,pe=.6-w*w-R*R-L*L-D*D;pe<0?h=0:(pe*=pe,h=pe*pe*this._dot4(r[me],w,R,L,D));let fe=.6-He*He-dt*dt-Ve*Ve-je*je;fe<0?u=0:(fe*=fe,u=fe*fe*this._dot4(r[Q],He,dt,Ve,je));let z=.6-it*it-We*We-ot*ot-Pt*Pt;z<0?d=0:(z*=z,d=z*z*this._dot4(r[te],it,We,ot,Pt));let K=.6-Ft*Ft-mt*mt-ht*ht-F*F;K<0?f=0:(K*=K,f=K*K*this._dot4(r[ge],Ft,mt,ht,F));let he=.6-St*St-st*st-C*C-b*b;return he<0?p=0:(he*=he,p=he*he*this._dot4(r[De],St,st,C,b)),27*(h+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,s){return e[0]*t+e[1]*n+e[2]*s}_dot4(e,t,n,s,r){return e[0]*t+e[1]*n+e[2]*s+e[3]*r}};var Ar=class i extends mn{constructor(e,t,n=512,s=512,r,a,o){super(),this.width=n,this.height=s,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=vm(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new Nt(this.width,this.height,{type:qt,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new Mt({defines:Object.assign({},Ya.defines),uniforms:pn.clone(Ya.uniforms),vertexShader:Ya.vertexShader,fragmentShader:Ya.fragmentShader,blending:kt,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new aa,this.normalMaterial.blending=kt,this.pdMaterial=new Mt({defines:Object.assign({},Za.defines),uniforms:pn.clone(Za.uniforms),vertexShader:Za.vertexShader,fragmentShader:Za.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new Mt({defines:Object.assign({},Ka.defines),uniforms:pn.clone(Ka.uniforms),vertexShader:Ka.vertexShader,fragmentShader:Ka.fragmentShader,blending:kt}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Mt({uniforms:pn.clone(gi.uniforms),vertexShader:gi.vertexShader,fragmentShader:gi.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:ya,blendDst:xs,blendEquation:Ln,blendSrcAlpha:xa,blendDstAlpha:xs,blendEquationAlpha:Ln}),this.blendMaterial=new Mt({uniforms:pn.clone(Lc.uniforms),vertexShader:Lc.vertexShader,fragmentShader:Lc.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:ll,blendSrc:ya,blendDst:xs,blendEquation:Ln,blendSrcAlpha:xa,blendDstAlpha:xs,blendEquationAlpha:Ln}),this._fsQuad=new xi(null),this._originalClearColor=new Re,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new ai,this.depthTexture.format=hi,this.depthTexture.type=$i,this.normalRenderTarget=new Nt(this.width,this.height,{minFilter:It,magFilter:It,type:qt,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let n=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=yd(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,n){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case i.OUTPUT.Off:break;case i.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=kt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=kt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=kt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=kt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=kt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(e,t,n,s,r){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,s,r){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,t.push(n))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new Dc,n=e*e*4,s=new Uint8Array(n);for(let a=0;a<e;a++)for(let o=0;o<e;o++){let l=a,c=o;s[(a*e+o)*4]=(t.noise(l,c)*.5+.5)*255,s[(a*e+o)*4+1]=(t.noise(l+e,c)*.5+.5)*255,s[(a*e+o)*4+2]=(t.noise(l,c+e)*.5+.5)*255,s[(a*e+o)*4+3]=(t.noise(l+e,c+e)*.5+.5)*255}let r=new ri(s,e,e,fn,rn);return r.wrapS=Qt,r.wrapT=Qt,r.needsUpdate=!0,r}};Ar.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Mm={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Re(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var Rr=class i extends mn{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new xe(e.x,e.y):new xe(256,256),this.clearColor=new Re(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Nt(r,a,{type:qt,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new Nt(r,a,{type:qt,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let d=new Nt(r,a,{type:qt,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),a=Math.round(a/2)}let o=Mm;this.highPassUniforms=pn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Mt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new xe(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=pn.clone(gi.uniforms),this.blendMaterial=new Mt({uniforms:this.copyUniforms,vertexShader:gi.vertexShader,fragmentShader:gi.fragmentShader,premultipliedAlpha:!0,blending:ga,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Re,this._oldClearAlpha=1,this._basic=new Kt,this._fsQuad=new xi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new xe(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let a=0;a<e;a++)t.push(.39894*Math.exp(-.5*a*a/(n*n))/n);let s=[],r=[];for(let a=1;a<e;a+=2){let o=t[a],l=a+1<e?t[a+1]:0,c=o+l;s.push((a*o+(a+1)*l)/c),r.push(c)}return new Mt({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new xe(.5,.5)},direction:{value:new xe(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Mt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Rr.BlurDirectionX=new xe(1,0);Rr.BlurDirectionY=new xe(0,1);var $a={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

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

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Nc=class extends mn{constructor(){super(),this.isOutputPass=!0,this.uniforms=pn.clone($a.uniforms),this.material=new rr({name:$a.name,uniforms:this.uniforms,vertexShader:$a.vertexShader,fragmentShader:$a.fragmentShader}),this._fsQuad=new xi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ke.getTransfer(this._outputColorSpace)===ut&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===_a?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===va?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ma?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ys?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Sa?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ea?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ba&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Jt={sky:9413552,fog:{color:9675435,density:.0075},hemi:{sky:10335432,ground:5919558,intensity:.65},sun:{color:14207656,intensity:2.6,pos:[16,20,-14],shadowSize:2048,frustum:40},ambient:{color:3818576,intensity:.15},exposure:1.1},OM={上午:{sunColor:16050380,sunPos:[20,26,-14],sunIntensity:2.6,hemSky:10335432,hemGround:5919558,hemIntensity:.65,fogColor:9675435,fogDensity:.0075,ambColor:3818576,ambIntensity:.15,exposure:1.1,skyColor:9413552,env:{zenith:7311272,horizon:9675435,ground:4867388,groundHorizon:8025448,intensity:1}},下午:{sunColor:16177320,sunPos:[18,25,-13],sunIntensity:2.65,hemSky:11058376,hemGround:6050628,hemIntensity:.7,fogColor:10134432,fogDensity:.0075,ambColor:4212814,ambIntensity:.14,exposure:1.08,skyColor:9938346,env:{zenith:8034992,horizon:11053208,ground:4866616,groundHorizon:9076848,intensity:1}},傍晚:{sunColor:14057279,sunPos:[17,15,-12],sunIntensity:3,hemSky:9150400,hemGround:4868668,hemIntensity:.55,fogColor:9075314,fogDensity:.009,ambColor:4868696,ambIntensity:.12,exposure:1.05,skyColor:9076608,env:{zenith:4872824,horizon:14191184,ground:3814960,groundHorizon:9071178,intensity:.9}},夜间:{sunColor:9093352,sunPos:[15,22,-12],sunIntensity:.38,hemSky:1976890,hemGround:1053206,hemIntensity:.35,fogColor:1844272,fogDensity:.011,ambColor:1713203,ambIntensity:.09,exposure:1.05,skyColor:1712686,env:{zenith:923168,horizon:1844272,ground:658448,groundHorizon:1317410,intensity:.5}}},bm=new Map;function ja(i){return"#"+(i&16777215).toString(16).padStart(6,"0")}function BM(i,e,t){let n=bm.get(e);if(n)return n;let s=t.env;if(!s)return null;let r=256,a=128,o=document.createElement("canvas");o.width=r,o.height=a;let l=o.getContext("2d"),c=l.createLinearGradient(0,0,0,a*.5);c.addColorStop(0,ja(s.zenith)),c.addColorStop(1,ja(s.horizon)),l.fillStyle=c,l.fillRect(0,0,r,a*.5);let h=l.createLinearGradient(0,a*.5,0,a);h.addColorStop(0,ja(s.groundHorizon)),h.addColorStop(1,ja(s.ground)),l.fillStyle=h,l.fillRect(0,a*.5,r,a*.5);let d=(Math.atan2(t.sunPos[2],t.sunPos[0])/(Math.PI*2)+.5)*r,f=a*.5-t.sunPos[1]/40*a*.42,p=ja(t.sunColor),x=l.createRadialGradient(d,f,0,d,f,r*.16);x.addColorStop(0,p),x.addColorStop(.35,p+"80"),x.addColorStop(1,"rgba(0,0,0,0)"),l.fillStyle=x,l.fillRect(0,0,r,a);let g=new Pn(o);g.mapping=ur,g.colorSpace=wt;let m=new xr(i),v=m.fromEquirectangular(g);return m.dispose(),g.dispose(),bm.set(e,v.texture),v.texture}var _d=.5,kM=.7,zM=.35,HM=.4,GM=.85,VM=.06,WM=.5,XM=.015,qM={name:"GradeShader",uniforms:{tDiffuse:{value:null},uTime:{value:0},uResolution:{value:new xe(1,1)},uVignette:{value:VM},uAberration:{value:WM},uGrain:{value:XM}},vertexShader:["varying vec2 vUv;","void main() {","  vUv = uv;","  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);","}"].join(`
`),fragmentShader:["uniform sampler2D tDiffuse;","uniform float uTime, uVignette, uAberration, uGrain;","uniform vec2 uResolution;","varying vec2 vUv;","","float hash(vec2 p) {","  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);","}","","void main() {","  vec2 d = vUv - 0.5;","  float r2 = dot(d, d);","","  float k = uAberration * r2 * 2.0 / max(uResolution.x, 1.0);","  vec3 col;","  col.r = texture2D(tDiffuse, vUv + d * k).r;","  col.g = texture2D(tDiffuse, vUv).g;","  col.b = texture2D(tDiffuse, vUv - d * k).b;","","  col *= 1.0 - uVignette * pow(r2 * 2.0, 1.5);","","  col += (hash(vUv * uResolution + fract(uTime) * 137.0) - 0.5) * uGrain;","","  gl_FragColor = vec4(col, 1.0);","}"].join(`
`)},Sm="上午",Em=.38,Tm=.76;function Uc(i){let{container:e,data:t}=i;if(!e)throw new Error("createGame3D: 缺少 container");if(!t||!t.locations)throw new Error("createGame3D: 缺少 gamedata");let n=i.mode!=="mini",s;try{s=new Ql({antialias:!0,powerPreference:"high-performance"})}catch(z){return i.onError?.(z instanceof Error?z:new Error(String(z))),YM()}s.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),s.outputColorSpace=wt,s.toneMapping=ys,s.toneMappingExposure=Jt.exposure,s.shadowMap.enabled=!0,s.shadowMap.type=gs,s.shadowMap.autoUpdate=!1,s.info.autoReset=!1,s.domElement.style.display="block",s.domElement.style.width="100%",s.domElement.style.height="100%",e.appendChild(s.domElement);let r=null,a=null,o=null,l=null,c=new qr;c.background=new Re(Jt.sky),c.fog=new Xr(Jt.fog.color,Jt.fog.density);let h=new ua(Jt.hemi.sky,Jt.hemi.ground,Jt.hemi.intensity);c.add(h);let u=new ms(Jt.sun.color,Jt.sun.intensity);u.position.set(...Jt.sun.pos),u.castShadow=!0,u.shadow.mapSize.set(Jt.sun.shadowSize,Jt.sun.shadowSize),u.shadow.camera.near=1,u.shadow.camera.far=110;let d=Jt.sun.frustum;u.shadow.camera.left=-d,u.shadow.camera.right=d,u.shadow.camera.top=d,u.shadow.camera.bottom=-d,u.shadow.bias=-9e-4,u.shadow.normalBias=.022,u.shadow.radius=3,c.add(u),c.add(u.target);let f=new P(Jt.sun.pos[0],Jt.sun.pos[1],Jt.sun.pos[2]).normalize(),p=34,x=new fa(Jt.ambient.color,Jt.ambient.intensity);c.add(x);let g=Sm;function m(z){if(!z)return;let K=OM[z];if(!K)return;g=z,u.color.set(K.sunColor),u.position.set(...K.sunPos),f.set(K.sunPos[0],K.sunPos[1],K.sunPos[2]).normalize(),u.intensity=K.sunIntensity,x.color.set(K.ambColor),x.intensity=K.ambIntensity,h.color.set(K.hemSky),h.groundColor.set(K.hemGround),h.intensity=K.hemIntensity,c.fog.color.set(K.fogColor),c.fog.density=K.fogDensity,c.background=new Re(K.skyColor),s.toneMappingExposure=K.exposure;let he=BM(s,z,K);he&&(c.environment=he,c.environmentIntensity=K.env?K.env.intensity:1),o&&(o.enabled=z==="夜间")}m(Sm),Fp(),Gp();let v=pd();lc(v);let E=[["roads","light-square"],["roads","light-square-double"],["roads","light-curved"],["roads","construction-barrier"],["roads","construction-cone"],["roads","dumpster"],["roads","electricity-pole"],["industrial","detail-tank"],["industrial","detail-tank-large"],["industrial","chimney-medium"],["industrial","water-tower"],["industrial","shipping-container-a"],["commercial","detail-awning"],["commercial","detail-awning-wide"],["commercial","detail-parasol-a"]],y=new Ac(c,[],new P(0,0,10)),S=new Wt(46,1,.5,250),M=new Rc(S,y.pos,[]),A=n,_=[];function w(z,K){return r.addPass(K),_.push({kind:z,pass:K}),K}A&&(r=new Pc(s),w("render",new Ic(c,S)),a=w("gtao",new Ar(c,S,1,1)),a.output=Ar.OUTPUT.Default,a.blendIntensity=kM,o=w("bloom",new Rr(new xe(1,1),zM,HM,GM)),o.enabled=!1,l=w("grade",new wr(qM)),l.material.toneMapped=!1,w("output",new Nc),o.enabled=g==="夜间");let R=null,L=null,D=null,k=!1,N=0,H=0,j=!1,$=0,se=new Set;function X(){let z=e.clientWidth||1,K=e.clientHeight||1;if(S.aspect=z/K,S.updateProjectionMatrix(),s.setSize(z,K,!1),r){r.setSize(z,K);let he=s.getPixelRatio();a.setSize(Math.max(1,Math.floor(z*he*_d)),Math.max(1,Math.floor(K*he*_d))),l.uniforms.uResolution.value.set(z*he,K*he)}}let ne=typeof ResizeObserver<"u"?new ResizeObserver(()=>X()):null;ne?.observe(e),window.addEventListener("resize",X);function ie(z){let K=z.target;if(!K||!K.tagName)return!1;let he=K.tagName.toLowerCase();return he==="input"||he==="textarea"||he==="select"||K.isContentEditable}function Ce(z){ie(z)||!k||!n||(se.add(z.code),(z.code.startsWith("Arrow")||z.code==="Space")&&z.preventDefault(),z.code==="KeyE"&&(z.preventDefault(),Y()),z.code)}function Pe(z){se.delete(z.code)}function rt(){se.clear()}n&&(window.addEventListener("keydown",Ce),window.addEventListener("keyup",Pe),window.addEventListener("blur",rt));let Ye=4,Qe=.25,Z=1.35,ee=!1,_e=null,Oe=0,be=0,He=0,dt=null;function Ve(z){z.button!==0&&z.pointerType==="mouse"||(ee=!0,_e=z.pointerId,Oe=0,be=z.clientX,He=z.clientY,dt={x:z.clientX,y:z.clientY},e.setPointerCapture?.(z.pointerId),e.classList.add("is-dragging"))}function je(z){if(!ee||z.pointerId!==_e)return;let K=z.clientX-be,he=z.clientY-He;Oe+=Math.abs(K)+Math.abs(he),be=z.clientX,He=z.clientY,!(Oe<Ye)&&(dt=null,M.yaw-=K*.006,M.pitch=Math.max(Qe,Math.min(Z,M.pitch+he*.004)))}function it(z){if(z.pointerId===_e&&(ee=!1,_e=null,e.releasePointerCapture?.(z.pointerId),e.classList.remove("is-dragging"),dt)){let K=Pt(dt.x,dt.y);dt=null,K&&(D=K,i.onInteract?.(K))}}function We(){M.yaw=Em,M.pitch=Tm}n&&(e.addEventListener("pointerdown",Ve),e.addEventListener("pointermove",je),e.addEventListener("pointerup",it),e.addEventListener("pointercancel",it),e.addEventListener("dblclick",We));let ot=new P;function Pt(z,K){if(!R)return null;let he=e.getBoundingClientRect(),I=z-he.left,ce=K-he.top,J=null,de=46;for(let ye of R.hotspots){if(ot.set(ye.x,1.4,ye.z).project(S),ot.z>1)continue;let re=(ot.x*.5+.5)*he.width,Ne=(-ot.y*.5+.5)*he.height,Te=Math.hypot(re-I,Ne-ce);Te<de&&(de=Te,J=ye)}return J}function Ft(z){z&&(Xp(z.group),z.group.traverse(K=>{K.isMesh&&K.geometry&&!K.userData.glbSourced&&K.geometry.dispose()}),c.remove(z.group))}let mt=14,ht=[],F=[],St={total:0,groups:0,meshes:0};function st(z){if(ht=[],St={total:0,groups:0,meshes:0},!z)return;z.updateMatrixWorld(!0);let K=new P;z.traverse(he=>{St.total++,he.isGroup&&St.groups++,he.isMesh&&St.meshes++;let I=he.userData&&he.userData.lampHead;I&&(K.set(I.x,I.y,I.z),he.localToWorld(K),ht.push({x:K.x,y:K.y,z:K.z,bulb:he.userData.lampBulb||null}))})}function C(z,K){for(let I of F)c.remove(I);F=[];for(let I of ht)I.bulb&&I.bulb.material&&(I.bulb.material.opacity=z?.95:.5,I.bulb.material.color.set(z?16763274:15259816));if(!z||!ht.length)return;let he=ht.slice();if(K){let I=ce=>(ce.x-K.x)*(ce.x-K.x)+(ce.z-K.z)*(ce.z-K.z);he.sort((ce,J)=>I(ce)-I(J))}for(let I of he.slice(0,mt)){let ce=new ps(16756838,24,18,2);ce.position.set(I.x,I.y,I.z),c.add(ce),F.push(ce)}}function b(z){if(!t.locations[z])return i.onError?.(new Error(`未知地点: ${z}`)),null;let K=performance.now();Ft(R),R=Sc(c,t,z);let he=za();$+=he,st(R.group);let I=_m(R.group),ce=gd(R.group);C(g==="夜间",M.cur),y.setWorld({colliders:R.colliders,spawn:R.spawn,bounds:R.bounds}),M.setWorld({colliders:R.blockers,target:R.spawn,...R.camera}),M.cur.copy(R.spawn),M.apply(M.cur),n||(M.dist=Math.min(34,M.dist+9),M.apply(M.cur));let J=R.spawn,de=y.radius,ye=R.colliders.filter(Te=>J.x>Te.minX-de&&J.x<Te.maxX+de&&J.z>Te.minZ-de&&J.z<Te.maxZ+de).length;D=null,i.onFocus?.(null),L=z;let re=Math.round(performance.now()-K),Ne={id:z,ms:re,tris:ce.tris,spawnBlocked:ye,meshes:{before:I.before,after:I.after},hotspots:R.hotspots.length,colliders:R.colliders.length,assets:{replaced:he,pending:Ha(),report:v.report()}};return i.onBuild?.(Ne),B=Ne,R}let B=null;function G(){if(!R)return null;let z=null,K=1/0;for(let he of R.hotspots){let I=Math.hypot(y.pos.x-he.x,y.pos.z-he.z);I<he.radius&&I<K&&(K=I,z=he)}return z}function Y(){D&&i.onInteract?.(D)}function ue(z){let K=R?.hotspots[z];K&&(D=K,i.onInteract?.(K))}function me(z){if(!k)return;N=requestAnimationFrame(me);let K=Math.min(.05,(z-H)/1e3);H=z,s.info.reset(),y.update(K,se,M.yaw),M.update(K,y.pos),u.position.set(y.pos.x+f.x*p,f.y*p,y.pos.z+f.z*p),u.target.position.set(y.pos.x,0,y.pos.z),u.target.updateMatrixWorld(),l&&(l.uniforms.uTime.value=z*.001);let he=G();if(he!==D&&(D=he,i.onFocus?.(D||null)),R){let ce=z*.0016;for(let J of R.hotspots){let de=J.object?.userData?.hotspot;if(!de)continue;let ye=J===D,re=(ye?1.18:1)+Math.sin(ce*2+J.x)*.05;de.ring?.scale.setScalar(re),de.sprite&&(de.sprite.position.y=2.15+Math.sin(ce*1.7+J.z)*.09,de.sprite.material.opacity=ye?1:.72)}}s.shadowMap.needsUpdate=!0,r?r.render():s.render(c,S),te++;let I=(z-ge)/1e3;I>=.5&&(Q=Math.round(te/I),ge=z,te=0)}let Q=0,te=0,ge=0;function De(){k||(k=!0,X(),H=performance.now(),ge=H,te=0,N=requestAnimationFrame(me),j||(j=!0,v.warm(E).then(z=>{let K=za();$+=K;let he=R?gd(R.group):null;he&&B&&(B.tris=he.tris),i.onAssets?.({loaded:z,replaced:K,report:v.report()})})))}function pe(){k=!1,cancelAnimationFrame(N),se.clear()}function fe(){pe(),Ft(R),ne?.disconnect(),window.removeEventListener("resize",X),n&&(window.removeEventListener("keydown",Ce),window.removeEventListener("keyup",Pe),window.removeEventListener("blur",rt),e.removeEventListener("pointerdown",Ve),e.removeEventListener("pointermove",je),e.removeEventListener("pointerup",it),e.removeEventListener("pointercancel",it),e.removeEventListener("dblclick",We),e.classList.remove("is-dragging")),s.dispose(),s.domElement.remove(),a?.dispose(),o?.dispose(),l?.dispose(),r?.dispose(),r=null,a=null,o=null,l=null,_.length=0}return{loadLocation:b,start:De,stop:pe,dispose:fe,resize:X,interact:Y,interactHotspot:ue,zoom:z=>M.zoom(z),resetView(){M.yaw=Em,M.pitch=Tm,M.apply(M.cur)},get view(){return{yaw:M.yaw,pitch:M.pitch,dist:M.dist}},setTimeSlot(z){m(z),C(z==="夜间",M.cur)},get timeSlot(){return g},get assets(){return{pending:Ha(),replacedTotal:$,report:v.report(),warmList:E.length}},get locationId(){return L},get hotspot(){return D},get hotspots(){return R?R.hotspots:[]},get playerPos(){return{x:y.pos.x,z:y.pos.z}},get stats(){return{fps:Q,calls:s.info.render.calls,triangles:s.info.render.triangles,build:B,lampAnchors:ht.length,lamps:F.length,lampScan:St,postFx:r?{order:_.map(z=>z.kind),count:r.passes.length,aoScale:_d,bloomEnabled:!!(o&&o.enabled),aoSize:a?[a.width,a.height]:null,canvasSize:[s.domElement.width,s.domElement.height],shape:{gtao:!!(a&&a.gtaoMaterial),bloom:!!(o&&o.renderTargetBright),grade:!!(l&&l.uniforms&&l.uniforms.uVignette),output:r.passes.some(z=>z&&"_toneMapping"in z)}}:null,sun:{dir:[Number(f.x.toFixed(4)),Number(f.y.toFixed(4)),Number(f.z.toFixed(4))],dist:p,radius:u.shadow.radius,autoUpdate:s.shadowMap.autoUpdate,type:s.shadowMap.type}}},teleport(z,K){y.pos.set(z,0,K),M.cur.set(z,0,K),M.apply(M.cur)},key(z,K=!0){if(z==="KeyE"&&K){Y();return}K?se.add(z):se.delete(z)},get scene(){return c},get camera(){return S}}}function YM(){let i=()=>{};return{loadLocation:()=>null,start:i,stop:i,dispose:i,resize:i,interact:i,interactHotspot:i,zoom:i,teleport:i,key:i,resetView:i,view:{yaw:0,pitch:0,dist:0},locationId:null,hotspot:null,hotspots:[],playerPos:{x:0,z:0},stats:{fps:0,calls:0,triangles:0,build:null,postFx:null,sun:null},scene:null,camera:null}}var wm=[{key:"hunger",label:"饱腹",icon:"🍚",invert:!1},{key:"hygiene",label:"卫生",icon:"🚿",invert:!1},{key:"clothing",label:"衣物整洁",icon:"👕",invert:!1},{key:"foodSatisfaction",label:"食物满足感",icon:"🍜",invert:!1},{key:"happiness",label:"情绪",icon:"🙂",invert:!1},{key:"health",label:"健康",icon:"❤️",invert:!1,from:"status"}];function Am(i,e){let t=e?100-i:i;return t>=55?"ok":t>=25?"warn":"bad"}function KM(i,e){let t=null;try{typeof computeMindset=="function"&&(t=computeMindset)}catch{}if(!t){let a=typeof globalThis<"u"?globalThis:null;a&&typeof a.computeMindset=="function"&&(t=a.computeMindset)}if(t&&i)try{let a=t({needs:i,status:e});if(typeof a=="number"&&isFinite(a))return Math.max(0,Math.min(100,a))}catch{}if(!i)return null;let n=[],s=a=>{typeof a=="number"&&isFinite(a)&&n.push(Math.max(0,Math.min(100,a)))};s(i.hunger),s(i.hygiene),s(i.clothing),s(i.foodSatisfaction),s(i.happiness);let r=typeof i.fatigue=="number"&&isFinite(i.fatigue)?i.fatigue:0;return s(100-Math.max(0,Math.min(100,r))),n.length?Math.round(n.reduce((a,o)=>a+o,0)/n.length):null}function Fc(i={}){let e=document.createElement("div");e.className="s3h",e.innerHTML=`
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
  `;let t=f=>e.querySelector(`[data-f="${f}"]`),n={day:t("day"),slot:t("slot"),weather:t("weather"),locIcon:t("locIcon"),locName:t("locName"),cash:t("cash"),debt:t("debt"),vitals:t("vitals"),apText:t("apText"),apFill:t("apFill"),prompt:t("prompt"),tray:t("tray"),trayTitle:t("trayTitle"),trayToggle:t("trayToggle"),trayBody:t("trayBody"),toasts:t("toasts"),map:t("map"),mapList:t("mapList"),mapSearch:t("mapSearch"),mapClose:t("mapClose")};n.vitals.innerHTML=`
    <div class="s3h-vital s3h-mindset" data-k="mindset" title="心态（派生：综合生理值 + 睡眠）">
      <span class="s3h-vital-icon">🧭</span>
      <span class="s3h-vital-bar"><i></i></span>
      <span class="s3h-vital-num">—</span>
    </div>`+wm.map(f=>`
    <div class="s3h-vital" data-k="${f.key}" title="${f.label}">
      <span class="s3h-vital-icon">${f.icon}</span>
      <span class="s3h-vital-bar"><i></i></span>
      <span class="s3h-vital-num">0</span>
    </div>`).join("")+`
    <div class="s3h-fatigue" data-f="fatigue"></div>`;let s=f=>(f._fill=f.querySelector(".s3h-vital-bar i"),f._num=f.querySelector(".s3h-vital-num"),f._track=f.querySelector(".s3h-vital-bar"),f),r=f=>Math.max(0,Math.min(100,f)),a=(f,p,x)=>{f._fill.style.width=p+"%",f._fill.dataset.tone=Am(p,x),f._num.textContent=Math.round(p),f.dataset.tone=Am(p,x)},o=wm.map(f=>({spec:f,row:s(n.vitals.querySelector(`[data-k="${f.key}"]`))})),l=s(n.vitals.querySelector('[data-k="mindset"]')),c=n.vitals.querySelector('[data-f="fatigue"]'),h=!1,u=!1,d={el:e,setTop({day:f,slot:p,weather:x,cash:g,debt:m,locIcon:v,locName:E}){if(f!=null&&(n.day.textContent=`第 ${f} 天`),p!=null&&(n.slot.textContent=p),x!=null&&(n.weather.textContent=x?` · ${x}`:""),E!=null&&(n.locName.textContent=E),v!=null&&(n.locIcon.textContent=v||"📍"),g!=null&&(n.cash.textContent=`¥${Math.round(g).toLocaleString("zh-CN")}`),m!=null){let y=Number(m)>0;n.debt.hidden=!y,y&&(n.debt.textContent=`欠 ¥${Math.round(m).toLocaleString("zh-CN")}`)}},setNeeds(f,p){for(let{spec:m,row:v}of o){let E=m.from==="status"?p:f;if(!E)continue;let y=E[m.key];typeof y=="number"&&a(v,r(y),m.invert)}let x=f&&typeof f.fatigue=="number"?f.fatigue:null;x!=null?(c.textContent=`疲劳系数 ${Math.round(r(x))} · 影响恢复速度`,c.style.display="block"):c.style.display="none";let g=KM(f,p);g!=null&&a(l,g,!1)},setAP(f,p){let x=p||100;n.apText.textContent=`${Math.round(f)} / ${Math.round(x)}`,n.apFill.style.width=Math.max(0,Math.min(100,f/x*100))+"%",n.apFill.dataset.tone=f/x>=.25?"ok":"bad"},setPrompt(f){if(!f){n.prompt.hidden=!0;return}n.prompt.innerHTML=`<kbd>E</kbd><span>${f.icon||""} ${f.label||""}</span>`+(f.hint?`<em>${f.hint}</em>`:""),n.prompt.hidden=!1},setActions(f,p){if(!f||!f.length){n.trayBody.innerHTML='<div class="s3h-empty">此刻这里没有可做的事，换个地方看看。</div>';return}n.trayBody.innerHTML=f.map((x,g)=>{let m=x.kind?`<span class="s3h-chip">${x.kind}</span>`:"",v=x.cost?`<span class="s3h-cost">${x.cost}</span>`:"";return`
        <button type="button" class="s3h-act${x.disabled?" is-off":""}" data-i="${g}"
                ${x.disabled?"disabled":""} title="${x.reason||x.desc||""}">
          <span class="s3h-act-icon">${x.icon||"•"}</span>
          <span class="s3h-act-main">
            <span class="s3h-act-name">${x.name}</span>
            ${x.desc?`<span class="s3h-act-desc">${x.desc}</span>`:""}
            ${x.disabled&&x.reason?`<span class="s3h-act-reason">${x.reason}</span>`:""}
          </span>
          ${m}${v}
        </button>`}).join(""),n.trayBody.querySelectorAll(".s3h-act").forEach(x=>{x.addEventListener("click",()=>{let g=f[Number(x.dataset.i)];g&&!g.disabled&&p(g)})})},toggleTray(f){return h=f==null?!h:!!f,n.tray.classList.toggle("is-open",h),n.trayToggle.textContent=h?"收起":"展开",h},setLocations(f,p){let x=(g="")=>{let m=g.trim().toLowerCase(),v=m?f.filter(E=>`${E.name} ${E.desc||""}`.toLowerCase().includes(m)):f;n.mapList.innerHTML=v.length?v.map(E=>`<button type="button" class="s3h-loc" data-id="${E.id}">
              <span class="s3h-loc-icon">${E.icon||"📍"}</span>
              <span class="s3h-loc-name">${E.name}</span>
            </button>`).join(""):'<div class="s3h-empty">没有匹配的地点</div>',n.mapList.querySelectorAll(".s3h-loc").forEach(E=>{E.addEventListener("click",()=>{d.toggleMap(!1),p(E.dataset.id)})})};x(""),n.mapSearch.addEventListener("input",()=>x(n.mapSearch.value))},toggleMap(f){return u=f==null?!u:!!f,n.map.hidden=!u,u&&n.mapSearch.focus(),u},get mapOpen(){return u},get trayOpen(){return h},notify(f,p="ok"){let x=document.createElement("div");x.className=`s3h-toast is-${p}`,x.textContent=f,n.toasts.appendChild(x),setTimeout(()=>x.classList.add("is-out"),2400),setTimeout(()=>x.remove(),3e3)},destroy(){e.remove()}};return n.trayToggle.addEventListener("click",()=>d.toggleTray()),n.mapClose.addEventListener("click",()=>d.toggleMap(!1)),n.map.addEventListener("click",f=>{f.target===n.map&&d.toggleMap(!1)}),d.toggleTray(!1),d}function Rm(i={}){let{container:e,data:t,readHUD:n,readActions:s,readLocations:r,onAction:a,onTravel:o,onNotice:l,onExit:c}=i;if(!e)throw new Error("create3DShell: 缺少 container");let h=document.createElement("div");h.className="s3s3d";let u=document.createElement("div");u.className="s3s3d-stage",h.appendChild(u),e.appendChild(h);let d=Fc();h.appendChild(d.el);let f=null,p=null,x=!1;function g(){return f||(f=Uc({container:u,data:t,mode:"full",onInteract:M=>{let A=a?.(M);A&&A.ok===!1?d.notify(A.reason||"这一步现在做不了","warn"):A&&A.message&&d.notify(A.message,"ok")},onFocus:M=>d.setPrompt(M),onError:M=>d.notify("3D 不可用："+(M&&M.message?M.message:M),"bad")}),f)}function m(){try{if(n){let M=n();M&&(M.locId&&M.locId!==p&&f&&f.loadLocation(M.locId)&&(p=M.locId,r&&d.setLocations(r()||[],E)),d.setTop(M),d.setNeeds(M.needs,M.status),M.ap&&d.setAP(M.ap.cur,M.ap.max),M.slot&&f&&f.setTimeSlot(M.slot))}if(s){let M=s()||[];d.setActions(M,A=>{let _=a?.(A);_&&_.ok===!1?d.notify(_.reason||"这一步现在做不了","warn"):m()})}}catch(M){d.notify("状态刷新失败："+(M&&M.message?M.message:M),"bad")}}function v(M){let _=g().loadLocation(M);return _?(p=M,_):null}function E(M){if(!M||M===p)return;let A=o?.(M);if(A&&A.ok===!1){d.notify(A.reason||"去不了那里","warn");return}let _=n?n():null;(!_||!_.locId)&&v(M),m(),d.notify("已到达："+(y(M)?.name||M),"ok")}function y(M){let A=r&&r()||[];for(let _ of A)if(_.id===M)return _;return null}function S(M){let A=M.target,_=!!(A&&A.tagName&&/^(INPUT|TEXTAREA|SELECT)$/.test(A.tagName))||A&&A.isContentEditable,w=M.code==="Escape"||M.code==="Tab"||M.code==="KeyM";if(!(_&&!w))if(M.code==="Tab")M.preventDefault(),M.stopPropagation(),d.toggleTray();else if(M.code==="KeyM")M.preventDefault(),M.stopPropagation(),d.toggleMap();else if(M.code==="Escape")if(d.mapOpen){M.preventDefault();let R=document.querySelector("#scene3d-first .s3h-map-search");R&&document.activeElement===R&&R.blur(),d.toggleMap(!1)}else d.trayOpen&&(M.preventDefault(),d.toggleTray(!1));else M.code==="KeyR"&&(M.stopPropagation(),g().resetView())}return{el:h,hud:d,start(){if(x)return;x=!0;let M=g();return M.start(),r&&d.setLocations(r()||[],E),window.addEventListener("keydown",S,!0),window.addEventListener("resize",()=>M.resize()),m(),this},stop(){x=!1,window.removeEventListener("keydown",S,!0),f?.stop()},dispose(){this.stop(),f?.dispose(),f=null,d.destroy(),h.remove()},loadLocation:v,travel:E,refresh:m,resize(){f?.resize()},sync(){m()},notify(M,A){d.notify(M,A)},get locationId(){return p},get view3d(){return f},get stats(){return f?f.stats:null},get debug(){return{locationId:p,actions:d.el.querySelectorAll(".s3h-act").length,vitals:d.el.querySelectorAll(".s3h-vital").length,promptVisible:!d.el.querySelector('[data-f="prompt"]').hidden,view:f?f.view:null,timeSlot:f?f.timeSlot:null,tris:f?f.stats.triangles:0,calls:f?f.stats.calls:0,lampAnchors:f?f.stats.lampAnchors:0,lamps:f?f.stats.lamps:0,postFx:f?f.stats.postFx:null,sun:f?f.stats.sun:null,cameraDepth:f?{near:f.camera.near,far:f.camera.far}:null,assets:f?f.assets:null}},get assets(){return f?f.assets:null}}}var Cm={generatedAt:"2026-09-19T01:32:38.518Z",source:"src/js/data/{locations,location_flavor,jobs,amenities,actions,goods}.js + src/js/phase1/actions_extra.js + src/js/core/illegal_actions.js",count:29,categoryLabels:{daily:"日用",food:"食品",luxury:"奢侈",clothing:"服装",electronics:"电子",scrap:"废品"},locations:{slum:{id:"slum",name:"城中村",icon:"🏘️",desc:"鱼龙混杂的城中村，房租便宜，机会也多。",type:"residential",wealthTier:1,footfall:.6,specialties:["scrap_metal","scrap_paper","scrap_plastic"],specialtyLabels:["废金属","废纸板","废塑料"],priceMod:{water:.9,snacks:.85,noodles:.8,scrap_metal:1.6,scrap_paper:1.5,scrap_plastic:1.5,daily_use:.7},priceModList:[{key:"water",value:.9,label:"瓶装水"},{key:"snacks",value:.85,label:"零食"},{key:"noodles",value:.8,label:"面条"},{key:"scrap_metal",value:1.6,label:"废金属"},{key:"scrap_paper",value:1.5,label:"废纸板"},{key:"scrap_plastic",value:1.5,label:"废塑料"},{key:"daily_use",value:.7,label:"日用品"}],dailyProbability:.4,flavor:["🐱 一只花猫从巷道里蹿出来，在你脚边蹭了蹭，咕噜噜地叫着。","👴 隔壁老李家传来咿咿呀呀的粤语歌声，是那首《月亮代表我的心》。",'👶 楼道里有孩子在追逐打闹，脚步声噔噔作响，大人在远处喊"慢点跑"。',"🍜 谁家飘出炒菜香，是葱炒鸡蛋的味道，让人突然觉得有些饿。","📱 斜对面阿姨对着手机大声视频通话，方言地道，笑声传出去很远。","🚲 楼道口停了一排共享单车，有两辆已经歪倒成了一堆，没人管。","☔ 屋顶漏出一道细流，房东说上周修，但已经说了好几周了。","🌃 夜里有人在走廊抽烟，橙红的烟头在黑暗里一明一灭。"],jobs:[{id:"waste_recycling",name:"废品回收",icon:"♻️",desc:"走街串巷收废纸板、废金属、废塑料，转手卖给回收站。脏活累活但门槛最低。",startupCost:0,risk:{injury:.01,illness:.005},payHint:{min:20,max:55,text:`payCalc(state) {
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
    }`}}],amenities:[],actions:[{id:"library_study",name:"图书馆啃书",icon:"📖",desc:"在培训中心的图书馆看书，各种技能书都有，对提升技能很有帮助。只需交茶水费。",apCost:20,payEstimate:null}],actionsExtra:[{id:"self_study",name:"图书馆自习",desc:"去图书馆（商业区旁）安静看书。",icon:"📖",apCost:20,payEstimate:"技能XP+30",costEstimate:null,hint:"去大学城、培训中心或图书馆自习"},{id:"night_school",name:"上夜校",desc:"晚上上夜校，提升智力+相关技能。需要 ¥50 学费，智力≥25。",icon:"🌃",apCost:20,payEstimate:"智力+1, 技能+",costEstimate:50,hint:"去大学城或培训中心报名夜校"}],illegal:[],buy:[],sell:[],vendingNote:"学员课间小消费"},suburb:{id:"suburb",name:"郊区",icon:"🌆",desc:"城市边缘的郊区，安静但交通不便。房租便宜，适合养病/休息。",type:"residential",wealthTier:2,footfall:.4,specialties:["vegetables","fruits"],specialtyLabels:["蔬菜","水果"],priceMod:{water:.85,vegetables:.8,fruits:.85},priceModList:[{key:"water",value:.85,label:"瓶装水"},{key:"vegetables",value:.8,label:"蔬菜"},{key:"fruits",value:.85,label:"水果"}],dailyProbability:.3,flavor:["🌾 郊区的田埂上，几个老人正在收割最后一茬水稻，镰刀在阳光下闪着光。","🚌 末班公交车慢悠悠地开过来，车上只有三四个乘客，司机打着哈欠。","🐕 一只土狗趴在路边晒太阳，看到有人经过就懒洋洋地抬一下眼皮。","🏡 一栋自建小楼正在装修，电钻声从清晨响到傍晚，邻居们早已习以为常。","🌅 傍晚时分，郊区的天空格外开阔，晚霞把整片天空染成橘红色。","🚲 一条乡间小路旁停着几辆自行车，骑车的人正在路边小卖部买冰棍。","🌙 郊区的夜晚格外安静，偶尔能听到远处火车的汽笛声，悠长而遥远。"],jobs:[],amenities:[],actions:[{id:"suburb_rest",name:"郊区静养",icon:"🌆",desc:"躲开城里的喧嚣，在郊区安静待一天。房租低、空气好，适合养病，也适合想清楚一些事。",apCost:30,payEstimate:null}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"客流量少，适合长期居住不适合摆摊"},luxury_community:{id:"luxury_community",name:"高档小区",icon:"🏘️",desc:"高档封闭式小区，有物业和保安。普通摆摊进不去，但可以提供上门服务。",type:"residential",wealthTier:3,footfall:.3,specialties:["cigarettes","electronics"],specialtyLabels:["香烟","小电子产品"],priceMod:{clothing:1.3,electronics:1.2,cigarettes:1.4},priceModList:[{key:"clothing",value:1.3,label:"二手衣物"},{key:"electronics",value:1.2,label:"小电子产品"},{key:"cigarettes",value:1.4,label:"香烟"}],dailyProbability:.2,flavor:[],jobs:[{id:"premium_housekeeper",name:"高档家政",icon:"🧹",desc:"在高档小区做家政服务。环境好、收入高，但需要细致耐心。",startupCost:0,risk:{},payHint:{min:16,max:80,text:`payCalc(state) {
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
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"老年居民多，消费习惯保守"},gov_office:{id:"gov_office",name:"政府办事大厅",icon:"🏛️",desc:"办理各种证件/业务的地方。办证/贷款/社保都在这里。",type:"service",wealthTier:2,footfall:.5,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.2,flavor:[],jobs:[],amenities:[],actions:[{id:"gov_benefits_apply",name:"申请低保",icon:"🏛️",desc:"在政务服务窗口咨询并申请最低生活保障。收入越低越容易通过，是走投无路时的最后一道网。",apCost:15,payEstimate:"0~800"}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"人流稀少，不适合摆摊"},court:{id:"court",name:"法院",icon:"⚖️",desc:"打官司的地方。可以起诉欠债不还、劳动纠纷等。",type:"service",wealthTier:2,footfall:.3,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.1,flavor:[],jobs:[],amenities:[],actions:[{id:"court_labor_arbitration",name:"申请劳动仲裁",icon:"⚖️",desc:"被拖欠工资、违法辞退时，到法院立案窗口申请劳动仲裁。免费、不用律师也能办，但要等结果。",apCost:20,payEstimate:"0~3000"}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"严肃场所，不适合摆摊"},job_market:{id:"job_market",name:"人才市场",icon:"🏢",desc:"找工作、招聘的地方。每周有招聘会，可以投简历。",type:"service",wealthTier:2,footfall:.8,specialties:["daily_use"],specialtyLabels:["日用品"],priceMod:{daily_use:.9},priceModList:[{key:"daily_use",value:.9,label:"日用品"}],dailyProbability:.3,flavor:[],jobs:[],amenities:[],actions:[{id:"job_market_resume",name:"投简历",icon:"📄",desc:"在人才市场的招聘信息栏前，把简历投给还在招人的摊位。比打零工体面，但要等回音。",apCost:10,payEstimate:null}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"求职者多，但消费力弱"},entertainment:{id:"entertainment",name:"娱乐城",icon:"🎮",desc:"电影院/KTV/游戏厅聚集地。放松娱乐，消耗现金。",type:"recreation",wealthTier:3,footfall:1.5,specialties:["snacks","beer","electronics"],specialtyLabels:["零食","啤酒","小电子产品"],priceMod:{snacks:1.2,beer:1.3,electronics:1.1},priceModList:[{key:"snacks",value:1.2,label:"零食"},{key:"beer",value:1.3,label:"啤酒"},{key:"electronics",value:1.1,label:"小电子产品"}],dailyProbability:.6,flavor:[],jobs:[],amenities:[],actions:[],actionsExtra:[{id:"gym",name:"办健身卡锻炼",desc:"去健身房办月卡，提升体质和敏捷。",icon:"🏋️",apCost:20,payEstimate:"体质+1, 敏捷+0.5",costEstimate:200,hint:"去公园、商业区或娱乐城附近的健身场所"},{id:"movie",name:"看场电影",desc:"去影院看场电影放松一下。",icon:"🎬",apCost:20,payEstimate:"心情+18",costEstimate:35,hint:"去娱乐城的影院"},{id:"ktv",name:"KTV 唱歌",desc:"约朋友去 KTV 吼两小时。",icon:"🎤",apCost:20,payEstimate:"心情+25, 人缘+",costEstimate:80,hint:"去娱乐城的 KTV"}],illegal:[{id:"illegal_foot_massage",name:"🦶 洗脚城灰服务",icon:"🦶",desc:"去洗脚城点'特殊服务'。心情大涨，但有被扫黄抓+染病风险。",apCost:4,rewardRange:[25,40],catchProb:.25,moralityDelta:-10,penalty:{jailDays:0,fine:500,diseaseProb:.35}}],buy:[],sell:[],vendingNote:"年轻人多，消费力强"},temple:{id:"temple",name:"寺庙",icon:"⛩️",desc:"城市中的古老寺庙。祈福/冥想/心灵慰藉。",type:"recreation",wealthTier:2,footfall:.6,specialties:["fruits","water"],specialtyLabels:["水果","瓶装水"],priceMod:{fruits:1.1,water:1.05},priceModList:[{key:"fruits",value:1.1,label:"水果"},{key:"water",value:1.05,label:"瓶装水"}],dailyProbability:.3,flavor:[],jobs:[],amenities:[],actions:[{id:"temple_meditate_extra",name:"寺庙静心",icon:"🧘",desc:"在寺庙里打坐冥想，净化心灵。烧点香火，求个心安。",apCost:15,payEstimate:null}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"香客多，不适合摆摊"},library:{id:"library",name:"图书馆",icon:"📖",desc:"免费的公共图书馆，藏书丰富环境安静。适合自学技能、查找资料、消磨时光。",type:"education",wealthTier:2,footfall:.5,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.2,flavor:["📚 自习区坐满了人，有人戴着耳机看书，有人在草稿纸上写写画画。","📖 一位老人坐在角落里看报纸，报纸已经泛黄，边角卷了起来。","🌿 窗边的绿植长得很好，阳光透过玻璃照在上面，叶片泛着绿光。","📋 公告栏上贴着读书会通知，'本周六晚七点，共读《活着》'。","☕ 阅览区有人小声打电话，被管理员提醒后赶紧挂了，脸红着道歉。","🌙 闭馆音乐响起，学生们陆续起身收拾书包，有人打了个大大的哈欠。","📖 一个小女孩踮着脚够书架上的绘本，旁边的妈妈帮她拿下来，轻声读给她听。"],jobs:[],amenities:[],actions:[],actionsExtra:[{id:"self_study",name:"图书馆自习",desc:"去图书馆（商业区旁）安静看书。",icon:"📖",apCost:20,payEstimate:"技能XP+30",costEstimate:null,hint:"去大学城、培训中心或图书馆自习"},{id:"borrow_books",name:"借书自学",desc:"从图书馆借专业书籍回家学习。可以指定一门技能专精提升，效率比泛读高。",icon:"📚",apCost:15,payEstimate:"指定技能XP+40",costEstimate:null,hint:"在图书馆借书自学"},{id:"reading_club",name:"参加读书会",desc:"参加图书馆周末读书会，与人交流读书心得。兼顾社交和学习，还能认识新朋友。",icon:"👥",apCost:20,payEstimate:"社交+技能+心情",costEstimate:null,hint:"在图书馆参加读书会"}],illegal:[],buy:[],sell:[],vendingNote:"安静场所，禁止摆摊"},gym:{id:"gym",name:"体育馆",icon:"🏋️",desc:"可以健身/打球/游泳的地方。增强体质的好去处。",type:"recreation",wealthTier:2,footfall:.8,specialties:["vitamins_item","snacks"],specialtyLabels:["维生素","零食"],priceMod:{snacks:1.1,vitamins_item:1.1},priceModList:[{key:"snacks",value:1.1,label:"零食"},{key:"vitamins_item",value:1.1,label:"维生素"}],dailyProbability:.4,flavor:[],jobs:[{id:"gym_coach",name:"健身教练",icon:"💪",desc:"在体育馆做私人教练。需要好身材+专业指导能力。",startupCost:0,risk:{injury:.02},payHint:{min:30,max:70,text:`payCalc(state) {
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
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"爱好者多，消费力中等"},flea_market:{id:"flea_market",name:"二手市场",icon:"🏴",desc:"淘二手货的地方。可以低价买入高价卖出，考验眼光。",type:"commercial",wealthTier:2,footfall:.8,specialties:["clothing","electronics","second_hand_book"],specialtyLabels:["二手衣物","小电子产品","二手书"],priceMod:{clothing:.7,electronics:.75,second_hand_book:.6},priceModList:[{key:"clothing",value:.7,label:"二手衣物"},{key:"electronics",value:.75,label:"小电子产品"},{key:"second_hand_book",value:.6,label:"二手书"}],dailyProbability:.5,flavor:[],jobs:[],amenities:[],actions:[{id:"flea_market_haggle",name:"淘货砍价",icon:"🏴",desc:"在二手市场的地摊之间转悠，凭眼力捡漏、凭嘴皮子砍价。看走眼就亏，看准了就赚。",apCost:15,payEstimate:"0~420"}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"淘货人多，消费力参差不齐"},vegetable_market:{id:"vegetable_market",name:"菜市场",icon:"",desc:"买菜的地方。新鲜食材最便宜，但环境嘈杂。讨价还价的唇枪舌剑此起彼伏。",type:"commercial",wealthTier:2,footfall:1.2,specialties:["vegetables","fruits","pork","fish"],specialtyLabels:["蔬菜","水果","猪肉","鱼"],priceMod:{vegetables:.7,fruits:.75,pork:.85,fish:.8},priceModList:[{key:"vegetables",value:.7,label:"蔬菜"},{key:"fruits",value:.75,label:"水果"},{key:"pork",value:.85,label:"猪肉"},{key:"fish",value:.8,label:"鱼"}],dailyProbability:.8,flavor:[],jobs:[],amenities:[],actions:[{id:"veg_market_bargain",name:"赶早市买菜",icon:"🥬",desc:"天没亮就去菜市场，跟摊主讨价还价买最新鲜也最便宜的菜。自己做饭比吃外卖省得多。",apCost:10,payEstimate:null}],actionsExtra:[],illegal:[],buy:[{id:"vegetables",name:"蔬菜",unit:"斤",price:2.1,category:"food"},{id:"fruits",name:"水果",unit:"斤",price:4.5,category:"food"}],sell:[],vendingNote:"买菜人多，但消费力有限"}}};return Gm($M);})();
