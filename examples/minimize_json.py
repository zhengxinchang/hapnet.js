import json
import sys

with open(sys.argv[1]) as fj:
    dat = json.load(fj)

    minidat = {
        "nodes": [],
        "edges": []
    }

    for item in dat['nodes']:

        tmpvalue = []
        for d in item["pieChart"]:
            tmpvalue.append(
                {
                    "number": d["percent"],
                    "category": d["color"]
                }
            )
            # map(d=>{ return d.percent})

        tmpnode = {
            "id": item["id"],
            "name": 'name_' + item["id"],
            "radius": item["radius"],
            "values": tmpvalue,
            "meta": {
                "panel":{
                    "SNPs":item['SNPs'],
                    "Virus":item['Virus'],
                    "degree":{
                        "total_degree":item['total_degree'],
                        "in_degree":item['in_degree'],
                        "out_degree":item['out_degree'],
                    }
                },
                "hover":{
                    "date":item['date'],
                    "group":item['group'],
                    "jump":item['jump'],

                    "entropy":item['entropy'],
                }
            }
        }
        minidat['nodes'].append(tmpnode)

    for item in dat['links']:
        # tmpvalue = []
        # for d in item["pieChart"]:
        #     tmpvalue.append(d["percent"])
        #     # map(d=>{ return d.percent})
        tmpedge = {
            "source": item["source"],
            "target":   item["target"],
            "distance": item["distance"],
            "meta":{
                "panel":{
                    "minTime": item["minTime"]
                },
                "hover":{
                    "subset": item["subset"]
                }
            }
            
            
        }
        minidat['edges'].append(tmpedge)

    print(json.dumps(minidat,indent=4))
