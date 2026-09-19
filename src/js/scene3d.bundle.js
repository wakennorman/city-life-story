/* 自动生成，请勿手工编辑。
   源：src/app/3d/  构建：node scripts/build-3d-bundle.cjs
   数据：src/app/3d/gamedata.json（由 scripts/extract-3d-data.mjs 从游戏本体生成）
   改动请改源文件后重新构建，直接编辑本文件会在下次构建时被覆盖。 */
"use strict";var Scene3D=(()=>{var Mu=Object.defineProperty;var wx=Object.getOwnPropertyDescriptor;var Tx=Object.getOwnPropertyNames;var Rx=Object.prototype.hasOwnProperty;var Ax=(i,e)=>{for(var t in e)Mu(i,t,{get:e[t],enumerable:!0})},Cx=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of Tx(e))!Rx.call(i,s)&&s!==t&&Mu(i,s,{get:()=>e[s],enumerable:!(n=wx(e,s))||n.enumerable});return i};var Px=i=>Cx(Mu({},"__esModule",{value:!0}),i);var RE={};Ax(RE,{ACTOR_KIND:()=>zt,ACTOR_R:()=>$o,AI_GROUP:()=>ir,AI_HEROES:()=>xg,ActorSystem:()=>da,CAR_RECT:()=>Ls,ComplexTask:()=>Yo,KITS:()=>w1,LAYOUT_KIND:()=>Af,LOAD_STATE:()=>Is,M_PER_UNIT:()=>A1,SPECS:()=>Wh,SRC:()=>_n,ShopVisitTask:()=>ua,TASK_SLOT:()=>cs,TASK_SLOT_COUNT:()=>hu,TOP_KINDS:()=>tu,Task:()=>ii,WaitTask:()=>uu,YieldTask:()=>Ko,aiGroup:()=>D1,allSourceScales:()=>T1,apartmentsFacadeProp:()=>mg,assetBase:()=>E1,awningProp:()=>wh,buildBike:()=>wp,buildBird:()=>Ap,buildCar:()=>Ep,buildCat:()=>Rp,buildDog:()=>Tp,buildHuman:()=>ha,buildLocation:()=>Xh,buildPalette:()=>ph,carBodyMat:()=>ou,chainlinkProp:()=>Dh,charSkinDebug:()=>sx,chimneyProp:()=>vh,cityLamp:()=>fg,create3DShell:()=>_x,createAssetLoader:()=>rp,createGame3D:()=>_u,createHUD:()=>vu,dapaidangProp:()=>Fh,dumpster:()=>Sh,effectiveScale:()=>Zg,faceTexture:()=>Sp,faceX:()=>Hn,faceY:()=>ls,factoryFacadeProp:()=>gg,findAi:()=>N1,findPolyHaven:()=>I1,fireEscapeProp:()=>Ih,furMat:()=>Xo,gamedata:()=>vx,glbProp:()=>Tn,gutterProp:()=>Ph,hairMat:()=>au,hdriUrl:()=>L1,hydrantProp:()=>Ch,initKit:()=>xh,lastDroppedAssets:()=>cg,lingnanTempleProp:()=>Uo,listAi:()=>U1,listHdri:()=>op,listOf:()=>ap,listPolyHaven:()=>Zh,marketStallProp:()=>Oh,oldApartmentProp:()=>Uh,palette:()=>Di,pantsMat:()=>su,parasolProp:()=>Th,pendingAssetCount:()=>sa,pickFor:()=>P1,polyHavenGroup:()=>$h,powerPoleProp:()=>Lh,pumpAssets:()=>ia,qilouProp:()=>Nh,remapCarUV:()=>lu,roadBarrierProp:()=>Do,setAssetBase:()=>Kg,setAssetLoader:()=>yh,shippingContainerProp:()=>dg,shutterDoorProp:()=>Rh,shutterWindowProp:()=>Ah,siteBarrier:()=>pg,skinMat:()=>ru,sleeveMat:()=>iu,solarPanelProp:()=>ug,tankProp:()=>_h,topMat:()=>nu,trafficCone:()=>bh,utilityPole:()=>Eh,waterTowerProp:()=>Mh});var Rm=0,ld=1,Am=2;var $s=1,Cm=2,qr=3,Ai=0,Pn=1,Wt=2,Qt=0,Yr=1,ao=2,cd=3,hd=4,pc=5;var Qn=100,Pm=101,Im=102,Lm=103,Dm=104,Zs=200,Nm=201,Um=202,Fm=203,ud=204,dd=205,oo=206,Om=207,lo=208,Bm=209,km=210,Hm=211,zm=212,Gm=213,Vm=214,Ul=0,Fl=1,Ol=2,Pr=3,Bl=4,kl=5,Hl=6,zl=7,fd=0,Wm=1,Xm=2,ui=0,co=1,ho=2,uo=3,js=4,fo=5,po=6,mo=7,Zu="attached",qm="detached",pd=300,Ss=301,Js=302,Kr=303,mc=304,go=306,on=1e3,jt=1001,Ir=1002,Vt=1003,gc=1004;var Qs=1005;var Jt=1006,$r=1007;var di=1008;var En=1009,md=1010,gd=1011,Zr=1012,xc=1013,fi=1014,qn=1015,an=1016,yc=1017,_c=1018,Es=1020,xd=35902,yd=35899,_d=1021,vd=1022,In=1023,Mi=1026,Ci=1027,vc=1028,Mc=1029,ws=1030,bc=1031;var Sc=1033,xo=33776,yo=33777,_o=33778,vo=33779,Ec=35840,wc=35841,Tc=35842,Rc=35843,Ac=36196,Cc=37492,Pc=37496,Ic=37488,Lc=37489,Mo=37490,Dc=37491,Nc=37808,Uc=37809,Fc=37810,Oc=37811,Bc=37812,kc=37813,Hc=37814,zc=37815,Gc=37816,Vc=37817,Wc=37818,Xc=37819,qc=37820,Yc=37821,Kc=36492,$c=36494,Zc=36495,jc=36283,Jc=36284,bo=36285,Qc=36286;var Hs=2300,zs=2301,Ll=2302,ju=2303,Ju=2400,Qu=2401,ed=2402,Ym=2500;var Md=0,So=1,jr=2,Km=3200;var Eo=0,$m=1,pi="",xt="srgb",Cn="srgb-linear",Ia="linear",yt="srgb";var Dl=7680;var Zm=519,jm=512,Jm=513,Qm=514,eh=515,e0=516,t0=517,th=518,n0=519,bd=35044;var Sd="300 es",ci=2e3,Lr=2001;function Ix(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Lx(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Dr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function i0(){let i=Dr("canvas");return i.style.display="block",i}var kp={},Nr=null;function La(...i){let e="THREE."+i.shift();Nr?Nr("log",e,...i):console.log(e,...i)}function s0(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function ke(...i){i=s0(i);let e="THREE."+i.shift();if(Nr)Nr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ye(...i){i=s0(i);let e="THREE."+i.shift();if(Nr)Nr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function ks(...i){let e=i.join(" ");e in kp||(kp[e]=!0,ke(...i))}function r0(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var a0={[Ul]:Fl,[Ol]:Hl,[Bl]:zl,[Pr]:kl,[Fl]:Ul,[Hl]:Ol,[zl]:Bl,[kl]:Pr},bi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Hp=1234567,Ra=Math.PI/180,Gs=180/Math.PI;function hi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]+"-"+Mn[e&255]+Mn[e>>8&255]+"-"+Mn[e>>16&15|64]+Mn[e>>24&255]+"-"+Mn[t&63|128]+Mn[t>>8&255]+"-"+Mn[t>>16&255]+Mn[t>>24&255]+Mn[n&255]+Mn[n>>8&255]+Mn[n>>16&255]+Mn[n>>24&255]).toLowerCase()}function st(i,e,t){return Math.max(e,Math.min(t,i))}function Ed(i,e){return(i%e+e)%e}function Dx(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Nx(i,e,t){return i!==e?(t-i)/(e-i):0}function Aa(i,e,t){return(1-t)*i+t*e}function Ux(i,e,t,n){return Aa(i,e,1-Math.exp(-t*n))}function Fx(i,e=1){return e-Math.abs(Ed(i,e*2)-e)}function Ox(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Bx(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function kx(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Hx(i,e){return i+Math.random()*(e-i)}function zx(i){return i*(.5-Math.random())}function Gx(i){i!==void 0&&(Hp=i);let e=Hp+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Vx(i){return i*Ra}function Wx(i){return i*Gs}function Xx(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function qx(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Yx(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Kx(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),d=r((e-n)/2),f=a((e-n)/2),h=r((n-e)/2),m=a((n-e)/2);switch(s){case"XYX":i.set(o*u,l*d,l*f,o*c);break;case"YZY":i.set(l*f,o*u,l*d,o*c);break;case"ZXZ":i.set(l*d,l*f,o*u,o*c);break;case"XZX":i.set(o*u,l*m,l*h,o*c);break;case"YXY":i.set(l*h,o*u,l*m,o*c);break;case"ZYZ":i.set(l*m,l*h,o*u,o*c);break;default:ke("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function li(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function St(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var wd={DEG2RAD:Ra,RAD2DEG:Gs,generateUUID:hi,clamp:st,euclideanModulo:Ed,mapLinear:Dx,inverseLerp:Nx,lerp:Aa,damp:Ux,pingpong:Fx,smoothstep:Ox,smootherstep:Bx,randInt:kx,randFloat:Hx,randFloatSpread:zx,seededRandom:Gx,degToRad:Vx,radToDeg:Wx,isPowerOfTwo:Xx,ceilPowerOfTwo:qx,floorPowerOfTwo:Yx,setQuaternionFromProperEuler:Kx,normalize:St,denormalize:li},Id=class Id{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Id.prototype.isVector2=!0;var de=Id,Vn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],d=n[s+3],f=r[a+0],h=r[a+1],m=r[a+2],x=r[a+3];if(d!==x||l!==f||c!==h||u!==m){let p=l*f+c*h+u*m+d*x;p<0&&(f=-f,h=-h,m=-m,x=-x,p=-p);let g=1-o;if(p<.9995){let y=Math.acos(p),M=Math.sin(y);g=Math.sin(g*y)/M,o=Math.sin(o*y)/M,l=l*g+f*o,c=c*g+h*o,u=u*g+m*o,d=d*g+x*o}else{l=l*g+f*o,c=c*g+h*o,u=u*g+m*o,d=d*g+x*o;let y=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=y,c*=y,u*=y,d*=y}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],d=r[a],f=r[a+1],h=r[a+2],m=r[a+3];return e[t]=o*m+u*d+l*h-c*f,e[t+1]=l*m+u*f+c*d-o*h,e[t+2]=c*m+u*h+o*f-l*d,e[t+3]=u*m-o*d-l*f-c*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),d=o(r/2),f=l(n/2),h=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=f*u*d+c*h*m,this._y=c*h*d-f*u*m,this._z=c*u*m+f*h*d,this._w=c*u*d-f*h*m;break;case"YXZ":this._x=f*u*d+c*h*m,this._y=c*h*d-f*u*m,this._z=c*u*m-f*h*d,this._w=c*u*d+f*h*m;break;case"ZXY":this._x=f*u*d-c*h*m,this._y=c*h*d+f*u*m,this._z=c*u*m+f*h*d,this._w=c*u*d-f*h*m;break;case"ZYX":this._x=f*u*d-c*h*m,this._y=c*h*d+f*u*m,this._z=c*u*m-f*h*d,this._w=c*u*d+f*h*m;break;case"YZX":this._x=f*u*d+c*h*m,this._y=c*h*d+f*u*m,this._z=c*u*m-f*h*d,this._w=c*u*d-f*h*m;break;case"XZY":this._x=f*u*d-c*h*m,this._y=c*h*d-f*u*m,this._z=c*u*m+f*h*d,this._w=c*u*d+f*h*m;break;default:ke("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],f=n+o+d;if(f>0){let h=.5/Math.sqrt(f+1);this._w=.25/h,this._x=(u-l)*h,this._y=(r-c)*h,this._z=(a-s)*h}else if(n>o&&n>d){let h=2*Math.sqrt(1+n-o-d);this._w=(u-l)/h,this._x=.25*h,this._y=(s+a)/h,this._z=(r+c)/h}else if(o>d){let h=2*Math.sqrt(1+o-n-d);this._w=(r-c)/h,this._x=(s+a)/h,this._y=.25*h,this._z=(l+u)/h}else{let h=2*Math.sqrt(1+d-n-o);this._w=(a-s)/h,this._x=(r+c)/h,this._y=(l+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Ld=class Ld{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(zp.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(zp.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*u,this.y=n+l*u+o*c-r*d,this.z=s+l*d+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return bu.copy(this).projectOnVector(e),this.sub(bu)}reflect(e){return this.sub(bu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ld.prototype.isVector3=!0;var P=Ld,bu=new P,zp=new Vn,Dd=class Dd{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],f=n[2],h=n[5],m=n[8],x=s[0],p=s[3],g=s[6],y=s[1],M=s[4],_=s[7],b=s[2],S=s[5],R=s[8];return r[0]=a*x+o*y+l*b,r[3]=a*p+o*M+l*S,r[6]=a*g+o*_+l*R,r[1]=c*x+u*y+d*b,r[4]=c*p+u*M+d*S,r[7]=c*g+u*_+d*R,r[2]=f*x+h*y+m*b,r[5]=f*p+h*M+m*S,r[8]=f*g+h*_+m*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,f=o*l-u*r,h=c*r-a*l,m=t*d+n*f+s*h;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=d*x,e[1]=(s*c-u*n)*x,e[2]=(o*n-s*a)*x,e[3]=f*x,e[4]=(u*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=h*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return ks("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Su.makeScale(e,t)),this}rotate(e){return ks("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Su.makeRotation(-e)),this}translate(e,t){return ks("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Su.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Dd.prototype.isMatrix3=!0;var $e=Dd,Su=new $e,Gp=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Vp=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $x(){let i={enabled:!0,workingColorSpace:Cn,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===yt&&(s.r=qi(s.r),s.g=qi(s.g),s.b=qi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===yt&&(s.r=Cr(s.r),s.g=Cr(s.g),s.b=Cr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===pi?Ia:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ks("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ks("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Cn]:{primaries:e,whitePoint:n,transfer:Ia,toXYZ:Gp,fromXYZ:Vp,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:xt},outputColorSpaceConfig:{drawingBufferColorSpace:xt}},[xt]:{primaries:e,whitePoint:n,transfer:yt,toXYZ:Gp,fromXYZ:Vp,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:xt}}}),i}var et=$x();function qi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Cr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var ur,Gl=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ur===void 0&&(ur=Dr("canvas")),ur.width=e.width,ur.height=e.height;let s=ur.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ur}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Dr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=qi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(qi(t[n]/255)*255):t[n]=qi(t[n]);return{data:t,width:e.width,height:e.height}}else return ke("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Zx=0,Ur=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Zx++}),this.uuid=hi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Eu(s[a].image)):r.push(Eu(s[a]))}else r=Eu(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Eu(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Gl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ke("Texture: Unable to serialize Texture."),{})}var jx=0,wu=new P,ln=class i extends bi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=jt,s=jt,r=Jt,a=di,o=In,l=En,c=i.DEFAULT_ANISOTROPY,u=pi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jx++}),this.uuid=hi(),this.name="",this.source=new Ur(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new de(0,0),this.repeat=new de(1,1),this.center=new de(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(wu).x}get height(){return this.source.getSize(wu).y}get depth(){return this.source.getSize(wu).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){ke(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){ke(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==pd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case on:e.x=e.x-Math.floor(e.x);break;case jt:e.x=e.x<0?0:1;break;case Ir:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case on:e.y=e.y-Math.floor(e.y);break;case jt:e.y=e.y<0?0:1;break;case Ir:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=pd;ln.DEFAULT_ANISOTROPY=1;var Nd=class Nd{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],h=l[5],m=l[9],x=l[2],p=l[6],g=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-x)<.01&&Math.abs(m-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+x)<.1&&Math.abs(m+p)<.1&&Math.abs(c+h+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,_=(h+1)/2,b=(g+1)/2,S=(u+f)/4,R=(d+x)/4,v=(m+p)/4;return M>_&&M>b?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=S/n,r=R/n):_>b?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=S/s,r=v/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=R/r,s=v/r),this.set(n,s,r,t),this}let y=Math.sqrt((p-m)*(p-m)+(d-x)*(d-x)+(f-u)*(f-u));return Math.abs(y)<.001&&(y=1),this.x=(p-m)/y,this.y=(d-x)/y,this.z=(f-u)/y,this.w=Math.acos((c+h+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this.w=st(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this.w=st(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Nd.prototype.isVector4=!0;var Et=Nd,Vl=class extends bi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Et(0,0,e,t),this.scissorTest=!1,this.viewport=new Et(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new ln(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Jt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ur(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Yt=class extends Vl{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Da=class extends ln{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=jt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Wl=class extends ln{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=jt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var fc=class fc{constructor(e,t,n,s,r,a,o,l,c,u,d,f,h,m,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,d,f,h,m,x,p)}set(e,t,n,s,r,a,o,l,c,u,d,f,h,m,x,p){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=u,g[10]=d,g[14]=f,g[3]=h,g[7]=m,g[11]=x,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fc().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/dr.setFromMatrixColumn(e,0).length(),r=1/dr.setFromMatrixColumn(e,1).length(),a=1/dr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let f=a*u,h=a*d,m=o*u,x=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=h+m*c,t[5]=f-x*c,t[9]=-o*l,t[2]=x-f*c,t[6]=m+h*c,t[10]=a*l}else if(e.order==="YXZ"){let f=l*u,h=l*d,m=c*u,x=c*d;t[0]=f+x*o,t[4]=m*o-h,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=h*o-m,t[6]=x+f*o,t[10]=a*l}else if(e.order==="ZXY"){let f=l*u,h=l*d,m=c*u,x=c*d;t[0]=f-x*o,t[4]=-a*d,t[8]=m+h*o,t[1]=h+m*o,t[5]=a*u,t[9]=x-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let f=a*u,h=a*d,m=o*u,x=o*d;t[0]=l*u,t[4]=m*c-h,t[8]=f*c+x,t[1]=l*d,t[5]=x*c+f,t[9]=h*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let f=a*l,h=a*c,m=o*l,x=o*c;t[0]=l*u,t[4]=x-f*d,t[8]=m*d+h,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=h*d+m,t[10]=f-x*d}else if(e.order==="XZY"){let f=a*l,h=a*c,m=o*l,x=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=f*d+x,t[5]=a*u,t[9]=h*d-m,t[2]=m*d-h,t[6]=o*u,t[10]=x*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Jx,e,Qx)}lookAt(e,t,n){let s=this.elements;return zn.subVectors(e,t),zn.lengthSq()===0&&(zn.z=1),zn.normalize(),fs.crossVectors(n,zn),fs.lengthSq()===0&&(Math.abs(n.z)===1?zn.x+=1e-4:zn.z+=1e-4,zn.normalize(),fs.crossVectors(n,zn)),fs.normalize(),sl.crossVectors(zn,fs),s[0]=fs.x,s[4]=sl.x,s[8]=zn.x,s[1]=fs.y,s[5]=sl.y,s[9]=zn.y,s[2]=fs.z,s[6]=sl.z,s[10]=zn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],f=n[9],h=n[13],m=n[2],x=n[6],p=n[10],g=n[14],y=n[3],M=n[7],_=n[11],b=n[15],S=s[0],R=s[4],v=s[8],w=s[12],A=s[1],L=s[5],D=s[9],H=s[13],N=s[2],z=s[6],V=s[10],J=s[14],ae=s[3],Y=s[7],B=s[11],re=s[15];return r[0]=a*S+o*A+l*N+c*ae,r[4]=a*R+o*L+l*z+c*Y,r[8]=a*v+o*D+l*V+c*B,r[12]=a*w+o*H+l*J+c*re,r[1]=u*S+d*A+f*N+h*ae,r[5]=u*R+d*L+f*z+h*Y,r[9]=u*v+d*D+f*V+h*B,r[13]=u*w+d*H+f*J+h*re,r[2]=m*S+x*A+p*N+g*ae,r[6]=m*R+x*L+p*z+g*Y,r[10]=m*v+x*D+p*V+g*B,r[14]=m*w+x*H+p*J+g*re,r[3]=y*S+M*A+_*N+b*ae,r[7]=y*R+M*L+_*z+b*Y,r[11]=y*v+M*D+_*V+b*B,r[15]=y*w+M*H+_*J+b*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],h=e[14],m=e[3],x=e[7],p=e[11],g=e[15],y=l*h-c*f,M=o*h-c*d,_=o*f-l*d,b=a*h-c*u,S=a*f-l*u,R=a*d-o*u;return t*(x*y-p*M+g*_)-n*(m*y-p*b+g*S)+s*(m*M-x*b+g*R)-r*(m*_-x*S+p*R)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(r*u-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],h=e[11],m=e[12],x=e[13],p=e[14],g=e[15],y=t*o-n*a,M=t*l-s*a,_=t*c-r*a,b=n*l-s*o,S=n*c-r*o,R=s*c-r*l,v=u*x-d*m,w=u*p-f*m,A=u*g-h*m,L=d*p-f*x,D=d*g-h*x,H=f*g-h*p,N=y*H-M*D+_*L+b*A-S*w+R*v;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/N;return e[0]=(o*H-l*D+c*L)*z,e[1]=(s*D-n*H-r*L)*z,e[2]=(x*R-p*S+g*b)*z,e[3]=(f*S-d*R-h*b)*z,e[4]=(l*A-a*H-c*w)*z,e[5]=(t*H-s*A+r*w)*z,e[6]=(p*_-m*R-g*M)*z,e[7]=(u*R-f*_+h*M)*z,e[8]=(a*D-o*A+c*v)*z,e[9]=(n*A-t*D-r*v)*z,e[10]=(m*S-x*_+g*y)*z,e[11]=(d*_-u*S-h*y)*z,e[12]=(o*w-a*L-l*v)*z,e[13]=(t*L-n*w+s*v)*z,e[14]=(x*M-m*b-p*y)*z,e[15]=(u*b-d*M+f*y)*z,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,d=o+o,f=r*c,h=r*u,m=r*d,x=a*u,p=a*d,g=o*d,y=l*c,M=l*u,_=l*d,b=n.x,S=n.y,R=n.z;return s[0]=(1-(x+g))*b,s[1]=(h+_)*b,s[2]=(m-M)*b,s[3]=0,s[4]=(h-_)*S,s[5]=(1-(f+g))*S,s[6]=(p+y)*S,s[7]=0,s[8]=(m+M)*R,s[9]=(p-y)*R,s[10]=(1-(f+x))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=dr.set(s[0],s[1],s[2]).length(),o=dr.set(s[4],s[5],s[6]).length(),l=dr.set(s[8],s[9],s[10]).length();r<0&&(a=-a),si.copy(this);let c=1/a,u=1/o,d=1/l;return si.elements[0]*=c,si.elements[1]*=c,si.elements[2]*=c,si.elements[4]*=u,si.elements[5]*=u,si.elements[6]*=u,si.elements[8]*=d,si.elements[9]*=d,si.elements[10]*=d,t.setFromRotationMatrix(si),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=ci,l=!1){let c=this.elements,u=2*r/(t-e),d=2*r/(n-s),f=(t+e)/(t-e),h=(n+s)/(n-s),m,x;if(l)m=r/(a-r),x=a*r/(a-r);else if(o===ci)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Lr)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=ci,l=!1){let c=this.elements,u=2/(t-e),d=2/(n-s),f=-(t+e)/(t-e),h=-(n+s)/(n-s),m,x;if(l)m=1/(a-r),x=a/(a-r);else if(o===ci)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===Lr)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=d,c[9]=0,c[13]=h,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};fc.prototype.isMatrix4=!0;var Xe=fc,dr=new P,si=new Xe,Jx=new P(0,0,0),Qx=new P(1,1,1),fs=new P,sl=new P,zn=new P,Wp=new Xe,Xp=new Vn,Yi=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],d=s[2],f=s[6],h=s[10];switch(t){case"XYZ":this._y=Math.asin(st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-st(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(st(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,h),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-st(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,h),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(st(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,h));break;case"XZY":this._z=Math.asin(-st(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,h),this._y=0);break;default:ke("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Wp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Wp,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Xp.setFromEuler(this),this.setFromQuaternion(Xp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Yi.DEFAULT_ORDER="XYZ";var Na=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},ey=0,qp=new P,fr=new Vn,ki=new Xe,rl=new P,ga=new P,ty=new P,ny=new Vn,Yp=new P(1,0,0),Kp=new P(0,1,0),$p=new P(0,0,1),Zp={type:"added"},iy={type:"removed"},pr={type:"childadded",child:null},Tu={type:"childremoved",child:null},Dt=class i extends bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ey++}),this.uuid=hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new Yi,n=new Vn,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xe},normalMatrix:{value:new $e}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Na,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return fr.setFromAxisAngle(e,t),this.quaternion.multiply(fr),this}rotateOnWorldAxis(e,t){return fr.setFromAxisAngle(e,t),this.quaternion.premultiply(fr),this}rotateX(e){return this.rotateOnAxis(Yp,e)}rotateY(e){return this.rotateOnAxis(Kp,e)}rotateZ(e){return this.rotateOnAxis($p,e)}translateOnAxis(e,t){return qp.copy(e).applyQuaternion(this.quaternion),this.position.add(qp.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Yp,e)}translateY(e){return this.translateOnAxis(Kp,e)}translateZ(e){return this.translateOnAxis($p,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ki.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?rl.copy(e):rl.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ga.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ki.lookAt(ga,rl,this.up):ki.lookAt(rl,ga,this.up),this.quaternion.setFromRotationMatrix(ki),s&&(ki.extractRotation(s.matrixWorld),fr.setFromRotationMatrix(ki),this.quaternion.premultiply(fr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ye("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Zp),pr.child=e,this.dispatchEvent(pr),pr.child=null):Ye("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(iy),Tu.child=e,this.dispatchEvent(Tu),Tu.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ki.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ki.multiply(e.parent.matrixWorld)),e.applyMatrix4(ki),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Zp),pr.child=e,this.dispatchEvent(pr),pr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ga,e,ty),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ga,ny,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),h=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),h.length>0&&(n.animations=h),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Dt.DEFAULT_UP=new P(0,1,0);Dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ce=class extends Dt{constructor(){super(),this.isGroup=!0,this.type="Group"}},sy={type:"move"},Fr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ce,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ce,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ce,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let p=t.getJointPose(x,n),g=this._getHandJoint(c,x);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),h=.02,m=.005;c.inputState.pinching&&f>h+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=h-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(sy)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Ce;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},o0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ps={h:0,s:0,l:0},al={h:0,s:0,l:0};function Ru(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Pe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=n,et.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=et.workingColorSpace){if(e=Ed(e,1),t=st(t,0,1),n=st(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ru(a,r,e+1/3),this.g=Ru(a,r,e),this.b=Ru(a,r,e-1/3)}return et.colorSpaceToWorking(this,s),this}setStyle(e,t=xt){function n(r){r!==void 0&&parseFloat(r)<1&&ke("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ke("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);ke("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=xt){let n=o0[e.toLowerCase()];return n!==void 0?this.setHex(n,t):ke("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=qi(e.r),this.g=qi(e.g),this.b=qi(e.b),this}copyLinearToSRGB(e){return this.r=Cr(e.r),this.g=Cr(e.g),this.b=Cr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=xt){return et.workingToColorSpace(bn.copy(this),e),Math.round(st(bn.r*255,0,255))*65536+Math.round(st(bn.g*255,0,255))*256+Math.round(st(bn.b*255,0,255))}getHexString(e=xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(bn.copy(this),t);let n=bn.r,s=bn.g,r=bn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(bn.copy(this),t),e.r=bn.r,e.g=bn.g,e.b=bn.b,e}getStyle(e=xt){et.workingToColorSpace(bn.copy(this),e);let t=bn.r,n=bn.g,s=bn.b;return e!==xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ps),this.setHSL(ps.h+e,ps.s+t,ps.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ps),e.getHSL(al);let n=Aa(ps.h,al.h,t),s=Aa(ps.s,al.s,t),r=Aa(ps.l,al.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},bn=new Pe;Pe.NAMES=o0;var Ua=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Pe(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Fa=class extends Dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yi,this.environmentIntensity=1,this.environmentRotation=new Yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},ri=new P,Hi=new P,Au=new P,zi=new P,mr=new P,gr=new P,jp=new P,Cu=new P,Pu=new P,Iu=new P,Lu=new Et,Du=new Et,Nu=new Et,Xi=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ri.subVectors(e,t),s.cross(ri);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ri.subVectors(s,t),Hi.subVectors(n,t),Au.subVectors(e,t);let a=ri.dot(ri),o=ri.dot(Hi),l=ri.dot(Au),c=Hi.dot(Hi),u=Hi.dot(Au),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let f=1/d,h=(c*l-o*u)*f,m=(a*u-o*l)*f;return r.set(1-h-m,m,h)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,zi)===null?!1:zi.x>=0&&zi.y>=0&&zi.x+zi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,zi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,zi.x),l.addScaledVector(a,zi.y),l.addScaledVector(o,zi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Lu.setScalar(0),Du.setScalar(0),Nu.setScalar(0),Lu.fromBufferAttribute(e,t),Du.fromBufferAttribute(e,n),Nu.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Lu,r.x),a.addScaledVector(Du,r.y),a.addScaledVector(Nu,r.z),a}static isFrontFacing(e,t,n,s){return ri.subVectors(n,t),Hi.subVectors(e,t),ri.cross(Hi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ri.subVectors(this.c,this.b),Hi.subVectors(this.a,this.b),ri.cross(Hi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;mr.subVectors(s,n),gr.subVectors(r,n),Cu.subVectors(e,n);let l=mr.dot(Cu),c=gr.dot(Cu);if(l<=0&&c<=0)return t.copy(n);Pu.subVectors(e,s);let u=mr.dot(Pu),d=gr.dot(Pu);if(u>=0&&d<=u)return t.copy(s);let f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(mr,a);Iu.subVectors(e,r);let h=mr.dot(Iu),m=gr.dot(Iu);if(m>=0&&h<=m)return t.copy(r);let x=h*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(gr,o);let p=u*m-h*d;if(p<=0&&d-u>=0&&h-m>=0)return jp.subVectors(r,s),o=(d-u)/(d-u+(h-m)),t.copy(s).addScaledVector(jp,o);let g=1/(p+x+f);return a=x*g,o=f*g,t.copy(n).addScaledVector(mr,a).addScaledVector(gr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Wn=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ai.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ai.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ai.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ai):ai.fromBufferAttribute(r,a),ai.applyMatrix4(e.matrixWorld),this.expandByPoint(ai);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ol.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ol.copy(n.boundingBox)),ol.applyMatrix4(e.matrixWorld),this.union(ol)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ai),ai.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(xa),ll.subVectors(this.max,xa),xr.subVectors(e.a,xa),yr.subVectors(e.b,xa),_r.subVectors(e.c,xa),ms.subVectors(yr,xr),gs.subVectors(_r,yr),Us.subVectors(xr,_r);let t=[0,-ms.z,ms.y,0,-gs.z,gs.y,0,-Us.z,Us.y,ms.z,0,-ms.x,gs.z,0,-gs.x,Us.z,0,-Us.x,-ms.y,ms.x,0,-gs.y,gs.x,0,-Us.y,Us.x,0];return!Uu(t,xr,yr,_r,ll)||(t=[1,0,0,0,1,0,0,0,1],!Uu(t,xr,yr,_r,ll))?!1:(cl.crossVectors(ms,gs),t=[cl.x,cl.y,cl.z],Uu(t,xr,yr,_r,ll))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ai).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ai).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Gi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Gi=[new P,new P,new P,new P,new P,new P,new P,new P],ai=new P,ol=new Wn,xr=new P,yr=new P,_r=new P,ms=new P,gs=new P,Us=new P,xa=new P,ll=new P,cl=new P,Fs=new P;function Uu(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Fs.fromArray(i,r);let o=s.x*Math.abs(Fs.x)+s.y*Math.abs(Fs.y)+s.z*Math.abs(Fs.z),l=e.dot(Fs),c=t.dot(Fs),u=n.dot(Fs);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var nn=new P,hl=new de,ry=0,rn=class extends bi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ry++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=bd,this.updateRanges=[],this.gpuType=qn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)hl.fromBufferAttribute(this,t),hl.applyMatrix3(e),this.setXY(t,hl.x,hl.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix3(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix4(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyNormalMatrix(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.transformDirection(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=li(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=St(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=li(t,this.array)),t}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=li(t,this.array)),t}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=li(t,this.array)),t}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=li(t,this.array)),t}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array),r=St(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Oa=class extends rn{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Ba=class extends rn{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var pt=class extends rn{constructor(e,t,n){super(new Float32Array(e),t,n)}},ay=new Wn,ya=new P,Fu=new P,Un=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):ay.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ya.subVectors(e,this.center);let t=ya.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ya,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Fu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ya.copy(e.center).add(Fu)),this.expandByPoint(ya.copy(e.center).sub(Fu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},oy=0,jn=new Xe,Ou=new Dt,vr=new P,Gn=new Wn,_a=new Wn,fn=new P,Ht=class i extends bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:oy++}),this.uuid=hi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ix(e)?Ba:Oa)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new $e().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return jn.makeRotationFromQuaternion(e),this.applyMatrix4(jn),this}rotateX(e){return jn.makeRotationX(e),this.applyMatrix4(jn),this}rotateY(e){return jn.makeRotationY(e),this.applyMatrix4(jn),this}rotateZ(e){return jn.makeRotationZ(e),this.applyMatrix4(jn),this}translate(e,t,n){return jn.makeTranslation(e,t,n),this.applyMatrix4(jn),this}scale(e,t,n){return jn.makeScale(e,t,n),this.applyMatrix4(jn),this}lookAt(e){return Ou.lookAt(e),Ou.updateMatrix(),this.applyMatrix4(Ou.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vr).negate(),this.translate(vr.x,vr.y,vr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new pt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ke("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ye("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Gn.setFromBufferAttribute(r),this.morphTargetsRelative?(fn.addVectors(this.boundingBox.min,Gn.min),this.boundingBox.expandByPoint(fn),fn.addVectors(this.boundingBox.max,Gn.max),this.boundingBox.expandByPoint(fn)):(this.boundingBox.expandByPoint(Gn.min),this.boundingBox.expandByPoint(Gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ye('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Un);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ye("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(Gn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];_a.setFromBufferAttribute(o),this.morphTargetsRelative?(fn.addVectors(Gn.min,_a.min),Gn.expandByPoint(fn),fn.addVectors(Gn.max,_a.max),Gn.expandByPoint(fn)):(Gn.expandByPoint(_a.min),Gn.expandByPoint(_a.max))}Gn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)fn.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(fn));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)fn.fromBufferAttribute(o,c),l&&(vr.fromBufferAttribute(e,c),fn.add(vr)),s=Math.max(s,n.distanceToSquared(fn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ye('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ye("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new rn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new P,l[v]=new P;let c=new P,u=new P,d=new P,f=new de,h=new de,m=new de,x=new P,p=new P;function g(v,w,A){c.fromBufferAttribute(n,v),u.fromBufferAttribute(n,w),d.fromBufferAttribute(n,A),f.fromBufferAttribute(r,v),h.fromBufferAttribute(r,w),m.fromBufferAttribute(r,A),u.sub(c),d.sub(c),h.sub(f),m.sub(f);let L=1/(h.x*m.y-m.x*h.y);isFinite(L)&&(x.copy(u).multiplyScalar(m.y).addScaledVector(d,-h.y).multiplyScalar(L),p.copy(d).multiplyScalar(h.x).addScaledVector(u,-m.x).multiplyScalar(L),o[v].add(x),o[w].add(x),o[A].add(x),l[v].add(p),l[w].add(p),l[A].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let v=0,w=y.length;v<w;++v){let A=y[v],L=A.start,D=A.count;for(let H=L,N=L+D;H<N;H+=3)g(e.getX(H+0),e.getX(H+1),e.getX(H+2))}let M=new P,_=new P,b=new P,S=new P;function R(v){b.fromBufferAttribute(s,v),S.copy(b);let w=o[v];M.copy(w),M.sub(b.multiplyScalar(b.dot(w))).normalize(),_.crossVectors(S,w);let L=_.dot(l[v])<0?-1:1;a.setXYZW(v,M.x,M.y,M.z,L)}for(let v=0,w=y.length;v<w;++v){let A=y[v],L=A.start,D=A.count;for(let H=L,N=L+D;H<N;H+=3)R(e.getX(H+0)),R(e.getX(H+1)),R(e.getX(H+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new rn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,h=n.count;f<h;f++)n.setXYZ(f,0,0,0);let s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,d=new P;if(e)for(let f=0,h=e.count;f<h;f+=3){let m=e.getX(f+0),x=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,p),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,p),o.add(u),l.add(u),c.add(u),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,h=t.count;f<h;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)fn.fromBufferAttribute(e,t),fn.normalize(),e.setXYZ(t,fn.x,fn.y,fn.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,d=o.normalized,f=new c.constructor(l.length*u),h=0,m=0;for(let x=0,p=l.length;x<p;x++){o.isInterleavedBufferAttribute?h=l[x]*o.data.stride+o.offset:h=l[x]*u;for(let g=0;g<u;g++)f[m++]=c[h++]}return new rn(f,u,d)}if(this.index===null)return ke("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let u=0,d=c.length;u<d;u++){let f=c[u],h=e(f,n);l.push(h)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){let h=c[d];u.push(h.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],d=r[c];for(let f=0,h=d.length;f<h;f++)u.push(d[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Vs=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=bd,this.updateRanges=[],this.version=0,this.uuid=hi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},An=new P,_s=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)An.fromBufferAttribute(this,t),An.applyMatrix4(e),this.setXYZ(t,An.x,An.y,An.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)An.fromBufferAttribute(this,t),An.applyNormalMatrix(e),this.setXYZ(t,An.x,An.y,An.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)An.fromBufferAttribute(this,t),An.transformDirection(e),this.setXYZ(t,An.x,An.y,An.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=li(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=St(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=li(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=li(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=li(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=li(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),n=St(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array),r=St(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){La("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new rn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){La("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Bu=new P,ly=new P,cy=new $e,oi=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Bu.subVectors(n,t).cross(ly.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Bu),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||cy.getNormalMatrix(e),s=this.coplanarPoint(Bu).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},hy=0,Sn=class extends bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hy++}),this.uuid=hi(),this.name="",this.type="Material",this.blending=Yr,this.side=Ai,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ud,this.blendDst=dd,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=Pr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Dl,this.stencilZFail=Dl,this.stencilZPass=Dl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){ke(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){ke(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Pe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new oi().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new de().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new de().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},vs=class extends Sn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Mr,va=new P,br=new P,Sr=new P,Er=new de,Ma=new de,l0=new Xe,ul=new P,ba=new P,dl=new P,Jp=new de,ku=new de,Qp=new de,Ws=class extends Dt{constructor(e=new vs){if(super(),this.isSprite=!0,this.type="Sprite",Mr===void 0){Mr=new Ht;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Vs(t,5);Mr.setIndex([0,1,2,0,2,3]),Mr.setAttribute("position",new _s(n,3,0,!1)),Mr.setAttribute("uv",new _s(n,2,3,!1))}this.geometry=Mr,this.material=e,this.center=new de(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Ye('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),br.setFromMatrixScale(this.matrixWorld),l0.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Sr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&br.multiplyScalar(-Sr.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;fl(ul.set(-.5,-.5,0),Sr,a,br,s,r),fl(ba.set(.5,-.5,0),Sr,a,br,s,r),fl(dl.set(.5,.5,0),Sr,a,br,s,r),Jp.set(0,0),ku.set(1,0),Qp.set(1,1);let o=e.ray.intersectTriangle(ul,ba,dl,!1,va);if(o===null&&(fl(ba.set(-.5,.5,0),Sr,a,br,s,r),ku.set(0,1),o=e.ray.intersectTriangle(ul,dl,ba,!1,va),o===null))return;let l=e.ray.origin.distanceTo(va);l<e.near||l>e.far||t.push({distance:l,point:va.clone(),uv:Xi.getInterpolation(va,ul,ba,dl,Jp,ku,Qp,new de),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function fl(i,e,t,n,s,r){Er.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Ma.x=r*Er.x-s*Er.y,Ma.y=s*Er.x+r*Er.y):Ma.copy(Er),i.copy(e),i.x+=Ma.x,i.y+=Ma.y,i.applyMatrix4(l0)}var Vi=new P,Hu=new P,pl=new P,ml=new P,Xs=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Vi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Vi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Vi.copy(this.origin).addScaledVector(this.direction,t),Vi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Hu.copy(e).add(t).multiplyScalar(.5),pl.copy(t).sub(e).normalize(),ml.copy(this.origin).sub(Hu);let r=e.distanceTo(t)*.5,a=-this.direction.dot(pl),o=ml.dot(this.direction),l=-ml.dot(pl),c=ml.lengthSq(),u=Math.abs(1-a*a),d,f,h,m;if(u>0)if(d=a*l-o,f=a*o-l,m=r*u,d>=0)if(f>=-m)if(f<=m){let x=1/u;d*=x,f*=x,h=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=r,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;else f<=-m?(d=Math.max(0,-(-a*r+o)),f=d>0?-r:Math.min(Math.max(-r,-l),r),h=-d*d+f*(f+2*l)+c):f<=m?(d=0,f=Math.min(Math.max(-r,-l),r),h=f*(f+2*l)+c):(d=Math.max(0,-(a*r+o)),f=d>0?r:Math.min(Math.max(-r,-l),r),h=-d*d+f*(f+2*l)+c);else f=a>0?-r:r,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Hu).addScaledVector(pl,f),h}intersectSphere(e,t){if(e.radius<0)return null;Vi.subVectors(e.center,this.origin);let n=Vi.dot(this.direction),s=Vi.dot(Vi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Vi)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,d=e.x-a.x,f=e.y-a.y,h=e.z-a.z,m=t.x-a.x,x=t.y-a.y,p=t.z-a.z,g=n.x-a.x,y=n.y-a.y,M=n.z-a.z,_=Math.abs(l),b=Math.abs(c),S=Math.abs(u),R,v,w,A,L,D,H,N,z,V,J,ae;if(_>=b&&_>=S?(w=l,D=d,z=m,ae=g,l>=0?(R=c,v=u,A=f,L=h,H=x,N=p,V=y,J=M):(R=u,v=c,A=h,L=f,H=p,N=x,V=M,J=y)):b>=S?(w=c,D=f,z=x,ae=y,c>=0?(R=u,v=l,A=h,L=d,H=p,N=m,V=M,J=g):(R=l,v=u,A=d,L=h,H=m,N=p,V=g,J=M)):(w=u,D=h,z=p,ae=M,u>=0?(R=l,v=c,A=d,L=f,H=m,N=x,V=g,J=y):(R=c,v=l,A=f,L=d,H=x,N=m,V=y,J=g)),w===0)return null;let Y=R/w,B=v/w,re=1/w,Ee=A-Y*D,Te=L-B*D,ht=H-Y*z,Ze=N-B*z,it=V-Y*ae,Z=J-B*ae,ee=it*Ze-Z*ht,ye=Ee*Z-Te*it,ze=ht*Te-Ze*Ee;if(s){if(ee<0||ye<0||ze<0)return null}else if((ee<0||ye<0||ze<0)&&(ee>0||ye>0||ze>0))return null;let we=ee+ye+ze;if(we===0)return null;let Ke=re*(ee*D+ye*z+ze*ae);return(we>0?Ke<0:Ke>0)?null:this.at(Ke/we,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},cn=class extends Sn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yi,this.combine=fd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},em=new Xe,Os=new Xs,gl=new Un,tm=new P,xl=new P,yl=new P,_l=new P,zu=new P,vl=new P,nm=new P,Ml=new P,I=class extends Dt{constructor(e=new Ht,t=new cn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){vl.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=o[l],d=r[l];u!==0&&(zu.fromBufferAttribute(d,e),a?vl.addScaledVector(zu,u):vl.addScaledVector(zu.sub(t),u))}t.add(vl)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),gl.copy(n.boundingSphere),gl.applyMatrix4(r),Os.copy(e.ray).recast(e.near),!(gl.containsPoint(Os.origin)===!1&&(Os.intersectSphere(gl,tm)===null||Os.origin.distanceToSquared(tm)>(e.far-e.near)**2))&&(em.copy(r).invert(),Os.copy(e.ray).applyMatrix4(em),!(n.boundingBox!==null&&Os.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Os)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,f=r.groups,h=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=f.length;m<x;m++){let p=f[m],g=a[p.materialIndex],y=Math.max(p.start,h.start),M=Math.min(o.count,Math.min(p.start+p.count,h.start+h.count));for(let _=y,b=M;_<b;_+=3){let S=o.getX(_),R=o.getX(_+1),v=o.getX(_+2);s=bl(this,g,e,n,c,u,d,S,R,v),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let m=Math.max(0,h.start),x=Math.min(o.count,h.start+h.count);for(let p=m,g=x;p<g;p+=3){let y=o.getX(p),M=o.getX(p+1),_=o.getX(p+2);s=bl(this,a,e,n,c,u,d,y,M,_),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=f.length;m<x;m++){let p=f[m],g=a[p.materialIndex],y=Math.max(p.start,h.start),M=Math.min(l.count,Math.min(p.start+p.count,h.start+h.count));for(let _=y,b=M;_<b;_+=3){let S=_,R=_+1,v=_+2;s=bl(this,g,e,n,c,u,d,S,R,v),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let m=Math.max(0,h.start),x=Math.min(l.count,h.start+h.count);for(let p=m,g=x;p<g;p+=3){let y=p,M=p+1,_=p+2;s=bl(this,a,e,n,c,u,d,y,M,_),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function uy(i,e,t,n,s,r,a,o){let l;if(e.side===Pn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Ai,o),l===null)return null;Ml.copy(o),Ml.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Ml);return c<t.near||c>t.far?null:{distance:c,point:Ml.clone(),object:i}}function bl(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,xl),i.getVertexPosition(l,yl),i.getVertexPosition(c,_l);let u=uy(i,e,t,n,xl,yl,_l,nm);if(u){let d=new P;Xi.getBarycoord(nm,xl,yl,_l,d),s&&(u.uv=Xi.getInterpolatedAttribute(s,o,l,c,d,new de)),r&&(u.uv1=Xi.getInterpolatedAttribute(r,o,l,c,d,new de)),a&&(u.normal=Xi.getInterpolatedAttribute(a,o,l,c,d,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let f={a:o,b:l,c,normal:new P,materialIndex:0};Xi.getNormal(xl,yl,_l,f.normal),u.face=f,u.barycoord=d}return u}var Sa=new Et,im=new Et,sm=new Et,dy=new Et,rm=new Xe,Sl=new P,Gu=new Un,am=new Xe,Vu=new Xs,ka=class extends I{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Zu,this.bindMatrix=new Xe,this.bindMatrixInverse=new Xe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Wn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Sl),this.boundingBox.expandByPoint(Sl)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Un),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Sl),this.boundingSphere.expandByPoint(Sl)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Gu.copy(this.boundingSphere),Gu.applyMatrix4(s),e.ray.intersectsSphere(Gu)!==!1&&(am.copy(s).invert(),Vu.copy(e.ray).applyMatrix4(am),!(this.boundingBox!==null&&Vu.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Vu)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Et,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Zu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===qm?this.bindMatrixInverse.copy(this.bindMatrix).invert():ke("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;im.fromBufferAttribute(s.attributes.skinIndex,e),sm.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Sa.copy(t),t.set(0,0,0,0)):(Sa.set(...t,1),t.set(0,0,0)),Sa.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let a=sm.getComponent(r);if(a!==0){let o=im.getComponent(r);rm.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(dy.copy(Sa).applyMatrix4(rm),a)}}return t.isVector4&&(t.w=Sa.w),t.applyMatrix4(this.bindMatrixInverse)}},Or=class extends Dt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Si=class extends ln{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Vt,u=Vt,d,f){super(null,a,o,l,c,u,s,r,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},om=new Xe,fy=new Xe,Ha=class i{constructor(e=[],t=[]){this.uuid=hi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){ke("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Xe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Xe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:fy;om.multiplyMatrices(o,t[r]),om.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Si(t,e,e,In,qn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],a=t[r];a===void 0&&(ke("Skeleton: No bone found with UUID:",r),a=new Or),this.bones.push(a),this.boneInverses.push(new Xe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let a=t[s];e.bones.push(a.uuid);let o=n[s];e.boneInverses.push(o.toArray())}return e}},Ki=class extends rn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},wr=new Xe,lm=new Xe,El=[],cm=new Wn,py=new Xe,Ea=new I,wa=new Un,za=class extends I{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ki(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,py)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Wn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,wr),cm.copy(e.boundingBox).applyMatrix4(wr),this.boundingBox.union(cm)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Un),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,wr),wa.copy(e.boundingSphere).applyMatrix4(wr),this.boundingSphere.union(wa)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Ea.geometry=this.geometry,Ea.material=this.material,Ea.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wa.copy(this.boundingSphere),wa.applyMatrix4(n),e.ray.intersectsSphere(wa)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,wr),lm.multiplyMatrices(n,wr),Ea.matrixWorld=lm,Ea.raycast(e,El);for(let a=0,o=El.length;a<o;a++){let l=El[a];l.instanceId=r,l.object=this,t.push(l)}El.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ki(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Si(new Float32Array(s*this.count),s,this.count,vc,qn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Bs=new Un,my=new de(.5,.5),wl=new P,Br=class{constructor(e=new oi,t=new oi,n=new oi,s=new oi,r=new oi,a=new oi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ci,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],d=r[5],f=r[6],h=r[7],m=r[8],x=r[9],p=r[10],g=r[11],y=r[12],M=r[13],_=r[14],b=r[15];if(s[0].setComponents(c-a,h-u,g-m,b-y).normalize(),s[1].setComponents(c+a,h+u,g+m,b+y).normalize(),s[2].setComponents(c+o,h+d,g+x,b+M).normalize(),s[3].setComponents(c-o,h-d,g-x,b-M).normalize(),n)s[4].setComponents(l,f,p,_).normalize(),s[5].setComponents(c-l,h-f,g-p,b-_).normalize();else if(s[4].setComponents(c-l,h-f,g-p,b-_).normalize(),t===ci)s[5].setComponents(c+l,h+f,g+p,b+_).normalize();else if(t===Lr)s[5].setComponents(l,f,p,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Bs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Bs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Bs)}intersectsSprite(e){Bs.center.set(0,0,0);let t=my.distanceTo(e.center);return Bs.radius=.7071067811865476+t,Bs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Bs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(wl.x=s.normal.x>0?e.max.x:e.min.x,wl.y=s.normal.y>0?e.max.y:e.min.y,wl.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(wl)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var kr=class extends Sn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Pe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Xl=new P,ql=new P,hm=new Xe,Ta=new Xs,Tl=new Un,Wu=new P,um=new P,qs=class extends Dt{constructor(e=new Ht,t=new kr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Xl.fromBufferAttribute(t,s-1),ql.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Xl.distanceTo(ql);e.setAttribute("lineDistance",new pt(n,1))}else ke("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Tl.copy(n.boundingSphere),Tl.applyMatrix4(s),Tl.radius+=r,e.ray.intersectsSphere(Tl)===!1)return;hm.copy(s).invert(),Ta.copy(e.ray).applyMatrix4(hm);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,f=n.attributes.position;if(u!==null){let h=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let x=h,p=m-1;x<p;x+=c){let g=u.getX(x),y=u.getX(x+1),M=Rl(this,e,Ta,l,g,y,x);M&&t.push(M)}if(this.isLineLoop){let x=u.getX(m-1),p=u.getX(h),g=Rl(this,e,Ta,l,x,p,m-1);g&&t.push(g)}}else{let h=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let x=h,p=m-1;x<p;x+=c){let g=Rl(this,e,Ta,l,x,x+1,x);g&&t.push(g)}if(this.isLineLoop){let x=Rl(this,e,Ta,l,m-1,h,m-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Rl(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(Xl.fromBufferAttribute(o,s),ql.fromBufferAttribute(o,r),t.distanceSqToSegment(Xl,ql,Wu,um)>n)return;Wu.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Wu);if(!(c<e.near||c>e.far))return{distance:c,point:um.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var dm=new P,fm=new P,Ga=class extends qs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)dm.fromBufferAttribute(t,s),fm.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+dm.distanceTo(fm);e.setAttribute("lineDistance",new pt(n,1))}else ke("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Va=class extends qs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Hr=class extends Sn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},pm=new Xe,td=new Xs,Al=new Un,Cl=new P,Wa=class extends Dt{constructor(e=new Ht,t=new Hr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Al.copy(n.boundingSphere),Al.applyMatrix4(s),Al.radius+=r,e.ray.intersectsSphere(Al)===!1)return;pm.copy(s).invert(),td.copy(e.ray).applyMatrix4(pm);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){let f=Math.max(0,a.start),h=Math.min(c.count,a.start+a.count);for(let m=f,x=h;m<x;m++){let p=c.getX(m);Cl.fromBufferAttribute(d,p),mm(Cl,p,l,s,e,t,this)}}else{let f=Math.max(0,a.start),h=Math.min(d.count,a.start+a.count);for(let m=f,x=h;m<x;m++)Cl.fromBufferAttribute(d,m),mm(Cl,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function mm(i,e,t,n,s,r,a){let o=td.distanceSqToPoint(i);if(o<t){let l=new P;td.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Xa=class extends ln{constructor(e=[],t=Ss,n,s,r,a,o,l,c,u){super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},pn=class extends ln{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ei=class extends ln{constructor(e,t,n=fi,s,r,a,o=Vt,l=Vt,c,u=Mi,d=1){if(u!==Mi&&u!==Ci)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:d};super(f,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ur(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Yl=class extends Ei{constructor(e,t=fi,n=Ss,s,r,a=Vt,o=Vt,l,c=Mi){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},qa=class extends ln{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},se=class i extends Ht{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],u=[],d=[],f=0,h=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new pt(c,3)),this.setAttribute("normal",new pt(u,3)),this.setAttribute("uv",new pt(d,2));function m(x,p,g,y,M,_,b,S,R,v,w){let A=_/R,L=b/v,D=_/2,H=b/2,N=S/2,z=R+1,V=v+1,J=0,ae=0,Y=new P;for(let B=0;B<V;B++){let re=B*L-H;for(let Ee=0;Ee<z;Ee++){let Te=Ee*A-D;Y[x]=Te*y,Y[p]=re*M,Y[g]=N,c.push(Y.x,Y.y,Y.z),Y[x]=0,Y[p]=0,Y[g]=S>0?1:-1,u.push(Y.x,Y.y,Y.z),d.push(Ee/R),d.push(1-B/v),J+=1}}for(let B=0;B<v;B++)for(let re=0;re<R;re++){let Ee=f+re+z*B,Te=f+re+z*(B+1),ht=f+(re+1)+z*(B+1),Ze=f+(re+1)+z*B;l.push(Ee,Te,Ze),l.push(Te,ht,Ze),ae+=6}o.addGroup(h,ae,w),h+=ae,f+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},Xn=class i extends Ht{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let a=[],o=[],l=[],c=[],u=t/2,d=Math.PI/2*e,f=t,h=2*d+f,m=n*2+r,x=s+1,p=new P,g=new P;for(let y=0;y<=m;y++){let M=0,_=0,b=0,S=0;if(y<=n){let w=y/n,A=w*Math.PI/2;_=-u-e*Math.cos(A),b=e*Math.sin(A),S=-e*Math.cos(A),M=w*d}else if(y<=n+r){let w=(y-n)/r;_=-u+w*t,b=e,S=0,M=d+w*f}else{let w=(y-n-r)/n,A=w*Math.PI/2;_=u+e*Math.sin(A),b=e*Math.cos(A),S=e*Math.sin(A),M=d+f+w*d}let R=Math.max(0,Math.min(1,M/h)),v=0;y===0?v=.5/s:y===m&&(v=-.5/s);for(let w=0;w<=s;w++){let A=w/s,L=A*Math.PI*2,D=Math.sin(L),H=Math.cos(L);g.x=-b*H,g.y=_,g.z=b*D,o.push(g.x,g.y,g.z),p.set(-b*H,S,b*D),p.normalize(),l.push(p.x,p.y,p.z),c.push(A+v,R)}if(y>0){let w=(y-1)*x;for(let A=0;A<s;A++){let L=w+A,D=w+A+1,H=y*x+A,N=y*x+A+1;a.push(L,D,H),a.push(D,N,H)}}}this.setIndex(a),this.setAttribute("position",new pt(o,3)),this.setAttribute("normal",new pt(l,3)),this.setAttribute("uv",new pt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}};var qe=class i extends Ht{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],d=[],f=[],h=[],m=0,x=[],p=n/2,g=0;y(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new pt(d,3)),this.setAttribute("normal",new pt(f,3)),this.setAttribute("uv",new pt(h,2));function y(){let _=new P,b=new P,S=0,R=(t-e)/n;for(let v=0;v<=r;v++){let w=[],A=v/r,L=A*(t-e)+e;for(let D=0;D<=s;D++){let H=D/s,N=H*l+o,z=Math.sin(N),V=Math.cos(N);b.x=L*z,b.y=-A*n+p,b.z=L*V,d.push(b.x,b.y,b.z),_.set(z,R,V).normalize(),f.push(_.x,_.y,_.z),h.push(H,1-A),w.push(m++)}x.push(w)}for(let v=0;v<s;v++)for(let w=0;w<r;w++){let A=x[w][v],L=x[w+1][v],D=x[w+1][v+1],H=x[w][v+1];(e>0||w!==0)&&(u.push(A,L,H),S+=3),(t>0||w!==r-1)&&(u.push(L,D,H),S+=3)}c.addGroup(g,S,0),g+=S}function M(_){let b=m,S=new de,R=new P,v=0,w=_===!0?e:t,A=_===!0?1:-1;for(let D=1;D<=s;D++)d.push(0,p*A,0),f.push(0,A,0),h.push(.5,.5),m++;let L=m;for(let D=0;D<=s;D++){let N=D/s*l+o,z=Math.cos(N),V=Math.sin(N);R.x=w*V,R.y=p*A,R.z=w*z,d.push(R.x,R.y,R.z),f.push(0,A,0),S.x=z*.5+.5,S.y=V*.5*A+.5,h.push(S.x,S.y),m++}for(let D=0;D<s;D++){let H=b+D,N=L+D;_===!0?u.push(N,N+1,H):u.push(N+1,N,H),v+=3}c.addGroup(g,v,_===!0?1:2),g+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},$i=class i extends qe{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Kl=class i extends Ht{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),u(),this.setAttribute("position",new pt(r,3)),this.setAttribute("normal",new pt(r.slice(),3)),this.setAttribute("uv",new pt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){let M=new P,_=new P,b=new P;for(let S=0;S<t.length;S+=3)h(t[S+0],M),h(t[S+1],_),h(t[S+2],b),l(M,_,b,y)}function l(y,M,_,b){let S=b+1,R=[];for(let v=0;v<=S;v++){R[v]=[];let w=y.clone().lerp(_,v/S),A=M.clone().lerp(_,v/S),L=S-v;for(let D=0;D<=L;D++)D===0&&v===S?R[v][D]=w:R[v][D]=w.clone().lerp(A,D/L)}for(let v=0;v<S;v++)for(let w=0;w<2*(S-v)-1;w++){let A=Math.floor(w/2);w%2===0?(f(R[v][A+1]),f(R[v+1][A]),f(R[v][A])):(f(R[v][A+1]),f(R[v+1][A+1]),f(R[v+1][A]))}}function c(y){let M=new P;for(let _=0;_<r.length;_+=3)M.x=r[_+0],M.y=r[_+1],M.z=r[_+2],M.normalize().multiplyScalar(y),r[_+0]=M.x,r[_+1]=M.y,r[_+2]=M.z}function u(){let y=new P;for(let M=0;M<r.length;M+=3){y.x=r[M+0],y.y=r[M+1],y.z=r[M+2];let _=p(y)/2/Math.PI+.5,b=g(y)/Math.PI+.5;a.push(_,1-b)}m(),d()}function d(){for(let y=0;y<a.length;y+=6){let M=a[y+0],_=a[y+2],b=a[y+4],S=Math.max(M,_,b),R=Math.min(M,_,b);S>.9&&R<.1&&(M<.2&&(a[y+0]+=1),_<.2&&(a[y+2]+=1),b<.2&&(a[y+4]+=1))}}function f(y){r.push(y.x,y.y,y.z)}function h(y,M){let _=y*3;M.x=e[_+0],M.y=e[_+1],M.z=e[_+2]}function m(){let y=new P,M=new P,_=new P,b=new P,S=new de,R=new de,v=new de;for(let w=0,A=0;w<r.length;w+=9,A+=6){y.set(r[w+0],r[w+1],r[w+2]),M.set(r[w+3],r[w+4],r[w+5]),_.set(r[w+6],r[w+7],r[w+8]),S.set(a[A+0],a[A+1]),R.set(a[A+2],a[A+3]),v.set(a[A+4],a[A+5]),b.copy(y).add(M).add(_).divideScalar(3);let L=p(b);x(S,A+0,y,L),x(R,A+2,M,L),x(v,A+4,_,L)}}function x(y,M,_,b){b<0&&y.x===1&&(a[M]=y.x-1),_.x===0&&_.z===0&&(a[M]=b/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function g(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var Jn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ke("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let u=n[s],f=n[s+1]-u,h=(a-u)/f;return(s+h)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new de:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new P,s=[],r=[],a=[],o=new P,l=new Xe;for(let h=0;h<=e;h++){let m=h/e;s[h]=this.getTangentAt(m,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE,u=Math.abs(s[0].x),d=Math.abs(s[0].y),f=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),f<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let h=1;h<=e;h++){if(r[h]=r[h-1].clone(),a[h]=a[h-1].clone(),o.crossVectors(s[h-1],s[h]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(st(s[h-1].dot(s[h]),-1,1));r[h].applyMatrix4(l.makeRotationAxis(o,m))}a[h].crossVectors(s[h],r[h])}if(t===!0){let h=Math.acos(st(r[0].dot(r[e]),-1,1));h/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(h=-h);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],h*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ya=class extends Jn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new de){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=l-this.aX,h=c-this.aY;l=f*u-h*d+this.aX,c=f*d+h*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},$l=class extends Ya{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Td(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,d){let f=(a-r)/c-(o-r)/(c+u)+(o-a)/u,h=(o-a)/u-(l-a)/(u+d)+(l-o)/d;f*=u,h*=u,s(a,o,f,h)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var gm=new P,xm=new P,Xu=new Td,qu=new Td,Yu=new Td,zr=class extends Jn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(xm.subVectors(s[0],s[1]).add(s[0]),c=xm);let d=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(gm.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=gm),this.curveType==="centripetal"||this.curveType==="chordal"){let h=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(d),h),x=Math.pow(d.distanceToSquared(f),h),p=Math.pow(f.distanceToSquared(u),h);x<1e-4&&(x=1),m<1e-4&&(m=x),p<1e-4&&(p=x),Xu.initNonuniformCatmullRom(c.x,d.x,f.x,u.x,m,x,p),qu.initNonuniformCatmullRom(c.y,d.y,f.y,u.y,m,x,p),Yu.initNonuniformCatmullRom(c.z,d.z,f.z,u.z,m,x,p)}else this.curveType==="catmullrom"&&(Xu.initCatmullRom(c.x,d.x,f.x,u.x,this.tension),qu.initCatmullRom(c.y,d.y,f.y,u.y,this.tension),Yu.initCatmullRom(c.z,d.z,f.z,u.z,this.tension));return n.set(Xu.calc(l),qu.calc(l),Yu.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function ym(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function gy(i,e){let t=1-i;return t*t*e}function xy(i,e){return 2*(1-i)*i*e}function yy(i,e){return i*i*e}function Ca(i,e,t,n){return gy(i,e)+xy(i,t)+yy(i,n)}function _y(i,e){let t=1-i;return t*t*t*e}function vy(i,e){let t=1-i;return 3*t*t*i*e}function My(i,e){return 3*(1-i)*i*i*e}function by(i,e){return i*i*i*e}function Pa(i,e,t,n,s){return _y(i,e)+vy(i,t)+My(i,n)+by(i,s)}var Zl=class extends Jn{constructor(e=new de,t=new de,n=new de,s=new de){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new de){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Pa(e,s.x,r.x,a.x,o.x),Pa(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},jl=class extends Jn{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Pa(e,s.x,r.x,a.x,o.x),Pa(e,s.y,r.y,a.y,o.y),Pa(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Jl=class extends Jn{constructor(e=new de,t=new de){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new de){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new de){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ql=class extends Jn{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ec=class extends Jn{constructor(e=new de,t=new de,n=new de){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new de){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Ca(e,s.x,r.x,a.x),Ca(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ka=class extends Jn{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Ca(e,s.x,r.x,a.x),Ca(e,s.y,r.y,a.y),Ca(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},tc=class extends Jn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new de){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(ym(o,l.x,c.x,u.x,d.x),ym(o,l.y,c.y,u.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new de().fromArray(s))}return this}},Sy=Object.freeze({__proto__:null,ArcCurve:$l,CatmullRomCurve3:zr,CubicBezierCurve:Zl,CubicBezierCurve3:jl,EllipseCurve:Ya,LineCurve:Jl,LineCurve3:Ql,QuadraticBezierCurve:ec,QuadraticBezierCurve3:Ka,SplineCurve:tc});var Gr=class i extends Kl{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var rt=class i extends Ht{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,d=e/o,f=t/l,h=[],m=[],x=[],p=[];for(let g=0;g<u;g++){let y=g*f-a;for(let M=0;M<c;M++){let _=M*d-r;m.push(_,-y,0),x.push(0,0,1),p.push(M/o),p.push(1-g/l)}}for(let g=0;g<l;g++)for(let y=0;y<o;y++){let M=y+c*g,_=y+c*(g+1),b=y+1+c*(g+1),S=y+1+c*g;h.push(M,_,S),h.push(_,b,S)}this.setIndex(h),this.setAttribute("position",new pt(m,3)),this.setAttribute("normal",new pt(x,3)),this.setAttribute("uv",new pt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var mn=class i extends Ht{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,u=[],d=new P,f=new P,h=[],m=[],x=[],p=[];for(let g=0;g<=n;g++){let y=[],M=g/n,_=a+M*o,b=e*Math.cos(_),S=Math.sqrt(e*e-b*b),R=0;g===0&&a===0?R=.5/t:g===n&&l===Math.PI&&(R=-.5/t);for(let v=0;v<=t;v++){let w=v/t,A=s+w*r;d.x=-S*Math.cos(A),d.y=b,d.z=S*Math.sin(A),m.push(d.x,d.y,d.z),f.copy(d).normalize(),x.push(f.x,f.y,f.z),p.push(w+R,1-M),y.push(c++)}u.push(y)}for(let g=0;g<n;g++)for(let y=0;y<t;y++){let M=u[g][y+1],_=u[g][y],b=u[g+1][y],S=u[g+1][y+1];(g!==0||a>0)&&h.push(M,_,S),(g!==n-1||l<Math.PI)&&h.push(_,b,S)}this.setIndex(h),this.setAttribute("position",new pt(m,3)),this.setAttribute("normal",new pt(x,3)),this.setAttribute("uv",new pt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var $a=class i extends Ht{constructor(e=new Ka(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new P,l=new P,c=new de,u=new P,d=[],f=[],h=[],m=[];x(),this.setIndex(m),this.setAttribute("position",new pt(d,3)),this.setAttribute("normal",new pt(f,3)),this.setAttribute("uv",new pt(h,2));function x(){for(let M=0;M<t;M++)p(M);p(r===!1?t:0),y(),g()}function p(M){u=e.getPointAt(M/t,u);let _=a.normals[M],b=a.binormals[M];for(let S=0;S<=s;S++){let R=S/s*Math.PI*2,v=Math.sin(R),w=-Math.cos(R);l.x=w*_.x+v*b.x,l.y=w*_.y+v*b.y,l.z=w*_.z+v*b.z,l.normalize(),f.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,d.push(o.x,o.y,o.z)}}function g(){for(let M=1;M<=t;M++)for(let _=1;_<=s;_++){let b=(s+1)*(M-1)+(_-1),S=(s+1)*M+(_-1),R=(s+1)*M+_,v=(s+1)*(M-1)+_;m.push(b,S,v),m.push(S,R,v)}}function y(){for(let M=0;M<=t;M++)for(let _=0;_<=s;_++)c.x=M/t,c.y=_/s,h.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new Sy[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function er(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(_m(s))s.isRenderTargetTexture?(ke("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(_m(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function wn(i){let e={};for(let t=0;t<i.length;t++){let n=er(i[t]);for(let s in n)e[s]=n[s]}return e}function _m(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Ey(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Rd(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}var Ln={clone:er,merge:wn},wy=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ty=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Nt=class extends Sn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wy,this.fragmentShader=Ty,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=er(e.uniforms),this.uniformsGroups=Ey(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Pe().setHex(s.value);break;case"v2":this.uniforms[n].value=new de().fromArray(s.value);break;case"v3":this.uniforms[n].value=new P().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Et().fromArray(s.value);break;case"m3":this.uniforms[n].value=new $e().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Xe().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Vr=class extends Nt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},he=class extends Sn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Pe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Eo,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Fn=class extends he{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new de(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return st(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Pe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Pe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Pe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Za=class extends Sn{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Eo,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}};var nc=class extends Sn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Km,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ic=class extends Sn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ys(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Nl(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function Ry(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function vm(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=i[o+l]}return s}function Ay(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}var wi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},sc=class extends wi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ju,endingEnd:Ju}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Qu:r=e,o=2*t-n;break;case ed:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Qu:a=e,l=2*n-t;break;case ed:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,h=this._weightNext,m=(n-t)/(s-t),x=m*m,p=x*m,g=-f*p+2*f*x-f*m,y=(1+f)*p+(-1.5-2*f)*x+(-.5+f)*m+1,M=(-1-h)*p+(1.5+h)*x+.5*m,_=h*p-h*x;for(let b=0;b!==o;++b)r[b]=g*a[u+b]+y*a[c+b]+M*a[l+b]+_*a[d+b];return r}},rc=class extends wi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(s-t),d=1-u;for(let f=0;f!==o;++f)r[f]=a[c+f]*d+a[l+f]*u;return r}},ac=class extends wi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},oc=class extends wi{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.inTangents,d=this.outTangents;if(!u||!d){let m=(n-t)/(s-t),x=1-m;for(let p=0;p!==o;++p)r[p]=a[c+p]*x+a[l+p]*m;return r}let f=o*2,h=e-1;for(let m=0;m!==o;++m){let x=a[c+m],p=a[l+m],g=h*f+m*2,y=d[g],M=d[g+1],_=e*f+m*2,b=u[_],S=u[_+1],R=Py(n,t,y,b,s);r[m]=c0(R,x,M,S,p)}return r}};function c0(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Cy(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function Py(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=c0(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=Cy(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var On=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ys(t,this.TimeBufferType),this.values=ys(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ys(e.times,Array),values:ys(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),Nl(e.settings)&&(n.settings={inTangents:ys(e.settings.inTangents,Array),outTangents:ys(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ac(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new rc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new sc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new oc(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Hs:t=this.InterpolantFactoryMethodDiscrete;break;case zs:t=this.InterpolantFactoryMethodLinear;break;case Ll:t=this.InterpolantFactoryMethodSmooth;break;case ju:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ke("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Hs;case this.InterpolantFactoryMethodLinear:return zs;case this.InterpolantFactoryMethodSmooth:return Ll;case this.InterpolantFactoryMethodBezier:return ju}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;Nl(this.settings)&&(Mm(this.settings.inTangents,e),Mm(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ye("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ye("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Ye("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ye("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Lx(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Ye("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ll,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(s)l=!0;else{let d=o*n,f=d-n,h=d+n;for(let m=0;m!==n;++m){let x=t[d+m];if(x!==t[f+m]||x!==t[h+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,f=a*n;for(let h=0;h!==n;++h)t[f+h]=t[d+h]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,Nl(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Mm(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}On.prototype.ValueTypeName="";On.prototype.TimeBufferType=Float32Array;On.prototype.ValueBufferType=Float32Array;On.prototype.DefaultInterpolation=zs;var Zi=class extends On{constructor(e,t,n){super(e,t,n)}};Zi.prototype.ValueTypeName="bool";Zi.prototype.ValueBufferType=Array;Zi.prototype.DefaultInterpolation=Hs;Zi.prototype.InterpolantFactoryMethodLinear=void 0;Zi.prototype.InterpolantFactoryMethodSmooth=void 0;var ja=class extends On{constructor(e,t,n,s){super(e,t,n,s)}};ja.prototype.ValueTypeName="color";var ji=class extends On{constructor(e,t,n,s){super(e,t,n,s)}};ji.prototype.ValueTypeName="number";var lc=class extends wi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let u=c+o;c!==u;c+=4)Vn.slerpFlat(r,0,a,c-o,a,c,l);return r}},Ji=class extends On{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new lc(this.times,this.values,this.getValueSize(),e)}};Ji.prototype.ValueTypeName="quaternion";Ji.prototype.InterpolantFactoryMethodSmooth=void 0;var Qi=class extends On{constructor(e,t,n){super(e,t,n)}};Qi.prototype.ValueTypeName="string";Qi.prototype.ValueBufferType=Array;Qi.prototype.DefaultInterpolation=Hs;Qi.prototype.InterpolantFactoryMethodLinear=void 0;Qi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ms=class extends On{constructor(e,t,n,s){super(e,t,n,s)}};Ms.prototype.ValueTypeName="vector";var Ja=class{constructor(e="",t=-1,n=[],s=Ym){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=hi(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Ly(n[a]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(On.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);let u=Ry(l);l=vm(l,1,u),c=vm(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new ji(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],u=c.name.match(r);if(u&&u.length>1){let d=u[1],f=s[d];f||(s[d]=f=[]),f.push(c)}}let a=[];for(let o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Iy(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ji;case"vector":case"vector2":case"vector3":case"vector4":return Ms;case"color":return ja;case"quaternion":return Ji;case"bool":case"boolean":return Zi;case"string":return Qi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Ly(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Iy(i.type);if(i.times===void 0){let n=[],s=[];Ay(i.keys,n,s,"value"),i.times=n,i.values=s}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),Nl(i.settings)&&(t.settings={inTangents:ys(i.settings.inTangents,Float32Array),outTangents:ys(i.settings.outTangents,Float32Array)}),t}var vi={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(bm(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!bm(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function bm(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var cc=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,f=c.length;d<f;d+=2){let h=c[d],m=c[d+1];if(h.global&&(h.lastIndex=0),h.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},h0=new cc,Ti=class{constructor(e){this.manager=e!==void 0?e:h0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Ti.DEFAULT_MATERIAL_NAME="__DEFAULT";var Wi={},nd=class extends Error{constructor(e,t){super(e),this.response=t}},Wr=class extends Ti{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=vi.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Wi[e]!==void 0){Wi[e].push({onLoad:t,onProgress:n,onError:s});return}Wi[e]=[],Wi[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&ke("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=Wi[e],d=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),h=f?parseInt(f):0,m=h!==0,x=0,p=new ReadableStream({start(g){y();function y(){d.read().then(({done:M,value:_})=>{if(M)g.close();else{x+=_.byteLength;let b=new ProgressEvent("progress",{lengthComputable:m,loaded:x,total:h});for(let S=0,R=u.length;S<R;S++){let v=u[S];v.onProgress&&v.onProgress(b)}g.enqueue(_),y()}},M=>{g.error(M)})}}});return new Response(p)}else throw new nd(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(o),f=d&&d[1]?d[1].toLowerCase():void 0,h=new TextDecoder(f);return c.arrayBuffer().then(m=>h.decode(m))}}}).then(c=>{vi.add(`file:${e}`,c);let u=Wi[e];delete Wi[e];for(let d=0,f=u.length;d<f;d++){let h=u[d];h.onLoad&&h.onLoad(c)}}).catch(c=>{let u=Wi[e];if(u===void 0)throw this.manager.itemError(e),c;delete Wi[e];for(let d=0,f=u.length;d<f;d++){let h=u[d];h.onError&&h.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Tr=new WeakMap,hc=class extends Ti{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=vi.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let d=Tr.get(a);d===void 0&&(d=[],Tr.set(a,d)),d.push({onLoad:t,onError:s})}return a}let o=Dr("img");function l(){u(),t&&t(this);let d=Tr.get(this)||[];for(let f=0;f<d.length;f++){let h=d[f];h.onLoad&&h.onLoad(this)}Tr.delete(this),r.manager.itemEnd(e)}function c(d){u(),s&&s(d),vi.remove(`image:${e}`);let f=Tr.get(this)||[];for(let h=0;h<f.length;h++){let m=f[h];m.onError&&m.onError(d)}Tr.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),vi.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}};var Qa=class extends Ti{constructor(e){super(e)}load(e,t,n,s){let r=new ln,a=new hc(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},bs=class extends Dt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},eo=class extends bs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Ku=new Xe,Sm=new P,Em=new P,Xr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new de(512,512),this.mapType=En,this.map=null,this.mapPass=null,this.matrix=new Xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Br,this._frameExtents=new de(1,1),this._viewportCount=1,this._viewports=[new Et(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Sm.setFromMatrixPosition(e.matrixWorld),t.position.copy(Sm),Em.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Em),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Ku.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Ku,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Lr||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ku)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Pl=new P,Il=new Vn,_i=new P,to=class extends Dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=ci,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Pl,Il,_i),_i.x===1&&_i.y===1&&_i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pl,Il,_i.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Pl,Il,_i),_i.x===1&&_i.y===1&&_i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pl,Il,_i.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},xs=new P,wm=new de,Tm=new de,sn=class extends to{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Gs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ra*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Gs*2*Math.atan(Math.tan(Ra*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){xs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(xs.x,xs.y).multiplyScalar(-e/xs.z),xs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(xs.x,xs.y).multiplyScalar(-e/xs.z)}getViewSize(e,t){return this.getViewBounds(e,wm,Tm),t.subVectors(Tm,wm)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ra*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},id=class extends Xr{constructor(){super(new sn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Gs*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},no=class extends bs{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.target=new Dt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new id}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},sd=class extends Xr{constructor(){super(new sn(90,1,.5,500)),this.isPointLightShadow=!0}},Ys=class extends bs{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new sd}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Ri=class extends to{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},rd=class extends Xr{constructor(){super(new Ri(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ks=class extends bs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.target=new Dt,this.shadow=new rd}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},io=class extends bs{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var es=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var $u=new WeakMap,so=class extends Ti{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&ke("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&ke("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=vi.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{$u.has(a)===!0?(s&&s($u.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return vi.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),$u.set(l,c),vi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});vi.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Rr=-90,Ar=1,uc=class extends Dt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new sn(Rr,Ar,e,t);s.layers=this.layers,this.add(s);let r=new sn(Rr,Ar,e,t);r.layers=this.layers,this.add(r);let a=new sn(Rr,Ar,e,t);a.layers=this.layers,this.add(a);let o=new sn(Rr,Ar,e,t);o.layers=this.layers,this.add(o);let l=new sn(Rr,Ar,e,t);l.layers=this.layers,this.add(l);let c=new sn(Rr,Ar,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===ci)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Lr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,f,h),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},dc=class extends sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ro=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Dy.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Dy(){this._document.hidden===!1&&this.reset()}var Ad="\\[\\]\\.:\\/",Ny=new RegExp("["+Ad+"]","g"),Cd="[^"+Ad+"]",Uy="[^"+Ad.replace("\\.","")+"]",Fy=/((?:WC+[\/:])*)/.source.replace("WC",Cd),Oy=/(WCOD+)?/.source.replace("WCOD",Uy),By=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Cd),ky=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Cd),Hy=new RegExp("^"+Fy+Oy+By+ky+"$"),zy=["material","materials","bones","map"],ad=class{constructor(e,t,n){let s=n||Lt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Lt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Ny,"")}static parseTrackName(e){let t=Hy.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);zy.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){ke("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ye("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ye("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ye("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ye("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ye("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ye("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ye("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Ye("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ye("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ye("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Lt.Composite=ad;Lt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Lt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Lt.prototype.GetterByBindingType=[Lt.prototype._getValue_direct,Lt.prototype._getValue_array,Lt.prototype._getValue_arrayElement,Lt.prototype._getValue_toArray];Lt.prototype.SetterByBindingTypeAndVersioning=[[Lt.prototype._setValue_direct,Lt.prototype._setValue_direct_setNeedsUpdate,Lt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_array,Lt.prototype._setValue_array_setNeedsUpdate,Lt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_arrayElement,Lt.prototype._setValue_arrayElement_setNeedsUpdate,Lt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_fromArray,Lt.prototype._setValue_fromArray_setNeedsUpdate,Lt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var CE=new Float32Array(1);var Ud=class Ud{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};Ud.prototype.isMatrix2=!0;var od=Ud;function Pd(i,e,t,n){let s=Gy(n);switch(t){case _d:return i*e;case vc:return i*e/s.components*s.byteLength;case Mc:return i*e/s.components*s.byteLength;case ws:return i*e*2/s.components*s.byteLength;case bc:return i*e*2/s.components*s.byteLength;case vd:return i*e*3/s.components*s.byteLength;case In:return i*e*4/s.components*s.byteLength;case Sc:return i*e*4/s.components*s.byteLength;case xo:case yo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case _o:case vo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case wc:case Rc:return Math.max(i,16)*Math.max(e,8)/4;case Ec:case Tc:return Math.max(i,8)*Math.max(e,8)/2;case Ac:case Cc:case Ic:case Lc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Pc:case Mo:case Dc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Nc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Uc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Fc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Oc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Bc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case kc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Hc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case zc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Gc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Vc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Wc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Xc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case qc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Yc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Kc:case $c:case Zc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case jc:case Jc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case bo:case Qc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Gy(i){switch(i){case En:case md:return{byteLength:1,components:1};case Zr:case gd:case an:return{byteLength:2,components:1};case yc:case _c:return{byteLength:2,components:4};case fi:case xc:case qn:return{byteLength:4,components:1};case xd:case yd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?ke("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function L0(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Wy(i){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,d=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),o.onUploadCallback();let h;if(c instanceof Float32Array)h=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)h=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?h=i.HALF_FLOAT:h=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)h=i.SHORT;else if(c instanceof Uint32Array)h=i.UNSIGNED_INT;else if(c instanceof Int32Array)h=i.INT;else if(c instanceof Int8Array)h=i.BYTE;else if(c instanceof Uint8Array)h=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)h=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:h,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let u=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,u);else{d.sort((h,m)=>h.start-m.start);let f=0;for(let h=1;h<d.length;h++){let m=d[f],x=d[h];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++f,d[f]=x)}d.length=f+1;for(let h=0,m=d.length;h<m;h++){let x=d[h];i.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Xy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,qy=`#ifdef USE_ALPHAHASH
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
#endif`,Yy=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ky=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$y=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jy=`#ifdef USE_AOMAP
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
#endif`,Jy=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Qy=`#ifdef USE_BATCHING
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
#endif`,e_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,t_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,n_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,i_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,s_=`#ifdef USE_IRIDESCENCE
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
#endif`,r_=`#ifdef USE_BUMPMAP
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
#endif`,a_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,o_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,l_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,c_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,h_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,u_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,d_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,f_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,p_=`#define PI 3.141592653589793
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
} // validated`,m_=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,g_=`vec3 transformedNormal = objectNormal;
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
#endif`,x_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,y_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,__=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,v_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,M_="gl_FragColor = linearToOutputTexel( gl_FragColor );",b_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,S_=`#ifdef USE_ENVMAP
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
#endif`,E_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,w_=`#ifdef USE_ENVMAP
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
#endif`,T_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,R_=`#ifdef USE_ENVMAP
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
#endif`,A_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,C_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,P_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,I_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,L_=`#ifdef USE_GRADIENTMAP
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
}`,D_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,N_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,U_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,F_=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,O_=`#ifdef USE_ENVMAP
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
#endif`,B_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,k_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,H_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,z_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,G_=`PhysicalMaterial material;
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
#endif`,V_=`uniform sampler2D dfgLUT;
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
}`,W_=`
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
#endif`,X_=`#if defined( RE_IndirectDiffuse )
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
#endif`,q_=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Y_=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,K_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Z_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,j_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,J_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Q_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ev=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,tv=`#if defined( USE_POINTS_UV )
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
#endif`,nv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,iv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,av=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ov=`#ifdef USE_MORPHTARGETS
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
#endif`,lv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,hv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,uv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,pv=`#ifdef USE_NORMALMAP
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
#endif`,mv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,yv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,_v=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Mv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,bv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ev=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Av=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Cv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Pv=`float getShadowMask() {
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
}`,Iv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Lv=`#ifdef USE_SKINNING
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
#endif`,Dv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nv=`#ifdef USE_SKINNING
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
#endif`,Uv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ov=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,kv=`#ifdef USE_TRANSMISSION
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
#endif`,Hv=`#ifdef USE_TRANSMISSION
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
#endif`,zv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Wv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Xv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,qv=`uniform sampler2D t2D;
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
}`,Yv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kv=`#ifdef ENVMAP_TYPE_CUBE
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
}`,$v=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jv=`#include <common>
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
}`,Jv=`#if DEPTH_PACKING == 3200
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
}`,Qv=`#define DISTANCE
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
}`,eM=`#define DISTANCE
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
}`,tM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,nM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iM=`uniform float scale;
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
}`,sM=`uniform vec3 diffuse;
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
}`,rM=`#include <common>
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
}`,aM=`uniform vec3 diffuse;
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
}`,oM=`#define LAMBERT
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
}`,lM=`#define LAMBERT
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
}`,cM=`#define MATCAP
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
}`,hM=`#define MATCAP
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
}`,uM=`#define NORMAL
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
}`,dM=`#define NORMAL
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
}`,fM=`#define PHONG
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
}`,pM=`#define PHONG
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
}`,mM=`#define STANDARD
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
}`,gM=`#define STANDARD
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
}`,xM=`#define TOON
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
}`,yM=`#define TOON
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
}`,_M=`uniform float size;
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
}`,vM=`uniform vec3 diffuse;
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
}`,MM=`#include <common>
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
}`,bM=`uniform vec3 color;
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
}`,SM=`uniform float rotation;
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
}`,EM=`uniform vec3 diffuse;
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
}`,nt={alphahash_fragment:Xy,alphahash_pars_fragment:qy,alphamap_fragment:Yy,alphamap_pars_fragment:Ky,alphatest_fragment:$y,alphatest_pars_fragment:Zy,aomap_fragment:jy,aomap_pars_fragment:Jy,batching_pars_vertex:Qy,batching_vertex:e_,begin_vertex:t_,beginnormal_vertex:n_,bsdfs:i_,iridescence_fragment:s_,bumpmap_pars_fragment:r_,clipping_planes_fragment:a_,clipping_planes_pars_fragment:o_,clipping_planes_pars_vertex:l_,clipping_planes_vertex:c_,color_fragment:h_,color_pars_fragment:u_,color_pars_vertex:d_,color_vertex:f_,common:p_,cube_uv_reflection_fragment:m_,defaultnormal_vertex:g_,displacementmap_pars_vertex:x_,displacementmap_vertex:y_,emissivemap_fragment:__,emissivemap_pars_fragment:v_,colorspace_fragment:M_,colorspace_pars_fragment:b_,envmap_fragment:S_,envmap_common_pars_fragment:E_,envmap_pars_fragment:w_,envmap_pars_vertex:T_,envmap_physical_pars_fragment:O_,envmap_vertex:R_,fog_vertex:A_,fog_pars_vertex:C_,fog_fragment:P_,fog_pars_fragment:I_,gradientmap_pars_fragment:L_,lightmap_pars_fragment:D_,lights_lambert_fragment:N_,lights_lambert_pars_fragment:U_,lights_pars_begin:F_,lights_toon_fragment:B_,lights_toon_pars_fragment:k_,lights_phong_fragment:H_,lights_phong_pars_fragment:z_,lights_physical_fragment:G_,lights_physical_pars_fragment:V_,lights_fragment_begin:W_,lights_fragment_maps:X_,lights_fragment_end:q_,lightprobes_pars_fragment:Y_,logdepthbuf_fragment:K_,logdepthbuf_pars_fragment:$_,logdepthbuf_pars_vertex:Z_,logdepthbuf_vertex:j_,map_fragment:J_,map_pars_fragment:Q_,map_particle_fragment:ev,map_particle_pars_fragment:tv,metalnessmap_fragment:nv,metalnessmap_pars_fragment:iv,morphinstance_vertex:sv,morphcolor_vertex:rv,morphnormal_vertex:av,morphtarget_pars_vertex:ov,morphtarget_vertex:lv,normal_fragment_begin:cv,normal_fragment_maps:hv,normal_pars_fragment:uv,normal_pars_vertex:dv,normal_vertex:fv,normalmap_pars_fragment:pv,clearcoat_normal_fragment_begin:mv,clearcoat_normal_fragment_maps:gv,clearcoat_pars_fragment:xv,iridescence_pars_fragment:yv,opaque_fragment:_v,packing:vv,premultiplied_alpha_fragment:Mv,project_vertex:bv,dithering_fragment:Sv,dithering_pars_fragment:Ev,roughnessmap_fragment:wv,roughnessmap_pars_fragment:Tv,shadowmap_pars_fragment:Rv,shadowmap_pars_vertex:Av,shadowmap_vertex:Cv,shadowmask_pars_fragment:Pv,skinbase_vertex:Iv,skinning_pars_vertex:Lv,skinning_vertex:Dv,skinnormal_vertex:Nv,specularmap_fragment:Uv,specularmap_pars_fragment:Fv,tonemapping_fragment:Ov,tonemapping_pars_fragment:Bv,transmission_fragment:kv,transmission_pars_fragment:Hv,uv_pars_fragment:zv,uv_pars_vertex:Gv,uv_vertex:Vv,worldpos_vertex:Wv,background_vert:Xv,background_frag:qv,backgroundCube_vert:Yv,backgroundCube_frag:Kv,cube_vert:$v,cube_frag:Zv,depth_vert:jv,depth_frag:Jv,distance_vert:Qv,distance_frag:eM,equirect_vert:tM,equirect_frag:nM,linedashed_vert:iM,linedashed_frag:sM,meshbasic_vert:rM,meshbasic_frag:aM,meshlambert_vert:oM,meshlambert_frag:lM,meshmatcap_vert:cM,meshmatcap_frag:hM,meshnormal_vert:uM,meshnormal_frag:dM,meshphong_vert:fM,meshphong_frag:pM,meshphysical_vert:mM,meshphysical_frag:gM,meshtoon_vert:xM,meshtoon_frag:yM,points_vert:_M,points_frag:vM,shadow_vert:MM,shadow_frag:bM,sprite_vert:SM,sprite_frag:EM},Me={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new de(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new de(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},Ii={basic:{uniforms:wn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.fog]),vertexShader:nt.meshbasic_vert,fragmentShader:nt.meshbasic_frag},lambert:{uniforms:wn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new Pe(0)},envMapIntensity:{value:1}}]),vertexShader:nt.meshlambert_vert,fragmentShader:nt.meshlambert_frag},phong:{uniforms:wn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:nt.meshphong_vert,fragmentShader:nt.meshphong_frag},standard:{uniforms:wn([Me.common,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.roughnessmap,Me.metalnessmap,Me.fog,Me.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag},toon:{uniforms:wn([Me.common,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.gradientmap,Me.fog,Me.lights,{emissive:{value:new Pe(0)}}]),vertexShader:nt.meshtoon_vert,fragmentShader:nt.meshtoon_frag},matcap:{uniforms:wn([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,{matcap:{value:null}}]),vertexShader:nt.meshmatcap_vert,fragmentShader:nt.meshmatcap_frag},points:{uniforms:wn([Me.points,Me.fog]),vertexShader:nt.points_vert,fragmentShader:nt.points_frag},dashed:{uniforms:wn([Me.common,Me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:nt.linedashed_vert,fragmentShader:nt.linedashed_frag},depth:{uniforms:wn([Me.common,Me.displacementmap]),vertexShader:nt.depth_vert,fragmentShader:nt.depth_frag},normal:{uniforms:wn([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,{opacity:{value:1}}]),vertexShader:nt.meshnormal_vert,fragmentShader:nt.meshnormal_frag},sprite:{uniforms:wn([Me.sprite,Me.fog]),vertexShader:nt.sprite_vert,fragmentShader:nt.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:nt.background_vert,fragmentShader:nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:nt.backgroundCube_vert,fragmentShader:nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:nt.cube_vert,fragmentShader:nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:nt.equirect_vert,fragmentShader:nt.equirect_frag},distance:{uniforms:wn([Me.common,Me.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:nt.distance_vert,fragmentShader:nt.distance_frag},shadow:{uniforms:wn([Me.lights,Me.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:nt.shadow_vert,fragmentShader:nt.shadow_frag}};Ii.physical={uniforms:wn([Ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new de(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new de},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new de},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag};var nh={r:0,b:0,g:0},wM=new Xe,D0=new $e;D0.set(-1,0,0,0,1,0,0,0,1);function TM(i,e,t,n,s,r){let a=new Pe(0),o=s===!0?0:1,l,c,u=null,d=0,f=null;function h(y){let M=y.isScene===!0?y.background:null;if(M&&M.isTexture){let _=y.backgroundBlurriness>0;M=e.get(M,_)}return M}function m(y){let M=!1,_=h(y);_===null?p(a,o):_&&_.isColor&&(p(_,1),M=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(y,M){let _=h(M);_&&(_.isCubeTexture||_.mapping===go)?(c===void 0&&(c=new I(new se(1,1,1),new Nt({name:"BackgroundCubeMaterial",uniforms:er(Ii.backgroundCube.uniforms),vertexShader:Ii.backgroundCube.vertexShader,fragmentShader:Ii.backgroundCube.fragmentShader,side:Pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,S,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=_,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(wM.makeRotationFromEuler(M.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(D0),c.material.toneMapped=et.getTransfer(_.colorSpace)!==yt,(u!==_||d!==_.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=_,d=_.version,f=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new I(new rt(2,2),new Nt({name:"BackgroundMaterial",uniforms:er(Ii.background.uniforms),vertexShader:Ii.background.vertexShader,fragmentShader:Ii.background.fragmentShader,side:Ai,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=et.getTransfer(_.colorSpace)!==yt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=_,d=_.version,f=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,M){y.getRGB(nh,Rd(i)),t.buffers.color.setClear(nh.r,nh.g,nh.b,M,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,M=1){a.set(y),o=M,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,p(a,o)},render:m,addToRenderList:x,dispose:g}}function RM(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,a=!1;function o(L,D,H,N,z){let V=!1,J=d(L,N,H,D);r!==J&&(r=J,c(r.object)),V=h(L,N,H,z),V&&m(L,N,H,z),z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,_(L,D,H,N),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function l(){return i.createVertexArray()}function c(L){return i.bindVertexArray(L)}function u(L){return i.deleteVertexArray(L)}function d(L,D,H,N){let z=N.wireframe===!0,V=n[D.id];V===void 0&&(V={},n[D.id]=V);let J=L.isInstancedMesh===!0?L.id:0,ae=V[J];ae===void 0&&(ae={},V[J]=ae);let Y=ae[H.id];Y===void 0&&(Y={},ae[H.id]=Y);let B=Y[z];return B===void 0&&(B=f(l()),Y[z]=B),B}function f(L){let D=[],H=[],N=[];for(let z=0;z<t;z++)D[z]=0,H[z]=0,N[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:H,attributeDivisors:N,object:L,attributes:{},index:null}}function h(L,D,H,N){let z=r.attributes,V=D.attributes,J=0,ae=H.getAttributes();for(let Y in ae)if(ae[Y].location>=0){let re=z[Y],Ee=V[Y];if(Ee===void 0&&(Y==="instanceMatrix"&&L.instanceMatrix&&(Ee=L.instanceMatrix),Y==="instanceColor"&&L.instanceColor&&(Ee=L.instanceColor)),re===void 0||re.attribute!==Ee||Ee&&re.data!==Ee.data)return!0;J++}return r.attributesNum!==J||r.index!==N}function m(L,D,H,N){let z={},V=D.attributes,J=0,ae=H.getAttributes();for(let Y in ae)if(ae[Y].location>=0){let re=V[Y];re===void 0&&(Y==="instanceMatrix"&&L.instanceMatrix&&(re=L.instanceMatrix),Y==="instanceColor"&&L.instanceColor&&(re=L.instanceColor));let Ee={};Ee.attribute=re,re&&re.data&&(Ee.data=re.data),z[Y]=Ee,J++}r.attributes=z,r.attributesNum=J,r.index=N}function x(){let L=r.newAttributes;for(let D=0,H=L.length;D<H;D++)L[D]=0}function p(L){g(L,0)}function g(L,D){let H=r.newAttributes,N=r.enabledAttributes,z=r.attributeDivisors;H[L]=1,N[L]===0&&(i.enableVertexAttribArray(L),N[L]=1),z[L]!==D&&(i.vertexAttribDivisor(L,D),z[L]=D)}function y(){let L=r.newAttributes,D=r.enabledAttributes;for(let H=0,N=D.length;H<N;H++)D[H]!==L[H]&&(i.disableVertexAttribArray(H),D[H]=0)}function M(L,D,H,N,z,V,J){J===!0?i.vertexAttribIPointer(L,D,H,z,V):i.vertexAttribPointer(L,D,H,N,z,V)}function _(L,D,H,N){x();let z=N.attributes,V=H.getAttributes(),J=D.defaultAttributeValues;for(let ae in V){let Y=V[ae];if(Y.location>=0){let B=z[ae];if(B===void 0&&(ae==="instanceMatrix"&&L.instanceMatrix&&(B=L.instanceMatrix),ae==="instanceColor"&&L.instanceColor&&(B=L.instanceColor)),B!==void 0){let re=B.normalized,Ee=B.itemSize,Te=e.get(B);if(Te===void 0)continue;let ht=Te.buffer,Ze=Te.type,it=Te.bytesPerElement,Z=Ze===i.INT||Ze===i.UNSIGNED_INT||B.gpuType===xc;if(B.isInterleavedBufferAttribute){let ee=B.data,ye=ee.stride,ze=B.offset;if(ee.isInstancedInterleavedBuffer){for(let we=0;we<Y.locationSize;we++)g(Y.location+we,ee.meshPerAttribute);L.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let we=0;we<Y.locationSize;we++)p(Y.location+we);i.bindBuffer(i.ARRAY_BUFFER,ht);for(let we=0;we<Y.locationSize;we++)M(Y.location+we,Ee/Y.locationSize,Ze,re,ye*it,(ze+Ee/Y.locationSize*we)*it,Z)}else{if(B.isInstancedBufferAttribute){for(let ee=0;ee<Y.locationSize;ee++)g(Y.location+ee,B.meshPerAttribute);L.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let ee=0;ee<Y.locationSize;ee++)p(Y.location+ee);i.bindBuffer(i.ARRAY_BUFFER,ht);for(let ee=0;ee<Y.locationSize;ee++)M(Y.location+ee,Ee/Y.locationSize,Ze,re,Ee*it,Ee/Y.locationSize*ee*it,Z)}}else if(J!==void 0){let re=J[ae];if(re!==void 0)switch(re.length){case 2:i.vertexAttrib2fv(Y.location,re);break;case 3:i.vertexAttrib3fv(Y.location,re);break;case 4:i.vertexAttrib4fv(Y.location,re);break;default:i.vertexAttrib1fv(Y.location,re)}}}}y()}function b(){w();for(let L in n){let D=n[L];for(let H in D){let N=D[H];for(let z in N){let V=N[z];for(let J in V)u(V[J].object),delete V[J];delete N[z]}}delete n[L]}}function S(L){if(n[L.id]===void 0)return;let D=n[L.id];for(let H in D){let N=D[H];for(let z in N){let V=N[z];for(let J in V)u(V[J].object),delete V[J];delete N[z]}}delete n[L.id]}function R(L){for(let D in n){let H=n[D];for(let N in H){let z=H[N];if(z[L.id]===void 0)continue;let V=z[L.id];for(let J in V)u(V[J].object),delete V[J];delete z[L.id]}}}function v(L){for(let D in n){let H=n[D],N=L.isInstancedMesh===!0?L.id:0,z=H[N];if(z!==void 0){for(let V in z){let J=z[V];for(let ae in J)u(J[ae].object),delete J[ae];delete z[V]}delete H[N],Object.keys(H).length===0&&delete n[D]}}}function w(){A(),a=!0,r!==s&&(r=s,c(r.object))}function A(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:A,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfObject:v,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:p,disableUnusedAttributes:y}}function AM(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let f=0;for(let h=0;h<u;h++)f+=c[h];t.update(f,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function CM(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==In&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){let v=R===an&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==En&&R!==qn&&!v&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(ke("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&f===!1&&ke("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),S=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:h,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:_,maxSamples:b,samples:S}}function PM(i){let e=this,t=null,n=0,s=!1,r=!1,a=new oi,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let h=d.length!==0||f||n!==0||s;return s=f,n=d.length,h},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,h){let m=d.clippingPlanes,x=d.clipIntersection,p=d.clipShadows,g=i.get(d);if(!s||m===null||m.length===0||r&&!p)r?u(null):c();else{let y=r?0:n,M=y*4,_=g.clippingState||null;l.value=_,_=u(m,f,M,h);for(let b=0;b!==M;++b)_[b]=t[b];g.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,f,h,m){let x=d!==null?d.length:0,p=null;if(x!==0){if(p=l.value,m!==!0||p===null){let g=h+x*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<g)&&(p=new Float32Array(g));for(let M=0,_=h;M!==x;++M,_+=4)a.copy(d[M]).applyMatrix4(y,o),a.normal.toArray(p,_),p[_+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}var Qr=4,IM=6,LM=20,DM=256,wo=new Ri,u0=new Pe,Fd=null,Od=0,Bd=0,kd=!1,NM=new P,tr=new P,ta=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=NM}=r;Fd=this._renderer.getRenderTarget(),Od=this._renderer.getActiveCubeFace(),Bd=this._renderer.getActiveMipmapLevel(),kd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=p0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=f0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Fd,Od,Bd),this._renderer.xr.enabled=kd,e.scissorTest=!1,Jr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ss||e.mapping===Js?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Fd=this._renderer.getRenderTarget(),Od=this._renderer.getActiveCubeFace(),Bd=this._renderer.getActiveMipmapLevel(),kd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Jt,minFilter:Jt,generateMipmaps:!1,type:an,format:In,colorSpace:Cn,depthBuffer:!1},s=d0(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=d0(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=UM(r)),this._blurMaterial=OM(r,e,t),this._ggxMaterial=FM(r,e,t)}return s}_compileMaterial(e){let t=new I(new Ht,e);this._renderer.compile(t,wo)}_sceneToCubeUV(e,t,n,s,r){let l=new sn(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(u0),d.toneMapping=ui,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new I(new se,new cn({name:"PMREM.Background",side:Pn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,p=x.material,g=!1,y=e.background;y?y.isColor&&(p.color.copy(y),e.background=null,g=!0):(p.color.copy(u0),g=!0);for(let M=0;M<6;M++){let _=M%3;_===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[M],r.y,r.z)):_===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[M]));let b=this._cubeSize;Jr(s,_*b,M>2?b:0,b,b),d.setRenderTarget(s),g&&d.render(x,l),d.render(e,l)}d.toneMapping=h,d.autoClear=f,e.background=y}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Ss||e.mapping===Js;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=p0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=f0());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Jr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,wo)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),f=c*1.25,h=d*f,{_lodMax:m}=this,x=this._sizeLods[n],p=3*x*(n>m-Qr?n-m+Qr:0),g=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=h,l.mipInt.value=m-t,Jr(r,p,g,3*x,2*x),s.setRenderTarget(r),s.render(o,wo),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,Jr(e,p,g,3*x,2*x),s.setRenderTarget(e),s.render(o,wo)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let u=this._sizeLods[s],d=3*u*(s>this._lodMax-Qr?s-this._lodMax+Qr:0),f=4*(this._cubeSize-u);Jr(t,d,f,3*u,2*u),a.setRenderTarget(t),a.render(l,wo)}};function UM(i){let e=[],t=[],n=i,s=i-Qr+1+IM;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,f=6,h=3,m=new Float32Array(h*f*d),x=new Float32Array(h*f*d);for(let g=0;g<d;g++){let y=g%3*2/3-1,M=g>2?0:-1,_=[y,M,0,y+2/3,M,0,y+2/3,M+1,0,y,M,0,y+2/3,M+1,0,y,M+1,0];m.set(_,h*f*g);for(let b=0;b<f;b++){let S=u[b*2]*2-1,R=u[b*2+1]*2-1;g===0?tr.set(1,R,S):g===1?tr.set(-S,1,-R):g===2?tr.set(-S,R,1):g===3?tr.set(-1,R,-S):g===4?tr.set(-S,-1,R):tr.set(S,R,-1),tr.toArray(x,(g*f+b)*h)}}let p=new Ht;p.setAttribute("position",new rn(m,h)),p.setAttribute("outputDirection",new rn(x,h)),t.push(new I(p,null)),n>Qr&&n--}return{lodMeshes:t,sizeLods:e}}function d0(i,e,t){let n=new Yt(i,e,t);return n.texture.mapping=go,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Jr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function FM(i,e,t){return new Nt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:DM,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ah(),fragmentShader:`

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
		`,blending:Qt,depthTest:!1,depthWrite:!1})}function OM(i,e,t){return new Nt({name:"SphericalGaussianBlur",defines:{SAMPLES:LM,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ah(),fragmentShader:`

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
		`,blending:Qt,depthTest:!1,depthWrite:!1})}function f0(){return new Nt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ah(),fragmentShader:`

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
		`,blending:Qt,depthTest:!1,depthWrite:!1})}function p0(){return new Nt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ah(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qt,depthTest:!1,depthWrite:!1})}function ah(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var sh=class extends Yt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Xa(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new se(5,5,5),r=new Nt({name:"CubemapFromEquirect",uniforms:er(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Pn,blending:Qt});r.uniforms.tEquirect.value=t;let a=new I(s,r),o=t.minFilter;return t.minFilter===di&&(t.minFilter=Jt),new uc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function BM(i){let e=new WeakMap,t=new WeakMap,n=null;function s(f,h=!1){return f==null?null:h?a(f):r(f)}function r(f){if(f&&f.isTexture){let h=f.mapping;if(h===Kr||h===mc)if(e.has(f)){let m=e.get(f).texture;return o(m,f.mapping)}else{let m=f.image;if(m&&m.height>0){let x=new sh(m.height);return x.fromEquirectangularTexture(i,f),e.set(f,x),f.addEventListener("dispose",c),o(x.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture){let h=f.mapping,m=h===Kr||h===mc,x=h===Ss||h===Js;if(m||x){let p=t.get(f),g=p!==void 0?p.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==g)return n===null&&(n=new ta(i)),p=m?n.fromEquirectangular(f,p):n.fromCubemap(f,p),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),p.texture;if(p!==void 0)return p.texture;{let y=f.image;return m&&y&&y.height>0||x&&y&&l(y)?(n===null&&(n=new ta(i)),p=m?n.fromEquirectangular(f):n.fromCubemap(f),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),f.addEventListener("dispose",u),p.texture):null}}}return f}function o(f,h){return h===Kr?f.mapping=Ss:h===mc&&(f.mapping=Js),f}function l(f){let h=0,m=6;for(let x=0;x<m;x++)f[x]!==void 0&&h++;return h===m}function c(f){let h=f.target;h.removeEventListener("dispose",c);let m=e.get(h);m!==void 0&&(e.delete(h),m.dispose())}function u(f){let h=f.target;h.removeEventListener("dispose",u);let m=t.get(h);m!==void 0&&(t.delete(h),m.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function kM(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&ks("WebGLRenderer: "+n+" extension not supported."),s}}}function HM(i,e,t,n){let s={},r=new WeakMap;function a(d){let f=d.target;f.index!==null&&e.remove(f.index);for(let m in f.attributes)e.remove(f.attributes[m]);f.removeEventListener("dispose",a),delete s[f.id];let h=r.get(f);h&&(e.remove(h),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(d){let f=d.attributes;for(let h in f)e.update(f[h],i.ARRAY_BUFFER)}function c(d){let f=[],h=d.index,m=d.attributes.position,x=0;if(m===void 0)return;if(h!==null){let y=h.array;x=h.version;for(let M=0,_=y.length;M<_;M+=3){let b=y[M+0],S=y[M+1],R=y[M+2];f.push(b,S,S,R,R,b)}}else{let y=m.array;x=m.version;for(let M=0,_=y.length/3-1;M<_;M+=3){let b=M+0,S=M+1,R=M+2;f.push(b,S,S,R,R,b)}}let p=new(m.count>=65535?Ba:Oa)(f,1);p.version=x;let g=r.get(d);g&&e.remove(g),r.set(d,p)}function u(d){let f=r.get(d);if(f){let h=d.index;h!==null&&f.version<h.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function zM(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*a),t.update(f,n,1)}function c(d,f,h){h!==0&&(i.drawElementsInstanced(n,f,r,d*a,h),t.update(f,n,h))}function u(d,f,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,h);let x=0;for(let p=0;p<h;p++)x+=f[p];t.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function GM(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Ye("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function VM(i,e,t){let n=new WeakMap,s=new Et;function r(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0,f=n.get(o);if(f===void 0||f.count!==d){let w=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();let h=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],M=0;h===!0&&(M=1),m===!0&&(M=2),x===!0&&(M=3);let _=o.attributes.position.count*M,b=1;_>e.maxTextureSize&&(b=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);let S=new Float32Array(_*b*4*d),R=new Da(S,_,b,d);R.type=qn,R.needsUpdate=!0;let v=M*4;for(let A=0;A<d;A++){let L=p[A],D=g[A],H=y[A],N=_*b*4*A;for(let z=0;z<L.count;z++){let V=z*v;h===!0&&(s.fromBufferAttribute(L,z),S[N+V+0]=s.x,S[N+V+1]=s.y,S[N+V+2]=s.z,S[N+V+3]=0),m===!0&&(s.fromBufferAttribute(D,z),S[N+V+4]=s.x,S[N+V+5]=s.y,S[N+V+6]=s.z,S[N+V+7]=0),x===!0&&(s.fromBufferAttribute(H,z),S[N+V+8]=s.x,S[N+V+9]=s.y,S[N+V+10]=s.z,S[N+V+11]=H.itemSize===4?s.w:1)}}f={count:d,texture:R,size:new de(_,b)},n.set(o,f),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let h=0;for(let x=0;x<c.length;x++)h+=c[x];let m=o.morphTargetsRelative?1:1-h;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function WM(i,e,t,n,s){let r=new WeakMap;function a(c){let u=s.render.frame,d=c.geometry,f=e.get(c,d);if(r.get(f)!==u&&(e.update(f),r.set(f,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let h=c.skeleton;r.get(h)!==u&&(h.update(),r.set(h,u))}return f}function o(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}var XM={[co]:"LINEAR_TONE_MAPPING",[ho]:"REINHARD_TONE_MAPPING",[uo]:"CINEON_TONE_MAPPING",[js]:"ACES_FILMIC_TONE_MAPPING",[po]:"AGX_TONE_MAPPING",[mo]:"NEUTRAL_TONE_MAPPING",[fo]:"CUSTOM_TONE_MAPPING"};function qM(i,e,t,n,s,r){let a=new Yt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Ht;c.setAttribute("position",new pt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new pt([0,2,0,0,2,0],2));let u=new Vr({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new I(c,u),f=new Ri(-1,1,1,-1,0,1),h=null,m=null,x=!1,p,g=null,y=[],M=!1;this.setSize=function(_,b){a.setSize(_,b),o!==null&&o.setSize(_,b),l!==null&&l.setSize(_,b);for(let S=0;S<y.length;S++){let R=y[S];R.setSize&&R.setSize(_,b)}},this.setEffects=function(_){y=_,M=y.length>0&&y[0].isRenderPass===!0;let b=a.width,S=a.height;y.length>0&&o===null&&(o=new Yt(b,S,{type:an,depthBuffer:!1,stencilBuffer:!1}),l=new Yt(b,S,{type:an,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<y.length;R++){let v=y[R];v.setSize&&v.setSize(b,S)}},this.begin=function(_,b){if(x||_.toneMapping===ui&&y.length===0)return!1;if(g=b,b!==null){let S=b.width,R=b.height;(a.width!==S||a.height!==R)&&this.setSize(S,R)}return M===!1&&_.setRenderTarget(a),p=_.toneMapping,_.toneMapping=ui,!0},this.hasRenderPass=function(){return M},this.end=function(_,b){_.toneMapping=p,x=!0;let S=a,R=o;for(let v=0;v<y.length;v++){let w=y[v];w.enabled!==!1&&(w.render(_,R,S,b),w.needsSwap!==!1&&(S=R,R=R===o?l:o))}if(h!==_.outputColorSpace||m!==_.toneMapping){h=_.outputColorSpace,m=_.toneMapping,u.defines={},et.getTransfer(h)===yt&&(u.defines.SRGB_TRANSFER="");let v=XM[m];v&&(u.defines[v]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=S.texture,_.setRenderTarget(g),_.render(d,f),g=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var N0=new ln,Gd=new Ei(1,1),U0=new Da,F0=new Wl,O0=new Xa,m0=[],g0=[],x0=new Float32Array(16),y0=new Float32Array(9),_0=new Float32Array(4);function na(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=m0[s];if(r===void 0&&(r=new Float32Array(s),m0[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function hn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function un(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function oh(i,e){let t=g0[e];t===void 0&&(t=new Int32Array(e),g0[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function YM(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function KM(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(hn(t,e))return;i.uniform2fv(this.addr,e),un(t,e)}}function $M(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(hn(t,e))return;i.uniform3fv(this.addr,e),un(t,e)}}function ZM(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(hn(t,e))return;i.uniform4fv(this.addr,e),un(t,e)}}function jM(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(hn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),un(t,e)}else{if(hn(t,n))return;_0.set(n),i.uniformMatrix2fv(this.addr,!1,_0),un(t,n)}}function JM(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(hn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),un(t,e)}else{if(hn(t,n))return;y0.set(n),i.uniformMatrix3fv(this.addr,!1,y0),un(t,n)}}function QM(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(hn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),un(t,e)}else{if(hn(t,n))return;x0.set(n),i.uniformMatrix4fv(this.addr,!1,x0),un(t,n)}}function eb(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function tb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(hn(t,e))return;i.uniform2iv(this.addr,e),un(t,e)}}function nb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(hn(t,e))return;i.uniform3iv(this.addr,e),un(t,e)}}function ib(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(hn(t,e))return;i.uniform4iv(this.addr,e),un(t,e)}}function sb(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function rb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(hn(t,e))return;i.uniform2uiv(this.addr,e),un(t,e)}}function ab(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(hn(t,e))return;i.uniform3uiv(this.addr,e),un(t,e)}}function ob(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(hn(t,e))return;i.uniform4uiv(this.addr,e),un(t,e)}}function lb(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Gd.compareFunction=t.isReversedDepthBuffer()?th:eh,r=Gd):r=N0,t.setTexture2D(e||r,s)}function cb(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||F0,s)}function hb(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||O0,s)}function ub(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||U0,s)}function db(i){switch(i){case 5126:return YM;case 35664:return KM;case 35665:return $M;case 35666:return ZM;case 35674:return jM;case 35675:return JM;case 35676:return QM;case 5124:case 35670:return eb;case 35667:case 35671:return tb;case 35668:case 35672:return nb;case 35669:case 35673:return ib;case 5125:return sb;case 36294:return rb;case 36295:return ab;case 36296:return ob;case 35678:case 36198:case 36298:case 36306:case 35682:return lb;case 35679:case 36299:case 36307:return cb;case 35680:case 36300:case 36308:case 36293:return hb;case 36289:case 36303:case 36311:case 36292:return ub}}function fb(i,e){i.uniform1fv(this.addr,e)}function pb(i,e){let t=na(e,this.size,2);i.uniform2fv(this.addr,t)}function mb(i,e){let t=na(e,this.size,3);i.uniform3fv(this.addr,t)}function gb(i,e){let t=na(e,this.size,4);i.uniform4fv(this.addr,t)}function xb(i,e){let t=na(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function yb(i,e){let t=na(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function _b(i,e){let t=na(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function vb(i,e){i.uniform1iv(this.addr,e)}function Mb(i,e){i.uniform2iv(this.addr,e)}function bb(i,e){i.uniform3iv(this.addr,e)}function Sb(i,e){i.uniform4iv(this.addr,e)}function Eb(i,e){i.uniform1uiv(this.addr,e)}function wb(i,e){i.uniform2uiv(this.addr,e)}function Tb(i,e){i.uniform3uiv(this.addr,e)}function Rb(i,e){i.uniform4uiv(this.addr,e)}function Ab(i,e,t){let n=this.cache,s=e.length,r=oh(t,s);hn(n,r)||(i.uniform1iv(this.addr,r),un(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Gd:a=N0;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Cb(i,e,t){let n=this.cache,s=e.length,r=oh(t,s);hn(n,r)||(i.uniform1iv(this.addr,r),un(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||F0,r[a])}function Pb(i,e,t){let n=this.cache,s=e.length,r=oh(t,s);hn(n,r)||(i.uniform1iv(this.addr,r),un(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||O0,r[a])}function Ib(i,e,t){let n=this.cache,s=e.length,r=oh(t,s);hn(n,r)||(i.uniform1iv(this.addr,r),un(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||U0,r[a])}function Lb(i){switch(i){case 5126:return fb;case 35664:return pb;case 35665:return mb;case 35666:return gb;case 35674:return xb;case 35675:return yb;case 35676:return _b;case 5124:case 35670:return vb;case 35667:case 35671:return Mb;case 35668:case 35672:return bb;case 35669:case 35673:return Sb;case 5125:return Eb;case 36294:return wb;case 36295:return Tb;case 36296:return Rb;case 35678:case 36198:case 36298:case 36306:case 35682:return Ab;case 35679:case 36299:case 36307:return Cb;case 35680:case 36300:case 36308:case 36293:return Pb;case 36289:case 36303:case 36311:case 36292:return Ib}}var Vd=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=db(t.type)}},Wd=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Lb(t.type)}},Xd=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Hd=/(\w+)(\])?(\[|\.)?/g;function v0(i,e){i.seq.push(e),i.map[e.id]=e}function Db(i,e,t){let n=i.name,s=n.length;for(Hd.lastIndex=0;;){let r=Hd.exec(n),a=Hd.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){v0(t,c===void 0?new Vd(o,i,e):new Wd(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new Xd(o),v0(t,d)),t=d}}}var ea=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Db(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function M0(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Nb=37297,Ub=0;function Fb(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var b0=new $e;function Ob(i){et._getMatrix(b0,et.workingColorSpace,i);let e=`mat3( ${b0.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(i)){case Ia:return[e,"LinearTransferOETF"];case yt:return[e,"sRGBTransferOETF"];default:return ke("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function S0(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Fb(i.getShaderSource(e),o)}else return r}function Bb(i,e){let t=Ob(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var kb={[co]:"Linear",[ho]:"Reinhard",[uo]:"Cineon",[js]:"ACESFilmic",[po]:"AgX",[mo]:"Neutral",[fo]:"Custom"};function Hb(i,e){let t=kb[e];return t===void 0?(ke("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var ih=new P;function zb(){et.getLuminanceCoefficients(ih);let i=ih.x.toFixed(4),e=ih.y.toFixed(4),t=ih.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Gb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ro).join(`
`)}function Vb(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Wb(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ro(i){return i!==""}function E0(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function w0(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Xb=/^[ \t]*#include +<([\w\d./]+)>/gm;function qd(i){return i.replace(Xb,Yb)}var qb=new Map;function Yb(i,e){let t=nt[e];if(t===void 0){let n=qb.get(e);if(n!==void 0)t=nt[n],ke('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return qd(t)}var Kb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function T0(i){return i.replace(Kb,$b)}function $b(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function R0(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var Zb={[$s]:"SHADOWMAP_TYPE_PCF",[qr]:"SHADOWMAP_TYPE_VSM"};function jb(i){return Zb[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Jb={[Ss]:"ENVMAP_TYPE_CUBE",[Js]:"ENVMAP_TYPE_CUBE",[go]:"ENVMAP_TYPE_CUBE_UV"};function Qb(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Jb[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var eS={[Js]:"ENVMAP_MODE_REFRACTION"};function tS(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":eS[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var nS={[fd]:"ENVMAP_BLENDING_MULTIPLY",[Wm]:"ENVMAP_BLENDING_MIX",[Xm]:"ENVMAP_BLENDING_ADD"};function iS(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":nS[i.combine]||"ENVMAP_BLENDING_NONE"}function sS(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function rS(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=jb(t),c=Qb(t),u=tS(t),d=iS(t),f=sS(t),h=Gb(t),m=Vb(r),x=s.createProgram(),p,g,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Ro).join(`
`),p.length>0&&(p+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Ro).join(`
`),g.length>0&&(g+=`
`)):(p=[R0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ro).join(`
`),g=[R0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ui?"#define TONE_MAPPING":"",t.toneMapping!==ui?nt.tonemapping_pars_fragment:"",t.toneMapping!==ui?Hb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",nt.colorspace_pars_fragment,Bb("linearToOutputTexel",t.outputColorSpace),zb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ro).join(`
`)),a=qd(a),a=E0(a,t),a=w0(a,t),o=qd(o),o=E0(o,t),o=w0(o,t),a=T0(a),o=T0(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,g=["#define varying in",t.glslVersion===Sd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Sd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let M=y+p+a,_=y+g+o,b=M0(s,s.VERTEX_SHADER,M),S=M0(s,s.FRAGMENT_SHADER,_);s.attachShader(x,b),s.attachShader(x,S),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function R(L){if(i.debug.checkShaderErrors){let D=s.getProgramInfoLog(x)||"",H=s.getShaderInfoLog(b)||"",N=s.getShaderInfoLog(S)||"",z=D.trim(),V=H.trim(),J=N.trim(),ae=!0,Y=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(ae=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,b,S);else{let B=S0(s,b,"vertex"),re=S0(s,S,"fragment");Ye("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+z+`
`+B+`
`+re)}else z!==""?ke("WebGLProgram: Program Info Log:",z):(V===""||J==="")&&(Y=!1);Y&&(L.diagnostics={runnable:ae,programLog:z,vertexShader:{log:V,prefix:p},fragmentShader:{log:J,prefix:g}})}s.deleteShader(b),s.deleteShader(S),v=new ea(s,x),w=Wb(s,x)}let v;this.getUniforms=function(){return v===void 0&&R(this),v};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=s.getProgramParameter(x,Nb)),A},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ub++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=b,this.fragmentShader=S,this}var aS=0,Yd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Kd(e),t.set(e,n)),n}},Kd=class{constructor(e){this.id=aS++,this.code=e,this.usedTimes=0}};function oS(i){return i===ws||i===Mo||i===bo}function lS(i,e,t,n,s,r){let a=new Na,o=new Yd,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer,f=n.precision,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(v){return l.add(v),v===0?"uv":`uv${v}`}function x(v,w,A,L,D,H){let N=L.fog,z=D.geometry,V=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,J=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,ae=e.get(v.envMap||V,J),Y=ae&&ae.mapping===go?ae.image.height:null,B=h[v.type];v.precision!==null&&(f=n.getMaxPrecision(v.precision),f!==v.precision&&ke("WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));let re=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Ee=re!==void 0?re.length:0,Te=0;z.morphAttributes.position!==void 0&&(Te=1),z.morphAttributes.normal!==void 0&&(Te=2),z.morphAttributes.color!==void 0&&(Te=3);let ht,Ze,it,Z;if(B){let Rt=Ii[B];ht=Rt.vertexShader,Ze=Rt.fragmentShader}else{ht=v.vertexShader,Ze=v.fragmentShader;let Rt=o.getVertexShaderStage(v),G=o.getFragmentShaderStage(v);o.update(v,Rt,G),it=Rt.id,Z=G.id}let ee=i.getRenderTarget(),ye=i.state.buffers.depth.getReversed(),ze=D.isInstancedMesh===!0,we=D.isBatchedMesh===!0,Ke=!!v.map,Ft=!!v.matcap,je=!!ae,at=!!v.aoMap,mt=!!v.lightMap,Je=!!v.bumpMap&&v.wireframe===!1,gt=!!v.normalMap,Pt=!!v.displacementMap,Kt=!!v.emissiveMap,_t=!!v.metalnessMap,Tt=!!v.roughnessMap,U=v.anisotropy>0,Xt=v.clearcoat>0,ct=v.dispersion>0,C=v.retroreflectivity>0,E=v.iridescence>0,k=v.sheen>0,W=v.transmission>0,K=U&&!!v.anisotropyMap,ce=Xt&&!!v.clearcoatMap,me=Xt&&!!v.clearcoatNormalMap,Q=Xt&&!!v.clearcoatRoughnessMap,te=E&&!!v.iridescenceMap,pe=E&&!!v.iridescenceThicknessMap,Ie=k&&!!v.sheenColorMap,ge=k&&!!v.sheenRoughnessMap,fe=!!v.specularMap,Le=!!v.specularColorMap,Ne=!!v.specularIntensityMap,We=W&&!!v.transmissionMap,O=W&&!!v.thicknessMap,_e=!!v.gradientMap,ie=!!v.alphaMap,xe=v.alphaTest>0,ve=!!v.alphaHash,oe=!!v.extensions,He=ui;v.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(He=i.toneMapping);let De={shaderID:B,shaderType:v.type,shaderName:v.name,vertexShader:ht,fragmentShader:Ze,defines:v.defines,customVertexShaderID:it,customFragmentShaderID:Z,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:we,batchingColor:we&&D._colorsTexture!==null,instancing:ze,instancingColor:ze&&D.instanceColor!==null,instancingMorph:ze&&D.morphTexture!==null,outputColorSpace:ee===null?i.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Ke,matcap:Ft,envMap:je,envMapMode:je&&ae.mapping,envMapCubeUVHeight:Y,aoMap:at,lightMap:mt,bumpMap:Je,normalMap:gt,displacementMap:Pt,emissiveMap:Kt,normalMapObjectSpace:gt&&v.normalMapType===$m,normalMapTangentSpace:gt&&v.normalMapType===Eo,packedNormalMap:gt&&v.normalMapType===Eo&&oS(v.normalMap.format),metalnessMap:_t,roughnessMap:Tt,anisotropy:U,anisotropyMap:K,clearcoat:Xt,clearcoatMap:ce,clearcoatNormalMap:me,clearcoatRoughnessMap:Q,dispersion:ct,retroreflection:C,iridescence:E,iridescenceMap:te,iridescenceThicknessMap:pe,sheen:k,sheenColorMap:Ie,sheenRoughnessMap:ge,specularMap:fe,specularColorMap:Le,specularIntensityMap:Ne,transmission:W,transmissionMap:We,thicknessMap:O,gradientMap:_e,opaque:v.transparent===!1&&v.blending===Yr&&v.alphaToCoverage===!1,alphaMap:ie,alphaTest:xe,alphaHash:ve,combine:v.combine,mapUv:Ke&&m(v.map.channel),aoMapUv:at&&m(v.aoMap.channel),lightMapUv:mt&&m(v.lightMap.channel),bumpMapUv:Je&&m(v.bumpMap.channel),normalMapUv:gt&&m(v.normalMap.channel),displacementMapUv:Pt&&m(v.displacementMap.channel),emissiveMapUv:Kt&&m(v.emissiveMap.channel),metalnessMapUv:_t&&m(v.metalnessMap.channel),roughnessMapUv:Tt&&m(v.roughnessMap.channel),anisotropyMapUv:K&&m(v.anisotropyMap.channel),clearcoatMapUv:ce&&m(v.clearcoatMap.channel),clearcoatNormalMapUv:me&&m(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&m(v.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&m(v.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&m(v.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&m(v.sheenColorMap.channel),sheenRoughnessMapUv:ge&&m(v.sheenRoughnessMap.channel),specularMapUv:fe&&m(v.specularMap.channel),specularColorMapUv:Le&&m(v.specularColorMap.channel),specularIntensityMapUv:Ne&&m(v.specularIntensityMap.channel),transmissionMapUv:We&&m(v.transmissionMap.channel),thicknessMapUv:O&&m(v.thicknessMap.channel),alphaMapUv:ie&&m(v.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(gt||U),vertexNormals:!!z.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!z.attributes.uv&&(Ke||ie),fog:!!N,useFog:v.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||z.attributes.normal===void 0&&gt===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ye,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:z.attributes.position!==void 0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:Ee,morphTextureStride:Te,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:He,decodeVideoTexture:Ke&&v.map.isVideoTexture===!0&&et.getTransfer(v.map.colorSpace)===yt,decodeVideoTextureEmissive:Kt&&v.emissiveMap.isVideoTexture===!0&&et.getTransfer(v.emissiveMap.colorSpace)===yt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Wt,flipSided:v.side===Pn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:oe&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(oe&&v.extensions.multiDraw===!0||we)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return De.vertexUv1s=l.has(1),De.vertexUv2s=l.has(2),De.vertexUv3s=l.has(3),l.clear(),De}function p(v){let w=[];if(v.shaderID?w.push(v.shaderID):(w.push(v.customVertexShaderID),w.push(v.customFragmentShaderID)),v.defines!==void 0)for(let A in v.defines)w.push(A),w.push(v.defines[A]);return v.isRawShaderMaterial===!1&&(g(w,v),y(w,v),w.push(i.outputColorSpace)),w.push(v.customProgramCacheKey),w.join()}function g(v,w){v.push(w.precision),v.push(w.outputColorSpace),v.push(w.envMapMode),v.push(w.envMapCubeUVHeight),v.push(w.mapUv),v.push(w.alphaMapUv),v.push(w.lightMapUv),v.push(w.aoMapUv),v.push(w.bumpMapUv),v.push(w.normalMapUv),v.push(w.displacementMapUv),v.push(w.emissiveMapUv),v.push(w.metalnessMapUv),v.push(w.roughnessMapUv),v.push(w.anisotropyMapUv),v.push(w.clearcoatMapUv),v.push(w.clearcoatNormalMapUv),v.push(w.clearcoatRoughnessMapUv),v.push(w.iridescenceMapUv),v.push(w.iridescenceThicknessMapUv),v.push(w.sheenColorMapUv),v.push(w.sheenRoughnessMapUv),v.push(w.specularMapUv),v.push(w.specularColorMapUv),v.push(w.specularIntensityMapUv),v.push(w.transmissionMapUv),v.push(w.thicknessMapUv),v.push(w.combine),v.push(w.fogExp2),v.push(w.sizeAttenuation),v.push(w.morphTargetsCount),v.push(w.morphAttributeCount),v.push(w.numSunLights),v.push(w.numDirLights),v.push(w.numPointLights),v.push(w.numSpotLights),v.push(w.numSpotLightMaps),v.push(w.numHemiLights),v.push(w.numRectAreaLights),v.push(w.numSunLightShadows),v.push(w.numDirLightShadows),v.push(w.numPointLightShadows),v.push(w.numSpotLightShadows),v.push(w.numSpotLightShadowsWithMaps),v.push(w.numLightProbes),v.push(w.shadowMapType),v.push(w.toneMapping),v.push(w.numClippingPlanes),v.push(w.numClipIntersection),v.push(w.depthPacking)}function y(v,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function M(v){let w=h[v.type],A;if(w){let L=Ii[w];A=Ln.clone(L.uniforms)}else A=v.uniforms;return A}function _(v,w){let A=u.get(w);return A!==void 0?++A.usedTimes:(A=new rS(i,w,v,s),c.push(A),u.set(w,A)),A}function b(v){if(--v.usedTimes===0){let w=c.indexOf(v);c[w]=c[c.length-1],c.pop(),u.delete(v.cacheKey),v.destroy()}}function S(v){o.remove(v)}function R(){o.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:M,acquireProgram:_,releaseProgram:b,releaseShaderCache:S,programs:c,dispose:R}}function cS(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function hS(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function A0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function C0(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(f){let h=0;return f.isInstancedMesh&&(h+=2),f.isSkinnedMesh&&(h+=1),h}function o(f,h,m,x,p,g){let y=i[e];return y===void 0?(y={id:f.id,object:f,geometry:h,material:m,materialVariant:a(f),groupOrder:x,renderOrder:f.renderOrder,z:p,group:g},i[e]=y):(y.id=f.id,y.object=f,y.geometry=h,y.material=m,y.materialVariant=a(f),y.groupOrder=x,y.renderOrder=f.renderOrder,y.z=p,y.group=g),e++,y}function l(f,h,m,x,p,g,y){y.reversedDepth===!0&&(p=-p);let M=o(f,h,m,x,p,g);m.transmission>0?n.push(M):m.transparent===!0?s.push(M):t.push(M)}function c(f,h,m,x,p,g){let y=o(f,h,m,x,p,g);m.transmission>0?n.unshift(y):m.transparent===!0?s.unshift(y):t.unshift(y)}function u(f,h){t.length>1&&t.sort(f||hS),n.length>1&&n.sort(h||A0),s.length>1&&s.sort(h||A0)}function d(){for(let f=e,h=i.length;f<h;f++){let m=i[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:u}}function uS(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new C0,i.set(n,[a])):s>=r.length?(a=new C0,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function dS(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new P,color:new Pe};break;case"SpotLight":t={position:new P,direction:new P,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function fS(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var pS=0;function mS(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function gS(i){let e=new dS,t=fS(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new Xe,a=new Xe;function o(c){let u=0,d=0,f=0;for(let D=0;D<9;D++)n.probe[D].set(0,0,0);let h=0,m=0,x=0,p=0,g=0,y=0,M=0,_=0,b=0,S=0,R=0,v=0,w=0,A=0;c.sort(mS);for(let D=0,H=c.length;D<H;D++){let N=c[D],z=N.color,V=N.intensity,J=N.distance,ae=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===ws?ae=N.shadow.map.texture:ae=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)u+=z.r*V,d+=z.g*V,f+=z.b*V;else if(N.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(N.sh.coefficients[Y],V);A++}else if(N.isSunLight){let Y=e.get(N);if(Y.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let B=N.shadow,re=t.get(N);re.shadowIntensity=B.intensity,re.shadowBias=B.bias,re.shadowNormalBias=B.normalBias,re.shadowRadius=B.radius,re.shadowMapSize.copy(B.mapSize).multiply(B.getFrameExtents()),n.sunShadow[m]=re,n.sunShadowMap[m]=ae;let Ee=B.getViewportCount();for(let Te=0;Te<Ee;Te++)n.sunShadowMatrix[x+Te]=B.getMatrix(Te),n.sunShadowCascade[x+Te]=B._cascadeData[Te];x+=Ee,m++}n.sun[h]=Y,h++}else if(N.isDirectionalLight){let Y=e.get(N);if(Y.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let B=N.shadow,re=t.get(N);re.shadowIntensity=B.intensity,re.shadowBias=B.bias,re.shadowNormalBias=B.normalBias,re.shadowRadius=B.radius,re.shadowMapSize=B.mapSize,n.directionalShadow[p]=re,n.directionalShadowMap[p]=ae,n.directionalShadowMatrix[p]=N.shadow.matrix,b++}n.directional[p]=Y,p++}else if(N.isSpotLight){let Y=e.get(N);Y.position.setFromMatrixPosition(N.matrixWorld),Y.color.copy(z).multiplyScalar(V),Y.distance=J,Y.coneCos=Math.cos(N.angle),Y.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),Y.decay=N.decay,n.spot[y]=Y;let B=N.shadow;if(N.map&&(n.spotLightMap[v]=N.map,v++,B.updateMatrices(N),N.castShadow&&w++),n.spotLightMatrix[y]=B.matrix,N.castShadow){let re=t.get(N);re.shadowIntensity=B.intensity,re.shadowBias=B.bias,re.shadowNormalBias=B.normalBias,re.shadowRadius=B.radius,re.shadowMapSize=B.mapSize,n.spotShadow[y]=re,n.spotShadowMap[y]=ae,R++}y++}else if(N.isRectAreaLight){let Y=e.get(N);Y.color.copy(z).multiplyScalar(V),Y.halfWidth.set(N.width*.5,0,0),Y.halfHeight.set(0,N.height*.5,0),n.rectArea[M]=Y,M++}else if(N.isPointLight){let Y=e.get(N);if(Y.color.copy(N.color).multiplyScalar(N.intensity),Y.distance=N.distance,Y.decay=N.decay,N.castShadow){let B=N.shadow,re=t.get(N);re.shadowIntensity=B.intensity,re.shadowBias=B.bias,re.shadowNormalBias=B.normalBias,re.shadowRadius=B.radius,re.shadowMapSize=B.mapSize,re.shadowCameraNear=B.camera.near,re.shadowCameraFar=B.camera.far,n.pointShadow[g]=re,n.pointShadowMap[g]=ae,n.pointShadowMatrix[g]=N.shadow.matrix,S++}n.point[g]=Y,g++}else if(N.isHemisphereLight){let Y=e.get(N);Y.skyColor.copy(N.color).multiplyScalar(V),Y.groundColor.copy(N.groundColor).multiplyScalar(V),n.hemi[_]=Y,_++}}M>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Me.LTC_FLOAT_1,n.rectAreaLTC2=Me.LTC_FLOAT_2):(n.rectAreaLTC1=Me.LTC_HALF_1,n.rectAreaLTC2=Me.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=f;let L=n.hash;(L.sunLength!==h||L.directionalLength!==p||L.pointLength!==g||L.spotLength!==y||L.rectAreaLength!==M||L.hemiLength!==_||L.numSunShadows!==m||L.numDirectionalShadows!==b||L.numPointShadows!==S||L.numSpotShadows!==R||L.numSpotMaps!==v||L.numLightProbes!==A)&&(n.sun.length=h,n.directional.length=p,n.spot.length=y,n.rectArea.length=M,n.point.length=g,n.hemi.length=_,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=S,n.pointShadowMap.length=S,n.pointShadowMatrix.length=S,n.spotShadow.length=R,n.spotShadowMap.length=R,n.spotLightMatrix.length=R+v-w,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=A,L.sunLength=h,L.directionalLength=p,L.pointLength=g,L.spotLength=y,L.rectAreaLength=M,L.hemiLength=_,L.numSunShadows=m,L.numDirectionalShadows=b,L.numPointShadows=S,L.numSpotShadows=R,L.numSpotMaps=v,L.numLightProbes=A,n.version=pS++)}function l(c,u){let d=0,f=0,h=0,m=0,x=0,p=0,g=u.matrixWorldInverse;for(let y=0,M=c.length;y<M;y++){let _=c[y];if(_.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(g),d++}else if(_.isDirectionalLight){let b=n.directional[f];b.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),f++}else if(_.isSpotLight){let b=n.spot[m];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),m++}else if(_.isRectAreaLight){let b=n.rectArea[x];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(g),a.identity(),r.copy(_.matrixWorld),r.premultiply(g),a.extractRotation(r),b.halfWidth.set(_.width*.5,0,0),b.halfHeight.set(0,_.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),x++}else if(_.isPointLight){let b=n.point[h];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(g),h++}else if(_.isHemisphereLight){let b=n.hemi[p];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(g),p++}}}return{setup:o,setupView:l,state:n}}function P0(i){let e=new gS(i),t=[],n=[],s=[];function r(f){d.camera=f,t.length=0,n.length=0,s.length=0}function a(f){t.push(f)}function o(f){n.push(f)}function l(f){s.push(f)}function c(){e.setup(t)}function u(f){e.setupView(t,f)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function xS(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new P0(i),e.set(s,[o])):r>=a.length?(o=new P0(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var yS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_S=`uniform sampler2D shadow_pass;
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
}`,vS=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],MS=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],I0=new Xe,To=new P,zd=new P;function bS(i,e,t){let n=new Br,s=new de,r=new de,a=new Et,o=new nc,l=new ic,c={},u=t.maxTextureSize,d={[Ai]:Pn,[Pn]:Ai,[Wt]:Wt},f=new Nt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new de},radius:{value:4}},vertexShader:yS,fragmentShader:_S}),h=f.clone();h.defines.HORIZONTAL_PASS=1;let m=new Ht;m.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new I(m,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$s;let g=this.type;this.render=function(S,R,v){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;this.type===Cm&&(ke("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=$s);let w=i.getRenderTarget(),A=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),D=i.state;D.setBlending(Qt),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let H=g!==this.type;H&&R.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(z=>z.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,z=S.length;N<z;N++){let V=S[N],J=V.shadow;if(J===void 0){ke("WebGLShadowMap:",V,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;s.copy(J.mapSize);let ae=J.getFrameExtents();s.multiply(ae),r.copy(J.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ae.x),s.x=r.x*ae.x,J.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ae.y),s.y=r.y*ae.y,J.mapSize.y=r.y));let Y=i.state.buffers.depth.getReversed();if(J.camera._reversedDepth=Y,J.map===null||H===!0){if(J.map!==null&&(J.map.depthTexture!==null&&(J.map.depthTexture.dispose(),J.map.depthTexture=null),J.map.dispose()),this.type===qr){if(V.isPointLight){ke("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}J.map=new Yt(s.x,s.y,{format:ws,type:an,minFilter:Jt,magFilter:Jt,generateMipmaps:!1}),J.map.texture.name=V.name+".shadowMap",J.map.depthTexture=new Ei(s.x,s.y,qn),J.map.depthTexture.name=V.name+".shadowMapDepth",J.map.depthTexture.format=Mi,J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Vt,J.map.depthTexture.magFilter=Vt}else V.isPointLight?(J.map=new sh(s.x),J.map.depthTexture=new Yl(s.x,fi)):(J.map=new Yt(s.x,s.y),J.map.depthTexture=new Ei(s.x,s.y,fi)),J.map.depthTexture.name=V.name+".shadowMap",J.map.depthTexture.format=Mi,this.type===$s?(J.map.depthTexture.compareFunction=Y?th:eh,J.map.depthTexture.minFilter=Jt,J.map.depthTexture.magFilter=Jt):(J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Vt,J.map.depthTexture.magFilter=Vt);J.camera.updateProjectionMatrix()}J.map.isWebGLCubeRenderTarget!==!0&&(J.map.width!==s.x||J.map.height!==s.y)&&J.map.setSize(s.x,s.y);let B=J.map.isWebGLCubeRenderTarget?6:J.getViewportCount();V.isPointLight!==!0&&J.updateMatrices(V,v);for(let re=0;re<B;re++){let Ee=J.getCamera(re);if(V.isPointLight){let Te=J.camera,ht=J.matrix,Ze=V.distance||Te.far;Ze!==Te.far&&(Te.far=Ze,Te.updateProjectionMatrix()),To.setFromMatrixPosition(V.matrixWorld),Te.position.copy(To),zd.copy(Te.position),zd.add(vS[re]),Te.up.copy(MS[re]),Te.lookAt(zd),Te.updateMatrixWorld(),ht.makeTranslation(-To.x,-To.y,-To.z),I0.multiplyMatrices(Te.projectionMatrix,Te.matrixWorldInverse),J._frustum.setFromProjectionMatrix(I0,Te.coordinateSystem,Te.reversedDepth)}if(J.map.isWebGLCubeRenderTarget)i.setRenderTarget(J.map,re),i.clear();else{re===0&&(i.setRenderTarget(J.map),i.clear());let Te=J.getViewport(re);a.set(r.x*Te.x,r.y*Te.y,r.x*Te.z,r.y*Te.w),D.viewport(a)}n=J.getFrustum(re),_(R,v,Ee,V,this.type)}J.isPointLightShadow!==!0&&this.type===qr&&y(J,v),J.needsUpdate=!1}g=this.type,p.needsUpdate=!1,i.setRenderTarget(w,A,L)};function y(S,R){let v=e.update(x);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,h.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,h.needsUpdate=!0),S.mapPass===null?S.mapPass=new Yt(s.x,s.y,{format:ws,type:an}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),f.uniforms.shadow_pass.value=S.map.depthTexture,f.uniforms.resolution.value.set(S.map.width,S.map.height),f.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(R,null,v,f,x,null),h.uniforms.shadow_pass.value=S.mapPass.texture,h.uniforms.resolution.value.set(S.map.width,S.map.height),h.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(R,null,v,h,x,null)}function M(S,R,v,w){let A=null,L=v.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(L!==void 0)A=L;else if(A=v.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let D=A.uuid,H=R.uuid,N=c[D];N===void 0&&(N={},c[D]=N);let z=N[H];z===void 0&&(z=A.clone(),N[H]=z,R.addEventListener("dispose",b)),A=z}if(A.visible=R.visible,A.wireframe=R.wireframe,w===qr?A.side=R.shadowSide!==null?R.shadowSide:R.side:A.side=R.shadowSide!==null?R.shadowSide:d[R.side],A.alphaMap=R.alphaMap,A.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,A.map=R.map,A.clipShadows=R.clipShadows,A.clippingPlanes=R.clippingPlanes,A.clipIntersection=R.clipIntersection,A.displacementMap=R.displacementMap,A.displacementScale=R.displacementScale,A.displacementBias=R.displacementBias,A.wireframeLinewidth=R.wireframeLinewidth,A.linewidth=R.linewidth,v.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let D=i.properties.get(A);D.light=v}return A}function _(S,R,v,w,A){if(S.visible===!1)return;if(S.layers.test(R.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&A===qr)&&(!S.frustumCulled||S.intersectsFrustum(n))){S.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,S.matrixWorld);let H=e.update(S),N=S.material;if(Array.isArray(N)){let z=H.groups;for(let V=0,J=z.length;V<J;V++){let ae=z[V],Y=N[ae.materialIndex];if(Y&&Y.visible){let B=M(S,Y,w,A);S.onBeforeShadow(i,S,R,v,H,B,ae),i.renderBufferDirect(v,null,H,B,S,ae),S.onAfterShadow(i,S,R,v,H,B,ae)}}}else if(N.visible){let z=M(S,N,w,A);S.onBeforeShadow(i,S,R,v,H,z,null),i.renderBufferDirect(v,null,H,z,S,null),S.onAfterShadow(i,S,R,v,H,z,null)}}let D=S.children;for(let H=0,N=D.length;H<N;H++)_(D[H],R,v,w,A)}function b(S){S.target.removeEventListener("dispose",b);for(let v in c){let w=c[v],A=S.target.uuid;A in w&&(w[A].dispose(),delete w[A])}}}function SS(i,e){function t(){let O=!1,_e=new Et,ie=null,xe=new Et(0,0,0,0);return{setMask:function(ve){ie!==ve&&!O&&(i.colorMask(ve,ve,ve,ve),ie=ve)},setLocked:function(ve){O=ve},setClear:function(ve,oe,He,De,Rt){Rt===!0&&(ve*=De,oe*=De,He*=De),_e.set(ve,oe,He,De),xe.equals(_e)===!1&&(i.clearColor(ve,oe,He,De),xe.copy(_e))},reset:function(){O=!1,ie=null,xe.set(-1,0,0,0)}}}function n(){let O=!1,_e=!1,ie=null,xe=null,ve=null;return{setReversed:function(oe){if(_e!==oe){let He=e.get("EXT_clip_control");oe?He.clipControlEXT(He.LOWER_LEFT_EXT,He.ZERO_TO_ONE_EXT):He.clipControlEXT(He.LOWER_LEFT_EXT,He.NEGATIVE_ONE_TO_ONE_EXT),_e=oe;let De=ve;ve=null,this.setClear(De)}},getReversed:function(){return _e},setTest:function(oe){oe?ee(i.DEPTH_TEST):ye(i.DEPTH_TEST)},setMask:function(oe){ie!==oe&&!O&&(i.depthMask(oe),ie=oe)},setFunc:function(oe){if(_e&&(oe=a0[oe]),xe!==oe){switch(oe){case Ul:i.depthFunc(i.NEVER);break;case Fl:i.depthFunc(i.ALWAYS);break;case Ol:i.depthFunc(i.LESS);break;case Pr:i.depthFunc(i.LEQUAL);break;case Bl:i.depthFunc(i.EQUAL);break;case kl:i.depthFunc(i.GEQUAL);break;case Hl:i.depthFunc(i.GREATER);break;case zl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xe=oe}},setLocked:function(oe){O=oe},setClear:function(oe){ve!==oe&&(ve=oe,_e&&(oe=1-oe),i.clearDepth(oe))},reset:function(){O=!1,ie=null,xe=null,ve=null,_e=!1}}}function s(){let O=!1,_e=null,ie=null,xe=null,ve=null,oe=null,He=null,De=null,Rt=null;return{setTest:function(G){O||(G?ee(i.STENCIL_TEST):ye(i.STENCIL_TEST))},setMask:function(G){_e!==G&&!O&&(i.stencilMask(G),_e=G)},setFunc:function(G,ne,ue){(ie!==G||xe!==ne||ve!==ue)&&(i.stencilFunc(G,ne,ue),ie=G,xe=ne,ve=ue)},setOp:function(G,ne,ue){(oe!==G||He!==ne||De!==ue)&&(i.stencilOp(G,ne,ue),oe=G,He=ne,De=ue)},setLocked:function(G){O=G},setClear:function(G){Rt!==G&&(i.clearStencil(G),Rt=G)},reset:function(){O=!1,_e=null,ie=null,xe=null,ve=null,oe=null,He=null,De=null,Rt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,u={},d={},f={},h=new WeakMap,m=[],x=null,p=!1,g=null,y=null,M=null,_=null,b=null,S=null,R=null,v=new Pe(0,0,0),w=0,A=!1,L=null,D=null,H=null,N=null,z=null,V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),J=!1,ae=0,Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(ae=parseFloat(/^WebGL (\d)/.exec(Y)[1]),J=ae>=1):Y.indexOf("OpenGL ES")!==-1&&(ae=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),J=ae>=2);let B=null,re={},Ee=i.getParameter(i.SCISSOR_BOX),Te=i.getParameter(i.VIEWPORT),ht=new Et().fromArray(Ee),Ze=new Et().fromArray(Te);function it(O,_e,ie,xe){let ve=new Uint8Array(4),oe=i.createTexture();i.bindTexture(O,oe),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let He=0;He<ie;He++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(_e,0,i.RGBA,1,1,xe,0,i.RGBA,i.UNSIGNED_BYTE,ve):i.texImage2D(_e+He,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ve);return oe}let Z={};Z[i.TEXTURE_2D]=it(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=it(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=it(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=it(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(i.DEPTH_TEST),a.setFunc(Pr),Je(!1),gt(ld),ee(i.CULL_FACE),at(Qt);function ee(O){u[O]!==!0&&(i.enable(O),u[O]=!0)}function ye(O){u[O]!==!1&&(i.disable(O),u[O]=!1)}function ze(O,_e){return f[O]!==_e?(i.bindFramebuffer(O,_e),f[O]=_e,O===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=_e),O===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=_e),!0):!1}function we(O,_e){let ie=m,xe=!1;if(O){ie=h.get(_e),ie===void 0&&(ie=[],h.set(_e,ie));let ve=O.textures;if(ie.length!==ve.length||ie[0]!==i.COLOR_ATTACHMENT0){for(let oe=0,He=ve.length;oe<He;oe++)ie[oe]=i.COLOR_ATTACHMENT0+oe;ie.length=ve.length,xe=!0}}else ie[0]!==i.BACK&&(ie[0]=i.BACK,xe=!0);xe&&i.drawBuffers(ie)}function Ke(O){return x!==O?(i.useProgram(O),x=O,!0):!1}let Ft={[Qn]:i.FUNC_ADD,[Pm]:i.FUNC_SUBTRACT,[Im]:i.FUNC_REVERSE_SUBTRACT};Ft[Lm]=i.MIN,Ft[Dm]=i.MAX;let je={[Zs]:i.ZERO,[Nm]:i.ONE,[Um]:i.SRC_COLOR,[ud]:i.SRC_ALPHA,[km]:i.SRC_ALPHA_SATURATE,[lo]:i.DST_COLOR,[oo]:i.DST_ALPHA,[Fm]:i.ONE_MINUS_SRC_COLOR,[dd]:i.ONE_MINUS_SRC_ALPHA,[Bm]:i.ONE_MINUS_DST_COLOR,[Om]:i.ONE_MINUS_DST_ALPHA,[Hm]:i.CONSTANT_COLOR,[zm]:i.ONE_MINUS_CONSTANT_COLOR,[Gm]:i.CONSTANT_ALPHA,[Vm]:i.ONE_MINUS_CONSTANT_ALPHA};function at(O,_e,ie,xe,ve,oe,He,De,Rt,G){if(O===Qt){p===!0&&(ye(i.BLEND),p=!1);return}if(p===!1&&(ee(i.BLEND),p=!0),O!==pc){if(O!==g||G!==A){if((y!==Qn||b!==Qn)&&(i.blendEquation(i.FUNC_ADD),y=Qn,b=Qn),G)switch(O){case Yr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ao:i.blendFunc(i.ONE,i.ONE);break;case cd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case hd:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ye("WebGLState: Invalid blending: ",O);break}else switch(O){case Yr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ao:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case cd:Ye("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case hd:Ye("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ye("WebGLState: Invalid blending: ",O);break}M=null,_=null,S=null,R=null,v.set(0,0,0),w=0,g=O,A=G}return}ve=ve||_e,oe=oe||ie,He=He||xe,(_e!==y||ve!==b)&&(i.blendEquationSeparate(Ft[_e],Ft[ve]),y=_e,b=ve),(ie!==M||xe!==_||oe!==S||He!==R)&&(i.blendFuncSeparate(je[ie],je[xe],je[oe],je[He]),M=ie,_=xe,S=oe,R=He),(De.equals(v)===!1||Rt!==w)&&(i.blendColor(De.r,De.g,De.b,Rt),v.copy(De),w=Rt),g=O,A=!1}function mt(O,_e){O.side===Wt?ye(i.CULL_FACE):ee(i.CULL_FACE);let ie=O.side===Pn;_e&&(ie=!ie),Je(ie),O.blending===Yr&&O.transparent===!1?at(Qt):at(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);let xe=O.stencilWrite;o.setTest(xe),xe&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Kt(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?ee(i.SAMPLE_ALPHA_TO_COVERAGE):ye(i.SAMPLE_ALPHA_TO_COVERAGE)}function Je(O){L!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),L=O)}function gt(O){O!==Rm?(ee(i.CULL_FACE),O!==D&&(O===ld?i.cullFace(i.BACK):O===Am?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ye(i.CULL_FACE),D=O}function Pt(O){O!==H&&(J&&i.lineWidth(O),H=O)}function Kt(O,_e,ie){O?(ee(i.POLYGON_OFFSET_FILL),(N!==_e||z!==ie)&&(N=_e,z=ie,a.getReversed()&&(_e=-_e),i.polygonOffset(_e,ie))):ye(i.POLYGON_OFFSET_FILL)}function _t(O){O?ee(i.SCISSOR_TEST):ye(i.SCISSOR_TEST)}function Tt(O){O===void 0&&(O=i.TEXTURE0+V-1),B!==O&&(i.activeTexture(O),B=O)}function U(O,_e,ie){ie===void 0&&(B===null?ie=i.TEXTURE0+V-1:ie=B);let xe=re[ie];xe===void 0&&(xe={type:void 0,texture:void 0},re[ie]=xe),(xe.type!==O||xe.texture!==_e)&&(B!==ie&&(i.activeTexture(ie),B=ie),i.bindTexture(O,_e||Z[O]),xe.type=O,xe.texture=_e)}function Xt(){let O=re[B];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function ct(){try{i.compressedTexImage2D(...arguments)}catch(O){Ye("WebGLState:",O)}}function C(){try{i.compressedTexImage3D(...arguments)}catch(O){Ye("WebGLState:",O)}}function E(){try{i.texSubImage2D(...arguments)}catch(O){Ye("WebGLState:",O)}}function k(){try{i.texSubImage3D(...arguments)}catch(O){Ye("WebGLState:",O)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(O){Ye("WebGLState:",O)}}function K(){try{i.compressedTexSubImage3D(...arguments)}catch(O){Ye("WebGLState:",O)}}function ce(){try{i.texStorage2D(...arguments)}catch(O){Ye("WebGLState:",O)}}function me(){try{i.texStorage3D(...arguments)}catch(O){Ye("WebGLState:",O)}}function Q(){try{i.texImage2D(...arguments)}catch(O){Ye("WebGLState:",O)}}function te(){try{i.texImage3D(...arguments)}catch(O){Ye("WebGLState:",O)}}function pe(O){return d[O]!==void 0?d[O]:i.getParameter(O)}function Ie(O,_e){d[O]!==_e&&(i.pixelStorei(O,_e),d[O]=_e)}function ge(O){ht.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),ht.copy(O))}function fe(O){Ze.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),Ze.copy(O))}function Le(O,_e){let ie=c.get(_e);ie===void 0&&(ie=new WeakMap,c.set(_e,ie));let xe=ie.get(O);xe===void 0&&(xe=i.getUniformBlockIndex(_e,O.name),ie.set(O,xe))}function Ne(O,_e){let xe=c.get(_e).get(O);l.get(_e)!==xe&&(i.uniformBlockBinding(_e,xe,O.__bindingPointIndex),l.set(_e,xe))}function We(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},B=null,re={},f={},h=new WeakMap,m=[],x=null,p=!1,g=null,y=null,M=null,_=null,b=null,S=null,R=null,v=new Pe(0,0,0),w=0,A=!1,L=null,D=null,H=null,N=null,z=null,ht.set(0,0,i.canvas.width,i.canvas.height),Ze.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ee,disable:ye,bindFramebuffer:ze,drawBuffers:we,useProgram:Ke,setBlending:at,setMaterial:mt,setFlipSided:Je,setCullFace:gt,setLineWidth:Pt,setPolygonOffset:Kt,setScissorTest:_t,activeTexture:Tt,bindTexture:U,unbindTexture:Xt,compressedTexImage2D:ct,compressedTexImage3D:C,texImage2D:Q,texImage3D:te,pixelStorei:Ie,getParameter:pe,updateUBOMapping:Le,uniformBlockBinding:Ne,texStorage2D:ce,texStorage3D:me,texSubImage2D:E,texSubImage3D:k,compressedTexSubImage2D:W,compressedTexSubImage3D:K,scissor:ge,viewport:fe,reset:We}}function ES(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new de,u=new WeakMap,d=new Set,f,h=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,E){return m?new OffscreenCanvas(C,E):Dr("canvas")}function p(C,E,k){let W=1,K=ct(C);if((K.width>k||K.height>k)&&(W=k/Math.max(K.width,K.height)),W<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let ce=Math.floor(W*K.width),me=Math.floor(W*K.height);f===void 0&&(f=x(ce,me));let Q=E?x(ce,me):f;return Q.width=ce,Q.height=me,Q.getContext("2d").drawImage(C,0,0,ce,me),ke("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+ce+"x"+me+")."),Q}else return"data"in C&&ke("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),C;return C}function g(C){return C.generateMipmaps}function y(C){i.generateMipmap(C)}function M(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(C,E,k,W,K,ce=!1){if(C!==null){if(i[C]!==void 0)return i[C];ke("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let me;W&&(me=e.get("EXT_texture_norm16"),me||ke("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Q=E;if(E===i.RED&&(k===i.FLOAT&&(Q=i.R32F),k===i.HALF_FLOAT&&(Q=i.R16F),k===i.UNSIGNED_BYTE&&(Q=i.R8),k===i.UNSIGNED_SHORT&&me&&(Q=me.R16_EXT),k===i.SHORT&&me&&(Q=me.R16_SNORM_EXT)),E===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(Q=i.R8UI),k===i.UNSIGNED_SHORT&&(Q=i.R16UI),k===i.UNSIGNED_INT&&(Q=i.R32UI),k===i.BYTE&&(Q=i.R8I),k===i.SHORT&&(Q=i.R16I),k===i.INT&&(Q=i.R32I)),E===i.RG&&(k===i.FLOAT&&(Q=i.RG32F),k===i.HALF_FLOAT&&(Q=i.RG16F),k===i.UNSIGNED_BYTE&&(Q=i.RG8),k===i.UNSIGNED_SHORT&&me&&(Q=me.RG16_EXT),k===i.SHORT&&me&&(Q=me.RG16_SNORM_EXT)),E===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(Q=i.RG8UI),k===i.UNSIGNED_SHORT&&(Q=i.RG16UI),k===i.UNSIGNED_INT&&(Q=i.RG32UI),k===i.BYTE&&(Q=i.RG8I),k===i.SHORT&&(Q=i.RG16I),k===i.INT&&(Q=i.RG32I)),E===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),k===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),k===i.UNSIGNED_INT&&(Q=i.RGB32UI),k===i.BYTE&&(Q=i.RGB8I),k===i.SHORT&&(Q=i.RGB16I),k===i.INT&&(Q=i.RGB32I)),E===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),k===i.UNSIGNED_INT&&(Q=i.RGBA32UI),k===i.BYTE&&(Q=i.RGBA8I),k===i.SHORT&&(Q=i.RGBA16I),k===i.INT&&(Q=i.RGBA32I)),E===i.RGB&&(k===i.UNSIGNED_SHORT&&me&&(Q=me.RGB16_EXT),k===i.SHORT&&me&&(Q=me.RGB16_SNORM_EXT),k===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),k===i.UNSIGNED_INT_10F_11F_11F_REV&&(Q=i.R11F_G11F_B10F)),E===i.RGBA){let te=ce?Ia:et.getTransfer(K);k===i.FLOAT&&(Q=i.RGBA32F),k===i.HALF_FLOAT&&(Q=i.RGBA16F),k===i.UNSIGNED_BYTE&&(Q=te===yt?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT&&me&&(Q=me.RGBA16_EXT),k===i.SHORT&&me&&(Q=me.RGBA16_SNORM_EXT),k===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function b(C,E){let k;return C?E===null||E===fi||E===Es?k=i.DEPTH24_STENCIL8:E===qn?k=i.DEPTH32F_STENCIL8:E===Zr&&(k=i.DEPTH24_STENCIL8,ke("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===fi||E===Es?k=i.DEPTH_COMPONENT24:E===qn?k=i.DEPTH_COMPONENT32F:E===Zr&&(k=i.DEPTH_COMPONENT16),k}function S(C,E){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Vt&&C.minFilter!==Jt?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function R(C){let E=C.target;E.removeEventListener("dispose",R),w(E),E.isVideoTexture&&u.delete(E),E.isHTMLTexture&&d.delete(E)}function v(C){let E=C.target;E.removeEventListener("dispose",v),L(E)}function w(C){let E=n.get(C);if(E.__webglInit===void 0)return;let k=C.source,W=h.get(k);if(W){let K=W[E.__cacheKey];K.usedTimes--,K.usedTimes===0&&A(C),Object.keys(W).length===0&&h.delete(k)}n.remove(C)}function A(C){let E=n.get(C);i.deleteTexture(E.__webglTexture);let k=C.source,W=h.get(k);delete W[E.__cacheKey],a.memory.textures--}function L(C){let E=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(E.__webglFramebuffer[W]))for(let K=0;K<E.__webglFramebuffer[W].length;K++)i.deleteFramebuffer(E.__webglFramebuffer[W][K]);else i.deleteFramebuffer(E.__webglFramebuffer[W]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[W])}else{if(Array.isArray(E.__webglFramebuffer))for(let W=0;W<E.__webglFramebuffer.length;W++)i.deleteFramebuffer(E.__webglFramebuffer[W]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let W=0;W<E.__webglColorRenderbuffer.length;W++)E.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[W]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let k=C.textures;for(let W=0,K=k.length;W<K;W++){let ce=n.get(k[W]);ce.__webglTexture&&(i.deleteTexture(ce.__webglTexture),a.memory.textures--),n.remove(k[W])}n.remove(C)}let D=0;function H(){D=0}function N(){return D}function z(C){D=C}function V(){let C=D;return C>=s.maxTextures&&ke("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),D+=1,C}function J(C){let E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function ae(C,E){let k=n.get(C);if(C.isVideoTexture&&U(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&k.__version!==C.version){let W=C.image;if(W===null)ke("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)ke("WebGLRenderer: Texture marked for update but image is incomplete");else{ye(k,C,E);return}}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+E)}function Y(C,E){let k=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){ye(k,C,E);return}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+E)}function B(C,E){let k=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){ye(k,C,E);return}t.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+E)}function re(C,E){let k=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&k.__version!==C.version){ze(k,C,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+E)}let Ee={[on]:i.REPEAT,[jt]:i.CLAMP_TO_EDGE,[Ir]:i.MIRRORED_REPEAT},Te={[Vt]:i.NEAREST,[gc]:i.NEAREST_MIPMAP_NEAREST,[Qs]:i.NEAREST_MIPMAP_LINEAR,[Jt]:i.LINEAR,[$r]:i.LINEAR_MIPMAP_NEAREST,[di]:i.LINEAR_MIPMAP_LINEAR},ht={[jm]:i.NEVER,[n0]:i.ALWAYS,[Jm]:i.LESS,[eh]:i.LEQUAL,[Qm]:i.EQUAL,[th]:i.GEQUAL,[e0]:i.GREATER,[t0]:i.NOTEQUAL};function Ze(C,E){if(E.type===qn&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Jt||E.magFilter===$r||E.magFilter===Qs||E.magFilter===di||E.minFilter===Jt||E.minFilter===$r||E.minFilter===Qs||E.minFilter===di)&&ke("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,Ee[E.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,Ee[E.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,Ee[E.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,Te[E.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,Te[E.minFilter]),E.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,ht[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Vt||E.minFilter!==Qs&&E.minFilter!==di||E.type===qn&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let k=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function it(C,E){let k=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",R));let W=E.source,K=h.get(W);K===void 0&&(K={},h.set(W,K));let ce=J(E);if(ce!==C.__cacheKey){K[ce]===void 0&&(K[ce]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,k=!0),K[ce].usedTimes++;let me=K[C.__cacheKey];me!==void 0&&(K[C.__cacheKey].usedTimes--,me.usedTimes===0&&A(E)),C.__cacheKey=ce,C.__webglTexture=K[ce].texture}return k}function Z(C,E,k){return Math.floor(Math.floor(C/k)/E)}function ee(C,E,k,W){let ce=C.updateRanges;if(ce.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,E.width,E.height,k,W,E.data);else{ce.sort((Ie,ge)=>Ie.start-ge.start);let me=0;for(let Ie=1;Ie<ce.length;Ie++){let ge=ce[me],fe=ce[Ie],Le=ge.start+ge.count,Ne=Z(fe.start,E.width,4),We=Z(ge.start,E.width,4);fe.start<=Le+1&&Ne===We&&Z(fe.start+fe.count-1,E.width,4)===Ne?ge.count=Math.max(ge.count,fe.start+fe.count-ge.start):(++me,ce[me]=fe)}ce.length=me+1;let Q=t.getParameter(i.UNPACK_ROW_LENGTH),te=t.getParameter(i.UNPACK_SKIP_PIXELS),pe=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,E.width);for(let Ie=0,ge=ce.length;Ie<ge;Ie++){let fe=ce[Ie],Le=Math.floor(fe.start/4),Ne=Math.ceil(fe.count/4),We=Le%E.width,O=Math.floor(Le/E.width),_e=Ne,ie=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,We),t.pixelStorei(i.UNPACK_SKIP_ROWS,O),t.texSubImage2D(i.TEXTURE_2D,0,We,O,_e,ie,k,W,E.data)}C.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Q),t.pixelStorei(i.UNPACK_SKIP_PIXELS,te),t.pixelStorei(i.UNPACK_SKIP_ROWS,pe)}}function ye(C,E,k){let W=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(W=i.TEXTURE_3D);let K=it(C,E),ce=E.source;t.bindTexture(W,C.__webglTexture,i.TEXTURE0+k);let me=n.get(ce);if(ce.version!==me.__version||K===!0){if(t.activeTexture(i.TEXTURE0+k),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){let ie=et.getPrimaries(et.workingColorSpace),xe=E.colorSpace===pi?null:et.getPrimaries(E.colorSpace),ve=E.colorSpace===pi||ie===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve)}t.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment);let te=p(E.image,!1,s.maxTextureSize);te=Xt(E,te);let pe=r.convert(E.format,E.colorSpace),Ie=r.convert(E.type),ge=_(E.internalFormat,pe,Ie,E.normalized,E.colorSpace,E.isVideoTexture);Ze(W,E);let fe,Le=E.mipmaps,Ne=E.isVideoTexture!==!0,We=me.__version===void 0||K===!0,O=ce.dataReady,_e=S(E,te);if(E.isDepthTexture)ge=b(E.format===Ci,E.type),We&&(Ne?t.texStorage2D(i.TEXTURE_2D,1,ge,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,ge,te.width,te.height,0,pe,Ie,null));else if(E.isDataTexture)if(Le.length>0){Ne&&We&&t.texStorage2D(i.TEXTURE_2D,_e,ge,Le[0].width,Le[0].height);for(let ie=0,xe=Le.length;ie<xe;ie++)fe=Le[ie],Ne?O&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,fe.width,fe.height,pe,Ie,fe.data):t.texImage2D(i.TEXTURE_2D,ie,ge,fe.width,fe.height,0,pe,Ie,fe.data);E.generateMipmaps=!1}else Ne?(We&&t.texStorage2D(i.TEXTURE_2D,_e,ge,te.width,te.height),O&&ee(E,te,pe,Ie)):t.texImage2D(i.TEXTURE_2D,0,ge,te.width,te.height,0,pe,Ie,te.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Ne&&We&&t.texStorage3D(i.TEXTURE_2D_ARRAY,_e,ge,Le[0].width,Le[0].height,te.depth);for(let ie=0,xe=Le.length;ie<xe;ie++)if(fe=Le[ie],E.format!==In)if(pe!==null)if(Ne){if(O)if(E.layerUpdates.size>0){let ve=Pd(fe.width,fe.height,E.format,E.type);for(let oe of E.layerUpdates){let He=fe.data.subarray(oe*ve/fe.data.BYTES_PER_ELEMENT,(oe+1)*ve/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,oe,fe.width,fe.height,1,pe,He)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,fe.width,fe.height,te.depth,pe,fe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ie,ge,fe.width,fe.height,te.depth,0,fe.data,0,0);else ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?O&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,fe.width,fe.height,te.depth,pe,Ie,fe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ie,ge,fe.width,fe.height,te.depth,0,pe,Ie,fe.data);E.layerUpdates.size>0&&E.clearLayerUpdates()}else{Ne&&We&&t.texStorage2D(i.TEXTURE_2D,_e,ge,Le[0].width,Le[0].height);for(let ie=0,xe=Le.length;ie<xe;ie++)fe=Le[ie],E.format!==In?pe!==null?Ne?O&&t.compressedTexSubImage2D(i.TEXTURE_2D,ie,0,0,fe.width,fe.height,pe,fe.data):t.compressedTexImage2D(i.TEXTURE_2D,ie,ge,fe.width,fe.height,0,fe.data):ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?O&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,fe.width,fe.height,pe,Ie,fe.data):t.texImage2D(i.TEXTURE_2D,ie,ge,fe.width,fe.height,0,pe,Ie,fe.data)}else if(E.isDataArrayTexture)if(Ne){if(We&&t.texStorage3D(i.TEXTURE_2D_ARRAY,_e,ge,te.width,te.height,te.depth),O)if(E.layerUpdates.size>0){let ie=Pd(te.width,te.height,E.format,E.type);for(let xe of E.layerUpdates){let ve=te.data.subarray(xe*ie/te.data.BYTES_PER_ELEMENT,(xe+1)*ie/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,xe,te.width,te.height,1,pe,Ie,ve)}E.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,pe,Ie,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ge,te.width,te.height,te.depth,0,pe,Ie,te.data);else if(E.isData3DTexture)Ne?(We&&t.texStorage3D(i.TEXTURE_3D,_e,ge,te.width,te.height,te.depth),O&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,pe,Ie,te.data)):t.texImage3D(i.TEXTURE_3D,0,ge,te.width,te.height,te.depth,0,pe,Ie,te.data);else if(E.isFramebufferTexture){if(We)if(Ne)t.texStorage2D(i.TEXTURE_2D,_e,ge,te.width,te.height);else{let ie=te.width,xe=te.height;for(let ve=0;ve<_e;ve++)t.texImage2D(i.TEXTURE_2D,ve,ge,ie,xe,0,pe,Ie,null),ie>>=1,xe>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in i){let ie=i.canvas;if(ie.hasAttribute("layoutsubtree")||ie.setAttribute("layoutsubtree","true"),te.parentNode!==ie){ie.appendChild(te),d.add(E),ie.onpaint=xe=>{let ve=xe.changedElements;for(let oe of d)ve.includes(oe.image)&&(oe.needsUpdate=!0)},ie.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,te);else{let ve=i.RGBA,oe=i.RGBA,He=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,ve,oe,He,te)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Le.length>0){if(Ne&&We){let ie=ct(Le[0]);t.texStorage2D(i.TEXTURE_2D,_e,ge,ie.width,ie.height)}for(let ie=0,xe=Le.length;ie<xe;ie++)fe=Le[ie],Ne?O&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,pe,Ie,fe):t.texImage2D(i.TEXTURE_2D,ie,ge,pe,Ie,fe);E.generateMipmaps=!1}else if(Ne){if(We){let ie=ct(te);t.texStorage2D(i.TEXTURE_2D,_e,ge,ie.width,ie.height)}O&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,pe,Ie,te)}else t.texImage2D(i.TEXTURE_2D,0,ge,pe,Ie,te);g(E)&&y(W),me.__version=ce.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function ze(C,E,k){if(E.image.length!==6)return;let W=it(C,E),K=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+k);let ce=n.get(K);if(K.version!==ce.__version||W===!0){t.activeTexture(i.TEXTURE0+k);let me=et.getPrimaries(et.workingColorSpace),Q=E.colorSpace===pi?null:et.getPrimaries(E.colorSpace),te=E.colorSpace===pi||me===Q?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let pe=E.isCompressedTexture||E.image[0].isCompressedTexture,Ie=E.image[0]&&E.image[0].isDataTexture,ge=[];for(let oe=0;oe<6;oe++)!pe&&!Ie?ge[oe]=p(E.image[oe],!0,s.maxCubemapSize):ge[oe]=Ie?E.image[oe].image:E.image[oe],ge[oe]=Xt(E,ge[oe]);let fe=ge[0],Le=r.convert(E.format,E.colorSpace),Ne=r.convert(E.type),We=_(E.internalFormat,Le,Ne,E.normalized,E.colorSpace),O=E.isVideoTexture!==!0,_e=ce.__version===void 0||W===!0,ie=K.dataReady,xe=S(E,fe);Ze(i.TEXTURE_CUBE_MAP,E);let ve;if(pe){O&&_e&&t.texStorage2D(i.TEXTURE_CUBE_MAP,xe,We,fe.width,fe.height);for(let oe=0;oe<6;oe++){ve=ge[oe].mipmaps;for(let He=0;He<ve.length;He++){let De=ve[He];E.format!==In?Le!==null?O?ie&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,He,0,0,De.width,De.height,Le,De.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,He,We,De.width,De.height,0,De.data):ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?ie&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,He,0,0,De.width,De.height,Le,Ne,De.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,He,We,De.width,De.height,0,Le,Ne,De.data)}}}else{if(ve=E.mipmaps,O&&_e){ve.length>0&&xe++;let oe=ct(ge[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,xe,We,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(Ie){O?ie&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,ge[oe].width,ge[oe].height,Le,Ne,ge[oe].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,We,ge[oe].width,ge[oe].height,0,Le,Ne,ge[oe].data);for(let He=0;He<ve.length;He++){let Rt=ve[He].image[oe].image;O?ie&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,He+1,0,0,Rt.width,Rt.height,Le,Ne,Rt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,He+1,We,Rt.width,Rt.height,0,Le,Ne,Rt.data)}}else{O?ie&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Le,Ne,ge[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,We,Le,Ne,ge[oe]);for(let He=0;He<ve.length;He++){let De=ve[He];O?ie&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,He+1,0,0,Le,Ne,De.image[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,He+1,We,Le,Ne,De.image[oe])}}}g(E)&&y(i.TEXTURE_CUBE_MAP),ce.__version=K.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function we(C,E,k,W,K,ce){let me=r.convert(k.format,k.colorSpace),Q=r.convert(k.type),te=_(k.internalFormat,me,Q,k.normalized,k.colorSpace),pe=n.get(E),Ie=n.get(k);if(Ie.__renderTarget=E,!pe.__hasExternalTextures){let ge=Math.max(1,E.width>>ce),fe=Math.max(1,E.height>>ce);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?t.texImage3D(K,ce,te,ge,fe,E.depth,0,me,Q,null):t.texImage2D(K,ce,te,ge,fe,0,me,Q,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),Tt(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,K,Ie.__webglTexture,0,_t(E)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,K,Ie.__webglTexture,ce),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ke(C,E,k){if(i.bindRenderbuffer(i.RENDERBUFFER,C),E.depthBuffer){let W=E.depthTexture,K=W&&W.isDepthTexture?W.type:null,ce=b(E.stencilBuffer,K),me=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Tt(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,_t(E),ce,E.width,E.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,_t(E),ce,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,ce,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,me,i.RENDERBUFFER,C)}else{let W=E.textures;for(let K=0;K<W.length;K++){let ce=W[K],me=r.convert(ce.format,ce.colorSpace),Q=r.convert(ce.type),te=_(ce.internalFormat,me,Q,ce.normalized,ce.colorSpace);Tt(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,_t(E),te,E.width,E.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,_t(E),te,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,te,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ft(C,E,k){let W=E.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let K=n.get(E.depthTexture);if(K.__renderTarget=E,(!K.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),W){if(K.__webglInit===void 0&&(K.__webglInit=!0,E.depthTexture.addEventListener("dispose",R)),K.__webglTexture===void 0){K.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),Ze(i.TEXTURE_CUBE_MAP,E.depthTexture);let pe=r.convert(E.depthTexture.format),Ie=r.convert(E.depthTexture.type),ge;E.depthTexture.format===Mi?ge=i.DEPTH_COMPONENT24:E.depthTexture.format===Ci&&(ge=i.DEPTH24_STENCIL8);for(let fe=0;fe<6;fe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,ge,E.width,E.height,0,pe,Ie,null)}}else ae(E.depthTexture,0);let ce=K.__webglTexture,me=_t(E),Q=W?i.TEXTURE_CUBE_MAP_POSITIVE_X+k:i.TEXTURE_2D,te=E.depthTexture.format===Ci?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(E.depthTexture.format===Mi)Tt(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Q,ce,0,me):i.framebufferTexture2D(i.FRAMEBUFFER,te,Q,ce,0);else if(E.depthTexture.format===Ci)Tt(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Q,ce,0,me):i.framebufferTexture2D(i.FRAMEBUFFER,te,Q,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function je(C){let E=n.get(C),k=C.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==C.depthTexture){let W=C.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),W){let K=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,W.removeEventListener("dispose",K)};W.addEventListener("dispose",K),E.__depthDisposeCallback=K}E.__boundDepthTexture=W}if(C.depthTexture&&!E.__autoAllocateDepthBuffer)if(k)for(let W=0;W<6;W++)Ft(E.__webglFramebuffer[W],C,W);else{let W=C.texture.mipmaps;W&&W.length>0?Ft(E.__webglFramebuffer[0],C,0):Ft(E.__webglFramebuffer,C,0)}else if(k){E.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[W]),E.__webglDepthbuffer[W]===void 0)E.__webglDepthbuffer[W]=i.createRenderbuffer(),Ke(E.__webglDepthbuffer[W],C,!1);else{let K=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=E.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,ce),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,ce)}}else{let W=C.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),Ke(E.__webglDepthbuffer,C,!1);else{let K=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ce),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,ce)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function at(C,E,k){let W=n.get(C);E!==void 0&&we(W.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&je(C)}function mt(C){let E=C.texture,k=n.get(C),W=n.get(E);C.addEventListener("dispose",v);let K=C.textures,ce=C.isWebGLCubeRenderTarget===!0,me=K.length>1;if(me||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=E.version,a.memory.textures++),ce){k.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer[Q]=[];for(let te=0;te<E.mipmaps.length;te++)k.__webglFramebuffer[Q][te]=i.createFramebuffer()}else k.__webglFramebuffer[Q]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer=[];for(let Q=0;Q<E.mipmaps.length;Q++)k.__webglFramebuffer[Q]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(me)for(let Q=0,te=K.length;Q<te;Q++){let pe=n.get(K[Q]);pe.__webglTexture===void 0&&(pe.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&Tt(C)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Q=0;Q<K.length;Q++){let te=K[Q];k.__webglColorRenderbuffer[Q]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[Q]);let pe=r.convert(te.format,te.colorSpace),Ie=r.convert(te.type),ge=_(te.internalFormat,pe,Ie,te.normalized,te.colorSpace,C.isXRRenderTarget===!0),fe=_t(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,ge,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.RENDERBUFFER,k.__webglColorRenderbuffer[Q])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),Ke(k.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ce){t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),Ze(i.TEXTURE_CUBE_MAP,E);for(let Q=0;Q<6;Q++)if(E.mipmaps&&E.mipmaps.length>0)for(let te=0;te<E.mipmaps.length;te++)we(k.__webglFramebuffer[Q][te],C,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,te);else we(k.__webglFramebuffer[Q],C,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);g(E)&&y(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(me){for(let Q=0,te=K.length;Q<te;Q++){let pe=K[Q],Ie=n.get(pe),ge=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ge=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ge,Ie.__webglTexture),Ze(ge,pe),we(k.__webglFramebuffer,C,pe,i.COLOR_ATTACHMENT0+Q,ge,0),g(pe)&&y(ge)}t.unbindTexture()}else{let Q=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Q=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Q,W.__webglTexture),Ze(Q,E),E.mipmaps&&E.mipmaps.length>0)for(let te=0;te<E.mipmaps.length;te++)we(k.__webglFramebuffer[te],C,E,i.COLOR_ATTACHMENT0,Q,te);else we(k.__webglFramebuffer,C,E,i.COLOR_ATTACHMENT0,Q,0);g(E)&&y(Q),t.unbindTexture()}C.depthBuffer&&je(C)}function Je(C){let E=C.textures;for(let k=0,W=E.length;k<W;k++){let K=E[k];if(g(K)){let ce=M(C),me=n.get(K).__webglTexture;t.bindTexture(ce,me),y(ce),t.unbindTexture()}}}let gt=[],Pt=[];function Kt(C){if(C.samples>0){if(Tt(C)===!1){let E=C.textures,k=C.width,W=C.height,K=i.COLOR_BUFFER_BIT,ce=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=n.get(C),Q=E.length>1;if(Q)for(let pe=0;pe<E.length;pe++)t.bindFramebuffer(i.FRAMEBUFFER,me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer);let te=C.texture.mipmaps;te&&te.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let pe=0;pe<E.length;pe++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),Q){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,me.__webglColorRenderbuffer[pe]);let Ie=n.get(E[pe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ie,0)}i.blitFramebuffer(0,0,k,W,0,0,k,W,K,i.NEAREST),l===!0&&(gt.length=0,Pt.length=0,gt.push(i.COLOR_ATTACHMENT0+pe),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(gt.push(ce),Pt.push(ce),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Pt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,gt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Q)for(let pe=0;pe<E.length;pe++){t.bindFramebuffer(i.FRAMEBUFFER,me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,me.__webglColorRenderbuffer[pe]);let Ie=n.get(E[pe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,Ie,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let E=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function _t(C){return Math.min(s.maxSamples,C.samples)}function Tt(C){let E=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function U(C){let E=a.render.frame;u.get(C)!==E&&(u.set(C,E),C.update())}function Xt(C,E){let k=C.colorSpace,W=C.format,K=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||k!==Cn&&k!==pi&&(et.getTransfer(k)===yt?(W!==In||K!==En)&&ke("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ye("WebGLTextures: Unsupported texture color space:",k)),E}function ct(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=H,this.getTextureUnits=N,this.setTextureUnits=z,this.setTexture2D=ae,this.setTexture2DArray=Y,this.setTexture3D=B,this.setTextureCube=re,this.rebindTextures=at,this.setupRenderTarget=mt,this.updateRenderTargetMipmap=Je,this.updateMultisampleRenderTarget=Kt,this.setupDepthRenderbuffer=je,this.setupFrameBufferTexture=we,this.useMultisampledRTT=Tt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function wS(i,e){function t(n,s=pi){let r,a=et.getTransfer(s);if(n===En)return i.UNSIGNED_BYTE;if(n===yc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===_c)return i.UNSIGNED_SHORT_5_5_5_1;if(n===xd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===yd)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===md)return i.BYTE;if(n===gd)return i.SHORT;if(n===Zr)return i.UNSIGNED_SHORT;if(n===xc)return i.INT;if(n===fi)return i.UNSIGNED_INT;if(n===qn)return i.FLOAT;if(n===an)return i.HALF_FLOAT;if(n===_d)return i.ALPHA;if(n===vd)return i.RGB;if(n===In)return i.RGBA;if(n===Mi)return i.DEPTH_COMPONENT;if(n===Ci)return i.DEPTH_STENCIL;if(n===vc)return i.RED;if(n===Mc)return i.RED_INTEGER;if(n===ws)return i.RG;if(n===bc)return i.RG_INTEGER;if(n===Sc)return i.RGBA_INTEGER;if(n===xo||n===yo||n===_o||n===vo)if(a===yt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===xo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===yo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===_o)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===vo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===xo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===yo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===_o)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===vo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ec||n===wc||n===Tc||n===Rc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ec)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===wc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Tc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Rc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ac||n===Cc||n===Pc||n===Ic||n===Lc||n===Mo||n===Dc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ac||n===Cc)return a===yt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Pc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ic)return r.COMPRESSED_R11_EAC;if(n===Lc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Mo)return r.COMPRESSED_RG11_EAC;if(n===Dc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Nc||n===Uc||n===Fc||n===Oc||n===Bc||n===kc||n===Hc||n===zc||n===Gc||n===Vc||n===Wc||n===Xc||n===qc||n===Yc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Nc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Uc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Fc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Oc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Bc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===kc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Hc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===zc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Gc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Vc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Wc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Xc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===qc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Yc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Kc||n===$c||n===Zc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Kc)return a===yt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===$c)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Zc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===jc||n===Jc||n===bo||n===Qc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===jc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Jc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===bo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Qc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Es?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var TS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,RS=`
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

}`,$d=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new qa(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Nt({vertexShader:TS,fragmentShader:RS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new I(new rt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Zd=class extends bi{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,f=null,h=null,m=null,x=typeof XRWebGLBinding<"u",p=new $d,g={},y=t.getContextAttributes(),M=null,_=null,b=[],S=[],R=new de,v=null,w=null,A=new sn;A.viewport=new Et;let L=new sn;L.viewport=new Et;let D=[A,L],H=new dc,N=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ee=b[Z];return ee===void 0&&(ee=new Fr,b[Z]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(Z){let ee=b[Z];return ee===void 0&&(ee=new Fr,b[Z]=ee),ee.getGripSpace()},this.getHand=function(Z){let ee=b[Z];return ee===void 0&&(ee=new Fr,b[Z]=ee),ee.getHandSpace()};function V(Z){let ee=S.indexOf(Z.inputSource);if(ee===-1)return;let ye=b[ee];ye!==void 0&&(ye.update(Z.inputSource,Z.frame,c||a),ye.dispatchEvent({type:Z.type,data:Z.inputSource}))}function J(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",ae);for(let Z=0;Z<b.length;Z++){let ee=S[Z];ee!==null&&(S[Z]=null,b[Z].disconnect(ee))}N=null,z=null,p.reset();for(let Z in g)delete g[Z];if(e.setRenderTarget(M),h=null,f=null,d=null,s=null,_=null,it.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(R.width,R.height,!1),w!==null){let Z=w.camera;Z.fov=w.fov,Z.zoom=w.zoom,Z.updateProjectionMatrix(),w=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&ke("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&ke("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return f!==null?f:h},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",J),s.addEventListener("inputsourceschange",ae),y.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(R),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ye=null,ze=null,we=null;y.depth&&(we=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ye=y.stencil?Ci:Mi,ze=y.stencil?Es:fi);let Ke={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:r};d=this.getBinding(),f=d.createProjectionLayer(Ke),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new Yt(f.textureWidth,f.textureHeight,{format:In,type:En,depthTexture:new Ei(f.textureWidth,f.textureHeight,ze,void 0,void 0,void 0,void 0,void 0,void 0,ye),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let ye={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};h=new XRWebGLLayer(s,t,ye),s.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),_=new Yt(h.framebufferWidth,h.framebufferHeight,{format:In,type:En,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),it.setContext(s),it.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function ae(Z){for(let ee=0;ee<Z.removed.length;ee++){let ye=Z.removed[ee],ze=S.indexOf(ye);ze>=0&&(S[ze]=null,b[ze].disconnect(ye))}for(let ee=0;ee<Z.added.length;ee++){let ye=Z.added[ee],ze=S.indexOf(ye);if(ze===-1){for(let Ke=0;Ke<b.length;Ke++)if(Ke>=S.length){S.push(ye),ze=Ke;break}else if(S[Ke]===null){S[Ke]=ye,ze=Ke;break}if(ze===-1)break}let we=b[ze];we&&we.connect(ye)}}let Y=new P,B=new P;function re(Z,ee,ye){Y.setFromMatrixPosition(ee.matrixWorld),B.setFromMatrixPosition(ye.matrixWorld);let ze=Y.distanceTo(B),we=ee.projectionMatrix.elements,Ke=ye.projectionMatrix.elements,Ft=we[14]/(we[10]-1),je=we[14]/(we[10]+1),at=(we[9]+1)/we[5],mt=(we[9]-1)/we[5],Je=(we[8]-1)/we[0],gt=(Ke[8]+1)/Ke[0],Pt=Ft*Je,Kt=Ft*gt,_t=ze/(-Je+gt),Tt=_t*-Je;if(ee.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Tt),Z.translateZ(_t),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),we[10]===-1)Z.projectionMatrix.copy(ee.projectionMatrix),Z.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{let U=Ft+_t,Xt=je+_t,ct=Pt-Tt,C=Kt+(ze-Tt),E=at*je/Xt*U,k=mt*je/Xt*U;Z.projectionMatrix.makePerspective(ct,C,E,k,U,Xt),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function Ee(Z,ee){ee===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ee.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let ee=Z.near,ye=Z.far;p.texture!==null&&(p.depthNear>0&&(ee=p.depthNear),p.depthFar>0&&(ye=p.depthFar)),H.near=L.near=A.near=ee,H.far=L.far=A.far=ye,(N!==H.near||z!==H.far)&&(s.updateRenderState({depthNear:H.near,depthFar:H.far}),N=H.near,z=H.far),H.layers.mask=Z.layers.mask|6,A.layers.mask=H.layers.mask&-5,L.layers.mask=H.layers.mask&-3;let ze=Z.parent,we=H.cameras;Ee(H,ze);for(let Ke=0;Ke<we.length;Ke++)Ee(we[Ke],ze);we.length===2?re(H,A,L):H.projectionMatrix.copy(A.projectionMatrix),w===null&&Z.isPerspectiveCamera&&(w={camera:Z,fov:Z.fov,zoom:Z.zoom}),Te(Z,H,ze)};function Te(Z,ee,ye){ye===null?Z.matrix.copy(ee.matrixWorld):(Z.matrix.copy(ye.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ee.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ee.projectionMatrix),Z.projectionMatrixInverse.copy(ee.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Gs*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return H},this.getFoveation=function(){if(!(f===null&&h===null))return l},this.setFoveation=function(Z){l=Z,f!==null&&(f.fixedFoveation=Z),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(H)},this.getCameraTexture=function(Z){return g[Z]};let ht=null;function Ze(Z,ee){if(u=ee.getViewerPose(c||a),m=ee,u!==null){let ye=u.views;h!==null&&(e.setRenderTargetFramebuffer(_,h.framebuffer),e.setRenderTarget(_));let ze=!1;ye.length!==H.cameras.length&&(H.cameras.length=0,ze=!0);for(let je=0;je<ye.length;je++){let at=ye[je],mt=null;if(h!==null)mt=h.getViewport(at);else{let gt=d.getViewSubImage(f,at);mt=gt.viewport,je===0&&(e.setRenderTargetTextures(_,gt.colorTexture,gt.depthStencilTexture),e.setRenderTarget(_))}let Je=D[je];Je===void 0&&(Je=new sn,Je.layers.enable(je),Je.viewport=new Et,D[je]=Je),Je.matrix.fromArray(at.transform.matrix),Je.matrix.decompose(Je.position,Je.quaternion,Je.scale),Je.projectionMatrix.fromArray(at.projectionMatrix),Je.projectionMatrixInverse.copy(Je.projectionMatrix).invert(),Je.viewport.set(mt.x,mt.y,mt.width,mt.height),je===0&&(H.matrix.copy(Je.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale)),ze===!0&&H.cameras.push(Je)}let we=s.enabledFeatures;if(we&&we.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=n.getBinding();let je=d.getDepthInformation(ye[0]);je&&je.isValid&&je.texture&&p.init(je,s.renderState)}if(we&&we.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let je=0;je<ye.length;je++){let at=ye[je].camera;if(at){let mt=g[at];mt||(mt=new qa,g[at]=mt);let Je=d.getCameraImage(at);mt.sourceTexture=Je}}}}for(let ye=0;ye<b.length;ye++){let ze=S[ye],we=b[ye];ze!==null&&we!==void 0&&we.update(ze,ee,c||a)}ht&&ht(Z,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),m=null}let it=new L0;it.setAnimationLoop(Ze),this.setAnimationLoop=function(Z){ht=Z},this.dispose=function(){}}},AS=new Xe,B0=new $e;B0.set(-1,0,0,0,1,0,0,0,1);function CS(i,e){function t(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function n(p,g){g.color.getRGB(p.fogColor.value,Rd(i)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function s(p,g,y,M,_){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(p,g):g.isMeshLambertMaterial?(r(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(p,g),d(p,g)):g.isMeshPhongMaterial?(r(p,g),u(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(p,g),f(p,g),g.isMeshPhysicalMaterial&&h(p,g,_)):g.isMeshMatcapMaterial?(r(p,g),m(p,g)):g.isMeshDepthMaterial?r(p,g):g.isMeshDistanceMaterial?(r(p,g),x(p,g)):g.isMeshNormalMaterial?r(p,g):g.isLineBasicMaterial?(a(p,g),g.isLineDashedMaterial&&o(p,g)):g.isPointsMaterial?l(p,g,y,M):g.isSpriteMaterial?c(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,t(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===Pn&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,t(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===Pn&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,t(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,t(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);let y=e.get(g),M=y.envMap,_=y.envMapRotation;M&&(p.envMap.value=M,p.envMapRotation.value.setFromMatrix4(AS.makeRotationFromEuler(_)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(B0),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,p.aoMapTransform))}function a(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform))}function o(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,y,M){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*y,p.scale.value=M*.5,g.map&&(p.map.value=g.map,t(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function c(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function u(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function d(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function f(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function h(p,g,y){p.ior.value=g.ior,g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Pn&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.retroreflectivity>0&&(p.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function x(p,g){let y=e.get(g).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function PS(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,b){let S=b.program;n.uniformBlockBinding(_,S)}function c(_,b){let S=s[_.id];S===void 0&&(p(_),S=u(_),s[_.id]=S,_.addEventListener("dispose",y));let R=b.program;n.updateUBOMapping(_,R);let v=e.render.frame;r[_.id]!==v&&(f(_),r[_.id]=v)}function u(_){let b=d();_.__bindingPointIndex=b;let S=i.createBuffer(),R=_.__size,v=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,R,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,S),S}function d(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Ye("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){let b=s[_.id],S=_.uniforms,R=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let v=0,w=S.length;v<w;v++){let A=S[v];if(Array.isArray(A))for(let L=0,D=A.length;L<D;L++)h(A[L],v,L,R);else h(A,v,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(_,b,S,R){if(x(_,b,S,R)===!0){let v=_.__offset,w=_.value;if(Array.isArray(w)){let A=0;for(let L=0;L<w.length;L++){let D=w[L],H=g(D);m(D,_.__data,A),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(A+=H.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(w,_.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,_.__data)}}function m(_,b,S){typeof _=="number"||typeof _=="boolean"?b[0]=_:_.isMatrix3?(b[0]=_.elements[0],b[1]=_.elements[1],b[2]=_.elements[2],b[3]=0,b[4]=_.elements[3],b[5]=_.elements[4],b[6]=_.elements[5],b[7]=0,b[8]=_.elements[6],b[9]=_.elements[7],b[10]=_.elements[8],b[11]=0):ArrayBuffer.isView(_)?b.set(new _.constructor(_.buffer,_.byteOffset,b.length)):_.toArray(b,S)}function x(_,b,S,R){let v=_.value,w=b+"_"+S;if(R[w]===void 0)return typeof v=="number"||typeof v=="boolean"?R[w]=v:ArrayBuffer.isView(v)?R[w]=v.slice():R[w]=v.clone(),!0;{let A=R[w];if(typeof v=="number"||typeof v=="boolean"){if(A!==v)return R[w]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(A.equals(v)===!1)return A.copy(v),!0}}return!1}function p(_){let b=_.uniforms,S=0,R=16;for(let w=0,A=b.length;w<A;w++){let L=Array.isArray(b[w])?b[w]:[b[w]];for(let D=0,H=L.length;D<H;D++){let N=L[D],z=Array.isArray(N.value)?N.value:[N.value];for(let V=0,J=z.length;V<J;V++){let ae=z[V],Y=g(ae),B=S%R,re=B%Y.boundary,Ee=B+re;S+=re,Ee!==0&&R-Ee<Y.storage&&(S+=R-Ee),N.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=S,S+=Y.storage}}}let v=S%R;return v>0&&(S+=R-v),_.__size=S,_.__cache={},this}function g(_){let b={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(b.boundary=4,b.storage=4):_.isVector2?(b.boundary=8,b.storage=8):_.isVector3||_.isColor?(b.boundary=16,b.storage=12):_.isVector4?(b.boundary=16,b.storage=16):_.isMatrix3?(b.boundary=48,b.storage=48):_.isMatrix4?(b.boundary=64,b.storage=64):_.isTexture?ke("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(b.boundary=16,b.storage=_.byteLength):ke("WebGLRenderer: Unsupported uniform value type.",_),b}function y(_){let b=_.target;b.removeEventListener("dispose",y);let S=a.indexOf(b.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function M(){for(let _ in s)i.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:l,update:c,dispose:M}}var IS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Pi=null;function LS(){return Pi===null&&(Pi=new Si(IS,16,16,ws,an),Pi.name="DFG_LUT",Pi.minFilter=Jt,Pi.magFilter=Jt,Pi.wrapS=jt,Pi.wrapT=jt,Pi.generateMipmaps=!1,Pi.needsUpdate=!0),Pi}var rh=class{constructor(e={}){let{canvas:t=i0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:h=En}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let x=h,p=new Set([Sc,bc,Mc]),g=new Set([En,fi,Zr,Es,yc,_c]),y=new Uint32Array(4),M=new Int32Array(4),_=new P,b=null,S=null,R=[],v=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ui,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,L=!1,D=null,H=null,N=null,z=null;this._outputColorSpace=xt;let V=0,J=0,ae=null,Y=-1,B=null,re=new Et,Ee=new Et,Te=null,ht=new Pe(0),Ze=0,it=t.width,Z=t.height,ee=1,ye=null,ze=null,we=new Et(0,0,it,Z),Ke=new Et(0,0,it,Z),Ft=!1,je=new Br,at=!1,mt=!1,Je=new Xe,gt=new P,Pt=new Et,Kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},_t=!1;function Tt(){return ae===null?ee:1}let U=n;function Xt(T,F){return t.getContext(T,F)}let ct,C,E,k,W,K,ce,me,Q,te,pe,Ie,ge,fe,Le,Ne,We,O,_e,ie,xe,ve,oe;try{let T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Rt,!1),t.addEventListener("webglcontextrestored",G,!1),t.addEventListener("webglcontextcreationerror",ne,!1),U===null){let F="webgl2";if(U=Xt(F,T),U===null)throw Xt(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}He()}catch(T){throw t.removeEventListener("webglcontextlost",Rt,!1),t.removeEventListener("webglcontextrestored",G,!1),t.removeEventListener("webglcontextcreationerror",ne,!1),Ye("WebGLRenderer: "+T.message),T}function He(){ct=new kM(U),ct.init(),xe=new wS(U,ct),C=new CM(U,ct,e,xe),E=new SS(U,ct),C.reversedDepthBuffer&&f&&E.buffers.depth.setReversed(!0),H=U.createFramebuffer(),N=U.createFramebuffer(),z=U.createFramebuffer(),k=new GM(U),W=new cS,K=new ES(U,ct,E,W,C,xe,k),ce=new BM(A),me=new Wy(U),ve=new RM(U,me),Q=new HM(U,me,k,ve),te=new WM(U,Q,me,ve,k),O=new VM(U,C,K),Le=new PM(W),pe=new lS(A,ce,ct,C,ve,Le),Ie=new CS(A,W),ge=new uS,fe=new xS(ct),We=new TM(A,ce,E,te,m,l),Ne=new bS(A,te,C),oe=new PS(U,k,C,E),_e=new AM(U,ct,k),ie=new zM(U,ct,k),k.programs=pe.programs,A.capabilities=C,A.extensions=ct,A.properties=W,A.renderLists=ge,A.shadowMap=Ne,A.state=E,A.info=k}x!==En&&(w=new qM(x,t.width,t.height,o,s,r));let De=new Zd(A,U);this.xr=De,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let T=ct.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=ct.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(T){T!==void 0&&(ee=T,this.setSize(it,Z,!1))},this.getSize=function(T){return T.set(it,Z)},this.setSize=function(T,F,$=!0){if(De.isPresenting){ke("WebGLRenderer: Can't change size while VR device is presenting.");return}it=T,Z=F,t.width=Math.floor(T*ee),t.height=Math.floor(F*ee),$===!0&&(t.style.width=T+"px",t.style.height=F+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set(it*ee,Z*ee).floor()},this.setDrawingBufferSize=function(T,F,$){it=T,Z=F,ee=$,t.width=Math.floor(T*$),t.height=Math.floor(F*$),this.setViewport(0,0,T,F)},this.setEffects=function(T){if(x===En){Ye("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let F=0;F<T.length;F++)if(T[F].isOutputPass===!0){ke("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(re)},this.getViewport=function(T){return T.copy(we)},this.setViewport=function(T,F,$,X){T.isVector4?we.set(T.x,T.y,T.z,T.w):we.set(T,F,$,X),E.viewport(re.copy(we).multiplyScalar(ee).round())},this.getScissor=function(T){return T.copy(Ke)},this.setScissor=function(T,F,$,X){T.isVector4?Ke.set(T.x,T.y,T.z,T.w):Ke.set(T,F,$,X),E.scissor(Ee.copy(Ke).multiplyScalar(ee).round())},this.getScissorTest=function(){return Ft},this.setScissorTest=function(T){E.setScissorTest(Ft=T)},this.setOpaqueSort=function(T){ye=T},this.setTransparentSort=function(T){ze=T},this.getClearColor=function(T){return T.copy(We.getClearColor())},this.setClearColor=function(){We.setClearColor(...arguments)},this.getClearAlpha=function(){return We.getClearAlpha()},this.setClearAlpha=function(){We.setClearAlpha(...arguments)},this.clear=function(T=!0,F=!0,$=!0){let X=0;if(T){let q=!1;if(ae!==null){let Se=ae.texture.format;q=p.has(Se)}if(q){let Se=ae.texture.type,Ae=g.has(Se),be=We.getClearColor(),Ue=We.getClearAlpha(),Be=be.r,tt=be.g,lt=be.b;Ae?(y[0]=Be,y[1]=tt,y[2]=lt,y[3]=Ue,U.clearBufferuiv(U.COLOR,0,y)):(M[0]=Be,M[1]=tt,M[2]=lt,M[3]=Ue,U.clearBufferiv(U.COLOR,0,M))}else X|=U.COLOR_BUFFER_BIT}F&&(X|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(X|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&U.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),D=T},this.dispose=function(){t.removeEventListener("webglcontextlost",Rt,!1),t.removeEventListener("webglcontextrestored",G,!1),t.removeEventListener("webglcontextcreationerror",ne,!1),We.dispose(),ge.dispose(),fe.dispose(),W.dispose(),ce.dispose(),te.dispose(),ve.dispose(),oe.dispose(),pe.dispose(),De.dispose(),De.removeEventListener("sessionstart",xn),De.removeEventListener("sessionend",Gt),qt.stop()};function Rt(T){T.preventDefault(),La("WebGLRenderer: Context Lost."),L=!0}function G(){La("WebGLRenderer: Context Restored."),L=!1;let T=k.autoReset,F=Ne.enabled,$=Ne.autoUpdate,X=Ne.needsUpdate,q=Ne.type;He(),k.autoReset=T,Ne.enabled=F,Ne.autoUpdate=$,Ne.needsUpdate=X,Ne.type=q}function ne(T){Ye("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ue(T){let F=T.target;F.removeEventListener("dispose",ue),Oe(F)}function Oe(T){Qe(T),W.remove(T)}function Qe(T){let F=W.get(T).programs;F!==void 0&&(F.forEach(function($){pe.releaseProgram($)}),T.isShaderMaterial&&pe.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,$,X,q,Se){F===null&&(F=Kt);let Ae=q.isMesh&&q.matrixWorld.determinantAffine()<0,be=bx(T,F,$,X,q);E.setMaterial(X,Ae);let Ue=$.index,Be=1;if(X.wireframe===!0){if(Ue=Q.getWireframeAttribute($),Ue===void 0)return;Be=2}let tt=$.drawRange,lt=$.attributes.position,Fe=tt.start*Be,bt=(tt.start+tt.count)*Be;Se!==null&&(Fe=Math.max(Fe,Se.start*Be),bt=Math.min(bt,(Se.start+Se.count)*Be)),Ue!==null?(Fe=Math.max(Fe,0),bt=Math.min(bt,Ue.count)):lt!=null&&(Fe=Math.max(Fe,0),bt=Math.min(bt,lt.count));let tn=bt-Fe;if(tn<0||tn===1/0)return;ve.setup(q,X,be,$,Ue);let kt,It=_e;if(Ue!==null&&(kt=me.get(Ue),It=ie,It.setIndex(kt)),q.isMesh)X.wireframe===!0?(E.setLineWidth(X.wireframeLinewidth*Tt()),It.setMode(U.LINES)):It.setMode(U.TRIANGLES);else if(q.isLine){let vn=X.linewidth;vn===void 0&&(vn=1),E.setLineWidth(vn*Tt()),q.isLineSegments?It.setMode(U.LINES):q.isLineLoop?It.setMode(U.LINE_LOOP):It.setMode(U.LINE_STRIP)}else q.isPoints?It.setMode(U.POINTS):q.isSprite&&It.setMode(U.TRIANGLES);if(q.isBatchedMesh)if(ct.get("WEBGL_multi_draw"))It.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{let vn=q._multiDrawStarts,Re=q._multiDrawCounts,Rn=q._multiDrawCount,ft=Ue?me.get(Ue).bytesPerElement:1,Zn=W.get(X).currentProgram.getUniforms();for(let yi=0;yi<Rn;yi++)Zn.setValue(U,"_gl_DrawID",yi),It.render(vn[yi]/ft,Re[yi])}else if(q.isInstancedMesh)It.renderInstances(Fe,tn,q.count);else if($.isInstancedBufferGeometry){let vn=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Re=Math.min($.instanceCount,vn);It.renderInstances(Fe,tn,Re)}else It.render(Fe,tn)};function Mt(T,F,$,X){D!==null&&T.isNodeMaterial&&D.setObject(X,T),at===!0&&Le.setState(T,$,!1),T.transparent===!0&&T.side===Wt&&T.forceSinglePass===!1?(T.side=Pn,T.needsUpdate=!0,il(T,F,X),T.side=Ai,T.needsUpdate=!0,il(T,F,X),T.side=Wt):il(T,F,X)}this.compile=function(T,F,$=null){$===null&&($=T),D!==null&&D.renderStart(T,F,$),S=fe.get($),S.init(F),v.push(S),$.traverseVisible(function(q){q.isLight&&q.layers.test(F.layers)&&(S.pushLight(q),q.castShadow&&S.pushShadow(q))}),T!==$&&T.traverseVisible(function(q){q.isLight&&q.layers.test(F.layers)&&(S.pushLight(q),q.castShadow&&S.pushShadow(q))}),S.setupLights(),D!==null&&D.updateLights(S.state.lightsArray),mt=this.localClippingEnabled,at=Le.init(this.clippingPlanes,mt),at===!0&&Le.setGlobalState(this.clippingPlanes,F),D!==null&&Ne.render(S.state.shadowsArray,$,F);let X=new Set;return T.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;let Se=q.material;if(Se)if(Array.isArray(Se))for(let Ae=0;Ae<Se.length;Ae++){let be=Se[Ae];Mt(be,$,F,q),X.add(be)}else Mt(Se,$,F,q),X.add(Se)}),S=v.pop(),D!==null&&D.renderEnd(),X},this.compileAsync=function(T,F,$=null){let X=this.compile(T,F,$);return new Promise(q=>{function Se(){if(X.forEach(function(Ae){let Ue=W.get(Ae).currentProgram;(Ue===void 0||Ue.isReady())&&X.delete(Ae)}),X.size===0){q(T);return}setTimeout(Se,10)}ct.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let At=null;function dt(T){At&&At(T)}function xn(){qt.stop()}function Gt(){qt.start()}let qt=new L0;qt.setAnimationLoop(dt),typeof self<"u"&&qt.setContext(self),this.setAnimationLoop=function(T){At=T,De.setAnimationLoop(T),T===null?qt.stop():qt.start()},De.addEventListener("sessionstart",xn),De.addEventListener("sessionend",Gt),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){Ye("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;D!==null&&D.renderStart(T,F);let $=De.enabled===!0&&De.isPresenting===!0,X=w!==null&&(ae===null||$)&&w.begin(A,ae);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),De.enabled===!0&&De.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(De.cameraAutoUpdate===!0&&De.updateCamera(F),F=De.getCamera()),T.isScene===!0&&T.onBeforeRender(A,T,F,ae),S=fe.get(T,v.length),S.init(F),S.state.textureUnits=K.getTextureUnits(),v.push(S),Je.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),je.setFromProjectionMatrix(Je,ci,F.reversedDepth),mt=this.localClippingEnabled,at=Le.init(this.clippingPlanes,mt),b=ge.get(T,R.length),b.init(),R.push(b),De.enabled===!0&&De.isPresenting===!0){let Ae=A.xr.getDepthSensingMesh();Ae!==null&&$n(Ae,F,-1/0,A.sortObjects)}$n(T,F,0,A.sortObjects),b.finish(),D!==null&&D.updateLights(S.state.lightsArray),A.sortObjects===!0&&b.sort(ye,ze),_t=De.enabled===!1||De.isPresenting===!1||De.hasDepthSensing()===!1,_t&&We.addToRenderList(b,T),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),at===!0&&Le.beginShadows();let q=S.state.shadowsArray;if(Ne.render(q,T,F),at===!0&&Le.endShadows(),(X&&w.hasRenderPass())===!1){let Ae=b.opaque,be=b.transmissive;if(S.setupLights(),F.isArrayCamera){let Ue=F.cameras;if(be.length>0)for(let Be=0,tt=Ue.length;Be<tt;Be++){let lt=Ue[Be];Dp(Ae,be,T,lt)}_t&&We.render(T);for(let Be=0,tt=Ue.length;Be<tt;Be++){let lt=Ue[Be];Lp(b,T,lt,lt.viewport)}}else be.length>0&&Dp(Ae,be,T,F),_t&&We.render(T),Lp(b,T,F)}ae!==null&&J===0&&(K.updateMultisampleRenderTarget(ae),K.updateRenderTargetMipmap(ae)),X&&w.end(A),T.isScene===!0&&T.onAfterRender(A,T,F),ve.resetDefaultState(),Y=-1,B=null,v.pop(),v.length>0?(S=v[v.length-1],K.setTextureUnits(S.state.textureUnits),at===!0&&Le.setGlobalState(A.clippingPlanes,S.state.camera)):S=null,R.pop(),R.length>0?b=R[R.length-1]:b=null,D!==null&&D.renderEnd()};function $n(T,F,$,X){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)$=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLightProbeGrid)S.pushLightProbeGrid(T);else if(T.isLight)S.pushLight(T),T.castShadow&&S.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||T.intersectsFrustum(je)){X&&Pt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Je);let Ae=te.update(T),be=T.material;be.visible&&b.push(T,Ae,be,$,Pt.z,null,F)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||T.intersectsFrustum(je))){let Ae=te.update(T),be=T.material;if(X&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Pt.copy(T.boundingSphere.center)):(Ae.boundingSphere===null&&Ae.computeBoundingSphere(),Pt.copy(Ae.boundingSphere.center)),Pt.applyMatrix4(T.matrixWorld).applyMatrix4(Je)),Array.isArray(be)){let Ue=Ae.groups;for(let Be=0,tt=Ue.length;Be<tt;Be++){let lt=Ue[Be],Fe=be[lt.materialIndex];Fe&&Fe.visible&&b.push(T,Ae,Fe,$,Pt.z,lt,F)}}else be.visible&&b.push(T,Ae,be,$,Pt.z,null,F)}}let Se=T.children;for(let Ae=0,be=Se.length;Ae<be;Ae++)$n(Se[Ae],F,$,X)}function Lp(T,F,$,X){let{opaque:q,transmissive:Se,transparent:Ae}=T;S.setupLightsView($),at===!0&&Le.setGlobalState(A.clippingPlanes,$),X&&E.viewport(re.copy(X)),q.length>0&&nl(q,F,$),Se.length>0&&nl(Se,F,$),Ae.length>0&&nl(Ae,F,$),E.buffers.depth.setTest(!0),E.buffers.depth.setMask(!0),E.buffers.color.setMask(!0),E.setPolygonOffset(!1)}function Dp(T,F,$,X){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[X.id]===void 0){let Fe=ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[X.id]=new Yt(1,1,{generateMipmaps:!0,type:Fe?an:En,minFilter:di,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:et.workingColorSpace})}let Se=S.state.transmissionRenderTarget[X.id],Ae=X.viewport||re;Se.setSize(Ae.z*A.transmissionResolutionScale,Ae.w*A.transmissionResolutionScale);let be=A.getRenderTarget(),Ue=A.getActiveCubeFace(),Be=A.getActiveMipmapLevel();A.setRenderTarget(Se),A.getClearColor(ht),Ze=A.getClearAlpha(),Ze<1&&A.setClearColor(16777215,.5),A.clear(),_t&&We.render($);let tt=A.toneMapping;A.toneMapping=ui;let lt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),S.setupLightsView(X),at===!0&&Le.setGlobalState(A.clippingPlanes,X),nl(T,$,X),K.updateMultisampleRenderTarget(Se),K.updateRenderTargetMipmap(Se),ct.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let bt=0,tn=F.length;bt<tn;bt++){let kt=F[bt],{object:It,geometry:vn,material:Re,group:Rn}=kt;if(Re.side===Wt&&It.layers.test(X.layers)){let ft=Re.side;Re.side=Pn,Re.needsUpdate=!0,Np(It,$,X,vn,Re,Rn),Re.side=ft,Re.needsUpdate=!0,Fe=!0}}Fe===!0&&(K.updateMultisampleRenderTarget(Se),K.updateRenderTargetMipmap(Se))}A.setRenderTarget(be,Ue,Be),A.setClearColor(ht,Ze),lt!==void 0&&(X.viewport=lt),A.toneMapping=tt}function nl(T,F,$){let X=F.isScene===!0?F.overrideMaterial:null;for(let q=0,Se=T.length;q<Se;q++){let Ae=T[q],{object:be,geometry:Ue,group:Be}=Ae,tt=Ae.material;tt.allowOverride===!0&&X!==null&&(tt=X),be.layers.test($.layers)&&Np(be,F,$,Ue,tt,Be)}}function Np(T,F,$,X,q,Se){D!==null&&q.isNodeMaterial&&D.setObject(T,q),T.onBeforeRender(A,F,$,X,q,Se),T.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),q.onBeforeRender(A,F,$,X,T,Se),q.transparent===!0&&q.side===Wt&&q.forceSinglePass===!1?(q.side=Pn,q.needsUpdate=!0,A.renderBufferDirect($,F,X,q,T,Se),q.side=Ai,q.needsUpdate=!0,A.renderBufferDirect($,F,X,q,T,Se),q.side=Wt):A.renderBufferDirect($,F,X,q,T,Se),T.onAfterRender(A,F,$,X,q,Se)}function il(T,F,$){F.isScene!==!0&&(F=Kt);let X=W.get(T),q=S.state.lights,Se=S.state.shadowsArray,Ae=q.state.version,be=pe.getParameters(T,q.state,Se,F,$,S.state.lightProbeGridArray),Ue=pe.getProgramCacheKey(be),Be=X.programs;X.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?F.environment:null,X.fog=F.fog;let tt=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;X.envMap=ce.get(T.envMap||X.environment,tt),X.envMapRotation=X.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,Be===void 0&&(T.addEventListener("dispose",ue),Be=new Map,X.programs=Be);let lt=Be.get(Ue);if(lt!==void 0){if(X.currentProgram===lt&&X.lightsStateVersion===Ae)return Fp(T,be),lt}else be.uniforms=pe.getUniforms(T),D!==null&&T.isNodeMaterial&&D.build(T,$,be),T.onBeforeCompile(be,A),lt=pe.acquireProgram(be,Ue),Be.set(Ue,lt),X.uniforms=be.uniforms;let Fe=X.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Fe.clippingPlanes=Le.uniform),Fp(T,be),X.needsLights=Ex(T),X.lightsStateVersion=Ae,X.needsLights&&(Fe.ambientLightColor.value=q.state.ambient,Fe.lightProbe.value=q.state.probe,Fe.sunLights.value=q.state.sun,Fe.sunLightShadows.value=q.state.sunShadow,Fe.directionalLights.value=q.state.directional,Fe.directionalLightShadows.value=q.state.directionalShadow,Fe.spotLights.value=q.state.spot,Fe.spotLightShadows.value=q.state.spotShadow,Fe.rectAreaLights.value=q.state.rectArea,Fe.ltc_1.value=q.state.rectAreaLTC1,Fe.ltc_2.value=q.state.rectAreaLTC2,Fe.pointLights.value=q.state.point,Fe.pointLightShadows.value=q.state.pointShadow,Fe.hemisphereLights.value=q.state.hemi,Fe.sunShadowMatrix.value=q.state.sunShadowMatrix,Fe.sunShadowCascade.value=q.state.sunShadowCascade,Fe.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Fe.spotLightMatrix.value=q.state.spotLightMatrix,Fe.spotLightMap.value=q.state.spotLightMap,Fe.pointShadowMatrix.value=q.state.pointShadowMatrix),X.lightProbeGrid=S.state.lightProbeGridArray.length>0,X.currentProgram=lt,X.uniformsList=null,lt}function Up(T){if(T.uniformsList===null){let F=T.currentProgram.getUniforms();T.uniformsList=ea.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function Fp(T,F){let $=W.get(T);$.outputColorSpace=F.outputColorSpace,$.batching=F.batching,$.batchingColor=F.batchingColor,$.instancing=F.instancing,$.instancingColor=F.instancingColor,$.instancingMorph=F.instancingMorph,$.skinning=F.skinning,$.morphTargets=F.morphTargets,$.morphNormals=F.morphNormals,$.morphColors=F.morphColors,$.morphTargetsCount=F.morphTargetsCount,$.numClippingPlanes=F.numClippingPlanes,$.numIntersection=F.numClipIntersection,$.vertexAlphas=F.vertexAlphas,$.vertexTangents=F.vertexTangents,$.toneMapping=F.toneMapping}function Mx(T,F){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;_.setFromMatrixPosition(F.matrixWorld);for(let $=0,X=T.length;$<X;$++){let q=T[$];if(q.texture!==null&&q.boundingBox.containsPoint(_))return q}return null}function bx(T,F,$,X,q){F.isScene!==!0&&(F=Kt),K.resetTextureUnits();let Se=F.fog,Ae=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?F.environment:null,be=ae===null?A.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:et.workingColorSpace,Ue=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,Be=ce.get(X.envMap||Ae,Ue),tt=X.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,lt=!!$.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Fe=!!$.morphAttributes.position,bt=!!$.morphAttributes.normal,tn=!!$.morphAttributes.color,kt=ui;X.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(kt=A.toneMapping);let It=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,vn=It!==void 0?It.length:0,Re=W.get(X),Rn=S.state.lights;if(at===!0&&(mt===!0||T!==B)){let Ot=T===B&&X.id===Y;Le.setState(X,T,Ot)}let ft=!1;X.version===Re.__version?(Re.needsLights&&Re.lightsStateVersion!==Rn.state.version||Re.outputColorSpace!==be||q.isBatchedMesh&&Re.batching===!1||!q.isBatchedMesh&&Re.batching===!0||q.isBatchedMesh&&Re.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Re.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Re.instancing===!1||!q.isInstancedMesh&&Re.instancing===!0||q.isSkinnedMesh&&Re.skinning===!1||!q.isSkinnedMesh&&Re.skinning===!0||q.isInstancedMesh&&Re.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Re.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Re.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Re.instancingMorph===!1&&q.morphTexture!==null||Re.envMap!==Be||X.fog===!0&&Re.fog!==Se||Re.numClippingPlanes!==void 0&&(Re.numClippingPlanes!==Le.numPlanes||Re.numIntersection!==Le.numIntersection)||Re.vertexAlphas!==tt||Re.vertexTangents!==lt||Re.morphTargets!==Fe||Re.morphNormals!==bt||Re.morphColors!==tn||Re.toneMapping!==kt||Re.morphTargetsCount!==vn||!!Re.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(ft=!0):(ft=!0,Re.__version=X.version);let Zn=Re.currentProgram;ft===!0&&(Zn=il(X,F,q),D&&X.isNodeMaterial&&D.onUpdateProgram(X,Zn,Re));let yi=!1,hs=!1,cr=!1,Ct=Zn.getUniforms(),Zt=Re.uniforms;if(E.useProgram(Zn.program)&&(yi=!0,hs=!0,cr=!0),X.id!==Y&&(Y=X.id,hs=!0),Re.needsLights){let Ot=Mx(S.state.lightProbeGridArray,q);Re.lightProbeGrid!==Ot&&(Re.lightProbeGrid=Ot,hs=!0)}if(yi||B!==T){E.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),Ct.setValue(U,"projectionMatrix",T.projectionMatrix),Ct.setValue(U,"viewMatrix",T.matrixWorldInverse);let ds=Ct.map.cameraPosition;ds!==void 0&&ds.setValue(U,gt.setFromMatrixPosition(T.matrixWorld)),C.logarithmicDepthBuffer&&Ct.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Ct.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),B!==T&&(B=T,hs=!0,cr=!0)}if(Re.needsLights&&(Rn.state.sunShadowMap.length>0&&Ct.setValue(U,"sunShadowMap",Rn.state.sunShadowMap,K),Rn.state.directionalShadowMap.length>0&&Ct.setValue(U,"directionalShadowMap",Rn.state.directionalShadowMap,K),Rn.state.spotShadowMap.length>0&&Ct.setValue(U,"spotShadowMap",Rn.state.spotShadowMap,K),Rn.state.pointShadowMap.length>0&&Ct.setValue(U,"pointShadowMap",Rn.state.pointShadowMap,K)),q.isSkinnedMesh){Ct.setOptional(U,q,"bindMatrix"),Ct.setOptional(U,q,"bindMatrixInverse");let Ot=q.skeleton;Ot&&(Ot.boneTexture===null&&Ot.computeBoneTexture(),Ct.setValue(U,"boneTexture",Ot.boneTexture,K))}q.isBatchedMesh&&(Ct.setOptional(U,q,"batchingTexture"),Ct.setValue(U,"batchingTexture",q._matricesTexture,K),Ct.setOptional(U,q,"batchingIdTexture"),Ct.setValue(U,"batchingIdTexture",q._indirectTexture,K),Ct.setOptional(U,q,"batchingColorTexture"),q._colorsTexture!==null&&Ct.setValue(U,"batchingColorTexture",q._colorsTexture,K));let us=$.morphAttributes;if((us.position!==void 0||us.normal!==void 0||us.color!==void 0)&&O.update(q,$,Zn),(hs||Re.receiveShadow!==q.receiveShadow)&&(Re.receiveShadow=q.receiveShadow,Ct.setValue(U,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&F.environment!==null&&(Zt.envMapIntensity.value=F.environmentIntensity),Zt.dfgLUT!==void 0&&(Zt.dfgLUT.value=LS()),hs){if(Ct.setValue(U,"toneMappingExposure",A.toneMappingExposure),Re.needsLights&&Sx(Zt,cr),Se&&X.fog===!0&&Ie.refreshFogUniforms(Zt,Se),Ie.refreshMaterialUniforms(Zt,X,ee,Z,S.state.transmissionRenderTarget[T.id]),Re.needsLights&&Re.lightProbeGrid){let Ot=Re.lightProbeGrid;Zt.probesSH.value=Ot.texture,Zt.probesMin.value.copy(Ot.boundingBox.min),Zt.probesMax.value.copy(Ot.boundingBox.max),Zt.probesResolution.value.copy(Ot.resolution)}ea.upload(U,Up(Re),Zt,K)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(ea.upload(U,Up(Re),Zt,K),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Ct.setValue(U,"center",q.center),Ct.setValue(U,"modelViewMatrix",q.modelViewMatrix),Ct.setValue(U,"normalMatrix",q.normalMatrix),Ct.setValue(U,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){let Ot=X.uniformsGroups;for(let ds=0,hr=Ot.length;ds<hr;ds++){let Bp=Ot[ds];oe.update(Bp,Zn),oe.bind(Bp,Zn)}}return Zn}function Sx(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.sunLights.needsUpdate=F,T.sunLightShadows.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function Ex(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return ae},this.setRenderTargetTextures=function(T,F,$){let X=W.get(T);X.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),W.get(T.texture).__webglTexture=F,W.get(T.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:$,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,F){let $=W.get(T);$.__webglFramebuffer=F,$.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(T,F=0,$=0){ae=T,V=F,J=$;let X=null,q=!1,Se=!1;if(T){let be=W.get(T);if(be.__useDefaultFramebuffer!==void 0){E.bindFramebuffer(U.FRAMEBUFFER,be.__webglFramebuffer),re.copy(T.viewport),Ee.copy(T.scissor),Te=T.scissorTest,E.viewport(re),E.scissor(Ee),E.setScissorTest(Te),Y=-1;return}else if(be.__webglFramebuffer===void 0)K.setupRenderTarget(T);else if(be.__hasExternalTextures)K.rebindTextures(T,W.get(T.texture).__webglTexture,W.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let tt=T.depthTexture;if(be.__boundDepthTexture!==tt){if(tt!==null&&W.has(tt)&&(T.width!==tt.image.width||T.height!==tt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(T)}}let Ue=T.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(Se=!0);let Be=W.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Be[F])?X=Be[F][$]:X=Be[F],q=!0):T.samples>0&&K.useMultisampledRTT(T)===!1?X=W.get(T).__webglMultisampledFramebuffer:Array.isArray(Be)?X=Be[$]:X=Be,re.copy(T.viewport),Ee.copy(T.scissor),Te=T.scissorTest}else re.copy(we).multiplyScalar(ee).floor(),Ee.copy(Ke).multiplyScalar(ee).floor(),Te=Ft;if($!==0&&(X=H),E.bindFramebuffer(U.FRAMEBUFFER,X)&&E.drawBuffers(T,X),E.viewport(re),E.scissor(Ee),E.setScissorTest(Te),q){let be=W.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,be.__webglTexture,$)}else if(Se){let be=F;for(let Ue=0;Ue<T.textures.length;Ue++){let Be=W.get(T.textures[Ue]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Ue,Be.__webglTexture,$,be)}}else if(T!==null&&$!==0){let be=W.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,be.__webglTexture,$)}Y=-1};function Op(T){let F=W.get(T);return(F.__readFormat!==T.format||F.__readType!==T.type)&&(F.__readFormat=T.format,F.__readType=T.type,F.__formatReadable=C.textureFormatReadable(T.format),F.__typeReadable=C.textureTypeReadable(T.type)),F}this.readRenderTargetPixels=function(T,F,$,X,q,Se,Ae,be=0){if(!(T&&T.isWebGLRenderTarget)){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ue=W.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ae!==void 0&&(Ue=Ue[Ae]),Ue){E.bindFramebuffer(U.FRAMEBUFFER,Ue);try{let Be=T.textures[be],tt=Be.format,lt=Be.type;T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+be);let Fe=Op(Be);if(Fe.__formatReadable===!1){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Fe.__typeReadable===!1){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-X&&$>=0&&$<=T.height-q&&U.readPixels(F,$,X,q,xe.convert(tt),xe.convert(lt),Se)}finally{let Be=ae!==null?W.get(ae).__webglFramebuffer:null;E.bindFramebuffer(U.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(T,F,$,X,q,Se,Ae,be=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ue=W.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ae!==void 0&&(Ue=Ue[Ae]),Ue)if(F>=0&&F<=T.width-X&&$>=0&&$<=T.height-q){E.bindFramebuffer(U.FRAMEBUFFER,Ue);let Be=T.textures[be],tt=Be.format,lt=Be.type;T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+be);let Fe=Op(Be);if(Fe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Fe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let bt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,bt),U.bufferData(U.PIXEL_PACK_BUFFER,Se.byteLength,U.STREAM_READ),U.readPixels(F,$,X,q,xe.convert(tt),xe.convert(lt),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let tn=ae!==null?W.get(ae).__webglFramebuffer:null;E.bindFramebuffer(U.FRAMEBUFFER,tn);let kt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await r0(U,kt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,bt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Se),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(bt),U.deleteSync(kt),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,F=null,$=0){let X=Math.pow(2,-$),q=Math.floor(T.image.width*X),Se=Math.floor(T.image.height*X),Ae=F!==null?F.x:0,be=F!==null?F.y:0;K.setTexture2D(T,0),U.copyTexSubImage2D(U.TEXTURE_2D,$,0,0,Ae,be,q,Se),E.unbindTexture()},this.copyTextureToTexture=function(T,F,$=null,X=null,q=0,Se=0){let Ae,be,Ue,Be,tt,lt,Fe,bt,tn,kt=T.isCompressedTexture?T.mipmaps[Se]:T.image;if($!==null)Ae=$.max.x-$.min.x,be=$.max.y-$.min.y,Ue=$.isBox3?$.max.z-$.min.z:1,Be=$.min.x,tt=$.min.y,lt=$.isBox3?$.min.z:0;else{let Zt=Math.pow(2,-q);Ae=Math.floor(kt.width*Zt),be=Math.floor(kt.height*Zt),T.isDataArrayTexture?Ue=kt.depth:T.isData3DTexture?Ue=Math.floor(kt.depth*Zt):Ue=1,Be=0,tt=0,lt=0}X!==null?(Fe=X.x,bt=X.y,tn=X.z):(Fe=0,bt=0,tn=0);let It=xe.convert(F.format),vn=xe.convert(F.type),Re;F.isData3DTexture?(K.setTexture3D(F,0),Re=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(K.setTexture2DArray(F,0),Re=U.TEXTURE_2D_ARRAY):(K.setTexture2D(F,0),Re=U.TEXTURE_2D),E.activeTexture(U.TEXTURE0),E.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),E.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),E.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);let Rn=E.getParameter(U.UNPACK_ROW_LENGTH),ft=E.getParameter(U.UNPACK_IMAGE_HEIGHT),Zn=E.getParameter(U.UNPACK_SKIP_PIXELS),yi=E.getParameter(U.UNPACK_SKIP_ROWS),hs=E.getParameter(U.UNPACK_SKIP_IMAGES);E.pixelStorei(U.UNPACK_ROW_LENGTH,kt.width),E.pixelStorei(U.UNPACK_IMAGE_HEIGHT,kt.height),E.pixelStorei(U.UNPACK_SKIP_PIXELS,Be),E.pixelStorei(U.UNPACK_SKIP_ROWS,tt),E.pixelStorei(U.UNPACK_SKIP_IMAGES,lt);let cr=T.isDataArrayTexture||T.isData3DTexture,Ct=F.isDataArrayTexture||F.isData3DTexture;if(T.isDepthTexture){let Zt=W.get(T),us=W.get(F),Ot=W.get(Zt.__renderTarget),ds=W.get(us.__renderTarget);E.bindFramebuffer(U.READ_FRAMEBUFFER,Ot.__webglFramebuffer),E.bindFramebuffer(U.DRAW_FRAMEBUFFER,ds.__webglFramebuffer);for(let hr=0;hr<Ue;hr++)cr&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,W.get(T).__webglTexture,q,lt+hr),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,W.get(F).__webglTexture,Se,tn+hr)),U.blitFramebuffer(Be,tt,Ae,be,Fe,bt,Ae,be,U.DEPTH_BUFFER_BIT,U.NEAREST);E.bindFramebuffer(U.READ_FRAMEBUFFER,null),E.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(q!==0||T.isRenderTargetTexture||W.has(T)){let Zt=W.get(T),us=W.get(F);E.bindFramebuffer(U.READ_FRAMEBUFFER,N),E.bindFramebuffer(U.DRAW_FRAMEBUFFER,z);for(let Ot=0;Ot<Ue;Ot++)cr?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Zt.__webglTexture,q,lt+Ot):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Zt.__webglTexture,q),Ct?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,us.__webglTexture,Se,tn+Ot):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,us.__webglTexture,Se),q!==0?U.blitFramebuffer(Be,tt,Ae,be,Fe,bt,Ae,be,U.COLOR_BUFFER_BIT,U.NEAREST):Ct?U.copyTexSubImage3D(Re,Se,Fe,bt,tn+Ot,Be,tt,Ae,be):U.copyTexSubImage2D(Re,Se,Fe,bt,Be,tt,Ae,be);E.bindFramebuffer(U.READ_FRAMEBUFFER,null),E.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Ct?T.isDataTexture||T.isData3DTexture?U.texSubImage3D(Re,Se,Fe,bt,tn,Ae,be,Ue,It,vn,kt.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(Re,Se,Fe,bt,tn,Ae,be,Ue,It,kt.data):U.texSubImage3D(Re,Se,Fe,bt,tn,Ae,be,Ue,It,vn,kt):T.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Se,Fe,bt,Ae,be,It,vn,kt.data):T.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Se,Fe,bt,kt.width,kt.height,It,kt.data):U.texSubImage2D(U.TEXTURE_2D,Se,Fe,bt,Ae,be,It,vn,kt);E.pixelStorei(U.UNPACK_ROW_LENGTH,Rn),E.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ft),E.pixelStorei(U.UNPACK_SKIP_PIXELS,Zn),E.pixelStorei(U.UNPACK_SKIP_ROWS,yi),E.pixelStorei(U.UNPACK_SKIP_IMAGES,hs),Se===0&&F.generateMipmaps&&U.generateMipmap(Re),E.unbindTexture()},this.initRenderTarget=function(T){W.get(T).__webglFramebuffer===void 0&&K.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?K.setTextureCube(T,0):T.isData3DTexture?K.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?K.setTexture2DArray(T,0):K.setTexture2D(T,0),E.unbindTexture()},this.resetState=function(){V=0,J=0,ae=null,E.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ci}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}};var Yn=2.4,Ts=1024,Rs=512,ef=(i,e=Ts,t=Yn)=>i/1e3/t*e;function Li(i,e,t=!1,n=Yn){let s=Math.max(2,Math.round(e/ef(i,e,n)));return t&&s%2&&(s+=1),Math.min(s,e)}var uh=4.5,DS=3;function vt(i=Rs,e=i){let t=document.createElement("canvas");return t.width=i,t.height=e,t}var Qd=[],V0=0,NS=["sign","glass","poster","flyer","banner"],US={tileM:Yn,ext:Ts,noise:Rs,surfaces:Qd,get normalMapsBuilt(){return V0},get normalCoverage(){let i=Qd.filter(e=>!NS.includes(e.kind));return{expected:i.length,withHeight:i.filter(e=>e.hasHeight).length}}};typeof window<"u"&&(window.__matDebug=US);var FS=["concrete","asphalt","paver","stone","grass","slab"];function yn(i,e={}){let{normalScale:t=1,kind:n="tex",metersPerRepeat:s=Yn,height:r=null,clamp:a=!1,repeat:o=null}=e,l=new pn(i);l.colorSpace=xt,l.wrapS=l.wrapT=a?jt:on,o&&l.repeat.set(o[0],o[1]),l.anisotropy=8;let c=FS.includes(n);return l.userData.surface={kind:n,resolution:i.width,metersPerRepeat:s,normalScale:t,hasHeight:!!r,height:r,groundFriendly:c},Qd.push({kind:n,resolution:i.width,heightResolution:r?r.width:0,metersPerRepeat:s,normalScale:t,hasHeight:!!r,groundFriendly:c}),l}var jd=null;function OS(){if(jd)return jd;let i=256,e=vt(i,i),t=e.getContext("2d"),n=t.createImageData(i,i),s=n.data;for(let r=0;r<s.length;r+=4){let a=128+(Math.random()-.5)*255;s[r]=s[r+1]=s[r+2]=a,s[r+3]=255}return t.putImageData(n,0,0),jd=e,e}function Bt(i,e,t,n){n<=0||(i.save(),i.globalAlpha=Math.min(.85,n/60),i.globalCompositeOperation="overlay",i.fillStyle=i.createPattern(OS(),"repeat"),i.fillRect(0,0,e,t),i.restore())}function Bn(i,e,t,n,s,r=26){for(let a=0;a<n;a++)i.fillStyle=s(Math.random()),i.beginPath(),i.arc(Math.random()*e,Math.random()*t,4+Math.random()*r,0,Math.PI*2),i.fill()}var BS=1.9;function kS(i){let e=i.width,t=i.height,n=i.getContext("2d").getImageData(0,0,e,t).data,s=vt(e,t),r=s.getContext("2d"),a=r.createImageData(e,t),o=(u,d)=>{let f=(u%e+e)%e,h=(d%t+t)%t;return n[(h*e+f)*4]/255},l=BS/4;for(let u=0;u<t;u++)for(let d=0;d<e;d++){let f=o(d-1,u-1),h=o(d,u-1),m=o(d+1,u-1),x=o(d-1,u),p=o(d+1,u),g=o(d-1,u+1),y=o(d,u+1),M=o(d+1,u+1),_=m+2*p+M-(f+2*x+g),b=g+2*y+M-(f+2*h+m),S=-_*l,R=b*l,v=1,w=Math.hypot(S,R,v)||1;S/=w,R/=w,v/=w;let A=(u*e+d)*4;a.data[A]=(S*.5+.5)*255,a.data[A+1]=(R*.5+.5)*255,a.data[A+2]=(v*.5+.5)*255,a.data[A+3]=255}r.putImageData(a,0,0);let c=new pn(s);return c.colorSpace=pi,c.wrapS=c.wrapT=on,c.anisotropy=8,c.name="normal",V0++,c}var k0=new WeakMap;function HS(i){if(!i)return null;let e=k0.get(i);return e||(e=kS(i),k0.set(i,e)),e}function W0(i){return(e,t=1)=>{i.fillStyle=`rgba(${e},${e},${e},${t})`}}function kn(i,e={}){let{normalScale:t,...n}=e,s=new he({map:i,...n}),r=i&&i.userData?i.userData.surface:null,a=t??(r?r.normalScale:0),o=HS(r&&r.height);return o&&(s.normalMap=o,s.normalScale.set(a,a)),s}function ns(i,e,t,n=Yn){let s=i.clone(),r=Math.max(1e-4,e/n),a=Math.max(1e-4,t/n);return i.map&&(s.map=i.map.clone(),s.map.needsUpdate=!0,s.map.repeat.set(r,a)),i.normalMap&&(s.normalMap=i.normalMap.clone(),s.normalMap.needsUpdate=!0,s.normalMap.repeat.set(r,a)),s}function X0(i){return i&&i.map&&i.normalMap&&(i.normalMap.repeat.copy(i.map.repeat),i.normalMap.needsUpdate=!0),i}function Ao(i={}){let{base:e="#c9c6bc",grout:t="#9c9a90",tileWMM:n=200,tileHMM:s=300,water:r=16,metersPerRepeat:a=Yn}=i,o=Ts,l=Li(n,o,!1,a),c=Li(s,o,!1,a),u=o/l,d=o/c,f=vt(o),h=f.getContext("2d"),m=vt(o),x=m.getContext("2d"),p=W0(x);x.fillStyle="#e8e8e8",x.fillRect(0,0,o,o),p(70);for(let y=0;y<=o;y+=u)x.fillRect(y-1,0,2.4,o);for(let y=0;y<=o;y+=d)x.fillRect(0,y-1,o,2.4);h.fillStyle=e,h.fillRect(0,0,o,o),h.strokeStyle=t,h.lineWidth=2.2;for(let y=0;y<=o;y+=u)h.beginPath(),h.moveTo(y,0),h.lineTo(y,o),h.stroke();for(let y=0;y<=o;y+=d)h.beginPath(),h.moveTo(0,y),h.lineTo(o,y),h.stroke();for(let y=0;y<c;y++)for(let M=0;M<l;M++){let _=.92+Math.random()*.16;h.fillStyle=`rgba(255,255,255,${(_-1)*.35})`,h.fillRect(M*u+1.6,y*d+1.6,u-3.2,d-3.2)}for(let y=0;y<r;y++){let M=Math.random()*o,_=h.createLinearGradient(M,0,M,o);_.addColorStop(0,`rgba(74,78,68,${.1+Math.random()*.18})`),_.addColorStop(1,"rgba(74,78,68,0)"),h.fillStyle=_,h.fillRect(M,0,12+Math.random()*34,o)}Bn(h,o,o,90,y=>`rgba(62,66,58,${.03+y*.07})`,60);let g=h.createLinearGradient(0,o*.72,0,o);return g.addColorStop(0,"rgba(56,60,50,0)"),g.addColorStop(1,"rgba(56,60,50,0.42)"),h.fillStyle=g,h.fillRect(0,o*.72,o,o*.28),Bt(h,o,o,14),yn(f,{kind:"tileWall",normalScale:1,height:m,metersPerRepeat:a})}function As(i={}){let{base:e="#7e8078",crack:t=18,wet:n=.35,metersPerRepeat:s=Yn}=i,r=Rs,a=vt(r),o=a.getContext("2d"),l=vt(r),c=l.getContext("2d"),u=W0(c);c.fillStyle="#b4b4b4",c.fillRect(0,0,r,r),o.fillStyle=e,o.fillRect(0,0,r,r),Bn(o,r,r,60,d=>`rgba(52,55,50,${.02+d*.06})`,34),Bn(o,r,r,30,d=>`rgba(150,150,142,${.015+d*.04})`,22),o.strokeStyle="rgba(42,45,40,0.5)",u(58);for(let d=0;d<t;d++){let f=.6+Math.random()*1.3;o.lineWidth=f,c.lineWidth=f+.6;let h=[],m=Math.random()*r,x=Math.random()*r;h.push([m,x]);for(let p=0;p<5;p++)m+=(Math.random()-.5)*46,x+=(Math.random()-.5)*46,h.push([m,x]);for(let p of[h,h.map(([g,y])=>[g+r,y])])o.beginPath(),c.beginPath(),p.forEach(([g,y],M)=>{M?(o.lineTo(g,y),c.lineTo(g,y)):(o.moveTo(g,y),c.moveTo(g,y))}),o.stroke(),c.stroke()}if(n>0)for(let d=0;d<10;d++){let f=o.createRadialGradient(Math.random()*r,Math.random()*r,2,Math.random()*r,Math.random()*r,30+Math.random()*50);f.addColorStop(0,`rgba(38,44,46,${n*.5})`),f.addColorStop(1,"rgba(38,44,46,0)"),o.fillStyle=f,o.fillRect(0,0,r,r)}return Bt(o,r,r,26),Bt(c,r,r,18),yn(a,{kind:"concrete",normalScale:.5,height:l,metersPerRepeat:s})}function dh(i={}){let{base:e="#7b786e",slabMM:t=900,jointMM:n=14,metersPerRepeat:s=uh,stain:r=6,tone:a=.11,crack:o=2}=i,l=Ts,c=Li(t,l,!1,s),u=l/c,d=Math.max(2,ef(n,l,s)),f=vt(l),h=f.getContext("2d"),m=vt(l),x=m.getContext("2d");x.fillStyle="#dedede",x.fillRect(0,0,l,l),h.fillStyle=e,h.fillRect(0,0,l,l);for(let M=0;M<c;M++)for(let _=0;_<c;_++){let b=(Math.random()-.5)*2,S=Math.sign(b)*Math.pow(Math.abs(b),2.2)*a;h.fillStyle=S>0?`rgba(255,255,255,${S})`:`rgba(0,0,0,${-S})`,h.fillRect(_*u,M*u,u,u)}let p=(M,_,b,S)=>{S.fillStyle=b;for(let R of[-l,0,l])S.fillRect(M+R-_/2,0,_,l)},g=(M,_,b,S)=>{S.fillStyle=b;for(let R of[-l,0,l])S.fillRect(0,M+R-_/2,l,_)},y=Math.max(d*3,4);for(let M=0;M<c;M++)p(M*u,y,"rgba(40,42,38,0.10)",h),g(M*u,y,"rgba(40,42,38,0.10)",h);for(let M=0;M<c;M++)p(M*u,d,"rgba(36,38,34,0.44)",h),p(M*u,d,"#565656",x),g(M*u,d,"rgba(36,38,34,0.44)",h),g(M*u,d,"#565656",x),p(M*u+d*.75,2,"rgba(255,255,255,0.10)",h),g(M*u+d*.75,2,"rgba(255,255,255,0.10)",h);for(let M=0;M<r;M++){let _=Math.random()*c|0,b=Math.random()*c|0,S=(_+.5)*u+(Math.random()-.5)*u*.6,R=(b+.5)*u+(Math.random()-.5)*u*.6,v=Math.random()<.3,w=.1+Math.random()*.14,A=h.createRadialGradient(S,R,2,S,R,u*(.5+Math.random()*.8));A.addColorStop(0,v?`rgba(226,226,220,${w*.8})`:`rgba(40,44,42,${w})`),A.addColorStop(1,v?"rgba(226,226,220,0)":"rgba(40,44,42,0)"),h.fillStyle=A,h.beginPath(),h.arc(S,R,u*1.4,0,Math.PI*2),h.fill()}for(let M=0;M<Math.max(3,c);M++){let _=Math.random()*l,b=Math.random()*l,S=u*(1.2+Math.random()*2),R=Math.random()<.35,v=.035+Math.random()*.055,w=h.createRadialGradient(_,b,S*.15,_,b,S);w.addColorStop(0,R?`rgba(232,230,222,${v})`:`rgba(46,48,44,${v})`),w.addColorStop(1,"rgba(0,0,0,0)"),h.fillStyle=w,h.beginPath(),h.arc(_,b,S,0,Math.PI*2),h.fill()}for(let M=0;M<260;M++){let _=Math.random()*l,b=Math.random()*l,S=.7+Math.random()*1.4,R=Math.random()<.45;h.fillStyle=R?`rgba(236,234,226,${.05+Math.random()*.1})`:`rgba(38,40,36,${.05+Math.random()*.11})`,h.fillRect(_,b,S,S)}for(let M=0;M<o;M++){let _=Math.random()*c|0,b=Math.random()*c|0,S=(_+.3)*u,R=(b+.3)*u;h.strokeStyle="rgba(30,32,30,0.42)",x.strokeStyle="#4a4a4a",h.lineWidth=1+Math.random()*.8,x.lineWidth=h.lineWidth+.8,h.beginPath(),x.beginPath(),h.moveTo(S,R),x.moveTo(S,R);for(let v=0;v<4;v++)S+=(Math.random()-.5)*u*.28,R+=(Math.random()-.5)*u*.28,S=Math.min((_+1)*u-2,Math.max(_*u+2,S)),R=Math.min((b+1)*u-2,Math.max(b*u+2,R)),h.lineTo(S,R),x.lineTo(S,R);h.stroke(),x.stroke()}return Bt(h,l,l,20),Bt(x,l,l,12),yn(f,{kind:"slab",normalScale:.55,height:m,metersPerRepeat:s})}var tf=[{bg:"#b0342a",fg:"#f2efe6",edge:"#7d1f18"},{bg:"#c0392b",fg:"#f2d06b",edge:"#8e2418"},{bg:"#1e5b8a",fg:"#eef2f5",edge:"#123c5e"},{bg:"#1f6f4a",fg:"#eef5ef",edge:"#12452e"},{bg:"#e8b93a",fg:"#a03020",edge:"#b08a20"},{bg:"#ece8dc",fg:"#b0342a",edge:"#c4bda8"},{bg:"#2a2a28",fg:"#d9b45a",edge:"#111110"},{bg:"#c9601f",fg:"#f7f1e6",edge:"#8f4212"},{bg:"#243a5e",fg:"#e8c86a",edge:"#14243c"},{bg:"#2d4a3e",fg:"#e4ddc8",edge:"#1a2e26"},{bg:"#a83a6a",fg:"#f5eef2",edge:"#78264a"},{bg:"#4a5a68",fg:"#dfe4e8",edge:"#2d3a45"}],q0=['"Microsoft YaHei","PingFang SC",sans-serif','"SimHei","Microsoft YaHei",sans-serif','"SimSun","Songti SC",serif','"STZhongsong","SimSun",serif'];function Y0(i,e={}){let{w:t=512,h:n=128,style:s=null,layout:r="h",sub:a="",font:o=q0[0],frame:l=!0,distress:c=14}=e,u=e.bg??(s?s.bg:"#b0342a"),d=e.fg??(s?s.fg:"#f2efe6"),f=e.edge??(s?s.edge:null),h=vt(t,n),m=h.getContext("2d");if(m.fillStyle=u,m.fillRect(0,0,t,n),m.fillStyle=d,m.textAlign="center",m.textBaseline="middle",r==="v"){let x=[...String(i)],p=Math.min(t*.6,n*.88/Math.max(x.length,1));m.font=`700 ${p}px ${o}`;let g=n/(x.length+.35);x.forEach((y,M)=>m.fillText(y,t/2,g*(M+.68)))}else if(r==="stack"&&a){let x=Math.min(n*.46,t*.88/Math.max(String(i).length,1));m.font=`700 ${x}px ${o}`,m.fillText(i,t/2,n*.37);let p=Math.min(n*.22,t*.7/Math.max(String(a).length,1));m.globalAlpha=.88,m.font=`400 ${p}px ${o}`,m.fillText(a,t/2,n*.74),m.globalAlpha=1}else{let x=Math.min(n*.62,t*.86/Math.max(String(i).length,1));m.font=`700 ${x}px ${o}`,m.fillText(i,t/2,n*.54)}return l&&(m.strokeStyle=f||"rgba(30,26,22,0.5)",m.lineWidth=5,m.strokeRect(2.5,2.5,t-5,n-5)),Bn(m,t,n,16,x=>`rgba(40,34,28,${.04+x*.12})`,26),c&&Bt(m,t,n,c),yn(h,{kind:"sign",normalScale:.3,clamp:!0})}function K0(i={}){let{w:e=384,h:t=512,style:n=null,title:s="特价",sub:r="",price:a="",note:o="",motif:l="band",font:c=q0[0]}=i,u=i.bg??(n?n.bg:"#c0392b"),d=i.fg??(n?n.fg:"#f7f1e6"),f=vt(e,t),h=f.getContext("2d");h.fillStyle="#efe9dc",h.fillRect(0,0,e,t),h.fillStyle=u,h.fillRect(0,0,e,t*.62),l!=="none"&&(h.save(),h.globalAlpha=.2,h.fillStyle="#ffffff",l==="band"?(h.translate(e*.5,t*.31),h.rotate(-.5),h.fillRect(-e,-t*.085,e*2,t*.17),h.rotate(1),h.fillRect(-e,-t*.045,e*2,t*.09)):(h.beginPath(),h.arc(e*.5,t*.31,e*.27,0,Math.PI*2),h.fill()),h.restore()),h.fillStyle=d,h.textAlign="center",h.textBaseline="middle";let m=Math.min(t*.16,e*.8/Math.max([...String(s)].length,1));if(h.font=`700 ${m}px ${c}`,h.fillText(s,e/2,t*.22),a&&(h.font=`700 ${t*.155}px ${c}`,h.fillText(a,e/2,t*.47)),h.fillStyle="#3a352c",r){let x=Math.min(t*.062,e*.72/Math.max([...String(r)].length,1));h.font=`500 ${x}px ${c}`,h.fillText(r,e/2,t*.72)}if(o){h.fillStyle="#6a6356";let x=Math.min(t*.044,e*.76/Math.max([...String(o)].length,1));h.font=`400 ${x}px ${c}`,h.fillText(o,e/2,t*.82)}return h.fillStyle=u,h.fillRect(0,t*.9,e,t*.1),Bn(h,e,t,14,x=>`rgba(60,52,40,${.03+x*.1})`,30),Bt(h,e,t,12),yn(f,{kind:"poster",normalScale:.25,clamp:!0})}var H0=[{t:"疏通下水道",n:"138 0013 8000"},{t:"专业开锁换锁芯",n:"159 2048 7761"},{t:"搬家拉货长短途",n:"137 5520 3312"},{t:"空调拆装加雪种",n:"186 7734 0912"},{t:"老中医专治腰腿",n:"135 6091 4428"},{t:"高价回收旧家电",n:"158 3376 2205"},{t:"水电安装防水补漏",n:"139 8812 6640"},{t:"出租单间带空调",n:"133 2468 1573"}];function $0(i={}){let{w:e=256,h:t=362,seed:n=0,aged:s=!0}=i,r=H0[Math.abs(n|0)%H0.length],a=vt(e,t),o=a.getContext("2d");o.fillStyle=s?"#f0ead8":"#fbfaf6",o.fillRect(0,0,e,t),o.fillStyle="#241f1a",o.textAlign="center",o.textBaseline="middle";let l=[...r.t],c=l.length>7?[l.slice(0,Math.ceil(l.length/2)).join(""),l.slice(Math.ceil(l.length/2)).join("")]:[r.t,""],u=Math.min(e*.17,e*.86/Math.max(...c.map(d=>d.length),1));return o.font=`700 ${u}px "SimHei","Microsoft YaHei",sans-serif`,c.forEach((d,f)=>{d&&o.fillText(d,e/2,t*(.29+f*.155))}),o.font=`700 ${e*.115}px Arial,sans-serif`,o.fillText(r.n,e/2,t*.65),o.strokeStyle="rgba(36,31,26,0.5)",o.lineWidth=2,o.beginPath(),o.moveTo(e*.15,t*.75),o.lineTo(e*.85,t*.75),o.stroke(),Bn(o,e,t,10,d=>`rgba(120,100,70,${.04+d*.1})`,22),Bt(o,e,t,10),yn(a,{kind:"flyer",normalScale:.15,clamp:!0})}var z0=["热烈庆祝开业大吉","创建文明城市 共建美好家园","此处严禁倒垃圾","安全生产 人人有责","全民反诈 你我同行","依法经营 诚信为本","消防安全 重于泰山","保持通道畅通 严禁堆放杂物"];function Z0(i={}){let{w:e=1024,h:t=128,text:n=null,seed:s=0}=i,r=n||z0[Math.abs(s|0)%z0.length],a=vt(e,t),o=a.getContext("2d");o.fillStyle="#c0392b",o.fillRect(0,0,e,t),o.fillStyle="#f5d76e";let l=Math.min(t*.6,e*.9/Math.max([...r].length,1));return o.font=`700 ${l}px "STZhongsong","SimSun",serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(r,e/2,t*.53),Bn(o,e,t,12,c=>`rgba(70,20,14,${.04+c*.1})`,26),Bt(o,e,t,10),yn(a,{kind:"banner",normalScale:.2,clamp:!0})}function Co(){let i=Rs,e=vt(i),t=e.getContext("2d"),n=vt(i),s=n.getContext("2d");t.fillStyle="#5c6058",t.fillRect(0,0,i,i),s.fillStyle="#c0c0c0",s.fillRect(0,0,i,i);let r=i/Li(600,i);for(let a=0;a<i;a+=r)t.fillStyle=`rgba(28,32,30,${.2+Math.random()*.2})`,t.fillRect(a,0,3,i),s.fillStyle="#5a5a5a",s.fillRect(a-1.5,0,4.5,i);return Bn(t,i,i,40,a=>`rgba(92,64,40,${.05+a*.18})`,30),Bt(t,i,i,22),Bt(s,i,i,14),yn(e,{kind:"roof",normalScale:.6,height:n})}function nf(){let e=vt(128,128),t=e.getContext("2d"),n=t.createLinearGradient(0,0,0,128);return n.addColorStop(0,"#4a5560"),n.addColorStop(.5,"#333b44"),n.addColorStop(1,"#242a31"),t.fillStyle=n,t.fillRect(0,0,128,128),Bt(t,128,128,12),yn(e,{kind:"glass",normalScale:0,clamp:!0})}var lh=null,Jd=null,ch=null,G0=null;function sf(i=.9,e=1.2){lh||(lh=new he({color:10133658,roughness:.58,metalness:.85}),Jd=new he({color:4869448,roughness:.5,metalness:.9}));let t=new Ce,n=new I(new se(i,e,.08),lh);t.add(n);let s=.022,r=lh;for(let[l,c,u,d]of[[i+s*2,s,0,e/2+s/2],[i+s*2,s,0,-e/2-s/2],[s,e+s*2,i/2+s/2,0],[s,e+s*2,-i/2-s/2,0]]){let f=new I(new se(l,c,.1),r);f.position.set(u,d,.012),f.userData.bevel="window-lip",t.add(f)}t.userData.bevels=(t.userData.bevels||0)+4;let a=new I(new rt(i*.82,e*.82),hh());a.position.z=.045,t.add(a);for(let l=1;l<=4;l++){let c=new I(new se(.025,e*.94,.025),Jd);c.position.set(-i/2+i*l/5,0,.06),t.add(c)}let o=new I(new se(i*.94,.025,.025),Jd);return o.position.set(0,0,.06),t.add(o),t}var j0=null;function hh(){return hh._m||(hh._m=new he({map:j0,roughness:.12,metalness:0,envMapIntensity:1.5})),hh._m}function J0(){j0=nf()}function rf(i={}){let{base:e="#8a5f4a",mortar:t="#6f6a60",brickWMM:n=250,rowHMM:s=125,metersPerRepeat:r=Yn}=i,a=Ts,o=Li(n,a,!0,r),l=Li(s,a,!0,r),c=a/o,u=a/l,d=Math.max(1.6,u*.09),f=vt(a),h=f.getContext("2d"),m=vt(a),x=m.getContext("2d");x.fillStyle="#d2d2d2",x.fillRect(0,0,a,a),h.fillStyle=t,h.fillRect(0,0,a,a);for(let p=0;p<l;p++){let g=p*u,y=p%2*(c/2);x.fillRect(0,g-d/2,a,d);for(let M=-1;M<=o;M++){let _=M*c+y;x.fillRect(_-d/2,g,d,u);let b=.82+Math.random()*.36;h.fillStyle=`rgb(${Math.round(138*b)},${Math.round(95*b)},${Math.round(74*b)})`,h.fillRect(_+d/2,g+d/2,c-d,u-d)}}return Bn(h,a,a,40,p=>`rgba(40,36,32,${.03+p*.1})`,30),Bt(h,a,a,22),Bt(x,a,a,16),yn(f,{kind:"brick",normalScale:1.1,height:m,metersPerRepeat:r})}function mi(i={}){let{base:e="#6d7370",ribMM:t=150,vertical:n=!1}=i,s=Rs,r=s/Li(t,s),a=vt(s),o=a.getContext("2d"),l=vt(s),c=l.getContext("2d");o.fillStyle=e,o.fillRect(0,0,s,s),c.fillStyle="#808080",c.fillRect(0,0,s,s);for(let u=0;u<s;u+=r){let d=o.createLinearGradient(u,0,u+r,0);d.addColorStop(0,"rgba(255,255,255,0.15)"),d.addColorStop(.5,"rgba(0,0,0,0.22)"),d.addColorStop(1,"rgba(255,255,255,0.08)"),o.fillStyle=d,n?o.fillRect(u,0,r,s):o.fillRect(0,u,s,r);for(let f=0;f<r;f++){let h=f/r*Math.PI*2,m=Math.round(128+Math.sin(h)*100);c.fillStyle=`rgb(${m},${m},${m})`,n?c.fillRect(u+f,0,1,s):c.fillRect(0,u+f,s,1)}}return Bn(o,s,s,34,u=>`rgba(96,64,40,${.04+u*.16})`,26),Bt(o,s,s,18),yn(a,{kind:"metalPanel",normalScale:.7,height:l})}function fh(i={}){let{base:e="#46525c",mullion:t="#2c3238",cellMM:n=1200,metersPerRepeat:s=Yn}=i,r=Ts,a=Li(n,r,!1,s),o=r/a,l=vt(r),c=l.getContext("2d"),u=vt(r),d=u.getContext("2d");d.fillStyle="#dcdcdc",d.fillRect(0,0,r,r),c.fillStyle=e,c.fillRect(0,0,r,r);for(let f=0;f<r;f+=o){d.fillRect(0,f-2,r,4);for(let h=0;h<r;h+=o){d.fillRect(h-2,f,4,o);let m=.78+Math.random()*.5;c.fillStyle=`rgba(${Math.round(96*m)},${Math.round(112*m)},${Math.round(124*m)},0.85)`,c.fillRect(h+2,f+2,o-4,o-4);let x=c.createLinearGradient(h,f,h+o,f+o);x.addColorStop(0,"rgba(190,205,215,0.16)"),x.addColorStop(.5,"rgba(0,0,0,0)"),x.addColorStop(1,"rgba(20,26,30,0.22)"),c.fillStyle=x,c.fillRect(h+2,f+2,o-4,o-4)}}c.strokeStyle=t,c.lineWidth=4;for(let f=0;f<=r;f+=o)c.beginPath(),c.moveTo(f,0),c.lineTo(f,r),c.stroke(),c.beginPath(),c.moveTo(0,f),c.lineTo(r,f),c.stroke();return Bt(c,r,r,10),Bt(d,r,r,8),yn(l,{kind:"curtainWall",normalScale:.6,height:u,metersPerRepeat:s})}function Q0(i={}){let{metersPerRepeat:e=uh}=i,t=Rs,n=vt(t),s=n.getContext("2d"),r=vt(t),a=r.getContext("2d");s.fillStyle="#4a4c4a",s.fillRect(0,0,t,t),a.fillStyle="#a8a8a8",a.fillRect(0,0,t,t),Bn(s,t,t,70,o=>`rgba(30,32,33,${.05+o*.14})`,40),Bn(s,t,t,40,o=>`rgba(120,122,118,${.02+o*.05})`,18);for(let o=0;o<900;o++){let l=Math.random()*t,c=Math.random()*t,u=.6+Math.random()*1.7,d=.7+Math.random()*.6;s.fillStyle=`rgba(${Math.round(130*d)},${Math.round(132*d)},${Math.round(128*d)},0.5)`,s.beginPath(),s.arc(l,c,u,0,Math.PI*2),s.fill(),a.fillStyle=`rgba(255,255,255,${.25+Math.random()*.5})`,a.beginPath(),a.arc(l,c,u,0,Math.PI*2),a.fill()}for(let o=0;o<6;o++){s.strokeStyle="rgba(26,28,28,0.6)",s.lineWidth=1+Math.random(),a.strokeStyle="#4a4a4a",a.lineWidth=1.6+Math.random(),s.beginPath(),a.beginPath();let l=Math.random()*t,c=Math.random()*t;s.moveTo(l,c),a.moveTo(l,c);for(let u=0;u<6;u++)l+=(Math.random()-.5)*60,c+=(Math.random()-.5)*60,s.lineTo(l,c),a.lineTo(l,c);s.stroke(),a.stroke()}return Bt(s,t,t,30),Bt(a,t,t,22),yn(n,{kind:"asphalt",normalScale:.6,height:r,metersPerRepeat:e})}function eg(i={}){let{gap:e="#706f68",tileMM:t=300,metersPerRepeat:n=uh}=i,s=Ts,r=Li(t,s,!1,n),a=s/r,o=Math.max(2,a*.035),l=vt(s),c=l.getContext("2d"),u=vt(s),d=u.getContext("2d");d.fillStyle="#d0d0d0",d.fillRect(0,0,s,s),c.fillStyle=e,c.fillRect(0,0,s,s);for(let f=0;f<s;f+=a){d.fillStyle="#5c5c5c",d.fillRect(0,f-o/2,s,o);for(let h=0;h<s;h+=a){d.fillStyle="#5c5c5c",d.fillRect(h-o/2,f,o,a);let m=(Math.random()-.5)*2,x=1+Math.sign(m)*Math.pow(Math.abs(m),2.4)*.055,p=Math.random()<.04?.86:1,g=x*p;c.fillStyle=`rgb(${Math.round(155*g)},${Math.round(154*g)},${Math.round(146*g)})`,c.fillRect(h+o/2,f+o/2,a-o,a-o)}}for(let f=0;f<s;f+=a)c.fillStyle="rgba(52,54,50,0.10)",c.fillRect(0,f-o,s,o*2);return Bn(c,s,s,46,f=>`rgba(60,62,58,${.03+f*.08})`,34),Bt(c,s,s,16),Bt(d,s,s,12),yn(l,{kind:"paver",normalScale:.8,height:u,metersPerRepeat:n})}function tg(i={}){let{base:e="#454b3e",metersPerRepeat:t=DS}=i,n=Rs,s=vt(n),r=s.getContext("2d"),a=vt(n),o=a.getContext("2d");r.fillStyle=e,r.fillRect(0,0,n,n),o.fillStyle="#909090",o.fillRect(0,0,n,n);let l=5200;for(let c=0;c<l;c++){let u=.6+Math.random()*.9,d=Math.random()*n,f=Math.random()*n,h=(Math.random()-.5)*4,m=-3-Math.random()*5;r.strokeStyle=`rgba(${Math.round(72*u)},${Math.round(80*u)},${Math.round(58*u)},0.8)`,r.lineWidth=1,r.beginPath(),r.moveTo(d,f),r.lineTo(d+h,f+m),r.stroke(),o.strokeStyle=u>.95?"rgba(240,240,240,0.5)":"rgba(150,150,150,0.35)",o.lineWidth=1,o.beginPath(),o.moveTo(d,f),o.lineTo(d+h,f+m),o.stroke()}return Bn(r,n,n,30,c=>`rgba(38,42,32,${.05+c*.14})`,34),Bt(r,n,n,14),Bt(o,n,n,20),yn(s,{kind:"grass",normalScale:.5,height:a,metersPerRepeat:t})}function Po(i={}){let{base:e="#8f8b84",slabMM:t=800,jointMM:n=10,metersPerRepeat:s=uh,tone:r=.09}=i,a=Ts,o=Li(t,a,!1,s),l=a/o,c=Math.max(2,ef(n,a,s)),u=vt(a),d=u.getContext("2d"),f=vt(a),h=f.getContext("2d");d.fillStyle=e,d.fillRect(0,0,a,a),h.fillStyle="#e0e0e0",h.fillRect(0,0,a,a);for(let p=0;p<34;p++){let g=Math.random()*a,y=Math.random()*a,M=l*(.45+Math.random()*1.15),_=Math.random()<.5,b=.03+Math.random()*.045,S=d.createRadialGradient(g,y,M*.12,g,y,M);S.addColorStop(0,_?`rgba(236,234,228,${b})`:`rgba(66,62,58,${b})`),S.addColorStop(1,"rgba(0,0,0,0)"),d.fillStyle=S,d.beginPath(),d.arc(g,y,M,0,Math.PI*2),d.fill()}for(let p=0;p<130;p++){let g=Math.random()*a,y=Math.random()*a,M=l*(.06+Math.random()*.22),_=Math.random()<.5,b=.02+Math.random()*.04;d.fillStyle=_?`rgba(240,238,232,${b})`:`rgba(58,54,50,${b})`,d.beginPath(),d.arc(g,y,M,0,Math.PI*2),d.fill()}for(let p=0;p<o;p++)for(let g=0;g<o;g++){let y=(Math.random()-.5)*2,M=Math.sign(y)*Math.pow(Math.abs(y),2.2)*r;d.fillStyle=M>0?`rgba(255,255,255,${M})`:`rgba(0,0,0,${-M})`,d.fillRect(g*l,p*l,l,l)}let m=(p,g,y,M)=>{M.fillStyle=y;for(let _ of[-a,0,a])M.fillRect(p+_-g/2,0,g,a)},x=(p,g,y,M)=>{M.fillStyle=y;for(let _ of[-a,0,a])M.fillRect(0,p+_-g/2,a,g)};for(let p=0;p<o;p++)m(p*l,Math.max(c*3,5),"rgba(58,54,50,0.12)",d),x(p*l,Math.max(c*3,5),"rgba(58,54,50,0.12)",d);for(let p=0;p<o;p++)m(p*l,c,"rgba(70,66,62,0.44)",d),m(p*l,c,"#585858",h),x(p*l,c,"rgba(70,66,62,0.44)",d),x(p*l,c,"#585858",h),m(p*l+c*.8,2,"rgba(255,255,255,0.12)",d),x(p*l+c*.8,2,"rgba(255,255,255,0.12)",d);for(let p=0;p<46;p++){let g=Math.random()<.35;d.strokeStyle=g?`rgba(238,236,230,${.1+Math.random()*.16})`:`rgba(58,54,50,${.08+Math.random()*.16})`,d.lineWidth=.6+Math.random()*1.7,d.beginPath();let y=Math.random()*a,M=Math.random()*a;d.moveTo(y,M);let _=(Math.random()-.5)*2,b=(Math.random()-.5)*.7;for(let S=0;S<5;S++)y+=_*(40+Math.random()*90),M+=b*(40+Math.random()*90)+(Math.random()-.5)*30,d.lineTo(y,M);d.stroke()}for(let p=0;p<300;p++){let g=Math.random()<.5;d.fillStyle=g?`rgba(240,238,232,${.05+Math.random()*.1})`:`rgba(52,48,44,${.05+Math.random()*.1})`,d.fillRect(Math.random()*a,Math.random()*a,.7+Math.random()*1.3,.7+Math.random()*1.3)}return Bt(d,a,a,12),Bt(h,a,a,10),yn(u,{kind:"stone",normalScale:.8,height:f,metersPerRepeat:s})}function ng(i={}){let{base:e="#6b4f38",metersPerRepeat:t=Yn}=i,n=Rs,s=vt(n),r=s.getContext("2d"),a=vt(n),o=a.getContext("2d");r.fillStyle=e,r.fillRect(0,0,n,n),o.fillStyle="#b8b8b8",o.fillRect(0,0,n,n);for(let l=0;l<120;l++){let c=`rgba(${40+Math.random()*60},${28+Math.random()*40},${18+Math.random()*30},${.12+Math.random()*.22})`,u=.7+Math.random()*2.4;r.strokeStyle=c,r.lineWidth=u;let d=Math.random()<.45;d&&(o.strokeStyle="rgba(88,88,88,0.55)",o.lineWidth=u*.8);let f=Math.random()*n;r.beginPath(),o.beginPath(),r.moveTo(0,f),o.moveTo(0,f);for(let h=0;h<=n;h+=32)f+=(Math.random()-.5)*5,r.lineTo(h,f),o.lineTo(h,f);r.stroke(),d&&o.stroke()}return Bt(r,n,n,16),yn(s,{kind:"wood",normalScale:.7,height:a,metersPerRepeat:t})}function ig(){ch||(ch=new he({color:11053214,roughness:.72,metalness:.25}),G0=new he({color:5921878,roughness:.62,metalness:.5}));let i=new Ce,e=new I(new se(.78,.54,.32),ch);i.add(e);let t=new I(new se(.8,.03,.34),ch);t.position.y=.27,i.add(t);let n=new I(new qe(.2,.2,.04,16),G0);return n.rotation.x=Math.PI/2,n.position.z=.17,i.add(n),i}var gi=null,Ut=kn;function ph(){let i={glass:nf(),asphalt:Q0(),paver:eg(),grass:tg({metersPerRepeat:3}),stone:Po(),wood:ng(),roof:Co()},e=s=>s<=1?[Ut(Ao({base:"#c2bfb4"}),{roughness:.45}),Ut(Ao({base:"#b6b3a7",tileHMM:380}),{roughness:.48}),Ut(rf({base:"#7d5644"}),{roughness:.94}),Ut(As({base:"#8a8880",wet:.2}),{roughness:.93})]:s===2?[Ut(Ao({base:"#cbc9c0",water:8}),{roughness:.42}),Ut(As({base:"#9a978e",wet:.1,crack:10}),{roughness:.92}),Ut(rf({base:"#8a6a56",rowHMM:140}),{roughness:.95}),Ut(Ao({base:"#b8b6ac",tileWMM:250,water:6}),{roughness:.46})]:[Ut(Po({base:"#a8a49b"}),{roughness:.7}),Ut(fh({base:"#424e58"}),{roughness:.3,envMapIntensity:1.4}),Ut(Po({base:"#9c9a92",slabMM:1e3}),{roughness:.75}),Ut(fh({base:"#4a5258",cellMM:1500}),{roughness:.32,envMapIntensity:1.4})],t=s=>s<=1?Ut(dh({base:"#78756a",slabMM:900,stain:9}),{roughness:.95}):s===2?Ut(dh({base:"#8a877e",slabMM:1e3,stain:4}),{roughness:.93}):Ut(Po({base:"#a8a49b",slabMM:1200}),{roughness:.74});gi={tex:i,tiers:{},common:{metal:new he({color:5132620,roughness:.45,metalness:.9}),metalLight:new he({color:9277834,roughness:.42,metalness:.85}),dark:new he({color:2895665,roughness:.8}),rubber:new he({color:1974306,roughness:.95}),wood:Ut(i.wood,{roughness:.75}),stone:Ut(i.stone,{roughness:.72}),asphalt:Ut(i.asphalt,{roughness:.9}),paver:Ut(i.paver,{roughness:.86}),grass:Ut(i.grass,{roughness:.99}),glassPane:Ut(i.glass,{roughness:.1,envMapIntensity:1.5}),curtain:Ut(fh(),{roughness:.3,envMapIntensity:1.4}),panel:Ut(mi({base:"#6d7370"}),{roughness:.72}),panelBlue:Ut(mi({base:"#4e5a63",ribMM:180}),{roughness:.7}),panelRust:Ut(mi({base:"#6a5a4c",ribMM:160}),{roughness:.84}),trim:new he({color:10129798,roughness:.9}),tarp:new he({color:4147780,roughness:.96,side:Wt}),laneSurf:Ut(dh({base:"#6e7069",slabMM:800,stain:12,crack:3}),{roughness:.97}),signRed:null,cloth:[5991290,9076856,7167846,8030834,10132114].map(s=>new he({color:s,roughness:.95,side:Wt}))}};for(let s of[1,2,3]){let r=e(s);gi.tiers[s]={walls:r,wall:r[0],ground:t(s),roof:Ut(Co(),{roughness:.93}),accent:s<=1?new he({color:9058864,roughness:.85}):s===2?new he({color:6975339,roughness:.8}):new he({color:3621194,roughness:.62,envMapIntensity:1.2}),trim:s<=1?new he({color:10129798,roughness:.9}):s===2?new he({color:11052700,roughness:.88}):new he({color:11580333,roughness:.7}),awning:s<=1?new he({color:4867128,roughness:.95,side:Wt}):new he({color:5593944,roughness:.92,side:Wt})}}let n=s=>{s.map&&(s.map.repeat.set(1,1),s.map.needsUpdate=!0),s.normalMap&&(s.normalMap.repeat.set(1,1),s.normalMap.needsUpdate=!0)};for(let s of[1,2,3])n(gi.tiers[s].ground);return n(gi.common.asphalt),n(gi.common.laneSurf),n(gi.common.paver),gi}function Di(){if(!gi)throw new Error("palette 未初始化，先调用 buildPalette()");return gi}var is=i=>gi.tiers[Math.min(3,Math.max(1,i|0))]||gi.tiers[2];function Io(i){let e=2166136261;for(let t=0;t<i.length;t++)e^=i.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}function Lo(i){return function(){i|=0,i=i+1831565813|0;let e=Math.imul(i^i>>>15,1|i);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function sg(i,e="layout"){return Lo(Io(`20260919|${e}|${i}`))}var rg=Math.random;function ag(i){rg=typeof i=="function"?i:Math.random}function Dn(){return rg()}var ut=(i,e)=>i+Dn()*(e-i),ss=(i,e)=>Math.floor(ut(i,e+1)),ti=i=>i[Math.floor(Dn()*i.length)],nr=i=>Dn()<i;function zS(i,e,t){let n=Math.max(i,t)+e;return n<8?.02:n<26?.025:.03}function Cs(i,e,t,n,s,r,a=2){let o=zS(e,n,t),l=[[e/2+o/2,t/2+o/2],[-e/2-o/2,t/2+o/2],[e/2+o/2,-t/2-o/2],[-e/2-o/2,-t/2-o/2]].slice(0,Math.max(1,Math.min(4,a))),c=new se(o,n,o);for(let[u,d]of l){let f=new I(c,r);f.position.set(u,s+n/2,d),f.castShadow=!0,i.add(f)}return i.userData.chamfers=(i.userData.chamfers||0)+l.length,l.length}function gh(i,e,t,n,s,r,a,o){let c=new se(e+.04,.02,.05);for(let u of[t/2+.02/2,-t/2-.02/2]){let d=new I(c,o);d.position.set(n,s+u,r),a&&(d.rotation.y=a),d.userData.bevel="opening-sill",i.add(d)}return i.userData.sills=(i.userData.sills||0)+2,2}var le=null;function xh(i){le=i}var ei=[],cf=null;function yh(i){cf=i}function Tn(i,e,t,n={}){let s=new Ce,r=n.source||"kenney";if(s.userData.glb={source:r,kit:i,name:e,ready:!1},s.userData.noMerge=!0,typeof t=="function"){let a=t();a&&(a.userData.isFallback=!0,s.add(a))}return n.y&&(s.position.y=n.y),n.rotY&&(s.rotation.y=n.rotY),n.scale&&s.scale.setScalar(n.scale),n.footprint&&(s.userData.footprint=n.footprint),ei.push({wrap:s,kit:i,name:e,opt:n,source:r,owner:mh}),s}var mh=null;function og(i){let e=mh;return mh=i||null,()=>{mh=e}}function ia(){if(!cf)return 0;let i=0,e=0;for(let t=ei.length-1;t>=0;t--){let n=ei[t];if(!n.wrap.parent){ei.splice(t,1),e++;continue}let s=cf.instance(n.source||"kenney",n.kit,n.name,n.opt);if(s){for(let r=n.wrap.children.length-1;r>=0;r--){let a=n.wrap.children[r];a.userData.isFallback&&n.wrap.remove(a)}n.wrap.add(s),n.wrap.userData.glb.ready=!0,ei.splice(t,1),i++}}return lg=e,i}var lg=0;function cg(){return lg}function sa(){return ei.length}function hg(i=null){let e=ei.length;if(!i)return ei.length=0,e;for(let t=ei.length-1;t>=0;t--){let n=ei[t],s=n.owner===i;if(!s){let r=n.wrap;for(;r;){if(r===i){s=!0;break}r=r.parent}}s&&ei.splice(t,1)}return e-ei.length}function _h({large:i=!1,tier:e=2}={}){return Tn("industrial",i?"detail-tank-large":"detail-tank",()=>{let n=new Ce,s=i?1.1:.8,r=i?2.2:1.6,a=new I(new qe(s,s,r,14),le.common.metal);a.position.y=r/2,a.castShadow=!0,n.add(a);let o=new I(new qe(s*.55,s*.55,.22,12),le.common.metalLight);return o.position.y=r+.11,n.add(o),n.userData.footprint={w:s*2,d:s*2,h:r+.3},n},{footprint:{w:i?2.2:1.6,d:i?2.2:1.6,h:i?2.5:1.9}})}function vh({kind:i="medium"}={}){return Tn("industrial",`chimney-${i}`,null,{footprint:{w:1.2,d:1.2,h:8}})}function Mh(){return Tn("industrial","water-tower",null,{footprint:{w:2.4,d:2.4,h:9}})}function ug({landscape:i=!0}={}){return Tn("industrial",i?"solar-panel-landscape":"solar-panel-portrait",null,{footprint:{w:2,d:1.2,h:1.6}})}function dg({variant:i="a"}={}){return Tn("industrial",`shipping-container-${i}`,()=>{let e=new Ce,t=new I(new se(6,2.6,2.4),le.common.metal||le.common.metalLight);return t.position.y=1.3,t.castShadow=!0,e.add(t),e.userData.footprint={w:6,d:2.4,h:2.6},e},{footprint:{w:6,d:2.4,h:2.6}})}function fg({kind:i=null}={}){let e=i||ti(["light-square","light-square-double","light-curved"]);return Tn("roads",e,null,{footprint:{w:.6,d:.6,h:7}})}function pg(){return Tn("roads","construction-barrier",()=>{let i=new Ce,e=new I(new se(2,.9,.16),le.common.metalLight);return e.position.y=.65,e.castShadow=!0,i.add(e),i.userData.footprint={w:2,d:.2,h:1.1},i},{footprint:{w:2,d:.2,h:1.1}})}function bh(){return Tn("roads","construction-cone",null,{footprint:{w:.4,d:.4,h:.6}})}function Sh(){return Tn("roads","dumpster",null,{footprint:{w:1.6,d:.9,h:1.2}})}function Eh(){return Tn("roads","electricity-pole",null,{footprint:{w:.4,d:.4,h:8}})}function wh({wide:i=!1}={}){return Tn("commercial",i?"detail-awning-wide":"detail-awning",null,{footprint:{w:i?5:3,d:.9,h:.4}})}function Th({variant:i="a"}={}){return Tn("commercial",`detail-parasol-${i}`,null,{footprint:{w:1.6,d:1.6,h:2.4}})}function Ni(i,e,t={}){return Tn(i,i,e,{...t,source:"polyhaven"})}function Rh(){return Ni("rollershutter-door",null,{footprint:{w:3.2,d:.25,h:2.4}})}function Ah({variant:i=1}={}){let e=`rollershutter-window-${i}`;return Ni(e,null,{footprint:{w:1.6,d:.2,h:1.4}})}function Ch(){return Ni("fire-hydrant",()=>{let i=new Ce,e=new I(new qe(.11,.13,.62,10),le.common.metalLight);e.position.y=.31,e.castShadow=!0,i.add(e);let t=new I(new qe(.13,.13,.1,10),le.common.metal);return t.position.y=.66,i.add(t),i.userData.footprint={w:.28,d:.28,h:.8},i},{footprint:{w:.275,d:.318,h:.799}})}function Ph(){return Ni("metal-gutter",null,{footprint:{w:.2,d:.2,h:6}})}function Ih(){return Ni("fire-escape",null,{footprint:{w:2.4,d:1.2,h:6.466}})}function Lh(){return Ni("electricity-poles",null,{footprint:{w:.6,d:.6,h:10.039}})}function Dh(){return Ni("chainlink-fence",null,{footprint:{w:3.5,d:.1,h:3.468}})}function Do({variant:i=1}={}){return Ni(i===2?"road-barrier-2":"road-barrier",null,{footprint:{w:2.2,d:.5,h:1.1}})}function mg(){return Ni("apartments-facade",null,{footprint:{w:8,d:.5,h:3.055}})}function gg(){return Ni("factory-facade",null,{footprint:{w:8,d:.5,h:3.055}})}var ir={HERO:"hero",STALL:"stall"};function No(i,e,t,n={}){return Tn(i,e,t,{...n,source:"ai"})}function Nh({tier:i=2,w:e=7.3,d:t=6.5,floors:n=3}={}){return No(ir.HERO,"qilou",()=>Fo({w:e,d:t,floors:n,tier:i}),{footprint:{w:e,d:t,h:10}})}function Uh({tier:i=2,w:e=8,d:t=7,floors:n=6}={}){return No(ir.HERO,"old_apartment",()=>Fo({w:e,d:t,floors:n,tier:i}),{footprint:{w:e,d:t,h:18}})}function Uo({tier:i=1,w:e=11,d:t=9}={}){return No(ir.HERO,"lingnan_temple",()=>Fo({w:e,d:t,floors:2,tier:i}),{footprint:{w:e,d:t,h:7.5}})}function Fh(){return No(ir.STALL,"dapaidang",null,{footprint:{w:2.88,d:2.63,h:2.4}})}function Oh(){return No(ir.STALL,"market_stall",null,{footprint:{w:2.6,d:2.2,h:2.3}})}var xg=["qilou","old_apartment","lingnan_temple"];function GS(i){let e=2166136261;for(let t=0;t<i.length;t++)e^=i.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}function yg(i){return tf[GS(String(i))%tf.length]}var af=new Map;function VS(i,e={}){let t=i+JSON.stringify(e);if(af.has(t))return af.get(t);let n=e.style||e.bg?e:{...e,style:yg(i)},s=new he({map:Y0(i,n),roughness:.85});return af.set(t,s),s}var of=new Map;function WS(i){let e=i.bg;if(of.has(e))return of.get(e);let t=new he({color:i.bg,roughness:.85});return of.set(e,t),t}var lf=new Map;function Bh(i,e={}){let{bg:t="#e8e4d8",fg:n="#2a2a28",w:s=512,h:r=128,font:a='700 62px "Microsoft YaHei","PingFang SC",sans-serif'}=e,o=`${i}|${t}|${n}|${s}|${r}|${a}`;if(lf.has(o))return lf.get(o);let l=document.createElement("canvas");l.width=s,l.height=r;let c=l.getContext("2d");c.fillStyle=t,c.fillRect(0,0,s,r),c.fillStyle=n,c.font=a,c.textAlign="center",c.textBaseline="middle";let u=String(i).split(`
`),d=r/(u.length+.6);u.forEach((m,x)=>c.fillText(m,s/2,d*(x+.9)));let f=new pn(l);f.colorSpace=xt,f.wrapS=f.wrapT=jt;let h=new he({map:f,roughness:.9});return lf.set(o,h),h}function Fo({w:i,d:e,floors:t,floorH:n=2.9,tier:s=1,windows:r=!0}){let a=is(s),o=new Ce,l=t*n,c=ti(a.walls),u=new se(i,l,e),d=ns(c,i,l),f=new I(u,d);if(f.position.y=l/2,f.castShadow=!0,f.receiveShadow=!0,o.add(f),Cs(o,i,e,l,0,a.trim,2),r){let m=Math.max(2,Math.round(i/2.6));for(let x=0;x<t;x++){let p=x*n+n*.56;for(let g=0;g<m;g++){let y=-i/2+(g+.5)*(i/m);for(let M of[1,-1]){let _=sf(.88,1.24);_.position.set(y,p,M*(e/2+.05)),M<0&&(_.rotation.y=Math.PI),o.add(_)}}}}for(let m=0,x=ss(2,s===1?7:4);m<x;m++){let p=ig(),g=nr(.5)?1:-1;p.position.set(ut(-i/2+.7,i/2-.7),ut(n*1.2,l-.9),g*(e/2+.19)),g<0&&(p.rotation.y=Math.PI),o.add(p)}if(s<=2)for(let m=0,x=ss(0,s===1?4:2);m<x;m++){let p=ut(n*1.6,l-.6),g=nr(.5)?1:-1,y=ut(1.4,2.3),M=ut(-i/2+1.2,i/2-1.2),_=new I(new qe(.028,.028,y,6),le.common.metal);_.rotation.z=Math.PI/2,_.position.set(M,p,g*(e/2+.5)),o.add(_);let b=ss(1,3);for(let S=0;S<b;S++){let R=ut(.32,.55),v=ut(.6,1),w=new I(new rt(R,v),ti(le.common.cloth));w.position.set(M-y/2+(S+1)*(y/(b+1)),p-v/2-.03,g*(e/2+.5)),w.castShadow=!0,o.add(w)}}let h=new I(new se(i+.16,.5,e+.16),c);if(h.position.y=l+.25,h.castShadow=!0,o.add(h),nr(s===1?.75:.4)){let m=new I(new qe(.62,.62,1.15,14),new he({color:10134428,roughness:.6,metalness:.35}));m.position.set(ut(-i/4,i/4),l+1.1,ut(-e/4,e/4)),m.castShadow=!0,o.add(m)}if(nr(.5)){let m=new I(new se(ut(2,3.4),.12,ut(1.6,2.6)),kn(Co(),{roughness:.9}));m.position.set(ut(-i/4,i/4),l+.9,ut(-e/4,e/4)),m.rotation.z=ut(-.1,.1),m.castShadow=!0,o.add(m)}return o.userData.footprint={w:i,d:e,h:l},o}function kh({w:i,d:e,floors:t,floorH:n=2.85,tier:s=2,balcony:r=!0,units:a=null}){let o=is(s),l=new Ce,c=t*n,u=ti(o.walls),d=ns(u,i,c),f=new I(new se(i,c,e),d);f.position.y=c/2,f.castShadow=!0,f.receiveShadow=!0,l.add(f),Cs(l,i,e,c,0,o.trim,4);let h=a||Math.max(2,Math.round(i/3.6)),m=i/h;for(let p=0;p<t;p++){let g=p*n+n*.42;for(let y=0;y<h;y++){let M=-i/2+(y+.5)*m;for(let _ of[1,-1]){let b=sf(1.05,1.35);b.position.set(M,g+.5,_*(e/2+.05)),_<0&&(b.rotation.y=Math.PI),l.add(b)}if(r&&p>0)for(let _ of[1,-1]){let b=m*.78,S=new I(new se(b,.12,1.05),o.trim);S.position.set(M,g+1.5,_*(e/2+.55)),S.castShadow=!0,S.receiveShadow=!0,l.add(S);let R=new I(new se(b,.9,.06),le.common.metalLight);if(R.position.set(M,g+1.95,_*(e/2+1.06)),l.add(R),nr(.35)){let v=new I(new rt(b,.92),le.common.glassPane);v.position.set(M,g+1.95,_*(e/2+1.07)),_<0&&(v.rotation.y=Math.PI),l.add(v)}}}}for(let p=0;p<h;p++){let g=-i/2+(p+.5)*m,y=s<=1?le.common.dark:le.common.metalLight,M=new I(new se(1.1,2.1,.1),y);if(M.position.set(g,1.05,e/2+.06),l.add(M),gh(l,1.1,2.1,g,1.05,e/2+.07,0,o.trim),nr(.6)){let _=new I(new rt(.42,.3),Bh(`${ss(1,9)}栋`,{bg:"#c8c4b8",fg:"#3a3a36",w:256,h:180,font:'700 96px "Microsoft YaHei",sans-serif'}));_.position.set(g+.85,1.75,e/2+.07),l.add(_)}}let x=new I(new se(i+.14,.46,e+.14),u);return x.position.y=c+.23,x.castShadow=!0,l.add(x),l.userData.footprint={w:i,d:e,h:c},l}function Oo({w:i,d:e,floors:t,floorH:n=3.4,tier:s=3,podium:r=!0,crown:a=!0}){let o=is(s),l=new Ce,c=t*n,u=ns(le.common.curtain,i,c),d=new I(new se(i,c,e),u);d.position.y=c/2,d.castShadow=!0,d.receiveShadow=!0,l.add(d),Cs(l,i,e,c,0,o.trim,4);let f=o.trim;for(let h=1;h<t;h++){let m=new I(new se(i+.12,.14,e+.12),f);m.position.y=h*n,l.add(m)}if(r){let m=i+3.2,x=e+3.2,p=s>=3?kn(As({base:"#9c9a92",wet:0}),{roughness:.66}):o.wall,g=new I(new se(m,4.6,x),p);g.position.y=4.6/2,g.castShadow=!0,g.receiveShadow=!0,l.add(g),Cs(l,m,x,4.6,0,o.trim,4);for(let M of[1,-1]){let _=new I(new rt(m*.86,2.6),le.common.glassPane);_.position.set(0,1.9,M*(x/2+.03)),M<0&&(_.rotation.y=Math.PI),l.add(_)}let y=new I(new se(Math.min(m*.5,6),.22,2.4),le.common.dark);y.position.set(0,3.3,x/2+1),y.castShadow=!0,l.add(y)}if(a){let h=new I(new se(i*.62,1.6,e*.62),o.trim);h.position.y=c+.8,h.castShadow=!0,l.add(h);let m=new I(new qe(.06,.06,2.6,6),le.common.metal);m.position.y=c+2.9,l.add(m)}return l.userData.footprint={w:i,d:e,h:c},l}function hf({width:i=5,sign:e="小卖部",tier:t=2,height:n=3.4,open:s=!0,signColor:r=null}){let a=is(t),o=new Ce,l=new I(new se(i,n,.3),a.wall);if(l.position.set(0,n/2,-.15),l.castShadow=!0,l.receiveShadow=!0,o.add(l),Cs(o,i,.3,n,0,a.trim,4),s){let h=new I(new rt(i*.74,n*.7),le.common.glassPane);h.position.set(0,n*.36,.02),o.add(h);let m=new I(new se(i*.78,.12,.08),le.common.metalLight);m.position.set(i*.39,n*.36,.04),o.add(m),gh(o,i*.74,n*.7,0,n*.36,.03,0,a.trim)}else{let h=new I(new se(i*.78,n*.72,.1),kn(mi({base:"#6b6f6a",ribMM:75}),{roughness:.86}));h.position.set(0,n*.37,.02),o.add(h),gh(o,i*.78,n*.72,0,n*.37,.03,0,a.trim)}let c=new I(new se(i,.1,1.15),a.awning);c.position.set(0,n*.8,.6),c.rotation.x=-.12,c.castShadow=!0,o.add(c);let u=yg(e),d=new I(new se(i*.96,.8,.18),r?new he({color:r,roughness:.85}):WS(u));d.position.set(0,n*.98,.06),o.add(d);let f=new I(new rt(i*.92,.72),VS(e));return f.position.set(0,n*.98,.16),o.add(f),o.userData.footprint={w:i,d:.6,h:n},o}function uf({w:i,d:e,h:t=6.5,tier:n=2,sawtooth:s=!0,doors:r=2,panel:a=null}){let o=new Ce,l=a||(n<=1?le.common.panelRust:le.common.panel),c=ns(l,i,t),u=new I(new se(i,t,e),c);if(u.position.y=t/2,u.castShadow=!0,u.receiveShadow=!0,o.add(u),Cs(o,i,e,t,0,le.common.metalLight,4),s){let d=Math.max(2,Math.round(e/4));for(let f=0;f<d;f++){let h=-e/2+(f+.5)*(e/d),m=new I(new se(i*.98,.1,e/d*.86),le.common.panel);m.position.set(0,t+.55,h),m.rotation.x=-.5,m.castShadow=!0,o.add(m);let x=new I(new rt(i*.9,e/d*.66),le.common.glassPane);x.position.set(0,t+.42,h+.5),x.rotation.x=Math.PI/2-.9,o.add(x)}}else{let d=new I(new se(i+.3,.18,e+.3),le.common.panel);d.position.y=t+.1,d.castShadow=!0,o.add(d)}for(let d=0;d<r;d++){let f=Math.min(4.2,i/(r+.6)),h=r===1?0:-i/2+(d+.5)*(i/r),m=new I(new se(f,t*.62,.16),kn(mi({base:"#7a7f78",ribMM:90}),{roughness:.84}));m.position.set(h,t*.31,e/2+.09),o.add(m),gh(o,f,t*.62,h,t*.31,e/2+.11,0,le.common.metalLight)}if(nr(.7)){let d=new I(new qe(.34,.34,t*.8,10),le.common.metal);d.position.set(-i/2-.4,t*.45,ut(-e/3,e/3)),d.castShadow=!0,o.add(d)}for(let d=0,f=ss(1,3);d<f;d++){let h=new I(new se(.5,.7,.3),le.common.metalLight);h.position.set(ut(-i/2+1,i/2-1),ut(2,3.4),e/2+.2),o.add(h)}return o.userData.footprint={w:i,d:e,h:t},o}function Bo({w:i,d:e,h:t=11,tier:n=2,steps:s=!0,columns:r=!0,roofStyle:a="flat"}){let o=is(n),l=new Ce,c=n>=3?le.common.stone:kn(As({base:n<=1?"#8f8c84":"#a5a29a",wet:.1,crack:8}),{roughness:.9}),u=ns(c,i,t),d=new I(new se(i,t,e),u);d.position.y=t/2,d.castShadow=!0,d.receiveShadow=!0,l.add(d),Cs(l,i,e,t,0,le.common.stone,4);let f=Math.max(3,Math.round(i/2.4));for(let h=0;h<Math.max(1,Math.floor(t/3.2));h++){let m=1.9+h*3.2;if(m>t-1.2)break;for(let x=0;x<f;x++){let p=-i/2+(x+.5)*(i/f),g=new I(new rt(i/f*.6,1.7),le.common.glassPane);g.position.set(p,m,e/2+.04),l.add(g)}}if(s){let h=Math.min(i*.62,12);for(let m=0;m<4;m++){let x=new I(new se(h,.22,.9),le.common.stone);x.position.set(0,.11+m*.22,e/2+2.4-m*.9),x.receiveShadow=!0,l.add(x)}}if(r){let h=Math.max(3,Math.round(i/3.4));for(let x=0;x<h;x++){let p=-i/2+(x+.5)*(i/h),g=new I(new qe(.34,.38,t*.34,14),le.common.stone);g.position.set(p,t*.17,e/2+1.7),g.castShadow=!0,l.add(g)}let m=new I(new se(i,.7,2.6),le.common.stone);m.position.set(0,t*.36,e/2+1.7),m.castShadow=!0,l.add(m)}if(a==="hip"){let h=new I(new $i(i*.78,2.6,4),le.common.dark);h.rotation.y=Math.PI/4,h.position.y=t+1.3,h.castShadow=!0,l.add(h)}else{let h=new I(new se(i+.4,.5,e+.4),o.trim);h.position.y=t+.25,h.castShadow=!0,l.add(h)}return l.userData.footprint={w:i,d:e,h:t},l}function df({w:i,d:e,floors:t=4,floorH:n=3.6,tier:s=2,corridor:r=!0}){let a=is(s),o=new Ce,l=t*n,c=ti(a.walls),u=ns(c,i,l),d=new I(new se(i,l,e),u);d.position.y=l/2,d.castShadow=!0,d.receiveShadow=!0,o.add(d),Cs(o,i,e,l,0,a.trim,4);let f=Math.max(4,Math.round(i/3));for(let h=1;h<=t;h++){let m=(h-.5)*n;for(let p=0;p<f;p++){let g=-i/2+(p+.5)*(i/f),y=new I(new rt(i/f*.72,n*.52),le.common.glassPane);if(y.position.set(g,m,e/2+.04),o.add(y),r){let M=y.clone();M.position.z=-(e/2+.04),M.rotation.y=Math.PI,o.add(M)}}if(r){let p=new I(new se(i,.14,1.5),a.trim);p.position.set(0,(h-1)*n+n*.06,e/2+.8),p.receiveShadow=!0,o.add(p);let g=new I(new se(i,1,.07),le.common.metalLight);g.position.set(0,(h-1)*n+n*.06+.55,e/2+1.52),o.add(g)}let x=new I(new se(i+.1,.16,e+.1),a.trim);x.position.y=h*n,o.add(x)}return o.userData.footprint={w:i,d:e,h:l},o}function Hh({w:i=2.4,d:e=1.2,tier:t=2,colors:n=null,goods:s=!0,box:r=!1}){let a=new Ce,o=i,l=e,c=new I(new se(o,.1,l),le.common.wood);c.position.y=.9,c.castShadow=!0,c.receiveShadow=!0,a.add(c);for(let f of[-1,1]){let h=new I(new se(.08,.9,l*.9),le.common.metal);h.position.set(f*(o/2-.14),.45,0),a.add(h)}let u=n||[7031364,4477530,5921348,4867152],d=new I(new se(o*1.12,.08,l*1.5),new he({color:ti(u),roughness:.95,side:Wt}));d.position.set(0,2.2,0),d.rotation.x=-.05,d.castShadow=!0,a.add(d);for(let f of[-1,1])for(let h of[-1,1]){let m=new I(new qe(.035,.035,2.2,6),le.common.metal);m.position.set(f*(o/2-.06),1.1,h*(l*.66)),a.add(m)}if(s){let f=ss(3,6);for(let h=0;h<f;h++){let m=ut(.18,.34),x=ut(.12,.3),p=new I(Dn()<.5?new se(m,x,m*.8):new qe(m*.4,m*.42,x,8),new he({color:ti([6978122,9071162,8018506,5925482,9079386,10521178]),roughness:.9}));p.position.set(ut(-o/2+.3,o/2-.3),.97+x/2,ut(-l/2+.25,l/2-.25)),p.castShadow=!0,a.add(p)}}if(r)for(let f=0,h=ss(1,3);f<h;f++){let m=new I(new se(ut(.5,.8),ut(.3,.5),ut(.4,.6)),new he({color:ti([14210248,9071178]),roughness:.92}));m.position.set(ut(-o/2+.4,o/2-.4),.22,ut(-l/2,l/2)-.3),m.castShadow=!0,a.add(m)}return a.userData.footprint={w:o,d:l,h:2.2},a}function zh({w:i=6,d:e=2.4,h:t=2.6,color:n=4151914}){let s=new Ce,r=kn(mi({base:"#3f5a6a",ribMM:120}),{roughness:.82,metalness:0});r.color=new Pe(n);let a=new I(new se(i,t,e),r);a.position.y=t/2,a.castShadow=!0,a.receiveShadow=!0,s.add(a);for(let o of[-1,1]){let l=new I(new se(.08,t*.94,e*.94),le.common.dark);l.position.set(o*(i/2+.04),t/2,0),s.add(l)}return s.userData.footprint={w:i,d:e,h:t},s}function ff({r:i=2.2,h:e=3.4,tier:t=2}={}){let n=new Ce,s=new I(new qe(i,i,.3,6),le.common.stone);s.position.y=.15,s.receiveShadow=!0,n.add(s);for(let o=0;o<6;o++){let l=o/6*Math.PI*2,c=new I(new qe(.11,.13,e,8),t>=3?le.common.stone:new he({color:8011574,roughness:.88}));c.position.set(Math.cos(l)*i*.82,e/2+.3,Math.sin(l)*i*.82),c.castShadow=!0,n.add(c)}let r=new I(new $i(i*1.35,1.5,6),le.common.dark);r.position.y=e+1,r.castShadow=!0,n.add(r);let a=new I(new mn(.16,10,8),le.common.accent||le.common.metal);return a.position.y=e+1.85,n.add(a),n.userData.footprint={w:i*1.4,d:i*1.4,h:e+1.5},n}function pf({w:i=7,h:e=5.2,text:t="城中村"}){let n=new Ce,s=new he({color:6963256,roughness:.88});for(let c of[-1,1]){let u=new I(new se(.6,e,.6),s);u.position.set(c*(i/2-.3),e/2,0),u.castShadow=!0,n.add(u)}let r=new I(new se(i,.95,.7),s);r.position.y=e-.5,r.castShadow=!0,n.add(r);let a=new I(new se(i+1.2,.28,1.4),le.common.dark);a.position.y=e+.05,a.castShadow=!0,n.add(a);let o=new I(new rt(i*.62,.72),Bh(t,{bg:"#5a3630",fg:"#e8dcc0",font:'700 74px "Microsoft YaHei",sans-serif'}));o.position.set(0,e-.5,.37),n.add(o);let l=o.clone();return l.position.z=-.37,l.rotation.y=Math.PI,n.add(l),n}function sr({len:i,h:e=2.4,tier:t=2,kind:n="brick"}){let s=new Ce,r;if(n==="hoarding"?r=kn(mi({base:"#4d6a78",ribMM:200}),{roughness:.85,metalness:0}):n==="railing"?r=null:r=kn(As({base:t<=1?"#84827a":"#9a9890",wet:.15,crack:10}),{roughness:.94}),n==="railing"){let a=Math.max(2,Math.round(i/2.2));for(let o=0;o<=a;o++){let l=new I(new se(.1,e,.1),le.common.metal);l.position.set(-i/2+o*i/a,e/2,0),s.add(l)}for(let o=0;o<3;o++){let l=new I(new se(i,.06,.06),le.common.metal);l.position.set(0,.35+o*(e-.5)/2,0),s.add(l)}}else{let a=new I(new se(i,e,.26),r);a.position.y=e/2,a.castShadow=!0,a.receiveShadow=!0,s.add(a);let o=new I(new se(i+.1,.12,.36),le.common.trim||le.common.metalLight);o.position.y=e+.06,s.add(o)}return s.userData.footprint={w:i,d:.3,h:e},s}function ra({w:i=3.6,h:e=2.2,y:t=2.6,text:n="招工",bg:s="#3a4a58",fg:r="#e8e4d8",legs:a=!0}){let o=new Ce,l=new I(new se(i,e,.12),le.common.dark);l.position.y=t,l.castShadow=!0,o.add(l);let c=new I(new rt(i*.94,e*.88),Bh(n,{bg:s,fg:r,w:512,h:Math.round(512*e/i)}));if(c.position.set(0,t,.07),o.add(c),a)for(let u of[-1,1]){let d=new I(new qe(.06,.06,t-e/2,8),le.common.metal);d.position.set(u*i*.34,(t-e/2)/2,0),o.add(d)}return o}function _g({h:i=9,arms:e=3}={}){let t=new Ce,n=new I(new qe(.15,.19,i,10),kn(As({base:"#8b8a80",wet:0,crack:8}),{roughness:.95}));n.position.y=i/2,n.castShadow=!0,t.add(n);for(let s=0;s<e;s++){let r=new I(new se(1.9,.09,.09),le.common.metal);r.position.y=i-1.6+s*.75,r.castShadow=!0,t.add(r)}return t}function vg(i,e,t=.9){let n=new P().addVectors(i,e).multiplyScalar(.5);n.y-=t;let s=new zr([i,n,e]),r=new $a(s,20,.022,5,!1);return new I(r,new he({color:3817285,roughness:.85}))}function mf({h:i=7,tier:e=2}={}){let t=new Ce,n=new I(new qe(.09,.13,i,10),le.common.metal);n.position.y=i/2,n.castShadow=!0,t.add(n);let s=new I(new se(1.5,.09,.09),le.common.metal);s.position.set(.7,i-.1,0),s.rotation.z=.16,t.add(s);let r=new I(new se(.72,.14,.34),le.common.metalLight);r.position.set(1.4,i-.24,0),t.add(r);let a=new I(new rt(.6,.28),new cn({color:e>=3?16773320:15259816,transparent:!0,opacity:.5}));return a.rotation.x=Math.PI/2,a.position.set(1.4,i-.33,0),a.userData.noMerge=!0,t.add(a),t.userData.lampHead={x:1.4,y:i-.35,z:0},t.userData.lampBulb=a,t}function gf({h:i=5.2,kind:e="broad",tier:t=2}={}){let n=new Ce,s=new he({color:4865844,roughness:.95}),r=t>=3?[4612154,4085302,5269572]:[3951156,4476986,3556398],a=i*(e==="palm"?.82:.46),o=new I(new qe(i*.035,i*.055,a,7),s);if(o.position.y=a/2,o.castShadow=!0,n.add(o),e==="palm")for(let l=0;l<7;l++){let c=l/7*Math.PI*2,u=new I(new rt(i*.55,i*.14),new he({color:ti(r),roughness:.9,side:Wt}));u.position.set(Math.cos(c)*i*.24,a+.2,Math.sin(c)*i*.24),u.rotation.set(-.5,-c,.2),n.add(u)}else{let l=ss(3,4);for(let c=0;c<l;c++){let u=i*ut(.24,.34),d=new I(new Gr(u,1),new he({color:ti(r),roughness:.97,flatShading:!0}));d.position.set(ut(-i*.16,i*.16),a+u*ut(.5,1.1),ut(-i*.16,i*.16)),d.castShadow=!0,n.add(d)}}return n.userData.footprint={w:.5,d:.5,h:i},n}function Mg({w:i=1.6,d:e=1.6,h:t=.5}){let n=new Ce,s=new I(new se(i,t,e),le.common.stone);s.position.y=t/2,s.castShadow=!0,s.receiveShadow=!0,n.add(s);let r=new I(new se(i*.86,.1,e*.86),new he({color:3813672,roughness:1}));r.position.y=t+.02,n.add(r);for(let a=0,o=ss(3,6);a<o;a++){let l=new I(new Gr(ut(.14,.26),0),new he({color:ti([4215342,4873268,5917242,6969924]),roughness:.98,flatShading:!0}));l.position.set(ut(-i/3,i/3),t+.16,ut(-e/3,e/3)),l.castShadow=!0,n.add(l)}return n}function bg({len:i=2.2,h:e=1,kind:t="fence"}){let n=new Ce;if(t==="cone"){let s=new I(new $i(.26,.62,10),new he({color:10111540,roughness:.85}));s.position.y=.31,s.castShadow=!0,n.add(s);let r=new I(new se(.46,.05,.46),le.common.dark);r.position.y=.025,n.add(r)}else if(t==="stone"){let s=new I(new mn(.3,12,8),le.common.stone);s.scale.y=.85,s.position.y=.24,s.castShadow=!0,n.add(s)}else{let s=new I(new se(i,.08,.08),le.common.metalLight);s.position.y=e,s.castShadow=!0,n.add(s);let r=s.clone();r.position.y=e*.55,n.add(r);for(let a=0;a<=2;a++){let o=new I(new qe(.05,.05,e,8),le.common.metalLight);o.position.set(-i/2+a*i/2,e/2,0),n.add(o)}}return n}function Sg({w:i=8,h:e=9,d:t=1.2}){let n=new Ce,s=le.common.metalLight,r=Math.max(2,Math.round(i/1.8));for(let l=0;l<=r;l++){let c=-i/2+l*i/r;for(let u of[-1,1]){let d=new I(new qe(.055,.055,e,8),s);d.position.set(c,e/2,u*t/2),n.add(d)}}let a=Math.max(2,Math.round(e/2.2));for(let l=1;l<=a;l++){let c=l*e/(a+1);for(let d of[-1,1]){let f=new I(new se(i,.07,.07),s);f.position.set(0,c,d*t/2),n.add(f)}let u=new I(new se(i,.08,t*.92),le.common.wood);u.position.set(0,c,0),u.receiveShadow=!0,n.add(u)}let o=new I(new rt(i,e*.95),new he({color:3099194,roughness:.98,transparent:!0,opacity:.82,side:Wt}));return o.position.set(0,e/2,t/2+.03),n.add(o),n.userData.footprint={w:i,d:t,h:e},n}function Eg({h:i=26,jib:e=20}){let t=new Ce,n=new he({color:9071162,roughness:.72,metalness:.35}),s=new I(new se(3.2,.6,3.2),le.common.dark);s.position.y=.3,s.castShadow=!0,t.add(s);let r=new I(new se(1.1,i,1.1),n);r.position.y=i/2+.6,r.castShadow=!0,t.add(r);let a=new I(new se(e,.42,.5),n);a.position.set(e/2-2,i+.9,0),a.castShadow=!0,t.add(a);let o=new I(new se(e*.3,.7,.9),le.common.dark);o.position.set(-e*.18-2,i+.9,0),t.add(o);let l=new I(new se(1.2,1.2,1.4),le.common.metalLight);l.position.set(1.4,i+.2,.5),t.add(l);let c=new I(new qe(.05,.05,5,6),le.common.metal);return c.position.set(e*.4,i-1.6,0),t.add(c),t.userData.footprint={w:3.4,d:3.4,h:i},t}function aa({color:i=3817800,kind:e="sedan"}={}){let t=new Ce,n=new he({color:i,roughness:.42,metalness:.42});if(e==="truck"){let s=new I(new se(2.2,2,2.4),n);s.position.set(0,1.5,2.6),s.castShadow=!0,t.add(s);let r=new I(new se(2.5,2.6,5.4),kn(mi({base:"#7a7f78",ribMM:110}),{roughness:.82}));r.position.set(0,1.9,-1.6),r.castShadow=!0,t.add(r);let a=new qe(.62,.62,.4,12);for(let o of[-1.2,1.2])for(let l of[3,-1,-3.4]){let c=new I(a,le.common.rubber);c.rotation.z=Math.PI/2,c.position.set(o,.62,l),t.add(c)}t.userData.footprint={w:2.6,d:8.8,h:3.2}}else{let s=new I(new se(1.86,.7,4.4),n);s.position.y=.72,s.castShadow=!0,t.add(s);let r=new I(new se(1.7,.62,2.2),le.common.glassPane);r.position.set(0,1.32,-.15),r.castShadow=!0,t.add(r);let a=new qe(.34,.34,.26,12);for(let o of[-.86,.86])for(let l of[1.45,-1.45]){let c=new I(a,le.common.rubber);c.rotation.z=Math.PI/2,c.position.set(o,.34,l),t.add(c)}t.userData.footprint={w:2,d:4.6,h:1.7}}return t}function rr({kind:i="scooter",color:e=3095108}={}){let t=new Ce,n=new qe(i==="bike"?.34:.27,i==="bike"?.34:.27,i==="bike"?.05:.1,14);if(i==="tricycle"){let s=new I(new se(1.3,.5,2),kn(mi({base:"#6a5a4a"}),{roughness:.88}));s.position.set(0,.62,-.9),s.castShadow=!0,t.add(s);let r=new I(new se(.6,.7,.9),new he({color:e,roughness:.6,metalness:.3}));r.position.set(0,.75,1),t.add(r);let a=new qe(.28,.28,.1,12);for(let c of[-.7,.7]){let u=new I(a,le.common.rubber);u.rotation.z=Math.PI/2,u.position.set(c,.28,-1.3),t.add(u)}let o=new I(a,le.common.rubber);o.rotation.z=Math.PI/2,o.position.set(0,.28,1.35),t.add(o);let l=new I(new se(.7,.06,.06),le.common.metal);l.position.set(0,1.2,1.1),t.add(l),t.userData.footprint={w:1.5,d:3,h:1.3}}else if(i==="bike"){let s=new I(new se(.08,.5,1.1),new he({color:e,roughness:.6,metalness:.4}));s.position.set(0,.66,0),s.rotation.x=.1,t.add(s);let r=new I(new se(.6,.05,.05),le.common.metal);r.position.set(0,1.02,.52),t.add(r);let a=new I(new se(.2,.09,.36),le.common.dark);a.position.set(0,.94,-.34),t.add(a);for(let o of[.56,-.56]){let l=new I(n,le.common.rubber);l.rotation.z=Math.PI/2,l.position.set(0,.34,o),t.add(l)}t.userData.footprint={w:.6,d:1.6,h:1.1}}else{let s=new I(new se(.5,.36,1.5),new he({color:e,roughness:.55,metalness:.35}));s.position.y=.62,s.castShadow=!0,t.add(s);let r=new I(new se(.44,.16,.7),le.common.dark);r.position.set(0,.86,-.16),t.add(r);for(let o of[.62,-.62]){let l=new I(n,le.common.rubber);l.rotation.z=Math.PI/2,l.position.set(0,.27,o),t.add(l)}let a=new I(new se(.62,.06,.06),le.common.metal);a.position.set(0,1.06,.58),t.add(a),t.userData.footprint={w:.7,d:1.7,h:1.2}}return t}function ko({color:i=9075258,large:e=!1}={}){let t=new Ce;if(e){let n=new I(new se(1.6,1.1,1),new he({color:ti([3824202,4872810,5920072]),roughness:.82,metalness:.2}));n.position.y=.55,n.castShadow=!0,t.add(n);let s=new I(new se(1.66,.1,1.06),le.common.dark);s.position.y=1.14,s.rotation.x=-.12,t.add(s);let r=new qe(.16,.16,.1,10);for(let a of[-.66,.66])for(let o of[-.4,.4]){let l=new I(r,le.common.rubber);l.rotation.z=Math.PI/2,l.position.set(a,.16,o),t.add(l)}t.userData.footprint={w:1.7,d:1.1,h:1.2}}else{let n=new I(new qe(.36,.3,.92,12),new he({color:i,roughness:.75}));n.position.y=.46,n.castShadow=!0,t.add(n);let s=new I(new qe(.39,.39,.08,12),le.common.dark);s.position.y=.94,t.add(s),t.userData.footprint={w:.8,d:.8,h:1}}return t}function xf(){let i=new Ce,e=new I(new se(1.7,.09,.48),le.common.wood);e.position.y=.46,e.castShadow=!0,i.add(e);let t=new I(new se(1.7,.4,.08),le.common.wood);t.position.set(0,.72,-.2),i.add(t);for(let n of[-.7,.7]){let s=new I(new se(.08,.46,.44),le.common.metal);s.position.set(n,.23,0),i.add(s)}return i}function wg(){let i=new Ce,e=new I(new se(4.6,.14,1.6),le.common.metalLight);e.position.y=2.6,e.castShadow=!0,i.add(e);for(let r of[-2.1,2.1]){let a=new I(new qe(.07,.07,2.6,8),le.common.metal);a.position.set(r,1.3,-.6),i.add(a)}let t=new I(new rt(4.4,1.7),le.common.glassPane);t.position.set(0,1.7,-.72),i.add(t);let n=new I(new se(3.2,.09,.4),le.common.dark);n.position.set(0,.55,-.5),i.add(n);let s=new I(new rt(.7,1),Bh(`公交
站`,{bg:"#2f3f52",fg:"#d8dce0",w:256,h:380}));return s.position.set(2.5,2,0),i.add(s),i}function yf({r:i=2.4}={}){let e=new Ce,t=new I(new qe(i,i*1.05,.6,24),le.common.stone);t.position.y=.3,t.receiveShadow=!0,e.add(t);let n=new I(new qe(i*.92,i*.92,.1,24),new he({color:2767426,roughness:.14,metalness:.5}));n.position.y=.58,e.add(n);let s=new I(new qe(.14,.3,1.2,12),new he({color:5925490,roughness:.3,metalness:.4,transparent:!0,opacity:.6}));return s.position.y=1.2,e.add(s),e.userData.footprint={w:i*2.2,d:i*2.2,h:.7},e}function Tg({h:i=9,color:e=9054754}={}){let t=new Ce,n=new I(new qe(.06,.08,i,8),le.common.metalLight);n.position.y=i/2,t.add(n);let s=new I(new rt(1.8,1.2),new he({color:e,roughness:.9,side:Wt}));return s.position.set(.9,i-.85,0),t.add(s),t}function _f({len:i=6,rows:e=3,gap:t=1.1}={}){let n=new Ce;for(let s=0;s<e;s++){let r=new I(new se(i,.06,.06),le.common.metalLight);r.position.set(0,.9,-s*t),n.add(r);let a=r.clone();a.position.y=.55,n.add(a);for(let o=0;o<=4;o++){let l=new I(new qe(.045,.045,.95,6),le.common.metalLight);l.position.set(-i/2+o*i/4,.48,-s*t),n.add(l)}}return n}function Rg({icon:i="❓",label:e="",color:t=14201946,y:n=0}){let s=new Ce,r=document.createElement("canvas");r.width=256,r.height=256;let a=r.getContext("2d");a.strokeStyle="rgba(232,214,150,0.95)",a.lineWidth=10,a.beginPath(),a.arc(128,128,104,0,Math.PI*2),a.stroke();let o=a.createRadialGradient(128,128,20,128,128,100);o.addColorStop(0,"rgba(232,214,150,0.42)"),o.addColorStop(1,"rgba(232,214,150,0)"),a.fillStyle=o,a.beginPath(),a.arc(128,128,100,0,Math.PI*2),a.fill();let l=new I(new rt(2.4,2.4),new cn({map:new pn(r),transparent:!0,depthWrite:!1}));l.rotation.x=-Math.PI/2,l.position.y=.06+n,s.add(l);let c=document.createElement("canvas");c.width=256,c.height=128;let u=c.getContext("2d");u.fillStyle="rgba(24,28,30,0.82)",u.beginPath(),u.roundRect(6,6,244,116,16),u.fill(),u.fillStyle="#f0e8d0",u.font='700 76px "Microsoft YaHei","PingFang SC",sans-serif',u.textAlign="center",u.textBaseline="middle",u.fillText(i||"?",128,66);let d=new I(new rt(1.5,.75),new cn({map:new pn(c),transparent:!0,depthWrite:!1}));return d.position.y=2.15,s.add(d),s.userData.hotspot={icon:i,label:e,color:t,sprite:d,ring:l},s}function Gh({len:i=140,w:e=12,x:t=0,z:n=0,mat:s=null}){let r=s||le.common.asphalt,a=r.map&&r.map.userData&&r.map.userData.surface?r.map.userData.surface.metersPerRepeat:Yn,o=ns(r,e,i,a),l=new I(new rt(e,i),o);return l.rotation.x=-Math.PI/2,l.position.set(t,.012,n),l.receiveShadow=!0,l}function Ag({len:i=140,w:e=3.4,x:t=0,z:n=0}){let s=le.common.paver.map&&le.common.paver.map.userData&&le.common.paver.map.userData.surface?le.common.paver.map.userData.surface.metersPerRepeat:Yn,r=ns(le.common.paver,e,i,s),a=new I(new rt(e,i),r);return a.rotation.x=-Math.PI/2,a.position.set(t,.02,n),a.receiveShadow=!0,a}function vf({len:i=140,x:e=0,z:t=0,h:n=.16}){let s=new I(new se(.22,n,i),le.common.trim||le.common.metalLight);return s.position.set(e,n/2,t),s.receiveShadow=!0,s}function Cg({len:i=12,x:e=0,z:t=0,stripes:n=7}){let s=new Ce;for(let r=0;r<n;r++){let a=new I(new rt(i,.52),new he({color:12105388,roughness:.94}));a.rotation.x=-Math.PI/2,a.position.set(e,.028,t-(n-1)*1/2+r*1),a.receiveShadow=!0,s.add(a)}return s}function Vh(i,e){return Math.min(i*.25,Math.max(1,e-3.6))}function Pg(i,e){let t=Vh(i,e);return Math.min(t*1.5,Math.max(t+.3,e-2.6))}function Ig(i,e,t){if(i==="lane"||t<=e/2+.1){let r=Math.max(1.1,t-2.2);return{inner:Math.max(.5,r-.35),outer:r}}let n=Math.max(1.4,t-.6),s=Math.max(e/2+.6,n-4.2);return s<n?{inner:s,outer:n}:{inner:Math.max(.5,n-.35),outer:n}}function Mf(i,e,t){return i!=="lane"&&i!=="avenue"||!Number.isFinite(t)||!Number.isFinite(e)?0:Vh(e,t)+.9}function Lg(i,e,t){let n=Mf(i,e,t);return n>0?n+.15:0}function Dg(i,e){let t=i+.25,n=Math.max(t+.5,e-.35);return{inner:t,outer:n}}var j=(i,e)=>i+Dn()*(e-i),dn=(i,e)=>Math.floor(j(i,e+1)),wt=i=>i[Math.floor(Dn()*i.length)],Ge=i=>Dn()<i,Tf=class{constructor(e,t,n){this.scene=e,this.spec=t,this.tier=n,this.T=is(n),this.group=new Ce,this.group.name=t.id,this.colliders=[],this.blockers=[],this.lots=[],this.hotspots=[],this.anchors=[],this.corridorClamped=0,this.corridorPushed=0,this.corridorStuck=0,this.wires=[],e.add(this.group)}addWire(e,t,n){return this.wires.push({ax:e.x,ay:e.y,az:e.z,bx:t.x,by:t.y,bz:t.z}),this.addRaw(vg(e,t,n))}place(e,t,n,s=0,{collide:r="auto",block:a=!1,noMerge:o=!1,tag:l=""}={}){e.position.set(t,e.position.y,n),e.rotation.y=s,o&&(e.userData.noMerge=!0),this.group.add(e);let c=e.userData.footprint;if(c&&r!=="none"){let u=Math.abs(e.scale.x)||1,d=Math.abs(e.scale.z)||1,f=c.w*u,h=c.d*d,m=Math.cos(-s),x=Math.sin(-s),p=(Math.abs(m)*f+Math.abs(x)*h)/2,g=(Math.abs(x)*f+Math.abs(m)*h)/2,y=this.corridorHalf();if(y>0&&!a){let _=Math.sign(t)||1,b=Math.min(y+p,this.laneHalf-.05-p);Math.abs(t)<b&&(t=_*b,this.corridorPushed++,Math.abs(t)-p<y-1e-6&&this.corridorStuck++)}t!==e.position.x&&(e.position.x=t);let M={minX:t-p,maxX:t+p,minZ:n-g,maxZ:n+g,tag:l||e.name||"prop"};this.colliders.push(M),a&&this.blockers.push(M)}return e}lot(e,t,n=0,s="walk"){this.lots.push({x:e,z:t,rot:n,kind:s})}anchor(e,t,n=0,s="stall"){this.anchors.push({x:e,z:t,rot:n,kind:s})}resolveAnchors(e=.45,t=2.4){let n=(l,c)=>{for(let u of this.colliders)if(l>u.minX-e&&l<u.maxX+e&&c>u.minZ-e&&c<u.maxZ+e)return!0;return!1},r=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]],a=0,o=0;for(let l of this.anchors){if(!n(l.x,l.z))continue;let c=Math.sign(l.x)||1,u=l.x,d=!1;for(let f=.1;f<=t+1e-6&&!d;f+=.1)for(let[h,m]of r){let x=l.x+h*f,p=l.z+m*f;if(!(x*u<=0)&&!n(x,p)){l.x=x,l.z=p,d=!0,a++;break}}d||o++}return this.anchorPushed=a,this.anchorStuck=o,{moved:a,stuck:o}}corridorHalf(){return Lg(this.spec.layout,this.roadW,this.laneHalf)}clearanceHalf(){return Mf(this.spec.layout,this.roadW,this.laneHalf)}spot(e,t,n,s,r=3.6){let a=Math.min(e,t),o=Math.max(e,t),l=this.corridorHalf();if(l>0){let c=u=>u>-l&&u<l;if(a<-l&&o>l?(Dn()<.5?o=-l:a=l,this.corridorClamped++):(c(a)&&(a=l,this.corridorClamped++),c(o)&&(o=-l,this.corridorClamped++)),o-a<.4){let u=Dn()<.5?-1:1;a=u*(l+.3),o=u*(l+1),this.corridorClamped++}}for(let c=0;c<30;c++){let u=j(a,o),d=j(n,s);if(Math.hypot(u,d-(this.spawnZ||0))>=r)return[u,d]}return[qS(a,o),n<0?s-2:n+2]}spotEdge(e,t,n=3.6){let s=Dg(this.corridorHalf(),this.laneHalf),r=Dn()<.5?-1:1,[a,o]=this.spot(r*s.inner,r*s.outer,e,t,n);return[a,o]}addRaw(e,t=!1){return t&&(e.userData.noMerge=!0),this.group.add(e),e}};function qS(i,e){return i+(e-i)*.5}function Ho(i,e,t,n=null){let s=i.clone();if(i.map){s.map=i.map.clone(),s.map.needsUpdate=!0;let r=i.map.userData&&i.map.userData.surface?i.map.userData.surface.metersPerRepeat:null,a=n||r||4.5;s.map.repeat.set(Math.max(1,e/a),Math.max(1,t/a))}return X0(s),s}function YS(i,e){let{group:t,T:n,spec:s}=i,r=190,a=new I(new rt(r,r),Ho(n.ground,r,r));a.rotation.x=-Math.PI/2,a.receiveShadow=!0,t.add(a);let o=i.streetLen=s.streetLen||96;if(i.courtW=s.courtW||46,i.plazaW=s.plazaW||44,i.spawnZ=12,e==="avenue"){i.roadW=i.spec.roadW||15;let l=Gh({len:r,w:i.roadW});t.add(l);for(let c of[-1,1])t.add(Ag({len:r,w:3.6,x:c*(i.roadW/2+1.8)})),t.add(vf({len:r,x:c*(i.roadW/2+.05),h:.16}));for(let c=-o/2+6;c<o/2;c+=22)t.add(Cg({len:Math.min(i.roadW,12),z:c}));i.laneHalf=i.roadW/2+3.8}else if(e==="lane"){i.roadW=i.spec.roadW||9.5;let l=Gh({len:r,w:i.roadW,mat:Di().common.laneSurf});t.add(l);for(let c of[-1,1])t.add(vf({len:r,x:c*(i.roadW/2+.1),h:.12}));i.laneHalf=i.roadW/2}else if(e==="compound"){let l=new I(new rt(i.courtW,o),Ho(n.ground,i.courtW,o));l.rotation.x=-Math.PI/2,l.position.y=.014,l.receiveShadow=!0,t.add(l),i.laneHalf=i.courtW/2}else if(e==="yard"){let l=Gh({len:r,w:58});l.position.y=.014,t.add(l);for(let c=0;c<6;c++){let u=j(8,16),d=j(8,16),f=new I(new rt(u,d),Ho(n.ground,u,d));f.rotation.x=-Math.PI/2,f.position.set(j(-22,22),.016,j(-o/2,o/2)),f.receiveShadow=!0,t.add(f)}i.laneHalf=26}else{let l=new I(new rt(i.plazaW,o),Ho(n.ground,i.plazaW,o));l.rotation.x=-Math.PI/2,l.position.y=.014,l.receiveShadow=!0,t.add(l);for(let c=0;c<5;c++){let u=j(9,18),d=j(12,22),f=new I(new rt(u,d),Ho(Di().common.grass,u,d));f.rotation.x=-Math.PI/2,f.position.set(j(-22,22),.018,j(-o/2+8,o/2-8)),f.receiveShadow=!0,t.add(f)}i.laneHalf=i.plazaW/2}}var KS={qilou:i=>Nh(i),old_apartment:i=>Uh(i),lingnan_temple:i=>Uo(i)},$S={slum:{buildings:["qilou","old_apartment"],every:2},night_market:{buildings:["qilou"],every:2},internet_cafe:{buildings:["qilou"],every:3},flea_market:{buildings:["qilou"],every:3},flower_bird_market:{buildings:["qilou"],every:3},suburb:{buildings:["old_apartment"],every:3}},ZS={night_market:"dapaidang",slum:"dapaidang",flea_market:"dapaidang",vegetable_market:"market_stall",wholesaleMarket:"market_stall"},Og={dapaidang:()=>Fh(),market_stall:()=>Oh()},Ng=1.35,oa=1.05,jS=.9,Rf=[[7031364,4477530,5921348,4867152],[9062970,13148234,4876890,8010292],[3824234,6974042,4867152,5917242],[10115642,5929546,9079386,6965850]];function JS(i,e,t){let n=Math.max(1.3,(t||4.75)-2.6-.9);if(Ge(.34)){let o=Math.min(2.8,n),l=Math.min(1.35,n*.75);return Hh({w:o,d:l,tier:e,colors:wt(Rf),box:Ge(.45)})}let s=Og[i](),r=s.userData.footprint||{w:2.8,d:2.4},a=Math.min(1,n/r.d,1.15);return s.scale.setScalar(Math.min(a,1.08)*j(.97,1.04)),s}function bf(i){let e=i.userData.footprint;return e?e.d*Math.abs(i.scale.x):1.4}function QS(i){let{spec:e,tier:t}=i,n=i.streetLen,s=i.laneHalf,r=[],a=$S[e.id]||null,o=a&&a.buildings&&a.buildings.length?a.buildings[0]:null,l=o?KS[o]:null;for(let c of[-1,1]){let u=-n/2,d=0;for(;u<n/2;){if(l&&a.every>0&&d>0&&d%a.every===0){let h=l({tier:t}),m=h.userData.footprint||{w:7.3,d:6.5,h:10},x=c*(s+m.d/2+j(.05,.4));i.place(h,x,u+m.w/2,-c*Math.PI/2,{block:!0,tag:"bld:hero"}),r.push({x,z:u+m.w/2,d:m.d,w:m.w,side:c,ai:!0}),u+=m.w+j(.1,.5)}else{let h=j(6.5,10.5),m=j(7,10),x=Ge(.25)?dn(2,3):dn(3,e.maxFloors||6),p=Fo({w:h,d:m,floors:x,tier:t}),g=c*(s+m/2+j(.05,.6));i.place(p,g,u+h/2,-c*Math.PI/2,{block:!0,tag:"bld:low"}),r.push({x:g,z:u+h/2,d:m,w:h,side:c}),u+=h+j(.1,.6)}d++}}return r}function e1(i){let{tier:e}=i,t=i.streetLen,n=i.laneHalf,s=[];for(let r of[-1,1]){let a=-t/2;for(;a<t/2;){let o=j(12,20),l=j(12,17),c=Ge(e>=3?.62:.3),u;c?u=Oo({w:o,d:l,floors:dn(e>=3?8:5,e>=3?20:11),tier:e}):u=kh({w:o,d:l,floors:dn(4,7),tier:e,units:Math.max(3,Math.round(o/4))});let d=r*(n+l/2);i.place(u,d,a+o/2,0,{block:!0,tag:"bld:ave"}),s.push({x:d,z:a+o/2,d:l,w:o,side:r}),a+=o+j(.6,2.2)}}return s}function t1(i){let{spec:e,tier:t}=i,n=i.streetLen,s=i.courtW||46,r=s/2,a=t>=3?2:2.4,o=t>=3?"railing":"brick",l=9;for(let u of[-1,1])i.place(sr({len:n,h:a,tier:t,kind:o}),u*(r+.4),0,Math.PI/2,{collide:"auto"});for(let u of[-1,1]){let d=(s-l)/2;i.place(sr({len:d,h:a,tier:t,kind:o}),-(s+l)/4,u*(n/2-.4),0,{}),i.place(sr({len:d,h:a,tier:t,kind:o}),(s+l)/4,u*(n/2-.4),0,{})}let c=[];for(let u of[-1,1]){let d=-n/2+8,f=e.blocks||3;for(let h=0;h<f;h++){let m=j(14,22),x=j(10,14),p;e.structure==="tower"?p=Oo({w:m,d:x,floors:dn(7,16),tier:t,podium:!1}):e.structure==="hall"?p=Bo({w:m,d:x,h:j(10,15),tier:t,steps:!1,columns:h===0,roofStyle:"flat"}):p=kh({w:m,d:x,floors:e.floors||dn(4,6),tier:t,units:Math.max(3,Math.round(m/4))});let g=u*(r-x/2-j(.5,1.5));i.place(p,g,d+m/2,0,{block:!0,tag:"bld:court"}),c.push({x:g,z:d+m/2,d:x,w:m,side:u}),d+=m+j(4,9)}}if(e.gate!==!1){let u=pf({w:l+.6,h:5.4,text:e.shortName||e.name});i.place(u,0,n/2-.4,0,{})}return i.spawnZ=n/2-16,c}function n1(i){let{spec:e,tier:t}=i,n=i.streetLen,s=[];if(e.structure==="site"){let c=j(20,26),u=j(14,18),d=dn(3,6),f=-5,h=i.spawnZ-(u/2+6),m=s1({w:c,d:u,floors:d,tier:t});i.place(m,f,h,.06,{block:!0});let x=Sg({w:c*.5,h:d*2.9,d:1.4});i.place(x,f-c*.24,h+u/2+1.3,0,{});let p=Eg({h:26+d*2.8,jib:22});i.place(p,12,3,.6,{});for(let y of[-1,1])i.place(sr({len:n,h:2.6,tier:t,kind:"hoarding"}),y*24,0,Math.PI/2,{});for(let y of[-1,1])i.place(sr({len:40,h:2.6,tier:t,kind:"hoarding"}),0,y*(n/2),0,{});let g=uf({w:8,d:4.6,h:3.2,tier:t,sawtooth:!1,doors:1,panel:Di().common.panelRust});return i.place(g,-15,24,.18,{block:!0}),i.lots.push({x:f,z:h+u/2+4,rot:0,kind:"site-center"}),i.lots.push({x:4,z:20,rot:0,kind:"site"}),i.lots.push({x:-14,z:18,rot:0,kind:"site"}),i.spawnZ=22,s}let r=5;i.spawnZ=n/2-30;let a=-n/2+6;for(;a<n/2-10;){let c=j(15,21),u=j(11,15),d=j(6,9.5),f=Ge(.5)?-1:1,h=uf({w:c,d:u,h:d,tier:t,sawtooth:Ge(.7),doors:dn(2,3)}),m=f*(r+u/2+j(0,2));i.place(h,m,a+c/2,f>0?0:Math.PI,{block:!0,tag:"bld:shed"}),s.push({x:m,z:a+c/2,d:u,w:c,side:f}),a+=c+j(3,8)}for(let c=0;c<5;c++){let u=zh({w:j(5,7),d:2.5,h:j(2.5,3),color:wt([4151914,5917242,4872772,6969930])}),d=wt([-1,1])*j(2,12);i.place(u,d,i1(-n/2+6,n/2-6,i.spawnZ),j(-.4,.4)+(Ge(.5)?0:Math.PI/2),{})}let o=c=>{let u=Ge(.5)?1:-1,[d,f]=i.spot(u*2.4,u*7.5,-n/2+8,n/2-8,c);return Math.abs(f-i.spawnZ)<7?[d,f+(f<i.spawnZ?-8:8)]:[d,f]};for(let c=0;c<4;c++){let u=new Ce,d=j(4.2,6.2),f=2.5,h=zh({w:d,d:f,h:2.6,color:wt([4151914,4872772,6969930,5917242])});if(u.add(h),Ge(.45)){let p=zh({w:d,d:f,h:2.6,color:wt([4872772,4151914,6969930])});p.position.y=2.6,p.rotation.y=Ge(.5)?0:.06,u.add(p)}let[m,x]=o(9);u.userData.footprint={w:d,d:f,h:2.6},i.place(u,m,x,Ge(.5)?0:Math.PI/2,{})}for(let c=0;c<8;c++){let u=new I(Ge(.5)?new qe(j(.3,.55),j(.3,.55),j(2.2,4.5),10):new se(j(1.2,2.2),j(.5,1.1),j(.8,1.4)),new he({color:wt([5921362,6974050,4868678,6969930]),roughness:.82,metalness:.3}));u.position.y=.5,u.rotation.z=Math.PI/2,u.castShadow=!0;let[d,f]=o(8);i.place(u,d,f,j(0,Math.PI),{})}i.spawnZ=n/2-30;let l=dn(1,2);for(let c=0;c<l;c++){let[u,d]=o(7);i.place(_h({large:Ge(.4),tier:t}),u,d,j(0,Math.PI*2),{})}{let c=wt([-1,1])*j(9,15);i.place(vh({kind:wt(["medium","large"])}),c,-n/2+j(8,14),0,{});let u=-c;i.place(Mh(),u,-n/2+j(10,16),j(0,Math.PI*2),{})}for(let c=0;c<4;c++){let[u,d]=i.spot(-8,8,-n/2+8,n/2-8,5);i.place(bh(),u,d,0,{})}return s}function i1(i,e,t){for(let n=0;n<20;n++){let s=j(i,e);if(Math.abs(s-(t||0))>4)return s}return i}function s1({w:i,d:e,floors:t,tier:n=1}){let s=new Ce,r=3,a=Di().common.stone,o={x:Math.max(2,Math.round(i/4)),z:Math.max(2,Math.round(e/4))};for(let c=0;c<t;c++){let u=c*r,d=new I(new se(i,.28,e),a);d.position.set(0,u+.14,0),d.castShadow=!0,d.receiveShadow=!0,s.add(d);for(let f=0;f<=o.x;f++)for(let h=0;h<=o.z;h++){if(f>0&&f<o.x&&h>0&&h<o.z)continue;let m=new I(new se(.42,r,.42),a);m.position.set(-i/2+f*i/o.x,u+r/2,-e/2+h*e/o.z),m.castShadow=!0,s.add(m)}}let l=Math.max(2,Math.round(e/4));for(let c=0;c<=l;c++){let u=new I(new se(i*.94,r*.6,.2),a);u.position.set(0,t*r+r*.3,-e/2+c*e/l),u.castShadow=!0,s.add(u)}for(let c=0;c<14;c++){let u=new I(new qe(.045,.045,j(.5,1.3),5),new he({color:6969930,roughness:.7,metalness:.5}));u.position.set(j(-i/2,i/2),t*r+j(.3,.8),j(-e/2,e/2)),s.add(u)}return s.userData.footprint={w:i,d:e,h:t*r},s}function r1(i){let{spec:e,tier:t}=i,n=i.streetLen,s=[],r=e.mainW||(e.structure==="tower"?j(18,24):j(24,34)),a=j(12,18),o,l=!1;if(e.structure==="tower")o=Oo({w:r,d:a,floors:dn(10,20),tier:t});else if(e.structure==="teaching")o=df({w:r,d:a,floors:dn(4,6),tier:t});else if(e.structure==="pavilion"){o=Uo({tier:t});let d=o.userData.footprint||{w:11,d:9};r=Math.round(d.w),a=Math.round(d.d),l=!0}else o=Bo({w:r,d:a,h:e.mainH||j(11,17),tier:t,steps:e.steps!==!1,columns:!0,roofStyle:e.hipRoof?"hip":"flat"});let c=-n/2+a/2+14;i.place(o,0,c,0,{block:!0}),s.push({x:0,z:c,d:a,w:r,side:0,ai:l}),i.spawnZ=Math.min(n/2-8,c+a/2+13);for(let d of[-1,1]){if(Ge(.25))continue;let f=j(14,22),h=j(10,15),m;e.structure==="teaching"?m=df({w:f,d:h,floors:dn(3,5),tier:t,corridor:Ge(.5)}):t>=3&&Ge(.5)?m=Oo({w:f*.8,d:h,floors:dn(6,12),tier:t,podium:!1}):m=kh({w:f,d:h,floors:dn(3,6),tier:t,units:Math.max(2,Math.round(f/4))}),i.place(m,d*j(20,27),c+j(6,16),d>0?-.35:.35,{block:!0,tag:"bld:side"}),s.push({x:d*22,z:c+10,d:h,w:f,side:d})}if(e.flagPole)for(let d=0;d<3;d++)i.place(Tg({h:11}),(d-1)*4.5,c+a/2+9,0,{});if(e.gate){for(let f of[-1,1])i.place(sr({len:n/2-10/2,h:2.2,tier:t,kind:"railing"}),f*(n/4+10/4),n/2-1.5,0,{});i.place(pf({w:10+.8,h:5.6,text:e.shortName||e.name}),0,n/2-1.5,0,{})}let u=e.gate?0:dn(2,4);for(let d=0;d<u;d++){let[f,h]=i.spot(-10,10,-n/2+10,n/2-10,7);i.place(Th({variant:Ge(.5)?"a":"b"}),f,h,j(0,Math.PI*2),{})}return s}var Ug={slum:["便利超市","五金水电","平价水果","理发","兰州拉面","手机维修","废品回收","宽带办理"],wholesaleMarket:["南北干货","冻品批发","粮油批发","一次性用品","塑料制品"],night_market:["烧烤","麻辣烫","炒粉炒面","烤冷面","炸串","柠檬茶","铁板鱿鱼","糖水"],flea_market:["收旧手机","二手书","旧家电","古玩杂项","旧衣翻新","维修钟表"],flower_bird_market:["绿植花卉","观赏鱼","鸟笼鸟粮","宠物用品","盆栽多肉"],vegetable_market:["时令蔬菜","猪牛羊肉","活鱼水产","粮油副食","豆制品","干货调料"],internet_cafe:["网咖","电竞馆","奶茶"],commercialDist:["潮流服饰","数码旗舰店","美妆","烘焙","零食优选","运动装备"],entertainment:["KTV","电玩城","影城","棋牌室","酒吧"],auto_city:["汽车销售","轮胎店","汽修厂","汽车美容","汽配"],bank:["储蓄所","理财中心","ATM"],trainingCenter:["公考培训","电工焊工","会计实操","电脑培训"],default:["杂货","快递代收","小卖部"]},a1={folk:["老李","阿强","陈记","肥仔","张记","阿珍","细佬","阿婆","强记","老三"],plain:["永兴","金利","顺发","建华","兴发","联兴","新达","宏发","广源","同益"],modern:["优选","优品","悦享","壹号","尚品","佳选","潮荟","乐活"]},o1={slum:"folk",night_market:"folk",flea_market:"folk",flower_bird_market:"folk",vegetable_market:"plain",wholesaleMarket:"plain",internet_cafe:"plain",auto_city:"plain",bank:"modern",trainingCenter:"modern",commercialDist:"modern",entertainment:"modern"};function Sf(i,e){let t=Ug[i]||Ug.default,n=a1[o1[i]||"plain"],s=t[e%t.length];return e%2?s:n[Math.floor(e/t.length)%n.length]+s}var Ef=new Map;function wf(i,e){if(Ef.has(i))return Ef.get(i);let t=new he({map:e(),roughness:.9,side:Wt});return Ef.set(i,t),t}function l1(i,e,t){let{spec:n,tier:s}=i,r=i.streetLen,a=i.laneHalf,o=Di(),l=(h,m,x,p,g)=>i.spot(h,m,x,p,g),c=Math.max(3,Math.round((n.footfall||.6)*10));for(let h=0;h<c;h++){let[m,x]=i.spotEdge(-r/2,r/2),p=ko({color:wt([9075258,4155972,3820122]),large:Ge(.3)});i.place(p,m,x,j(0,Math.PI*2),{tag:"bin"})}let u=Math.max(1,Math.round((n.footfall||.6)*3));for(let h=0;h<u;h++){let[m,x]=i.spotEdge(-r/2+3,r/2-3,4.5);i.place(Sh(),m,x,j(-.3,.3)+(Ge(.5)?0:Math.PI/2),{tag:"dumpster"})}for(let h=-r/2+6;h<r/2;h+=16)for(let m of[-1,1]){if(Math.abs(h-i.spawnZ)<3)continue;let x=mf({h:7.4,tier:s});i.place(x,m*(a-.5),h,m>0?Math.PI:0,{})}for(let h=-r/2+10;h<r/2-6;h+=22)for(let m of[-1,1]){if(Math.abs(h-i.spawnZ)<3||Ge(.45))continue;let x=Ch();i.place(x,m*(a-1.3)+j(-.3,.3),h+j(-2,2),j(0,Math.PI*2),{})}t.forEach(h=>{if(h.ai)return;let m=Math.sign(h.x)||1,x=m*(Math.abs(h.x)-h.d/2-.12);if(Ge(.6)){let p=Ph();i.place(p,x,h.z+(Ge(.5)?-1:1)*(h.w/2-.6),m>0?-Math.PI/2:Math.PI/2,{})}if(Ge(.4)){let p=Ah({variant:1+Math.floor(j(0,3))});i.place(p,x,h.z+j(-h.w/3,h.w/3),m>0?-Math.PI/2:Math.PI/2,{})}});let d=ZS[n.id];if(d&&Og[d]){let h=Math.max(1,Math.round(r/34));for(let m=0;m<h;m++){let x=m%2===0?-1:1,p=r/h,g=-r/2+p*(m+.5)+j(-p*.16,p*.16),y=x*(a-Ng),M=x>0?-Math.PI/2:Math.PI/2,_=JS(d,s,a);i.place(_,y,g,M,{tag:"stall"}),i.anchor(y-x*(bf(_)/2+.4),g,M,"stall")}}let f=[{title:"大特价",price:"9.9",sub:"限今日",note:"数量有限 售完即止"},{title:"新店开业",price:"5折",sub:"全场商品",note:"开业前三天"},{title:"招工",price:"",sub:"普工 数名",note:"包吃住 待遇面议"},{title:"清仓",price:"1折起",sub:"全场甩卖",note:"最后三天"},{title:"免息分期",price:"0首付",sub:"当天放款",note:"凭身份证办理"},{title:"买一送一",price:"",sub:"限本店",note:"详情店内咨询"}];if(t.forEach((h,m)=>{if(!Ge(.62))return;let x=Math.sign(h.x)||1,p=x*(Math.abs(h.x)-h.d/2-.07),g=x>0?-Math.PI/2:Math.PI/2,y=dn(1,3);for(let M=0;M<y;M++){let _=(m*2+M)%f.length,b=(m+M)%2?"band":"circle",S=new I(new rt(j(.66,.95),j(.9,1.28)),wf(`poster:${_}:${b}`,()=>K0({...f[_],motif:b})));S.position.set(p,j(1.3,2.8),h.z+j(-h.w/2+.8,h.w/2-.8)),S.rotation.y=g,i.addRaw(S)}}),t.length){let h=5+Math.round((n.footfall||.6)*12);for(let m=0;m<h;m++){let x=t[dn(0,t.length-1)],p=Math.sign(x.x)||1,g=(m+n.id.length)%8,y=new I(new rt(.21,.297),wf(`flyer:${g}`,()=>$0({seed:g})));y.position.set(p*(Math.abs(x.x)-x.d/2-.02),j(.5,2.2),x.z+j(-x.w/2+.5,x.w/2-.5)),y.rotation.y=p>0?-Math.PI/2:Math.PI/2,y.rotation.z=j(-.15,.15),i.addRaw(y)}}if(t.length&&(e==="lane"||e==="avenue")){let h=e==="avenue"?3:2;for(let m=0;m<h;m++){let x=t[dn(0,t.length-1)],p=Math.sign(x.x)||1,g=(m*3+n.id.length)%8,y=new I(new rt(4.2,.52),wf(`banner:${g}`,()=>Z0({seed:g})));y.position.set(p*(Math.abs(x.x)-x.d/2-.12),j(4,4.5),x.z+j(-x.w/3,x.w/3)),y.rotation.y=p>0?-Math.PI/2:Math.PI/2,i.addRaw(y)}}if(e==="lane"){t.forEach((p,g)=>{if(Ge(.42))return;let y=Sf(n.id,g),M=hf({width:Math.min(p.w*.86,5.6),sign:y,tier:s,open:Ge(.65)});M.position.set(Math.sign(p.x)*(Math.abs(p.x)-p.d/2-.16),0,p.z),M.rotation.y=p.x>0?-Math.PI/2:Math.PI/2,i.addRaw(M),i.lot(Math.sign(p.x)*(Math.abs(p.x)-p.d/2-1.7),p.z,0,"shop");let _=Math.sign(p.x);i.anchor(_*(Math.abs(p.x)-p.d/2-.8),p.z,_>0?-Math.PI/2:Math.PI/2,"shop")});let h=9,m=[h-1.6,h-1.6+.75],x=[];for(let p=-r/2+7;p<=r/2-7;p+=18)for(let g of[-1,1]){let y=_g({h}),M=g*(a-oa);i.place(y,M,p+j(-.8,.8),0,{tag:"pole"}),x.push(y),i.colliders.push({minX:M-.28,maxX:M+.28,minZ:y.position.z-.28,maxZ:y.position.z+.28,tag:"pole"})}for(let p=0;p<x.length;p++){let g=x[p],y=x[p+2];if(y)for(let M of m)i.addWire(new P(g.position.x,M,g.position.z),new P(y.position.x,M,y.position.z),j(.5,1));if(Ge(.5)){let M=x.find(_=>Math.sign(_.position.x)!==Math.sign(g.position.x)&&Math.abs(_.position.z-g.position.z)<3.6);M&&i.addWire(new P(g.position.x,6.9,g.position.z),new P(M.position.x,6.9,M.position.z),j(.8,1.4))}}for(let p=0;p<5;p++){let g=Ge(.5)?-1:1,[y,M]=l(g*(a-.55),g*(a-jS),-r/2+2,r/2-2),_=Ge(.22)?"tricycle":Ge(.2)?"bike":"scooter",b=rr({kind:_,color:wt([3095108,7027252,3820090,5593696])});if(b.rotation.y=g>0?j(-.4,.4)+Math.PI:j(-.4,.4),i.place(b,y,M,b.rotation.y,{}),Ge(.6)){let S=rr({kind:"scooter",color:wt([3095108,7027252,3820090,5593696])});S.rotation.y=b.rotation.y+j(-.25,.25),i.place(S,y+j(-.5,.5),M+j(-1.1,1.1),S.rotation.y,{})}}if(n.id==="night_market"){for(let p=-r/2+9;p<r/2-8;p+=j(16,24))for(let g of[-1,1]){let y=g*(a-Ng),M=p+j(-1.6,1.6),_=g>0?-Math.PI/2:Math.PI/2,b=Hh({w:j(2,2.8),d:j(1.1,1.35),tier:s,colors:wt(Rf),box:Ge(.6)});i.place(b,y,M,_,{}),i.lot(y-g*1.4,M,0,"stall"),i.anchor(y-g*(bf(b)/2+.4),M,_,"stall")}for(let p=-r/2+10;p<r/2-8;p+=9){let g=m[0],y=a-oa,M=new P(-y,g,p),_=new P(y,g,p+j(-.4,.4));i.addWire(M,_,.5);for(let b=1;b<9;b++){let S=new P().lerpVectors(M,_,b/9);S.y-=Math.sin(b/9*Math.PI)*.5;let R=new I(new mn(.075,6,5),new cn({color:wt([16767120,16756832,16771248])}));R.position.copy(S),i.addRaw(R)}}}for(let p=0;p<3;p++){let g=Dn()<.5?-1:1,[y,M]=i.spot(g*(a-oa-.3),g*(a-oa+.3),-r/2+6,r/2-6,6);i.place(Eh(),y,M,j(-.2,.2),{tag:"pole:utility"})}for(let p=0;p<3;p++){let g=Dn()<.5?-1:1,[y,M]=i.spot(g*(a-oa-.25),g*(a-oa+.35),-r/2+8,r/2-8,7);i.place(Lh(),y,M,j(-.3,.3),{tag:"pole:power"})}t.forEach(p=>{if(Ge(.55))return;let g=Math.sign(p.x)||1,y=Ih();i.place(y,g*(Math.abs(p.x)-p.d/2-.7),p.z+j(-p.w/3,p.w/3),g>0?-Math.PI/2:Math.PI/2,{})});for(let p=0;p<4;p++){let g=-r/2+8+p*(r-16)/3,y=Ge(.5)?-1:1;i.place(Dh(),y*(a-.4),g+j(-2,2),y>0?-Math.PI/2:Math.PI/2,{})}t.forEach((p,g)=>{if(Ge(.55))return;let y=Ge(.4),M=wh({wide:y}),_=Math.sign(p.x)||1;i.place(M,_*(Math.abs(p.x)-p.d/2-.5),p.z,_>0?-Math.PI/2:Math.PI/2,{collide:"none",tag:"awning"})});return}if(e==="avenue"){let h=0;for(let p of t){let g=dn(1,3),y=p.w/(g+.4);for(let M=0;M<g;M++){let _=Sf(n.id,h++),b=hf({width:y,sign:_,tier:s,open:Ge(.78),height:3.8}),S=p.z-p.w/2+y*(M+.7);b.position.set(Math.sign(p.x)*(Math.abs(p.x)-p.d/2-.18),0,S),b.rotation.y=p.x>0?-Math.PI/2:Math.PI/2,i.addRaw(b),i.lot(Math.sign(p.x)*(Math.abs(p.x)-p.d/2-2.1),S,0,"shop")}}for(let p=0;p<4;p++){let[g,y]=l(-18,18,-r/2+10,r/2-10);i.place(ra({w:j(3,4.6),h:j(2,3),y:j(3,4.4),text:wt(["限时特惠","全场五折","新店开业","招聘中","分期免息"]),bg:wt(["#3a4a58","#5a3038","#3f4a3a"]),fg:"#e8e4d8"}),g,y,j(-.3,.3)+(Ge(.5)?0:Math.PI/2),{})}for(let p=0;p<7;p++){let g=Ge(.5)?-1:1,[y,M]=l(g*2.5,g*(a-4),-r/2+4,r/2-4,4.5),_=aa({color:wt([3817800,6975348,3095108,5917252,9080722])});i.place(_,y,M,g>0?0:Math.PI,{})}for(let p=0;p<8;p++){let g=Ge(.5)?-1:1,[y,M]=l(g*(a-1.4),g*(a-.2),-r/2,r/2,3.2),_=rr({kind:Ge(.3)?"bike":"scooter",color:wt([3095108,7027252,3820090])});i.place(_,y,M,j(0,Math.PI*2),{})}let[m,x]=l(-14,14,-r/2+8,r/2-8,6);i.place(wg(),m,x,Ge(.5)?Math.PI:0,{});for(let p=0;p<2;p++){let[g,y]=l(-a+3,a-3,-r/2+12,r/2-12,8),M=Ge(.5)?0:Math.PI/2;i.place(Do({variant:1}),g,y,M,{}),i.place(Do({variant:2}),g+(M===0?2.2:0),y+(M===0?0:2.2),M,{})}t.forEach(p=>{if(Ge(.78))return;let g=Math.sign(p.x)||1,y=Rh();i.place(y,g*(Math.abs(p.x)-p.d/2-.2),p.z+j(-p.w/3,p.w/3),g>0?-Math.PI/2:Math.PI/2,{})});return}if(e==="compound"){for(let h=0;h<10;h++){let[m,x]=l(-a+2,a-2,-r/2+5,r/2-5);i.place(gf({h:j(4.5,7),tier:s}),m,x,j(0,Math.PI*2),{})}for(let h=0;h<8;h++){let[m,x]=l(-a+3,a-3,-r/2+6,r/2-6);i.place(xf(),m,x,j(0,Math.PI*2),{})}for(let h=0;h<6;h++){let[m,x]=l(-a+2,a-2,-r/2+5,r/2-5);i.place(ko({color:wt([4155972,9075258])}),m,x,j(0,Math.PI*2),{})}for(let h=0;h<12;h++){let[m,x]=l(-a+3,a-3,-r/2+6,r/2-6,2.6),p=rr({kind:Ge(.65)?"bike":"scooter",color:wt([3820090,4868698,5913146])});i.place(p,m,x,j(0,Math.PI*2),{})}for(let h=0;h<3;h++){let[m,x]=l(-a+4,a-4,-r/2+10,r/2-10,5);i.place(ra({w:3.2,h:1.8,y:2.2,text:wt(["社区公告","文明公约",`收费标准
明码标价`,"招聘信息"]),bg:"#e0dcd0",fg:"#3a3a36"}),m,x,Ge(.5)?0:Math.PI/2,{})}if(n.stalls){let h=0;for(let m=-r/2+10;m<r/2-10;m+=5.6){for(let x of[-1,1]){let[p,g]=l(x*5,x*12,m-1.2,m+1.2,2.6),y=x>0?-Math.PI/2:Math.PI/2,M=Hh({w:j(2.2,3),d:j(1.2,1.5),tier:s,colors:wt(Rf),box:!0});i.place(M,p,g,y,{}),Ge(.55)&&i.lot(p-x*1.5,g,0,"stall"),i.anchor(p-x*(bf(M)/2+.4),g,y,"stall")}i.place(ra({w:2.4,h:.7,y:3.4,text:Sf(n.id,h++),bg:"#5a4030",fg:"#e8dcc8",legs:!1}),j(-8,8),m,0,{})}}if(n.id==="hospital"){let h=_f({len:7,rows:3});h.position.set(0,0,i.spawnZ-12),h.userData.noMerge=!0,i.addRaw(h),i.place(aa({color:14211280,kind:"truck"}),j(-10,-5),i.spawnZ-6,Math.PI/2,{})}return}if(e==="yard"){for(let h=0;h<5;h++){let[m,x]=l(-a+5,a-5,-r/2+6,r/2-6,5),p=aa({color:wt([3817800,5921370,4872810]),kind:Ge(.6)?"truck":"sedan"});i.place(p,m,x,Ge(.5)?0:Math.PI/2,{})}for(let h=0;h<6;h++){let[m,x]=l(-a+4,a-4,-r/2+4,r/2-4,3.2);i.place(rr({kind:"tricycle",color:wt([4872778,6965818])}),m,x,j(0,Math.PI*2),{})}for(let h=0;h<4;h++){let[m,x]=l(-a+4,a-4,-r/2+4,r/2-4,3.2);i.place(ko({large:!0}),m,x,j(0,Math.PI*2),{})}if(n.structure==="site"){for(let h=0;h<14;h++){let[m,x]=l(-a+4,a-4,-r/2+4,r/2-4,3),p=new I(Ge(.5)?new se(j(1.4,2.6),j(.3,.7),j(.9,1.5)):new qe(j(.3,.6),j(.3,.6),j(1.2,3),10),new he({color:wt([6969930,9076856,5917242,4868682]),roughness:.9,metalness:.2}));p.position.y=.4,p.castShadow=!0,i.place(p,m,x,j(0,Math.PI),{})}for(let h=0;h<8;h++){let[m,x]=l(-a+4,a-4,-r/2+4,r/2-4,3);i.place(bg({kind:Ge(.6)?"cone":"fence"}),m,x,j(0,Math.PI*2),{})}i.place(ra({w:5,h:1.5,y:3.2,text:"安全第一 质量为本",bg:"#8a3a2a",fg:"#f0e4cc",legs:!1}),-21,i.spawnZ+6,Math.PI/2,{})}return}for(let h=0;h<16;h++){let[m,x]=l(-a+3,a-3,-r/2+4,r/2-4);i.place(gf({h:j(4.5,8.5),tier:s,kind:Ge(.18)?"palm":"broad"}),m,x,j(0,Math.PI*2),{})}for(let h=0;h<7;h++){let[m,x]=l(-a+4,a-4,-r/2+8,r/2-8);i.place(xf(),m,x,j(0,Math.PI*2),{})}for(let h=0;h<8;h++){let[m,x]=l(-a+3,a-3,-r/2+6,r/2-6,3);i.place(mf({h:6.6,tier:s}),m,x,j(0,Math.PI*2),{})}for(let h=0;h<6;h++){let[m,x]=l(-a+3,a-3,-r/2+6,r/2-6);i.place(ko({color:wt([4155972,9075258])}),m,x,0,{})}for(let h=0;h<5;h++){let[m,x]=l(-a+4,a-4,-r/2+10,r/2-10);i.place(Mg({w:j(1.4,2.4),d:j(1.4,2.4)}),m,x,0,{})}for(let h=0;h<5;h++){let[m,x]=l(-a+4,a-4,-r/2+8,r/2-8,2.8),p=rr({kind:Ge(.6)?"bike":"scooter",color:wt([3820090,4868698,5913146,3095108])});i.place(p,m,x,j(0,Math.PI*2),{})}if(n.id==="park"&&(i.place(ff({r:2.6}),j(-14,14),j(-6,6),0,{}),i.place(yf({r:3.2}),j(-16,16),j(2,14),0,{})),n.id==="temple"){i.place(ff({r:2.2,tier:s}),j(-16,-8),j(-4,6),0,{});let h=new I(new qe(.9,1.05,1.3,14),new he({color:5917242,roughness:.75,metalness:.35}));h.position.y=.65,h.castShadow=!0,i.place(h,0,i.spawnZ-16,0,{})}if(n.id==="techPark"){i.place(yf({r:3.6}),0,i.spawnZ-18,0,{});for(let h=0;h<8;h++){let[m,x]=l(-18,18,-r/2+8,r/2-8,5);i.place(aa({color:wt([3095108,9080722,3817800,5925498])}),m,x,Ge(.5)?0:Math.PI,{})}}if(n.id==="gov_office"||n.id==="court"){let h=_f({len:8,rows:4});h.position.set(0,0,i.spawnZ-10),h.userData.noMerge=!0,i.addRaw(h);for(let m=0;m<5;m++){let[x,p]=l(-16,16,r/2-22,r/2-12,4);i.place(aa({color:wt([3095108,3817800,5921370])}),x,p,Ge(.5)?0:Math.PI,{})}}if(n.id==="school"&&n.gym&&i.place(Bo({w:24,d:16,h:13,tier:s,steps:!1,columns:!1,roofStyle:"flat"}),0,r/2-24,0,{block:!0}),n.id==="gym"&&i.place(Bo({w:30,d:20,h:15,tier:s,steps:!0,columns:!1,roofStyle:"flat"}),0,r/2-26,0,{block:!0}),n.id==="job_market"||n.id==="library"||n.id==="community_center")for(let h=0;h<4;h++){let[m,x]=l(-16,16,-r/2+14,r/2-14,5);i.place(ra({w:4,h:2.4,y:2.4,text:wt([`招聘信息
每日更新`,"免费求职登记",`开放时间
09:00-21:00`,"新书上架"]),bg:"#3a4a58",fg:"#e8e4d8"}),m,x,Ge(.5)?0:Math.PI/2,{})}}var Wh={slum:{layout:"lane",structure:"lowRise",streetLen:100,roadW:9.5,maxFloors:6},wholesaleMarket:{layout:"yard",structure:"shed",streetLen:92},construction:{layout:"yard",structure:"site",streetLen:86},factoryZone:{layout:"yard",structure:"shed",streetLen:104},school:{layout:"plaza",structure:"teaching",streetLen:104,plazaW:50,mainW:40,gym:!0,gate:!0,shortName:"大学城"},commercialDist:{layout:"avenue",structure:"tower",streetLen:108,roadW:16},techPark:{layout:"plaza",structure:"tower",streetLen:104,plazaW:52,mainW:26,flagPole:!0},hospital:{layout:"compound",structure:"tower",streetLen:96,courtW:38,blocks:3,gate:!0,shortName:"医院"},bank:{layout:"avenue",structure:"tower",streetLen:78,roadW:14},park:{layout:"plaza",structure:"hall",streetLen:96,plazaW:56,mainW:17,mainH:8,gate:!0,shortName:"公园"},community_center:{layout:"plaza",structure:"hall",streetLen:84,plazaW:46,mainW:26,gate:!0,shortName:"社区中心"},night_market:{layout:"lane",structure:"lowRise",streetLen:96,roadW:10,maxFloors:4},trainingCenter:{layout:"compound",structure:"hall",streetLen:82,courtW:34,blocks:2,gate:!0,shortName:"培训中心"},suburb:{layout:"lane",structure:"lowRise",streetLen:110,roadW:11,maxFloors:3},luxury_community:{layout:"compound",structure:"tower",streetLen:104,courtW:40,blocks:4,gate:!0,shortName:"高档小区"},old_community:{layout:"compound",structure:"slab",streetLen:96,courtW:38,blocks:3,floors:6,gate:!0,shortName:"老旧小区"},gov_office:{layout:"plaza",structure:"hall",streetLen:96,plazaW:50,mainW:36,flagPole:!0,gate:!0,shortName:"政务大厅"},court:{layout:"plaza",structure:"hall",streetLen:92,plazaW:50,mainW:32,flagPole:!0,hipRoof:!0,gate:!0,shortName:"人民法院"},job_market:{layout:"plaza",structure:"hall",streetLen:88,plazaW:46,mainW:30,gate:!0,shortName:"人才市场"},entertainment:{layout:"avenue",structure:"tower",streetLen:96,roadW:15},temple:{layout:"plaza",structure:"pavilion",streetLen:84,plazaW:46,mainW:28,hipRoof:!0,gate:!0,shortName:"古寺"},library:{layout:"plaza",structure:"hall",streetLen:88,plazaW:48,mainW:32,gate:!0,shortName:"图书馆"},gym:{layout:"plaza",structure:"hall",streetLen:100,plazaW:54,mainW:30,gate:!0,shortName:"体育馆"},internet_cafe:{layout:"lane",structure:"lowRise",streetLen:72,roadW:9,maxFloors:5},logistics_park:{layout:"yard",structure:"shed",streetLen:108},auto_city:{layout:"avenue",structure:"tower",streetLen:100,roadW:18},flower_bird_market:{layout:"lane",structure:"lowRise",streetLen:88,roadW:11,maxFloors:3},flea_market:{layout:"lane",structure:"lowRise",streetLen:84,roadW:10,maxFloors:3},vegetable_market:{layout:"compound",structure:"hall",streetLen:80,courtW:36,blocks:2,gate:!0,stalls:!0,shortName:"菜市场"}},Af={lane:"巷弄",avenue:"商业街",compound:"院区",yard:"厂区",plaza:"广场"},Fg=!1;function Xh(i,e,t,n={}){let s=e.locations[t];if(!s)throw new Error(`未知地点: ${t}`);let r={...Wh[t]||Wh.community_center,name:s.name,id:t,shortName:s.name};Fg||(xh(Di()),Fg=!0),ag(sg(t));let a=Math.min(3,Math.max(1,s.wealthTier|0)),o=new Tf(i,r,a),l=r.layout,c=og(o.group),u=[];try{YS(o,l),l==="lane"?u=QS(o):l==="avenue"?u=e1(o):l==="compound"?u=t1(o):l==="yard"?u=n1(o):u=r1(o),l1(o,l,u)}finally{c()}c1(o,s,l),o.resolveAnchors();let d=new P(0,0,o.spawnZ),f=o.streetLen/2-1.5,h={minX:-o.laneHalf+1,maxX:o.laneHalf-1,minZ:-f,maxZ:f},m={lane:{yaw:.38,pitch:.7,dist:16,minH:5.2},avenue:{yaw:.38,pitch:.7,dist:17,minH:5.5},compound:{yaw:.38,pitch:.71,dist:17,minH:5.8},yard:{yaw:.46,pitch:.7,dist:17,minH:6.5},plaza:{yaw:.38,pitch:.72,dist:18,minH:7.5}};return{id:t,name:s.name,meta:s,group:o.group,colliders:o.colliders,blockers:o.blockers,hotspots:o.hotspots,anchors:o.anchors,anchorPushed:o.anchorPushed||0,anchorStuck:o.anchorStuck||0,corridor:o.corridorHalf(),carClearance:o.clearanceHalf(),corridorClamped:o.corridorClamped||0,corridorPushed:o.corridorPushed||0,corridorStuck:o.corridorStuck||0,wires:o.wires,spawn:d,bounds:h,camera:m[l]||m.lane,laneHalf:o.laneHalf,streetLen:o.streetLen,roadW:o.roadW,stats:{tier:a,layout:l,layoutName:Af[l],structure:r.structure}}}function c1(i,e,t){var u;let n=i.laneHalf,s=i.streetLen,r=[];for(let d of e.jobs||[])r.push({kind:"work",id:d.id,name:d.name,icon:d.icon||"💼",data:d});for(let d of e.actions||[])r.push({kind:"action",id:d.id,name:d.name,icon:d.icon||"⚡",data:d});for(let d of e.actionsExtra||[])r.push({kind:"extra",id:d.id,name:d.name,icon:d.icon||"⚡",data:d});for(let d of e.illegal||[])r.push({kind:"risk",id:d.id,name:d.name,icon:d.icon||"⚠️",data:d});for(let d of e.amenities||[])r.push({kind:"service",id:d.id,name:d.name,icon:d.icon||"🏪",data:d});((e.buy||[]).length||(e.sell||[]).length)&&r.push({kind:"trade",id:`${e.id}_trade`,name:"买卖交易",icon:"🛒",data:{buy:e.buy||[],sell:e.sell||[],specialties:e.specialtyLabels||e.specialties||[],vendingNote:e.vendingNote||""}}),r.length||r.push({kind:"look",id:`${e.id}_look`,name:"四处看看",icon:"👀",data:{desc:e.desc,type:e.type,footfall:e.footfall,dailyProbability:e.dailyProbability,specialties:e.specialtyLabels||e.specialties||[],priceMod:e.priceModList||[],vendingNote:e.vendingNote||""}});let a=5,o=r;if(r.length>a){let d={};for(let h of r)(d[u=h.kind]||(d[u]=[])).push(h);o=[];let f=0;for(;o.length<a&&f<30;){for(let h of["work","trade","service","action","extra","risk"]){let m=d[h];if(m&&m[f]&&(o.push(m[f]),o.length>=a))break}f++}}let l=i.lots.map(d=>[d.x,d.z]);if(l.length<o.length){let d=[];if(t==="yard"||t==="compound")for(let f of[-s/3,0,s/3,s/2-14])d.push([0,f]);else if(t==="plaza")for(let f of[i.spawnZ-7,i.spawnZ-19,0,-s/4])d.push([j(-6,6),f]);else for(let f of[-s/2+10,-s/2+24,s/2-24,s/2-10])d.push([-n*.5,f]);for(let f of d)l.push(f)}for(let d=l.length-1;d>0;d--){let f=Math.floor(Dn()*(d+1));[l[d],l[f]]=[l[f],l[d]]}let c=[];for(let d of o){let f=null,h=-1;for(let[g,y]of l){let M=1/0;for(let[_,b]of c)M=Math.min(M,Math.hypot(g-_,y-b));M>h&&(h=M,f=[g,y])}if(!f)break;c.push(f);let[m,x]=f,p=Rg({icon:d.icon});p.userData.noMerge=!0,p.position.set(m,0,x),i.group.add(p),i.hotspots.push({object:p,x:m,z:x,radius:2.8,kind:d.kind,id:d.id,label:d.name,icon:d.icon,data:d.data,place:e.name})}}function kg(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Ht,c=0;for(let u=0;u<i.length;++u){let d=i[u],f=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let h in d.attributes){if(!n.has(h))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+h+'" attribute exists among all geometries, or in none of them.'),null;r[h]===void 0&&(r[h]=[]),r[h].push(d.attributes[h]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let h in d.morphAttributes){if(!s.has(h))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[h]===void 0&&(a[h]=[]),a[h].push(d.morphAttributes[h])}if(e){let h;if(t)h=d.index.count;else if(d.attributes.position!==void 0)h=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,h,u),c+=h}}if(t){let u=0,d=[];for(let f=0;f<i.length;++f){let h=i[f].index;for(let m=0;m<h.count;++m)d.push(h.getX(m)+u);u+=i[f].attributes.position.count}l.setIndex(d)}for(let u in r){let d=Bg(r[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,d)}for(let u in a){let d=a[u][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let f=0;f<d;++f){let h=[];for(let x=0;x<a[u].length;++x)h.push(a[u][x][f]);let m=Bg(h);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(m)}}}return l}function Bg(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let u=i[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let a=new e(r),o=new rn(a,t,n),l=0;for(let c=0;c<i.length;++c){let u=i[c];if(u.isInterleavedBufferAttribute){let d=l/t;for(let f=0,h=u.count;f<h;f++)for(let m=0;m<t;m++){let x=u.getComponent(f,m);o.setComponent(f+d,m,x)}}else a.set(u.array,l);l+=u.count*t}return s!==void 0&&(o.gpuType=s),o}function Cf(i,e){if(e===Md)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===jr||e===So){let t=i.getIndex();if(t===null){let r=[],a=i.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===jr)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function Hg(i){let e=new Map,t=new Map,n=i.clone();return zg(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function zg(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)zg(i.children[n],e.children[n],t)}var qh=class extends Ti{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Ff(t)}),this.register(function(t){return new Of(t)}),this.register(function(t){return new qf(t)}),this.register(function(t){return new Yf(t)}),this.register(function(t){return new Kf(t)}),this.register(function(t){return new kf(t)}),this.register(function(t){return new Hf(t)}),this.register(function(t){return new zf(t)}),this.register(function(t){return new Gf(t)}),this.register(function(t){return new Uf(t)}),this.register(function(t){return new Vf(t)}),this.register(function(t){return new Bf(t)}),this.register(function(t){return new Xf(t)}),this.register(function(t){return new Wf(t)}),this.register(function(t){return new Df(t)}),this.register(function(t){return new Yh(t,ot.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Yh(t,ot.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new $f(t)})}load(e,t,n,s){let r=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=es.extractUrlBase(e);a=es.resolveURL(c,this.path)}else a=es.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Wr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(u){t(u),r.manager.itemEnd(e)},o)}catch(u){o(u)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===qg){try{a[ot.KHR_BINARY_GLTF]=new Zf(e)}catch(d){s&&s(d);return}r=JSON.parse(a[ot.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new ip(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let d=this.pluginCallbacks[u](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[d.name]=d,a[d.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let d=r.extensionsUsed[u],f=r.extensionsRequired||[];switch(d){case ot.KHR_MATERIALS_UNLIT:a[d]=new Nf;break;case ot.KHR_DRACO_MESH_COMPRESSION:a[d]=new jf(r,this.dracoLoader);break;case ot.KHR_TEXTURE_TRANSFORM:a[d]=new Jf;break;case ot.KHR_MESH_QUANTIZATION:a[d]=new Qf;break;default:f.indexOf(d)>=0&&o[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};function h1(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function en(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var ot={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Df=class{constructor(e){this.parser=e,this.name=ot.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,u=new Pe(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],Cn);let d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Ks(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Ys(u),c.distance=d;break;case"spot":c=new no(u),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Ui(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},Nf=class{constructor(){this.name=ot.KHR_MATERIALS_UNLIT}getMaterialType(){return cn}extendParams(e,t,n){let s=[];e.color=new Pe(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Cn),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,xt))}return Promise.all(s)}},Uf=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Ff=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return en(this.parser,e,this.name)!==null?Fn:null}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new de(r,r)}return Promise.all(s)}},Of=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_DISPERSION}getMaterialType(e){return en(this.parser,e,this.name)!==null?Fn:null}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Bf=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return en(this.parser,e,this.name)!==null?Fn:null}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},kf=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_SHEEN}getMaterialType(e){return en(this.parser,e,this.name)!==null?Fn:null}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new Pe(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Cn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,xt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},Hf=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return en(this.parser,e,this.name)!==null?Fn:null}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},zf=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_VOLUME}getMaterialType(e){return en(this.parser,e,this.name)!==null?Fn:null}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Pe().setRGB(r[0],r[1],r[2],Cn),Promise.all(s)}},Gf=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_IOR}getMaterialType(e){return en(this.parser,e,this.name)!==null?Fn:null}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Vf=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_SPECULAR}getMaterialType(e){return en(this.parser,e,this.name)!==null?Fn:null}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new Pe().setRGB(r[0],r[1],r[2],Cn),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,xt)),Promise.all(s)}},Wf=class{constructor(e){this.parser=e,this.name=ot.EXT_MATERIALS_BUMP}getMaterialType(e){return en(this.parser,e,this.name)!==null?Fn:null}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},Xf=class{constructor(e){this.parser=e,this.name=ot.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return en(this.parser,e,this.name)!==null?Fn:null}extendMaterialParams(e,t){let n=en(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},qf=class{constructor(e){this.parser=e,this.name=ot.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}},Yf=class{constructor(e){this.parser=e,this.name=ot.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},Kf=class{constructor(e){this.parser=e,this.name=ot.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},Yh=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){let l=s.byteOffset||0,c=s.byteLength||0,u=s.count,d=s.byteStride,f=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(u,d,f,s.mode,s.filter).then(function(h){return h.buffer}):a.ready.then(function(){let h=new ArrayBuffer(u*d);return a.decodeGltfBuffer(new Uint8Array(h),u,d,f,s.mode,s.filter),h})})}else return null}},$f=class{constructor(e){this.name=ot.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==ni.TRIANGLES&&c.mode!==ni.TRIANGLE_STRIP&&c.mode!==ni.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(u=>(l[c]=u,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let u=c.pop(),d=u.isGroup?u.children:[u],f=c[0].count,h=[];for(let m of d){let x=new Xe,p=new P,g=new Vn,y=new P(1,1,1),M=new za(m.geometry,m.material,f);for(let b=0;b<f;b++)l.TRANSLATION&&p.fromBufferAttribute(l.TRANSLATION,b),l.ROTATION&&g.fromBufferAttribute(l.ROTATION,b),l.SCALE&&y.fromBufferAttribute(l.SCALE,b),M.setMatrixAt(b,x.compose(p,g,y));let _=null;for(let b in l)if(b==="_COLOR_0"){let S=l[b];M.instanceColor=new Ki(S.array,S.itemSize,S.normalized)}else if(b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"){if(_===null){let R=M.geometry;_=new Ht,_.name=R.name;for(let v in R.attributes)_.setAttribute(v,R.attributes[v]);for(let v in R.morphAttributes)_.morphAttributes[v]=R.morphAttributes[v];R.index!==null&&_.setIndex(R.index),_.morphTargetsRelative=R.morphTargetsRelative;for(let v of R.groups)_.addGroup(v.start,v.count,v.materialIndex);R.boundingBox!==null&&(_.boundingBox=R.boundingBox.clone()),R.boundingSphere!==null&&(_.boundingSphere=R.boundingSphere.clone()),_.drawRange.start=R.drawRange.start,_.drawRange.count=R.drawRange.count,_.userData=Object.assign({},R.userData),M.geometry=_}let S=l[b];_.setAttribute(b,new Ki(S.array,S.itemSize,S.normalized))}Dt.prototype.copy.call(M,m),this.parser.assignFinalMaterial(M),h.push(M)}return u.isGroup?(u.clear(),u.add(...h),u):h[0]}))}},qg="glTF",zo=12,Gg={JSON:1313821514,BIN:5130562},Zf=class{constructor(e){this.name=ot.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,zo),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==qg)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-zo,r=new DataView(e,zo),a=0;for(;a<s;){let o=r.getUint32(a,!0);a+=4;let l=r.getUint32(a,!0);if(a+=4,l===Gg.JSON){let c=new Uint8Array(e,zo+a,o);this.content=n.decode(c)}else if(l===Gg.BIN){let c=zo+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},jf=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ot.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let u in a){let d=tp[u]||u.toLowerCase();o[d]=a[u]}for(let u in e.attributes){let d=tp[u]||u.toLowerCase();if(a[u]!==void 0){let f=n.accessors[e.attributes[u]],h=la[f.componentType];c[d]=h.name,l[d]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(d,f){s.decodeDracoFile(u,function(h){for(let m in h.attributes){let x=h.attributes[m],p=l[m];p!==void 0&&(x.normalized=p)}d(h)},o,c,Cn,f)})})}},Jf=class{constructor(){this.name=ot.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Qf=class{constructor(){this.name=ot.KHR_MESH_QUANTIZATION}},Kh=class extends wi{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,u=s-t,d=(n-t)/u,f=d*d,h=f*d,m=e*c,x=m-c,p=-2*h+3*f,g=h-f,y=1-p,M=g-f+d;for(let _=0;_!==o;_++){let b=a[x+_+o],S=a[x+_+l]*u,R=a[m+_+o],v=a[m+_]*u;r[_]=y*b+M*S+p*R+g*v}return r}},u1=new Vn,ep=class extends Kh{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return u1.fromArray(r).normalize().toArray(r),r}},ni={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},la={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Vg={9728:Vt,9729:Jt,9984:gc,9985:$r,9986:Qs,9987:di},Wg={33071:jt,33648:Ir,10497:on},Pf={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},tp={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ps={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},d1={CUBICSPLINE:void 0,LINEAR:zs,STEP:Hs},If={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function f1(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new he({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Ai})),i.DefaultMaterial}function ar(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Ui(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function p1(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,u=e.length;c<u;c++){let d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let a=[],o=[],l=[];for(let c=0,u=e.length;c<u;c++){let d=e[c];if(n){let f=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;a.push(f)}if(s){let f=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;o.push(f)}if(r){let f=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;l.push(f)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let u=c[0],d=c[1],f=c[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=f),i.morphTargetsRelative=!0,i})}function m1(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function g1(i){let e,t=i.extensions&&i.extensions[ot.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Lf(t.attributes):e=i.indices+":"+Lf(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Lf(i.targets[n]);return e}function Lf(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function np(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function x1(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var y1=new Xe,ip=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new h1,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?this.textureLoader=new Qa(this.options.manager):this.textureLoader=new so(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Wr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return ar(r,o,s),Ui(o,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,u]of a.children.entries())r(u,o.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ot.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,a){n.load(es.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let a=Pf[s.type],o=la[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new rn(c,a,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){let o=a[0],l=Pf[s.type],c=la[s.componentType],u=c.BYTES_PER_ELEMENT,d=u*l,f=s.byteOffset||0,h=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0,x,p;if(h&&h!==d){let g=Math.floor(f/h),y="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+g+":"+s.count,M=t.cache.get(y);M||(x=new c(o,g*h,s.count*h/u),M=new Vs(x,h/u),t.cache.add(y,M)),p=new _s(M,l,f%h/u,m)}else o===null?x=new c(s.count*l):x=new c(o,f,s.count*l),p=new rn(x,l,m);if(s.sparse!==void 0){let g=Pf.SCALAR,y=la[s.sparse.indices.componentType],M=s.sparse.indices.byteOffset||0,_=s.sparse.values.byteOffset||0,b=new y(a[1],M,s.sparse.count*g),S=new c(a[2],_,s.sparse.count*l);o!==null&&(p=new rn(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let R=0,v=b.length;R<v;R++){let w=b[R];if(p.setX(w,S[R*l]),l>=2&&p.setY(w,S[R*l+1]),l>=3&&p.setZ(w,S[R*l+2]),l>=4&&p.setW(w,S[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=m}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){let s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=a.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);let f=(r.samplers||{})[a.sampler]||{};return u.magFilter=Vg[f.magFilter]||Jt,u.minFilter=Vg[f.minFilter]||di,u.wrapS=Wg[f.wrapS]||on,u.wrapT=Wg[f.wrapT]||on,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Vt&&u.minFilter!==Jt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let a=s.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(d){c=!0;let f=new Blob([d],{type:a.mimeType});return l=o.createObjectURL(f),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(l).then(function(d){return new Promise(function(f,h){let m=f;t.isImageBitmapLoader===!0&&(m=function(x){let p=new ln(x);p.needsUpdate=!0,f(p)}),t.load(es.resolveURL(d,r.path),m,void 0,h)})}).then(function(d){return c===!0&&o.revokeObjectURL(l),Ui(d,a),d.userData.mimeType=a.mimeType||x1(a.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[ot.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[ot.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=r.associations.get(a);a=r.extensions[ot.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Hr,Sn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new kr,Sn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return he}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],a,o={},l=r.extensions||{},c=[];if(l[ot.KHR_MATERIALS_UNLIT]){let d=s[ot.KHR_MATERIALS_UNLIT];a=d.getMaterialType(),c.push(d.extendParams(o,r,t))}else{let d=r.pbrMetallicRoughness||{};if(o.color=new Pe(1,1,1),o.opacity=1,Array.isArray(d.baseColorFactor)){let f=d.baseColorFactor;o.color.setRGB(f[0],f[1],f[2],Cn),o.opacity=f[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",d.baseColorTexture,xt)),o.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,o.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",d.metallicRoughnessTexture))),a=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Wt);let u=r.alphaMode||If.OPAQUE;if(u===If.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===If.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==cn&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new de(1,1),r.normalTexture.scale!==void 0)){let d=r.normalTexture.scale;o.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&a!==cn&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==cn){let d=r.emissiveFactor;o.emissive=new Pe().setRGB(d[0],d[1],d[2],Cn)}return r.emissiveTexture!==void 0&&a!==cn&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,xt)),Promise.all(c).then(function(){let d=new a(o);return r.name&&(d.name=r.name),Ui(d,r),t.associations.set(d,{materials:e}),r.extensions&&ar(s,d,r),d})}createUniqueName(e){let t=Lt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[ot.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Xg(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],u=g1(c),d=s[u];if(d)a.push(d.promise);else{let f;c.extensions&&c.extensions[ot.KHR_DRACO_MESH_COMPRESSION]?f=r(c):f=Xg(new Ht,c,t),c.mode===ni.TRIANGLE_STRIP?f=f.then(h=>Cf(h,So)):c.mode===ni.TRIANGLE_FAN&&(f=f.then(h=>Cf(h,jr))),s[u]={primitive:c,promise:f},a.push(f)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let u=a[l].material===void 0?f1(this.cache):this.getDependency("material",a[l].material);o.push(u)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){let c=l.slice(0,l.length-1),u=l[l.length-1],d=[];for(let h=0,m=u.length;h<m;h++){let x=u[h],p=a[h],g,y=c[h];if(p.mode===ni.TRIANGLES||p.mode===ni.TRIANGLE_STRIP||p.mode===ni.TRIANGLE_FAN||p.mode===void 0){let M=r.isSkinnedMesh===!0,_=x.hasAttribute("skinIndex")&&x.hasAttribute("skinWeight");M&&_===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),g=M&&_?new ka(x,y):new I(x,y),g.isSkinnedMesh===!0&&g.normalizeSkinWeights()}else if(p.mode===ni.LINES)g=new Ga(x,y);else if(p.mode===ni.LINE_STRIP)g=new qs(x,y);else if(p.mode===ni.LINE_LOOP)g=new Va(x,y);else if(p.mode===ni.POINTS)g=new Wa(x,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(g.geometry.morphAttributes).length>0&&m1(g,r),g.name=t.createUniqueName(r.name||"mesh_"+e),Ui(g,r),p.extensions&&ar(s,g,p),t.assignFinalMaterial(g),d.push(g)}for(let h=0,m=d.length;h<m;h++)t.associations.set(d[h],{meshes:e,primitives:h});if(d.length===1)return r.extensions&&ar(s,d[0],r),d[0];let f=new Ce;r.extensions&&ar(s,f,r),t.associations.set(f,{meshes:e});for(let h=0,m=d.length;h<m;h++)f.add(d[h]);return f})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new sn(wd.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new Ri(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Ui(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),a=s,o=[],l=[];for(let c=0,u=a.length;c<u;c++){let d=a[c];if(d){o.push(d);let f=new Xe;r!==null&&f.fromArray(r.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Ha(o,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],u=[];for(let d=0,f=s.channels.length;d<f;d++){let h=s.channels[d],m=s.samplers[h.sampler],x=h.target,p=x.node,g=s.parameters!==void 0?s.parameters[m.input]:m.input,y=s.parameters!==void 0?s.parameters[m.output]:m.output;x.node!==void 0&&(a.push(this.getDependency("node",p)),o.push(this.getDependency("accessor",g)),l.push(this.getDependency("accessor",y)),c.push(m),u.push(x))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(d){let f=d[0],h=d[1],m=d[2],x=d[3],p=d[4],g=[];for(let M=0,_=f.length;M<_;M++){let b=f[M],S=h[M],R=m[M],v=x[M],w=p[M];if(b===void 0)continue;b.updateMatrix&&b.updateMatrix();let A=n._createAnimationTracks(b,S,R,v,w);if(A)for(let L=0;L<A.length;L++)g.push(A[L])}let y=new Ja(r,void 0,g);return Ui(y,s),y})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,u=o.length;c<u;c++)a.push(n.getDependency("node",o[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){let u=c[0],d=c[1],f=c[2];f!==null&&u.traverse(function(h){h.isSkinnedMesh&&h.bind(f,y1)});for(let h=0,m=d.length;h<m;h++)u.add(d[h]);if(u.userData.pivot!==void 0&&d.length>0){let h=u.userData.pivot,m=d[0];u.pivot=new P().fromArray(h),u.position.x-=h[0],u.position.y-=h[1],u.position.z-=h[2],m.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let u;if(r.isBone===!0?u=new Or:c.length>1?u=new Ce:c.length===1?u=c[0]:u=new Dt,u!==c[0])for(let d=0,f=c.length;d<f;d++)u.add(c[d]);if(r.name&&(u.userData.name=r.name,u.name=a),Ui(u,r),r.extensions&&ar(n,u,r),r.matrix!==void 0){let d=new Xe;d.fromArray(r.matrix),u.applyMatrix4(d)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let d=s.associations.get(u);s.associations.set(u,{...d})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new Ce;n.name&&(r.name=s.createUniqueName(n.name)),Ui(r,n),n.extensions&&ar(t,r,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let u=0,d=l.length;u<d;u++){let f=l[u];f.parent!==null?r.add(Hg(f)):r.add(f)}let c=u=>{let d=new Map;for(let[f,h]of s.associations)(f instanceof Sn||f instanceof ln)&&d.set(f,h);return u.traverse(f=>{let h=s.associations.get(f);h!=null&&d.set(f,h)}),d};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let a=[],o=e.name?e.name:e.uuid,l=[];function c(h){h.morphTargetInfluences&&l.push(h.name?h.name:h.uuid)}Ps[r.path]===Ps.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let u;switch(Ps[r.path]){case Ps.weights:u=ji;break;case Ps.rotation:u=Ji;break;case Ps.translation:case Ps.scale:u=Ms;break;default:n.itemSize===1?u=ji:u=Ms;break}let d=s.interpolation!==void 0?d1[s.interpolation]:zs,f=this._getArrayFromAccessor(n);for(let h=0,m=l.length;h<m;h++){let x=new u(l[h]+"."+Ps[r.path],t.array,f,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),a.push(x)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=np(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof Ji?ep:Kh;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function _1(i,e,t){let n=e.attributes,s=new Wn;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new P(l[0],l[1],l[2]),new P(c[0],c[1],c[2])),o.normalized){let u=np(la[o.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let o=new P,l=new P;for(let c=0,u=r.length;c<u;c++){let d=r[c];if(d.POSITION!==void 0){let f=t.json.accessors[d.POSITION],h=f.min,m=f.max;if(h!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(h[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(h[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(h[2]),Math.abs(m[2]))),f.normalized){let x=np(la[f.componentType]);l.multiplyScalar(x)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;let a=new Un;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function Xg(i,e,t){let n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(let a in n){let o=tp[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){let a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return et.workingColorSpace!==Cn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${et.workingColorSpace}" not supported.`),Ui(i,e),_1(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?p1(i,e.targets,t):i})}var sp={commercial:[{name:"building-a",tris:1252,size:108936},{name:"building-b",tris:1276,size:106408},{name:"building-c",tris:1195,size:102788},{name:"building-d",tris:1100,size:95160},{name:"building-e",tris:1509,size:128208},{name:"building-f",tris:1794,size:148952},{name:"building-g",tris:2006,size:166356},{name:"building-h",tris:1512,size:127384},{name:"building-i",tris:2544,size:209728},{name:"building-j",tris:5246,size:440652},{name:"building-k",tris:2960,size:246976},{name:"building-l",tris:3512,size:290516},{name:"building-m",tris:3740,size:301004},{name:"building-n",tris:4350,size:341232},{name:"building-skyscraper-a",tris:1292,size:111336},{name:"building-skyscraper-b",tris:1592,size:138480},{name:"building-skyscraper-c",tris:1704,size:149524},{name:"building-skyscraper-d",tris:1892,size:167148},{name:"building-skyscraper-e",tris:1156,size:101880},{name:"detail-awning-wide",tris:40,size:5544},{name:"detail-awning",tris:40,size:5528},{name:"detail-overhang-wide",tris:64,size:6716},{name:"detail-overhang",tris:64,size:6704},{name:"detail-parasol-a",tris:96,size:10320},{name:"detail-parasol-b",tris:120,size:12120},{name:"low-detail-building-a",tris:188,size:14340},{name:"low-detail-building-b",tris:200,size:16336},{name:"low-detail-building-c",tris:142,size:12284},{name:"low-detail-building-d",tris:106,size:8716},{name:"low-detail-building-e",tris:96,size:8240},{name:"low-detail-building-f",tris:88,size:6932},{name:"low-detail-building-g",tris:200,size:16320},{name:"low-detail-building-h",tris:378,size:26812},{name:"low-detail-building-i",tris:152,size:11768},{name:"low-detail-building-j",tris:188,size:16404},{name:"low-detail-building-k",tris:86,size:7556},{name:"low-detail-building-l",tris:150,size:12128},{name:"low-detail-building-m",tris:188,size:15112},{name:"low-detail-building-n",tris:62,size:5904},{name:"low-detail-building-wide-a",tris:156,size:12736},{name:"low-detail-building-wide-b",tris:246,size:18736}],industrial:[{name:"building-a",tris:2046,size:177316},{name:"building-b",tris:2422,size:212040},{name:"building-c",tris:1928,size:175844},{name:"building-d",tris:1158,size:100768},{name:"building-e",tris:1484,size:129400},{name:"building-f",tris:1552,size:134916},{name:"building-g",tris:1242,size:106940},{name:"building-h",tris:698,size:63644},{name:"building-i",tris:798,size:73848},{name:"building-j",tris:886,size:80792},{name:"building-k",tris:702,size:65472},{name:"building-l",tris:1896,size:162424},{name:"building-m",tris:1694,size:138920},{name:"building-n",tris:1262,size:109256},{name:"building-o",tris:868,size:76552},{name:"building-p",tris:1162,size:103760},{name:"building-q",tris:2062,size:181248},{name:"building-r",tris:1912,size:173056},{name:"building-s",tris:876,size:81192},{name:"building-t",tris:1586,size:139896},{name:"chimney-basic",tris:88,size:9036},{name:"chimney-large",tris:218,size:20932},{name:"chimney-medium",tris:160,size:15020},{name:"chimney-small",tris:124,size:10536},{name:"detail-tank-large",tris:566,size:47452},{name:"detail-tank",tris:310,size:31436},{name:"shipping-container-a",tris:402,size:36624},{name:"shipping-container-b",tris:402,size:37052},{name:"shipping-container-c",tris:402,size:36620},{name:"solar-panel-flat",tris:164,size:13964},{name:"solar-panel-landscape-group",tris:976,size:81860},{name:"solar-panel-landscape",tris:244,size:21776},{name:"solar-panel-portrait-group",tris:976,size:81856},{name:"solar-panel-portrait",tris:244,size:21772},{name:"water-tower",tris:968,size:93836},{name:"windmill-low",tris:456,size:46296},{name:"windmill",tris:456,size:46292}],roads:[{name:"bridge-pillar-wide",tris:38,size:5488},{name:"bridge-pillar",tris:38,size:5468},{name:"construction-barrier",tris:60,size:7052},{name:"construction-cone",tris:66,size:7056},{name:"construction-fence",tris:136,size:14856},{name:"construction-light",tris:144,size:15320},{name:"dumpster",tris:234,size:24456},{name:"electricity-pole-single",tris:176,size:19480},{name:"electricity-pole-wide",tris:544,size:56732},{name:"electricity-pole",tris:416,size:43652},{name:"electricity-side-single",tris:176,size:19464},{name:"electricity-side-wide",tris:544,size:56732},{name:"electricity-side",tris:416,size:43652},{name:"electricity-wires-wide",tris:200,size:22240},{name:"electricity-wires",tris:72,size:8952},{name:"light-curved-cross",tris:270,size:24912},{name:"light-curved-double",tris:152,size:14208},{name:"light-curved",tris:92,size:9492},{name:"light-square-cross",tris:134,size:13512},{name:"light-square-double",tris:88,size:9216},{name:"light-square",tris:60,size:6996},{name:"road-bend-barrier",tris:128,size:11912},{name:"road-bend-sidewalk",tris:220,size:17024},{name:"road-bend-square-barrier",tris:48,size:5880},{name:"road-bend-square",tris:60,size:6268},{name:"road-bend",tris:260,size:20164},{name:"road-bridge",tris:240,size:24796},{name:"road-crossing",tris:104,size:8700},{name:"road-crossroad-barrier",tris:112,size:11256},{name:"road-crossroad-line",tris:108,size:9692},{name:"road-crossroad-path",tris:276,size:18708},{name:"road-crossroad",tris:116,size:10084},{name:"road-curve-barrier",tris:200,size:17920},{name:"road-curve-intersection-barrier",tris:166,size:15480},{name:"road-curve-intersection",tris:298,size:22788},{name:"road-curve-pavement",tris:220,size:17044},{name:"road-curve",tris:308,size:23912},{name:"road-driveway-double-barrier",tris:72,size:8460},{name:"road-driveway-double",tris:72,size:7664},{name:"road-driveway-single-barrier",tris:48,size:6272},{name:"road-driveway-single",tris:60,size:6568},{name:"road-end-barrier",tris:28,size:4028},{name:"road-end-round-barrier",tris:160,size:16328},{name:"road-end-round",tris:218,size:17532},{name:"road-end",tris:42,size:4940},{name:"road-intersection-barrier",tris:68,size:7676},{name:"road-intersection-line",tris:76,size:7492},{name:"road-intersection-path",tris:204,size:13736},{name:"road-intersection",tris:84,size:7900},{name:"road-roundabout-barrier",tris:754,size:61636},{name:"road-roundabout",tris:1636,size:105876},{name:"road-side-barrier",tris:24,size:4200},{name:"road-side-entry-barrier",tris:232,size:20276},{name:"road-side-entry",tris:306,size:24288},{name:"road-side-exit-barrier",tris:232,size:20272},{name:"road-side-exit",tris:306,size:24280},{name:"road-side",tris:44,size:5272},{name:"road-sign-empty-hanging",tris:112,size:12072},{name:"road-sign-empty",tris:42,size:5968},{name:"road-sign-object-stop",tris:62,size:6600},{name:"road-sign-object-street",tris:56,size:6648},{name:"road-sign-object-warning",tris:62,size:7384},{name:"road-sign-stop",tris:104,size:10720},{name:"road-sign-street",tris:154,size:15948},{name:"road-sign-warning",tris:104,size:11496},{name:"road-slant-barrier",tris:24,size:4052},{name:"road-slant-curve-barrier",tris:420,size:38824},{name:"road-slant-curve",tris:544,size:47880},{name:"road-slant-flat-curve",tris:648,size:55868},{name:"road-slant-flat-high",tris:44,size:5300},{name:"road-slant-flat",tris:44,size:5284},{name:"road-slant-high-barrier",tris:24,size:4068},{name:"road-slant-high",tris:44,size:5256},{name:"road-slant",tris:44,size:5240},{name:"road-split-barrier",tris:512,size:41340},{name:"road-split",tris:862,size:60128},{name:"road-square-barrier",tris:32,size:4048},{name:"road-square",tris:36,size:4436},{name:"road-straight-barrier-end",tris:16,size:3640},{name:"road-straight-barrier-half",tris:24,size:4092},{name:"road-straight-barrier",tris:24,size:4196},{name:"road-straight-half",tris:44,size:5264},{name:"road-straight",tris:44,size:5248},{name:"sign-highway-detailed",tris:256,size:23532},{name:"sign-highway-wide",tris:144,size:13968},{name:"sign-highway",tris:180,size:17288},{name:"tile-high",tris:12,size:2788},{name:"tile-low",tris:12,size:2800},{name:"tile-slant",tris:12,size:2820},{name:"tile-slantHigh",tris:12,size:2832},{name:"traffic-light-hanging",tris:230,size:22132},{name:"traffic-light-object-hanging",tris:114,size:10876},{name:"traffic-light-object-horizontal",tris:118,size:11664},{name:"traffic-light-object-vertical",tris:132,size:12408},{name:"traffic-light",tris:212,size:20344}]};var xi={_generated:"scripts/gen-polyhaven-manifest.cjs —— 请勿手改",source:"Poly Haven",license:"CC0 1.0 (Public Domain)",licenseUrl:"https://polyhaven.com/license",commercialUse:!0,attributionRequired:!1,units:"meter",groups:{detail:{note:"城中村 / 老城区标志性细节（贴在建筑上或摆在街边）",items:[{name:"fire-hydrant",file:"fire-hydrant.glb",w:.275,h:.799,d:.318},{name:"metal-gutter",file:"metal-gutter.glb",w:1.726,h:1.273,d:1.666},{name:"rollershutter-door",file:"rollershutter-door.glb",w:1.08,h:2.4,d:.3},{name:"rollershutter-window-1",file:"rollershutter-window-1.glb",w:2.1,h:1.851,d:.3},{name:"rollershutter-window-2",file:"rollershutter-window-2.glb",w:1.6,h:1.561,d:.168},{name:"rollershutter-window-3",file:"rollershutter-window-3.glb",w:.976,h:1.546,d:.153}]},structure:{note:"结构件（可攀附建筑、也可独立摆放）",items:[{name:"chainlink-fence",file:"chainlink-fence.glb",w:3.906,h:3.468,d:1.115},{name:"electricity-poles",file:"electricity-poles.glb",w:2.025,h:10.039,d:.852},{name:"fire-escape",file:"fire-escape.glb",w:4.894,h:6.466,d:1.657}]},road:{note:"道路 / 工地设施",items:[{name:"road-barrier",file:"road-barrier.glb",w:1.545,h:.831,d:.639},{name:"road-barrier-2",file:"road-barrier-2.glb",w:1.565,h:1.112,d:.442}]},facade:{note:"模块化建筑立面（可拼装成楼体）",items:[{name:"apartments-facade",file:"apartments-facade.glb",w:3.776,h:3.055,d:3.63},{name:"factory-facade",file:"factory-facade.glb",w:9.35,h:3.025,d:3.556}]}},hdri:{"day-clearsky":{note:"下午 · 晴"},"day-cloudy":{note:"上午 · 多云"},dusk:{note:"傍晚 · 暖"},night:{note:"夜间"}},textures:{"brick-wall":{file:"brick-wall.jpg"},"concrete-wall":{file:"concrete-wall.jpg"},paving:{file:"paving.jpg"}},counts:{models:13,groups:4,hdri:4,textures:3}};var rs={_generated:"scripts/ai-asset-pipeline.cjs —— 请勿手改",source:"腾讯混元 3D（Hunyuan3D）",units:"meter",note:"w/h/d 是**流水线处理后**的米制实测值，不是模型原始尺寸。AI 源在接入层 scale=1（尺寸已在流水线烘焙进顶点）。",groups:{hero:{note:"标志建筑（每地点 2~6 个，绝不铺满）",items:[{name:"qilou",group:"hero",file:"qilou.glb",raw:"qilou.glb",note:"岭南骑楼商铺 · 三层商住楼，底层内凹柱廊（真实 3 层 ≈ 10m）",target_h:10,w:7.263,h:9.998,d:6.475,faces:26910,bytes:1494528},{name:"old_apartment",group:"hero",file:"old_apartment.glb",raw:"old_apartment.glb",note:"老式居民楼 · 六层，满墙防盗网 + 空调外机（真实 6 层 ≈ 18m）",target_h:18,w:12.571,h:17.998,d:10.494,faces:40092,bytes:2330064},{name:"lingnan_temple",group:"hero",file:"lingnan_temple.glb",raw:"lingnan_temple.glb",note:"岭南庙宇/祠堂 · 镬耳山墙 + 硬山顶 + 石狮（单层殿堂 ≈ 7.5m）",target_h:7.5,w:10.713,h:7.492,d:9.356,faces:18298,bytes:991444}]},stall:{note:"市集摊位（贴人行道摆放）",items:[{name:"dapaidang",group:"stall",file:"dapaidang.glb",raw:"dapaidang.glb",note:"街边大排档 · 遮阳篷顶到地 ≈ 2.4m",target_h:2.4,w:2.88,h:2.397,d:2.625,faces:15656,bytes:785784},{name:"market_stall",group:"stall",file:"market_stall.glb",raw:"market_stall.glb",note:"菜市场蔬菜摊 · 防雨篷布顶 ≈ 2.3m",target_h:2.3,w:2.528,h:2.3,d:2.036,faces:13612,bytes:745236}]}},counts:{models:5,groups:2}};var S1="assets/",Go=S1;function Kg(i){typeof i=="string"&&i&&(Go=i.endsWith("/")?i:i+"/")}function E1(){return Go}var w1=["commercial","industrial","roads"],_n={KENNEY:"kenney",POLYHAVEN:"polyhaven",AI:"ai"},Yg={[_n.KENNEY]:"kenney",[_n.POLYHAVEN]:"polyhaven/models",[_n.AI]:"ai"},$g={[_n.KENNEY]:8,[_n.POLYHAVEN]:1,[_n.AI]:1};function T1(){return{...$g}}var R1={[_n.KENNEY]:".glb",[_n.POLYHAVEN]:".glb",[_n.AI]:".glb"},A1=8,C1={"roads/electricity-pole":11,"roads/light-square":9.5,"roads/light-square-double":9.5,"roads/light-curved":9.5,"roads/dumpster":5,"industrial/chimney-medium":7,"industrial/chimney-large":8,"industrial/water-tower":5.5,"industrial/shipping-container-a":1.9,"industrial/shipping-container-b":1.9,"industrial/shipping-container-c":1.9,"industrial/detail-tank":3.2,"industrial/detail-tank-large":4.4};function Zg(i,e,t,n){return typeof n=="number"?n:C1[`${e}/${t}`]||$g[i]||1}var Is={PENDING:"pending",READY:"ready",FAILED:"failed"};function rp(){let i=new qh,e=new Map,t={requested:0,ready:0,failed:0},n=new Set([_n.KENNEY,_n.POLYHAVEN,_n.AI]);function s(x,p){return n.has(x)?{source:x,kit:p}:{source:_n.KENNEY,kit:x,name:p}}let r=(x,p,g)=>`${x}/${p}/${g}`;function a(x,p,g){let y=r(x,p,g),M=e.get(y);return M||(M={state:Is.PENDING,proto:null,error:null,source:x,kit:p,name:g},e.set(y,M)),M}function o(x,p,g){return x===_n.POLYHAVEN?`${Go}${Yg[x]}/${p}/${p}.glb`:`${Go}${Yg[x]}/${p}/${g}${R1[x]}`}function l(x,p,g){let y=s(x,p),M=y.source,_=y.kit,b=y.name!==void 0?y.name:g,S=a(M,_,b);if(S.state===Is.READY)return Promise.resolve(S.proto);if(S.state===Is.FAILED)return Promise.resolve(null);if(S._inflight)return S._inflight;t.requested++;let R=o(M,_,b);return S._inflight=new Promise(v=>{i.load(R,w=>{S.state=Is.READY,S.proto=w.scene,t.ready++,v(S.proto)},void 0,w=>{S.state=Is.FAILED,S.error=w&&w.message||String(w),t.failed++,console.warn(`[assets] 载入失败 ${R}: ${S.error}`),v(null)})}),S._inflight}function c(x=[]){let p=[];for(let g of x)if(Array.isArray(g))p.push(l(g[0],g[1]));else if(typeof g=="string")for(let y of ap(g))p.push(l(g,y.name));return Promise.all(p).then(g=>g.filter(Boolean).length)}function u(x=[]){let p=Array.isArray(x)?x:[x],g=[];for(let y of p)g.push(l(_n.POLYHAVEN,y,y));return Promise.all(g).then(y=>y.filter(Boolean).length)}function d(x=[]){let p=Array.isArray(x[0])?x:[x],g=[];for(let y of p)Array.isArray(y)&&g.push(l(_n.AI,y[0],y[1]));return Promise.all(g).then(y=>y.filter(Boolean).length)}function f(x,p,g){let y=s(x,p),M=y.name!==void 0?y.name:g,_=e.get(r(y.source,y.kit,M));return _&&_.state===Is.READY?_.proto:null}function h(x,p,g,y){let M=s(x,p),_=M.source,b=M.kit,S=M.name!==void 0?M.name:g,R=(y!==void 0?y:M.name!==void 0?g:y)||{},v=f(_,b,S);if(!v)return null;let w=v.clone(!0);w.position.set(R.x||0,R.y||0,R.z||0),typeof R.rotY=="number"&&(w.rotation.y=R.rotY);let A=Zg(_,b,S,R.scale);return w.scale.setScalar(A),w.traverse(L=>{L.isMesh&&(L.castShadow=!0,L.receiveShadow=!0,L.userData.glbSourced=!0)}),w}function m(){let x={pending:0,ready:0,failed:0},p={kenney:0,polyhaven:0,ai:0},g=[];for(let[y,M]of e)x[M.state]++,M.source&&(p[M.source]=(p[M.source]||0)+1),M.state===Is.FAILED&&g.push({key:y,error:M.error});return{...t,byState:x,bySource:p,failures:g,cached:e.size}}return{load:l,warm:c,warmPolyHaven:u,warmAi:d,get:f,instance:h,report:m,cache:e,setBase(x){Kg(x)}}}function ap(i){return sp&&sp[i]||[]}function P1(i,e,t){let n=ap(i);if(!n.length)return[];let s=2166136261;for(let a=0;a<e.length;a++)s^=e.charCodeAt(a),s=Math.imul(s,16777619);let r=[];for(let a=0;a<t;a++)s=Math.imul(s^s>>>15,2246822507),s=Math.imul(s^s>>>13,3266489909),r.push(n[Math.abs(s)%n.length]);return r}function $h(i){return xi&&xi.groups&&xi.groups[i]&&xi.groups[i].items||[]}function I1(i,e){let t=xi&&xi.groups||{};for(let n of Object.keys(t)){let s=(t[n].items||[]).find(r=>r.name===e);if(s)return s}return null}function Zh(){let i=xi&&xi.groups||{},e=[];for(let t of Object.keys(i))e.push(...i[t].items||[]);return e}function op(){let i=xi&&xi.hdri||{};return Object.keys(i).map(e=>({name:e,...i[e]}))}function L1(i){return`${Go}polyhaven/hdri/${i}.hdr`}function D1(i){return rs&&rs.groups&&rs.groups[i]&&rs.groups[i].items||[]}function N1(i){let e=rs&&rs.groups||{};for(let t of Object.keys(e)){let n=(e[t].items||[]).find(s=>s.name===i);if(n)return n}return null}function U1(){let i=rs&&rs.groups||{},e=[];for(let t of Object.keys(i))e.push(...i[t].items||[]);return e}function F1(i){return[i.type,i.color?i.color.getHexString():"",i.emissive?i.emissive.getHexString():"",i.roughness,i.metalness,i.side,i.transparent?1:0,i.opacity,i.flatShading?1:0,i.map?i.map.uuid:"",i.map?`${i.map.repeat.x}x${i.map.repeat.y}`:"",i.alphaMap?i.alphaMap.uuid:""].join("|")}function O1(i){let e=i;for(;e;){if(e.userData&&e.userData.noMerge)return!0;e=e.parent}return!1}function B1(i){for(let e of Object.keys(i.attributes))e!=="position"&&e!=="normal"&&e!=="uv"&&i.deleteAttribute(e);for(let e of Object.keys(i.morphAttributes))delete i.morphAttributes[e];return i.morphTargetsRelative=!1,i}function jg(i){i.updateMatrixWorld(!0);let e=[];i.traverse(o=>{o.isMesh&&o.geometry&&o.geometry.attributes.position&&!O1(o)&&e.push(o)});let t=e.length;if(t<12)return{before:t,after:t,buckets:0};let n=new Map;for(let o of e){let l=F1(o.material),c=n.get(l);c||(c={mat:o.material,list:[]},n.set(l,c)),c.list.push(o)}let s=0,r=0;for(let{mat:o,list:l}of n.values()){if(l.length<3){s+=l.length;continue}let c=[],u=!0;for(let h of l)try{let m=h.geometry.index?h.geometry.toNonIndexed():h.geometry.clone();m.applyMatrix4(h.matrixWorld),c.push(B1(m))}catch{u=!1;break}if(!u){s+=l.length;continue}let d=null;try{d=kg(c,!1)}catch{d=null}if(!d){s+=l.length;continue}let f=new I(d,o);f.castShadow=!0,f.receiveShadow=!0,f.frustumCulled=!0,i.add(f),r++;for(let h of l)h.parent&&h.parent.remove(h);s+=1}let a=[];i.traverse(o=>{o!==i&&(o.isGroup||o.isObject3D)&&!o.isMesh&&o.children.length===0&&a.push(o)});for(let o of a)o.parent&&o.parent.remove(o);return{before:t,after:s,buckets:r}}function lp(i){let e=0,t=0;return i.traverse(n=>{if(!n.isMesh)return;e++;let s=n.geometry;if(!s)return;let r=s.index?s.index.count:s.attributes.position.count;t+=r/3}),{meshes:e,tris:Math.round(t)}}var jh=class{constructor(e,t,n){this.colliders=t,this.radius=.34,this.speed=3.1,this.runSpeed=5.6,this.moving=!1,this.phase=0,this.bounds={minX:-26,maxX:26,minZ:-24,maxZ:24};let s=new Ce,r=new he({color:3883080,roughness:.92}),a=new he({color:11571312,roughness:.85}),o=new he({color:2566959,roughness:.9}),l=new I(new Xn(.23,.42,6,12),r);l.position.y=.86,l.castShadow=!0,s.add(l);let c=new I(new mn(.163,16,12),a);c.position.y=1.34,c.castShadow=!0,s.add(c);let u=new I(new mn(.168,16,12,0,Math.PI*2,0,Math.PI*.55),o);u.position.y=1.355,s.add(u),this.legs=[];for(let f of[-.105,.105]){let h=new I(new Xn(.078,.44,4,8),o);h.position.set(f,.3,0),h.castShadow=!0,s.add(h),this.legs.push(h)}this.arms=[];for(let f of[-.3,.3]){let h=new I(new Xn(.062,.38,4,8),r);h.position.set(f,.9,0),h.castShadow=!0,s.add(h),this.arms.push(h)}let d=new I(new se(.3,.36,.16),new he({color:4865846,roughness:.95}));d.position.set(0,.86,-.24),s.add(d),s.position.copy(n),e.add(s),this.mesh=s,this.pos=s.position,this.facing=Math.PI}update(e,t,n){let s=0,r=0;(t.has("KeyW")||t.has("ArrowUp"))&&(r-=1),(t.has("KeyS")||t.has("ArrowDown"))&&(r+=1),(t.has("KeyA")||t.has("ArrowLeft"))&&(s-=1),(t.has("KeyD")||t.has("ArrowRight"))&&(s+=1);let a=t.has("ShiftLeft")||t.has("ShiftRight"),o=a?this.runSpeed:this.speed;if(this.moving=s!==0||r!==0,this.moving){let c=Math.hypot(s,r);s/=c,r/=c;let u=Math.cos(n),d=Math.sin(n),f=s*u+r*d,h=-s*d+r*u;this.pos.x+=f*o*e,this.pos.z+=h*o*e;let x=Math.atan2(f,h)-this.facing;for(;x>Math.PI;)x-=Math.PI*2;for(;x<-Math.PI;)x+=Math.PI*2;this.facing+=x*Math.min(1,e*12),this.phase+=e*(a?13:8.5)}else this.phase+=e*1.6;this.resolveCollisions();let l=this.moving?a?.85:.6:.06;this.legs[0].rotation.x=Math.sin(this.phase)*l,this.legs[1].rotation.x=-Math.sin(this.phase)*l,this.arms[0].rotation.x=-Math.sin(this.phase)*l*.7,this.arms[1].rotation.x=Math.sin(this.phase)*l*.7,this.mesh.position.y=this.moving?Math.abs(Math.sin(this.phase))*.035:0,this.mesh.rotation.y=this.facing}resolveCollisions(){let e=this.radius;for(let n of this.colliders){let s=Math.max(n.minX,Math.min(this.pos.x,n.maxX)),r=Math.max(n.minZ,Math.min(this.pos.z,n.maxZ)),a=this.pos.x-s,o=this.pos.z-r,l=a*a+o*o;if(l>=e*e)continue;if(l<1e-6){let d=Math.abs(this.pos.x-n.minX),f=Math.abs(n.maxX-this.pos.x),h=Math.abs(this.pos.z-n.minZ),m=Math.abs(n.maxZ-this.pos.z),x=Math.min(d,f,h,m);x===d?this.pos.x=n.minX-e:x===f?this.pos.x=n.maxX+e:x===h?this.pos.z=n.minZ-e:this.pos.z=n.maxZ+e;continue}let c=Math.sqrt(l),u=(e-c)/c;this.pos.x+=a*u,this.pos.z+=o*u}let t=this.bounds;this.pos.x=Math.max(t.minX,Math.min(t.maxX,this.pos.x)),this.pos.z=Math.max(t.minZ,Math.min(t.maxZ,this.pos.z))}setWorld({colliders:e,spawn:t,bounds:n}){this.colliders=e||[],t&&this.pos.set(t.x,0,t.z),n&&(this.bounds=n),this.moving=!1,this.phase=0}},Jh=class{constructor(e,t,n){this.camera=e,this.colliders=n||[],this.yaw=.38,this.pitch=.76,this.dist=18,this.minH=5.5,this.cur=new P().copy(t),this.apply(this.cur)}clearance(e,t,n,s,r){let a=r;for(let o of this.colliders){let l=k1(e,t,n,s,o);l!==null&&l<a&&(a=l)}return Math.max(this.minH,a-.7)}penetration(e,t){let s=0;for(let r of this.colliders)if(e>r.minX-.9&&e<r.maxX+.9&&t>r.minZ-.9&&t<r.maxZ+.9){let a=e-(r.minX-.9),o=r.maxX+.9-e,l=t-(r.minZ-.9),c=r.maxZ+.9-t;s=Math.max(s,Math.min(a,o,l,c))}return s}apply(e){let t=Math.cos(this.pitch),n=Math.sin(this.pitch),s=Math.sin(this.yaw),r=Math.cos(this.yaw),a=this.dist*t,o=Math.min(a,this.clearance(e.x,e.z,s,r,a));for(let c=0;c<10;c++){let u=this.penetration(e.x+s*o,e.z+r*o);if(u<=0)break;let d=o-(u+.5);if(d<=this.minH){o=this.minH;break}o=d}let l=o/Math.max(t,.15);this.camera.position.set(e.x+s*o,e.y+l*n,e.z+r*o),this.camera.lookAt(e.x,e.y+.9,e.z)}update(e,t){this.cur.lerp(t,Math.min(1,e*6.5)),this.apply(this.cur)}setWorld({colliders:e,target:t,yaw:n,pitch:s,dist:r,minH:a}={}){this.colliders=e||[],n!=null&&(this.yaw=n),s!=null&&(this.pitch=s),r!=null&&(this.dist=r),a!=null&&(this.minH=a),t&&this.cur.copy(t),this.apply(this.cur)}zoom(e){this.dist=Math.max(9,Math.min(32,this.dist+e))}};function k1(i,e,t,n,s){let r=0,a=1/0;if(Math.abs(t)<1e-8){if(i<s.minX||i>s.maxX)return null}else{let o=(s.minX-i)/t,l=(s.maxX-i)/t;if(o>l){let c=o;o=l,l=c}r=Math.max(r,o),a=Math.min(a,l)}if(Math.abs(n)<1e-8){if(e<s.minZ||e>s.maxZ)return null}else{let o=(s.minZ-e)/n,l=(s.maxZ-e)/n;if(o>l){let c=o;o=l,l=c}r=Math.max(r,o),a=Math.min(a,l)}return a<r||a<0?null:r>0?r:0}var Fi=new Map,as=new Map,up=0,os=0;function Kn(i,e,t){let n=i.get(e);return n||(n=t(),i.set(e,n)),n}var or={get textures(){return Fi.size},get materials(){return as.size},get texturesBuilt(){return up},get materialsBuilt(){return os},carUvRemapped:!1,carUvFaces:0,carUvRects:null};typeof window<"u"&&(window.__charSkinDebug=or);function Ns(i,e=i){let t=document.createElement("canvas");return t.width=i,t.height=e,t}var cp=null;function H1(){if(cp)return cp;let i=256,e=Ns(i,i),t=e.getContext("2d"),n=t.createImageData(i,i),s=n.data;for(let r=0;r<s.length;r+=4){let a=128+(Math.random()-.5)*255;s[r]=s[r+1]=s[r+2]=a,s[r+3]=255}return t.putImageData(n,0,0),cp=e,e}function Wo(i,e,t,n){n<=0||(i.save(),i.globalAlpha=Math.min(.8,n/70),i.globalCompositeOperation="overlay",i.fillStyle=i.createPattern(H1(),"repeat"),i.fillRect(0,0,e,t),i.restore())}var hp={};function z1(i){if(hp[i])return hp[i];let e=8,t=Ns(e,e),n=t.getContext("2d");if(n.fillStyle="#ffffff",n.fillRect(0,0,e,e),n.strokeStyle="rgba(0,0,0,0.26)",n.lineWidth=1,i==="twill")for(let s=-e;s<e*2;s+=3)n.beginPath(),n.moveTo(s,0),n.lineTo(s+e,e),n.stroke();else if(i==="canvas")for(let s=0;s<e;s+=2)n.beginPath(),n.moveTo(0,s+.5),n.lineTo(e,s+.5),n.stroke(),n.beginPath(),n.moveTo(s+.5,0),n.lineTo(s+.5,e),n.stroke();else{n.fillStyle="rgba(0,0,0,0.24)";for(let s=0;s<e;s+=2)for(let r=s/2%2*1;r<e;r+=2)n.fillRect(r,s,1,1)}return hp[i]=t,t}function dp(i,e,t,n,s=1,r=1,a=.6){i.save(),i.globalAlpha=a,i.scale(s,r),i.fillStyle=i.createPattern(z1(n),"repeat"),i.fillRect(0,0,e/s,t/r),i.restore()}function Jg(i,e,t){for(let n of[-e,0,e])i.save(),i.translate(n,0),t(),i.restore()}function Ds(i,e,t,n,s,r="rgba(0,0,0,0.34)",a=1.4,o=3,l=2.6){i.save(),i.strokeStyle=r,i.lineWidth=a,i.lineCap="butt",i.setLineDash([o,l]),i.beginPath(),i.moveTo(e,t),i.lineTo(n,s),i.stroke(),i.restore()}function lr(i,e,t,n,s,r=1){let a=i.createRadialGradient(e,t,n*.12,e,t,n);a.addColorStop(0,s),a.addColorStop(1,s.replace(/[\d.]+\)$/,"0)")),i.save(),i.translate(e,t),i.scale(1,r),i.translate(-e,-t),i.fillStyle=a,i.beginPath(),i.arc(e,t,n,0,Math.PI*2),i.fill(),i.restore()}function G1(i,e,t,n,s,r){i.save(),i.globalCompositeOperation="lighter",i.fillStyle=`rgba(255,255,255,${r})`,i.fillRect(e,t,n,s),i.restore()}function Vo(i,e,t,n,s,r){for(let a=0;a<n;a++){let[o,l]=r?r(e,t):[Math.random()*e,Math.random()*t];lr(i,o,l,8+Math.random()*26,`rgba(86,70,52,${s*(.35+Math.random()*.65)})`,.7)}}var V1=256,W1=256,Qg=.911,ex=.56,tu=["tee","tee","shirt","tee","jacket","tee","shirt","tee"];function X1(i){let e=V1,t=W1,n=Ns(e,t),s=n.getContext("2d");s.fillStyle="#ffffff",s.fillRect(0,0,e,t);let r=p=>p/Qg*e,a=p=>p*e,o=p=>p/ex*t,l=p=>p*t;dp(s,e,t,i==="jacket"?"canvas":"knit",1,1.63,.72);let c=s.createLinearGradient(0,0,0,o(.06));c.addColorStop(0,"rgba(0,0,0,0.15)"),c.addColorStop(1,"rgba(0,0,0,0)"),s.fillStyle=c,s.fillRect(0,0,e,o(.06));let u=i==="jacket"?.055:.072,d=.024,f=p=>d+(u-d)*(1-Math.cos(p*Math.PI*2))/2,h=72,m=()=>{s.beginPath(),s.moveTo(0,0);for(let p=0;p<=h;p++){let g=p/h;s.lineTo(g*e,o(f(g)))}s.lineTo(e,0),s.closePath()};m(),s.fillStyle="rgba(0,0,0,0.20)",s.fill(),m(),s.strokeStyle="rgba(0,0,0,0.40)",s.lineWidth=2.4,s.stroke();for(let p of[-1,1]){let g=a(.5+p*.1),y=a(.5+p*.22);Ds(s,g,o(f(.5+p*.1)),y,o(.055),"rgba(0,0,0,0.26)",1.5,3,2.4)}for(let p of[.25,.75])lr(s,a(p),o(.22),r(.055),"rgba(0,0,0,0.10)",2.2);if(i==="shirt"||i==="jacket"){let p=a(.5),g=o(u+.02),y=l(i==="jacket"?.97:.95);if(s.save(),s.strokeStyle="rgba(0,0,0,0.20)",s.lineWidth=5,s.beginPath(),s.moveTo(p,g),s.lineTo(p,y),s.stroke(),Ds(s,p-3.5,g,p-3.5,y,"rgba(0,0,0,0.26)",1.3,3,2.6),Ds(s,p+3.5,g,p+3.5,y,"rgba(0,0,0,0.26)",1.3,3,2.6),s.restore(),i==="shirt")for(let _=1;_<=5;_++){let b=g+(y-g)*(_/6);s.fillStyle="rgba(0,0,0,0.42)",s.beginPath(),s.arc(p,b,2.6,0,Math.PI*2),s.fill()}else{s.strokeStyle="rgba(0,0,0,0.30)",s.lineWidth=1.6;for(let M=g;M<y;M+=5)s.beginPath(),s.moveTo(p-2.4,M),s.lineTo(p+2.4,M),s.stroke()}}if(i==="tee"){let p=a(.5),g=o(.29),y=r(.135),M=o(.16);s.save(),s.globalAlpha=.42,s.fillStyle="#000000",s.fillRect(p-y/2,g-M/2,y,M*.06),s.fillRect(p-y/2,g+M/2-M*.06,y,M*.06),[.86,.62,.74].forEach((b,S)=>{let R=g-M*.24+S*M*.24;s.fillRect(p-y*b/2,R,y*b,M*.15)}),s.restore(),s.save(),s.globalCompositeOperation="destination-out";for(let b=0;b<60;b++)s.globalAlpha=.25+Math.random()*.5,s.beginPath(),s.arc(p+(Math.random()-.5)*y,g+(Math.random()-.5)*M,.6+Math.random()*1.8,0,Math.PI*2),s.fill();s.restore()}let x=l(i==="jacket"?.955:.945);return c=s.createLinearGradient(0,x-o(.03),0,t),c.addColorStop(0,"rgba(0,0,0,0)"),c.addColorStop(1,"rgba(0,0,0,0.30)"),s.fillStyle=c,s.fillRect(0,x-o(.03),e,t-x+o(.03)),Jg(s,e,()=>{Ds(s,0,x,e,x,"rgba(0,0,0,0.30)",1.5,3.2,2.4)}),Vo(s,e,t,12,.16,(p,g)=>[Math.random()*p,g*(.72+Math.random()*.28)]),Vo(s,e,t,8,.1,(p,g)=>[Math.random()*p,Math.random()*g]),Wo(s,e,t,16),ca(n,`${i}`)}var q1=128,Y1=128,K1=.27,tx=.506;function $1(){let i=q1,e=Y1,t=Ns(i,e),n=t.getContext("2d");n.fillStyle="#ffffff",n.fillRect(0,0,i,e);let s=l=>l/tx*e,r=l=>l*e;dp(n,i,e,"knit",1,1.87,.72);let a=n.createLinearGradient(0,0,0,s(.12));a.addColorStop(0,"rgba(0,0,0,0.24)"),a.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=a,n.fillRect(0,0,i,s(.12));let o=s(.2);return a=n.createLinearGradient(0,o-s(.02),0,o+s(.02)),a.addColorStop(0,"rgba(0,0,0,0)"),a.addColorStop(.5,"rgba(0,0,0,0.34)"),a.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=a,n.fillRect(0,o-s(.02),i,s(.04)),Ds(n,0,o,i,o,"rgba(0,0,0,0.30)",1.4,3,2.4),Ds(n,.7,r(.05),.7,r(.95),"rgba(0,0,0,0.20)",1.2,3,2.6),Vo(n,i,e,8,.14,(l,c)=>[Math.random()*l,c*(.45+Math.random()*.55)]),Wo(n,i,e,14),ca(t,"sleeve")}var Z1=256,j1=256,nx=.452,ix=.764;function J1(){let i=Z1,e=j1,t=Ns(i,e),n=t.getContext("2d");n.fillStyle="#ffffff",n.fillRect(0,0,i,e);let s=g=>g/nx*i,r=g=>g/ix*e,a=g=>g*i,o=g=>g*e;dp(n,i,e,"twill",1,1.69,.76);for(let g of[.25,.75])Ds(n,a(g),o(.03),a(g),o(.92),"rgba(0,0,0,0.32)",1.8,3.4,2.6);Jg(n,i,()=>{for(let g of[-1,1])n.save(),n.strokeStyle="rgba(0,0,0,0.26)",n.lineWidth=1.6,n.beginPath(),n.moveTo(a(.5)+g*s(.012),r(.1)),n.lineTo(a(.5)+g*s(.075),r(.045)),n.stroke(),n.restore()});let l=a(.5)-s(.055),c=a(.5)+s(.055),u=r(.11),d=r(.235);n.save(),n.fillStyle="rgba(0,0,0,0.10)",n.fillRect(l,u,c-l,d-u),n.strokeStyle="rgba(0,0,0,0.30)",n.lineWidth=1.6,n.strokeRect(l,u,c-l,d-u),n.restore();let f=r(.47),h=r(.67);n.save(),n.globalCompositeOperation="lighter";let m=n.createLinearGradient(0,f,0,h);m.addColorStop(0,"rgba(255,255,255,0)"),m.addColorStop(.45,"rgba(255,255,255,0.22)"),m.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=m,n.fillRect(0,f,i,h-f);let x=n.createLinearGradient(a(.32),0,a(.68),0);x.addColorStop(0,"rgba(0,0,0,0)"),x.addColorStop(.5,"rgba(0,0,0,0.34)"),x.addColorStop(1,"rgba(0,0,0,0)"),n.globalCompositeOperation="multiply",n.fillStyle=x,n.fillRect(a(.32),f,a(.36),h-f),n.restore();let p=o(.885);return G1(n,0,p,i,e-p,.07),n.fillStyle="rgba(0,0,0,0.22)",n.fillRect(0,p,i,r(.01)),Ds(n,0,o(.925),i,o(.925),"rgba(0,0,0,0.30)",1.4,3,2.4),Vo(n,i,e,14,.2,(g,y)=>[Math.random()*g,y*(.8+Math.random()*.2)]),Vo(n,i,e,8,.1,(g,y)=>[Math.random()*g,y*(.4+Math.random()*.45)]),Wo(n,i,e,18),ca(t,"pants")}function Q1(){let e=Ns(128),t=e.getContext("2d");t.fillStyle="#ffffff",t.fillRect(0,0,128,128);for(let n=0;n<26;n++)lr(t,Math.random()*128,Math.random()*128,6+Math.random()*16,`rgba(120,96,78,${.03+Math.random()*.05})`,.8);for(let n=0;n<14;n++)lr(t,Math.random()*128,Math.random()*128,5+Math.random()*12,`rgba(255,255,255,${.1+Math.random()*.14})`,.8);return Wo(t,128,128,10),ca(e,"skin")}function eE(){let e=Ns(128),t=e.getContext("2d");t.fillStyle="#ffffff",t.fillRect(0,0,128,128);for(let n=0;n<4200;n++){let s=Math.random()*128,r=Math.random()*128,a=1.4+Math.random()*2.8,o=-Math.PI/2+(Math.random()-.5)*1.4,l=Math.random();t.strokeStyle=l>.5?`rgba(255,255,255,${.14+Math.random()*.2})`:`rgba(58,46,34,${.06+Math.random()*.13})`,t.lineWidth=.6+Math.random()*.6,t.beginPath(),t.moveTo(s,r),t.lineTo(s+Math.sin(o)*a,r+Math.cos(o)*a),t.stroke()}for(let n=0;n<4;n++)lr(t,Math.random()*128,Math.random()*128,6+Math.random()*9,`rgba(70,56,42,${.02+Math.random()*.03})`,1);return Wo(t,128,128,14),ca(e,"fur")}var Qh=1024,eu=256,Ls={px:[0,0,512,80],nx:[0,0,512,80],py:[0,186,256,250],ny:[256,186,512,250],pz:[0,88,256,178],nz:[256,88,512,178]};function tE(){let i=Ns(Qh,eu),e=i.getContext("2d");e.fillStyle="#ffffff",e.fillRect(0,0,Qh,eu);let[t,n,s,r]=Ls.px,a=s-t,o=r-n;e.save(),e.beginPath(),e.rect(t,n,a,o),e.clip();let l=e.createLinearGradient(0,n+o*.72,0,r);l.addColorStop(0,"rgba(0,0,0,0)"),l.addColorStop(1,"rgba(0,0,0,0.42)"),e.fillStyle=l,e.fillRect(t,n+o*.72,a,o*.28),e.fillStyle="rgba(0,0,0,0.18)",e.fillRect(t,n+o*.4,a,1.6),e.fillStyle="rgba(255,255,255,0.22)",e.fillRect(t,n+o*.4+1.6,a,1.6);for(let y of[.16,.52,.88]){let M=t+a*y;e.fillStyle="rgba(0,0,0,0.34)",e.fillRect(M-1,n+o*.1,2,o*.78)}for(let y of[.235,.6])e.fillStyle="rgba(0,0,0,0.30)",e.fillRect(t+a*y-7,n+o*.3,14,3.2);for(let y of[.165,.835])lr(e,t+a*y,r-2,o*.62,"rgba(0,0,0,0.30)",.6);e.restore();let c=(y,M)=>{let[_,b,S,R]=y,v=S-_,w=R-b;e.save(),e.beginPath(),e.rect(_,b,v,w),e.clip();let A=e.createLinearGradient(0,b+w*.7,0,R);if(A.addColorStop(0,"rgba(0,0,0,0)"),A.addColorStop(1,"rgba(0,0,0,0.40)"),e.fillStyle=A,e.fillRect(_,b+w*.7,v,w*.3),M)e.fillStyle="rgba(0,0,0,0.28)",e.fillRect(_+v*.08,b+w*.3,v*.84,1.8);else{let L=_+v*.3,D=v*.4,H=b+w*.46,N=w*.3;e.fillStyle="rgba(0,0,0,0.34)",e.fillRect(L,H,D,N),e.fillStyle="rgba(255,255,255,0.16)";for(let z=1;z<4;z++)e.fillRect(L,H+N*z/4,D,1.4)}e.strokeStyle="rgba(0,0,0,0.34)",e.lineWidth=2,e.strokeRect(_+v*.4,b+w*.6,v*.2,w*.24),e.fillStyle="rgba(0,0,0,0.16)",e.fillRect(_+v*.4,b+w*.6,v*.2,w*.24),e.restore()};c(Ls.pz,!1),c(Ls.nz,!0);let[u,d,f,h]=Ls.py;e.save(),e.beginPath(),e.rect(u,d,f-u,h-d),e.clip(),lr(e,u+(f-u)*.5,d+(h-d)*.5,(f-u)*.7,"rgba(0,0,0,0.06)",1),e.restore();let[m,x,p,g]=Ls.ny;return e.fillStyle="rgba(0,0,0,0.55)",e.fillRect(m,x,p-m,g-x),ca(i,"carAtlas")}function ca(i,e){let t=new pn(i);return t.colorSpace=xt,t.wrapS=t.wrapT=on,t.anisotropy=4,t.name="charskin:"+e,up++,t}var nE=i=>"#"+(i>>>0).toString(16).padStart(6,"0");function nu(i,e){return Kn(as,`top|${i}|${e}`,()=>(os++,new he({map:Kn(Fi,`top|${i}`,()=>X1(i)),color:e,roughness:.92})))}function iu(i){return Kn(as,`slv|${i}`,()=>(os++,new he({map:Kn(Fi,"sleeve",$1),color:i,roughness:.92})))}function su(i){return Kn(as,`pnt|${i}`,()=>(os++,new he({map:Kn(Fi,"pants",J1),color:i,roughness:.93})))}function ru(i){return Kn(as,`skin|${i}`,()=>(os++,new he({map:Kn(Fi,"skin",Q1),color:i,roughness:.78})))}function au(i){return Kn(as,`hair|${i}`,()=>(os++,new he({color:i,roughness:.9})))}function ou(i){return Kn(as,`car|${i}`,()=>(os++,new he({map:Kn(Fi,"carAtlas",tE),color:i,roughness:.42,metalness:.32})))}function lu(i){if(!i||!i.attributes||!i.attributes.uv||i.userData.__carUvDone)return i;let e=i.attributes.uv,t=["px","nx","py","ny","pz","nz"],n={};for(let s=0;s<6;s++){let r=Ls[t[s]];if(!r)continue;let[a,o,l,c]=r,u=a/Qh,d=l/Qh,f=1-o/eu,h=1-c/eu;for(let m=0;m<4;m++){let x=s*4+m;if(x>=e.count)continue;let p=e.getX(x),g=e.getY(x);e.setXY(x,u+p*(d-u),f+g*(h-f))}n[t[s]]=[u,f,d,h]}return e.needsUpdate=!0,i.userData.__carUvDone=!0,or.carUvRemapped=!0,or.carUvFaces=6,or.carUvRects=n,i}function Xo(i){return Kn(as,`fur|${i}`,()=>(os++,new he({map:Kn(Fi,"fur",eE),color:i,roughness:.93})))}function sx(){return{textures:Fi.size,materials:as.size,texturesBuilt:up,materialsBuilt:os,carUvRemapped:or.carUvRemapped,carUvFaces:or.carUvFaces,carUvRects:or.carUvRects,keys:[...Fi.keys()],sizes:Object.fromEntries([...Fi.entries()].map(([i,e])=>[i,[e.image.width,e.image.height]])),geom:{TORSO_C:Qg,TORSO_H:ex,ARM_C:K1,ARM_H:tx,LEG_C:nx,LEG_H:ix},hexOf:nE}}var Ve={head:null,torso:null,neck:null,arm:null,leg:null,hand:null,foot:null,nose:null,hairCap:null,carBody:null,carRoof:null,wheel:null,dogBody:null,dogHead:null,catBody:null,catHead:null,tail:null,birdBody:null,wing:null,insect:null};function sE(){Ve.head||(Ve.head=new mn(.105,20,14),Ve.torso=new qe(.155,.135,.56,16,1,!1,Math.PI),Ve.neck=new qe(.045,.05,.09,7),Ve.arm=new Xn(.043,.42,4,7),Ve.leg=new Xn(.072,.62,4,8),Ve.hand=new mn(.05,8,6),Ve.foot=new se(.105,.055,.225),Ve.nose=new $i(.021,.05,6),Ve.hairCap=new mn(.112,18,10,Math.PI/2+.85,Math.PI*2-1.7,0,Math.PI*.62),Ve.carBody=new se(1.78,.62,4.05),lu(Ve.carBody),Ve.carRoof=new se(1.62,.55,2.15),Ve.wheel=new qe(.31,.31,.2,12),Ve.dogBody=new Xn(.145,.34,4,8),Ve.dogHead=new se(.16,.15,.24),Ve.catBody=new Xn(.105,.26,4,8),Ve.catHead=new mn(.085,10,8),Ve.tail=new Xn(.022,.24,3,6),Ve.birdBody=new mn(.075,9,7),Ve.wing=new se(.19,.016,.09),Ve.insect=new mn(.012,6,5))}var $t={};function rE(){$t.dark||($t.dark=new he({color:2830132,roughness:.85}),$t.metal=new he({color:9080984,roughness:.45,metalness:.55}),$t.glass=new he({color:2767432,roughness:.22,metalness:.35}),$t.lamp=new he({color:15786160,roughness:.35,emissive:2103296}),$t.lampBrake=new he({color:13647920,roughness:.4,emissive:5246984}),$t.birdBody=new he({color:4867648,roughness:.85}),$t.insect=new he({color:2237994,roughness:.6}),$t.tailDark=new he({color:2762274,roughness:.9}))}var cu=512,qo=256,gp=.105,bp=1.6,fp=[],xp=i=>Math.max(-1,Math.min(1,i));function ls(i){return Math.acos(xp((i-bp)/gp))/Math.PI*qo}function Hn(i,e){let t=Math.acos(xp((e-bp)/gp)),n=Math.max(1e-6,Math.sin(t));return Math.acos(xp(-i/(gp*n)))/(Math.PI*2)*cu}function Sp(i){let e=((i|0)%4+4)%4;if(fp[e])return fp[e];let t=document.createElement("canvas");t.width=cu,t.height=qo;let n=t.getContext("2d");n.fillStyle="#ffffff",n.fillRect(0,0,cu,qo);let s=.04,r=1.622,a=1.652,o=1.587,l=1.556,c=[13,15,11,14][e],u=[7.5,6.5,8.5,7][e],d=[0,-2.5,1.5,-4][e],f=[5,6.5,4,5.5][e];for(let M of[-1,1]){let _=Hn(M*s,r),b=ls(r),S=n.createRadialGradient(_,b,1,_,b,17);S.addColorStop(0,"rgba(96,76,64,0.50)"),S.addColorStop(1,"rgba(96,76,64,0)"),n.fillStyle=S,n.beginPath(),n.arc(_,b,17,0,Math.PI*2),n.fill()}n.strokeStyle="#4a4038",n.lineCap="round";for(let M of[-1,1]){let _=Hn(M*.014,a),b=Hn(M*.07,a),S=ls(a)+d+1.5,R=ls(a)+d-1.5;n.lineWidth=f,n.beginPath(),n.moveTo(_,S),n.quadraticCurveTo((_+b)/2,Math.min(S,R)-3.5,b,R+2),n.stroke()}for(let M of[-1,1]){let _=Hn(M*s,r),b=ls(r);n.fillStyle="#332c28",n.beginPath(),n.ellipse(_,b,c,u,0,0,Math.PI*2),n.fill(),n.fillStyle="rgba(255,255,255,0.72)",n.beginPath(),n.arc(_+M*-2.5,b-2.4,1.7,0,Math.PI*2),n.fill(),n.strokeStyle="rgba(46,38,34,0.85)",n.lineWidth=2.2,n.beginPath(),n.moveTo(_-c,b-1),n.quadraticCurveTo(_,b-u-3.2,_+c,b-1),n.stroke()}let h=ls(o);n.fillStyle="rgba(120,96,80,0.30)",n.beginPath(),n.ellipse(Hn(0,o),h+4,11,9,0,0,Math.PI*2),n.fill(),n.fillStyle="rgba(70,56,48,0.72)";for(let M of[-1,1])n.beginPath(),n.ellipse(Hn(M*.0135,1.573),ls(1.573),2.1,1.7,0,0,Math.PI*2),n.fill();let m=ls(l),x=[20,22,17,21][e],p=[2,1,5,-4][e];n.strokeStyle="#8a5a52",n.lineWidth=3.4,n.beginPath(),n.moveTo(Hn(-.021,l),m),n.quadraticCurveTo(Hn(0,l),m+p,Hn(.021,l),m),n.stroke(),n.strokeStyle="rgba(255,255,255,0.34)",n.lineWidth=1.6,n.beginPath(),n.moveTo(Hn(-.017,l),m+3.4),n.quadraticCurveTo(Hn(0,l),m+p+3.4,Hn(.017,l),m+3.4),n.stroke();let g=n.createLinearGradient(0,0,0,qo);g.addColorStop(0,"rgba(255,255,255,0)"),g.addColorStop(.75,"rgba(150,120,100,0.10)"),g.addColorStop(1,"rgba(120,95,80,0.16)"),n.fillStyle=g,n.fillRect(0,0,cu,qo);let y=new pn(t);return y.colorSpace=xt,y.wrapS=jt,y.wrapT=jt,fp[e]=y,y}var pp=[13148282,12095600,14201996,11042912,14465942],rx=[2236446,3812386,1315087,5916210,7234137],mp=[3883080,5917250,4215114,7027252,3820122,9077368,4865874,3095108],ax=[2566959,3095108,3815994,4866616,2040873],ox={};function aE(i){let e=ox[i];if(e)return e;let t=40,n=10,s=9,r=document.createElement("canvas"),a=r.getContext("2d"),o="500 "+t+'px "PingFang SC","Microsoft YaHei",sans-serif';a.font=o;let l=Math.ceil(a.measureText(i).width);r.width=Math.max(56,l+n*2),r.height=t+n*2;let c=r.getContext("2d");c.font=o,c.textAlign="center",c.textBaseline="middle",c.fillStyle="rgba(18,22,26,0.60)";let u=r.width,d=r.height;c.beginPath(),c.moveTo(s,0),c.lineTo(u-s,0),c.quadraticCurveTo(u,0,u,s),c.lineTo(u,d-s),c.quadraticCurveTo(u,d,u-s,d),c.lineTo(s,d),c.quadraticCurveTo(0,d,0,d-s),c.lineTo(0,s),c.quadraticCurveTo(0,0,s,0),c.closePath(),c.fill(),c.lineWidth=6,c.lineJoin="round",c.strokeStyle="rgba(0,0,0,0.55)",c.strokeText(i,u/2,d/2),c.fillStyle="#ffffff",c.fillText(i,u/2,d/2);let f=new pn(r);f.colorSpace=xt,f.wrapS=jt,f.wrapT=jt;let h=new vs({map:f,transparent:!0,depthWrite:!1,depthTest:!0}),m={tex:f,mat:h,aspect:r.width/r.height};return ox[i]=m,m}function oE(i){let e=aE(i),t=new Ws(e.mat);return t.scale.set(.2*e.aspect,.2,1),t.renderOrder=2,t}function ha(i,e=1){let t=new Ce,n=i()*pp.length|0,s=ru(pp[n]),r=new he({map:Sp(i()*4|0),color:pp[n],roughness:.72}),a=au(rx[i()*rx.length|0]),o=i()*mp.length|0,l=nu(tu[o]||"tee",mp[o]),c=iu(mp[o]),u=su(ax[i()*ax.length|0]),d=new Set([Ve.torso,Ve.head,Ve.leg,Ve.arm]),f=(p,g,y,M,_)=>{let b=new I(p,g);return b.position.set(y,M,_),b.castShadow=d.has(p),t.add(b),b};f(Ve.torso,l,0,1.16,0),f(Ve.neck,s,0,1.475,0);let h=f(Ve.head,r,0,bp,0);f(Ve.hairCap,a,0,1.605,0);let m=[],x=[];for(let p of[-.078,.078]){let g=f(Ve.leg,u,p,.45,0),y=new I(Ve.foot,$t.dark);y.position.set(0,-.422,.045),g.add(y),m.push(g)}for(let p of[-.185,.185]){let g=f(Ve.arm,c,p,1.13,0),y=new I(Ve.hand,s);y.position.set(0,-.253,0),g.add(y),x.push(g)}if(i()<.25){let p=new I(new se(.26,.3,.13),$t.dark);p.position.set(0,1.16,-.16),p.castShadow=!0,t.add(p)}if(i()<.16){let p=new I(new qe(.135,.135,.022,10),$t.dark);p.position.y=1.688,t.add(p)}return t.scale.setScalar(e),t.userData.limbs={legs:m,arms:x},t}function Ep(i){let e=new Ce,t=[3817800,6975348,3095108,5917252,9080722,8007471,3099242][i()*7|0],n=ou(t),s=new I(Ve.carBody,n);s.position.y=.62,s.castShadow=!0,e.add(s);let r=new I(Ve.carRoof,$t.glass);r.position.set(0,1.16,-.28),r.castShadow=!0,e.add(r);for(let[a,o]of[[-.86,1.33],[.86,1.33],[-.86,-1.33],[.86,-1.33]]){let l=new I(Ve.wheel,$t.dark);l.position.set(a,.31,o),l.rotation.z=Math.PI/2,e.add(l)}for(let a of[-.6,.6]){let o=new I(new se(.3,.14,.06),$t.lamp);o.position.set(a,.68,2.02),e.add(o)}return e.userData.len=4.05,e}function wp(i){let e=new Ce,t=[3095108,7027252,3820090,4865874][i()*4|0],n=new he({color:t,roughness:.55,metalness:.25}),s=new I(new se(.34,.3,1.5),n);s.position.y=.66,s.castShadow=!0,e.add(s);for(let a of[.62,-.62]){let o=new I(Ve.wheel,$t.dark);o.position.set(0,.31,a),o.rotation.z=Math.PI/2,o.scale.setScalar(.82),e.add(o)}let r=ha(i,.82);return r.position.y=.32,e.add(r),e.userData.len=1.5,e}function Tp(i){let e=new Ce,t=Xo([9071172,3813416,14207144,5917240][i()*4|0]),n=new I(Ve.dogBody,t);n.rotation.x=Math.PI/2,n.position.y=.42,n.castShadow=!0,e.add(n);let s=new I(Ve.dogHead,t);s.position.set(0,.56,.26),s.castShadow=!0,e.add(s);let r=new I(Ve.tail,t);r.position.set(0,.5,-.26),e.add(r);let a=[];for(let[o,l]of[[-.09,.13],[.09,.13],[-.09,-.13],[.09,-.13]]){let c=new I(Ve.tail,t);c.position.set(o,.2,l),c.scale.setScalar(.85),e.add(c),a.push(c)}return e.userData.legs=a,e.userData.tail=r,e}function Rp(i){let e=new Ce,t=Xo([3814448,14209216,11041352,5921370][i()*4|0]),n=new I(Ve.catBody,t);n.rotation.x=Math.PI/2,n.position.y=.3,n.castShadow=!0,e.add(n);let s=new I(Ve.catHead,t);s.position.set(0,.4,.22),s.castShadow=!0,e.add(s);for(let a of[-.045,.045]){let o=new I(Ve.nose,t);o.position.set(a,.47,.2),e.add(o)}let r=new I(Ve.tail,t);return r.position.set(0,.36,-.2),r.rotation.x=-.7,e.add(r),e.userData.tail=r,e}function Ap(i){let e=new Ce,t=new I(Ve.birdBody,$t.birdBody);t.castShadow=!0,e.add(t);let n=[];for(let r of[-1,1]){let a=new I(Ve.wing,$t.birdBody);a.position.set(r*.1,.01,0),e.add(a),n.push(a)}let s=new I(Ve.nose,$t.lamp);return s.rotation.x=Math.PI/2,s.position.set(0,.005,.09),e.add(s),e.userData.wings=n,e}var zt={PED:"ped",KEEPER:"keeper",NAMED:"npc",CAR:"car",BIKE:"bike",DOG:"dog",CAT:"cat",BIRD:"bird",INSECT:"insect"},$o={ped:.3,keeper:.3,npc:.3,car:.9,bike:.35,dog:.3,cat:.25},lx=16,lE=.25,cs={PHYSICAL:0,EVENT_TEMP:1,EVENT_LONG:2,PRIMARY:3,DEFAULT:4},hu=5,ii=class{constructor(e){this.name=e,this.interruptible=!0}start(e){}tick(e,t,n){return!0}stop(e){}},Yo=class extends ii{constructor(e){super(e),this.sub=null,this.stage=0}tick(e,t,n){let s=null;for(let r=0;r<8;r++){if(this.sub){if(!this.sub.tick(e,t,n))return!1;s=this.sub,this.sub.stop(e),this.sub=null}let a=this.nextSubTask(e,n,s);if(s=null,a===null)return!0;this.sub=a,a.start(e)}return!1}stop(e){this.sub&&(this.sub.stop(e),this.sub=null)}nextSubTask(e,t,n){return null}},uu=class extends ii{constructor(e){super("wait"),this.t=e}tick(e,t,n){return this.t-=t,n._swing(e.obj,0,0),e.obj.position.y=0,this.t<=0}},Ko=class extends ii{constructor(e){super("yield"),this.t=e}start(e){e.phase=0}tick(e,t,n){let s=e.obj;this.t-=t;let r=n._playerPos;return r&&(s.rotation.y=Math.atan2(r.x-s.position.x,r.z-s.position.z),Math.hypot(r.x-s.position.x,r.z-s.position.z)>2.2)?!0:(n._swing(s,0,0),s.position.y=0,this.t<=0)}},yp=class extends ii{constructor(e,t,n,s){super("goto"),this.x=e,this.z=t,this.speedMul=n,this.arriveR=s,this.blocked=!1}tick(e,t,n){let s=e.obj,r=this.x-s.position.x,a=this.z-s.position.z,o=Math.hypot(r,a);if(o<this.arriveR)return n._swing(s,0,0),s.position.y=0,!0;let l=Math.min(e.speed*this.speedMul,2.4),c=n._slide(s.position.x,s.position.z,s.position.x+r/o*l*t,s.position.z+a/o*l*t,$o.ped);return c.hit?(this.blocked=!0,!0):(s.position.x=c.x,s.position.z=c.z,s.rotation.y=Math.atan2(r,a),e.phase+=t*7.4,n._swing(s,e.phase,.5),s.position.y=Math.abs(Math.sin(e.phase))*.02,!1)}},_p=class extends ii{constructor(e,t,n){super("stand"),this.t=e,this.faceX=t,this.faceZ=n}tick(e,t,n){let s=e.obj;return this.t-=t,s.rotation.y=Math.atan2(this.faceX-s.position.x,this.faceZ-s.position.z),n._swing(s,0,0),s.position.y=0,this.t<=0}},ua=class extends Yo{constructor(e){super("shop"),this.shop=e}nextSubTask(e,t,n){return this.stage===0?(this.stage=1,new yp(this.shop.x,this.shop.z,1.3,1.05)):this.stage===1?(this.stage=2,n&&n.blocked?(e.shopCd=8+Math.random()*14,this.stage=3,null):new _p(2+Math.random()*3,this.shop.x,this.shop.z)):(e.shopCd=12+Math.random()*22,this.stage=3,null)}},vp=class extends ii{constructor(e,t=0){super("wander"),this.lim=e,this.pauseT=t,this.turnCd=0,this.pauseCd=2+Math.random()*9}tick(e,t,n){let s=e.obj,r=this.lim;if(e.shop&&(e.shopCd-=t),this.pauseT>0)this.pauseT-=t,n._swing(s,0,0),s.position.y=0;else{let a=s.position.x,o=s.position.z,l=0,c=e.dir*e.speed*t,u=n._playerPos;if(u){let f=a-u.x,h=o-u.z,m=Math.hypot(f,h);if(m<.85&&m>1e-4){let x=(.85-m)/m;l+=f*x*.6,c+=h*x*.6}}let d=n._slide(a,o,a+l,o+c,$o.ped);d.hit?(this.turnCd-=t,this.turnCd<=0&&(e.dir*=-1,e.phase=0,this.turnCd=1.2)):(s.position.x=d.x,s.position.z=d.z),e.phase+=t*(6.2+e.speed),n._swing(s,e.phase,.55),s.position.y=Math.abs(Math.sin(e.phase))*.022,this.pauseCd-=t,this.pauseCd<=0&&(this.pauseCd=7+Math.random()*12,Math.random()<.45&&(this.pauseT=1.2+Math.random()*3.2))}return(s.position.z>r||s.position.z<-r)&&(e.dir*=-1,e.phase=0),s.rotation.y=e.dir>0?0:Math.PI,!1}},Mp=class extends ii{constructor(){super("standStill")}tick(e,t,n){return n._swing(e.obj,0,0),e.obj.position.y=0,!1}},du=class extends ii{constructor(){super("pedAmbient"),this.sub=null,this.first=!0}tick(e,t,n){if(e.shop&&e.shopCd<=0&&!(this.sub instanceof ua)&&(this.sub&&(this.sub.stop(e),this.sub=null),this.sub=new ua(e.shop),this.sub.start(e)),!this.sub){let s=this.first?e.entryPause:0;this.first=!1,this.sub=new vp(n.world&&n.world.streetLen?n.world.streetLen/2:48,s),this.sub.start(e)}return this.sub.tick(e,t,n)&&(this.sub.stop(e),this.sub=null),!1}stop(e){this.sub&&(this.sub.stop(e),this.sub=null)}};function cE(i,e,t,n,s,r){return{kind:zt.PED,obj:i,speed:.75+e()*.85,dir:t,phase:e()*Math.PI*2,lane:n,shop:s,shopKeeper:r,shopCd:s?2+e()*8:0,entryPause:e()*1.6,yieldCd:0,tasks:null}}function cx(i,e,t,n,s,r,a){let o={kind:i,obj:e,home:{x:n.x,z:n.z},rot:s||0,phase:t()*Math.PI*2,actT:t()*6,stepT:r,target:null,tasks:null};return a?Object.assign(o,a):o}function hx(i,e,t,n,s,r){return{kind:i,obj:e,speed:s,dir:t,lane:n,len:r,cur:s,braking:!1,tasks:null}}var da=class{constructor(e){this.scene=e,this.group=new Ce,this.group.name="actors",this.group.userData.noMerge=!0,e.add(this.group),this.actors=[],this.world=null,this._byKind={},this.colliders=[],this.anchors=[],this._reservedAnchors=[],this._namedIds=[],this._keeperRng=null,this.pedBand=null,this._grid=null,this._cell=8,this._playerPos=null,this.pushedSpawns=0,this.stuckSpawns=0,this._lodT=0,this.shadowOnCount=0,this.shadowOffCount=0,this.shadowTotal=0,this.shadowLod=!0}setWorld(e){if(this.clear(),this.world=e,!e)return;sE(),rE();let t=Lo(Io(String(e.id||"x")+"|"+(e.layout||""))),n=e.streetLen||96,s=e.roadW||9.5,r=e.laneHalf||s/2,a=e.tier||1,o=typeof e.footfall=="number"?e.footfall:.6;this.colliders=Array.isArray(e.colliders)?e.colliders:[],this.anchors=Array.isArray(e.anchors)?e.anchors:[],this.pedBand=this._pedBandX(s,r),this._keeperRng=t,this._reservedAnchors=this._reserveAnchors(Array.isArray(e.npcs)?e.npcs.length:0),this._spawnNamed(t,n,r,e.npcs),this._spawnKeepers(t,n,r);let l=Math.max(2,Math.min(22,Math.round(6+o*18+(a-1)*2)));for(let f=0;f<l;f++)this._spawnPed(t,n,s,r);if(e.layout==="avenue"||e.layout==="lane"||e.layout==="plaza"){let f=e.layout==="lane"?2:Math.min(7,3+a);for(let h=0;h<f;h++)this._spawnCar(t,n,s,h===0?1:h===1?-1:void 0);e.layout==="avenue"&&t()<.75&&this._spawnBike(t,n,s)}if((e.layout==="compound"||e.layout==="yard"||e.layout==="lane")&&t()<.8){let f=1+(t()*2|0);for(let h=0;h<f;h++)this._spawnDog(t,n,r)}if((e.layout==="lane"||e.layout==="compound"||e.layout==="yard")&&t()<.75){let f=1+(t()*2|0);for(let h=0;h<f;h++)this._spawnCat(t,n,r)}{let f=3+(t()*4|0);for(let h=0;h<f;h++)this._spawnBird(t,n,r)}if(e.layout==="lane"||e.layout==="yard"){let f=1+(t()*2|0);for(let h=0;h<f;h++)this._spawnSwarm(t,n,r)}}_pedBandX(e,t){let n=this.world&&this.world.layout||"lane";return Ig(n,e,t)}_spawnPed(e,t,n,s){let r=this.pedBand||this._pedBandX(n,s),o=(e()<.5?-1:1)*(r.inner+e()*(r.outer-r.inner)),l=e()<.5?1:-1,c=ha(e,.94+e()*.12);c.position.set(o,0,-t/2+e()*t);let u=e()<.34?this._pickAnchor(e):null,d=u?this._frontOf(u,u.kind):null;this._push(cE(c,e,l,o,d,u))}_pickAnchor(e){let t=this.anchors;return!t||!t.length?null:t[e()*t.length|0]}_reserveAnchors(e){let t=this.anchors;if(!t||!t.length||!(e>0))return[];let n=Math.min(e,t.length),s=[];for(let r=0;r<n;r++)s.push(t[Math.floor((r+.5)*t.length/n)%t.length]);return s}_keepersAnchors(){let e=this.anchors,t=this._reservedAnchors;if(!e||!t||!t.length)return e;let n=[];for(let s=0;s<e.length;s++)t.indexOf(e[s])<0&&n.push(e[s]);return n}_spawnKeepers(e,t,n){let s=this._keepersAnchors();if(!s||!s.length)return;let r=Math.min(8,s.length);for(let a=0;a<r;a++){let o=s[Math.floor((a+.5)*s.length/r)%s.length],l=ha(e,.95+e()*.1);l.position.set(o.x,0,o.z),l.rotation.y=o.rot||0,this._push(cx(zt.KEEPER,l,e,o,o.rot,6+e()*12))}}_spawnNamed(e,t,n,s){this._namedIds=[];let r=Array.isArray(s)?s:[];if(!r.length)return;let a=this._reservedAnchors||[];for(let o=0;o<r.length;o++){let l=r[o];if(!l||!l.id)continue;let c=a[o]||this._fallbackSpot(o,r.length,t),u=Lo(Io("npc|"+l.id)),d=ha(u,.97+u()*.08);d.position.set(c.x,0,c.z),d.rotation.y=c.rot||0,d.userData.__actorId=l.id;let f=oE(l.name||l.id);f.position.set(0,1.93,0),d.add(f),this._push(cx(zt.NAMED,d,u,c,c.rot,8+u()*14,{npcId:l.id,npcName:l.name||l.id})),this._namedIds.push(l.id)}}_fallbackSpot(e,t,n){let s=this.pedBand||{inner:2.6,outer:3.6},r=(s.inner+s.outer)/2,a=-n/2+n*(e+1)/(t+1);return{x:r,z:a,rot:-Math.PI/2}}setNamedNpcs(e){if(!this.world)return 0;let t=Array.isArray(e)?e:[],n=[];for(let o=0;o<t.length;o++)t[o]&&t[o].id&&n.push(t[o].id);if(n.join("|")===(this._namedIds||[]).join("|"))return 0;this._dropKind(zt.NAMED),this._namedIds=[];let s=this.world.streetLen||96,r=this.world.roadW||9.5,a=this.world.laneHalf||r/2;return this._reservedAnchors=this._reserveAnchors(n.length),this._respawnKeepers(),this._spawnNamed(null,s,a,t),n.length}_dropKind(e){for(let t=this.actors.length-1;t>=0;t--)this.actors[t].kind===e&&(this.group.remove(this.actors[t].obj),this.actors.splice(t,1));this._byKind[e]&&delete this._byKind[e]}_respawnKeepers(){this._dropKind(zt.KEEPER),this.world&&this._spawnKeepers(this._keeperRng||Lo(Io(String(this.world.id||"x"))),this.world.streetLen||96,this.world.laneHalf||4.75)}_spawnCar(e,t,n,s){let r=s!==void 0?s:e()<.5?1:-1,a=(r>0?-1:1)*this._carLane(n,this.world.laneHalf||n/2),o=Ep(e);o.position.set(a,0,-t/2+e()*t),o.rotation.y=r>0?0:Math.PI,this._push(hx(zt.CAR,o,r,a,(2.6+e()*2.2)*(.8+(this.world.tier||1)*.12),4.05))}_carLane(e,t){return Vh(e,t)}_bikeLane(e,t){return Pg(e,t)}_spawnBike(e,t,n){let s=e()<.5?1:-1,r=(s>0?-1:1)*this._bikeLane(n,this.world.laneHalf||n/2),a=wp(e);a.position.set(r,0,-t/2+e()*t),a.rotation.y=s>0?0:Math.PI,this._push(hx(zt.BIKE,a,s,r,3.4+e()*2.4,1.5))}_spawnDog(e,t,n){let s=Tp(e),r=this.pedBand||this._pedBandX(this.world.roadW||9.5,n),a=(e()<.5?-1:1)*(r.outer-e()*.8),o=-t/2+e()*t;s.position.set(a,0,o),this._push({kind:zt.DOG,obj:s,speed:1.15+e()*.7,home:{x:a,z:o},wander:{x:a,z:o},retarget:0,phase:e()*6,sniffT:0})}_spawnCat(e,t,n){let s=Rp(e),r=this.pedBand||this._pedBandX(this.world.roadW||9.5,n),a=(e()<.5?-1:1)*(r.outer-e()*.9),o=-t/2+e()*t;s.position.set(a,0,o),this._push({kind:zt.CAT,obj:s,speed:.6+e()*.5,home:{x:a,z:o},wander:{x:a,z:o},retarget:0,phase:e()*6,idleT:e()*5})}_spawnBird(e,t,n){let s=Ap(e),r=(e()-.5)*n*1.6,a=(e()-.5)*t*.8,o=6+e()*7;s.position.set(r,o,a),this._push({kind:zt.BIRD,obj:s,cx:r,cz:a,h:o,r:3.5+e()*5,ang:e()*Math.PI*2,angSpeed:.22+e()*.26,flap:e()*6,grounded:!1,groundT:0})}_spawnSwarm(e,t,n){let s=(e()<.5?-1:1)*(n*.35+e()*n*.4),r=-t/2+e()*t,a=4+(e()*4|0);for(let o=0;o<a;o++){let l=new I(Ve.insect,$t.insect);l.position.set(s,.7+e()*.8,r),this._push({kind:zt.INSECT,obj:l,cx:s,cz:r,r:.5+e()*.9,ang:e()*Math.PI*2,angSpeed:1.6+e()*2.4,bob:e()*6,chaser:e()<.34})}}_push(e){e.obj.userData.__actorKind=e.kind;let t=[];e.obj.traverse(s=>{s.isMesh&&s.castShadow&&t.push(s)}),e.obj.userData.__shadowParts=t,e._shadowOn=t.length>0;let n=$o[e.kind];n!==void 0&&this._resolveSpawn(e.obj,n),e.kind===zt.PED&&(e.tasks=new Array(hu).fill(null),e.tasks[cs.PRIMARY]=new du,e.tasks[cs.PRIMARY].start(e),e.tasks[cs.DEFAULT]=new Mp),this.actors.push(e),(this._byKind[e.kind]||(this._byKind[e.kind]=[])).push(e),this.group.add(e.obj)}_resolveSpawn(e,t,n=1.8){let s=e.position.x,r=e.position.z;if(!this._blocked(s,r,t))return!1;let a=Math.sign(s)||1,o=s!==0,l=[[-a,0],[0,-1],[0,1],[a,0],[-a,-1],[-a,1],[a,-1],[a,1]],c=[];for(let u=.1;u<=n+1e-6;u+=.1)for(let[d,f]of l){let h=Math.hypot(d,f);c.push({d:u,x:s+d/h*u,z:r+f/h*u})}c.sort((u,d)=>u.d-d.d);for(let u of c)if(!(o&&u.x*s<=0)&&!this._blocked(u.x,u.z,t))return e.position.x=u.x,e.position.z=u.z,this.pushedSpawns++,!0;return this.stuckSpawns++,!1}_gridOf(){if(this._grid)return this._grid;let e=this._cell,t=new Map;for(let n of this.colliders){let s=Math.floor(n.minX/e),r=Math.floor(n.maxX/e),a=Math.floor(n.minZ/e),o=Math.floor(n.maxZ/e);if(!(r-s>20||o-a>20))for(let l=s;l<=r;l++)for(let c=a;c<=o;c++){let u=l+","+c,d=t.get(u);d||(d=[],t.set(u,d)),d.push(n)}}return this._grid=t,t}_nearColliders(e,t){let n=this._cell,s=Math.floor(e/n),r=Math.floor(t/n),a=this._gridOf(),o=null;for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++){let u=a.get(s+l+","+(r+c));u&&(o=o?o.concat(u):u)}return o}_blocked(e,t,n){let s=this._nearColliders(e,t);if(!s)return!1;for(let r=0;r<s.length;r++){let a=s[r];if(e>a.minX-n&&e<a.maxX+n&&t>a.minZ-n&&t<a.maxZ+n)return!0}return!1}_slide(e,t,n,s,r){let a=n,o=t,l=!1;return this._blocked(a,o,r)&&(a=e,l=!0),this._blocked(a,s,r)?(o=t,l=!0):o=s,{x:a,z:o,hit:l}}update(e,t){if(!this.world||!(e>0))return;e>.05&&(e=.05),this._playerPos=t||null,this._grid=null;let s=(this.world.streetLen||96)/2;for(let r=0;r<this.actors.length;r++){let a=this.actors[r];switch(a.kind){case zt.PED:this._updPed(a,e,s,t);break;case zt.KEEPER:case zt.NAMED:this._updKeeper(a,e,s,t);break;case zt.CAR:case zt.BIKE:this._updVehicle(a,e,s,t);break;case zt.DOG:this._updDog(a,e,s);break;case zt.CAT:this._updCat(a,e,s);break;case zt.BIRD:this._updBird(a,e,s);break;case zt.INSECT:this._updInsect(a,e,t);break}}if(this._lodT+=e,this.shadowLod&&this._lodT>=lE&&(this._lodT=0,t)){let r=t.x,a=t.z,o=lx+.5,l=lx-.5,c=o*o,u=l*l,d=0,f=0;for(let h=0;h<this.actors.length;h++){let m=this.actors[h],x=m.obj.userData.__shadowParts;if(!x||!x.length)continue;let p=m.obj.position.x-r,g=m.obj.position.z-a,y=p*p+g*g,M=m._shadowOn?y<=c:y<=u;if(M!==m._shadowOn){m._shadowOn=M;for(let _=0;_<x.length;_++)x[_].castShadow=M}m._shadowOn?d++:f++}this.shadowTotal=d+f,this.shadowOnCount=d,this.shadowOffCount=f}}_swing(e,t,n){let s=e.userData.limbs;s&&(s.legs[0].rotation.x=Math.sin(t)*n,s.legs[1].rotation.x=-Math.sin(t)*n,s.arms[0].rotation.x=-Math.sin(t)*n*.75,s.arms[1].rotation.x=Math.sin(t)*n*.75)}_frontOf(e,t){if(!Number.isFinite(t))return this._warnedFrontOf||(this._warnedFrontOf=!0,console.warn("[actors] _frontOf: dist 非有限数字，已退回锚点自身。value=",t)),{x:e.x,z:e.z};let n=e.rot||0;return{x:e.x+Math.sin(n)*t,z:e.z+Math.cos(n)*t}}_pedEvents(e,t){e.yieldCd>0&&(e.yieldCd-=t);let n=e.tasks;if(!n||n[cs.EVENT_TEMP]||e.yieldCd>0)return;let s=this._playerPos;if(!s)return;let r=s.x-e.obj.position.x,a=s.z-e.obj.position.z,o=Math.hypot(r,a);o<=.55||o>=1.1||Math.abs(a)<=Math.abs(r)||a*e.dir<=0||(this.pushTask(e,cs.EVENT_TEMP,new Ko(.9+Math.random()*1)),e.yieldCd=5+Math.random()*5)}_pumpTasks(e,t){let n=e.tasks;if(!n)return!1;for(let s=0;s<hu;s++){let r=n[s];if(r)return r.tick(e,t,this)&&(r.stop(e),n[s]=null),!0}return!1}pushTask(e,t,n,s=!0){let r=e.tasks;if(!r)return!1;let a=r[t];return a&&!s||a&&!a.interruptible?!1:(a&&a.stop(e),r[t]=n,n.start(e),!0)}clearTask(e,t){let n=e.tasks;if(!n)return;let s=n[t];s&&(s.stop(e),n[t]=null)}_updPed(e,t,n,s){let r=e.tasks;r&&(this._pedEvents(e,t),!this._pumpTasks(e,t)&&(r[cs.PRIMARY]=new du,r[cs.PRIMARY].start(e)))}_updKeeper(e,t,n,s){let r=e.obj,a=.32,o=r.position.x,l=r.position.z;if(e.actT+=t,e.stepT-=t,e.stepT<=0)if(e.stepT=11+Math.random()*16,e.target)e.target=null;else{let m=Math.sin(e.rot),x=Math.cos(e.rot),p=Math.cos(e.rot),g=-Math.sin(e.rot),y=.8+Math.random()*1.2,M=(Math.random()-.5)*1.8,_=e.home.x+m*y+p*M,b=e.home.z+x*y+g*M;_*e.home.x>0&&!this._blocked(_,b,a)&&(e.target={x:_,z:b})}let c=e.target||e.home,u=c.x-o,d=c.z-l,f=Math.hypot(u,d),h=r.userData.limbs;if(f>.16){let x=this._slide(o,l,o+u/f*.8*t,l+d/f*.8*t,a);r.position.x=x.x,r.position.z=x.z,x.hit&&(e.target=null),r.rotation.y=Math.atan2(u,d),r.rotation.x=0,e.phase+=t*5.6,this._swing(r,e.phase,.42),r.position.y=Math.abs(Math.sin(e.phase))*.018}else{r.rotation.y=e.rot,r.position.y=0;let m=e.actT,x=Math.sin(m*1.55);h&&(h.legs[0].rotation.x=h.legs[1].rotation.x=0,x>.55?(h.arms[1].rotation.x=-2+Math.sin(m*7.2)*.3,h.arms[0].rotation.x=Math.sin(m*1.5)*.12,r.rotation.x=0):(h.arms[0].rotation.x=.62+Math.sin(m*2.3)*.4,h.arms[1].rotation.x=.62+Math.sin(m*2.3+1.1)*.4,r.rotation.x=.09+Math.sin(m*2.3)*.045))}}_updVehicle(e,t,n,s){let r=e.obj,a=1/0;for(let h of(this._byKind[zt.CAR]||[]).concat(this._byKind[zt.BIKE]||[])){if(h===e||h.dir!==e.dir)continue;let m=(h.obj.position.z-r.position.z)*e.dir;m>0&&m<a&&(a=m)}let o=!1;if(s){let h=(s.z-r.position.z)*e.dir,m=Math.abs(s.x-r.position.x);h>0&&h<3.4&&m<1.35&&(o=!0)}let l=!1;{let h=r.position.z+e.dir*(e.len*.5+1.2),m=Math.max(.85,Math.abs(e.lane)*.15);this._blocked(r.position.x,h,m)&&(l=!0)}let c=e.len+1.6,u=a<c||o||l;e.braking=u;let d=u?0:e.speed,f=d>e.cur?2.6:7.5;e.cur+=Math.max(-f*t,Math.min(f*t,d-e.cur)),r.position.z+=e.dir*e.cur*t;for(let h of r.children)h.geometry===Ve.wheel&&(h.rotation.x+=e.cur*t*2.6);for(let h of r.children)h.geometry&&h.geometry===Ve.lamp&&(h.material=e.braking?$t.lampBrake:$t.lamp);r.position.z>n+6&&(r.position.z=-n-6),r.position.z<-n-6&&(r.position.z=n+6)}_updDog(e,t,n){let s=e.obj;if(e.retarget-=t,e.retarget<=0&&(e.wander.x=e.home.x+(Math.random()-.5)*7,e.wander.z=Math.max(-n+2,Math.min(n-2,e.home.z+(Math.random()-.5)*9)),e.retarget=2.5+Math.random()*5,e.sniffT=Math.random()<.35?.8+Math.random()*1.6:0),e.sniffT>0)e.sniffT-=t,s.position.y=0;else{let a=e.wander.x-s.position.x,o=e.wander.z-s.position.z,l=Math.hypot(a,o);l>.12&&(s.position.x+=a/l*e.speed*t,s.position.z+=o/l*e.speed*t,s.rotation.y=Math.atan2(a,o),s.position.y=Math.abs(Math.sin(performance.now()*.006))*.03)}e.phase+=t*9;let r=s.userData.tail;r&&(r.rotation.z=Math.sin(e.phase)*.5);for(let a=0;a<(s.userData.legs||[]).length;a++)s.userData.legs[a].rotation.x=Math.sin(e.phase+a*1.6)*.4}_updCat(e,t,n){let s=e.obj;if(e.retarget-=t,e.retarget<=0&&(e.wander.x=e.home.x+(Math.random()-.5)*5,e.wander.z=Math.max(-n+2,Math.min(n-2,e.home.z+(Math.random()-.5)*6)),e.retarget=3+Math.random()*6,e.idleT=Math.random()<.5?2+Math.random()*4:0),e.idleT>0)e.idleT-=t;else{let a=e.wander.x-s.position.x,o=e.wander.z-s.position.z,l=Math.hypot(a,o);if(l>.12){let c=this._slide(s.position.x,s.position.z,s.position.x+a/l*e.speed*t,s.position.z+o/l*e.speed*t,.26);s.position.x=c.x,s.position.z=c.z,c.hit&&(e.retarget=0),s.rotation.y=Math.atan2(a,o)}}e.phase+=t*4.5;let r=s.userData.tail;r&&(r.rotation.z=Math.sin(e.phase)*.22)}_updBird(e,t,n){let s=e.obj;if(e.grounded)e.groundT-=t,s.position.y=.06,e.groundT<=0&&(e.grounded=!1);else{e.ang+=e.angSpeed*t;let a=e.cx,o=e.cz;s.position.x=a+Math.cos(e.ang)*e.r,s.position.z=Math.max(-n,Math.min(n,o+Math.sin(e.ang)*e.r)),s.position.y=e.h+Math.sin(e.ang*2.1)*.55,s.rotation.y=-e.ang+Math.PI/2,e.groundCd=(e.groundCd===void 0?4+Math.random()*12:e.groundCd)-t,e.groundCd<=0&&(e.groundCd=12+Math.random()*18,Math.random()<.5&&(e.grounded=!0,e.groundT=1.5+Math.random()*2.5))}e.flap+=t*(e.grounded?2:11);let r=s.userData.wings||[];r[0]&&(r[0].rotation.z=Math.sin(e.flap)*.75),r[1]&&(r[1].rotation.z=-Math.sin(e.flap)*.75)}_updInsect(e,t,n){let s=e.obj;e.ang+=e.angSpeed*t,e.bob+=t*7;let r=e.cx,a=e.cz;if(e.chaser&&n){let o=n.x-r,l=n.z-a,c=Math.hypot(o,l)||1;c>3.2?(r+=o/c*1.4*t,a+=l/c*1.4*t):c<1.2&&(r-=o/c*1.2*t,a-=l/c*1.2*t),e.cx=r,e.cz=a}s.position.x=r+Math.cos(e.ang)*e.r,s.position.z=a+Math.sin(e.ang*1.3)*e.r,s.position.y=.85+Math.sin(e.bob)*.22}get stats(){let e={};for(let t of Object.keys(this._byKind))e[t]=this._byKind[t].length;return e.total=this.actors.length,e}get namedIds(){return(this._namedIds||[]).slice()}clear(){for(let e of this.actors)this.group.remove(e.obj);this.actors.length=0,this._byKind={},this.world=null,this._reservedAnchors=[],this._namedIds=[]}dispose(){this.clear(),this.group.parent&&this.group.parent.remove(this.group)}};var Oi={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var Nn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},hE=new Ri(-1,1,1,-1,0,1),Cp=class extends Ht{constructor(){super(),this.setAttribute("position",new pt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new pt([0,2,0,0,2,0],2))}},uE=new Cp,Bi=class{constructor(e){this._mesh=new I(uE,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,hE)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var fa=class extends Nn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Nt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ln.clone(e.uniforms),this.material=new Nt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Bi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Zo=class extends Nn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},fu=class extends Nn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var pu=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new de);this._width=n.width,this._height=n.height,t=new Yt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:an}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new fa(Oi),this.copyPass.material.blending=Qt,this.timer=new ro}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Zo!==void 0&&(a instanceof Zo?n=!0:a instanceof fu&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new de);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var mu=class extends Nn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Pe}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}};var jo={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new de},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new Xe},cameraProjectionMatrixInverse:{value:new Xe},cameraWorldMatrix:{value:new Xe},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new P(-1,-1,-1)},sceneBoxMax:{value:new P(1,1,1)}},vertexShader:`

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
		}`},Jo={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
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

		}`},gu={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
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
		}`};function ux(i=5){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=dE(e),n=t.length,s=new Uint8Array(n*4);for(let a=0;a<n;++a){let o=t[a],l=2*Math.PI*o/n,c=new P(Math.cos(l),Math.sin(l),0).normalize();s[a*4]=(c.x*.5+.5)*255,s[a*4+1]=(c.y*.5+.5)*255,s[a*4+2]=127,s[a*4+3]=255}let r=new Si(s,e,e);return r.wrapS=on,r.wrapT=on,r.needsUpdate=!0,r}function dE(i){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=e*e,n=Array(t).fill(0),s=Math.floor(e/2),r=e-1;for(let a=1;a<=t;){if(s===-1&&r===e?(r=e-2,s=0):(r===e&&(r=0),s<0&&(s=e-1)),n[s*e+r]!==0){r-=2,s++;continue}else n[s*e+r]=a++;r++,s--}return n}var Qo={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Pp(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new de},cameraProjectionMatrixInverse:{value:new Xe},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

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
		}`};function Pp(i,e,t){let n=fE(i,e,t),s="vec3[SAMPLES](";for(let r=0;r<i;r++){let a=n[r];s+=`vec3(${a.x}, ${a.y}, ${a.z})${r<i-1?",":")"}`}return s}function fE(i,e,t){let n=[];for(let s=0;s<i;s++){let r=2*Math.PI*e*s/i,a=Math.pow(s/(i-1),t);n.push(new P(Math.cos(r),Math.sin(r),a))}return n}var xu=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,s,r,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,l=Math.floor(e+o),c=Math.floor(t+o),u=(3-Math.sqrt(3))/6,d=(l+c)*u,f=l-d,h=c-d,m=e-f,x=t-h,p,g;m>x?(p=1,g=0):(p=0,g=1);let y=m-p+u,M=x-g+u,_=m-1+2*u,b=x-1+2*u,S=l&255,R=c&255,v=this.perm[S+this.perm[R]]%12,w=this.perm[S+p+this.perm[R+g]]%12,A=this.perm[S+1+this.perm[R+1]]%12,L=.5-m*m-x*x;L<0?n=0:(L*=L,n=L*L*this._dot(this.grad3[v],m,x));let D=.5-y*y-M*M;D<0?s=0:(D*=D,s=D*D*this._dot(this.grad3[w],y,M));let H=.5-_*_-b*b;return H<0?r=0:(H*=H,r=H*H*this._dot(this.grad3[A],_,b)),70*(n+s+r)}noise3d(e,t,n){let s,r,a,o,c=(e+t+n)*.3333333333333333,u=Math.floor(e+c),d=Math.floor(t+c),f=Math.floor(n+c),h=1/6,m=(u+d+f)*h,x=u-m,p=d-m,g=f-m,y=e-x,M=t-p,_=n-g,b,S,R,v,w,A;y>=M?M>=_?(b=1,S=0,R=0,v=1,w=1,A=0):y>=_?(b=1,S=0,R=0,v=1,w=0,A=1):(b=0,S=0,R=1,v=1,w=0,A=1):M<_?(b=0,S=0,R=1,v=0,w=1,A=1):y<_?(b=0,S=1,R=0,v=0,w=1,A=1):(b=0,S=1,R=0,v=1,w=1,A=0);let L=y-b+h,D=M-S+h,H=_-R+h,N=y-v+2*h,z=M-w+2*h,V=_-A+2*h,J=y-1+3*h,ae=M-1+3*h,Y=_-1+3*h,B=u&255,re=d&255,Ee=f&255,Te=this.perm[B+this.perm[re+this.perm[Ee]]]%12,ht=this.perm[B+b+this.perm[re+S+this.perm[Ee+R]]]%12,Ze=this.perm[B+v+this.perm[re+w+this.perm[Ee+A]]]%12,it=this.perm[B+1+this.perm[re+1+this.perm[Ee+1]]]%12,Z=.6-y*y-M*M-_*_;Z<0?s=0:(Z*=Z,s=Z*Z*this._dot3(this.grad3[Te],y,M,_));let ee=.6-L*L-D*D-H*H;ee<0?r=0:(ee*=ee,r=ee*ee*this._dot3(this.grad3[ht],L,D,H));let ye=.6-N*N-z*z-V*V;ye<0?a=0:(ye*=ye,a=ye*ye*this._dot3(this.grad3[Ze],N,z,V));let ze=.6-J*J-ae*ae-Y*Y;return ze<0?o=0:(ze*=ze,o=ze*ze*this._dot3(this.grad3[it],J,ae,Y)),32*(s+r+a+o)}noise4d(e,t,n,s){let r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,u,d,f,h,m,x=(e+t+n+s)*l,p=Math.floor(e+x),g=Math.floor(t+x),y=Math.floor(n+x),M=Math.floor(s+x),_=(p+g+y+M)*c,b=p-_,S=g-_,R=y-_,v=M-_,w=e-b,A=t-S,L=n-R,D=s-v,H=w>A?32:0,N=w>L?16:0,z=A>L?8:0,V=w>D?4:0,J=A>D?2:0,ae=L>D?1:0,Y=H+N+z+V+J+ae,B=a[Y][0]>=3?1:0,re=a[Y][1]>=3?1:0,Ee=a[Y][2]>=3?1:0,Te=a[Y][3]>=3?1:0,ht=a[Y][0]>=2?1:0,Ze=a[Y][1]>=2?1:0,it=a[Y][2]>=2?1:0,Z=a[Y][3]>=2?1:0,ee=a[Y][0]>=1?1:0,ye=a[Y][1]>=1?1:0,ze=a[Y][2]>=1?1:0,we=a[Y][3]>=1?1:0,Ke=w-B+c,Ft=A-re+c,je=L-Ee+c,at=D-Te+c,mt=w-ht+2*c,Je=A-Ze+2*c,gt=L-it+2*c,Pt=D-Z+2*c,Kt=w-ee+3*c,_t=A-ye+3*c,Tt=L-ze+3*c,U=D-we+3*c,Xt=w-1+4*c,ct=A-1+4*c,C=L-1+4*c,E=D-1+4*c,k=p&255,W=g&255,K=y&255,ce=M&255,me=o[k+o[W+o[K+o[ce]]]]%32,Q=o[k+B+o[W+re+o[K+Ee+o[ce+Te]]]]%32,te=o[k+ht+o[W+Ze+o[K+it+o[ce+Z]]]]%32,pe=o[k+ee+o[W+ye+o[K+ze+o[ce+we]]]]%32,Ie=o[k+1+o[W+1+o[K+1+o[ce+1]]]]%32,ge=.6-w*w-A*A-L*L-D*D;ge<0?u=0:(ge*=ge,u=ge*ge*this._dot4(r[me],w,A,L,D));let fe=.6-Ke*Ke-Ft*Ft-je*je-at*at;fe<0?d=0:(fe*=fe,d=fe*fe*this._dot4(r[Q],Ke,Ft,je,at));let Le=.6-mt*mt-Je*Je-gt*gt-Pt*Pt;Le<0?f=0:(Le*=Le,f=Le*Le*this._dot4(r[te],mt,Je,gt,Pt));let Ne=.6-Kt*Kt-_t*_t-Tt*Tt-U*U;Ne<0?h=0:(Ne*=Ne,h=Ne*Ne*this._dot4(r[pe],Kt,_t,Tt,U));let We=.6-Xt*Xt-ct*ct-C*C-E*E;return We<0?m=0:(We*=We,m=We*We*this._dot4(r[Ie],Xt,ct,C,E)),27*(u+d+f+h+m)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,s){return e[0]*t+e[1]*n+e[2]*s}_dot4(e,t,n,s,r){return e[0]*t+e[1]*n+e[2]*s+e[3]*r}};var pa=class i extends Nn{constructor(e,t,n=512,s=512,r,a,o){super(),this.width=n,this.height=s,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=ux(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new Yt(this.width,this.height,{type:an,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new Nt({defines:Object.assign({},jo.defines),uniforms:Ln.clone(jo.uniforms),vertexShader:jo.vertexShader,fragmentShader:jo.fragmentShader,blending:Qt,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Za,this.normalMaterial.blending=Qt,this.pdMaterial=new Nt({defines:Object.assign({},Qo.defines),uniforms:Ln.clone(Qo.uniforms),vertexShader:Qo.vertexShader,fragmentShader:Qo.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new Nt({defines:Object.assign({},Jo.defines),uniforms:Ln.clone(Jo.uniforms),vertexShader:Jo.vertexShader,fragmentShader:Jo.fragmentShader,blending:Qt}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Nt({uniforms:Ln.clone(Oi.uniforms),vertexShader:Oi.vertexShader,fragmentShader:Oi.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:lo,blendDst:Zs,blendEquation:Qn,blendSrcAlpha:oo,blendDstAlpha:Zs,blendEquationAlpha:Qn}),this.blendMaterial=new Nt({uniforms:Ln.clone(gu.uniforms),vertexShader:gu.vertexShader,fragmentShader:gu.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:pc,blendSrc:lo,blendDst:Zs,blendEquation:Qn,blendSrcAlpha:oo,blendDstAlpha:Zs,blendEquationAlpha:Qn}),this._fsQuad=new Bi(null),this._originalClearColor=new Pe,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new Ei,this.depthTexture.format=Ci,this.depthTexture.type=Es,this.normalRenderTarget=new Yt(this.width,this.height,{minFilter:Vt,magFilter:Vt,type:an,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let n=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Pp(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,n){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case i.OUTPUT.Off:break;case i.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Qt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=Qt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=Qt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Qt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Qt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(e,t,n,s,r){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,s,r){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,t.push(n))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new xu,n=e*e*4,s=new Uint8Array(n);for(let a=0;a<e;a++)for(let o=0;o<e;o++){let l=a,c=o;s[(a*e+o)*4]=(t.noise(l,c)*.5+.5)*255,s[(a*e+o)*4+1]=(t.noise(l+e,c)*.5+.5)*255,s[(a*e+o)*4+2]=(t.noise(l,c+e)*.5+.5)*255,s[(a*e+o)*4+3]=(t.noise(l+e,c+e)*.5+.5)*255}let r=new Si(s,e,e,In,En);return r.wrapS=on,r.wrapT=on,r.needsUpdate=!0,r}};pa.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var dx={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Pe(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var ma=class i extends Nn{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new de(e.x,e.y):new de(256,256),this.clearColor=new Pe(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Yt(r,a,{type:an,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){let d=new Yt(r,a,{type:an,depthBuffer:!1});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let f=new Yt(r,a,{type:an,depthBuffer:!1});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}let o=dx;this.highPassUniforms=Ln.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Nt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new de(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ln.clone(Oi.uniforms),this.blendMaterial=new Nt({uniforms:this.copyUniforms,vertexShader:Oi.vertexShader,fragmentShader:Oi.fragmentShader,premultipliedAlpha:!0,blending:ao,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Pe,this._oldClearAlpha=1,this._basic=new cn,this._fsQuad=new Bi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new de(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let a=0;a<e;a++)t.push(.39894*Math.exp(-.5*a*a/(n*n))/n);let s=[],r=[];for(let a=1;a<e;a+=2){let o=t[a],l=a+1<e?t[a+1]:0,c=o+l;s.push((a*o+(a+1)*l)/c),r.push(c)}return new Nt({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new de(.5,.5)},direction:{value:new de(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new Nt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};ma.BlurDirectionX=new de(1,0);ma.BlurDirectionY=new de(0,1);var el={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var yu=class extends Nn{constructor(){super(),this.isOutputPass=!0,this.uniforms=Ln.clone(el.uniforms),this.material=new Vr({name:el.name,uniforms:this.uniforms,vertexShader:el.vertexShader,fragmentShader:el.fragmentShader}),this._fsQuad=new Bi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},et.getTransfer(this._outputColorSpace)===yt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===co?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ho?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===uo?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===js?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===po?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===mo?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===fo&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var gn={sky:9413552,fog:{color:9675435,density:.0075},hemi:{sky:10335432,ground:5919558,intensity:.65},sun:{color:14207656,intensity:2.6,pos:[16,20,-14],shadowSize:2048,frustum:40},ambient:{color:3818576,intensity:.15},exposure:1.1},pE={上午:{sunColor:16050380,sunPos:[20,26,-14],sunIntensity:2.6,hemSky:10335432,hemGround:5919558,hemIntensity:.65,fogColor:9675435,fogDensity:.0075,ambColor:3818576,ambIntensity:.15,exposure:1.1,skyColor:9413552,env:{zenith:7311272,horizon:9675435,ground:4867388,groundHorizon:8025448,intensity:1}},下午:{sunColor:16177320,sunPos:[18,25,-13],sunIntensity:2.65,hemSky:11058376,hemGround:6050628,hemIntensity:.7,fogColor:10134432,fogDensity:.0075,ambColor:4212814,ambIntensity:.14,exposure:1.08,skyColor:9938346,env:{zenith:8034992,horizon:11053208,ground:4866616,groundHorizon:9076848,intensity:1}},傍晚:{sunColor:14057279,sunPos:[17,15,-12],sunIntensity:3,hemSky:9150400,hemGround:4868668,hemIntensity:.55,fogColor:9075314,fogDensity:.009,ambColor:4868696,ambIntensity:.12,exposure:1.05,skyColor:9076608,env:{zenith:4872824,horizon:14191184,ground:3814960,groundHorizon:9071178,intensity:.9}},夜间:{sunColor:9093352,sunPos:[15,22,-12],sunIntensity:.38,hemSky:1976890,hemGround:1053206,hemIntensity:.35,fogColor:1844272,fogDensity:.011,ambColor:1713203,ambIntensity:.09,exposure:1.05,skyColor:1712686,env:{zenith:923168,horizon:1844272,ground:658448,groundHorizon:1317410,intensity:.5}}},fx=new Map;function tl(i){return"#"+(i&16777215).toString(16).padStart(6,"0")}function mE(i,e,t){let n=fx.get(e);if(n)return n;let s=t.env;if(!s)return null;let r=256,a=128,o=document.createElement("canvas");o.width=r,o.height=a;let l=o.getContext("2d"),c=l.createLinearGradient(0,0,0,a*.5);c.addColorStop(0,tl(s.zenith)),c.addColorStop(1,tl(s.horizon)),l.fillStyle=c,l.fillRect(0,0,r,a*.5);let u=l.createLinearGradient(0,a*.5,0,a);u.addColorStop(0,tl(s.groundHorizon)),u.addColorStop(1,tl(s.ground)),l.fillStyle=u,l.fillRect(0,a*.5,r,a*.5);let f=(Math.atan2(t.sunPos[2],t.sunPos[0])/(Math.PI*2)+.5)*r,h=a*.5-t.sunPos[1]/40*a*.42,m=tl(t.sunColor),x=l.createRadialGradient(f,h,0,f,h,r*.16);x.addColorStop(0,m),x.addColorStop(.35,m+"80"),x.addColorStop(1,"rgba(0,0,0,0)"),l.fillStyle=x,l.fillRect(0,0,r,a);let p=new pn(o);p.mapping=Kr,p.colorSpace=xt;let g=new ta(i),y=g.fromEquirectangular(p);return g.dispose(),p.dispose(),fx.set(e,y.texture),y.texture}var Ip=.5,gE=.7,xE=.35,yE=.4,_E=.85,vE=.06,ME=.5,bE=.015,SE={name:"GradeShader",uniforms:{tDiffuse:{value:null},uTime:{value:0},uResolution:{value:new de(1,1)},uVignette:{value:vE},uAberration:{value:ME},uGrain:{value:bE}},vertexShader:["varying vec2 vUv;","void main() {","  vUv = uv;","  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);","}"].join(`
`),fragmentShader:["uniform sampler2D tDiffuse;","uniform float uTime, uVignette, uAberration, uGrain;","uniform vec2 uResolution;","varying vec2 vUv;","","float hash(vec2 p) {","  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);","}","","void main() {","  vec2 d = vUv - 0.5;","  float r2 = dot(d, d);","","  float k = uAberration * r2 * 2.0 / max(uResolution.x, 1.0);","  vec3 col;","  col.r = texture2D(tDiffuse, vUv + d * k).r;","  col.g = texture2D(tDiffuse, vUv).g;","  col.b = texture2D(tDiffuse, vUv - d * k).b;","","  col *= 1.0 - uVignette * pow(r2 * 2.0, 1.5);","","  col += (hash(vUv * uResolution + fract(uTime) * 137.0) - 0.5) * uGrain;","","  gl_FragColor = vec4(col, 1.0);","}"].join(`
`)},px="上午",mx=.38,gx=.76;function _u(i){let{container:e,data:t}=i;if(!e)throw new Error("createGame3D: 缺少 container");if(!t||!t.locations)throw new Error("createGame3D: 缺少 gamedata");let n=i.mode!=="mini",s;try{s=new rh({antialias:!0,powerPreference:"high-performance"})}catch(G){return i.onError?.(G instanceof Error?G:new Error(String(G))),EE()}s.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),s.outputColorSpace=xt,s.toneMapping=js,s.toneMappingExposure=gn.exposure,s.shadowMap.enabled=!0,s.shadowMap.type=$s,s.shadowMap.autoUpdate=!1,s.info.autoReset=!1,s.domElement.style.display="block",s.domElement.style.width="100%",s.domElement.style.height="100%",e.appendChild(s.domElement);let r=null,a=null,o=null,l=null,c=new Fa;c.background=new Pe(gn.sky),c.fog=new Ua(gn.fog.color,gn.fog.density);let u=new eo(gn.hemi.sky,gn.hemi.ground,gn.hemi.intensity);c.add(u);let d=new Ks(gn.sun.color,gn.sun.intensity);d.position.set(...gn.sun.pos),d.castShadow=!0,d.shadow.mapSize.set(gn.sun.shadowSize,gn.sun.shadowSize),d.shadow.camera.near=1,d.shadow.camera.far=110;let f=gn.sun.frustum;d.shadow.camera.left=-f,d.shadow.camera.right=f,d.shadow.camera.top=f,d.shadow.camera.bottom=-f,d.shadow.bias=-9e-4,d.shadow.normalBias=.022,d.shadow.radius=3,c.add(d),c.add(d.target);let h=new P(gn.sun.pos[0],gn.sun.pos[1],gn.sun.pos[2]).normalize(),m=34,x=new io(gn.ambient.color,gn.ambient.intensity);c.add(x);let p=px;function g(G){if(!G)return;let ne=pE[G];if(!ne)return;p=G,d.color.set(ne.sunColor),d.position.set(...ne.sunPos),h.set(ne.sunPos[0],ne.sunPos[1],ne.sunPos[2]).normalize(),d.intensity=ne.sunIntensity,x.color.set(ne.ambColor),x.intensity=ne.ambIntensity,u.color.set(ne.hemSky),u.groundColor.set(ne.hemGround),u.intensity=ne.hemIntensity,c.fog.color.set(ne.fogColor),c.fog.density=ne.fogDensity,c.background=new Pe(ne.skyColor),s.toneMappingExposure=ne.exposure;let ue=mE(s,G,ne);ue&&(c.environment=ue,c.environmentIntensity=ne.env?ne.env.intensity:1),o&&(o.enabled=G==="夜间")}g(px),J0(),ph();let y=rp();yh(y),typeof window<"u"&&(window.__assetLoader=y);let M=[["roads","light-square"],["roads","light-square-double"],["roads","light-curved"],["roads","construction-barrier"],["roads","construction-cone"],["roads","dumpster"],["roads","electricity-pole"],["industrial","detail-tank"],["industrial","detail-tank-large"],["industrial","chimney-medium"],["industrial","water-tower"],["industrial","shipping-container-a"],["commercial","detail-awning"],["commercial","detail-awning-wide"],["commercial","detail-parasol-a"]],_=["rollershutter-door","rollershutter-window-1","fire-hydrant","metal-gutter","fire-escape","electricity-poles","chainlink-fence","road-barrier","road-barrier-2"],b=[["hero","qilou"],["hero","old_apartment"],["hero","lingnan_temple"],["stall","dapaidang"],["stall","market_stall"]],S=new jh(c,[],new P(0,0,10)),R=new da(c),v=new Ce;v.userData.noMerge=!0,c.add(v);let w=[],A=new Map;function L(G,ne){let ue=G+"|"+ne;if(A.has(ue))return A.get(ue);let Oe=28,Qe=document.createElement("canvas"),Mt=Qe.getContext("2d"),At='600 44px "PingFang SC","Microsoft YaHei",sans-serif';Mt.font=At;let dt=Math.ceil(Mt.measureText(G).width)+Oe*2,xn=84;Qe.width=dt,Qe.height=xn;let Gt=Qe.getContext("2d");Gt.fillStyle="rgba(18,20,22,0.78)";let qt=18;Gt.beginPath(),Gt.moveTo(qt,0),Gt.lineTo(dt-qt,0),Gt.quadraticCurveTo(dt,0,dt,qt),Gt.lineTo(dt,xn-qt),Gt.quadraticCurveTo(dt,xn,dt-qt,xn),Gt.lineTo(qt,xn),Gt.quadraticCurveTo(0,xn,0,xn-qt),Gt.lineTo(0,qt),Gt.quadraticCurveTo(0,0,qt,0),Gt.closePath(),Gt.fill(),Gt.font=At,Gt.fillStyle=ne||"#f2efe8",Gt.textBaseline="middle",Gt.fillText(G,Oe,xn/2+2);let $n=new pn(Qe);return $n.colorSpace=xt,A.set(ue,$n),$n}let D={ok:"#d9f2cf",warn:"#ffd6a5",bad:"#ffb3a7"};function H(G,ne={}){if(!G)return;let ue=ne.color||D[ne.kind]||"#f2efe8",Oe=L(String(G),ue),Qe=Oe.image.width/Oe.image.height||4,Mt=.5,At=new vs({map:Oe,transparent:!0,depthTest:!1}),dt=new Ws(At);dt.scale.set(Mt*Qe,Mt,1),dt.position.set(S.pos.x,S.pos.y+2.35+w.length*.62,S.pos.z),v.add(dt),w.push({sp:dt,t:0,life:ne.life||2.6,y0:dt.position.y})}function N(G){for(let ne=w.length-1;ne>=0;ne--){let ue=w[ne];ue.t+=G;let Oe=ue.t/ue.life;ue.sp.position.y=ue.y0+Oe*.5,ue.sp.material.opacity=Oe<.6?1:Math.max(0,1-(Oe-.6)/.4),ue.t>=ue.life&&(v.remove(ue.sp),ue.sp.material.dispose(),w.splice(ne,1))}}let z=new sn(46,1,.5,250),V=new Jh(z,S.pos,[]),J=n,ae=[];function Y(G,ne){return r.addPass(ne),ae.push({kind:G,pass:ne}),ne}J&&(r=new pu(s),Y("render",new mu(c,z)),a=Y("gtao",new pa(c,z,1,1)),a.output=pa.OUTPUT.Default,a.blendIntensity=gE,o=Y("bloom",new ma(new de(1,1),xE,yE,_E)),o.enabled=!1,l=Y("grade",new fa(SE)),l.material.toneMapped=!1,Y("output",new yu),o.enabled=p==="夜间");let B=null,re=null,Ee=null,Te=!1,ht=0,Ze=0,it=!1,Z=0,ee=new Set;function ye(){let G=e.clientWidth||1,ne=e.clientHeight||1;if(z.aspect=G/ne,z.updateProjectionMatrix(),s.setSize(G,ne,!1),r){r.setSize(G,ne);let ue=s.getPixelRatio();a.setSize(Math.max(1,Math.floor(G*ue*Ip)),Math.max(1,Math.floor(ne*ue*Ip))),l.uniforms.uResolution.value.set(G*ue,ne*ue)}}let ze=typeof ResizeObserver<"u"?new ResizeObserver(()=>ye()):null;ze?.observe(e),window.addEventListener("resize",ye);function we(G){let ne=G.target;if(!ne||!ne.tagName)return!1;let ue=ne.tagName.toLowerCase();return ue==="input"||ue==="textarea"||ue==="select"||ne.isContentEditable}function Ke(G){we(G)||!Te||!n||(ee.add(G.code),(G.code.startsWith("Arrow")||G.code==="Space")&&G.preventDefault(),G.code==="KeyE"&&(G.preventDefault(),O()),G.code)}function Ft(G){ee.delete(G.code)}function je(){ee.clear()}n&&(window.addEventListener("keydown",Ke),window.addEventListener("keyup",Ft),window.addEventListener("blur",je));let at=4,mt=.25,Je=1.35,gt=!1,Pt=null,Kt=0,_t=0,Tt=0,U=null;function Xt(G){G.button!==0&&G.pointerType==="mouse"||(gt=!0,Pt=G.pointerId,Kt=0,_t=G.clientX,Tt=G.clientY,U={x:G.clientX,y:G.clientY},e.setPointerCapture?.(G.pointerId),e.classList.add("is-dragging"))}function ct(G){if(!gt||G.pointerId!==Pt)return;let ne=G.clientX-_t,ue=G.clientY-Tt;Kt+=Math.abs(ne)+Math.abs(ue),_t=G.clientX,Tt=G.clientY,!(Kt<at)&&(U=null,V.yaw-=ne*.006,V.pitch=Math.max(mt,Math.min(Je,V.pitch+ue*.004)))}function C(G){if(G.pointerId===Pt&&(gt=!1,Pt=null,e.releasePointerCapture?.(G.pointerId),e.classList.remove("is-dragging"),U)){let ne=W(U.x,U.y);U=null,ne&&(Ee=ne,i.onInteract?.(ne))}}function E(){V.yaw=mx,V.pitch=gx}n&&(e.addEventListener("pointerdown",Xt),e.addEventListener("pointermove",ct),e.addEventListener("pointerup",C),e.addEventListener("pointercancel",C),e.addEventListener("dblclick",E));let k=new P;function W(G,ne){if(!B)return null;let ue=e.getBoundingClientRect(),Oe=G-ue.left,Qe=ne-ue.top,Mt=null,At=46;for(let dt of B.hotspots){if(k.set(dt.x,1.4,dt.z).project(z),k.z>1)continue;let xn=(k.x*.5+.5)*ue.width,Gt=(-k.y*.5+.5)*ue.height,qt=Math.hypot(xn-Oe,Gt-Qe);qt<At&&(At=qt,Mt=dt)}return Mt}let K=null;function ce(){K&&clearInterval(K);let G=0;K=setInterval(()=>{let ne=ia();Z+=ne,G++,(sa()===0||G>=40)&&(clearInterval(K),K=null)},250)}function me(G){G&&(hg(G.group),G.group.traverse(ne=>{ne.isMesh&&ne.geometry&&!ne.userData.glbSourced&&ne.geometry.dispose()}),c.remove(G.group))}let Q=14,te=[],pe=[],Ie={total:0,groups:0,meshes:0};function ge(G){if(te=[],Ie={total:0,groups:0,meshes:0},!G)return;G.updateMatrixWorld(!0);let ne=new P;G.traverse(ue=>{Ie.total++,ue.isGroup&&Ie.groups++,ue.isMesh&&Ie.meshes++;let Oe=ue.userData&&ue.userData.lampHead;Oe&&(ne.set(Oe.x,Oe.y,Oe.z),ue.localToWorld(ne),te.push({x:ne.x,y:ne.y,z:ne.z,bulb:ue.userData.lampBulb||null}))})}function fe(G,ne){for(let Oe of pe)c.remove(Oe);pe=[];for(let Oe of te)Oe.bulb&&Oe.bulb.material&&(Oe.bulb.material.opacity=G?.95:.5,Oe.bulb.material.color.set(G?16763274:15259816));if(!G||!te.length)return;let ue=te.slice();if(ne){let Oe=Qe=>(Qe.x-ne.x)*(Qe.x-ne.x)+(Qe.z-ne.z)*(Qe.z-ne.z);ue.sort((Qe,Mt)=>Oe(Qe)-Oe(Mt))}for(let Oe of ue.slice(0,Q)){let Qe=new Ys(16756838,24,18,2);Qe.position.set(Oe.x,Oe.y,Oe.z),c.add(Qe),pe.push(Qe)}}function Le(G,ne){if(!t.locations[G])return i.onError?.(new Error(`未知地点: ${G}`)),null;let ue=performance.now();me(B),B=Xh(c,t,G),R.setWorld({id:G,layout:B.stats.layout,streetLen:B.streetLen,roadW:B.roadW,laneHalf:B.laneHalf,tier:B.stats.tier,footfall:B.meta&&typeof B.meta.footfall=="number"?B.meta.footfall:.6,colliders:B.colliders,anchors:B.anchors,wires:B.wires,npcs:ne&&ne.npcs||[]}),c.userData.wires=B.wires,c.userData.__colliders=B.colliders,c.userData.__anchors=B.anchors,c.userData.__corridor=B.corridor||0,c.userData.__carClearance=B.carClearance||0;let Oe=ia();Z+=Oe,ce(),ge(B.group);let Qe=jg(B.group),Mt=lp(B.group);fe(p==="夜间",V.cur),S.setWorld({colliders:B.colliders,spawn:B.spawn,bounds:B.bounds}),V.setWorld({colliders:B.blockers,target:B.spawn,...B.camera}),V.cur.copy(B.spawn),V.apply(V.cur),n||(V.dist=Math.min(34,V.dist+9),V.apply(V.cur));let At=B.spawn,dt=S.radius,xn=B.colliders.filter($n=>At.x>$n.minX-dt&&At.x<$n.maxX+dt&&At.z>$n.minZ-dt&&At.z<$n.maxZ+dt).length;Ee=null,i.onFocus?.(null),re=G;let Gt=Math.round(performance.now()-ue),qt={id:G,ms:Gt,tris:Mt.tris,spawnBlocked:xn,meshes:{before:Qe.before,after:Qe.after},hotspots:B.hotspots.length,colliders:B.colliders.length,assets:{replaced:Oe,pending:sa(),report:y.report()}};return i.onBuild?.(qt),Ne=qt,B}let Ne=null;function We(){if(!B)return null;let G=null,ne=1/0;for(let ue of B.hotspots){let Oe=Math.hypot(S.pos.x-ue.x,S.pos.z-ue.z);Oe<ue.radius&&Oe<ne&&(ne=Oe,G=ue)}return G}function O(){Ee&&i.onInteract?.(Ee)}function _e(G){let ne=B?.hotspots[G];ne&&(Ee=ne,i.onInteract?.(ne))}function ie(G){if(!Te)return;ht=requestAnimationFrame(ie);let ne=Math.min(.05,Math.max(0,(G-Ze)/1e3));Ze=G,s.info.reset(),S.update(ne,ee,V.yaw),V.update(ne,S.pos),R.update(ne,S.pos),N(ne),d.position.set(S.pos.x+h.x*m,h.y*m,S.pos.z+h.z*m),d.target.position.set(S.pos.x,0,S.pos.z),d.target.updateMatrixWorld(),l&&(l.uniforms.uTime.value=G*.001);let ue=We();if(ue!==Ee&&(Ee=ue,i.onFocus?.(Ee||null)),B){let Qe=G*.0016;for(let Mt of B.hotspots){let At=Mt.object?.userData?.hotspot;if(!At)continue;let dt=Mt===Ee,xn=(dt?1.18:1)+Math.sin(Qe*2+Mt.x)*.05;At.ring?.scale.setScalar(xn),At.sprite&&(At.sprite.position.y=2.15+Math.sin(Qe*1.7+Mt.z)*.09,At.sprite.material.opacity=dt?1:.72)}}s.shadowMap.needsUpdate=!0,r?r.render():s.render(c,z),ve++;let Oe=(G-oe)/1e3;Oe>=.5&&(xe=Math.round(ve/Oe),oe=G,ve=0)}let xe=0,ve=0,oe=0;function He(){if(!Te&&(Te=!0,ye(),Ze=performance.now(),oe=Ze,ve=0,ht=requestAnimationFrame(ie),!it)){it=!0;let G=y.warm(M),ne=typeof y.warmPolyHaven=="function"?y.warmPolyHaven(_):Promise.resolve(0),ue=typeof y.warmAi=="function"?y.warmAi(b):Promise.resolve(0),Oe=(Qe,Mt)=>{let At=ia();Z+=At;let dt=B?lp(B.group):null;return dt&&Ne&&(Ne.tris=dt.tris),i.onAssets?.({loaded:Mt,replaced:At,report:y.report(),source:Qe}),At};G.then(Qe=>Oe("kenney",Qe)),ne.then(Qe=>Oe("polyhaven",Qe)),ue.then(Qe=>Oe("ai",Qe)),ce()}}function De(){Te=!1,cancelAnimationFrame(ht),ee.clear()}function Rt(){De(),K&&(clearInterval(K),K=null),R.dispose(),me(B),ze?.disconnect(),window.removeEventListener("resize",ye),n&&(window.removeEventListener("keydown",Ke),window.removeEventListener("keyup",Ft),window.removeEventListener("blur",je),e.removeEventListener("pointerdown",Xt),e.removeEventListener("pointermove",ct),e.removeEventListener("pointerup",C),e.removeEventListener("pointercancel",C),e.removeEventListener("dblclick",E),e.classList.remove("is-dragging")),s.dispose(),s.domElement.remove(),a?.dispose(),o?.dispose(),l?.dispose(),r?.dispose(),r=null,a=null,o=null,l=null,ae.length=0}return{loadLocation:Le,start:He,stop:De,dispose:Rt,resize:ye,interact:O,interactHotspot:_e,zoom:G=>V.zoom(G),resetView(){V.yaw=mx,V.pitch=gx,V.apply(V.cur)},get view(){return{yaw:V.yaw,pitch:V.pitch,dist:V.dist}},setTimeSlot(G){g(G),fe(G==="夜间",V.cur)},get timeSlot(){return p},notify:(G,ne)=>H(G,ne),get actors(){return{counts:R.stats,layout:B?B.stats.layout:null,layoutHalf:B&&(B.laneHalf||B.roadW/2)||null,anchors:B&&B.anchors?B.anchors.length:0,anchorPushed:B&&B.anchorPushed||0,anchorStuck:B&&B.anchorStuck||0,corridor:B&&B.corridor||0,carClearance:B&&B.carClearance||0,corridorClamped:B&&B.corridorClamped||0,corridorPushed:B&&B.corridorPushed||0,corridorStuck:B&&B.corridorStuck||0,colliders:R.colliders.length,pushedSpawns:R.pushedSpawns,stuckSpawns:R.stuckSpawns,shadowOn:R.shadowOnCount,shadowOff:R.shadowOffCount,shadowTotal:R.shadowTotal}},__probeSpawnResolve(G,ne,ue=.3){let Oe=new Dt;Oe.position.set(G,0,ne);let Qe=R._blocked(G,ne,ue),Mt=R.pushedSpawns,At=R.stuckSpawns,dt=!1;try{dt=R._resolveSpawn(Oe,ue)}finally{R.pushedSpawns=Mt,R.stuckSpawns=At}return{blocked0:Qe,moved:dt,blocked1:R._blocked(Oe.position.x,Oe.position.z,ue),x:Oe.position.x,z:Oe.position.z}},__probeBlocked(G,ne,ue=.3){let Oe=R._nearColliders(G,ne)||[],Qe=[];for(let Mt of Oe)G>Mt.minX-ue&&G<Mt.maxX+ue&&ne>Mt.minZ-ue&&ne<Mt.maxZ+ue&&Qe.push(Mt.tag||"untagged");return{sysBlocked:R._blocked(G,ne,ue),tags:Qe,near:Oe.length}},__setShadowLod(G){if(R.shadowLod=!!G,!G)for(let ne of R.actors){let ue=ne.obj.userData.__shadowParts;if(!(!ue||!ue.length)){for(let Oe=0;Oe<ue.length;Oe++)ue[Oe].castShadow=!0;ne._shadowOn=!0}}return R.shadowLod},get namedIds(){return R.namedIds},setNamedNpcs:G=>R.setNamedNpcs(G),get assets(){return{pending:sa(),replacedTotal:Z,report:y.report(),warmList:M.length,warmListPolyHaven:_.length,polyHavenGroups:()=>{let G=Zh(),ne=new Map;for(let ue of G)ne.set(ue.name,!0);return["detail","structure","road","facade"].filter(ue=>$h(ue).length>0)},polyHavenGroup:G=>$h(G),listPolyHaven:()=>Zh(),listHdri:()=>op()}},get locationId(){return re},get hotspot(){return Ee},get hotspots(){return B?B.hotspots:[]},get playerPos(){return{x:S.pos.x,z:S.pos.z}},get cameraPos(){return{x:z.position.x,y:z.position.y,z:z.position.z}},get notices(){return w.length},get stats(){return{fps:xe,calls:s.info.render.calls,triangles:s.info.render.triangles,build:Ne,lampAnchors:te.length,lamps:pe.length,lampScan:Ie,postFx:r?{order:ae.map(G=>G.kind),count:r.passes.length,aoScale:Ip,bloomEnabled:!!(o&&o.enabled),aoSize:a?[a.width,a.height]:null,canvasSize:[s.domElement.width,s.domElement.height],shape:{gtao:!!(a&&a.gtaoMaterial),bloom:!!(o&&o.renderTargetBright),grade:!!(l&&l.uniforms&&l.uniforms.uVignette),output:r.passes.some(G=>G&&"_toneMapping"in G)}}:null,sun:{dir:[Number(h.x.toFixed(4)),Number(h.y.toFixed(4)),Number(h.z.toFixed(4))],dist:m,radius:d.shadow.radius,autoUpdate:s.shadowMap.autoUpdate,type:s.shadowMap.type}}},teleport(G,ne){S.pos.set(G,0,ne),V.cur.set(G,0,ne),V.apply(V.cur)},key(G,ne=!0){if(G==="KeyE"&&ne){O();return}ne?ee.add(G):ee.delete(G)},get scene(){return c},get camera(){return z}}}function EE(){let i=()=>{};return{loadLocation:()=>null,start:i,stop:i,dispose:i,resize:i,interact:i,interactHotspot:i,zoom:i,teleport:i,key:i,resetView:i,view:{yaw:0,pitch:0,dist:0},locationId:null,hotspot:null,hotspots:[],playerPos:{x:0,z:0},stats:{fps:0,calls:0,triangles:0,build:null,postFx:null,sun:null},scene:null,camera:null}}var xx=[{key:"hunger",label:"饱腹",icon:"🍚",invert:!1},{key:"hygiene",label:"卫生",icon:"🚿",invert:!1},{key:"clothing",label:"衣物整洁",icon:"👕",invert:!1},{key:"foodSatisfaction",label:"食物满足感",icon:"🍜",invert:!1},{key:"happiness",label:"情绪",icon:"🙂",invert:!1},{key:"health",label:"健康",icon:"❤️",invert:!1,from:"status"}];function yx(i,e){let t=e?100-i:i;return t>=55?"ok":t>=25?"warn":"bad"}function wE(i,e){let t=null;try{typeof computeMindset=="function"&&(t=computeMindset)}catch{}if(!t){let a=typeof globalThis<"u"?globalThis:null;a&&typeof a.computeMindset=="function"&&(t=a.computeMindset)}if(t&&i)try{let a=t({needs:i,status:e});if(typeof a=="number"&&isFinite(a))return Math.max(0,Math.min(100,a))}catch{}if(!i)return null;let n=[],s=a=>{typeof a=="number"&&isFinite(a)&&n.push(Math.max(0,Math.min(100,a)))};s(i.hunger),s(i.hygiene),s(i.clothing),s(i.foodSatisfaction),s(i.happiness);let r=typeof i.fatigue=="number"&&isFinite(i.fatigue)?i.fatigue:0;return s(100-Math.max(0,Math.min(100,r))),n.length?Math.round(n.reduce((a,o)=>a+o,0)/n.length):null}function vu(i={}){let e=document.createElement("div");e.className="s3h",e.innerHTML=`
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
  `;let t=h=>e.querySelector(`[data-f="${h}"]`),n={day:t("day"),slot:t("slot"),weather:t("weather"),locIcon:t("locIcon"),locName:t("locName"),cash:t("cash"),debt:t("debt"),vitals:t("vitals"),apText:t("apText"),apFill:t("apFill"),prompt:t("prompt"),tray:t("tray"),trayTitle:t("trayTitle"),trayToggle:t("trayToggle"),trayBody:t("trayBody"),toasts:t("toasts"),map:t("map"),mapList:t("mapList"),mapSearch:t("mapSearch"),mapClose:t("mapClose")};n.vitals.innerHTML=`
    <div class="s3h-vital s3h-mindset" data-k="mindset" title="心态（派生：综合生理值 + 睡眠）">
      <span class="s3h-vital-icon">🧭</span>
      <span class="s3h-vital-bar"><i></i></span>
      <span class="s3h-vital-num">—</span>
    </div>`+xx.map(h=>`
    <div class="s3h-vital" data-k="${h.key}" title="${h.label}">
      <span class="s3h-vital-icon">${h.icon}</span>
      <span class="s3h-vital-bar"><i></i></span>
      <span class="s3h-vital-num">0</span>
    </div>`).join("")+`
    <div class="s3h-fatigue" data-f="fatigue"></div>`;let s=h=>(h._fill=h.querySelector(".s3h-vital-bar i"),h._num=h.querySelector(".s3h-vital-num"),h._track=h.querySelector(".s3h-vital-bar"),h),r=h=>Math.max(0,Math.min(100,h)),a=(h,m,x)=>{h._fill.style.width=m+"%",h._fill.dataset.tone=yx(m,x),h._num.textContent=Math.round(m),h.dataset.tone=yx(m,x)},o=xx.map(h=>({spec:h,row:s(n.vitals.querySelector(`[data-k="${h.key}"]`))})),l=s(n.vitals.querySelector('[data-k="mindset"]')),c=n.vitals.querySelector('[data-f="fatigue"]'),u=!1,d=!1,f={el:e,setTop({day:h,slot:m,weather:x,cash:p,debt:g,locIcon:y,locName:M}){if(h!=null&&(n.day.textContent=`第 ${h} 天`),m!=null&&(n.slot.textContent=m),x!=null&&(n.weather.textContent=x?` · ${x}`:""),M!=null&&(n.locName.textContent=M),y!=null&&(n.locIcon.textContent=y||"📍"),p!=null&&(n.cash.textContent=`¥${Math.round(p).toLocaleString("zh-CN")}`),g!=null){let _=Number(g)>0;n.debt.hidden=!_,_&&(n.debt.textContent=`欠 ¥${Math.round(g).toLocaleString("zh-CN")}`)}},setNeeds(h,m){for(let{spec:g,row:y}of o){let M=g.from==="status"?m:h;if(!M)continue;let _=M[g.key];typeof _=="number"&&a(y,r(_),g.invert)}let x=h&&typeof h.fatigue=="number"?h.fatigue:null;x!=null?(c.textContent=`疲劳系数 ${Math.round(r(x))} · 影响恢复速度`,c.style.display="block"):c.style.display="none";let p=wE(h,m);p!=null&&a(l,p,!1)},setAP(h,m){let x=m||100;n.apText.textContent=`${Math.round(h)} / ${Math.round(x)}`,n.apFill.style.width=Math.max(0,Math.min(100,h/x*100))+"%",n.apFill.dataset.tone=h/x>=.25?"ok":"bad"},setPrompt(h){if(!h){n.prompt.hidden=!0;return}n.prompt.innerHTML=`<kbd>E</kbd><span>${h.icon||""} ${h.label||""}</span>`+(h.hint?`<em>${h.hint}</em>`:""),n.prompt.hidden=!1},setActions(h,m){if(!h||!h.length){n.trayBody.innerHTML='<div class="s3h-empty">此刻这里没有可做的事，换个地方看看。</div>';return}n.trayBody.innerHTML=h.map((x,p)=>{let g=x.kind?`<span class="s3h-chip">${x.kind}</span>`:"",y=x.cost?`<span class="s3h-cost">${x.cost}</span>`:"";return`
        <button type="button" class="s3h-act${x.disabled?" is-off":""}" data-i="${p}"
                ${x.disabled?"disabled":""} title="${x.reason||x.desc||""}">
          <span class="s3h-act-icon">${x.icon||"•"}</span>
          <span class="s3h-act-main">
            <span class="s3h-act-name">${x.name}</span>
            ${x.desc?`<span class="s3h-act-desc">${x.desc}</span>`:""}
            ${x.disabled&&x.reason?`<span class="s3h-act-reason">${x.reason}</span>`:""}
          </span>
          ${g}${y}
        </button>`}).join(""),n.trayBody.querySelectorAll(".s3h-act").forEach(x=>{x.addEventListener("click",()=>{let p=h[Number(x.dataset.i)];p&&!p.disabled&&m(p)})})},toggleTray(h){return u=h==null?!u:!!h,n.tray.classList.toggle("is-open",u),n.trayToggle.textContent=u?"收起":"展开",u},setLocations(h,m){let x=(p="")=>{let g=p.trim().toLowerCase(),y=g?h.filter(M=>`${M.name} ${M.desc||""}`.toLowerCase().includes(g)):h;n.mapList.innerHTML=y.length?y.map(M=>`<button type="button" class="s3h-loc" data-id="${M.id}">
              <span class="s3h-loc-icon">${M.icon||"📍"}</span>
              <span class="s3h-loc-name">${M.name}</span>
            </button>`).join(""):'<div class="s3h-empty">没有匹配的地点</div>',n.mapList.querySelectorAll(".s3h-loc").forEach(M=>{M.addEventListener("click",()=>{f.toggleMap(!1),m(M.dataset.id)})})};x(""),n.mapSearch.addEventListener("input",()=>x(n.mapSearch.value))},toggleMap(h){return d=h==null?!d:!!h,n.map.hidden=!d,d&&n.mapSearch.focus(),d},get mapOpen(){return d},get trayOpen(){return u},notify(h,m="ok"){if(typeof i.onToast=="function")try{if(i.onToast(h,m)===!0)return}catch(p){typeof console<"u"&&console.warn("[hud] 场景提醒失败，退回 DOM：",p)}let x=document.createElement("div");x.className=`s3h-toast is-${m}`,x.textContent=h,n.toasts.appendChild(x),setTimeout(()=>x.classList.add("is-out"),2400),setTimeout(()=>x.remove(),3e3)},destroy(){e.remove()}};return n.trayToggle.addEventListener("click",()=>f.toggleTray()),n.mapClose.addEventListener("click",()=>f.toggleMap(!1)),n.map.addEventListener("click",h=>{h.target===n.map&&f.toggleMap(!1)}),f.toggleTray(!1),f}function _x(i={}){let{container:e,data:t,readHUD:n,readActions:s,readLocations:r,onAction:a,onTravel:o,onNotice:l,onExit:c}=i;if(!e)throw new Error("create3DShell: 缺少 container");let u=document.createElement("div");u.className="s3s3d";let d=document.createElement("div");d.className="s3s3d-stage",u.appendChild(d),e.appendChild(u);let f=vu({onToast:(v,w)=>!h||typeof h.notify!="function"?!1:(h.notify(v,{kind:w}),!0)});u.appendChild(f.el);let h=null,m=null,x=!1,p="";function g(v){if(!h||!v||!v.locId||v.locId!==m)return;let w=v.locId+"@"+(v.slot||"");w!==p&&(p=w,h.setNamedNpcs(v.npcs||[]))}function y(){return h||(h=_u({container:d,data:t,mode:"full",onInteract:v=>{let w=a?.(v);w&&w.ok===!1?f.notify(w.reason||"这一步现在做不了","warn"):w&&w.message&&f.notify(w.message,"ok")},onFocus:v=>f.setPrompt(v),onError:v=>f.notify("3D 不可用："+(v&&v.message?v.message:v),"bad")}),h)}function M(){try{if(n){let v=n();v&&(v.locId&&v.locId!==m&&h&&h.loadLocation(v.locId,{npcs:v.npcs})&&(m=v.locId,p=v.locId+"@"+(v.slot||""),r&&f.setLocations(r()||[],b)),f.setTop(v),f.setNeeds(v.needs,v.status),v.ap&&f.setAP(v.ap.cur,v.ap.max),v.slot&&h&&h.setTimeSlot(v.slot),g(v))}if(s){let v=s()||[];f.setActions(v,w=>{let A=a?.(w);A&&A.ok===!1?f.notify(A.reason||"这一步现在做不了","warn"):M()})}}catch(v){f.notify("状态刷新失败："+(v&&v.message?v.message:v),"bad")}}function _(v,w){let L=y().loadLocation(v,w);return L?(m=v,p="",L):null}function b(v){if(!v||v===m)return;let w=o?.(v);if(w&&w.ok===!1){f.notify(w.reason||"去不了那里","warn");return}let A=n?n():null;(!A||!A.locId)&&_(v),M(),f.notify("已到达："+(S(v)?.name||v),"ok")}function S(v){let w=r&&r()||[];for(let A of w)if(A.id===v)return A;return null}function R(v){let w=v.target,A=!!(w&&w.tagName&&/^(INPUT|TEXTAREA|SELECT)$/.test(w.tagName))||w&&w.isContentEditable,L=v.code==="Escape"||v.code==="Tab"||v.code==="KeyM";if(!(A&&!L))if(v.code==="Tab")v.preventDefault(),v.stopPropagation(),f.toggleTray();else if(v.code==="KeyM")v.preventDefault(),v.stopPropagation(),f.toggleMap();else if(v.code==="Escape")if(f.mapOpen){v.preventDefault();let D=document.querySelector("#scene3d-first .s3h-map-search");D&&document.activeElement===D&&D.blur(),f.toggleMap(!1)}else f.trayOpen&&(v.preventDefault(),f.toggleTray(!1));else v.code==="KeyR"&&(v.stopPropagation(),y().resetView())}return{el:u,hud:f,start(){if(x)return;x=!0;let v=y();return v.start(),r&&f.setLocations(r()||[],b),window.addEventListener("keydown",R,!0),window.addEventListener("resize",()=>v.resize()),M(),this},stop(){x=!1,window.removeEventListener("keydown",R,!0),h?.stop()},dispose(){this.stop(),h?.dispose(),h=null,f.destroy(),u.remove()},loadLocation:_,travel:b,refresh:M,resize(){h?.resize()},sync(){M()},notify(v,w){f.notify(v,w)},get locationId(){return m},get view3d(){return h},get stats(){return h?h.stats:null},get debug(){return{locationId:m,actions:f.el.querySelectorAll(".s3h-act").length,vitals:f.el.querySelectorAll(".s3h-vital").length,promptVisible:!f.el.querySelector('[data-f="prompt"]').hidden,view:h?h.view:null,timeSlot:h?h.timeSlot:null,tris:h?h.stats.triangles:0,calls:h?h.stats.calls:0,lampAnchors:h?h.stats.lampAnchors:0,lamps:h?h.stats.lamps:0,postFx:h?h.stats.postFx:null,sun:h?h.stats.sun:null,cameraDepth:h?{near:h.camera.near,far:h.camera.far}:null,assets:h?h.assets:null}},get assets(){return h?h.assets:null}}}var vx={generatedAt:"2026-09-19T10:47:14.652Z",source:"src/js/data/{locations,location_flavor,jobs,amenities,actions,goods}.js + src/js/phase1/actions_extra.js + src/js/core/illegal_actions.js",count:29,categoryLabels:{daily:"日用",food:"食品",luxury:"奢侈",clothing:"服装",electronics:"电子",scrap:"废品"},locations:{slum:{id:"slum",name:"城中村",icon:"🏘️",desc:"鱼龙混杂的城中村，房租便宜，机会也多。",type:"residential",wealthTier:1,footfall:.6,specialties:["scrap_metal","scrap_paper","scrap_plastic"],specialtyLabels:["废金属","废纸板","废塑料"],priceMod:{water:.9,snacks:.85,noodles:.8,scrap_metal:1.6,scrap_paper:1.5,scrap_plastic:1.5,daily_use:.7},priceModList:[{key:"water",value:.9,label:"瓶装水"},{key:"snacks",value:.85,label:"零食"},{key:"noodles",value:.8,label:"面条"},{key:"scrap_metal",value:1.6,label:"废金属"},{key:"scrap_paper",value:1.5,label:"废纸板"},{key:"scrap_plastic",value:1.5,label:"废塑料"},{key:"daily_use",value:.7,label:"日用品"}],dailyProbability:.4,flavor:["🐱 一只花猫从巷道里蹿出来，在你脚边蹭了蹭，咕噜噜地叫着。","👴 隔壁老李家传来咿咿呀呀的粤语歌声，是那首《月亮代表我的心》。",'👶 楼道里有孩子在追逐打闹，脚步声噔噔作响，大人在远处喊"慢点跑"。',"🍜 谁家飘出炒菜香，是葱炒鸡蛋的味道，让人突然觉得有些饿。","📱 斜对面阿姨对着手机大声视频通话，方言地道，笑声传出去很远。","🚲 楼道口停了一排共享单车，有两辆已经歪倒成了一堆，没人管。","☔ 屋顶漏出一道细流，房东说上周修，但已经说了好几周了。","🌃 夜里有人在走廊抽烟，橙红的烟头在黑暗里一明一灭。"],jobs:[{id:"waste_recycling",name:"废品回收",icon:"♻️",desc:"走街串巷收废纸板、废金属、废塑料，转手卖给回收站。脏活累活但门槛最低。",startupCost:0,risk:{injury:.01,illness:.005},payHint:{min:20,max:55,text:`payCalc(state) {
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
    }`}}],amenities:[{id:"slum_canteen",name:"城中村小食堂",icon:"🍚",type:"food",tier:1,cost:6,ap:5,desc:"6块钱管饱，油大盐重，凑合一顿。",primary:{hunger:30},junkFood:!0,lateNight:!1},{id:"slum_publicbath",name:"城中村公共澡堂",icon:"🛁",type:"bath",tier:1,cost:8,ap:8,desc:"热水管够，人多点，但便宜。",primary:{hygiene:35},junkFood:!1,lateNight:!1},{id:"slum_chesssquare",name:"城中村棋牌摊",icon:"♟️",type:"fun",tier:1,cost:5,ap:10,desc:"和大爷下两盘象棋，赢了请烟，输了听吹牛。",primary:{happiness:20},junkFood:!1,lateNight:!1},{id:"slum_napshop",name:"城中村钟点房",icon:"🛏️",type:"rest",tier:1,cost:10,ap:12,desc:"5块钱一小时，简陋但能躺平。",primary:{fatigue:-28},junkFood:!1,lateNight:!1}],actions:[],actionsExtra:[{id:"internet_bar",name:"网吧上网",desc:"花 5 块在网吧上 2 小时网，可以查资料、刷视频、玩游戏。",icon:"💻",apCost:20,payEstimate:"智力+0.3, 随机技能XP",costEstimate:5,hint:"去网吧、城中村、商业区或科技园"},{id:"salon_chat",name:"路边理发店聊天",desc:"花 10 块剪个头发，顺便听听老板吹牛。需要敏捷≥18才能帮上忙。",icon:"💈",apCost:20,payEstimate:"心情+10",costEstimate:10,hint:"去城中村或商业区的理发店"}],illegal:[{id:"illegal_steal_battery",name:"偷电瓶",icon:"🔋",desc:"凌晨潜入小区车棚偷电动车电瓶。来钱快，但被保安或警察抓住就完蛋。",apCost:6,rewardRange:[80,180],catchProb:.4,moralityDelta:-15,penalty:{jailDays:2,fine:800}}],buy:[{id:"scrap_paper",name:"废纸板",unit:"斤",price:1.2,category:"scrap"},{id:"water",name:"瓶装水",unit:"瓶",price:1.4,category:"daily"},{id:"lettuce",name:"生菜",unit:"斤",price:2,category:"food"},{id:"corn",name:"玉米",unit:"根",price:2,category:"food"},{id:"onion",name:"洋葱",unit:"斤",price:2,category:"food"},{id:"garlic",name:"大蒜",unit:"斤",price:2,category:"food"},{id:"scrap_plastic",name:"废塑料",unit:"斤",price:2.3,category:"scrap"},{id:"vegetables",name:"蔬菜",unit:"斤",price:3,category:"food"},{id:"tofu",name:"豆腐",unit:"块",price:3,category:"food"},{id:"ginger",name:"生姜",unit:"斤",price:3,category:"food"},{id:"instant_noodles",name:"方便面",unit:"袋",price:4,category:"food"},{id:"scrap_metal",name:"废金属",unit:"斤",price:4,category:"scrap"},{id:"fruits",name:"水果",unit:"斤",price:6,category:"food"},{id:"daily_use",name:"日用品",unit:"件",price:7,category:"daily"},{id:"second_hand_book",name:"二手书",unit:"本",price:15,category:"books"},{id:"clothing",name:"二手衣物",unit:"件",price:25,category:"clothing"}],sell:[{id:"cold_medicine",name:"感冒药",unit:"盒",price:20,category:"medicine"}],vendingNote:"本地居民为主，消费力弱"},wholesaleMarket:{id:"wholesaleMarket",name:"批发市场",icon:"🏪",desc:"各种商品批发的集散地，进货的天堂。",type:"commercial",wealthTier:2,footfall:.9,specialties:[],specialtyLabels:[],priceMod:{water:.8,snacks:.78,noodles:.75,cigarettes:.85,beer:.82,clothing:.8,electronics:.8,fruits:.75,vegetables:.75},priceModList:[{key:"water",value:.8,label:"瓶装水"},{key:"snacks",value:.78,label:"零食"},{key:"noodles",value:.75,label:"面条"},{key:"cigarettes",value:.85,label:"香烟"},{key:"beer",value:.82,label:"啤酒"},{key:"clothing",value:.8,label:"二手衣物"},{key:"electronics",value:.8,label:"小电子产品"},{key:"fruits",value:.75,label:"水果"},{key:"vegetables",value:.75,label:"蔬菜"}],dailyProbability:1,flavor:["🔊 广播喇叭正在播报今日行情：'生姜价格上浮两成！赶紧进货！'","🤝 两个批发商在货堆前激烈讨价还价，嗓门大得整条街都能听见。","🚛 一辆满载货物的大卡车正在倒车，工人们四散躲避，指挥声此起彼伏。","📦 地上散落着被踩扁的纸箱，一个清洁工费力地把它们叠起来。","👃 各种气味混在一起：水果香、海鲜腥、纸箱霉味……早已分不清哪个是哪个。","💼 一个外省口音的中年男人正在向摊主批量询价，手里拿着个小本子记着。","🌅 最早的一批摊主天不亮就来了，现在正疲惫地端着保温杯小口喝茶。"],jobs:[{id:"wholesale_delivery",name:"批发配送",icon:"🚚",desc:"帮批发商送货上门。需要会开车，体力好，收入稳定。",startupCost:0,risk:{injury:.02},payHint:{min:50,max:90,text:`payCalc(state) {
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
        if (sta`}}],amenities:[{id:"commercial_restaurant",name:"商业区中餐馆",icon:"🍽️",type:"food",tier:3,cost:35,ap:8,desc:"荤素搭配，营养均衡，吃完精神百倍。",primary:{hunger:65,happiness:10},junkFood:!1,lateNight:!1},{id:"commercial_spa",name:"商业区高级SPA",icon:"🧖",type:"bath",tier:3,cost:50,ap:12,desc:"精油按摩+蒸桑拿，身心都得到净化。",primary:{hygiene:60,fatigue:-25,happiness:12},junkFood:!1,lateNight:!1},{id:"commercial_cinema",name:"商业区电影院",icon:"🎬",type:"fun",tier:3,cost:45,ap:12,desc:"IMAX 大片，爆米花配可乐，沉浸2小时不想出来。",primary:{happiness:45,fatigue:-10},junkFood:!1,lateNight:!1},{id:"commercial_bar",name:"商业区酒吧",icon:"🍸",type:"fun",tier:3,cost:70,ap:18,desc:"鸡尾酒、小食拼盘、霓虹灯光，但喝多明天难受。",primary:{happiness:50,fatigue:10,hunger:-10},junkFood:!0,lateNight:!0}],actions:[{id:"flyer_distribution",name:"商业区发传单",icon:"📄",desc:"在商业区帮商家发传单，收入稳定但枯燥。",apCost:20,payEstimate:"60~80"}],actionsExtra:[{id:"internet_bar",name:"网吧上网",desc:"花 5 块在网吧上 2 小时网，可以查资料、刷视频、玩游戏。",icon:"💻",apCost:20,payEstimate:"智力+0.3, 随机技能XP",costEstimate:5,hint:"去网吧、城中村、商业区或科技园"},{id:"salon_chat",name:"路边理发店聊天",desc:"花 10 块剪个头发，顺便听听老板吹牛。需要敏捷≥18才能帮上忙。",icon:"💈",apCost:20,payEstimate:"心情+10",costEstimate:10,hint:"去城中村或商业区的理发店"},{id:"gym",name:"办健身卡锻炼",desc:"去健身房办月卡，提升体质和敏捷。",icon:"🏋️",apCost:20,payEstimate:"体质+1, 敏捷+0.5",costEstimate:200,hint:"去体育馆、公园、商业区或娱乐城"},{id:"pharmacy",name:"买药/买营养品",desc:"去药房买维生素、补品等。需要 ¥30~80。",icon:"💊",apCost:20,payEstimate:"健康+5",costEstimate:30,hint:"去医院或商业区药房"},{id:"supermarket",name:"去超市采购",desc:"去超市买点吃的用的。需要 ¥30~60。",icon:"🛒",apCost:20,payEstimate:"饥饱+30, 卫生+",costEstimate:30,hint:"去商业区超市"},{id:"clothing",name:"买件新衣服",desc:"去服装店买件像样的衣服，提升卫生/心情/名气。",icon:"👕",apCost:20,payEstimate:"卫生+10, 名气+",costEstimate:80,hint:"去商业区服装店"}],illegal:[{id:"illegal_pickpocket",name:"🤏 扒窃",icon:"🤏",desc:"在商业区人潮中摸手机钱包。技术活，但被人赃并获就是拘留+罚款。",apCost:4,rewardRange:[40,120],catchProb:.3,moralityDelta:-12,penalty:{jailDays:1,fine:300}},{id:"illegal_shop_theft",name:"🏪 盗窃店铺",icon:"🏪",desc:"趁店员不注意顺走货架上的值钱商品。商业区机会多，但监控也多。",apCost:6,rewardRange:[100,300],catchProb:.45,moralityDelta:-18,penalty:{jailDays:2,fine:1e3}},{id:"illegal_scam",name:"🎭 碰瓷",icon:"🎭",desc:"在马路上故意被车蹭倒，讹司机赔偿。风险高，但成功来钱快。",apCost:5,rewardRange:[50,180],catchProb:.5,moralityDelta:-15,penalty:{jailDays:2,fine:800}}],buy:[{id:"scrap_plastic",name:"废塑料",unit:"斤",price:1.5,category:"scrap"},{id:"vitamins_item",name:"维生素",unit:"瓶",price:20,category:"medicine"}],sell:[{id:"electronics",name:"小电子产品",unit:"个",price:92,category:"electronics"},{id:"clothing",name:"二手衣物",unit:"件",price:28.7,category:"clothing"},{id:"duck",name:"鸭子",unit:"只",price:22,category:"food"},{id:"cold_medicine",name:"感冒药",unit:"盒",price:20,category:"medicine"},{id:"vitamins_item",name:"维生素",unit:"瓶",price:20,category:"medicine"},{id:"shrimp",name:"虾",unit:"斤",price:20,category:"food"},{id:"cigarettes",name:"香烟",unit:"包",price:17.3,category:"luxury"},{id:"second_hand_book",name:"二手书",unit:"本",price:15,category:"books"},{id:"daily_use",name:"日用品",unit:"件",price:10,category:"daily"},{id:"rose",name:"玫瑰花",unit:"支",price:10,category:"flowers"},{id:"painkiller",name:"止痛药",unit:"盒",price:10,category:"medicine"},{id:"fruits",name:"水果",unit:"斤",price:7.1,category:"food"},{id:"snacks",name:"零食",unit:"包",price:5.8,category:"food"},{id:"carnation",name:"康乃馨",unit:"支",price:5,category:"flowers"},{id:"bamboo_shoot",name:"竹笋",unit:"斤",price:5,category:"food"},{id:"beer",name:"啤酒",unit:"瓶",price:4.8,category:"food"},{id:"instant_noodles",name:"方便面",unit:"袋",price:4,category:"food"},{id:"mushroom",name:"蘑菇",unit:"斤",price:4,category:"food"},{id:"vegetables",name:"蔬菜",unit:"斤",price:3.4,category:"food"},{id:"pen",name:"笔",unit:"支",price:3,category:"stationery"},{id:"tofu",name:"豆腐",unit:"块",price:3,category:"food"},{id:"ginger",name:"生姜",unit:"斤",price:3,category:"food"},{id:"lettuce",name:"生菜",unit:"斤",price:2,category:"food"},{id:"corn",name:"玉米",unit:"根",price:2,category:"food"},{id:"onion",name:"洋葱",unit:"斤",price:2,category:"food"},{id:"garlic",name:"大蒜",unit:"斤",price:2,category:"food"},{id:"vinegar",name:"醋",unit:"瓶",price:2,category:"food"},{id:"starch",name:"淀粉",unit:"袋",price:2,category:"food"},{id:"water",name:"瓶装水",unit:"瓶",price:1.7,category:"daily"}],vendingNote:"主商圈，客流量最大，但城管也多"},techPark:{id:"techPark",name:"科技园",icon:"💻",desc:"互联网大厂的聚集地，高楼林立，精英云集。",type:"corporate",wealthTier:3,footfall:.7,specialties:["electronics","daily_use","snacks"],specialtyLabels:["小电子产品","日用品","零食"],priceMod:{},priceModList:[],dailyProbability:.4,flavor:["💻 几个穿格子衫的程序员坐在户外，盯着笔记本屏幕敲代码，耳机挂在脖子上。","☕ 园区咖啡馆里坐满了人，讨论的全是'融资''估值''赛道'……你插不上话。","🚗 停车场里一溜儿新能源车，不少还贴着大厂内部泊位贴纸。","📊 大楼入口大屏滚动着季度KPI和公司目标，路过的员工都没什么表情。","👓 一个戴眼镜的年轻人等外卖，手机不停地刷工作群消息，嘴角抿得很紧。","🎯 招聘广告牌写着'改变世界，从这里开始'，下方小字标注：'大小周，年终双薪'。","🌃 深夜还有几栋楼亮着灯，某个格子间里有人对着屏幕皱眉，连夜赶项目。"],jobs:[{id:"content_writing",name:"内容创作者",icon:"✍️",desc:"给平台和公众号写文章、做内容。要有文字功底和英语能力，本科以上学历优先。",startupCost:0,risk:{},payHint:{min:50,max:85,text:`payCalc(state) {
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
            (typeof getBranchJ`}}],amenities:[{id:"techpark_brunch",name:"科技园轻食",icon:"🥗",type:"food",tier:3,cost:35,ap:8,desc:"藜麦三文鱼沙拉，互联网精英的标配午餐。",primary:{hunger:60,happiness:8},junkFood:!1,lateNight:!1},{id:"techpark_gymshower",name:"科技园健身房淋浴",icon:"🚿",type:"bath",tier:3,cost:20,ap:8,desc:"刷一下健身卡顺便淋浴，互联网人省时之选。",primary:{hygiene:50,fatigue:-10},junkFood:!1,lateNight:!1},{id:"techpark_napcapsule",name:"科技园午睡舱",icon:"🛌",type:"rest",tier:3,cost:20,ap:8,desc:"高科技睡眠舱，30分钟顶3小时。",primary:{fatigue:-40,happiness:5},junkFood:!1,lateNight:!1}],actions:[{id:"techpark_networking",name:"科技园找机会",icon:"💡",desc:"在科技园里观察和接触创业公司的人，可能找到工作或创业机会。需要脑子灵活。",apCost:20,payEstimate:"0~∞"}],actionsExtra:[{id:"internet_bar",name:"网吧上网",desc:"花 5 块在网吧上 2 小时网，可以查资料、刷视频、玩游戏。",icon:"💻",apCost:20,payEstimate:"智力+0.3, 随机技能XP",costEstimate:5,hint:"去网吧、城中村、商业区或科技园"}],illegal:[],buy:[{id:"electronics",name:"小电子产品",unit:"个",price:80,category:"electronics"}],sell:[{id:"electronics",name:"小电子产品",unit:"个",price:80,category:"electronics"},{id:"clothing",name:"二手衣物",unit:"件",price:25,category:"clothing"},{id:"vitamins_item",name:"维生素",unit:"瓶",price:20,category:"medicine"},{id:"shrimp",name:"虾",unit:"斤",price:20,category:"food"},{id:"second_hand_book",name:"二手书",unit:"本",price:15,category:"books"},{id:"daily_use",name:"日用品",unit:"件",price:10,category:"daily"},{id:"rose",name:"玫瑰花",unit:"支",price:10,category:"flowers"},{id:"notebook_item",name:"笔记本",unit:"本",price:10,category:"stationery"},{id:"fruits",name:"水果",unit:"斤",price:6,category:"food"},{id:"pen",name:"笔",unit:"支",price:3,category:"stationery"}],vendingNote:"白领消费力强但习惯点外卖"},hospital:{id:"hospital",name:"医院",icon:"🏥",desc:"看病治疗的地方。健康是革命的本钱。",type:"service",wealthTier:2,footfall:.8,specialties:["fruits","water","snacks"],specialtyLabels:["水果","瓶装水","零食"],priceMod:{},priceModList:[],dailyProbability:.3,flavor:["🏥 急诊室外有人焦急地来回踱步，手机夹在肩膀和耳朵之间，边走边说。","👴 挂号大厅里老人排了长队，有人抱着病历本，有人盯着叫号屏幕发呆。","💊 药房窗口贴着收费价格单，一串长长的数字，让人叹了口气。","🌹 走廊里有人端着一束百合花，脸上带着疲惫的笑，应该是来探病的家属。","😢 候诊区的孩子哭了起来，旁边的父母轻声安抚，说'一会儿就好了'。","🍱 护士换班时抱着保温饭盒穿过走廊，脚步匆忙，没时间喘息。","📋 门诊室外的椅子上，有人低着头翻看检查报告，眼神里有种说不清的凝重。"],jobs:[{id:"hospital_companion",name:"陪诊服务",icon:"🏥",desc:"帮老人/行动不便者去医院陪诊挂号、取药。需要耐心和细心，收入稳定。",startupCost:0,risk:{illness:.02},payHint:{min:80,max:80,text:`payCalc(state) {
      return Math.floor(80 + state.player.mental * 0.3 + Random.float(0, 80));
    }`}}],amenities:[],actions:[{id:"hospital_donate",name:"医院献血",icon:"🩸",desc:"去医院献血，既能帮助他人又能赚营养补贴。要求身体健康。",apCost:15,payEstimate:"200"}],actionsExtra:[{id:"pharmacy",name:"买药/买营养品",desc:"去药房买维生素、补品等。需要 ¥30~80。",icon:"💊",apCost:20,payEstimate:"健康+5",costEstimate:30,hint:"去医院或商业区药房"}],illegal:[],buy:[{id:"painkiller",name:"止痛药",unit:"盒",price:10,category:"medicine"},{id:"cold_medicine",name:"感冒药",unit:"盒",price:20,category:"medicine"},{id:"vitamins_item",name:"维生素",unit:"瓶",price:20,category:"medicine"}],sell:[{id:"shrimp",name:"虾",unit:"斤",price:20,category:"food"},{id:"cigarettes",name:"香烟",unit:"包",price:15,category:"luxury"},{id:"daily_use",name:"日用品",unit:"件",price:10,category:"daily"},{id:"fruits",name:"水果",unit:"斤",price:6,category:"food"},{id:"carnation",name:"康乃馨",unit:"支",price:5,category:"flowers"},{id:"mushroom",name:"蘑菇",unit:"斤",price:4,category:"food"},{id:"vegetables",name:"蔬菜",unit:"斤",price:3,category:"food"},{id:"tofu",name:"豆腐",unit:"块",price:3,category:"food"},{id:"ginger",name:"生姜",unit:"斤",price:3,category:"food"}],vendingNote:"探病家属是主要客群"},bank:{id:"bank",name:"银行",icon:"🏦",desc:"存取款、办理贷款。",type:"service",wealthTier:2,footfall:.4,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.2,flavor:["🔢 取号机叫到了87号，你手里拿着148号，慢慢等吧。","💼 西装笔挺的理财顾问正向一位中年女士推销基金，语气轻柔，措辞笃定。","🏦 存款利率告示牌上的数字已经很久没有变动了，旁边的人看了一眼就走了。","😴 等待区里有一位大爷睡着了，脑袋垂在胸前，手里的号码单差点掉落。","📱 ATM机前有人忘了密码，反复重试，后面排队的人耐心地等，没人催。","🔒 保险柜展示窗里摆着金条模型，亮闪闪的，吸引了很多人停下来看。","❄️ 银行里的空调开得很足，比外面凉快多了，有个流浪汉悄悄坐在角落蹭凉气。"],jobs:[{id:"bank_security",name:"银行保安",icon:"👮",desc:"在银行大厅维持秩序，站一天挺累的，但胜在稳定。偶尔能遇上运钞车押运的额外任务。",startupCost:0,risk:{},payHint:{min:60,max:90,text:`function (state) {
      return Math.floor(Random.float(60, 90));
    }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"人流稀少，不适合摆摊"},park:{id:"park",name:"公园",icon:"🌳",desc:"城市中的绿洲，可以放松身心。",type:"recreation",wealthTier:2,footfall:1,specialties:["snacks","water","fruits"],specialtyLabels:["零食","瓶装水","水果"],priceMod:{},priceModList:[],dailyProbability:.5,flavor:["🌳 老人们在树荫下打太极拳，动作舒缓而专注，像是慢放的录像。","🦆 湖边有人在喂鸭子，孩子兴奋地蹲下去，鸭子却拍着翅膀跑开了。","📻 广场舞队伍正在热身，音乐混着笑声飘过来，自成一个小世界。","🏃 一个中年男人慢跑经过，汗水浸透了后背，表情却很放松，脚步均匀。","🌺 公园里的月季花开了，有人凑近拿手机拍，比比划划寻找最好的角度。","⛸️ 溜冰场传来轮滑的声音，几个孩子扶着栏杆慢慢滑，互相对视着笑。","🌅 傍晚的阳光把树影拉得很长，坐在长椅上什么都不做也是一种奢侈。","🕊️ 一群鸽子聚在广场上觅食，有人扔了把瓜子，鸽子们扑腾着扑过去。"],jobs:[{id:"busking",name:"街头表演",icon:"🎸",desc:"在天桥或广场表演才艺。脸皮要厚，观众打赏全看心情。",startupCost:0,risk:{},payHint:{min:18,max:42,text:`payCalc(state) {
        return Math.floor(
          18 +
            (state.player.mental || 0) * 0.2 +
            (state.player.fame || 0) * 0.3 +
            (typeof Random !== "undefined" && Random.float ? Random.f`}}],amenities:[{id:"park_streetfood",name:"公园小吃摊",icon:"🌭",type:"food",tier:2,cost:12,ap:5,desc:"烤串、烤肠、煎饼果子，夜市的诱惑。",primary:{hunger:35,happiness:4},junkFood:!0,lateNight:!1},{id:"park_chat",name:"公园闲坐",icon:"🪑",type:"fun",tier:1,cost:0,ap:8,desc:"晒晒太阳，看老人下棋，心情慢慢好起来。",primary:{happiness:18,fatigue:-5},junkFood:!1,lateNight:!1},{id:"park_nap",name:"公园长椅小憩",icon:"😴",type:"rest",tier:1,cost:0,ap:10,desc:"找张长椅躺一会，蚊子可能多点。",primary:{fatigue:-20},junkFood:!1,lateNight:!1}],actions:[{id:"park_exercise",name:"公园晨练",icon:"🏃",desc:"在公园晨练，免费又健康，还能放松身心。",apCost:15,payEstimate:"0"}],actionsExtra:[{id:"gym",name:"办健身卡锻炼",desc:"去健身房办月卡，提升体质和敏捷。",icon:"🏋️",apCost:20,payEstimate:"体质+1, 敏捷+0.5",costEstimate:200,hint:"去体育馆、公园、商业区或娱乐城"}],illegal:[],buy:[],sell:[{id:"snacks",name:"零食",unit:"包",price:5,category:"food"},{id:"water",name:"瓶装水",unit:"瓶",price:1.5,category:"daily"}],vendingNote:"周末家庭聚集，工作日冷清"},community_center:{id:"community_center",name:"社区中心",icon:"🏛️",desc:"街道办下属的社区服务中心,提供免费讲座、职业咨询和邻里互助活动。",type:"public",wealthTier:2,footfall:.5,specialties:["second_hand_book","pen","notebook_item"],specialtyLabels:["二手书","笔","笔记本"],priceMod:{water:.8,snacks:.9,daily_use:.85},priceModList:[{key:"water",value:.8,label:"瓶装水"},{key:"snacks",value:.9,label:"零食"},{key:"daily_use",value:.85,label:"日用品"}],dailyProbability:.3,flavor:[],jobs:[{id:"community_volunteer",name:"社区志愿者",icon:"🤝",desc:"在社区中心帮忙组织活动、服务居民。不赚钱但积人脉、长心智。",startupCost:0,risk:{},payHint:{min:20,max:20,text:"payCalc(state) { return Math.floor(Random.float(0, 20)); }"}},{id:"career_counselor_assistant",name:"职业咨询助理",icon:"📋",desc:"协助老陈做职业咨询,整理资料。需要一定的心智和社交能力。",startupCost:0,risk:{},payHint:{min:30,max:30,text:"payCalc(state) { return Math.floor(30 + state.player.mental * 0.3 + Random.float(0, 30)); }"}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"公共服务为主,少量便民摊位"},night_market:{id:"night_market",name:"夜市",icon:"🏮",desc:"傍晚开始热闹的夜市,各种小吃摊位、杂货地摊,烟火气十足。",type:"commercial",wealthTier:2,footfall:.95,specialties:["snacks","water","beer","clothing"],specialtyLabels:["零食","瓶装水","啤酒","二手衣物"],priceMod:{snacks:.9,water:.85,beer:.8,clothing:1.1},priceModList:[{key:"snacks",value:.9,label:"零食"},{key:"water",value:.85,label:"瓶装水"},{key:"beer",value:.8,label:"啤酒"},{key:"clothing",value:1.1,label:"二手衣物"}],dailyProbability:.7,flavor:[],jobs:[{id:"night_market_vendor",name:"夜市摆摊",icon:"🏮",desc:"在夜市支个摊卖小吃或杂货。客流量大,赚钱快,但竞争激烈。",startupCost:0,risk:{illness:.01},payHint:{min:60,max:120,text:`payCalc(state) {
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
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"老年居民多，消费习惯保守"},gov_office:{id:"gov_office",name:"政府办事大厅",icon:"🏛️",desc:"办理各种证件/业务的地方。办证/贷款/社保都在这里。",type:"service",wealthTier:2,footfall:.5,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.2,flavor:[],jobs:[],amenities:[],actions:[{id:"gov_benefits_apply",name:"申请低保",icon:"🏛️",desc:"在政务服务窗口咨询并申请最低生活保障。收入越低越容易通过，是走投无路时的最后一道网。",apCost:15,payEstimate:"0~800"}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"人流稀少，不适合摆摊"},court:{id:"court",name:"法院",icon:"⚖️",desc:"打官司的地方。可以起诉欠债不还、劳动纠纷等。",type:"service",wealthTier:2,footfall:.3,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.1,flavor:[],jobs:[],amenities:[],actions:[{id:"court_labor_arbitration",name:"申请劳动仲裁",icon:"⚖️",desc:"被拖欠工资、违法辞退时，到法院立案窗口申请劳动仲裁。免费、不用律师也能办，但要等结果。",apCost:20,payEstimate:"0~3000"}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"严肃场所，不适合摆摊"},job_market:{id:"job_market",name:"人才市场",icon:"🏢",desc:"找工作、招聘的地方。每周有招聘会，可以投简历。",type:"service",wealthTier:2,footfall:.8,specialties:["daily_use"],specialtyLabels:["日用品"],priceMod:{daily_use:.9},priceModList:[{key:"daily_use",value:.9,label:"日用品"}],dailyProbability:.3,flavor:[],jobs:[],amenities:[],actions:[{id:"job_market_resume",name:"投简历",icon:"📄",desc:"在人才市场的招聘信息栏前，把简历投给还在招人的摊位。比打零工体面，但要等回音。",apCost:10,payEstimate:null}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"求职者多，但消费力弱"},entertainment:{id:"entertainment",name:"娱乐城",icon:"🎮",desc:"电影院/KTV/游戏厅聚集地。放松娱乐，消耗现金。",type:"recreation",wealthTier:3,footfall:1.5,specialties:["snacks","beer","electronics"],specialtyLabels:["零食","啤酒","小电子产品"],priceMod:{snacks:1.2,beer:1.3,electronics:1.1},priceModList:[{key:"snacks",value:1.2,label:"零食"},{key:"beer",value:1.3,label:"啤酒"},{key:"electronics",value:1.1,label:"小电子产品"}],dailyProbability:.6,flavor:[],jobs:[],amenities:[],actions:[],actionsExtra:[{id:"gym",name:"办健身卡锻炼",desc:"去健身房办月卡，提升体质和敏捷。",icon:"🏋️",apCost:20,payEstimate:"体质+1, 敏捷+0.5",costEstimate:200,hint:"去体育馆、公园、商业区或娱乐城"},{id:"movie",name:"看场电影",desc:"去影院看场电影放松一下。",icon:"🎬",apCost:20,payEstimate:"心情+18",costEstimate:35,hint:"去娱乐城的影院"},{id:"ktv",name:"KTV 唱歌",desc:"约朋友去 KTV 吼两小时。",icon:"🎤",apCost:20,payEstimate:"心情+25, 人缘+",costEstimate:80,hint:"去娱乐城的 KTV"}],illegal:[{id:"illegal_foot_massage",name:"🦶 洗脚城灰服务",icon:"🦶",desc:"去洗脚城点'特殊服务'。心情大涨，但有被扫黄抓+染病风险。",apCost:4,rewardRange:[25,40],catchProb:.25,moralityDelta:-10,penalty:{jailDays:0,fine:500,diseaseProb:.35}}],buy:[],sell:[],vendingNote:"年轻人多，消费力强"},temple:{id:"temple",name:"寺庙",icon:"⛩️",desc:"城市中的古老寺庙。祈福/冥想/心灵慰藉。",type:"recreation",wealthTier:2,footfall:.6,specialties:["fruits","water"],specialtyLabels:["水果","瓶装水"],priceMod:{fruits:1.1,water:1.05},priceModList:[{key:"fruits",value:1.1,label:"水果"},{key:"water",value:1.05,label:"瓶装水"}],dailyProbability:.3,flavor:[],jobs:[],amenities:[],actions:[{id:"temple_meditate_extra",name:"寺庙静心",icon:"🧘",desc:"在寺庙里打坐冥想，净化心灵。烧点香火，求个心安。",apCost:15,payEstimate:null}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"香客多，不适合摆摊"},library:{id:"library",name:"图书馆",icon:"📖",desc:"免费的公共图书馆，藏书丰富环境安静。适合自学技能、查找资料、消磨时光。",type:"education",wealthTier:2,footfall:.5,specialties:[],specialtyLabels:[],priceMod:{},priceModList:[],dailyProbability:.2,flavor:["📚 自习区坐满了人，有人戴着耳机看书，有人在草稿纸上写写画画。","📖 一位老人坐在角落里看报纸，报纸已经泛黄，边角卷了起来。","🌿 窗边的绿植长得很好，阳光透过玻璃照在上面，叶片泛着绿光。","📋 公告栏上贴着读书会通知，'本周六晚七点，共读《活着》'。","☕ 阅览区有人小声打电话，被管理员提醒后赶紧挂了，脸红着道歉。","🌙 闭馆音乐响起，学生们陆续起身收拾书包，有人打了个大大的哈欠。","📖 一个小女孩踮着脚够书架上的绘本，旁边的妈妈帮她拿下来，轻声读给她听。"],jobs:[],amenities:[],actions:[],actionsExtra:[{id:"self_study",name:"图书馆自习",desc:"去图书馆（商业区旁）安静看书。",icon:"📖",apCost:20,payEstimate:"技能XP+30",costEstimate:null,hint:"去大学城、培训中心或图书馆自习"},{id:"borrow_books",name:"借书自学",desc:"从图书馆借专业书籍回家学习。可以指定一门技能专精提升，效率比泛读高。",icon:"📚",apCost:15,payEstimate:"指定技能XP+40",costEstimate:null,hint:"在图书馆借书自学"},{id:"reading_club",name:"参加读书会",desc:"参加图书馆周末读书会，与人交流读书心得。兼顾社交和学习，还能认识新朋友。",icon:"👥",apCost:20,payEstimate:"社交+技能+心情",costEstimate:null,hint:"在图书馆参加读书会"}],illegal:[],buy:[],sell:[],vendingNote:"安静场所，禁止摆摊"},gym:{id:"gym",name:"体育馆",icon:"🏋️",desc:"可以健身/打球/游泳的地方。增强体质的好去处。",type:"recreation",wealthTier:2,footfall:.8,specialties:["vitamins_item","snacks"],specialtyLabels:["维生素","零食"],priceMod:{snacks:1.1,vitamins_item:1.1},priceModList:[{key:"snacks",value:1.1,label:"零食"},{key:"vitamins_item",value:1.1,label:"维生素"}],dailyProbability:.4,flavor:[],jobs:[{id:"gym_coach",name:"健身教练",icon:"💪",desc:"在体育馆做私人教练。需要好身材+专业指导能力。",startupCost:0,risk:{injury:.02},payHint:{min:30,max:70,text:`payCalc(state) {
        var base =
          70 +
          state.player.physique * 0.5 +
          (state.player.fame || 0) * 0.2 +
          Random.float(0, 30);
        return Math.floor(base);
      }`}}],amenities:[],actions:[],actionsExtra:[{id:"gym",name:"办健身卡锻炼",desc:"去健身房办月卡，提升体质和敏捷。",icon:"🏋️",apCost:20,payEstimate:"体质+1, 敏捷+0.5",costEstimate:200,hint:"去体育馆、公园、商业区或娱乐城"}],illegal:[],buy:[],sell:[],vendingNote:"运动人群多，消费力中等"},internet_cafe:{id:"internet_cafe",name:"网吧",icon:"🖥️",desc:"上网/打游戏的地方。可以接线上任务，也可以消磨时间。",type:"recreation",wealthTier:2,footfall:.7,specialties:["snacks","beer"],specialtyLabels:["零食","啤酒"],priceMod:{snacks:1,beer:1},priceModList:[{key:"snacks",value:1,label:"零食"},{key:"beer",value:1,label:"啤酒"}],dailyProbability:.5,flavor:[],jobs:[{id:"data_entry",name:"数据录入",icon:"⌨️",desc:"在网吧接线上数据录入任务，打字快就赚得多。",startupCost:0,risk:{},payHint:{min:25,max:30,text:`payCalc(state) {
        var base = 30 + state.player.intelligence * 0.5 + Random.float(0, 25);
        return Math.floor(base);
      }`}}],amenities:[],actions:[],actionsExtra:[{id:"internet_bar",name:"网吧上网",desc:"花 5 块在网吧上 2 小时网，可以查资料、刷视频、玩游戏。",icon:"💻",apCost:20,payEstimate:"智力+0.3, 随机技能XP",costEstimate:5,hint:"去网吧、城中村、商业区或科技园"}],illegal:[],buy:[],sell:[],vendingNote:"年轻人多，零食饮料消费旺盛"},logistics_park:{id:"logistics_park",name:"物流园区",icon:"🚚",desc:"快递/物流集散中心。工作机会多，但环境嘈杂。",type:"industrial",wealthTier:2,footfall:1,specialties:["instant_noodles","daily_use"],specialtyLabels:["方便面","日用品"],priceMod:{instant_noodles:.9,daily_use:.85},priceModList:[{key:"instant_noodles",value:.9,label:"方便面"},{key:"daily_use",value:.85,label:"日用品"}],dailyProbability:.5,flavor:[],jobs:[{id:"package_delivery",name:"快递配送",icon:"📦",desc:"在物流园接单送快递，跑得勤就赚得多。有电动车更高效。",startupCost:0,risk:{injury:.03},payHint:{min:35,max:730,text:`payCalc(state) {
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
      }`}}],amenities:[],actions:[],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"爱好者多，消费力中等"},flea_market:{id:"flea_market",name:"二手市场",icon:"🏴",desc:"淘二手货的地方。可以低价买入高价卖出，考验眼光。",type:"commercial",wealthTier:2,footfall:.8,specialties:["clothing","electronics","second_hand_book"],specialtyLabels:["二手衣物","小电子产品","二手书"],priceMod:{clothing:.7,electronics:.75,second_hand_book:.6},priceModList:[{key:"clothing",value:.7,label:"二手衣物"},{key:"electronics",value:.75,label:"小电子产品"},{key:"second_hand_book",value:.6,label:"二手书"}],dailyProbability:.5,flavor:[],jobs:[],amenities:[],actions:[{id:"flea_market_haggle",name:"淘货砍价",icon:"🏴",desc:"在二手市场的地摊之间转悠，凭眼力捡漏、凭嘴皮子砍价。看走眼就亏，看准了就赚。",apCost:15,payEstimate:"0~420"}],actionsExtra:[],illegal:[],buy:[],sell:[],vendingNote:"淘货人多，消费力参差不齐"},vegetable_market:{id:"vegetable_market",name:"菜市场",icon:"",desc:"买菜的地方。新鲜食材最便宜，但环境嘈杂。讨价还价的唇枪舌剑此起彼伏。",type:"commercial",wealthTier:2,footfall:1.2,specialties:["vegetables","fruits","pork","fish"],specialtyLabels:["蔬菜","水果","猪肉","鱼"],priceMod:{vegetables:.7,fruits:.75,pork:.85,fish:.8},priceModList:[{key:"vegetables",value:.7,label:"蔬菜"},{key:"fruits",value:.75,label:"水果"},{key:"pork",value:.85,label:"猪肉"},{key:"fish",value:.8,label:"鱼"}],dailyProbability:.8,flavor:[],jobs:[],amenities:[],actions:[{id:"veg_market_bargain",name:"赶早市买菜",icon:"🥬",desc:"天没亮就去菜市场，跟摊主讨价还价买最新鲜也最便宜的菜。自己做饭比吃外卖省得多。",apCost:10,payEstimate:null}],actionsExtra:[],illegal:[],buy:[{id:"vegetables",name:"蔬菜",unit:"斤",price:2.1,category:"food"},{id:"fruits",name:"水果",unit:"斤",price:4.5,category:"food"}],sell:[],vendingNote:"买菜人多，但消费力有限"}}};return Px(RE);})();
