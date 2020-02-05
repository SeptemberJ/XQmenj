export function MySha1 (bufferOrString) {
  var POW_2_24 = Math.pow(2, 24)
  var POW_2_32 = Math.pow(2, 32)

  function hex (n) {
    var s = ''
    var v
    for (var i = 7; i >= 0; --i) {
      v = (n >>> (i << 2)) & 15
      s += v.toString(16)
    }
    return s
  }

  function lrot (n, bits) {
    return ((n << bits) | (n >>> (32 - bits)))
  }

  var Uint32ArrayBigEndian = (function () {
    function Uint32ArrayBigEndian (length) {
      this.bytes = new Uint8Array(length << 2)
    }
    Uint32ArrayBigEndian.prototype.get = function (index) {
      index <<= 2
      return (this.bytes[index] * POW_2_24) + ((this.bytes[index + 1] << 16) | (this.bytes[index + 2] << 8) | this.bytes[index + 3])
    }
    Uint32ArrayBigEndian.prototype.set = function (index, value) {
      var high = Math.floor(value / POW_2_24)
      var rest = value - (high * POW_2_24)
      index <<= 2
      this.bytes[index] = high
      this.bytes[index + 1] = rest >> 16
      this.bytes[index + 2] = (rest >> 8) & 255
      this.bytes[index + 3] = rest & 255
    }
    return Uint32ArrayBigEndian
  })()

  function string2ArrayBuffer (s) {
    s = s.replace(/[\u0080-\u07ff]/g, function (c) {
      var code = c.charCodeAt(0)
      return String.fromCharCode(192 | code >> 6, 128 | code & 63)
    })
    s = s.replace(/[\u0080-\uffff]/g, function (c) {
      var code = c.charCodeAt(0)
      return String.fromCharCode(224 | code >> 12, 128 | code >> 6 & 63, 128 | code & 63)
    })
    var n = s.length
    var array = new Uint8Array(n)
    for (var i = 0; i < n; ++i) {
      array[i] = s.charCodeAt(i)
    }
    return array.buffer
  }

  function hash (bufferOrString) {
    var source
    if (bufferOrString instanceof ArrayBuffer) {
      source = bufferOrString
    } else {
      source = string2ArrayBuffer(String(bufferOrString))
    }
    var h0 = 1732584193
    var h1 = 4023233417
    var h2 = 2562383102
    var h3 = 271733878
    var h4 = 3285377520
    var i
    var sbytes = source.byteLength
    var sbits = sbytes << 3
    var minbits = sbits + 65
    var bits = Math.ceil(minbits / 512) << 9
    var bytes = bits >>> 3
    var slen = bytes >>> 2
    var s = new Uint32ArrayBigEndian(slen)
    var s8 = s.bytes
    var j
    var w = new Uint32Array(80)
    var sourceArray = new Uint8Array(source)
    for (i = 0; i < sbytes; ++i) {
      s8[i] = sourceArray[i]
    }
    s8[sbytes] = 128
    s.set(slen - 2, Math.floor(sbits / POW_2_32))
    s.set(slen - 1, sbits & 4294967295)
    for (i = 0; i < slen; i += 16) {
      for (j = 0; j < 16; ++j) {
        w[j] = s.get(i + j)
      }
      for (; j < 80; ++j) {
        w[j] = lrot(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
      }
      var a = h0
      var b = h1
      var c = h2
      var d = h3
      var e = h4
      var f
      var k
      var temp
      for (j = 0; j < 80; ++j) {
        if (j < 20) {
          f = (b & c) | ((~b) & d)
          k = 1518500249
        } else {
          if (j < 40) {
            f = b ^ c ^ d
            k = 1859775393
          } else {
            if (j < 60) {
              f = (b & c) ^ (b & d) ^ (c & d)
              k = 2400959708
            } else {
              f = b ^ c ^ d
              k = 3395469782
            }
          }
        }
        temp = (lrot(a, 5) + f + e + k + w[j]) & 4294967295
        e = d
        d = c
        c = lrot(b, 30)
        b = a
        a = temp
      }
      h0 = (h0 + a) & 4294967295
      h1 = (h1 + b) & 4294967295
      h2 = (h2 + c) & 4294967295
      h3 = (h3 + d) & 4294967295
      h4 = (h4 + e) & 4294967295
    }
    return hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4)
  }

  return hash(bufferOrString)
}

export function formatTime (date) {
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export function formatTimeSample (date) {
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
