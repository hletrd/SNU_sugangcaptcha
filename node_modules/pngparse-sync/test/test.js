var tape   = require("tape")
var fs     = require("fs")
var path   = require("path")
var parse  = require("../index")

var dataPath = __dirname + "/../data"

tape("1bit colormap", function(t) {
  var buffer = fs.readFileSync(dataPath + "/1bit.png")
  var png = parse(buffer)

  t.ok(!!png, "no error")
  t.equals(png.width, 1024)
  t.equals(png.height, 1024)
  t.equals(png.channels, 1)
  t.equals(png.data.length, 1024*1024)


  var x, y=1024
  while(y--) {
    x = 1024
    while(x--) {
      t.equals(png.data[x+y*1024], 0);
    }
  }

  t.end()
})

tape("8bit grayscale", function(t) {

  var buffer = fs.readFileSync(dataPath + "/grayscale.png")
  var png = parse(buffer)

  t.ok(!!png)
  t.equals(png.width, 16)
  t.equals(png.height, 16)
  t.equals(png.channels, 1)
  t.equals(png.data.length, 16*16)
  t.equals(png.trailer.toString(), "Hello, world!\n")

  var y = 16,
      x
  while(y--) {
    x = 16
    while(x--)
      t.equal(png.data[x+y*16], (x ^ y)*0x11)
  }

  t.end()
})

tape("8bit truecolor png", function(t) {

  var buffer = fs.readFileSync(dataPath + "/truecolor.png")
  var id = parse(buffer)

  t.ok(!!id)
  t.equals(id.width, 16, "width")
  t.equals(id.height, 16, "height")
  t.equals(id.channels, 3, "channels")
  t.equals(id.data.length, 16 * 16 * 3, "length")
  t.equals(id.trailer.length, 0, "trailer")

  var y = 16,
      x
  while(y--) {
    x = 16
    while(x--) {
      t.equals(id.data[3*x+48*y],   x*0x11, "red")
      t.equals(id.data[3*x+48*y+1], y*0x11, "green")
      t.equals(id.data[3*x+48*y+2], (x^y)*0x11, "blue")
    }
  }

  t.end()
})

tape("8-bit alpha", function(t) {

  var buffer = fs.readFileSync(dataPath + "/truecoloralpha.png")
  var id = parse(buffer)

  t.ok(!!id)
  t.equals(id.width, 16, "width")
  t.equals(id.height, 16, "height")
  t.equals(id.channels, 4, "channels")
  t.equals(id.data.length, 16 * 16 * 4, "length")
  t.equals(id.trailer.length, 0, "trailer")

  var y = 16,
      x
  while(y--) {
    x = 16
    while(x--) {
      t.equals(id.data[4*x+64*y],   x*0x11, "red")
      t.equals(id.data[4*x+64*y+1], y*0x11, "green")
      t.equals(id.data[4*x+64*y+2], 0, "blue")
      t.equals(id.data[4*x+64*y+3], (x^y)*0x11, "alpha")
    }
  }

  t.end()
})

tape("scanline filter", function(t) {

  var buffer = fs.readFileSync(dataPath + "/accum.png")
  var id = parse(buffer)

  t.ok(!!id)
  t.equals(id.width, 1024, "width")
  t.equals(id.height, 1024, "height")
  t.equals(id.channels, 3, "channels")
  t.equals(id.data.length, 1024*1024*3, "length")
  t.equals(id.trailer.length, 0, "trailer")
  
  t.equals(id.data[0], 0xff)
  t.equals(id.data[1], 0)
  t.equals(id.data[2], 0)
  t.equals(id.data[3], 0xff)
  t.equals(id.data[4], 0)
  t.equals(id.data[5], 0)
  
  var px = (420 + 1024*308)*3
  t.equals(id.data[px], 0xff)
  t.equals(id.data[px+1], 0x00)
  t.equals(id.data[px+2], 0x29)

  var px = (433 + 1024*308)*3
  t.equals(id.data[px], 0x0a)
  t.equals(id.data[px+1], 0x29)
  t.equals(id.data[px+2], 0x9d)

  var px = (513 + 1024*308)*3
  t.equals(id.data[px], 0x00)
  t.equals(id.data[px+1], 0x66)
  t.equals(id.data[px+2], 0xff)

  var px = (728 + 1024*552)*3
  t.equals(id.data[px], 0xff)
  t.equals(id.data[px+1], 0x00)
  t.equals(id.data[px+2], 0x47)

  t.end()
})

tape("indexed color", function(t) {

  var buffer = fs.readFileSync(dataPath + "/indexed.png")
  var id = parse(buffer)

  t.ok(!!id)
  t.equals(id.width, 16, "width")
  t.equals(id.height, 16, "height")
  t.equals(id.channels, 3, "channels")
  t.equals(id.data.length, 16*16*3, "length")
  t.equals(id.trailer.length, 0, "trailer")
  
  var y = 16,
      x
  while(y--) {
    x = 16
    while(x--)
      if(x + y < 8) {
        t.equals(id.data[3*(x + 16*y)], 0xFF)
        t.equals(id.data[3*(x + 16*y)+1], 0)
        t.equals(id.data[3*(x + 16*y)+2], 0)
      } else if(x + y < 16) {
        t.equals(id.data[3*(x + 16*y)], 0)
        t.equals(id.data[3*(x + 16*y)+1], 0xff)
        t.equals(id.data[3*(x + 16*y)+2], 0)
      } else if(x + y < 24) {
        t.equals(id.data[3*(x + 16*y)], 0)
        t.equals(id.data[3*(x + 16*y)+1], 0)
        t.equals(id.data[3*(x + 16*y)+2], 0xff)
      } else {
        t.equals(id.data[3*(x + 16*y)], 0)
        t.equals(id.data[3*(x + 16*y)+1], 0)
        t.equals(id.data[3*(x + 16*y)+2], 0)
      }
  }

  t.end()
})

tape("indexed color with alpha", function(t) {

  var buffer = fs.readFileSync(dataPath + "/indexedalpha.png")
  var id = parse(buffer)

  t.ok(!!id)
  t.equals(id.width, 16, "width")
  t.equals(id.height, 16, "height")
  t.equals(id.channels, 4, "channels")
  t.equals(id.data.length, 16*16*4, "length")
  t.equals(id.trailer.length, 0, "trailer")

  var y = 16,
      x
  while(y--) {
    x = 16
    while(x--) {
      if(x >= 4 && x < 12){
        t.equals(id.data[4*(x + 16*y)], 0)
        t.equals(id.data[4*(x + 16*y)+1], 0)
        t.equals(id.data[4*(x + 16*y)+2], 0)
        t.equals(id.data[4*(x + 16*y)+3], 0)
      } else if(x + y < 8) {
        t.equals(id.data[4*(x + 16*y)], 0xff)
        t.equals(id.data[4*(x + 16*y)+1], 0)
        t.equals(id.data[4*(x + 16*y)+2], 0)
        t.equals(id.data[4*(x + 16*y)+3], 0xff)
      } else if(x + y < 16) {
        t.equals(id.data[4*(x + 16*y)], 0)
        t.equals(id.data[4*(x + 16*y)+1], 0xff)
        t.equals(id.data[4*(x + 16*y)+2], 0)
        t.equals(id.data[4*(x + 16*y)+3], 0xff)
      } else if(x + y < 24) {
        t.equals(id.data[4*(x + 16*y)], 0)
        t.equals(id.data[4*(x + 16*y)+1], 0)
        t.equals(id.data[4*(x + 16*y)+2], 0xff)
        t.equals(id.data[4*(x + 16*y)+3], 0xff)
      } else {
        t.equals(id.data[4*(x + 16*y)], 0)
        t.equals(id.data[4*(x + 16*y)+1], 0)
        t.equals(id.data[4*(x + 16*y)+2], 0)
        t.equals(id.data[4*(x + 16*y)+3], 0xff)
      }
    }
  }  

  t.end()
})

tape("paeth filtered", function(t) {

  var buffer = fs.readFileSync(dataPath + "/paeth.png")
  var id = parse(buffer)

  t.ok(!!id)
  t.equals(id.width, 512, "width")
  t.equals(id.height, 512, "height")
  t.equals(id.channels, 4, "channels")
  t.equals(id.data.length, 512*512*4, "length")
  t.equals(id.trailer.length, 0, "trailer")


  function check(x, y, c) {
    var px = 4*(x+512*y)
    t.equals(id.data[px], c>>>24, "red")
    t.equals(id.data[px+1], (c>>>16)&0xff, "green")
    t.equals(id.data[px+2], (c>>>8)&0xff, "blue")
    t.equals(id.data[px+3], c&0xff, "alpha")
  }

  check(  0,   0, 0xFF000000)
  check(  1,   0, 0xFF000000)
  check(  0,   1, 0xFF000000)
  check(  2,   2, 0xFF000000)
  check(  0,  50, 0xFF000000)
  check(219, 248, 0xFF000D00)
  check(220, 248, 0xFF000D00)
  check(215, 249, 0xFF000C00)
  check(216, 249, 0xFF000C00)
  check(217, 249, 0xFF000D00)
  check(218, 249, 0xFF000D00)
  check(219, 249, 0xFF000E00)
  check(220, 249, 0xFF000E00)
  check(263, 319, 0xFF002100)
  check(145, 318, 0x05535A00)
  check(395, 286, 0x0007FF00)
  check(152, 167, 0x052C3500)
  check(153, 167, 0x04303600)
  check(154, 167, 0x042F3700)
  check(100, 168, 0xFF000400)
  check(120, 168, 0xFF000900)
  check(140, 168, 0xFF001B00)
  check(150, 168, 0x05313600)
  check(152, 168, 0x04343C00)
  check(153, 168, 0x03343F00)
  check(154, 168, 0x03344100)
  check(155, 168, 0x02344300)
  check(156, 168, 0x02314400)
  check(157, 168, 0x02323F00)
  check(158, 168, 0x03313900)

  t.end()
})

tape("bad png", function(t) {
  t.equals(parse(new Buffer("JUNK")), null, "bad png fails")

  var buf = new Buffer("89504e470d0a1a0a0000000d49484452000000100000001008000000003a98a0bd000000017352474200aece1ce90000002174455874536f6674776172650047726170686963436f6e7665727465722028496e74656c297787fa190000008849444154789c448e4111c020100363010b58c00216b080052c60010b58c0c259c00216ae4d3b69df99dd0d1062caa5b63ee6b27d1c012996dceae86b6ef38398106acb65ae3e8edbbef780564b5e73743fdb409e1ef2f4803c3de4e901797ac8d3f3f0f490a7077ffffd03f5f507eaeb0fd4d71fa8af3f505f7fa0befe7c7dfdb9000000ffff0300c0fd7f8179301408", "hex")
  t.equals(parse(buf), null, "missing IEND")

  t.end()
})