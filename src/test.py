from nltk.corpus import stopwords as swords
from nltk.tokenize import word_tokenize as wtokenize
import nltk

X = 'I love horror movies'
Y = 'Lights out is a horror movie'


xlist = wtokenize(X)
ylist = wtokenize(Y)

sw = swords.words('english')

l1, l2 = [],[]

xset = {w for w in xlist if not w in sw}
yset = {w for w in ylist if not w in sw}

rvector = xset.union(yset)
for w in rvector:
    if w in xset: l1.append(1)
    else: l1.append(0)
    if w in yset: l2.append(1)
    else: l2.append(0)

c = 0

for i in range(len(rvector)):
    c += l1[i] * l2[i]
cosine = c / float((sum(l1)*sum(l2))**0.5)
print('score: ',cosine)