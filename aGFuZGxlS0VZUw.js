const a2V5 = "UldVWkV2RE9uaTNBMThpUlgyVjlYUTRKYmxyM1RBa2Y=", c2VjcmV0 = "VnJ2SzJvazQyb05KYWtYcw==", d2VhdGhlcg = "NGIwMDZjNjY0OTY1NGYyZjk4YzE4MzQxODI1MjkwNw==";
export function ZW5jb2RlU3RyaW5n(c3Ry) {
  const YmluYXJ5U3Ry = Array.from(c3Ry)
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
  const aGV4U3Ry = YmluYXJ5U3Ry
    .split(' ').map(Y2hhcg => parseInt(Y2hhcg, 2).toString(16).padStart(2, '0')).join('');
  const aGV4VG9CeXRlcw = aGV4U3Ry.match(/.{2}/g)
    .map(Y2hhcg => String.fromCharCode(parseInt(Y2hhcg, 16)))
    .join('');
  const YmFzZTY0U3Ry = btoa(aGV4VG9CeXRlcw);
  return YmFzZTY0U3Ry;
}
export function ZGVjb2RlU3RyaW5n(ZW5jb2RlZFN0cg) {
  const aGV4Qnl0ZXNTdHI = atob(ZW5jb2RlZFN0cg);
  const aGV4QXJy = aGV4Qnl0ZXNTdHI
    .split('')
    .map(Y2hhcg => Y2hhcg.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
  const YmluYXJ5U3Ry = aGV4QXJy
    .match(/.{2}/g)
    .map(Y2hhcg => parseInt(Y2hhcg, 16).toString(2).padStart(8, '0'))
    .join(' ');
  const Y2hhcnM = YmluYXJ5U3Ry
    .split(' ')
    .map(Ymlu => String.fromCharCode(parseInt(Ymlu, 2)));
  return Y2hhcnM.join('');
}
export async function Z2V0QWNjZXNzVG9rZW4() {
  const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: ZGVjb2RlU3RyaW5n(a2V5),
      client_secret: ZGVjb2RlU3RyaW5n(c2VjcmV0)
    })
  });
  const data = await res.json();
  return data.access_token;
}

export async function Z2V0Q2l0eVdlYXRoZXI(city) {
  const res = await fetch(`http://api.weatherapi.com/v1/current.json?&key=${ZGVjb2RlU3RyaW5n(d2VhdGhlcg)}&q=${city}`);
  const data = await res.json();
  return data.current;
}