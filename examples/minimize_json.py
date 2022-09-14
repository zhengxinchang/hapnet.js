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
            "minTime": item["minTime"],
            "subset": item["subset"],

        }
        minidat['edges'].append(tmpedge)

    print(json.dumps(minidat))
