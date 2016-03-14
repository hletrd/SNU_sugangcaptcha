import httplib
import string
import random

headers = {'User-agent': 'Python'}

for i in range(100):
	conn = httplib.HTTPConnection('sugang.snu.ac.kr')
	conn.request('GET', '/sugang/ca/number.action', '', headers)
	resp = conn.getresponse()
	rest = resp.read()
	f = open('read/' + ''.join(random.choice(string.ascii_lowercase + string.ascii_uppercase + string.digits) for _ in range(10)) + '.png', 'wb')
	f.write(rest)
	print 'Downloaded ' + str(i)