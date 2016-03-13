import httplib

headers = {'User-agent': 'Python'}

for i in range(100):
	conn = httplib.HTTPConnection('sugang.snu.ac.kr')
	conn.request('GET', '/sugang/ca/number.action', '', headers)
	resp = conn.getresponse()
	rest = resp.read()
	f = open('read/' + str(i) + '.png', 'wb')
	f.write(rest)
	print 'Downloaded ' + str(i)