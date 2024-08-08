from ete3 import Tree
import json
import sys


def newick_to_json(newick_string):
    # Parse the Newick string
    tree = Tree(newick_string, format=1)

    nodes = []
    links = []
    node_id = 0

    def traverse(node):
        nonlocal node_id
        current_id = node_id
        node_id += 1
        # print(node.dist)
        # Add node to nodes list

        value_block = None,
        if node.name == '':
            value_block = [
                {
                    "number": 100,
                    "category": "Virtual"
                }
            ]
        else:
            value_block = [
                {
                    "number": 100,
                    "category": "Real"
                }
            ]

        nodes.append({"id": current_id,
                      "name": node.name or f"Node_{current_id}",
                      "radius": 0.1,
                      "values": value_block,
                      "meta": {
                          "panel": {},
                          "hover": {

                          }
                      }})

        # Process children
        for child in node.children:
            child_id = traverse(child)

            # Add link to links list
            links.append({"source": current_id,
                          "target": child_id,
                          "distance": child.dist,
                          "meta": {
                              "panel": {},
                              "hover": {
                                  "distance": child.dist
                              }
                          }
                          })

        return current_id

    # Start traversal from the root
    traverse(tree)

    # Create the final JSON structure
    result = {
        "nodes": nodes,
        "edges": links
    }

    return json.dumps(result, indent=2)


# Example usage
with open(sys.argv[1]) as inf:

    newick_string = inf.read()
json_result = newick_to_json(newick_string)
print(json_result)
