import pymongo
import time
import sys
import math
import numpy as np
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from bson.objectid import ObjectId

class Recommendation():
    
    def __init__(self,userid):

        self.client = pymongo.MongoClient('mongodb://localhost:27017/')
        self.db = self.client['protodb']
        self.socials = self.db['socials']
        self.documents = self.db['exp_docs']
        self.executions = self.db['executions']
        self.likes = self.db['likes']
        self.userid = userid

    def sigmoid(self,x):

        return 1/(1+math.exp(-x))

    #GET all likes from userid
    #returns tuples:
    #[(execid, type, objid)]
    def userLikes(self, t = -1):
        
        query = {'userid':ObjectId(self.userid)}
        likes = []
        cursor = self.likes.find(query)
        for x in cursor:
            likes.append(x)

        tuples = []
        for like in likes:
            tuples.append((str(like['execid']),like['type'],str(like['objid'])))

        if t < 0:
            return tuples
        else:
            filtered = []
            for tp in tuples:
                if tp[1] == t:
                    filtered.append(tp)
            return filtered
    
    #cosine distance between 2 sets
    def cosdist(self,x,y):
        
        sw = stopwords.words('english')

        l1,l2 = [],[]

        xset = {w for w in x if not w in sw}
        yset = {w for w in y if not w in sw}

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
        return(cosine)

#################################################################

    #cosine similarity
    #between every document
    def cosineScore(self, selectedexecution = None):

        documents = []
        pointer = self.documents.find()
        for x in pointer:
            documents.append(x)
        
        #create tuple of id and content
        #create list of tuples
        contents = []
        for doc in documents:
            content = []
            for a in doc['analyzed_properties']:
                content.extend(word_tokenize(a))
            for d in doc['knowledge_domains']:
                content.extend(word_tokenize(d))
            for k in doc['keywords']:
                content.extend(word_tokenize(k))
            for p in doc['purposes']:
                content.extend(word_tokenize(p))
            content.extend(doc['method'])
            for t in doc['techniques']:
                content.extend(word_tokenize(t))
            content.extend(word_tokenize(doc['title']))
            content.extend(word_tokenize(doc['description']))
            content.append(doc['test_location'])
            for mat in doc['materials']:
                content.extend(word_tokenize(mat['description']))
            content.extend(word_tokenize(doc['output_description']))
            for section in doc['document_section']:
                for x in section['corpus']:
                    content.extend(word_tokenize(x))
            for i in content:
                if not type(i) == type('2'):
                    print('not str')
            
            content = set(content)
            contents.append((str(doc['_id']),content))
        
        #pair of documents and cosine distance bewtween them
        read = []
        scores = {}
        for doc1 in contents:
            for doc2 in contents:
                if (doc1[0],doc2[0]) not in read and (doc2[0],doc1[0]) not in read:
                    read.append((doc1[0],doc2[0]))
                    score = self.cosdist(doc1[1],doc2[1])
                    scores[(doc1[0],doc2[0])] = score
        
        #get cosine between executions
        #using associated document
        executions = []
        pointer = self.executions.find()
        for x in pointer:
            executions.append(x)

        executionCosine = []
        read = []
        for i in executions:
            for j in executions:
                if not i['_id'] == j['_id'] and (i['_id'],j['_id']) not in read and (j['_id'],i['_id']) not in read:
                    
                    read.append((i['_id'],j['_id']))
                    if (str(i['exp_proto_docu_id']),str(j['exp_proto_docu_id'])) in scores.keys():
                        executionCosine.append((str(i['_id']),str(j['_id']),scores[(str(i['exp_proto_docu_id']),str(j['exp_proto_docu_id']))]))
                    elif (str(j['exp_proto_docu_id']),str(i['exp_proto_docu_id'])) in scores.keys():
                        executionCosine.append((str(i['_id']),str(j['_id']),scores[(str(j['exp_proto_docu_id']),str(i['exp_proto_docu_id']))]))

        filtered = []
        if selectedexecution:
            selected = str(selectedexecution)
            for x in executionCosine:
                if selected in x:
                    filtered.append(x)
            executionCosine = filtered.copy()

        return(executionCosine)
        
###################################################################

    #similarity score
    # io elements and social elements.
    # one to one correspondance
    def ioSS(self, selectedexecution = None, alfa = 0.5, beta = 0.5):

        #this returns a matrix with scores
        #for socials and ios
        #for a single user id
        #([taverskyscores],[nominal])

        executions = []
        pointer = self.executions.find()
        for x in pointer:
            executions.append(x)
        
        documents = []
        pointer = self.documents.find()
        for x in pointer:
            documents.append(x)

        #get likes of the user IO elements
        iolikes = self.userLikes(3)
        # for x in iolikes:
        #     print(x)
        
        #get likes for the user social elements
        #authors
        authorlikes = self.userLikes(1)
        # if(len(authorlikes)==0):
        #     print('no likes')
        # else:
        #     print(authorlikes)
        
        #institutions
        instlikes = self.userLikes(4)
        # if(len(instlikes) == 0):
        #     print('no')
        # else:
        #     print(instlikes)
        
        #projects
        projlikes = self.userLikes(5)
        # if(len(projlikes) == 0):
        #     print('no p')
        # else:
        #     print(projlikes)
        
        #filter by IO elements
        ioelements = []
        executionsio = []

        for execution in executions:
            for p in execution['procedures']:
                if 'inputs' in p:
                    if 'ids' in p['inputs']:
                        for element in p['inputs']['ids']:
                            ioelements.append(element)
                    if 'dsets' in p['inputs']:
                        for element in p['inputs']['dsets']:
                            ioelements.append(element['dataset_id'])
                if 'outputs' in p:
                    if 'ids' in p['outputs']:
                        for element in p['outputs']['ids']:
                            ioelements.append(element)
                    if 'dsets' in p['outputs']:
                        for element in p['outputs']['dsets']:
                            ioelements.append(element['dataset_id'])
                executionsio.append((execution['_id'],list(set(ioelements))))
                ioelements = []
        
        grouped = {}
        #remove repeated IO elements
        for execution in executionsio:
            if execution[0] not in grouped.keys():
                grouped[execution[0]] = execution[1]
            else:
                grouped[execution[0]].extend(execution[1])
        
        groupednorep = {}
        for k in grouped.keys():
            groupednorep[k] = (set(grouped[k]))
        # print(groupednorep)
        #intersection of common elements between executions
        #returns list of tuples
        #(id1,id2,intersection set,id1-id2,id2-id1)
        read = []
        commonelements = []
        for key, item in groupednorep.items():
            for key1, item1 in groupednorep.items():
                if not key == key1:
                    if (key,key1) not in read and (key1,key) not in read:
                        inter = item.intersection(item1)
                        contadorcito = 0
                        for like in iolikes:
                            if like[0] == str(key) or like[0] == str(key1):
                                if like[2] in inter:
                                    contadorcito += 1
                        
                        likemodifier = 1 + self.sigmoid(contadorcito-5)

                        commonelements.append((key,key1,inter,item.difference(item1),item1.difference(item),likemodifier))
                        read.append((key,key1))
        
        # for x in commonelements:
        #     print(str(x[0]),str(x[1]),len(x[2]),len(x[3]),len(x[4]),x[5])



        #scores for io elements
        #using Tversky
        #returns tuples ((id1,id2),score,weighted_score)
        tscore = []
        for pair in commonelements:

            n = len(pair[2])
            d = len(pair[2]) + alfa*len(pair[3]) + beta*len(pair[4])

            score = n/d
            tscore.append(((str(pair[0]),str(pair[1])),score,score*pair[5]))

  

        #retrieve authors, project, university
        #get document id for execution
        #tuple (exec_id,docu_id)
        docids = []
        for execution in executions:
            docids.append((str(execution['_id']),str(execution['exp_proto_docu_id'])))

        #retrieve social elements from document
        #tuple (execution id,[authors],[projects],[institutions])
        socialelements = []
        institutions = []
        authors = []
        projects = []
        for execution in docids:
            for document in documents:
                if str(document['_id']) == str(execution[1]):

                    for auth in document['authors']:
                        authors.append(str(auth['author_id']))
                    for proj in document['project']:
                        projects.append(str(proj['project_id']))
                    for inst in document['institution']:
                        institutions.append(str(inst['institution_id']))

                    socialelements.append( (
                        execution[0],
                        authors,
                        projects,
                        institutions
                    ) )
                    authors = []
                    projects = []
                    institutions = []
        
        #find common, and differences between sets
        #returns list of tuples
        #((id1,id2),sum of commons,sum of differences 1 - 2, sum of differences 2 - 1)
        commonsocials = []
        read = []
        for i in socialelements:
            for j in socialelements:
                if not i[0] == j[0] and (i[0],j[0]) not in read and (j[0],i[0]) not in read:
                    read.append((i[0],j[0]))
                    commonauthors = (
                        len(set(i[1]).intersection(j[1])),
                        len(set(i[1])),
                        len(set(j[1]))
                    )
                    commonprojs = (
                        len(set(i[2]).intersection(j[2])),
                        len(set(i[2])),
                        len(set(j[2]))
                    )
                    commoninst = (
                        len(set(i[3]).intersection(j[3])),
                        len(set(i[3])),
                        len(set(j[3]))
                    )
                    totaloperations = (
                        commonauthors[0] + commonprojs[0] + commoninst[0],
                        commonauthors[1] + commonprojs[1] + commoninst[1],
                        commonauthors[2] + commonprojs[2] + commoninst[2]
                    )
                    commonsocials.append((
                        (i[0],j[0]),
                        totaloperations
                    ))
    
        
        #nominal score
        #return tuple
        #((id1,id2),score)
        nominal = []
        for pair in commonsocials:

            p = pair[1][1] + pair[1][2]
            m = pair[1][0]
            
            score = (p-m)/p
            nominal.append((pair[0], 1 - score))

        #filter relations with certain executions
        filterednominal, filteredt = [], []

        if selectedexecution:
            selected = str(selectedexecution)
            for element in nominal:
                if selected in element[0]:
                    filterednominal.append(element)
            for element in tscore:
                if selected in element[0]:
                    filteredt.append(element)
            tscore = filteredt.copy()
            nominal = filterednominal.copy()

        return (tscore,nominal)

################################################################









###########################################################3
recommendation = Recommendation(sys.argv[1])
x = recommendation.ioSS(selectedexecution=sys.argv[2])
# y = recommendation.cosineScore(selectedexecution=sys.argv[2])
y = recommendation.cosineScore()
for t in y:
    print(t)
# x = recommendation.ioSS()
# pointer = recommendation.executions.find()

# tv = sorted(x[0],key = lambda y : y[1],reverse= True)
# nom = sorted(x[1],key = lambda y : y[1],reverse= True)
# for i in tv:
#     print(i)
# print('---------------')
# for i in nom:
#     print(i)
# for x in range(-10,10):
#     print(recommendation.sigmoid(x))
# read = []
# res = []

# for t in tv:
#     for n in nom:
#         if t[0] == n[0] and n[0] not in read:
#             if not t[0][0] == str(sys.argv[2]):
#                 recid = t[0][0]
#             else:
#                 recid = t[0][1]

#             res.append((
#                 recid,
#                 t[1]+n[1]
#             ))
#             read.append((t[0],n[0]))

# res = sorted(res,key = lambda y  : y[1], reverse = True)

# returnlist = []

# for rec in res:
#     returnlist.append(rec[0])

# print(returnlist)
print([1,2,3])