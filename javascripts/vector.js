//angleMode is either Rad or Deg, Deg by default
var angleMode = "Deg";

function lerp(v0,v1,t) {
  return (1 - t) * v0 + t * v1;
}

function invLerp(v0,v1,v) {
  return (v - v0) / (v1 - v0);
}

function remap(iMin,iMax,oMin,oMax,v) {
  let t = invLerp(iMin,iMax,v);
  return lerp(oMin,oMax,t);
}

function invRemap(iMin,iMax,oMin,oMax,t) {
  let v = lerp(iMin,iMax,t);
  return invLerp(oMin,oMax,v);
}

function absMod(value1,value2) {
  return ((value1 % value2) + value2) % value2;
}

//vector class
class Vector {
  //takes an x parameter and a y parameter
  constructor (x,y) {
    this.x = x;
    this.y = y;
  }
  
  //the toString() method allows for easy console logging, it's argument allows the user to control the precision that it exports with
  toString(precision) {
    if (precision === undefined) {
      return "(x" + Math.round(this.x) + ", y" + Math.round(this.y) + ")";
    }  
    else {
      return "(x" + this.x.toFixed(precision) + ", y" + this.y.toFixed(precision) + ")";
    }
  }
  
  //the set() method takes two parameters and sets the x,y values of the vector to those new values
  set(x,y) {
    if (typeof x === "object") {
      this.x = x.x;
      this.y = x.y;
    }
    else {
      this.x = x;
      this.y = y;
    }
  }
  
  //the copy() method returns a Vector with the exact same values as this Vector
  copy() {
    return new Vector(this.x,this.y);
  }
  
  //the add() method adds an x and y value to this, or it adds a whole vector to this
  add(x,y) {
    if (typeof x === "object") {
      this.x += x.x;
      this.y += x.y;
    }
    else {
      this.x += x;
      this.y += y;
    }
  }
  
  //rem()
  //the sub() method subtracts an x and y value from this, or it subtracts a whole vector from this
  sub(x,y) {
    if (typeof x === "object") {
      this.x -= x.x;
      this.y -= x.y;
    }
    else {
      this.x -= x;
      this.y -= y;
    }
  }
  
  //the mult() method multiplies the x and y of this by a value, or the x and y of a whole vector
  mult(x) {
    if (typeof x === "object") {
      this.x *= x.x;
      this.y *= x.y;
    }
    else {
      this.x *= x;
      this.y *= x;
    }
  }
  
  //the div() method divides the x and y of this by a value, or the x and y of a whole vector
  div(x) {
    if (typeof x === "object") {
      this.x /= x.x;
      this.y /= x.y;
    }
    else {
      this.x /= x;
      this.y /= x;
    }
  }
  
  // the mag() method returns the length of the vector
  mag() {
    return Math.sqrt((this.x ** 2) + (this.y ** 2));
  }
  
  //magsq()
  
  //dot()
  dot(vec) {
    return (this.x * vec.x) + (this.y * vec.y);
  }
  
  //cross()
  //dist()
  
  //the normalize() method sets the length of this to 1
  normalize() {
    let distance = Math.sqrt((this.x ** 2) + (this.y ** 2));
    this.x = this.x/distance;
    this.y = this.y/distance;
  }
  
  //the limit() method sets the max of a vector's length to a certain value
  limit(mag) {
    if (this.mag() > mag) {
      this.normalize();
      this.mult(mag);
    }
  }
  
  //the setMag() method sets the magnitude of a vector to a certain value
  setMag(mag) {
    this.normalize();
    this.mult(mag);
  }
  
  heading() {
    return ((Math.atan2(this.y, this.x) * (-180 / Math.PI)) + 450) % 360;
  }
  
  //setHeading()
  setHeading(val) {
    this.rotate(val - this.heading(this));
  }

  //rotate()
  rotate(amt) {
    if (amt !== 0) {
      amt *= -1;
      let a = this.x;
      let b = this.y;

      let t = (b / Math.abs(b)) * Math.acos(a / Math.sqrt((a ** 2) + (b ** 2)));

      let t1 = amt * (Math.PI / 180);
      let a1 = Math.sqrt((a ** 2) + (b ** 2)) * Math.cos(t + t1);
      let b1 = Math.sqrt((a ** 2) + (b ** 2)) * Math.sin(t + t1);

      this.x = a1;
      this.y = b1;
    }
  }

  //angleBetween()
  //lerp()
  lerp(v2,t) {
    if (t > 1 || t < 0) {
      t = t % 1;
    }
    this.x = lerp(this.x,v2.x,t);
    this.y = lerp(this.y,v2.y,t);
  }
  
  //reflect()
  reflect(n) {
    //r = d - 2(d.n)n
    let vecTemp1 = n.copy();
    let dDot = this.dot(n);
    let vecTemp2 = n.copy();
    vecTemp2.mult(dDot);
    vecTemp2.mult(2);
    let vecTemp3 = this.copy();
    vecTemp3.sub(vecTemp2);
    this.set(vecTemp3);
  }
  
  //array()
  //equals()
  //fromAngle()
  //random2D()
}